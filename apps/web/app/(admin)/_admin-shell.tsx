"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Users, GraduationCap, FileText, Trophy, Settings,
  Search, Menu, X, CornerDownLeft,
} from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"

const NAV = [
  { href: "/admin", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/admin/users", label: "ผู้ใช้", icon: Users },
  { href: "/admin/courses", label: "คอร์ส & บทเรียน", icon: GraduationCap },
  { href: "/admin/docs", label: "เอกสาร", icon: FileText },
  { href: "/admin/leagues", label: "ลีก & รางวัล", icon: Trophy },
  { href: "/admin/system", label: "ตั้งค่าระบบ", icon: Settings },
]

const TITLES: Record<string, string> = {
  "/admin": "ภาพรวมระบบ",
  "/admin/users": "ผู้ใช้",
  "/admin/courses": "คอร์ส & บทเรียน",
  "/admin/docs": "เอกสาร",
  "/admin/leagues": "ลีก & รางวัล",
  "/admin/system": "ตั้งค่าระบบ",
}

export default function AdminShell({ children, initial }: { children: React.ReactNode; initial: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const titleKey = Object.keys(TITLES).find((p) => pathname === p || pathname.startsWith(p + "/"))
  const title = titleKey ? TITLES[titleKey] : "หลังบ้าน"
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href))

  return (
    <div className="dlab-app">
      <div className="app">
        {open && <div className="tb-menu-overlay" style={{ zIndex: 290 }} onClick={() => setOpen(false)} />}
        <aside className="sidebar" data-open={open || undefined}>
          <Link className="side-brand" href="/daily-learn">
            <div className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" width={44} height={44} /></div>
            <div>
              <div className="brand-name" style={{ fontSize: 18 }}>Daily AI Lab</div>
              <div className="brand-sub"><span className="admin-badge">Admin</span></div>
            </div>
          </Link>
          <nav className="side-nav">
            <div className="side-label">จัดการระบบ</div>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`side-link admin${isActive(n.href) ? " active" : ""}`} onClick={() => setOpen(false)}>
                <span className="si"><n.icon size={18} /></span> {n.label}
              </Link>
            ))}
          </nav>
          <div className="side-pro" style={{ background: "linear-gradient(160deg,#EFE9FB,#F7F2FF)" }}>
            <h4><CornerDownLeft size={16} /> กลับสู่แอป</h4>
            <p>ออกจากโหมดผู้ดูแล</p>
            <Link className="btn btn--ghost sm" style={{ width: "100%" }} href="/daily-learn">ไปหน้าเรียน</Link>
          </div>
        </aside>

        <main className="app-main">
          <header className="topbar">
            <button className="tb-burger" onClick={() => setOpen((o) => !o)} aria-label="เมนู">{open ? <X size={20} /> : <Menu size={20} />}</button>
            <div className="tb-title">{title}</div>
            <div className="tb-stats">
              <span className="admin-search"><Search size={15} /> ค้นหาผู้ใช้ / คอร์ส…</span>
              <span className="tb-avatar adm">{initial}</span>
            </div>
          </header>
          <div className="app-body">{children}</div>
        </main>
      </div>
    </div>
  )
}
