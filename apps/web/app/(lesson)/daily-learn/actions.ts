"use server"

import { getPublishedCourse } from "@/lib/courses"
import { markLessonDone, type CompleteLessonResult } from "@/lib/progress"
import { loseHeart, type HeartState } from "@/lib/hearts"

// NOTE: "use server" files may only export async functions. Don't re-export the
// CompleteLessonResult type here — consumers import it from "@/lib/progress".

/** Deduct one heart for a wrong answer; returns the synced heart state. */
export async function loseHeartAction(): Promise<HeartState> {
  return loseHeart()
}

/**
 * Completes a lesson and reports what the server actually awarded. All real
 * validation (sequential order, replay, daily limit, XP amount) lives in the
 * complete_lesson RPC — server actions are public endpoints, so nothing here
 * trusts client-sent values beyond basic shape checks.
 */
export async function completeLessonAction(courseId: string, lessonNum: number, perfect = false): Promise<CompleteLessonResult> {
  if (!Number.isInteger(lessonNum) || lessonNum < 1) return { ok: false, xp: 0, reason: "invalid" }
  const course = await getPublishedCourse(courseId)
  if (!course) return { ok: false, xp: 0, reason: "invalid" }
  return markLessonDone(courseId, lessonNum, perfect === true)
}
