import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { normalizeSupabaseUrl } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  // 1. Clear session cookie
  response.cookies.set("labtutor-session", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
  });

  // 2. Clear all Supabase authentication cookies
  const allCookies = request.cookies.getAll();
  allCookies.forEach((c) => {
    if (c.name.startsWith("sb-") || c.name.includes("auth-token") || c.name === "labtutor-session") {
      response.cookies.set(c.name, "", {
        path: "/",
        expires: new Date(0),
        maxAge: 0,
        sameSite: "lax",
      });
    }
  });

  // 3. Inform Supabase if credentials are valid
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder-project")) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });
      await supabase.auth.signOut();
    } catch {
      // ignore network errors on signOut
    }
  }

  return response;
}
