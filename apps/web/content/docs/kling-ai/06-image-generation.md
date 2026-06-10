---
title: "Image Generation — การสร้างและแก้ไขภาพ"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "- 1K (1024x1024 หรือ proportional)"
readTime: "5 นาที"
readers: "0"
locked: false
order: 6
---
# 06 · Image Generation — การสร้างและแก้ไขภาพ

> อ้างอิง Official Docs:
> - [Image Models](https://kling.ai/document-api/apiReference%2Fmodel%2FimageModels)
> - [Image Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniImage)
> - [Image Generation](https://kling.ai/document-api/apiReference%2Fmodel%2FimageGeneration)
> - [Reference to Image](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToImage)
> - [Extend Image](https://kling.ai/document-api/apiReference%2Fmodel%2FimageExpansion)
> - [AI Multi-Shot](https://kling.ai/document-api/apiReference%2Fmodel%2FaiMultiShot)
> - [Virtual Try-On](https://kling.ai/document-api/apiReference%2Fmodel%2FvirtualTryOn)
> - [Image Recognize](https://kling.ai/document-api/apiReference%2Fmodel%2FimageRecognize)
> - [Element](https://kling.ai/document-api/apiReference%2Fmodel%2Felement)

---

## 1. Image Models — โมเดลภาพทั้งหมด

> อ้างอิง: [Image Models](https://kling.ai/document-api/apiReference%2Fmodel%2FimageModels)

### โมเดลภาพหลัก

| Model | ฟีเจอร์หลัก |
|-------|-----------|
| `kling-v3` | Text-to-Image, Image-to-Image, 4K Native, Multi-shot Series |
| `kling-v3-omni` | Multimodal, รองรับ Reference Image สูงสุด 10 รูป |
| `kling-v2-1` | Text-to-Image, Image-to-Image |
| `kling-v1-5` | Image Generation ทั่วไป |
| `kling-v1` | Image Generation พื้นฐาน |

### ความละเอียดที่รองรับ

- 1K (1024x1024 หรือ proportional)
- 2K
- **4K Native** (เฉพาะ kling-v3 และรุ่นใหม่)

### Aspect Ratios (อัตราส่วนภาพ)

`1:1`, `3:4`, `4:3`, `16:9`, `9:16`

---

## 2. Image Generation — สร้างภาพจากข้อความ

> อ้างอิง: [Image Generation](https://kling.ai/document-api/apiReference%2Fmodel%2FimageGeneration)

### หัวข้อนี้คืออะไร

ส่ง Prompt เป็นข้อความ แล้ว AI สร้างภาพตามคำอธิบายนั้น รองรับสร้างทีละหลายภาพพร้อมกัน

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/generations
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | ค่าเริ่มต้น | คำอธิบาย |
|------------|--------|--------|-----------|---------|
| `model` | string | ✅ | - | ชื่อโมเดล เช่น `kling-v3` |
| `prompt` | string | ✅ | - | คำอธิบายภาพ |
| `negative_prompt` | string | ❌ | - | สิ่งที่ไม่ต้องการในภาพ |
| `image_reference` | string | ❌ | - | URL รูปอ้างอิงสไตล์ |
| `image_fidelity` | float | ❌ | 0.5 | ความใกล้เคียงกับรูปอ้างอิง (0–1) |
| `aspect_ratio` | string | ❌ | `1:1` | อัตราส่วนภาพ |
| `n` | int | ❌ | 1 | จำนวนภาพที่ต้องการ (1–9) |
| `callback_url` | string | ❌ | - | URL รับผลลัพธ์ |

### ตัวอย่าง

```python
resp = requests.post(f"{BASE}/v1/images/generations",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "model": "kling-v3",
        "prompt": "ภาพถ่ายเหมือนจริงของดอกบัวสีชมพูบานในสระน้ำ แสงยามเช้า หยดน้ำค้างบนกลีบดอก",
        "negative_prompt": "ภาพ cartoon, ภาพวาด, คุณภาพต่ำ",
        "aspect_ratio": "1:1",
        "n": 4
    }
)
```

> ⚠️ **ระวัง Concurrency**: ถ้า `n=9` ระบบจะนับเป็น 9 Concurrency พร้อมกัน

---

## 3. Image Omni — Multimodal Image Creation

> อ้างอิง: [Image Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniImage)

### หัวข้อนี้คืออะไร

Image Omni ใช้โมเดล `kling-v3-omni` ที่รองรับการรับ Input หลายรูปแบบพร้อมกัน ทั้งข้อความ รูปภาพหลายรูป และ Reference Images

### ความสามารถพิเศษ

- รับ Reference Image ได้สูงสุด **10 รูป**
- สร้างภาพ 4K Native
- สร้างภาพเป็น Series (ต่อเนื่องกัน มีสไตล์สม่ำเสมอ)
- รองรับการแก้ไขภาพด้วยคำอธิบาย (Image Editing)

### ตัวอย่าง

```json
{
  "model": "kling-v3-omni",
  "prompt": "ผสมสไตล์ภาพทั้งสามนี้เข้าด้วยกัน สร้างภาพในสไตล์เดียว",
  "reference_images": [
    "https://example.com/style1.jpg",
    "https://example.com/style2.jpg",
    "https://example.com/style3.jpg"
  ],
  "aspect_ratio": "16:9"
}
```

---

## 4. Reference to Image — สร้างภาพจากรูปอ้างอิงหลายภาพ

> อ้างอิง: [Reference to Image](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToImage)

### หัวข้อนี้คืออะไร

ใช้รูปภาพหลายภาพเป็น Reference แล้ว AI สร้างภาพใหม่ที่รักษาความสม่ำเสมอของตัวละคร สไตล์ หรือองค์ประกอบจากรูปอ้างอิง

### ใช้ทำอะไร

- สร้างภาพตัวละครในท่าหรือฉากต่างๆ โดยหน้าตายังเหมือนเดิม
- ผสมองค์ประกอบจากหลายรูป
- สร้างภาพ Variant ที่มีความสม่ำเสมอ

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/multi-reference
```

---

## 5. Extend Image — ขยายพื้นที่ภาพ (Outpainting)

> อ้างอิง: [Extend Image](https://kling.ai/document-api/apiReference%2Fmodel%2FimageExpansion)

### หัวข้อนี้คืออะไร

ขยายพื้นที่ภาพออกไปนอกขอบเดิม AI จะสร้างเนื้อหาที่กลมกลืนกับภาพต้นฉบับ เหมาะสำหรับเปลี่ยนสัดส่วนภาพหรือทำให้ภาพกว้างขึ้น

### ใช้ทำอะไร

- แปลงภาพ Portrait (9:16) เป็น Landscape (16:9)
- ขยายฉากหลังให้กว้างขึ้น
- เพิ่มพื้นที่ว่างรอบๆ วัตถุหลัก

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/expand
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `image` | string | ✅ | URL หรือ Base64 ภาพต้นฉบับ |
| `prompt` | string | ❌ | คำอธิบายส่วนที่ต้องการขยาย |
| `aspect_ratio` | string | ✅ | อัตราส่วนเป้าหมาย เช่น `16:9` |

---

## 6. AI Multi-Shot — สร้างภาพ Series ต่อเนื่อง

> อ้างอิง: [AI Multi-Shot](https://kling.ai/document-api/apiReference%2Fmodel%2FaiMultiShot)

### หัวข้อนี้คืออะไร

สร้างภาพหลายภาพที่มีความต่อเนื่องกันในเชิงเนื้อเรื่อง (Narrative) หรือสไตล์ เหมาะสำหรับ Story Board, Comic, หรือ Photo Series

### ใช้ทำอะไร

- สร้าง Storyboard สำหรับวิดีโอหรือโฆษณา
- สร้าง Comic Strip หรือ Manga
- สร้าง Photo Series ที่มีตัวละครเดิมในหลายฉาก

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | คำอธิบาย |
|------------|--------|---------|
| `result_type` | string | `single` (ภาพเดี่ยว) หรือ `series` (ชุดภาพ) |
| `n` | int | จำนวนภาพ (1-9 สำหรับ single; 2-9 สำหรับ series) |
| `shots` | array | คำอธิบายแต่ละภาพในซีรีส์ |

---

## 7. Virtual Try-On — ลองเสื้อผ้าเสมือนจริง

> อ้างอิง: [Virtual Try-On](https://kling.ai/document-api/apiReference%2Fmodel%2FvirtualTryOn)

### หัวข้อนี้คืออะไร

Virtual Try-On คือฟีเจอร์ที่ AI สวมใส่เสื้อผ้าหรือเครื่องแต่งกายให้กับบุคคลในรูปภาพ — แค่ให้รูปคนและรูปเสื้อ AI จะทำให้เหมือนคนนั้นสวมเสื้อนั้นจริงๆ

### ใช้ทำอะไร

- แสดงสินค้าเสื้อผ้าโดยไม่ต้องถ่ายภาพทุก Look
- ให้ลูกค้าลองเสื้อผ้าแบบ Virtual ก่อนซื้อ
- สร้าง Catalog สินค้าแฟชั่นต้นทุนต่ำ

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/virtual-try-on
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `human_image` | string | ✅ | URL หรือ Base64 รูปบุคคล (เห็นร่างกายชัดเจน) |
| `cloth_image` | string | ✅ | URL หรือ Base64 รูปเสื้อผ้า |
| `mode` | string | ❌ | `std` หรือ `pro` |

### ข้อควรระวัง

- รูปบุคคลควรมองเห็นร่างกายส่วนบนหรือส่วนที่ต้องการสวมชัดเจน
- Virtual Try-On มี Resource Package แยกต่างหากจาก Video และ Image

### ตัวอย่าง

```python
resp = requests.post(f"{BASE}/v1/images/virtual-try-on",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "human_image": "https://example.com/person.jpg",
        "cloth_image": "https://example.com/shirt.jpg",
        "mode": "pro"
    }
)
```

---

## 8. Image Recognize — วิเคราะห์รูปภาพ

> อ้างอิง: [Image Recognize](https://kling.ai/document-api/apiReference%2Fmodel%2FimageRecognize)

### หัวข้อนี้คืออะไร

AI วิเคราะห์รูปภาพและให้คำอธิบายสิ่งที่เห็นในรูป — เหมือน Reverse Prompt ช่วยให้รู้ว่ารูปนี้มีอะไรบ้าง

### ใช้ทำอะไร

- สร้าง Prompt อัตโนมัติจากรูปภาพ
- วิเคราะห์เนื้อหาของรูปก่อนนำไปใช้งาน
- ดึง Description จากรูปเพื่อนำไปสร้างวิดีโอต่อ

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/recognize
```

---

## 9. Element — จัดการ Element/ตัวละคร

> อ้างอิง: [Element](https://kling.ai/document-api/apiReference%2Fmodel%2Felement)

### หัวข้อนี้คืออะไร

Element คือการสร้างและจัดเก็บ "ตัวละคร" หรือ "สิ่งของ" ที่กำหนดเองไว้ใน Kling Library เพื่อนำกลับมาใช้ซ้ำในการสร้างภาพและวิดีโอได้ตลอด — รักษาความสม่ำเสมอของหน้าตา สไตล์ หรือสิ่งของตลอดการสร้างสรรค์

### ประเภท Element

| ประเภท | รายละเอียด |
|--------|-----------|
| **Character Element** | ตัวละครบุคคลที่รักษาหน้าตาและสไตล์สม่ำเสมอ |
| **Object Element** | สิ่งของหรือวัตถุที่ต้องการใช้ซ้ำ |
| **Multi-image Element** | Element ที่สร้างจากหลายรูปอ้างอิง |

### วิธีใช้งาน

**ขั้นที่ 1: สร้าง Element**

```
POST https://api-singapore.klingai.com/v1/elements
```

| พารามิเตอร์ | ประเภท | คำอธิบาย |
|------------|--------|---------|
| `element_name` | string | ชื่อ Element |
| `element_type` | string | `character` หรือ `object` |
| `reference_images` | array | รูปอ้างอิง 1–10 รูป |
| `description` | string | คำอธิบาย Element |

**ขั้นที่ 2: ใช้ Element ในการสร้างวิดีโอ/ภาพ**

ระบุ `element_id` ใน Request ของ Text to Video หรือ Image Generation

### ข้อสำคัญ

- Element ที่สร้างจะถูกเก็บ **30 วัน** จากวันสร้าง
- ใช้ Element ร่วมกับ `kling-v3`, `kling-v3-omni`, `kling-v1-6` ขึ้นไป
- รองรับสูงสุด **หลาย Element** ในงานเดียวกัน
