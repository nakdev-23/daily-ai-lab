"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Top-of-screen navigation progress bar (NProgress-style, no dependency).
 *
 * Starts the moment an internal link to a *different* path is clicked, trickles
 * toward 92% while the next route streams in, then completes when the pathname
 * commits. This gives instant "something is happening" feedback even before a
 * route's loading.tsx skeleton paints, and covers cross-route-group navigation
 * where a shared layout fallback wouldn't.
 */
export default function NavProgress() {
  const pathname = usePathname()
  const barRef = useRef<HTMLDivElement | null>(null)
  const trickle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const value = useRef(0)
  const active = useRef(false)

  const render = (v: number, opacity = 1) => {
    value.current = v
    const el = barRef.current
    if (!el) return
    el.style.opacity = String(opacity)
    el.style.transform = `scaleX(${v})`
  }

  const start = () => {
    if (active.current) return
    active.current = true
    render(0.08)
    const tick = () => {
      const v = value.current
      render(Math.min(v + (0.92 - v) * 0.12, 0.92))
      trickle.current = setTimeout(tick, 280)
    }
    trickle.current = setTimeout(tick, 280)
  }

  const finish = () => {
    if (!active.current) return
    active.current = false
    if (trickle.current) clearTimeout(trickle.current)
    render(1)
    setTimeout(() => render(value.current, 0), 220) // fade out at full width
    setTimeout(() => render(0, 0), 540) // reset width while hidden
  }

  // The new segment has committed once the pathname changes — complete the bar.
  // start/finish only touch refs, so they're stable; no need in deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { finish() }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return
      const href = a.getAttribute("href")
      if (!href || href.startsWith("#")) return
      let url: URL
      try { url = new URL(a.href, window.location.href) } catch { return }
      // Internal, and actually going somewhere new (ignore same-page / query / hash).
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return
      start()
    }
    const onPop = () => start()
    document.addEventListener("click", onClick, true)
    window.addEventListener("popstate", onPop)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("popstate", onPop)
      if (trickle.current) clearTimeout(trickle.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={barRef} className="nav-progress" aria-hidden="true" />
}
