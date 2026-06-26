"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Crown, CheckCircle2, RefreshCw, Rocket } from "lucide-react"
import { makeT, type Lang } from "@/lib/i18n-core"
import "./out-of-hearts.css"

const M = "/assets/daily-ai-lab/mascot-ds"

function pad(n: number) { return String(n).padStart(2, "0") }

/**
 * Full-screen lockout when a Free user has finished today's lesson quota.
 * Positive framing (they just hit their goal!) + live countdown to Bangkok
 * midnight + the Pro upsell. Visual language shared with OutOfHearts.
 */
export default function DailyLimitReached({ limit, nextReset, lang = "th" }: { limit: number; nextReset: string; lang?: Lang }) {
  const t = makeT(lang)
  const target = new Date(nextReset).getTime()
  const [remain, setRemain] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setRemain(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const done = remain !== null && remain <= 0
  const hh = remain ? Math.floor(remain / 3600000) : 0
  const mm = remain ? Math.floor((remain % 3600000) / 60000) : 0
  const ss = remain ? Math.floor((remain % 60000) / 1000) : 0

  return (
    <div className="dlab-ooh" role="alertdialog" aria-label={t("Daily lesson quota reached")}>
      <div className="ooh-card">
        <Image className="ooh-mascot" src={`${M}/mascot-celebrate.png`} alt="Riri" width={150} height={150} priority />

        <div className="ooh-hearts" aria-hidden style={{ color: "#14A871" }}>
          {Array.from({ length: Math.min(Math.max(limit, 1), 5) }).map((_, i) => (
            <span key={i}><CheckCircle2 size={22} /></span>
          ))}
        </div>

        {done ? (
          <>
            <h2>{t("A new day — let's learn!")}</h2>
            <p>{t("Today's lesson quota is ready. Keep going!")}</p>
            <div className="ooh-actions">
              <Link className="ooh-btn primary" href="/daily-learn" onClick={() => location.reload()}>
                <RefreshCw size={18} /> {t("Keep learning")}
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>{t("Amazing! {n} lessons done today 🎉", { n: limit })}</h2>
            <p>{t("Free plan covers {n} new lessons a day. Come back tomorrow in", { n: limit })}</p>
            <div className="ooh-timer" aria-live="polite">
              {remain === null
                ? <span className="ooh-clock">--:--:--</span>
                : <span className="ooh-clock">{pad(hh)}<i>:</i>{pad(mm)}<i>:</i>{pad(ss)}</span>}
            </div>
            <div className="ooh-actions">
              <Link className="ooh-btn pro" href="/upgrade?reason=daily_limit"><Crown size={18} /> {t("Keep learning now with Pro")}</Link>
              <Link className="ooh-btn primary" href="/paths"><Rocket size={18} /> {t("See unlocked Career Paths")}</Link>
            </div>
            <p className="ooh-note">
              {t("Meanwhile you can still replay any finished lesson — replays don't count against the quota.")}
            </p>
            <span className="ooh-hint">{t("The quota resets at midnight, Thailand time.")}</span>
          </>
        )}
      </div>
    </div>
  )
}
