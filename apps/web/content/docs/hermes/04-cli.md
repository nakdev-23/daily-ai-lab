---
title: "Hermes: Using Hermes (CLI) — ใช้งานผ่านบรรทัดคำสั่ง"
tool: "Hermes"
icon: "tool-hermes"
level: "intermediate"
summary: "ใช้ Hermes ผ่าน Terminal UI และ slash commands"
readTime: "4 นาที"
readers: "0"
locked: false
order: 4
---

# ใช้งาน Hermes ผ่าน CLI

> เรียบเรียงจากเอกสารทางการ [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/) หมวด Using Hermes

## 💻 Terminal UI

สั่ง `hermes` เพื่อเปิดหน้าใช้งานในเทอร์มินัล — พิมพ์คุยกับ agent ได้เหมือนแชต แต่ทำงานบนเครื่องคุณและเข้าถึงเครื่องมือ/ไฟล์ได้

## ⌨️ Slash Commands

ภายในบทสนทนา มีคำสั่งขึ้นต้นด้วย `/` ที่ใช้ควบคุมการทำงาน — และคำสั่งเหล่านี้ **ใช้ร่วมกันได้ทั้งใน Terminal UI และผ่าน Gateway** (แชตจากแพลตฟอร์มต่าง ๆ)

ตัวอย่างประเภทคำสั่งที่มักมี:
- จัดการบทสนทนา/เซสชัน
- เรียกดู/จัดการ **memory** (ความจำ) และ **skills**
- ตั้งค่าโมเดล/พฤติกรรม
- เรียกเครื่องมือเฉพาะ

> รายการคำสั่งทั้งหมดดูได้ที่หัวข้อ **Reference (CLI Commands)**

## 🔁 ทำงานต่อเนื่อง

เพราะ Hermes มีความจำถาวรและ learning loop การใช้ผ่าน CLI ซ้ำ ๆ จะทำให้มันค่อย ๆ เข้าใจสไตล์งานของคุณและสร้าง skill มาช่วยในครั้งถัดไป
