import { readFile } from "fs/promises"
import path from "path"
import type { LessonStep } from "./lesson-types"

// Slugs become filesystem path segments — never allow separators or dots.
const SLUG_RE = /^[a-z0-9-]+$/

// Mascot poses that actually exist in /public/assets/daily-ai-lab/mascot-ds.
// Content JSON sometimes references poses that were never drawn (mascot-think
// shipped in 65 steps and rendered as a broken image) — normalize every name
// here so an unknown pose degrades to a valid one instead of a 404.
const VALID_MASCOTS = new Set([
  "cockatiel-superhero", "mascot-celebrate", "mascot-fly", "mascot-hello",
  "mascot-laptop", "mascot-ohno", "mascot-point", "mascot-read",
  "mascot-sad", "mascot-sad-sit", "mascot-thumbsup", "mascot-wave",
])
const MASCOT_ALIASES: Record<string, string> = {
  "mascot-think": "mascot-read", // no "think" art exists; reading pose fits the pondering beats
}
function normalizeMascot(name: unknown): string | undefined {
  if (typeof name !== "string" || !name) return undefined
  const mapped = MASCOT_ALIASES[name] ?? name
  return VALID_MASCOTS.has(mapped) ? mapped : "mascot-read"
}

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
    const steps = parsed as LessonStep[]
    for (const step of steps) {
      if ("mascot" in step) (step as { mascot?: string }).mascot = normalizeMascot((step as { mascot?: string }).mascot)
      // Shuffle quiz answer options (Fisher-Yates) so the correct one isn't
      // always in the same slot. Done server-side per request → no client
      // randomness / hydration mismatch. The `correct` flag rides each option.
      if (step.type === "quiz" && Array.isArray(step.options) && step.options.length > 1) {
        const o = step.options
        for (let i = o.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[o[i], o[j]] = [o[j], o[i]]
        }
      }
    }
    return steps
  } catch {
    return null
  }
}
