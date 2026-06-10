import type { Role } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getLang } from "@/lib/i18n"
import AppShell from "./_shell"
import "./app-ds.css"
import "./app-pages.css"
import "./app-paths.css"
import "./app-roadmap.css"
import "./app-course.css"
import "./app-tools.css"
import "./app-docs-reader.css"
import "./app-sidebar.css"
import "./app-leaderboard.css"
import "./app-dashboard.css"
import "./app-learn-cards.css"
import "./app-questmap.css"
import "./app-badges.css"
import "./app-profile.css"
import "./app-upgrade.css"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang()
  const initialCollapsed = (await cookies()).get("dlab-sidebar")?.value === "1"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const [{ data: p }, { data: g }] = await Promise.all([
    supabase.from("profiles").select("display_name,role").eq("id", user.id).single(),
    supabase.from("game_state").select("xp,hearts,streak_current").eq("user_id", user.id).single(),
  ])
  const displayName = p?.display_name ?? "นักเรียน"
  const role: Role = (p?.role as Role) ?? "user"
  const xp = g?.xp ?? 0
  const hearts = g?.hearts ?? 5
  const streak = g?.streak_current ?? 0

  return (
    <AppShell displayName={displayName} role={role} xp={xp} hearts={hearts} streak={streak} lang={lang} initialCollapsed={initialCollapsed}>
      {children}
    </AppShell>
  )
}
