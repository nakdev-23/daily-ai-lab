---
title: "Structured Outputs — รับผลลัพธ์เป็น JSON ที่กำหนดโครงสร้างเอง"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Structured Outputs บังคับให้ Grok ตอบในรูปแบบ JSON ที่คุณกำหนด ทำให้นำข้อมูลไปใช้ต่อในโค้ดได้โดยตรงโดยไม่ต้อง parse ข้อความเอง"
readTime: "6 นาที"
readers: "0"
locked: false
order: 15
---
# Structured Outputs — รับผลลัพธ์เป็น JSON ที่กำหนดโครงสร้างเอง

> อ้างอิง: [Structured Outputs](https://docs.x.ai/docs) | [JSON Schema Reference](https://json-schema.org/)

---

## Structured Outputs คืออะไร?

ปกติ Grok ตอบเป็นข้อความธรรมดา แต่เมื่อเปิด **Structured Outputs** (ผลลัพธ์ที่มีโครงสร้างชัดเจน) Grok จะ **รับประกันว่าคำตอบจะเป็น JSON (รูปแบบข้อมูลมาตรฐานที่โปรแกรมอ่านได้ง่าย — เขียนด้วยวงเล็บปีกกา `{}`) ที่ตรงตาม Schema (แบบแผนโครงสร้างข้อมูล — กำหนดว่ามี field อะไรบ้าง) ที่คุณกำหนดไว้ทุกครั้ง**

### ทำไมต้องใช้?

- **ดึงข้อมูลจากข้อความ** — แยก entities (ชื่อ สิ่งของ สถานที่ที่ปรากฏในข้อความ), วันที่, ราคา, ชื่อ จากเอกสาร
- **สร้าง structured data** — แปลงข้อความธรรมดาเป็น JSON สำหรับ Database (ฐานข้อมูล)
- **API integration** — รับข้อมูลที่พร้อมนำไปใช้กับ API (ช่องทางเชื่อมต่อระหว่างโปรแกรม) อื่นทันที
- **Validation** (การตรวจสอบความถูกต้อง) — มั่นใจว่าคำตอบมีทุก field ที่ต้องการ

---

## 2 วิธีใช้งาน

### วิธีที่ 1: `response_format` (แนะนำ)

ระบุ JSON Schema โดยตรง:

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "ข้อมูลพนักงาน: สมชาย อายุ 32 ปี แผนก IT เงินเดือน 50,000 บาท"
    }],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "employee_info",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"},
                    "department": {"type": "string"},
                    "salary": {"type": "number"},
                },
                "required": ["name", "age", "department", "salary"],
            },
        },
    },
)

import json
data = json.loads(response.output_text)
print(data)
# {"name": "สมชาย", "age": 32, "department": "IT", "salary": 50000}
```

### วิธีที่ 2: Pydantic Models (Python — แนะนำมาก)

**Pydantic** (ไลบรารี Python สำหรับกำหนดโครงสร้างข้อมูลและตรวจสอบค่าอัตโนมัติ) ทำให้ Type-safe (มั่นใจชนิดข้อมูลถูกต้อง) และไม่ต้องเขียน Schema เอง:

```python
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# กำหนด Schema ด้วย Pydantic
class Product(BaseModel):
    name: str
    price: float
    currency: str
    in_stock: bool
    description: Optional[str] = None

# parse() จะส่งคืน Pydantic object โดยตรง
response = client.responses.parse(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "สินค้า: MacBook Pro M3 ราคา 79,900 บาท มีในสต็อก"
    }],
    text_format=Product,
)

product = response.output_parsed
print(f"สินค้า: {product.name}")
print(f"ราคา: {product.price:,.0f} {product.currency}")
print(f"มีสต็อก: {'ใช่' if product.in_stock else 'ไม่'}")
```

---

## ตัวอย่างการใช้งานจริง

### ดึงข้อมูลใบแจ้งหนี้ (Invoice Parsing)

**Invoice Parsing** (การแยกข้อมูลจากใบแจ้งหนี้อัตโนมัติ):

```python
from pydantic import BaseModel
from typing import List
from datetime import date

class LineItem(BaseModel):
    description: str
    quantity: int
    unit_price: float
    total: float

class Invoice(BaseModel):
    invoice_number: str
    vendor_name: str
    invoice_date: date
    due_date: date
    line_items: List[LineItem]
    subtotal: float
    tax: float
    total_amount: float
    currency: str

invoice_text = """
ใบแจ้งหนี้ #INV-2024-001
จาก: บริษัท ABC จำกัด
วันที่: 15 มกราคม 2025
กำหนดชำระ: 15 กุมภาพันธ์ 2025

รายการ:
1. บริการออกแบบเว็บไซต์ 1 รายการ ราคา 30,000 บาท
2. โปรแกรม CRM License 5 ใบอนุญาต ราคาใบละ 2,000 บาท รวม 10,000 บาท

รวมก่อนภาษี: 40,000 บาท
ภาษีมูลค่าเพิ่ม 7%: 2,800 บาท
รวมทั้งสิ้น: 42,800 บาท
"""

