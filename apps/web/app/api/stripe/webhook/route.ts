import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { requireStripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

// Signature verification needs the raw body + Node crypto, so force Node runtime.
export const runtime = "nodejs"

export async function POST(req: Request) {
  const stripe = requireStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: "webhook not configured" }, { status: 500 })

  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const nowIso = new Date().toISOString()

  switch (event.type) {
    // Payment succeeded → grant Pro.
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id || session.metadata?.user_id
      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            plan: "pro",
            // Clear any expiry left over from a previous cancel-at-period-end,
            // otherwise a re-subscriber gets cut off on the old date.
            expires_at: null,
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
            updated_at: nowIso,
          })
          .eq("user_id", userId)
      }
      break
    }

    // Renewal / status change → keep plan + period end in sync.
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const active = sub.status === "active" || sub.status === "trialing"
      const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end
      await supabase
        .from("subscriptions")
        .update({
          plan: active ? "pro" : "free",
          expires_at: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: nowIso,
        })
        .eq("stripe_subscription_id", sub.id)
      break
    }

    // Cancelled / ended → back to Free.
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from("subscriptions")
        .update({ plan: "free", expires_at: null, stripe_subscription_id: null, updated_at: nowIso })
        .eq("stripe_subscription_id", sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
