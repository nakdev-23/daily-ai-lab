import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type League = { id: string; name: string; xp_range: string; order_index: number }
export type Badge = { id: string; name: string; condition: string; img: string }

export type LeagueInput = { id?: string; name: string; xp_range: string }
export type BadgeInput = { id?: string; name: string; condition: string; img: string }

async function assertAdmin() {
  const profile = await getProfile()
  if (profile?.role !== "admin") throw new Error("forbidden")
}

// ── Leagues ──
export async function getLeagues(): Promise<League[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("leagues").select("id, name, xp_range, order_index").order("order_index", { ascending: true })
  return (data as League[]) ?? []
}
export async function saveLeague(input: LeagueInput): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  const row = { name: input.name, xp_range: input.xp_range }
  if (input.id) await supabase.from("leagues").update(row).eq("id", input.id)
  else await supabase.from("leagues").insert(row)
}
export async function deleteLeague(id: string): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("leagues").delete().eq("id", id)
}

// ── Badges ──
export async function getBadges(): Promise<Badge[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("badges").select("id, name, description, icon")
  return (data ?? []).map((b) => ({ id: b.id as string, name: b.name as string, condition: (b.description as string) ?? "", img: (b.icon as string) ?? "first-step" }))
}
export async function saveBadge(input: BadgeInput): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  const row = { name: input.name, description: input.condition, icon: input.img || "first-step" }
  if (input.id) await supabase.from("badges").update(row).eq("id", input.id)
  else await supabase.from("badges").insert({ id: `badge-${Date.now()}`, ...row })
}
export async function deleteBadge(id: string): Promise<void> {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from("badges").delete().eq("id", id)
}
