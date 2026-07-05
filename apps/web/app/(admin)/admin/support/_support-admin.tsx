"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LifeBuoy, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react"
import type { AdminSupportTicket } from "@/lib/support"
import { replyTicketAction } from "./actions"

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return "เมื่อกี้"
  if (m < 60) return `${m} นาที`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} ชม.`
  return `${Math.floor(h / 24)} วัน`
}

function TicketRow({ ti, onDone }: { ti: AdminSupportTicket; onDone: () => void }) {
  const [reply, setReply] = useState(ti.adminReply ?? "")
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function send() {
    if (reply.trim().length < 1 || pending) return
    startTransition(async () => {
      const r = await replyTicketAction(ti.id, reply)
      if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); onDone() }
    })
  }

  return (
    <article className="sup-ticket">
      <div className="sup-ticket-head">
        <div style={{ minWidth: 0 }}>
          <b>{ti.subject}</b>
          <small>{ti.userName} · {timeAgo(ti.createdAt)}</small>
        </div>
        <span className={`ticket-status ${ti.status}`}>
          {ti.status === "answered" ? <><CheckCircle2 size={13} /> ตอบแล้ว</>
            : ti.status === "closed" ? "ปิดแล้ว"
            : <><Clock size={13} /> รอตอบ</>}
        </span>
      </div>
      <p className="sup-ticket-detail">{ti.detail}</p>
      <div className="sup-reply">
        <textarea
          value={reply}
          rows={3}
          maxLength={5000}
          placeholder="พิมพ์คำตอบถึงผู้ใช้…"
          onChange={(e) => setReply(e.target.value)}
        />
        <button className="btn btn--violet sm" onClick={send} disabled={reply.trim().length < 1 || pending}>
          <Send size={15} /> {pending ? "กำลังส่ง…" : saved ? "ส่งแล้ว ✓" : ti.adminReply ? "อัปเดตคำตอบ" : "ส่งคำตอบ"}
        </button>
      </div>
    </article>
  )
}

export default function SupportAdmin({ tickets }: { tickets: AdminSupportTicket[] | null }) {
  const router = useRouter()
  const refresh = () => router.refresh()

  const openCount = tickets?.filter((t) => t.status === "open").length ?? 0

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1><LifeBuoy size={22} style={{ display: "inline", verticalAlign: "-4px", marginRight: 6 }} /> ฟีดแบ็ก & Support</h1>
          <div className="sub">{tickets ? `${tickets.length.toLocaleString()} เรื่อง · รอตอบ ${openCount}` : "เรื่องที่ผู้ใช้ส่งเข้ามา"}</div>
        </div>
      </div>

      {tickets === null && (
        <p className="adm-msg err">ยังอ่านเรื่องไม่ได้ — ตรวจสอบว่ารัน migration 042 (support_tickets) ใน Supabase แล้ว</p>
      )}

      {tickets && tickets.length === 0 && (
        <div className="panel glass" style={{ textAlign: "center", padding: "44px 22px" }}>
          <MessageSquare size={32} style={{ color: "var(--text-muted)", marginBottom: 10 }} />
          <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 600 }}>ยังไม่มีใครส่งเรื่องเข้ามา</p>
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <div className="sup-list">
          {tickets.map((ti) => (
            <TicketRow key={ti.id} ti={ti} onDone={refresh} />
          ))}
        </div>
      )}

      <style>{`
        .sup-list { display: grid; gap: 14px; }
        .sup-ticket { background: var(--surface,#fff); border: 1px solid var(--edge,#e7e2f5); border-radius: 16px; padding: 16px 18px; }
        .sup-ticket-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
        .sup-ticket-head b { display: block; font-size: 15px; color: var(--text-strong); }
        .sup-ticket-head small { color: var(--text-muted); }
        .sup-ticket-detail { margin: 0 0 12px; color: var(--text-body); line-height: 1.6; font-size: 14.5px; white-space: pre-wrap; }
        .sup-reply { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
        .sup-reply textarea { flex: 1; min-width: 240px; border: 1.5px solid var(--edge,#e7e2f5); border-radius: 12px; padding: 10px 12px; font: 500 14px/1.6 inherit; resize: vertical; }
        .sup-reply textarea:focus { outline: 3px solid rgba(108,60,245,.18); border-color: var(--hero-500); }
        .ticket-status { flex: none; display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
        .ticket-status.open { background: var(--sun-100,#FFF3C9); color: #8A5A00; }
        .ticket-status.answered { background: var(--mint-100); color: var(--mint-600); }
        .ticket-status.closed { background: var(--hero-100,#f1ecff); color: var(--text-muted); }
      `}</style>
    </>
  )
}
