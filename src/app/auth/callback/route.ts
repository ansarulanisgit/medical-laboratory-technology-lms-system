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
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch {
      // Supabase connection or DNS resolution fallback
    }
  }

  // Return user to login modal if code exchange failed
  return NextResponse.redirect(`${origin}/?auth=login&error=auth_callback_failed`);
}
