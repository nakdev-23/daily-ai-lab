---
title: "เริ่มต้นใช้งาน API"
tool: "Perplexity"
icon: "icon-docs"
level: "beginner"
summary: "คู่มือเริ่มต้นสำหรับนักพัฒนา ตั้งแต่การสมัครบัญชีจนถึงการเรียก API ครั้งแรก"
readTime: "6 นาที"
readers: "0"
locked: false
order: 2
---

# เริ่มต้นใช้งาน API (Quickstart Guide)

คู่มือนี้จะพาคุณตั้งค่าและเรียกใช้ Perplexity API ครั้งแรกตั้งแต่ต้นจนจบ ใช้เวลาไม่ถึง 10 นาที

---

## ขั้นตอนที่ 1 — สร้าง API Key

**API Key** (กุญแจ API — รหัสลับที่ใช้พิสูจน์ตัวตนเมื่อเรียกใช้ API) คือสิ่งแรกที่คุณต้องมี

1. ไปที่ **[console.perplexity.ai](https://console.perplexity.ai)**
2. สมัครบัญชีหรือล็อกอิน
3. ไปที่เมนู **API Keys**
4. กด **"Generate New Key"** (สร้างกุญแจใหม่)
5. **คัดลอกและบันทึก** ค่า Key ไว้ทันที เพราะระบบจะแสดงเพียงครั้งเดียวตอนสร้าง

> **สำคัญมาก:** อย่าแชร์ API Key ให้ใคร และอย่านำไปใส่ใน Code ที่จะ Upload ขึ้น GitHub (เพราะคนอื่นจะเอาไปใช้ได้และคุณจะโดนเก็บเงิน)

---

## ขั้นตอนที่ 2 — ติดตั้ง SDK

**SDK** (Software Development Kit — ชุดเครื่องมือสำหรับนักพัฒนา ที่ทำให้เรียก API ได้ง่ายขึ้น) มีให้เลือกสองภาษาหลัก:

### Python
```bash
pip install perplexityai
```

### TypeScript / Node.js
```bash
npm install @perplexity-ai/perplexity_ai
```

---

## ขั้นตอนที่ 3 — ตั้งค่า Environment Variable

**Environment Variable** (ตัวแปรสภาพแวดล้อม — ที่เก็บข้อมูลลับในระบบ แยกออกจาก Code) คือวิธีที่ปลอดภัยที่สุดในการเก็บ API Key

### macOS / Linux
```bash
export PERPLEXITY_API_KEY="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Windows (Command Prompt)
```cmd
set PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Windows (PowerShell)
```powershell
$env:PERPLEXITY_API_KEY = "pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## ขั้นตอนที่ 4 — เรียก API ครั้งแรก

### ตัวอย่างด้วย Python (Agent API)
```python
from perplexityai import Perplexity

client = Perplexity()  # ดึง API Key จาก Environment Variable อัตโนมัติ

response = client.agent.create(
    preset="pro-search",  # ใช้ Preset สำเร็จรูป (ชุดการตั้งค่าที่เตรียมไว้แล้ว)
    input="AI ช่วยอะไรได้บ้างในปี 2026?"
)

print(response.output_text)
```

### ตัวอย่างด้วย TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const response = await client.agent.create({
  preset: "pro-search",
  input: "AI ช่วยอะไรได้บ้างในปี 2026?",
});

console.log(response.output_text);
```

### ตัวอย่างด้วย cURL (Command Line)
```bash
curl -X POST https://api.perplexity.ai/v1/agent \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "preset": "pro-search",
    "input": "AI ช่วยอะไรได้บ้างในปี 2026?"
  }'
```

---

## ทำความเข้าใจ Response (คำตอบที่ได้กลับมา)

เมื่อเรียก API สำเร็จ คุณจะได้ JSON (รูปแบบข้อมูลมาตรฐาน) กลับมา มีโครงสร้างหลักดังนี้:

```json
{
  "id": "resp_abc123",
  "output_text": "คำตอบจาก AI...",
  "citations": [
    {
      "url": "https://example.com/article",
      "title": "ชื่อบทความ"
    }
  ],
  "usage": {
    "input_tokens": 50,
    "output_tokens": 200,
    "total_cost": 0.00025
  }
}
```

- `output_text` — คำตอบที่ AI สร้างขึ้น
- `citations` (แหล่งอ้างอิง) — รายการเว็บที่ใช้ในการตอบ
- `usage` — จำนวน Token (หน่วยข้อความ — คำหรือส่วนของคำที่ AI นับ) และค่าใช้จ่าย

---

## เลือก API ที่ใช่สำหรับงานของคุณ

Perplexity มี 4 API หลัก เลือกตามงาน:

| งานที่ต้องการทำ | API ที่แนะนำ |
|---|---|
| สร้าง AI Agent ที่ทำงานหลายขั้นตอน | Agent API |
| ค้นหาเว็บและได้ผลลัพธ์ดิบ (ลิงก์/สรุป) | Search API |
| ถามตอบด้วย AI พร้อมค้นหาเว็บ | Sonar API |
| แปลงข้อความเป็น Vector สำหรับ RAG | Embeddings API |

**RAG** (Retrieval-Augmented Generation — การสร้างข้อความโดยดึงข้อมูลจากฐานความรู้ของเราเอง) คือเทคนิคยอดนิยมที่ผสมฐานข้อมูลของเรากับ AI

---

## สรุปขั้นตอน

1. สร้าง API Key ที่ console.perplexity.ai
2. ติดตั้ง SDK (Python หรือ TypeScript)
3. ตั้งค่า `PERPLEXITY_API_KEY` เป็น Environment Variable
4. เรียก API ด้วย Code ตัวอย่าง
5. รับ Response และนำไปใช้งานต่อ

ขั้นตอนต่อไปคือเรียนรู้แต่ละ API อย่างละเอียดในบทถัดไป
