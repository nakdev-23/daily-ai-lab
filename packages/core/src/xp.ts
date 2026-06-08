export const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  QUIZ_CORRECT: 5,
  PERFECT_LESSON: 20,    // ไม่ผิดเลย
  DAILY_STREAK: 5,       // bonus ต่อวัน streak
  FIRST_LESSON_DAY: 15,  // บทแรกของวัน
} as const

export const LEVELS = [
  { level: 1, minXP: 0, title: "AI Newcomer" },
  { level: 2, minXP: 100, title: "Prompt Explorer" },
  { level: 3, minXP: 300, title: "AI Thinker" },
  { level: 4, minXP: 600, title: "Prompt Engineer" },
  { level: 5, minXP: 1000, title: "AI Practitioner" },
  { level: 6, minXP: 1500, title: "AI Strategist" },
  { level: 7, minXP: 2200, title: "AI Expert" },
  { level: 8, minXP: 3000, title: "AI Master" },
  { level: 9, minXP: 4000, title: "AI Architect" },
  { level: 10, minXP: 5500, title: "AI Grandmaster" },
] as const

export function getLevelFromXP(xp: number): (typeof LEVELS)[number] {
  return [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0]
}

export function getXPToNextLevel(xp: number): number {
  const current = getLevelFromXP(xp)
  const nextLevel = LEVELS.find((l) => l.level === current.level + 1)
  if (!nextLevel) return 0
  return nextLevel.minXP - xp
}

export function getLevelProgress(xp: number): number {
  const current = getLevelFromXP(xp)
  const nextLevel = LEVELS.find((l) => l.level === current.level + 1)
  if (!nextLevel) return 100
  const range = nextLevel.minXP - current.minXP
  const progress = xp - current.minXP
  return Math.round((progress / range) * 100)
}
