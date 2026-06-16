import { createClient } from "./supabase/server"
import { locField, type Lang } from "./i18n-core"

export type StepKind = "lesson" | "quiz" | "checkpoint" | "project"

export type PathStep = {
  id: string
  title: string
  kind: StepKind
  courseSlug: string
  lessonNum: number
  xp: number
  orderIndex: number
}

export type PathModule = {
  id: string
  title: string
  orderIndex: number
  steps: PathStep[]
}

export type CareerPath = {
  id: string
  slug: string
  title: string
  tag: string
  description: string
  tone: string
  tools: string[]
  weeks: number
  isPro: boolean
  isPublished: boolean
  orderIndex: number
  modules: PathModule[]
}

export type CareerPathRow = Omit<CareerPath, "modules">

// ── helpers ──────────────────────────────────────────────────────────────────

function rowToPath(p: Record<string, unknown>, lang: Lang = "th"): CareerPathRow {
  return {
    id:          p.id as string,
    slug:        p.slug as string,
    title:       locField(p, "title", lang),
    tag:         p.tag as string,
    description: locField(p, "description", lang),
    tone:        p.tone as string,
    tools:       (p.tools as string[]) ?? [],
    weeks:       p.weeks as number,
    isPro:       p.is_pro as boolean,
    isPublished: p.is_published as boolean,
    orderIndex:  p.order_index as number,
  }
}

async function loadModulesAndSteps(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pathIds: string[],
  lang: Lang = "th"
): Promise<{ modules: PathModule[]; modulesByPathId: Map<string, PathModule[]> }> {
  if (pathIds.length === 0) return { modules: [], modulesByPathId: new Map() }

  const { data: rawModules } = await supabase
    .from("path_modules")
    .select("*")
    .in("path_id", pathIds)
    .order("order_index")

  const moduleList = rawModules ?? []
  const moduleIds = moduleList.map((m) => m.id as string)

  const { data: rawSteps } = moduleIds.length
    ? await supabase
        .from("path_steps")
        .select("*")
        .in("module_id", moduleIds)
        .order("order_index")
    : { data: [] }

  const stepsByModule = new Map<string, PathStep[]>()
  for (const s of rawSteps ?? []) {
    const mid = s.module_id as string
    if (!stepsByModule.has(mid)) stepsByModule.set(mid, [])
    stepsByModule.get(mid)!.push({
      id:         s.id as string,
      title:      locField(s as Record<string, unknown>, "title", lang),
      kind:       s.kind as StepKind,
      courseSlug: s.course_slug as string,
      lessonNum:  s.lesson_num as number,
      xp:         s.xp as number,
      orderIndex: s.order_index as number,
    })
  }

  const modules: PathModule[] = moduleList.map((m) => ({
    id:         m.id as string,
    title:      locField(m as Record<string, unknown>, "title", lang),
    orderIndex: m.order_index as number,
    steps:      stepsByModule.get(m.id as string) ?? [],
  }))

  const modulesByPathId = new Map<string, PathModule[]>()
  for (const m of moduleList) {
    const pid = m.path_id as string
    if (!modulesByPathId.has(pid)) modulesByPathId.set(pid, [])
    modulesByPathId.get(pid)!.push(modules.find((x) => x.id === m.id)!)
  }

  return { modules, modulesByPathId }
}

// ── public query: published paths ────────────────────────────────────────────

export async function getCareerPaths(lang: Lang = "th"): Promise<CareerPath[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("career_paths")
    .select("*")
    .order("order_index")

  const rows = (data ?? []).map((p) => rowToPath(p as Record<string, unknown>, lang))
  const { modulesByPathId } = await loadModulesAndSteps(supabase, rows.map((r) => r.id), lang)

  return rows.map((r) => ({ ...r, modules: modulesByPathId.get(r.id) ?? [] }))
}

export async function getCareerPath(slug: string, lang: Lang = "th"): Promise<CareerPath | null> {
  const supabase = await createClient()
  const { data: p } = await supabase
    .from("career_paths")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (!p) return null
  const row = rowToPath(p as Record<string, unknown>, lang)
  const { modulesByPathId } = await loadModulesAndSteps(supabase, [row.id], lang)
  return { ...row, modules: modulesByPathId.get(row.id) ?? [] }
}

// ── admin queries ─────────────────────────────────────────────────────────────

export async function getAllCareerPaths(): Promise<CareerPathRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("career_paths")
    .select("*")
    .order("order_index")
  return (data ?? []).map((p) => rowToPath(p as Record<string, unknown>))
}

export async function getCareerPathById(id: string): Promise<CareerPath | null> {
  const supabase = await createClient()
  const { data: p } = await supabase
    .from("career_paths")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (!p) return null
  const row = rowToPath(p as Record<string, unknown>)
  const { modulesByPathId } = await loadModulesAndSteps(supabase, [row.id])
  return { ...row, modules: modulesByPathId.get(row.id) ?? [] }
}

// ── utils ─────────────────────────────────────────────────────────────────────

export function pathCourseSlugs(path: CareerPath): string[] {
  return [...new Set(path.modules.flatMap((m) => m.steps.map((s) => s.courseSlug)))]
}

export function totalSteps(path: CareerPath): number {
  return path.modules.flatMap((m) => m.steps).length
}

export function totalXp(path: CareerPath): number {
  return path.modules.flatMap((m) => m.steps).reduce((sum, s) => sum + s.xp, 0)
}
