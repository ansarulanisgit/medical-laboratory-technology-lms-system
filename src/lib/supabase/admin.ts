import { createClient } from "@supabase/supabase-js";
import { normalizeSupabaseUrl } from "./client";

/**
 * STRICTLY SERVER-ONLY SERVICE-ROLE CLIENT
 * Never import or execute this on the client browser.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY ERROR: createAdminClient called in client browser.");
  }

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
