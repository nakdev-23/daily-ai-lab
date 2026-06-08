import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { isDevMock, MOCK_PROFILE, MOCK_GAME_STATE } from "@/lib/mock-user"
import { getLang, makeT } from "@/lib/i18n"
import ToolLogo from "@/components/tool-logo"
import { Flame, Zap, CheckCircle2, Target, ChevronRight, Clock } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"

export default async function DailyLearnPage() {
  const lang = await getLang()
  const t = makeT(lang)
  let name = "Nin", streak = 12

  if (isDevMock()) {
    name = MOCK_PROFILE.display_name ?? "Nin"
    streak = MOCK_GAME_STATE.streak_current
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const [{ data: p }, { data: g }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).single(),
        supabase.from("game_state").select("streak_current").eq("user_id", user.id).single(),
      ])
      name = p?.display_name ?? "Nin"
      streak = g?.streak_current ?? 0
    }
  }

  const TOPICS = [
    { id: "chatgpt-basics", tool: "ChatGPT", fallback: "G", bg: "linear-gradient(160deg,#23D08A,#0E8F5E)", title: t("ChatGPT Basics"), dot: "var(--mint-500)", level: t("Beginner"), desc: t("Meet ChatGPT and write your first prompt"), n: t("12 / 20 lessons"), pct: 60, soft: "#E6F8EF", sh: "rgba(20,168,113,.4)", blob: "rgba(20,168,113,.18)", bar: "linear-gradient(90deg,#23D08A,#0E8F5E)", bar2: "#0E8F5E" },
    { id: "pro-prompting", tool: "Prompt", fallback: "P", bg: "linear-gradient(160deg,#BC83FF,#6C3CF5)", title: t("Pro Prompting"), dot: "var(--amber-500)", level: t("Intermediate"), desc: t("Prompt techniques that get on-point answers every time"), n: t("7 / 18 lessons"), pct: 38, soft: "#F0E9FE", sh: "rgba(108,60,245,.4)", blob: "rgba(108,60,245,.18)", bar: "linear-gradient(90deg,#BC83FF,#6C3CF5)", bar2: "#6C3CF5" },
    { id: "claude-docs", tool: "Claude", fallback: "C", bg: "linear-gradient(160deg,#FFA866,#E2611C)", title: t("Claude for Documents"), dot: "var(--mint-500)", level: t("Beginner"), desc: t("Summarise, analyse and write long documents with Claude"), n: t("2 / 16 lessons"), pct: 12, soft: "#FFF0E4", sh: "rgba(226,97,28,.4)", blob: "rgba(226,97,28,.16)", bar: "linear-gradient(90deg,#FFA866,#E2611C)", bar2: "#E2611C" },
    { id: "gemini-research", tool: "Gemini", fallback: "G", bg: "linear-gradient(160deg,#5B8CFF,#2A6FF0)", title: t("Gemini & Research"), dot: "var(--amber-500)", level: t("Intermediate"), desc: t("Research, summarise and work alongside Google"), n: t("0 / 14 lessons"), pct: 0, soft: "#E7F0FF", sh: "rgba(42,111,240,.38)", blob: "rgba(42,111,240,.16)", bar: "linear-gradient(90deg,#5B8CFF,#2A6FF0)", bar2: "#2A6FF0" },
    { id: "midjourney-images", tool: "Midjourney", fallback: "M", bg: "linear-gradient(160deg,#FF93BE,#F45C97)", title: t("Midjourney Images"), dot: "var(--berry-500)", level: t("Advanced"), desc: t("Turn words into beautiful images with prompt craft"), n: t("0 / 16 lessons"), pct: 0, soft: "#FFE9F2", sh: "rgba(244,92,151,.38)", blob: "rgba(244,92,151,.16)", bar: "linear-gradient(90deg,#FF93BE,#F45C97)", bar2: "#F45C97" },
    { id: "ai-for-work", tool: "AI Work", fallback: "W", bg: "linear-gradient(160deg,#875EF6,#5728E0)", title: t("AI for Work"), dot: "var(--mint-500)", level: t("Beginner"), desc: t("Use AI for office work, email and meetings"), n: t("0 / 12 lessons"), pct: 0, soft: "#EEE9FE", sh: "rgba(87,40,224,.4)", blob: "rgba(87,40,224,.16)", bar: "linear-gradient(90deg,#875EF6,#5728E0)", bar2: "#5728E0" },
  ]

  const DAYS = lang === "th" ? ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"] : ["M", "T", "W", "T", "F", "S", "S"]
  const WEEK = [
    { d: DAYS[0], on: true }, { d: DAYS[1], on: true }, { d: DAYS[2], on: true }, { d: DAYS[3], on: true },
    { d: DAYS[4], today: true }, { d: DAYS[5] }, { d: DAYS[6] },
  ]

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
          <h1 className="display">{t("Hi {name}!", { name })} <span className="grad-text">{t("Learn 15 minutes a day")}</span></h1>
          <p>{t("You've studied ")}<b>{t("10 min")}</b>{t(" today — just 5 more to hit your goal. Nice work!")}</p>
        </div>
        <div className="gc-cta">
          <div className="goal-ring" style={{ ["--p" as string]: 67 }}><span className="gr-in"><b>10</b><span>{t("/ 15 min")}</span></span></div>
          <Link className="btn btn--violet md" href="/daily-learn/chatgpt-basics">{t("Continue")} <ChevronRight size={16} /></Link>
        </div>
      </div>

      {/* topic picker */}
      <div className="lrn-head">
        <h2>{t("Pick a topic to learn")}</h2>
        <span>{t("Each lesson is short — finish in 15 minutes")}</span>
      </div>
      <div className="lrn-grid">
        {TOPICS.map((tp) => (
          <Link
            key={tp.id}
            className="lrn-card"
            href={`/daily-learn/${tp.id}`}
            style={{ ["--c-soft" as string]: tp.soft, ["--c-sh" as string]: tp.sh, ["--c-blob" as string]: tp.blob, ["--c-bar" as string]: tp.bar, ["--c-bar2" as string]: tp.bar2 }}
          >
            <span className="blob" />
            <span className="go-arrow"><ChevronRight size={18} /></span>
            <div className="lc-top">
              <div className="lc-tile" style={{ background: tp.bg }}><ToolLogo name={tp.tool} fallback={tp.fallback} size={24} /></div>
              <div className="lc-tt"><h3>{tp.title}</h3><div className="lc-lvl"><span className="d" style={{ background: tp.dot }} />{tp.level}</div></div>
            </div>
            <p className="lc-desc">{tp.desc}</p>
            <div className="lc-foot"><span className="lc-time"><Clock size={13} /> {t("15 min/day")}</span><span className="lc-prog">{tp.n}</span></div>
            <div className="lrn-bar"><i style={{ width: `${tp.pct}%` }} /></div>
          </Link>
        ))}
      </div>

      {/* quests + streak */}
      <div className="dash-grid">
        <div className="lrn-panel">
          <div className="card-h"><h3 className="display">{t("Daily quests")}</h3><span className="more" style={{ cursor: "default" }}><Clock size={14} /> {t("14h left")}</span></div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--sun-100)", color: "var(--sun-700)" }}><Zap size={21} /></span>
            <div className="qb"><b>{t("Earn 30 XP")}</b><div className="pbar"><i style={{ width: "50%" }} /></div></div>
            <span className="qx">15/30</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}><CheckCircle2 size={21} /></span>
            <div className="qb"><b>{t("Finish 2 lessons")}</b><div className="pbar"><i style={{ width: "50%" }} /></div></div>
            <span className="qx">1/2</span>
          </div>
          <div className="quest">
            <span className="qic" style={{ background: "var(--pink-100)", color: "var(--pink-500)" }}><Target size={21} /></span>
            <div className="qb"><b>{t("Score 100% on a quiz")}</b><div className="pbar"><i style={{ width: "0%" }} /></div></div>
            <span className="qx">0/1</span>
          </div>
        </div>

        <div className="lrn-panel">
          <div className="card-h"><h3 className="display">{t("This week")}</h3><span className="more" style={{ cursor: "default", color: "var(--punch-600)" }}><Flame size={14} /> {t("{n}-day streak", { n: streak })}</span></div>
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
