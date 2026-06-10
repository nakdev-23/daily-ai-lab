---
title: "Video Features — ฟีเจอร์พิเศษสำหรับวิดีโอ"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Lip Sync ใช้ AI ทำให้การขยับปากของตัวละครในวิดีโอตรงกับเสียงที่ให้มา ไม่ว่าจะเป็นการพูด ร้องเพลง หรือบทสนทนา"
readTime: "4 นาที"
readers: "0"
locked: false
order: 4
---
# 04 · Video Features — ฟีเจอร์พิเศษสำหรับวิดีโอ

> อ้างอิง Official Docs:
> - [Lip Sync](https://kling.ai/document-api/apiReference%2Fmodel%2FlipSync)
> - [Avatar](https://kling.ai/document-api/apiReference%2Fmodel%2Favatar)
> - [Video Effects](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoEffects)
> - [Effect Templates](https://kling.ai/document-api/quickStart%2FproductIntroduction%2FeffectsCenter)
> - [Video Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniVideo)

---

## 1. Lip Sync — ซิงค์ริมฝีปากกับเสียง

> อ้างอิง: [Lip Sync](https://kling.ai/document-api/apiReference%2Fmodel%2FlipSync)

### หัวข้อนี้คืออะไร

Lip Sync ใช้ AI ทำให้การขยับปากของตัวละครในวิดีโอตรงกับเสียงที่ให้มา ไม่ว่าจะเป็นการพูด ร้องเพลง หรือบทสนทนา

### ใช้ทำอะไร

- Dubbing วิดีโอเป็นหลายภาษา
- สร้างตัวละคร AI พูดจากข้อความที่กำหนด
- ทำให้ตัวละครในวิดีโอขยับปากตรงกับเสียง

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/lip-sync
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `video_id` | string | ✅ (ถ้าไม่ใช้ URL) | ID วิดีโอต้นฉบับจาก Kling |
| `video_url` | string | ✅ (ถ้าไม่ใช้ ID) | URL วิดีโอที่ต้องการซิงค์ |
| `mode` | string | ✅ | วิธีให้เสียง: `text2audio` (ข้อความ→เสียง) หรือ `audio2lip` (ใช้เสียงที่มี) |
| `tts_text` | string | ❌ | ข้อความที่ต้องการให้พูด (สำหรับ mode: text2audio) |
| `tts_timbre` | string | ❌ | สไตล์เสียงพูด (timbre) |
| `tts_speed` | float | ❌ | ความเร็วการพูด |
| `audio_url` | string | ❌ | URL เสียงที่ต้องการซิงค์ (สำหรับ mode: audio2lip) |

### ราคา

ประมาณ $0.10 ต่อทุก 5 วินาที

### ข้อควรระวัง

- วิดีโอต้นฉบับต้องมีใบหน้าคนที่ชัดเจน
- รองรับวิดีโอทั้งที่สร้างจาก Kling และวิดีโออัปโหลดจากภายนอก
- รองรับภาษาอังกฤษ จีน ญี่ปุ่น เกาหลี

---

## 2. Avatar — ดิจิทัลฮิวแมนจากรูปเดียว

> อ้างอิง: [Avatar](https://kling.ai/document-api/apiReference%2Fmodel%2Favatar)

### หัวข้อนี้คืออะไร

สร้างวิดีโอดิจิทัลฮิวแมน (Digital Human) ที่พูดและขยับปากตรงกับเสียงที่กำหนด โดยใช้เพียง **รูปภาพหน้าตรงหนึ่งรูป** — ราวกับว่ารูปในรูปนั้นมีชีวิตขึ้นมาพูด

### ใช้ทำอะไร

- สร้างโฆษกเสมือน (Virtual Spokesperson) สำหรับแบรนด์
- ทำวิดีโอสอน/บรรยายโดยมีตัวละคร AI
- สร้าง AI Presenter จากรูปถ่ายบุคคล

### ความสามารถพิเศษ

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| **Kling Avatar 2.0** | สร้างวิดีโอต่อเนื่องได้นานถึง **5 นาที** |
| **ความละเอียด** | 1080p / 48 FPS |
| **ภาษาที่รองรับ** | อังกฤษ, จีน, ญี่ปุ่น, เกาหลี |
| **Lip Sync** | แม่นยำสูง รองรับการร้องเพลง บทสนทนาเร็ว |

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/avatar
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `avatar_image` | string | ✅ | URL หรือ Base64 รูปหน้าตรงชัดเจน |
| `audio_url` | string | ✅ (หรือ tts) | URL เสียงที่ต้องการ |
| `tts_text` | string | ✅ (หรือ audio) | ข้อความที่ต้องการให้พูด |
| `tts_voice` | string | ❌ | เสียงพูดที่ต้องการใช้ |
| `prompt` | string | ❌ | คำอธิบายเพิ่มเติม เช่น สไตล์ท่าทาง |

### ข้อควรระวัง

- รูปต้องเป็น **ใบหน้าหน้าตรงชัดเจน** ไม่มีวัตถุบัง
- ความยาววิดีโอขึ้นอยู่กับความยาวเสียง

---

## 3. Video Effects — เอฟเฟกต์พิเศษสำหรับวิดีโอ

> อ้างอิง: [Video Effects](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoEffects)

### หัวข้อนี้คืออะไร

ใส่เอฟเฟกต์พิเศษลงในวิดีโอที่มีอยู่ หรือสร้างวิดีโอใหม่พร้อมเอฟเฟกต์ ใช้สำหรับทำ Content ที่มีการโต้ตอบ เช่น Hug, Kiss, หรือท่าทางพิเศษระหว่างสองตัวละคร

### ประเภทเอฟเฟกต์ที่รองรับ

**Dual-character Effects (เอฟเฟกต์คู่ตัวละคร):**
- `hug` — กอด
- `kiss` — จูบ
- `heart_gesture` — ท่าหัวใจมือ

> รองรับใน `kling-v1`, `kling-v1-5`, `kling-v1-6`

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/effects
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `model` | string | ✅ | ชื่อโมเดล |
| `effect_scene` | string | ✅ | ประเภทเอฟเฟกต์ เช่น `hug`, `kiss`, `heart_gesture` |
| `image` | string | ✅ | รูปภาพหรือ URL วิดีโอต้นฉบับ |
| `mode` | string | ❌ | `std` หรือ `pro` |

---

## 4. Effect Templates — แม่แบบเอฟเฟกต์

> อ้างอิง: [Effect Templates](https://kling.ai/document-api/quickStart%2FproductIntroduction%2FeffectsCenter)

### หัวข้อนี้คืออะไร

Effect Templates คือคลังเอฟเฟกต์สำเร็จรูปที่นักพัฒนานำไปใช้ได้เลย โดยไม่ต้องกำหนดรายละเอียดเอง มีหลายแบบให้เลือก ทั้งเอฟเฟกต์ความเคลื่อนไหว เอฟเฟกต์สไตล์ และเอฟเฟกต์พิเศษ

### วิธีใช้งาน

1. ดูรายการ Effect Template ที่มีในคลัง Effects Center
2. เลือก Template ID ที่ต้องการ
3. เรียก API พร้อมระบุ Template ID และรูปภาพหรือวิดีโอ
4. ระบบสร้างวิดีโอพร้อมเอฟเฟกต์นั้นให้อัตโนมัติ

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/effects
```

### ข้อควรระวัง

- Effect Templates อัปเดตเป็นระยะ ตรวจสอบรายการที่มีได้จาก API
- บาง Template อาจต้องการรูปในรูปแบบเฉพาะ

---

## 5. Video Omni — วิดีโอแบบ Multimodal

> อ้างอิง: [Video Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniVideo)

### หัวข้อนี้คืออะไร

Video Omni ใช้โมเดล `kling-v3-omni` ซึ่งเป็น **Multimodal Model** ที่ผสมความสามารถต่างๆ ไว้ในโมเดลเดียว รองรับทั้ง Text, Image, Video และ Audio ในคำขอเดียวกัน

### ความสามารถพิเศษของ Video Omni

- **Multi-shot Generation** — สร้างวิดีโอที่มีหลายฉากต่อเนื่องกัน
- **Native Audio Generation** — สร้างเสียงประกอบพร้อมกับวิดีโอ (ไม่ต้องใส่เสียงทีหลัง)
- **Video Reference** — ใช้วิดีโออ้างอิงเพื่อควบคุมสไตล์
- **Element Control** — ใช้ตัวละครและสิ่งของจาก Element Library

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/text2video
```
(ระบุ `model: "kling-v3-omni"`)

### ตัวอย่าง Multi-shot

```json
{
  "model": "kling-v3-omni",
  "mode": "pro",
  "duration": "10",
  "multi_shot": [
    {
      "shot_prompt": "ฉากที่ 1: แมวตื่นนอนในยามเช้า แสงแดดส่องผ่านหน้าต่าง",
      "shot_duration": "3"
    },
    {
      "shot_prompt": "ฉากที่ 2: แมวเดินไปที่ชามข้าวแล้วกิน",
      "shot_duration": "4"
    },
    {
      "shot_prompt": "ฉากที่ 3: แมวนอนหลับกลับไปบนโซฟา",
      "shot_duration": "3"
    }
  ]
}
```
