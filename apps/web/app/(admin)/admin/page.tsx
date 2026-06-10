import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { getUsers } from "@/lib/users"
import { getAllDocs } from "@/lib/docs"
import { getCourses } from "@/lib/courses"
import { getToolColors } from "@/lib/tool-colors"
import { Users, Activity, CheckCircle2, Wallet, ArrowUp, ArrowDown, Pencil } from "lucide-react"

const CHART = [
  { d: "จ", h: 62, v: "31k" }, { d: "อ", h: 70, v: "35k" }, { d: "พ", h: 58, v: "29k" },
  { d: "พฤ", h: 78, v: "39k" }, { d: "ศ", h: 100, v: "43k", peak: true }, { d: "ส", h: 84, v: "42k" }, { d: "อา", h: 74, v: "37k" },
]
const POPULAR = [
  { c: "#19C37D", l: "ChatGPT พื้นฐาน", p: 38 }, { c: "#6C3CF5", l: "เขียน Prompt", p: 24 },
  { c: "#E2611C", l: "Claude เอกสาร", p: 18 }, { c: "#F45C97", l: "Midjourney", p: 12 }, { c: "#A69EC1", l: "อื่น ๆ", p: 8 },
]
const AV_BG = ["#6C3CF5", "#14A871", "#F45C97", "#2A8CF0", "#FD7302", "#B06CFF"]

const STATUS_TH: Record<string, string> = { published: "เผยแพร่", draft: "ร่าง", queued: "รอคิว" }
const STATUS_SPILL: Record<string, string> = { published: "ok", draft: "warn", queued: "mut" }

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${m} นาที`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} ชม.`
  return `${Math.floor(h / 24)} วัน`
}

export default async function AdminOverview() {
  await requireAdmin()
  await recordAudit("admin.view_dashboard")
  const [users, docs, courses] = await Promise.all([getUsers(), getAllDocs(), getCourses()])
  const recent = users.slice(0, 4)

  const KPIS = [
    { ic: Users, bg: "var(--hero-100)", col: "var(--hero-600)", v: users.length.toLocaleString(), l: "ผู้ใช้ทั้งหมด", t: "8.2%", up: true },
    { ic: Activity, bg: "var(--mint-100)", col: "var(--mint-600)", v: "42,910", l: "ใช้งานวันนี้", t: "4.1%", up: true },
    { ic: CheckCircle2, bg: "var(--sun-100)", col: "#9A6B00", v: "318,204", l: "บทเรียนที่จบ (7 วัน)", t: "12%", up: true },
    { ic: Wallet, bg: "var(--berry-100)", col: "var(--berry-600)", v: "฿1.84M", l: "รายได้เดือนนี้", t: "1.3%", up: false },
  ]

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 2px 18px", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 className="display" style={{ fontSize: 24, margin: 0 }}>สวัสดี Admin</h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 14 }}>สรุปภาพรวม 7 วันล่าสุด · มีเอกสาร {docs.length} ชุดในระบบ</p>
        </div>
        <Link className="btn btn--violet md" href="/admin/courses">+ เพิ่มคอร์สใหม่</Link>
      </div>

      <div className="kpis">
        {KPIS.map((k) => (
          <div key={k.l} className="kpi glass">
            <div className="k-top">
              <span className="k-ic" style={{ background: k.bg, color: k.col }}><k.ic size={20} /></span>
              <span className={`trend ${k.up ? "up" : "down"}`}>{k.up ? <ArrowUp size={13} /> : <ArrowDown size={13} />} {k.t}</span>
            </div>
            <div className="k-val">{k.v}</div><div className="k-lbl">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <div className="panel glass">
          <div className="p-head"><h3 className="display">ผู้ใช้งานรายวัน</h3><span className="more">7 วันล่าสุด</span></div>
          <div className="chart-bars">
            {CHART.map((b, i) => (
              <div key={i} className="cbar-wrap">
                <div className={`cbar${b.peak ? " peak" : ""}`} style={{ height: `${b.h}%` }}><span className="cv">{b.v}</span></div>
                <small>{b.d}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel glass">
          <div className="p-head"><h3 className="display">คอร์สยอดนิยม</h3><span className="more">ดูทั้งหมด</span></div>
          <div className="brk">
            {POPULAR.map((p) => (
              <div key={p.l}>
                <div className="brk-row"><span className="dot" style={{ background: p.c }} /><span className="bl">{p.l}</span><span className="bv">{p.p}%</span></div>
                <div className="brk-bar"><i style={{ width: `${p.p}%`, background: p.c }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="panel glass">
          <div className="p-head"><h3 className="display">ผู้สมัครล่าสุด</h3><Link className="more" href="/admin/users">ดูทั้งหมด</Link></div>
          <div className="atable">
            <div className="at-row at-head" style={{ gridTemplateColumns: "1fr auto auto" }}><span>ผู้ใช้</span><span>แพ็กเกจ</span><span>เข้าร่วม</span></div>
            {recent.map((u, i) => (
              <div key={u.id} className="at-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <span className="uc"><span className="av" style={{ background: AV_BG[i % AV_BG.length] }}>{(u.display_name ?? "?").charAt(0)}</span><span><b>{u.display_name}</b><small>@{u.id.slice(0, 6)}</small></span></span>
                <span><span className={`spill ${u.role === "admin" ? "ok" : "mut"}`}>{u.role === "admin" ? "ผู้ดูแล" : "ผู้เรียน"}</span></span>
                <span className="cell">{u.created_at ? timeAgo(u.created_at) : "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel glass">
          <div className="p-head"><h3 className="display">จัดการคอร์ส</h3><Link className="more" href="/admin/courses">+ เพิ่ม</Link></div>
          <div className="atable">
            <div className="at-row at-head" style={{ gridTemplateColumns: "1fr auto auto" }}><span>คอร์ส</span><span>สถานะ</span><span /></div>
            {courses.map((c) => {
              const colors = getToolColors(c.tool)
              const subtitle = c.units > 0 ? `${c.units} บท · ${c.lessons} บทเรียน` : c.lessons > 0 ? `${c.lessons} บทเรียน` : "กำลังเตรียม"
              return (
                <div key={c.id} className="at-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                  <span className="uc"><span className="av" style={{ background: colors.bg }}>{colors.fallback}</span><span><b>{c.title}</b><small>{subtitle}</small></span></span>
                  <span><span className={`spill ${STATUS_SPILL[c.status] ?? "mut"}`}>{STATUS_TH[c.status] ?? c.status}</span></span>
                  <span className="row-act"><Link className="iconbtn" href="/admin/courses"><Pencil size={14} /></Link></span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
