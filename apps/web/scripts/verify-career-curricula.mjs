import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const migrationPath = path.join(root, "supabase", "migrations", "026_job_ready_career_paths.sql")
const sql = fs.readFileSync(migrationPath, "utf8")
const expectedPaths = 13

let passed = 0
let failed = 0
const check = (condition, message) => {
  console.log(`${condition ? "  ✓" : "  ✗"} ${message}`)
  if (condition) passed++
  else failed++
}

const mappings = []
const mappingPattern = /array\[((?:'[^']+'\s*,?\s*)+)\],\s*\n\s*array\[([0-9,\s]+)\]\s*\n\)/g
for (const match of sql.matchAll(mappingPattern)) {
  const before = sql.slice(0, match.index)
  const rows = [...before.matchAll(/\(\s*\n\s*'([^']+)',/g)]
  const slug = rows.at(-1)?.[1]
  const courses = [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1])
  const lessonNums = match[2].split(",").map((item) => Number(item.trim()))
  mappings.push({ slug, courses, lessonNums })
}

console.log("\n── JOB-READY CAREER CURRICULA ──")
check(mappings.length === expectedPaths, `found ${mappings.length}/${expectedPaths} path mappings`)
check(new Set(mappings.map((item) => item.slug)).size === expectedPaths, "every path slug is unique")

for (const mapping of mappings) {
  const arraysValid = mapping.courses.length === 10 && mapping.lessonNums.length === 10
  check(arraysValid, `${mapping.slug}: 10 curriculum steps`)
  if (!arraysValid) continue

  const missing = []
  for (let index = 0; index < mapping.courses.length; index++) {
    const lessonFile = path.join(
      root,
      "content",
      "lessons",
      mapping.courses[index],
      `${String(mapping.lessonNums[index]).padStart(2, "0")}.json`,
    )
    if (!fs.existsSync(lessonFile)) {
      missing.push(`${mapping.courses[index]}#${mapping.lessonNums[index]}`)
    }
  }
  check(missing.length === 0, `${mapping.slug}: all lesson references exist${missing.length ? ` (${missing.join(", ")})` : ""}`)
}

check(
  /when i in \(1,2,4\) then 'lesson'[\s\S]*when i in \(8,10\) then 'project'[\s\S]*else 'checkpoint'/.test(sql),
  "curriculum structure is 30% theory and 70% submitted practice",
)
check(
  /count\(\*\) filter \(where ps\.kind in \('checkpoint','project'\)\) <> 7/.test(sql)
    && /count\(\*\) filter \(where ps\.kind = 'project'\) < 2/.test(sql),
  "database migration rejects paths without 7 practical steps and 2 projects",
)

console.log(`\n${failed === 0 ? "✅ ALL GOOD" : `⚠️ ${failed} check(s) failed`} — ${passed} passed, ${failed} failed\n`)
process.exit(failed === 0 ? 0 : 1)
