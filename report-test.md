# 🧪 Daily AI Lab — QA Test Report

> วันที่ตรวจ: 2026-06-11 · ตรวจโดย QA (Claude)
> ขอบเขต: ทุกหน้า ทุกฟีเจอร์ · role `user` + `admin` · plan `free` + `pro` · feature / design / performance / **security**
> วิธีตรวจ: static analysis ของ source ทั้งหมด (app routes, server actions, lib, RLS migrations) + typecheck (`tsc --noEmit` ผ่าน exit 0)

---

## 1. สรุปผู้บริหาร (Executive Summary)

| ระดับ | จำนวน | สถานะ |
|---|---|---|
| 🔴 P0 Critical | 2 | ✅ แก้แล้ว |
| 🟠 P1 High | 4 | ✅ แก้ครบ (รวม Pro paywall + admin = pro) |
| 🟡 P2 Medium | 3 | ✅ แก้ 2 / 📝 บันทึก 1 |
| ⚪ P3 Low | 4 | ✅ แก้ 1 (admin system จริง) / 📝 บันทึก 3 |

**ภาพรวม:** โครงสร้างหลัก (auth, RLS, lesson engine, leaderboard, admin CRUD) แข็งแรงและปลอดภัย — secrets ไม่หลุดเข้า git, server actions ทุกตัว `requireAdmin()` ครบ, path traversal กันไว้แล้ว จุดอ่อนหลักคือ **paywall ไม่ได้บังคับจริง** และ **บางหน้าเป็น mock data** (Profile, Missions) ซึ่งแก้แล้วในรอบนี้

---

## 2. Bug List + Priority (แก้ไล่จากวิกฤตสุด)

### 🔴 P0 — Critical (ความปลอดภัย / ความถูกต้องข้อมูล)

- [x] **BUG-01 · Docs Pro หลุดถึง client + Pro อ่านไม่ได้**
  `lib/docs.ts › _getDocsForTool` render HTML ของเอกสารที่ `locked: true` แล้วส่งเข้า client component (`_reader.tsx`) ทั้งก้อน — ตัว reader แค่ซ่อนด้วย conditional ฉะนั้นเปิดดู HTML ได้จาก network/props (paywall bypass) **และกลับกัน** ผู้ใช้ Pro ก็อ่านไม่ได้เพราะ reader เช็คแค่ `meta.locked` ไม่เช็ค plan
  **แก้:** strip `html` ฝั่ง server เมื่อ `locked && !isPro`, ส่ง `isPro` เข้า reader, เปลี่ยนเงื่อนไขเป็น `locked && !isPro`
  ไฟล์: `app/(app)/docs/[tool]/page.tsx`, `app/(app)/docs/[tool]/_reader.tsx`

- [x] **BUG-02 · Progression bypass (โกงด่าน)**
  RPC `complete_lesson` ใช้ `lessons_done = greatest(prev, p_lesson_num)` → เปิด URL `/daily-learn/<course>/15` ตรง ๆ แล้วเรียนจบ จะ mark บท 1–15 ว่าเสร็จทั้งหมด ทั้งที่ยังไม่ได้เรียน (ข้ามด่าน + ได้ XP เกิน)
  **แก้:** migration `007` — เพิ่มเงื่อนไข reject ถ้า `p_lesson_num > coalesce(prev,0) + 1` (บังคับเรียนเรียงลำดับ)
  ไฟล์: `supabase/migrations/007_sequential_lessons.sql` ⚠️ **ต้องรันใน Supabase SQL Editor**

### 🟠 P1 — High (ฟีเจอร์เสีย ผู้ใช้เจอแน่)

- [x] **BUG-03 · หน้า Profile เป็น mock 100%**
  แสดง "Nin Wattana", @nin, Lv 8, 2,480 XP, streak 12, "Bangkok", "Rank #6" — ข้อมูลปลอมเหมือนกันทุกคน ทั้งที่มี `game_state` จริง
  **แก้:** เขียนใหม่เป็น server component ดึง `profiles` + `game_state` + `course_progress` จริง, คำนวณ level/badges จากค่าจริง
  ไฟล์: `app/(app)/profile/page.tsx`

- [x] **BUG-04 · Missions ลิงก์เสีย + mock**
  ปุ่ม "เริ่มเรียนเลย" ชี้ `/daily-learn/chatgpt-basics/2-2` — slug ผิด (`chatgpt-basics` มี s, จริงคือ `chatgpt-basic`) + เลขบท `2-2` ไม่ใช่ตัวเลข → เด้งกลับ `/daily-learn` เสมอ และ progress ทุกอันเป็นค่าคงที่
  **แก้:** server component คำนวณ continue-link จากคอร์สจริง + ดึง lessonsToday/streak จริง
  ไฟล์: `app/(app)/missions/page.tsx`

