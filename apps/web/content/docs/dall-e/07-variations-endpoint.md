---
title: "Variations Endpoint — สร้างภาพแปรผันจากภาพต้นฉบับ"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้การใช้ POST /images/variations เพื่อสร้างหลายเวอร์ชันจากภาพต้นฉบับ ด้วย DALL·E 2"
readTime: "5 นาที"
readers: "0"
locked: false
order: 7
---
# Variations Endpoint — สร้างภาพแปรผันจากภาพต้นฉบับ

> อ้างอิงหลัก: [OpenAI API Reference — Create image variation](https://platform.openai.com/docs/api-reference/images/createVariation)

---

## Variations Endpoint คืออะไร

**Variations Endpoint** (จุดปลายทาง API สำหรับสร้างภาพแปรผัน — รับภาพต้นฉบับแล้วสร้างภาพใหม่หลายเวอร์ชันที่มีสไตล์คล้ายกันแต่แตกต่างกันในรายละเอียด) เป็นฟีเจอร์เฉพาะของ **DALL·E 2** ที่ช่วยให้คุณสร้าง Variation (ภาพแปรผัน — สร้างรูปหลายเวอร์ชันจากภาพต้นฉบับ) ได้หลายแบบจากภาพเพียงภาพเดียว

ใช้กรณีที่:
- ต้องการตัวเลือกหลายแบบจากงานออกแบบเดียวกัน
- อยากได้ภาพที่ "คล้าย" กับต้นฉบับแต่มีความแตกต่างเล็กน้อย
- ต้องการ A/B Testing (ทดสอบ A/B — เปรียบเทียบ 2 เวอร์ชันเพื่อเลือกที่ดีกว่า) ระหว่างหลายตัวเลือก

> **หมายเหตุ:** Variations Endpoint รองรับเฉพาะ **DALL·E 2** เท่านั้น

**Endpoint:**
```
POST https://api.openai.com/v1/images/variations
```

---

## Parameters ของ Variations Endpoint

| Parameter | Type | Required | คำอธิบาย |
|---|---|---|---|
| `image` | file | ✅ ต้องมี | ไฟล์ภาพต้นฉบับ (PNG, สี่เหลี่ยมจัตุรัส, ไม่เกิน 4MB) |
| `model` | string | ❌ ไม่บังคับ | ต้องเป็น `dall-e-2` |
| `n` | integer | ❌ ไม่บังคับ | จำนวนภาพแปรผัน (1-10, ค่าเริ่มต้น: 1) |
| `size` | string | ❌ ไม่บังคับ | ขนาดภาพ: `256x256`, `512x512`, `1024x1024` |
| `response_format` | string | ❌ ไม่บังคับ | `url` หรือ `b64_json` |
| `user` | string | ❌ ไม่บังคับ | ID ผู้ใช้สำหรับติดตาม |

---

## ข้อกำหนดของไฟล์ภาพ

- รูปแบบ: **PNG เท่านั้น**
- ขนาดไฟล์: ไม่เกิน **4MB**
- ขนาดภาพ: ต้องเป็น **สี่เหลี่ยมจัตุรัส** (กว้าง = สูง)
- ไม่จำเป็นต้องมี Alpha Channel (ช่องโปร่งใส)

---

## ตัวอย่างการใช้งาน

### Python — สร้าง Variation จำนวนมาก

```python
import os
import requests
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def create_variations(image_path: str, num_variations: int = 4):
    """สร้างภาพแปรผันจากภาพต้นฉบับ"""
    
    print(f"กำลังสร้าง {num_variations} Variation จาก: {image_path}")
    
    with open(image_path, "rb") as image_file:
        response = client.images.create_variation(
            model="dall-e-2",
            image=image_file,
            n=num_variations,
            size="1024x1024",
        )
    
    # บันทึกทุกภาพ
    for i, image_data in enumerate(response.data):
        url = image_data.url
        img_response = requests.get(url)
        
        output_path = f"variation_{i+1}.png"
        with open(output_path, "wb") as f:
            f.write(img_response.content)
        
        print(f"บันทึก Variation {i+1}: {output_path}")
    
    return [img.url for img in response.data]

# ใช้งาน
urls = create_variations("original_logo.png", num_variations=4)
print(f"สร้างสำเร็จ {len(urls)} Variation")
```

### Python — รับผลลัพธ์เป็น Base64

```python
import base64
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

with open("original.png", "rb") as image_file:
    response = client.images.create_variation(
        model="dall-e-2",
        image=image_file,
        n=2,
        size="512x512",
        response_format="b64_json",  # รับข้อมูลภาพโดยตรง
    )

# บันทึกแต่ละ Variation
for i, img_data in enumerate(response.data):
    image_bytes = base64.b64decode(img_data.b64_json)
    output_file = f"variation_{i+1}.png"
    
    with open(output_file, "wb") as f:
        f.write(image_bytes)
    
    print(f"บันทึก: {output_file}")
```

### Node.js — สร้าง Variation

```javascript
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function createVariations(imagePath: string, count: number = 3) {
  const response = await openai.images.createVariation({
    model: "dall-e-2",
    image: fs.createReadStream(imagePath),
    n: count,
    size: "1024x1024",
  });

  response.data.forEach((image, index) => {
    console.log(`Variation ${index + 1}: ${image.url}`);
  });

  return response.data.map(img => img.url);
}

// ใช้งาน
createVariations("logo.png", 4);
```

### cURL — คำสั่งตรง

```bash
curl https://api.openai.com/v1/images/variations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@original.png" \
  -F n=4 \
  -F size="1024x1024"
```

---

## ความแตกต่างระหว่าง Variations กับ Generation

| คุณสมบัติ | Generate Endpoint | Variations Endpoint |
|---|---|---|
| Input (ข้อมูลนำเข้า) | Prompt (ข้อความ) | ภาพต้นฉบับ |
| ผลลัพธ์ | ภาพใหม่ตาม Prompt | ภาพที่คล้ายต้นฉบับ |
| การควบคุม | ควบคุมผ่าน Prompt | ควบคุมน้อยกว่า |
| โมเดลที่รองรับ | DALL·E 2 และ 3 | DALL·E 2 เท่านั้น |

---

## กรณีใช้งานจริง

### 1. ทดสอบหลายแบบสำหรับโลโก้

```python
# อัปโหลดโลโก้ต้นแบบและสร้างหลายเวอร์ชัน
create_variations("company_logo_draft.png", num_variations=5)
# เลือกเวอร์ชันที่ชอบจาก 5 ตัวเลือก
```

### 2. สร้าง Avatar หลายแบบ

```python
# สร้าง Avatar หลายสไตล์จากภาพต้นแบบ
create_variations("character_design.png", num_variations=6)
```

### 3. ภาพสินค้าหลายมุม

```python
# สร้างภาพสินค้าหลายเวอร์ชันจากภาพต้นฉบับเดียว
create_variations("product_photo.png", num_variations=4)
```

---

## เคล็ดลับการใช้ Variations

1. **ยิ่งภาพต้นฉบับชัดเจน ยิ่งได้ผลดี** — ภาพที่มีองค์ประกอบหลักชัดเจนจะให้ Variation ที่ดีกว่า
2. **ลองขนาดต่างๆ** — `512x512` เร็วกว่าและถูกกว่า เหมาะกับการทดสอบ
3. **สร้างทีละมาก** — การส่ง `n=8` ครั้งเดียวจะเร็วกว่าการส่ง n=1 แปดครั้ง
4. **เก็บภาพทันที** — URL หมดอายุใน 1 ชั่วโมง ควรดาวน์โหลดหรือบันทึกทันที

---

## ข้อผิดพลาดที่พบบ่อย

| ปัญหา | สาเหตุ | วิธีแก้ |
|---|---|---|
| `invalid image format` | ไฟล์ไม่ใช่ PNG | แปลงเป็น PNG ก่อน |
| `image must be square` | ภาพไม่เป็นสี่เหลี่ยมจัตุรัส | ปรับขนาดให้ Width = Height |
| `file size too large` | ไฟล์เกิน 4MB | บีบอัดหรือลดความละเอียด |
| `n must be between 1 and 10` | ระบุ n เกิน 10 | ลด n ให้ไม่เกิน 10 |

---

## สรุป

Variations Endpoint เป็นเครื่องมือที่ดีสำหรับการสร้างตัวเลือกหลายแบบจากภาพต้นฉบับเดียว เหมาะกับงานออกแบบที่ต้องการหลาย Iteration (การทำซ้ำ — สร้างหลายเวอร์ชันแล้วเลือกที่ดีที่สุด) แม้จะรองรับเฉพาะ DALL·E 2 และไม่มี Prompt ในการควบคุม แต่ความสะดวกในการสร้างหลายตัวเลือกทำให้มีประโยชน์มากในงาน Creative
