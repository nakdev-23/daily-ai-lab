---
title: "Hermes: Features — ความสามารถทั้งหมด"
tool: "Hermes"
icon: "tool-hermes"
level: "intermediate"
summary: "learning loop, ความจำถาวร, เครื่องมือ 60+ อย่าง, vision, สร้างรูป, TTS และ MCP"
readTime: "5 นาที"
readers: "0"
locked: false
order: 5
---

# Features — ความสามารถของ Hermes

> เรียบเรียงจากเอกสารทางการ [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/) หมวด Features

## 🔁 Learning Loop (เรียนรู้-พัฒนาตัวเอง)

หัวใจที่ไม่เหมือนใครของ Hermes — วงจรป้อนกลับปิด (closed feedback loop) ที่ทำให้มัน:
- **สร้าง skill จากประสบการณ์** แล้วปรับปรุงระหว่างใช้
- เตือนตัวเองให้บันทึกความรู้ไว้
- ค้นหาบทสนทนาเก่าของตัวเองมาอ้างอิง
- เข้าใจ "ตัวคุณ" ลึกขึ้นเรื่อย ๆ ข้ามเซสชัน

## 🧠 ความจำถาวร (Memory)

จำข้อมูลข้ามเซสชัน ค้นด้วย **FTS5 (full-text search)** และสรุปด้วย **LLM** — ปิดแล้วเปิดใหม่ก็ยังจำบริบทได้

## 🧰 เครื่องมือในตัว 60+ อย่าง

รวมถึง:
- **Web** — ค้นเว็บ + คุมเบราว์เซอร์ (web control)
- **Vision** — เข้าใจรูปภาพ
- **Image generation** — สร้างรูป
- **Text-to-Speech (TTS)** — แปลงข้อความเป็นเสียง
- และอีกหลายสิบเครื่องมือสำหรับงานทั่วไป

## 🔌 รองรับ MCP

ต่อกับ **MCP servers** เพื่อเพิ่มความสามารถ/เชื่อมเครื่องมือภายนอก

## 🧮 Multi-model reasoning

ใช้หลายโมเดลในการคิด/ทำงานได้ และต่อกับ provider ได้หลายเจ้า (ดู **Integrations**)

> ความสามารถเหล่านี้เข้าถึงได้ทั้งผ่าน Terminal UI และ Gateway (แชต 20+ แพลตฟอร์ม — ดู **Messaging Platforms**)
