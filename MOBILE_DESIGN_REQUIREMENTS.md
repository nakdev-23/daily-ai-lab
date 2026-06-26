# Daily AI Lab — Mobile App Design Requirements

เอกสารสรุปฟีเจอร์และหน้าจอทั้งหมด สำหรับใช้เป็นโจทย์ให้ Claude ออกแบบ **แอปมือถือ** (iOS + Android, Expo React Native)

---

## 0. ภาพรวมผลิตภัณฑ์ (Product Overview)

**Daily AI Lab** = แอปเรียน AI แบบ "วันละนิด" สไตล์ Duolingo สำหรับคนไทย
- เรียนเครื่องมือ AI (ChatGPT, Claude, Gemini, Midjourney, Suno ฯลฯ) ผ่านบทเรียนสั้น ๆ 15 นาที/วัน
- มีตัวมาสคอต **"ริริ" (Riri)** นกค็อกคาเทลสีเหลือง เป็นตัวนำทาง/ให้กำลังใจ
- ระบบเกม: XP, เลเวล, หัวใจ (hearts), สตรีค (streak), เหรียญตรา (badges), อันดับ (leaderboard)
- มี 2 โหมดการเรียน: **Daily Learn** (คอร์สรายเครื่องมือ) และ **Career Paths** (เส้นทางอาชีพ มีโปรเจกต์ + ใบเซอร์)
- โมเดลธุรกิจ: **Free / Pro** (subscription ผ่าน Stripe)
- รองรับ 2 ภาษา: **ไทย (หลัก) / อังกฤษ**

**กลุ่มเป้าหมาย:** คนไทยทั่วไปที่อยากใช้ AI เป็น ไม่ใช่สายเทคนิค เน้นสนุก เข้าใจง่าย ใช้ได้จริง

**โทนการออกแบบ:** สดใส เป็นมิตร เล่นสนุก (playful) แต่ดูน่าเชื่อถือ — แนว Duolingo ผสม mascot-driven

---

## 1. โครงสร้างนำทาง (Navigation Architecture)

แนะนำใช้ **Bottom Tab Bar 4–5 แท็บ** + หน้าจอเล่นบทเรียนแบบ full-screen (immersive)

### Bottom Tabs (หลังล็อกอิน)
| แท็บ | ไอคอน | หน้าหลัก |
|------|-------|---------|
| **เรียนวันนี้** (Daily) | บ้าน/ไฟ | Daily Learn hub — เป้าหมายวันนี้ + คอร์ส |
| **เส้นทาง** (Paths) | แผนที่ | Career Paths — เส้นทางอาชีพ |
| **คลังความรู้** (Docs) | หนังสือ | Docs hub — คู่มือเครื่องมือ AI |
| **อันดับ** (Leaderboard) | ถ้วยรางวัล | กระดานคะแนน XP |
| **โปรไฟล์** (Profile) | คน | สถิติ + badges + ตั้งค่า |

### หน้าจอ Full-screen (ไม่มี tab bar)
- **Lesson Player** — ตัวเล่นบทเรียน (theory → quiz → practice → done)
- **Onboarding / Auth** — หน้าล็อกอิน
- **Upgrade** — หน้าสมัคร Pro

### Persistent Status Bar (แสดงตลอด บน tab หลัก)
แถบสถานะด้านบนแสดง: 🔥 **สตรีค** | ⚡ **XP** | ❤️ **หัวใจ** (Free จำกัด 5, Pro ไม่จำกัด)

---

## 2. รายการหน้าจอทั้งหมด (Screen Inventory)

### A. Authentication / Onboarding
| หน้า | รายละเอียด | องค์ประกอบ UI |
|------|-----------|---------------|
| **Login** | เข้าสู่ระบบ | ปุ่ม "เข้าสู่ระบบด้วย Google", โลโก้ + ริริทักทาย, ลิงก์ข้อกำหนด/ความเป็นส่วนตัว |
| **Onboarding** (แนะนำเพิ่ม) | first-run — เลือกเป้าหมาย/ความสนใจ, แนะนำริริ, ตั้งเป้าเรียนต่อวัน | สไลด์ 3–4 หน้า, ริริหลายโพส |

> หมายเหตุ: ปัจจุบันใช้ Google OAuth เป็นหลัก

