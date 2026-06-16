/**
 * Auto-translate lesson + docs content to English using an LLM.
 *
 * Why this exists: there are 200+ lesson JSON files and 300+ docs markdown
 * files authored in Thai. Hand-translating them all isn't practical; this
 * script drives an LLM to produce the English variants the bilingual loaders
 * expect (see lib/lesson-loader.ts and lib/docs.ts):
 *   - lessons: content/lessons/<course>/<nn>.json  ->  .../<course>/en/<nn>.json
 *   - docs:    content/docs/<tool>/<file>.md        ->  .../<file>.en.md
 *
 * Setup:
 *   Add an API key to .env.local — either:
 *     ANTHROPIC_API_KEY=sk-ant-...        (default, uses Claude)
 *   or OPENAI_API_KEY=sk-...              (pass --provider openai)
 *
 * Usage (from apps/web):
 *   node scripts/translate-content.mjs --kind lessons --course chatgpt-basic
 *   node scripts/translate-content.mjs --kind docs --tool chatgpt
 *   node scripts/translate-content.mjs --kind all            # everything missing
 *   node scripts/translate-content.mjs --kind lessons --dry-run
 *   node scripts/translate-content.mjs --kind docs --force   # overwrite existing
 *
 * Behaviour: skips files that already have an English variant (unless --force),
 * preserves structure exactly (JSON keys, the `correct`/`bold`/`mascot` flags,
 * markdown formatting, code blocks, links, frontmatter keys), and only
 * translates human-readable Thai text. Safe to re-run.
 */
import fs from "node:fs/promises"
import path from "node:path"

// ── args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const opt = (name, def = undefined) => {
  const i = args.indexOf(`--${name}`)
  if (i === -1) return def
  const next = args[i + 1]
  return next && !next.startsWith("--") ? next : true
}
const KIND = opt("kind", "all")           // lessons | docs | all
const ONLY_COURSE = opt("course")          // limit to one course slug
const ONLY_TOOL = opt("tool")              // limit to one docs tool folder
const DRY = !!opt("dry-run")
const FORCE = !!opt("force")
const PROVIDER = opt("provider", "anthropic")
const CONCURRENCY = Number(opt("concurrency", 4))

const ROOT = process.cwd()
const LESSONS_DIR = path.join(ROOT, "content", "lessons")
const DOCS_DIR = path.join(ROOT, "content", "docs")

// ── env ─────────────────────────────────────────────────────────────────────
const env = {}
for (const f of [".env.local", ".env"]) {
  try {
    for (const line of (await fs.readFile(path.join(ROOT, f), "utf8")).split(/\r?\n/)) {
      const i = line.indexOf("=")
      if (i > 0 && !env[line.slice(0, i).trim()]) env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  } catch { /* file may not exist */ }
}

// ── LLM call ──────────────────────────────────────────────────────────────
async function translate(system, user) {
  if (PROVIDER === "openai") {
    const key = env.OPENAI_API_KEY
    if (!key) throw new Error("OPENAI_API_KEY missing in .env.local")
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "gpt-4o", temperature: 0.2, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    })
    const j = await r.json()
    if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300))
    return j.choices[0].message.content
  }
  const key = env.ANTHROPIC_API_KEY
  if (!key) throw new Error("ANTHROPIC_API_KEY missing in .env.local")
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 8192, system, messages: [{ role: "user", content: user }] }),
  })
  const j = await r.json()
  if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300))
  return j.content.map((b) => b.text ?? "").join("")
}

const LESSON_SYS = `You translate Thai e-learning content to natural, friendly English for beginners.
You are given a JSON array of lesson steps. Translate ONLY the human-readable Thai text in these fields: tag, title, question, example, and every "text" value (in body[] and options[]).
STRICT RULES:
- Return ONLY the translated JSON array. No markdown fences, no commentary.
- Keep the exact same structure, order, and all keys.
- NEVER change boolean/flag fields: "correct", "bold", "type", "mascot".
- Keep product/proper names as-is (ChatGPT, OpenAI, Claude, Gemini, LLM, DALL·E...).
- Keep quotes inside "example"/"question" as example prompts, translated to English.
- Match the encouraging, simple tone suitable for absolute beginners.`

