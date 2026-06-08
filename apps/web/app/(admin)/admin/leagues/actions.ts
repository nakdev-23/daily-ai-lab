"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { saveLeague, deleteLeague, saveBadge, deleteBadge } from "@/lib/leagues"

export type LeagueActionResult = { ok: boolean; message: string }

function revalidate() {
  revalidatePath("/admin/leagues")
  revalidatePath("/admin")
}

export async function saveLeagueAction(_prev: LeagueActionResult | null, formData: FormData): Promise<LeagueActionResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim() || undefined
  const name = String(formData.get("name") ?? "").trim()
  if (!name) return { ok: false, message: "กรุณากรอกชื่อลีกก่อน" }
  await saveLeague({ id, name, xp_range: String(formData.get("xp_range") ?? "").trim() || "0+ XP" })
  await recordAudit(id ? "league.update" : "league.create", { name })
  revalidate()
  return { ok: true, message: id ? "บันทึกลีกแล้ว" : "เพิ่มลีกแล้ว" }
}

export async function deleteLeagueAction(_prev: LeagueActionResult | null, formData: FormData): Promise<LeagueActionResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim()
  if (!id) return { ok: false, message: "ไม่พบลีก" }
  await deleteLeague(id)
  await recordAudit("league.delete", { id })
  revalidate()
  return { ok: true, message: "ลบลีกแล้ว" }
}

export async function saveBadgeAction(_prev: LeagueActionResult | null, formData: FormData): Promise<LeagueActionResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim() || undefined
  const name = String(formData.get("name") ?? "").trim()
  if (!name) return { ok: false, message: "กรุณากรอกชื่อแบดจ์ก่อน" }
  await saveBadge({ id, name, condition: String(formData.get("condition") ?? "").trim(), img: String(formData.get("img") ?? "first-step").trim() })
  await recordAudit(id ? "badge.update" : "badge.create", { name })
  revalidate()
  return { ok: true, message: id ? "บันทึกแบดจ์แล้ว" : "เพิ่มแบดจ์แล้ว" }
}

export async function deleteBadgeAction(_prev: LeagueActionResult | null, formData: FormData): Promise<LeagueActionResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim()
  if (!id) return { ok: false, message: "ไม่พบแบดจ์" }
  await deleteBadge(id)
  await recordAudit("badge.delete", { id })
  revalidate()
  return { ok: true, message: "ลบแบดจ์แล้ว" }
}
