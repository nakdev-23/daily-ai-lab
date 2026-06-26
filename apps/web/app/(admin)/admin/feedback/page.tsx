import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { getAdminFeedback } from "@/lib/lesson-feedback"
import { Star, MessageSquare, BookOpen, Users } from "lucide-react"

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return "เมื่อกี้"
  if (m < 60) return `${m} นาที`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} ชม.`
  return `${Math.floor(h / 24)} วัน`
}

/** Five stars, `n` of them filled. */
function Stars({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span className="fb-stars" aria-label={`${n} จาก 5 ดาว`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= n ? "on" : "off"} fill={i <= n ? "currentColor" : "none"} />
      ))}
    </span>
  )
}

/** Colour the average: green ≥4, amber ≥3, red below. */
function ratingTone(avg: number) {
  return avg >= 4 ? "ok" : avg >= 3 ? "warn" : "bad"
}

export default async function AdminFeedbackPage() {
  await requireAdmin()
  await recordAudit("admin.view_feedback")
  const data = await getAdminFeedback()

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1>รีวิวบทเรียน</h1>
          <div className="sub">
            {data ? `ความเห็นจากผู้เรียน ${data.total.toLocaleString()} รายการ` : "ฟีดแบคจากผู้เรียนแต่ละบทเรียน"}
          </div>
        </div>
      </div>

      {data === null && (
        <p className="adm-msg err">
          ยังอ่านรีวิวไม่ได้ — ตรวจสอบว่ารัน migration 023 (lesson_feedback) ใน Supabase แล้ว
        </p>
      )}

      {data && data.total === 0 && (
        <div className="panel glass" style={{ textAlign: "center", padding: "44px 22px" }}>
          <MessageSquare size={32} style={{ color: "var(--text-muted)", marginBottom: 10 }} />
          <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 600 }}>ยังไม่มีใครรีวิวบทเรียน</p>
          <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
            รีวิวจะเริ่มเข้ามาเมื่อผู้เรียนกดให้ดาวที่หน้าจบบทเรียน
          </p>
        </div>
      )}

      {data && data.total > 0 && (
        <>
          <div className="kpis">
            <div className="kpi glass">
              <div className="k-top">
                <span className="k-ic" style={{ background: "var(--sun-100)", color: "#9A6B00" }}><Star size={20} /></span>
                <span className={`fb-pill ${ratingTone(data.avg)}`}>เฉลี่ย</span>
              </div>
              <div className="k-val">{data.avg.toFixed(1)}</div>
              <div className="k-lbl"><Stars n={Math.round(data.avg)} size={13} /></div>
            </div>
            <div className="kpi glass">
              <div className="k-top">
                <span className="k-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><MessageSquare size={20} /></span>
              </div>
              <div className="k-val">{data.total.toLocaleString()}</div><div className="k-lbl">รีวิวทั้งหมด</div>
            </div>
            <div className="kpi glass">
              <div className="k-top">
                <span className="k-ic" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}><Users size={20} /></span>
              </div>
              <div className="k-val">{data.withComment.toLocaleString()}</div><div className="k-lbl">มีคอมเมนต์</div>
            </div>
            <div className="kpi glass">
              <div className="k-top">
                <span className="k-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><BookOpen size={20} /></span>
              </div>
              <div className="k-val">{data.byCourse.length.toLocaleString()}</div><div className="k-lbl">คอร์สที่ถูกรีวิว</div>
            </div>
          </div>

          <div className="panel glass" style={{ marginBottom: 22 }}>
            <div className="p-head">
              <h3 className="display">คะแนนเฉลี่ยตามคอร์ส</h3>
              <span className="more">คะแนนต่ำขึ้นก่อน</span>
            </div>
            <div className="atable">
              <div className="at-row at-head" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <span>คอร์ส</span><span>คะแนนเฉลี่ย</span><span>จำนวน</span>
              </div>
              {data.byCourse.map((c) => (
                <div key={c.courseId} className="at-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{c.courseTitle}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Stars n={Math.round(c.avg)} />
                    <b className={`fb-num ${ratingTone(c.avg)}`}>{c.avg.toFixed(1)}</b>
                  </span>
                  <span className="cell" style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel glass">
            <div className="p-head">
              <h3 className="display">รีวิวล่าสุด</h3>
              <span className="more">{data.rows.length.toLocaleString()} รายการ</span>
            </div>
            <div className="atable">
              <div className="at-row at-head" style={{ gridTemplateColumns: "minmax(0,1.4fr) auto minmax(0,1.6fr) auto" }}>
                <span>ผู้เรียน</span><span>คะแนน</span><span>ความเห็น</span><span>เมื่อ</span>
              </div>
              {data.rows.map((r, i) => (
                <div key={`${r.userId}-${r.courseId}-${r.lessonNum}-${i}`} className="at-row" style={{ gridTemplateColumns: "minmax(0,1.4fr) auto minmax(0,1.6fr) auto" }}>
                  <span style={{ minWidth: 0 }}>
                    <b style={{ display: "block", fontSize: 14 }}>{r.userName}</b>
                    <small style={{ color: "var(--text-muted)" }}>{r.courseTitle} · บทที่ {r.lessonNum}</small>
                  </span>
                  <span><Stars n={r.rating} /></span>
                  <span style={{ minWidth: 0, color: r.comment ? "var(--text-body)" : "var(--text-muted)", fontSize: 13.5 }}>
                    {r.comment?.trim() ? r.comment : "—"}
                  </span>
                  <span className="cell" style={{ color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>{timeAgo(r.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
