---
title: "OpenClaw: Gateway Configuration — ตั้งค่าหลัก"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "intermediate"
summary: "ตั้งค่า Gateway ของ OpenClaw — provider/โมเดล, โทเคน, path และไฟล์ config"
readTime: "5 นาที"
readers: "0"
locked: false
order: 5
---

# Gateway Configuration — ตั้งค่าหลักของ OpenClaw

> เรียบเรียงจากเอกสารทางการ [docs.openclaw.ai](https://docs.openclaw.ai/) หมวด Gateway

**Gateway** คือหัวใจของ OpenClaw — โปรเซสเดียวที่รันบนเครื่องคุณ ทำหน้าที่เป็นสะพานเชื่อมแอปแชตเข้ากับโมเดล AI การตั้งค่าส่วนใหญ่อยู่ที่นี่

## 🧠 Provider & โมเดล

- ต้องมี **API key** ของผู้ให้บริการที่เลือก (Anthropic / OpenAI / Google ฯลฯ)
- เอกสารทางการแนะนำให้ใช้ **โมเดลรุ่นล่าสุดที่แรงที่สุด** เพื่อคุณภาพและความปลอดภัยของ agent
- กำหนด provider/โมเดล/โทเคน ในไฟล์ตั้งค่า

## 🔑 โทเคนและช่องทาง

- โทเคนของแต่ละ **channel** (Discord, Telegram ฯลฯ) ใส่ในส่วน config ของช่องทางนั้น
- โทเคนเข้าถึง Gateway/Control UI สำหรับยืนยันตัวตน

## 📁 ตำแหน่งไฟล์และ path

ปรับผ่าน environment variable ได้:

| ตัวแปร | ใช้ทำอะไร |
|---|---|
| `OPENCLAW_HOME` | โฟลเดอร์หลักของ OpenClaw |
| `OPENCLAW_STATE_DIR` | ที่เก็บสถานะ/ข้อมูลรันไทม์ |
| `OPENCLAW_CONFIG_PATH` | path ไฟล์ config |
| `gateway.controlUi.root` | โฟลเดอร์หน้า Control UI (ปรับแต่งเองได้) |

## 🔧 คำสั่งที่ใช้บ่อย

```bash
openclaw onboard --install-daemon   # ตั้งค่าเริ่มต้น + ติดตั้งบริการ
openclaw gateway status             # เช็คว่า Gateway ทำงานอยู่ไหม
openclaw dashboard                  # เปิดหน้าควบคุม
```

> หลังแก้ config ให้รีสตาร์ท Gateway เพื่อให้ค่าใหม่มีผล
