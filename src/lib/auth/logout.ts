import { createClient } from "@/lib/supabase/client";

/**
 * Universal sign-out utility that cleanly wipes:
 * 1. Server & client auth cookies (labtutor-session, sb-*-auth-token)
 * 2. Supabase client session state
 * 3. LocalStorage & SessionStorage cached profile & token state
 * 4. Redirects to home page (/) via window.location for full state reset
 */
export async function handleSignOut(): Promise<void> {
  // 1. Call server logout API to expire HTTP cookies
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // ignore network errors
  }

  // 2. Clear client-side document cookies directly
  if (typeof document !== "undefined") {
    try {
      document.cookie = "labtutor-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = (eqPos > -1 ? cookie.substring(0, eqPos) : cookie).trim();
        if (name.startsWith("sb-") || name === "labtutor-session") {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
          document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Supabase Auth signOut on browser client
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  // 4. Wipe localStorage auth / profile caches
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem("labtutor_academic_profile_v2");
      localStorage.removeItem("labtutor_academic_profile_v3");
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("sb-") || key.includes("supabase.auth"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }

  // 5. Hard redirect to home page (/) for fresh state
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
