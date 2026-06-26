import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getLang, makeT } from "@/lib/i18n"
import { requireUser, isPro } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getCareerPath, totalSteps, totalXp } from "@/lib/career-paths"
import { FREE_CAREER_PREVIEW_STEPS, pathUpgradeHref } from "@/lib/career-preview"
import { getMyCertificateForPath } from "@/lib/certificates"
import ToolLogo from "@/components/tool-logo"
import {
  Brain, Zap, Check, Lock, Award, BookOpen,
  CheckCircle2, Flag, Wrench, ChevronRight, Target, BriefcaseBusiness,
} from "lucide-react"

const TONE_META: Record<string, { bg: string; Icon: React.ElementType }> = {
  violet: { bg: "var(--hero-100)",  Icon: Brain },
  mint:   { bg: "var(--mint-100)",  Icon: BookOpen },
  pink:   { bg: "var(--pink-100)",  Icon: CheckCircle2 },
  sky:    { bg: "var(--sky-100)",   Icon: BookOpen },
  sun:    { bg: "var(--sun-100)",   Icon: Zap },
}

const TOOL_HEX: Record<string, string> = {
  ChatGPT: "#19C37D", Claude: "#FF9A52", Gemini: "#2A6FF0",
  Midjourney: "#6C3CF5", Suno: "#F45C97", Runway: "#1B1729",
  Codex: "#10A37F",
}

type StepState = "done" | "cur" | "lock"

