"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Medal, Gem, Trophy, Award, X, Trash2 } from "lucide-react"
import type { League, Badge } from "@/lib/leagues"
import { saveLeagueAction, deleteLeagueAction, saveBadgeAction, deleteBadgeAction, type LeagueActionResult } from "./actions"

const B = "/assets/daily-ai-lab/badges"
const BADGE_IMAGES = [
  "first-step", "7-day-streak", "30-day-streak", "early-bird", "night-owl", "xp-master", "quiz-whiz", "perfect-score",
  "speed-learner", "prompt-pro", "ai-explorer", "creator", "problem-solver", "helper", "legend",
]

export default function LeaguesAdmin({ leagues, badges }: { leagues: League[]; badges: Badge[] }) {
  const [league, setLeague] = useState<League | "new" | null>(null)
  const [badge, setBadge] = useState<Badge | "new" | null>(null)

  return (
    <>
      <div className="adm-bar">
        <div><h1>ลีก & รางวัล</h1><div className="sub">จัดการดิวิชั่น เกณฑ์ XP และแบดจ์</div></div>
        <div className="spacer" />
        <div className="adm-tools"><button className="btn btn--violet md" onClick={() => setLeague("new")}>+ เพิ่มลีก</button></div>
      </div>

      <div className="glass tablewrap" style={{ marginBottom: 22 }}>
        <table className="dtable">
          <thead><tr><th>ลีก</th><th>เกณฑ์ XP</th><th /></tr></thead>
          <tbody>
            {leagues.map((l, i) => (
              <tr key={l.id}>
                <td><span className="uc"><span className="av" style={{ background: LEAGUE_BG[i % LEAGUE_BG.length] }}>{i === leagues.length - 1 ? <Gem size={18} /> : <Medal size={18} />}</span><span><b>{l.name}</b></span></span></td>
                <td className="cell">{l.xp_range}</td>
                <td><span className="row-act"><button className="iconbtn" title="แก้ไข" onClick={() => setLeague(l)}><Pencil size={14} /></button></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adm-bar">
        <div><h1 style={{ fontSize: 20 }}>แบดจ์ความสำเร็จ</h1><div className="sub">{badges.length} แบดจ์</div></div>
        <div className="spacer" />
        <div className="adm-tools"><button className="btn btn--ghost md" onClick={() => setBadge("new")}>+ เพิ่มแบดจ์</button></div>
      </div>
      <div className="adm-badges">
        {badges.map((b) => (
          <div key={b.id} className="adm-badge glass">
            <img src={`${B}/badge-${b.img}.png`} alt={b.name} width={64} height={64} />
            <b>{b.name}</b><span>{b.condition}</span>
            <div style={{ marginTop: 12 }}><button className="iconbtn" style={{ margin: "0 auto" }} title="แก้ไข" onClick={() => setBadge(b)}><Pencil size={14} /></button></div>
          </div>
        ))}
      </div>

      {league && <LeagueModal league={league === "new" ? null : league} onClose={() => setLeague(null)} />}
      {badge && <BadgeModal badge={badge === "new" ? null : badge} onClose={() => setBadge(null)} />}
    </>
  )
}

const LEAGUE_BG = [
  "linear-gradient(160deg,#FFC489,#E0772B)", "linear-gradient(160deg,#D9E0EE,#9AA6C2)", "linear-gradient(160deg,#FFE27A,#F2B400)",
  "linear-gradient(160deg,#9FD2FF,#3E8FD8)", "linear-gradient(160deg,#D6F4FF,#62B8F2)", "linear-gradient(160deg,#C9B8FF,#6C3CF5)",
]

function useClose(state: LeagueActionResult | null, onClose: () => void) {
  const router = useRouter()
  useEffect(() => { if (state?.ok) { onClose(); router.refresh() } }, [state, onClose, router])
}

function LeagueModal({ league, onClose }: { league: League | null; onClose: () => void }) {
  const [state, save, pending] = useActionState<LeagueActionResult | null, FormData>(saveLeagueAction, null)
  const [del, delAction, deleting] = useActionState<LeagueActionResult | null, FormData>(deleteLeagueAction, null)
  useClose(state, onClose); useClose(del, onClose)
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={save} onClick={(e) => e.stopPropagation()}>
        {league && <input type="hidden" name="id" value={league.id} />}
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--sun-100)", color: "#9A6B00" }}><Trophy size={22} /></span>
          <div className="mh-tx"><h3>{league ? "แก้ไขลีก" : "เพิ่มลีกใหม่"}</h3><p>ตั้งชื่อดิวิชั่นและช่วง XP</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อลีก</label><input className="fin" name="name" defaultValue={league?.name ?? ""} placeholder="เช่น เพชร" required /></div>
          <div className="fld"><label>เกณฑ์ XP</label><input className="fin" name="xp_range" defaultValue={league?.xp_range ?? ""} placeholder="เช่น 4,000+ XP" /></div>
        </div>
        <div className="modal-foot spread">
          {league
            ? <button type="submit" className="btn md" formAction={delAction} disabled={deleting} style={{ background: "var(--berry-500)", color: "#fff", boxShadow: "0 5px 0 #B3322B" }}><Trash2 size={15} /> ลบ</button>
            : <span />}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

function BadgeModal({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  const [img, setImg] = useState(badge?.img ?? "first-step")
  const [state, save, pending] = useActionState<LeagueActionResult | null, FormData>(saveBadgeAction, null)
  const [del, delAction, deleting] = useActionState<LeagueActionResult | null, FormData>(deleteBadgeAction, null)
  useClose(state, onClose); useClose(del, onClose)
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={save} onClick={(e) => e.stopPropagation()}>
        {badge && <input type="hidden" name="id" value={badge.id} />}
        <input type="hidden" name="img" value={img} />
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><Award size={22} /></span>
          <div className="mh-tx"><h3>{badge ? "แก้ไขแบดจ์" : "เพิ่มแบดจ์"}</h3><p>ตั้งชื่อ เงื่อนไข และเลือกรูปแบดจ์</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อแบดจ์</label><input className="fin" name="name" defaultValue={badge?.name ?? ""} placeholder="เช่น นักวิ่งสตรีค" required /></div>
          <div className="fld"><label>เงื่อนไข</label><input className="fin" name="condition" defaultValue={badge?.condition ?? ""} placeholder="เช่น สตรีค 7 วัน" /></div>
          <div className="fld">
            <label>รูปแบดจ์</label>
            <div className="icon-picker">
              {BADGE_IMAGES.map((k) => (
                <button key={k} type="button" className={`ic-opt${img === k ? " sel" : ""}`} onClick={() => setImg(k)} title={k}>
                  <img src={`${B}/badge-${k}.png`} alt={k} width={28} height={28} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-foot spread">
          {badge
            ? <button type="submit" className="btn md" formAction={delAction} disabled={deleting} style={{ background: "var(--berry-500)", color: "#fff", boxShadow: "0 5px 0 #B3322B" }}><Trash2 size={15} /> ลบ</button>
            : <span />}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
