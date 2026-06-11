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

/**
 * Marks a lesson as completed and awards XP (idempotent — replaying a
 * finished lesson changes nothing). Goes through the complete_lesson RPC
 * so progress + XP + streak update atomically.
 */
export async function markLessonDone(courseId: string, lessonNum: number, xp = 10): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc("complete_lesson", {
    p_course_id: courseId,
    p_lesson_num: lessonNum,
    p_xp: xp,
  })
}
