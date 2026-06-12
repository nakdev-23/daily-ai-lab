import { redirect } from "next/navigation"
import { cache } from "react"
import { createClient, getAuthUser } from "./supabase/server"

export type Role = "user" | "admin"
export type Plan = "free" | "pro"

export type SessionProfile = {
  id: string
  displayName: string
  /** Raw Google photo URL from OAuth (null if none). */
  avatarUrl: string | null
  /** Chosen Riri avatar key (e.g. "cool"), null = use the Google photo / initial. */
  avatarKey: string | null
  role: Role
  plan: Plan
}

/** Resolve the avatar to actually display: chosen Riri avatar wins, else Google photo. */
export function avatarUrlFor(p: { avatarKey: string | null; avatarUrl: string | null }): string | null {
  return p.avatarKey ? `/assets/daily-ai-lab/avatars/avatar-${p.avatarKey}.png` : p.avatarUrl
}

/** Current signed-in profile. Returns null if not signed in. Memoized per request. */
export const getProfile = cache(async (): Promise<SessionProfile | null> => {
  const user = await getAuthUser()
  if (!user) return null
  const supabase = await createClient()

  // Profile (role/identity) and subscription (plan) live in separate tables.
  const [{ data: p }, { data: sub }] = await Promise.all([
    // select("*") so this keeps working before migration 016 adds avatar_key.
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("plan, expires_at").eq("user_id", user.id).maybeSingle(),
  ])

  // A subscription only counts as "pro" while it hasn't expired.
  const active = sub?.plan === "pro" && (!sub.expires_at || new Date(sub.expires_at).getTime() > Date.now())
  const role: Role = (p?.role as Role) ?? "user"
  // Admins always get the Pro package (no subscription needed).
  const plan: Plan = active || role === "admin" ? "pro" : "free"

  return {
    id: user.id,
    displayName: p?.display_name ?? "นักเรียน",
    avatarUrl: p?.avatar_url ?? null,
    avatarKey: (p?.avatar_key as string) ?? null,
    role,
    plan,
  }
})

export function isAdmin(profile: SessionProfile | null): boolean {
  return profile?.role === "admin"
}

export function isPro(profile: SessionProfile | null): boolean {
  // Admins implicitly have full access.
  return profile?.plan === "pro" || profile?.role === "admin"
}

/** Guard: any signed-in user. Redirects guests to login (preserving where they were headed). */
export async function requireUser(redirectTo?: string): Promise<SessionProfile> {
  const profile = await getProfile()
  if (!profile) {
    redirect(redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login")
  }
  return profile
}

/** Guard for admin-only pages. Redirects guests to login and non-admins to the app. */
export async function requireAdmin(): Promise<SessionProfile> {
  const profile = await getProfile()
  if (!profile) redirect("/login")
  if (profile.role !== "admin") redirect("/daily-learn")
  return profile
}

/** Guard for Pro-only content. Sends guests to login and Free users to the upgrade page. */
export async function requirePro(): Promise<SessionProfile> {
  const profile = await getProfile()
  if (!profile) redirect("/login")
  if (!isPro(profile)) redirect("/upgrade")
  return profile
}
