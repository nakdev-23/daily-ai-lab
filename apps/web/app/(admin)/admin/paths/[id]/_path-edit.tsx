"use client"

import { useState, useEffect, useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp, X,
  BookOpen, CheckCircle2, Flag, Wrench,
} from "lucide-react"
import type { CareerPath, PathModule, PathStep } from "@/lib/career-paths"
import {
  saveModuleAction, deleteModuleAction,
  saveStepAction, deleteStepAction, type PathActionResult,
} from "../actions"

const KIND_OPTS = [
  { value: "lesson",     label: "Lesson",      Icon: BookOpen },
  { value: "quiz",       label: "Quiz",        Icon: CheckCircle2 },
  { value: "checkpoint", label: "Checkpoint",  Icon: Flag },
  { value: "project",    label: "Project",     Icon: Wrench },
] as const

const KIND_ICON: Record<string, React.ElementType> = {
  lesson: BookOpen, quiz: CheckCircle2, checkpoint: Flag, project: Wrench,
}

export default function PathEdit({ path }: { path: CareerPath }) {
  const router = useRouter()
  const [open, setOpen] = useState<Set<string>>(new Set(path.modules.map((m) => m.id)))
  const [modModal, setModModal] = useState<PathModule | "new" | null>(null)
  const [stepModal, setStepModal] = useState<{ step: PathStep | null; moduleId: string } | null>(null)
  const [delMod, setDelMod] = useState<PathModule | null>(null)
  const [delStep, setDelStep] = useState<PathStep | null>(null)

  function toggleOpen(id: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function refresh() { router.refresh() }

  return (
    <>
      <div className="adm-bar">
        <div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
            <Link href="/admin/paths" style={{ color: "var(--hero-600)" }}>เส้นทางอาชีพ</Link>{" › "}{path.title}
          </div>
          <h1>{path.title}</h1>
          <div className="sub">{path.modules.length} โมดูล · {path.modules.flatMap((m) => m.steps).length} ขั้นตอน</div>
        </div>
        <div className="spacer" />
        <button className="btn btn--violet md" onClick={() => setModModal("new")}>+ เพิ่มโมดูล</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {path.modules.length === 0 && (
          <div className="glass" style={{ padding: "40px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            ยังไม่มีโมดูล — กด "เพิ่มโมดูล" ด้านบน
          </div>
        )}
        {path.modules.map((mod) => {
          const expanded = open.has(mod.id)
          return (
            <div key={mod.id} className="glass" style={{ borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", cursor: "pointer" }} onClick={() => toggleOpen(mod.id)}>
                <span className="mn cur" style={{ fontSize: 13 }}>{mod.orderIndex}</span>
                <b style={{ flex: 1, fontSize: 15 }}>{mod.title}</b>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{mod.steps.length} ขั้นตอน</span>
                <button className="iconbtn" onClick={(e) => { e.stopPropagation(); setModModal(mod) }}><Pencil size={14} /></button>
                <button className="iconbtn danger" onClick={(e) => { e.stopPropagation(); setDelMod(mod) }}><Trash2 size={14} /></button>
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {expanded && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "12px 18px 16px" }}>
                  <div className="glass tablewrap" style={{ marginBottom: 10 }}>
                    <table className="dtable">
                      <thead><tr><th>#</th><th>ชื่อขั้นตอน</th><th>ประเภท</th><th>คอร์ส</th><th>บทที่</th><th>XP</th><th /></tr></thead>
                      <tbody>
                        {mod.steps.map((step) => {
                          const Icon = KIND_ICON[step.kind] ?? BookOpen
                          return (
                            <tr key={step.id}>
                              <td className="num">{step.orderIndex}</td>
                              <td><b style={{ fontSize: 14 }}>{step.title}</b></td>
                              <td className="cell"><span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}><Icon size={13} /> {step.kind}</span></td>
                              <td className="cell" style={{ fontSize: 13 }}>{step.courseSlug}</td>
                              <td className="num">{step.lessonNum}</td>
                              <td className="num">+{step.xp}</td>
                              <td><span className="row-act">
                                <button className="iconbtn" onClick={() => setStepModal({ step, moduleId: mod.id })}><Pencil size={13} /></button>
                                <button className="iconbtn danger" onClick={() => setDelStep(step)}><Trash2 size={13} /></button>
                              </span></td>
                            </tr>
                          )
                        })}
                        {mod.steps.length === 0 && (
                          <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "16px 0", fontSize: 13 }}>ยังไม่มีขั้นตอน</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button className="btn btn--ghost sm" onClick={() => setStepModal({ step: null, moduleId: mod.id })}>
                    <Plus size={14} /> เพิ่มขั้นตอน
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modModal !== null && (
        <ModuleModal
          mod={modModal === "new" ? null : modModal}
          pathId={path.id}
          nextOrder={path.modules.length + 1}
          onClose={() => { setModModal(null); refresh() }}
        />
      )}
      {stepModal !== null && (
        <StepModal
          step={stepModal.step}
          moduleId={stepModal.moduleId}
          nextOrder={(path.modules.find((m) => m.id === stepModal.moduleId)?.steps.length ?? 0) + 1}
          onClose={() => { setStepModal(null); refresh() }}
        />
      )}
      {delMod && <DeleteModModal mod={delMod} onClose={() => { setDelMod(null); refresh() }} />}
      {delStep && <DeleteStepModal step={delStep} onClose={() => { setDelStep(null); refresh() }} />}
    </>
  )
}

// ── Modals ────────────────────────────────────────────────────────────────────

function ModuleModal({ mod, pathId, nextOrder, onClose }: { mod: PathModule | null; pathId: string; nextOrder: number; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<PathActionResult | null, FormData>(saveModuleAction, null)
  useEffect(() => { if (state?.ok) onClose() }, [state, onClose])
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 480 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        {mod && <input type="hidden" name="id" value={mod.id} />}
        <input type="hidden" name="path_id" value={pathId} />
        <div className="modal-head">
          <div className="mh-tx"><h3>{mod ? "แก้ไขโมดูล" : "เพิ่มโมดูล"}</h3></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อโมดูล</label><input className="fin" name="title" defaultValue={mod?.title ?? ""} placeholder="Module 1 · Prompt Basics" required /></div>
          <div className="fld"><label>ลำดับ</label><input className="fin" name="order_index" type="number" min="0" defaultValue={mod?.orderIndex ?? nextOrder} /></div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
        </div>
      </form>
    </div>
  )
}

function StepModal({ step, moduleId, nextOrder, onClose }: { step: PathStep | null; moduleId: string; nextOrder: number; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<PathActionResult | null, FormData>(saveStepAction, null)
  useEffect(() => { if (state?.ok) onClose() }, [state, onClose])
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" action={formAction} onClick={(e) => e.stopPropagation()}>
        {step && <input type="hidden" name="id" value={step.id} />}
        <input type="hidden" name="module_id" value={moduleId} />
        <div className="modal-head">
          <div className="mh-tx"><h3>{step ? "แก้ไขขั้นตอน" : "เพิ่มขั้นตอน"}</h3></div>
          <button type="button" className="modal-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {state && !state.ok && <div className="adm-msg err">{state.message}</div>}
          <div className="fld"><label>ชื่อขั้นตอน</label><input className="fin" name="title" defaultValue={step?.title ?? ""} placeholder="How AI understands language" required /></div>
          <div className="fld-row">
            <div className="fld"><label>ประเภท</label>
              <select className="fin" name="kind" defaultValue={step?.kind ?? "lesson"}>
                {KIND_OPTS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>
            <div className="fld"><label>XP</label><input className="fin" name="xp" type="number" min="1" defaultValue={step?.xp ?? 10} /></div>
          </div>
          <div className="fld-row">
            <div className="fld"><label>Slug ของคอร์ส</label><input className="fin" name="course_slug" defaultValue={step?.courseSlug ?? ""} placeholder="chatgpt-basic" required /></div>
            <div className="fld"><label>บทที่</label><input className="fin" name="lesson_num" type="number" min="1" defaultValue={step?.lessonNum ?? 1} /></div>
          </div>
          <div className="fld"><label>ลำดับ</label><input className="fin" name="order_index" type="number" min="0" defaultValue={step?.orderIndex ?? nextOrder} /></div>
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn--ghost md" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึก"}</button>
        </div>
      </form>
    </div>
  )
}

function DeleteModModal({ mod, onClose }: { mod: PathModule; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<PathActionResult | null, FormData>(deleteModuleAction, null)
  useEffect(() => { if (state?.ok) onClose() }, [state, onClose])
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 400 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="id" value={mod.id} />
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><Trash2 size={20} /></span>
          <div className="mh-tx"><h3>ลบโมดูล?</h3><p>"{mod.title}" และขั้นตอนทั้งหมดจะถูกลบ</p></div>
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

function DeleteStepModal({ step, onClose }: { step: PathStep; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<PathActionResult | null, FormData>(deleteStepAction, null)
  useEffect(() => { if (state?.ok) onClose() }, [state, onClose])
  return (
    <div className="modal-ovl" onClick={onClose}>
      <form className="modal" style={{ maxWidth: 400 }} action={formAction} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="id" value={step.id} />
        <div className="modal-head">
          <span className="mh-ic" style={{ background: "var(--berry-100)", color: "var(--berry-600)" }}><Trash2 size={20} /></span>
          <div className="mh-tx"><h3>ลบขั้นตอน?</h3><p>"{step.title}"</p></div>
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
