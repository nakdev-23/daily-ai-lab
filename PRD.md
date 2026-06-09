# Daily AI Lab — Product Requirements Document (PRD)

> เวอร์ชัน 1.0 · อัปเดต 9 มิ.ย. 2026
> เอกสารนี้เน้น **สิ่งที่ต้องเป็น (requirements)** — สำหรับดีไซน์ดู [DESIGN.md](DESIGN.md), สำหรับแผนเฟสดู [PHASES.md](PHASES.md)

---

## 1. ภาพรวม (Overview)

**Daily AI Lab** คือเว็บแอป (PWA) สอนการใช้เครื่องมือ AI แบบ **gamified คล้าย Duolingo** — เรียนวันละ 15 นาที ผ่านบทเรียนสั้น ควิซ และระบบสะสมความก้าวหน้า (XP / streak / league / badge) โดยมีมาสคอต **Riri** (นกค็อกคาเทียลสีเหลือง) เป็นแกนของแบรนด์

- **Thai-first**: เนื้อหาและ UI ภาษาไทยเป็นหลัก คงศัพท์เทคนิคอังกฤษ (prompt, model, token)
- **Platform**: Next.js 16 PWA (เว็บก่อน), เตรียมต่อยอด React Native ภายหลัง
- **Backend**: Supabase (PostgreSQL + Auth + RLS)

### Problem statement
คนทั่วไปอยากใช้ AI ให้เป็นแต่ (1) ไม่รู้จะเริ่มตรงไหน (2) คอร์สส่วนใหญ่ยาว น่าเบื่อ เลิกกลางคัน (3) เนื้อหาภาษาอังกฤษเป็นกำแพง Daily AI Lab แก้ด้วยบทเรียนสั้นรายวัน ภาษาไทย และกลไกเกมที่สร้างนิสัยการเรียนต่อเนื่อง

### Vision
ทำให้ "การเรียน AI" กลายเป็นนิสัยประจำวันที่สนุกเหมือนเล่นเกม จนคนไทยทั่วไปใช้ AI ทำงานจริงได้

---

## 2. เป้าหมาย (Goals & Non-Goals)

### Goals
1. ผู้เรียนเปิดแอปได้ทุกวันและเรียนจบอย่างน้อย 1 บทใน 15 นาที
2. กลไกเกม (streak, XP, league, badge) ทำให้ผู้เรียนกลับมาต่อเนื่อง
3. เส้นทางการเรียนชัดเจน มองเห็นความก้าวหน้าเป็น "แผนที่ด่าน" (quest map)
4. ระบบ Free/Pro ที่แปลงผู้ใช้ฟรีเป็นสมาชิกแบบยั่งยืน
5. แอดมินจัดการคอร์ส/บทเรียน/ลีก/แบดจ์/เอกสารได้เองโดยไม่ต้องแตะโค้ด

### Non-Goals (ตอนนี้ยังไม่ทำ)
- แอป mobile native (เลื่อนไป Phase 4)
- ระบบ community / discussion ต่อบทเรียน (Phase 3)
- AI-generated lessons pipeline (Phase 5)
- การชำระเงินจริงผ่าน Stripe (โครงสร้าง plan พร้อม แต่ payment ยังไม่ผูก)

---

## 3. กลุ่มผู้ใช้ (Personas)

| Persona | ใคร | ต้องการ |
|---|---|---|
| **มือใหม่หัดใช้ AI** | พนักงานออฟฟิศ/นักเรียน อยากใช้ ChatGPT ให้เป็น | บทเรียนสั้น ภาษาไทย ไม่ต้องคิดเยอะ |
| **คนอยากเก่งขึ้น** | ใช้ AI อยู่บ้างแต่อยากเขียน prompt ระดับโปร | เนื้อหา intermediate/advanced + career path |
| **Pro subscriber** | ผู้เรียนจริงจัง อยากปลดล็อกทุกอย่าง | เรียนไม่จำกัด, ทุก path, global leaderboard |
| **Admin / ทีมเนื้อหา** | คนสร้างคอร์สและดูแลระบบ | CRUD คอร์ส/บท/ลีก/แบดจ์/เอกสาร + audit |

---

## 4. ขอบเขต (Scope)

### 4.1 สถานะปัจจุบัน (Implemented ✅)

