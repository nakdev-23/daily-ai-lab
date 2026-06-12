"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe"
import { periodEnd } from "@/lib/billing"
import { getLang, makeT } from "@/lib/i18n"

export type SettingsResult = { ok: boolean; message: string } | null

/** Persist the user's display name to profiles (used by the leaderboard & shell). */
export async function updateDisplayName(_prev: SettingsResult, formData: FormData): Promise<SettingsResult> {
  const [profile, lang] = await Promise.all([requireUser(), getLang()])
  const t = makeT(lang)
  const name = String(formData.get("display_name") ?? "").trim()
  if (name.length < 1 || name.length > 40) {
    return { ok: false, message: t("Name must be 1–40 characters") }
  }
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", profile.id)
  if (error) return { ok: false, message: t("Couldn't save — try again") }
  revalidatePath("/settings")
  revalidatePath("/profile")
  return { ok: true, message: t("Name saved") }
}

/**
 * Cancel the current Pro subscription and switch the user back to the Free plan.
 * Goes through the cancel_subscription() RPC (security-definer) because users
 * have no direct UPDATE on subscriptions — the RPC only ever downgrades to Free.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- useActionState requires the (prevState, formData) shape
export async function cancelSubscription(_prev: SettingsResult, _formData: FormData): Promise<SettingsResult> {
  const [profile, lang] = await Promise.all([requireUser(), getLang()])
  const t = makeT(lang)
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", profile.id)
    .maybeSingle()

  // Stripe-billed subscription → cancel at period end. The user keeps Pro until
  // the current billing period ends (no immediate loss, no further charges).
  if (sub?.stripe_subscription_id && stripe) {
    try {
      const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true })
      const until = periodEnd(updated)
      // Keep plan = 'pro' but stamp expires_at so access ends exactly at period
      // end (getProfile treats an expired Pro as Free). Service-role: users have
      // no UPDATE on subscriptions by design.
      const admin = createAdminClient()
      await admin
        .from("subscriptions")
        .update({ expires_at: until ? new Date(until * 1000).toISOString() : null, updated_at: new Date().toISOString() })
        .eq("user_id", profile.id)
      revalidatePath("/settings")
      revalidatePath("/profile")
      revalidatePath("/", "layout")
      return { ok: true, message: t("Cancelled — you'll keep Pro until your billing period ends") }
    } catch {
      return { ok: false, message: t("Couldn't cancel — try again") }
    }
  }

  // No Stripe subscription (admin/manual Pro) → downgrade immediately.
  const { error } = await supabase.rpc("cancel_subscription")
  if (error) return { ok: false, message: t("Couldn't cancel — try again") }
  revalidatePath("/settings")
  revalidatePath("/profile")
  revalidatePath("/", "layout")
  return { ok: true, message: t("Your subscription was cancelled") }
}

/**
 * Undo a scheduled cancellation before the period ends: turns auto-renew back
 * on in Stripe and clears the local expiry, so billing continues as before.
 * Only meaningful while cancel_at_period_end is set (the UI gates on that).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- useActionState requires the (prevState, formData) shape
export async function resumeSubscription(_prev: SettingsResult, _formData: FormData): Promise<SettingsResult> {
  const [profile, lang] = await Promise.all([requireUser(), getLang()])
  const t = makeT(lang)
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", profile.id)
    .maybeSingle()
  if (!sub?.stripe_subscription_id || !stripe) {
    return { ok: false, message: t("Couldn't resume — try again") }
  }

  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: false })
  } catch {
    return { ok: false, message: t("Couldn't resume — try again") }
  }

  // Auto-renew is back on — drop the scheduled expiry so Pro doesn't lapse.
  const admin = createAdminClient()
  await admin
    .from("subscriptions")
    .update({ expires_at: null, updated_at: new Date().toISOString() })
    .eq("user_id", profile.id)

  revalidatePath("/settings")
  revalidatePath("/profile")
  revalidatePath("/", "layout")
  return { ok: true, message: t("Auto-renew is back on — your Pro continues as usual") }
}

const AVATAR_KEYS = ["heart", "celebrate", "thumbsup", "graduate", "wave", "cool", "read", "think", "yawn", "sad", "sleep"]

/**
 * Persist the chosen Riri avatar to the profile so it shows everywhere (sidebar,
 * profile, leaderboard) and across devices. Pass null to clear back to the
 * Google photo. RLS already lets a user update their own profile row.
 */
export async function updateAvatar(key: string | null): Promise<void> {
  const profile = await requireUser()
  const value = key && AVATAR_KEYS.includes(key) ? key : null
  const supabase = await createClient()
  await supabase.from("profiles").update({ avatar_key: value }).eq("id", profile.id)
  revalidatePath("/settings")
  revalidatePath("/profile")
  revalidatePath("/leaderboard")
  revalidatePath("/", "layout")
}
