---
title: "Gemini API — เริ่มต้นสำหรับนักพัฒนา"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "คู่มือเริ่มต้นใช้ Gemini API สำหรับนักพัฒนา ครอบคลุมการขอ API key, ติดตั้ง SDK, เรียกใช้โมเดล และโครงสร้างพื้นฐานที่ควรรู้"
readTime: "10 นาที"
readers: "0"
locked: false
order: 22
---

# Gemini API — เริ่มต้นสำหรับนักพัฒนา

**Gemini API** (ช่องทางเชื่อมต่อโปรแกรม — เหมือนสะพานให้แอปของคุณคุยกับ Gemini ได้) คือ interface (ส่วนเชื่อมต่อ) สำหรับนักพัฒนาที่ต้องการนำความสามารถของ Gemini ไปสร้างแอปพลิเคชันของตัวเอง ไม่ว่าจะเป็น chatbot (บอทสนทนา), เครื่องมือวิเคราะห์ข้อมูล, ระบบ AI อัตโนมัติ หรืออื่นๆ

---

## ทำไมต้องใช้ Gemini API?

- **ควบคุมได้เต็มที่** — เลือกโมเดล, ปรับพารามิเตอร์ (ค่าตั้งต่างๆ), กำหนด system instruction (คำสั่งระดับระบบ — บอก AI ให้เป็นอะไร)
- **รวมเข้ากับแอปของคุณ** — สร้าง AI feature (ฟีเจอร์ AI) ในผลิตภัณฑ์ของตัวเอง
- **ใช้ฟีเจอร์ขั้นสูง** — Function calling (การเรียกใช้ฟังก์ชัน), Context caching (การเก็บบริบทชั่วคราว), Grounding (การยึดกับข้อมูลจริง), Thinking (การคิดเชิงลึก)
- **ขยายขนาดได้** — Batch processing (ประมวลผลเป็นชุด), rate limits (ขีดจำกัดความถี่การเรียก) ที่ยืดหยุ่น
- **เริ่มต้นฟรี** — Google AI Studio ให้ quota (โควตา — จำนวนครั้งที่ใช้ได้) ฟรีสำหรับการพัฒนา

---

## ขั้นตอนที่ 1: รับ API Key (รหัสเข้าถึง API)

1. ไปที่ [aistudio.google.com](https://aistudio.google.com)
2. ล็อกอินด้วย Google Account
3. คลิก **"Get API key"** หรือ **"Create API key"**
4. เลือกโปรเจกต์ Google Cloud (หรือสร้างใหม่)
5. คัดลอก API key ไว้ในที่ปลอดภัย

> **ข้อควรระวัง:** ไม่ควรเขียน API key ในโค้ดโดยตรง ใช้ environment variables (ตัวแปรสภาพแวดล้อม — เก็บค่าสำคัญนอกโค้ด) แทน

```bash
# ตัวอย่างตั้งค่า environment variable
export GEMINI_API_KEY="your_api_key_here"
```

---

## ขั้นตอนที่ 2: ติดตั้ง SDK (ชุดเครื่องมือนักพัฒนา)

### Python (แนะนำสำหรับผู้เริ่มต้น)
```bash
pip install -q -U google-genai
```
ต้องการ Python 3.9 ขึ้นไป

### JavaScript / Node.js
```bash
npm install @google/genai
```
ต้องการ Node.js v18 ขึ้นไป

### Go
```bash
go get google.golang.org/genai
```

### REST API (ไม่ต้องติดตั้ง)
ใช้ `curl` หรือ HTTP client (โปรแกรมส่งคำขอทางเว็บ) ใดก็ได้ ไม่ต้องติดตั้ง SDK

---

## ขั้นตอนที่ 3: เรียก API ครั้งแรก

### Python
```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="อธิบายว่า Machine Learning คืออะไร ในภาษาไทย"
)

print(response.text)
```

### JavaScript
```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "อธิบายว่า Machine Learning คืออะไร ในภาษาไทย",
});

console.log(response.text);
```

### REST (curl)
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "อธิบาย Machine Learning"}]}]}'
```

---

## โมเดลที่มีให้ใช้งาน

### โมเดลสำหรับ Text & Multimodal (ข้อความและหลายรูปแบบ)

| โมเดล | จุดเด่น | เหมาะกับ |
|---|---|---|
| `gemini-2.5-pro` | ฉลาดที่สุด, reasoning (การให้เหตุผล) ดี | งานซับซ้อน, วิเคราะห์เชิงลึก |
| `gemini-2.5-flash` | ราคา-ประสิทธิภาพดีที่สุด | งานทั่วไป, latency (ความล่าช้า) ต่ำ |
| `gemini-2.5-flash-lite` | เร็วและถูกที่สุด | งานปริมาณมาก |

### โมเดลเฉพาะทาง

| โมเดล | ใช้สำหรับ |
|---|---|
| `imagen-4.0-generate-001` | สร้างภาพ |
| `veo-3` | สร้างวิดีโอ |
| `gemini-embedding-2` | สร้าง embedding vectors (การแปลงข้อความเป็นตัวเลขเพื่อค้นหาความหมาย) |
| `gemini-2.5-flash-live` | Live API (audio/video streaming — การส่งเสียง/วิดีโอแบบต่อเนื่อง) |

---

## โครงสร้างพื้นฐาน: Content และ Parts

Gemini API ใช้โครงสร้าง `Content` (เนื้อหา) และ `Part` (ส่วนประกอบ) ในการส่งข้อมูล:

```python
# ข้อความธรรมดา
contents = "สวัสดี Gemini"

