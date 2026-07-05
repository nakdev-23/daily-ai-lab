"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { createClient } from "@/lib/supabase/server"

/** Admin replies to a ticket. Sets the reply and flips status to "answered". */
export async function replyTicketAction(ticketId: string, reply: string): Promise<{ ok: boolean }> {
  await requireAdmin()
  const body = (reply ?? "").trim()
  if (!ticketId || body.length < 1 || body.length > 5000) return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase
    .from("support_tickets")
    .update({ admin_reply: body, status: "answered", replied_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", ticketId)
  if (error) {
    console.error("replyTicket failed", error)
    return { ok: false }
  }
  await recordAudit("admin.reply_support")
  revalidatePath("/admin/support")
  return { ok: true }
}

/** Admin marks a ticket closed (or re-opens it). */
export async function setTicketStatusAction(ticketId: string, status: "open" | "closed"): Promise<{ ok: boolean }> {
  await requireAdmin()
  if (!ticketId) return { ok: false }
  const supabase = await createClient()
  const { error } = await supabase
    .from("support_tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
  if (error) return { ok: false }
  revalidatePath("/admin/support")
  return { ok: true }
}
