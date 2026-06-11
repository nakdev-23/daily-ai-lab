import type { CSSProperties, ReactNode } from "react"

/** A single shimmering skeleton block. Server component — pure markup. */
export function Sk({
  w = "100%",
  h = 14,
  r = 8,
  circle = false,
  style,
}: {
  w?: number | string
  h?: number | string
  r?: number
  circle?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      className={`sk${circle ? " sk-circle" : ""}`}
      style={{ width: w, height: h, borderRadius: circle ? 999 : r, ...style }}
    />
  )
}

/** Flex helper for laying skeleton blocks out in a row. */
export function SkRow({ children, gap = 12, style }: { children: ReactNode; gap?: number; style?: CSSProperties }) {
  return <div style={{ display: "flex", alignItems: "center", gap, ...style }}>{children}</div>
}

/** Vertical stack helper. */
export function SkCol({ children, gap = 10, style }: { children: ReactNode; gap?: number; style?: CSSProperties }) {
  return <div style={{ display: "flex", flexDirection: "column", gap, minWidth: 0, ...style }}>{children}</div>
}
