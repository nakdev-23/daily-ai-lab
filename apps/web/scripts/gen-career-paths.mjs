// Generates migration 021: NEW career paths (Automation, Students, Writing,
// Productivity, Music, Video, Image) with steps mapped to REAL lesson content.
// Step titles come from: existing courses (fetched from the live DB) + the new
// media/daily courses (inlined here, matching the gen-*-courses.mjs scripts).
// Output is pure SQL so it slots into the migration workflow (run after 018+020).
// Run: node scripts/gen-career-paths.mjs
import fs from "node:fs"
import path from "node:path"

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL, SR = env.SUPABASE_SERVICE_ROLE_KEY
const H = { apikey: SR, Authorization: `Bearer ${SR}` }
const get = async (q) => {
  const r = await fetch(`${URL_}/rest/v1/${q}`, { headers: H })
  if (!r.ok) throw new Error(`GET ${q}: ${r.status}`)
  return r.json()
}

// ── lesson registry: slug -> [{title, kind, xp}] in display order ─────────────
// New courses inlined (DB rows not applied yet when this runs). kind uses the
// course_lessons vocabulary: lesson | quiz | check | project.
const L = (title, kind = "lesson", xp = 10) => ({ title, kind, xp })
const NEW_COURSES = {
  "suno-basic": [
    L("Suno คืออะไร"), L("เริ่มเพลงแรกใน Simple Mode"), L("เขียนคำอธิบายสไตล์ให้แม่น"),
    L("เขียนเนื้อเพลง (Lyrics)"), L("Custom Mode: คุมทุกอย่าง", "quiz", 15),
    L("โครงสร้างเพลงที่ฟังดูเป็นมืออาชีพ"), L("Extend และ Remix ต่อยอดเพลง"), L("เผยแพร่และลิขสิทธิ์", "check", 30),
  ],
  "runway-basic": [
    L("Runway คืออะไร"), L("Text-to-Video คลิปแรก"), L("คุมมุมกล้องและการเคลื่อนไหว"),
    L("Image-to-Video ทำภาพนิ่งให้ขยับ"), L("Motion Brush คุมการเคลื่อนเฉพาะจุด", "quiz", 15),
    L("ต่อคลิปและคุมความต่อเนื่อง"), L("เสียงและการ Export"), L("ทำคลิปโฆษณาสั้น 1 ชิ้น", "project", 40),
  ],
  "midjourney-basic": [
    L("Midjourney คืออะไร"), L("คำสั่ง /imagine แรก"), L("โครงสร้าง Prompt ที่ดี"),
    L("พารามิเตอร์: --ar --v --style"), L("Image Prompt และภาพอ้างอิง", "quiz", 15),
    L("Vary, Upscale และ Remix"), L("คุมสไตล์ให้สม่ำเสมอ (--sref --cref)"), L("นำภาพไปใช้จริงและลิขสิทธิ์", "check", 30),
  ],
  "lovable-basic": [
    L("Lovable คืออะไร"), L("สร้างแอปแรกจาก prompt"), L("แก้ไขและปรับ UI ด้วยแชต"),
    L("เชื่อมฐานข้อมูลเก็บข้อมูลจริง"), L("ทำระบบล็อกอินเบื้องต้น", "quiz", 15), L("เผยแพร่และข้อจำกัด", "check", 30),
  ],
  "grok-basic": [
    L("Grok คืออะไร"), L("ถามข่าวและเหตุการณ์ปัจจุบัน"), L("สร้างภาพและความสามารถอื่น"), L("ตรวจสอบข้อมูลและใช้อย่างรับผิดชอบ", "check", 30),
  ],
}

