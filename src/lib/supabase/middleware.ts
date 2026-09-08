import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { normalizeSupabaseUrl } from "./client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  const pathname = request.nextUrl.pathname;

  const isProtectedPath =
    pathname.startsWith("/student") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/super-admin");

  const isAuthPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  // Check cookies
  const allCookies = request.cookies.getAll();
  const hasSupabaseCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );
  const hasLocalSession = allCookies.some(
    (c) => c.name === "labtutor-session" && c.value === "true"
  );
  const hasAnyAuth = hasSupabaseCookie || hasLocalSession;

  // 1. If public route and no auth cookie present, return immediately
  if (!isProtectedPath && !isAuthPath && !hasAnyAuth) {
    return supabaseResponse;
  }

  // 2. If protected route and definitely no auth cookie or local session, redirect to login
  if (isProtectedPath && !hasAnyAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 3. If Supabase credentials are placeholders or not configured, allow local session
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    if (hasLocalSession && isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 4. Initialize Supabase SSR client
  let user = null;
  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    // Supabase network / connection issue
  }

  const isAuthenticated = !!user || hasLocalSession;

  if (!isAuthenticated && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated) {
    // If authenticated user is on login/register page, redirect to unified dashboard
    if (isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }

    // Unified single dashboard architecture: redirect legacy admin routes to /student
    if (pathname.startsWith("/super-admin") || pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
