import Link from "next/link"
import Image from "next/image"
import { getLang, makeT } from "@/lib/i18n"
import ToolLogo from "@/components/tool-logo"
import {
  Zap, ChevronRight, BookOpen, Clock, Sparkles, Check, CheckCircle2,
  StickyNote, Compass, CalendarDays, Trophy,
} from "lucide-react"
import QuestMap, { type Level } from "./_questmap"

const M = "/assets/daily-ai-lab/mascot-ds"

type TopicMeta = {
  title: string
  tool: string
  fallback: string
  tile: string
  level: string
  blurb: string
  lessons: number
  hours: string
  done: number
  total: number
  xpEarned: number
  xpGoal: number
  titles: string[]
}

const DEFAULT_TITLES = [
  "รู้จักกับเครื่องมือ", "เริ่มต้นใช้งานครั้งแรก", "เข้าใจการทำงานของ AI", "ศิลปะการเขียน Prompt",
  "เทคนิค Prompt ขั้นสูง", "ควบคุมบริบทและการตั้งค่า", "สร้างสรรค์คอนเทนต์ด้วย AI", "วิเคราะห์และสรุปผล",
  "ประยุกต์ใช้งานจริง", "โปรเจกต์จบคอร์ส",
]

const TOPICS: Record<string, TopicMeta> = {
  "chatgpt-basics": {
    title: "ChatGPT พื้นฐาน", tool: "ChatGPT", fallback: "G", tile: "linear-gradient(160deg,#23D08A,#0E8F5E)",
    level: "Beginner", blurb: "เรียนรู้การใช้ ChatGPT ตั้งแต่พื้นฐานจนถึงเทคนิคขั้นสูง เพื่อเพิ่มประสิทธิภาพการทำงานและการสร้างสรรค์ผลงาน",
    lessons: 10, hours: "1.5 ชั่วโมง", done: 3, total: 10, xpEarned: 1240, xpGoal: 3000,
    titles: ["รู้จักกับ ChatGPT", "เริ่มต้นใช้งาน ChatGPT", "เข้าใจการทำงานของ AI", "ศิลปะการเขียน Prompt เบื้องต้น",
      "เทคนิค Prompt ขั้นสูง", "ควบคุมบริบทและการตั้งค่า", "สร้างสรรค์คอนเทนต์ด้วย AI", "วิเคราะห์และสรุปผลด้วย ChatGPT",
      "ประยุกต์ใช้งานจริง", "โปรเจกต์จบคอร์ส พิชิต ChatGPT"],
  },
  "pro-prompting": {
    title: "เขียน Prompt ระดับโปร", tool: "Prompt", fallback: "P", tile: "linear-gradient(160deg,#BC83FF,#6C3CF5)",
    level: "Intermediate", blurb: "เจาะลึกเทคนิคการเขียน Prompt ให้ AI ตอบตรงใจทุกครั้ง พร้อมเฟรมเวิร์กที่ใช้ได้จริงในงานทุกประเภท",
    lessons: 10, hours: "2 ชั่วโมง", done: 4, total: 10, xpEarned: 980, xpGoal: 3000, titles: DEFAULT_TITLES,
  },
  "claude-docs": {
    title: "Claude สำหรับงานเอกสาร", tool: "Claude", fallback: "C", tile: "linear-gradient(160deg,#FFA866,#E2611C)",
    level: "Beginner", blurb: "สรุป วิเคราะห์ และเขียนเอกสารยาว ๆ ด้วย Claude ผู้ช่วยที่อ่านเอกสารได้ทีละมาก ๆ",
    lessons: 10, hours: "1.5 ชั่วโมง", done: 1, total: 10, xpEarned: 320, xpGoal: 3000, titles: DEFAULT_TITLES,
  },
  "gemini-research": {
    title: "Gemini & การค้นคว้า", tool: "Gemini", fallback: "G", tile: "linear-gradient(160deg,#5B8CFF,#2A6FF0)",
    level: "Intermediate", blurb: "ค้นคว้า สรุปข้อมูล และทำงานร่วมกับ Google ด้วย Gemini ให้เร็วและแม่นยำขึ้น",
    lessons: 10, hours: "1.5 ชั่วโมง", done: 0, total: 10, xpEarned: 0, xpGoal: 3000, titles: DEFAULT_TITLES,
  },
  "midjourney-images": {
    title: "Midjourney สร้างภาพ", tool: "Midjourney", fallback: "M", tile: "linear-gradient(160deg,#FF93BE,#F45C97)",
    level: "Advanced", blurb: "เปลี่ยนคำให้เป็นภาพสวย ๆ ด้วยศิลปะการเขียน Prompt สำหรับงานภาพโดยเฉพาะ",
    lessons: 10, hours: "2 ชั่วโมง", done: 0, total: 10, xpEarned: 0, xpGoal: 3000, titles: DEFAULT_TITLES,
  },
  "ai-for-work": {
    title: "AI สำหรับการทำงาน", tool: "AI Work", fallback: "W", tile: "linear-gradient(160deg,#875EF6,#5728E0)",
    level: "Beginner", blurb: "ใช้ AI ช่วยงานออฟฟิศ อีเมล และการประชุม ให้เสร็จไวขึ้นทุกวัน",
    lessons: 10, hours: "1.5 ชั่วโมง", done: 0, total: 10, xpEarned: 0, xpGoal: 3000, titles: DEFAULT_TITLES,
  },
}