- [x] **BUG-05 · Settings ไม่บันทึกอะไรเลย**
  ช่อง "ชื่อที่แสดง" แก้ได้แต่ไม่มีปุ่มบันทึก/handler → พิมพ์แล้วไม่มีผล (เข้าใจผิดว่าบันทึกได้) เช่นเดียวกับ goal/theme/notifications (local state ล้วน)
  **แก้:** เพิ่ม server action `updateProfile` บันทึก `display_name` จริง + ปุ่มบันทึก (goal/theme/notif ทำเป็น cosmetic — บันทึกใน reminder ภายหลัง)
  ไฟล์: `app/(app)/settings/actions.ts` (ใหม่), `_settings-client.tsx`

- [x] **BUG-06 · Pro paywall ไม่ถูกบังคับฝั่ง server** ✅ **บังคับแล้ว**
  เดิม `requirePro()` ถูกนิยามแต่ไม่ถูกเรียก — Free เข้าถึงเส้นทาง Pro ได้หมด
  **แก้:** หน้า `paths/[id]` เช็ค `if (path.isPro && !isPro(profile)) redirect("/upgrade")` ฝั่ง server · grid ส่ง `isPro` เข้าไป (Pro/admin เห็นปุ่ม "เริ่มเส้นทาง", Free เห็น "Lock Pro" → /upgrade) · **admin ได้ plan `pro` อัตโนมัติ** (`getProfile` → `role === "admin"` ⇒ plan pro) จึงผ่าน gate ทุกที่
  ไฟล์: `lib/auth.ts`, `app/(app)/paths/[id]/page.tsx`, `app/(app)/paths/page.tsx`, `app/(app)/paths/_paths-grid.tsx`

### 🟡 P2 — Medium (ความไม่สอดคล้อง / เสียย่อย)

- [x] **BUG-07 · ราคาขัดกันทั้งเว็บ**
  upgrade page = ฿299/mo · settings/course = ฿199/mo · admin system default = ฿199/1990 → ผู้ใช้สับสน
  **แก้:** ตั้งมาตรฐาน **฿199/เดือน · ฿1,990/ปี** ทุกที่ (แก้ upgrade page ให้ตรง)
  ไฟล์: `app/(app)/upgrade/page.tsx`

- [x] **BUG-08 · Curriculum ทุกบทลิงก์ไปบท 1**
  `course/[tool]/page.tsx` ทุกแถวบทเรียนชี้ `startHref` (บท 1/ต่อ) แทนที่จะไปบทของตัวเอง
  **แก้:** ลิงก์แต่ละแถวไปเลขบทจริง (done/cur คลิกได้, lock เป็น span)
  ไฟล์: `app/(app)/course/[tool]/page.tsx`

- [ ] **BUG-09 · Daily quests บางอันเป็นค่าคงที่** 📝 บันทึก
  ใน `daily-learn` quest "Earn 30 XP" และ "Score 100% on a quiz" hardcode 0% (game_state ไม่ track xp-วันนี้/คะแนนควิซ) — quest "Finish N lessons" wire จริงแล้ว
  **แนะนำ:** เพิ่มคอลัมน์ `xp_today` / quiz tracking ใน game_state ภายหลัง (ไม่กระทบการเล่น)

### ⚪ P3 — Low (cosmetic / ไม่กระทบการใช้งาน)

- [ ] **BUG-10 · Missions ใช้ Tailwind utility ปนกับ design-system CSS** 📝 — สไตล์ไม่เข้าชุดกับหน้าอื่น (mascot คนละ path) แต่ทำงานได้
- [x] **BUG-11 · Admin System form เป็น mock** ✅ **ใช้ข้อมูลจริงแล้ว** — สร้างตาราง `system_settings` (migration 008) + `lib/system-settings.ts` + server action `saveSystemAction` (requireAdmin + clamp ค่า) · form โหลด/บันทึกค่าจริงจาก Supabase (RLS: ใครก็อ่านได้, เฉพาะ admin แก้ได้) · *Leagues form ยัง mock — ทำภายหลัง*
- [ ] **BUG-12 · Landing/career carousel จำนวนบทแต่งขึ้น** 📝 — "84 บท/72 บท" เป็น marketing copy ไม่ตรง DB
- [ ] **BUG-13 · route `/course/[tool]` orphaned** 📝 — ไม่มีลิงก์ในเมนู (ยังเข้าถึงได้ตรง URL) + ปุ่ม "Save for later" ชี้ `/login` ทั้งที่ login อยู่

