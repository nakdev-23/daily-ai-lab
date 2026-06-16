// Post-migration health check. Run AFTER applying migrations 017–021 in the
// Supabase SQL Editor to confirm every new course + career path seeded, flags
// are right, and lesson content files exist. Run: node scripts/verify-content.mjs
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
  if (!r.ok) return { __error: `${r.status} ${await r.text()}` }
  return r.json()
}
let pass = 0, fail = 0
const ok = (c, m) => { console.log(`${c ? "  ✓" : "  ✗"} ${m}`); c ? pass++ : fail++ }

console.log("\n── COURSES ──")
const courses = await get("courses?select=slug,status,show_in_daily,is_pro,lessons")
if (courses.__error) { console.log("  ✗ courses query failed:", courses.__error, "\n  → did you run migrations 017 + 019 (add columns)?"); process.exit(1) }
const bySlug = Object.fromEntries(courses.map((c) => [c.slug, c]))
const EXPECT_COURSES = {
  "suno-basic": { show_in_daily: false, is_pro: false },
  "runway-basic": { show_in_daily: false, is_pro: false },
  "midjourney-basic": { show_in_daily: false, is_pro: false },
  "lovable-basic": { show_in_daily: true, is_pro: false },
  "grok-basic": { show_in_daily: true, is_pro: false },
  "elevenlabs-basic": { show_in_daily: true, is_pro: false },
  "ai-skills-pro": { show_in_daily: true, is_pro: true },
  "ai-mcp-pro": { show_in_daily: true, is_pro: true },
  "ai-advanced-pro": { show_in_daily: true, is_pro: true },
}
for (const [slug, exp] of Object.entries(EXPECT_COURSES)) {
  const c = bySlug[slug]
  if (!c) { ok(false, `${slug} — MISSING (run migration 018/020)`); continue }
  ok(c.status === "published" && c.show_in_daily === exp.show_in_daily && c.is_pro === exp.is_pro,
     `${slug} — published, show_in_daily=${c.show_in_daily}, is_pro=${c.is_pro}, ${c.lessons} lessons`)
}

console.log("\n── CAREER PATHS ──")
const paths = await get("career_paths?select=slug,is_pro,is_published,order_index&order=order_index")
const pSlug = Object.fromEntries((paths.__error ? [] : paths).map((p) => [p.slug, p]))
const EXPECT_PATHS = ["ai-for-automation", "ai-for-students", "ai-for-writing", "ai-for-productivity", "ai-for-music", "ai-for-video", "ai-for-image", "ai-for-teacher"]
for (const slug of EXPECT_PATHS) {
  const p = pSlug[slug]
  if (!p) { ok(false, `${slug} — MISSING (run migration 021)`); continue }
  const steps = await get(`path_steps?select=id&module_id=in.(${(await get(`path_modules?select=id&path_id=eq.${(await get(`career_paths?select=id&slug=eq.${slug}`))[0].id}`)).map((m) => m.id).join(",") || "00000000-0000-0000-0000-000000000000"})`)
  const n = Array.isArray(steps) ? steps.length : 0
  ok(p.is_published && n > 0, `${slug} — published=${p.is_published}, is_pro=${p.is_pro}, ${n} steps`)
}

console.log("\n── LESSON CONTENT FILES ──")
for (const slug of Object.keys(EXPECT_COURSES)) {
  const dir = path.join(process.cwd(), "content", "lessons", slug)
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : []
  let valid = files.length > 0
  for (const f of files) { try { JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) } catch { valid = false } }
  ok(valid, `${slug} — ${files.length} JSON files, all valid`)
}

console.log(`\n${fail === 0 ? "✅ ALL GOOD" : `⚠️  ${fail} check(s) failed`} — ${pass} passed, ${fail} failed\n`)
process.exit(fail === 0 ? 0 : 1)
