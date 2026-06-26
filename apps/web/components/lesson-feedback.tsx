"use client"

import { useState, useTransition } from "react"
import { Star, Check } from "lucide-react"
import { submitFeedbackAction } from "@/app/(lesson)/daily-learn/actions"
import { makeT, type Lang } from "@/lib/i18n-core"

/**
 * Lightweight "how was this lesson?" widget shown on the lesson-complete screen.
 * Pick 1–5 stars (required) plus an optional note, then submit. Entirely
 * optional — the learner can ignore it and just move on with the nav buttons.
 * On success it collapses into a small thank-you so it never nags twice.
 */
export default function LessonFeedback({
  courseId,
  lessonNum,
  lang = "th",
}: {
  courseId: string
  lessonNum: number
  lang?: Lang
}) {
  const t = makeT(lang)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  function submit() {
    if (rating < 1 || pending) return
    setFailed(false)
    startTransition(async () => {
      const r = await submitFeedbackAction(courseId, lessonNum, rating, comment)
      if (r.ok) setSent(true)
      else setFailed(true)
    })
  }

  if (sent) {
    return (
      <div className="lfeedback done" aria-live="polite">
        <span className="lfeedback-tick"><Check size={16} /></span>
        {t("Thanks for the feedback! 💜")}
      </div>
    )
  }

  const active = hover || rating

  return (
    <div className="lfeedback">
      <p className="lfeedback-q">{t("How was this lesson?")}</p>
      <div className="lfeedback-stars" role="radiogroup" aria-label={t("Rate this lesson")}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={t("{n} stars", { n })}
            className={`lfeedback-star ${n <= active ? "on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
          >
            <Star size={30} fill={n <= active ? "currentColor" : "none"} />
          </button>
        ))}
      </div>

      {rating > 0 && (
        <>
          <textarea
            className="lfeedback-comment"
            placeholder={t("Anything we could improve? (optional)")}
            value={comment}
            maxLength={1000}
            rows={2}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="button" className="lfeedback-send" onClick={submit} disabled={pending}>
            {pending ? t("Sending…") : t("Send feedback")}
          </button>
          {failed && <p className="lfeedback-err">{t("Couldn't send — please try again.")}</p>}
        </>
      )}
    </div>
  )
}
