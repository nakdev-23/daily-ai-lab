import Link from "next/link"
import { getLessonsDone } from "@/lib/progress"
import { getLang, makeT } from "@/lib/i18n"
import { getPublishedCourses } from "@/lib/courses"
import { getPublishedCourseContent } from "@/lib/course-content"
import { getSystemSettings } from "@/lib/system-settings"
import { getToolColors } from "@/lib/tool-colors"
import ToolLogo from "@/components/tool-logo"
import { MessageSquare, CheckCircle2, BookOpen, Check, Zap, Lock, ChevronRight } from "lucide-react"

function toolSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default async function CoursePage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  const t = makeT(await getLang())

  const [courses, settings] = await Promise.all([getPublishedCourses(), getSystemSettings()])
  const course = courses.find((c) => toolSlug(c.tool) === tool)
    ?? courses.find((c) => c.tool.toLowerCase() === tool)
    ?? courses.find((c) => c.status === "published")

  if (!course) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
        {t("Course not found.")}
      </div>
    )
  }

  const colors = getToolColors(course.tool)

  // Progress is keyed by slug (course_progress.course_id)
  const progressKey = course.slug || course.id
  const [units, doneCount] = await Promise.all([
    getPublishedCourseContent(course.id),
    getLessonsDone(progressKey),
  ])

  const firstUnit = units[0]
  const firstLesson = firstUnit?.lessons[0]
  const startHref = firstLesson
    ? `/daily-learn/${progressKey}/1`
    : `/daily-learn/${progressKey}`

  const levelKey = course.level === "beginner" ? t("Beginner") : course.level === "intermediate" ? t("Intermediate") : t("Advanced")

  const LEARN = [
    t("Write clear prompts that get great answers every time"),
    t("Give {tool} roles, context & constraints", { tool: course.tool }),
    t("Summarise, rewrite & translate any text"),
    t("Build reusable prompt templates for work"),
    t("Brainstorm ideas & plans 10× faster"),
    t("Avoid common mistakes & AI hallucinations"),
  ]

  let lessonIdx = 0
  const UNITS = units.map((u) => {
    const rows = u.lessons.map((l) => {
      const globalIdx = lessonIdx++
      const status = globalIdx < doneCount ? "done" : globalIdx === doneCount ? "cur" : "lock"
      const xLabel = status === "done" ? `+${l.xp} XP` : status === "cur" ? t("Continue") : t("Locked")
      return { s: status, t: l.title, x: xLabel, n: globalIdx + 1 }
    })
    const doneLessons = rows.filter((r) => r.s === "done").length
    const meta = doneLessons === rows.length ? `${rows.length} ${t("lessons")} · ${t("done")}` : `${rows.length} ${t("lessons")}`
    return { n: u.order_index, id: u.id, title: u.title, meta, rows }
  })

  const totalUnits = course.units || units.length
  const totalLessons = course.lessons || units.flatMap(u => u.lessons).length

  return (
    <>
      <section className="wrap">
        <div style={{ paddingTop: 12, fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)" }}>
          <Link href="/docs" style={{ color: "var(--hero-600)" }}>{t("Docs")}</Link>{" "}
          <span style={{ opacity: .5 }}>›</span>{" "}
          <span style={{ color: "var(--text-strong)" }}>{course.tool}</span>
        </div>
        <div className="course-top">
          <div>
            <div className="tile" style={{ background: colors.bg }}><ToolLogo name={course.tool} fallback={colors.fallback} size={36} /></div>
            <span className="eyebrow"><MessageSquare size={15} /> {course.tool} · {levelKey}</span>
            <h1 className="display" style={{ marginTop: 10 }}>{course.title}</h1>
            <p>{course.description}</p>
            <div className="course-meta">
              <div className="m"><b>{totalLessons}</b><span>{t("lessons")}</span></div>
              <div className="m"><b>{totalUnits}</b><span>{t("units")}</span></div>
              <div className="m"><b>4.9★</b><span>{t("rating")}</span></div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link className="btn btn--violet lg" href={startHref}>
                {doneCount > 0 ? t("Continue") : t("Start learning")} <ChevronRight size={18} />
              </Link>
              <Link className="btn btn--ghost lg" href="/login">{t("Save for later")}</Link>
            </div>
          </div>
          <div className="course-card glass">
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--hero-700)" }}>฿0</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{t("to start")} · Pro ฿{settings.proPriceMonth.toLocaleString()}/{t("mo")}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{t("Taught with Riri · Thai & English · Certificate on completion")}</p>
          </div>
        </div>
      </section>

      <section className="block tinted" style={{ padding: "36px 24px" }}>
        <div className="wrap">
          <div className="head"><span className="eyebrow"><CheckCircle2 size={15} /> {t("What you'll learn")}</span><h2 className="display">{t("Skills you'll walk away with")}</h2></div>
          <div className="learn-grid">
            {LEARN.map((x) => (
              <div className="learn-item" key={x}><span className="ck"><Check size={13} /></span> {x}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="head">
            <span className="eyebrow"><BookOpen size={15} /> {t("Curriculum")}</span>
            <h2 className="display">{totalUnits} {t("units")} · {totalLessons} {t("bite-size lessons")}</h2>
          </div>
          <div className="curriculum">
            {UNITS.length === 0 && (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>{t("Content coming soon.")}</p>
            )}
            {UNITS.map((u) => (
              <div key={u.id} className="unit glass">
                <div className="unit-head"><span className="un">{u.n}</span><h3 className="display">{u.title}</h3><span className="meta">{u.meta}</span></div>
                {u.rows.map((r, i) => {
                  const inner = (
                    <>
                      <span className={`lic ${r.s}`}>{r.s === "done" ? <Check size={16} /> : r.s === "cur" ? <Zap size={16} /> : <Lock size={15} />}</span>
                      <span className="lt">{r.t}</span>
                      <span className="lx">{r.x === t("Continue") ? <>{r.x} <ChevronRight size={12} style={{ display: "inline", verticalAlign: "-1px" }} /></> : r.x}</span>
                    </>
                  )
                  // Locked lessons aren't navigable (sequential progress enforced server-side).
                  return r.s === "lock"
                    ? <span key={i} className="lrow" style={{ cursor: "not-allowed", opacity: .72 }}>{inner}</span>
                    : <Link key={i} className="lrow" href={`/daily-learn/${progressKey}/${r.n}`}>{inner}</Link>
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
