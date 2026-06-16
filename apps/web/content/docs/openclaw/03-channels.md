---
title: "OpenClaw: Channels — เชื่อมแอปแชต"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "intermediate"
summary: "เชื่อม OpenClaw เข้ากับ Discord, Slack, Telegram, WhatsApp, Teams และอื่น ๆ เพื่อคุยกับ AI จากแอปที่ใช้ทุกวัน"
readTime: "5 นาที"
readers: "0"
locked: false
order: 4
---

# Channels — เชื่อมแอปแชตเข้ากับ OpenClaw

> เรียบเรียงจากเอกสารทางการ [docs.openclaw.ai](https://docs.openclaw.ai/) หมวด Channels

**Channel** คือช่องทางแชตที่ต่อเข้ากับ Gateway เพื่อให้คุณคุยกับผู้ช่วย AI จากแอปที่ใช้ทุกวัน แทนที่จะต้องเปิดหน้า Control UI เสมอ

## 💬 ช่องทางที่รองรับ (built-in)

- **Discord**
- **Slack**
- **Telegram**
- **WhatsApp**
- **Microsoft Teams**
- **Google Chat**
- **Signal**
- **iMessage**
- **Matrix**
- **Zalo**
- **WebChat** (หน้าแชตในเบราว์เซอร์)

และมี **ปลั๊กอินจากชุมชน** เพิ่มเติม เช่น **Nostr** และ **Twitch**

## 🔌 วิธีเชื่อม (ภาพรวม)

แต่ละช่องทางมีขั้นตอนตั้งค่าของตัวเอง แต่หลักการคล้ายกัน:

1. สร้าง bot/แอปในแพลตฟอร์มนั้น (เช่น Discord Bot, Telegram Bot จาก BotFather) แล้วได้ **token**
2. ใส่ token ลงในไฟล์ตั้งค่าของ OpenClaw (ดูหัวข้อ **Gateway Configuration**)
3. รีสตาร์ท Gateway แล้วทักหา bot ในแอปนั้นได้เลย

## 🛡️ ความปลอดภัยของแชตกลุ่ม

- ตั้ง **allowlist** ว่าใครคุยกับ AI ได้ (เช่น `channels.whatsapp.allowFrom`)
- ในกลุ่ม ตั้งให้ตอบเฉพาะเมื่อถูก **mention** (พิมพ์ @ ถึง bot) เพื่อกันมันตอบทุกข้อความ
- แยกเซสชันต่อผู้ส่ง/ต่อกลุ่ม (ดูหัวข้อ **Routing**)

> มือถือ: ดูหัวข้อ **Nodes** สำหรับการต่อ iOS/Android เป็นช่องทาง/อุปกรณ์เสริม
