import { createClient } from "@supabase/supabase-js";

/**
 * STRICTLY SERVER-ONLY SERVICE-ROLE CLIENT
 * Never import or execute this on the client browser.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY ERROR: createAdminClient called in client browser.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
