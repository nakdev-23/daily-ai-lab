"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Heart, BookOpen, Zap, Check, CheckCircle2, ChevronRight, Infinity as InfinityIcon } from "lucide-react"
import type { LessonStep } from "@/lib/lesson-types"
import { completeLessonAction, loseHeartAction, type CompleteLessonResult } from "@/app/(lesson)/daily-learn/actions"
import OutOfHearts from "@/components/out-of-hearts"

const M = "/assets/daily-ai-lab/mascot-ds"

const FALLBACK_STEPS: LessonStep[] = [
  {
    type: "theory",
    tag: "ChatGPT · บทที่ 1 · ตอนที่ 3",
    title: "ให้ AI สวมบทบาท",
    body: [
      { text: "วิธีที่เร็วที่สุดในการได้คำตอบที่ดีขึ้นคือ " },
      { text: "บอกให้ AI สวมบทบาท", bold: true },
      { text: " — เมื่อบอกบทบาทและงานชัดเจน คำตอบจะแม่นยำขึ้นทันที" },
    ],
    example: '"สวมบทเป็นนักการตลาดที่เป็นมิตร ช่วยเขียนหัวข้อโฆษณา 3 แบบ สำหรับร้านกาแฟที่กำลังจะเปิด"',
    mascot: "mascot-read",
  },
  {
    type: "quiz",
    tag: "คำถามที่ 1 จาก 3",
    question: "คำสั่งข้อไหนบอกบทบาทชัดที่สุด?",
    options: [
      { text: '"เขียนอะไรเกี่ยวกับการตลาดหน่อย"' },
      { text: '"สวมบทเป็นนักการตลาด ช่วยเขียนหัวข้อโฆษณา 3 แบบสำหรับร้านกาแฟ"', correct: true },
      { text: '"การตลาด พลีส"' },
    ],
  },
  {
    type: "theory",
    tag: "ChatGPT · บทที่ 1 · ตอนที่ 4",
    title: "ยิ่งบอกละเอียด ยิ่งตรงใจ",
    body: [
      { text: "นอกจากบทบาท ให้เพิ่ม " },
      { text: "รูปแบบ · กลุ่มเป้าหมาย · จำนวน", bold: true },
      { text: " — AI เดาน้อยลง ได้ผลลัพธ์ที่ใช้ได้จริงมากขึ้น" },
    ],
    example: '"...เขียน 5 แบบ โทนสนุก สำหรับวัยรุ่น ความยาวไม่เกิน 1 บรรทัด พร้อมอิโมจิ"',
    mascot: "mascot-point",
  },
  {
    type: "quiz",
    tag: "คำถามที่ 2 จาก 3",
    question: "อะไรช่วยให้คำสั่งชัดขึ้น?",
    options: [
      { text: "ใส่รูปแบบ กลุ่มเป้าหมาย และจำนวนผลลัพธ์ที่อยากได้", correct: true },
      { text: "พิมพ์เป็นตัวพิมพ์ใหญ่ทั้งหมดเพื่อเน้น" },
      { text: "เขียนให้สั้นและกว้างที่สุดเท่าที่จะทำได้" },
    ],
  },
  {
    type: "quiz",
    tag: "คำถามที่ 3 จาก 3",
    question: "คำตอบยังไม่โดน ควรทำอะไรต่อ?",
    options: [
      { text: "ยอมแพ้แล้วเขียนเองดีกว่า" },
      { text: "ส่งคำสั่งเดิมซ้ำอีกครั้ง" },
      { text: "บอกให้แก้เฉพาะจุด เช่น โทน ความยาว หรือจุดเน้น", correct: true },
    ],
  },
  { type: "done" },
]

