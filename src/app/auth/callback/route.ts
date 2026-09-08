import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/student";
  const verified = searchParams.get("verified") || searchParams.get("email_verified");
  const email = searchParams.get("email");

  // Handle direct verification link (Local/Development or Tokenized Link)
  if (verified === "true") {
    const target = new URL("/", origin);
    target.searchParams.set("auth", "login");
    target.searchParams.set("verified", "true");
    if (email) target.searchParams.set("email", email);
    return NextResponse.redirect(target.toString());
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user) {
        try {
          const { createAdminClient } = await import("@/lib/supabase/admin");
          const admin = createAdminClient();
          const user = data.user;
          const meta = user.user_metadata || {};

          await admin.from("profiles").upsert(
            {
              id: user.id,
              email: user.email,
              full_name: meta.full_name || user.email?.split("@")[0] || "Medical Technologist Student",
              phone: meta.phone || null,
              role: meta.role || "STUDENT",
              is_active: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          const prog = meta.program === "DIPLOMA" ? "DIPLOMA" : "BSC";
          const yr = parseInt(meta.academic_year, 10) || 1;

          const { data: existingStudent } = await admin
            .from("student_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!existingStudent) {
            await admin.from("student_profiles").insert({
              user_id: user.id,
              program_level: prog,
              academic_year: yr,
              enrollment_year: new Date().getFullYear(),
              student_id_number: meta.student_id_number || null,
              institution_name: meta.institution || null,
            });
          }
        } catch (syncErr) {
          console.error("Profile sync error in auth callback:", syncErr);
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch {
      // Supabase connection or DNS resolution fallback
    }
  }

  // Return user to login modal if code exchange failed
  return NextResponse.redirect(`${origin}/?auth=login&error=auth_callback_failed`);
}
