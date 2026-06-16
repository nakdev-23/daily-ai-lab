---
title: "Hermes Agent คืออะไร — AI Agent ที่เรียนรู้และพัฒนาตัวเอง"
tool: "Hermes"
icon: "tool-hermes"
level: "beginner"
summary: "ภาพรวม Hermes Agent ของ Nous Research — AI agent โอเพนซอร์สที่มี learning loop และความจำถาวร"
readTime: "6 นาที"
readers: "0"
locked: false
order: 1
---

# Hermes Agent — AI Agent ที่ "เติบโตไปกับคุณ" ☤

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)

**Hermes Agent** คือ **AI agent โอเพนซอร์ส (MIT License)** ที่พัฒนาโดย **Nous Research** จุดเด่นที่ไม่เหมือนใครคือมี **"learning loop" (วงจรเรียนรู้)** ในตัว — มันสร้างทักษะ (skills) จากประสบการณ์ ปรับปรุงทักษะระหว่างใช้งาน บันทึกความรู้ไว้เอง ค้นหาบทสนทนาเก่าของตัวเองได้ และค่อย ๆ เข้าใจ "คุณ" มากขึ้นข้ามเซสชัน

สโลแกน: *"The agent that grows with you"* — เอเจนต์ที่เติบโตไปพร้อมคุณ

---

## 📖 คำศัพท์ที่ควรรู้

| คำศัพท์ | ความหมายง่าย ๆ |
|---|---|
| **Agent** | AI ที่ลงมือทำงานเองได้ (ค้นเว็บ คุมเบราว์เซอร์ สร้างรูป ฯลฯ) |
| **Learning loop** | วงจรที่ Hermes "เรียนรู้จากการใช้งาน" แล้วเก่งขึ้นเรื่อย ๆ |
| **Skill** | ทักษะที่ Hermes สร้าง/ปรับปรุงเองจากประสบการณ์ |
| **Memory** | ความจำถาวรที่ติดตัวข้ามเซสชัน (ค้นด้วย FTS5 + สรุปด้วย LLM) |
| **Gateway** | ตัวรันที่ให้คุยกับ Hermes ผ่านแอปแชตต่าง ๆ |
| **MCP** | Model Context Protocol — มาตรฐานต่อ AI เข้ากับเครื่องมือ/ข้อมูลภายนอก |

---

## ⭐ จุดเด่น

- **เรียนรู้และพัฒนาตัวเอง** — วงจรป้อนกลับปิด (closed feedback loop) สร้างทักษะใหม่ + ปรับปรุงเอง
- **ความจำถาวร** — จำข้อมูลข้ามเซสชัน ค้นหาด้วย FTS5 และสรุปด้วย LLM
- **เครื่องมือเยอะ** — มีเครื่องมือในตัว 60+ อย่าง รวมถึงคุมเว็บ, vision, สร้างรูปภาพ, แปลงข้อความเป็นเสียง
- **ใช้ได้หลายโมเดล** — ต่อกับ Nous Portal, OpenRouter, OpenAI หรือ endpoint ใดก็ได้
- **เข้าถึงได้ 20+ แพลตฟอร์มแชต** — Telegram, Discord, Slack, WhatsApp, Signal, Email ฯลฯ จาก gateway เดียว
- **รันได้หลายที่** — เครื่องตัวเอง, Docker, SSH, Daytona, Singularity หรือ Modal
- **รองรับ MCP** — ต่อกับ MCP servers เพื่อเพิ่มความสามารถ

---

## 🚪 จุดเริ่มใช้งาน 2 ทาง

1. **Terminal UI** — สั่ง `hermes` เพื่อเปิดหน้าจอใช้งานในเทอร์มินัล
2. **Gateway** — รัน gateway แล้วคุยกับ Hermes ผ่าน Telegram / Discord / Slack / WhatsApp / Signal / Email

เมื่ออยู่ในบทสนทนาแล้ว มี **slash command** หลายคำสั่งที่ใช้ร่วมกันได้ทั้งสองโหมด

**ติดตั้ง:** ดาวน์โหลดตัวติดตั้งแบบ Desktop, หรือรันสคริปต์ตามระบบ (bash สำหรับ Linux/macOS/WSL2, PowerShell สำหรับ Windows) เช่น:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

---

## 📚 สารบัญเอกสาร Hermes (เรียงตาม official docs)

1. ✅ ภาพรวม Hermes (หน้านี้)
2. ⏳ User Stories & Use Cases — ตัวอย่างการใช้งานจริง
3. ⏳ Getting Started — Quickstart เริ่มต้น
4. ⏳ Using Hermes — การใช้งานผ่าน CLI
5. ⏳ Features — ภาพรวมความสามารถ
6. ⏳ Messaging Platforms — เชื่อมแพลตฟอร์มแชต
7. ⏳ Integrations — การต่อกับบริการ/โมเดลภายนอก
8. ⏳ Guides & Tutorials — คู่มือเชิงปฏิบัติ
9. ⏳ Developer Guide — สำหรับนักพัฒนา/การร่วมพัฒนา
10. ⏳ Reference — รายการคำสั่ง CLI

---

## 🔗 อ้างอิง (เอกสารทางการ)

- เอกสารหลัก: https://hermes-agent.nousresearch.com/docs/
- เว็บไซต์: https://hermes-agent.nousresearch.com/
- ซอร์สโค้ด (GitHub): https://github.com/nousresearch/hermes-agent