/** build the road nodes from a done-count: done → current → locked, last node is treasure */
function buildLevels(meta: TopicMeta): Level[] {
  const xps = [100, 100, 120, 120, 150, 150, 160, 180, 200, 300]
  return meta.titles.map((title, i) => {
    const last = i === meta.titles.length - 1
    let status: Level["status"]
    if (i < meta.done) status = "done"
    else if (i === meta.done) status = last ? "treasure" : "current"
    else status = last ? "treasure" : "locked"
    return { n: i + 1, title, xp: xps[i] ?? 120, status }
  })
}

export default async function TopicRoadmapPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const t = makeT(await getLang())
  const meta = TOPICS[topic] ?? TOPICS["chatgpt-basics"]
  const levels = buildLevels(meta)

  const pct = Math.round((meta.done / meta.total) * 100)
  const current = levels.find((l) => l.status === "current") ?? levels.find((l) => l.status === "treasure")
  const firstLesson = `/daily-learn/${topic}/${current?.n ?? 1}`

  return (
    <>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>
        <Link href="/daily-learn" style={{ color: "var(--hero-600)" }}>{t("Daily Learn")}</Link>{" "}
        <span style={{ opacity: .5 }}>›</span>{" "}
        <span style={{ color: "var(--text-strong)" }}>{meta.title}</span>
      </div>

      <div className="lmap-wrap">
        <div className="lmap-main">
          {/* dark hero banner */}
          <div className="cbanner">
            <div className="cb-tile" style={{ background: meta.tile }}><ToolLogo name={meta.tool} fallback={meta.fallback} size={36} /></div>
            <div className="cb-mid">
              <div className="cb-row"><h1>{meta.title}</h1><span className="cb-tag">{t("Level")} {meta.level}</span></div>
              <p>{meta.blurb}</p>
              <div className="cb-chips">
                <span className="cb-chip"><BookOpen size={13} /> {meta.lessons} {t("lessons")}</span>
                <span className="cb-chip"><Clock size={13} /> {meta.hours}</span>
                <span className="cb-chip"><Sparkles size={13} /> {t("Great for beginners")}</span>
              </div>
            </div>
            <div className="cb-side">
              <div className="cb-pct"><span>{t("Progress")}</span><b>{pct}%</b></div>
              <div className="cb-bar"><i style={{ width: `${pct}%` }} /></div>
              <div className="cb-xp"><Zap size={12} style={{ verticalAlign: "-1px" }} /> {t("Total XP")} <b>{meta.xpEarned.toLocaleString()}</b> / {meta.xpGoal.toLocaleString()}</div>
              <div className="cb-medals"><span>🏅</span><span>🥇</span><span>🔥</span></div>
            </div>
          </div>

          <QuestMap levels={levels} topic={topic} mascot={`${M}/mascot-point.png`} />
        </div>

        {/* right rail */}
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
              <div className="qb"><b>{t("Use {tool} 3 times", { tool: meta.tool })}</b><div className="pbar"><i style={{ width: "33%" }} /></div></div>
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
            <div className="pinfo-row"><span className="pl">{t("Difficulty")}</span><span className="pv">{meta.level}</span></div>
            <div className="pinfo-row"><span className="pl">{t("Estimated time")}</span><span className="pv">{meta.hours}</span></div>
            <div className="pinfo-row"><span className="pl">{t("Best for")}</span><span className="pv">{t("Newcomers")}</span></div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--text-strong)", margin: "14px 0 8px" }}>{t("What you'll learn")}</p>
            <ul className="learn-list">
              <li><Check size={15} /> {t("How {tool} works under the hood", { tool: meta.tool })}</li>
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

      {/* bottom CTA */}
      <div className="map-cta">
        <div className="mc-tx">
          <b>{t("Start lesson {n} · {title}", { n: current?.n ?? 1, title: current?.title ?? meta.titles[0] })}</b>
          <span>{t("About 12 minutes")}</span>
        </div>
        <Link className="btn btn--sun lg" href={firstLesson}>{t("Start now")} <ChevronRight size={18} /></Link>
      </div>

      {/* certificate */}
      <div className="cert-card glass" style={{ maxWidth: "none" }}>
        <Image src={`${M}/mascot-celebrate.png`} alt="Riri" width={84} height={84} unoptimized />
        <div style={{ flex: 1 }}>
          <h3 className="display"><Trophy size={20} className="text-amber-500" style={{ verticalAlign: "-3px" }} /> {t("Finish to earn the {tool} Master badge", { tool: meta.tool })}</h3>
          <p>{t("Complete every lesson to earn a profile badge and unlock the next topic.")}</p>
        </div>
        <Link className="btn btn--violet md" href={firstLesson}>{t("Continue")} <ChevronRight size={16} /></Link>
      </div>
    </>
  )
}
