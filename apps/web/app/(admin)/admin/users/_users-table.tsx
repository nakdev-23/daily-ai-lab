"use client"

import { useState } from "react"
import { Search, Shield, ShieldCheck, Flame } from "lucide-react"
import { changeRole } from "./actions"
import type { AppUser } from "@/lib/users"

const AV_BG = ["#6C3CF5", "#14A871", "#F45C97", "#2A8CF0", "#FD7302", "#B06CFF", "#23D08A", "#E2611C"]
const colorFor = (s: string) => AV_BG[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AV_BG.length]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
}

export default function UsersTable({ users, adminId }: { users: AppUser[]; adminId: string }) {
  const [tab, setTab] = useState<"all" | "admin" | "user">("all")
  const [q, setQ] = useState("")

  const adminCount = users.filter((u) => u.role === "admin").length
  const userCount = users.length - adminCount

  const shown = users.filter((u) => {
    if (tab !== "all" && u.role !== tab) return false
    if (q && !`${u.display_name} ${u.id}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const TABS: [typeof tab, string, number][] = [
    ["all", "ทั้งหมด", users.length],
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
          <thead><tr><th>ผู้ใช้</th><th>บทบาท</th><th>เข้าร่วม</th><th /></tr></thead>
          <tbody>
            {shown.map((u) => {
              const isAdmin = u.role === "admin"
              const isSelf = u.id === adminId
              return (
                <tr key={u.id}>
                  <td>
                    <span className="uc"><span className="av" style={{ background: colorFor(u.id) }}>{(u.display_name ?? "?").charAt(0)}</span>
                      <span><b>{u.display_name}{isSelf && " (คุณ)"}</b><small>@{u.id.slice(0, 8)}</small></span></span>
                  </td>
                  <td><span className={`spill ${isAdmin ? "ok" : "mut"}`}>{isAdmin ? <ShieldCheck size={13} /> : <Flame size={13} />} {isAdmin ? "ผู้ดูแล" : "ผู้เรียน"}</span></td>
                  <td className="cell">{fmtDate(u.created_at)}</td>
                  <td>
                    <span className="row-act">
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
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "28px 0" }}>ไม่พบผู้ใช้</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
