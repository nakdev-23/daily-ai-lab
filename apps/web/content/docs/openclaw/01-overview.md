---
title: "OpenClaw คืออะไร — AI Agent โอเพนซอร์สที่รันบนเครื่องคุณเอง"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "beginner"
summary: "ภาพรวม OpenClaw เกตเวย์ AI agent โอเพนซอร์ส และวิธีเริ่มต้น (ติดตั้ง → onboard → แชท)"
readTime: "6 นาที"
readers: "0"
locked: false
order: 1
---

# OpenClaw — ผู้ช่วย AI ส่วนตัวแบบโอเพนซอร์ส 🦞

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.openclaw.ai](https://docs.openclaw.ai/) — โดยเฉพาะหน้า [Getting Started](https://docs.openclaw.ai/start/getting-started)

**OpenClaw** คือ **AI agent โอเพนซอร์ส (ฟรี)** ที่ **รันบนเครื่องของคุณเอง (self-hosted)** ทำหน้าที่เป็น **Gateway (เกตเวย์)** เชื่อมโมเดลภาษา (Claude, GPT, Gemini, DeepSeek, Grok หรือโมเดลโลคัล) เข้ากับ **ไฟล์ เชลล์ เบราว์เซอร์ แอปแชต และบริการต่าง ๆ** — แล้วคุยกับมันได้จากแอปแชตที่คุณใช้อยู่ทุกวัน

มาสคอตคือ "กุ้งล็อบสเตอร์" 🦞 และสโลแกนคือ "Any OS. Any Platform. The lobster way."

---

## 📖 คำศัพท์ที่ควรรู้

| คำศัพท์ | ความหมายง่าย ๆ |
|---|---|
| **Agent** | AI ที่ "ลงมือทำ" ได้เอง ไม่ใช่แค่ตอบแชต (เปิดไฟล์ รันคำสั่ง ค้นเว็บ ฯลฯ) |
| **Gateway** | ตัวกลางที่รันบนเครื่องคุณ คอยรับข้อความจากแอปแชตแล้วส่งให้ AI ทำงาน |
| **Channel** | ช่องทางแชตที่เชื่อมเข้ามา เช่น Discord, Slack, Telegram, WhatsApp |
| **Provider** | ผู้ให้บริการโมเดล (Anthropic, OpenAI, Google ฯลฯ) ที่ต้องมี API key |
| **Self-hosted** | รันเองบนเครื่อง/เซิร์ฟเวอร์ของคุณ ข้อมูลไม่ผ่านคนกลาง |

---

## ⭐ จุดเด่น

- **โอเพนซอร์ส + รันเอง** — ควบคุมข้อมูลและความเป็นส่วนตัวได้เต็มที่
- **เชื่อมแอปแชตได้หลายตัว** — Discord, Google Chat, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo และอื่น ๆ
- **เลือกโมเดลได้อิสระ** — ต่อกับ Claude/GPT/Gemini/Grok/DeepSeek หรือโมเดลโลคัล
- **ทำงานจริงบนเครื่อง** — เข้าถึงไฟล์ เชลล์ เบราว์เซอร์ และเครื่องมืออื่น ๆ
- **มีระบบความปลอดภัย** — โทเคน, allowlist, การแยกพื้นที่ทำงาน (workspace isolation), เซสชันแยกต่อ agent

---

## 🚀 เริ่มต้นใน ~5 นาที

**สิ่งที่ต้องมี:** Node.js (แนะนำเวอร์ชัน 24, รองรับ 22.19+) และ **API key** จากผู้ให้บริการโมเดลสักเจ้า (เช่น Anthropic, OpenAI, Google)

**ขั้นตอน:**

1. **ติดตั้ง** — รันสคริปต์ติดตั้ง (macOS/Linux ผ่าน bash, Windows ผ่าน PowerShell)
2. **Onboarding** — รัน `openclaw onboard --install-daemon` เพื่อตั้งค่าเริ่มต้น + ติดตั้ง daemon
3. **เช็คสถานะ Gateway** — `openclaw gateway status`
4. **เปิดแดชบอร์ด** — `openclaw dashboard`
5. **ส่งข้อความแรก** ผ่านหน้า Control UI — เสร็จแล้วจะได้ Gateway ที่ทำงาน + ตั้งค่า auth + เซสชันแชตพร้อมใช้

> ตั้งค่าเพิ่มเติมได้ผ่าน environment variable เช่น `OPENCLAW_HOME`, `OPENCLAW_STATE_DIR`, `OPENCLAW_CONFIG_PATH` และปรับ Control UI ที่ `gateway.controlUi.root`

**ก้าวต่อไป:** เชื่อมช่องทางแชต (Discord/Slack/Telegram ฯลฯ), ตั้งค่า safety pairing, ปรับแต่ง Gateway หรือสำรวจเครื่องมือที่มี

---

## 📚 สารบัญเอกสาร OpenClaw (เรียงตาม official docs)

1. ✅ ภาพรวม OpenClaw (หน้านี้)
2. ⏳ Getting Started — ติดตั้งและแชตครั้งแรก
3. ⏳ Core Gateway — การตั้งค่า, โทเคน, การตั้ง provider
4. ⏳ Channels — เชื่อมแชต (Discord, Slack, Telegram, WhatsApp, Teams ฯลฯ)
5. ⏳ Routing & Media — การกำหนดเส้นทางข้อความและสื่อ
6. ⏳ Tools — เครื่องมือที่ agent ใช้ได้
7. ⏳ Safety & Workspace — allowlist, โทเคน, การแยกพื้นที่ทำงาน

---

## 🔗 อ้างอิง (เอกสารทางการ)

- เอกสารหลัก: https://docs.openclaw.ai/
- เริ่มต้น: https://docs.openclaw.ai/start/getting-started
- ซอร์สโค้ด (GitHub): https://github.com/openclaw/openclaw
