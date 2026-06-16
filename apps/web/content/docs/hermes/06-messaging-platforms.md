---
title: "Hermes: Messaging Platforms — คุยผ่านแอปแชต"
tool: "Hermes"
icon: "tool-hermes"
level: "intermediate"
summary: "เชื่อม Hermes เข้ากับ Telegram, Discord, Slack, WhatsApp, Signal, Email และอื่น ๆ"
readTime: "4 นาที"
readers: "0"
locked: false
order: 6
---

# Messaging Platforms — เข้าถึง Hermes จากแอปแชต

> เรียบเรียงจากเอกสารทางการ [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/) หมวด Messaging Platforms

นอกจาก Terminal UI แล้ว Hermes รัน **Gateway** เพื่อให้คุยกับมันจากแอปแชตที่ใช้ทุกวันได้ — รองรับ **20+ แพลตฟอร์ม** จาก gateway เดียว

## 💬 แพลตฟอร์มที่รองรับ (ตัวอย่าง)

- **Telegram**
- **Discord**
- **Slack**
- **WhatsApp**
- **Signal**
- **Email**
- และอื่น ๆ รวมกว่า 20 แพลตฟอร์ม

## 🔌 หลักการเชื่อม (ภาพรวม)

1. รัน **Gateway** ของ Hermes
2. ตั้งค่า/ใส่ credential ของแพลตฟอร์มที่ต้องการ (เช่น bot token)
3. ทักหา Hermes ในแอปนั้นได้เลย — และใช้ **slash command** ชุดเดียวกับ Terminal UI ได้

## 💡 ข้อดี

- คุยกับผู้ช่วยตัวเดิม (ความจำ + skill เดียวกัน) ได้จากทุกที่
- เหมาะกับการสั่งงาน/เช็คสถานะระหว่างวันโดยไม่ต้องเปิดเทอร์มินัล

> รายละเอียดการตั้งค่าแต่ละแพลตฟอร์มดูในเอกสารทางการ และดูการต่อโมเดลที่หัวข้อ **Integrations**