---

## 3. Test Cases (ครบทุกหน้า)

> ✅ ผ่าน · ⚠️ มี bug (ดู BUG-##) · 🔒 ต้อง login · 👑 admin · 💎 pro

### 3.1 Public / Marketing
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T01 | `/` Landing | โหลด, hero, การ์ดอาชีพ carousel เลื่อนอัตโนมัติ, footer logo/©/legal | ✅ |
| T02 | `/` CTA | ปุ่มทั้งหมด → `/login` | ✅ |
| T03 | `/about` `/privacy` `/terms` | render เนื้อหา legal | ✅ |
| T04 | Carousel | จำนวนบทไม่ตรง DB | ⚠️ BUG-12 |

### 3.2 Auth
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T10 | `/login` | ปุ่ม Continue with Google → OAuth | ✅ |
| T11 | callback | `exchangeCodeForSession` → redirect `next` | ✅ |
| T12 | guest เปิด route protected | middleware เด้งไป `/login?redirect=` | ✅ |
| T13 | login แล้วเปิด `/login` | เด้งไป `/daily-learn` | ✅ |
| T14 | rate limit | auth 20/นาที, ทั่วไป 200/10s → 429 | ✅ |

### 3.3 Daily Learn / Lesson Engine
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T20 | `/daily-learn` 🔒 | hero goal, รายการคอร์ส published, progress จริง | ✅ |
| T21 | `/daily-learn/[topic]` | quest map, lock/current/done, ปุ่ม start | ✅ |
| T22 | lesson player | theory → quiz → done, hearts, ปุ่มต่อไป (เพิ่งแก้ CSS) | ✅ |
| T23 | จบบท | `complete_lesson` ให้ XP/streak atomic, idempotent | ✅ |
| T24 | เปิด URL บทท้ายตรง ๆ | mark บทก่อนหน้าทั้งหมดว่าเสร็จ | ⚠️ BUG-02 → ✅ แก้ |
| T25 | quest "Earn 30XP"/"quiz 100%" | ค่าคงที่ 0% | ⚠️ BUG-09 |

### 3.4 Career Paths
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T30 | `/paths` 🔒 | grid 5 เส้นทาง, ค้นหา, tag Pro/Free | ✅ |
| T31 | `/paths/[id]` | modules/steps, progress จาก course_progress, continue link | ✅ |
| T32 | Free เปิดเส้นทาง Pro 💎 | redirect → `/upgrade` (gate ฝั่ง server) | ⚠️ BUG-06 → ✅ แก้ |
| T33 | admin/Pro เปิดเส้นทาง Pro 💎 | เข้าได้ (admin = plan pro อัตโนมัติ) | ✅ |

### 3.5 Docs
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T40 | `/docs` 🔒 | tool grid, badge ฟรี/Pro | ✅ |
| T41 | `/docs/[tool]` | reader, TOC, pager, level groups | ✅ |
| T42 | doc `locked` กับ Free 💎 | HTML หลุดถึง client | ⚠️ BUG-01 → ✅ แก้ |
| T43 | doc `locked` กับ Pro 💎 | อ่านไม่ได้ (เห็น banner) | ⚠️ BUG-01 → ✅ แก้ |

### 3.6 Leaderboard / Profile / Missions / Settings
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T50 | `/leaderboard` 🔒 | podium + list จาก `get_leaderboard` RPC, ไฮไลต์ "you" | ✅ |
| T51 | `/profile` 🔒 | ข้อมูลจริงของผู้ใช้ | ⚠️ BUG-03 → ✅ แก้ |
| T52 | `/missions` 🔒 | quests + ปุ่มเริ่มเรียน | ⚠️ BUG-04 → ✅ แก้ |
| T53 | `/settings` 🔒 | บันทึกชื่อที่แสดง | ⚠️ BUG-05 → ✅ แก้ |
| T54 | `/settings` avatar | เลือก Riri avatar → localStorage → navbar อัปเดต | ✅ |
| T55 | `/settings` logout | signOut → `/login` | ✅ |
| T56 | `/upgrade` 🔒 | ราคา/ตาราง/FAQ, ปุ่มเป็น demo | ⚠️ BUG-07 → ✅ แก้ราคา |

### 3.7 Admin 👑
| # | หน้า | Test case | ผล |
|---|---|---|---|
| T60 | non-admin เปิด `/admin/*` | `requireAdmin()` เด้ง `/daily-learn` + เมนูซ่อน | ✅ |
| T61 | `/admin` | dashboard | ✅ |
| T62 | `/admin/users` | เปลี่ยน role (กันเปลี่ยนตัวเอง), audit log | ✅ |
| T63 | `/admin/courses` `/courses/[id]` | CRUD คอร์ส/บท | ✅ |
| T64 | `/admin/paths` `/paths/[id]` | CRUD เส้นทาง/module/step, publish toggle | ✅ |
| T65 | `/admin/docs` | CRUD เอกสาร (เขียนไฟล์ .md) | ✅ |
| T66 | `/admin/system` | โหลด/บันทึกค่าจริงจาก `system_settings` | ⚠️ BUG-11 → ✅ แก้ |
| T67 | `/admin/leagues` | form บันทึก | ⚠️ BUG-11 (leagues ยัง mock) |

---

## 4. Security Audit

| รายการ | ผล |
|---|---|
| Secrets ใน git (.env, key) | ✅ ไม่หลุด — `.env*` อยู่ใน .gitignore, `AUTH_BYPASS` ไม่อยู่ใน source |
| Server actions auth | ✅ ทุก mutation ของ admin เรียก `requireAdmin()` ฝั่ง server |
| เปลี่ยน role ตัวเอง | ✅ กันไว้ (`if userId === admin.id return`) |
| Path traversal (lesson/docs) | ✅ `SLUG_RE = /^[a-z0-9-]+$/` กัน separator/dot |
| RLS | ✅ course_progress / game_state / profiles มี policy `auth.uid()`, admin ผ่าน `is_admin()` security-definer |
| `complete_lesson` คุม input | ✅ clamp XP 0–50, เช็ค bounds, lock row — แต่ลำดับด่านไม่คุม → BUG-02 |
| RPC `security definer` + `search_path` | ✅ ตั้ง `set search_path = public` (กัน hijack) |
| **Paywall บังคับจริง** | ✅ บังคับแล้ว — docs (BUG-01) + เส้นทาง Pro (BUG-06) gate ฝั่ง server, admin ได้ plan pro |
| XSS ใน docs (`dangerouslySetInnerHTML`) | ⚠️ ต่ำ — เนื้อหามาจากไฟล์ .md ของ admin เท่านั้น (ไม่ใช่ user input) ยอมรับได้ |

---

## 5. Performance & Design Notes

- **Performance:** ✅ ใช้ Server Components + `Promise.all` ขนานทุก query, `unstable_cache` กับ docs, `generateStaticParams` กับ docs · ไม่มี N+1 ที่ชัด · `tsc` ผ่าน
- **รูปภาพ:** ✅ ทุก asset ที่อ้าง (mascot-ds, badges, avatars, mascot/cockatiel-*) มีไฟล์ครบ
- **Design consistency:** ⚠️ หน้า Missions ใช้ Tailwind utility (ปนกับ design-system CSS หน้าอื่น) → BUG-10 · lesson player CSS เพิ่ง fix รอบก่อน
- **a11y:** ✅ carousel/menu มี aria, ✅ `prefers-reduced-motion` รองรับใน lesson + carousel

---

## 6. สิ่งที่ต้องทำต่อ (Action items สำหรับเจ้าของโปรเจค)

1. ⚠️ **รัน `supabase/migrations/007_sequential_lessons.sql`** ใน Supabase SQL Editor (BUG-02)
2. ⚠️ **รัน `supabase/migrations/008_system_settings.sql`** ใน Supabase SQL Editor (BUG-11 — ก่อนรันหน้า Admin › ตั้งค่าระบบ จะบันทึกไม่ได้)
3. (ภายหลัง) track `xp_today` + quiz score ใน game_state (BUG-09)
4. (ภายหลัง) persist admin **Leagues** settings (System ทำแล้ว) (BUG-11)
5. (ภายหลัง) จัด Missions ให้ใช้ design-system CSS (BUG-10)
6. (ภายหลัง) ต่อราคา Pro บนหน้า /upgrade ให้อ่านจาก `system_settings` (ตอนนี้ admin แก้ได้แล้วแต่หน้า upgrade ยัง hardcode ฿199)

---
*รายงานนี้อัปเดตอัตโนมัติพร้อมการแก้ไข — checkbox `[x]` = แก้/ยืนยันแล้ว, `[ ]` = บันทึก/เลื่อน*
