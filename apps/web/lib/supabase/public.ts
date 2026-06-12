import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Cookie-less anon client for PUBLIC, cacheable reads (courses, course
 * content, system settings). Because it never touches cookies it can be used
 * inside unstable_cache, letting one Supabase query serve every visitor for
 * the cache window — the main lever for staying inside the free tier's
 * 5GB/month egress. RLS still applies (anon sees published content only).
 */
export const publicClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
