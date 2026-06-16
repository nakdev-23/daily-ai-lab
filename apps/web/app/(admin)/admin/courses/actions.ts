"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { saveCourse, deleteCourse, type CourseStatus } from "@/lib/courses"

export type CourseActionResult = { ok: boolean; message: string }

const LEVELS = ["beginner", "intermediate", "advanced"] as const
const STATUSES: CourseStatus[] = ["published", "draft", "queued"]

export async function saveCourseAction(_prev: CourseActionResult | null, formData: FormData): Promise<CourseActionResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim() || undefined
  const title = String(formData.get("title") ?? "").trim()
  if (!title) return { ok: false, message: "กรุณากรอกชื่อคอร์สก่อน" }

  const levelRaw = String(formData.get("level") ?? "beginner") as (typeof LEVELS)[number]
  const statusRaw = String(formData.get("status") ?? "draft") as CourseStatus

  await saveCourse({
    id,
    title,
    description: String(formData.get("description") ?? "").trim(),
    tool: String(formData.get("tool") ?? "ChatGPT").trim() || "ChatGPT",
    level: LEVELS.includes(levelRaw) ? levelRaw : "beginner",
    status: STATUSES.includes(statusRaw) ? statusRaw : "draft",
    showInDaily: formData.get("show_in_daily") === "on",
    isPro: formData.get("is_pro") === "on",
  })
  await recordAudit(id ? "course.update" : "course.create", { title })

  revalidatePath("/admin/courses")
  revalidatePath("/admin")
  return { ok: true, message: id ? "บันทึกคอร์สแล้ว" : "เพิ่มคอร์สแล้ว" }
}

export async function deleteCourseAction(_prev: CourseActionResult | null, formData: FormData): Promise<CourseActionResult> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "").trim()
  if (!id) return { ok: false, message: "ไม่พบคอร์สที่ต้องการลบ" }
  await deleteCourse(id)
  await recordAudit("course.delete", { id })
  revalidatePath("/admin/courses")
  revalidatePath("/admin")
  return { ok: true, message: "ลบคอร์สแล้ว" }
}
