import { readFile } from "fs/promises"
import path from "path"
import type { LessonStep } from "./lesson-types"

// Slugs become filesystem path segments — never allow separators or dots.
const SLUG_RE = /^[a-z0-9-]+$/

export async function getLessonSteps(
  courseSlug: string,
  lessonNum: number,
): Promise<LessonStep[] | null> {
  if (!SLUG_RE.test(courseSlug)) return null
  if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > 99) return null

  const n = String(lessonNum).padStart(2, "0")
  const filePath = path.join(process.cwd(), "content", "lessons", courseSlug, `${n}.json`)
  try {
    const raw = await readFile(filePath, "utf-8")
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    return parsed as LessonStep[]
  } catch {
    return null
  }
}
