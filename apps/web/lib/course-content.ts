import { isDevMock } from "./mock-user"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type LessonKind = "lesson" | "quiz" | "check" | "project"
export type CLesson = { id: string; unit_id: string; title: string; kind: LessonKind; xp: number; order_index: number }
export type CUnit = { id: string; course_id: string; title: string; order_index: number; lessons: CLesson[] }

export type UnitInput = { id?: string; course_id: string; title: string }
export type LessonInput = { id?: string; unit_id: string; title: string; kind: LessonKind; xp: number }

// Module-level mock store — persists for the dev server's lifetime.
const MOCK_UNITS: Omit<CUnit, "lessons">[] = [
  { id: "u1", course_id: "c1", title: "รู้จัก ChatGPT", order_index: 1 },
  { id: "u2", course_id: "c1", title: "ให้ AI สวมบทบาท", order_index: 2 },
]
const MOCK_LESSONS: CLesson[] = [
  { id: "ls1", unit_id: "u1", title: "ChatGPT คืออะไร", kind: "lesson", xp: 10, order_index: 1 },
  { id: "ls2", unit_id: "u1", title: "เริ่มใช้งานครั้งแรก", kind: "lesson", xp: 10, order_index: 2 },
  { id: "ls3", unit_id: "u1", title: "ควิซ: ความเข้าใจพื้นฐาน", kind: "quiz", xp: 15, order_index: 3 },
  { id: "ls4", unit_id: "u1", title: "เขียนพรอมป์แรก", kind: "lesson", xp: 10, order_index: 4 },
  { id: "ls5", unit_id: "u2", title: "ทำไมต้องให้บทบาท", kind: "lesson", xp: 10, order_index: 1 },
  { id: "ls6", unit_id: "u2", title: "เช็คพอยต์ประจำบท", kind: "check", xp: 30, order_index: 2 },
]

async function assertAdmin() {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
}

export async function getCourseContent(courseId: string): Promise<CUnit[]> {
  if (isDevMock()) {
    return MOCK_UNITS.filter((u) => u.course_id === courseId).sort((a, b) => a.order_index - b.order_index)
      .map((u) => ({ ...u, lessons: MOCK_LESSONS.filter((l) => l.unit_id === u.id).sort((a, b) => a.order_index - b.order_index) }))
  }
  const supabase = await createClient()
  const { data: units } = await supabase.from("course_units").select("*").eq("course_id", courseId).order("order_index")
  const { data: lessons } = await supabase.from("course_lessons").select("*").order("order_index")
  const all = (lessons ?? []) as CLesson[]
  return ((units ?? []) as Omit<CUnit, "lessons">[]).map((u) => ({ ...u, lessons: all.filter((l) => l.unit_id === u.id) }))
}

export async function saveUnit(input: UnitInput): Promise<void> {
  if (isDevMock()) {
    if (input.id) { const u = MOCK_UNITS.find((x) => x.id === input.id); if (u) u.title = input.title }
    else MOCK_UNITS.push({ id: `u${Date.now()}`, course_id: input.course_id, title: input.title, order_index: MOCK_UNITS.filter((u) => u.course_id === input.course_id).length + 1 })
    return
  }
  await assertAdmin()
  const supabase = await createClient()
  if (input.id) await supabase.from("course_units").update({ title: input.title }).eq("id", input.id)
  else await supabase.from("course_units").insert({ course_id: input.course_id, title: input.title })
}

export async function deleteUnit(id: string): Promise<void> {
  if (isDevMock()) {
    const i = MOCK_UNITS.findIndex((u) => u.id === id)
    if (i >= 0) MOCK_UNITS.splice(i, 1)
    for (let j = MOCK_LESSONS.length - 1; j >= 0; j--) if (MOCK_LESSONS[j].unit_id === id) MOCK_LESSONS.splice(j, 1)
    return
  }
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("course_units").delete().eq("id", id) // cascades to lessons
}

export async function saveLesson(input: LessonInput): Promise<void> {
  if (isDevMock()) {
    if (input.id) { const l = MOCK_LESSONS.find((x) => x.id === input.id); if (l) { l.title = input.title; l.kind = input.kind; l.xp = input.xp } }
    else MOCK_LESSONS.push({ id: `ls${Date.now()}`, unit_id: input.unit_id, title: input.title, kind: input.kind, xp: input.xp, order_index: MOCK_LESSONS.filter((l) => l.unit_id === input.unit_id).length + 1 })
    return
  }
  await assertAdmin()
  const supabase = await createClient()
  const row = { unit_id: input.unit_id, title: input.title, kind: input.kind, xp: input.xp }
  if (input.id) await supabase.from("course_lessons").update(row).eq("id", input.id)
  else await supabase.from("course_lessons").insert(row)
}

export async function deleteLesson(id: string): Promise<void> {
  if (isDevMock()) { const i = MOCK_LESSONS.findIndex((l) => l.id === id); if (i >= 0) MOCK_LESSONS.splice(i, 1); return }
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("course_lessons").delete().eq("id", id)
}
