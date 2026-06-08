"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { makeT, type Lang } from "@/lib/i18n-core"
import ToolLogo from "@/components/tool-logo"
import { Sparkles, Shield, Zap } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

const M = "/assets/daily-ai-lab/mascot-ds"
const AUTH_TOOLS: [string, string][] = [
  ["#19C37D", "ChatGPT"], ["#FF9A52", "Claude"], ["#2A6FF0", "Gemini"], ["#6C3CF5", "Midjourney"],
  ["#F45C97", "Suno"], ["#1B1729", "Runway"], ["#14A871", "Perplexity"],
]

export default function AuthScreen({ mode, lang = "th" }: { mode: "login" | "signup"; lang?: Lang }) {
  const t = makeT(lang)
  const isSignup = mode === "signup"
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setError("")
    setLoading(true)
    const supabase = createClient()
    const redirect = new URLSearchParams(window.location.search).get("redirect")
    const next = redirect && redirect.startsWith("/") ? redirect : "/daily-learn"
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // on success the browser redirects to Google, so no further action here
  }

  return (
    <div className="dlab-auth">
      <div className="auth">
        {/* brand panel */}
        <div className="auth-brand">
          <Link className="ab-top" href="/">
            <div className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" width={44} height={44} /></div>
            <div>
              <div className="brand-name" style={{ color: "#fff" }}>Daily AI Lab</div>
              <div className="brand-sub" style={{ color: "var(--sun-300)" }}>{t("AI, every day")}</div>
            </div>
          </Link>
          <div className="ab-mid">
            <img className={`ab-mascot${isSignup ? "" : " ab-mascot--lap"}`} src={`${M}/${isSignup ? "mascot-read" : "mascot-laptop"}.png`} alt="Riri" width={240} height={240} />
            <h1 className="display">{t("Learn AI the")}<br />{t("fun way.")} <Sparkles size={32} className="text-amber-300" /></h1>
            <p>{t("Join 120,000+ learners mastering ChatGPT, Claude, Midjourney & more — 15 minutes a day, one lab at a time.")}</p>
            <div className="auth-marquee">
              <div className="auth-marquee-track">
                {[...AUTH_TOOLS, ...AUTH_TOOLS].map(([bg, name], i) => (
                  <span className="am-tool" key={i}><span className="sw" style={{ background: bg }}><ToolLogo name={name} size={14} /></span>{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Google sign-in */}
        <div className="auth-form-wrap">
          <div className="auth-form">
            <Link className="af-brand" href="/">
              <div className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" width={44} height={44} /></div>
              <div className="brand-name">Daily AI Lab</div>
            </Link>

            <h2 className="display">{isSignup ? t("Create your account") : t("Welcome back")}</h2>
            <p className="sub">{t("Sign in with Google in one tap — no password to remember.")}</p>

            {error && <div className="auth-err">{error}</div>}

            <button type="button" className="btn-google" onClick={handleGoogle} disabled={loading}>
              <FcGoogle size={22} />
              {loading ? t("Loading…") : t("Continue with Google")}
            </button>

            <div className="auth-perks">
              <span><Zap size={15} className="text-amber-500" /> {t("Start in seconds")}</span>
              <span><Shield size={15} className="text-emerald-500" /> {t("Secure & private")}</span>
            </div>

            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: 22 }}>
              {t("By continuing you agree to our")} <Link href="/terms">{t("Terms")}</Link> &amp; <Link href="/privacy">{t("Privacy")}</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
