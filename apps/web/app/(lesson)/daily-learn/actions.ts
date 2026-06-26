"use server"

import { getPublishedCourse } from "@/lib/courses"
import { markLessonDone, type CompleteLessonResult } from "@/lib/progress"
import { submitLessonFeedback, type SubmitFeedbackResult } from "@/lib/lesson-feedback"
import { reviewPromptWithAI, runPromptDemo, type AiReviewResult, type AiRunResult } from "@/lib/ai-prompt-review"
import { getProfile } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
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
  // Career-path keys ("path:{slug}") are validated by the RPC against the
  // path's real step count; course keys are checked here for a fast fail.
  if (!/^path:[a-z0-9-]+$/.test(courseId)) {
    const course = await getPublishedCourse(courseId)
    if (!course) return { ok: false, xp: 0, reason: "invalid" }
  }
  return markLessonDone(courseId, lessonNum, perfect === true)
}

/**
 * Stores the learner's rating + optional comment for the lesson they just
 * finished. All validation (rating range, ownership) lives in the lib helper /
 * RLS — server actions are public endpoints, so this only does a basic shape
 * check before handing off.
 */
export async function submitFeedbackAction(
  courseId: string,
  lessonNum: number,
  rating: number,
  comment?: string,
): Promise<SubmitFeedbackResult> {
  if (typeof courseId !== "string" || !courseId) return { ok: false, reason: "invalid" }
  return submitLessonFeedback(courseId, lessonNum, rating, comment)
}

export type ReviewPracticeResult = AiReviewResult | { ok: false; reason: "pro-only" | "not-signed-in" | "rate-limited" }

/**
 * AI review of a learner's practice prompt. Available to everyone (Free + Pro) —
 * it runs on cheap Haiku, and giving every learner instant prompt coaching is
 * the whole point. Per-user rate-limited to keep the API bill bounded; the
 * deeper Pro perk is AI grading of career-path PROJECTS (separate action).
 */
export async function reviewPracticeAction(input: {
  draft: string
  requirements: string[]
  scenario?: string
}): Promise<ReviewPracticeResult> {
  const profile = await getProfile()
  if (!profile) return { ok: false, reason: "not-signed-in" }

  // 20 AI reviews per 10 minutes per user — generous for learning, caps abuse.
  if (!rateLimit(`ai-review:${profile.id}`, 20, 600_000).ok) return { ok: false, reason: "rate-limited" }

  return reviewPromptWithAI({
    draft: typeof input.draft === "string" ? input.draft : "",
    requirements: Array.isArray(input.requirements) ? input.requirements : [],
    scenario: typeof input.scenario === "string" ? input.scenario : undefined,
  })
}

export type RunPromptResult = AiRunResult | { ok: false; reason: "not-signed-in" | "rate-limited" }

/**
 * Runs the learner's prompt for real and returns the model's answer, so they
 * see what their wording actually produces. Available to everyone (Free + Pro)
 * on cheap Haiku; per-user rate-limited to keep the bill bounded.
 */
export async function runPromptAction(input: { draft: string }): Promise<RunPromptResult> {
  const profile = await getProfile()
  if (!profile) return { ok: false, reason: "not-signed-in" }

  // 15 runs per 10 minutes per user — runs produce longer output than reviews.
  if (!rateLimit(`ai-run:${profile.id}`, 15, 600_000).ok) return { ok: false, reason: "rate-limited" }

  return runPromptDemo(typeof input.draft === "string" ? input.draft : "")
}
