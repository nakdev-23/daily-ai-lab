import { getProfile, type Role, type Plan } from "./auth"
import { createAdminClient } from "./supabase/admin"

export type AppUser = {
  id: string
  display_name: string
  role: Role
  created_at: string
  // Subscription snapshot (joined from the subscriptions table).
  plan: Plan
  expiresAt: string | null      // when Pro access ends (null = no expiry / free)
  subscribedAt: string | null   // subscriptions row created_at
  updatedAt: string | null      // last plan change
  viaStripe: boolean            // billed through Stripe (has stripe_subscription_id)
}

type SubRow = {
  user_id: string
  plan: string
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
  stripe_subscription_id: string | null
}

/**
 * All users with their subscription snapshot, for the admin Users page.
 * Uses the service-role client because subscriptions RLS only lets a user read
 * their OWN row — admins need every row. Guarded by an admin check.
 */
export async function getUsers(): Promise<AppUser[]> {
  const profile = await getProfile()
  if (profile?.role !== "admin") return []
  const supabase = createAdminClient()

  const [{ data: profiles }, { data: subs }] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role, created_at").order("created_at", { ascending: true }),
    supabase.from("subscriptions").select("user_id, plan, expires_at, created_at, updated_at, stripe_subscription_id"),
  ])

  const subByUser = new Map<string, SubRow>()
  for (const s of (subs ?? []) as SubRow[]) subByUser.set(s.user_id, s)

  const now = Date.now()
  return ((profiles ?? []) as Array<{ id: string; display_name: string | null; role: Role; created_at: string }>).map((p) => {
    const s = subByUser.get(p.id)
    // A subscription only counts as Pro while it hasn't expired (mirror auth.ts).
    const active = s?.plan === "pro" && (!s.expires_at || new Date(s.expires_at).getTime() > now)
    const plan: Plan = active || p.role === "admin" ? "pro" : "free"
    return {
      id: p.id,
      display_name: p.display_name ?? "นักเรียน",
      role: p.role,
      created_at: p.created_at,
      plan,
      expiresAt: s?.expires_at ?? null,
      subscribedAt: s?.created_at ?? null,
      updatedAt: s?.updated_at ?? null,
      viaStripe: !!s?.stripe_subscription_id,
    }
  })
}

export type SubHistoryEntry = {
  id: string
  action: string
  actor: string | null
  details: Record<string, unknown> | null
  created_at: string
}

/**
 * Subscription/plan change history for one user — audit entries tagged with
 * this user as the target. Admin only.
 */
export async function getUserSubHistory(userId: string): Promise<SubHistoryEntry[]> {
  const profile = await getProfile()
  if (profile?.role !== "admin") return []
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, actor_name, details, created_at")
    .eq("details->>targetId", userId)
    .order("created_at", { ascending: false })
    .limit(50)
  return ((data ?? []) as Array<{ id: string; action: string; actor_name: string | null; details: Record<string, unknown> | null; created_at: string }>).map((r) => ({
    id: r.id, action: r.action, actor: r.actor_name, details: r.details, created_at: r.created_at,
  }))
}
