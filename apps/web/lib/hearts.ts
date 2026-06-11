import { createClient } from "./supabase/server"
import { getProfile, isPro, type SessionProfile } from "./auth"
import { getSystemSettings } from "./system-settings"

export type HeartState = { hearts: number; max: number; unlimited: boolean; nextRefill: string | null }

/**
 * ISO timestamp of the next heart refill — the next time the Bangkok wall clock
 * passes the configured reset hour. Bangkok is UTC+7 with no DST.
 */
/** Today's date (YYYY-MM-DD) on the Bangkok wall clock — matches the
 *  `(now() at time zone 'Asia/Bangkok')::date` day boundary used by the
 *  complete_lesson RPC for lessons_today tracking. */
export function bangkokTodayISO(): string {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().split("T")[0]
}

/** Whole hours remaining until Bangkok midnight (min 1) — for "Nh left" chips. */
export function bangkokHoursLeftToday(): number {
  return Math.max(1, 24 - new Date(Date.now() + 7 * 3600 * 1000).getUTCHours())
}

export function nextHeartRefillISO(resetHour: number): string {
  const BKK = 7 * 3600 * 1000
  const nowMs = Date.now()
  const bkk = new Date(nowMs + BKK) // its UTC fields read as Bangkok wall-clock
  let resetWall = Date.UTC(bkk.getUTCFullYear(), bkk.getUTCMonth(), bkk.getUTCDate(), resetHour, 0, 0)
  if (nowMs + BKK >= resetWall) resetWall += 24 * 3600 * 1000 // already past today's reset → tomorrow
  return new Date(resetWall - BKK).toISOString()
}

/**
 * Current hearts for the signed-in user, applying the daily reset if due.
 * Pro/admin users have unlimited hearts (shown as ∞, never deducted).
 * Pass the already-loaded profile to avoid an extra round-trip.
 */
export async function getHeartState(profile?: SessionProfile | null): Promise<HeartState> {
  // Profile and settings are independent queries — fetch them concurrently.
  const [p, s] = await Promise.all([
    profile === undefined ? getProfile() : Promise.resolve(profile),
    getSystemSettings(),
  ])
  if (isPro(p)) {
    return { hearts: s.heartsPerRound, max: s.heartsPerRound, unlimited: true, nextRefill: null }
  }
  const supabase = await createClient()
  const { data } = await supabase.rpc("sync_hearts", { p_lose: false })
  const hearts = typeof data === "number" ? data : s.heartsPerRound
  return { hearts, max: s.heartsPerRound, unlimited: false, nextRefill: nextHeartRefillISO(s.heartsResetHour) }
}

/** Deduct one heart (no-op for Pro). Returns the resulting state. */
export async function loseHeart(profile?: SessionProfile | null): Promise<HeartState> {
  const [p, s] = await Promise.all([
    profile === undefined ? getProfile() : Promise.resolve(profile),
    getSystemSettings(),
  ])
  if (isPro(p)) {
    return { hearts: s.heartsPerRound, max: s.heartsPerRound, unlimited: true, nextRefill: null }
  }
  const supabase = await createClient()
  const { data } = await supabase.rpc("sync_hearts", { p_lose: true })
  const hearts = typeof data === "number" ? data : 0
  return { hearts, max: s.heartsPerRound, unlimited: false, nextRefill: nextHeartRefillISO(s.heartsResetHour) }
}
