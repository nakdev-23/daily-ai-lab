import { createClient } from "./supabase/server"

export type SystemSettings = {
  dailyGoalMinutes: number
  heartsPerRound: number
  xpPerLesson: number
  xpPerfectQuiz: number
  proPriceMonth: number
  proPriceYear: number
  notifyStreak: boolean
  notifyWeekly: boolean
  maintenanceMode: boolean
}

export const DEFAULT_SETTINGS: SystemSettings = {
  dailyGoalMinutes: 15,
  heartsPerRound: 5,
  xpPerLesson: 10,
  xpPerfectQuiz: 15,
  proPriceMonth: 199,
  proPriceYear: 1990,
  notifyStreak: true,
  notifyWeekly: true,
  maintenanceMode: false,
}

type Row = {
  daily_goal_minutes: number
  hearts_per_round: number
  xp_per_lesson: number
  xp_perfect_quiz: number
  pro_price_month: number
  pro_price_year: number
  notify_streak: boolean
  notify_weekly: boolean
  maintenance_mode: boolean
}

function fromRow(r: Row): SystemSettings {
  return {
    dailyGoalMinutes: r.daily_goal_minutes,
    heartsPerRound: r.hearts_per_round,
    xpPerLesson: r.xp_per_lesson,
    xpPerfectQuiz: r.xp_perfect_quiz,
    proPriceMonth: r.pro_price_month,
    proPriceYear: r.pro_price_year,
    notifyStreak: r.notify_streak,
    notifyWeekly: r.notify_weekly,
    maintenanceMode: r.maintenance_mode,
  }
}

/** Live platform settings. Falls back to defaults if the row/table is missing. */
export async function getSystemSettings(): Promise<SystemSettings> {
  const supabase = await createClient()
  const { data } = await supabase.from("system_settings").select("*").eq("id", 1).maybeSingle()
  return data ? fromRow(data as Row) : DEFAULT_SETTINGS
}

/** Persist settings (admin only — caller must authorize via requireAdmin). */
export async function saveSystemSettings(s: SystemSettings): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("system_settings").update({
    daily_goal_minutes: s.dailyGoalMinutes,
    hearts_per_round: s.heartsPerRound,
    xp_per_lesson: s.xpPerLesson,
    xp_perfect_quiz: s.xpPerfectQuiz,
    pro_price_month: s.proPriceMonth,
    pro_price_year: s.proPriceYear,
    notify_streak: s.notifyStreak,
    notify_weekly: s.notifyWeekly,
    maintenance_mode: s.maintenanceMode,
    updated_at: new Date().toISOString(),
  }).eq("id", 1)
  if (error) return { ok: false, message: "บันทึกไม่สำเร็จ — ตรวจสอบว่ารัน migration 008 แล้ว" }
  return { ok: true, message: "บันทึกการตั้งค่าแล้ว" }
}
