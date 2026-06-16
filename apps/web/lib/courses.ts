import { cache } from "react"
import { unstable_cache, revalidateTag } from "next/cache"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"
import { publicClient } from "./supabase/public"
import { locField, type Lang } from "./i18n-core"

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
  /** Hidden from the Daily Learn grid when false (still usable in career paths). */
  showInDaily: boolean
  /** Only Pro/admin can open the course when true. */
  isPro: boolean
}

// Maps a raw DB row (snake_case, flags may be absent pre-migration) to Course.
// `lang` selects the *_en title/description with Thai fallback.
function toCourse(r: Record<string, unknown>, lang: Lang = "th"): Course {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: locField(r, "title", lang),
    description: locField(r, "description", lang),
    tool: r.tool as string,
    level: r.level as Course["level"],
    status: r.status as CourseStatus,
    units: (r.units as number) ?? 0,
    lessons: (r.lessons as number) ?? 0,
    order_index: (r.order_index as number) ?? 99,
    showInDaily: r.show_in_daily !== false, // default true if column missing
    isPro: r.is_pro === true,
  }
}

export type CourseInput = {
  id?: string
  title: string
  description: string
  tool: string
  level: Course["level"]
  status?: CourseStatus
  showInDaily?: boolean
  isPro?: boolean
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i


/**
 * Published courses for user-facing pages, cached ACROSS requests: one
 * Supabase query serves every visitor for 5 minutes (or until an admin save
 * revalidates the "courses" tag). Keeps free-tier egress flat as traffic
 * grows. RLS on the anon client already filters to published rows.
 */
export const getPublishedCourses = unstable_cache(
  async (lang: Lang = "th"): Promise<Course[]> => {
    const { data } = await publicClient.from("courses").select("*").order("order_index", { ascending: true })
    return ((data as Record<string, unknown>[]) ?? []).map((r) => toCourse(r, lang))
  },
  ["published-courses"],
  { revalidate: 300, tags: ["courses"] },
)

/** Cached single published course by slug or uuid (same caching as above). */
export const getPublishedCourse = unstable_cache(
  async (id: string, lang: Lang = "th"): Promise<Course | null> => {
    const column = UUID_RE.test(id) ? "id" : "slug"
    const { data } = await publicClient.from("courses").select("*").eq(column, id).maybeSingle()
    return data ? toCourse(data as Record<string, unknown>, lang) : null
  },
  ["published-course"],
  { revalidate: 300, tags: ["courses"] },
)

// Admin-facing reads (drafts included) — authed client, per-request memo only.
export const getCourses = cache(async (): Promise<Course[]> => {
  const supabase = await createClient()
  const { data } = await supabase.from("courses").select("*").order("order_index", { ascending: true })
  return ((data as Record<string, unknown>[]) ?? []).map((r) => toCourse(r))
})

export const getCourse = cache(async (id: string): Promise<Course | null> => {
  const supabase = await createClient()
  // courses.id is uuid — filtering it with a non-uuid string makes Postgres
  // reject the whole query, so pick the column by the shape of the input.
  const column = UUID_RE.test(id) ? "id" : "slug"
  const { data } = await supabase.from("courses").select("*").eq(column, id).maybeSingle()
  return data ? toCourse(data as Record<string, unknown>) : null
})

function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export async function saveCourse(input: CourseInput): Promise<void> {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
  const supabase = await createClient()
  const row: Record<string, unknown> = { title: input.title, description: input.description, tool: input.tool, level: input.level, status: input.status ?? "draft", updated_at: new Date().toISOString() }
  // Only set the visibility flags when provided, so the columns are optional
  // until migrations 017/019 are applied (avoids insert errors pre-migration).
  if (input.showInDaily !== undefined) row.show_in_daily = input.showInDaily
  if (input.isPro !== undefined) row.is_pro = input.isPro
  if (input.id) {
    // Slug stays fixed after creation — it keys progress rows and lesson files.
    await supabase.from("courses").update(row).eq("id", input.id)
  } else {
    const slug = slugify(input.title) || `course-${Date.now().toString(36)}`
    const { error } = await supabase.from("courses").insert({ ...row, slug })
    // Slug collision: retry once with a unique suffix
    if (error) await supabase.from("courses").insert({ ...row, slug: `${slug}-${Date.now().toString(36)}` })
  }
  revalidateTag("courses", "max")
}

export async function deleteCourse(id: string): Promise<void> {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
  const supabase = await createClient()
  await supabase.from("courses").delete().eq("id", id)
  revalidateTag("courses", "max")
}
