"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import LangToggle from "@/components/lang-toggle"
import { makeT, type Lang } from "@/lib/i18n-core"
import { createClient } from "@/lib/supabase/client"
import { isDevMock } from "@/lib/mock-user"
import {
  GraduationCap, Rocket, BookOpen, Trophy, User, Settings, Shield,
  Crown, Flame, Zap, Heart, Menu, PanelLeftClose, PanelLeftOpen, LogOut,
} from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"

const NAV = [
  { href: "/daily-learn", en: "Daily Learn", icon: GraduationCap },
  { href: "/paths", en: "Career paths", icon: Rocket },
  { href: "/docs", en: "Docs", icon: BookOpen },
  { href: "/leaderboard", en: "Leaderboard", icon: Trophy },
]

const TITLES: Record<string, string> = {
  "/daily-learn": "Daily Learn",
  "/dashboard": "Daily Learn",
  "/paths": "Career paths",
  "/docs": "Docs",
  "/leaderboard": "Leaderboard",
  "/profile": "Profile",
  "/settings": "Settings",
  "/admin": "Admin",
  "/upgrade": "Go Pro",
  "/missions": "Quests",
  "/learn": "Lesson",
}

type Props = {
  children: React.ReactNode
  displayName: string
  role: "user" | "admin"
  xp: number
  hearts: number
  streak: number
  lang: Lang
  initialCollapsed: boolean
}

export default function AppShell({ children, displayName, role, xp, hearts, streak, lang, initialCollapsed }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  // Seeded from a server-read cookie so SSR and first client render match (no hydration mismatch).
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  // Riri avatar chosen in Settings (localStorage). null = show initial letter.
  const [avatarSel, setAvatarSel] = useState<string | null>(null)
  const t = makeT(lang)

  useEffect(() => {
    const read = () => setAvatarSel(localStorage.getItem("dlab-avatar"))
    read()
    window.addEventListener("dlab-avatar-change", read)
    window.addEventListener("storage", read)
    return () => {
      window.removeEventListener("dlab-avatar-change", read)
      window.removeEventListener("storage", read)
    }
  }, [])

  const avatarSrc = avatarSel ? `/assets/daily-ai-lab/avatars/avatar-${avatarSel}.png` : null

  function toggleCollapse() {
    setCollapsed((c) => {
      const next = !c
      document.cookie = `dlab-sidebar=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`
      return next
    })
  }

  async function logout() {
    setUserMenu(false)
    if (!isDevMock()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push("/login")
  }

  const titleKey = Object.keys(TITLES).find((p) => pathname === p || pathname.startsWith(p + "/"))
  const title = titleKey ? t(TITLES[titleKey]) : "Daily AI Lab"

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href))

  return (
    <div className="dlab-app">
      <div className={`app${collapsed ? " is-collapsed" : ""}`}>
        {/* Sidebar */}
        <aside className={`sidebar${open ? " open" : ""}${collapsed ? " collapsed" : ""}`}>
          <Link className="side-brand" href="/">
            <div className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" width={44} height={44} /></div>
            <div className="brand-text">
              <div className="brand-name" style={{ fontSize: 18 }}>Daily AI Lab</div>
              <div className="brand-sub">{t("AI, every day")}</div>
            </div>
          </Link>

          <button className="side-collapse" onClick={toggleCollapse} aria-label={collapsed ? t("Expand menu") : t("Collapse menu")} title={collapsed ? t("Expand menu") : t("Collapse menu")}>
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <nav className="side-nav">
            <div className="side-label">{t("Menu")}</div>
            {NAV.map(({ href, en, icon: Icon }) => (
              <Link key={href} href={href} data-label={t(en)} className={`side-link${isActive(href) ? " active" : ""}`} onClick={() => setOpen(false)}>
                <span className="si"><Icon size={18} strokeWidth={2.2} /></span> <span className="side-txt">{t(en)}</span>
              </Link>
            ))}
            {role === "admin" && (
              <Link href="/admin" data-label={t("Admin")} className={`side-link${isActive("/admin") ? " active" : ""}`} onClick={() => setOpen(false)}>
                <span className="si"><Shield size={18} strokeWidth={2.2} /></span> <span className="side-txt">{t("Admin")}</span>
              </Link>
            )}
          </nav>

          <div className="side-pro">
            <h4><Crown size={16} className="text-amber-500" /> <span className="side-txt">{t("Go Pro")}</span></h4>
            <p>{t("Unlimited lessons, all paths & hearts.")}</p>
            <Link className="btn btn--violet sm" style={{ width: "100%" }} href="/upgrade" onClick={() => setOpen(false)}><span className="side-txt">{t("Upgrade")}</span><Crown size={16} className="side-pro-ic" /></Link>
          </div>
        </aside>

        {/* overlay (mobile) */}
        <div className={`app-overlay${open ? " show" : ""}`} onClick={() => setOpen(false)} />

        {/* Main */}
        <main className="app-main">
          <header className="topbar">
            <button className="tb-burger" onClick={() => setOpen(true)} aria-label={t("Open menu")}><Menu size={20} /></button>
            <div className="tb-title">{title}</div>
            <div className="tb-stats">
              <LangToggle current={lang} />
              <span className="stat-chip streak"><Flame size={17} /> {streak}</span>
              <span className="stat-chip xp"><Zap size={17} /> {xp.toLocaleString()}</span>
              <span className="stat-chip heart"><Heart size={17} /> {hearts}</span>
              <div className="tb-user">
                <button className="tb-avatar" onClick={() => setUserMenu((o) => !o)} aria-haspopup="menu" aria-expanded={userMenu}>
                  {avatarSrc ? <img src={avatarSrc} alt={displayName} /> : displayName.charAt(0)}
                </button>
                {userMenu && (
                  <>
                    <div className="tb-menu-overlay" onClick={() => setUserMenu(false)} />
                    <div className="tb-menu" role="menu">
                      <div className="tb-menu-head">
                        <span className="tb-menu-av">{avatarSrc ? <img src={avatarSrc} alt={displayName} /> : displayName.charAt(0)}</span>
                        <div style={{ minWidth: 0 }}>
                          <b>{displayName}</b>
                          <small>{role === "admin" ? t("Admin") : t("Profile")}</small>
                        </div>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenu(false)}><User size={16} /> {t("Profile")}</Link>
                      <Link href="/settings" onClick={() => setUserMenu(false)}><Settings size={16} /> {t("Settings")}</Link>
                      <button className="danger" onClick={logout}><LogOut size={16} /> {t("Log out")}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="app-body">{children}</div>
        </main>
      </div>
    </div>
  )
}
