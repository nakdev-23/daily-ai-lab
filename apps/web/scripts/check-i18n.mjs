// Audit i18n coverage: t("...") keys missing from th.ts, and hardcoded Thai
// text in user-facing components that bypasses t() entirely.
import fs from "node:fs"
import { execSync } from "node:child_process"

const files = execSync("git ls-files app components lib", { encoding: "utf8" })
  .split("\n")
  .filter((f) => /\.(tsx|ts)$/.test(f))

// 1) every t("...") key used in source
const keys = new Set()
const keyRe = /\bt\(\s*"((?:[^"\\]|\\.)*)"/g
for (const f of files) {
  if (!fs.existsSync(f)) continue
  const src = fs.readFileSync(f, "utf8")
  for (const m of src.matchAll(keyRe)) keys.add(m[1])
}

// 2) keys present in th.ts
const thSrc = fs.readFileSync("lib/locales/th.ts", "utf8")
const thKeys = new Set()
for (const m of thSrc.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:/gm)) thKeys.add(m[1])

const missing = [...keys].filter((k) => !thKeys.has(k)).sort()
console.log(`t() keys: ${keys.size} | th.ts entries: ${thKeys.size} | missing Thai: ${missing.length}`)
for (const k of missing) console.log("  MISSING-TH:", JSON.stringify(k))

// 3) hardcoded Thai outside t() in user-facing dirs (admin excluded on purpose)
const thaiRe = /[฀-๿]/
console.log("\nHardcoded Thai (user-facing files):")
for (const f of files) {
  if (f.startsWith("app/(admin)") || f.startsWith("lib/locales")) continue
  if (!fs.existsSync(f)) continue
  const lines = fs.readFileSync(f, "utf8").split("\n")
  lines.forEach((line, i) => {
    if (!thaiRe.test(line)) return
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return // comments
    console.log(`  ${f}:${i + 1}: ${line.trim().slice(0, 110)}`)
  })
}
