import Link from "next/link"
import Image from "next/image"
import "../home.css"
import "./about.css"
import LangToggle from "@/components/lang-toggle"
import { getLang, makeT } from "@/lib/i18n"
import { Heart, Gamepad2, Puzzle, Sprout } from "lucide-react"

export const metadata = {
  title: "เกี่ยวกับเรา",
  description: "Daily AI Lab เกิดจากความเชื่อว่าทักษะ AI ไม่ควรน่ากลัว — ใคร ๆ ก็เรียนได้ ทีละบทเล็ก ๆ วันละ 15 นาที พร้อมริริคอยเชียร์",
  alternates: { canonical: "/about" },
}

const M = "/assets/daily-ai-lab/mascot-ds"

export default async function AboutPage() {
  const lang = await getLang()
  const t = makeT(lang)

  const VALUES = [
    { bg: "var(--sun-100)", icon: Gamepad2, color: "text-amber-500", title: t("Fun first, always"), desc: t("Good learning shouldn't be boring. We add games, XP, streaks and Riri so you want to come back daily.") },
    { bg: "var(--hero-100)", icon: Puzzle, color: "text-violet-600", title: t("Bite-size & clear"), desc: t("Hard topics broken into short lessons in plain language. No prior experience needed.") },
    { bg: "var(--mint-100)", icon: Sprout, color: "text-emerald-600", title: t("Actually useful"), desc: t("We teach skills you can use at work and in life right away — not just theory.") },
  ]

  return (
    <div className="dlab-home">
      <div className="atmos" />
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="grain" />

      <header className="nav">
        <div className="wrap nav-in">
          <Link className="brand" href="/">
            <span className="brand-badge"><Image src={`${M}/mascot-hello.png`} alt="Riri" width={44} height={44} /></span>
            <div><div className="brand-name">Daily AI Lab</div><div className="brand-sub">{t("AI, every day")}</div></div>
          </Link>
          <nav className="nav-links">
            <Link href="/docs">{t("Docs")}</Link>
            <Link href="/paths">{t("Career paths")}</Link>
            <Link href="/about">{t("About")}</Link>
            <Link href="/#pricing">{t("Pricing")}</Link>
          </nav>
          <div className="nav-cta">
            <LangToggle current={lang} />
            <Link className="link-btn" href="/login">{t("Log in")}</Link>
            <Link className="btn btn--violet sm" href="/login">{t("Start free")}</Link>
          </div>
        </div>
      </header>

      <section className="wrap about-hero">
        <div>
          <span className="eyebrow"><Heart size={15} className="text-violet-600" /> {t("Our story")}</span>
          <h1 className="display">{t("Make learning AI")}<br /><span className="grad-text">{t("as fun as a game")}</span></h1>
          <p>{t("Daily AI Lab was born from a simple belief: AI skills shouldn't be scary or boring — anyone can learn, 15 minutes a day, one small lab at a time, with Riri cheering you on.")}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
            <Link className="btn btn--violet lg" href="/login">{t("Start learning free")}</Link>
            <Link className="btn btn--ghost lg" href="/paths">{t("Browse paths")}</Link>
          </div>
        </div>
        <div className="stage">
          <div className="spot" />
          <Image className="mascot" src={`${M}/cockatiel-superhero.png`} alt="Riri" width={320} height={320} />
        </div>
      </section>

      <section className="block" style={{ padding: "30px 0 50px" }}>
        <div className="wrap">
          <div className="band">
            <div className="band-grid">
              <div className="s"><b>120K+</b><span>{t("learners worldwide")}</span></div>
              <div className="s"><b>7</b><span>{t("AI tools")}</span></div>
              <div className="s"><b>400+</b><span>{t("lessons")}</span></div>
              <div className="s"><b>4.9★</b><span>{t("average rating")}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="block tinted">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">{t("What we stand for")}</span>
            <h2 className="display">{t("Our core values")}</h2>
            <p>{t("Every lesson we design follows these three principles.")}</p>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="value glass">
                <div className="vic" style={{ background: v.bg }}><v.icon size={27} className={v.color} /></div>
                <h3 className="display">{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap meet">
          <Image className="mascot" src={`${M}/mascot-thumbsup.png`} alt="Riri" width={280} height={280} />
          <div>
            <span className="eyebrow">{t("Meet our mascot")}</span>
            <h2 className="display" style={{ margin: "12px 0 14px" }}>{t("Say hi to \"Riri\"")}</h2>
            <p className="lead" style={{ maxWidth: 480 }}>{t("A cockatiel in a violet cape — your guide, cheerleader and study buddy. Riri celebrates your wins, feels your misses, and starts fresh with you every day.")}</p>
            <Link className="btn btn--violet lg" href="/login" style={{ marginTop: 24 }}>{t("Become Riri's friend")}</Link>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-bottom">
            <span>© 2026 Daily AI Lab · {t("Learn AI every day")}</span>
            <span style={{ display: "flex", gap: 20 }}><Link href="/about" style={{ margin: 0 }}>{t("About")}</Link><Link href="/privacy" style={{ margin: 0 }}>{t("Privacy")}</Link><Link href="/terms" style={{ margin: 0 }}>{t("Terms")}</Link></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