const DOC_SYS = `You translate Thai technical documentation to clear, natural English.
You are given a markdown file that starts with YAML frontmatter.
STRICT RULES:
- Return ONLY the translated markdown (including frontmatter). No code fences around the whole thing, no commentary.
- In frontmatter, translate ONLY the "title" and "summary" values; keep all other keys/values (tool, icon, level, readTime, readers, locked, order) EXACTLY as-is. If readTime is like "5 นาที" translate to "5 min".
- Preserve all markdown structure: headings, tables, lists, blockquotes, links (keep URLs), and code blocks (translate comments inside code only if they are Thai prose, never code).
- Keep product/proper names and technical terms as-is.
- Thai docs often add inline glossary notes like "(ศัพท์ — คำอธิบาย)". In English, drop the redundant ones; keep a short clarification only when genuinely helpful.`

// ── helpers ───────────────────────────────────────────────────────────────
async function walk(dir) {
  const out = []
  let entries = []
  try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...await walk(full))
    else out.push(full)
  }
  return out
}

function stripFence(s) {
  return s.trim().replace(/^```(?:json|markdown|md)?\s*/i, "").replace(/```$/i, "").trim()
}

async function exists(p) { try { await fs.access(p); return true } catch { return false } }

// Run tasks with a small concurrency cap so we don't hammer the API.
async function pool(items, n, fn) {
  let i = 0, done = 0
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      try { await fn(items[idx]); done++ } catch (e) { console.error(`✗ ${items[idx].label}: ${e.message}`) }
    }
  })
  await Promise.all(workers)
  return done
}

// ── collect work ────────────────────────────────────────────────────────────
const tasks = []

if (KIND === "lessons" || KIND === "all") {
  const courses = (await fs.readdir(LESSONS_DIR, { withFileTypes: true })).filter((d) => d.isDirectory())
  for (const c of courses) {
    if (ONLY_COURSE && c.name !== ONLY_COURSE) continue
    const files = (await fs.readdir(path.join(LESSONS_DIR, c.name))).filter((f) => /^\d+\.json$/.test(f))
    for (const f of files) {
      const src = path.join(LESSONS_DIR, c.name, f)
      const dst = path.join(LESSONS_DIR, c.name, "en", f)
      tasks.push({ type: "lesson", src, dst, label: `lessons/${c.name}/${f}` })
    }
  }
}

if (KIND === "docs" || KIND === "all") {
  const all = await walk(DOCS_DIR)
  for (const src of all) {
    if (!src.endsWith(".md") || /\.[a-z]{2}\.md$/.test(src)) continue
    if (ONLY_TOOL && !src.includes(path.sep + ONLY_TOOL + path.sep)) continue
    const dst = src.replace(/\.md$/, ".en.md")
    tasks.push({ type: "doc", src, dst, label: path.relative(DOCS_DIR, src) })
  }
}

const pending = []
for (const t of tasks) {
  if (!FORCE && await exists(t.dst)) continue
  pending.push(t)
}

console.log(`provider=${PROVIDER} kind=${KIND} → ${pending.length}/${tasks.length} files to translate${DRY ? " (dry-run)" : ""}`)
if (DRY) { pending.forEach((t) => console.log("  •", t.label)); process.exit(0) }
if (pending.length === 0) { console.log("nothing to do (all translated; use --force to overwrite)"); process.exit(0) }

// ── run ─────────────────────────────────────────────────────────────────────
const done = await pool(pending, CONCURRENCY, async (t) => {
  const raw = await fs.readFile(t.src, "utf8")
  let outText = await translate(t.type === "lesson" ? LESSON_SYS : DOC_SYS, raw)
  outText = stripFence(outText)
  if (t.type === "lesson") {
    const parsed = JSON.parse(outText) // throws if the model returned invalid JSON → logged, file skipped
    outText = JSON.stringify(parsed, null, 2) + "\n"
  }
  await fs.mkdir(path.dirname(t.dst), { recursive: true })
  await fs.writeFile(t.dst, outText, "utf8")
  console.log("✓", t.label)
})

console.log(`\nDone: ${done}/${pending.length} translated.`)
