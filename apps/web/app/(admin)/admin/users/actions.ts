"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin, type Role } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { getUserSubHistory, type SubHistoryEntry } from "@/lib/users"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe"

export async function changeRole(formData: FormData) {
  // Always re-check on the server — never trust the client.
  const admin = await requireAdmin()

  const userId = String(formData.get("userId") ?? "")
  const role = String(formData.get("role") ?? "") as Role
  if (!userId || (role !== "user" && role !== "admin")) return
  // Prevent admins from changing their own role (avoids self-lockout).
  if (userId === admin?.id) return

  const supabase = await createClient()
  const { data: before } = await supabase.from("profiles").select("display_name, role").eq("id", userId).single()
  await supabase.from("profiles").update({ role }).eq("id", userId)
  await recordAudit("role.change", { targetId: userId, target: before?.display_name ?? userId, from: before?.role, to: role })

  revalidatePath("/admin/users")
  revalidatePath("/admin")
}

export type PlanResult = { ok: boolean; message: string } | null

/**
 * Admin override of a user's plan. Grants/extends Pro (with optional expiry) or
 * cancels back to Free. If the user is billed through Stripe and we're
 * downgrading, the live Stripe subscription is cancelled too so they aren't
 * charged again. Service-role client because subscriptions has no cross-user
 * write policy by design.
 */
export async function setUserPlan(_prev: PlanResult, formData: FormData): Promise<PlanResult> {
  const admin = await requireAdmin()
  const userId = String(formData.get("userId") ?? "")
  const plan = String(formData.get("plan") ?? "") as "free" | "pro"
  const expiresRaw = String(formData.get("expiresAt") ?? "").trim() // "YYYY-MM-DD" or ""
  if (!userId || (plan !== "free" && plan !== "pro")) return { ok: false, message: "ข้อมูลไม่ถูกต้อง" }

  const db = createAdminClient()
  const { data: cur } = await db
    .from("subscriptions")
    .select("plan, expires_at, stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle()
  const { data: prof } = await db.from("profiles").select("display_name").eq("id", userId).single()
  const targetName = prof?.display_name ?? userId

  // Pro expiry: end of the chosen Bangkok day, or null = no expiry.
  let expiresAt: string | null = null
  if (plan === "pro" && expiresRaw) {
    const d = new Date(`${expiresRaw}T23:59:59+07:00`)
    if (isNaN(d.getTime())) return { ok: false, message: "วันหมดอายุไม่ถูกต้อง" }
    expiresAt = d.toISOString()
  }

  // Downgrading a Stripe-billed sub → cancel in Stripe to stop future charges.
  if (plan === "free" && cur?.stripe_subscription_id && stripe) {
    try { await stripe.subscriptions.cancel(cur.stripe_subscription_id) } catch { /* already gone */ }
  }

  const row: Record<string, unknown> = {
    user_id: userId,
    plan,
    expires_at: plan === "pro" ? expiresAt : null,
    updated_at: new Date().toISOString(),
  }
  // Clear the Stripe link when downgrading so the row is cleanly "manual Free".
  if (plan === "free") row.stripe_subscription_id = null

  const { error } = await db.from("subscriptions").upsert(row, { onConflict: "user_id" })
  if (error) return { ok: false, message: "บันทึกไม่สำเร็จ ลองอีกครั้ง" }

  await recordAudit("subscription.admin_change", {
    targetId: userId,
    target: targetName,
    from: cur?.plan ?? "free",
    to: plan,
    expiresAt: expiresAt,
    by: admin?.displayName ?? "admin",
  })

  revalidatePath("/admin/users")
  revalidatePath("/admin")
  revalidatePath("/", "layout")
  return { ok: true, message: plan === "pro" ? "ตั้งเป็น Pro แล้ว" : "เปลี่ยนเป็น Free แล้ว" }
}

/** Load a user's plan-change history for the manage modal. */
export async function loadUserSubHistory(userId: string): Promise<SubHistoryEntry[]> {
  await requireAdmin()
  if (!userId) return []
  return getUserSubHistory(userId)
}
