import { isDevMock } from "./mock-user"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type CourseStatus = "published" | "draft" | "queued"
export type Course = {
  id: string
  title: string
  description: string
  tool: string
  level: "beginner" | "intermediate" | "advanced"
  status: CourseStatus
  units: number
  lessons: number
  order_index: number
}

export type CourseInput = {
  id?: string
  title: string
  description: string
  tool: string
  level: Course["level"]
  status?: CourseStatus
}

// Module-level mock store — mutations persist for the dev server's lifetime.
const MOCK_COURSES: Course[] = [
  { id: "c1", title: "ChatGPT พื้นฐาน", description: "รู้จัก ChatGPT และเขียนพรอมป์แรก", tool: "ChatGPT", level: "beginner", status: "published", units: 20, lessons: 64, order_index: 1 },
  { id: "c2", title: "เขียน Prompt ระดับโปร", description: "เทคนิคพรอมป์ขั้นสูง", tool: "Midjourney", level: "intermediate", status: "published", units: 18, lessons: 52, order_index: 2 },
  { id: "c3", title: "Claude สำหรับงานเอกสาร", description: "สรุปและเขียนเอกสารยาว ๆ", tool: "Claude", level: "beginner", status: "published", units: 16, lessons: 48, order_index: 3 },
  { id: "c4", title: "Gemini & การค้นคว้า", description: "ค้นคว้าและทำงานกับ Google", tool: "Gemini", level: "intermediate", status: "draft", units: 14, lessons: 0, order_index: 4 },
  { id: "c5", title: "Midjourney สร้างภาพ", description: "เปลี่ยนคำเป็นภาพสวย ๆ", tool: "Midjourney", level: "advanced", status: "draft", units: 16, lessons: 0, order_index: 5 },
  { id: "c6", title: "Runway วิดีโอ", description: "ตัดต่อวิดีโอด้วย AI", tool: "Runway", level: "advanced", status: "queued", units: 0, lessons: 0, order_index: 6 },
]

export async function getCourses(): Promise<Course[]> {
  if (isDevMock()) return MOCK_COURSES.map((c) => ({ ...c })).sort((a, b) => a.order_index - b.order_index)
  const supabase = await createClient()
  const { data } = await supabase.from("courses").select("*").order("order_index", { ascending: true })
  return (data as Course[]) ?? []
}

export async function getCourse(id: string): Promise<Course | null> {
  if (isDevMock()) { const c = MOCK_COURSES.find((x) => x.id === id); return c ? { ...c } : null }
  const supabase = await createClient()
  const { data } = await supabase.from("courses").select("*").eq("id", id).maybeSingle()
  return (data as Course) ?? null
}

export async function saveCourse(input: CourseInput): Promise<void> {
  if (isDevMock()) {
    if (input.id) {
      const c = MOCK_COURSES.find((x) => x.id === input.id)
      if (c) Object.assign(c, { title: input.title, description: input.description, tool: input.tool, level: input.level, status: input.status ?? c.status })
    } else {
      MOCK_COURSES.push({
        id: `c${Date.now()}`, title: input.title, description: input.description, tool: input.tool,
        level: input.level, status: input.status ?? "draft", units: 0, lessons: 0,
        order_index: MOCK_COURSES.length + 1,
      })
    }
    return
  }
  // Admin-only — RLS also enforces this server-side.
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
  const supabase = await createClient()
  const row = { title: input.title, description: input.description, tool: input.tool, level: input.level, status: input.status ?? "draft", updated_at: new Date().toISOString() }
  if (input.id) await supabase.from("courses").update(row).eq("id", input.id)
  else await supabase.from("courses").insert(row)
}

export async function deleteCourse(id: string): Promise<void> {
  if (isDevMock()) {
    const i = MOCK_COURSES.findIndex((c) => c.id === id)
    if (i >= 0) MOCK_COURSES.splice(i, 1)
    return
  }
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
  const supabase = await createClient()
  await supabase.from("courses").delete().eq("id", id)
}
