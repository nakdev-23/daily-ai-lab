---
title: "ภาพรวม Images API — Authentication และการเริ่มต้นใช้งาน"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "แนะนำ OpenAI Images API สำหรับนักพัฒนา ครอบคลุม Authentication, API Key, และโครงสร้างพื้นฐานของ API"
readTime: "6 นาที"
readers: "0"
locked: false
order: 4
---
# ภาพรวม Images API — Authentication และการเริ่มต้นใช้งาน

> อ้างอิงหลัก: [OpenAI Images API Reference](https://platform.openai.com/docs/api-reference/images)

---

## Images API คืออะไร

**Images API** คือ REST API (ช่องทางการสื่อสารระหว่างโปรแกรมผ่านอินเทอร์เน็ต — ส่งคำขอและรับผลลัพธ์ในรูปแบบ JSON) ของ OpenAI ที่ให้นักพัฒนาสามารถนำความสามารถของ DALL·E ไปรวมกับแอปพลิเคชันของตัวเองได้

ด้วย Images API คุณสามารถ:
- **สร้างภาพจากข้อความ** ผ่าน Generation Endpoint (จุดปลายทาง API สำหรับสร้างภาพใหม่)
- **แก้ไขภาพที่มีอยู่** ผ่าน Edit Endpoint (จุดปลายทาง API สำหรับแก้ไขภาพ)
- **สร้างภาพแปรผัน** ผ่าน Variation Endpoint (จุดปลายทาง API สำหรับสร้างหลายเวอร์ชันจากภาพต้นฉบับ)

---

## ขั้นตอนการเริ่มต้น

### ขั้นตอนที่ 1: สมัครบัญชี OpenAI

ไปที่ [platform.openai.com](https://platform.openai.com) และสมัครบัญชี OpenAI (ถ้ายังไม่มี)

### ขั้นตอนที่ 2: สร้าง API Key

**API Key** (รหัสลับสำหรับยืนยันตัวตนในการเรียกใช้ API — เหมือนรหัสผ่านที่โปรแกรมของคุณต้องใช้เพื่อพิสูจน์ว่าเป็นคุณ) คือสิ่งสำคัญที่สุดในการใช้งาน API

1. ไปที่ [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. คลิก **"Create new secret key"**
3. ตั้งชื่อ Key ให้จำได้ เช่น "my-dall-e-project"
4. **คัดลอกและเก็บ Key ไว้ในที่ปลอดภัย** — คุณจะเห็น Key นี้ได้ครั้งเดียวเท่านั้น!

> **คำเตือน:** ไม่ควรแชร์ API Key กับใคร และไม่ควรเขียน Key ลงใน Source Code (โค้ดต้นฉบับ) โดยตรง ควรใช้ Environment Variable (ตัวแปรสภาพแวดล้อม — วิธีเก็บข้อมูลลับแยกจากโค้ดหลัก) แทน

### ขั้นตอนที่ 3: ติดตั้ง OpenAI Library

**สำหรับ Python:**
```bash
pip install openai
```

**สำหรับ Node.js:**
```bash
npm install openai
```

### ขั้นตอนที่ 4: ตั้งค่า API Key

**วิธีที่แนะนำ — ใช้ Environment Variable:**

สำหรับ macOS/Linux:
```bash
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

สำหรับ Windows (PowerShell):
```powershell
$env:OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

หรือสร้างไฟล์ `.env`:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Authentication (การยืนยันตัวตน)

ทุก Request (คำขอ — ข้อมูลที่ส่งไปยัง API) ต้องมี API Key ในส่วน **Authorization Header** (ส่วนหัวของคำขอสำหรับยืนยันตัวตน)

### รูปแบบ HTTP Request พื้นฐาน

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### ตัวอย่างการเรียก API ด้วย Python

```python
from openai import OpenAI

# สร้าง Client (ตัวเชื่อมต่อกับ API — จัดการการส่งและรับข้อมูลอัตโนมัติ)
client = OpenAI(
    api_key="sk-xxxxxxxx"  # ควรใช้ os.environ.get("OPENAI_API_KEY") แทน
)

# เรียก Images API เพื่อสร้างภาพ
response = client.images.generate(
    model="dall-e-3",
    prompt="A beautiful sunset over the mountains",
    size="1024x1024",
    quality="standard",
    n=1,
)

# ดึง URL ของภาพที่สร้าง
image_url = response.data[0].url
print(image_url)
```

### ตัวอย่างการเรียก API ด้วย Node.js

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A beautiful sunset over the mountains",
  size: "1024x1024",
  quality: "standard",
  n: 1,
});

const imageUrl = response.data[0].url;
console.log(imageUrl);
```

### ตัวอย่างการเรียก API ด้วย cURL (คำสั่งในเทอร์มินัล)

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A beautiful sunset over the mountains",
    "n": 1,
    "size": "1024x1024"
  }'
```

---

## Base URL และ Endpoint หลัก

**Base URL** (URL พื้นฐาน — ที่อยู่หลักของ API ก่อนระบุประเภทคำขอ): `https://api.openai.com/v1`

| Endpoint | HTTP Method | วัตถุประสงค์ |
|---|---|---|
| `/images/generations` | POST | สร้างภาพจาก Prompt |
| `/images/edits` | POST | แก้ไขภาพที่มีอยู่ |
| `/images/variations` | POST | สร้างภาพแปรผัน |

---

## โครงสร้าง Response (ข้อมูลที่ API ส่งกลับ)

เมื่อ API สร้างภาพสำเร็จ จะส่ง JSON กลับมาในรูปแบบนี้:

```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "revised_prompt": "A majestic mountain landscape at golden hour..."
    }
  ]
}
```

| Field | คำอธิบาย |
|---|---|
| `created` | Timestamp (ประทับเวลา — บอกเวลาที่สร้างในรูปแบบ Unix timestamp) |
| `data` | Array (ชุดข้อมูล — รายการภาพที่สร้าง) ของภาพที่สร้าง |
| `data[].url` | URL ชั่วคราวของภาพ (หมดอายุหลัง 1 ชั่วโมง) |
| `data[].b64_json` | ข้อมูลภาพในรูปแบบ Base64 (ถ้าเลือก response_format เป็น b64_json) |
| `data[].revised_prompt` | Prompt ที่ DALL·E 3 ปรับแก้ให้อัตโนมัติ |

---

## Error Handling (การจัดการข้อผิดพลาด)

เมื่อเกิดข้อผิดพลาด API จะส่ง Error Response (การตอบสนองเมื่อเกิดข้อผิดพลาด) กลับมา:

```json
{
  "error": {
    "code": "content_policy_violation",
    "message": "Your request was rejected as a result of our safety system...",
    "type": "invalid_request_error"
  }
}
```

### Error Codes ที่พบบ่อย

| Error Code | ความหมาย | วิธีแก้ |
|---|---|---|
| `invalid_api_key` | API Key ไม่ถูกต้อง | ตรวจสอบ API Key อีกครั้ง |
| `content_policy_violation` | Prompt ละเมิดนโยบายเนื้อหา | แก้ไข Prompt ให้เหมาะสม |
| `rate_limit_exceeded` | ใช้ API เกินขีดจำกัด | รอและลองใหม่, หรืออัปเกรดแผน |
| `insufficient_quota` | เครดิตในบัญชีหมด | เติมเครดิตใน OpenAI Dashboard |
| `invalid_request_error` | คำขอมีรูปแบบไม่ถูกต้อง | ตรวจสอบ Parameter ต่างๆ |

### ตัวอย่างการจัดการ Error ใน Python

```python
from openai import OpenAI, OpenAIError

client = OpenAI()

try:
    response = client.images.generate(
        model="dall-e-3",
        prompt="A sunset landscape",
        size="1024x1024",
        n=1,
    )
    image_url = response.data[0].url
    print(f"ภาพสร้างสำเร็จ: {image_url}")

except OpenAIError as e:
    print(f"เกิดข้อผิดพลาด: {e.message}")
```

---

## ข้อควรรู้สำหรับนักพัฒนาเริ่มต้น

### 1. URL ของภาพมีอายุ 1 ชั่วโมง

URL ที่ API ส่งกลับมาจะหมดอายุภายใน 1 ชั่วโมง ถ้าต้องการเก็บภาพไว้ ให้:
- ดาวน์โหลดไฟล์ภาพแล้วเก็บไว้ใน Storage ของตัวเอง
- หรือใช้ `response_format: "b64_json"` เพื่อรับข้อมูลภาพโดยตรงโดยไม่ผ่าน URL

### 2. ต้องเติมเครดิตก่อนใช้งาน

Images API ใช้เครดิตในบัญชี OpenAI ซึ่งต้องซื้อก่อน (Pay-as-you-go — จ่ายตามที่ใช้จริง) ไปที่ [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing) เพื่อเติมเครดิต

### 3. ตรวจสอบ Usage ของคุณ

ดูปริมาณการใช้งานและค่าใช้จ่ายได้ที่ [platform.openai.com/usage](https://platform.openai.com/usage)

---

## สรุป

Images API ของ OpenAI ช่วยให้นักพัฒนาสามารถนำความสามารถของ DALL·E ไปรวมกับแอปพลิเคชันของตัวเองได้ง่ายๆ เพียงแค่มี API Key ติดตั้ง Library ที่ต้องการ และเรียกใช้ Endpoint ที่เหมาะสม ในบทถัดไปเราจะเรียนรู้รายละเอียดของแต่ละ Endpoint อย่างละเอียด
