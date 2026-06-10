---
title: "Kling Skills — ใช้ Kling AI ใน AI Agent"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Kling Skills คือชุดเครื่องมือ (Tool Suite) ที่ทำให้นักพัฒนานำความสามารถของ Kling AI มาใช้ใน AI Agent ได้โดยตรง ผ่านมาตรฐาน MCP (Mo"
readTime: "3 นาที"
readers: "0"
locked: false
order: 7
---
# 07 · Kling Skills — ใช้ Kling AI ใน AI Agent

> อ้างอิง: [Kling Skills Suite](https://kling.ai/document-api/apiReference%2Fskill)

---

## 1. Kling Skills Suite คืออะไร

### หัวข้อนี้คืออะไร

**Kling Skills** คือชุดเครื่องมือ (Tool Suite) ที่ทำให้นักพัฒนานำความสามารถของ Kling AI มาใช้ใน **AI Agent** ได้โดยตรง ผ่านมาตรฐาน **MCP (Model Context Protocol)** — เหมาะสำหรับผู้ที่ใช้ Claude, ChatGPT, หรือ AI Agent อื่นๆ แล้วอยากให้ Agent นั้นสร้างวิดีโอหรือภาพจาก Kling ได้โดยอัตโนมัติ

### ใช้ทำอะไร

แทนที่จะต้องเรียก Kling API โดยตรง ทำให้ AI Agent ทำได้:

- **Video Generation**: Text-to-Video, Image-to-Video, Video Editing (Omni 3.0)
  - รองรับโมเดล: `kling-v3`, `kling-v3-omni` เป็นต้น
- **Image Generation**: Text-to-Image, Image-to-Image, 4K Image
  - รองรับโมเดล: `kling-v3`, `kling-v3-omni` เป็นต้น
- **Element/Character Management**: สร้างและจัดการตัวละครที่ใช้ซ้ำได้

---

## 2. การติดตั้ง (Installation)

### URL ติดตั้ง

```
https://clawhub.ai/klingai-dev/klingai
```

เปิดลิงก์นี้แล้วคลิก **One-click Bind** เพื่อผูกบัญชี Kling AI กับ Agent โดยอัตโนมัติ

### ข้อกำหนดสภาพแวดล้อม

- **Node.js 18+** (ไม่ต้องติดตั้ง Dependency เพิ่มเติม)

### วิธียืนยันตัวตน (Authentication Methods)

มีสองวิธี:

**วิธีที่ 1: One-click Bind (แนะนำ)**
เปิด URL ติดตั้งข้างต้น ระบบจะขอ Login ด้วยบัญชี Kling AI แล้วผูกอัตโนมัติ

**วิธีที่ 2: Manual AK/SK**
รันคำสั่งนี้ใน Terminal:

```bash
node kling.mjs account --import-credentials \
  --access_key_id <YOUR_AK> \
  --secret_access_key <YOUR_SK>
```

---

## 3. ข้อมูลเพิ่มเติม

### Regions (ภูมิภาค)

ถ้าไม่ได้ตั้งค่า `KLING_API_BASE` ระบบจะตรวจจับและ Cache Endpoint ที่เหมาะสมให้อัตโนมัติ (จีน หรือ Global)

### การเชื่อมต่อกับ Platform ต่างๆ

| Platform | รายละเอียด |
|---------|-----------|
| **ClawHub** | หน้าติดตั้งหลัก สำหรับ Agent ทั่วไป |
| **Claude (MCP)** | ใช้ผ่าน Claude MCP ได้โดยตรง |

---

## 4. Notes — ข้อควรระวัง

- **มีค่าใช้จ่ายทุกครั้งที่สั่งสร้าง** ก่อนส่ง Task ให้ตรวจสอบว่า Prompt ถูกต้องก่อน เพราะเมื่อส่งแล้วจะถูกหักเครดิตทันที
- **เวลาสร้างโดยประมาณ:**
  - สร้างวิดีโอ: **1–5 นาที**
  - สร้างภาพ: **20–60 วินาที**
  - สร้าง Element: **1–3 นาที**
- **อายุไฟล์**: ผลลัพธ์ที่สร้างจะเก็บไว้ **30 วัน** ดาวน์โหลดก่อนหมดอายุ
- **รองรับสองภาษา**: โต้ตอบกับ Agent ได้ทั้งภาษาไทย/จีน และอังกฤษ ระบบตรวจจับภาษาผู้ใช้อัตโนมัติ

---

## 5. ตัวอย่างการใช้งานใน Claude

หลังติดตั้ง Kling Skills แล้ว สามารถพิมพ์คำขอแบบนี้ได้เลย:

> "สร้างวิดีโอ 5 วินาทีจากข้อความ: แมวขาวเดินอยู่บนหาดทราย ยามพระอาทิตย์ตก บรรยากาศสงบ ใช้โมเดล kling-v3 quality pro"

> "สร้างภาพ 4K ของดอกกุหลาบแดงบนโต๊ะไม้ แสง bokeh นุ่มนวล"

Claude จะเรียก Kling API ให้อัตโนมัติและส่งผลลัพธ์กลับมา
