import { isDevMock, MOCK_PROFILE, type Role } from "./mock-user"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type AppUser = {
  id: string
  display_name: string
  role: Role
  created_at: string
}

// Module-level mock store — mutations persist for the dev server's lifetime.
const d = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString()
const MOCK_USERS: AppUser[] = [
  { id: MOCK_PROFILE.id, display_name: MOCK_PROFILE.display_name ?? "นักเรียน AI", role: MOCK_PROFILE.role, created_at: d(120) },
  { id: "u2", display_name: "ฟ้าใส", role: "user", created_at: d(95) },
  { id: "u3", display_name: "โอม", role: "user", created_at: d(60) },
  { id: "u4", display_name: "มายด์", role: "user", created_at: d(40) },
  { id: "u5", display_name: "ภูมิ", role: "admin", created_at: d(30) },
  { id: "u6", display_name: "ไอซ์", role: "user", created_at: d(12) },
]

export async function getUsers(): Promise<AppUser[]> {
  if (isDevMock()) return MOCK_USERS.map((u) => ({ ...u }))
  const profile = await getProfile()
  if (profile?.role !== "admin") return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: true })
  return (data as AppUser[]) ?? []
}

// Internal mock helpers (used by the role server action in mock mode).
export function mockFindUser(id: string): AppUser | undefined {
  return MOCK_USERS.find((u) => u.id === id)
}
export function mockSetRole(id: string, role: Role) {
  const u = MOCK_USERS.find((u) => u.id === id)
  if (u) u.role = role
}
