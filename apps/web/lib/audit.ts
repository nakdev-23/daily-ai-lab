import { isDevMock } from "./mock-user"
import { getProfile } from "./auth"
import { createClient } from "./supabase/server"

export type AuditEntry = {
  id: string
  user_id: string | null
  actor_name: string | null
  action: string
  details: Record<string, unknown> | null
  ip: string | null
  created_at: string
}

/** Append a security/admin event to the audit trail. No-throw. */
export async function recordAudit(action: string, details?: Record<string, unknown>) {
  if (isDevMock()) {
    const profile = await getProfile()
    MOCK_AUDITS.unshift({
      id: String(Date.now()),
      user_id: profile?.id ?? null,
      actor_name: profile?.displayName ?? "ระบบ",
      action,
      details: details ?? null,
      ip: "127.0.0.1",
      created_at: new Date().toISOString(),
    })
    if (MOCK_AUDITS.length > 50) MOCK_AUDITS.pop()
    console.log("[audit]", action, details ?? "")
    return
  }
  try {
    const supabase = await createClient()
    await supabase.rpc("record_audit", { p_action: action, p_details: details ?? null })
  } catch {
    // auditing must never break the request
  }
}

/** Recent audit entries (admin only). Mock returns sample data. */
export async function getRecentAudits(limit = 20): Promise<AuditEntry[]> {
  if (isDevMock()) return MOCK_AUDITS.slice(0, limit)
  try {
    const profile = await getProfile()
    if (profile?.role !== "admin") return []
    const supabase = await createClient()
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
    return (data as AuditEntry[]) ?? []
  } catch {
    return []
  }
}

const now = Date.now()
const ago = (m: number) => new Date(now - m * 60_000).toISOString()
const MOCK_AUDITS: AuditEntry[] = [
  { id: "1", user_id: "mock-user-id", actor_name: "นักเรียน AI", action: "admin.view_dashboard", details: null, ip: "127.0.0.1", created_at: ago(2) },
  { id: "2", user_id: "u2", actor_name: "ฟ้าใส", action: "auth.login", details: null, ip: "203.0.113.5", created_at: ago(18) },
  { id: "3", user_id: "mock-user-id", actor_name: "นักเรียน AI", action: "role.change", details: { target: "โอม", from: "user", to: "admin" }, ip: "127.0.0.1", created_at: ago(45) },
  { id: "4", user_id: "u3", actor_name: "โอม", action: "doc.view", details: { slug: "prompt-templates" }, ip: "198.51.100.2", created_at: ago(90) },
  { id: "5", user_id: "u4", actor_name: "มายด์", action: "auth.login_failed", details: { email: "m***@email.com" }, ip: "198.51.100.9", created_at: ago(140) },
]
