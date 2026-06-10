---
title: "API Models Reference — รายการโมเดลทั้งหมด"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "รายการโมเดล AI ทั้งหมดที่ Runway API รองรับ พร้อม Parameters รายละเอียด Input/Output และราคา สำหรับนักพัฒนาที่ต้องการเลือกโมเดลที่เหมาะกับงาน"
readTime: "12 นาที"
readers: "0"
locked: false
order: 16
---

# API Models Reference — รายการโมเดลทั้งหมด

> คู่มืออ้างอิงโมเดล AI ทั้งหมดใน Runway API พร้อม Parameters และรายละเอียดการใช้งาน

---

## หมวดโมเดลวิดีโอ (Video Generation)

### gen4.5 — โมเดลหลักคุณภาพสูง

**Model ID:** `gen4.5`

**Input:** Text + Image (Image บังคับ 1 รูป) หรือ Text อย่างเดียว (Text-to-Video)

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | ✓ | `"gen4.5"` |
| `promptText` | string | ✓ | คำอธิบายวิดีโอ (สูงสุด 1000 ตัวอักษร) |
| `promptImage` | string | — | URL หรือ Data URI ของรูปภาพ |
| `duration` | number | ✓ | `5` หรือ `10` (วินาที) |
| `ratio` | string | ✓ | `"1280:720"` หรือ `"720:1280"` |
| `seed` | number | — | Seed สำหรับ Reproducibility (การสร้างผลลัพธ์ซ้ำ) |
| `contentModeration` | object | — | ปรับ Moderation settings |

**ราคา:** 12 credits/วินาที

---

### gen4_turbo — เร็วและประหยัด

**Model ID:** `gen4_turbo`

**Input:** Image เท่านั้น (ไม่รองรับ Text-only)

**Parameters เหมือน gen4.5** แต่:
- รองรับเฉพาะ Image Input
- ไม่รองรับ `duration: 10`

**ราคา:** 5 credits/วินาที

---

### aleph2 — Video-to-Video

**Model ID:** `aleph2`

**Input:** Video + Text/Image (สำหรับแก้ไขวิดีโอ)

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | ✓ | `"aleph2"` |
| `promptText` | string | ✓ | คำอธิบายสไตล์ใหม่ |
| `promptVideo` | string | ✓ | URL หรือ URI ของวิดีโอต้นฉบับ |
| `duration` | number | ✓ | ความยาววิดีโอ (วินาที) |

**ราคา:** 28 credits/วินาที (ขั้นต่ำ 56 credits = 2 วินาที)

---

### gen4_aleph — Gen-4 x Video-to-Video

**Model ID:** `gen4_aleph`

รวมความสามารถของ Gen-4 กับ Aleph สำหรับ Video-to-Video ที่รักษาอัตลักษณ์ดีขึ้น

---

### veo3 — วิดีโอพร้อมเสียง (Google)

**Model ID:** `veo3`

**Input:** Text + Image (optional)

**จุดเด่น:** สร้างวิดีโอ **พร้อมเสียง** ในคำสั่งเดียว

**ราคา:**
- มีเสียง: 40 credits/วินาที
- ไม่มีเสียง: 20 credits/วินาที

---

### veo3.1 / veo3.1_fast — รุ่นอัปเกรด

**Model IDs:** `veo3.1`, `veo3.1_fast`

รุ่นอัปเกรดจาก Veo3 พร้อมคุณภาพที่ดีขึ้น โดย `veo3.1_fast` เร็วกว่าและใช้ Credits น้อยกว่า

---

### seedance2 / seedance2_fast — ความยืดหยุ่นสูง

**Model IDs:** `seedance2`, `seedance2_fast`

**Input:** Text, Image, หรือ Video

**ราคา:**
- seedance2: 36-40 credits/วินาที (ขึ้นกับ Resolution)
- seedance2_fast: 29 credits/วินาที

---

### act_two — Character Animation

**Model ID:** `act_two`

**Input:** Image (ตัวละคร) + Video (การแสดง)

**ใช้สำหรับ:** ถ่ายทอดการเคลื่อนไหวจาก Performance Video ไปยังตัวละคร

---

### happyhorse_1_0 — Text/Image-to-Video

**Model ID:** `happyhorse_1_0`

โมเดลทางเลือกสำหรับ Text หรือ Image เป็น Video

---

## หมวดโมเดลรูปภาพ (Image Generation)

### gen4_image — Gen-4 Image

**Model ID:** `gen4_image`

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | ✓ | `"gen4_image"` |
| `promptText` | string | ✓ | คำอธิบายรูปภาพ |
| `promptImages` | array | — | รูปอ้างอิง (ใส่หลายรูปได้) |
| `ratio` | string | ✓ | Aspect Ratio ที่ต้องการ |
| `resolution` | string | — | `"720p"` หรือ `"1080p"` |

**ราคา:**
- 720p: 5 credits
- 1080p: 8 credits

**การใช้ Reference Images พร้อม Tag:**
```json
{
  "model": "gen4_image",
  "promptText": "A photo of @person1 standing in a park",
  "promptImages": [
    {
      "uri": "https://example.com/person.jpg",
      "tag": "person1"
    }
  ],
  "ratio": "1280:720"
}
```

