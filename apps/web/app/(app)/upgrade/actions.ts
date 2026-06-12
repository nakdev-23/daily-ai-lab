"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { requireUser } from "@/lib/auth"
import { getSystemSettings } from "@/lib/system-settings"
import { createClient, getAuthUser } from "@/lib/supabase/server"
import { requireStripe } from "@/lib/stripe"

/**
 * Start a Stripe Checkout for Pro. Amount + interval come from the admin's
 * System settings (single source of truth), charged in THB. On success Stripe
 * redirects back and the webhook flips the user's plan to Pro.
 */
export async function createCheckoutSession(bill: "month" | "year"): Promise<void> {
  const profile = await requireUser()
  const [settings, user] = await Promise.all([getSystemSettings(), getAuthUser()])
  const stripe = requireStripe()

  const amount = bill === "year" ? settings.proPriceYear : settings.proPriceMonth
  const interval = bill === "year" ? "year" : "month"

  const origin = process.env.NEXT_PUBLIC_APP_URL || (await headers()).get("origin") || "http://localhost:3000"

  // Reuse the Stripe customer if this user already has one (e.g. re-subscribing).
  const supabase = await createClient()
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", profile.id)
    .maybeSingle()

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: profile.id,
    ...(sub?.stripe_customer_id
      ? { customer: sub.stripe_customer_id }
      : user?.email
        ? { customer_email: user.email }
        : {}),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "thb",
          unit_amount: Math.round(amount * 100), // THB → satang
          recurring: { interval },
          product_data: { name: "Daily AI Lab Pro" },
        },
      },
    ],
    // user_id on the subscription lets webhooks (updated/deleted) map back to us.
    subscription_data: { metadata: { user_id: profile.id } },
    metadata: { user_id: profile.id, bill },
    allow_promotion_codes: true,
    // {CHECKOUT_SESSION_ID} is substituted by Stripe; the settings page reads it
    // back to confirm payment and grant Pro (works without the webhook/CLI).
    success_url: `${origin}/settings?session_id={CHECKOUT_SESSION_ID}#subscription`,
    cancel_url: `${origin}/upgrade?canceled=1`,
  })

  if (!session.url) throw new Error("Stripe Checkout session has no URL")
  redirect(session.url)
}
