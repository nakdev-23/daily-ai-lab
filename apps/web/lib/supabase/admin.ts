import { createClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client — bypasses RLS. Use ONLY in trusted server code
 * with no user session (e.g. the Stripe webhook, which has no cookies). Never
 * import this into client components or expose the key to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error("Supabase service role not configured — set SUPABASE_SERVICE_ROLE_KEY")
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
