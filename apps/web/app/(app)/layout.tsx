import { getProfile } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getHeartState } from "@/lib/hearts"
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
  // getProfile is memoized per request, so pages reusing it cost nothing extra.
  const profile = await getProfile()
  if (!profile) redirect("/login")
  const supabase = await createClient()
  const [{ data: g }, heart] = await Promise.all([
    supabase.from("game_state").select("xp,streak_current").eq("user_id", profile.id).single(),
    getHeartState(profile),
  ])
  const displayName = profile.displayName
  const role = profile.role
  const xp = g?.xp ?? 0
  const streak = g?.streak_current ?? 0

  return (
    <AppShell displayName={displayName} role={role} xp={xp} hearts={heart.hearts} unlimitedHearts={heart.unlimited} streak={streak} lang={lang} initialCollapsed={initialCollapsed}>
      {children}
    </AppShell>
  )
}