**Auth & Account**
- เข้าสู่ระบบด้วย **Google OAuth** อย่างเดียว (ผ่าน Supabase) — ไม่มี email/password, ไม่มีหน้า register แยก (`/register` → redirect `/login`)
- Role-based: `user` / `admin` — guard ด้วย `proxy.ts` (route protection) + `requireAdmin()` / `requireUser()`
- Plan-based: `free` / `pro` — อ่านจากตาราง `subscriptions` (เช็ค `expires_at`), guard ด้วย `requirePro()` / `isPro()`
- โหมด dev mock: รันแอปได้โดยไม่ต้องมี Supabase จริง (in-memory mock)

**Learn (แกนหลัก)**
- `/daily-learn` — หน้า hub: การ์ดเป้าหมายรายวัน + เลือกหัวข้อ (topic cards) + ภารกิจประจำวัน + streak สัปดาห์
- `/daily-learn/[topic]` — **quest map**: ถนนคดเคี้ยว (smooth bézier), แถบความคืบหน้าวิ่งบนถนน, ด่าน done/current/locked/treasure, hero ม่วงเข้ม, right rail (ภารกิจ + เกี่ยวกับเส้นทาง + Riri), bottom CTA, auto-scroll ไปด่านปัจจุบัน
- `/daily-learn/[topic]/[lesson]` — หน้าเรียนแบบ fullscreen (lesson player)

**Gamification**
- XP, level, hearts (5 ดวง), streak (ปัจจุบัน/ยาวสุด/freeze), league/division, badge (15 แบบ)
- หน้า Profile แสดง stat + badge grid (รูปจริง 15 แบบ, locked = grayscale)
- Leaderboard

**Docs Hub**
- เอกสารเขียนเป็น Markdown (gray-matter + marked) ต่อเครื่องมือ

**Plans & Upgrade**
- `/upgrade` — เทียบ Free/Pro, toggle รายเดือน/รายปี, ตารางเทียบ, FAQ

**Admin Panel** (route group `(admin)`)
- Dashboard (KPI), Courses CRUD + course editor (units/lessons), Leagues + Badges CRUD, Docs editor (พร้อม AI logo picker จาก `@lobehub/icons`), Users, System settings
- ทุก action ผ่าน `requireAdmin()` + บันทึก audit log

**อื่น ๆ**
- i18n cookie-based (ไทย/อังกฤษ), PWA manifest + service worker, มาสคอต Riri ระบบ pose, favicon = Riri

### 4.2 นอกขอบเขตเฟสนี้ (Out of scope)
Stripe payment จริง · mobile app · community · AI lesson generation · referral/team plan (ดู [PHASES.md](PHASES.md) Phase 2–5)

---

## 5. ฟีเจอร์ & Requirements

### 5.1 Authentication
| # | Requirement |
|---|---|
| AUTH-1 | ผู้ใช้เข้าสู่ระบบด้วย Google OAuth ได้ในคลิกเดียว ผ่าน Supabase callback → redirect ไป `/daily-learn` |
| AUTH-2 | ผู้ใช้ที่ยังไม่ล็อกอินเข้าถึง route ที่ป้องกัน (`/daily-learn`, `/profile`, `/settings`, `/admin`, ฯลฯ) ไม่ได้ → เด้งไป `/login?redirect=...` |
| AUTH-3 | ผู้ใช้ที่ล็อกอินแล้วเข้า `/login` หรือ `/register` จะถูกเด้งกลับ `/daily-learn` |
| AUTH-4 | เมื่อสมัครครั้งแรก ระบบสร้าง `profiles` + `game_state` + `subscriptions(free)` อัตโนมัติ (trigger) |
| AUTH-5 | Settings แสดงอีเมล Google ที่ใช้ล็อกอิน, เลือก avatar จากชุด Riri (ไม่อัปโหลดเอง), ไม่มีการเปลี่ยนรหัสผ่าน |

### 5.2 Roles & Plans
| # | Requirement |
|---|---|
| ROLE-1 | `requireUser()` — ทุก route ในแอปต้องล็อกอิน |
| ROLE-2 | `requireAdmin()` — เฉพาะ role `admin` เข้า `(admin)` ได้, อื่น ๆ เด้งไป `/daily-learn` |
| ROLE-3 | `requirePro()` — ฟีเจอร์ Pro เฉพาะ plan `pro` ที่ยังไม่หมดอายุ, free เด้งไป `/upgrade` |
| ROLE-4 | Free/Pro gating ตามตารางใน [PHASES.md](PHASES.md) (บท/วัน, hearts, ข้ามบท, docs, career path, streak freeze, leaderboard) |

