import { redirect } from "next/navigation"
import { getCareerPath } from "@/lib/career-paths"
import { getPublishedCourse } from "@/lib/courses"
import { getLessonSteps } from "@/lib/lesson-loader"
import { getHeartState, nextHeartRefillISO, bangkokTodayISO } from "@/lib/hearts"
import { getProfile, isPro } from "@/lib/auth"
import { getSystemSettings } from "@/lib/system-settings"
import { getLang } from "@/lib/i18n"
import { getLessonsDone } from "@/lib/progress"
import { createClient } from "@/lib/supabase/server"
import OutOfHearts from "@/components/out-of-hearts"
import DailyLimitReached from "@/components/daily-limit"
import LessonPlayer from "../../../learn/[tool]/[level]/[slug]/_player"

/**
 * Lesson player for CAREER PATH steps. Progress is fully separate from
 * daily-learn: it saves under the "path:{slug}" key with the step's position
 * in the path, so learning here never advances a daily course and vice versa.
 * The step's lesson CONTENT is reused from the underlying course file.
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
  const [heart, profile, settings, stepsDone, course] = await Promise.all([
    heartPromise,
    profilePromise,
    settingsPromise,
    getLessonsDone(progressKey),
    getPublishedCourse(pathStep.courseSlug, lang),
  ])

  // Pro-only paths stay behind the paywall, same as the path page itself.
  if (path.isPro && !isPro(profile)) redirect("/upgrade")
  // Underlying course must still be published for its content to be served.
  if (!course) redirect(`/paths/${slug}`)

  const steps = await getLessonSteps(pathStep.courseSlug, pathStep.lessonNum, lang)
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

  return (
    <LessonPlayer
      steps={steps ?? undefined}
      courseId={progressKey}
      lessonNum={stepNum}
      isLastLesson={isLastStep}
      initialHearts={heart.hearts}
      heartsMax={heart.max}
      unlimitedHearts={heart.unlimited}
      nextRefill={heart.nextRefill}
      lang={lang}
      backHref={`/paths/${slug}`}
      nextHref={isLastStep ? null : `/paths-learn/${slug}/${stepNum + 1}`}
    />
  )
}