export default async function PathDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lang = await getLang()
  const [path, profile] = await Promise.all([
    getCareerPath(id, lang),
    requireUser(),
  ])
  const t = makeT(lang)

  if (!path) notFound()

  // Free preview: Pro paths are viewable, and Free users may learn the first
  // few steps before the paywall. Pro users (and admins) get full access.
  const isProUser = isPro(profile)
  const isPreview = path.isPro && !isProUser

  // Path progress lives under its own key ("path:{slug}") — fully separate
  // from daily-learn course progress. Steps complete strictly in order.
  const supabase = await createClient()
  const [{ data: progressRow }, certificate] = await Promise.all([
    supabase
      .from("course_progress")
      .select("lessons_done")
      .eq("user_id", profile.id)
      .eq("course_id", `path:${path.slug}`)
      .maybeSingle(),
    getMyCertificateForPath(path.id),
  ])
  const stepsDone = progressRow?.lessons_done ?? 0

  // Pre-compute step states: first N done, step N+1 is current, rest locked.
  const flatSteps = path.modules.flatMap((m) => m.steps)
  const stateMap = new Map<string, StepState>()
  flatSteps.forEach((s, i) => {
    stateMap.set(s.id, i < stepsDone ? "done" : i === stepsDone ? "cur" : "lock")
  })

  const doneCount = Math.min(stepsDone, flatSteps.length)
  const pct = totalSteps(path) > 0 ? Math.round((doneCount / totalSteps(path)) * 100) : 0

  const continueIdx = Math.min(stepsDone + 1, flatSteps.length)
  // For a Free user mid-preview, the next step may be past the preview cap — send
  // them to a contextual upgrade instead of a step they can't open.
  const continueLocked = isPreview && continueIdx > FREE_CAREER_PREVIEW_STEPS
  const continueHref = flatSteps.length === 0
    ? "/paths"
    : continueLocked
      ? pathUpgradeHref(path.slug, continueIdx, "path_locked")
      : `/paths-learn/${path.slug}/${continueIdx}`

  const { bg, Icon } = TONE_META[path.tone] ?? TONE_META.violet

  const kindIcon: Record<string, React.ReactNode> = {
    lesson:     <BookOpen size={13} />,
    quiz:       <CheckCircle2 size={13} />,
    checkpoint: <Flag size={13} />,
    project:    <Wrench size={13} />,
  }
  const kindLabel: Record<string, string> = {
    lesson: t("Lesson"), quiz: t("Quiz"), checkpoint: t("Checkpoint"), project: t("Project"),
  }
  return (
    <>
      <div className="wrap" style={{ paddingTop: 8, fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)" }}>
        <Link href="/paths" style={{ color: "var(--hero-600)" }}>{t("Career paths")}</Link>
        {" "}<span style={{ opacity: .5 }}>›</span>{" "}
        <span style={{ color: "var(--text-strong)" }}>{path.title}</span>
      </div>

      <div className="course-head glass">
        <div className="ch-tile" style={{ background: bg }}><Icon size={34} /></div>
        <div>
          <span className="eyebrow">{path.tag}</span>
          <h1 className="display" style={{ marginTop: 8 }}>{path.title}</h1>
          <div className="ch-tools">
            {path.tools.map((name) => (
              <span className="ptool" key={name}>
                <span className="sw" style={{ background: TOOL_HEX[name] ?? "#888" }}>
                  <ToolLogo name={name} size={12} />
                </span>
                {name}
              </span>
            ))}
          </div>
          <div className="ch-prog">
            <span className="pl">{pct}%</span>
            <div className="pbar"><i style={{ width: `${pct}%` }} /></div>
            <span className="pl">{doneCount} / {totalSteps(path)} {t("lessons")}</span>
          </div>
        </div>
        <div className="ch-cta">
          <Link className="btn btn--violet lg" href={continueHref}>
            {continueLocked
              ? <><Lock size={16} /> {t("Unlock to continue")}</>
              : <>{doneCount > 0 ? t("Continue") : t("Start learning")} <ChevronRight size={18} /></>}
          </Link>
          {isPreview && (
            <span className="xp">{t("Free preview: first {n} steps", { n: FREE_CAREER_PREVIEW_STEPS })}</span>
          )}
          <span className="xp"><Zap size={13} /> {totalXp(path).toLocaleString()} XP {t("total")}</span>
        </div>
      </div>

      {path.practicalRatio > 0 && (
        <div className="wrap path-value">
          <div className="path-ratio-card glass">
            <div className="ratio-donut" style={{ "--practice": `${path.practicalRatio}%` } as React.CSSProperties}>
              <strong>{path.practicalRatio}%</strong>
              <span>{t("practice")}</span>
            </div>
            <div>
              <b>{t("Built around real work")}</b>
              <p>{t("Every practical step produces work you can review, improve, or add to your portfolio.")}</p>
              <div className="ratio-legend">
                <span className="practice">{path.practicalRatio}% {t("hands-on practice")}</span>
                <span>{100 - path.practicalRatio}% {t("essential theory")}</span>
              </div>
            </div>
          </div>

          <div className="path-value-grid">
            <article className="path-value-card glass">
              <span className="path-value-icon target"><Target size={20} /></span>
              <div>
                <h2>{t("What you will be able to do")}</h2>
                <ul>
                  {path.outcomes.map((outcome) => <li key={outcome}><Check size={15} /> {outcome}</li>)}
                </ul>
              </div>
            </article>
            <article className="path-value-card glass">
              <span className="path-value-icon portfolio"><BriefcaseBusiness size={20} /></span>
              <div>
                <h2>{t("Work you will build")}</h2>
                <ul>
                  {path.deliverables.map((deliverable) => <li key={deliverable}><Check size={15} /> {deliverable}</li>)}
                </ul>
              </div>
            </article>
          </div>
        </div>
      )}

      <section className="block" style={{ padding: "0 0 60px" }}>
        <div className="roadmap">
          {path.modules.map((mod, mi) => {
            const modSteps = mod.steps
            const modDone = modSteps.filter((s) => stateMap.get(s.id) === "done").length
            const hasCur = modSteps.some((s) => stateMap.get(s.id) === "cur")
            const allDone = modDone === modSteps.length && modSteps.length > 0
            const modState: StepState = allDone ? "done" : hasCur ? "cur" : "lock"
            const isLast = mi === path.modules.length - 1

            return (
              <div key={mod.id} className={`module glass${modState === "lock" ? " locked" : ""}`}>
                <div className="mod-head">
                  <span className={`mn ${modState}`}>
                    {isLast ? <Award size={20} /> : modState === "done" ? <Check size={20} /> : mi + 1}
                  </span>
                  <div className="mh">
                    <h3 className="display">{mod.title}</h3>
                    <div className="mmeta">
                      {modSteps.length} {t("lessons")} ·{" "}
                      {allDone ? t("done") : hasCur ? `${modDone} / ${modSteps.length}` : t("locked")}
                    </div>
                  </div>
                  <span className={`mtag ${modState}`}>
                    {allDone ? t("Done") : hasCur ? `${modDone} / ${modSteps.length}` : <><Lock size={11} /> {t("Locked")}</>}
                  </span>
                </div>

                {modSteps.length > 0 && (
                  <div className="mod-body">
                    <div className="lesson-track">
                      {modSteps.map((step) => {
                        const state = stateMap.get(step.id) ?? "lock"
                        const stepIdx = flatSteps.findIndex((s) => s.id === step.id) + 1
                        // Past the free-preview cap, a Free user sees a Pro lock that
                        // links to a contextual upgrade instead of the step.
                        const proLocked = isPreview && stepIdx > FREE_CAREER_PREVIEW_STEPS
                        const href = proLocked
                          ? pathUpgradeHref(path.slug, stepIdx, "path_locked")
                          : `/paths-learn/${path.slug}/${stepIdx}`
                        const inner = (
                          <>
                            <span className={`lnode ${proLocked ? "lock" : state}`}>
                              {proLocked || state === "lock" ? <Lock size={16} /> : state === "done" ? <Check size={17} /> : <Zap size={17} />}
                            </span>
                            <div className="li">
                              <b>
                                {step.title}
                                {proLocked
                                  ? <span className="lpill">Pro</span>
                                  : state === "cur" && <span className="lpill">{t("Start here")}</span>}
                              </b>
                              <span>{kindIcon[step.kind]} {kindLabel[step.kind]} · +{step.xp} XP</span>
                            </div>
                            <span className="lx">
                              {proLocked ? t("Unlock") : state === "done" ? `+${step.xp} XP` : state === "cur"
                                ? <>{t("Continue")} <ChevronRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} /></>
                                : `+${step.xp} XP`}
                            </span>
                          </>
                        )
                        return state === "lock" && !proLocked
                          ? <span key={step.id} className="lrow lock">{inner}</span>
                          : <Link key={step.id} className={`lrow${proLocked ? " prolock" : state === "cur" ? " cur" : ""}`} href={href}>{inner}</Link>
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className={`cert-card glass${certificate ? " earned" : ""}`}>
          <Image src="/assets/daily-ai-lab/mascot-ds/mascot-celebrate.png" alt="Riri" width={84} height={84} />
          <div>
            <h3 className="display">
              {certificate ? t("Certificate earned") : t("Finish to earn a certificate")}
            </h3>
            <p>
              {certificate
                ? t("Your certificate has a public verification URL and is ready to share.")
                : t("Complete every module to earn a {title} certificate for your portfolio or LinkedIn.", { title: path.title })}
            </p>
          </div>
          {certificate && (
            <Link className="btn btn--violet sm cert-view" href={`/certificate/${certificate.verificationCode}`}>
              {t("View certificate")} <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </section>
    </>
  )
}
