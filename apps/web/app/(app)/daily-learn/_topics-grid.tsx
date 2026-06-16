"use client"

import { useState } from "react"
import Link from "next/link"
import ToolLogo from "@/components/tool-logo"
import { makeT, type Lang } from "@/lib/i18n-core"
import { ChevronRight, ChevronLeft, Clock, Crown } from "lucide-react"

export type Topic = {
  id: string
  tool: string
  fallback: string
  bg: string
  title: string
  dot: string
  level: string
  desc: string
  pro?: boolean
  n: string
  pct: number
  soft: string
  sh: string
  blob: string
  bar: string
  bar2: string
}

// Two rows of the 3-column desktop grid per page.
const PER_PAGE = 6

export default function TopicsGrid({ topics, lang }: { topics: Topic[]; lang: Lang }) {
  const t = makeT(lang)
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(topics.length / PER_PAGE))
  const safePage = Math.min(page, pages - 1)
  const shown = topics.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE)

  return (
    <>
      <div className="lrn-grid" key={safePage}>
        {topics.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            {t("No courses available yet.")}
          </p>
        )}
        {shown.map((tp) => (
          <Link
            key={tp.id}
            className="lrn-card"
            href={`/daily-learn/${tp.id}`}
            style={{
              ["--c-soft" as string]: tp.soft, ["--c-sh" as string]: tp.sh,
              ["--c-blob" as string]: tp.blob, ["--c-bar" as string]: tp.bar, ["--c-bar2" as string]: tp.bar2,
            }}
          >
            <span className="blob" />
            {tp.pro && <span className="lc-pro"><Crown size={12} /> Pro</span>}
            <span className="go-arrow"><ChevronRight size={18} /></span>
            <div className="lc-top">
              <div className="lc-tile" style={{ background: tp.bg }}>
                <ToolLogo name={tp.tool} fallback={tp.fallback} size={24} />
              </div>
              <div className="lc-tt">
                <h3>{tp.title}</h3>
                <div className="lc-lvl"><span className="d" style={{ background: tp.dot }} />{tp.level}</div>
              </div>
            </div>
            <p className="lc-desc">{tp.desc}</p>
            <div className="lc-foot">
              <span className="lc-time"><Clock size={13} /> {t("15 min/day")}</span>
              <span className="lc-prog">{tp.n}</span>
            </div>
            <div className="lrn-bar"><i style={{ width: `${tp.pct}%` }} /></div>
          </Link>
        ))}
      </div>

      {pages > 1 && (
        <nav className="lrn-pager" aria-label={t("Topic pages")}>
          <button
            className="lp-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            aria-label={t("Previous page")}
          >
            <ChevronLeft size={17} />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={`lp-dot${i === safePage ? " on" : ""}`}
              onClick={() => setPage(i)}
              aria-label={`${t("Page")} ${i + 1}`}
              aria-current={i === safePage ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="lp-btn"
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={safePage === pages - 1}
            aria-label={t("Next page")}
          >
            <ChevronRight size={17} />
          </button>
        </nav>
      )}
    </>
  )
}
