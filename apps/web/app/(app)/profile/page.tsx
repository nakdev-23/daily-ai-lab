import Link from "next/link"
import Image from "next/image"
import { getLang, makeT } from "@/lib/i18n"
import { MapPin, Gem, Target, Settings, Flame, Zap, CheckCircle2, Award, Brain } from "lucide-react"

const B = "/assets/daily-ai-lab/badges"

type Badge = { img: string; name: string; sub: string; locked?: boolean }

export default async function ProfilePage() {
  const t = makeT(await getLang())

  const STATS = [
    { icon: Flame, color: "text-orange-500", v: "12", l: t("Day streak") },
    { icon: Zap, color: "text-amber-500", v: "2,480", l: t("Total XP") },
    { icon: CheckCircle2, color: "text-emerald-500", v: "64", l: t("Lessons done") },
    { icon: Award, color: "text-violet-500", v: "8", l: t("Badges earned") },
  ]

  const BADGES: Badge[] = [
    { img: "first-step", name: t("First Step"), sub: t("Your first lesson done") },
    { img: "7-day-streak", name: t("7 Day Streak"), sub: t("7 days in a row") },
    { img: "30-day-streak", name: t("30 Day Streak"), sub: t("30 days in a row"), locked: true },
    { img: "early-bird", name: t("Early Bird"), sub: t("Study before 8am") },
    { img: "night-owl", name: t("Night Owl"), sub: t("Study late at night"), locked: true },
    { img: "xp-master", name: t("XP Master"), sub: t("Top XP collector") },
    { img: "quiz-whiz", name: t("Quiz Whiz"), sub: t("Quiz expert") },
    { img: "perfect-score", name: t("Perfect Score"), sub: t("100% quiz") },
    { img: "speed-learner", name: t("Speed Learner"), sub: t("Blazing fast"), locked: true },
    { img: "prompt-pro", name: t("Prompt Pro"), sub: t("Great at prompting") },
    { img: "ai-explorer", name: t("AI Explorer"), sub: t("Explored AI tools") },
    { img: "creator", name: t("Creator"), sub: t("Made something great"), locked: true },
    { img: "problem-solver", name: t("Problem Solver"), sub: t("Solved hard problems"), locked: true },
    { img: "helper", name: t("Helper"), sub: t("Helped others learn"), locked: true },
    { img: "legend", name: t("Legend"), sub: t("The ultimate learner"), locked: true },
  ]

  return (
    <>
      <div className="prof-hero">
        <div className="pf-av-wrap">
          <span className="pf-ring" />
          <span className="pf-av">N</span>
          <span className="pf-lvl"><Zap size={12} /> Lv 8</span>
        </div>
        <div className="pf-mid">
          <h1 className="pf-name">Nin Wattana</h1>
          <div className="pf-chips">
            <span className="pf-chip handle">@nin</span>
            <span className="pf-chip"><MapPin size={13} /> {t("Bangkok, Thailand")}</span>
            <span className="pf-chip"><Gem size={13} className="text-sky-500" /> {t("Diamond League")}</span>
            <span className="pf-chip"><Target size={13} className="text-pink-500" /> {t("Rank #6")}</span>
          </div>
          <div className="pf-xp">
            <div className="lbl"><span className="lv">{t("Level 8 · AI Explorer")}</span><span className="nx">2,480 / 3,000 XP</span></div>
            <div className="bar"><i style={{ width: "82%" }} /></div>
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

      <div className="glass" style={{ padding: 22, marginBottom: 24 }}>
        <div className="card-h"><h3 className="display">{t("In progress")}</h3><Link className="more" href="/docs">{t("See all")}</Link></div>
        <Link className="cont glass" href="/docs">
          <div className="tile" style={{ background: "linear-gradient(160deg,#23D08A,#0E8F5E)", width: 52, height: 52, fontSize: 22 }}>G</div>
          <div className="ci"><b>{t("ChatGPT · Prompt Basics")}</b><div className="pbar"><i style={{ width: "60%" }} /></div></div>
          <span className="cn">3 / 5</span>
        </Link>
        <Link className="cont glass" href="/paths">
          <div className="tile" style={{ background: "var(--sun-100)", color: "var(--hero-700)", width: 52, height: 52 }}><Brain size={24} /></div>
          <div className="ci"><b>{t("Prompt Engineer path")}</b><div className="pbar"><i style={{ width: "35%" }} /></div></div>
          <span className="cn">25 / 72</span>
        </Link>
      </div>

      <div className="glass" style={{ padding: 22 }}>
        <div className="card-h"><h3 className="display">{t("Badges & achievements")}</h3><span className="more" style={{ cursor: "default" }}>8 / 15</span></div>
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
