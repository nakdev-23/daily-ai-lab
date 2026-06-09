"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { makeT, type Lang } from "@/lib/i18n-core"
import { X, Heart, BookOpen, Zap, Check, CheckCircle2, ChevronRight } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"
const KEYS = ["A", "B", "C", "D"]

type TT = (en: string, vars?: Record<string, string | number>) => string

type Step =
  | { type: "theory"; tag: [string, string]; title: [string, string]; body: (t: TT) => React.ReactNode; ex: [string, string]; mascot: string }
  | { type: "quiz"; tag: [string, string]; title: [string, string]; options: { text: [string, string]; correct?: boolean }[] }
  | { type: "done" }

const STEPS: Step[] = [
  {
    type: "theory", mascot: "mascot-read",
    tag: ["ChatGPT · บทที่ 1 · ตอนที่ 3", "ChatGPT · Unit 1 · Part 3"],
    title: ["ให้ AI สวมบทบาท", "Give the AI a role"],
    body: (t) => <p>{t("The quickest way to better answers is to ")}<strong style={{ color: "var(--text-strong)" }}>{t("tell the AI who to be")}</strong> {t("— with a clear role and a specific task, answers get sharper instantly.")}</p>,
    ex: ['"สวมบทเป็นนักการตลาดที่เป็นมิตร ช่วยเขียนหัวข้อโฆษณา 3 แบบ สำหรับร้านกาแฟที่กำลังจะเปิด"', '"Act as a friendly marketer. Write 3 ad headlines for a coffee shop about to open."'],
  },
  {
    type: "quiz",
    tag: ["คำถามที่ 1 จาก 3", "Question 1 of 3"],
    title: ["คำสั่งข้อไหนบอกบทบาทชัดที่สุด?", "Which prompt gives the clearest role?"],
    options: [
      { text: ['"เขียนอะไรเกี่ยวกับการตลาดหน่อย"', '"write something about marketing"'] },
      { text: ['"สวมบทเป็นนักการตลาด ช่วยเขียนหัวข้อโฆษณา 3 แบบสำหรับร้านกาแฟ"', '"Act as a marketer. Write 3 ad headlines for a coffee shop."'], correct: true },
      { text: ['"การตลาด พลีส"', '"marketing pls"'] },
    ],
  },
  {
    type: "theory", mascot: "mascot-point",
    tag: ["ChatGPT · บทที่ 1 · ตอนที่ 4", "ChatGPT · Unit 1 · Part 4"],
    title: ["ยิ่งบอกละเอียด ยิ่งตรงใจ", "More detail, better fit"],
    body: (t) => <p>{t("Beyond a role, add ")}<strong style={{ color: "var(--text-strong)" }}>{t("format · audience · quantity")}</strong> {t("— the AI guesses less and gives more usable results.")}</p>,
    ex: ['"...เขียน 5 แบบ โทนสนุก สำหรับวัยรุ่น ความยาวไม่เกิน 1 บรรทัด พร้อมอิโมจิ"', '"...write 5 options, fun tone, for teens, max 1 line each, with emoji."'],
  },
  {
    type: "quiz",
    tag: ["คำถามที่ 2 จาก 3", "Question 2 of 3"],
    title: ["อะไรช่วยให้คำสั่งชัดขึ้น?", "What makes a prompt more specific?"],
    options: [
      { text: ["ใส่รูปแบบ กลุ่มเป้าหมาย และจำนวนผลลัพธ์ที่อยากได้", "Add format, audience and how many results you want"], correct: true },
      { text: ["พิมพ์เป็นตัวพิมพ์ใหญ่ทั้งหมดเพื่อเน้น", "Type everything in capitals for emphasis"] },
      { text: ["เขียนให้สั้นและกว้างที่สุดเท่าที่จะทำได้", "Keep it as short and broad as possible"] },
    ],
  },
  {
    type: "quiz",
    tag: ["คำถามที่ 3 จาก 3", "Question 3 of 3"],
    title: ["คำตอบยังไม่โดน ควรทำอะไรต่อ?", "Don't like the answer — what next?"],
    options: [
      { text: ["ยอมแพ้แล้วเขียนเองดีกว่า", "Give up and write it yourself"] },
      { text: ["ส่งคำสั่งเดิมซ้ำอีกครั้ง", "Send the exact same prompt again"] },
      { text: ["บอกให้แก้เฉพาะจุด เช่น โทน ความยาว หรือจุดเน้น", "Ask it to fix specifics — tone, length or focus"], correct: true },
    ],
  },
  { type: "done" },
]

