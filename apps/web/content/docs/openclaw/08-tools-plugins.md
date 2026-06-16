---
title: "OpenClaw: Tools & Plugins — เครื่องมือและส่วนขยาย"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "pro"
summary: "เครื่องมือที่ agent ใช้ได้ ปลั๊กอินช่องทางเสริม และการต่อมือถือ (Nodes)"
readTime: "4 นาที"
readers: "0"
locked: false
order: 8
---

# Tools & Plugins — ขยายความสามารถ OpenClaw

> เรียบเรียงจากเอกสารทางการ [docs.openclaw.ai](https://docs.openclaw.ai/) หมวด Tools & Plugins / Nodes

OpenClaw ขยายความสามารถได้หลายทาง — ตั้งแต่เครื่องมือที่ agent เรียกใช้ ไปจนถึงปลั๊กอินช่องทางและอุปกรณ์มือถือ

## 🧰 เครื่องมือ (Tools)

agent ใช้เครื่องมือเพื่อ "ลงมือทำ" ได้จริง เช่น เข้าถึงไฟล์ รันคำสั่งในเชลล์ คุมเบราว์เซอร์ และจัดการสื่อ (รูป/เสียง/เอกสาร) — ทำให้ไม่ใช่แค่แชตตอบ แต่ทำงานให้เสร็จได้

## 🧩 Plugins (ส่วนขยาย)

- **Channel plugins** — เพิ่มช่องทางแชตนอกเหนือจาก built-in เช่น **Nostr**, **Twitch** (จากชุมชน)
- ส่วนขยายแบบ bundled หรือ external ที่เพิ่มความสามารถเฉพาะทาง

## 📱 Nodes — ต่อมือถือ

OpenClaw รองรับการต่อ **iOS / Android** เป็น "node" เพื่อเปิดความสามารถเสริม เช่น เวิร์กโฟลว์ผ่านกล้อง/Canvas และใช้มือถือเป็นช่องทาง/อุปกรณ์ของ agent

## 🌐 Web Control UI

หน้าควบคุมในเบราว์เซอร์ (`openclaw dashboard`) ใช้ดูสถานะ ตั้งค่า และแชตกับ agent ได้โดยตรง ปรับแต่งโฟลเดอร์หน้าได้ที่ `gateway.controlUi.root`

> ดูการตั้งค่าโทเคน/ความปลอดภัยของแต่ละเครื่องมือในหัวข้อ **Gateway Configuration** และ **Security**
