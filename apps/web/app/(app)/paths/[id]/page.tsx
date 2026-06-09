import Link from "next/link"
import Image from "next/image"
import { getLang, makeT } from "@/lib/i18n"
import { requirePro } from "@/lib/auth"
import ToolLogo from "@/components/tool-logo"
import { Brain, Zap, Check, Lock, Award, BookOpen, CheckCircle2, Flag, Wrench, ChevronRight } from "lucide-react"

const L = "/learn/chatgpt/beginner/01-x"

export default async function PathRoadmapPage() {
  // Career paths are a Pro feature — Free users are sent to the upgrade page.
  await requirePro()
  const t = makeT(await getLang())

  const kindIcon: Record<string, React.ReactNode> = {
    lesson: <BookOpen size={13} />, quiz: <CheckCircle2 size={13} />, check: <Flag size={13} />, project: <Wrench size={13} />,
  }
  const kindLabel: Record<string, string> = {
    lesson: t("Lesson"), quiz: t("Quiz"), check: t("Checkpoint"), project: t("Project"),
  }
  const CONTINUE = t("Continue")

  type Row = { state: "done" | "cur" | "lock"; title: string; kind: string; xp: string; start?: boolean }
  type Mod = { state: "done" | "cur" | "lock"; n: React.ReactNode; title: string; meta: string; tag: React.ReactNode; tagCls: string; rows?: Row[] }

  const MODULES: Mod[] = [
    { state: "done", n: <Check size={20} />, title: t("Module 1 · Prompt Basics"), meta: t("5 lessons · 75 XP"), tag: t("Done"), tagCls: "done", rows: [
      { state: "done", title: t("How AI understands language"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "done", title: t("Parts of a good prompt"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "done", title: t("Quiz: spot the bad prompt"), kind: "quiz", xp: "+15 แต้ม" },
      { state: "done", title: t("Giving the AI a role"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "done", title: t("Checkpoint: write your first prompt"), kind: "check", xp: "+30 แต้ม" },
    ] },
    { state: "cur", n: "2", title: t("Module 2 · Intermediate techniques"), meta: t("5 lessons · 80 XP · in progress"), tag: "2 / 5", tagCls: "cur", rows: [
      { state: "done", title: t("Few-shot: teach with examples"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "cur", title: t("Make the AI think step by step"), kind: "lesson", xp: CONTINUE, start: true },
      { state: "lock", title: t("Quiz: pick the right technique"), kind: "quiz", xp: "+15 แต้ม" },
      { state: "lock", title: t("Control tone & length"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "lock", title: t("Project: build a prompt template"), kind: "project", xp: "+35 แต้ม" },
    ] },
    { state: "lock", n: "3", title: t("Module 3 · Prompts for real work"), meta: t("6 lessons · 95 XP"), tag: <><Lock size={11} /> {t("Locked")}</>, tagCls: "lock", rows: [
      { state: "lock", title: t("Prompts for writing"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "lock", title: t("Prompts for data analysis"), kind: "lesson", xp: "+10 แต้ม" },
      { state: "lock", title: t("Big quiz: prompts at work"), kind: "quiz", xp: "+20 แต้ม" },
    ] },
    { state: "lock", n: "4", title: t("Module 4 · Advanced & system prompts"), meta: t("6 lessons · 110 XP"), tag: <><Lock size={11} /> {t("Locked")}</>, tagCls: "lock", rows: [
      { state: "lock", title: t("System prompts & persona"), kind: "lesson", xp: "+15 แต้ม" },
      { state: "lock", title: t("Chain multiple tools together"), kind: "lesson", xp: "+15 แต้ม" },
      { state: "lock", title: t("Project: your own AI assistant"), kind: "project", xp: "+40 แต้ม" },
    ] },
    { state: "lock", n: <Award size={20} />, title: t("Module 5 · Final exam & certificate"), meta: t("Final test · earn a certificate"), tag: <><Lock size={11} /> {t("Locked")}</>, tagCls: "lock" },
  ]

  return (
    <>
      <div className="wrap" style={{ paddingTop: 8, fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)" }}>
        <Link href="/paths" style={{ color: "var(--hero-600)" }}>{t("Career paths")}</Link> <span style={{ opacity: .5 }}>›</span> <span style={{ color: "var(--text-strong)" }}>Prompt Engineer</span>
      </div>

      <div className="course-head glass">
        <div className="ch-tile" style={{ background: "var(--sun-100)" }}><Brain size={34} /></div>
        <div>
          <span className="eyebrow">{t("Intermediate · lesson-based")}</span>
          <h1 className="display" style={{ marginTop: 8 }}>Prompt Engineer</h1>
          <div className="ch-tools">
            {[["#19C37D", "ChatGPT"], ["#FF9A52", "Claude"], ["#2A6FF0", "Gemini"]].map(([bg, n]) => (
              <span className="ptool" key={n}><span className="sw" style={{ background: bg }}><ToolLogo name={n} size={12} /></span> {n}</span>
            ))}
          </div>
          <div className="ch-prog"><span className="pl">35%</span><div className="pbar"><i style={{ width: "35%" }} /></div><span className="pl">{t("25 / 72 lessons")}</span></div>
        </div>
        <div className="ch-cta">
          <Link className="btn btn--violet lg" href={L}>{t("Continue")} <ChevronRight size={18} /></Link>
          <span className="xp"><Zap size={13} /> {t("Earned 1,240 XP")}</span>
        </div>
      </div>

      <div className="wrap" style={{ maxWidth: 836, marginBottom: 24 }}>
        <div className="callout note" style={{ margin: 0 }}>
          <span className="ci"><BookOpen size={20} /></span>
          <span className="cc"><b>{t("Learn lesson by lesson")}</b> {t("No long videos — each lesson is short, mixed with quizzes you try yourself. Earn XP and unlock the next, like a game.")}</span>
        </div>
      </div>

      <section className="block" style={{ padding: "0 0 60px" }}>
        <div className="roadmap">
          {MODULES.map((m, mi) => (
            <div key={mi} className={`module glass${m.state === "lock" ? " locked" : ""}`}>
              <div className="mod-head">
                <span className={`mn ${m.state}`}>{m.n}</span>
                <div className="mh"><h3 className="display">{m.title}</h3><div className="mmeta">{m.meta}</div></div>
                <span className={`mtag ${m.tagCls}`}>{m.tag}</span>
              </div>
              {m.rows && (
                <div className="mod-body">
                  <div className="lesson-track">
                    {m.rows.map((r, ri) => {
                      const inner = (
                        <>
                          <span className={`lnode ${r.state}`}>{r.state === "done" ? <Check size={17} /> : r.state === "cur" ? <Zap size={17} /> : <Lock size={16} />}</span>
                          <div className="li"><b>{r.title}{r.start && <span className="lpill">{t("Start here")}</span>}</b><span>{kindIcon[r.kind]} {kindLabel[r.kind]}</span></div>
                          <span className="lx">{r.xp === CONTINUE ? <>{r.xp} <ChevronRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} /></> : r.xp}</span>
                        </>
                      )
                      return r.state === "lock"
                        ? <span key={ri} className="lrow lock">{inner}</span>
                        : <Link key={ri} className={`lrow${r.state === "cur" ? " cur" : ""}`} href={L}>{inner}</Link>
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="cert-card glass">
          <Image src="/assets/daily-ai-lab/mascot-ds/mascot-celebrate.png" alt="Riri" width={84} height={84} />
          <div>
            <h3 className="display">{t("Finish to earn a certificate")}</h3>
            <p>{t("Complete every module to earn a Prompt Engineer certificate for your portfolio or LinkedIn.")}</p>
          </div>
        </div>
      </section>
    </>
  )
}