export default function LessonPlayer({
  steps,
  courseId,
  lessonNum,
  isLastLesson = false,
  initialHearts = 5,
  heartsMax = 5,
  unlimitedHearts = false,
  nextRefill = null,
}: {
  steps?: LessonStep[]
  courseId?: string
  lessonNum?: number
  isLastLesson?: boolean
  initialHearts?: number
  heartsMax?: number
  unlimitedHearts?: boolean
  nextRefill?: string | null
}) {
  const STEPS = steps && steps.length > 0 ? steps : FALLBACK_STEPS
  const [step, setStep] = useState(0)
  const [hearts, setHearts] = useState(initialHearts)
  // When hearts hit 0 mid-lesson, lock the player behind the refill countdown.
  const [lockedRefill, setLockedRefill] = useState<string | null>(null)
  const HEART_MAX = Math.max(heartsMax, initialHearts, 1)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  // Wrong answers this run — a clean run earns the perfect-quiz XP bonus.
  const mistakesRef = useRef(0)
  // What the server actually awarded (null = still saving).
  const [award, setAward] = useState<(CompleteLessonResult & { perfect: boolean }) | null>(null)
  const savedRef = useRef(false)
  const [, startTransition] = useTransition()

  const cur = STEPS[step]
  const progress = (step / Math.max(STEPS.length - 1, 1)) * 100
  const isCorrect = cur.type === "quiz" && selected !== null && cur.options[selected]?.correct
  const footState = !checked ? "" : isCorrect ? "ok" : "no"

  // Save progress when reaching the done screen (ref guards double-fire in StrictMode)
  useEffect(() => {
    if (cur.type === "done" && courseId && lessonNum && !savedRef.current) {
      savedRef.current = true
      startTransition(async () => {
        const perfect = mistakesRef.current === 0
        const r = await completeLessonAction(courseId, lessonNum, perfect)
        setAward({ ...r, perfect })
      })
    }
  }, [cur.type, courseId, lessonNum, startTransition])

  function next() {
    setSelected(null)
    setChecked(false)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  async function onCheck() {
    if (cur.type === "theory") { next(); return }
    if (cur.type === "quiz") {
      if (selected === null) return
      if (!checked) {
        setChecked(true)
        if (!cur.options[selected].correct) {
          mistakesRef.current += 1
          // Wrong answer → deduct a heart server-side so it syncs across lessons
          // and respects the daily reset. Pro users never lose hearts.
          if (!unlimitedHearts) {
            const r = await loseHeartAction()
            setHearts(r.hearts)
            // No hearts left → stop the lesson and show the refill countdown.
            if (r.hearts <= 0 && !r.unlimited) setLockedRefill(r.nextRefill ?? nextRefill ?? "")
          }
        }
      } else {
        next()
      }
    }
  }

  const footLabel = cur.type === "theory" ? "ต่อไป" : !checked ? "ตรวจ" : "ต่อไป"
  const footDisabled = cur.type === "quiz" && selected === null

  const backHref = courseId ? `/daily-learn/${courseId}` : "/daily-learn"
  const nextHref = courseId && lessonNum && !isLastLesson ? `/daily-learn/${courseId}/${lessonNum + 1}` : null

  return (
    <div className="dlab-lesson">
      <div className="lesson-shell">
        <div className="lesson-top">
          <Link className="x" href={backHref} title="ออก"><X size={18} /></Link>
          <div className="lprog"><i style={{ width: `${progress}%` }} /></div>
          <div className="lesson-hearts">
            {unlimitedHearts ? (
              <span className="hearts-unlimited"><Heart size={20} className="text-rose-500" fill="currentColor" /><InfinityIcon size={17} strokeWidth={3} /></span>
            ) : (
              Array.from({ length: HEART_MAX }).map((_, i) => (
                <span key={i} className={i >= hearts ? "lost" : ""}><Heart size={20} className="text-rose-500" fill="currentColor" /></span>
              ))
            )}
          </div>
        </div>

        <div className="lesson-stage">
          {cur.type === "theory" && (
            <div className="lstep">
              <div className="qtag"><BookOpen size={13} /> {cur.tag}</div>
              <h2 className="display">{cur.title}</h2>
              <div className="theory glass">
                <Image src={`${M}/${cur.mascot}.png`} alt="Riri" width={120} height={120} />
                <div className="tx">
                  <p>
                    {cur.body.map((part, i) =>
                      part.bold
                        ? <strong key={i} style={{ color: "var(--text-strong)" }}>{part.text}</strong>
                        : <span key={i}>{part.text}</span>
                    )}
                  </p>
                  <div className="ex">
                    <CheckCircle2 size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 7, color: "var(--mint-600)" }} />
                    {cur.example}
                  </div>
                </div>
              </div>
            </div>
          )}

          {cur.type === "quiz" && (
            <div className="lstep">
              <div className="qtag"><Zap size={13} /> {cur.tag}</div>
              <h2 className="display">{cur.question}</h2>
              <div className="options">
                {cur.options.map((o, i) => {
                  let cls = "opt"
                  if (checked) cls += o.correct ? " correct" : i === selected ? " wrong" : ""
                  else if (i === selected) cls += " sel"
                  return (
                    <button key={i} className={cls} onClick={() => !checked && setSelected(i)}>
                      <span className="ok">{checked && o.correct && <Check size={16} />}</span>
                      {o.text}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {cur.type === "done" && (
            <div className="lstep done">
              <Image src={`${M}/mascot-celebrate.png`} alt="Riri" width={160} height={160} />
              <h2 className="display">บทเรียนเสร็จแล้ว!</h2>
              <p>เยี่ยมมาก คุณผ่านบทเรียนนี้แล้ว</p>
              {/* What the server actually awarded — never a silent failure. */}
              {award?.ok && (
                <div className="xp-award" aria-live="polite">
                  <Zap size={18} fill="currentColor" /> +{award.xp} XP
                  {award.perfect && <span className="xp-perfect">โบนัสเพอร์เฟกต์!</span>}
                </div>
              )}
              {award && !award.ok && award.reason === "replay" && (
                <div className="xp-note">โหมดทบทวน — บทนี้จบไปแล้ว เลยไม่ได้รับ XP เพิ่ม</div>
              )}
              {award && !award.ok && award.reason === "daily-limit" && (
                <div className="xp-note">วันนี้เรียนครบโควต้าแพ็กเกจ Free แล้ว — บทนี้ไม่ถูกนับ ลอง Pro เพื่อเรียนไม่จำกัด</div>
              )}
              {award && !award.ok && (award.reason === "sequential" || award.reason === "invalid" || award.reason === "error" || award.reason === "not-signed-in") && (
                <div className="xp-note">บันทึกความคืบหน้าไม่สำเร็จ — กลับหน้าบทเรียนแล้วลองใหม่อีกครั้ง</div>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {nextHref && (
                  <Link className="btn btn--sun lg" href={nextHref}>
                    บทเรียนถัดไป <ChevronRight size={18} />
                  </Link>
                )}
                <Link className="btn btn--violet lg" href={backHref}>
                  กลับหน้าบทเรียน
                </Link>
              </div>
            </div>
          )}
        </div>

        {cur.type !== "done" && (
          <div className={`lesson-foot ${footState}`}>
            <button className="btn-check" onClick={onCheck} disabled={footDisabled || lockedRefill !== null}>
              {footLabel}
            </button>
          </div>
        )}
      </div>

      {lockedRefill !== null && <OutOfHearts nextRefill={lockedRefill || null} max={HEART_MAX} />}
    </div>
  )
}
