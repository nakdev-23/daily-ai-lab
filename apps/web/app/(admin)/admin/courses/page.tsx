import { requireAdmin } from "@/lib/auth"
import { getCourses } from "@/lib/courses"
import CoursesAdmin from "./_courses-admin"

export default async function AdminCoursesPage() {
  await requireAdmin()
  const courses = await getCourses()
  return <CoursesAdmin courses={courses} />
}
