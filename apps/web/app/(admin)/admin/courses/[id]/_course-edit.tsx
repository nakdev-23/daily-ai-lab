"use client"

import { useState, useEffect, useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookMarked, BookOpen, CheckCircle2, Flag, Wrench, Pencil, Trash2, X, GripVertical, Plus, ChevronLeft } from "lucide-react"
import type { Course } from "@/lib/courses"
import type { CUnit, CLesson, LessonKind } from "@/lib/course-content"
import { saveCourseAction, type CourseActionResult } from "../actions"
import { saveUnitAction, deleteUnitAction, saveLessonAction, deleteLessonAction, type EditResult } from "./actions"

const KIND = {
  lesson: { icon: BookOpen, bg: "var(--hero-100)", col: "var(--hero-600)", label: "บทเรียน" },
  quiz: { icon: CheckCircle2, bg: "var(--mint-100)", col: "var(--mint-600)", label: "ควิซ" },
  check: { icon: Flag, bg: "var(--sun-100)", col: "#9A6B00", label: "เช็คพอยต์" },
  project: { icon: Wrench, bg: "var(--sky-100)", col: "var(--sky-500)", label: "โปรเจกต์" },
} as const
const STATUS = [["published", "เผยแพร่"], ["draft", "ร่าง"], ["queued", "รอคิว"]] as const

export default function CourseEdit({ course, units }: { course: Course; units: CUnit[] }) {
  const [unit, setUnit] = useState<CUnit | "new" | null>(null)
  const [lesson, setLesson] = useState<{ unitId: string; lesson: CLesson | null } | null>(null)
  const [delUnit, setDelUnit] = useState<CUnit | null>(null)
  const [delLesson, setDelLesson] = useState<CLesson | null>(null)

  return (
    <>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>
        <Link href="/admin/courses" style={{ color: "var(--hero-600)" }}>คอร์ส</Link> <span style={{ opacity: .5 }}>›</span> <span style={{ color: "var(--text-strong)" }}>แก้ไข: {course.title}</span>
      </div>

      <div className="formpage">
        <CourseDetails course={course} />

        {units.map((u) => (
          <div key={u.id} className="form-sec glass">
            <div className="sec-head-row">
              <h3 className="display" style={{ fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}><BookMarked size={18} className="text-violet-500" /> {u.title}</h3>
              <button className="iconbtn" title="แก้ไขบท" onClick={() => setUnit(u)}><Pencil size={14} /></button>
              <button className="iconbtn danger" title="ลบบท" onClick={() => setDelUnit(u)}><Trash2 size={14} /></button>
            </div>
            <p className="sec-sub">บทเรียนในบทนี้ · กดเพิ่มเพื่อสร้างบทเรียนใหม่</p>
            <div className="edit-list">
              {u.lessons.map((l) => {
                const k = KIND[l.kind]
                return (
                  <div key={l.id} className="edit-item">
                    <span className="grip"><GripVertical size={16} /></span>
                    <span className="ei-ic" style={{ background: k.bg, color: k.col }}><k.icon size={16} /></span>
                    <span className="ei-tx"><b>{l.title}</b><small>{k.label} · {l.xp} XP</small></span>
                    <span className="row-act">
                      <button className="iconbtn" title="แก้ไข" onClick={() => setLesson({ unitId: u.id, lesson: l })}><Pencil size={14} /></button>
                      <button className="iconbtn danger" title="ลบ" onClick={() => setDelLesson(l)}><Trash2 size={14} /></button>
                    </span>
                  </div>
                )
              })}
              {u.lessons.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 13, padding: "8px 2px" }}>ยังไม่มีบทเรียนในบทนี้</p>}
            </div>
            <button className="edit-add" onClick={() => setLesson({ unitId: u.id, lesson: null })}><Plus size={16} /> เพิ่มบทเรียน</button>
          </div>
        ))}

        <button className="edit-add" style={{ borderStyle: "solid", borderColor: "var(--hero-300)", color: "var(--hero-600)" }} onClick={() => setUnit("new")}><Plus size={16} /> เพิ่มบทใหม่</button>

        <div className="form-sticky">
          <Link className="btn btn--ghost md" href="/admin/courses"><ChevronLeft size={16} /> กลับ</Link>
          <span className="spacer" />
        </div>
      </div>

      {unit && <UnitModal courseId={course.id} unit={unit === "new" ? null : unit} onClose={() => setUnit(null)} />}
      {delUnit && <ConfirmDelete title="ลบบท?" desc={`“${delUnit.title}” และบทเรียนทั้งหมดในบทจะถูกลบ`} action={deleteUnitAction} fields={{ id: delUnit.id, course_id: course.id }} onClose={() => setDelUnit(null)} />}
      {lesson && <LessonModal courseId={course.id} unitId={lesson.unitId} lesson={lesson.lesson} onClose={() => setLesson(null)} />}
      {delLesson && <ConfirmDelete title="ลบบทเรียน?" desc={`“${delLesson.title}” จะถูกลบถาวร`} action={deleteLessonAction} fields={{ id: delLesson.id, course_id: course.id }} onClose={() => setDelLesson(null)} />}
    </>
  )
}

function useClose(ok: boolean | undefined, onClose: () => void) {
  const router = useRouter()
  useEffect(() => { if (ok) { onClose(); router.refresh() } }, [ok, onClose, router])
}

