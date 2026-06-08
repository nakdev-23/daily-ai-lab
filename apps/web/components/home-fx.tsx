"use client"

import { useEffect } from "react"

/** Ports site.js from the design handoff: reveal · count-up · parallax · tilt · quiz · confetti. */
export default function HomeFx() {
  useEffect(() => {
    document.documentElement.classList.add("js")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const root = document.querySelector(".dlab-home")
    if (!root) return
    const cleanups: Array<() => void> = []

    /* ---------- console easter egg (devs who peek) ---------- */
    console.log(
      "%cDaily AI Lab  🐤",
      "color:#6C3CF5;font:800 20px 'Baloo 2',system-ui,sans-serif"
    )
    console.log(
      "%cเรียน AI วันละ 15 นาที, you found the console! Curious how Riri is built? Say hi: hello@dailyailab.co",
      "color:#7F779A;font:600 13px system-ui"
    )

    /* ---------- scroll reveal ---------- */
    const reveals = Array.from(root.querySelectorAll<HTMLElement>(".reveal"))
    function show(el: HTMLElement) {
      if (el.classList.contains("in")) return
      const sibs = Array.from(el.parentElement?.querySelectorAll<HTMLElement>(":scope > .reveal") ?? [])
      const idx = Math.max(0, sibs.indexOf(el))
      el.style.animationDelay = (idx % 6) * 70 + "ms"
      el.classList.add("in")
      setTimeout(() => el.classList.add("shown"), 780 + (idx % 6) * 70)
    }
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { show(e.target as HTMLElement); io.unobserve(e.target) } })
      }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" })
      reveals.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    }
    const fallback = setTimeout(() => reveals.forEach((el) => el.classList.add("in", "shown")), 1500)
    cleanups.push(() => clearTimeout(fallback))

    /* ---------- nav elevation on scroll (state feedback) ---------- */
    const sentinel = root.querySelector(".nav-sentinel")
    const nav = root.querySelector(".nav")
    if (sentinel && nav && "IntersectionObserver" in window) {
      const navIO = new IntersectionObserver(
        ([e]) => nav.classList.toggle("scrolled", !e.isIntersecting),
        { threshold: 0 }
      )
      navIO.observe(sentinel)
      cleanups.push(() => navIO.disconnect())
    }

    /* ---------- count-up ---------- */
    function countUp(el: HTMLElement) {
      if (el.dataset.counted) return
      el.dataset.counted = "1"
      const raw = el.getAttribute("data-count") || "0"
      const target = parseFloat(raw)
      const suffix = el.getAttribute("data-suffix") || ""
      const decimals = raw.indexOf(".") >= 0 ? 1 : 0
      const dur = 1400
      let start: number | null = null
      const fmt = (n: number) => (decimals ? n.toFixed(1) : Math.round(n).toLocaleString()) + suffix
      if (reduce) { el.textContent = fmt(target); return }
      const frame = (t: number) => {
        if (start === null) start = t
        const p = Math.min(1, (t - start) / dur)
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(frame)
        else el.textContent = fmt(target)
      }
      requestAnimationFrame(frame)
    }
    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"))
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { countUp(e.target as HTMLElement); cio.unobserve(e.target) } })
      }, { threshold: 0.4 })
      counters.forEach((el) => cio.observe(el))
      cleanups.push(() => cio.disconnect())
    } else counters.forEach(countUp)

    /* ---------- hero parallax ---------- */
    if (!reduce) {
      const stage = root.querySelector<HTMLElement>(".stage")
      if (stage) {
        const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-depth]"))
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          layers.forEach((l) => {
            const d = parseFloat(l.getAttribute("data-depth") || "0")
            l.style.transform = `translate(${nx * d}px,${ny * d}px)`
          })
        }
        const onLeave = () => layers.forEach((l) => { l.style.transform = "" })
        stage.addEventListener("pointermove", onMove)
        stage.addEventListener("pointerleave", onLeave)
        cleanups.push(() => { stage.removeEventListener("pointermove", onMove); stage.removeEventListener("pointerleave", onLeave) })
      }
    }

    /* ---------- 3D tilt cards ---------- */
    if (!reduce) {
      Array.from(root.querySelectorAll<HTMLElement>(".tilt")).forEach((card) => {
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          card.style.transform = `perspective(760px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-5px)`
        }
        const onLeave = () => { card.style.transform = "" }
        card.addEventListener("pointermove", onMove)
        card.addEventListener("pointerleave", onLeave)
        cleanups.push(() => { card.removeEventListener("pointermove", onMove); card.removeEventListener("pointerleave", onLeave) })
      })
    }

    /* ---------- interactive quiz ---------- */
    const quiz = root.querySelector<HTMLElement>(".quiz")
    if (quiz) {
      const opts = Array.from(quiz.querySelectorAll<HTMLElement>(".opt"))
      const hearts = Array.from(quiz.querySelectorAll<HTMLElement>(".hearts span"))
      const fb = quiz.querySelector<HTMLElement>(".fb")
      const xp = quiz.querySelector<HTMLElement>(".xp-pop")
      const riri = quiz.querySelector<HTMLElement>(".quiz-riri")
      const resetBtn = quiz.querySelector<HTMLElement>(".quiz-reset")
      const bar = quiz.querySelector<HTMLElement>(".qbar > i")
      let heartIdx = 0, answered = false
      const lock = () => opts.forEach((o) => o.classList.add("disabled"))
      const pick = (o: HTMLElement) => {
        if (answered) return
        if (o.getAttribute("data-correct") === "1") {
          answered = true; lock(); o.classList.add("correct")
          if (fb) { fb.textContent = "ถูกต้อง! เก่งมาก 🎉"; fb.style.color = "var(--mint-600)"; fb.classList.add("show") }
          xp?.classList.add("show"); riri?.classList.add("show")
          if (bar) bar.style.width = "78%"
        } else {
          o.classList.add("wrong"); setTimeout(() => o.classList.remove("wrong"), 500)
          if (heartIdx < hearts.length) { hearts[hearts.length - 1 - heartIdx].classList.add("lost"); heartIdx++ }
          if (fb) { fb.textContent = "ยังไม่ใช่ ลองใหม่อีกที 💪"; fb.style.color = "var(--berry-600)"; fb.classList.add("show") }
        }
      }
      const handlers = opts.map((o) => { const h = () => pick(o); o.addEventListener("click", h); return [o, h] as const })
      const onReset = () => {
        answered = false; heartIdx = 0
        opts.forEach((o) => o.classList.remove("correct", "wrong", "disabled"))
        hearts.forEach((h) => h.classList.remove("lost"))
        fb?.classList.remove("show"); xp?.classList.remove("show"); riri?.classList.remove("show")
        if (bar) bar.style.width = "60%"
      }
      resetBtn?.addEventListener("click", onReset)
      cleanups.push(() => {
        handlers.forEach(([o, h]) => o.removeEventListener("click", h))
        resetBtn?.removeEventListener("click", onReset)
      })
    }

    /* ---------- Riri pops when you click her (discovery reward) ---------- */
    const mascot = root.querySelector<HTMLElement>(".mascot")
    if (mascot && !reduce) {
      const onPop = () => {
        mascot.animate(
          [
            { transform: "scale(1) rotate(0deg)" },
            { transform: "scale(1.1) rotate(-5deg)" },
            { transform: "scale(0.95) rotate(4deg)" },
            { transform: "scale(1.03) rotate(-2deg)" },
            { transform: "scale(1) rotate(0deg)" },
          ],
          { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        )
      }
      mascot.addEventListener("click", onPop)
      cleanups.push(() => mascot.removeEventListener("click", onPop))
    }

    /* ---------- confetti ---------- */
    const burstBtn = root.querySelector<HTMLElement>("[data-confetti]")
    if (burstBtn && !reduce) {
      const COLORS = ["#6C3CF5", "#FFD43A", "#F45C97", "#2A8CF0", "#14A871", "#FD7302"]
      const burst = () => {
        const host = root.querySelector<HTMLElement>(".final-card")
        if (!host) return
        const br = burstBtn.getBoundingClientRect(), hr = host.getBoundingClientRect()
        const ox = br.left - hr.left + br.width / 2, oy = br.top - hr.top + br.height / 2
        for (let i = 0; i < 26; i++) {
          const c = document.createElement("i")
          c.className = "confetti"
          c.style.background = COLORS[i % COLORS.length]
          c.style.left = ox + "px"; c.style.top = oy + "px"
          host.appendChild(c)
          const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 150
          const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 60
          c.animate(
            [{ transform: "translate(0,0) rotate(0deg)", opacity: 1 },
             { transform: `translate(${dx}px,${dy + 220}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }],
            { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
          ).onfinish = () => c.remove()
        }
      }
      burstBtn.addEventListener("click", burst)
      burstBtn.addEventListener("mouseenter", burst)
      cleanups.push(() => { burstBtn.removeEventListener("click", burst); burstBtn.removeEventListener("mouseenter", burst) })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return null
}
