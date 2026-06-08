import Link from "next/link"
import { getLang, makeT } from "@/lib/i18n"
import ToolLogo from "@/components/tool-logo"
import { MessageSquare, CheckCircle2, BookOpen, Check, Zap, Lock, Play, ChevronRight } from "lucide-react"

const L = "/learn/chatgpt/beginner/01-x"

export default async function CoursePage() {
  const t = makeT(await getLang())

  const LEARN = [
    t("Write clear prompts that get great answers every time"),
    t("Give ChatGPT roles, context & constraints"),
    t("Summarise, rewrite & translate any text"),
    t("Build reusable prompt templates for work"),
    t("Brainstorm ideas & plans 10× faster"),
    t("Avoid common mistakes & AI hallucinations"),
  ]

  const UNITS = [
    { n: 1, title: t("ChatGPT Essentials"), meta: t("5 lessons · done"), rows: [
      { s: "done", t: t("What is ChatGPT?"), x: "+10 แต้ม" },
      { s: "done", t: t("Your first prompt"), x: "+10 แต้ม" },
      { s: "done", t: t("Give the AI a role"), x: "+15 แต้ม" },
      { s: "cur", t: t("Adding context & detail"), x: t("Continue") },
      { s: "lock", t: t("Quiz: Prompt basics"), x: t("Locked") },
    ] },
    { n: 2, title: t("Writing & Editing"), meta: t("8 lessons"), rows: [
      { s: "lock", t: t("Summarise long text"), x: t("Locked") },
      { s: "lock", t: t("Rewrite in any tone"), x: t("Locked") },
      { s: "lock", t: t("Translate & localise"), x: t("Locked") },
    ] },
  ]

  return (
    <>
      <section className="wrap">
        <div style={{ paddingTop: 12, fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)" }}>
          <Link href="/docs" style={{ color: "var(--hero-600)" }}>{t("Docs")}</Link> <span style={{ opacity: .5 }}>›</span> <span style={{ color: "var(--text-strong)" }}>ChatGPT</span>
        </div>
        <div className="course-top">
          <div>
            <div className="tile" style={{ background: "linear-gradient(160deg,#23D08A,#0E8F5E)" }}><ToolLogo name="ChatGPT" size={36} /></div>
            <span className="eyebrow"><MessageSquare size={15} /> {t("Chat & writing · Beginner")}</span>
            <h1 className="display" style={{ marginTop: 10 }}>{t("Master ChatGPT")}<br />{t("from zero to pro")}</h1>
            <p>{t("Learn to prompt like an expert — from your very first question to building powerful, repeatable workflows. The most popular track on Daily AI Lab.")}</p>
            <div className="course-meta">
              <div className="m"><b>64</b><span>{t("lessons")}</span></div>
              <div className="m"><b>8</b><span>{t("units")}</span></div>
              <div className="m"><b>~9{t("h")}</b><span>{t("total")}</span></div>
              <div className="m"><b>4.9★</b><span>{t("rating")}</span></div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link className="btn btn--violet lg" href={L}>{t("Start learning")} <ChevronRight size={18} /></Link>
              <Link className="btn btn--ghost lg" href="/login">{t("Save for later")}</Link>
            </div>
          </div>
          <div className="course-card glass">
            <div className="preview" style={{ background: "linear-gradient(150deg,#D9F7EA,#E7DCFF)" }}>
              <span className="play"><Play size={24} fill="currentColor" /></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--hero-700)" }}>฿0</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{t("to start · Pro ฿199/mo")}</span>
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
          <div className="head"><span className="eyebrow"><BookOpen size={15} /> {t("Curriculum")}</span><h2 className="display">{t("8 units · 64 bite-size lessons")}</h2></div>
          <div className="curriculum">
            {UNITS.map((u) => (
              <div key={u.n} className="unit glass">
                <div className="unit-head"><span className="un">{u.n}</span><h3 className="display">{u.title}</h3><span className="meta">{u.meta}</span></div>
                {u.rows.map((r, i) => (
                  <Link key={i} className="lrow" href={L}>
                    <span className={`lic ${r.s}`}>{r.s === "done" ? <Check size={16} /> : r.s === "cur" ? <Zap size={16} /> : <Lock size={15} />}</span>
                    <span className="lt">{r.t}</span>
                    <span className="lx">{r.x === t("Continue") ? <>{r.x} <ChevronRight size={12} style={{ display: "inline", verticalAlign: "-1px" }} /></> : r.x}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
