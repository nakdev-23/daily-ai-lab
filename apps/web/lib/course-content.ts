import { unstable_cache, revalidateTag } from "next/cache"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"
import { publicClient } from "./supabase/public"
import { locField, type Lang } from "./i18n-core"

export type LessonKind = "lesson" | "quiz" | "check" | "project"
export type CLesson = { id: string; unit_id: string; title: string; kind: LessonKind; xp: number; order_index: number }
export type CUnit = { id: string; course_id: string; title: string; order_index: number; lessons: CLesson[] }

export type UnitInput = { id?: string; course_id: string; title: string }
export type LessonInput = { id?: string; unit_id: string; title: string; kind: LessonKind; xp: number }

async function assertAdmin() {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
}

export async function getCourseContent(courseId: string): Promise<CUnit[]> {
  const supabase = await createClient()
  const { data: unitRows } = await supabase.from("course_units").select("*").eq("course_id", courseId).order("order_index")
  const units = (unitRows ?? []) as Omit<CUnit, "lessons">[]
  if (units.length === 0) return []
  const { data: lessonRows } = await supabase
    .from("course_lessons")
    .select("*")
    .in("unit_id", units.map((u) => u.id))
    .order("order_index")
  const all = (lessonRows ?? []) as CLesson[]
  return units.map((u) => ({ ...u, lessons: all.filter((l) => l.unit_id === u.id) }))
}

/**
 * Course content for learner-facing pages, cached across requests (per course,
 * 5 min / "course-content" tag). Content only changes via the admin editor,
 * which revalidates the tag — so visitors share one query instead of two per
 * page view (free-tier egress saver).
 */
export const getPublishedCourseContent = unstable_cache(
  async (courseId: string, lang: Lang = "th"): Promise<CUnit[]> => {
    // select("*") so the optional *_en columns are read when present without
    // breaking before migration 022 is applied.
    const { data: unitRows } = await publicClient
      .from("course_units").select("*").eq("course_id", courseId).order("order_index")
    const units = (unitRows ?? []) as Record<string, unknown>[]
    if (units.length === 0) return []
    const { data: lessonRows } = await publicClient
      .from("course_lessons")
      .select("*")
      .in("unit_id", units.map((u) => u.id as string))
      .order("order_index")
    const all = (lessonRows ?? []) as Record<string, unknown>[]
    return units.map((u) => ({
      id: u.id as string,
      course_id: u.course_id as string,
      title: locField(u, "title", lang),
      order_index: u.order_index as number,
      lessons: all
        .filter((l) => l.unit_id === u.id)
        .map((l) => ({
          id: l.id as string,
          unit_id: l.unit_id as string,
          title: locField(l, "title", lang),
          kind: l.kind as LessonKind,
          xp: l.xp as number,
          order_index: l.order_index as number,
        })),
    }))
  },
  ["published-course-content"],
  { revalidate: 300, tags: ["course-content"] },
)

export async function saveUnit(input: UnitInput): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  if (input.id) await supabase.from("course_units").update({ title: input.title }).eq("id", input.id)
  else await supabase.from("course_units").insert({ course_id: input.course_id, title: input.title })
  revalidateTag("course-content", "max")
}

export async function deleteUnit(id: string): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("course_units").delete().eq("id", id)
  revalidateTag("course-content", "max")
}

export async function saveLesson(input: LessonInput): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  const row = { unit_id: input.unit_id, title: input.title, kind: input.kind, xp: input.xp }
  if (input.id) await supabase.from("course_lessons").update(row).eq("id", input.id)
  else await supabase.from("course_lessons").insert(row)
  revalidateTag("course-content", "max")
}

export async function deleteLesson(id: string): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("course_lessons").delete().eq("id", id)
  revalidateTag("course-content", "max")
}