// ── new paths: module = { title, course, from, to } (lesson range, 1-based) ───
// tone: violet|mint|pink|sky|sun|blue ; isPro gates the whole path.
const PATHS = [
  {
    slug: "ai-for-automation", title: "AI for Automation", tag: "ใหม่", tone: "sky", isPro: true,
    desc: "ใช้ AI ลดงานซ้ำและสร้างระบบอัตโนมัติ ตั้งแต่พรอมป์เป็นขั้น เขียนสคริปต์ ไปจนถึงเชื่อมเครื่องมือด้วย MCP",
    tools: ["ChatGPT", "Gemini", "Claude"],
    modules: [
      { title: "พื้นฐานสั่งงาน AI ให้แม่น", course: "chatgpt-basic", from: 1, to: 6 },
      { title: "พรอมป์ขั้นสูงและทำงานหลายขั้น", course: "chatgpt-advanced", from: 1, to: 8 },
      { title: "เขียนสคริปต์อัตโนมัติด้วย AI", course: "codex-basic", from: 1, to: 8 },
      { title: "จัดการเอกสารและทีมด้วย Claude", course: "claude-cowork", from: 1, to: 8 },
    ],
  },
  {
    slug: "ai-for-students", title: "AI for Students", tag: "ใหม่", tone: "mint", isPro: false,
    desc: "ผู้ช่วยเรียนที่ใช้ได้จริง: สรุปเนื้อหา ติวสอบ ทำรายงาน และค้นคว้าอย่างมีวิจารณญาณ",
    tools: ["ChatGPT", "Claude", "Gemini"],
    modules: [
      { title: "เริ่มใช้ AI ช่วยเรียน", course: "chatgpt-basic", from: 1, to: 6 },
      { title: "สรุปและทำความเข้าใจเนื้อหา", course: "claude-basic", from: 1, to: 8 },
      { title: "ค้นคว้าและอ้างอิงอย่างถูกต้อง", course: "gemini-basic", from: 1, to: 8 },
    ],
  },
  {
    slug: "ai-for-writing", title: "AI for Writing", tag: "ใหม่", tone: "violet", isPro: false,
    desc: "เขียนงานทุกแบบให้เร็วและดีขึ้น: บทความ คอนเทนต์ อีเมล โดยคุมโทนและสไตล์ได้",
    tools: ["Claude", "ChatGPT"],
    modules: [
      { title: "พื้นฐานการเขียนกับ AI", course: "chatgpt-basic", from: 1, to: 6 },
      { title: "งานเขียนยาวและเรียบเรียงกับ Claude", course: "claude-basic", from: 1, to: 8 },
      { title: "ยกระดับงานเขียนขั้นสูง", course: "chatgpt-advanced", from: 1, to: 6 },
    ],
  },
  {
    slug: "ai-for-productivity", title: "AI for Productivity", tag: "ใหม่", tone: "sun", isPro: false,
    desc: "เพิ่มประสิทธิภาพงานประจำวัน: จัดการอีเมล สรุปประชุม วางแผนงาน และทำงานร่วมกับทีม",
    tools: ["ChatGPT", "Claude", "Gemini"],
    modules: [
      { title: "ใช้ AI กับงานประจำวัน", course: "chatgpt-basic", from: 1, to: 6 },
      { title: "ทำงานร่วมกับทีมด้วย Claude", course: "claude-cowork", from: 1, to: 8 },
      { title: "ค้นข้อมูลและตัดสินใจด้วย Gemini", course: "gemini-basic", from: 1, to: 6 },
    ],
  },
  {
    slug: "ai-for-music", title: "AI for Music", tag: "ใหม่", tone: "pink", isPro: true,
    desc: "ทำเพลงครบเพลงด้วย AI ตั้งแต่แต่งทำนอง เขียนเนื้อ ไปจนถึงโครงสร้างเพลงและเผยแพร่",
    tools: ["Suno", "ChatGPT"],
    modules: [
      { title: "เขียนเนื้อเพลงด้วย AI", course: "chatgpt-basic", from: 1, to: 4 },
      { title: "สร้างเพลงด้วย Suno", course: "suno-basic", from: 1, to: 8 },
    ],
  },
  {
    slug: "ai-for-video", title: "AI for Video", tag: "ใหม่", tone: "blue", isPro: true,
    desc: "ทำคลิปวิดีโอด้วย AI: วางสคริปต์ สร้างภาพเคลื่อนไหว คุมกล้อง และตัดต่อเป็นคลิปใช้งานได้จริง",
    tools: ["Runway", "ChatGPT", "Suno"],
    modules: [
      { title: "วางสคริปต์และไอเดียด้วย AI", course: "chatgpt-basic", from: 1, to: 4 },
      { title: "สร้างวิดีโอด้วย Runway", course: "runway-basic", from: 1, to: 8 },
    ],
  },
  {
    slug: "ai-for-image", title: "AI for Image & Design", tag: "ใหม่", tone: "violet", isPro: true,
    desc: "สร้างภาพคุณภาพสูงด้วย AI: เขียน prompt คุมสไตล์ พารามิเตอร์ และนำไปใช้งานแบรนด์จริง",
    tools: ["Midjourney", "Claude"],
    modules: [
      { title: "พื้นฐานสร้างภาพด้วย Midjourney", course: "midjourney-basic", from: 1, to: 5 },
      { title: "คุมสไตล์และใช้งานจริง", course: "midjourney-basic", from: 6, to: 8 },
      { title: "งานออกแบบและภาพประกอบกับ Claude", course: "claude-design", from: 1, to: 6 },
    ],
  },
]

