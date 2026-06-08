"use client"

import { useState } from "react"
import Link from "next/link"
import ToolLogo from "@/components/tool-logo"
import { makeT, type Lang } from "@/lib/i18n-core"
import { Rocket, Clock, BookOpen, Award, ChevronRight, Sparkles, Brain, Megaphone, Briefcase, Search } from "lucide-react"

export default function PathsGrid({ lang }: { lang: Lang }) {
  const t = makeT(lang)
  const [query, setQuery] = useState("")

  const PATHS = [
    {
      icon: Sparkles, iconColor: "text-violet-600", bg: "var(--hero-100)", tag: t("Beginner friendly"),
      title: t("AI Content Creator"),
      desc: t("Write, design and produce content end-to-end. Go from idea to finished post, image and soundtrack — all with AI."),
      tools: [["#19C37D", "ChatGPT"], ["#6C3CF5", "Midjourney"], ["#F45C97", "Suno"]],
      weeks: t("6 weeks"), lessons: t("84 lessons"),
    },
    {
      icon: Brain, iconColor: "text-amber-600", bg: "var(--sun-100)", tag: t("Most popular"),
      title: "Prompt Engineer",
      desc: t("Master the art and science of prompting across every major model. The skill behind every great AI result."),
      tools: [["#19C37D", "ChatGPT"], ["#FF9A52", "Claude"], ["#2A6FF0", "Gemini"]],
      weeks: t("5 weeks"), lessons: t("72 lessons"),
    },
    {
      icon: Megaphone, iconColor: "text-pink-500", bg: "var(--pink-100)", tag: t("For marketers"),
      title: t("AI for Marketing"),
      desc: t("Ship campaigns, copy and visuals faster than ever. Turn AI into your always-on creative teammate."),
      tools: [["#19C37D", "ChatGPT"], ["#6C3CF5", "Midjourney"], ["#2A6FF0", "Gemini"]],
      weeks: t("4 weeks"), lessons: t("60 lessons"),
    },
    {
      icon: Briefcase, iconColor: "text-sky-600", bg: "var(--sky-100)", tag: t("For professionals"),
      title: t("AI for Business"),
      desc: t("Automate busywork and make smarter decisions. Bring AI into meetings, docs, data and daily workflows."),
      tools: [["#FF9A52", "Claude"], ["#19C37D", "ChatGPT"], ["#14A871", "Perplexity"]],
      weeks: t("4 weeks"), lessons: t("56 lessons"),
    },
  ]

  const q = query.trim().toLowerCase()
  const shown = q
    ? PATHS.filter((p) => `${p.title} ${p.desc} ${p.tag} ${p.tools.map((x) => x[1]).join(" ")}`.toLowerCase().includes(q))
    : PATHS

  return (
    <>
      <section className="wrap page-hero">
        <span className="eyebrow"><Rocket size={15} /> {t("Career paths")}</span>
        <h1 className="display">{t("From curious to")}<br /><span className="grad-text">{t("career-ready")}</span></h1>
        <p>{t("Guided journeys that stack multiple AI tools into real, job-ready skills. Follow a path, earn a certificate, build a portfolio.")}</p>
        <div className="docs-searchbar">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search career paths…")} />
        </div>
      </section>

      <section className="block" style={{ paddingTop: 28 }}>
        <div className="wrap">
          {shown.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>{t("No matching paths.")}</p>
          ) : (
            <div className="paths-big">
              {shown.map((p) => (
                <div key={p.title} className="path-big glass">
                  <div className="pleft">
                    <div className="pic" style={{ background: p.bg }}><p.icon size={36} className={p.iconColor} /></div>
                    <span className="lvl-tag">{p.tag}</span>
                  </div>
                  <div>
                    <h3 className="display">{p.title}</h3>
                    <p className="pd">{p.desc}</p>
                    <div className="path-tools">
                      {p.tools.map(([bg, name]) => (
                        <span className="ptool" key={name}><span className="sw" style={{ background: bg }}><ToolLogo name={name} size={12} /></span> {name}</span>
                      ))}
                    </div>
                    <div className="path-foot">
                      <span className="pm"><Clock size={14} /> {p.weeks}</span>
                      <span className="pm"><BookOpen size={14} /> {p.lessons}</span>
                      <span className="pm"><Award size={14} /> {t("Certificate")}</span>
                      <Link className="btn btn--violet md" style={{ marginLeft: "auto" }} href="/paths/prompt-engineer"><span>{t("Start path")}</span> <ChevronRight size={16} /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
