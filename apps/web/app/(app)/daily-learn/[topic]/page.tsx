import Link from "next/link"
import Image from "next/image"
import { getLang, makeT } from "@/lib/i18n"
import ToolLogo from "@/components/tool-logo"
import { Check, Award, Zap, Lock, Trophy, ChevronRight } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"

type NodeState = "done" | "current" | "locked"
type Node = { s: NodeState; icon: "check" | "award" | "zap" | "lock" | "trophy"; lesson: string }

const ICON = {
  check: <Check size={30} />, award: <Award size={28} />, zap: <Zap size={30} />,
  lock: <Lock size={26} />, trophy: <Trophy size={28} />,
}

const UNIT1: Node[] = [
  { s: "done", icon: "check", lesson: "1-1" }, { s: "done", icon: "check", lesson: "1-2" }, { s: "done", icon: "check", lesson: "1-3" },
  { s: "done", icon: "check", lesson: "1-4" }, { s: "done", icon: "check", lesson: "1-5" }, { s: "done", icon: "award", lesson: "1-6" },
]
const UNIT2: Node[] = [
  { s: "done", icon: "check", lesson: "2-1" }, { s: "current", icon: "zap", lesson: "2-2" }, { s: "locked", icon: "lock", lesson: "2-3" },
  { s: "locked", icon: "lock", lesson: "2-4" }, { s: "locked", icon: "lock", lesson: "2-5" }, { s: "locked", icon: "award", lesson: "2-6" },
]
const UNIT3: Node[] = [
  { s: "locked", icon: "lock", lesson: "3-1" }, { s: "locked", icon: "lock", lesson: "3-2" }, { s: "locked", icon: "lock", lesson: "3-3" },
  { s: "locked", icon: "lock", lesson: "3-4" }, { s: "locked", icon: "lock", lesson: "3-5" }, { s: "locked", icon: "trophy", lesson: "3-6" },
]

function Nodes({ nodes, topic }: { nodes: Node[]; topic: string }) {
  return (
    <div className="nodes">
      {nodes.map((n, i) => {
        const cls = `node ${n.s} o${i + 1}`
        return n.s === "locked"
          ? <span key={i} className={cls}>{ICON[n.icon]}</span>
          : <Link key={i} className={cls} href={`/daily-learn/${topic}/${n.lesson}`}>{ICON[n.icon]}</Link>
      })}
    </div>
  )
}

export default async function TopicRoadmapPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const t = makeT(await getLang())
  const firstLesson = `/daily-learn/${topic}/2-2`

  return (
    <>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
        <Link href="/daily-learn" style={{ color: "var(--hero-600)" }}>{t("Daily Learn")}</Link> <span style={{ opacity: .5 }}>›</span> <span style={{ color: "var(--text-strong)" }}>{t("ChatGPT Basics")}</span>
      </div>

      {/* topic header */}
      <div className="course-head glass" style={{ marginTop: 0 }}>
        <div className="ch-tile" style={{ background: "linear-gradient(160deg,#23D08A,#0E8F5E)", color: "#fff" }}><ToolLogo name="ChatGPT" size={34} /></div>
        <div>
          <span className="eyebrow"><span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--mint-500)", display: "inline-block" }} /> {t("Beginner · 15 min a day")}</span>
          <h1 className="display" style={{ marginTop: 6 }}>{t("ChatGPT Basics")}</h1>
          <div className="ch-prog">
            <span className="pl">60%</span>
            <div className="pbar"><i style={{ width: "60%" }} /></div>
            <span className="pl">{t("12 / 20 lessons")}</span>
          </div>
        </div>
        <div className="ch-cta">
          <Link className="btn btn--violet lg" href={firstLesson}>{t("Continue")} <ChevronRight size={18} /></Link>
          <span className="xp"><Zap size={13} /> {t("Earned 320 XP")}</span>
        </div>
      </div>

      {/* winding game roadmap */}
      <div className="glass pathmap">
        <Image className="node-mascot" src={`${M}/mascot-point.png`} alt="Riri" width={80} height={80} />

        <div style={{ textAlign: "center" }}><span className="unit-tag">{t("Unit 1 · Meet ChatGPT")}</span></div>
        <Nodes nodes={UNIT1} topic={topic} />

        <div className="unit-sep">{t("Unit 2")}</div>

        <div style={{ textAlign: "center" }}><span className="unit-tag">{t("Unit 2 · Give the AI a role")}</span></div>
        <Nodes nodes={UNIT2} topic={topic} />

        <div className="unit-sep">{t("Unit 3")}</div>

        <div style={{ textAlign: "center" }}><span className="unit-tag" style={{ background: "var(--cloud-300)", boxShadow: "none" }}><Lock size={13} /> {t("Unit 3 · Precise prompts")}</span></div>
        <Nodes nodes={UNIT3} topic={topic} />
      </div>

      {/* certificate */}
      <div className="cert-card glass">
        <Image src={`${M}/mascot-celebrate.png`} alt="Riri" width={84} height={84} />
        <div style={{ flex: 1 }}>
          <h3 className="display"><Award size={20} className="text-amber-500" style={{ verticalAlign: "-3px" }} /> {t("Finish to earn the ChatGPT Master badge")}</h3>
          <p>{t("Complete every lesson to earn a profile badge and unlock the next topic.")}</p>
        </div>
        <Link className="btn btn--violet md" href={firstLesson}>{t("Continue")} <ChevronRight size={16} /></Link>
      </div>
    </>
  )
}
