"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, ClipboardCheck, Download, FileText, Flag, Play, Sparkles, Wrench, X, Zap } from "lucide-react"
import type { PathStep } from "@/lib/career-paths"
import type { PathSubmission, ProjectFeedback } from "@/lib/path-projects"
import type { Lang } from "@/lib/i18n-core"
import { makeT } from "@/lib/i18n-core"
import { completeLessonAction, runPromptAction, type RunPromptResult } from "@/app/(lesson)/daily-learn/actions"
import { submitPathWorkAction } from "./actions"

const M = "/assets/daily-ai-lab/mascot-ds"

export default function PathActivity({
  pathId,
  pathSlug,
  pathTitle,
  step,
  stepNum,
  totalSteps,
  initialSubmission,
  initiallyCompleted,
  nextHref,
  lang,
}: {
  pathId: string
  pathSlug: string
  pathTitle: string
  step: PathStep
  stepNum: number
  totalSteps: number
  initialSubmission: PathSubmission | null
  initiallyCompleted: boolean
  nextHref: string | null
  lang: Lang
}) {
  const t = makeT(lang)
  const [title, setTitle] = useState(initialSubmission?.artifactTitle ?? step.title)
  const [content, setContent] = useState(initialSubmission?.content ?? step.starterTemplate)
  const [feedback, setFeedback] = useState<ProjectFeedback | null>(initialSubmission?.feedback ?? null)
  const [error, setError] = useState("")
  const [award, setAward] = useState<number | null>(null)
  const [completed, setCompleted] = useState(initiallyCompleted)
  // Shows a loading popup while the AI grades the submission, so tapping "Have
  // AI check it" visibly does something instead of silently working.
  const [checking, setChecking] = useState(false)
  // Lets the learner run their work as a prompt and see the real output before/
  // after submitting (useful for prompt-style projects). Shown in a popup.
  const [aiRun, setAiRun] = useState<RunPromptResult | null>(null)
  const [runPending, setRunPending] = useState(false)
  const [runOpen, setRunOpen] = useState(false)
  const feedbackRef = useRef<HTMLElement | null>(null)
  const [pending, startTransition] = useTransition()

  // When fresh feedback arrives, scroll it into view so the learner sees it.
  useEffect(() => {
    if (feedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [feedback])

  // AI is the assessor now — the learner no longer self-scores the rubric. The
  // rubric is shown read-only so they know what AI will grade against.
  const canSubmit = title.trim().length >= 3 && content.trim().length >= 80
  const isProject = step.kind === "project"

  function downloadPlaybook() {
    const markdown = `# ${pathTitle}: ${step.title}\n\n## Brief\n${step.brief}\n\n## Deliverable\n${step.deliverable}\n\n## Starter template\n${step.starterTemplate}\n\n## Rubric\n${step.rubric.map((criterion) => `- **${criterion.label}:** ${criterion.guidance}`).join("\n")}\n`
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${pathSlug}-${isProject ? "project" : "checkpoint"}-playbook.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  function submit() {
    if (!canSubmit) return
    setError("")
    setChecking(true)
    startTransition(async () => {
      const result = await submitPathWorkAction({
        pathId,
        stepId: step.id,
        artifactTitle: title,
        content,
        selfScores: {},
      })
      if (!result.ok) {
        setChecking(false)
        setError(t("Couldn't save your work. Please try again."))
        return
      }
      const completion = await completeLessonAction(`path:${pathSlug}`, stepNum, false)
      if (completion.ok) {
        setAward(completion.xp)
        setCompleted(true)
      } else if (completion.reason === "replay") {
        setAward(0)
        setCompleted(true)
      } else {
        setError(t("Your work was saved, but this step could not be completed yet."))
      }
      setChecking(false)
      setFeedback(result.feedback) // set last so the scroll effect lands on rendered feedback
    })
  }

  function runWork() {
    if (runPending) return
    setAiRun(null)
    setRunOpen(true)
    setRunPending(true)
    startTransition(async () => {
      const r = await runPromptAction({ draft: content })
      setAiRun(r)
      setRunPending(false)
    })
  }

  function completeSavedWork() {
    setError("")
    startTransition(async () => {
      const completion = await completeLessonAction(`path:${pathSlug}`, stepNum, false)
      if (completion.ok || completion.reason === "replay") {
        setAward(completion.ok ? completion.xp : 0)
        setCompleted(true)
      } else {
        setError(t("Your work was saved, but this step could not be completed yet."))
      }
    })
  }

  return (
    <div className="dlab-lesson path-activity">
      <div className="activity-top">
        <Link href={`/paths/${pathSlug}`} aria-label={t("Exit")}><X size={18} /></Link>
        <div className="lprog"><i style={{ width: `${((stepNum - 1) / Math.max(totalSteps, 1)) * 100}%` }} /></div>
        <span>{stepNum}/{totalSteps}</span>
      </div>

      <main className="activity-shell">
        <header className="activity-intro">
          <span className={`activity-kind ${isProject ? "project" : "checkpoint"}`}>
            {isProject ? <Wrench size={15} /> : <Flag size={15} />}
            {isProject ? t("Portfolio project") : t("Checkpoint")}
          </span>
          <h1>{step.title}</h1>
          <p>{step.brief}</p>
          <div className="deliverable"><FileText size={18} /><span><b>{t("What to submit")}</b>{step.deliverable}</span></div>
          <button type="button" className="playbook-button" onClick={downloadPlaybook}>
            <Download size={16} /> {t("Download project playbook")}
          </button>
        </header>

        <section className="activity-editor" aria-label={t("Project workspace")}>
          <p className="activity-howto">
            <Sparkles size={15} />
            <span>{t("The box below has a ready-made template — fill in your info after each heading (the “:”). You can rewrite it too. When you're ready, tap “Have AI check it”, or “Run & see result” first to preview what your work produces.")}</span>
          </p>
          <label>
            <span>{t("Artifact title")}</span>
            <input value={title} onChange={(event) => { setTitle(event.target.value); setFeedback(null) }} maxLength={120} />
          </label>
          <label>
            <span>{t("Your work")}</span>
            <textarea value={content} onChange={(event) => { setContent(event.target.value); setFeedback(null) }} rows={18} />
          </label>
          <div className="activity-editor-foot">
            <small>{content.trim().length}/80+ {t("characters")}</small>
            <button
              type="button"
              className="ai-run-btn"
              onClick={runWork}
              disabled={runPending || content.trim().length < 10}
            >
              <Play size={15} /> {runPending ? t("AI is running…") : t("Run & see result")}
            </button>
          </div>
        </section>

        <section className="rubric-panel">
          <div className="rubric-heading">
            <ClipboardCheck size={21} />
            <div><h2>{t("What AI will grade")}</h2><p>{t("AI scores your work against these criteria when you submit.")}</p></div>
          </div>
          {step.rubric.map((criterion) => (
            <div className="rubric-row read-only" key={criterion.key}>
              <div><b>{criterion.label}</b><p>{criterion.guidance}</p></div>
            </div>
          ))}
        </section>

        {feedback && (
          <section className="project-feedback" aria-live="polite" ref={feedbackRef}>
            <Image src={`${M}/mascot-thumbsup.png`} alt="Riri" width={92} height={92} />
            <div>
              {feedback.aiReview && feedback.target !== undefined ? (
                <span className={`grade-badge ${feedback.passed ? "pass" : "fail"}`}>
                  {feedback.passed ? <Check size={14} /> : <X size={14} />}{" "}
                  {t("AI score")} {feedback.aiReview.score}/100 · {feedback.passed ? t("Passed") : t("Target {n}", { n: feedback.target })}
                </span>
              ) : (
                <span>{t("Rubric score")} {feedback.score}/100</span>
              )}
              <h2>{t("Feedback on your project")}</h2>
              <p>{feedback.summary}</p>
              {feedback.strengths.length > 0 && <p><b>{t("Strong points")}:</b> {feedback.strengths.join(", ")}</p>}
              {feedback.improvements.length > 0 && (
                <ul>{feedback.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
              )}
              {feedback.aiReview && (
                <div className={`ai-review ai-review--${feedback.aiReview.overall}`}>
                  <p className="ai-review-head"><Zap size={15} /> <b>{t("AI review")}</b></p>
                  <p>{feedback.aiReview.summary}</p>
                  <ul className="ai-review-criteria">
                    {feedback.aiReview.criteria.map((c) => (
                      <li key={c.label} className={c.met ? "met" : "unmet"}>
                        {c.met ? <Check size={14} /> : <X size={14} />}
                        <span><b>{c.label}:</b> {c.note}</span>
                      </li>
                    ))}
                  </ul>
                  {feedback.aiReview.priorityFix && (
                    <p className="ai-review-fix"><b>{t("Fix this first")}:</b> {feedback.aiReview.priorityFix}</p>
                  )}
                  {feedback.aiReview.improvedExample && (
                    <div className="ai-review-example">
                      <p className="ai-review-head"><Sparkles size={14} /> <b>{t("A strong example to compare yours with")}</b></p>
                      <pre>{feedback.aiReview.improvedExample}</pre>
                    </div>
                  )}
                </div>
              )}
              {award !== null && <div className="activity-award"><Zap size={16} /> +{award} XP</div>}
            </div>
          </section>
        )}

        {error && <p className="activity-error">{error}</p>}

        {feedback && !completed && feedback.passed === false && (
          <p className="activity-hint">
            {t("Not at {n} yet — edit your work above and submit again, or skip for now.", { n: feedback.target ?? 90 })}
          </p>
        )}

        <div className="activity-actions">
          {feedback && !completed ? (
            feedback.passed === false ? (
              <button type="button" className="btn btn--ghost lg" onClick={completeSavedWork} disabled={pending}>
                {pending ? t("Saving…") : t("Skip this step for now")}
              </button>
            ) : (
              <button type="button" className="btn btn--violet lg" onClick={completeSavedWork} disabled={pending}>
                {pending ? t("Saving…") : t("Complete this step")}
              </button>
            )
          ) : feedback && nextHref ? (
            <Link className="btn btn--sun lg" href={nextHref}>{t("Continue path")} <ChevronRight size={18} /></Link>
          ) : feedback ? (
            <Link className="btn btn--sun lg" href="/portfolio">{t("View portfolio")} <ChevronRight size={18} /></Link>
          ) : (
            <button type="button" className="btn btn--violet lg" onClick={submit} disabled={!canSubmit || pending}>
              {pending ? t("Reviewing your work…") : t("Have AI check it")}
            </button>
          )}
        </div>
      </main>

      {checking && (
        <div className="ai-modal-backdrop">
          <div className="ai-modal" role="dialog" aria-modal="true">
            <div className="ai-modal-head"><Sparkles size={17} /> {t("AI review")}</div>
            <div className="ai-modal-loading">
              <span className="ai-spinner" />
              <p>{t("AI is checking your work…")}</p>
            </div>
          </div>
        </div>
      )}

      {runOpen && (
        <div className="ai-modal-backdrop" onClick={() => setRunOpen(false)}>
          <div className="ai-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="ai-modal-x" onClick={() => setRunOpen(false)} aria-label={t("Close")}>
              <X size={18} />
            </button>
            <div className="ai-modal-head"><Play size={16} /> {t("What your work produces")}</div>
            {runPending ? (
              <div className="ai-modal-loading">
                <span className="ai-spinner" />
                <p>{t("AI is running your work…")}</p>
              </div>
            ) : aiRun?.ok ? (
              <div className="ai-modal-body">
                <div className="ai-run-output"><pre>{aiRun.output}</pre></div>
                {aiRun.comment && (
                  <div className="ai-run-comment"><Sparkles size={13} /> <span>{aiRun.comment}</span></div>
                )}
                <button type="button" className="btn btn--ghost lg ai-modal-cta" onClick={() => setRunOpen(false)}>
                  {t("Close")}
                </button>
              </div>
            ) : (
              <div className="ai-modal-body">
                <p className="ai-note">
                  {aiRun && !aiRun.ok && aiRun.reason === "rate-limited"
                    ? t("You've run a lot of prompts — take a short break and try again.")
                    : content.trim().length > 2000
                      ? t("This work is long — running works best for short prompts. For longer work, see the AI feedback and the strong example after you submit.")
                      : t("Write a bit more first, then run it.")}
                </p>
                <button type="button" className="btn btn--ghost lg ai-modal-cta" onClick={() => setRunOpen(false)}>
                  {t("Close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