### B. Daily Learn (แท็บหลัก)
| หน้า | รายละเอียด | องค์ประกอบ UI |
|------|-----------|---------------|
| **Daily Learn Hub** | หน้าแรกหลังล็อกอิน | การ์ดเป้าหมายวันนี้ (สตรีค + จำนวนบท), การ์ด "เรียนต่อจากที่ค้างไว้", กริดคอร์ส/หัวข้อ (มี progress bar), เควสต์รายวันด้านข้าง, แถบสตรีครายสัปดาห์ |
| **Course Roadmap** (`[topic]`) | แผนที่บทเรียนของคอร์ส | Header คอร์ส (ชื่อ, ระดับ, % ความคืบหน้า), **QuestMap** — โหนดบทเรียนเรียงเป็นเส้นทาง (เคลียร์/ปัจจุบัน/ล็อก), เป้าหมายรายวัน, รายการผลลัพธ์ที่จะได้, ริริ, ปุ่มเริ่มบทแรก |

### C. Career Paths (แท็บ)
| หน้า | รายละเอียด | องค์ประกอบ UI |
|------|-----------|---------------|
| **Paths List** | เลือกเส้นทางอาชีพ | ช่องค้นหา, กริดการ์ดเส้นทาง (มีสีธีมต่อเส้นทาง: ม่วง/มิ้นต์/ชมพู/ฟ้า/เหลือง), แสดง จำนวนบท/เครื่องมือ/สัดส่วนลงมือทำจริง, ปุ่มเริ่ม/พรีวิว |
| **Path Detail** (`[id]`) | รายละเอียด + roadmap เส้นทาง | Header (ชื่อ, progress bar, XP รวม), การ์ดสัดส่วน practical, การ์ดผลลัพธ์/ชิ้นงานที่จะได้, roadmap แบ่งเป็น module → โหนด step (เสร็จ/ปัจจุบัน/ล็อก), การ์ดใบเซอร์ (ได้แล้ว/รอ), ปุ่มเรียนต่อ (มี paywall สำหรับ Free เมื่อเกิน preview) |

### D. Docs / คลังความรู้ (แท็บ)
| หน้า | รายละเอียด | องค์ประกอบ UI |
|------|-----------|---------------|
| **Docs Hub** | คลังคู่มือเครื่องมือ | กริดการ์ดเครื่องมือ (ChatGPT, Claude, Gemini, Midjourney, Suno, Runway, Perplexity, DALL·E ฯลฯ) พร้อมจำนวนบท |
| **Docs Reader** (`[tool]`) | อ่านคู่มือ | เนื้อหา markdown แบบยาว, มี **paywall overlay** สำหรับเนื้อหา Pro, นำทางหัวข้อ/ค้นหา |

### E. Lesson Player (Full-screen — สำคัญที่สุด)
| หน้า | รายละเอียด |
|------|-----------|
| **Lesson Player** | ตัวเล่นบทเรียนแบบ immersive ใช้ร่วมทั้ง daily-learn / learn / paths-learn |

**บล็อกในบทเรียน (lesson block types):**
1. **Theory** — การ์ดเนื้อหา (มี bold/italic), ตัวอย่าง prompt, ภาพประกอบริริ
2. **Quiz** — ตัวเลือก A/B/C, feedback ทันที ถูก/ผิด, **ผิดเสียหัวใจ 1 ดวง**, ถูกได้ XP, ปุ่มลองใหม่
3. **Practice** — กล่องพิมพ์ + starter template, ตัวตรวจเงื่อนไขสด (keyword / นับคำ / กรอกครบ), **ปุ่ม "ให้ AI รีวิว" (Pro เท่านั้น)** ให้ feedback ตาม rubric
4. **Setup** — ขั้นตอนติดตั้ง/ตั้งค่า, บล็อกคำสั่ง, ลิงก์
5. **Checkpoint / Project** (เฉพาะ paths) — ส่งชิ้นงาน + ได้คะแนนตาม rubric (Pro ได้ AI review, Free ได้ตรวจพื้นฐาน)
6. **Done** — จบบท, แสดง XP ที่ได้, ริริฉลอง

**องค์ประกอบใน player:** progress bar ด้านบน, แสดงหัวใจ, XP pop-up, feedback ทันที, ปุ่ม next/skip, ริริเปลี่ยนโพสตามสถานการณ์

**Gate (ประตูกั้น):**
- **หมดหัวใจ** → หน้าจอบล็อก + ชวนอัปเกรด/รอเติม
- **เกินโควต้ารายวัน** (Free จำกัด 3 บท/วัน ปรับได้โดยแอดมิน) → ชวนอัปเกรด

