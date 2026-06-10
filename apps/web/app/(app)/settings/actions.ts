"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type SettingsResult = { ok: boolean; message: string } | null

/** Persist the user's display name to profiles (used by the leaderboard & shell). */
export async function updateDisplayName(_prev: SettingsResult, formData: FormData): Promise<SettingsResult> {
  const profile = await requireUser()
  const name = String(formData.get("display_name") ?? "").trim()
  if (name.length < 1 || name.length > 40) {
    return { ok: false, message: "ชื่อต้องมี 1–40 ตัวอักษร" }
  }
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", profile.id)
  if (error) return { ok: false, message: "บันทึกไม่สำเร็จ ลองอีกครั้ง" }
  revalidatePath("/settings")
  revalidatePath("/profile")
  return { ok: true, message: "บันทึกชื่อแล้ว" }
}
