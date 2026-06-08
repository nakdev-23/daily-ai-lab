"use client"

import { useState, useEffect, useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Pencil, Trash2, BookMarked, X } from "lucide-react"
import { toolBg } from "@/lib/tool-meta"
import type { Course } from "@/lib/courses"
import { saveCourseAction, deleteCourseAction, type CourseActionResult } from "./actions"

const LV_LABEL = { beginner: "เริ่มต้น", intermediate: "ระดับกลาง", advanced: "ขั้นสูง" } as const
const ST = { published: { label: "เผยแพร่", spill: "ok" }, draft: { label: "ร่าง", spill: "warn" }, queued: { label: "รอคิว", spill: "mut" } } as const
const TABS = [["all", "ทั้งหมด"], ["published", "เผยแพร่"], ["draft", "ร่าง"], ["queued", "รอคิว"]] as const

export default function CoursesAdmin({ courses }: { courses: Course[] }) {
  const [tab, setTab] = useState<string>("all")
  const [q, setQ] = useState("")
  const [editing, setEditing] = useState<Course | "new" | null>(null)
  const [deleting, setDeleting] = useState<Course | null>(null)

  const shown = courses.filter((c) => (tab === "all" || c.status === tab) && (!q || c.title.toLowerCase().includes(q.toLowerCase())))
  const count = (s: string) => courses.filter((c) => c.status === s).length

  return (
    <>
      <div className="adm-bar">
        <div><h1>คอร์ส & บทเรียน</h1><div className="sub">{courses.length} คอร์ส · {courses.reduce((s, c) => s + c.units, 0)} บท · {courses.reduce((s, c) => s + c.lessons, 0)} บทเรียน</div></div>
        <div className="spacer" />
        <div className="adm-tools">
          <span className="tbl-search"><Search size={16} /> <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาคอร์ส…" /></span>
          <button className="btn btn--violet md" onClick={() => setEditing("new")}>+ เพิ่มคอร์ส</button>
        </div>
      </div>
      <div className="chip-tabs">
        {TABS.map(([k, label]) => (
          <button key={k} className={`chip-tab${tab === k ? " on" : ""}`} onClick={() => setTab(k)}>{label} <span className="ct-n">{k === "all" ? courses.length : count(k)}</span></button>
        ))}
      </div>
      <div className="glass tablewrap">
        <table className="dtable">
          <thead><tr><th>คอร์ส</th><th>ระดับ</th><th>บท</th><th>บทเรียน</th><th>สถานะ</th><th /></tr></thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c.id}>
                <td><span className="uc"><span className="av" style={{ background: toolBg(c.tool) }}>{c.tool.charAt(0)}</span><span><b>{c.title}</b><small>{c.description}</small></span></span></td>
                <td className="cell">{LV_LABEL[c.level]}</td>
                <td className="num">{c.units}</td>
                <td className="num">{c.lessons}</td>
                <td><span className={`spill ${ST[c.status].spill}`}>{ST[c.status].label}</span></td>
                <td><span className="row-act">
                  <Link className="iconbtn" title="จัดการบทเรียน" href={`/admin/courses/${c.id}`}><Pencil size={14} /></Link>
                  <button className="iconbtn danger" title="ลบ" onClick={() => setDeleting(c)}><Trash2 size={14} /></button>
                </span></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "28px 0" }}>ไม่พบคอร์ส</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <CourseModal course={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      {deleting && <DeleteModal course={deleting} onClose={() => setDeleting(null)} />}
    </>
  )
}

function CourseModal({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<CourseActionResult | null, FormData>(saveCourseAction, null)
  useEffect(() => { if (state?.ok) { onClose(); router.refresh() } }, [state, onClose, router])

  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={formAction} onClick={(e) => e.stopPropagation()}>
        {course && <input type="hidden" name="id" value={course.id} />}
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><BookMarked size={22} /></span>
          <div className="mh-tx"><h3>{course ? "แก้ไขคอร์ส" : "เพิ่มคอร์สใหม่"}</h3><p>ตั้งชื่อ ระดับ และสถานะการเผยแพร่</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อคอร์ส</label><input className="fin" name="title" defaultValue={course?.title ?? ""} placeholder="เช่น ChatGPT พื้นฐาน" required /></div>
          <div className="fld"><label>คำอธิบายสั้น</label><textarea className="fin" name="description" defaultValue={course?.description ?? ""} placeholder="คอร์สนี้สอนอะไร…" style={{ minHeight: 80, fontFamily: "var(--font-sans)", fontSize: 14.5 }} /></div>
          <div className="fld-row">
            <div className="fld"><label>เครื่องมือ</label><select className="fin" name="tool" defaultValue={course?.tool ?? "ChatGPT"}><option>ChatGPT</option><option>Claude</option><option>Gemini</option><option>Midjourney</option><option>Runway</option></select></div>
            <div className="fld"><label>ระดับ</label><select className="fin" name="level" defaultValue={course?.level ?? "beginner"}><option value="beginner">เริ่มต้น</option><option value="intermediate">ระดับกลาง</option><option value="advanced">ขั้นสูง</option></select></div>
          </div>
          <div className="fld"><label>สถานะ</label><select className="fin" name="status" defaultValue={course?.status ?? "draft"}><option value="published">เผยแพร่</option><option value="draft">ร่าง</option><option value="queued">รอคิว</option></select></div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
        </div>
      </form>
    </div>
  )
}

function DeleteModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<CourseActionResult | null, FormData>(deleteCourseAction, null)
  useEffect(() => { if (state?.ok) { onClose(); router.refresh() } }, [state, onClose, router])

  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 400 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="id" value={course.id} />
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><Trash2 size={20} /></span>
          <div className="mh-tx"><h3>ลบคอร์ส?</h3><p>“{course.title}” และความคืบหน้าของผู้เรียนจะถูกลบทั้งหมด</p></div>
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
