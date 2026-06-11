"use server"

import { getCourse } from "@/lib/courses"
import { markLessonDone, type CompleteLessonResult } from "@/lib/progress"
import { loseHeart, type HeartState } from "@/lib/hearts"

export type { CompleteLessonResult }

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
  const course = await getCourse(courseId)
  if (!course) return { ok: false, xp: 0, reason: "invalid" }
  return markLessonDone(courseId, lessonNum, perfect === true)
}
