import { isDevMock, MOCK_PROFILE, MOCK_GAME_STATE, type Role } from "@/lib/mock-user"
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
  let displayName = "นักเรียน"
  let xp = 0, hearts = 5, streak = 0
  let role: Role = "user"

  if (isDevMock()) {
    displayName = MOCK_PROFILE.display_name ?? "นักเรียน"
    role = MOCK_PROFILE.role
    xp = MOCK_GAME_STATE.xp
    hearts = MOCK_GAME_STATE.hearts
    streak = MOCK_GAME_STATE.streak_current
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")
    const [{ data: p }, { data: g }] = await Promise.all([
      supabase.from("profiles").select("display_name,role").eq("id", user.id).single(),
      supabase.from("game_state").select("xp,hearts,streak_current").eq("user_id", user.id).single(),
    ])
    displayName = p?.display_name ?? "นักเรียน"
    role = (p?.role as Role) ?? "user"
    xp = g?.xp ?? 0
    hearts = g?.hearts ?? 5
    streak = g?.streak_current ?? 0
  }

  return (
    <AppShell displayName={displayName} role={role} xp={xp} hearts={hearts} streak={streak} lang={lang} initialCollapsed={initialCollapsed}>
      {children}
    </AppShell>
  )
}
