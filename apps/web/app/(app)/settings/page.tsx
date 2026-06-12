import { redirect } from "next/navigation"
import { getLang } from "@/lib/i18n"
import { createClient, getAuthUser } from "@/lib/supabase/server"
import { getSystemSettings } from "@/lib/system-settings"
import { getProfile, isPro } from "@/lib/auth"
import { confirmCheckoutSession, getProSubscriptionInfo } from "@/lib/billing"
import SettingsClient from "./_settings-client"

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  const [lang, settings, profile, user] = await Promise.all([getLang(), getSystemSettings(), getProfile(), getAuthUser()])

  // Returning from Stripe Checkout: confirm payment + grant Pro, then clean the
  // URL so a refresh doesn't reprocess (and the plan is re-read as Pro).
  if (session_id && user) {
    await confirmCheckoutSession(session_id, user.id)
    redirect("/settings#subscription")
  }

  let displayName = "นักเรียน"
  let email = ""
  let avatar: string | null = null

  if (user) {
    const meta = user.user_metadata ?? {}
    email = user.email ?? email
    // Prefer the saved profile display name over the Google metadata.
    displayName = profile?.displayName ?? (meta.full_name as string) ?? (meta.name as string) ?? displayName
    avatar = profile?.avatarUrl ?? (meta.avatar_url as string) ?? (meta.picture as string) ?? avatar
  }

  // For Pro users, load billing details (subscribed date, next bill, cancellation).
  let subscription: { since: string; until: string; cancelAtPeriodEnd: boolean } | null = null
  if (profile && isPro(profile)) {
    const supabase = await createClient()
    const { data: row } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", profile.id)
      .maybeSingle()
    const info = await getProSubscriptionInfo(row?.stripe_subscription_id ?? null)
    if (info) {
      const fmt = (ts: number) =>
        new Date(ts * 1000).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Bangkok",
        })
      subscription = { since: fmt(info.since), until: info.until > 0 ? fmt(info.until) : "", cancelAtPeriodEnd: info.cancelAtPeriodEnd }
    }
  }

  return (
    <SettingsClient
      lang={lang}
      displayName={displayName}
      email={email}
      avatar={avatar}
      proPrice={settings.proPriceMonth}
      plan={profile?.plan ?? "free"}
      subscription={subscription}
      avatarKey={profile?.avatarKey ?? null}
    />
  )
}
