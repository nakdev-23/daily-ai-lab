"use server"

import { createClient, getAuthUser } from "@/lib/supabase/server"
import { reviewProjectWithAI } from "@/lib/ai-prompt-review"
import { rateLimit } from "@/lib/rate-limit"
import type { ProjectFeedback } from "@/lib/path-projects"
import type { RubricCriterion } from "@/lib/career-paths"

// Checkpoint soft pass-gate: AI score needed to "pass" (UI still offers skip).
const PASS_TARGET = 90

export type SubmitPathWorkResult =
  | { ok: true; feedback: ProjectFeedback }
  | { ok: false; reason: "invalid" | "not-signed-in" | "not-found" | "error" }

export async function submitPathWorkAction(input: {
  pathId: string
  stepId: string
  artifactTitle: string
  content: string
  selfScores: Record<string, number>
}): Promise<SubmitPathWorkResult> {
  const user = await getAuthUser()
  if (!user) return { ok: false, reason: "not-signed-in" }

  const artifactTitle = input.artifactTitle.trim()
  const content = input.content.trim()
  if (
    !/^[0-9a-f-]{36}$/i.test(input.pathId)
    || !/^[0-9a-f-]{36}$/i.test(input.stepId)
    || artifactTitle.length < 3
    || artifactTitle.length > 120
    || content.length < 40
    || content.length > 20000
  ) return { ok: false, reason: "invalid" }

  const supabase = await createClient()
  const { data: step } = await supabase
    .from("path_steps")
    .select("id,kind,rubric,module_id")
    .eq("id", input.stepId)
    .in("kind", ["checkpoint", "project"])
    .maybeSingle()

  if (!step) return { ok: false, reason: "not-found" }

  const { data: module } = await supabase
    .from("path_modules")
    .select("path_id,career_paths!inner(is_published)")
    .eq("id", step.module_id)
    .eq("path_id", input.pathId)
    .eq("career_paths.is_published", true)
    .maybeSingle()

  if (!module) return { ok: false, reason: "not-found" }

  const rubric = ((step.rubric as RubricCriterion[] | null) ?? []).slice(0, 8)
  if (rubric.length === 0) return { ok: false, reason: "invalid" }

  const scores: Record<string, number> = {}
  for (const criterion of rubric) {
    const score = Number(input.selfScores[criterion.key])
    if (!Number.isInteger(score) || score < 1 || score > 4) return { ok: false, reason: "invalid" }
    scores[criterion.key] = score
  }

  const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / rubric.length
  const strengths = rubric.filter((criterion) => scores[criterion.key] >= 3).map((criterion) => criterion.label)
  const improvements = rubric.filter((criterion) => scores[criterion.key] < 3).map((criterion) => criterion.guidance)
  const feedback: ProjectFeedback = {
    score: Math.round(average * 25),
    summary: average >= 3.5
      ? "ชิ้นงานพร้อมนำไปทดลองใช้จริงแล้ว ตรวจผลลัพธ์หนึ่งรอบก่อนเผยแพร่"
      : average >= 2.5
        ? "โครงสร้างดีแล้ว ปรับจุดที่ rubric ระบุอีกหนึ่งรอบเพื่อให้ใช้งานได้มั่นใจขึ้น"
        : "กลับไปเพิ่มรายละเอียดใน prompt และกำหนดวิธีตรวจงานก่อนส่งฉบับถัดไป",
    strengths,
    improvements,
  }

  // AI review (Haiku) for everyone (Free + Pro), layered on the rubric score.
  // Per-user rate-limited and non-blocking — if the key is missing, the limit is
  // hit, or the call fails, the submission still saves with the rubric feedback.
  if (rateLimit(`ai-project:${user.id}`, 15, 600_000).ok) {
    const aiReview = await reviewProjectWithAI({
      artifactTitle,
      content,
      rubric: rubric.map((criterion) => ({ label: criterion.label, guidance: criterion.guidance })),
    })
    if (aiReview.ok) {
      feedback.aiReview = {
        overall: aiReview.overall,
        score: aiReview.score,
        summary: aiReview.summary,
        criteria: aiReview.criteria,
        priorityFix: aiReview.priorityFix,
        improvedExample: aiReview.improvedExample,
      }
      // Soft pass-gate for checkpoints: must reach the target to "pass", but the
      // UI always offers a skip so a learner is never hard-blocked.
      if (step.kind === "checkpoint") {
        feedback.target = PASS_TARGET
        feedback.passed = aiReview.score >= PASS_TARGET
      }
    }
  }

  const { error } = await supabase.from("path_submissions").upsert({
    user_id: user.id,
    path_id: input.pathId,
    step_id: input.stepId,
    kind: step.kind,
    artifact_title: artifactTitle,
    content,
    self_scores: scores,
    feedback,
    status: "reviewed",
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,step_id" })

  return error ? { ok: false, reason: "error" } : { ok: true, feedback }
}
