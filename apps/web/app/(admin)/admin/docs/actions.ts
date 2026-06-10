"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { saveDoc, deleteDoc, slugify, getToolConfig, saveToolConfig, type DocLevel } from "@/lib/docs"

const LEVELS: DocLevel[] = ["beginner", "intermediate", "pro"]

export type ActionResult = { ok: boolean; message: string; slug?: string }

export async function saveDocAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const title = String(formData.get("title") ?? "").trim()
  const body = String(formData.get("body") ?? "")
  const tool = String(formData.get("tool") ?? "AI").trim()
  const levelRaw = String(formData.get("level") ?? "beginner") as DocLevel
  const level = LEVELS.includes(levelRaw) ? levelRaw : "beginner"
  const summary = String(formData.get("summary") ?? "").trim()
  const readTime = String(formData.get("readTime") ?? "").trim() || "5 นาที"
  const locked = formData.get("locked") === "on"
  const order = Number(formData.get("order") ?? 99) || 99
  const existing = String(formData.get("slug") ?? "").trim()
  const icon = String(formData.get("icon") ?? "").trim() || undefined

  if (!title) return { ok: false, message: "กรุณากรอกชื่อเอกสารก่อน" }

  const slug = existing || slugify(title)
  await saveDoc({ slug, title, tool, level, summary, readTime, locked, order, body, icon })
  await recordAudit("doc.save", { slug, title })

  revalidatePath("/docs")
  revalidatePath(`/docs/${slug}`)
  revalidatePath("/admin")
  revalidatePath("/admin/docs")
  return { ok: true, message: `บันทึก "${title}" แล้ว`, slug }
}

export async function setToolVisibilityAction(tool: string, visible: boolean): Promise<void> {
  await requireAdmin()
  const config = await getToolConfig()
  config[tool] = visible
  await saveToolConfig(config)
  await recordAudit("tool.visibility", { tool, visible })
  revalidatePath("/docs")
  revalidatePath("/admin/docs")
}

export async function deleteDocAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const slug = String(formData.get("slug") ?? "").trim()
  if (!slug) return { ok: false, message: "ไม่พบเอกสารที่ต้องการลบ" }
  try {
    await deleteDoc(slug)
    await recordAudit("doc.delete", { slug })
  } catch {
    return { ok: false, message: "ยังลบไม่ได้ ลองใหม่อีกครั้ง" }
  }
  revalidatePath("/docs")
  revalidatePath("/admin")
  revalidatePath("/admin/docs")
  return { ok: true, message: "ลบเอกสารแล้ว" }
}
