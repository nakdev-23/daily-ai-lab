"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Search, Shield, ShieldCheck, Flame, Crown, X, Check, Clock, History, CreditCard } from "lucide-react"
import { changeRole, setUserPlan, loadUserSubHistory, type PlanResult } from "./actions"
import type { AppUser, SubHistoryEntry } from "@/lib/users"

const AV_BG = ["#6C3CF5", "#14A871", "#F45C97", "#2A8CF0", "#FD7302", "#B06CFF", "#23D08A", "#E2611C"]
const colorFor = (s: string) => AV_BG[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AV_BG.length]

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

const ACTION_LABEL: Record<string, string> = {
  "subscription.admin_change": "แอดมินเปลี่ยนแพ็กเกจ",
  "role.change": "เปลี่ยนบทบาท",
}

export default function UsersTable({ users, adminId }: { users: AppUser[]; adminId: string }) {
  const [tab, setTab] = useState<"all" | "admin" | "user" | "pro">("all")
  const [q, setQ] = useState("")
  const [manage, setManage] = useState<AppUser | null>(null)

  const adminCount = users.filter((u) => u.role === "admin").length
  const proCount = users.filter((u) => u.plan === "pro").length
  const userCount = users.length - adminCount

  const shown = users.filter((u) => {
    if (tab === "admin" && u.role !== "admin") return false
    if (tab === "user" && u.role !== "user") return false
    if (tab === "pro" && u.plan !== "pro") return false
    if (q && !`${u.display_name} ${u.id}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const TABS: [typeof tab, string, number][] = [
    ["all", "ทั้งหมด", users.length],
    ["pro", "Pro", proCount],
    ["admin", "ผู้ดูแล", adminCount],
    ["user", "ผู้เรียน", userCount],
  ]

  return (
    <>
      <div className="adm-bar" style={{ marginTop: -6 }}>
        <div className="spacer" />
        <div className="adm-tools">
          <span className="tbl-search"><Search size={16} /> <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาชื่อ / ไอดี…" /></span>
        </div>
      </div>

      <div className="chip-tabs">
        {TABS.map(([k, label, n]) => (
          <button key={k} className={`chip-tab${tab === k ? " on" : ""}`} onClick={() => setTab(k)}>{label} <span className="ct-n">{n}</span></button>
        ))}
      </div>

      <div className="glass tablewrap">
        <table className="dtable">
          <thead><tr><th>ผู้ใช้</th><th>แพ็กเกจ</th><th>บทบาท</th><th>เข้าร่วม</th><th /></tr></thead>
          <tbody>
            {shown.map((u) => {
              const isAdmin = u.role === "admin"
              const isSelf = u.id === adminId
              const isPro = u.plan === "pro"
              return (
                <tr key={u.id}>
                  <td>
                    <span className="uc"><span className="av" style={{ background: colorFor(u.id) }}>{(u.display_name ?? "?").charAt(0)}</span>
                      <span><b>{u.display_name}{isSelf && " (คุณ)"}</b><small>@{u.id.slice(0, 8)}</small></span></span>
                  </td>
                  <td>
                    {isPro ? (
                      <span className="pkg-cell">
                        <span className="spill ok"><Crown size={12} /> Pro</span>
                        <small>{u.expiresAt ? `ถึง ${fmtDate(u.expiresAt)}` : "ไม่มีกำหนด"}</small>
                      </span>
                    ) : (
                      <span className="spill mut">Free</span>
                    )}
                  </td>
                  <td><span className={`spill ${isAdmin ? "ok" : "mut"}`}>{isAdmin ? <ShieldCheck size={13} /> : <Flame size={13} />} {isAdmin ? "ผู้ดูแล" : "ผู้เรียน"}</span></td>
                  <td className="cell">{fmtDate(u.created_at)}</td>
                  <td>
                    <span className="row-act" style={{ gap: 6 }}>
                      <button className="iconbtn" type="button" title="จัดการแพ็กเกจ / ดูประวัติ" onClick={() => setManage(u)}><CreditCard size={14} /></button>
                      {isSelf ? (
                        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>—</span>
                      ) : (
                        <form action={changeRole}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="role" value={isAdmin ? "user" : "admin"} />
                          <button className="iconbtn" type="submit" title={isAdmin ? "ลดเป็นผู้เรียน" : "ตั้งเป็นผู้ดูแล"}>
                            <Shield size={14} />
                          </button>
                        </form>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
            {shown.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "28px 0" }}>ไม่พบผู้ใช้</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {manage && <ManageModal user={manage} onClose={() => setManage(null)} />}
    </>
  )
}

function ManageModal({ user, onClose }: { user: AppUser; onClose: () => void }) {
  const router = useRouter()
  const [state, action, pending] = useActionState<PlanResult, FormData>(setUserPlan, null)
  const [history, setHistory] = useState<SubHistoryEntry[] | null>(null)
  // Default the expiry field to the current value (date part) for convenience.
  const [expiry, setExpiry] = useState(user.expiresAt ? user.expiresAt.slice(0, 10) : "")

  useEffect(() => {
    loadUserSubHistory(user.id).then(setHistory).catch(() => setHistory([]))
  }, [user.id])

  // Refresh the table after a successful change so the row reflects the new plan.
  useEffect(() => { if (state?.ok) router.refresh() }, [state, router])

  const isPro = user.plan === "pro"

  return (
    <div className="modal-ovl" onClick={onClose}>
      <div className="modal lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><CreditCard size={22} /></span>
          <div className="mh-tx"><h3>จัดการแพ็กเกจ</h3><p>{user.display_name} · @{user.id.slice(0, 8)}</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          {/* current status */}
          <div className="pkg-status">
            <div><span className="pl">แพ็กเกจปัจจุบัน</span><b>{isPro ? <><Crown size={14} className="text-amber-500" /> Pro</> : "Free"}</b></div>
            <div><span className="pl">สมัครเมื่อ</span><b>{fmtDate(user.subscribedAt)}</b></div>
            <div><span className="pl">อัปเดตล่าสุด</span><b>{fmtDate(user.updatedAt)}</b></div>
            <div><span className="pl">หมดอายุ</span><b>{isPro ? (user.expiresAt ? fmtDate(user.expiresAt) : "ไม่มีกำหนด") : "—"}</b></div>
            <div><span className="pl">ช่องทาง</span><b>{user.viaStripe ? "Stripe" : "ตั้งค่าโดยแอดมิน"}</b></div>
          </div>

          {state && <div className={`adm-msg ${state.ok ? "ok" : "err"}`}>{state.ok && <Check size={14} />} {state.message}</div>}

          {/* controls */}
          <form action={action} className="pkg-form">
            <input type="hidden" name="userId" value={user.id} />
            <div className="fld">
              <label>วันหมดอายุ (เว้นว่าง = ไม่มีกำหนด)</label>
              <input className="fin" type="date" name="expiresAt" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            </div>
            <div className="pkg-actions">
              <button type="submit" name="plan" value="pro" className="btn btn--violet md" disabled={pending}>
                <Crown size={15} /> {isPro ? "อัปเดต Pro" : "ตั้งเป็น Pro"}
              </button>
              <button type="submit" name="plan" value="free" className="btn btn--danger md" disabled={pending || !isPro}>
                เปลี่ยนเป็น Free
              </button>
            </div>
            {user.viaStripe && (
              <p className="pkg-note"><Clock size={12} /> ผู้ใช้นี้ชำระผ่าน Stripe — การเปลี่ยนเป็น Free จะยกเลิกการเรียกเก็บใน Stripe ด้วย</p>
            )}
          </form>

          {/* history */}
          <div className="pkg-history">
            <h4><History size={15} /> ประวัติการเปลี่ยนแพ็กเกจ</h4>
            {history === null ? (
              <p className="pkg-hempty">กำลังโหลด…</p>
            ) : history.length === 0 ? (
              <p className="pkg-hempty">ยังไม่มีประวัติ</p>
            ) : (
              <ul className="pkg-hlist">
                {history.map((h) => {
                  const d = h.details ?? {}
                  const from = String(d.from ?? "")
                  const to = String(d.to ?? "")
                  return (
                    <li key={h.id}>
                      <span className="ph-dot" />
                      <div className="ph-body">
                        <b>{ACTION_LABEL[h.action] ?? h.action}{from && to ? `: ${from} → ${to}` : ""}</b>
                        <small>{fmtDateTime(h.created_at)}{h.actor ? ` · โดย ${h.actor}` : ""}{d.expiresAt ? ` · ถึง ${fmtDate(String(d.expiresAt))}` : ""}</small>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  )
}
