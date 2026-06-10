---
title: "Agent API — สร้าง AI Agent"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "คู่มือ Agent API สำหรับสร้าง AI Agent ที่ค้นหาเว็บ ใช้โมเดลหลายผู้ให้บริการ และทำงานหลายขั้นตอนอัตโนมัติ"
readTime: "8 นาที"
readers: "0"
locked: false
order: 4
---

# Agent API — สร้าง AI Agent

**Agent API** คือหัวใจหลักของ Perplexity สำหรับนักพัฒนา เป็น API ที่ให้คุณสร้าง **AI Agent** (ตัวแทน AI — โปรแกรม AI ที่สามารถตัดสินใจและทำงานหลายขั้นตอนได้เอง) ที่ฉลาดกว่าการถามตอบธรรมดา

---

## Agent API คืออะไร?

Agent API เป็น **Multi-provider API** (API ที่รองรับโมเดลจากหลายผู้ให้บริการ) ที่รวบรวมโมเดล AI จาก:

- **Anthropic** — Claude Opus, Sonnet, Haiku
- **OpenAI** — GPT-5 family
- **Google** — Gemini 3 family
- **xAI** — Grok 4.x
- **NVIDIA** — Nemotron
- **Perplexity** — Sonar (โมเดลของ Perplexity เอง)

คุณไม่ต้องมี API Key ของแต่ละบริการ ใช้แค่ **Perplexity API Key เดียว** ก็เรียกโมเดลทั้งหมดได้ โดยจ่ายราคาเดียวกับต้นทาง ไม่มีค่าบริการเพิ่มเติม

---

## Endpoint (จุดเชื่อมต่อ)

```
POST https://api.perplexity.ai/v1/agent
```

หรือใช้ alias (ชื่อทางเลือก) สำหรับความเข้ากันได้กับ OpenAI SDK:
```
POST https://api.perplexity.ai/v1/responses
```

---

## ตัวอย่างการใช้งาน

### Python — ใช้ Preset สำเร็จรูป
```python
from perplexityai import Perplexity

client = Perplexity()

response = client.agent.create(
    preset="pro-search",  # Preset (ชุดการตั้งค่าสำเร็จรูป)
    input="สรุปข่าว AI ที่สำคัญในสัปดาห์นี้"
)

print(response.output_text)
# แสดงข้อความตอบ
print(response.citations)
# แสดงแหล่งอ้างอิงที่ใช้
```

### Python — ระบุโมเดลเอง
```python
response = client.agent.create(
    model="openai/gpt-5.1",  # ระบุโมเดลตรงๆ
    tools=[{"type": "web_search"}],  # เปิดใช้การค้นหาเว็บ
    input="เปรียบเทียบ Python vs JavaScript สำหรับ Backend",
    instructions="ตอบเป็นภาษาไทย ใช้หัวข้อและตารางประกอบ"
)
```

### TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const response = await client.agent.create({
  preset: "deep-research",
  input: "วิเคราะห์แนวโน้มตลาด EV ในประเทศไทยปี 2026",
});

console.log(response.output_text);
```

---

## Parameters หลัก (พารามิเตอร์ — ค่าที่ส่งเข้าไปเพื่อควบคุมการทำงาน)

| พารามิเตอร์ | ประเภท | คำอธิบาย |
|---|---|---|
| `preset` | string | ชุดการตั้งค่าสำเร็จรูป (แทน model+tools) |
| `model` | string | ชื่อโมเดล เช่น "openai/gpt-5.1" |
| `models` | array | รายการโมเดลสำรอง สำหรับ Fallback |
| `input` | string | คำถามหรือคำสั่งของผู้ใช้ |
| `instructions` | string | System Prompt (คำสั่งพื้นฐาน — กำหนดบทบาทและพฤติกรรมของ AI) |
| `tools` | array | เครื่องมือที่ให้ AI ใช้ได้ เช่น web_search |
| `max_steps` | integer | จำนวนขั้นตอนสูงสุดที่ AI ทำได้ |
| `stream` | boolean | เปิด Streaming (รับคำตอบทีละส่วน) |

---

## Tools ที่ Agent ใช้ได้

**Tools** (เครื่องมือ — ความสามารถพิเศษที่ให้ AI ใช้ระหว่างตอบคำถาม) ที่มีให้ใช้:

### web_search (ค้นหาเว็บ)
```python
tools=[{
    "type": "web_search",
    "search_context_size": "high",  # low / medium / high
    "recency_filter": "week",  # hour / day / week / month / year
    "search_domain_filter": ["site:thairath.co.th", "-site:gossip.com"]
}]
```

### fetch_url (ดึงเนื้อหาเว็บ)
```python
tools=[{"type": "fetch_url"}]  # ให้ AI อ่านเนื้อหาจาก URL ที่ระบุ
```

### finance_search (ค้นหาข้อมูลการเงิน)
```python
tools=[{"type": "finance_search"}]  # ราคาหุ้น กำไร นักวิเคราะห์
```

### people_search (ค้นหาข้อมูลบุคคล)
```python
tools=[{"type": "people_search"}]  # โปรไฟล์สาธารณะของบุคคล
```

---

## ราคา (Pricing)

Agent API คิดราคาแยกเป็นสองส่วน:

**1. ราคาโมเดล** — คิดตาม Token (หน่วยข้อความ) ที่ใช้ ราคาเท่ากับต้นทางทุกผู้ให้บริการ

**2. ราคา Tools** — คิดต่อครั้งที่เรียกใช้:
- `web_search` — $0.005 ต่อครั้ง
- `fetch_url` — $0.0005 ต่อครั้ง
- `people_search` — $0.005 ต่อครั้ง
- `finance_search` — $0.005 ต่อครั้ง
- `sandbox` — $0.03 ต่อ Session (20 นาที)

---

## ตรวจสอบค่าใช้จ่ายใน Response

Response จะมี `usage` field ที่แสดงข้อมูลค่าใช้จ่ายชัดเจน:

```json
{
  "output_text": "คำตอบของ AI...",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 800,
    "tool_calls": 3,
    "total_cost": 0.0085
  },
  "model": "openai/gpt-5.1"
}
```

---

## ความแตกต่างระหว่าง Agent API กับ API อื่นๆ

| | Agent API | Search API | Sonar API |
|---|---|---|---|
| โมเดล AI | หลายผู้ให้บริการ | ไม่มี | Sonar (Perplexity) |
| ค้นหาเว็บ | มี (เป็น Tool) | เป็นหลัก | มี (ในตัว) |
| ผลลัพธ์ | คำตอบสรุป | รายการลิงก์ดิบ | คำตอบสรุป |
| เหมาะกับ | งานซับซ้อน หลายขั้นตอน | ต้องการข้อมูลดิบ | ถามตอบทั่วไป |

---

## สรุป

Agent API คือ API ที่ทรงพลังที่สุดของ Perplexity เหมาะสำหรับ:
- สร้าง Research Assistant (ผู้ช่วยวิจัย) ที่ค้นหาและสรุปข้อมูลเอง
- สร้าง Chatbot ที่มีข้อมูลสด
- ทำงานวิเคราะห์หลายขั้นตอนโดยใช้โมเดล AI ที่ดีที่สุดในตลาด
- สร้าง Application ที่ต้องการความยืดหยุ่นในการเลือกโมเดล
