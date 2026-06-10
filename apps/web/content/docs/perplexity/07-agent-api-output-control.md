---
title: "Agent API — Output Control (ควบคุมผลลัพธ์)"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "วิธีควบคุมรูปแบบผลลัพธ์จาก Agent API ทั้ง Streaming, Structured Outputs, และ JSON Schema"
readTime: "7 นาที"
readers: "0"
locked: false
order: 7
---

# Agent API — Output Control (ควบคุมผลลัพธ์)

**Output Control** (การควบคุมผลลัพธ์) หมายถึงการกำหนดว่าต้องการรับ Response จาก Agent API ในรูปแบบใด — จะรับทีละนิดแบบ Real-time หรือรับเป็นโครงสร้าง JSON ที่เจาะจง

---

## วิธีที่ 1 — Streaming (การรับข้อมูลแบบสตรีม)

**Streaming** (สตรีมมิ่ง — การรับข้อมูลทีละส่วนขณะที่ AI กำลังสร้างคำตอบ) ช่วยให้ผู้ใช้เห็นคำตอบทีละประโยคแทนที่จะรอจนกว่าจะเสร็จ เหมาะสำหรับ Chat Interface หรือ Real-time Dashboard

### เปิด Streaming ด้วย Python
```python
from perplexityai import Perplexity

client = Perplexity()

# ตั้ง stream=True เพื่อรับข้อมูลแบบ Real-time
stream = client.agent.create(
    preset="pro-search",
    input="อธิบายการทำงานของ Neural Network แบบละเอียด",
    stream=True  # เปิด Streaming
)

# วนรับข้อมูลทีละส่วน
for event in stream:
    if event.type == "response.output_text.delta":
        # delta คือข้อความส่วนใหม่ที่เพิ่งสร้าง
        print(event.delta, end="", flush=True)
    elif event.type == "response.completed":
        # รับทั้งหมดแล้ว
        print("\n--- เสร็จสิ้น ---")
        print(f"ค่าใช้จ่าย: ${event.response.usage.total_cost}")
```

### เปิด Streaming ด้วย TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const stream = await client.agent.create({
  preset: "pro-search",
  input: "อธิบาย Quantum Computing",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);  // แสดงทีละส่วน
  }
}
```

---

## Event Types (ประเภทเหตุการณ์) ใน Streaming

| Event Type | ความหมาย |
|---|---|
| `response.output_text.delta` | ข้อความใหม่ที่ AI เพิ่งสร้าง (ทีละส่วน) |
| `response.output_text.done` | ข้อความทั้งหมดสร้างเสร็จแล้ว |
| `response.tool_call.delta` | AI กำลังเรียกใช้ Tool (เช่น กำลังค้นหาเว็บ) |
| `response.completed` | คำตอบทั้งหมดเสร็จสมบูรณ์ |
| `response.failed` | เกิดข้อผิดพลาด |

---

## วิธีที่ 2 — Structured Outputs (ผลลัพธ์มีโครงสร้าง)

**Structured Outputs** (ผลลัพธ์แบบมีโครงสร้าง — บังคับให้ AI ตอบในรูปแบบ JSON ที่กำหนดเอง) ใช้ JSON Schema (แบบแผนข้อมูล JSON) ระบุว่าต้องการข้อมูลในรูปแบบใด

### ตัวอย่าง: ดึงข้อมูลสินค้าเป็น JSON
```python
import json
from perplexityai import Perplexity

client = Perplexity()

# กำหนด Schema (โครงสร้าง) ของข้อมูลที่ต้องการ
product_schema = {
    "type": "object",
    "properties": {
        "product_name": {
            "type": "string",
            "description": "ชื่อสินค้า"
        },
        "price_thb": {
            "type": "number",
            "description": "ราคาในบาท"
        },
        "availability": {
            "type": "boolean",
            "description": "มีสินค้าในสต็อกหรือไม่"
        },
        "features": {
            "type": "array",
            "items": {"type": "string"},
            "description": "รายการคุณสมบัติ"
        }
    },
    "required": ["product_name", "price_thb", "availability"]
}

