// Responsive audit: visit every key page at a phone width and report any
// horizontal overflow (the #1 symptom of a non-responsive layout) plus the
// specific elements that stick out past the viewport. Screenshots to OUT.
import { chromium } from "playwright-core"
import fs from "node:fs"

const BASE = process.env.BASE || "http://localhost:3000"
const OUT = "c:/tmp-responsive"
const W = Number(process.env.W || 390)   // iPhone 12/13/14 logical width
const H = Number(process.env.H || 844)
fs.mkdirSync(OUT, { recursive: true })

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SR = env.SUPABASE_SERVICE_ROLE_KEY
const REF = URL_.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)[1]
const EMAIL = "responsive-test@dailyailab.test"
const PASS = "Responsive-Test-9911!"
const srh = { apikey: SR, Authorization: `Bearer ${SR}`, "Content-Type": "application/json" }

// admin + pro test user → can reach every page with no daily gating
let r = await fetch(`${URL_}/auth/v1/admin/users`, { method: "POST", headers: srh, body: JSON.stringify({ email: EMAIL, password: PASS, email_confirm: true, user_metadata: { full_name: "Responsive Tester" } }) })
let j = await r.json()
let uid = j.id
if (!uid) {
  const list = await (await fetch(`${URL_}/auth/v1/admin/users?per_page=200`, { headers: srh })).json()
  uid = list.users.find((u) => u.email === EMAIL)?.id
}
await fetch(`${URL_}/rest/v1/profiles?id=eq.${uid}`, { method: "PATCH", headers: { ...srh, Prefer: "return=minimal" }, body: JSON.stringify({ role: "admin" }) })
await fetch(`${URL_}/rest/v1/subscriptions?user_id=eq.${uid}`, { method: "PATCH", headers: { ...srh, Prefer: "return=minimal" }, body: JSON.stringify({ plan: "pro", expires_at: null }) })

const sess = await (await fetch(`${URL_}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" }, body: JSON.stringify({ email: EMAIL, password: PASS }) })).json()
const cname = `sb-${REF}-auth-token`
const value = "base64-" + Buffer.from(JSON.stringify(sess), "utf8").toString("base64url")
const MAX = 3180
const cookies = []
if (value.length <= MAX) cookies.push({ name: cname, value })
else for (let i = 0; i * MAX < value.length; i++) cookies.push({ name: `${cname}.${i}`, value: value.slice(i * MAX, (i + 1) * MAX) })

const ROUTES = [
  "/", "/about", "/privacy", "/terms", "/login", "/register",
  "/dashboard", "/daily-learn", "/daily-learn/chatgpt-basic",
  "/leaderboard", "/missions", "/profile", "/settings", "/upgrade",
  "/paths", "/paths/ai-for-marketing", "/docs", "/docs/chatgpt", "/course/chatgpt",
  "/admin", "/admin/users", "/admin/system", "/admin/docs",
  "/admin/courses", "/admin/paths", "/admin/leagues",
]

const browser = await chromium.launch({ channel: "msedge" })
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await ctx.addCookies(cookies.map((c) => ({ ...c, domain: "localhost", path: "/" })))
const page = await ctx.newPage()

const findOverflow = () => {
  const root = document.documentElement
  const vw = root.clientWidth
  const docOverflow = Math.round(root.scrollWidth - vw)
  const bad = []
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el)
    if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue
    const rc = el.getBoundingClientRect()
    if (rc.width === 0 || rc.height === 0) continue
    // element pokes past the right edge or is itself wider than the screen
    if (rc.right > vw + 2 || rc.width > vw + 2) {
      bad.push({
        sel: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""),
        w: Math.round(rc.width), right: Math.round(rc.right),
      })
    }
  }
  // keep the tightest (smallest) offenders — they are the real culprits, not their parents
  bad.sort((a, b) => a.w - b.w)
  const seen = new Set(); const top = []
  for (const b of bad) { if (seen.has(b.sel)) continue; seen.add(b.sel); top.push(b); if (top.length >= 6) break }
  return { vw, docOverflow, count: bad.length, top }
}

const report = []
for (const route of ROUTES) {
  const slug = route.replace(/[^\w]+/g, "_").replace(/^_|_$/g, "") || "home"
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 25000 })
    await page.waitForTimeout(500)
    const res = await page.evaluate(findOverflow)
    const finalUrl = page.url().replace(BASE, "")
    await page.screenshot({ path: `${OUT}/${slug}.png`, fullPage: true })
    const redirected = finalUrl !== route && !(route === "/" && finalUrl === "/")
    report.push({ route, finalUrl, redirected, ...res })
    const flag = res.docOverflow > 2 ? `❌ OVERFLOW +${res.docOverflow}px` : "✓ ok"
    console.log(`${flag.padEnd(20)} ${route}${redirected ? ` (→ ${finalUrl})` : ""}`)
    if (res.docOverflow > 2) for (const b of res.top) console.log(`        ↳ ${b.sel}  w=${b.w} right=${b.right} (vw=${res.vw})`)
  } catch (e) {
    report.push({ route, error: e.message })
    console.log(`⚠️  ERROR             ${route}  ${e.message.split("\n")[0]}`)
  }
}

fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2))
const broken = report.filter((r) => r.docOverflow > 2)
console.log(`\n=== SUMMARY: ${broken.length}/${report.length} pages overflow at ${W}px ===`)
console.log("screenshots + report.json →", OUT)
await browser.close()
