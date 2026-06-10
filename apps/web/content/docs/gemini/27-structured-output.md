---
title: "Structured Output — รับคำตอบ JSON ที่กำหนดโครงสร้างเอง"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Structured Output บังคับให้ Gemini ตอบกลับในรูปแบบ JSON schema ที่คุณกำหนด ทำให้นำข้อมูลไปประมวลผลในโค้ดได้ทันทีโดยไม่ต้อง parse text"
readTime: "8 นาที"
readers: "0"
locked: false
order: 27
---

# Structured Output — รับคำตอบ JSON ที่กำหนดโครงสร้างเอง

**Structured Output** (ผลลัพธ์มีโครงสร้าง — บังคับให้ AI ตอบในรูปแบบที่กำหนดไว้ล่วงหน้า) คือฟีเจอร์ที่บังคับให้ Gemini ตอบกลับในรูปแบบ JSON (รูปแบบข้อมูลมาตรฐาน — เหมือนตารางข้อมูลที่อ่านด้วยโปรแกรมได้ทันที) ที่คุณกำหนดไว้ล่วงหน้า แทนที่จะตอบเป็นข้อความธรรมดา ทำให้ integration (การเชื่อมต่อ) กับระบบอื่นง่ายและน่าเชื่อถือมากขึ้น

---

## ทำไมต้องใช้ Structured Output?

### ปัญหาของการ parse (แยกวิเคราะห์) text ธรรมดา

```python
# ไม่ใช้ Structured Output — ต้อง parse เอง
response = gemini.ask("แยกชื่อและอีเมลจากข้อความนี้: John Doe, john@example.com")
text = response.text
# "ชื่อ: John Doe, อีเมล: john@example.com"
# ต้อง parse string นี้เอง — อาจผิดพลาดได้

# ใช้ Structured Output — ได้ JSON ตรงๆ
# {"name": "John Doe", "email": "john@example.com"}
```

### ประโยชน์:
- **Type-safe** (ปลอดภัยด้านประเภทข้อมูล) — มั่นใจว่าได้ field (ช่อง) ที่ต้องการ
- **ไม่ต้อง parse** — นำ JSON ไปใช้ได้ทันที
- **Consistent** (สม่ำเสมอ) — โครงสร้างเดิมทุก request
- **เชื่อถือได้** — Gemini ต้องตอบตาม schema (โครงสร้างที่กำหนด) เสมอ

---

## วิธีการใช้งาน

### Python — ใช้ Pydantic (แนะนำ)

Pydantic คือ library (ไลบรารี — ชุดเครื่องมือโค้ดสำเร็จรูป) Python สำหรับกำหนดโครงสร้างข้อมูล:

```python
from google import genai
from pydantic import BaseModel
from typing import List

client = genai.Client(api_key="YOUR_API_KEY")

# กำหนดโครงสร้างด้วย Pydantic
class Product(BaseModel):
    name: str
    price: float
    category: str
    in_stock: bool

class ProductList(BaseModel):
    products: List[Product]
    total_count: int

# ใช้ response_schema (โครงสร้างคำตอบที่กำหนด)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
    รายการสินค้าในร้าน:
    - iPhone 15 Pro 45,900 บาท หมวดมือถือ มีสินค้า
    - MacBook Air M3 42,900 บาท หมวดคอมพิวเตอร์ หมดสต็อก
    - AirPods Pro 8,990 บาท หมวดอุปกรณ์เสริม มีสินค้า
    """,
    config={
        "response_mime_type": "application/json",
        "response_schema": ProductList
    }
)

# รับ JSON โดยตรง — ไม่ต้อง parse
import json
data = json.loads(response.text)
print(data["products"][0]["name"])  # "iPhone 15 Pro"
print(data["total_count"])          # 3
```

### Python — ใช้ JSON Schema โดยตรง

```python
schema = {
    "type": "object",
    "properties": {
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"]  # enum — จำกัดค่าที่เป็นไปได้
        },
        "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
        },
        "key_phrases": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["sentiment", "confidence", "key_phrases"]
}

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="วิเคราะห์ sentiment (อารมณ์ความรู้สึก): 'สินค้ายอดเยี่ยม ส่งเร็วมาก ประทับใจมาก!'",
    config={
        "response_mime_type": "application/json",
        "response_schema": schema
    }
)

result = json.loads(response.text)
# {"sentiment": "positive", "confidence": 0.98, "key_phrases": ["ยอดเยี่ยม", "ส่งเร็ว", "ประทับใจ"]}
```

### JavaScript — ใช้ Zod