### F. Profile / Gamification (แท็บ)
| หน้า | รายละเอียด | องค์ประกอบ UI |
|------|-----------|---------------|
| **Profile** | โปรไฟล์ + เหรียญตรา | Hero (avatar ริริ, ชื่อ, แบดจ์ Pro, แถบเลเวล), การ์ดสถิติ (สตรีค, XP, บทที่จบ, badges), คอร์สที่กำลังเรียน, กริด badges (ปลดล็อก/ล็อก รวม 15 อัน) |
| **Settings** | ตั้งค่าบัญชี | ชื่อแสดง, อีเมล, เลือก avatar (โพสริริ/รูป Google), ข้อมูล Pro (วันสมัคร, วันต่ออายุ, ปุ่มยกเลิก), สลับภาษา ไทย/อังกฤษ |
| **Leaderboard** | กระดานอันดับ XP | Podium ทอง/เงิน/ทองแดง, รายการเรียงตาม XP (avatar, สตรีค), ไฮไลต์อันดับของเรา (Free = local, Pro = global) |
| **Missions / เควสต์** | เป้าหมายรายวัน | การ์ดเควสต์ (จบ 1 บท, จบ N บท, สตรีค 7 วัน, ควิซ 80%+, อ่าน docs) พร้อม progress bar |
| **Certificates** | ใบเซอร์ที่ได้รับ | การ์ดใบเซอร์ (ชื่อเส้นทาง, วันออก, สถานะ verify, ลิงก์ดู/แชร์), empty state ชวนเริ่มเส้นทาง |
| **Portfolio** | ชิ้นงานจากโปรเจกต์ | การ์ดผลงาน (ชื่อโปรเจกต์, เส้นทาง, วันส่ง, คะแนน rubric /100, ลิงก์ปรับปรุง), empty state |

### G. Billing / Upgrade
| หน้า | รายละเอียด | องค์ประกอบ UI |
|------|-----------|---------------|
| **Upgrade** | สมัคร Pro | ราคารายเดือน/รายปี (โชว์ % ประหยัด), ตารางเปรียบเทียบฟีเจอร์, FAQ, upsell ตามบริบท (โชว์ step ที่ล็อก + ผลลัพธ์ที่จะได้) |

> มือถือ: Stripe checkout มัก deep-link ไปเว็บ (พิจารณา IAP ตามนโยบาย App Store/Play Store)

### H. Public / Misc
| หน้า | รายละเอียด |
|------|-----------|
| **Certificate Verify** (`/certificate/[code]`) | หน้าตรวจสอบใบเซอร์สาธารณะ — ตราใบเซอร์, ชื่อผู้รับ, เส้นทาง, วันจบ, XP, สถานะ valid, ปุ่มแชร์/คัดลอก |

---

## 3. ระบบเกม (Gamification) — รายละเอียดสำหรับออกแบบ

### XP & เลเวล (10 เลเวล)
```
Lv1 0 XP "AI Newcomer"   · Lv2 100 "Prompt Explorer" · Lv3 300 "AI Thinker"
Lv4 600 "Prompt Engineer" · Lv5 1000 "AI Practitioner" · Lv6 1500 "AI Strategist"
Lv7 2200 "AI Expert"     · Lv8 3000 "AI Master"       · Lv9 4000 "AI Architect"
Lv10 5500 "AI Grandmaster"
```
รางวัล XP: จบบท +10, ควิซถูก +5, บทไร้ที่ผิด +20, สตรีครายวัน +5, บทแรกของวัน +15

### หัวใจ (Hearts)
- Free: สูงสุด 5 ดวง · Pro: ไม่จำกัด
- ตอบควิซผิด -1 ดวง · เติมเต็มทุก 24 ชม. (รีเซ็ตตามเวลาไทย/Bangkok)
- หมดหัวใจ → บล็อก (ต้องมี **timer แสดงเวลานับถอยหลังเติม** + ปุ่มอัปเกรด)

### สตรีค (Streak)
- จบบทใด ๆ = +สตรีค · ขาด 1 วันยังต่อได้ · ขาด ≥2 วัน รีเซ็ต
- **Streak freeze** (Pro): ข้ามได้ 1 วันไม่เสียสตรีค

### เหรียญตรา (Badges)
15 อัน ปลดล็อกตามเงื่อนไข (First Step, 7-Day Streak, Prompt Pro ฯลฯ) — โชว์ในโปรไฟล์ (ล็อก = grayscale), ริริฉลองตอนปลดล็อก

---

## 4. มาสคอต "ริริ" (Riri the Cockatiel)

นกค็อกคาเทลสีเหลือง — หัวใจของแบรนด์ ใช้สร้าง engagement
**โพสที่มี:** read, point, think, hello, laptop, celebrate, thumbsup, wave, fly, sad, sad-sit, ohno

**Reaction logic:**
- Theory → read / point / laptop
- ควิซถูก → thumbsup / celebrate
- ควิซผิด → sad / ohno
- สตรีค/ปลดล็อก badge → celebrate / fly

