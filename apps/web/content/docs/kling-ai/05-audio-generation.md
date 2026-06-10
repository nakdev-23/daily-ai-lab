---
title: "Audio Generation — การสร้างเสียง"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "สร้างเสียงประกอบ (Sound Effects, Background Music, Ambient Sound) จากคำอธิบายข้อความ — เช่น 'เสียงฝนตกหนักในป่า' หรือ 'เสียงคลื่นท"
readTime: "3 นาที"
readers: "0"
locked: false
order: 5
---
# 05 · Audio Generation — การสร้างเสียง

> อ้างอิง Official Docs:
> - [Text to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToAudio)
> - [Video to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoToAudio)
> - [Text to Speech](https://kling.ai/document-api/apiReference%2Fmodel%2FTTS)
> - [Voice Clone](https://kling.ai/document-api/apiReference%2Fmodel%2FcustomVoices)

---

## 1. Text to Audio — สร้างเสียงจากข้อความ

> อ้างอิง: [Text to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToAudio)

### หัวข้อนี้คืออะไร

สร้างเสียงประกอบ (Sound Effects, Background Music, Ambient Sound) จากคำอธิบายข้อความ — เช่น "เสียงฝนตกหนักในป่า" หรือ "เสียงคลื่นทะเลยามเย็น"

### ใช้ทำอะไร

- สร้าง Sound Effect สำหรับวิดีโอ
- สร้าง Background Music บรรยากาศ
- สร้างเสียงธรรมชาติหรือเสียงสภาพแวดล้อม

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/audio/text2audio
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `prompt` | string | ✅ | คำอธิบายเสียงที่ต้องการ |
| `negative_prompt` | string | ❌ | เสียงที่ไม่ต้องการ |
| `duration` | float | ❌ | ความยาวเสียง (วินาที) |
| `callback_url` | string | ❌ | URL รับผลลัพธ์ |

### ตัวอย่าง

```python
resp = requests.post(f"{BASE}/v1/audio/text2audio",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "prompt": "เสียงฝนตกหนักในป่าเขตร้อน มีเสียงฟ้าร้องไกลๆ และกบร้อง",
        "negative_prompt": "เสียงคน",
        "duration": 10.0
    }
)
```

---

## 2. Video to Audio — สร้างเสียงให้กับวิดีโอ

> อ้างอิง: [Video to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoToAudio)

### หัวข้อนี้คืออะไร

AI วิเคราะห์เนื้อหาในวิดีโอแล้วสร้างเสียงประกอบที่เหมาะสมให้อัตโนมัติ — เช่น ถ้าวิดีโอมีคนเดิน AI จะสร้างเสียงฝีเท้า ถ้ามีทะเล AI จะสร้างเสียงคลื่น

### ใช้ทำอะไร

- ใส่เสียงให้วิดีโอที่ไม่มีเสียงมาก่อน
- เพิ่ม Sound Effects ให้วิดีโอ AI ที่สร้างมาแล้ว
- รองรับวิดีโอจาก Kling และวิดีโอที่ Upload เอง

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/audio/video2audio
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `video_id` | string | ✅ (หรือ URL) | ID วิดีโอจาก Kling |
| `video_url` | string | ✅ (หรือ ID) | URL วิดีโอ |
| `prompt` | string | ❌ | คำแนะนำเพิ่มเติม |
| `negative_prompt` | string | ❌ | เสียงที่ไม่ต้องการ |

### ข้อควรระวัง

> Kling รองรับการ **เพิ่มเสียงให้วิดีโอที่สร้างจาก Kling ทุกโมเดล** รวมถึงวิดีโอที่ผู้ใช้อัปโหลดมาเอง

---

## 3. Text to Speech (TTS) — แปลงข้อความเป็นเสียงพูด

> อ้างอิง: [Text to Speech](https://kling.ai/document-api/apiReference%2Fmodel%2FTTS)

### หัวข้อนี้คืออะไร

แปลงข้อความเป็นเสียงพูดที่ฟังดูเป็นธรรมชาติ เลือกเสียงพูด สไตล์ และความเร็วได้ มีเสียงให้เลือกหลายแบบ (timbre)

### ใช้ทำอะไร

- สร้าง Voice Over สำหรับวิดีโอ
- ใช้กับ Avatar หรือ Lip Sync
- สร้าง Audio Book หรือพอดแคสต์

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/audio/tts
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `text` | string | ✅ | ข้อความที่ต้องการแปลงเป็นเสียง |
| `voice_id` | string | ❌ | รหัสเสียง (timbre) ที่ต้องการใช้ |
| `speed` | float | ❌ | ความเร็วการพูด (ค่าปกติ = 1.0) |
| `volume` | float | ❌ | ระดับเสียง |

### ตัวอย่าง

```python
resp = requests.post(f"{BASE}/v1/audio/tts",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "text": "สวัสดีครับ ยินดีต้อนรับสู่โลกของ Kling AI ผู้ช่วยสร้างสรรค์ด้วยปัญญาประดิษฐ์",
        "voice_id": "female_warm_01",
        "speed": 1.0
    }
)
```

---

## 4. Voice Clone — โคลนเสียง

> อ้างอิง: [Voice Clone](https://kling.ai/document-api/apiReference%2Fmodel%2FcustomVoices)

### หัวข้อนี้คืออะไร

อัปโหลดเสียงต้นฉบับ แล้วระบบจะสร้าง "Custom Voice" ที่ฟังดูเหมือนเสียงต้นฉบับ จากนั้นนำ Custom Voice นั้นไปใช้กับ TTS หรือ Avatar ได้

### ใช้ทำอะไร

- ทำให้ AI พูดด้วยเสียงของตัวเอง (Brand Voice)
- ทำ Dubbing ด้วยเสียงที่คุ้นเคย
- สร้าง Digital Twin ของเสียงพูด

### วิธีใช้งาน

**ขั้นที่ 1: สร้าง Custom Voice**

```
POST https://api-singapore.klingai.com/v1/audio/voice-clone
```

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `voice_name` | string | ✅ | ชื่อสำหรับ Custom Voice นี้ |
| `audio_url` | string | ✅ | URL เสียงต้นฉบับ (ควรยาว 30–120 วินาที, ชัดเจน) |

**ขั้นที่ 2: ใช้ Custom Voice ใน TTS**

หลังสร้างแล้วจะได้ `voice_id` นำไปใส่ใน TTS พารามิเตอร์ `voice_id`

### ข้อควรระวัง

- เสียงต้นฉบับควรมีคุณภาพดี ไม่มีเสียงรบกวน
- ความยาวเสียงที่เหมาะสม: 30 วินาที ถึง 2 นาที
- ห้ามใช้เสียงบุคคลอื่นโดยไม่ได้รับอนุญาต
- Custom Voice ที่สร้างไว้จะถูกเก็บตามนโยบายบัญชี (มักเก็บ 30 วัน)
