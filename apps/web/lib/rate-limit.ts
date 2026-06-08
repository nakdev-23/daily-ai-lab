/**
 * Lightweight in-memory fixed-window rate limiter.
 *
 * Works per-instance (good for dev + single-instance). For multi-instance /
 * serverless production, swap the Map for a shared store (e.g. Upstash Redis
 * with @upstash/ratelimit) — the call sites stay the same.
 */
type Entry = { count: number; reset: number }

const store = new Map<string, Entry>()
let lastSweep = 0

export type RateResult = { ok: boolean; remaining: number; reset: number }

export function rateLimit(key: string, limit = 100, windowMs = 10_000): RateResult {
  const now = Date.now()

  // opportunistic cleanup so the Map doesn't grow unbounded
  if (now - lastSweep > 30_000) {
    for (const [k, e] of store) if (now > e.reset) store.delete(k)
    lastSweep = now
  }

  const e = store.get(key)
  if (!e || now > e.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: limit - 1, reset: now + windowMs }
  }

  e.count++
  return { ok: e.count <= limit, remaining: Math.max(0, limit - e.count), reset: e.reset }
}
