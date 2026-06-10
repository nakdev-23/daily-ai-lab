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
  try {
    const supabase = await createClient()
    await supabase.rpc("record_audit", { p_action: action, p_details: details ?? null })
  } catch {
    // auditing must never break the request
  }
}

/** Recent audit entries (admin only). */
export async function getRecentAudits(limit = 20): Promise<AuditEntry[]> {
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