### gen4_image_turbo — รุ่นเร็ว

**Model ID:** `gen4_image_turbo`

**ราคา:** 2 credits (ทุก Resolution)

---

### gpt_image_2 — OpenAI Image

**Model ID:** `gpt_image_2`

โมเดลจาก OpenAI ที่มีคุณภาพสูงและหลากหลาย

**ราคา:** 1-41 credits (ขึ้นกับ quality และ resolution)

---

### gemini_image3_pro — Google Image

**Model ID:** `gemini_image3_pro`

โมเดลจาก Google ที่เก่งด้านภาพสมจริง

**ราคา:** 20-40 credits (ขึ้นกับ resolution)

---

### gemini_2.5_flash — Google Fast Image

**Model ID:** `gemini_2.5_flash`

รุ่นเร็วจาก Google สำหรับงานที่ต้องการความเร็ว

---

### magnific_precision_upscaler_v2 — Image Upscaling

**Model ID:** `magnific_precision_upscaler_v2`

**Input:** รูปภาพที่ต้องการเพิ่มความละเอียด

**ราคา:**
- ทั่วไป: 25 credits
- เกิน 4096px: 150 credits

---

## หมวดโมเดล Real-time (Avatars)

### gwm1_avatars — Live Avatar

**Model ID:** `gwm1_avatars`

**ใช้สำหรับ:** สร้าง Avatar ที่โต้ตอบแบบ Real-time ผ่าน API Characters

**ราคา:** 2 credits เริ่มต้น + 2 credits ทุก 6 วินาที

---

## หมวดโมเดลเสียง (Audio)

### elevenlabs_tts — Text-to-Speech

**Model ID:** `elevenlabs_tts` (หรือชื่อ ElevenLabs ที่ระบุ)

**ราคา:** 1 credit / 50 ตัวอักษร

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `text` | string | ข้อความที่ต้องการอ่าน |
| `voice` | string | เสียงที่เลือก |
| `speed` | number | ความเร็ว (0.5 - 2.0) |

---

### voice_isolation — Voice Isolation

**ราคา:** 1 credit / 6 วินาที

---

### voice_dubbing — Video Dubbing

**ราคา:** 1 credit / 2 วินาที

---

## Input/Output Format Summary

### รูปแบบ Input ที่รองรับ

**รูปภาพ:**
- JPEG/JPG, PNG, WebP
- ขนาดสูงสุดผ่าน URL: 16MB
- ขนาดสูงสุดผ่าน Data URI: 5MB
- ขนาดสูงสุดผ่าน Ephemeral Upload: 200MB
- ความละเอียดแนะนำ: 640x640 - 4096x4096

**วิดีโอ:**
- MP4, MOV, MKV, WebM, 3GPP, OGG
- Codec: H.264, H.265, AV1, VP8, VP9, ProRes
- ขนาดสูงสุดผ่าน URL: 32MB
- ขนาดสูงสุดผ่าน Ephemeral Upload: 200MB

**เสียง:**
- MP3, WAV, FLAC, M4A, AAC
- ขนาดสูงสุดผ่าน URL: 32MB

### รูปแบบ Output

**วิดีโอ:** MP4 (H.264/H.265) เป็นหลัก
**รูปภาพ:** PNG หรือ JPEG
**เสียง:** MP3 หรือ WAV

### Output URL

- URL ที่ได้จะ **หมดอายุใน 24-48 ชั่วโมง**
- ต้องดาวน์โหลดและเก็บใน Storage ของตัวเองทันที

---

## Auto-cropping พฤติกรรม

ถ้า Input Image ไม่ตรงกับ Output Ratio ที่กำหนด Runway จะ:
1. **Auto-crop จากกลางภาพ** (Center crop)
2. ไม่บีบหรือยืดภาพ

**ตัวอย่าง:**
- รูป 1080x1080 (1:1) → Output 1280:720 (16:9)
- Runway จะครอปส่วนบนและล่างออก เก็บแค่กลาง

**วิธีป้องกัน:** ใช้รูป Input ที่มี Ratio ใกล้เคียงกับ Output ที่ต้องการ

---

## Content Moderation Parameters

สำหรับบางงานที่ต้องการควบคุม Moderation เพิ่มเติม:

```json
{
  "model": "gen4.5",
  "promptText": "...",
  "contentModeration": {
    "publicFigureRecognition": "disabled"
  }
}
```

**หมายเหตุ:** แม้ปรับ Moderation ก็ยังต้องเป็นไปตาม Terms of Service ของ Runway

---

## สรุปการเลือกโมเดล

### เลือกตาม Use Case:

| Use Case | โมเดลแนะนำ |
|---|---|
| คุณภาพสูงสุด (วิดีโอ) | gen4.5 |
| เร็ว ประหยัด (วิดีโอ) | gen4_turbo |
| Video-to-Video | aleph2, gen4_aleph |
| วิดีโอ + เสียงในคำสั่งเดียว | veo3 |
| รูปภาพคุณภาพสูง | gemini_image3_pro |
| รูปภาพราคาถูก | gen4_image_turbo |
| Character Animation | act_two |
| Live Avatar | gwm1_avatars |
| Text-to-Speech | elevenlabs_tts |
