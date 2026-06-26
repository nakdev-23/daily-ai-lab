"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Heart, BookOpen, Zap, Check, CheckCircle2, ChevronRight, Infinity as InfinityIcon, PencilLine, RotateCcw, Sparkles, Terminal, ExternalLink, Copy, CircleCheck, FastForward, Play } from "lucide-react"
import type { LessonStep } from "@/lib/lesson-types"
import { completeLessonAction, loseHeartAction, reviewPracticeAction, runPromptAction, type ReviewPracticeResult, type RunPromptResult } from "@/app/(lesson)/daily-learn/actions"
import type { CompleteLessonResult } from "@/lib/progress"
import OutOfHearts from "@/components/out-of-hearts"
import LessonFeedback from "@/components/lesson-feedback"
import PromptExamples from "@/components/prompt-examples"
import { makeT, type Lang } from "@/lib/i18n-core"

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
  lang = "th",
  backHref: backHrefProp,
  nextHref: nextHrefProp,
}: {
  steps?: LessonStep[]
  courseId?: string
  lessonNum?: number
  isLastLesson?: boolean
  initialHearts?: number
  heartsMax?: number
  unlimitedHearts?: boolean
  /** Pro users get AI review of their practice prompt; Free users see an upsell. */
  isPro?: boolean
  nextRefill?: string | null
  lang?: Lang
  /** Where the X / back buttons return to (e.g. a career path page). */
  backHref?: string
  /** Next-lesson URL override (null = no next button). Default: next daily lesson. */
  nextHref?: string | null
}) {
  const t = makeT(lang)
  const STEPS = steps && steps.length > 0 ? steps : FALLBACK_STEPS
  const [step, setStep] = useState(0)
  const [hearts, setHearts] = useState(initialHearts)
  // When hearts hit 0 mid-lesson, lock the player behind the refill countdown.
  const [lockedRefill, setLockedRefill] = useState<string | null>(null)
  const HEART_MAX = Math.max(heartsMax, initialHearts, 1)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [practiceDraft, setPracticeDraft] = useState(() =>
    STEPS[0]?.type === "practice" ? STEPS[0].starterPrompt : ""
  )
  // Enable the foot button as soon as the learner engages with the box (focus or
  // any edit) — AI does the real checking, so there's no strict gate.
  const [practiceTouched, setPracticeTouched] = useState(false)
  const [tryChecks, setTryChecks] = useState<boolean[]>([])
  // AI review (Pro) of the current practice draft; cleared whenever it changes.
  const [aiReview, setAiReview] = useState<ReviewPracticeResult | null>(null)
  const [aiPending, setAiPending] = useState(false)
  // Live run of the learner's prompt — shows what their wording actually produces.
  const [aiRun, setAiRun] = useState<RunPromptResult | null>(null)
  const [runPending, setRunPending] = useState(false)
  // Which AI popup is open: "review" (critique of the prompt) or "run" (real
  // output + critique). null = closed. Both open with a loading spinner first so
  // tapping a button always shows something happening.
  const [aiModal, setAiModal] = useState<"review" | "run" | null>(null)
  // Wrong answers this run — a clean run earns the perfect-quiz XP bonus.
  const mistakesRef = useRef(0)
  // What the server actually awarded (null = still saving).
  const [award, setAward] = useState<(CompleteLessonResult & { perfect: boolean }) | null>(null)
  const savedRef = useRef(false)
  const [, startTransition] = useTransition()

  const cur = STEPS[step]
  const progress = (step / Math.max(STEPS.length - 1, 1)) * 100
  // Option order is randomized server-side in getLessonSteps (per request), so
  // the correct answer isn't always in the same slot. Render as-is here.
  const curOptions = cur.type === "quiz" ? cur.options : []
  const isCorrect = cur.type === "quiz" && selected !== null && curOptions[selected]?.correct
  const footState = !checked ? "" : isCorrect ? "ok" : "no"
  // Let AI do the real check now — the button enables the moment the learner
  // focuses or edits the box (touched) and there's something to review.
  const practiceReady = cur.type === "practice"
    && practiceTouched
    && practiceDraft.trim().length > 0

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
    const nextIndex = Math.min(step + 1, STEPS.length - 1)
    const nextStep = STEPS[nextIndex]
    setSelected(null)
    setChecked(false)
    setPracticeDraft(nextStep.type === "practice" ? nextStep.starterPrompt : "")
    setPracticeTouched(false)
    setTryChecks(nextStep.type === "try" ? nextStep.checks.map(() => false) : [])
    setAiReview(null)
    setAiRun(null)
    setStep(nextIndex)
  }

  function runAiReview() {
    if (cur.type !== "practice" || aiPending) return
    const step = cur
    setAiReview(null)
    setAiPending(true)
    setAiModal("review") // open the popup immediately so the spinner is visible
    startTransition(async () => {
      const r = await reviewPracticeAction({
        draft: practiceDraft,
        requirements: step.requirements,
        scenario: step.instruction,
      })
      setAiReview(r)
      setAiPending(false)
    })
  }

  function runPrompt() {
    if (cur.type !== "practice" || runPending) return
    setAiRun(null)
    setRunPending(true)
    setAiModal("run") // open the popup immediately so the spinner is visible
    startTransition(async () => {
      const r = await runPromptAction({ draft: practiceDraft })
      setAiRun(r)
      setRunPending(false)
    })
  }

  async function onCheck() {
    if (cur.type === "theory") { next(); return }
    if (cur.type === "practice") {
      if (!practiceReady) return
      // Everyone (Free + Pro): let AI check the prompt once (verdict + suggested
      // example) before advancing. Second click (review already shown) proceeds.
      // No-key / failed review also falls through to next() on the next click.
      if (!aiReview && !aiPending) { runAiReview(); return }
      next()
      return
    }
    if (cur.type === "setup") { next(); return }
    if (cur.type === "try") {
      if (tryChecks.some(Boolean)) next()
      return
    }
    if (cur.type === "quiz") {
      if (selected === null) return
      if (!checked) {
        setChecked(true)
        if (!curOptions[selected].correct) {
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

  const footLabel = cur.type === "theory"
    ? t("Next")
    : cur.type === "practice"
      ? (aiPending ? t("AI is checking…") : practiceReady && !aiReview ? t("Check with AI") : t("Use this prompt"))
      : cur.type === "setup"
        ? t("Continue lesson")
        : cur.type === "try"
          ? t("Continue lesson")
      : !checked ? t("Check") : t("Next")
  const footDisabled = (cur.type === "quiz" && selected === null)
    || (cur.type === "practice" && (!practiceReady || aiPending))
    || (cur.type === "try" && !tryChecks.some(Boolean))

  const backHref = backHrefProp ?? (courseId ? `/daily-learn/${courseId}` : "/daily-learn")
  const nextHref = nextHrefProp !== undefined
    ? nextHrefProp
    : courseId && lessonNum && !isLastLesson ? `/daily-learn/${courseId}/${lessonNum + 1}` : null

  return (
    <div className="dlab-lesson">
      <div className="lesson-shell">
        <div className="lesson-top">
          <Link className="x" href={backHref} title={t("Exit")}><X size={18} /></Link>
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
                {curOptions.map((o, i) => {
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
              {checked && (
                <div className={`quiz-explanation ${isCorrect ? "correct" : "wrong"}`} aria-live="polite">
                  <strong>{isCorrect ? t("Why this works") : t("What to notice")}</strong>
                  <p>{isCorrect ? cur.correctFeedback : cur.incorrectFeedback}</p>
                </div>
              )}
            </div>
          )}

          {cur.type === "practice" && (
            <div className="lstep practice-step">
              <div className="qtag"><PencilLine size={13} /> {cur.tag}</div>
              <h2 className="display">{cur.title}</h2>
              <p className="practice-instruction">{cur.instruction}</p>
              {cur.payoff && (
                <div className="practice-payoff">
                  <Sparkles size={15} /> <span><strong>{t("You'll walk away with:")}</strong> {cur.payoff}</span>
                </div>
              )}
              {cur.examples && <PromptExamples examples={cur.examples} lang={lang} />}
              <div className="practice-workspace">
                <div className="practice-toolbar">
                  <span>{t("Edit the prompt below")}</span>
                  <button type="button" onClick={() => { setPracticeDraft(cur.starterPrompt); setAiReview(null); setAiRun(null) }}>
                    <RotateCcw size={14} /> {t("Reset")}
                  </button>
                </div>
                <textarea
                  value={practiceDraft}
                  onFocus={() => setPracticeTouched(true)}
                  onChange={(event) => { setPracticeTouched(true); setPracticeDraft(event.target.value); setAiReview(null); setAiRun(null) }}
                  aria-label={t("Your improved prompt")}
                  rows={9}
                />
              </div>

              <div className="ai-actions">
                <button
                  type="button"
                  className="ai-run-btn"
                  onClick={runPrompt}
                  disabled={runPending || practiceDraft.trim().length < 10}
                >
                  <Play size={15} /> {runPending ? t("AI is running…") : t("Run & see result")}
                </button>
                <span className="ai-actions-hint">{t("Tap the bottom button to have AI check your prompt")}</span>
              </div>
            </div>
          )}

          {cur.type === "setup" && (
            <div className="lstep setup-step">
              <div className="qtag"><Terminal size={13} /> {cur.tag}</div>
              <h2 className="display">{cur.title}</h2>
              <p className="practice-instruction">{cur.instruction}</p>

              <div className="setup-panel">
                <ol>
                  {cur.steps.map((item) => <li key={item}>{item}</li>)}
                </ol>

                {cur.command && (
                  <div className="setup-command">
                    <code>{cur.command}</code>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(cur.command ?? "")}>
                      <Copy size={14} /> {t("Copy")}
                    </button>
                  </div>
                )}

                {cur.href && (
                  <a className="setup-link" href={cur.href} target="_blank" rel="noreferrer">
                    <ExternalLink size={15} /> {cur.hrefLabel}
                  </a>
                )}

                <div className="setup-choices">
                  <button
                    type="button"
                    className="ready"
                    onClick={next}
                  >
                    <CircleCheck size={18} />
                    <span><b>{t("Ready to use")}</b><small>{t("I installed it or can already open the tool.")}</small></span>
                  </button>
                  <button
                    type="button"
                    className="skipped"
                    onClick={next}
                  >
                    <FastForward size={18} />
                    <span><b>{t("Skip setup for now")}</b><small>{t("I haven't installed it yet. Let me continue learning.")}</small></span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {cur.type === "try" && (
            <div className="lstep try-step">
              <div className="qtag"><Play size={13} /> {cur.tag}</div>
              <h2 className="display">{cur.title}</h2>
              <p className="practice-instruction">{cur.instruction}</p>

              <div className="try-panel">
                <div className="try-example">
                  <span>{t("Example to try")}</span>
                  <p>{cur.example}</p>
                  <button type="button" onClick={() => navigator.clipboard?.writeText(cur.example)}>
                    <Copy size={14} /> {t("Copy example")}
                  </button>
                </div>
                <div className="try-checklist">
                  {cur.checks.map((item, index) => (
                    <button
                      type="button"
                      className={tryChecks[index] ? "checked" : ""}
                      onClick={() => setTryChecks((current) => {
                        const nextChecks = current.length === cur.checks.length
                          ? [...current]
                          : cur.checks.map(() => false)
                        nextChecks[index] = !nextChecks[index]
                        return nextChecks
                      })}
                      key={item}
                    >
                      <span>{tryChecks[index] && <Check size={14} />}</span>{item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {cur.type === "done" && (
            <div className="lstep done">
              <Image src={`${M}/mascot-celebrate.png`} alt="Riri" width={160} height={160} />
              <h2 className="display">{t("Lesson complete!")}</h2>
              <p>{t("Great job — you finished this lesson")}</p>
              {/* What the server actually awarded — never a silent failure. */}
              {award?.ok && (
                <div className="xp-award" aria-live="polite">
                  <Zap size={18} fill="currentColor" /> +{award.xp} XP
                  {award.perfect && <span className="xp-perfect">{t("Perfect bonus!")}</span>}
                </div>
              )}
              {award && !award.ok && award.reason === "replay" && (
                <div className="xp-note">{t("Review mode — this lesson is already complete, so no extra XP")}</div>
              )}
              {award && !award.ok && award.reason === "daily-limit" && (
                <div className="xp-note">{t("You hit today's Free quota — this lesson wasn't counted. Go Pro for unlimited learning")}</div>
              )}
              {award && !award.ok && (award.reason === "sequential" || award.reason === "invalid" || award.reason === "error" || award.reason === "not-signed-in") && (
                <div className="xp-note">{t("Couldn't save your progress — go back to the lesson list and try again")}</div>
              )}
              {courseId && lessonNum && (
                <LessonFeedback courseId={courseId} lessonNum={lessonNum} lang={lang} />
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {nextHref && (
                  <Link className="btn btn--sun lg" href={nextHref}>
                    {t("Next lesson")} <ChevronRight size={18} />
                  </Link>
                )}
                <Link className="btn btn--violet lg" href={backHref}>
                  {t("Back to lessons")}
                </Link>
              </div>
            </div>
          )}
        </div>

        {cur.type !== "done" && cur.type !== "setup" && (
          <div className={`lesson-foot ${footState}`}>
            <button className="btn-check" onClick={onCheck} disabled={footDisabled || lockedRefill !== null}>
              {footLabel}
            </button>
          </div>
        )}
      </div>

      {aiModal && (
        <div className="ai-modal-backdrop" onClick={() => setAiModal(null)}>
          <div className="ai-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="ai-modal-x" onClick={() => setAiModal(null)} aria-label={t("Close")}>
              <X size={18} />
            </button>

            {aiModal === "review" ? (
              <>
                <div className="ai-modal-head"><Sparkles size={17} /> {t("AI review of your prompt")}</div>
                {aiPending ? (
                  <div className="ai-modal-loading">
                    <span className="ai-spinner" />
                    <p>{t("AI is checking your prompt…")}</p>
                  </div>
                ) : aiReview?.ok ? (
                  <div className="ai-modal-body">
                    <div className={`ai-result ${aiReview.overall}`}>
                      <p className={`ai-verdict ${aiReview.overall}`}>
                        {aiReview.overall === "strong"
                          ? t("Looks strong — ready to use")
                          : aiReview.overall === "weak"
                            ? t("Needs work")
                            : t("Good — can be sharper")}
                      </p>
                      <p className="ai-summary">{aiReview.summary}</p>
                      <ul className="ai-criteria">
                        {aiReview.criteria.map((c, i) => (
                          <li key={i} className={c.met ? "met" : "miss"}>
                            <span className="ai-mark">{c.met ? <Check size={13} /> : <X size={13} />}</span>
                            <span><strong>{c.label}</strong>{c.note ? ` — ${c.note}` : ""}</span>
                          </li>
                        ))}
                      </ul>
                      {aiReview.improved && (
                        <div className="ai-improved">
                          <div className="ai-improved-head">
                            <Sparkles size={13} /> {t("Suggested prompt")}
                            <button type="button" onClick={() => navigator.clipboard?.writeText(aiReview.improved)}>{t("Copy")}</button>
                          </div>
                          <p>{aiReview.improved}</p>
                        </div>
                      )}
                    </div>
                    <button type="button" className="btn btn--violet lg ai-modal-cta" onClick={() => { setAiModal(null); next() }}>
                      {t("Use this prompt")} <ChevronRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="ai-modal-body">
                    <p className="ai-note">
                      {aiReview && !aiReview.ok && aiReview.reason === "rate-limited"
                        ? t("You've used a lot of AI reviews — take a short break and try again.")
                        : aiReview && !aiReview.ok && aiReview.reason === "invalid"
                          ? t("Write a bit more first, then ask AI to review it.")
                          : t("AI review isn't available right now — your checklist above still works.")}
                    </p>
                    <button type="button" className="btn btn--violet lg ai-modal-cta" onClick={() => { setAiModal(null); next() }}>
                      {t("Use this prompt")} <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="ai-modal-head"><Play size={16} /> {t("What this prompt produces")}</div>
                {runPending ? (
                  <div className="ai-modal-loading">
                    <span className="ai-spinner" />
                    <p>{t("AI is running your prompt…")}</p>
                  </div>
                ) : aiRun?.ok ? (
                  <div className="ai-modal-body">
                    <div className="ai-run-output">
                      <pre>{aiRun.output}</pre>
                    </div>
                    {aiRun.comment && (
                      <div className="ai-run-comment">
                        <Sparkles size={13} /> <span>{aiRun.comment}</span>
                      </div>
                    )}
                    <button type="button" className="btn btn--ghost lg ai-modal-cta" onClick={() => setAiModal(null)}>
                      {t("Close")}
                    </button>
                  </div>
                ) : (
                  <div className="ai-modal-body">
                    <p className="ai-note">
                      {aiRun && !aiRun.ok && aiRun.reason === "rate-limited"
                        ? t("You've run a lot of prompts — take a short break and try again.")
                        : aiRun && !aiRun.ok && aiRun.reason === "invalid"
                          ? t("Write a bit more first, then run it.")
                          : t("Running isn't available right now — try again later.")}
                    </p>
                    <button type="button" className="btn btn--ghost lg ai-modal-cta" onClick={() => setAiModal(null)}>
                      {t("Close")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {lockedRefill !== null && <OutOfHearts nextRefill={lockedRefill || null} max={HEART_MAX} lang={lang} />}
    </div>
  )
}