export default function LessonPlayer({ lang }: { lang: Lang }) {
  const t = makeT(lang)
  const [step, setStep] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  const cur = STEPS[step]
  const progress = (step / (STEPS.length - 1)) * 100
  const isCorrect = cur.type === "quiz" && selected !== null && cur.options[selected]?.correct
  const footState = !checked ? "" : isCorrect ? "ok" : "no"

  function next() {
    setSelected(null)
    setChecked(false)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function onCheck() {
    if (cur.type === "theory") { next(); return }
    if (cur.type === "quiz") {
      if (selected === null) return
      if (!checked) {
        setChecked(true)
        if (!cur.options[selected].correct) setHearts((h) => Math.max(0, h - 1))
      } else {
        next()
      }
    }
  }

  const footLabel = cur.type === "theory" ? t("Continue") : !checked ? t("Check") : t("Continue")
  const footDisabled = cur.type === "quiz" && selected === null

  return (
    <div className="dlab-lesson">
      <div className="lesson-shell">
        <div className="lesson-top">
          <Link className="x" href="/daily-learn" title={t("Exit")}><X size={18} /></Link>
          <div className="lprog"><i style={{ width: `${progress}%` }} /></div>
          <div className="lesson-hearts">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i >= hearts ? "lost" : ""}><Heart size={20} className="text-rose-500" fill="currentColor" /></span>
            ))}
          </div>
        </div>

        <div className="lesson-stage">
          {cur.type === "theory" && (
            <div className="lstep">
              <div className="qtag"><BookOpen size={13} /> {t(cur.tag[1])}</div>
              <h2 className="display">{t(cur.title[1])}</h2>
              <div className="theory glass">
                <Image src={`${M}/${cur.mascot}.png`} alt="Riri" width={120} height={120} />
                <div className="tx">{cur.body(t)}<div className="ex"><CheckCircle2 size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 7, color: "var(--mint-600)" }} />{t(cur.ex[1])}</div></div>
              </div>
            </div>
          )}

          {cur.type === "quiz" && (
            <div className="lstep">
              <div className="qtag"><Zap size={13} /> {t(cur.tag[1])}</div>
              <h2 className="display">{t(cur.title[1])}</h2>
              {cur.options.map((o, i) => {
                let cls = "lopt"
                if (!checked && selected === i) cls += " sel"
                if (checked) {
                  if (o.correct) cls += " correct"
                  else if (i === selected) cls += " wrong"
                  else cls += " disabled"
                }
                return (
                  <button key={i} className={cls} onClick={() => !checked && setSelected(i)} disabled={checked}>
                    <span className="k">{KEYS[i]}</span> {t(o.text[1])}
                  </button>
                )
              })}
            </div>
          )}

          {cur.type === "done" && (
            <div className="complete">
              <Image src={`${M}/mascot-celebrate.png`} alt="Riri" width={220} height={220} />
              <h2 className="display">{t("Lesson complete!")}</h2>
              <p>{t("Great job — your streak is safe and Riri is proud of you.")}</p>
              <div className="reward-row">
                <div className="reward glass"><div className="rl">{t("XP earned")}</div><div className="rv grad-text">+45</div></div>
                <div className="reward glass"><div className="rl">{t("Streak")}</div><div className="rv" style={{ color: "var(--punch-600)" }}>13</div></div>
                <div className="reward glass"><div className="rl">{t("Accuracy")}</div><div className="rv" style={{ color: "var(--mint-600)" }}>100%</div></div>
              </div>
              <Link className="btn btn--violet lg" href="/daily-learn" style={{ marginTop: 6 }}>{t("Back to dashboard")} <ChevronRight size={18} /></Link>
            </div>
          )}
        </div>

        {cur.type !== "done" && (
          <div className={`lesson-foot ${footState}`}>
            <div className="in">
              <div className="lfb">
                <span className="ic">{isCorrect ? <Check size={22} /> : <X size={22} />}</span>
                <span>{isCorrect ? t("Correct! Nice work") : t("Not quite — check the answer")}</span>
              </div>
              <button className="btn btn--violet lg" style={{ marginLeft: "auto" }} onClick={onCheck} disabled={footDisabled}>
                {footLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
