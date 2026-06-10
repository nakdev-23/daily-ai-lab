---
title: "Kolors — โมเดลภาพจาก Kuaishou"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Kolors คือโมเดล Text-to-Image ระดับโลกจาก Kuaishou ที่อยู่เบื้องหลัง Kling AI รองรับภาษาไทย-จีน-อังกฤษ, 4K Native, และการควบคุมสไตล์ขั้นสูง"
readTime: "6 นาที"
readers: "0"
locked: false
order: 14
---
# 14 · Kolors — โมเดลภาพจาก Kuaishou

> อ้างอิง Official Docs:
> - [Image Models](https://kling.ai/document-api/apiReference%2Fmodel%2FimageModels)
> - [Image Generation](https://kling.ai/document-api/apiReference%2Fmodel%2FimageGeneration)
> - [Image Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniImage)

---

## 1. Kolors คืออะไร

**Kolors** คือ Text-to-Image Foundation Model (โมเดลพื้นฐานสร้างภาพจากข้อความ — AI ที่แปลงคำอธิบายเป็นรูปภาพ) ที่พัฒนาโดย **Kuaishou Technology** (บริษัทแม่ของ Kling AI) เปิดตัวในปี 2024 ด้วยความสามารถที่โดดเด่นจนได้รับการยอมรับระดับโลก

Kolors เป็นโมเดลเบื้องหลังของความสามารถด้านภาพทั้งหมดใน Kling AI และยังเปิดให้ใช้งานผ่าน Kling API (ช่องทางเชื่อมต่อโปรแกรม) โดยตรง

### จุดเด่นของ Kolors

- **รองรับหลายภาษา**: เข้าใจ Prompt ภาษาไทย, จีน, อังกฤษ, ญี่ปุ่น, เกาหลี และอื่นๆ ได้ดี
- **4K Native** (4K ดั้งเดิม — สร้างความละเอียด 4K ได้โดยตรงโดยไม่ต้องขยาย): สร้างภาพความละเอียดสูงโดยไม่ต้อง Upscale (ขยายภาพหลังสร้าง)
- **Text Rendering** (การแสดงข้อความในภาพ): แสดงข้อความในภาพได้อย่างถูกต้อง (โดยเฉพาะอักษรจีนและอังกฤษ)
- **Photorealism** (ความสมจริงแบบถ่ายภาพ): ภาพถ่ายเหมือนจริงระดับสูง
- **Artistic Versatility** (ความหลากหลายทางศิลปะ): รองรับสไตล์หลากหลาย ตั้งแต่ถ่ายภาพ ไปจนถึงอนิเมะและ Art

---

## 2. โมเดลในตระกูล Kolors/Kling Image

### ตาราง Model Comparison (เปรียบเทียบโมเดล)

| Model ID | Resolution (ความละเอียด) | ความสามารถหลัก | Use Case (กรณีการใช้งาน) |
|----------|-----------|----------------|----------|
| `kling-v3` | 1K / 2K / 4K | Text-to-Image, Img-to-Img, 4K, Multi-shot Series | งานทั่วไป, 4K Production |
| `kling-v3-omni` | 1K / 2K / 4K | Multimodal (รับหลายประเภทข้อมูล), รับ Reference 10+ รูป, Series | Complex workflows (งานซับซ้อน) |
| `kling-v2-1` | 1K / 2K | Text-to-Image, Img-to-Img | งานทั่วไป |
| `kling-v1-5` | 1K | Image Generation พื้นฐาน | งานเบื้องต้น |
| `kling-v1` | 1K | Image Generation พื้นฐาน | Legacy (รุ่นเก่า) |

### ความละเอียดที่รองรับ

| ระดับ | ความละเอียดจริง | ใช้กับ |
|-------|----------------|--------|
| **1K** | ~1024×1024 หรือ proportional | งานทั่วไป, ต้นทุนต่ำ |
| **2K** | ~2048×2048 หรือ proportional | งาน Print (งานพิมพ์), Detail สูง |
| **4K** | ~4096×4096 หรือ proportional | Production, Cinema, Billboard (ป้ายโฆษณาขนาดใหญ่) |

---

## 3. Text-to-Image API — สร้างภาพจากข้อความ

### Endpoint (จุดเชื่อมต่อ API)

```
POST https://api-singapore.klingai.com/v1/images/generations
```

### พารามิเตอร์ครบชุด

| พารามิเตอร์ | ประเภท | จำเป็น | ค่าเริ่มต้น | คำอธิบาย |
|------------|--------|--------|-----------|---------|
| `model` | string | ✅ | - | ชื่อโมเดล เช่น `kling-v3` |
| `prompt` | string | ✅ | - | คำอธิบายภาพ (รองรับไทย/จีน/อังกฤษ) |
| `negative_prompt` | string | ❌ | - | สิ่งที่ไม่ต้องการในภาพ |
| `image` | string | ❌ | - | URL/Base64 รูปอ้างอิง (Image-to-Image) |
| `image_fidelity` | float | ❌ | 0.5 | ความใกล้เคียงกับรูปอ้างอิง (0–1) |
| `human_fidelity` | float | ❌ | 0.2 | ความใกล้เคียงใบหน้ากับรูปอ้างอิง (0–1) |
| `n` | int | ❌ | 1 | จำนวนภาพ (1–9) |
| `aspect_ratio` | string | ❌ | `1:1` | `1:1`, `16:9`, `9:16`, `4:3`, `3:4` |
| `callback_url` | string | ❌ | - | URL รับผลลัพธ์อัตโนมัติ (Webhook) |
| `external_task_id` | string | ❌ | - | Task ID ที่กำหนดเอง |

---

## 4. ตัวอย่างการใช้งาน Kolors

### 4.1 Photorealistic — ภาพถ่ายเหมือนจริง

```python
import requests, jwt, time

def get_token(ak, sk):
    now = int(time.time())
    return jwt.encode({"iss": ak, "exp": now+1800, "nbf": now-5}, sk, algorithm="HS256")

BASE = "https://api-singapore.klingai.com"
token = get_token("YOUR_AK", "YOUR_SK")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# ภาพถ่ายเหมือนจริง
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "Professional product photography, luxury perfume bottle on marble surface, "
            "soft studio lighting, shallow depth of field, bokeh background, "
            "8K ultra detailed, commercial photography style"
        ),
        "negative_prompt": "cartoon, illustration, painting, low quality, blur",
        "aspect_ratio": "1:1",
        "n": 1
    }
)
task_id = resp.json()["data"]["task_id"]
```

### 4.2 Thai Language Prompt — ใช้ภาษาไทย

```python
# Kolors เข้าใจภาษาไทยได้ดี
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "ภาพถ่ายเหมือนจริงของวัดไทยโบราณ ยามพระอาทิตย์ตก "
            "ทองของพระอาทิตย์สาดส่องบนยอดเจดีย์สีทอง "
            "น้ำในบ่อสะท้อนภาพ บรรยากาศสงบ ศักดิ์สิทธิ์"
        ),
        "negative_prompt": "คน, นักท่องเที่ยว, ภาพเบลอ, คุณภาพต่ำ",
        "aspect_ratio": "16:9",
        "n": 2
    }
)
```

### 4.3 Artistic Styles — สไตล์ศิลปะต่างๆ

```python
# Anime/Manga Style (สไตล์อนิเมะ/มังงะ)
anime_prompt = {
    "model": "kling-v3",
    "prompt": (
        "Anime style illustration, young girl with long black hair standing in a sunflower field, "
        "Studio Ghibli inspired, soft watercolor tones, dreamy atmosphere, detailed background"
    ),
    "negative_prompt": "realistic, 3D render, ugly, deformed",
    "aspect_ratio": "9:16",
    "n": 1
}

# Oil Painting Style (สไตล์ภาพวาดสีน้ำมัน)
oil_painting_prompt = {
    "model": "kling-v3",
    "prompt": (
        "Classical oil painting style, portrait of elderly fisherman at sea, "
        "Rembrandt lighting, rich warm tones, detailed brushwork, museum quality"
    ),
    "negative_prompt": "digital art, photo, modern style",
    "aspect_ratio": "3:4",
    "n": 1
}

# Cyberpunk Style (สไตล์ไซเบอร์พังก์ — อนาคตมืดหม่นเต็มไปด้วยไฟนีออน)
cyberpunk_prompt = {
    "model": "kling-v3",
    "prompt": (
        "Cyberpunk cityscape at night, neon signs in Thai script, flying vehicles, "
        "rain-slicked streets reflecting lights, ultra detailed, cinematic"
    ),
    "negative_prompt": "daylight, natural, low quality",
    "aspect_ratio": "16:9",
    "n": 1
}
```

---

## 5. Image-to-Image — แปลงหรืออ้างอิงรูปเดิม

Image-to-Image (การสร้างภาพโดยอ้างอิงรูปที่มีอยู่ — ใช้รูปเก่าเป็นฐานแล้วปรับตาม Prompt):

```python
# ใช้รูปอ้างอิงเพื่อควบคุมสไตล์
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": "ภาพเดิมแต่เป็นสไตล์อนิเมะ สีสดใส เส้นคมชัด",
        "image": "https://example.com/original_photo.jpg",
        "image_fidelity": 0.6,   # 0 = อิสระ, 1 = ใกล้เคียงมาก
        "aspect_ratio": "1:1",
        "n": 1
    }
)

# ใช้รูปอ้างอิงใบหน้า (สำหรับ Portrait — ภาพบุคคล)
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": "สาวในชุดกีฬา วิ่งในสวนสาธารณะ แสงบ่าย",
        "image": "https://example.com/face_reference.jpg",
        "image_fidelity": 0.3,
        "human_fidelity": 0.8,   # รักษาหน้าตาให้ใกล้เคียงรูปอ้างอิง
        "aspect_ratio": "9:16",
        "n": 1
    }
)
```

---

## 6. 4K Native Image Generation

```python
# สร้างภาพ 4K ด้วย kling-v3
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "4K ultra high resolution, aerial photograph of tropical island, "
            "crystal clear turquoise water, white sand beach, lush green jungle, "
            "golden hour lighting, professional drone photography"
        ),
        "negative_prompt": "low resolution, blur, grain, oversaturated",
        "aspect_ratio": "16:9",
        "n": 1
        # หมายเหตุ: ระบุ 4K ใน Prompt และ Kling จะใช้ resolution สูงสุดที่รองรับ
    }
)
```

> **หมายเหตุ**: การสร้างภาพ 4K ใช้เวลานานกว่าและใช้ Concurrency (การใช้ทรัพยากรพร้อมกัน) มากกว่าปกติ

---

## 7. Prompt Engineering สำหรับ Kolors

### โครงสร้าง Prompt ที่ดี

```
[Subject (หัวเรื่อง)] + [Action/State (การกระทำ/สถานะ)] + [Environment (สภาพแวดล้อม)] + [Lighting (แสง)] + [Style (สไตล์)] + [Quality (คุณภาพ)]
```

**ตัวอย่าง:**
```
[หมาไซบีเรียน] [กำลังวิ่งอยู่] [บนหิมะในป่าสน] [แสงทองยามพระอาทิตย์ตก] 
[สไตล์ภาพถ่ายมืออาชีพ] [8K ultra detailed, award winning photography]
```

### Style Keywords ที่ควรรู้

| สไตล์ | Keyword ภาษาอังกฤษ |
|-------|-------------------|
| ภาพถ่ายเหมือนจริง | `photorealistic`, `DSLR photo`, `8K`, `ultra detailed` |
| อนิเมะ | `anime style`, `manga`, `Studio Ghibli`, `Makoto Shinkai` |
| ภาพวาดสีน้ำ | `watercolor painting`, `soft colors`, `brush strokes` |
| ภาพวาดน้ำมัน | `oil painting`, `classical art`, `Rembrandt style` |
| Digital Art (งานศิลปะดิจิทัล) | `digital illustration`, `concept art`, `artstation` |
| 3D Render (การเรนเดอร์ 3 มิติ) | `3D render`, `Blender`, `Octane render`, `CGI` |
| Cyberpunk | `cyberpunk`, `neon lights`, `futuristic`, `sci-fi` |
| Vintage (วินเทจ — สไตล์ย้อนยุค) | `vintage photo`, `retro style`, `film grain`, `1970s` |

### Lighting Keywords (คำศัพท์เกี่ยวกับแสง)

| แสง | คำที่ใช้ |
|-----|--------|
| แสงทอง | `golden hour`, `warm sunlight`, `soft golden light` |
| แสง Studio | `studio lighting`, `softbox`, `professional lighting` |
| แสงจันทร์ | `moonlight`, `night scene`, `moonlit` |
| แสงเทียน | `candlelight`, `warm ambient`, `low key` |
| แสงนีออน | `neon lights`, `cyberpunk lighting`, `colorful neon` |

---

## 8. Multi-Shot Image Series (AI Multi-Shot — ชุดภาพหลายเฟรมที่ต่อเนื่องกัน)

Kolors สามารถสร้างภาพหลายภาพที่มีความต่อเนื่องกัน เหมาะสำหรับ Storyboard (บอร์ดเรื่อง — ภาพร่างแสดงลำดับฉาก) หรือ Comic Strip (การ์ตูนแบบช่อง)

```python
# สร้าง Storyboard 4 ช่อง
resp = requests.post(f"{BASE}/v1/images/ai-multi-shot",
    headers=headers,
    json={
        "model": "kling-v3",
        "result_type": "series",
        "n": 4,
        "shots": [
            {
                "prompt": "ฉากที่ 1: นักสืบเดินเข้ามาในห้องที่มืดมิด มีแสงไฟเดียวส่องกระทบโต๊ะ"
            },
            {
                "prompt": "ฉากที่ 2: นักสืบพบซองจดหมายลึกลับบนโต๊ะ"
            },
            {
                "prompt": "ฉากที่ 3: นักสืบอ่านจดหมาย สีหน้าตกใจ"
            },
            {
                "prompt": "ฉากที่ 4: นักสืบโทรศัพท์ เงาของใครบางคนอยู่หลังหน้าต่าง"
            }
        ],
        "style": "noir graphic novel, high contrast black and white, dramatic shadows"
    }
)
```

---

## 9. เปรียบเทียบ Kolors กับโมเดลอื่น

| รายการ | Kolors/Kling | Midjourney | DALL-E 3 | Stable Diffusion |
|--------|-------------|-----------|---------|-----------------|
| ภาษาไทย/จีน | ดีมาก | ดี | ดี | ต้องแปลเอง |
| 4K Native | ✅ | ✅ | ❌ | ✅ (ต้องตั้งค่า) |
| API | ✅ | ✅ (จำกัด) | ✅ | ✅ |
| Text ในภาพ | ดี | ดี | ดีมาก | พอใช้ |
| Video Generation (การสร้างวิดีโอ) | ✅ (Kling) | ❌ | ❌ | บางส่วน |
| Pricing (ราคา) | Pay per use (จ่ายตามใช้) | Subscription (รายเดือน) | Pay per use | Self-host ได้ (ติดตั้งเองได้) |

---

## 10. สรุป

Kolors/Kling Image Models เหมาะกับ:

- **Content Creator** (ผู้สร้างคอนเทนต์) ที่ต้องการภาพคุณภาพสูงจาก Prompt ภาษาไทยหรือจีน
- **นักพัฒนา** ที่สร้างระบบ AI สร้างภาพสำหรับแพลตฟอร์มไทย
- **ธุรกิจ E-Commerce** ที่ต้องการภาพสินค้าต้นทุนต่ำ
- **นักออกแบบ** ที่ต้องการต้นแบบไอเดีย (Concept Art — ภาพแนวคิด) รวดเร็ว
- **Production House** (บริษัทผลิตสื่อ) ที่ต้องการ Storyboard หรือ Previs (Pre-visualization — ภาพจำลองก่อนถ่ายจริง) จากข้อความ
