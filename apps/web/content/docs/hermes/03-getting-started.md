---
title: "Hermes: Getting Started — ติดตั้งและเริ่มใช้"
tool: "Hermes"
icon: "tool-hermes"
level: "beginner"
summary: "ติดตั้ง Hermes Agent และเริ่มคุยผ่าน Terminal UI หรือ Gateway"
readTime: "4 นาที"
readers: "0"
locked: false
order: 3
---

# เริ่มต้นใช้งาน Hermes

> เรียบเรียงจากเอกสารทางการ [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/) หมวด Getting Started / Quickstart

## ⬇️ ติดตั้ง

เลือกทางใดทางหนึ่ง:

- **ตัวติดตั้งแบบ Desktop** — ดาวน์โหลดจากเว็บทางการ
- **สคริปต์ตามระบบ** — bash สำหรับ Linux/macOS/WSL2, PowerShell สำหรับ Windows เช่น:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

## 🔑 เชื่อมโมเดล (Provider)

Hermes ต่อกับโมเดลได้หลายแหล่ง — **Nous Portal**, **OpenRouter**, **OpenAI** หรือ endpoint ใดก็ได้ (ดูหัวข้อ **Integrations**) เตรียม API key ของแหล่งที่เลือกไว้

## 🚪 เริ่มคุย 2 ทาง

1. **Terminal UI** — สั่ง `hermes` เพื่อเปิดหน้าใช้งานในเทอร์มินัล
2. **Gateway** — รัน gateway แล้วคุยผ่าน Telegram / Discord / Slack / WhatsApp / Signal / Email

เมื่ออยู่ในบทสนทนา มี **slash command** หลายคำสั่งใช้ร่วมกันได้ทั้งสองโหมด (ดูหัวข้อ **Reference**)

## 🏃 รันที่ไหนก็ได้

Hermes รันได้บนเครื่องตัวเอง, Docker, SSH, Daytona, Singularity หรือ Modal — เลือกตามความสะดวก

> ขั้นต่อไป: ดู **Using Hermes (CLI)** เพื่อใช้งานผ่านบรรทัดคำสั่ง และ **Features** เพื่อรู้จักความสามารถทั้งหมด