### 5.3 Learn flow
| # | Requirement |
|---|---|
| LEARN-1 | Hub แสดงเป้าหมายรายวัน (เรียนแล้วกี่นาที/15) + หัวข้อทั้งหมดพร้อม % ความคืบหน้า |
| LEARN-2 | Quest map แต่ละหัวข้อแสดงด่านเรียงตามลำดับ, สถานะ done/current/locked/treasure ชัดเจน |
| LEARN-3 | แถบความก้าวหน้าบนถนน "เต็ม" เฉพาะถึงด่านปัจจุบัน ที่เหลือจาง — ผู้เรียนเห็นว่าอยู่ตรงไหน |
| LEARN-4 | ด่านที่ล็อกกดไม่ได้, ด่านปัจจุบันเด่น (pulse + ป้าย "กำลังเรียน"), auto-scroll มาที่ด่านปัจจุบัน |
| LEARN-5 | กดด่าน → เข้า lesson player แบบ fullscreen; จบบทได้ XP, อัปเดต progress/streak |
| LEARN-6 | ควิซรองรับหลายชนิด (multiple choice, fill-in-blank, drag-drop); ตอบผิดเสีย heart |

### 5.4 Gamification
| # | Requirement |
|---|---|
| GAME-1 | XP สะสมต่อบท/ควิซ → คำนวณ level |
| GAME-2 | Hearts 5 ดวง, -1 ต่อคำตอบผิด, เติมตามเวลา/ซื้อ (Pro = ไม่จำกัด) |
| GAME-3 | Streak นับวันต่อเนื่อง + streak freeze (Pro) |
| GAME-4 | League/division จัดกลุ่มผู้เรียนตาม XP |
| GAME-5 | Badge 15 แบบ ปลดล็อกตามเงื่อนไข, แสดงในโปรไฟล์ (locked = grayscale) |
| GAME-6 | Leaderboard — free เห็น local, Pro เห็น global |

### 5.5 Admin
| # | Requirement |
|---|---|
| ADM-1 | CRUD คอร์ส (title, tool, level, status: published/draft/queued) |
| ADM-2 | Course editor: จัดการ unit (บท) และ lesson (kind: lesson/quiz/check/project, XP) |
| ADM-3 | CRUD ลีก + แบดจ์ (เลือกรูปแบดจ์จาก 15 แบบ) |
| ADM-4 | Docs editor: เลือกไอคอนแบรนด์ AI จาก `@lobehub/icons` |
| ADM-5 | ทุกการกระทำของแอดมินบันทึก audit log; เข้าถึงเฉพาะ admin |
| ADM-6 | เนื้อหาที่ published เท่านั้นที่ผู้เรียนเห็น (RLS: published = อ่านได้, admin = จัดการทั้งหมด) |

### 5.6 ทั่วไป
| # | Requirement |
|---|---|
| GEN-1 | i18n ไทย/อังกฤษ ผ่าน cookie; ทุก label ผ่าน `t()`; key หาย → fallback อังกฤษ |
| GEN-2 | PWA: ติดตั้งได้, manifest + service worker, icon = Riri |
| GEN-3 | ดีไซน์ตาม [DESIGN.md](DESIGN.md) ทุกหน้า (pillowy, 3D key buttons, violet-tinted shadows, mascot-led) |
| GEN-4 | รองรับ `prefers-reduced-motion` ทุก animation |

---

## 6. สถาปัตยกรรม (Architecture)

```
Turborepo (monorepo)
├── apps/web            Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) — PWA
│   ├── app/            (app) main · (auth) login · (lesson) fullscreen · (admin) panel
│   ├── lib/            auth, courses, course-content, leagues, docs, i18n, supabase, mock-user
│   ├── components/     Mascot, ai-logo, switch, tool-logo, ...
│   ├── content/docs/   เอกสาร Markdown
│   └── supabase/       schema.sql
└── packages/core       game logic (xp, hearts, streak, subscription)
```

**Routing (route groups)**
- `(app)` — แอปหลัก (มี sidebar/topbar shell)
- `(auth)` — หน้า login เดียว (fullscreen, ล็อก scroll)
- `(lesson)` — lesson player fullscreen
- `(admin)` — admin panel (sidebar เฉพาะ, `admin.css`)

**Data layer pattern (`isDevMock()`)**
- dev + `SUPABASE_URL` มี `"your-project"` → in-memory mock store
- ไม่งั้น → Supabase client จริง
- ทุก lib (courses, leagues, ฯลฯ) ใช้ pattern เดียวกัน → พร้อมสลับ mock ↔ จริงโดยไม่แก้หน้า

**Auth flow**
```
Google OAuth → /auth/callback?next=… → Supabase session → /daily-learn
proxy.ts (updateSession) → guard PROTECTED routes, refresh session cookie
```

