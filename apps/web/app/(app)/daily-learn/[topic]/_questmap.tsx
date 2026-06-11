"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, Lock, Star } from "lucide-react"

export type Level = {
  n: number
  title: string
  xp: number
  status: "done" | "current" | "locked" | "treasure"
}

const XS = [50, 71, 50, 29, 50, 71, 50, 29, 50, 63]
const STEP = 158
const TOP = 78
const BOTTOM_PAD = 130

/** Catmull-Rom → cubic bézier: a smooth road that flows through every point. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return `M ${pts[0]?.x ?? 50} ${pts[0]?.y ?? 0}`
  const d = [`M ${pts[0].x} ${pts[0].y}`]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x} ${p2.y}`)
  }
  return d.join(" ")
}

export default function QuestMap({ levels, topic, mascot }: { levels: Level[]; topic: string; mascot: string }) {
  const currentRef = useRef<HTMLAnchorElement>(null)

  const pts = levels.map((_, i) => ({ x: XS[i % XS.length], y: TOP + i * STEP }))
  const H = TOP + (levels.length - 1) * STEP + BOTTOM_PAD
  const d = smoothPath(pts)

  // progress fraction up to the current node (or last completed)
  const curIdx = levels.findIndex((l) => l.status === "current")
  let lastDone = -1
  levels.forEach((l, i) => { if (l.status === "done") lastDone = i })
  const progressIdx = curIdx >= 0 ? curIdx : lastDone
  const frac = levels.length > 1 ? Math.max(0, progressIdx) / (levels.length - 1) : 0
  // pathLength=100 normalises the road; reveal only the completed portion
  const dashOffset = 100 * (1 - frac)

  // gently bring the active lesson into view on first load
  useEffect(() => {
    const el = currentRef.current
    if (!el) return
    const id = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 450)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="qboard" style={{ minHeight: H + 30 }}>
      <span className="scene" style={{ top: 132, left: 20 }}>🌲</span>
      <span className="scene" style={{ top: 330, right: 28 }}>🌳</span>
      <span className="scene" style={{ bottom: 150, left: 34 }}>🌲</span>
      <span className="scene sm twinkle" style={{ top: 88, right: 110 }}>✨</span>
      <span className="scene sm twinkle" style={{ top: 470, left: 78 }}>⭐</span>
      <span className="scene sm" style={{ bottom: 80, right: 70 }}>🪨</span>

      <svg className="qroad" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="qroadgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34E29B" />
            <stop offset="1" stopColor="#0E9C68" />
          </linearGradient>
        </defs>
        <path className="qroad-bg" d={d} />
        <path
          className="qroad-fill"
          d={d}
          pathLength={100}
          style={{ strokeDasharray: 100, ["--qoff" as string]: dashOffset }}
        />
        <path className="qroad-dash" d={d} />
      </svg>

      <div className="qlevels" style={{ height: H }}>
        {levels.map((l, i) => {
          const p = pts[i]
          const cls = `qcard ${l.status}`
          const style = { left: `${p.x}%`, top: p.y } as React.CSSProperties
          const inner = (
            <>
              <span className="qc-no">{l.n}</span>
              {l.status === "done" && <span className="qc-status"><Check size={14} /></span>}
              {l.status === "locked" && <span className="qc-status"><Lock size={12} /></span>}
              {l.status === "treasure" && <div className="qc-chest">🎁</div>}
              <div className="qc-title">{l.title}</div>
              <div className="qc-xp"><Star size={13} fill="currentColor" /> {l.xp} XP</div>
            </>
          )
          if (l.status === "locked") {
            return <span key={l.n} className={cls} style={style}>{inner}</span>
          }
          return (
            <Link
              key={l.n}
              ref={l.status === "current" ? currentRef : undefined}
              className={cls}
              style={style}
              href={`/daily-learn/${topic}/${l.n}`}
            >
              {inner}
            </Link>
          )
        })}
      </div>

      <Image className="qriri" src={mascot} alt="Riri" width={92} height={92} />
    </div>
  )
}
