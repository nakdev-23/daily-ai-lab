"use client"

import Image from "next/image"
import { useState, useTransition } from "react"
import { Check, X, Crown, CreditCard, RefreshCw, BookOpen, Sparkles } from "lucide-react"
import { makeT, type Lang } from "@/lib/i18n-core"
import { createCheckoutSession } from "./actions"

const M = "/assets/daily-ai-lab/mascot-ds"

export default function UpgradeClient({ priceMonth, priceYear, freePerDay, lang }: { priceMonth: number; priceYear: number; freePerDay: number; lang: Lang }) {
  const t = makeT(lang)
  const [bill, setBill] = useState<"month" | "year">("month")
  const [err, setErr] = useState(false)
  const [pending, startTransition] = useTransition()

  const FREE_FEATURES = [
    { yes: true, t: t("{n} lessons per day", { n: freePerDay }) }, { yes: true, t: t("XP, streaks & leaderboard") }, { yes: true, t: t("Beginner docs library") },
    { yes: false, t: t("Career paths") }, { yes: false, t: t("Unlimited hearts") }, { yes: false, t: t("Streak freeze") },
  ]
  const PRO_FEATURES = [
    t("Unlimited lessons"), t("All career paths"), t("Full documentation library"),
    t("Unlimited hearts"), t("Streak freeze & Pro badges"), t("No ads"),
  ]

  const CMP: ({ grp: string } | { feat: string; free: string | boolean; pro: string | boolean })[] = [
    { grp: t("Learning") },
    { feat: t("Lessons per day"), free: t("{n} lessons", { n: freePerDay }), pro: t("Unlimited") },
    { feat: t("Career paths"), free: false, pro: true },
    { feat: t("Docs library"), free: t("Beginner"), pro: t("Every level") },
    { feat: t("Practice mode"), free: false, pro: true },
    { grp: t("Game & hearts") },
    { feat: t("Hearts"), free: t("{n} hearts", { n: 5 }), pro: t("Unlimited") },
    { feat: t("Streak freeze"), free: false, pro: true },
    { feat: t("Exclusive Pro badges"), free: false, pro: true },
    { grp: t("Others") },
    { feat: t("No ads"), free: false, pro: true },
    { feat: t("Certificate on completion"), free: false, pro: true },
    { feat: t("Priority support"), free: false, pro: true },
  ]

  // Yearly is shown as an effective per-month price; savings vs paying monthly.
  const yearlyPerMonth = Math.round(priceYear / 12)
  const savePct = priceMonth > 0 ? Math.round((1 - priceYear / (priceMonth * 12)) * 100) : 0

  const price = bill === "month" ? `฿${priceMonth.toLocaleString()}` : `฿${yearlyPerMonth.toLocaleString()}`
  const sub = bill === "month"
    ? t("Billed monthly · cancel anytime")
    : t("Billed ฿{year}/year · save ~{pct}%", { year: priceYear.toLocaleString(), pct: savePct })

  const FAQ = [
    { ic: CreditCard, q: t("How do I pay? Can I cancel?"), a: t("We accept credit/debit cards and PromptPay. Cancel anytime from Settings — Pro stays active until the end of the period you paid for, no penalty.") },
    { ic: RefreshCw, q: t("Can I switch between monthly and yearly?"), a: t("Yes, switch anytime and we prorate the difference automatically. Yearly saves about {pct}%.", { pct: savePct }) },
    { ic: BookOpen, q: t("Will I lose my progress if I upgrade?"), a: t("Never. Your XP, streaks, badges and finished lessons all stay — upgrading just unlocks more content and features instantly.") },
  ]

  function upgrade() {
    setErr(false)
    startTransition(async () => {
      try {
        // Redirects to Stripe Checkout on success.
        await createCheckoutSession(bill)
      } catch {
        setErr(true)
        setTimeout(() => setErr(false), 4000)
      }
    })
  }

  return (
    <>
      <div className="up-hero">
        <Image className="up-mascot" src={`${M}/cockatiel-superhero.png`} alt="Riri Pro" width={120} height={120} />
        <h1>{t("Unlock your full potential with")} <span className="grad-text">Pro</span></h1>
        <p>{t("Unlimited lessons, every career path, unlimited hearts and more.")}</p>
        <div className="bill-toggle">
          <button className={bill === "month" ? "on" : ""} onClick={() => setBill("month")}>{t("Monthly")}</button>
          <button className={bill === "year" ? "on" : ""} onClick={() => setBill("year")}>{t("Yearly")} <span className="save-tag">{t("Save ~{pct}%", { pct: savePct })}</span></button>
        </div>
      </div>

      <div className="plan-grid">
        <div className="plan2 free">
          <div className="pp-name">Free</div>
          <div className="pp-desc">{t("For getting started")}</div>
          <div className="pp-cost">฿0</div>
          <div className="pp-sub">{t("Free forever")}</div>
          <ul className="pp-list">
            {FREE_FEATURES.map((f) => (
              <li key={f.t} className={f.yes ? "" : "off"}>
                <span className={`ck ${f.yes ? "yes" : "no"}`}>{f.yes ? <Check size={13} /> : <X size={13} />}</span> {f.t}
              </li>
            ))}
          </ul>
          <button className="btn btn--ghost lg" style={{ width: "100%" }} disabled>{t("Current plan")}</button>
        </div>

        <div className="plan2 pro">
          <span className="pp-pop"><Sparkles size={13} /> {t("Best value")}</span>
          <div className="pp-name">Pro</div>
          <div className="pp-desc">{t("For serious learners")}</div>
          <div className="pp-cost">{price}<small> /{t("mo")}</small></div>
          <div className="pp-sub">{sub}</div>
          <ul className="pp-list">
            {PRO_FEATURES.map((f) => (
              <li key={f}><span className="ck yes"><Check size={13} /></span> {f}</li>
            ))}
          </ul>
          <button className="btn btn--sun lg" style={{ width: "100%" }} onClick={upgrade} disabled={pending}><Crown size={18} /> {pending ? t("Redirecting…") : t("Upgrade to Pro")}</button>
        </div>
      </div>

      <div className="cmp-wrap">
        <h2 className="cmp-title">{t("Full comparison")}</h2>
        <table className="cmp">
          <thead><tr><th>{t("Feature")}</th><th className="col">Free</th><th className="col pro">Pro</th></tr></thead>
          <tbody>
            {CMP.map((r, i) =>
              "grp" in r ? (
                <tr key={i} className="grp"><td colSpan={3}>{r.grp}</td></tr>
              ) : (
                <tr key={i}>
                  <td className="feat">{r.feat}</td>
                  <td className="val">{typeof r.free === "boolean" ? (r.free ? <Check className="yes" size={18} /> : <X className="no" size={16} />) : r.free}</td>
                  <td className="val">{typeof r.pro === "boolean" ? (r.pro ? <Check className="yes" size={18} /> : <X className="no" size={16} />) : r.pro}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div className="faq-wrap">
        <h2 className="cmp-title">{t("Frequently asked questions")}</h2>
        {FAQ.map((f, i) => (
          <details key={i} className="faq-q" open={i === 0}>
            <summary><span className="qic"><f.ic size={15} /></span> {f.q} <span className="qm">+</span></summary>
            <div className="faq-a">{f.a}</div>
          </details>
        ))}
      </div>

      <div className="up-cta">
        <h2>{t("Ready to learn AI without limits?")}</h2>
        <p>{t("Try Pro today — cancel anytime")}</p>
        <button className="btn btn--violet lg" onClick={upgrade} disabled={pending}><Crown size={18} /> {pending ? t("Redirecting…") : t("Upgrade to Pro")}</button>
      </div>

      {err && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "var(--berry-600)", color: "#fff", padding: "13px 22px", borderRadius: 999, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14.5, boxShadow: "0 16px 34px -10px rgba(0,0,0,.4)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <X size={16} /> {t("Couldn't start checkout — try again")}
        </div>
      )}
    </>
  )
}
