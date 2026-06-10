---
title: "Live API — สร้าง AI แบบ Real-time Audio และ Video"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Gemini Live API ให้นักพัฒนาสร้างแอปที่โต้ตอบด้วยเสียงและวิดีโอแบบ real-time เหมาะสำหรับ voice assistant, การแปลภาษา live และ interactive AI"
readTime: "9 นาที"
readers: "0"
locked: false
order: 29
---

# Live API — สร้าง AI แบบ Real-time Audio และ Video

**Gemini Live API** (ช่องทาง API แบบสดๆ — สำหรับโต้ตอบด้วยเสียงและวิดีโอแบบต่อเนื่อง) คือ API สำหรับสร้างแอปพลิเคชันที่โต้ตอบกับ Gemini แบบ real-time (ทันทีในขณะนั้น) ผ่านเสียงและวิดีโอ ต่างจาก API ปกติที่ส่ง request (คำขอ) และรอ response (คำตอบ), Live API ทำงานเป็น **streaming session** (การเชื่อมต่อส่งข้อมูลต่อเนื่อง) ต่อเนื่อง — เหมือนการโทรศัพท์กับ AI

---

## Live API คืออะไร?

Live API ออกแบบมาสำหรับ:
- **Voice assistants** (ผู้ช่วยเสียง) — AI ที่ฟังและพูดแบบ natural (เป็นธรรมชาติ)
- **Real-time translation** (การแปลภาษาสด) — แปลภาษาขณะพูด
- **Video analysis** (การวิเคราะห์วิดีโอสด) — วิเคราะห์วิดีโอสดและตอบสนอง
- **Interactive tutoring** (การสอนแบบโต้ตอบ) — ครู AI ที่โต้ตอบได้
- **Customer service bots** (บอทบริการลูกค้า) — ระบบ call center AI

---

## ความสามารถหลัก

### Input (ข้อมูลที่รับได้) ที่รองรับ
- **เสียง:** PCM 16-bit ที่ 16kHz (รูปแบบไฟล์เสียงดิจิทัลมาตรฐาน)
- **รูปภาพ:** JPEG ที่ส่งได้สูงสุด 1 frame/วินาที
- **ข้อความ:** Text ปกติ

### Output (ข้อมูลที่ส่งกลับ) ที่ได้
- **เสียง:** PCM 24kHz (เสียงธรรมชาติ คุณภาพสูงกว่า input)
- **ข้อความ:** Transcript (ข้อความถอดเสียง) ของทั้งผู้ใช้และ AI
- **Function calls:** เรียก function (ฟังก์ชัน) ระหว่างการสนทนา

### ฟีเจอร์พิเศษ
- **70+ ภาษา** รวมถึงภาษาไทย
- **Barge-in** (การพูดแทรก): ผู้ใช้พูดแทรกได้ทันที (AI หยุดฟัง)
- **Affective dialog** (การสนทนาที่รับรู้อารมณ์): AI ปรับโทนเสียงตามอารมณ์ผู้ใช้
- **Live Translation** (การแปลสด): แปลเสียงพูดแบบ real-time

---

## โมเดลสำหรับ Live API

| โมเดล | คุณสมบัติ |
|---|---|
| `gemini-2.5-flash-live` | เร็ว, เสถียร, เหมาะสำหรับ production (ระบบจริง) |
| `gemini-3.1-flash-live` | ล่าสุด, คุณภาพเสียงดีกว่า (Preview — ยังอยู่ระหว่างทดสอบ) |

---

## สถาปัตยกรรม: สองแบบการเชื่อมต่อ

### 1. Server-to-Server (แนะนำสำหรับ production)
```
[Client App] → [Your Backend Server] → [Gemini Live API]
```
- Backend (เซิร์ฟเวอร์หลังบ้าน) รับ audio stream (กระแสเสียง) จาก client
- Backend เชื่อมต่อกับ Gemini ผ่าน WebSocket (โปรโตคอลการเชื่อมต่อแบบถาวร)
- **ปลอดภัยกว่า** — API key ไม่ถูก expose (เปิดเผย) ที่ client
- เหมาะกับแอปที่มีผู้ใช้หลายคน

### 2. Client-to-Server (เหมาะกับ development)
```
[Client App] ──────────────→ [Gemini Live API]
```
- Client (แอปฝั่งผู้ใช้) เชื่อมต่อตรงกับ Gemini
- ต้องใช้ **Ephemeral Token** (โทเคนชั่วคราว — รหัสที่หมดอายุเร็ว เพื่อความปลอดภัย) แทน API key ที่ client
- Latency (ความล่าช้า) ต่ำกว่า
- เหมาะกับ prototype (ต้นแบบ) และทดสอบ

---

## ตัวอย่างโค้ด: Basic Voice Session (Python)

