# Daily AI Lab — Development Phases

## Overview

แอพสอน AI แบบ Gamified คล้าย Duolingo มีระบบ Docs และ Career Path
Tech Stack: Turborepo · Next.js 15 (PWA) · React Native CLI · Supabase · TypeScript

---

## Phase 1 — Foundation & PWA Core
**ระยะเวลา: 4-6 สัปดาห์**
**Focus: โครงสร้างหลัก + Web App ที่ใช้งานได้จริง**

### Setup
- [ ] Turborepo monorepo setup
- [ ] Next.js 15 PWA (`apps/web`)
- [ ] `packages/core` — shared game logic
- [ ] `packages/ui-web` — web components
- [ ] Supabase project + database schema
- [ ] Auth (email + Google OAuth)
- [ ] PWA manifest + Service Worker

### Database Schema (Supabase)
```
users → profiles → user_progress → lessons → quizzes
subscriptions → career_paths → tools
```

### Gamification Core (`packages/core`)
- [ ] XP system (earn XP per lesson, per quiz)
- [ ] Hearts system (5 hearts, -1 per wrong answer)
- [ ] Streak system (ต่อเนื่องกี่วัน)
- [ ] Level system (คำนวณ level จาก XP)
- [ ] Badge/Achievement engine

### Content System
- [ ] MDX schema มาตรฐาน (lesson, quiz, practice)
- [ ] Content loader สำหรับ Next.js
- [ ] บทเรียนแรก: ChatGPT Beginner × Coding Path (5 บท)

### Pages (MVP)
- [ ] Landing page
- [ ] Auth (login/register)
- [ ] Dashboard (streak, XP, today's quest)
- [ ] Daily Lesson flow (Duolingo-style)
- [ ] Quiz component (multiple choice, fill-in-blank, drag-drop)
- [ ] Docs Hub (beginner only, free)
- [ ] User Profile + Stats

---

## Phase 2 — Content Expansion & Subscription
**ระยะเวลา: 4-6 สัปดาห์**
**Focus: เพิ่มเนื้อหาและระบบ Monetization**

### Subscription System
- [ ] Stripe integration
- [ ] Free vs Pro tier gating
- [ ] Subscription management page
- [ ] Webhook handlers (payment, cancel, renew)

### Free vs Pro Gating
| Feature | Free | Pro |
|---------|------|-----|
| Daily lessons | 3/วัน | ไม่จำกัด |
| Hearts | 5 | ไม่จำกัด |
| ข้ามบท | ✗ | ✓ |
| Docs | Beginner | ทั้งหมด |
| Career Path | ✗ | ✓ |
| Advanced tools | ✗ | ✓ |
| Streak Freeze | ✗ | ✓ |
| Leaderboard | Local | Global |

### Content Phase 2
- [ ] Claude Beginner + Intermediate
- [ ] Gemini Beginner
- [ ] Career Path: Coding (ChatGPT + Claude)
- [ ] Career Path: Content Writing
- [ ] Docs: Intermediate tier (ChatGPT, Claude)

### Features
- [ ] Leaderboard (weekly, global)
- [ ] Streak Freeze item
- [ ] Heart refill timer (รอ 24 ชม. หรือซื้อ)
- [ ] Progress map (visual path เหมือน Duolingo)
- [ ] Search ใน Docs

---

## Phase 3 — Full Content & Community
**ระยะเวลา: 6-8 สัปดาห์**
**Focus: ครอบคลุมทุก AI tool + Career Path ครบ**

### AI Tools เพิ่ม
- [ ] Grok (xAI)
- [ ] Qwen (Alibaba)
- [ ] Perplexity
- [ ] Midjourney
- [ ] Suno / Udio (Music)
- [ ] Runway / Sora (Video)
- [ ] Cursor / GitHub Copilot (Coding)

### Career Paths เพิ่ม
- [ ] สายวิดีโอ (Sora, Runway, CapCut AI)
- [ ] สายเพลง (Suno, Udio)
- [ ] สายโฆษณา/การตลาด
- [ ] สายบัญชี/วิเคราะห์ข้อมูล
- [ ] สายออกแบบ (Midjourney, Adobe Firefly)

### Community Features
- [ ] Community contribution system (MDX PR workflow)
- [ ] Discussion / Q&A ต่อบทเรียน
- [ ] User-generated practice prompts

### Advanced Game Mechanics
- [ ] Daily Challenge (โจทย์พิเศษ)
- [ ] Friends system + challenge friends
- [ ] Seasonal events / limited badges
- [ ] XP multiplier events

---

## Phase 4 — React Native Mobile App
**ระยะเวลา: 6-8 สัปดาห์**
**Focus: Native mobile experience**

### Setup
- [ ] React Native CLI project (`apps/mobile`)
- [ ] Connect to `packages/core` (shared game logic)
- [ ] `packages/ui-mobile` — RN components
- [ ] React Navigation setup
- [ ] Supabase SDK (same backend)

### Mobile-specific Features
- [ ] Push notifications (daily reminder)
- [ ] Offline mode (cache บทเรียนที่ดาวน์โหลด)
- [ ] Haptic feedback (quiz answer)
- [ ] Native animations (Lottie)
- [ ] App Store + Play Store submission

### Platforms
- iOS (App Store)
- Android (Google Play)

---

## Phase 5 — Growth & Optimization
**ระยะเวลา: ต่อเนื่อง**

- [ ] AI-powered lesson generation pipeline (Claude API)
- [ ] Personalized learning path (based on quiz performance)
- [ ] Analytics dashboard (admin)
- [ ] A/B testing (lesson formats)
- [ ] SEO optimization (Docs pages)
- [ ] Referral program
- [ ] Corporate / Team plan

---

## Tech Stack Summary

```
Monorepo      Turborepo
Language      TypeScript
─────────────────────────────────
Web (PWA)     Next.js 15 + Tailwind CSS + Framer Motion
Mobile        React Native CLI
─────────────────────────────────
Backend       Supabase (PostgreSQL + Auth + Realtime + Storage)
Payment       Stripe
─────────────────────────────────
Shared Logic  packages/core   (XP, hearts, streaks, levels)
Web UI        packages/ui-web (React components)
Mobile UI     packages/ui-mobile (RN components)
Content       /content/**/*.mdx
─────────────────────────────────
Animation     Framer Motion (web) · Lottie (mobile)
State         Zustand
Data fetch    TanStack Query
```

---

## Content File Structure

```
content/
├── tools/
│   ├── chatgpt/
│   │   ├── beginner/
│   │   │   ├── 01-what-is-chatgpt.mdx
│   │   │   ├── 02-first-prompt.mdx
│   │   │   └── ...
│   │   ├── intermediate/
│   │   └── advanced/
│   ├── claude/
│   ├── gemini/
│   ├── grok/
│   └── ...
└── paths/
    ├── coding/
    │   ├── 01-intro.mdx
    │   └── ...
    ├── video/
    ├── music/
    └── ...
```

---

## Milestones

| Milestone | Phase | เป้าหมาย |
|-----------|-------|---------|
| MVP Launch | Phase 1 | Web app ใช้งานได้, เนื้อหา 5 บท |
| Monetization | Phase 2 | Stripe + Free/Pro gating |
| Content Complete | Phase 3 | ครบทุก tool + career path |
| Mobile Launch | Phase 4 | iOS + Android live |
| Scale | Phase 5 | 10,000+ users |
