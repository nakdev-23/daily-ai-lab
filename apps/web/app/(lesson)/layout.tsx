import { getAuthUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import "./lesson.css"

// Lesson player is full-screen (its own top bar + hearts) — no app shell.
export default async function LessonLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) redirect("/login")
  return <>{children}</>
}
