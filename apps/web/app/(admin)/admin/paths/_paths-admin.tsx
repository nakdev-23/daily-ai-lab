"use client"

import { useState, useEffect, useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Pencil, Trash2, Globe, EyeOff, Rocket, X } from "lucide-react"
import type { CareerPathRow } from "@/lib/career-paths"
import {
  saveCareerPathAction, deleteCareerPathAction,
  togglePublishAction, type PathActionResult,
} from "./actions"

const TONES = ["violet", "mint", "pink", "sky", "sun"] as const

export default function PathsAdmin({ paths }: { paths: CareerPathRow[] }) {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [editing, setEditing] = useState<CareerPathRow | "new" | null>(null)
  const [deleting, setDeleting] = useState<CareerPathRow | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const shown = paths.filter((p) =>
    !q || p.title.toLowerCase().includes(q.toLowerCase())
  )

  async function handleToggle(p: CareerPathRow) {
    setToggling(p.id)
    await togglePublishAction(p.id, p.isPublished)
    router.refresh()
    setToggling(null)
  }

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1>เส้นทางอาชีพ</h1>
          <div className="sub">{paths.length} เส้นทาง · {paths.filter((p) => p.isPublished).length} เผยแพร่</div>
        </div>
        <div className="spacer" />
        <div className="adm-tools">
          <span className="tbl-search"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหา…" /></span>
          <button className="btn btn--violet md" onClick={() => setEditing("new")}>+ เพิ่มเส้นทาง</button>
        </div>
      </div>

      <div className="glass tablewrap">
        <table className="dtable">
          <thead><tr><th>เส้นทาง</th><th>เครื่องมือ</th><th>สัปดาห์</th><th>สถานะ</th><th /></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="uc">
                    <span className="av" style={{ background: "var(--hero-100)", color: "var(--hero-600)", fontSize: 16 }}><Rocket size={16} /></span>
                    <span><b>{p.title}</b><small>{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</small></span>
                  </span>
                </td>
                <td className="cell" style={{ fontSize: 13 }}>{p.tools.join(", ")}</td>
                <td className="num">{p.weeks}</td>
                <td>
                  <span className={`spill ${p.isPublished ? "ok" : "warn"}`}>
                    {p.isPublished ? "เผยแพร่" : "ร่าง"}
                  </span>
                </td>
                <td>
                  <span className="row-act">
                    <button
                      className="iconbtn"
                      title={p.isPublished ? "ซ่อน" : "เผยแพร่"}
                      disabled={toggling === p.id}
                      onClick={() => handleToggle(p)}
                    >
                      {p.isPublished ? <EyeOff size={14} /> : <Globe size={14} />}
                    </button>
                    <Link className="iconbtn" title="จัดการโมดูล" href={`/admin/paths/${p.id}`}><Pencil size={14} /></Link>
                    <button className="iconbtn danger" title="ลบ" onClick={() => setDeleting(p)}><Trash2 size={14} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "28px 0" }}>ไม่พบเส้นทาง</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <PathModal path={editing === "new" ? null : editing} onClose={() => { setEditing(null); router.refresh() }} />}
      {deleting && <DeleteModal path={deleting} onClose={() => { setDeleting(null); router.refresh() }} />}
    </>
  )
}

function PathModal({ path, onClose }: { path: CareerPathRow | null; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<PathActionResult | null, FormData>(saveCareerPathAction, null)
  useEffect(() => { if (state?.ok) onClose() }, [state, onClose])

  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={formAction} onClick={(e) => e.stopPropagation()}>
        {path && <input type="hidden" name="id" value={path.id} />}
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><Rocket size={22} /></span>
          <div className="mh-tx"><h3>{path ? "แก้ไขเส้นทาง" : "เพิ่มเส้นทางใหม่"}</h3><p>ตั้งชื่อ เครื่องมือ และสถานะเผยแพร่</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อเส้นทาง</label><input className="fin" name="title" defaultValue={path?.title ?? ""} placeholder="เช่น Prompt Engineer" required /></div>
          <div className="fld"><label>Slug (URL)</label><input className="fin" name="slug" defaultValue={path?.slug ?? ""} placeholder="prompt-engineer" required /></div>
          <div className="fld"><label>แท็ก</label><input className="fin" name="tag" defaultValue={path?.tag ?? ""} placeholder="Most popular" /></div>
          <div className="fld"><label>คำอธิบาย</label><textarea className="fin" name="description" defaultValue={path?.description ?? ""} style={{ minHeight: 72, fontFamily: "var(--font-sans)", fontSize: 14.5 }} /></div>
          <div className="fld"><label>เครื่องมือ (คั่นด้วยลูกน้ำ)</label><input className="fin" name="tools" defaultValue={path?.tools.join(", ") ?? ""} placeholder="ChatGPT, Claude, Gemini" /></div>
          <div className="fld-row">
            <div className="fld"><label>ธีมสี</label>
              <select className="fin" name="tone" defaultValue={path?.tone ?? "violet"}>
                {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="fld"><label>จำนวนสัปดาห์</label><input className="fin" name="weeks" type="number" min="1" defaultValue={path?.weeks ?? 4} /></div>
            <div className="fld"><label>ลำดับ</label><input className="fin" name="order_index" type="number" min="0" defaultValue={path?.orderIndex ?? 0} /></div>
          </div>
          <div className="fld-row">
            <div className="fld"><label>ต้องการ Pro</label>
              <select className="fin" name="is_pro" defaultValue={String(path?.isPro ?? true)}>
                <option value="false">ฟรี</option>
                <option value="true">Pro เท่านั้น</option>
              </select>
            </div>
            <div className="fld"><label>สถานะ</label>
              <select className="fin" name="is_published" defaultValue={String(path?.isPublished ?? false)}>
                <option value="false">ร่าง</option>
                <option value="true">เผยแพร่</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
        </div>
      </form>
    </div>
  )
}

function DeleteModal({ path, onClose }: { path: CareerPathRow; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<PathActionResult | null, FormData>(deleteCareerPathAction, null)
  useEffect(() => { if (state?.ok) onClose() }, [state, onClose])

  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 400 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="id" value={path.id} />
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><Trash2 size={20} /></span>
          <div className="mh-tx"><h3>ลบเส้นทาง?</h3><p>"{path.title}" และโมดูลทั้งหมดจะถูกลบ</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-foot spread">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn md" style={{ background: "var(--berry-500)", color: "#fff", boxShadow: "0 5px 0 #B3322B" }} disabled={pending}>{pending ? "กำลังลบ…" : "ลบถาวร"}</button>
        </div>
      </form>
    </div>
  )
}