function CourseDetails({ course }: { course: Course }) {
  const [status, setStatus] = useState(course.status)
  const [state, action, pending] = useActionState<CourseActionResult | null, FormData>(saveCourseAction, null)
  const router = useRouter()
  useEffect(() => { if (state?.ok) router.refresh() }, [state, router])
  return (
    <form className="form-sec glass" action={action}>
      <input type="hidden" name="id" value={course.id} />
      <input type="hidden" name="status" value={status} />
      <h3 className="display" style={{ fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}><BookMarked size={18} className="text-violet-500" /> รายละเอียดคอร์ส</h3>
      <p className="sec-sub">ข้อมูลหลักที่แสดงในหน้าคอร์ส</p>
      {state && <div className={`adm-msg ${state.ok ? "ok" : "err"}`}>{state.message}</div>}
      <div className="fld"><label>ชื่อคอร์ส</label><input className="fin" name="title" defaultValue={course.title} required /></div>
      <div className="fld"><label>คำอธิบาย</label><textarea className="fin" name="description" defaultValue={course.description} style={{ minHeight: 80, fontFamily: "var(--font-sans)", fontSize: 14.5 }} /></div>
      <div className="fld-row">
        <div className="fld"><label>เครื่องมือ</label><select className="fin" name="tool" defaultValue={course.tool}><option>ChatGPT</option><option>Claude</option><option>Gemini</option><option>Midjourney</option><option>Runway</option></select></div>
        <div className="fld"><label>ระดับ</label><select className="fin" name="level" defaultValue={course.level}><option value="beginner">เริ่มต้น</option><option value="intermediate">ระดับกลาง</option><option value="advanced">ขั้นสูง</option></select></div>
      </div>
      <div className="fld">
        <label>สถานะ <span className="hint">เผยแพร่แล้วผู้เรียนจะเห็นทันที</span></label>
        <div className="seg-pick">
          {STATUS.map(([k, label]) => <button key={k} type="button" className={status === k ? "on" : ""} onClick={() => setStatus(k)}>{label}</button>)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึกรายละเอียด"}</button>
      </div>
    </form>
  )
}

function UnitModal({ courseId, unit, onClose }: { courseId: string; unit: CUnit | null; onClose: () => void }) {
  const [state, action, pending] = useActionState<EditResult | null, FormData>(saveUnitAction, null)
  useClose(state?.ok, onClose)
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={action} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="course_id" value={courseId} />
        {unit && <input type="hidden" name="id" value={unit.id} />}
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><BookMarked size={22} /></span>
          <div className="mh-tx"><h3>{unit ? "แก้ไขบท" : "เพิ่มบทใหม่"}</h3><p>ตั้งชื่อบท (chapter) ของคอร์ส</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อบท</label><input className="fin" name="title" defaultValue={unit?.title ?? ""} placeholder="เช่น รู้จัก ChatGPT" required /></div>
        </div>
        <div className="modal-foot"><button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button><button type="submit" className="btn btn--violet md" disabled={pending}>บันทึก</button></div>
      </form>
    </div>
  )
}

function LessonModal({ courseId, unitId, lesson, onClose }: { courseId: string; unitId: string; lesson: CLesson | null; onClose: () => void }) {
  const [kind, setKind] = useState<LessonKind>(lesson?.kind ?? "lesson")
  const [state, action, pending] = useActionState<EditResult | null, FormData>(saveLessonAction, null)
  useClose(state?.ok, onClose)
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={action} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="course_id" value={courseId} />
        <input type="hidden" name="unit_id" value={unitId} />
        <input type="hidden" name="kind" value={kind} />
        {lesson && <input type="hidden" name="id" value={lesson.id} />}
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--hero-100)", color: "var(--hero-600)" }}><BookOpen size={22} /></span>
          <div className="mh-tx"><h3>{lesson ? "แก้ไขบทเรียน" : "เพิ่มบทเรียน"}</h3><p>ตั้งชื่อ ประเภท และ XP ที่ได้</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อบทเรียน</label><input className="fin" name="title" defaultValue={lesson?.title ?? ""} placeholder="เช่น ChatGPT คืออะไร" required /></div>
          <div className="fld">
            <label>ประเภท</label>
            <div className="seg-pick">
              {(Object.keys(KIND) as LessonKind[]).map((k) => <button key={k} type="button" className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{KIND[k].label}</button>)}
            </div>
          </div>
          <div className="fld"><label>XP ที่ได้</label><input className="fin" name="xp" type="number" defaultValue={lesson?.xp ?? 10} /></div>
        </div>
        <div className="modal-foot"><button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button><button type="submit" className="btn btn--violet md" disabled={pending}>บันทึก</button></div>
      </form>
    </div>
  )
}

function ConfirmDelete({ title, desc, action, fields, onClose }: { title: string; desc: string; action: (p: EditResult | null, f: FormData) => Promise<EditResult>; fields: Record<string, string>; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<EditResult | null, FormData>(action, null)
  useClose(state?.ok, onClose)
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 400 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        {Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><Trash2 size={20} /></span>
          <div className="mh-tx"><h3>{title}</h3><p>{desc}</p></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-foot spread">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn md" style={{ background: "var(--berry-500)", color: "#fff", boxShadow: "0 5px 0 #B3322B" }} disabled={pending}>ลบถาวร</button>
        </div>
      </form>
    </div>
  )
}
