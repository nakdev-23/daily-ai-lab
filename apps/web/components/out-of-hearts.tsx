"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Home, Crown, RefreshCw } from "lucide-react"
import "./out-of-hearts.css"

const M = "/assets/daily-ai-lab/mascot-ds"

function pad(n: number) { return String(n).padStart(2, "0") }

/**
 * Full-screen lockout shown when a Free user runs out of hearts. Live countdown
 * to the next refill; can't keep learning until a heart returns (or go Pro).
 */
export default function OutOfHearts({ nextRefill, max = 5 }: { nextRefill: string | null; max?: number }) {
  const target = nextRefill ? new Date(nextRefill).getTime() : 0
  const [remain, setRemain] = useState<number | null>(null)

  useEffect(() => {
    if (!target) return
    const tick = () => setRemain(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const done = remain !== null && remain <= 0
  const hh = remain ? Math.floor(remain / 3600000) : 0
  const mm = remain ? Math.floor((remain % 3600000) / 60000) : 0
  const ss = remain ? Math.floor((remain % 60000) / 1000) : 0

  // The next refill is the daily reset boundary — show it in Bangkok time (UTC+7).
  const resetClock = (() => {
    if (!target) return null
    const bkk = new Date(target + 7 * 3600 * 1000)
    const h = bkk.getUTCHours(), m = bkk.getUTCMinutes()
    const hm = `${pad(h)}:${pad(m)}`
    return h === 0 && m === 0 ? `เที่ยงคืน (${hm} น.)` : `${hm} น.`
  })()

  return (
    <div className="dlab-ooh" role="alertdialog" aria-label="หัวใจหมด">
      <div className="ooh-card">
        <Image className="ooh-mascot" src={`${M}/mascot-sad.png`} alt="Riri" width={150} height={150} priority />

        <div className="ooh-hearts" aria-hidden>
          {Array.from({ length: max }).map((_, i) => (
            <span key={i} className={done && i === 0 ? "" : "lost"}><Heart size={22} fill="currentColor" /></span>
          ))}
        </div>

        {done ? (
          <>
            <h2>หัวใจเต็มแล้ว! 💜</h2>
            <p>กลับไปเรียนต่อได้เลย วันนี้ยังมีอีกหลายบทรอคุณอยู่</p>
            <div className="ooh-actions">
              <Link className="ooh-btn primary" href="/daily-learn" onClick={() => location.reload()}>
                <RefreshCw size={18} /> เริ่มเรียนต่อ
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>หัวใจหมดแล้ว!</h2>
            <p>พักก่อนนะ หัวใจจะเต็มใหม่อีกครั้งใน</p>
            <div className="ooh-timer" aria-live="polite">
              {remain === null
                ? <span className="ooh-clock">--:--:--</span>
                : <span className="ooh-clock">{pad(hh)}<i>:</i>{pad(mm)}<i>:</i>{pad(ss)}</span>}
            </div>
            <div className="ooh-actions">
              <Link className="ooh-btn primary" href="/daily-learn"><Home size={18} /> กลับหน้าหลัก</Link>
              <Link className="ooh-btn pro" href="/upgrade"><Crown size={18} /> หัวใจไม่จำกัดด้วย Pro</Link>
            </div>
            {resetClock && (
              <p className="ooh-note">
                หัวใจจะเต็มใหม่ให้อัตโนมัติทุกวัน เวลา{resetClock} ตามเวลาประเทศไทย
              </p>
            )}
            <span className="ooh-hint">ระหว่างนี้จะยังเรียนบทอื่นไม่ได้จนกว่าหัวใจจะกลับมา</span>
          </>
        )}
      </div>
    </div>
  )
}