const esc = (s) => s.replace(/'/g, "''")
// course_lessons.kind uses 'check'; path_steps.kind constraint wants 'checkpoint'.
const pathKind = (k) => (k === "check" ? "checkpoint" : k)

// build lesson registry: new (inline) + existing (from DB)
const registry = { ...NEW_COURSES }
const neededExisting = new Set()
for (const p of PATHS) for (const m of p.modules) if (!registry[m.course]) neededExisting.add(m.course)

for (const slug of neededExisting) {
  const courses = await get(`courses?select=id&slug=eq.${slug}`)
  if (!courses.length) throw new Error(`course not found in DB: ${slug}`)
  const units = await get(`course_units?select=id,order_index&course_id=eq.${courses[0].id}&order=order_index`)
  const lessons = []
  for (const u of units) {
    const ls = await get(`course_lessons?select=title,kind,xp,order_index&unit_id=eq.${u.id}&order=order_index`)
    for (const l of ls) lessons.push({ title: l.title, kind: l.kind, xp: l.xp })
  }
  registry[slug] = lessons
}

// validate ranges
for (const p of PATHS) for (const m of p.modules) {
  const have = (registry[m.course] ?? []).length
  if (have < m.to) throw new Error(`${p.slug}/${m.title}: ${m.course} has ${have} lessons, needs ${m.to}`)
}

// ── emit SQL ──────────────────────────────────────────────────────────────────
let sql = `-- Migration 021: new career paths with steps mapped to real lesson content
-- Generated by scripts/gen-career-paths.mjs — do not edit by hand.
-- Adds: AI for Automation, Students, Writing, Productivity, Music, Video, Image.
-- Each step's title/xp/kind mirror the underlying course lesson it opens.
-- Run AFTER migrations 018 + 020 (the courses these paths reference). Safe to re-run.

`

let orderIdx = 7 // existing paths use 1..6
for (const p of PATHS) {
  const steps = []
  for (const m of p.modules) {
    for (let n = m.from; n <= m.to; n++) {
      const lesson = registry[m.course][n - 1]
      steps.push({ module: m.title, course: m.course, lessonNum: n, ...lesson })
    }
  }
  const totalSteps = steps.length
  const weeks = Math.max(1, Math.ceil(totalSteps / 8))
  const toolsArr = `ARRAY[${p.tools.map((x) => `'${x}'`).join(",")}]`

  sql += `-- ═══ ${p.slug} ═══\n`
  sql += `delete from path_steps where module_id in (select id from path_modules where path_id in (select id from career_paths where slug='${p.slug}'));\n`
  sql += `delete from path_modules where path_id in (select id from career_paths where slug='${p.slug}');\n`
  sql += `insert into career_paths (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)\n`
  sql += `values ('${p.slug}', '${esc(p.title)}', '${esc(p.tag)}', '${esc(p.desc)}', '${p.tone}', ${toolsArr}, ${weeks}, ${p.isPro}, true, ${orderIdx})\n`
  sql += `on conflict (slug) do update set title=excluded.title, tag=excluded.tag, description=excluded.description, tone=excluded.tone, tools=excluded.tools, weeks=excluded.weeks, is_pro=excluded.is_pro, is_published=true, order_index=excluded.order_index;\n\n`

  // modules
  const mods = p.modules.map((m, mi) => ({ title: m.title, ord: mi + 1 }))
  sql += `insert into path_modules (path_id, title, order_index)\nselect cp.id, v.title, v.ord from career_paths cp, (values\n`
  sql += mods.map((m) => `  ('${esc(m.title)}', ${m.ord})`).join(",\n")
  sql += `\n) as v(title, ord) where cp.slug = '${p.slug}';\n\n`

  // steps (per module, ordered)
  sql += `insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index)\nselect m.id, v.title, v.kind, v.course_slug, v.lesson_num, v.xp, v.ord\nfrom path_modules m join career_paths cp on cp.id = m.path_id, (values\n`
  const rows = []
  p.modules.forEach((m, mi) => {
    let ord = 1
    for (let n = m.from; n <= m.to; n++) {
      const lesson = registry[m.course][n - 1]
      rows.push(`  (${mi + 1}, '${esc(lesson.title)}', '${pathKind(lesson.kind)}', '${m.course}', ${n}, ${lesson.xp}, ${ord++})`)
    }
  })
  sql += rows.join(",\n")
  sql += `\n) as v(mord, title, kind, course_slug, lesson_num, xp, ord)\nwhere cp.slug = '${p.slug}' and m.order_index = v.mord;\n\n`
  orderIdx++
}

fs.writeFileSync(path.join(process.cwd(), "supabase", "migrations", "021_new_career_paths.sql"), sql)
console.log(`Wrote migration 021: ${PATHS.length} new career paths.`)
PATHS.forEach((p) => {
  const n = p.modules.reduce((s, m) => s + (m.to - m.from + 1), 0)
  console.log(`  ${p.slug}: ${p.modules.length} modules, ${n} steps${p.isPro ? " (PRO)" : ""}`)
})
