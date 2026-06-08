"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { isDevMock, type Role } from "@/lib/mock-user"
import { createClient } from "@/lib/supabase/server"
import { mockFindUser, mockSetRole } from "@/lib/users"

export async function changeRole(formData: FormData) {
  // Always re-check on the server — never trust the client.
  const admin = await requireAdmin()

  const userId = String(formData.get("userId") ?? "")
  const role = String(formData.get("role") ?? "") as Role
  if (!userId || (role !== "user" && role !== "admin")) return
  // Prevent admins from changing their own role (avoids self-lockout).
  if (userId === admin?.id) return

  if (isDevMock()) {
    const target = mockFindUser(userId)
    const from = target?.role
    mockSetRole(userId, role)
    await recordAudit("role.change", { target: target?.display_name ?? userId, from, to: role })
  } else {
    const supabase = await createClient()
    const { data: before } = await supabase.from("profiles").select("display_name, role").eq("id", userId).single()
    await supabase.from("profiles").update({ role }).eq("id", userId)
    await recordAudit("role.change", { target: before?.display_name ?? userId, from: before?.role, to: role })
  }

  revalidatePath("/admin/users")
  revalidatePath("/admin")
}
