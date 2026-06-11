"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { saveSystemSettings, type SystemSettings } from "@/lib/system-settings"

export type SystemResult = { ok: boolean; message: string } | null

const int = (v: FormDataEntryValue | null, fallback: number, min = 0, max = 100000) => {
  const n = Math.round(Number(v))
  if (!Number.isFinite(n)) return fallback
  return Math.min(Math.max(n, min), max)
}

export async function saveSystemAction(_prev: SystemResult, formData: FormData): Promise<SystemResult> {
  await requireAdmin()
  const s: SystemSettings = {
    dailyGoalMinutes: int(formData.get("daily_goal_minutes"), 15, 1, 600),
    heartsPerRound: int(formData.get("hearts_per_round"), 5, 1, 99),
    xpPerLesson: int(formData.get("xp_per_lesson"), 10, 0, 1000),
    xpPerfectQuiz: int(formData.get("xp_perfect_quiz"), 15, 0, 1000),
    proPriceMonth: int(formData.get("pro_price_month"), 199, 0, 1000000),
    proPriceYear: int(formData.get("pro_price_year"), 1990, 0, 10000000),
    notifyStreak: formData.get("notify_streak") === "on",
    notifyWeekly: formData.get("notify_weekly") === "on",
    maintenanceMode: formData.get("maintenance_mode") === "on",
  }
  const res = await saveSystemSettings(s)
  if (res.ok) revalidatePath("/admin/system")
  return res
}
