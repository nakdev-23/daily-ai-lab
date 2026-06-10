import { getProfile, type Role } from "./auth"
import { createClient } from "./supabase/server"

export type AppUser = {
  id: string
  display_name: string
  role: Role
  created_at: string
}

export async function getUsers(): Promise<AppUser[]> {
  const profile = await getProfile()
  if (profile?.role !== "admin") return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: true })
  return (data as AppUser[]) ?? []
}
