export type Role = "user" | "admin"
export type Plan = "free" | "pro"

export const MOCK_PROFILE = {
  id: "mock-user-id",
  display_name: "นักเรียน AI",
  avatar_url: null as string | null,
  // Dev: set NEXT_PUBLIC_MOCK_ROLE=user to preview the non-admin experience.
  role: ((process.env.NEXT_PUBLIC_MOCK_ROLE as Role) || "admin") as Role,
  // Dev: set NEXT_PUBLIC_MOCK_PLAN=free to preview the non-Pro (gated) experience.
  plan: ((process.env.NEXT_PUBLIC_MOCK_PLAN as Plan) || "pro") as Plan,
}

export const MOCK_GAME_STATE = {
  xp: 340,
  level: 3,
  hearts: 4,
  hearts_last_lost_at: null,
  streak_current: 7,
  streak_longest: 12,
  streak_last_date: new Date().toISOString().split("T")[0],
  streak_freeze_count: 1,
  lessons_today: 1,
  lessons_today_date: new Date().toISOString().split("T")[0],
}

export function isDevMock(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"))
  )
}
