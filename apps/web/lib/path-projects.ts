import "server-only"
import { createClient, getAuthUser } from "./supabase/server"
import type { RubricCriterion, StepKind } from "./career-paths"

export type ProjectAiReview = {
  overall: "strong" | "ok" | "weak"
  score: number
  summary: string
  criteria: { label: string; met: boolean; note: string }[]
  priorityFix: string
  improvedExample: string
}

export type ProjectFeedback = {
  score: number
  summary: string
  strengths: string[]
  improvements: string[]
  aiReview?: ProjectAiReview
  // Soft pass-gate for checkpoints: AI-graded against the rubric. `passed`
  // undefined = not AI-graded (no key / not pro) → UI lets the learner proceed.
  passed?: boolean
  target?: number
}

export type PathSubmission = {
  id: string
  pathId: string
  pathSlug: string
  pathTitle: string
  stepId: string
  stepTitle: string
  kind: Extract<StepKind, "checkpoint" | "project">
  artifactTitle: string
  content: string
  selfScores: Record<string, number>
  feedback: ProjectFeedback
  updatedAt: string
  rubric: RubricCriterion[]
}

type SubmissionRow = {
  id: string
  path_id: string
  step_id: string
  kind: "checkpoint" | "project"
  artifact_title: string
  content: string
  self_scores: Record<string, number>
  feedback: ProjectFeedback
  updated_at: string
  career_paths?: { slug?: string; title?: string } | { slug?: string; title?: string }[] | null
  path_steps?: { title?: string; rubric?: RubricCriterion[] } | { title?: string; rubric?: RubricCriterion[] }[] | null
}

function one<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value ?? undefined
}

function mapSubmission(row: SubmissionRow): PathSubmission {
  const path = one(row.career_paths)
  const step = one(row.path_steps)
  return {
    id: row.id,
    pathId: row.path_id,
    pathSlug: path?.slug ?? "",
    pathTitle: path?.title ?? "",
    stepId: row.step_id,
    stepTitle: step?.title ?? "",
    kind: row.kind,
    artifactTitle: row.artifact_title,
    content: row.content,
    selfScores: row.self_scores ?? {},
    feedback: row.feedback ?? { score: 0, summary: "", strengths: [], improvements: [] },
    updatedAt: row.updated_at,
    rubric: step?.rubric ?? [],
  }
}

export async function getMyPathSubmission(stepId: string): Promise<PathSubmission | null> {
  const user = await getAuthUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from("path_submissions")
    .select("id,path_id,step_id,kind,artifact_title,content,self_scores,feedback,updated_at,career_paths(slug,title),path_steps(title,rubric)")
    .eq("user_id", user.id)
    .eq("step_id", stepId)
    .maybeSingle()
  return data ? mapSubmission(data as unknown as SubmissionRow) : null
}

export async function getMyPortfolio(): Promise<PathSubmission[]> {
  const user = await getAuthUser()
  if (!user) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("path_submissions")
    .select("id,path_id,step_id,kind,artifact_title,content,self_scores,feedback,updated_at,career_paths(slug,title),path_steps(title,rubric)")
    .eq("user_id", user.id)
    .eq("kind", "project")
    .order("updated_at", { ascending: false })
  return ((data as unknown as SubmissionRow[] | null) ?? []).map(mapSubmission)
}
