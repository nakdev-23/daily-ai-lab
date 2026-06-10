"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { makeT, type Lang } from "@/lib/i18n-core"
import type { DocLevel, DocMeta } from "@/lib/docs"
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, ChevronDown, Crown, List } from "lucide-react"
import ToolLogo from "@/components/tool-logo"
import { getToolColors } from "@/lib/tool-colors"

type Section = { meta: DocMeta; html: string }
const M = "/assets/daily-ai-lab/mascot-ds"

const LV: Record<DocLevel, { dot: string; th: string; en: string; mascot: string }> = {
  beginner: { dot: "var(--mint-500)", th: "ระดับเริ่มต้น", en: "Beginner", mascot: "mascot-read" },
  intermediate: { dot: "var(--amber-500)", th: "ระดับกลาง", en: "Intermediate", mascot: "mascot-point" },
  pro: { dot: "var(--hero-500)", th: "ขั้นโปร", en: "Pro", mascot: "cockatiel-superhero" },
}
const ORDER: DocLevel[] = ["beginner", "intermediate", "pro"]

export default function DocsReader({ tool, sections, lang, isPro = false }: { tool: string; sections: Section[]; lang: Lang; isPro?: boolean }) {
  const t = makeT(lang)
  const colors = getToolColors(tool)
  const [active, setActive] = useState(0)
  const [openGroups, setOpenGroups] = useState<DocLevel[]>(["beginner", "intermediate", "pro"])
  const [tocOpen, setTocOpen] = useState(false)
  const toggleGroup = (lv: DocLevel) =>
    setOpenGroups((g) => (g.includes(lv) ? g.filter((x) => x !== lv) : [...g, lv]))
  const selectSection = (idx: number) => { setActive(idx); setTocOpen(false) }

  if (sections.length === 0) {
    return (
      <div className="docs-reader">
        <Link href="/docs" className="docs-back"><ArrowLeft size={16} /> {t("Back to Docs")}</Link>
        <div className="glass" style={{ padding: 40, textAlign: "center" }}>
          <h2 className="display" style={{ fontSize: 22, marginBottom: 6 }}>{tool}</h2>
          <p style={{ color: "var(--text-muted)" }}>{t("No docs for this tool yet.")}</p>
        </div>
      </div>
    )
  }

  const groups = ORDER
    .map((lv) => ({ lv, items: sections.filter((s) => s.meta.level === lv) }))
    .filter((g) => g.items.length > 0)

  const cur = sections[active]
  const lv = LV[cur.meta.level]
  const inLevel = sections.filter((s) => s.meta.level === cur.meta.level)
  const posInLevel = inLevel.findIndex((s) => s.meta.slug === cur.meta.slug) + 1
  const prev = active > 0 ? sections[active - 1] : null
  const next = active < sections.length - 1 ? sections[active + 1] : null

  return (
    <div className="docs-reader">
      <Link href="/docs" className="docs-back"><ArrowLeft size={16} /> {t("Back to Docs")}</Link>

      {/* mobile/tablet: open the topic menu */}
      <button type="button" className="docs-toc-toggle" onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen}>
        <List size={17} />
        <span className="ttt-label">{t("Topics")} · {cur.meta.title}</span>
        <ChevronDown size={15} className={`ttt-chev${tocOpen ? " open" : ""}`} />
      </button>

      <div className="docs-body">
        {/* left menu grouped by level */}
        <aside className={`docs-toc${tocOpen ? " open" : ""}`}>
          {groups.map((g) => {
            const isOpen = openGroups.includes(g.lv)
            return (
              <div className={`toc-group${isOpen ? " open" : ""}`} key={g.lv}>
                <button type="button" className="toc-eyebrow" onClick={() => toggleGroup(g.lv)} aria-expanded={isOpen}>
                  <span className="lv-dot" style={{ background: LV[g.lv].dot }} />
                  <span className="toc-eyebrow-label">{t(LV[g.lv].en)}</span>
                  <span className="toc-count">{g.items.length}</span>
                  <ChevronDown size={14} className="toc-chev" />
                </button>
                {isOpen && g.items.map((s) => {
                  const idx = sections.indexOf(s)
                  return (
                    <button key={s.meta.slug} className={`toc-link${idx === active ? " active" : ""}`} onClick={() => selectSection(idx)}>
                      {s.meta.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </aside>

        {/* content */}
        <main className="docs-main">
          {/* Tool header — stays fixed as user navigates topics */}
          <div className="docs-tool-head">
            <div className="dth-tile" style={{ background: colors.bg }}>
              <ToolLogo name={tool} fallback={colors.fallback} size={28} />
            </div>
            <div className="dth-info">
              <h1 className="dth-name">{tool}</h1>
              <span className="dth-sub">{t("Official guide")}</span>
            </div>
            <span className="dth-count">{sections.length} {t("docs")}</span>
          </div>

          <div className={`lv-banner ${cur.meta.level}`}>
            <Image src={`${M}/${lv.mascot}.png`} alt="Riri" width={92} height={92} />
            <div>
              <span className="lv-pill"><span className="lv-dot" style={{ background: "rgba(255,255,255,.5)", width: 8, height: 8, borderRadius: 999, display: "inline-block" }} /> {t(lv.en)}</span>
              <h2 className="display">{cur.meta.title}</h2>
              <p>{cur.meta.summary || t("An easy-to-follow guide.")} · <Clock size={13} style={{ display: "inline", verticalAlign: "-2px" }} /> {cur.meta.readTime}</p>
            </div>
          </div>

          <div className="pg-meta">{t("Page")} {posInLevel} / {inLevel.length}</div>

          {cur.meta.locked && !isPro ? (
            <div className="glass" style={{ padding: 36, textAlign: "center", background: "linear-gradient(150deg,#FFF3CE,#F1E7FF)" }}>
              <Image src={`${M}/mascot-sad.png`} alt="Riri" width={110} height={110} style={{ margin: "0 auto 12px" }} />
              <h3 className="display" style={{ fontSize: 21, marginBottom: 8 }}><Crown size={19} className="text-amber-500" style={{ verticalAlign: "-3px" }} /> {t("This content is for Pro members")}</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>{t("Upgrade to read the full content and all advanced docs.")}</p>
              <Link className="btn btn--violet lg" href="/upgrade"><Crown size={18} /> {t("Upgrade to Pro")}</Link>
            </div>
          ) : (
            <article className="prose-doc" dangerouslySetInnerHTML={{ __html: cur.html }} />
          )}

          <div className="doc-pager">
            <button disabled={!prev} onClick={() => prev && setActive(active - 1)}>
              <div className="pg-dir"><ChevronLeft size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> {t("Previous")}</div>
              {prev && <div className="pg-ttl">{prev.meta.title}</div>}
            </button>
            <button className="next" disabled={!next} onClick={() => next && setActive(active + 1)}>
              <div className="pg-dir">{t("Next")} <ChevronRight size={12} style={{ display: "inline", verticalAlign: "-2px" }} /></div>
              {next && <div className="pg-ttl">{next.meta.title}</div>}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
