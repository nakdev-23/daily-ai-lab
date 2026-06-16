// Rebuild career-path curricula from REAL course content.
// Bug being fixed: path_steps had career-flavored titles but every step pointed
// at the same generic lessons (mostly chatgpt-basic 1..n) — and some at
// unpublished courses. After this, every step's title/xp/kind IS the actual
// lesson it opens, and each career mixes different published courses.
// Usage: node scripts/rebuild-career-paths.mjs
import fs from "node:fs"

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const SR = env.SUPABASE_SERVICE_ROLE_KEY
const H = { apikey: SR, Authorization: `Bearer ${SR}`, "Content-Type": "application/json" }

async function get(q) {
  const r = await fetch(`${URL_}/rest/v1/${q}`, { headers: H })
  if (!r.ok) throw new Error(`GET ${q}: ${r.status} ${await r.text()}`)
  return r.json()
}
async function del(q) {
  const r = await fetch(`${URL_}/rest/v1/${q}`, { method: "DELETE", headers: { ...H, Prefer: "return=minimal" } })
  if (!r.ok) throw new Error(`DELETE ${q}: ${r.status} ${await r.text()}`)
}
async function post(table, body) {
  const r = await fetch(`${URL_}/rest/v1/${table}`, { method: "POST", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(`POST ${table}: ${r.status} ${await r.text()}`)
  return r.json()
}
async function patch(q, body) {
  const r = await fetch(`${URL_}/rest/v1/${q}`, { method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(`PATCH ${q}: ${r.status} ${await r.text()}`)
}

// ── 1. Load real course content (published only), flattened in display order ──
const courses = await get("courses?select=id,slug,status&status=eq.published")
const allUnits = await get("course_units?select=id,course_id,order_index&order=order_index")
const allLessons = await get("course_lessons?select=id,unit_id,title,kind,xp,order_index&order=order_index&limit=2000")

const lessonsByCourseSlug = {}
for (const c of courses) {
  const unitIds = allUnits.filter((u) => u.course_id === c.id).map((u) => u.id)
  const flat = []
  for (const uid of unitIds) {
    for (const l of allLessons.filter((l) => l.unit_id === uid)) flat.push(l)
  }
  lessonsByCourseSlug[c.slug] = flat // index i → lesson_num i+1
}

const KIND = { lesson: "lesson", quiz: "quiz", check: "checkpoint", project: "project" }

// ── 2. Career curricula: modules = ranges of real courses ──
// range = [courseSlug, fromLessonNum, toLessonNum] (1-based, inclusive)
const CURRICULA = {
  "prompt-engineer": {
    tools: ["ChatGPT", "Claude", "Gemini"],
    modules: [
      ["พื้นฐานพรอมป์กับ ChatGPT", "chatgpt-basic", 1, 8],
      ["เทคนิคพรอมป์ขั้นกลาง", "chatgpt-basic", 9, 15],
      ["พรอมป์ขั้นสูง", "chatgpt-advanced", 1, 8],
      ["ข้ามโมเดล: Claude", "claude-basic", 1, 7],
      ["ข้ามโมเดล: Gemini", "gemini-basic", 1, 7],
    ],
  },
  "ai-content-creator": {
    tools: ["ChatGPT", "Claude"],
    modules: [
      ["พื้นฐานการเขียนกับ AI", "chatgpt-basic", 1, 8],
      ["งานเขียนยาวกับ Claude", "claude-basic", 1, 8],
      ["งานภาพและดีไซน์กับ Claude", "claude-design", 1, 12],
      ["ยกระดับคอนเทนต์ขั้นสูง", "chatgpt-advanced", 1, 7],
    ],
  },
  "ai-for-marketing": {
    tools: ["ChatGPT", "Gemini"],
    modules: [
      ["พื้นฐาน ChatGPT สำหรับนักการตลาด", "chatgpt-basic", 1, 8],
      ["เทคนิคขั้นสูงเพื่อแคมเปญ", "chatgpt-advanced", 1, 8],
      ["รีเสิร์ชตลาดด้วย Gemini", "gemini-basic", 1, 8],
      ["วิเคราะห์ข้อมูลระดับโปร", "gemini-advanced", 1, 6],
    ],
  },
  "ai-for-business": {
    tools: ["Claude", "Gemini"],
    modules: [
      ["เอกสารธุรกิจกับ Claude", "claude-basic", 1, 8],
      ["ทำงานร่วมกับทีมด้วย Claude", "claude-cowork", 1, 12],
      ["รีเสิร์ชและตัดสินใจด้วย Gemini", "gemini-basic", 1, 8],
      ["เครื่องมือเสริมรอบตัว", "claude-other", 1, 6],
    ],
  },
  "ai-developer": {
    tools: ["ChatGPT", "Claude"],
    modules: [
      ["เริ่มเขียนโค้ดกับ AI", "codex-basic", 1, 6],
      ["สร้างงานจริงด้วย Codex", "codex-basic", 7, 12],
      ["พรอมป์ขั้นสูงสำหรับนักพัฒนา", "chatgpt-advanced", 1, 8],
      ["ผู้ช่วยเขียนเอกสารโค้ด", "claude-basic", 1, 6],
    ],
  },
  "ai-for-teacher": {
    tools: ["ChatGPT", "Gemini"],
    modules: [
      ["พื้นฐาน AI สำหรับครู", "chatgpt-basic", 1, 8],
      ["สื่อการสอนและเวิร์กชีต", "chatgpt-basic", 9, 15],
      ["ค้นคว้าเตรียมสอนด้วย Gemini", "gemini-basic", 1, 8],
      ["ผู้ช่วยตรวจงานและสรุป", "claude-basic", 1, 6],
    ],
  },
}

// ── 3. Rebuild each path ──
const paths = await get("career_paths?select=id,slug")
for (const p of paths) {
  const cur = CURRICULA[p.slug]
  if (!cur) { console.log(`skip ${p.slug} (no curriculum defined)`); continue }

  // sanity: every referenced lesson must exist
  for (const [, slug, from, to] of cur.modules) {
    const have = (lessonsByCourseSlug[slug] ?? []).length
    if (have < to) throw new Error(`${p.slug}: ${slug} has ${have} lessons, needs ${to}`)
  }

  // wipe old modules (steps cascade via FK; delete explicitly to be safe)
  const oldMods = await get(`path_modules?select=id&path_id=eq.${p.id}`)
  if (oldMods.length) {
    const ids = oldMods.map((m) => m.id).join(",")
    await del(`path_steps?module_id=in.(${ids})`)
    await del(`path_modules?path_id=eq.${p.id}`)
  }

  let totalSteps = 0
  for (let mi = 0; mi < cur.modules.length; mi++) {
    const [title, slug, from, to] = cur.modules[mi]
    const [mod] = await post("path_modules", { path_id: p.id, title, order_index: mi + 1 })
    const steps = []
    for (let n = from; n <= to; n++) {
      const lesson = lessonsByCourseSlug[slug][n - 1]
      steps.push({
        module_id: mod.id,
        title: lesson.title,                 // the REAL lesson title — what you click is what you get
        kind: KIND[lesson.kind] ?? "lesson",
        course_slug: slug,
        lesson_num: n,
        xp: lesson.xp ?? 10,
        order_index: steps.length + 1,
      })
    }
    await post("path_steps", steps)
    totalSteps += steps.length
  }

  await patch(`career_paths?id=eq.${p.id}`, { tools: cur.tools, weeks: Math.max(1, Math.ceil(totalSteps / 10)) })
  console.log(`${p.slug}: ${cur.modules.length} modules, ${totalSteps} steps ✓`)
}
console.log("done")
