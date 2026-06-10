"use client"

import { useState } from "react"
import Link from "next/link"
import { makeT, type Lang } from "@/lib/i18n-core"
import type { CareerPath } from "@/lib/career-paths"
import {
  Rocket, Clock, BookOpen, Award, ChevronRight,
  Brain, Megaphone, Briefcase, Zap, Search, Lock,
} from "lucide-react"

const TONE_META: Record<string, { bg: string; cls: string; Icon: React.ElementType }> = {
  violet: { bg: "var(--hero-100)",  cls: "text-violet-600",  Icon: Brain },
  mint:   { bg: "var(--mint-100)",  cls: "text-emerald-600", Icon: BookOpen },
  pink:   { bg: "var(--pink-100)",  cls: "text-pink-500",    Icon: Megaphone },
  sky:    { bg: "var(--sky-100)",   cls: "text-sky-600",     Icon: Briefcase },
  sun:    { bg: "var(--sun-100)",   cls: "text-amber-600",   Icon: Zap },
}

const TOOL_HEX: Record<string, string> = {
  ChatGPT: "#19C37D", Claude: "#FF9A52", Gemini: "#2A6FF0",
  Midjourney: "#6C3CF5", Suno: "#F45C97", Runway: "#1B1729",
  Perplexity: "#14A871", Codex: "#10A37F",
}

function defaultMeta(tone: string) {
  return TONE_META[tone] ?? { bg: "var(--hero-100)", cls: "text-violet-600", Icon: Rocket }
}

export default function PathsGrid({ lang, paths }: { lang: Lang; paths: CareerPath[] }) {
  const t = makeT(lang)
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const shown = q
    ? paths.filter((p) =>
        `${p.title} ${p.description} ${p.tag} ${p.tools.join(" ")}`.toLowerCase().includes(q)
      )
    : paths

  const totalLessons = (p: CareerPath) => p.modules.flatMap((m) => m.steps).length

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
          {paths.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "60px 0" }}>
              {t("No career paths yet.")}
            </p>
          ) : shown.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
              {t("No matching paths.")}
            </p>
          ) : (
            <div className="paths-big">
              {shown.map((p) => {
                const { bg, cls, Icon } = defaultMeta(p.tone)
                const lessons = totalLessons(p)
                return (
                  <div key={p.id} className="path-big glass">
                    <div className="pleft">
                      <div className="pic" style={{ background: bg }}><Icon size={36} className={cls} /></div>
                      <span className="lvl-tag">{t(p.tag)}</span>
                      {p.isPro && <span className="lvl-tag" style={{ background: "var(--sun-100)", color: "var(--sun-700)" }}>Pro</span>}
                    </div>
                    <div>
                      <h3 className="display">{p.title}</h3>
                      <p className="pd">{p.description}</p>
                      <div className="path-tools">
                        {p.tools.map((name) => (
                          <span className="ptool" key={name}>
                            <span className="sw" style={{ background: TOOL_HEX[name] ?? "#888" }} />
                            {name}
                          </span>
                        ))}
                      </div>
                      <div className="path-foot">
                        <span className="pm"><Clock size={14} /> {p.weeks} {t("weeks")}</span>
                        <span className="pm"><BookOpen size={14} /> {lessons || p.modules.length} {t("lessons")}</span>
                        <span className="pm"><Award size={14} /> {t("Certificate")}</span>
                        {p.isPro ? (
                          <Link className="btn btn--ghost md" style={{ marginLeft: "auto" }} href="/upgrade">
                            <Lock size={14} /> Pro
                          </Link>
                        ) : (
                          <Link className="btn btn--violet md" style={{ marginLeft: "auto" }} href={`/paths/${p.slug}`}>
                            {t("Start path")} <ChevronRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
