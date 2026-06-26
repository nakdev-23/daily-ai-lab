import { Check, X } from "lucide-react"
import type { PromptExample } from "@/lib/lesson-types"
import { makeT, type Lang } from "@/lib/i18n-core"

/**
 * Good-vs-bad prompt reference shown above a practice editor. The pair should be
 * tailored to the step's task so learners see how to phrase THIS prompt — and
 * what it changes — before they write their own. Styles live in lesson.css.
 */
export default function PromptExamples({ examples, lang }: { examples: PromptExample; lang: Lang }) {
  const t = makeT(lang)
  return (
    <div className="prompt-examples">
      <div className="pex-head">{t("See the difference")}</div>
      <div className="pex bad">
        <div className="pex-tag"><X size={14} /> {t("Weak example")}</div>
        <p className="pex-text">{examples.bad}</p>
        {examples.badNote && <p className="pex-note">{examples.badNote}</p>}
      </div>
      <div className="pex good">
        <div className="pex-tag"><Check size={14} /> {t("Strong example")}</div>
        <p className="pex-text">{examples.good}</p>
        {examples.goodNote && <p className="pex-note">{examples.goodNote}</p>}
      </div>
    </div>
  )
}
