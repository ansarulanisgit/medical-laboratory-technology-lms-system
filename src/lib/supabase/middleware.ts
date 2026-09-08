import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { normalizeSupabaseUrl } from "./client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  const isProtectedPath =
    pathname.startsWith("/student") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/super-admin");

  const isAuthPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  // 1. Fast path: If public route, exit immediately with zero latency
  if (!isProtectedPath && !isAuthPath) {
    return supabaseResponse;
  }

  // 2. Fast cookie inspect
  const allCookies = request.cookies.getAll();
  const hasLocalSession = allCookies.some(
    (c) => c.name === "labtutor-session" && c.value === "true"
  );
  const hasSupabaseCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );

  // 3. Fast path: local session active (zero network overhead)
  if (hasLocalSession) {
    if (isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/super-admin") || pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 4. If protected path and definitely no auth cookies, redirect to /login immediately
  if (isProtectedPath && !hasSupabaseCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 5. If hasSupabaseCookie, query Supabase SSR with a strict timeout to prevent network freezes
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (hasSupabaseCookie && supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder-project")) {
    let user = null;
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
      });

      const authPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null } }>((res) =>
        setTimeout(() => res({ data: { user: null } }), 1200)
      );
      const { data } = await Promise.race([authPromise, timeoutPromise]);
      user = data?.user || null;
    } catch {
      // network timeout or offline
    }

    if (user) {
      if (isAuthPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/student";
        return NextResponse.redirect(url);
      }
      if (pathname.startsWith("/super-admin") || pathname.startsWith("/admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/student";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }
  }

  // 6. If not authenticated and attempting to access protected route
  if (isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