Zod คือ library สำหรับกำหนดและตรวจสอบโครงสร้างข้อมูลใน JavaScript/TypeScript:

```javascript
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  cooking_time_minutes: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  steps: z.array(z.string())
});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "ให้สูตรทำ Pad Thai",
  config: {
    responseMimeType: "application/json",
    responseSchema: zodToJsonSchema(RecipeSchema)
  }
});

const recipe = JSON.parse(response.text);
console.log(recipe.name);        // "ผัดไทย"
console.log(recipe.difficulty);  // "medium"
```

---

## ประเภทข้อมูลที่รองรับ

| Type (ประเภท) | รายละเอียด |
|---|---|
| `string` | ข้อความ |
| `number` | ตัวเลข (int หรือ float) |
| `integer` | จำนวนเต็ม |
| `boolean` | true/false (จริง/เท็จ) |
| `array` | รายการ |
| `object` | object ซ้อน (ข้อมูลหลายช่องรวมกัน) |
| `null` | null (ว่างเปล่า) |

**Constraints (ข้อจำกัด) ที่ใช้ได้:**
- `enum` — จำกัดค่าที่เป็นไปได้
- `required` — field ที่ต้องมี
- `minimum`/`maximum` — สำหรับตัวเลข
- `description` — คำอธิบาย field (ช่วยให้ Gemini เข้าใจ)
- `anyOf` — รองรับหลายรูปแบบ

---

## กรณีการใช้งานจริง

### 1. ดึงข้อมูลจากข้อความ (Information Extraction — การสกัดข้อมูลจากข้อความ)

```python
class ContactInfo(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    company: str | None = None

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
    ได้รับนามบัตร:
    คุณสมชาย รักไทย
    บริษัท เทคโนโลยี จำกัด
    โทร: 081-234-5678
    Email: somchai@techco.th
    """,
    config={
        "response_mime_type": "application/json",
        "response_schema": ContactInfo
    }
)
```

### 2. Classification (การจัดหมวดหมู่อัตโนมัติ)

```python
class ContentClassification(BaseModel):
    category: str  # e.g., "technology", "sports", "politics"
    subcategory: str
    tags: List[str]
    is_breaking_news: bool
    language: str

# ใช้จัดหมวดหมู่บทความอัตโนมัติ
```

### 3. Data Transformation (การแปลงข้อมูล)

```python
class InvoiceData(BaseModel):
    invoice_number: str
    date: str
    customer_name: str
    items: List[dict]
    subtotal: float
    vat: float
    total: float

# แปลงใบแจ้งหนี้ PDF เป็น structured data (ข้อมูลมีโครงสร้าง)
```

### 4. Agentic Workflows (กระบวนการทำงานแบบ AI Agent)

```python
class NextAction(BaseModel):
    action: str  # "search_web", "call_api", "respond_to_user", "done"
    parameters: dict
    reasoning: str

# ให้ Gemini ตัดสินใจว่าควรทำอะไรต่อไปใน agentic flow (กระบวนการ AI ที่ตัดสินใจเอง)
```

---

## Tips & Best Practices

### 1. ใส่ description (คำอธิบาย) ที่ชัดเจน
```python
class Product(BaseModel):
    name: str = Field(description="ชื่อสินค้าภาษาไทย")
    price: float = Field(description="ราคาเป็นบาท ไม่รวม VAT")
    sku: str = Field(description="รหัสสินค้า เช่น SKU-12345")
```

### 2. ใช้ Optional สำหรับ field ที่อาจไม่มี
```python
from typing import Optional
class Person(BaseModel):
    name: str           # required (บังคับ)
    age: Optional[int]  # อาจไม่มีก็ได้
    email: str | None = None  # อีกวิธี
```

### 3. ใช้ enum สำหรับค่าที่จำกัด
```python
from enum import Enum
class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
```

### 4. ทดสอบด้วย edge cases (กรณีสุดโต่ง)
- ข้อมูล missing (ขาดหายไป)
- ข้อมูลขัดแย้งกัน
- ข้อมูลที่ไม่ชัดเจน

---

## Structured Output vs ขอ JSON ธรรมดา

| | Structured Output | ขอ JSON ใน Prompt |
|---|---|---|
| รับประกัน format (รูปแบบ) | ✓ เสมอ | ✗ บางครั้งผิด |
| Type validation (ตรวจสอบประเภทข้อมูล) | ✓ | ✗ |
| ต้อง parse | ✗ | ✓ อาจผิดพลาด |
| ตั้งค่า | ง่าย | ง่ายมาก |
| แนะนำสำหรับ production (ระบบจริง) | ✓ | ✗ |
