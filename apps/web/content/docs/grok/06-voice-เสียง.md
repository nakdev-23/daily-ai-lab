---
title: "Voice API — ความสามารถด้านเสียง"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Voice API คือชุดความสามารถด้านเสียงของ Grok แบ่งเป็น 3 ส่วนหลัก:"
readTime: "3 นาที"
readers: "0"
locked: false
order: 6
---
# Voice API — ความสามารถด้านเสียง

> อ้างอิง: [Voice Overview](https://docs.x.ai/developers/model-capabilities/audio/voice) | [Text to Speech](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech) | [Speech to Text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text) | [Custom Voices](https://docs.x.ai/developers/model-capabilities/audio/custom-voices) | [Ephemeral Tokens](https://docs.x.ai/developers/model-capabilities/audio/ephemeral-tokens)

---

## Voice API คืออะไร?

**Voice API** คือชุดความสามารถด้านเสียงของ Grok แบ่งเป็น 3 ส่วนหลัก:

| ความสามารถ | คำอธิบาย | ราคา |
|---|---|---|
| **Voice Agent (Real-time)** | โต้ตอบด้วยเสียงแบบ Real-time ทั้ง Input/Output เป็นเสียง | $3.00/ชั่วโมง |
| **Text-to-Speech (TTS)** | แปลงข้อความเป็นเสียงพูด | $15.00/1M ตัวอักษร |
| **Speech-to-Text (STT)** | แปลงเสียงเป็นข้อความ รองรับ 25 ภาษา | $0.10/ชั่วโมง (REST), $0.20/ชั่วโมง (Streaming) |

ทดลองได้ที่ [console.x.ai/playground/voice/agent](https://console.x.ai/playground/voice/agent)

---

## Voice Agent — โต้ตอบด้วยเสียง Real-time

อ้างอิง: [Voice Overview](https://docs.x.ai/developers/model-capabilities/audio/voice)

### หัวข้อนี้คืออะไร?
Voice Agent API ช่วยให้สร้าง AI ที่พูดคุยด้วยเสียงได้แบบ Real-time รับเสียงจากผู้ใช้แล้วตอบกลับเป็นเสียงเลย เหมือนโทรศัพท์กับ AI

### ใช้ทำอะไร?
- Call Center AI
- Voice Assistant ใน App
- Interactive Voice Response (IVR)
- ผู้ช่วยเสียงบนอุปกรณ์

### การเชื่อมต่อ
Voice Agent ใช้การเชื่อมต่อแบบ **WebSocket** สำหรับ Real-time Communication

```python
import websockets
import json
import os

async def voice_session():
    uri = "wss://api.x.ai/v1/audio/voice"
    headers = {"Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"}

    async with websockets.connect(uri, extra_headers=headers) as ws:
        # ส่ง Config
        await ws.send(json.dumps({
            "type": "session.create",
            "model": "grok-4.3",
            "voice": "default"
        }))
        
        # ส่งเสียง (bytes ของ audio)
        # await ws.send(audio_bytes)
```

---

## Ephemeral Tokens — Token สำหรับ Client-side

อ้างอิง: [Ephemeral Tokens](https://docs.x.ai/developers/model-capabilities/audio/ephemeral-tokens)

### หัวข้อนี้คืออะไร?
เมื่อต้องการให้ Browser หรือ Mobile App เชื่อมต่อ Voice API โดยตรง (Client-side) จะไม่ปลอดภัยถ้าใช้ API Key จริง Ephemeral Token คือ Token ชั่วคราวที่ Server สร้างให้ Client ใช้แทน

### วิธีทำงาน

```
1. App ของคุณ (Backend) → ขอ Ephemeral Token จาก xAI
2. Backend → ส่ง Token ให้ Client (Browser/App)
3. Client → ใช้ Token เชื่อมต่อ Voice API โดยตรง
4. Token หมดอายุอัตโนมัติ (ไม่เสี่ยง Key รั่ว)
```

### สร้าง Ephemeral Token (Backend)

```python
import os
import requests

response = requests.post(
    "https://api.x.ai/v1/audio/ephemeral-tokens",
    headers={"Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"},
    json={"model": "grok-4.3", "expires_in": 300},  # อายุ 5 นาที
)

token = response.json()["token"]
# ส่ง token นี้ให้ Client
```

---

## Text-to-Speech (TTS) — แปลงข้อความเป็นเสียง

อ้างอิง: [Text to Speech](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)

### หัวข้อนี้คืออะไร?
ส่งข้อความแล้วได้รับเสียงพูดกลับมา รองรับหลายเสียงและหลายภาษา พร้อมใช้งานแบบ GA (Generally Available) แล้ว

### ราคา
**$15.00 ต่อ 1 ล้านตัวอักษร**

### วิธีใช้งาน

**Python (OpenAI SDK):**
```python
from openai import OpenAI
from pathlib import Path

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.audio.speech.create(
    model="grok-tts",
    voice="nova",  # เลือกเสียงที่ต้องการ
    input="สวัสดี ยินดีต้อนรับสู่ Grok Voice API",
)

# บันทึกเป็นไฟล์เสียง
speech_file_path = Path("output.mp3")
response.stream_to_file(speech_file_path)
print(f"บันทึกไฟล์เสียงแล้วที่: {speech_file_path}")
```

**cURL:**
```bash
curl https://api.x.ai/v1/audio/speech \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-tts",
    "input": "สวัสดี ยินดีต้อนรับสู่ Grok",
    "voice": "nova"
  }' \
  --output output.mp3
```

---

## Speech-to-Text (STT) — แปลงเสียงเป็นข้อความ

อ้างอิง: [Speech to Text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)

### หัวข้อนี้คืออะไร?
อัปโหลดไฟล์เสียงหรือส่ง Stream เสียงแบบ Real-time แล้วได้ Transcript กลับมา รองรับ **25 ภาษา** และมีทั้ง Batch Mode และ Streaming Mode

### โหมดที่รองรับ

| โหมด | ใช้เมื่อ | ราคา |
|---|---|---|
| **REST (Batch)** | อัปโหลดไฟล์เสียงสำเร็จรูป | $0.10/ชั่วโมง |
| **Streaming** | ส่งเสียงแบบ Real-time | $0.20/ชั่วโมง |

### ไฟล์เสียงที่รองรับ
MP3, WAV, M4A, OGG, FLAC, AAC

### วิธีใช้งาน (Batch Mode)

**Python:**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

with open("recording.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="grok-stt",
        file=audio_file,
        language="th",  # ระบุภาษาถ้ารู้ (เพิ่มความแม่นยำ)
    )

print(transcript.text)
```

**cURL:**
```bash
curl https://api.x.ai/v1/audio/transcriptions \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -F file=@recording.mp3 \
  -F model=grok-stt \
  -F language=th
```

---

## Custom Voices — เสียงที่กำหนดเอง

อ้างอิง: [Custom Voices](https://docs.x.ai/developers/model-capabilities/audio/custom-voices)

### หัวข้อนี้คืออะไร?
แทนที่จะใช้เสียงมาตรฐาน สามารถสร้างเสียงพูดที่มีลักษณะเฉพาะได้ เช่น เสียงของแบรนด์ เสียงตัวละครในเกม หรือเสียงผู้ช่วยที่มีบุคลิกเฉพาะ

### ขั้นตอนการสร้าง Custom Voice

1. อัปโหลดตัวอย่างเสียงอ้างอิง (Voice Reference)
2. ระบุลักษณะเสียงที่ต้องการ
3. xAI จะสร้าง Custom Voice ID ให้
4. ใช้ Voice ID นั้นในการเรียก TTS

> ฟีเจอร์นี้ยังอยู่ในสถานะ **New** อาจมีการเปลี่ยนแปลง

---

## สรุป — เลือกใช้ Voice API แบบไหน?

| ต้องการ | ใช้ API |
|---|---|
| AI พูดคุยด้วยเสียงแบบ Real-time | Voice Agent |
| แปลงข้อความในเอกสารให้เป็นเสียง | Text-to-Speech |
| ถอดความจากการบันทึกเสียง | Speech-to-Text (Batch) |
| Transcribe เสียงแบบ Live | Speech-to-Text (Streaming) |
| เสียงที่มีเอกลักษณ์ของแบรนด์ | Custom Voices |
