import Link from "next/link"
import Image from "next/image"
import { getLang, makeT } from "@/lib/i18n"
import { getProfile, avatarUrlFor } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getPublishedCourses } from "@/lib/courses"
import { getToolColors } from "@/lib/tool-colors"
import ToolLogo from "@/components/tool-logo"
import { MapPin, Gem, Target, Settings, Flame, Zap, CheckCircle2, Award } from "lucide-react"

const B = "/assets/daily-ai-lab/badges"

type Badge = { img: string; name: string; sub: string; locked: boolean }

export default async function ProfilePage() {
  const t = makeT(await getLang())
  const profile = await getProfile()
  const supabase = await createClient()

  // Real game state + per-course progress (parallel)
  const [{ data: g }, { data: progressRows }, courses] = await Promise.all([
    supabase.from("game_state")
      .select("xp, level, streak_current, streak_longest")
      .eq("user_id", profile?.id ?? "")
      .maybeSingle(),
    supabase.from("course_progress")
      .select("course_id, lessons_done, updated_at")
      .eq("user_id", profile?.id ?? "")
      .order("updated_at", { ascending: false }),
    getPublishedCourses(),
  ])

  const avatarSrc = profile ? avatarUrlFor(profile) : null
  const xp = g?.xp ?? 0
  const streak = g?.streak_current ?? 0
  const streakBest = g?.streak_longest ?? 0
  // Level model matches the complete_lesson RPC: 500 XP per level.
  const level = Math.floor(xp / 500) + 1
  const xpFloor = (level - 1) * 500
  const xpCeil = level * 500
  const levelPct = Math.round(((xp - xpFloor) / (xpCeil - xpFloor)) * 100)

  const rows = progressRows ?? []
  const lessonsDone = rows.reduce((s, r) => s + (r.lessons_done ?? 0), 0)
  const coursesStarted = rows.filter((r) => (r.lessons_done ?? 0) > 0).length

  const name = profile?.displayName ?? "นักเรียน"
  const handle = "@" + (name.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z0-9ก-๙]/g, "") || "learner")

  // Badges derived from real signals (no fake "earned"). Anything we can't yet
  // measure (time-of-day, quiz score) stays locked until tracking exists.
  const BADGES: Badge[] = [
    { img: "first-step",     name: t("First Step"),    sub: t("Your first lesson done"), locked: lessonsDone < 1 },
    { img: "7-day-streak",   name: t("7 Day Streak"),  sub: t("7 days in a row"),        locked: streakBest < 7 },
    { img: "30-day-streak",  name: t("30 Day Streak"), sub: t("30 days in a row"),       locked: streakBest < 30 },
    { img: "xp-master",      name: t("XP Master"),     sub: t("Top XP collector"),       locked: xp < 2000 },
    { img: "ai-explorer",    name: t("AI Explorer"),   sub: t("Explored AI tools"),      locked: coursesStarted < 3 },
    { img: "prompt-pro",     name: t("Prompt Pro"),    sub: t("Great at prompting"),     locked: lessonsDone < 20 },
    { img: "quiz-whiz",      name: t("Quiz Whiz"),     sub: t("Quiz expert"),            locked: lessonsDone < 10 },
    { img: "perfect-score",  name: t("Perfect Score"), sub: t("100% quiz"),              locked: lessonsDone < 5 },
    { img: "early-bird",     name: t("Early Bird"),    sub: t("Study before 8am"),       locked: true },
    { img: "night-owl",      name: t("Night Owl"),     sub: t("Study late at night"),    locked: true },
    { img: "speed-learner",  name: t("Speed Learner"), sub: t("Blazing fast"),           locked: true },
    { img: "creator",        name: t("Creator"),       sub: t("Made something great"),   locked: true },
    { img: "problem-solver", name: t("Problem Solver"), sub: t("Solved hard problems"),  locked: true },
    { img: "helper",         name: t("Helper"),        sub: t("Helped others learn"),    locked: true },
    { img: "legend",         name: t("Legend"),        sub: t("The ultimate learner"),   locked: xp < 10000 },
  ]
  const badgesEarned = BADGES.filter((b) => !b.locked).length

  const STATS = [
    { icon: Flame, color: "text-orange-500", v: String(streak), l: t("Day streak") },
    { icon: Zap, color: "text-amber-500", v: xp.toLocaleString(), l: t("Total XP") },
    { icon: CheckCircle2, color: "text-emerald-500", v: String(lessonsDone), l: t("Lessons done") },
    { icon: Award, color: "text-violet-500", v: String(badgesEarned), l: t("Badges earned") },
  ]

  // In-progress courses: started but not finished, most recently touched first
  const courseBySlug = new Map(courses.map((c) => [c.slug || c.id, c]))
  const inProgress = rows
    .map((r) => ({ row: r, course: courseBySlug.get(r.course_id) }))
    .filter((x) => x.course && (x.row.lessons_done ?? 0) > 0 && (x.row.lessons_done ?? 0) < (x.course!.lessons || Infinity))
    .slice(0, 3)

  return (
    <>
      <div className="prof-hero">
        <div className="pf-av-wrap">
          <span className="pf-ring" />
          {avatarSrc
            ? <Image className="pf-av" src={avatarSrc} alt={name} width={96} height={96} unoptimized style={{ objectFit: "cover" }} />
            : <span className="pf-av">{name.charAt(0).toUpperCase()}</span>}
          <span className="pf-lvl"><Zap size={12} /> Lv {level}</span>
        </div>
        <div className="pf-mid">
          <h1 className="pf-name">{name}</h1>
          <div className="pf-chips">
            <span className="pf-chip handle">{handle}</span>
            <span className="pf-chip"><MapPin size={13} /> {t("Thailand")}</span>
            {profile?.plan === "pro" && <span className="pf-chip"><Gem size={13} className="text-sky-500" /> Pro</span>}
            <span className="pf-chip"><Target size={13} className="text-pink-500" /> {t("Level {n}", { n: level })}</span>
          </div>
          <div className="pf-xp">
            <div className="lbl"><span className="lv">{t("Level {n}", { n: level })}</span><span className="nx">{xp.toLocaleString()} / {xpCeil.toLocaleString()} XP</span></div>
            <div className="bar"><i style={{ width: `${Math.max(0, Math.min(100, levelPct))}%` }} /></div>
          </div>
        </div>
        <Link className="btn btn--ghost md prof-edit" href="/settings"><Settings size={16} /> {t("Edit profile")}</Link>
      </div>

      <div className="pf-stats">
        {STATS.map((s, i) => (
          <div key={s.l} className={`orb-stat ${["s-streak", "s-xp", "s-done", "s-badge"][i]}`}>
            <span className="o-ic"><s.icon size={23} className={s.color} /></span>
            <b>{s.v}</b><span>{s.l}</span>
          </div>
        ))}
      </div>

      {inProgress.length > 0 && (
        <div className="glass" style={{ padding: 22, marginBottom: 24 }}>
          <div className="card-h"><h3 className="display">{t("In progress")}</h3><Link className="more" href="/daily-learn">{t("See all")}</Link></div>
          {inProgress.map(({ row, course }) => {
            const c = course!
            const colors = getToolColors(c.tool)
            const done = row.lessons_done ?? 0
            const total = c.lessons || 1
            const pct = Math.min(100, Math.round((done / total) * 100))
            return (
              <Link key={c.id} className="cont glass" href={`/daily-learn/${c.slug || c.id}/${Math.min(done + 1, total)}`}>
                <div className="tile" style={{ background: colors.bg, width: 52, height: 52 }}><ToolLogo name={c.tool} fallback={colors.fallback} size={24} /></div>
                <div className="ci"><b>{c.title}</b><div className="pbar"><i style={{ width: `${pct}%` }} /></div></div>
                <span className="cn">{done} / {total}</span>
              </Link>
            )
          })}
        </div>
      )}

      <div className="glass" style={{ padding: 22 }}>
        <div className="card-h"><h3 className="display">{t("Badges & achievements")}</h3><span className="more" style={{ cursor: "default" }}>{badgesEarned} / {BADGES.length}</span></div>
        <div className="ach-grid">
          {BADGES.map((b) => (
            <div key={b.name} className={`ach${b.locked ? " locked" : ""}`}>
              <Image className="ach-img" src={`${B}/badge-${b.img}.png`} alt={b.name} width={76} height={76} />
              <b>{b.name}</b><span>{b.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
