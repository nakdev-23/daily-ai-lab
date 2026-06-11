import Link from "next/link"
import Image from "next/image"
import { createClient, getAuthUser } from "@/lib/supabase/server"
import { getCourses } from "@/lib/courses"
import { getSystemSettings } from "@/lib/system-settings"
import { getLang, makeT } from "@/lib/i18n"
import { bangkokTodayISO } from "@/lib/hearts"
import { BookOpen, Target, FileText, Flame, Star, Check, Clock, ChevronRight } from "lucide-react"

export default async function MissionsPage() {
  const supabase = await createClient()
  // Day boundary = Bangkok midnight, same as the lessons_today tracking in the DB.
  const today = bangkokTodayISO()

  const [user, settings, lang] = await Promise.all([getAuthUser(), getSystemSettings(), getLang()])
  const t = makeT(lang)
  // Daily lesson goal follows the admin-configured Free quota (no hardcoded 3).
  const goalLessons = Math.max(1, settings.freeLessonsPerDay)
  let lessonsToday = 0
  let streak = 0
  let continueHref = "/daily-learn"
  const doneByCourse: Record<string, number> = {}

  if (user) {
    const [{ data: g }, { data: progress }, courses] = await Promise.all([
      supabase.from("game_state").select("lessons_today, lessons_today_date, streak_current").eq("user_id", user.id).maybeSingle(),
      supabase.from("course_progress").select("course_id, lessons_done, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }),
      getCourses(),
    ])
    lessonsToday = g?.lessons_today_date === today ? (g?.lessons_today ?? 0) : 0
    streak = g?.streak_current ?? 0
    for (const row of (progress ?? []) as Array<{ course_id: string; lessons_done: number }>) {
      doneByCourse[row.course_id] = row.lessons_done
    }
    // Continue link: first published course in progress, else first published course.
    const published = courses.filter((c) => c.status === "published")
    const inProgress = published.find((c) => {
      const d = doneByCourse[c.slug || c.id] ?? 0
      return d > 0 && d < c.lessons
    })
    const target = inProgress ?? published[0]
    if (target) {
      continueHref = `/daily-learn/${target.slug || target.id}/${Math.min((doneByCourse[target.slug || target.id] ?? 0) + 1, target.lessons)}`
    }
  }

  const MISSIONS = [
    { icon: BookOpen, title: t("Finish 1 lesson"), xp: 20, current: Math.min(lessonsToday, 1), total: 1 },
    { icon: Star, title: t("Finish {n} lessons today", { n: goalLessons }), xp: 30, current: Math.min(lessonsToday, goalLessons), total: goalLessons },
    { icon: Flame, title: t("Keep a {n}-day streak", { n: 7 }), xp: 50, current: Math.min(streak, 7), total: 7 },
    { icon: Target, title: t("Score 80%+ on a quiz"), xp: 20, current: 0, total: 1 },
    { icon: FileText, title: t("Read 1 docs page"), xp: 10, current: 0, total: 1 },
  ].map((m) => ({ ...m, done: m.current >= m.total }))

  return (
    <div className="max-w-[700px] mx-auto px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">{t("Today's goals")} <Target size={22} className="text-[#6B4EFF]" /></h1>
          <p className="text-sm text-gray-400 flex items-center gap-1.5"><Clock size={14} /> {t("Current streak: {n} days", { n: streak })} · {t("Learned today: {n} lessons", { n: lessonsToday })}</p>
        </div>
        <Image src="/assets/daily-ai-lab/mascot/cockatiel-avatar.png" alt="Mascot" width={64} height={64} className="ml-auto drop-shadow-md" />
      </div>

      <div className="space-y-4">
        {MISSIONS.map((m) => (
          <div key={m.title} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${m.done ? "border-green-200 bg-green-50/30" : "border-[#ede9ff]"}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.done ? "bg-green-100 text-green-600" : "bg-[#f5f3ff] text-[#6B4EFF]"}`}>
                  {m.done ? <Check size={20} /> : <m.icon size={20} />}
                </div>
                <div>
                  <p className={`text-[14px] font-semibold ${m.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{m.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{m.current}/{m.total}</p>
                </div>
              </div>
              <span className={`text-[14px] font-bold shrink-0 ${m.done ? "text-green-500" : "text-[#6B4EFF]"}`}>+{m.xp} {t("pts")}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${m.done ? "bg-green-400" : "bg-[#6B4EFF]"}`}
                style={{ width: `${Math.min((m.current / m.total) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href={continueHref} className="flex-1 bg-[#6B4EFF] text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-[#5535e8] transition-colors">
          <span className="inline-flex items-center justify-center gap-1">{t("Start learning")} <ChevronRight size={16} /></span>
        </Link>
        <Link href="/daily-learn" className="flex-1 bg-white border border-[#ede9ff] text-gray-600 text-sm font-medium py-3 rounded-xl text-center hover:bg-[#f5f3ff] transition-colors">
          {t("Back to lessons")}
        </Link>
      </div>
    </div>
  )
}
