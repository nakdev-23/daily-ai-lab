---
title: "Agent API — โมเดลและ Model Fallback"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "รายชื่อโมเดลทั้งหมดใน Agent API จากทุกผู้ให้บริการ และวิธีตั้งค่า Model Fallback เพื่อให้ระบบทำงานได้ต่อเนื่อง"
readTime: "7 นาที"
readers: "0"
locked: false
order: 6
---

# Agent API — โมเดลและ Model Fallback

Agent API ของ Perplexity รองรับโมเดล AI จากผู้ให้บริการชั้นนำหลายราย โดยคิดราคาตามต้นทางของแต่ละโมเดลโดยไม่มีค่าบริการเพิ่มเติม นอกจากนี้ยังมีระบบ **Model Fallback** (การสำรองโมเดล — เปลี่ยนโมเดลสำรองอัตโนมัติเมื่อโมเดลหลักไม่พร้อมใช้งาน) เพื่อให้ระบบทำงานได้ต่อเนื่อง

---

## รายชื่อโมเดลที่รองรับ

### Perplexity (โมเดลของตัวเอง)

| โมเดล | จุดเด่น | ราคา Input | ราคา Output |
|---|---|---|---|
| sonar | โมเดลค้นหาของ Perplexity รองรับ Web Search ในตัว | $0.25/1M tokens | $2.50/1M tokens |

### Anthropic — Claude Family

| โมเดล | จุดเด่น | ราคา Input | ราคา Output |
|---|---|---|---|
| anthropic/claude-opus-4-6 | ความสามารถสูงสุด วิเคราะห์ซับซ้อนได้ดี | $5/1M | $25/1M |
| anthropic/claude-sonnet-4-6 | สมดุลระหว่างความสามารถและความเร็ว | $3/1M | $15/1M |
| anthropic/claude-haiku-4-6 | เร็วที่สุด ราคาถูกที่สุด | $1/1M | $5/1M |

### OpenAI — GPT-5 Family

| โมเดล | จุดเด่น | ราคา Input | ราคา Output |
|---|---|---|---|
| openai/gpt-5.5 | Flagship (หลัก) ความสามารถสูงสุดของ OpenAI | $5/1M | - |
| openai/gpt-5.1-mini | Mini (ขนาดกลาง) ความสามารถดีราคาประหยัด | $0.40/1M | - |
| openai/gpt-5.0-nano | Nano (ขนาดเล็ก) เร็วมากราคาถูกมาก | $0.20/1M | - |

### Google — Gemini 3 Family

| โมเดล | จุดเด่น | ราคา Input |
|---|---|---|
| google/gemini-3-pro | Long-context (บริบทยาว) ดีที่สุดสำหรับเอกสารยาว | $4/1M |
| google/gemini-3-flash | ความเร็วสูง เหมาะกับ Real-time | $0.25/1M |
| google/gemini-3-flash-preview | Preview (ทดสอบ) เวอร์ชันใหม่ล่าสุด | $0.25/1M |

### xAI — Grok Family

| โมเดล | จุดเด่น | ราคา Input | ราคา Output |
|---|---|---|---|
| xai/grok-4.3 | รองรับ Reasoning (การให้เหตุผล) และ Multi-agent | $1.25/1M | $2.50/1M |
| xai/grok-4.20 | เวอร์ชันเสถียรพร้อมความสามารถ Multi-agent | $1.25/1M | $2.50/1M |

### NVIDIA

| โมเดล | จุดเด่น | ราคา Input | ราคา Output |
|---|---|---|---|
| nvidia/nemotron-3-super | Open-weight (น้ำหนักเปิด — โมเดลที่เปิดเผยพารามิเตอร์) รองรับ Reasoning | $0.25/1M | $2.50/1M |

---

## ระบุโมเดลใน Code

```python
from perplexityai import Perplexity

client = Perplexity()

# ระบุโมเดลเดี่ยว
response = client.agent.create(
    model="anthropic/claude-sonnet-4-6",
    input="อธิบายการทำงานของ Quantum Computing"
)

# ดู GET /v1/models เพื่อรายชื่อโมเดลล่าสุด
```

