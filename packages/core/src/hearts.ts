export const HEARTS_CONFIG = {
  MAX_FREE: 5,
  MAX_PRO: Infinity,
  REFILL_HOURS: 24,
  COST_PER_WRONG: 1,
} as const

export interface HeartsState {
  current: number
  max: number
  lastLostAt: Date | null
  isPro: boolean
}

export function canAnswer(hearts: HeartsState): boolean {
  if (hearts.isPro) return true
  return hearts.current > 0
}

export function loseHeart(hearts: HeartsState): HeartsState {
  if (hearts.isPro) return hearts
  return {
    ...hearts,
    current: Math.max(0, hearts.current - 1),
    lastLostAt: new Date(),
  }
}

export function getRefillTimeRemaining(hearts: HeartsState): number | null {
  if (!hearts.lastLostAt || hearts.current >= hearts.max) return null
  const elapsed = Date.now() - hearts.lastLostAt.getTime()
  const refillMs = HEARTS_CONFIG.REFILL_HOURS * 60 * 60 * 1000
  return Math.max(0, refillMs - elapsed)
}

export function checkAndRefillHearts(hearts: HeartsState): HeartsState {
  if (hearts.isPro || hearts.current >= hearts.max || !hearts.lastLostAt) {
    return hearts
  }
  const refillMs = HEARTS_CONFIG.REFILL_HOURS * 60 * 60 * 1000
  if (Date.now() - hearts.lastLostAt.getTime() >= refillMs) {
    return { ...hearts, current: hearts.max, lastLostAt: null }
  }
  return hearts
}
