"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ToolLogo from "@/components/tool-logo"
import { makeT, type Lang } from "@/lib/i18n-core"
import { getTool } from "@/lib/tool-registry"
import type { ToolGroup, DocLevel } from "@/lib/docs"
import { BookOpen, FileText, Search } from "lucide-react"

const LV_DOT: Record<DocLevel, string> = { beginner: "var(--mint-500)", intermediate: "var(--amber-500)", pro: "var(--hero-500)" }
const LV_LABEL: Record<DocLevel, string> = { beginner: "Beginner", intermediate: "Intermediate", pro: "Pro" }

export default function DocsGrid({ tools, lang }: { tools: ToolGroup[]; lang: Lang }) {
  const t = makeT(lang)
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [pending, setPending] = useState<string | null>(null)

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault()
    if (pending) return
    setPending(slug)
    router.push(`/docs/${slug}`)
  }

  const CHIPS: [string, string][] = [
    ["all", t("All")],
    ["chat", t("Chat & writing")],
    ["image", t("Image")],
    ["video", t("Video")],
    ["music", t("Music")],
    ["research", t("Research")],
  ]

  const q = query.trim().toLowerCase()
  const shown = tools.filter((g) => {
    const def = getTool(g.tool)
    if (filter !== "all" && def?.category !== filter) return false
    if (!q) return true
    const catLabel = def ? `${def.catLabelTh} ${def.catLabelEn}` : ""
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
        <div className="wrap">
          {shown.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>{t("No tools in this category yet.")}</p>
          ) : (
            <div className="tools-big">
              {shown.map((g) => {
                const def = getTool(g.tool)
                return (
                  <Link
                    key={g.toolSlug}
                    href={`/docs/${g.toolSlug}`}
                    className={`tool-big glass${pending === g.toolSlug ? " tool-pending" : ""}`}
                    onClick={(e) => handleCardClick(e, g.toolSlug)}
                  >
                    <div className="tbtop">
                      <div className="tile" style={{ background: def?.bg ?? "var(--g-violet)" }}>
                        <ToolLogo name={g.tool} size={26} />
                      </div>
                      <div>
                        <h3 className="display">{g.tool}</h3>
                        <div className="cat">{def ? t(def.catLabelEn) : t("AI tool")}</div>
                      </div>
                    </div>
                    <p className="desc">{g.summary || t("An easy-to-follow guide.")}</p>
                    <div className="tbfoot">
                      <span className="lvl"><FileText size={13} /> {g.count} {t("docs")}</span>
                      <span className="lvl-pills">
                        {g.levels.map((lv) => (
                          <span key={lv} className={`lvl-pill lvl-${lv}`}>
                            <span className="lv-dot" style={{ background: LV_DOT[lv] }} /> {t(LV_LABEL[lv])}
                          </span>
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
