export interface StreakState {
  current: number
  longest: number
  lastActivityDate: string | null  // ISO date string "YYYY-MM-DD"
  freezeCount: number
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay)
}

export function updateStreak(streak: StreakState, today = new Date()): StreakState {
  const todayStr = toDateString(today)

  if (!streak.lastActivityDate) {
    return { ...streak, current: 1, longest: Math.max(1, streak.longest), lastActivityDate: todayStr }
  }

  if (streak.lastActivityDate === todayStr) return streak

  const diff = daysBetween(streak.lastActivityDate, todayStr)

  if (diff === 1) {
    const next = streak.current + 1
    return { ...streak, current: next, longest: Math.max(next, streak.longest), lastActivityDate: todayStr }
  }

  if (diff === 2 && streak.freezeCount > 0) {
    const next = streak.current + 1
    return {
      ...streak,
      current: next,
      longest: Math.max(next, streak.longest),
      lastActivityDate: todayStr,
      freezeCount: streak.freezeCount - 1,
    }
  }

  return { ...streak, current: 1, lastActivityDate: todayStr }
}

export function isStreakActiveToday(streak: StreakState, today = new Date()): boolean {
  return streak.lastActivityDate === toDateString(today)
}
