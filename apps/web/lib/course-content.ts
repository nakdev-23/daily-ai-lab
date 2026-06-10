import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

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

export async function saveUnit(input: UnitInput): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  if (input.id) await supabase.from("course_units").update({ title: input.title }).eq("id", input.id)
  else await supabase.from("course_units").insert({ course_id: input.course_id, title: input.title })
}

export async function deleteUnit(id: string): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("course_units").delete().eq("id", id)
}

export async function saveLesson(input: LessonInput): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  const row = { unit_id: input.unit_id, title: input.title, kind: input.kind, xp: input.xp }
  if (input.id) await supabase.from("course_lessons").update(row).eq("id", input.id)
  else await supabase.from("course_lessons").insert(row)
}

export async function deleteLesson(id: string): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("course_lessons").delete().eq("id", id)
}