response = client.responses.parse(
    model="grok-4.3",
    input=[{"role": "user", "content": f"แปลงข้อมูลใบแจ้งหนี้นี้เป็น JSON:\n\n{invoice_text}"}],
    text_format=Invoice,
)

invoice = response.output_parsed
print(f"ใบแจ้งหนี้: {invoice.invoice_number}")
print(f"ยอดรวม: {invoice.total_amount:,.0f} {invoice.currency}")
for item in invoice.line_items:
    print(f"  - {item.description}: {item.total:,.0f}")
```

### วิเคราะห์ Sentiment หลายมิติ

**Sentiment** (ความรู้สึกหรืออารมณ์ที่ซ่อนอยู่ในข้อความ — บวก ลบ หรือกลาง):

```python
from pydantic import BaseModel
from enum import Enum
from typing import List

class SentimentLevel(str, Enum):
    VERY_POSITIVE = "very_positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"

class ReviewAnalysis(BaseModel):
    overall_sentiment: SentimentLevel
    score: float  # 0.0 - 10.0
    positive_aspects: List[str]
    negative_aspects: List[str]
    key_topics: List[str]
    recommendation: bool

review = "ร้านนี้อาหารอร่อยมาก โดยเฉพาะต้มยำกุ้ง แต่บริการค่อนข้างช้า ต้องรอนานกว่า 30 นาที บรรยากาศดี ราคาสมเหตุสมผล แนะนำให้ลองมาทาน"

result = client.responses.parse(
    model="grok-4.3",
    input=[{"role": "user", "content": f"วิเคราะห์รีวิวนี้:\n\n{review}"}],
    text_format=ReviewAnalysis,
)

analysis = result.output_parsed
print(f"Sentiment: {analysis.overall_sentiment.value}")
print(f"คะแนน: {analysis.score}/10")
print(f"แนะนำ: {'ใช่' if analysis.recommendation else 'ไม่'}")
```

---

## JavaScript — Zod Schema

**Zod** (ไลบรารี JavaScript/TypeScript สำหรับกำหนดและตรวจสอบโครงสร้างข้อมูล — คล้าย Pydantic ของ Python):

```typescript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

// กำหนด Schema ด้วย Zod
const PersonSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  occupation: z.string(),
  skills: z.array(z.string()),
});

type Person = z.infer<typeof PersonSchema>;

async function extractPerson(text: string): Promise<Person> {
  const response = await client.beta.chat.completions.parse({
    model: "grok-4.3",
    messages: [
      { role: "user", content: `ดึงข้อมูลบุคคลจากข้อความนี้: ${text}` },
    ],
    response_format: zodResponseFormat(PersonSchema, "person"),
  });

  return response.choices[0].message.parsed!;
}

const person = await extractPerson(
  "นายสมศักดิ์ อายุ 28 ปี ทำงานเป็น Software Engineer ชอบ Python, TypeScript และ Go"
);
console.log(person);
```

---

## JSON Schema Types ที่รองรับ

| Type | ตัวอย่าง |
|---|---|
| `string` | ข้อความทั่วไป |
| `number` | ตัวเลขทศนิยม |
| `integer` | จำนวนเต็ม |
| `boolean` | `true` / `false` |
| `null` | ค่าว่าง |
| `array` | รายการ `[...]` |
| `object` | Object `{...}` |
| `enum` | ค่าที่กำหนดไว้ เช่น `["low", "medium", "high"]` |
| `anyOf` | หนึ่งในหลาย type |

### String Formats ที่ Enforce (บังคับให้ตรงตามรูปแบบ) ได้

| Format | ตัวอย่าง |
|---|---|
| `date` | `"2025-01-15"` |
| `time` | `"14:30:00"` |
| `date-time` | `"2025-01-15T14:30:00Z"` |
| `email` | `"user@example.com"` |
| `uuid` | `"550e8400-e29b-41d4..."` |
| `uri` | `"https://example.com"` |

---

## ข้อควรระวัง

- **ต้องระบุ `required` fields** — ถ้าไม่ใส่ Grok อาจไม่รวม field นั้น
- **Nested objects** (ออบเจกต์ซ้อนกัน) ใช้งานได้ แต่อย่าซับซ้อนเกินไป
- **Array size limit** (ขีดจำกัดขนาดรายการ) — รับประกันถึง 256 รายการ
- **String length** — รับประกัน maxLength ถึง 2,048 ตัวอักษร
- **`not` / `if-then-else`** — รองรับแต่ไม่รับประกัน 100%
- ถ้า Schema ไม่ถูกต้อง API จะส่ง HTTP `400` กลับมา
