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

type TheoryStep = Extract<LessonStep, { type: "theory" }>

function theoryText(steps: LessonStep[]) {
  return steps
    .filter((step): step is TheoryStep => step.type === "theory")
    .map((step) => `${step.title} ${step.body.map((part) => part.text).join("")} ${step.example}`)
    .join(" ")
}

function extractUrl(text: string) {
  const full = text.match(/https?:\/\/[^\s"'<>]+/i)?.[0]
  if (full) return full.replace(/[),.]+$/, "")
  const domain = text.match(/\b(?:chat\.openai\.com|chatgpt\.com|claude\.ai|gemini\.google\.com|lovable\.dev|suno\.com|runwayml\.com|midjourney\.com)\b/i)?.[0]
  return domain ? `https://${domain}` : undefined
}

function extractCommand(text: string) {
  const command = text.match(/(?:npm|npx|pnpm|yarn|pipx?|brew)\s+(?:install|add)(?:\s+-g)?\s+[a-z0-9@/._-]+/i)?.[0]
  return command?.trim()
}

function generatedActivity(
  steps: LessonStep[],
  courseSlug: string,
  lang: "th" | "en",
): LessonStep | null {
  const theories = steps.filter((step): step is TheoryStep => step.type === "theory")
  const source = theories.at(-1)
  const topic = theories[0]?.title ?? source?.title
  if (!source?.example) return null

  const text = theoryText(steps)
  const lowered = text.toLowerCase()
  const titleText = theories.map((step) => step.title).join(" ").toLowerCase()
  const strongSetupSignals = [
    "ติดตั้ง", "เริ่มใช้", "เริ่มต้น", "เข้าใช้งาน",
    "install", "getting started", "quick start", "sign in",
  ]
  const command = extractCommand(text)
  const href = extractUrl(text)
  const isSetup = Boolean(command)
    || strongSetupSignals.some((signal) => titleText.includes(signal))
    || (Boolean(href) && (lowered.includes("เข้าใช้งาน") || lowered.includes("web interface") || lowered.includes("log in")))

  if (isSetup) {
    return {
      type: "setup",
      tag: lang === "en" ? "Set up the tool" : "เตรียมเครื่องมือ",
      title: lang === "en" ? `Get ready to use ${courseSlug.replaceAll("-", " ")}` : "เตรียมเครื่องมือให้พร้อมก่อนลองทำ",
      instruction: lang === "en"
        ? "Follow only the steps that apply to you. If the tool is already ready, confirm and continue. If you cannot install it now, you can skip this setup without getting stuck."
        : "ทำเฉพาะขั้นตอนที่ตรงกับคุณ หากพร้อมใช้งานแล้วให้กดยืนยันและเรียนต่อได้เลย หากยังติดตั้งไม่ได้ตอนนี้สามารถข้ามการตั้งค่าไว้ก่อนได้",
      steps: command
        ? (lang === "en"
          ? ["Open Terminal or Command Prompt.", "Run the installation command below.", "Open the tool once to confirm it works."]
          : ["เปิด Terminal หรือ Command Prompt", "รันคำสั่งติดตั้งด้านล่าง", "เปิดเครื่องมือหนึ่งครั้งเพื่อตรวจว่าใช้งานได้"])
        : (lang === "en"
          ? ["Open the official website.", "Sign in or create an account if needed.", "Confirm that you can reach the main workspace."]
          : ["เปิดเว็บไซต์ทางการ", "เข้าสู่ระบบหรือสมัครบัญชีหากจำเป็น", "ตรวจว่าสามารถเข้าถึงหน้าทำงานหลักได้"]),
      command,
      href,
      hrefLabel: lang === "en" ? "Open official website" : "เปิดเว็บไซต์ทางการ",
    }
  }

  return {
    type: "try",
    tag: lang === "en" ? "Try it in the real tool" : "ลองทำในเครื่องมือจริง",
    title: lang === "en" ? `Try: ${topic}` : `ลองทำ: ${topic}`,
    instruction: lang === "en"
      ? "Use the example below in the tool from this lesson. Observe what happens, then return here. This activity checks the skill taught here instead of making you rewrite an unrelated prompt."
      : "นำตัวอย่างด้านล่างไปลองในเครื่องมือของบทนี้ สังเกตผลที่เกิดขึ้น แล้วกลับมาเรียนต่อ กิจกรรมนี้จะให้ลองทักษะของบทโดยตรง ไม่บังคับแก้ prompt ที่ไม่เกี่ยวข้อง",
    example: source.example,
    checks: lowered.includes("download") || lowered.includes("ดาวน์โหลด")
      ? (lang === "en"
        ? ["I found the download/export control", "I checked the available file format", "I checked the usage rights before publishing"]
        : ["หาปุ่มดาวน์โหลดหรือ Export เจอแล้ว", "ตรวจรูปแบบไฟล์ที่เลือกได้แล้ว", "ตรวจสิทธิ์การใช้งานก่อนนำไปเผยแพร่แล้ว"])
      : (lang === "en"
        ? ["I tried the example", "I compared the result with the lesson", "I know where to use this feature"]
        : ["ลองทำตามตัวอย่างแล้ว", "เปรียบเทียบผลกับสิ่งที่บทเรียนอธิบายแล้ว", "รู้แล้วว่าฟีเจอร์นี้เหมาะใช้เมื่อไร"]),
  }
}

export async function getLessonSteps(
  courseSlug: string,
  lessonNum: number,
  lang: "th" | "en" = "th",
): Promise<LessonStep[] | null> {
  if (!SLUG_RE.test(courseSlug)) return null
  if (!Number.isInteger(lessonNum) || lessonNum < 1 || lessonNum > 99) return null

  const n = String(lessonNum).padStart(2, "0")
  const base = path.join(process.cwd(), "content", "lessons", courseSlug)
  // English lessons live in a parallel `en/` folder; fall back to the Thai
  // original whenever a translation hasn't been written yet, so the lesson
  // never renders empty while content is being translated incrementally.
  const candidates = lang === "en"
    ? [path.join(base, "en", `${n}.json`), path.join(base, `${n}.json`)]
    : [path.join(base, `${n}.json`)]
  try {
    let raw: string | null = null
    for (const f of candidates) {
      try { raw = await readFile(f, "utf-8"); break } catch { /* try next */ }
    }
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    const steps = parsed as LessonStep[]
    const correctPrefix = lang === "en"
      ? "Correct. The best answer is"
      : "ถูกต้อง คำตอบที่เหมาะที่สุดคือ"
    const incorrectPrefix = lang === "en"
      ? "Not quite. Compare your choice with"
      : "ยังไม่ใช่ ลองเปรียบเทียบคำตอบของคุณกับ"

    for (const step of steps) {
      if ("mascot" in step) (step as { mascot?: string }).mascot = normalizeMascot((step as { mascot?: string }).mascot)
      // Shuffle quiz answer options (Fisher-Yates) so the correct one isn't
      // always in the same slot. Done server-side per request → no client
      // randomness / hydration mismatch. The `correct` flag rides each option.
      if (step.type === "quiz" && Array.isArray(step.options) && step.options.length > 1) {
        const correct = step.options.find((option) => option.correct)?.text ?? ""
        step.correctFeedback ??= lang === "en"
          ? `${correctPrefix} “${correct}” because it addresses the question more directly and completely than the alternatives.`
          : `${correctPrefix} “${correct}” เพราะตอบโจทย์ได้ตรงและครบกว่าตัวเลือกอื่น`
        step.incorrectFeedback ??= lang === "en"
          ? `${incorrectPrefix} “${correct}” and notice which part of the question it answers more precisely.`
          : `${incorrectPrefix} “${correct}” แล้วสังเกตว่าคำตอบนี้ตรงกับโจทย์ส่วนใดมากกว่า`
        const o = step.options
        for (let i = o.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[o[i], o[j]] = [o[j], o[i]]
        }
      }
    }

    // Daily lessons should not force learners to write a prompt for every topic.
    // If authors want a real writing exercise, they can add an explicit
    // `practice` step in the lesson JSON. Otherwise, we add a light setup/try
    // activity that matches the lesson and avoids an unrelated prompt editor.
    if (!steps.some((step) => step.type === "practice" || step.type === "setup" || step.type === "try")) {
      const quizIndex = steps.findIndex((step) => step.type === "quiz")
      const activity = generatedActivity(steps, courseSlug, lang)
      if (activity && quizIndex >= 0) steps.splice(quizIndex, 0, activity)
    }

    return steps
  } catch {
    return null
  }
}

export async function getCareerLessonSteps(
  pathSlug: string,
  stepNum: number,
  lang: "th" | "en" = "th",
): Promise<LessonStep[] | null> {
  if (!SLUG_RE.test(pathSlug)) return null
  if (!Number.isInteger(stepNum) || stepNum < 1 || stepNum > 99) return null

  const n = String(stepNum).padStart(2, "0")
  const base = path.join(process.cwd(), "content", "career-paths", pathSlug)
  const candidates = lang === "en"
    ? [path.join(base, "en", `${n}.json`), path.join(base, `${n}.json`)]
    : [path.join(base, `${n}.json`)]

  try {
    let raw: string | null = null
    for (const f of candidates) {
      try { raw = await readFile(f, "utf-8"); break } catch { /* try next */ }
    }
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    const steps = parsed as LessonStep[]
    for (const step of steps) {
      if ("mascot" in step) (step as { mascot?: string }).mascot = normalizeMascot((step as { mascot?: string }).mascot)
    }
    return steps
  } catch {
    return null
  }
}
