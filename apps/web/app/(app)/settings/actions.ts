"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
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
  const [, lang] = await Promise.all([requireUser(), getLang()])
  const t = makeT(lang)
  const supabase = await createClient()
  const { error } = await supabase.rpc("cancel_subscription")
  if (error) return { ok: false, message: t("Couldn't cancel — try again") }
  revalidatePath("/settings")
  revalidatePath("/profile")
  revalidatePath("/", "layout")
  return { ok: true, message: t("Your subscription was cancelled") }
}
