import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"
import { getSystemSettings } from "@/lib/system-settings"
import { bangkokTodayISO, bangkokHoursLeftToday } from "@/lib/hearts"
import { getLang, makeT } from "@/lib/i18n"
import { getPublishedCourses } from "@/lib/courses"
import { getCareerPaths } from "@/lib/career-paths"
import { getToolColors } from "@/lib/tool-colors"
import TopicsGrid from "./_topics-grid"
import { Flame, Zap, CheckCircle2, Target, ChevronRight, Clock, Rocket } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"

export default async function DailyLearnPage() {
  const lang = await getLang()
  const t = makeT(lang)
  let name = "Nin", streak = 0, lessonsToday = 0, xpToday = 0
  let streakLastDate: string | null = null
  const doneByCourse: Record<string, number> = {}
  // Day boundary = Bangkok midnight, same as the lessons_today tracking in the DB.
  const today = bangkokTodayISO()

  // getCourses/getProfile/getSystemSettings are request-memoized — shared with the layout's fetches.
  const [courses, profile, supabase, settings, careerPaths] = await Promise.all([getPublishedCourses(lang), getProfile(), createClient(), getSystemSettings(), getCareerPaths(lang)])
  // Daily grid: published courses that opted into the daily view. Media tracks
  // (Suno/Runway/Midjourney) are show_in_daily=false → reached via career paths.
  const published = courses.filter((c) => c.status === "published" && c.showInDaily)
  // Daily lesson goal follows the admin-configured Free quota (no hardcoded 3).
  const goalLessons = Math.max(1, settings.freeLessonsPerDay)

  if (profile) {
    const [{ data: g }, { data: progress }] = await Promise.all([
      supabase.from("game_state").select("streak_current, streak_last_date, lessons_today, lessons_today_date, xp_today, xp_today_date").eq("user_id", profile.id).maybeSingle(),
      supabase.from("course_progress").select("course_id, lessons_done").eq("user_id", profile.id),
    ])
    name = profile.displayName
    streak = g?.streak_current ?? 0
    streakLastDate = g?.streak_last_date ?? null
    lessonsToday = g?.lessons_today_date === today ? (g?.lessons_today ?? 0) : 0
    xpToday = g?.xp_today_date === today ? (g?.xp_today ?? 0) : 0
    for (const row of (progress ?? []) as Array<{ course_id: string; lessons_done: number }>) {
      doneByCourse[row.course_id] = row.lessons_done
    }
  }

  // Career paths the user has started but not finished — powers the
  // "pick up where you left off" section. A step is done when the user's
  // progress in its course covers that lesson number.
  const TONE_BG: Record<string, string> = {
    violet: "var(--hero-100)", mint: "var(--mint-100)", pink: "var(--pink-100)",
    sky: "var(--sky-100)", sun: "var(--sun-100)", blue: "var(--sky-100)",
  }
  const TONE_FG: Record<string, string> = {
    violet: "var(--hero-600)", mint: "var(--mint-600)", pink: "var(--pink-500)",
    sky: "var(--sky-500)", sun: "var(--sun-700)", blue: "var(--sky-500)",
  }
  const pathsInProgress = careerPaths
    .map((cp) => {
      const total = cp.modules.reduce((n, m) => n + m.steps.length, 0)
      // Independent track: paths only progress when learned FROM the path.
      const done = Math.min(doneByCourse[`path:${cp.slug}`] ?? 0, total)
      return { slug: cp.slug, title: cp.title, tone: cp.tone, done, total }
    })
    .filter((cp) => cp.total > 0 && cp.done > 0 && cp.done < cp.total)
    .slice(0, 4)

  const goalPct = Math.min(100, Math.round((lessonsToday / goalLessons) * 100))
  const hoursLeft = bangkokHoursLeftToday()
  // Daily XP target = the XP of a full quota day (admin-configured values).
  const xpGoalToday = Math.max(1, settings.xpPerLesson) * goalLessons
  const xpPct = Math.min(100, Math.round((xpToday / xpGoalToday) * 100))

  const TOPICS = published.map((c) => {
    const colors = getToolColors(c.tool)
    const done = Math.min(doneByCourse[c.slug || c.id] ?? 0, c.lessons)
    const total = c.lessons
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    const levelKey = c.level === "beginner" ? "Beginner" : c.level === "intermediate" ? "Intermediate" : "Advanced"
    return {
      id: c.slug || c.id, tool: c.tool, fallback: colors.fallback, bg: colors.bg, title: c.title,
      dot: colors.dot, level: t(levelKey), desc: c.description, pro: c.isPro,
      n: `${done} / ${total} ${t("lessons")}`, pct,
      soft: colors.soft, sh: colors.sh, blob: colors.blob, bar: colors.bar, bar2: colors.bar2,
    }
  })

  const firstTopic = TOPICS.find((tp) => tp.pct > 0 && tp.pct < 100) ?? TOPICS[0]

  const DAYS = lang === "th" ? ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"] : ["M", "T", "W", "T", "F", "S", "S"]
  // Weekday of the Bangkok calendar date (not the server's timezone), Mon = 0.
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay()
  const todayIdx = dow === 0 ? 6 : dow - 1
  // The week strip lights the days covered by the current streak run. There is
  // no per-day history table — streak_current + streak_last_date is exactly
  // what the DB knows: an unbroken run ending on streak_last_date.
  const yesterday = new Date(new Date(`${today}T00:00:00Z`).getTime() - 86400000).toISOString().split("T")[0]
  const learnedToday = lessonsToday > 0 || streakLastDate === today
  // How many days BEFORE today are part of the active streak run. A run that
  // ended before yesterday is broken, so no past day lights up.
  const daysBack = streakLastDate === today ? streak - 1 : streakLastDate === yesterday ? streak : 0
  const WEEK = DAYS.map((d, i) => ({
    d,
    on: i === todayIdx ? learnedToday : i < todayIdx && todayIdx - i <= daysBack,
    today: i === todayIdx,
  }))

  return (
    <>
      {/* daily goal hero */}
      <div className="goal-card goal-hero">
        <span className="gh-spark s1">✦</span>
        <span className="gh-spark s2">✦</span>
        <span className="gh-spark s3">✦</span>
        <Image className="gc-mascot" src={`${M}/mascot-thumbsup.png`} alt="Riri" width={184} height={184} />
        <div className="gc-mid">
          <span className="eyebrow"><Flame size={14} /> {t("Today's goal · {n}-day streak", { n: streak })}</span>
          <h1 className="display">
            {t("Hi {name}!", { name })} <span className="grad-text">{t("Learn 15 minutes a day")}</span>
          </h1>
          <p>
            {lessonsToday > 0
              ? <>{t("You've completed")} <b>{lessonsToday} {t("lessons")}</b> {t("today. Keep it up!")}</>
              : t("Start your first lesson to hit today's goal.")}
          </p>
        </div>
        <div className="gc-cta">
          <div className="goal-ring" style={{ ["--p" as string]: goalPct }}>
            <span className="gr-in"><b>{Math.min(lessonsToday, goalLessons)}</b><span>/ {goalLessons} {t("lessons")}</span></span>
          </div>
          {firstTopic && (
            <Link className="btn btn--violet md" href={`/daily-learn/${firstTopic.id}`}>
              {t("Continue")} <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* continue: career paths in progress */}
      {pathsInProgress.length > 0 && (
        <>
          <div className="lrn-head">
            <h2>{t("Pick up where you left off")}</h2>
            <span>{t("Your career paths in progress")}</span>
          </div>
          <div className="cont-grid">
            {pathsInProgress.map((cp) => {
              const pct = Math.round((cp.done / cp.total) * 100)
              return (
                <Link key={cp.slug} className="cont-card" href={`/paths/${cp.slug}`}>
                  <span className="cc-ic" style={{ background: TONE_BG[cp.tone] ?? "var(--hero-100)", color: TONE_FG[cp.tone] ?? "var(--hero-600)" }}>
                    <Rocket size={20} />
                  </span>
                  <span className="cc-mid">
                    <b>{cp.title}</b>
                    <span className="pbar"><i style={{ width: `${pct}%` }} /></span>
                    <small>{cp.done} / {cp.total} {t("lessons")} · {pct}%</small>
                  </span>
                  <span className="cc-go">{t("Continue")} <ChevronRight size={15} /></span>
                </Link>
              )
            })}
          </div>
        </>
      )}

      {/* topic picker */}
      <div className="lrn-head">
        <h2>{t("Pick a topic to learn")}</h2>
        <span>{t("Each lesson is short — finish in 15 minutes")}</span>
      </div>
      {/* 2 rows per page; pagination handled client-side in TopicsGrid */}
      <TopicsGrid topics={TOPICS} lang={lang} />

      {/* quests + streak */}
      <div className="dash-grid">
        <div className="lrn-panel">
          <div className="card-h">
            <h3 className="display">{t("Daily quests")}</h3>
            <span className="more" style={{ cursor: "default" }}><Clock size={14} /> {t("{n}h left", { n: hoursLeft })}</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--sun-100)", color: "var(--sun-700)" }}><Zap size={21} /></span>
            <div className="qb"><b>{t("Earn {n} XP", { n: xpGoalToday })}</b><div className="pbar"><i style={{ width: `${xpPct}%` }} /></div></div>
            <span className="qx">{Math.min(xpToday, xpGoalToday)}/{xpGoalToday}</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}><CheckCircle2 size={21} /></span>
            <div className="qb">
              <b>{t("Finish {n} lessons", { n: goalLessons })}</b>
              <div className="pbar"><i style={{ width: `${goalPct}%` }} /></div>
            </div>
            <span className="qx">{Math.min(lessonsToday, goalLessons)}/{goalLessons}</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--pink-100)", color: "var(--pink-500)" }}><Target size={21} /></span>
            <div className="qb"><b>{t("Score 100% on a quiz")}</b><div className="pbar"><i style={{ width: "0%" }} /></div></div>
            <span className="qx">0/1</span>
          </div>
        </div>

        <div className="lrn-panel">
          <div className="card-h">
            <h3 className="display">{t("This week")}</h3>
            <span className="more" style={{ cursor: "default", color: "var(--punch-600)" }}>
              <Flame size={14} /> {t("{n}-day streak", { n: streak })}
            </span>
          </div>
          <div className="streak-week">
            {WEEK.map((s, i) => (
              <div key={i} className={`sday${s.on ? " on" : ""}${s.today ? " today" : ""}`}>
                {/* today is always the bolt (sun-yellow once lit); past streak days are flames */}
                <div className="dot">{s.today ? <Zap size={17} /> : s.on ? <Flame size={17} /> : null}</div>
                <small>{s.d}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
