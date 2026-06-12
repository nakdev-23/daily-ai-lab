// Reproduce the cancel-Pro modal positioning bug on /settings.
import { chromium } from "playwright-core"
import fs from "node:fs"

const BASE = "http://localhost:3181"
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SR = env.SUPABASE_SERVICE_ROLE_KEY
const REF = URL_.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)[1]
const EMAIL = "adapt-test@dailyailab.test"
const PASS = "Adapt-Test-9911!"
const srh = { apikey: SR, Authorization: `Bearer ${SR}`, "Content-Type": "application/json" }

// create user + make them Pro
let r = await fetch(`${URL_}/auth/v1/admin/users`, { method: "POST", headers: srh, body: JSON.stringify({ email: EMAIL, password: PASS, email_confirm: true, user_metadata: { full_name: "Adapt Tester" } }) })
let j = await r.json()
let uid = j.id
if (!uid) {
  const list = await (await fetch(`${URL_}/auth/v1/admin/users?per_page=100`, { headers: srh })).json()
  uid = list.users.find((u) => u.email === EMAIL)?.id
}
// the signup trigger already created the row — PATCH only (no unique constraint on user_id, POST would duplicate)
await fetch(`${URL_}/rest/v1/subscriptions?user_id=eq.${uid}`, { method: "PATCH", headers: { ...srh, Prefer: "return=minimal" }, body: JSON.stringify({ plan: "pro", expires_at: null }) })

const sess = await (await fetch(`${URL_}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" }, body: JSON.stringify({ email: EMAIL, password: PASS }) })).json()
const name = `sb-${REF}-auth-token`
const value = "base64-" + Buffer.from(JSON.stringify(sess), "utf8").toString("base64url")
const MAX = 3180
const cookies = []
if (value.length <= MAX) cookies.push({ name, value })
else for (let i = 0; i * MAX < value.length; i++) cookies.push({ name: `${name}.${i}`, value: value.slice(i * MAX, (i + 1) * MAX) })

const browser = await chromium.launch({ channel: "msedge" })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
await ctx.addCookies(cookies.map((c) => ({ ...c, domain: "localhost", path: "/" })))
const page = await ctx.newPage()
await page.goto(BASE + "/settings", { waitUntil: "networkidle" })
await page.waitForTimeout(600)

// debug: what does the subscription section actually contain?
const dbg = await page.evaluate(() => ({
  url: location.href,
  hasSub: !!document.querySelector("#subscription"),
  subText: document.querySelector("#subscription")?.textContent?.slice(0, 200) ?? null,
  dangers: [...document.querySelectorAll("button.btn--danger")].map((b) => b.textContent?.trim()),
}))
console.log("DEBUG:", JSON.stringify(dbg, null, 2))
await page.screenshot({ path: "c:/tmp-adapt/settings-debug.png", fullPage: true })
const target = page.locator("#subscription button", { hasText: /Cancel subscription|ยกเลิก/ }).first()
await target.scrollIntoViewIfNeeded()
await target.click()
await page.waitForTimeout(400)

const info = await page.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"]')
  if (!dlg) return { found: false }
  const r = dlg.getBoundingClientRect()
  // walk ancestors looking for containing-block creators
  const culprits = []
  let el = dlg.parentElement
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el)
    const props = {}
    for (const p of ["transform", "filter", "backdropFilter", "perspective", "contain", "willChange", "containerType"]) {
      const v = cs[p]
      if (v && v !== "none" && v !== "normal" && v !== "auto") props[p] = v
    }
    if (Object.keys(props).length) culprits.push({ el: el.tagName + "." + String(el.className).split(" ").slice(0, 2).join("."), ...props })
    el = el.parentElement
  }
  return { found: true, rect: { top: r.top, left: r.left, w: r.width, h: r.height }, scrollY: scrollY, viewportH: innerHeight, culprits }
})
console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: "c:/tmp-adapt/modal-test.png" })
await browser.close()
