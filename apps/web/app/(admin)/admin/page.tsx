import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { getUsers } from "@/lib/users"
import { getAllDocs } from "@/lib/docs"
import { getCourses } from "@/lib/courses"
import { getAdminOverview } from "@/lib/admin-stats"
import { getToolColors } from "@/lib/tool-colors"
import { Users, Activity, CheckCircle2, Crown, ArrowUp, ArrowDown, Pencil } from "lucide-react"

const AV_BG = ["#6C3CF5", "#14A871", "#F45C97", "#2A8CF0", "#FD7302", "#B06CFF"]
const BRK_COLORS = ["#19C37D", "#6C3CF5", "#E2611C", "#F45C97", "#2A8CF0"]
const DAY_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

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
  const [users, docs, courses, stats] = await Promise.all([getUsers(), getAllDocs(), getCourses(), getAdminOverview()])
  // getUsers orders oldest-first; "latest signups" wants the newest.
  const recent = users.slice(-4).reverse()

  // Real signups trend: this 7-day window vs the previous one.
  const trendPct = stats && stats.prevUsers7d > 0
    ? Math.round(((stats.newUsers7d - stats.prevUsers7d) / stats.prevUsers7d) * 100)
    : null
  const KPIS = [
    {
      ic: Users, bg: "var(--hero-100)", col: "var(--hero-600)",
      v: (stats?.totalUsers ?? users.length).toLocaleString(), l: "ผู้ใช้ทั้งหมด",
      t: trendPct !== null ? `${Math.abs(trendPct)}%` : `+${stats?.newUsers7d ?? 0} ใน 7 วัน`,
      up: trendPct === null ? true : trendPct >= 0,
    },
    {
      ic: Activity, bg: "var(--mint-100)", col: "var(--mint-600)",
      v: (stats?.activeToday ?? 0).toLocaleString(), l: "เรียนวันนี้ (คน)",
      t: `${(stats?.lessonsToday ?? 0).toLocaleString()} บทวันนี้`, up: true,
    },
    {
      ic: CheckCircle2, bg: "var(--sun-100)", col: "#9A6B00",
      v: (stats?.lessonsTotal ?? 0).toLocaleString(), l: "บทเรียนที่จบทั้งหมด",
      t: `${(stats?.lessonsToday ?? 0).toLocaleString()} วันนี้`, up: true,
    },
    {
      ic: Crown, bg: "var(--berry-100)", col: "var(--berry-600)",
      v: (stats?.proCount ?? 0).toLocaleString(), l: "สมาชิก Pro",
      t: `฿${(stats?.mrr ?? 0).toLocaleString()}/เดือน`, up: (stats?.proCount ?? 0) > 0,
    },
  ]

  // Signup chart: bar heights normalized against the busiest day.
  const signups = stats?.signups7d ?? []
  const maxSignups = Math.max(1, ...signups.map((s) => s.n))
  const chart = signups.map((s) => {
    const date = new Date(`${s.d}T00:00:00`)
    return { d: DAY_TH[date.getDay()] ?? "", n: s.n, h: Math.max(6, Math.round((s.n / maxSignups) * 100)), peak: s.n === maxSignups && s.n > 0 }
  })

  // Popular courses by lessons completed, as a share of all completions.
  const byKey = new Map(courses.map((c) => [c.slug || c.id, c]))
  const popularDone = (stats?.popular ?? []).reduce((s, p) => s + p.done, 0)
  const otherDone = Math.max(0, (stats?.lessonsTotal ?? 0) - popularDone)
  const popular = (stats?.popular ?? []).map((p, i) => {
    const course = byKey.get(p.courseId)
    return {
      c: BRK_COLORS[i % BRK_COLORS.length],
      l: course?.title ?? p.courseId,
      p: stats && stats.lessonsTotal > 0 ? Math.round((p.done / stats.lessonsTotal) * 100) : 0,
      n: p.done,
    }
  })
  if (otherDone > 0 && stats) {
    popular.push({ c: "#A69EC1", l: "อื่น ๆ", p: Math.round((otherDone / stats.lessonsTotal) * 100), n: otherDone })
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 2px 18px", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 className="display" style={{ fontSize: 24, margin: 0 }}>สวัสดี Admin</h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 14 }}>สรุปภาพรวม 7 วันล่าสุด · มีเอกสาร {docs.length} ชุดในระบบ</p>
        </div>
        <Link className="btn btn--violet md" href="/admin/courses">+ เพิ่มคอร์สใหม่</Link>
      </div>

      {!stats && (
        <p className="adm-msg err" style={{ marginBottom: 14 }}>
          ยังดึงสถิติรวมไม่ได้ — ตรวจสอบว่ารัน migration 013 (get_admin_overview) แล้ว
        </p>
      )}

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
          <div className="p-head"><h3 className="display">ผู้สมัครใหม่รายวัน</h3><span className="more">7 วันล่าสุด</span></div>
          {chart.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "30px 0", textAlign: "center", margin: 0 }}>ยังไม่มีข้อมูล</p>
          ) : (
            <div className="chart-bars">
              {chart.map((b, i) => (
                <div key={i} className="cbar-wrap">
                  <div className={`cbar${b.peak ? " peak" : ""}`} style={{ height: `${b.h}%` }}><span className="cv">{b.n.toLocaleString()}</span></div>
                  <small>{b.d}</small>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="panel glass">
          <div className="p-head"><h3 className="display">คอร์สยอดนิยม</h3><span className="more">ตามบทเรียนที่จบ</span></div>
          {popular.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "30px 0", textAlign: "center", margin: 0 }}>ยังไม่มีใครเริ่มเรียน</p>
          ) : (
            <div className="brk">
              {popular.map((p) => (
                <div key={p.l}>
                  <div className="brk-row"><span className="dot" style={{ background: p.c }} /><span className="bl">{p.l}</span><span className="bv">{p.n.toLocaleString()} บท · {p.p}%</span></div>
                  <div className="brk-bar"><i style={{ width: `${p.p}%`, background: p.c }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="panel glass">
          <div className="p-head"><h3 className="display">ผู้สมัครล่าสุด</h3><Link className="more" href="/admin/users">ดูทั้งหมด</Link></div>
          <div className="atable">
            <div className="at-row at-head" style={{ gridTemplateColumns: "1fr auto auto" }}><span>ผู้ใช้</span><span>บทบาท</span><span>เข้าร่วม</span></div>
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
