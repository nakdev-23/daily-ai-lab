"use server"

import { revalidatePath } from "next/cache"
import { createClient, getAuthUser } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"

export type CreateTicketResult = { ok: true } | { ok: false; reason: "not-signed-in" | "invalid" | "rate-limited" | "error" }

/** A signed-in user opens a support ticket (subject + details). */
export async function createTicketAction(input: { subject: string; detail: string }): Promise<CreateTicketResult> {
  const user = await getAuthUser()
  if (!user) return { ok: false, reason: "not-signed-in" }

  const subject = (input.subject ?? "").trim()
  const detail = (input.detail ?? "").trim()
  if (subject.length < 3 || subject.length > 200 || detail.length < 1 || detail.length > 5000) {
    return { ok: false, reason: "invalid" }
  }
  // Light abuse guard: a handful of tickets per 10 minutes is plenty.
  if (!rateLimit(`support:${user.id}`, 5, 600_000).ok) return { ok: false, reason: "rate-limited" }

  const supabase = await createClient()
  const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject, detail })
  if (error) {
    console.error("createTicket failed", error)
    return { ok: false, reason: "error" }
  }
  revalidatePath("/support")
  return { ok: true }
}
