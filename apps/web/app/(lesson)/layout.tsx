import { isDevMock } from "@/lib/mock-user"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import "./lesson.css"

// Lesson player is full-screen (its own top bar + hearts) — no app shell.
export default async function LessonLayout({ children }: { children: React.ReactNode }) {
  if (!isDevMock()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")
  }
  return <>{children}</>
}
