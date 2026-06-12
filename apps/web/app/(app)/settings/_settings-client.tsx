"use client"

import { useState, useActionState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { makeT, type Lang } from "@/lib/i18n-core"
import {
  User, Target, Bell, Palette, Crown, AlertTriangle,
  Sun, Moon, Monitor, LogOut, Check,
} from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import Switch from "@/components/switch"
import { updateDisplayName, cancelSubscription, resumeSubscription, updateAvatar, type SettingsResult } from "./actions"

const AV = "/assets/daily-ai-lab/avatars"
const AVATARS = ["heart", "celebrate", "thumbsup", "graduate", "wave", "cool", "read", "think", "yawn", "sad", "sleep"]

// Read the chosen Riri avatar from localStorage in an SSR-safe way: the server
// snapshot is null (matches the first client paint, so no hydration mismatch),
// then it updates to the stored value and on every "dlab-avatar-change" event.
function subscribeAvatar(cb: () => void) {
  window.addEventListener("dlab-avatar-change", cb)
  window.addEventListener("storage", cb)
  return () => {
    window.removeEventListener("dlab-avatar-change", cb)
    window.removeEventListener("storage", cb)
  }
}
function useAvatarSel(fallback: string | null): string | null {
  return useSyncExternalStore(
    subscribeAvatar,
    () => window.localStorage.getItem("dlab-avatar") ?? fallback,
    () => fallback,
  )
}

type SubInfo = { since: string; until: string; cancelAtPeriodEnd: boolean }
type Props = { lang: Lang; displayName: string; email: string; avatar: string | null; proPrice: number; plan: "free" | "pro"; subscription: SubInfo | null; avatarKey: string | null }

export default function SettingsClient({ lang, displayName, email, avatar, proPrice, plan, subscription, avatarKey }: Props) {
  const router = useRouter()
  const t = makeT(lang)
  const [goal, setGoal] = useState(1)
  const [theme, setTheme] = useState(0)
  const [nameState, saveName, savingName] = useActionState<SettingsResult, FormData>(updateDisplayName, null)
  // Hide the "saved" hint as soon as the user edits again (cleared on submit).
  const [nameEdited, setNameEdited] = useState(false)
  // Cancel-subscription flow: confirmation modal + server action result.
  const [showCancel, setShowCancel] = useState(false)
  const [cancelState, cancelSub, cancelling] = useActionState<SettingsResult, FormData>(cancelSubscription, null)
  // Resume flow: turn auto-renew back on before the period ends.
  const [resumeState, resumeSub, resuming] = useActionState<SettingsResult, FormData>(resumeSubscription, null)
  // Chosen Riri avatar. DB key (avatarKey) is the source of truth; localStorage
  // gives instant cross-component updates without a reload.
  const avatarSel = useAvatarSel(avatarKey)

  function pickAvatar(key: string) {
    // Instant UI everywhere via the store, then persist to the DB so it shows on
    // the leaderboard / other devices too.
    localStorage.setItem("dlab-avatar", key)
    window.dispatchEvent(new Event("dlab-avatar-change"))
    updateAvatar(key).catch(() => {})
  }

  const currentAvatar = avatarSel ? `${AV}/avatar-${avatarSel}.png` : avatar

  const NAV = [
    { href: "#account", label: t("Account"), icon: User },
    { href: "#learning", label: t("Learning"), icon: Target },
    { href: "#notif", label: t("Notifications"), icon: Bell },
    { href: "#appearance", label: t("Theme"), icon: Palette },
    { href: "#subscription", label: t("Plan"), icon: Crown },
    { href: "#danger", label: t("Security"), icon: AlertTriangle },
  ]
  // Sections temporarily hidden from the UI (Learning, Notifications, Theme).
  // Code is kept intact — empty this list to bring them back.
  const HIDDEN = ["#learning", "#notif", "#appearance"]
  const visibleNav = NAV.filter((n) => !HIDDEN.includes(n.href))

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="settings-wrap">
      <nav className="set-nav">
        {visibleNav.map((n, i) => (
          <a key={n.href} href={n.href} className={i === 0 ? "active" : ""}><n.icon size={17} /> {n.label}</a>
        ))}
      </nav>

      <div className="set-main">
        {/* Account */}
        <section className="set-card glass" id="account">
          <div className="sc-head"><h3 className="display"><User size={20} /> {t("Account")}</h3><p>{t("Your Google account and profile")}</p></div>

          {/* connected Google account */}
          <div className="set-google">
            {currentAvatar
              ? <Image className="sg-av" src={currentAvatar} alt={displayName} width={48} height={48} unoptimized />
              : <span className="sg-av sg-av-fallback">{displayName.charAt(0)}</span>}
            <div className="sg-info">
              <b>{displayName}</b>
              <span>{email}</span>
            </div>
            <span className="sg-badge"><FcGoogle size={16} /> {t("Google")} <Check size={13} className="text-emerald-500" /></span>
          </div>

          {/* avatar picker */}
          <div className="set-row set-row--col">
            <div className="sr-info"><b>{t("Profile photo")}</b><span>{t("Pick a Riri avatar — no upload needed")}</span></div>
            <div className="avatar-picker">
              {AVATARS.map((k) => (
                <button key={k} type="button" className={`av-opt${avatarSel === k ? " sel" : ""}`} onClick={() => pickAvatar(k)} aria-pressed={avatarSel === k} title={k}>
                  <Image src={`${AV}/avatar-${k}.png`} alt={k} width={64} height={64} />
                  {avatarSel === k && <span className="av-check"><Check size={14} /></span>}
                </button>
              ))}
            </div>
          </div>

          <form className="set-row" action={saveName} onSubmit={() => setNameEdited(false)}>
            <div className="sr-info"><b>{t("Display name")}</b><span>{t("What friends and the leaderboard see")}</span></div>
            <div className="sr-ctrl" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input className="set-input" type="text" name="display_name" defaultValue={displayName} maxLength={40} required onChange={() => setNameEdited(true)} />
              <button type="submit" className="btn btn--violet sm" disabled={savingName}>{savingName ? t("Saving…") : t("Save")}</button>
              {nameState?.ok && !nameEdited && <span style={{ color: "var(--mint-600)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={14} /> {nameState.message}</span>}
              {nameState && !nameState.ok && <span style={{ color: "var(--berry-600)", fontSize: 13 }}>{nameState.message}</span>}
            </div>
          </form>
          <div className="set-row"><div className="sr-info"><b>{t("Email")}</b><span>{t("From your Google account — can't be changed here")}</span></div><div className="sr-ctrl"><input className="set-input" type="email" value={email} readOnly style={{ background: "var(--cloud-50)", color: "var(--text-muted)" }} /></div></div>
        </section>

        {/* Learning */}
        {!HIDDEN.includes("#learning") && (
        <section className="set-card glass" id="learning">
          <div className="sc-head"><h3 className="display"><Target size={20} /> {t("Learning")}</h3><p>{t("Set your goal and learning language")}</p></div>
          <div className="set-row">
            <div className="sr-info"><b>{t("Daily goal")}</b><span>{t("How much XP you aim for each day")}</span></div>
            <div className="sr-ctrl goalseg">
              {[t("Chill · 10"), t("Normal · 30"), t("Serious · 50"), t("Intense · 100")].map((g, i) => (
                <button key={g} className={goal === i ? "active" : ""} onClick={() => setGoal(i)}>{g}</button>
              ))}
            </div>
          </div>
          <div className="set-row"><div className="sr-info"><b>{t("Lesson language")}</b><span>{t("Main language for content")}</span></div><div className="sr-ctrl"><select className="set-input"><option>{t("Thai (default)")}</option><option>English</option><option>{t("Thai + English")}</option></select></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Sound effects")}</b><span>{t("Sounds for right/wrong answers and XP")}</span></div><div className="sr-ctrl"><Switch defaultChecked /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Practice mode")}</b><span>{t("Review old lessons without losing hearts")}</span></div><div className="sr-ctrl"><Switch defaultChecked /></div></div>
        </section>
        )}

        {/* Notifications */}
        {!HIDDEN.includes("#notif") && (
        <section className="set-card glass" id="notif">
          <div className="sc-head"><h3 className="display"><Bell size={20} /> {t("Notifications")}</h3><p>{t("Reminders to learn and keep your streak")}</p></div>
          <div className="set-row"><div className="sr-info"><b>{t("Streak reminder")}</b><span>{t("Notify if you haven't learned today")}</span></div><div className="sr-ctrl"><Switch defaultChecked /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Reminder time")}</b><span>{t("When Riri reminds you daily")}</span></div><div className="sr-ctrl"><input className="set-input" type="time" defaultValue="19:00" style={{ minWidth: 130 }} /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Leaderboard updates")}</b><span>{t("When your rank changes")}</span></div><div className="sr-ctrl"><Switch defaultChecked /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Newsletter")}</b><span>{t("New tools, features and promos")}</span></div><div className="sr-ctrl"><Switch /></div></div>
        </section>
        )}

        {/* Appearance */}
        {!HIDDEN.includes("#appearance") && (
        <section className="set-card glass" id="appearance">
          <div className="sc-head"><h3 className="display"><Palette size={20} /> {t("Theme & display")}</h3><p>{t("Make it look the way you like")}</p></div>
          <div className="set-row">
            <div className="sr-info"><b>{t("Color mode")}</b><span>{t("Light, dark or system")}</span></div>
            <div className="sr-ctrl seg">
              {([[t("Light"), Sun], [t("Dark"), Moon], [t("System"), Monitor]] as const).map(([label, Icon], i) => (
                <button key={label} className={theme === i ? "active" : ""} onClick={() => setTheme(i)}>
                  <Icon size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 5 }} />{label}
                </button>
              ))}
            </div>
          </div>
          <div className="set-row"><div className="sr-info"><b>{t("Reduce motion")}</b><span>{t("Turn off animations for a calmer feel")}</span></div><div className="sr-ctrl"><Switch /></div></div>
        </section>
        )}

        {/* Subscription */}
        <section className="set-card glass" id="subscription">
          <div className="sc-head"><h3 className="display"><Crown size={20} className="text-amber-500" /> {t("Subscription")}</h3><p>{t("Manage your Pro plan and billing")}</p></div>
          {plan === "pro" ? (
            <>
              <div className="set-row">
                <div className="sr-info"><b>{t("Current plan")}</b><span>{t("Unlimited lessons, all career paths and unlimited hearts.")}</span></div>
                <div className="sr-ctrl"><span className="sg-badge"><Crown size={14} className="text-amber-500" /> Pro</span></div>
              </div>

              {subscription?.since && (
                <div className="set-row"><div className="sr-info"><b>{t("Subscribed on")}</b><span>{subscription.since}</span></div></div>
              )}

              {subscription?.until && (subscription.cancelAtPeriodEnd ? (
                <div className="set-row">
                  <div className="sr-info"><b>{t("Subscription ending")}</b><span>{t("Pro stays active until {date}, then switches to Free", { date: subscription.until })}</span></div>
                  <div className="sr-ctrl">
                    <form action={resumeSub}>
                      <button type="submit" className="btn btn--violet sm" disabled={resuming}>
                        <Crown size={15} /> {resuming ? t("Resuming…") : t("Resume subscription")}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="set-row"><div className="sr-info"><b>{t("Next billing date")}</b><span>{subscription.until}</span></div></div>
              ))}

              {[cancelState, resumeState].map((st, i) => st?.message && (
                <div className="set-row" key={i}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: st.ok ? "var(--mint-600)" : "var(--berry-600)" }}>
                    {st.ok && <Check size={15} />}{st.message}
                  </span>
                </div>
              ))}

              {(!subscription || !subscription.cancelAtPeriodEnd) && (
                <div className="set-row">
                  <div className="sr-info"><b>{t("Cancel subscription")}</b><span>{t("You'll keep Pro until the end of your billing period")}</span></div>
                  <div className="sr-ctrl"><button type="button" className="btn btn--danger sm" onClick={() => setShowCancel(true)}>{t("Cancel subscription")}</button></div>
                </div>
              )}
            </>
          ) : (
            <div className="set-row">
              <div className="sr-info"><b>{t("Upgrade to Pro")}</b><span>{t("Unlimited lessons, all career paths and unlimited hearts.")} · ฿{proPrice.toLocaleString()}/{t("mo")}</span></div>
              <div className="sr-ctrl"><Link className="btn btn--violet md" href="/upgrade"><Crown size={16} /> {t("Upgrade")}</Link></div>
            </div>
          )}
        </section>

        {/* Danger */}
        <section className="set-card glass" id="danger">
          <div className="sc-head"><h3 className="display"><AlertTriangle size={20} className="text-rose-500" /> {t("Account & security")}</h3><p>{t("Log out or manage your account")}</p></div>
          <div className="set-row">
            <div className="sr-info"><b>{t("Log out")}</b><span>{t("Sign out of this device")}</span></div>
            <div className="sr-ctrl"><button className="btn btn--danger sm" onClick={logout}><LogOut size={15} /> {t("Log out")}</button></div>
          </div>
        </section>
      </div>

      {showCancel && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCancel(false)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(23,18,66,.45)", backdropFilter: "blur(2px)", display: "grid", placeItems: "center", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 22, padding: 26, boxShadow: "0 30px 60px -20px rgba(39,16,96,.5)" }}
          >
            <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: 16, background: "var(--berry-100, #ffe4e6)", color: "var(--berry-600, #e11d48)", margin: "0 auto 14px" }}>
              <AlertTriangle size={26} />
            </span>
            <h3 className="display" style={{ textAlign: "center", fontSize: 20, margin: "0 0 8px", color: "var(--text-strong)" }}>{t("Cancel your Pro subscription?")}</h3>
            <p style={{ textAlign: "center", fontSize: 14, lineHeight: 1.55, color: "var(--text-muted)", margin: "0 0 22px" }}>
              {subscription?.until
                ? t("You'll keep Pro until {date}, then switch to Free. No more charges.", { date: subscription.until })
                : t("You'll switch back to the Free plan.")}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn--ghost md" style={{ flex: 1 }} onClick={() => setShowCancel(false)}>{t("Keep Pro")}</button>
              <form action={cancelSub} onSubmit={() => setShowCancel(false)} style={{ flex: 1, display: "flex" }}>
                <button type="submit" className="btn btn--danger md" style={{ width: "100%" }} disabled={cancelling}>{cancelling ? t("Cancelling…") : t("Confirm cancel")}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
