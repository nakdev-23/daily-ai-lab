import { redirect } from "next/navigation"
import { getCourse } from "@/lib/courses"
import { getCourseContent } from "@/lib/course-content"
import { getLessonSteps } from "@/lib/lesson-loader"
import LessonPlayer from "../../../learn/[tool]/[level]/[slug]/_player"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string; lesson: string }>
}) {
  const { topic, lesson } = await params
  const lessonNum = parseInt(lesson, 10)
  if (isNaN(lessonNum) || lessonNum < 1) redirect(`/daily-learn/${topic}`)

  const course = await getCourse(topic)
  if (!course) redirect("/daily-learn")

  const units = await getCourseContent(course.id)
  const flat = units.flatMap((u) => u.lessons)
  if (lessonNum > flat.length && flat.length > 0) redirect(`/daily-learn/${topic}`)

  const steps = await getLessonSteps(course.slug, lessonNum)
  const isLastLesson = flat.length > 0 && lessonNum >= flat.length

  // Progress rows and lesson URLs are keyed by slug (course_progress.course_id);
  // fall back to id for legacy rows that predate the slug column.
  const progressKey = course.slug || course.id

  return <LessonPlayer steps={steps ?? undefined} courseId={progressKey} lessonNum={lessonNum} isLastLesson={isLastLesson} />
}
