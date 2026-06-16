import { redirect } from "next/navigation"
import { getPublishedCourse } from "@/lib/courses"
import { getPublishedCourseContent } from "@/lib/course-content"
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

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string; lesson: string }>
}) {
  const { topic, lesson } = await params
  const lessonNum = parseInt(lesson, 10)
  if (isNaN(lessonNum) || lessonNum < 1) redirect(`/daily-learn/${topic}`)

  // These don't depend on the course lookup — start them immediately.
  const heartPromise = getHeartState()
  const profilePromise = getProfile()
  const settingsPromise = getSystemSettings()
  // getLang is request-cached, so reading it up front is free and lets the
  // lesson loader + content reader pick the matching language (en/ folder or
  // *_en columns, Thai fallback).
  const lang = await getLang()
  const course = await getPublishedCourse(topic, lang)
  if (!course) redirect("/daily-learn")

  // Progress rows and lesson URLs are keyed by slug (course_progress.course_id);
  // fall back to id for legacy rows that predate the slug column.
  const progressKey = course.slug || course.id

  const [units, steps, heart, profile, settings, lessonsDone] = await Promise.all([
    getPublishedCourseContent(course.id, lang),
    getLessonSteps(course.slug, lessonNum, lang),
    heartPromise,
    profilePromise,
    settingsPromise,
    getLessonsDone(progressKey),
  ])
  // Pro-only course → Free users go upgrade (admins/Pro pass).
  if (course.isPro && !isPro(profile)) redirect("/upgrade")

  const flat = units.flatMap((u) => u.lessons)
  if (lessonNum > flat.length && flat.length > 0) redirect(`/daily-learn/${topic}`)
  const isLastLesson = flat.length > 0 && lessonNum >= flat.length

  // Free-package daily quota: only NEW lessons count (replays are always free).
  // The complete_lesson RPC enforces the same rule server-side (migration 010);
  // this gate just shows the friendly screen before they invest time in a
  // lesson that would never be counted. Day boundary = Bangkok midnight, same
  // as the RPC's lessons_today tracking.
  const isNewLesson = lessonNum > lessonsDone
  if (profile && !isPro(profile) && isNewLesson) {
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
      lessonNum={lessonNum}
      isLastLesson={isLastLesson}
      initialHearts={heart.hearts}
      heartsMax={heart.max}
      unlimitedHearts={heart.unlimited}
      nextRefill={heart.nextRefill}
      lang={lang}
    />
  )
}
