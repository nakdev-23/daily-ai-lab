import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { isDevMock, MOCK_GAME_STATE } from "@/lib/mock-user"
import { getLang, makeT } from "@/lib/i18n"
import { getCourse } from "@/lib/courses"
import { getCourseContent, type CLesson } from "@/lib/course-content"
import { getToolColors } from "@/lib/tool-colors"
import ToolLogo from "@/components/tool-logo"
import QuestMap, { type Level } from "./_questmap"
import {
  Zap, ChevronRight, BookOpen, Clock, Sparkles, Check, CheckCircle2,
  StickyNote, Compass, CalendarDays, Trophy,
} from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"
const XPS = [100, 100, 120, 120, 150, 150, 160, 180, 200, 300]

function buildLevels(lessons: CLesson[], done: number): Level[] {
  return lessons.map((lesson, i) => {
    const last = i === lessons.length - 1
    let status: Level["status"]
    if (i < done) status = "done"
    else if (i === done) status = last ? "treasure" : "current"
    else status = last ? "treasure" : "locked"
    return { n: i + 1, title: lesson.title, xp: lesson.xp || XPS[i] || 120, status }
  })
}

export default async function TopicRoadmapPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const t = makeT(await getLang())

  const course = await getCourse(topic)
  if (!course) redirect("/daily-learn")

  const units = await getCourseContent(topic)
  const flatLessons = units.flatMap((u) => u.lessons)

  const totalLessons = flatLessons.length || course.lessons || 10
  const xpGoal = flatLessons.reduce((s, l) => s + (l.xp || 120), 0) || totalLessons * 120

  let done = 0
  let xpEarned = 0

  if (isDevMock()) {
    done = Math.min(3, totalLessons)
    xpEarned = MOCK_GAME_STATE.xp
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const [{ count }, { data: g }] = await Promise.all([
        supabase.from("user_progress")
          .select("lesson_id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("completed", true)
          .ilike("lesson_id", `${course.tool.toLowerCase()}%`),
        supabase.from("game_state").select("xp").eq("user_id", user.id).single(),
      ])
      done = count ?? 0
      xpEarned = g?.xp ?? 0
    }
  }

  const colors = getToolColors(course.tool)
  const levelKey = course.level === "beginner" ? t("Beginner") : course.level === "intermediate" ? t("Intermediate") : t("Advanced")
  const hoursStr = `${Math.ceil(totalLessons * 12 / 60)} ${t("hr")}`
  const pct = Math.min(100, totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0)

  const placeholderLessons: CLesson[] = Array.from({ length: totalLessons }, (_, i) => ({
    id: `ph-${i}`, unit_id: "", title: `${t("Lesson")} ${i + 1}`, xp: XPS[i] ?? 120, order_index: i, kind: "lesson" as const,
  }))
  const levels = buildLevels(flatLessons.length > 0 ? flatLessons : placeholderLessons, done)

  const current = levels.find((l) => l.status === "current") ?? levels.find((l) => l.status === "treasure")
  const firstLesson = `/daily-learn/${topic}/${current?.n ?? 1}`

  return (
    <>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>
        <Link href="/daily-learn" style={{ color: "var(--hero-600)" }}>{t("Daily Learn")}</Link>{" "}
        <span style={{ opacity: .5 }}>›</span>{" "}
        <span style={{ color: "var(--text-strong)" }}>{course.title}</span>
      </div>

      <div className="lmap-wrap">
        <div className="lmap-main">
          <div className="cbanner">
            <div className="cb-tile" style={{ background: colors.bg }}><ToolLogo name={course.tool} fallback={colors.fallback} size={36} /></div>
            <div className="cb-mid">
              <div className="cb-row"><h1>{course.title}</h1><span className="cb-tag">{t("Level")} {levelKey}</span></div>
              <p>{course.description}</p>
              <div className="cb-chips">
                <span className="cb-chip"><BookOpen size={13} /> {totalLessons} {t("lessons")}</span>
                <span className="cb-chip"><Clock size={13} /> {hoursStr}</span>
                <span className="cb-chip"><Sparkles size={13} /> {t("Great for beginners")}</span>
              </div>
            </div>
            <div className="cb-side">
              <div className="cb-pct"><span>{t("Progress")}</span><b>{pct}%</b></div>
              <div className="cb-bar"><i style={{ width: `${pct}%` }} /></div>
              <div className="cb-xp"><Zap size={12} style={{ verticalAlign: "-1px" }} /> {t("Total XP")} <b>{xpEarned.toLocaleString()}</b> / {xpGoal.toLocaleString()}</div>
              <div className="cb-medals"><span>🏅</span><span>🥇</span><span>🔥</span></div>
            </div>
          </div>

          <QuestMap levels={levels} topic={topic} mascot={`${M}/mascot-point.png`} />
        </div>

        <aside className="lmap-aside">
          <div className="rail-card">
            <p className="rc-h"><CalendarDays size={17} className="text-violet-500" /> {t("Daily quests")} <span className="rc-meta"><Clock size={12} /> 11:45</span></p>
            <div className="quest">
              <span className="qic" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}><CheckCircle2 size={20} /></span>
              <div className="qb"><b>{t("Finish 1 lesson")}</b><div className="pbar"><i style={{ width: "100%" }} /></div></div>
              <span className="qx">+30 XP</span>
            </div>
            <div className="quest">
              <span className="qic" style={{ background: "var(--sun-100)", color: "var(--sun-700)" }}><Zap size={20} /></span>
              <div className="qb"><b>{t("Use {tool} 3 times", { tool: course.tool })}</b><div className="pbar"><i style={{ width: "33%" }} /></div></div>
              <span className="qx">1/3</span>
            </div>
            <div className="quest">
              <span className="qic" style={{ background: "var(--sky-100)", color: "var(--sky-500)" }}><StickyNote size={20} /></span>
              <div className="qb"><b>{t("Save 1 note")}</b><div className="pbar"><i style={{ width: "0%" }} /></div></div>
              <span className="qx">+20 XP</span>
            </div>
          </div>

          <div className="rail-card">
            <p className="rc-h"><Compass size={17} className="text-violet-500" /> {t("About this path")}</p>
            <div className="pinfo-row"><span className="pl">{t("Difficulty")}</span><span className="pv">{levelKey}</span></div>
            <div className="pinfo-row"><span className="pl">{t("Estimated time")}</span><span className="pv">{hoursStr}</span></div>
            <div className="pinfo-row"><span className="pl">{t("Best for")}</span><span className="pv">{t("Newcomers")}</span></div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--text-strong)", margin: "14px 0 8px" }}>{t("What you'll learn")}</p>
            <ul className="learn-list">
              <li><Check size={15} /> {t("How {tool} works under the hood", { tool: course.tool })}</li>
              <li><Check size={15} /> {t("Write prompts that get great results")}</li>
              <li><Check size={15} /> {t("Apply it to real everyday work")}</li>
              <li><Check size={15} /> {t("Work faster and smarter")}</li>
            </ul>
          </div>

          <div className="rail-mascot">
            <Image src={`${M}/mascot-thumbsup.png`} alt="Riri" width={66} height={66} unoptimized />
            <div><b>{t("Learn together, level up daily!")}</b><span>{t("Riri is here to cheer you through every lesson.")}</span></div>
          </div>
        </aside>
      </div>

      <div className="map-cta">
        <div className="mc-tx">
          <b>{t("Start lesson {n} · {title}", { n: current?.n ?? 1, title: current?.title ?? levels[0]?.title ?? "" })}</b>
          <span>{t("About 12 minutes")}</span>
        </div>
        <Link className="btn btn--sun lg" href={firstLesson}>{t("Start now")} <ChevronRight size={18} /></Link>
      </div>

      <div className="cert-card glass" style={{ maxWidth: "none" }}>
        <Image src={`${M}/mascot-celebrate.png`} alt="Riri" width={84} height={84} unoptimized />
        <div style={{ flex: 1 }}>
          <h3 className="display"><Trophy size={20} className="text-amber-500" style={{ verticalAlign: "-3px" }} /> {t("Finish to earn the {tool} Master badge", { tool: course.tool })}</h3>
          <p>{t("Complete every lesson to earn a profile badge and unlock the next topic.")}</p>
        </div>
        <Link className="btn btn--violet md" href={firstLesson}>{t("Continue")} <ChevronRight size={16} /></Link>
      </div>
    </>
  )
}
