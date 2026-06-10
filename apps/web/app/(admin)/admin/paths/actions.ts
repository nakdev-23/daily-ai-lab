"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export type PathActionResult = { ok: boolean; message: string }

// ── Career path CRUD ──────────────────────────────────────────────────────────

export async function saveCareerPathAction(
  _prev: PathActionResult | null,
  form: FormData
): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const id = form.get("id") as string | null

  const tools = (form.get("tools") as string)
    .split(",").map((s) => s.trim()).filter(Boolean)

  const payload = {
    slug:        (form.get("slug") as string).trim().toLowerCase().replace(/\s+/g, "-"),
    title:       form.get("title") as string,
    tag:         form.get("tag") as string,
    description: form.get("description") as string,
    tone:        form.get("tone") as string,
    tools,
    weeks:       parseInt(form.get("weeks") as string) || 4,
    is_pro:      form.get("is_pro") === "true",
    is_published: form.get("is_published") === "true",
    order_index: parseInt(form.get("order_index") as string) || 0,
  }

  const { error } = id
    ? await supabase.from("career_paths").update(payload).eq("id", id)
    : await supabase.from("career_paths").insert(payload)

  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  revalidatePath("/paths")
  return { ok: true, message: "saved" }
}

export async function deleteCareerPathAction(
  _prev: PathActionResult | null,
  form: FormData
): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const id = form.get("id") as string
  const { error } = await supabase.from("career_paths").delete().eq("id", id)
  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  revalidatePath("/paths")
  return { ok: true, message: "deleted" }
}

export async function togglePublishAction(id: string, current: boolean): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase
    .from("career_paths")
    .update({ is_published: !current })
    .eq("id", id)
  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  revalidatePath("/paths")
  return { ok: true, message: "updated" }
}

// ── Module CRUD ───────────────────────────────────────────────────────────────

export async function saveModuleAction(
  _prev: PathActionResult | null,
  form: FormData
): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const id = form.get("id") as string | null
  const payload = {
    path_id:     form.get("path_id") as string,
    title:       form.get("title") as string,
    order_index: parseInt(form.get("order_index") as string) || 0,
  }
  const { error } = id
    ? await supabase.from("path_modules").update(payload).eq("id", id)
    : await supabase.from("path_modules").insert(payload)
  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  return { ok: true, message: "saved" }
}

export async function deleteModuleAction(
  _prev: PathActionResult | null,
  form: FormData
): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase
    .from("path_modules")
    .delete()
    .eq("id", form.get("id") as string)
  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  return { ok: true, message: "deleted" }
}

// ── Step CRUD ─────────────────────────────────────────────────────────────────

export async function saveStepAction(
  _prev: PathActionResult | null,
  form: FormData
): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const id = form.get("id") as string | null
  const payload = {
    module_id:   form.get("module_id") as string,
    title:       form.get("title") as string,
    kind:        form.get("kind") as string,
    course_slug: form.get("course_slug") as string,
    lesson_num:  parseInt(form.get("lesson_num") as string) || 1,
    xp:          parseInt(form.get("xp") as string) || 10,
    order_index: parseInt(form.get("order_index") as string) || 0,
  }
  const { error } = id
    ? await supabase.from("path_steps").update(payload).eq("id", id)
    : await supabase.from("path_steps").insert(payload)
  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  return { ok: true, message: "saved" }
}

export async function deleteStepAction(
  _prev: PathActionResult | null,
  form: FormData
): Promise<PathActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase
    .from("path_steps")
    .delete()
    .eq("id", form.get("id") as string)
  if (error) return { ok: false, message: error.message }
  revalidatePath("/admin/paths")
  return { ok: true, message: "deleted" }
}
