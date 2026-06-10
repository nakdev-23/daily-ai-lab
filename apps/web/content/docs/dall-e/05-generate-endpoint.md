---
title: "Generate Endpoint — สร้างภาพจากข้อความ"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้การใช้งาน POST /images/generations ทุก Parameter ที่รองรับ พร้อมตัวอย่างโค้ดและผลลัพธ์จริง"
readTime: "8 นาที"
readers: "0"
locked: false
order: 5
---
# Generate Endpoint — สร้างภาพจากข้อความ

> อ้างอิงหลัก: [OpenAI API Reference — Create image](https://platform.openai.com/docs/api-reference/images/create)

---

## Generate Endpoint คืออะไร

**Generate Endpoint** (จุดปลายทาง API สำหรับสร้างภาพ — รับ Prompt แล้วสร้างภาพใหม่ขึ้นมาตั้งแต่ต้น) คือ API หลักที่ใช้ในการสร้างภาพจากคำอธิบาย

**Endpoint:**
```
POST https://api.openai.com/v1/images/generations
```

---

## Parameters ทั้งหมด (ตัวแปรที่กำหนดรายละเอียดของคำขอ)

### Parameter หลัก

| Parameter | Type | Required | คำอธิบาย |
|---|---|---|---|
| `prompt` | string | ✅ ต้องมี | คำอธิบายภาพที่ต้องการสร้าง |
| `model` | string | ❌ ไม่บังคับ | โมเดลที่ใช้ (`dall-e-2` หรือ `dall-e-3`) |
| `n` | integer | ❌ ไม่บังคับ | จำนวนภาพที่ต้องการ (ค่าเริ่มต้น: 1) |
| `size` | string | ❌ ไม่บังคับ | ขนาดภาพ (ค่าเริ่มต้น: 1024×1024) |
| `quality` | string | ❌ ไม่บังคับ | คุณภาพภาพ (เฉพาะ DALL·E 3) |
| `style` | string | ❌ ไม่บังคับ | สไตล์ภาพ (เฉพาะ DALL·E 3) |
| `response_format` | string | ❌ ไม่บังคับ | รูปแบบผลลัพธ์ (`url` หรือ `b64_json`) |
| `user` | string | ❌ ไม่บังคับ | ID ผู้ใช้สำหรับการติดตาม |

---

## Parameter `prompt` (คำสั่งให้ AI สร้างภาพ)

Prompt (คำสั่งให้ AI สร้างภาพ — อธิบายภาพที่ต้องการเป็นภาษาอังกฤษหรือไทย) คือหัวใจหลักของการสร้างภาพ

- **DALL·E 2:** ความยาว Prompt สูงสุด 1,000 ตัวอักษร
- **DALL·E 3:** ความยาว Prompt สูงสุด 4,000 ตัวอักษร

```python
# ตัวอย่าง Prompt สั้น
prompt = "A red apple on a white table"

# ตัวอย่าง Prompt ละเอียด
prompt = """
A cozy Thai coffee shop at sunset, wooden interior, warm Edison bulb lighting, 
potted tropical plants near the window, a barista preparing pour-over coffee,
watercolor painting style, soft muted colors, peaceful atmosphere
"""
```

---

## Parameter `model` (โมเดลที่ใช้สร้างภาพ)

```python
model = "dall-e-3"   # ใช้ DALL·E 3 (แนะนำ — ผลลัพธ์ดีกว่า)
model = "dall-e-2"   # ใช้ DALL·E 2 (ถูกกว่า, รองรับ Edit และ Variation)
```

ถ้าไม่ระบุ ค่าเริ่มต้นจะเป็น `dall-e-2`

---

## Parameter `size` (ขนาดภาพ)

**Size** (ขนาดภาพ — ความกว้างxความสูงของภาพในหน่วย pixel) ที่รองรับแตกต่างกันตามโมเดล:

### สำหรับ DALL·E 3

| Size | ความหมาย | ใช้กับ |
|---|---|---|
| `"1024x1024"` | ภาพสี่เหลี่ยมจัตุรัส | ทั่วไป, โปรไฟล์, โลโก้ |
| `"1792x1024"` | ภาพแนวนอน (Landscape) | วอลเปเปอร์, แบนเนอร์ |
| `"1024x1792"` | ภาพแนวตั้ง (Portrait) | ภาพหน้าปก, เนื้อหามือถือ |

### สำหรับ DALL·E 2

| Size | ความหมาย |
|---|---|
| `"256x256"` | ภาพเล็ก ราคาถูกสุด |
| `"512x512"` | ภาพกลาง |
| `"1024x1024"` | ภาพใหญ่ คุณภาพดีสุด |

```python
# ตัวอย่างการกำหนด size
response = client.images.generate(
    model="dall-e-3",
    prompt="A wide panoramic mountain landscape",
    size="1792x1024",  # เลือกแนวนอนสำหรับภาพแนวกว้าง
    n=1,
)
```

---

## Parameter `quality` (คุณภาพภาพ)

**Quality** (คุณภาพ — ระดับรายละเอียดในการสร้างภาพ) รองรับเฉพาะ **DALL·E 3**:

| Quality | คำอธิบาย | ราคาเทียบกัน |
|---|---|---|
| `"standard"` | คุณภาพมาตรฐาน เร็วกว่า | ถูกกว่า |
| `"hd"` | คุณภาพสูง (High Definition — ความละเอียดสูง รายละเอียดมากขึ้น) เส้นชัดขึ้น รายละเอียดมากขึ้น | แพงกว่า (ประมาณ 2x) |

```python
# Standard — เหมาะกับการทดสอบและใช้งานทั่วไป
response = client.images.generate(
    model="dall-e-3",
    prompt="A forest scene",
    size="1024x1024",
    quality="standard",
)

# HD — เหมาะกับงานที่ต้องการคุณภาพสูงสุด
response = client.images.generate(
    model="dall-e-3",
    prompt="A detailed portrait of a wise old man",
    size="1024x1024",
    quality="hd",
)
```

> **เคล็ดลับ:** ใช้ `standard` สำหรับการทดสอบ Prompt เมื่อพอใจแล้วค่อยสร้างใหม่ด้วย `hd` เพื่อประหยัดค่าใช้จ่าย

---

## Parameter `style` (สไตล์ภาพ)

**Style** (สไตล์ภาพ — ลักษณะโดยรวมของภาพที่สร้าง) รองรับเฉพาะ **DALL·E 3**:

| Style | คำอธิบาย | เหมาะกับ |
|---|---|---|
| `"vivid"` | สีสันจัดจ้าน (Vivid — สีสันสดใส คมชัด ดราม่า) ค่าเริ่มต้น | ภาพศิลปะ, โฆษณา, งาน Creative |
| `"natural"` | สีสันธรรมชาติ (Natural — ดูสมจริง ไม่เกินจริง) | ภาพถ่ายจริง, ภาพประกอบบทความ |

```python
# Vivid — สีจัด ดราม่า เหมาะกับงาน Creative
response = client.images.generate(
    model="dall-e-3",
    prompt="A dragon flying over a volcano",
    size="1024x1024",
    style="vivid",
)

# Natural — ดูสมจริง เหมาะกับภาพสถานที่หรือบุคคล
response = client.images.generate(
    model="dall-e-3",
    prompt="A quiet morning in a Thai village",
    size="1024x1024",
    style="natural",
)
```

---

## Parameter `n` (จำนวนภาพ)

`n` คือจำนวนภาพที่ต้องการสร้างในครั้งเดียว

- **DALL·E 3:** รองรับ `n=1` เท่านั้น (สร้างได้ครั้งละ 1 ภาพ)
- **DALL·E 2:** รองรับ `n` ตั้งแต่ 1-10

```python
# DALL·E 2 — สร้าง 4 ภาพพร้อมกัน
response = client.images.generate(
    model="dall-e-2",
    prompt="A cute robot",
    size="1024x1024",
    n=4,  # ได้ 4 ภาพพร้อมกัน
)

# วนลูปแสดง URL ทุกภาพ
for i, image in enumerate(response.data):
    print(f"ภาพที่ {i+1}: {image.url}")
```

---

## Parameter `response_format` (รูปแบบผลลัพธ์)

**Response Format** (รูปแบบของข้อมูลที่ API ส่งกลับ — เลือกได้ว่าจะรับเป็น URL หรือข้อมูลภาพโดยตรง):

| Format | คำอธิบาย | เหมาะกับ |
|---|---|---|
| `"url"` | ส่งกลับ URL ชั่วคราว (หมดอายุใน 1 ชั่วโมง) ค่าเริ่มต้น | แสดงภาพในเว็บทันที |
| `"b64_json"` | ส่งกลับข้อมูลภาพในรูปแบบ Base64 (ข้อมูลภาพเข้ารหัสเป็นข้อความ) | บันทึกไฟล์โดยตรง, ไม่อยากพึ่ง URL |

```python
import base64

# รับภาพเป็น Base64 และบันทึกเป็นไฟล์
response = client.images.generate(
    model="dall-e-3",
    prompt="A mountain landscape",
    size="1024x1024",
    response_format="b64_json",
)

# Decode (แปลงรหัส — แปลง Base64 กลับเป็นข้อมูลภาพ) และบันทึกไฟล์
image_data = base64.b64decode(response.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_data)
print("บันทึกภาพสำเร็จ: output.png")
```

---

## ตัวอย่างโค้ดสมบูรณ์

### Python — สร้างและบันทึกภาพ

```python
import os
import requests
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_image(prompt: str, output_path: str = "output.png"):
    """สร้างภาพจาก Prompt และบันทึกเป็นไฟล์"""
    
    print(f"กำลังสร้างภาพ: {prompt}")
    
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        style="vivid",
        n=1,
    )
    
    # แสดง Revised Prompt (Prompt ที่ DALL·E 3 ปรับให้อัตโนมัติ)
    if response.data[0].revised_prompt:
        print(f"Revised Prompt: {response.data[0].revised_prompt}")
    
    # ดาวน์โหลดและบันทึกภาพ
    image_url = response.data[0].url
    image_response = requests.get(image_url)
    
    with open(output_path, "wb") as f:
        f.write(image_response.content)
    
    print(f"บันทึกภาพสำเร็จ: {output_path}")
    return output_path

# ใช้งาน
generate_image(
    prompt="A serene Thai temple at dawn, surrounded by misty mountains, golden light, photorealistic",
    output_path="thai_temple.png"
)
```

### JavaScript/TypeScript — สร้างภาพและแสดงใน Browser

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    n: 1,
  });

  const imageUrl = response.data[0].url!;
  const revisedPrompt = response.data[0].revised_prompt;
  
  console.log("Revised Prompt:", revisedPrompt);
  console.log("Image URL:", imageUrl);
  
  return imageUrl;
}

