import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { getCourse } from "@/lib/courses"
import { getCourseContent } from "@/lib/course-content"
import CourseEdit from "./_course-edit"

export default async function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const course = await getCourse(id)
  if (!course) notFound()
  const units = await getCourseContent(id)
  return <CourseEdit course={course} units={units} />
}
