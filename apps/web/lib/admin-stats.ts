import { createClient } from "./supabase/server"

export type AdminOverview = {
  totalUsers: number
  activeToday: number
  lessonsToday: number
  lessonsTotal: number
  proCount: number
  mrr: number
  newUsers7d: number
  prevUsers7d: number
  signups7d: { d: string; n: number }[]
  popular: { courseId: string; done: number }[]
}

/**
 * Aggregated platform stats for the admin overview, via the get_admin_overview
 * RPC (migration 013 — security definer, admin-only). Returns null when the
 * RPC is missing or the caller isn't an admin, so the page can degrade
 * gracefully instead of crashing.
 */
export async function getAdminOverview(): Promise<AdminOverview | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_admin_overview")
  if (error || !data || typeof data !== "object") return null
  const r = data as Record<string, unknown>
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0)
  return {
    totalUsers: num(r.total_users),
    activeToday: num(r.active_today),
    lessonsToday: num(r.lessons_today),
    lessonsTotal: num(r.lessons_total),
    proCount: num(r.pro_count),
    mrr: num(r.mrr),
    newUsers7d: num(r.new_users_7d),
    prevUsers7d: num(r.prev_users_7d),
    signups7d: Array.isArray(r.signups_7d)
      ? (r.signups_7d as { d?: string; n?: number }[]).map((s) => ({ d: String(s.d ?? ""), n: num(s.n) }))
      : [],
    popular: Array.isArray(r.popular)
      ? (r.popular as { course_id?: string; done?: number }[]).map((p) => ({ courseId: String(p.course_id ?? ""), done: num(p.done) }))
      : [],
  }
}
