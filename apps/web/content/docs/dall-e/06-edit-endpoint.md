---
title: "Edit Endpoint — แก้ไขและเติมภาพด้วย AI"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้การใช้ POST /images/edits สำหรับแก้ไขบางส่วนของภาพ (Inpainting) และเติมเต็มภาพ ด้วย DALL·E 2"
readTime: "7 นาที"
readers: "0"
locked: false
order: 6
---
# Edit Endpoint — แก้ไขและเติมภาพด้วย AI

> อ้างอิงหลัก: [OpenAI API Reference — Create image edit](https://platform.openai.com/docs/api-reference/images/createEdit)

---

## Edit Endpoint คืออะไร

**Edit Endpoint** (จุดปลายทาง API สำหรับแก้ไขภาพ — รับภาพต้นฉบับพร้อม Prompt แล้วแก้ไขหรือเติมเนื้อหาในภาพ) ช่วยให้คุณสามารถ:

- **แก้ไขบางส่วนของภาพ** โดยใช้ Mask (หน้ากาก — ภาพขาวดำที่บอกว่าส่วนไหนของภาพต้องการแก้ไข)
- **เติมพื้นที่ว่างในภาพ** (Outpainting — การขยายภาพออกไปนอกขอบเดิม)
- **ลบหรือแทนที่วัตถุ** ในภาพ

> **หมายเหตุสำคัญ:** Edit Endpoint รองรับเฉพาะ **DALL·E 2** เท่านั้น ไม่รองรับ DALL·E 3

**Endpoint:**
```
POST https://api.openai.com/v1/images/edits
```

---

## Inpainting คืออะไร

**Inpainting** (แก้ไขบางส่วนของภาพ — เลือกพื้นที่แล้วให้ AI เติมใหม่) คือเทคนิคที่ทำให้คุณระบุส่วนที่ต้องการแก้ไขในภาพโดยใช้ Mask แล้วให้ DALL·E สร้างเนื้อหาใหม่มาแทนที่ในพื้นที่นั้น

ตัวอย่างการใช้ Inpainting:
- ลบรถยนต์ออกจากภาพถนน และให้ AI เติมพื้นถนนเปล่าๆ แทน
- แทนที่ท้องฟ้าในภาพด้วยท้องฟ้าพระอาทิตย์ตก
- เปลี่ยนเสื้อผ้าของบุคคลในภาพ
- เพิ่มวัตถุใหม่ในภาพที่มีอยู่

---

## Parameters ของ Edit Endpoint

| Parameter | Type | Required | คำอธิบาย |
|---|---|---|---|
| `image` | file | ✅ ต้องมี | ไฟล์ภาพต้นฉบับ (PNG, RGBA, ขนาดไม่เกิน 4MB) |
| `prompt` | string | ✅ ต้องมี | คำอธิบายภาพที่ต้องการในส่วนที่แก้ไข |
| `mask` | file | ❌ ไม่บังคับ | ไฟล์ Mask PNG (พื้นที่โปร่งใส = แก้ไข, ทึบแสง = คงเดิม) |
| `model` | string | ❌ ไม่บังคับ | ต้องเป็น `dall-e-2` |
| `n` | integer | ❌ ไม่บังคับ | จำนวนภาพที่สร้าง (1-10, ค่าเริ่มต้น: 1) |
| `size` | string | ❌ ไม่บังคับ | ขนาดภาพ (256×256, 512×512, 1024×1024) |
| `response_format` | string | ❌ ไม่บังคับ | `url` หรือ `b64_json` |

---

## ข้อกำหนดของไฟล์ภาพ

### ภาพต้นฉบับ (`image`)

- รูปแบบ: **PNG เท่านั้น**
- ขนาดไฟล์: ไม่เกิน **4MB**
- ต้องเป็น **ภาพสี่เหลี่ยมจัตุรัส** (กว้าง = สูง)
- ถ้าไม่ใส่ Mask ภาพทั้งหมดจะถูกแก้ไขตาม Prompt

### Mask Image (`mask`)

- รูปแบบ: **PNG เท่านั้น**
- ขนาดต้อง **เท่ากับภาพต้นฉบับ**
- พื้นที่ **โปร่งใส (Transparent — ไม่มีสี Alpha=0)** = บริเวณที่ DALL·E จะแก้ไข
- พื้นที่ **ทึบแสง (Opaque — สีเต็ม Alpha=255)** = บริเวณที่คงเดิมไม่แก้ไข

---

## วิธีสร้าง Mask

### วิธีที่ 1: ใช้โปรแกรมแก้ไขภาพ (Photoshop, GIMP)

1. เปิดภาพต้นฉบับในโปรแกรมแก้ไขภาพ
2. สร้าง Layer ใหม่ที่มีพื้นหลังสีขาวทึบแสง
3. วาดสีโปร่งใส (ลบ pixel ออก) ในบริเวณที่ต้องการแก้ไข
4. บันทึกเป็นไฟล์ PNG ที่มี Alpha Channel (ช่องโปร่งใส — ข้อมูลส่วนที่โปร่งในภาพ)

### วิธีที่ 2: สร้าง Mask ด้วย Python และ Pillow

```python
from PIL import Image
import numpy as np

def create_mask(image_path: str, mask_area: tuple, output_path: str = "mask.png"):
    """
    สร้าง Mask สำหรับ DALL·E Edit
    mask_area: (x_start, y_start, x_end, y_end) — พื้นที่ที่ต้องการแก้ไข
    """
    # เปิดภาพต้นฉบับเพื่อดูขนาด
    original = Image.open(image_path)
    width, height = original.size
    
    # สร้าง Mask ขาวทึบแสง (ไม่แก้ไขอะไร)
    mask = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    
    # ทำให้พื้นที่ที่ต้องการแก้ไขโปร่งใส
    x1, y1, x2, y2 = mask_area
    mask_array = np.array(mask)
    mask_array[y1:y2, x1:x2] = [0, 0, 0, 0]  # โปร่งใส (Alpha=0)
    
    # บันทึก Mask
    mask_image = Image.fromarray(mask_array)
    mask_image.save(output_path, "PNG")
    print(f"สร้าง Mask สำเร็จ: {output_path}")
    return output_path

# ตัวอย่าง: สร้าง Mask สำหรับบริเวณตรงกลางของภาพ 1024x1024
create_mask(
    image_path="original.png",
    mask_area=(300, 300, 700, 700),  # พื้นที่ตรงกลาง
    output_path="mask.png"
)
```

---

## ตัวอย่างการใช้งาน Edit Endpoint

### ตัวอย่าง 1: แทนที่ท้องฟ้าในภาพ

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# แทนที่ท้องฟ้า (ส่วนบนของภาพ) ด้วยท้องฟ้าพระอาทิตย์ตก
with open("landscape.png", "rb") as image_file, \
     open("sky_mask.png", "rb") as mask_file:
    
    response = client.images.edit(
        model="dall-e-2",
        image=image_file,
        mask=mask_file,
        prompt="A dramatic sunset sky with orange and purple clouds",
        size="1024x1024",
        n=1,
    )

new_image_url = response.data[0].url
print(f"ภาพที่แก้ไขแล้ว: {new_image_url}")
```

### ตัวอย่าง 2: เติมพื้นที่ว่าง (ไม่ใช้ Mask)

เมื่อไม่ใส่ Mask ภาพทั้งหมดจะถูกแก้ไขตาม Prompt:

```python
# เปลี่ยนทั้งภาพตาม Prompt ใหม่
with open("photo.png", "rb") as image_file:
    
    response = client.images.edit(
        model="dall-e-2",
        image=image_file,
        prompt="The same scene but during winter with snow",
        size="1024x1024",
        n=2,  # สร้าง 2 ตัวเลือก
    )

for i, img in enumerate(response.data):
    print(f"ตัวเลือก {i+1}: {img.url}")
```

### ตัวอย่าง 3: ลบวัตถุออกจากภาพ

```python
# ลบบุคคลออกจากภาพ (ต้องสร้าง Mask ที่ครอบคลุมบุคคล)
with open("crowded_street.png", "rb") as image_file, \
     open("person_mask.png", "rb") as mask_file:
    
    response = client.images.edit(
        model="dall-e-2",
        image=image_file,
        mask=mask_file,
        prompt="An empty street with no people, just the buildings and pavement",
        size="1024x1024",
        n=1,
    )

print(f"ภาพที่ลบบุคคลแล้ว: {response.data[0].url}")
```

### ตัวอย่างด้วย Node.js

```javascript
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function editImage() {
  const response = await openai.images.edit({
    model: "dall-e-2",
    image: fs.createReadStream("original.png"),
    mask: fs.createReadStream("mask.png"),
    prompt: "A sunlit indoor lounge area with a pool containing a flamingo",
    n: 1,
    size: "1024x1024",
  });

  console.log("URL ภาพที่แก้ไข:", response.data[0].url);
}

editImage();
```

---

## ตัวอย่าง cURL

```bash
curl https://api.openai.com/v1/images/edits \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@original.png" \
  -F mask="@mask.png" \
  -F prompt="A sunlit indoor lounge area with a pool containing a flamingo" \
  -F n=1 \
  -F size="1024x1024"
```

---

## ข้อผิดพลาดที่พบบ่อย

| ปัญหา | สาเหตุ | วิธีแก้ |
|---|---|---|
| `image must be a PNG` | ไฟล์ไม่ใช่ PNG | แปลงเป็น PNG ก่อน |
| `image must be square` | ภาพไม่เป็นสี่เหลี่ยมจัตุรัส | ตัดหรือปรับขนาดให้กว้าง = สูง |
| `image too large` | ไฟล์เกิน 4MB | บีบอัด (Compress — ลดขนาดไฟล์) ให้เล็กลง |
| `mask and image must be same size` | ขนาด Mask ไม่ตรงกับภาพ | ปรับขนาด Mask ให้ตรงกัน |

---

## เคล็ดลับการใช้ Edit Endpoint

1. **ทำ Mask ให้ใหญ่กว่าที่ต้องการเล็กน้อย** — ให้ AI มีพื้นที่เพียงพอในการสร้างขอบเขตที่เป็นธรรมชาติ
2. **Prompt ควรอธิบายภาพทั้งหมด** ไม่ใช่แค่ส่วนที่แก้ไข — บอก AI ถึงบริบทรอบข้างด้วย
3. **สร้างหลาย n** แล้วเลือกผลลัพธ์ที่ดีที่สุด — แต่ละครั้งจะได้ผลลัพธ์ที่ต่างกัน
4. **ภาพที่มีเนื้อหาเรียบง่าย** มักได้ผลดีกว่าภาพที่ซับซ้อนมาก

---

## สรุป

Edit Endpoint เป็นเครื่องมือทรงพลังสำหรับการแก้ไขภาพที่มีอยู่ด้วย AI โดยใช้เทคนิค Inpainting ผ่านการกำหนด Mask ซึ่งบอก DALL·E 2 ว่าต้องการแก้ไขบริเวณใด แม้จะรองรับเฉพาะ DALL·E 2 และต้องการไฟล์ PNG สี่เหลี่ยมจัตุรัส แต่ความยืดหยุ่นในการแก้ไขภาพทำให้มันมีประโยชน์มากสำหรับงานที่ต้องการปรับแต่งภาพที่มีอยู่แล้ว
