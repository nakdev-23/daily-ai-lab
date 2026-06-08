"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { saveUnit, deleteUnit, saveLesson, deleteLesson, type LessonKind } from "@/lib/course-content"

export type EditResult = { ok: boolean; message: string }

const KINDS: LessonKind[] = ["lesson", "quiz", "check", "project"]

function done(courseId: string) {
  if (courseId) revalidatePath(`/admin/courses/${courseId}`)
  revalidatePath("/admin/courses")
}

export async function saveUnitAction(_prev: EditResult | null, formData: FormData): Promise<EditResult> {
  await requireAdmin()
  const courseId = String(formData.get("course_id") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  if (!title) return { ok: false, message: "กรุณากรอกชื่อบทก่อน" }
  const id = String(formData.get("id") ?? "").trim() || undefined
  await saveUnit({ id, course_id: courseId, title })
  await recordAudit(id ? "unit.update" : "unit.create", { title })
  done(courseId)
  return { ok: true, message: id ? "บันทึกบทแล้ว" : "เพิ่มบทแล้ว" }
}

export async function deleteUnitAction(_prev: EditResult | null, formData: FormData): Promise<EditResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim()
  if (!id) return { ok: false, message: "ไม่พบบท" }
  await deleteUnit(id)
  await recordAudit("unit.delete", { id })
  done(String(formData.get("course_id") ?? ""))
  return { ok: true, message: "ลบบทแล้ว" }
}

export async function saveLessonAction(_prev: EditResult | null, formData: FormData): Promise<EditResult> {
  await requireAdmin()
  const title = String(formData.get("title") ?? "").trim()
  if (!title) return { ok: false, message: "กรุณากรอกชื่อบทเรียนก่อน" }
  const id = String(formData.get("id") ?? "").trim() || undefined
  const kindRaw = String(formData.get("kind") ?? "lesson") as LessonKind
  await saveLesson({
    id,
    unit_id: String(formData.get("unit_id") ?? "").trim(),
    title,
    kind: KINDS.includes(kindRaw) ? kindRaw : "lesson",
    xp: Number(formData.get("xp") ?? 10) || 10,
  })
  await recordAudit(id ? "lesson.update" : "lesson.create", { title })
  done(String(formData.get("course_id") ?? ""))
  return { ok: true, message: id ? "บันทึกบทเรียนแล้ว" : "เพิ่มบทเรียนแล้ว" }
}

export async function deleteLessonAction(_prev: EditResult | null, formData: FormData): Promise<EditResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim()
  if (!id) return { ok: false, message: "ไม่พบบทเรียน" }
  await deleteLesson(id)
  await recordAudit("lesson.delete", { id })
  done(String(formData.get("course_id") ?? ""))
  return { ok: true, message: "ลบบทเรียนแล้ว" }
}
