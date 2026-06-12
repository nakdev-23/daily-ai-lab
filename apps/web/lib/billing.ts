import "server-only"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Verify a returning Checkout Session belongs to this user and was actually
 * paid, then grant Pro. This mirrors the webhook so the happy path works in
 * local dev without the Stripe CLI. Safe + idempotent: it upgrades only when
 * Stripe confirms payment for THIS user, and uses the service-role client
 * (subscriptions has no user UPDATE policy by design).
 */
export async function confirmCheckoutSession(sessionId: string, userId: string): Promise<boolean> {
  if (!stripe) return false

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return false
  }

  // Must be this user's session and genuinely paid (card pays synchronously;
  // async methods like PromptPay may still be pending — the webhook covers those).
  if (session.client_reference_id !== userId) return false
  if (session.payment_status !== "paid" && session.status !== "complete") return false

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: "pro",
      // Clear any expiry left from a previous cancel-at-period-end (re-subscribe).
      expires_at: null,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  return !error
}

/**
 * Live details for the Pro section in Settings: when the user subscribed, the
 * next billing date, and whether it's set to cancel at period end. Returns null
 * when there's no Stripe-billed subscription (e.g. admin/manual Pro).
 */
export async function getProSubscriptionInfo(
  stripeSubscriptionId: string | null,
): Promise<{ since: number; until: number; cancelAtPeriodEnd: boolean } | null> {
  if (!stripe || !stripeSubscriptionId) return null
  try {
    const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId)
    return { since: sub.created, until: periodEnd(sub), cancelAtPeriodEnd: sub.cancel_at_period_end }
  } catch {
    return null
  }
}

/** current_period_end moved onto subscription items in newer API versions —
 *  read the top level first, then fall back to the first item. */
export function periodEnd(sub: unknown): number {
  const s = sub as { current_period_end?: number; items?: { data?: Array<{ current_period_end?: number }> } }
  return s.current_period_end ?? s.items?.data?.[0]?.current_period_end ?? 0
}
