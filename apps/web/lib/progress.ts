import { createClient, getAuthUser } from "./supabase/server"

/** Returns how many lessons have been completed for a course (keyed by slug). */
export async function getLessonsDone(courseId: string): Promise<number> {
  const user = await getAuthUser()
  if (!user) return 0
  const supabase = await createClient()
  const { data } = await supabase
    .from("course_progress")
    .select("lessons_done")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle()
  return data?.lessons_done ?? 0
}

export type CompleteLessonResult = {
  ok: boolean
  xp: number
  reason: "ok" | "replay" | "sequential" | "daily-limit" | "preview-locked" | "invalid" | "not-signed-in" | "error"
}

/**
 * Marks a lesson as completed (idempotent — replaying a finished lesson
 * changes nothing). The complete_lesson RPC owns the XP amount: it reads the
 * lesson's XP from course content server-side (migration 011), so the client
 * never decides how much XP it gets. Returns what was awarded and why.
 */
export async function markLessonDone(courseId: string, lessonNum: number, perfect = false): Promise<CompleteLessonResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("complete_lesson", {
    p_course_id: courseId,
    p_lesson_num: lessonNum,
    p_perfect: perfect,
  })
  if (error || !data || typeof data !== "object") return { ok: false, xp: 0, reason: "error" }
  const r = data as { ok?: boolean; xp?: number; reason?: string }
  return {
    ok: r.ok === true,
    xp: typeof r.xp === "number" ? r.xp : 0,
    reason: (r.reason as CompleteLessonResult["reason"]) ?? "error",
  }
}
