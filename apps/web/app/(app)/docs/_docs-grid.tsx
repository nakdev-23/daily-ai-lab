"use client"

import { useState } from "react"
import Link from "next/link"
import ToolLogo from "@/components/tool-logo"
import { makeT, type Lang } from "@/lib/i18n-core"
import type { ToolGroup, DocLevel } from "@/lib/docs"
import { BookOpen, FileText, Search } from "lucide-react"

const TOOL_BG: Record<string, string> = {
  ChatGPT: "linear-gradient(160deg,#23D08A,#0E8F5E)",
  Claude: "linear-gradient(160deg,#FFA866,#E2611C)",
  Gemini: "linear-gradient(160deg,#6F9CFF,#2A6FF0)",
  Midjourney: "linear-gradient(160deg,#BC83FF,#6C3CF5)",
  Suno: "linear-gradient(160deg,#FF93BE,#F45C97)",
  Runway: "linear-gradient(160deg,#5C5675,#1B1729)",
  Perplexity: "linear-gradient(160deg,#2FD68F,#0E8F5E)",
  "DALL·E": "linear-gradient(160deg,#FFB36B,#E2611C)",
}
const TOOL_CAT: Record<string, [string, string, string]> = {
  ChatGPT: ["chat", "แชท & เขียน", "Chat & writing"],
  Claude: ["chat", "คิดเป็นขั้นตอน & งานเขียนยาว", "Reasoning & docs"],
  Gemini: ["research", "Google & ค้นคว้า", "Google & research"],
  Midjourney: ["image", "ภาพอาร์ต AI", "AI image art"],
  Suno: ["music", "ทำเพลง AI", "AI music maker"],
  Runway: ["video", "วิดีโอ & เอฟเฟกต์", "AI video & FX"],
  Perplexity: ["research", "ค้นหาด้วย AI", "AI search"],
  "DALL·E": ["image", "ภาพอาร์ต AI", "AI image art"],
}
const LV_DOT: Record<DocLevel, string> = { beginner: "var(--mint-500)", intermediate: "var(--amber-500)", pro: "var(--hero-500)" }
const LV_LABEL: Record<DocLevel, string> = { beginner: "Beginner", intermediate: "Intermediate", pro: "Pro" }

export default function DocsGrid({ tools, lang }: { tools: ToolGroup[]; lang: Lang }) {
  const t = makeT(lang)
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")

  const CHIPS: [string, string][] = [
    ["all", t("All")],
    ["chat", t("Chat & writing")],
    ["image", t("Image")],
    ["video", t("Video")],
    ["music", t("Music")],
    ["research", t("Research")],
  ]
  const cat = (tool: string) => TOOL_CAT[tool]?.[0] ?? "chat"
  const q = query.trim().toLowerCase()
  const shown = tools.filter((g) => {
    if (filter !== "all" && cat(g.tool) !== filter) return false
    if (!q) return true
    const catLabel = TOOL_CAT[g.tool] ? `${TOOL_CAT[g.tool][1]} ${TOOL_CAT[g.tool][2]}` : ""
    return `${g.tool} ${catLabel} ${g.summary}`.toLowerCase().includes(q)
  })

  return (
    <>
      <section className="wrap page-hero" style={{ paddingTop: 8 }}>
        <span className="eyebrow"><BookOpen size={15} /> {t("AI tool docs")}</span>
        <h1 className="display">{t("Guides for every tool,")}<br /><span className="grad-text">{t("made simple")}</span></h1>
        <p>{t("Pick a tool to open its guide, split into 3 levels — Beginner · Intermediate · Pro.")}</p>
        <div className="docs-searchbar">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search tools…")} />
        </div>
        <div className="chips">
          {CHIPS.map(([k, label]) => (
            <button key={k} className={`chip-f${filter === k ? " active" : ""}`} onClick={() => setFilter(k)}>{label}</button>
          ))}
        </div>
      </section>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          {shown.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>{t("No tools in this category yet.")}</p>
          ) : (
            <div className="tools-big">
              {shown.map((g) => {
                const meta = TOOL_CAT[g.tool]
                return (
                  <Link key={g.toolSlug} href={`/docs/${g.toolSlug}`} className="tool-big glass">
                    <div className="tbtop">
                      <div className="tile" style={{ background: TOOL_BG[g.tool] ?? "var(--g-violet)" }}><ToolLogo name={g.tool} size={26} /></div>
                      <div><h3 className="display">{g.tool}</h3><div className="cat">{meta ? t(meta[2]) : t("AI tool")}</div></div>
                    </div>
                    <p className="desc">{g.summary || t("An easy-to-follow guide.")}</p>
                    <div className="tbfoot">
                      <span className="lvl"><FileText size={13} /> {g.count} {t("docs")}</span>
                      <span className="lvl-pills">
                        {g.levels.map((lv) => (
                          <span key={lv} className={`lvl-pill lvl-${lv}`}><span className="lv-dot" style={{ background: LV_DOT[lv] }} /> {t(LV_LABEL[lv])}</span>
                        ))}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
