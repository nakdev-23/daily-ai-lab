// Responsive adaptation scanner: logs into the app with a service-role-created
// test user, screenshots every key route at phone/tablet/desktop widths, and
// reports horizontal overflow + undersized touch targets per page.
// Usage: node scripts/adapt-scan.mjs [baseUrl]
import { chromium } from "playwright-core"
import fs from "node:fs"

const BASE = process.argv[2] ?? "http://localhost:3181"
const OUT = "c:/tmp-adapt"
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SR = env.SUPABASE_SERVICE_ROLE_KEY
const REF = URL_.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)[1]

const EMAIL = "adapt-test@dailyailab.test"
const PASS = "Adapt-Test-9911!"

async function ensureUser() {
  const h = { apikey: SR, Authorization: `Bearer ${SR}`, "Content-Type": "application/json" }
  const r = await fetch(`${URL_}/auth/v1/admin/users`, {
    method: "POST", headers: h,
    body: JSON.stringify({ email: EMAIL, password: PASS, email_confirm: true, user_metadata: { full_name: "Adapt Tester" } }),
  })
  const j = await r.json()
  if (!r.ok && !`${j.msg ?? j.message ?? ""}`.includes("already")) throw new Error("create user: " + JSON.stringify(j))
}

async function getSession() {
  const r = await fetch(`${URL_}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  })
  const j = await r.json()
  if (!r.ok) throw new Error("login: " + JSON.stringify(j))
  return j
}

// @supabase/ssr cookie format: "base64-" + base64url(JSON), chunked at 3180.
function sessionCookies(session) {
  const name = `sb-${REF}-auth-token`
  const value = "base64-" + Buffer.from(JSON.stringify(session), "utf8").toString("base64url")
  const MAX = 3180
  if (value.length <= MAX) return [{ name, value }]
  const chunks = []
  for (let i = 0; i * MAX < value.length; i++) chunks.push({ name: `${name}.${i}`, value: value.slice(i * MAX, (i + 1) * MAX) })
  return chunks
}

const ROUTES = [
  "/", "/login", "/terms",
  "/daily-learn", "/daily-learn/chatgpt-basic", "/daily-learn/chatgpt-basic/1",
  "/leaderboard", "/missions", "/profile", "/settings", "/upgrade", "/paths", "/docs",
]
const VIEWPORTS = [
  { tag: "phone", width: 360, height: 740 },
  { tag: "tablet", width: 768, height: 1024 },
  { tag: "desktop", width: 1280, height: 800 },
]

const auditFn = () => {
  const overflowX = document.documentElement.scrollWidth - window.innerWidth
  // find which element is overflowing (widest offender)
  let offender = null
  if (overflowX > 1) {
    let max = window.innerWidth
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect()
      if (r.right > max + 1 && r.width < document.documentElement.scrollWidth + 50) {
        max = r.right
        offender = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : "")
      }
    }
  }
  const small = []
  for (const el of document.querySelectorAll("a, button, [role=button], input, select")) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === "hidden" || cs.display === "none") continue
    if (r.height < 36 || r.width < 36) {
      const label = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 26)
      small.push(`${Math.round(r.width)}x${Math.round(r.height)} ${el.tagName.toLowerCase()}.${typeof el.className === "string" ? el.className.split(" ")[0] : ""} "${label}"`)
    }
  }
  return { overflowX, offender, small: small.slice(0, 12) }
}

const browser = await chromium.launch({ channel: "msedge" })
fs.mkdirSync(OUT, { recursive: true })
await ensureUser()
const session = await getSession()
const cookies = sessionCookies(session).map((c) => ({ ...c, domain: "localhost", path: "/", httpOnly: false, secure: false, sameSite: "Lax" }))

const report = {}
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, hasTouch: vp.tag !== "desktop" })
  await ctx.addCookies(cookies)
  const page = await ctx.newPage()
  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 })
      await page.waitForTimeout(700)
      const audit = await page.evaluate(auditFn)
      report[`${vp.tag} ${route}`] = audit
      const safe = route.replace(/\//g, "_") || "_root"
      await page.screenshot({ path: `${OUT}/${vp.tag}${safe}.png`, fullPage: vp.tag === "phone" })
    } catch (e) {
      report[`${vp.tag} ${route}`] = { error: String(e).slice(0, 120) }
    }
  }
  await ctx.close()
}
await browser.close()

for (const [k, v] of Object.entries(report)) {
  if (v.error) { console.log(`ERR  ${k}: ${v.error}`); continue }
  const flags = []
  if (v.overflowX > 1) flags.push(`OVERFLOW +${v.overflowX}px (${v.offender})`)
  if (v.small.length) flags.push(`small-targets:${v.small.length}`)
  console.log(`${flags.length ? "WARN" : "ok  "} ${k}${flags.length ? " — " + flags.join(" · ") : ""}`)
  if (v.small.length && k.startsWith("phone")) v.small.forEach((s) => console.log("       ", s))
}
console.log("\nscreenshots in", OUT)