---

## 7. Data model (Supabase)

ตารางหลัก (RLS เปิดทุกตาราง):

| ตาราง | หน้าที่ |
|---|---|
| `profiles` | id (→ auth.users), display_name, avatar_url, role |
| `subscriptions` | plan (free/pro), expires_at, stripe ids |
| `game_state` | xp, level, hearts, streak_*, lessons_today |
| `courses` / `course_units` / `course_lessons` | โครงสร้างคอร์ส (admin-managed) |
| `leagues` | division ตาม min_xp |
| `lessons` / `user_progress` | บทเรียน + ความก้าวหน้าผู้เรียน |
| `badges` / `user_badges` | แบดจ์ + ที่ผู้ใช้ได้รับ |
| `audit_logs` | log การกระทำแอดมิน |

**Functions/Triggers**: `is_admin()`, `record_audit()`, `get_leaderboard()`, `handle_new_user()` (สร้าง profile+game_state+subscription ตอน signup)

**RLS หลัก**: ผู้ใช้อ่าน/แก้ข้อมูลตัวเอง · เนื้อหา published ทุกคนอ่านได้ · admin จัดการทั้งหมด · audit เฉพาะ admin

---

## 8. Non-functional requirements

| ด้าน | ข้อกำหนด |
|---|---|
| **Performance** | บทเรียนสั้นโหลดไว, quest map ลื่น 60fps, รองรับ reduced-motion |
| **Security** | RLS ทุกตาราง, service role key ฝั่ง server เท่านั้น, secret ไม่ขึ้น git (`.env*`, `.mcp.json` ignored), rate limit ต่อ IP ใน proxy |
| **Accessibility** | focus ring ชัด, contrast ตาม DESIGN.md (no pure black), sentence case |
| **i18n** | Thai-first, fallback อังกฤษ |
| **Maintainability** | shared component/lib, mock-aware data layer, `tsc --noEmit` ต้องผ่าน |
| **PWA** | ติดตั้งได้, service worker ไม่ทำให้ dev reload loop |

---

## 9. Success metrics (KPIs)

| Metric | เป้าหมายเริ่มต้น |
|---|---|
| Daily Active Users (DAU) | เติบโตต่อเนื่อง |
| D1 / D7 retention | D1 ≥ 40%, D7 ≥ 20% |
| Avg. streak length | ≥ 5 วัน |
| Lessons completed / DAU / วัน | ≥ 1 |
| Free → Pro conversion | ≥ 3% |
| Lesson completion rate | ≥ 70% |

---

## 10. Roadmap (สรุปจาก PHASES.md)

| Phase | โฟกัส | สถานะ |
|---|---|---|
| **1 — Foundation & PWA** | โครงสร้าง + web app ใช้ได้จริง, auth, gamification core, บทเรียนแรก | 🟢 ส่วนใหญ่เสร็จ |
| **2 — Content & Subscription** | Stripe, Free/Pro gating, เนื้อหาเพิ่ม, leaderboard, progress map | 🟡 gating/UI พร้อม, payment ค้าง |
| **3 — Full Content & Community** | ครบทุก tool/path, community, daily challenge, friends | ⚪ ยังไม่เริ่ม |
| **4 — React Native** | mobile app (iOS/Android), push, offline | ⚪ ยังไม่เริ่ม |
| **5 — Growth** | AI lesson generation, personalization, analytics, referral, team plan | ⚪ ยังไม่เริ่ม |

---

## 11. ความเสี่ยง & คำถามค้าง (Open questions)

- **Payment**: เลือก Stripe หรือ provider ที่รองรับไทย (Omise/2C2P)? โครงสร้าง `subscriptions` พร้อมแล้ว
- **เนื้อหา**: ใครผลิตบทเรียน? ทีมเอง vs community contribution (Phase 3)
- **Hearts economy**: เวลาเติม heart และราคา (ถ้ามีซื้อ) ยังไม่กำหนดตายตัว
- **League reset**: รอบการรีเซ็ตลีก (รายสัปดาห์?) และเงื่อนไขเลื่อนชั้น
- **Google-only auth**: พอสำหรับตลาดไทยไหม หรือควรเพิ่ม LINE/Apple ในอนาคต

---

## 12. เอกสารอ้างอิง
- [DESIGN.md](DESIGN.md) — design system (สี, typography, components, มาสคอต)
- [PHASES.md](PHASES.md) — แผนพัฒนาแบ่งเฟส + tech stack เต็ม
- `apps/web/supabase/schema.sql` — schema + RLS + triggers