```python
import asyncio
import pyaudio
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

async def voice_session():
    # สร้าง Live session (การเชื่อมต่อสด)
    async with client.aio.live.connect(
        model="gemini-2.5-flash-live",
        config={
            "response_modalities": ["AUDIO"],  # หรือ ["TEXT"] หรือ ["AUDIO", "TEXT"]
            "system_instruction": "คุณเป็นผู้ช่วย AI ที่พูดภาษาไทย ตอบสั้นและชัดเจน"
        }
    ) as session:
        
        # ส่งเสียงผู้ใช้
        await session.send_realtime_input(
            audio={"data": audio_bytes, "mime_type": "audio/pcm;rate=16000"}
        )
        
        # รับการตอบสนอง
        async for response in session.receive():
            if response.data:
                # เล่นเสียง AI
                play_audio(response.data)
            if response.text:
                print(f"AI: {response.text}")

asyncio.run(voice_session())
```

---

## Ephemeral Tokens (โทเคนชั่วคราว — สำหรับ Client-side)

เพื่อความปลอดภัย ใช้ ephemeral token (โทเคนที่หมดอายุเร็ว) แทน API key ที่ client:

```python
# Backend: สร้าง ephemeral token
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# สร้าง token ที่หมดอายุใน 1 นาที
token_response = client.auth_tokens.create(
    config={
        "uses": 1,       # ใช้ได้ 1 ครั้ง
        "ttl": "60s"     # หมดอายุใน 60 วินาที
    }
)

ephemeral_token = token_response.name
# ส่ง token นี้ไปยัง client
```

```javascript
// Client: ใช้ ephemeral token
const ai = new GoogleGenAI({ apiKey: ephemeralToken });

const session = await ai.live.connect({
  model: "gemini-2.5-flash-live",
  config: { responseModalities: ["AUDIO"] }
});
```

---

## Live Translation (การแปลภาษาสด)

ฟีเจอร์แปลภาษาแบบ real-time ด้วย Gemini 3.x:

```python
async with client.aio.live.connect(
    model="gemini-3.1-flash-live",
    config={
        "response_modalities": ["AUDIO"],
        "system_instruction": """
        คุณเป็นล่ามแบบ real-time
        เมื่อได้ยินเสียงภาษาอังกฤษ ให้แปลเป็นภาษาไทยทันที
        เมื่อได้ยินเสียงภาษาไทย ให้แปลเป็นภาษาอังกฤษทันที
        """
    }
) as session:
    # ส่งเสียงจาก microphone
    # รับเสียงแปลกลับมา
    ...
```

---

## Function Calling (การเรียกฟังก์ชัน) ใน Live Session

```python
tools = [{
    "function_declarations": [{
        "name": "get_weather",
        "description": "ดูสภาพอากาศ",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"}
            }
        }
    }]
}]

async with client.aio.live.connect(
    model="gemini-2.5-flash-live",
    config={"tools": tools}
) as session:
    
    async for response in session.receive():
        if response.tool_call:
            # Gemini ขอเรียก function
            func_name = response.tool_call.function_calls[0].name
            func_args = response.tool_call.function_calls[0].args
            
            # รัน function
            result = run_function(func_name, func_args)
            
            # ส่งผลกลับ
            await session.send_tool_response(result)
```

---

## การจัดการ Session (รอบการเชื่อมต่อ)

### ควบคุม Turn (คิว)
```python
# บอก Gemini ว่าผู้ใช้พูดจบแล้ว
await session.send_realtime_input(audio_stream_end=True)
```

### ขัดจังหวะ (Barge-in)
Live API รองรับ barge-in (การพูดแทรก) อัตโนมัติ — เมื่อ AI กำลังพูดและผู้ใช้พูดแทรก AI จะหยุดทันที

### Session Resumption (การต่อการสนทนาจากที่ค้างไว้)
```python
# บันทึก session handle เพื่อ resume (กลับมาต่อ)
session_handle = session.session_resumption_handle

# ใน session ใหม่
async with client.aio.live.connect(
    model="gemini-2.5-flash-live",
    config={"session_resumption": {"handle": session_handle}}
) as resumed_session:
    # ต่อการสนทนาจากที่ค้างไว้
    ...
```

---

## กรณีการใช้งานจริง

| Use Case | Input | Output |
|---|---|---|
| Voice assistant (ผู้ช่วยเสียง) | Audio | Audio + Text |
| Real-time translator (ล่ามสด) | Audio | Audio (ภาษาอื่น) |
| Video analysis (วิเคราะห์วิดีโอ) | Video frames + Audio | Text/Audio |
| Interactive tutor (ครูสอนแบบโต้ตอบ) | Audio + Images | Audio + Text |
| Customer service (บริการลูกค้า) | Audio | Audio |
| Accessibility tool (เครื่องมือช่วยเข้าถึง) | Audio/Video | Text transcript |

---

## ข้อแตกต่างจาก Gemini Live (ใน Gemini App)

| | Gemini Live (App) | Live API |
|---|---|---|
| สำหรับ | ผู้ใช้ทั่วไป | นักพัฒนา |
| ควบคุม | จำกัด | เต็มที่ |
| integrate (เชื่อมต่อ) กับแอปเอง | ✗ | ✓ |
| Custom system instruction (คำสั่งกำหนดบุคลิก AI เอง) | ✗ | ✓ |
| Function calling | ✗ | ✓ |
| สร้าง voice app (แอปเสียง) | ✗ | ✓ |