// ใช้งาน
generateImage("A futuristic Bangkok skyline at night with flying cars")
  .then(url => console.log("สำเร็จ:", url))
  .catch(err => console.error("ผิดพลาด:", err));
```

---

## ตารางสรุป DALL·E 2 vs DALL·E 3 ใน Generate Endpoint

| ความสามารถ | DALL·E 2 | DALL·E 3 |
|---|---|---|
| n (จำนวนภาพ/ครั้ง) | 1-10 | 1 เท่านั้น |
| size | 256, 512, 1024 | 1024, 1792×1024, 1024×1792 |
| quality | ไม่รองรับ | standard / hd |
| style | ไม่รองรับ | vivid / natural |
| Prompt สูงสุด | 1,000 ตัวอักษร | 4,000 ตัวอักษร |
| Revised Prompt | ไม่รองรับ | ✅ รองรับ |

---

## สรุป

Generate Endpoint เป็น API หลักของ DALL·E สำหรับสร้างภาพจากข้อความ DALL·E 3 มีความสามารถสูงกว่า DALL·E 2 มากในด้านคุณภาพและตัวเลือก แต่มีข้อจำกัดที่สร้างได้ครั้งละ 1 ภาพ ในการใช้งานจริงควรเลือก `dall-e-3` กับ `quality: "hd"` สำหรับงานสำคัญ และ `dall-e-3` กับ `quality: "standard"` สำหรับการทดสอบ Prompt
