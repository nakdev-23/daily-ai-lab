import { redirect } from "next/navigation"
import { getCareerPath } from "@/lib/career-paths"
import { getPublishedCourse } from "@/lib/courses"
import { getCareerLessonSteps, getLessonSteps } from "@/lib/lesson-loader"
import { getHeartState, nextHeartRefillISO, bangkokTodayISO } from "@/lib/hearts"
import { getProfile, isPro } from "@/lib/auth"
import { getSystemSettings } from "@/lib/system-settings"
import { getLang } from "@/lib/i18n"
import { getLessonsDone } from "@/lib/progress"
import { getMyPathSubmission } from "@/lib/path-projects"
import { FREE_CAREER_PREVIEW_STEPS, pathUpgradeHref } from "@/lib/career-preview"
import { createClient } from "@/lib/supabase/server"
import OutOfHearts from "@/components/out-of-hearts"
import DailyLimitReached from "@/components/daily-limit"
import LessonPlayer from "../../../learn/[tool]/[level]/[slug]/_player"
import PathActivity from "../../_path-activity"

/**
 * Lesson player for CAREER PATH steps. Progress is fully separate from
 * daily-learn: it saves under the "path:{slug}" key with the step's position
 * in the path, so learning here never advances a daily course and vice versa.
 * Career-specific lesson content is loaded first from /content/career-paths.
 * Older paths can still fall back to the underlying daily course file.
 */
export default async function PathLessonPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>
}) {
  const { id: slug, step } = await params
  const stepNum = parseInt(step, 10)
  if (isNaN(stepNum) || stepNum < 1) redirect(`/paths/${slug}`)

  // These don't depend on the path lookup — start them immediately.
  const heartPromise = getHeartState()
  const profilePromise = getProfile()
  const settingsPromise = getSystemSettings()

  const lang = await getLang()
  const path = await getCareerPath(slug, lang)
  if (!path || !path.isPublished) redirect("/paths")

  const flatSteps = path.modules.flatMap((m) => m.steps)
  if (stepNum > flatSteps.length) redirect(`/paths/${slug}`)
  const pathStep = flatSteps[stepNum - 1]

  const progressKey = `path:${slug}`
  const [heart, profile, settings, stepsDone, submission, careerSteps] = await Promise.all([
    heartPromise,
    profilePromise,
    settingsPromise,
    getLessonsDone(progressKey),
    pathStep.kind === "checkpoint" || pathStep.kind === "project"
      ? getMyPathSubmission(pathStep.id)
      : Promise.resolve(null),
    pathStep.kind === "checkpoint" || pathStep.kind === "project"
      ? Promise.resolve(null)
      : getCareerLessonSteps(path.slug, stepNum, lang),
  ])

  // Pro paths: Free users get a free preview of the first N steps, then hit a
  // contextual paywall. Steps 1..N still pass through the daily-quota check
  // below, so preview never bypasses the lesson cap. Pro users are never gated.
  if (path.isPro && !isPro(profile) && stepNum > FREE_CAREER_PREVIEW_STEPS) {
    redirect(pathUpgradeHref(slug, stepNum, "path_locked"))
  }
  const isLastStep = stepNum >= flatSteps.length

  // Free-package daily quota: only NEW steps count (replays are always free).
  // Same Bangkok-midnight boundary as the RPC's lessons_today tracking.
  const isNewStep = stepNum > stepsDone
  if (profile && !isPro(profile) && isNewStep) {
    const supabase = await createClient()
    const { data: g } = await supabase
      .from("game_state")
      .select("lessons_today, lessons_today_date")
      .eq("user_id", profile.id)
      .maybeSingle()
    const doneToday = g?.lessons_today_date === bangkokTodayISO() ? (g?.lessons_today ?? 0) : 0
    if (doneToday >= settings.freeLessonsPerDay) {
      return <DailyLimitReached limit={settings.freeLessonsPerDay} nextReset={nextHeartRefillISO(0)} lang={lang} />
    }
  }

  // Out of hearts → can't start any lesson until they refill. Pro is never locked.
  if (!heart.unlimited && heart.hearts <= 0) {
    return <OutOfHearts nextRefill={heart.nextRefill} max={heart.max} lang={lang} />
  }

  if (pathStep.kind === "checkpoint" || pathStep.kind === "project") {
    return (
      <PathActivity
        pathId={path.id}
        pathSlug={path.slug}
        pathTitle={path.title}
        step={pathStep}
        stepNum={stepNum}
        totalSteps={flatSteps.length}
        initialSubmission={submission}
        initiallyCompleted={stepNum <= stepsDone}
        nextHref={isLastStep ? null : `/paths-learn/${slug}/${stepNum + 1}`}
        lang={lang}
      />
    )
  }

  let steps = careerSteps
  if (!steps) {
    // Legacy fallback: older career paths still point at daily course content.
    const course = await getPublishedCourse(pathStep.courseSlug, lang)
    if (!course) redirect(`/paths/${slug}`)
    steps = await getLessonSteps(pathStep.courseSlug, pathStep.lessonNum, lang)
  }

  return (
    <LessonPlayer
      steps={steps ?? undefined}
      courseId={progressKey}
      lessonNum={stepNum}
      isLastLesson={isLastStep}
      initialHearts={heart.hearts}
      heartsMax={heart.max}
      unlimitedHearts={heart.unlimited}
      isPro={isPro(profile)}
      nextRefill={heart.nextRefill}
      lang={lang}
      backHref={`/paths/${slug}`}
      nextHref={isLastStep ? null : `/paths-learn/${slug}/${stepNum + 1}`}
    />
  )
}
