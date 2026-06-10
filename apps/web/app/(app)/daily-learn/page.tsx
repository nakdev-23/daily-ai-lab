import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { getLang, makeT } from "@/lib/i18n"
import { getCourses } from "@/lib/courses"
import { getToolColors } from "@/lib/tool-colors"
import ToolLogo from "@/components/tool-logo"
import { Flame, Zap, CheckCircle2, Target, ChevronRight, Clock } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"
const GOAL_LESSONS = 3

export default async function DailyLearnPage() {
  const lang = await getLang()
  const t = makeT(lang)
  let name = "Nin", streak = 0, lessonsToday = 0
  const doneByCourse: Record<string, number> = {}
  const today = new Date().toISOString().split("T")[0]

  const courses = await getCourses()
  const published = courses.filter((c) => c.status === "published")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const [{ data: p }, { data: g }, { data: progress }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", user.id).single(),
      supabase.from("game_state").select("streak_current, lessons_today, lessons_today_date").eq("user_id", user.id).maybeSingle(),
      supabase.from("course_progress").select("course_id, lessons_done").eq("user_id", user.id),
    ])
    name = p?.display_name ?? "Nin"
    streak = g?.streak_current ?? 0
    lessonsToday = g?.lessons_today_date === today ? (g?.lessons_today ?? 0) : 0
    for (const row of (progress ?? []) as Array<{ course_id: string; lessons_done: number }>) {
      doneByCourse[row.course_id] = row.lessons_done
    }
  }

  const goalPct = Math.min(100, Math.round((lessonsToday / GOAL_LESSONS) * 100))

  const TOPICS = published.map((c) => {
    const colors = getToolColors(c.tool)
    const done = Math.min(doneByCourse[c.slug || c.id] ?? 0, c.lessons)
    const total = c.lessons
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    const levelKey = c.level === "beginner" ? "Beginner" : c.level === "intermediate" ? "Intermediate" : "Advanced"
    return {
      id: c.slug || c.id, tool: c.tool, fallback: colors.fallback, bg: colors.bg, title: c.title,
      dot: colors.dot, level: t(levelKey), desc: c.description,
      n: `${done} / ${total} ${t("lessons")}`, pct,
      soft: colors.soft, sh: colors.sh, blob: colors.blob, bar: colors.bar, bar2: colors.bar2,
    }
  })

  const firstTopic = TOPICS.find((tp) => tp.pct > 0 && tp.pct < 100) ?? TOPICS[0]

  const DAYS = lang === "th" ? ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"] : ["M", "T", "W", "T", "F", "S", "S"]
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 })()
  const WEEK = DAYS.map((d, i) => ({ d, on: i < todayIdx && streak > todayIdx - i, today: i === todayIdx }))

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
            <span className="gr-in"><b>{lessonsToday}</b><span>/ {GOAL_LESSONS} {t("lessons")}</span></span>
          </div>
          {firstTopic && (
            <Link className="btn btn--violet md" href={`/daily-learn/${firstTopic.id}`}>
              {t("Continue")} <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* topic picker */}
      <div className="lrn-head">
        <h2>{t("Pick a topic to learn")}</h2>
        <span>{t("Each lesson is short — finish in 15 minutes")}</span>
      </div>
      <div className="lrn-grid">
        {TOPICS.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            {t("No courses available yet.")}
          </p>
        )}
        {TOPICS.map((tp) => (
          <Link
            key={tp.id}
            className="lrn-card"
            href={`/daily-learn/${tp.id}`}
            style={{
              ["--c-soft" as string]: tp.soft, ["--c-sh" as string]: tp.sh,
              ["--c-blob" as string]: tp.blob, ["--c-bar" as string]: tp.bar, ["--c-bar2" as string]: tp.bar2,
            }}
          >
            <span className="blob" />
            <span className="go-arrow"><ChevronRight size={18} /></span>
            <div className="lc-top">
              <div className="lc-tile" style={{ background: tp.bg }}>
                <ToolLogo name={tp.tool} fallback={tp.fallback} size={24} />
              </div>
              <div className="lc-tt">
                <h3>{tp.title}</h3>
                <div className="lc-lvl"><span className="d" style={{ background: tp.dot }} />{tp.level}</div>
              </div>
            </div>
            <p className="lc-desc">{tp.desc}</p>
            <div className="lc-foot">
              <span className="lc-time"><Clock size={13} /> {t("15 min/day")}</span>
              <span className="lc-prog">{tp.n}</span>
            </div>
            <div className="lrn-bar"><i style={{ width: `${tp.pct}%` }} /></div>
          </Link>
        ))}
      </div>

      {/* quests + streak */}
      <div className="dash-grid">
        <div className="lrn-panel">
          <div className="card-h">
            <h3 className="display">{t("Daily quests")}</h3>
            <span className="more" style={{ cursor: "default" }}><Clock size={14} /> {t("14h left")}</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--sun-100)", color: "var(--sun-700)" }}><Zap size={21} /></span>
            <div className="qb"><b>{t("Earn 30 XP")}</b><div className="pbar"><i style={{ width: "0%" }} /></div></div>
            <span className="qx">0/30</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}><CheckCircle2 size={21} /></span>
            <div className="qb">
              <b>{t("Finish {n} lessons", { n: GOAL_LESSONS })}</b>
              <div className="pbar"><i style={{ width: `${goalPct}%` }} /></div>
            </div>
            <span className="qx">{lessonsToday}/{GOAL_LESSONS}</span>
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
                <div className="dot">{s.on ? <Flame size={17} /> : s.today ? <Zap size={17} /> : null}</div>
                <small>{s.d}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
