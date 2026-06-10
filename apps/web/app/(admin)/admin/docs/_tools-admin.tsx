"use client"

import { useState, useTransition } from "react"
import { Eye, EyeOff } from "lucide-react"
import ToolLogo from "@/components/tool-logo"
import { TOOLS } from "@/lib/tool-registry"
import { setToolVisibilityAction } from "./actions"

const DOCS_TOOLS = TOOLS.filter((t) => t.hasDocs)

export default function ToolsAdmin({
  visibility,
  counts,
}: {
  visibility: Record<string, boolean>
  counts: Record<string, number>
}) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DOCS_TOOLS.map((t) => [t.name, visibility[t.name] !== false])),
  )
  const [pending, startTransition] = useTransition()

  function toggle(name: string) {
    const next = !state[name]
    setState((prev) => ({ ...prev, [name]: next }))
    startTransition(async () => {
      await setToolVisibilityAction(name, next)
    })
  }

  const visibleCount = DOCS_TOOLS.filter((t) => state[t.name]).length

  return (
    <div className="glass form-sec" style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h3 style={{ margin: 0 }}>เธเธฒเธฃเนเธชเธ”เธเธเธฅเน€เธเธฃเธทเนเธญเธเธกเธทเธญ</h3>
        <span className="spill ok" style={{ fontSize: 12 }}>
          <Eye size={12} /> {visibleCount} / {DOCS_TOOLS.length} เน€เธเธฃเธทเนเธญเธเธกเธทเธญ
        </span>
      </div>
      <p className="sec-sub" style={{ marginBottom: 18 }}>เน€เธฅเธทเธญเธเน€เธเธฃเธทเนเธญเธเธกเธทเธญเธ—เธตเนเธ•เนเธญเธเธเธฒเธฃเนเธชเธ”เธเนเธเธซเธเนเธฒ /docs</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {DOCS_TOOLS.map((t) => {
          const visible = state[t.name]
          return (
            <div
              key={t.name}
              className="srow"
              style={{ opacity: pending ? 0.7 : 1, transition: "opacity .15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: visible ? t.bg : "var(--cloud-200)",
                    display: "grid", placeItems: "center", color: "#fff",
                    transition: "background .2s",
                  }}
                >
                  <ToolLogo name={t.name} size={19} />
                </div>
                <div className="si-info">
                  <b style={{ color: visible ? "var(--text-strong)" : "var(--text-muted)" }}>{t.name}</b>
                  <span>{counts[t.name] ?? 0} เน€เธญเธเธชเธฒเธฃ</span>
                </div>
              </div>
              <label className="switch" title={visible ? "เธเนเธญเธ" : "เนเธชเธ”เธ"}>
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={() => toggle(t.name)}
                  disabled={pending}
                />
                <span className="track" />
              </label>
            </div>
          )
        })}
      </div>

      {visibleCount === 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 14px", borderRadius: 10, marginTop: 12,
          background: "var(--berry-50)", color: "var(--berry-600)",
          fontSize: 13, fontWeight: 700,
        }}>
          <EyeOff size={15} /> เธเนเธญเธเธ—เธธเธเน€เธเธฃเธทเนเธญเธเธกเธทเธญเนเธฅเนเธง โ€” เธซเธเนเธฒ /docs เธเธฐเธงเนเธฒเธเน€เธเธฅเนเธฒ
        </div>
      )}
    </div>
  )
}
