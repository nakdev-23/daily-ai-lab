import { createClient, getAuthUser } from "./supabase/server"
import { getCourses } from "./courses"

export type SubmitFeedbackResult = { ok: boolean; reason?: "not-signed-in" | "invalid" | "error" }

/**
 * Saves a learner's rating (1–5) + optional comment for a lesson. Idempotent:
 * one row per (user, course, lesson), so re-submitting overwrites the previous
 * rating instead of stacking up. RLS guarantees a user can only write their own
 * row; this never throws so a failed save can't break the lesson-complete UI.
 */
export async function submitLessonFeedback(
  courseId: string,
  lessonNum: number,
  rating: number,
  comment?: string | null,
): Promise<SubmitFeedbackResult> {
  const user = await getAuthUser()
  if (!user) return { ok: false, reason: "not-signed-in" }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, reason: "invalid" }
  if (!Number.isInteger(lessonNum) || lessonNum < 1) return { ok: false, reason: "invalid" }

  const trimmed = comment?.trim().slice(0, 1000) || null
  const supabase = await createClient()
  const { error } = await supabase
    .from("lesson_feedback")
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        lesson_num: lessonNum,
        rating,
        comment: trimmed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_id,lesson_num" },
    )
  if (error) {
    // Most likely culprit: migration 023 not applied yet, or an RLS mismatch.
    // Log it so a failed save isn't invisible behind the generic UI error.
    console.error("lesson_feedback upsert failed", error)
    return { ok: false, reason: "error" }
  }
  return { ok: true }
}

// ─────────────────────────────────────────────
// Admin reporting
// ─────────────────────────────────────────────

export type AdminFeedbackRow = {
  userId: string
  userName: string
  courseId: string
  courseTitle: string
  lessonNum: number
  rating: number
  comment: string | null
  createdAt: string
}

export type CourseFeedbackStat = {
  courseId: string
  courseTitle: string
  count: number
  avg: number
}

export type AdminFeedbackData = {
  total: number
  /** Mean rating across the loaded rows, rounded to 1 decimal. 0 when empty. */
  avg: number
  /** How many of the loaded rows carry a written comment. */
  withComment: number
  /** Per-course rollup, worst average first so weak lessons surface at the top. */
  byCourse: CourseFeedbackStat[]
  /** Most-recent feedback first (for the detail table). */
  rows: AdminFeedbackRow[]
}

type FeedbackRowDB = {
  user_id: string
  course_id: string
  lesson_num: number
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

/**
 * Reads lesson feedback for the admin dashboard. Returns null when the table
 * can't be read (migration 023 not applied / RLS) so the page can show a clear
 * "run the migration" hint instead of a blank panel.
 *
 * Stats are computed over the loaded window (PostgREST caps a select at 1000
 * rows). At early-product scale that's the whole table; if feedback ever grows
 * past that, move the aggregates into a SQL view/RPC. Admin-only by RLS — the
 * "admins read all feedback" policy is what makes this cross-user read legal.
 */
export async function getAdminFeedback(): Promise<AdminFeedbackData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("lesson_feedback")
    .select("user_id, course_id, lesson_num, rating, comment, created_at, updated_at")
    .order("updated_at", { ascending: false })
  if (error) {
    console.error("lesson_feedback admin read failed", error)
    return null
  }

  const rowsDB = (data ?? []) as FeedbackRowDB[]

  // Resolve display names + course titles in two batched lookups (no FK from
  // lesson_feedback to profiles/courses, so embed-joins aren't available).
  const userIds = [...new Set(rowsDB.map((r) => r.user_id))]
  const [profilesRes, courses] = await Promise.all([
    userIds.length
      ? supabase.from("profiles").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string | null }[] }),
    getCourses(),
  ])
  const nameById = new Map((profilesRes.data ?? []).map((p) => [p.id, p.display_name ?? ""]))
  const titleBySlug = new Map(courses.map((c) => [c.slug || c.id, c.title]))

  const courseTitle = (courseId: string) =>
    titleBySlug.get(courseId) ?? (courseId.startsWith("path:") ? `เส้นทาง: ${courseId.slice(5)}` : courseId)

  const rows: AdminFeedbackRow[] = rowsDB.map((r) => ({
    userId: r.user_id,
    userName: nameById.get(r.user_id) || `@${r.user_id.slice(0, 6)}`,
    courseId: r.course_id,
    courseTitle: courseTitle(r.course_id),
    lessonNum: r.lesson_num,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.updated_at,
  }))

  const total = rows.length
  const sum = rows.reduce((s, r) => s + r.rating, 0)
  const avg = total ? Math.round((sum / total) * 10) / 10 : 0
  const withComment = rows.filter((r) => r.comment && r.comment.trim()).length

  // Group by course → count + average, worst first.
  const groups = new Map<string, { title: string; count: number; sum: number }>()
  for (const r of rows) {
    const g = groups.get(r.courseId) ?? { title: r.courseTitle, count: 0, sum: 0 }
    g.count += 1
    g.sum += r.rating
    groups.set(r.courseId, g)
  }
  const byCourse: CourseFeedbackStat[] = [...groups.entries()]
    .map(([courseId, g]) => ({ courseId, courseTitle: g.title, count: g.count, avg: Math.round((g.sum / g.count) * 10) / 10 }))
    .sort((a, b) => a.avg - b.avg || b.count - a.count)

  return { total, avg, withComment, byCourse, rows }
}
