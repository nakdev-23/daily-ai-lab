"use server"

import { getCourse } from "@/lib/courses"
import { getCourseContent } from "@/lib/course-content"
import { markLessonDone } from "@/lib/progress"

export async function completeLessonAction(courseId: string, lessonNum: number): Promise<void> {
  // Server actions are public endpoints — never trust client-sent values.
  if (!Number.isInteger(lessonNum) || lessonNum < 1) return
  const course = await getCourse(courseId)
  if (!course) return
  const units = await getCourseContent(course.id)
  const flat = units.flatMap((u) => u.lessons)
  const totalLessons = flat.length || course.lessons
  if (totalLessons > 0 && lessonNum > totalLessons) return
  const xp = flat[lessonNum - 1]?.xp ?? 10
  await markLessonDone(courseId, lessonNum, xp)
}
