"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isDevMock } from "@/lib/mock-user"
import { makeT, type Lang } from "@/lib/i18n-core"
import {
  User, Target, Bell, Palette, Crown, AlertTriangle,
  Sun, Moon, Monitor, LogOut, Check,
} from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import Switch from "@/components/switch"

const AV = "/assets/daily-ai-lab/avatars"
const AVATARS = ["heart", "celebrate", "thumbsup", "graduate", "wave", "cool", "read", "think", "yawn", "sad", "sleep"]

type Props = { lang: Lang; displayName: string; email: string; avatar: string | null }

export default function SettingsClient({ lang, displayName, email, avatar }: Props) {
  const router = useRouter()
  const t = makeT(lang)
  const [goal, setGoal] = useState(1)
  const [theme, setTheme] = useState(0)
  // Chosen Riri avatar (persisted in localStorage). null = use Google photo / initial.
  const [avatarSel, setAvatarSel] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return window.localStorage.getItem("dlab-avatar")
  })

  function pickAvatar(key: string) {
    setAvatarSel(key)
    localStorage.setItem("dlab-avatar", key)
    window.dispatchEvent(new Event("dlab-avatar-change"))
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

  async function logout() {
    if (!isDevMock()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push("/login")
  }

  return (
    <div className="settings-wrap">
      <nav className="set-nav">
        {NAV.map((n, i) => (
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
              ? <img className="sg-av" src={currentAvatar} alt={displayName} width={48} height={48} />
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
                  <img src={`${AV}/avatar-${k}.png`} alt={k} width={64} height={64} />
                  {avatarSel === k && <span className="av-check"><Check size={14} /></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="set-row"><div className="sr-info"><b>{t("Display name")}</b><span>{t("What friends and the leaderboard see")}</span></div><div className="sr-ctrl"><input className="set-input" type="text" defaultValue={displayName} /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Email")}</b><span>{t("From your Google account — can't be changed here")}</span></div><div className="sr-ctrl"><input className="set-input" type="email" value={email} readOnly style={{ background: "var(--cloud-50)", color: "var(--text-muted)" }} /></div></div>
        </section>

        {/* Learning */}
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

        {/* Notifications */}
        <section className="set-card glass" id="notif">
          <div className="sc-head"><h3 className="display"><Bell size={20} /> {t("Notifications")}</h3><p>{t("Reminders to learn and keep your streak")}</p></div>
          <div className="set-row"><div className="sr-info"><b>{t("Streak reminder")}</b><span>{t("Notify if you haven't learned today")}</span></div><div className="sr-ctrl"><Switch defaultChecked /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Reminder time")}</b><span>{t("When Riri reminds you daily")}</span></div><div className="sr-ctrl"><input className="set-input" type="time" defaultValue="19:00" style={{ minWidth: 130 }} /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Leaderboard updates")}</b><span>{t("When your rank changes")}</span></div><div className="sr-ctrl"><Switch defaultChecked /></div></div>
          <div className="set-row"><div className="sr-info"><b>{t("Newsletter")}</b><span>{t("New tools, features and promos")}</span></div><div className="sr-ctrl"><Switch /></div></div>
        </section>

        {/* Appearance */}
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

        {/* Subscription */}
        <section className="set-card glass set-pro" id="subscription">
          <img src="/assets/daily-ai-lab/mascot-ds/cockatiel-superhero.png" alt="Riri" width={70} height={70} />
          <div style={{ flex: 1 }}>
            <h3 className="display"><Crown size={18} className="text-amber-500" /> {t("Upgrade to Pro")}</h3>
            <p>{t("Unlimited lessons, all career paths and unlimited hearts · ฿199/mo")}</p>
          </div>
          <Link className="btn btn--violet md" href="/upgrade">{t("Upgrade")}</Link>
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
    </div>
  )
}
