export type Plan = "free" | "pro"

export interface Subscription {
  plan: Plan
  expiresAt: Date | null
}

export const FREE_LIMITS = {
  dailyLessons: 3,
  canSkipLessons: false,
  docsAccess: ["beginner"] as string[],
  careerPathAccess: false,
  advancedTools: false,
  streakFreeze: false,
  globalLeaderboard: false,
} as const

export const PRO_FEATURES = {
  dailyLessons: Infinity,
  canSkipLessons: true,
  docsAccess: ["beginner", "intermediate", "advanced"] as string[],
  careerPathAccess: true,
  advancedTools: true,
  streakFreeze: true,
  globalLeaderboard: true,
} as const

export function isPro(sub: Subscription): boolean {
  if (sub.plan !== "pro") return false
  if (!sub.expiresAt) return true
  return sub.expiresAt > new Date()
}

export function canAccessDocLevel(sub: Subscription, level: string): boolean {
  const features = isPro(sub) ? PRO_FEATURES : FREE_LIMITS
  return features.docsAccess.includes(level)
}

export function canAccessCareerPath(sub: Subscription): boolean {
  return isPro(sub)
}

export function getDailyLessonLimit(sub: Subscription): number {
  return isPro(sub) ? PRO_FEATURES.dailyLessons : FREE_LIMITS.dailyLessons
}