# หลาย parts (ข้อความ + รูปภาพ)
contents = [
    {
        "parts": [
            {"text": "มีอะไรในรูปนี้?"},
            {"inline_data": {"mime_type": "image/jpeg", "data": base64_image}}
        ]
    }
]

# บทสนทนา (multi-turn — หลายรอบโต้ตอบ)
contents = [
    {"role": "user", "parts": [{"text": "สวัสดี"}]},
    {"role": "model", "parts": [{"text": "สวัสดีครับ มีอะไรให้ช่วยไหมครับ?"}]},
    {"role": "user", "parts": [{"text": "บอกเรื่องตลกหน่อย"}]},
]
```

---

## พารามิเตอร์สำคัญ

### Generation Config (ค่าควบคุมการสร้างคำตอบ)
```python
config = {
    "temperature": 0.7,        # ความสร้างสรรค์ (0 = แน่นอน, 2 = สร้างสรรค์สูง)
    "top_p": 0.95,             # Nucleus sampling (การสุ่มเลือกจากคำที่มีความน่าจะเป็นสูง)
    "top_k": 40,               # Top-k sampling (เลือกจากคำ k อันดับต้น)
    "max_output_tokens": 8192, # จำนวน token (ชิ้นส่วนข้อความ) สูงสุดในคำตอบ
    "stop_sequences": ["\n\n"] # หยุดเมื่อพบ sequence (ลำดับตัวอักษร) นี้
}
```

### System Instruction (คำสั่งระดับระบบ — กำหนดบุคลิกและพฤติกรรมของ AI)
```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    config={
        "system_instruction": "คุณเป็นผู้ช่วย AI ที่ตอบภาษาไทยเสมอ ใช้ภาษาสุภาพและเป็นมืออาชีพ"
    },
    contents="อธิบาย REST API"
)
```

---

## Streaming (รับคำตอบแบบ real-time — ทีละส่วน)

แทนที่จะรอคำตอบทั้งหมด สามารถรับทีละส่วนได้ — เหมือนการพิมพ์สดๆ:

```python
for chunk in client.models.generate_content_stream(
    model="gemini-2.5-flash",
    contents="เขียนบทความยาวๆ เกี่ยวกับ AI"
):
    print(chunk.text, end="", flush=True)
```

---

## Multi-turn Chat (สนทนาหลายรอบ — AI จำบริบทต่อเนื่อง)

```python
chat = client.chats.create(model="gemini-2.5-flash")

response1 = chat.send_message("สวัสดี ฉันชื่อ Nook")
print(response1.text)

response2 = chat.send_message("ชื่อฉันคืออะไร?")
print(response2.text)  # Gemini จำชื่อ "Nook" ได้
```

---

## ราคาและ Quota ฟรี

### ใช้งานฟรีผ่าน Google AI Studio
- **gemini-2.5-flash**: 15 requests/นาที, 1,500 requests/วัน
- **gemini-2.5-pro**: 2 requests/นาที, 50 requests/วัน

### ใช้งานแบบเสียเงิน (Pay-as-you-go — จ่ายตามที่ใช้จริง)
- คิดตาม token (ชิ้นส่วนข้อความ) input และ output
- ราคาแตกต่างกันตามโมเดล
- ดูราคาล่าสุดได้ที่ [ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## Google AI Studio — Playground (พื้นที่ทดสอบ) สำหรับนักพัฒนา

[AI Studio](https://aistudio.google.com) คือเครื่องมือ web-based (ใช้งานผ่านเบราว์เซอร์) สำหรับ:
- ทดสอบ prompt โดยไม่ต้องเขียนโค้ด
- ปรับ model settings (ค่าตั้งโมเดล) แบบ visual (เห็นผลทันที)
- ดู token count (จำนวนชิ้นส่วนข้อความ)
- Export (ส่งออก) เป็นโค้ด Python/JavaScript/curl ได้ทันที
- จัดการ API keys

---

## ขั้นตอนถัดไป

หลังเริ่มต้นแล้ว ควรเรียนรู้ต่อใน:
- **Function Calling** — เชื่อม Gemini กับ API/tools ของคุณ
- **Context Caching** — ลดต้นทุนสำหรับ content ที่ใช้ซ้ำ
- **Grounding with Search** — ดึงข้อมูล real-time จาก Google Search
- **Thinking Mode** — เปิดโหมด reasoning (การให้เหตุผล) สำหรับปัญหาซับซ้อน
- **Structured Output** — รับคำตอบในรูปแบบ JSON (รูปแบบข้อมูลมาตรฐาน) ที่กำหนดเอง
