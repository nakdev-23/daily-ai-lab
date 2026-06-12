import Stripe from "stripe"

/**
 * Server-side Stripe client. Null when STRIPE_SECRET_KEY isn't set, so the app
 * still builds and runs without billing configured — callers guard via
 * requireStripe(). Use a TEST key (sk_test_…) in .env.local for development.
 */
const secret = process.env.STRIPE_SECRET_KEY

// Test mode locally, live mode in production — controlled purely by which key
// each environment carries (.env.local = sk_test_…, Vercel Production env =
// sk_live_…). These guards make a mixed-up deploy loud instead of silent.
if (secret && process.env.VERCEL_ENV === "production" && secret.startsWith("sk_test_")) {
  console.error(
    "[stripe] PRODUCTION deployment is using a TEST key (sk_test_…) — real customers cannot pay. " +
    "Set the live key in Vercel → Settings → Environment Variables (Production only).",
  )
}
if (secret && !process.env.VERCEL_ENV && secret.startsWith("sk_live_")) {
  console.error(
    "[stripe] Local dev is using a LIVE key (sk_live_…) — test checkouts would charge REAL money. " +
    "Use your sk_test_… key in .env.local.",
  )
}

export const stripe = secret ? new Stripe(secret) : null

export function requireStripe(): Stripe {
  if (!stripe) throw new Error("Stripe is not configured — set STRIPE_SECRET_KEY in .env.local")
  return stripe
}
