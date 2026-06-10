import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type CourseStatus = "published" | "draft" | "queued"
export type Course = {
  id: string
  slug: string
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("courses").select("*").order("order_index", { ascending: true })
  return (data as Course[]) ?? []
}

export async function getCourse(id: string): Promise<Course | null> {
  const supabase = await createClient()
  // courses.id is uuid — filtering it with a non-uuid string makes Postgres
  // reject the whole query, so pick the column by the shape of the input.
  const column = UUID_RE.test(id) ? "id" : "slug"
  const { data } = await supabase.from("courses").select("*").eq(column, id).maybeSingle()
  return (data as Course) ?? null
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export async function saveCourse(input: CourseInput): Promise<void> {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
  const supabase = await createClient()
  const row = { title: input.title, description: input.description, tool: input.tool, level: input.level, status: input.status ?? "draft", updated_at: new Date().toISOString() }
  if (input.id) {
    // Slug stays fixed after creation — it keys progress rows and lesson files.
    await supabase.from("courses").update(row).eq("id", input.id)
  } else {
    const slug = slugify(input.title) || `course-${Date.now().toString(36)}`
    const { error } = await supabase.from("courses").insert({ ...row, slug })
    // Slug collision: retry once with a unique suffix
    if (error) await supabase.from("courses").insert({ ...row, slug: `${slug}-${Date.now().toString(36)}` })
  }
}

export async function deleteCourse(id: string): Promise<void> {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
  const supabase = await createClient()
  await supabase.from("courses").delete().eq("id", id)
}