response = client.agent.create(
    preset="pro-search",
    input="หาข้อมูล iPhone 17 Pro Max ล่าสุด",
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "product_info",  # ชื่อต้องเป็น alphanumeric 1-64 ตัว
            "schema": product_schema
        }
    }
)

# แปลง JSON string เป็น Python dict
data = json.loads(response.output_text)
print(f"สินค้า: {data['product_name']}")
print(f"ราคา: {data['price_thb']} บาท")
```

---

## ตัวอย่าง Schema ที่ใช้บ่อย

### Schema สำหรับวิเคราะห์บทความข่าว
```python
news_schema = {
    "type": "object",
    "properties": {
        "headline": {"type": "string"},
        "summary": {"type": "string"},
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"]  # enum คือค่าที่อนุญาต
        },
        "key_points": {
            "type": "array",
            "items": {"type": "string"},
            "maxItems": 5
        },
        "sources_count": {"type": "integer"}
    }
}
```

### Schema สำหรับเปรียบเทียบสินค้า
```python
comparison_schema = {
    "type": "object",
    "properties": {
        "products": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "pros": {"type": "array", "items": {"type": "string"}},
                    "cons": {"type": "array", "items": {"type": "string"}},
                    "price_range": {"type": "string"},
                    "rating": {"type": "number", "minimum": 0, "maximum": 5}
                }
            }
        },
        "recommendation": {"type": "string"}
    }
}
```

---

## ข้อควรระวังกับ Structured Outputs

### Schema ใหม่ใช้เวลา 10-30 วินาที
ครั้งแรกที่ใช้ Schema ใหม่ ระบบต้องเตรียม Schema ก่อน อาจใช้เวลา 10-30 วินาที ครั้งต่อไปจะเร็วกว่า

### อย่าขอ URLs ใน JSON Response
```python
# ไม่แนะนำ — อาจได้ลิงก์ที่ไม่ถูกต้อง
schema_with_urls = {
    "properties": {
        "source_url": {"type": "string"}  # หลีกเลี่ยงการขอ URL ใน Schema
    }
}

# แนะนำ — ใช้ citations จาก API response แทน
print(response.citations)  # ลิงก์ที่ถูกต้องและตรวจสอบได้
```

### เพิ่ม Hint ใน Prompt
```python
response = client.agent.create(
    preset="pro-search",
    input="""ค้นหาและสรุปข้อมูลบริษัท Tesla
    กรุณาตอบเป็น JSON object มี fields: company_name, founded_year, ceo, main_products (array), market_cap_usd""",
    response_format={
        "type": "json_schema",
        "json_schema": {"name": "company_info", "schema": company_schema}
    }
)
```

---

## เมื่อไหรควรใช้ Streaming vs Structured Outputs?

| สถานการณ์ | แนะนำ |
|---|---|
| Chat Interface แสดงคำตอบทีละประโยค | Streaming |
| Dashboard แสดงสถานะ Real-time | Streaming |
| เก็บข้อมูลลง Database | Structured Outputs |
| ส่งข้อมูลให้ระบบอื่นประมวลผล | Structured Outputs |
| รายงานที่ต้องการ Format เจาะจง | Structured Outputs |
| ถามตอบทั่วไปไม่ต้องการ Format พิเศษ | ไม่ต้องใช้ทั้งสอง |

---

## สรุป

- **Streaming** — ใช้เมื่อต้องการแสดงคำตอบ Real-time ทีละส่วน ตั้งด้วย `stream=True`
- **Structured Outputs** — ใช้เมื่อต้องการ JSON ที่มีโครงสร้างแน่นอน ตั้งด้วย `response_format`
- ใช้ `citations` จาก Response แทนการขอ URL ใน Schema
- Schema ใหม่ใช้เวลาเตรียม 10-30 วินาทีในครั้งแรก
