"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Crown, CheckCircle2, RefreshCw } from "lucide-react"
import "./out-of-hearts.css"

const M = "/assets/daily-ai-lab/mascot-ds"

function pad(n: number) { return String(n).padStart(2, "0") }

/**
 * Full-screen lockout when a Free user has finished today's lesson quota.
 * Positive framing (they just hit their goal!) + live countdown to Bangkok
 * midnight + the Pro upsell. Visual language shared with OutOfHearts.
 */
export default function DailyLimitReached({ limit, nextReset }: { limit: number; nextReset: string }) {
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
    <div className="dlab-ooh" role="alertdialog" aria-label="ครบโควต้าบทเรียนวันนี้">
      <div className="ooh-card">
        <Image className="ooh-mascot" src={`${M}/mascot-celebrate.png`} alt="Riri" width={150} height={150} priority />

        <div className="ooh-hearts" aria-hidden style={{ color: "#14A871" }}>
          {Array.from({ length: Math.min(Math.max(limit, 1), 5) }).map((_, i) => (
            <span key={i}><CheckCircle2 size={22} /></span>
          ))}
        </div>

        {done ? (
          <>
            <h2>วันใหม่ เริ่มเรียนได้เลย!</h2>
            <p>โควต้าบทเรียนของวันนี้พร้อมแล้ว ไปต่อกันเลย</p>
            <div className="ooh-actions">
              <Link className="ooh-btn primary" href="/daily-learn" onClick={() => location.reload()}>
                <RefreshCw size={18} /> เริ่มเรียนต่อ
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2>เก่งมาก! วันนี้ครบ {limit} บทแล้ว 🎉</h2>
            <p>แพ็กเกจ Free เรียนบทใหม่ได้วันละ {limit} บท พรุ่งนี้กลับมาเรียนต่อได้ใน</p>
            <div className="ooh-timer" aria-live="polite">
              {remain === null
                ? <span className="ooh-clock">--:--:--</span>
                : <span className="ooh-clock">{pad(hh)}<i>:</i>{pad(mm)}<i>:</i>{pad(ss)}</span>}
            </div>
            <div className="ooh-actions">
              <Link className="ooh-btn pro" href="/upgrade"><Crown size={18} /> เรียนไม่จำกัดด้วย Pro</Link>
              <Link className="ooh-btn primary" href="/daily-learn"><Home size={18} /> กลับหน้าหลัก</Link>
            </div>
            <p className="ooh-note">
              ระหว่างนี้ยัง<b>ทบทวนบทที่จบแล้ว</b>ได้ทุกบท ไม่นับโควต้า
            </p>
            <span className="ooh-hint">โควต้าจะรีเซ็ตทุกเที่ยงคืนตามเวลาประเทศไทย</span>
          </>
        )}
      </div>
    </div>
  )
}
