"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Lang = "th" | "en"

// `current` is read on the server (from cookie) and passed in, so the first
// client render matches the server render — no hydration mismatch.
export default function LangToggle({ current = "th", className = "", variant = "light" }: { current?: Lang; className?: string; variant?: "light" | "dark" }) {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>(current)

  function choose(l: Lang) {
    if (l === lang) return
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`
    setLang(l)
    router.refresh()
  }

  const isDark = variant === "dark"
  const wrap: React.CSSProperties = {
    display: "inline-flex", padding: 3, borderRadius: 999, gap: 2,
    background: isDark ? "rgba(255,255,255,.16)" : "var(--cloud-100, #EFEBF7)",
    border: isDark ? "1px solid rgba(255,255,255,.18)" : "1px solid var(--border-subtle, #E0DAEF)",
  }
  const btn = (active: boolean): React.CSSProperties => ({
    border: 0, cursor: "pointer", height: 34, minWidth: 38, padding: "0 10px", borderRadius: 999,
    fontFamily: "var(--font-display, inherit)", fontWeight: 800, fontSize: 12.5, lineHeight: 1,
    transition: "all .15s",
    background: active ? "#fff" : "transparent",
    color: active ? "var(--hero-600, #5728E0)" : (isDark ? "rgba(255,255,255,.85)" : "var(--cloud-500, #7F779A)"),
    boxShadow: active ? "0 2px 6px rgba(39,16,96,.12)" : "none",
  })

  return (
    <div className={className} style={wrap} role="group" aria-label="Language">
      <button type="button" style={btn(lang === "th")} onClick={() => choose("th")} aria-pressed={lang === "th"}>ไทย</button>
      <button type="button" style={btn(lang === "en")} onClick={() => choose("en")} aria-pressed={lang === "en"}>EN</button>
    </div>
  )
}
