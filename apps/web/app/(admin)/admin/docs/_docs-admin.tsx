"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Search, Pencil, Trash2, FileText, X } from "lucide-react"
import { saveDocAction, deleteDocAction, type ActionResult } from "./actions"
import type { DocMeta } from "@/lib/docs"
import { toolBg } from "@/lib/tool-meta"
import AiLogo, { AI_ICON_MAP, AI_ICON_KEYS, toolToIconKey } from "@/components/ai-logo"

export type DocRow = { meta: DocMeta; body: string }

const LV_LABEL = { beginner: "Beginner", intermediate: "Intermediate", pro: "Pro" } as const
const hasAiIcon = (k?: string) => !!k && !!AI_ICON_MAP[k]
const LV_SPILL = { beginner: "ok", intermediate: "warn", pro: "mut" } as const

export default function DocsAdmin({ rows }: { rows: DocRow[] }) {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [editing, setEditing] = useState<DocRow | "new" | null>(null)
  const [deleting, setDeleting] = useState<DocRow | null>(null)

  const shown = rows.filter((r) => !q || `${r.meta.tool} ${r.meta.title}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <div className="adm-bar" style={{ marginTop: -6 }}>
        <div className="spacer" />
        <div className="adm-tools">
          <span className="tbl-search"><Search size={16} /> <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาเอกสาร…" /></span>
          <button className="btn btn--violet md" onClick={() => setEditing("new")}>+ เพิ่มเอกสาร</button>
        </div>
      </div>

      <div className="glass tablewrap">
        <table className="dtable">
          <thead><tr><th>เอกสาร</th><th>ระดับ</th><th>สถานะ</th><th /></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.meta.slug}>
                <td>
                  <span className="uc">
                    {hasAiIcon(r.meta.icon) || toolToIconKey(r.meta.tool)
                      ? <span className="av" style={{ background: "#fff", border: "1px solid var(--border-subtle)" }}><AiLogo name={hasAiIcon(r.meta.icon) ? r.meta.icon : r.meta.tool} size={22} fallback={r.meta.tool.charAt(0)} /></span>
                      : <span className="av" style={{ background: toolBg(r.meta.tool) }}>{r.meta.tool.charAt(0)}</span>}
                    <span><b>{r.meta.title}</b><small>{r.meta.tool} · {r.meta.readTime}</small></span>
                  </span>
                </td>
                <td><span className={`spill ${LV_SPILL[r.meta.level]}`}>{LV_LABEL[r.meta.level]}</span></td>
                <td><span className={`spill ${r.meta.locked ? "warn" : "ok"}`}>{r.meta.locked ? "Pro" : "ฟรี"}</span></td>
                <td>
                  <span className="row-act">
                    <button className="iconbtn" title="แก้ไข" onClick={() => setEditing(r)}><Pencil size={14} /></button>
                    <button className="iconbtn danger" title="ลบ" onClick={() => setDeleting(r)}><Trash2 size={14} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "28px 0" }}>ยังไม่มีเอกสาร</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <EditorModal row={editing === "new" ? null : editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); router.refresh() }} />}
      {deleting && <DeleteModal row={deleting} onClose={() => setDeleting(null)} onDone={() => { setDeleting(null); router.refresh() }} />}
    </>
  )
}

function EditorModal({ row, onClose, onDone }: { row: DocRow | null; onClose: () => void; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveDocAction, null)
  const m = row?.meta
  const [icon, setIcon] = useState<string>(hasAiIcon(m?.icon) ? m!.icon : (toolToIconKey(m?.tool ?? "") ?? ""))
  useEffect(() => { if (state?.ok) onDone() }, [state, onDone])

  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal lg" action={formAction} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--sky-100)", color: "var(--sky-500)" }}><FileText size={22} /></span>
          <div className="mh-tx"><h3>{m ? "แก้ไขเอกสาร" : "เพิ่มเอกสารใหม่"}</h3><p>เนื้อหารองรับ Markdown · แบ่งระดับ Beginner / Intermediate / Pro</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {m && <input type="hidden" name="slug" value={m.slug} />}
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld-row">
            <div className="fld"><label>เครื่องมือ</label><input className="fin" name="tool" defaultValue={m?.tool ?? ""} placeholder="เช่น Suno" required /></div>
            <div className="fld"><label>ระดับ</label>
              <select className="fin" name="level" defaultValue={m?.level ?? "beginner"}>
                <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <div className="fld"><label>หัวข้อ</label><input className="fin" name="title" defaultValue={m?.title ?? ""} placeholder="เช่น Suno คืออะไร" required /></div>
          <div className="fld-row">
            <div className="fld"><label>คำโปรย</label><input className="fin" name="summary" defaultValue={m?.summary ?? ""} placeholder="สรุปสั้น ๆ" /></div>
            <div className="fld"><label>เวลาอ่าน</label><input className="fin" name="readTime" defaultValue={m?.readTime ?? "5 นาที"} placeholder="5 นาที" /></div>
          </div>
          <div className="fld-row">
            <div className="fld"><label>ลำดับ</label><input className="fin" name="order" type="number" defaultValue={m?.order ?? 99} /></div>
            <div className="fld"><label>การเข้าถึง</label>
              <label style={{ display: "flex", alignItems: "center", gap: 9, height: 48, fontWeight: 700, fontSize: 14 }}>
                <input type="checkbox" name="locked" defaultChecked={m?.locked} style={{ width: 18, height: 18 }} /> เฉพาะสมาชิก Pro
              </label>
            </div>
          </div>
          <div className="fld">
            <label>โลโก้เครื่องมือ (AI icon)</label>
            <input type="hidden" name="icon" value={icon} />
            <div className="icon-picker">
              {AI_ICON_KEYS.map((k) => (
                <button key={k} type="button" className={`ic-opt${icon === k ? " sel" : ""}`} onClick={() => setIcon(k)} title={AI_ICON_MAP[k].label}>
                  <AiLogo name={k} size={26} />
                </button>
              ))}
            </div>
          </div>
          <div className="fld"><label>เนื้อหา (Markdown)</label><textarea className="fin" name="body" defaultValue={row?.body ?? ""} placeholder="# หัวข้อ&#10;&#10;พิมพ์เนื้อหาเอกสาร…" /></div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
        </div>
      </form>
    </div>
  )
}

function DeleteModal({ row, onClose, onDone }: { row: DocRow; onClose: () => void; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(deleteDocAction, null)
  useEffect(() => { if (state?.ok) onDone() }, [state, onDone])

  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 400 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="slug" value={row.meta.slug} />
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><Trash2 size={20} /></span>
          <div className="mh-tx"><h3>ลบเอกสาร?</h3><p>“{row.meta.title}” จะถูกลบถาวร กู้คืนไม่ได้</p></div>
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