> ต้องการ animation ที่ลื่นบนมือถือ (มี memory ว่า service worker เคยทำ reload loop — ระวังเรื่อง asset/PWA แต่บน native น่าจะไม่เจอ)

---

## 5. Free vs Pro (สิ่งที่ต้องสื่อในดีไซน์)

| ฟีเจอร์ | Free | Pro |
|---------|------|-----|
| บทเรียน/วัน | 3 (แอดมินปรับได้) | ไม่จำกัด |
| หัวใจ | 5 (เติมรายวัน) | ไม่จำกัด |
| Docs | ระดับต้นเท่านั้น | ครบทุกระดับ |
| Career Paths | ❌ | ✅ |
| Streak freeze | ❌ | ✅ |
| AI review (practice) | ❌ | ✅ |
| Global leaderboard | ❌ (local) | ✅ |
| ข้ามบท | ❌ | ✅ |
| ใบเซอร์ / badges | ✅ | ✅ |

**จุดที่ต้องออกแบบ paywall/upsell:** เมื่อหมดโควต้า, หมดหัวใจ, แตะ Career Path (Free), แตะ docs ระดับสูง, แตะ "ให้ AI รีวิว"

---

## 6. ข้อกำหนด UX สำหรับมือถือ (Mobile UX Requirements)

1. **Touch target ใหญ่** — โดยเฉพาะตัวเลือกควิซ, ปุ่มหลัก, โหนด QuestMap
2. **Lesson player เต็มจอ** — ไม่มี tab bar, มีปุ่มออก/ความคืบหน้าชัด
3. **QuestMap แบบเลื่อนแนวตั้ง** — เส้นทางโค้ง (Bézier) มีโหนด, ริริยืนอยู่ตำแหน่งปัจจุบัน
4. **Status bar ติดบน** — สตรีค/XP/หัวใจ เห็นตลอด
5. **Offline resilience** — บทที่โหลดแล้ว/เนื้อหาควรเล่นออฟไลน์ได้ (เนื้อหา bundle มากับแอป), progress sync เมื่อต่อเน็ต
6. **Heart refill timer** — แสดงนับถอยหลัง + พิจารณา push notification
7. **Empty states** — ทุกหน้า list (certificates, portfolio, paths) ต้องมี empty state + CTA + ริริ
8. **Feedback ทันที** — animation XP pop, หัวใจหาย, ริริ react, haptic feedback
9. **2 ภาษา** — ทุกข้อความรองรับ ไทย/อังกฤษ, สลับได้ในตั้งค่า
10. **Pull-to-refresh** บนหน้า hub/leaderboard
11. **Deep link** — เปิดบทเรียน/เส้นทาง/ใบเซอร์จากลิงก์ภายนอกได้

---

## 7. สถานะปัจจุบันของแอปมือถือ (Expo) — มีอะไรแล้ว / ยังขาด

**มีแล้ว:** login, tabs (dashboard/learn/leaderboard/profile), course list, lesson player, daily-learn hub + questmap, paths list/detail, paths-learn player, docs hub/reader, missions/settings/upgrade (deep-link)

**ยังไม่พอร์ต:** Admin panel (เว็บเท่านั้น), Stripe checkout ในแอป (deep-link เว็บ), Google OAuth (มี email/password อยู่), Docs markdown hub เต็ม, หน้า marketing/legal

> ใช้ `@daily-ai-lab/core` ร่วมกับเว็บ (hearts, xp, streak, subscription) — logic เกมต้องตรงกัน

---

## 8. สรุปหน้าจอที่ต้องออกแบบ (Design Deliverables Checklist)

**Priority 1 (Core loop):**
- [ ] Daily Learn Hub
- [ ] Course Roadmap / QuestMap
- [ ] Lesson Player (theory / quiz / practice / done)
- [ ] หน้าหมดหัวใจ + หมดโควต้า (paywall)
- [ ] Profile + Badges
- [ ] Status bar component (streak/XP/hearts)

**Priority 2 (Paths & monetization):**
- [ ] Paths List
- [ ] Path Detail / Roadmap
- [ ] Checkpoint / Project submission (player)
- [ ] Upgrade / Pro page
- [ ] Certificates + Portfolio

**Priority 3 (Supporting):**
- [ ] Docs Hub + Reader
- [ ] Leaderboard
- [ ] Missions
- [ ] Settings
- [ ] Login / Onboarding
- [ ] Certificate verify (public)

**ทุกหน้า:** Riri mascot, empty states, loading states, ไทย/อังกฤษ, โทนสดใส playful

---

*สร้างจากการสำรวจ codebase จริง (apps/web routes + supabase migrations + packages/core + apps/mobile)*
