"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LifeBuoy, Send, MessageSquare, CheckCircle2, Clock, Sparkles } from "lucide-react"
import { makeT, type Lang } from "@/lib/i18n-core"
import type { SupportTicket } from "@/lib/support"
import { createTicketAction } from "./actions"

function fmt(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-US", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok",
  }).format(new Date(iso))
}

export default function SupportClient({ tickets, tableMissing, lang }: { tickets: SupportTicket[]; tableMissing: boolean; lang: Lang }) {
  const t = makeT(lang)
  const router = useRouter()
  const [subject, setSubject] = useState("")
  const [detail, setDetail] = useState("")
  const [err, setErr] = useState("")
  const [sent, setSent] = useState(false)
  const [pending, startTransition] = useTransition()

  const canSend = subject.trim().length >= 3 && detail.trim().length >= 1

  function submit() {
    if (!canSend || pending) return
    setErr("")
    startTransition(async () => {
      const r = await createTicketAction({ subject, detail })
      if (r.ok) {
        setSubject(""); setDetail(""); setSent(true)
        setTimeout(() => setSent(false), 4000)
        router.refresh()
      } else {
        setErr(
          r.reason === "rate-limited" ? t("You've sent a lot of messages — please wait a bit.")
          : r.reason === "not-signed-in" ? t("Please sign in first.")
          : r.reason === "invalid" ? t("Add a subject (3+ chars) and some details.")
          : t("Couldn't send — please try again."),
        )
      }
    })
  }

  return (
    <section className="support-page">
      <header className="support-head">
        <div>
          <h1 className="display"><LifeBuoy size={26} /> {t("Feedback & Support")}</h1>
          <p>{t("Found a bug, have an idea, or need help? Send us a message — we'll reply right here.")}</p>
        </div>
      </header>

      <div className="support-grid">
        {/* New message */}
        <div className="support-form panel glass">
          <h2 className="display">{t("Send a message")}</h2>
          <label>
            <span>{t("Subject")}</span>
            <input value={subject} maxLength={200} placeholder={t("e.g. Lesson won't open / Feature idea")} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label>
            <span>{t("Details")}</span>
            <textarea value={detail} maxLength={5000} rows={6} placeholder={t("Tell us what happened or what you'd like…")} onChange={(e) => setDetail(e.target.value)} />
          </label>
          {err && <p className="support-err">{err}</p>}
          {sent && <p className="support-ok"><CheckCircle2 size={15} /> {t("Sent! We'll reply here when we get back to you.")}</p>}
          <button className="btn btn--violet lg" onClick={submit} disabled={!canSend || pending}>
            <Send size={17} /> {pending ? t("Sending…") : t("Send")}
          </button>
        </div>

        {/* History */}
        <div className="support-history">
          <h2 className="display">{t("Your messages")}</h2>
          {tableMissing ? (
            <p className="support-err">{t("Support isn't available right now — please try again later.")}</p>
          ) : tickets.length === 0 ? (
            <div className="support-empty panel glass">
              <MessageSquare size={30} />
              <p>{t("No messages yet. Send your first one on the left.")}</p>
            </div>
          ) : (
            tickets.map((ti) => (
              <article key={ti.id} className="ticket-card panel glass">
                <div className="ticket-top">
                  <b>{ti.subject}</b>
                  <span className={`ticket-status ${ti.status}`}>
                    {ti.status === "answered" ? <><CheckCircle2 size={13} /> {t("Answered")}</>
                      : ti.status === "closed" ? t("Closed")
                      : <><Clock size={13} /> {t("Waiting for reply")}</>}
                  </span>
                </div>
                <p className="ticket-detail">{ti.detail}</p>
                <div className="ticket-meta">{fmt(ti.createdAt, lang)}</div>
                {ti.adminReply && (
                  <div className="ticket-reply">
                    <div className="ticket-reply-head"><Sparkles size={14} /> {t("Reply from the team")}</div>
                    <p>{ti.adminReply}</p>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
