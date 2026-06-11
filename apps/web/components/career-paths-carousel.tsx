"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, BookOpen, Brain, Briefcase, ChevronRight, Crown, Megaphone, PenLine, Video } from "lucide-react"
import { makeT, type Lang } from "@/lib/i18n-core"

const M = "/assets/daily-ai-lab/mascot-ds"

const PATHS = [
  {
    tone: "violet",
    icon: PenLine,
    tag: "Most popular",
    title: "AI Content Creator",
    desc: "Write, design & produce with ChatGPT, Midjourney & Suno.",
    weeks: "6 weeks",
    lessons: "84 lessons",
    tools: ["ChatGPT", "Midjourney", "Suno", "Canva"],
    mascot: "mascot-fly",
  },
  {
    tone: "mint",
    icon: Brain,
    tag: "Recommended",
    title: "Prompt Engineer",
    desc: "Master prompting across every major model, beginner to pro.",
    weeks: "5 weeks",
    lessons: "72 lessons",
    tools: ["ChatGPT", "Claude", "Gemini"],
    mascot: "mascot-thumbsup",
  },
  {
    tone: "pink",
    icon: Megaphone,
    tag: "Recommended",
    title: "AI for Marketing",
    desc: "Campaigns, copy & visuals that ship faster with AI.",
    weeks: "4 weeks",
    lessons: "60 lessons",
    tools: ["ChatGPT", "Canva", "Midjourney"],
    mascot: "mascot-point",
  },
  {
    tone: "sky",
    icon: Briefcase,
    tag: "Recommended",
    title: "AI for Business",
    desc: "Automate work and make smarter calls with AI tools.",
    weeks: "4 weeks",
    lessons: "56 lessons",
    tools: ["ChatGPT", "Gemini", "Sheets"],
    mascot: "mascot-laptop",
  },
  {
    tone: "blue",
    icon: BarChart3,
    tag: "New",
    title: "AI for Data Analysis",
    desc: "Read charts, summarise numbers & turn data into decisions.",
    weeks: "4 weeks",
    lessons: "48 lessons",
    tools: ["Gemini", "ChatGPT", "Sheets"],
    mascot: "mascot-read",
  },
  {
    tone: "sun",
    icon: Video,
    tag: "New",
    title: "AI for Video",
    desc: "Script, storyboard & edit short videos with AI.",
    weeks: "4 weeks",
    lessons: "44 lessons",
    tools: ["Runway", "Suno", "ChatGPT"],
    mascot: "mascot-celebrate",
  },
] as const

export default function CareerPathsCarousel({ lang }: { lang: Lang }) {
  const t = useMemo(() => makeT(lang), [lang])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % PATHS.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <div
      className="career-carousel reveal"
      aria-roledescription="carousel"
      aria-label={t("Career paths")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="career-viewport">
        <div className="career-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {PATHS.map((path, index) => {
            const Icon = path.icon
            return (
              <article
                className={`career-card career-card--${path.tone}`}
                key={path.title}
                aria-hidden={active !== index}
              >
                <div className="career-copy">
                  <span className="career-ribbon">
                    {index === 0 ? <Crown size={15} /> : <Icon size={15} />}
                    {t(path.tag)}
                  </span>
                  <div className="career-icon"><Icon size={26} /></div>
                  <h3 className="display">{t(path.title)}</h3>
                  <p>{t(path.desc)}</p>
                  <div className="career-tools" aria-label="Tools">
                    {path.tools.map((tool) => <span key={tool}>{tool}</span>)}
                  </div>
                </div>
                <Image className="career-mascot" src={`${M}/${path.mascot}.png`} alt="Riri" width={260} height={260} />
                <div className="career-foot">
                  <span><BookOpen size={17} /> {t(path.lessons)}</span>
                  <Link className="career-cta" href="/paths">
                    {t("Start this path")} <ChevronRight size={18} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="career-dots" role="tablist" aria-label={t("Pick a career path")}>
        {PATHS.map((path, index) => (
          <button
            key={path.title}
            type="button"
            className={active === index ? "active" : ""}
            aria-label={`${t("Go to")} ${t(path.title)}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  )
}
