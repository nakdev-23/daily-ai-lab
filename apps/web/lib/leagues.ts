import { isDevMock } from "./mock-user"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type League = { id: string; name: string; xp_range: string; order_index: number }
export type Badge = { id: string; name: string; condition: string; img: string }

export type LeagueInput = { id?: string; name: string; xp_range: string }
export type BadgeInput = { id?: string; name: string; condition: string; img: string }

const MOCK_LEAGUES: League[] = [
  { id: "l1", name: "บรอนซ์", xp_range: "0 – 999 XP", order_index: 1 },
  { id: "l2", name: "ซิลเวอร์", xp_range: "1,000 – 1,999 XP", order_index: 2 },
  { id: "l3", name: "โกลด์", xp_range: "2,000 – 2,999 XP", order_index: 3 },
  { id: "l4", name: "แพลทินัม", xp_range: "3,000 – 3,999 XP", order_index: 4 },
  { id: "l5", name: "เพชร", xp_range: "4,000+ XP", order_index: 5 },
]
const MOCK_BADGES: Badge[] = [
  { id: "first-step", name: "ก้าวแรก", condition: "เรียนจบบทแรก", img: "first-step" },
  { id: "7-day-streak", name: "สตรีค 7 วัน", condition: "เรียนต่อเนื่อง 7 วัน", img: "7-day-streak" },
  { id: "perfect-score", name: "เพอร์เฟกต์", condition: "ควิซ 100%", img: "perfect-score" },
  { id: "xp-master", name: "เก็บแต้มขั้นเทพ", condition: "สะสม XP สูง", img: "xp-master" },
  { id: "prompt-pro", name: "Prompt Pro", condition: "เขียนพรอมป์เก่ง", img: "prompt-pro" },
  { id: "quiz-whiz", name: "เซียนควิซ", condition: "ทำควิซเก่ง", img: "quiz-whiz" },
  { id: "ai-explorer", name: "นักสำรวจ AI", condition: "ลองเครื่องมือ AI", img: "ai-explorer" },
  { id: "legend", name: "ตำนาน", condition: "สุดยอดผู้เรียน", img: "legend" },
]

async function assertAdmin() {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
}

// ── Leagues ──
export async function getLeagues(): Promise<League[]> {
  if (isDevMock()) return MOCK_LEAGUES.map((l) => ({ ...l })).sort((a, b) => a.order_index - b.order_index)
  const supabase = await createClient()
  const { data } = await supabase.from("leagues").select("id, name, xp_range, order_index").order("order_index", { ascending: true })
  return (data as League[]) ?? []
}
export async function saveLeague(input: LeagueInput): Promise<void> {
  if (isDevMock()) {
    if (input.id) { const l = MOCK_LEAGUES.find((x) => x.id === input.id); if (l) { l.name = input.name; l.xp_range = input.xp_range } }
    else MOCK_LEAGUES.push({ id: `l${Date.now()}`, name: input.name, xp_range: input.xp_range, order_index: MOCK_LEAGUES.length + 1 })
    return
  }
  await assertAdmin()
  const supabase = await createClient()
  const row = { name: input.name, xp_range: input.xp_range }
  if (input.id) await supabase.from("leagues").update(row).eq("id", input.id)
  else await supabase.from("leagues").insert(row)
}
export async function deleteLeague(id: string): Promise<void> {
  if (isDevMock()) { const i = MOCK_LEAGUES.findIndex((l) => l.id === id); if (i >= 0) MOCK_LEAGUES.splice(i, 1); return }
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("leagues").delete().eq("id", id)
}

// ── Badges ──
export async function getBadges(): Promise<Badge[]> {
  if (isDevMock()) return MOCK_BADGES.map((b) => ({ ...b }))
  const supabase = await createClient()
  const { data } = await supabase.from("badges").select("id, name, description, icon")
  return (data ?? []).map((b) => ({ id: b.id as string, name: b.name as string, condition: (b.description as string) ?? "", img: (b.icon as string) ?? "first-step" }))
}
export async function saveBadge(input: BadgeInput): Promise<void> {
  if (isDevMock()) {
    if (input.id) { const b = MOCK_BADGES.find((x) => x.id === input.id); if (b) { b.name = input.name; b.condition = input.condition; b.img = input.img } }
    else MOCK_BADGES.push({ id: `badge-${Date.now()}`, name: input.name, condition: input.condition, img: input.img || "first-step" })
    return
  }
  await assertAdmin()
  const supabase = await createClient()
  const row = { name: input.name, description: input.condition, icon: input.img || "first-step" }
  if (input.id) await supabase.from("badges").update(row).eq("id", input.id)
  else await supabase.from("badges").insert({ id: `badge-${Date.now()}`, ...row })
}
export async function deleteBadge(id: string): Promise<void> {
  if (isDevMock()) { const i = MOCK_BADGES.findIndex((b) => b.id === id); if (i >= 0) MOCK_BADGES.splice(i, 1); return }
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("badges").delete().eq("id", id)
}