---

## Model Fallback — ระบบสำรองโมเดล

**Model Fallback** คือฟีเจอร์ที่ช่วยให้แอปของคุณทำงานต่อเนื่องแม้โมเดลหลักจะไม่พร้อม โดยระบบจะลอง**โมเดลตัวถัดไปในลำดับ**โดยอัตโนมัติ

### วิธีใช้ Model Fallback

แทนที่จะใช้ `model` (ตัวเดียว) ใช้ `models` (array — รายการ) แทน:

```python
response = client.agent.create(
    models=[
        "openai/gpt-5.5",          # ลองตัวนี้ก่อน
        "anthropic/claude-opus-4-6",  # ถ้าตัวแรกไม่ได้ ลองตัวนี้
        "xai/grok-4.3",            # ถ้าตัวที่สองไม่ได้ ลองตัวนี้
        "sonar"                     # สำรองสุดท้าย
    ],
    input="วิเคราะห์ข้อมูลนี้..."
)

# ดูว่าโมเดลไหนถูกใช้จริงๆ
print(response.model)  # เช่น "anthropic/claude-opus-4-6"
```

### TypeScript
```typescript
const response = await client.agent.create({
  models: [
    "openai/gpt-5.5",
    "anthropic/claude-opus-4-6",
    "xai/grok-4.3",
  ],
  input: "คำถามของฉัน",
});

console.log(`ใช้โมเดล: ${response.model}`);
```

---

## กฎการใช้ `models` array

1. **ลำดับสำคัญ** — ระบบลองจาก Index 0 ไปเรื่อยๆ จนกว่าจะสำเร็จ
2. **สูงสุด 5 โมเดล** — ใส่ได้ไม่เกิน 5 ตัวใน array
3. **`models` แทน `model`** — ถ้าใส่ทั้งคู่ ระบบจะใช้ `models` เสมอ
4. **เก็บเงินตามโมเดลจริง** — จ่ายราคาของโมเดลที่ตอบสำเร็จ ไม่ใช่โมเดลทั้งหมด

---

## แนวทางการเลือกลำดับ Fallback

### เน้นความสามารถ → ค่าใช้จ่าย
```python
models=[
    "anthropic/claude-opus-4-6",  # ดีที่สุด แพงที่สุด
    "openai/gpt-5.5",
    "anthropic/claude-sonnet-4-6",
    "openai/gpt-5.1-mini",        # ถูกที่สุด
]
```

### เน้นความเร็ว → คุณภาพ
```python
models=[
    "google/gemini-3-flash",  # เร็วที่สุด
    "openai/gpt-5.1-mini",
    "openai/gpt-5.5",         # ช้าแต่ดีที่สุด
]
```

### เน้นผู้ให้บริการหลากหลาย (ความพร้อมสูงสุด)
```python
models=[
    "openai/gpt-5.5",              # OpenAI
    "anthropic/claude-sonnet-4-6", # Anthropic
    "google/gemini-3-flash",       # Google
    "xai/grok-4.3",               # xAI
]
```

---

## ดูรายชื่อโมเดลล่าสุด (GET /v1/models)

Endpoint ใหม่ (เมษายน 2026) ที่ให้ดูรายชื่อโมเดลที่มีอยู่ในรูปแบบ OpenAI-compatible:

```bash
curl https://api.perplexity.ai/v1/models \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY"
```

Response จะเป็น JSON รายชื่อโมเดลทั้งหมดที่ใช้ได้ในขณะนั้น

---

## สรุปจุดสำคัญ

- Agent API รองรับโมเดลจาก Perplexity, Anthropic, OpenAI, Google, xAI, NVIDIA
- ราคาตามต้นทาง ไม่มีค่าบริการเพิ่ม
- ใช้ `models` array เพื่อตั้ง Fallback Chain สูงสุด 5 โมเดล
- เก็บเงินตามโมเดลที่ใช้จริงเท่านั้น
- Response บอกว่าใช้โมเดลไหนใน field `model`
