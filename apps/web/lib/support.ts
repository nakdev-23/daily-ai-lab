import "server-only"
import { createClient, getAuthUser } from "./supabase/server"

export type SupportTicket = {
  id: string
  subject: string
  detail: string
  status: "open" | "answered" | "closed"
  adminReply: string | null
  repliedAt: string | null
  createdAt: string
}

export type AdminSupportTicket = SupportTicket & { userId: string; userName: string }

type Row = {
  id: string
  subject: string
  detail: string
  status: SupportTicket["status"]
  admin_reply: string | null
  replied_at: string | null
  created_at: string
  user_id?: string
}

function mapRow(r: Row): SupportTicket {
  return {
    id: r.id,
    subject: r.subject,
    detail: r.detail,
    status: r.status,
    adminReply: r.admin_reply,
    repliedAt: r.replied_at,
    createdAt: r.created_at,
  }
}

const COLS = "id,subject,detail,status,admin_reply,replied_at,created_at"

/** The signed-in user's tickets, newest first. null = table missing / read error. */
export async function getMyTickets(): Promise<SupportTicket[] | null> {
  const user = await getAuthUser()
  if (!user) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("support_tickets")
    .select(COLS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  if (error) return null
  return ((data as Row[]) ?? []).map(mapRow)
}

/** Every ticket (admin), with the submitter's name. null = table missing / read error. */
export async function getAllTickets(): Promise<AdminSupportTicket[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("support_tickets")
    .select(`${COLS},user_id`)
    .order("created_at", { ascending: false })
  if (error) return null
  const rows = (data as Row[]) ?? []

  // Resolve display names in one extra query (no FK join from tickets→profiles).
  const ids = [...new Set(rows.map((r) => r.user_id).filter(Boolean) as string[])]
  const names = new Map<string, string>()
  if (ids.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id,display_name").in("id", ids)
    for (const p of (profiles as { id: string; display_name: string | null }[]) ?? []) {
      names.set(p.id, p.display_name ?? "ผู้ใช้")
    }
  }

  return rows.map((r) => ({
    ...mapRow(r),
    userId: r.user_id ?? "",
    userName: (r.user_id && names.get(r.user_id)) || "ผู้ใช้",
  }))
}
