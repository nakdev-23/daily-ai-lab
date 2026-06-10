---
title: "Imagine API — สร้างและแก้ไขภาพ/วิดีโอ"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Imagine API คือความสามารถด้านภาพและวิดีโอของ Grok สามารถ:"
readTime: "3 นาที"
readers: "0"
locked: false
order: 5
---
# Imagine API — สร้างและแก้ไขภาพ/วิดีโอ

> อ้างอิง: [Imagine Overview](https://docs.x.ai/developers/model-capabilities/imagine) | [Image Generation](https://docs.x.ai/developers/model-capabilities/images/generation) | [Image Editing](https://docs.x.ai/developers/model-capabilities/images/editing) | [Video Generation](https://docs.x.ai/developers/model-capabilities/video/generation)

---

## Imagine API คืออะไร?

**Imagine API** คือความสามารถด้านภาพและวิดีโอของ Grok สามารถ:

- สร้างภาพจาก Text Prompt
- แก้ไขภาพที่มีอยู่แล้ว
- สร้างวิดีโอจากข้อความหรือรูปภาพ
- ต่อวิดีโอ แก้ไขวิดีโอ

ทดลองได้ที่ [console.x.ai/playground/imagine](https://console.x.ai/playground/imagine)

---

## การสร้างภาพ (Image Generation)

อ้างอิง: [Image Generation](https://docs.x.ai/developers/model-capabilities/images/generation)

### โมเดลที่รองรับ

| โมเดล | คุณภาพ | ราคา (1K) | ราคา (2K) |
|---|---|---|---|
| `grok-imagine-image-quality` | สูงสุด | $0.05/ภาพ | $0.07/ภาพ |
| `grok-imagine-image` | มาตรฐาน | $0.02/ภาพ | $0.02/ภาพ |

### วิธีใช้งาน

**Python (xAI SDK):**
```python
import os
import xai_sdk

client = xai_sdk.Client(api_key=os.getenv("XAI_API_KEY"))

response = client.image.sample(
    prompt="แมวขาวนอนอยู่บนหลังคาบ้านยามพระอาทิตย์ตก สไตล์ watercolor",
    model="grok-imagine-image-quality",
)

print(response.url)  # URL รูปที่สร้าง
```

**Python (OpenAI SDK):**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.images.generate(
    model="grok-imagine-image-quality",
    prompt="แมวขาวนอนอยู่บนหลังคาบ้านยามพระอาทิตย์ตก สไตล์ watercolor",
)

print(response.data[0].url)
```

**cURL:**
```bash
curl -X POST https://api.x.ai/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-imagine-image-quality",
    "prompt": "แมวขาวนอนอยู่บนหลังคาบ้านยามพระอาทิตย์ตก"
  }'
```

---

## การแก้ไขภาพ (Image Editing)

อ้างอิง: [Image Editing](https://docs.x.ai/developers/model-capabilities/images/editing)

### หัวข้อนี้คืออะไร?
ส่งภาพต้นฉบับพร้อม Prompt แล้ว Grok จะแก้ไขภาพตามที่บอก เช่น เปลี่ยนฉากหลัง เพิ่มวัตถุ ลบสิ่งที่ไม่ต้องการ ปรับสไตล์ภาพ

### วิธีใช้งาน

```python
import base64

# อ่านไฟล์ภาพ
with open("original_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.images.edit(
    model="grok-imagine-image-quality",
    image=f"data:image/jpeg;base64,{image_data}",
    prompt="เปลี่ยนฉากหลังเป็นชายหาดพระอาทิตย์ตก",
)

print(response.data[0].url)
```

---

## การแก้ไขภาพหลายรูปพร้อมกัน (Multi-Image Editing)

อ้างอิง: [Multi-Image Editing](https://docs.x.ai/developers/model-capabilities/images/multi-image-editing)

### หัวข้อนี้คืออะไร?
ส่งภาพหลายรูปพร้อมกัน แล้วให้ Grok รวมหรือประมวลผลภาพเหล่านั้นพร้อมกัน เช่น รวมสไตล์จากภาพหนึ่งกับเนื้อหาจากอีกภาพหนึ่ง

### ตัวอย่าง Use Case
- นำสไตล์ภาพศิลปะ + ภาพถ่าย → สร้างภาพใหม่ในสไตล์นั้น
- เปลี่ยนเสื้อผ้าในภาพโดยอ้างอิงจากภาพตัวอย่างเสื้อผ้า

---

## การสร้างวิดีโอ (Video Generation)

อ้างอิง: [Video Generation](https://docs.x.ai/developers/model-capabilities/video/generation)

### หัวข้อนี้คืออะไร?
สร้างวิดีโอจาก Text Prompt หรือจากรูปภาพ โมเดลจะสร้างวิดีโอที่เคลื่อนไหวตามที่บอก

### ราคา

| ความละเอียด | ราคาต่อวินาที |
|---|---|
| 480p | $0.05 |
| 720p | $0.07 |

> **หมายเหตุ:** วิดีโอ 720p จะ fallback เป็น 480p โดยอัตโนมัติเมื่อถึง Quota ที่กำหนด

### วิธีใช้งาน

```python
response = client.videos.generate(
    model="grok-imagine-video",
    prompt="คลื่นทะเลซัดชายหาดยามพระอาทิตย์ขึ้น ภาพเคลื่อนไหวช้าๆ",
    resolution="720p",
    duration=5,  # วินาที
)

print(response.data[0].url)
```

---

## Image-to-Video (แปลงรูปเป็นวิดีโอ)

อ้างอิง: [Image-to-Video](https://docs.x.ai/developers/model-capabilities/video/image-to-video)

### หัวข้อนี้คืออะไร?
ส่งภาพนิ่งแล้ว Grok จะสร้างวิดีโอที่ภาพนั้น "เคลื่อนไหว" ขึ้นมา

### วิธีใช้งาน

```python
with open("still_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.videos.generate(
    model="grok-imagine-video",
    image=f"data:image/jpeg;base64,{image_data}",
    prompt="ลมพัดผ่านทุ่งดอกไม้ กลีบดอกปลิวไสว",
    resolution="480p",
)
```

---

## Video Editing (แก้ไขวิดีโอ)

อ้างอิง: [Video Editing](https://docs.x.ai/developers/model-capabilities/video/editing)

### หัวข้อนี้คืออะไร?
ส่งวิดีโอต้นฉบับพร้อม Prompt เพื่อแก้ไข เช่น เปลี่ยนสไตล์ เพิ่มเอฟเฟกต์ หรือปรับบรรยากาศ

---

## Reference-to-Video (อ้างอิงภาพสร้างวิดีโอ)

อ้างอิง: [Reference-to-Video](https://docs.x.ai/developers/model-capabilities/video/reference-to-video)

### หัวข้อนี้คืออะไร?
ส่งภาพ Reference (เช่น ภาพตัวละคร ภาพสถานที่) แล้ว Grok จะสร้างวิดีโอที่อ้างอิงภาพนั้น ทำให้ตัวละครหรือสถานที่ดูสอดคล้องกัน

**ราคา (grok-imagine-video-1.5-preview):**
- 480p: $0.08/วินาที
- 720p: $0.14/วินาที

---

## Video Extension (ต่อวิดีโอ)

อ้างอิง: [Video Extension](https://docs.x.ai/developers/model-capabilities/video/extension)

### หัวข้อนี้คืออะไร?
ส่งวิดีโอที่มีอยู่แล้ว แล้วให้ Grok ต่อวิดีโอนั้นให้ยาวขึ้น เนื้อหาจะไหลต่อเนื่องจากจุดที่หยุด

---

## Watermark ในภาพ/วิดีโอ

ภาพและวิดีโอที่สร้างจาก Grok อาจมี Watermark "grok" ปรากฏ โดยเฉพาะในบางประเทศที่มีกฎหมายกำหนด (เช่น อินเดีย ออสเตรเลีย) ไม่สามารถลบออกได้เพราะเป็นข้อกำหนดทางกฎหมาย

---

## เคล็ดลับการเขียน Prompt ภาพ

- ระบุ **สไตล์ภาพ** อย่างชัดเจน: `watercolor`, `photorealistic`, `anime`, `oil painting`
- ระบุ **แสง**: `golden hour`, `studio lighting`, `dramatic shadows`
- ระบุ **มุมมอง**: `bird's eye view`, `close-up portrait`, `wide shot`
- ระบุ **อารมณ์ภาพ**: `peaceful`, `dramatic`, `mysterious`

**ตัวอย่าง Prompt ที่ดี:**
```
A white cat sleeping on a rooftop at sunset, 
watercolor painting style, warm golden lighting, 
soft pastel colors, dreamy atmosphere
```
