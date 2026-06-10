---
title: "ราคาและแผนการชำระเงิน"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "ตารางราคาทั้งหมดของ Perplexity API ครอบคลุม Agent API, Search API, Sonar API, Embeddings และตัวเลือกการชำระเงิน"
readTime: "6 นาที"
readers: "0"
locked: false
order: 13
---

# ราคาและแผนการชำระเงิน

Perplexity API ใช้ระบบ **Pay-as-you-go** (จ่ายตามที่ใช้จริง — ไม่มีค่าสมาชิกขั้นต่ำ) สามารถเริ่มใช้ได้ทันทีโดยไม่ต้องสมัคร Subscription (การสมัครสมาชิกรายเดือน)

---

## Agent API

### ราคาโมเดล (คิดตาม Token — หน่วยข้อความที่ AI ประมวลผล)

โมเดลทุกตัวเก็บเงิน **ราคาเดียวกับต้นทาง ไม่มี Markup** (ค่าบริการเพิ่ม)

**Perplexity Models:**
| โมเดล | Input (บาทป้อนเข้า) | Output (คำตอบออกมา) |
|---|---|---|
| sonar | $0.25 / 1M tokens | $2.50 / 1M tokens |

**Anthropic Models (Claude):**
| โมเดล | Input | Output |
|---|---|---|
| claude-opus-4-6 | $5.00 / 1M | $25.00 / 1M |
| claude-sonnet-4-6 | $3.00 / 1M | $15.00 / 1M |
| claude-haiku-4-6 | $1.00 / 1M | $5.00 / 1M |

**OpenAI Models (GPT-5):**
| โมเดล | Input | Output |
|---|---|---|
| gpt-5.5 | $5.00 / 1M | ตามราคา OpenAI |
| gpt-5.1-mini | $0.40 / 1M | ตามราคา OpenAI |
| gpt-5.0-nano | $0.20 / 1M | ตามราคา OpenAI |

**Google Models (Gemini 3):**
| โมเดล | Input |
|---|---|
| gemini-3-pro | $4.00 / 1M |
| gemini-3-flash | $0.25 / 1M |

**xAI Models (Grok):**
| โมเดล | Input | Output |
|---|---|---|
| grok-4.3 / grok-4.20 | $1.25 / 1M | $2.50 / 1M |

**NVIDIA:**
| โมเดล | Input | Output |
|---|---|---|
| nemotron-3-super | $0.25 / 1M | $2.50 / 1M |

---

### ราคา Tools ใน Agent API (คิดต่อการเรียกใช้)

| Tool | ราคา |
|---|---|
| web_search (ค้นหาเว็บ) | $0.005 ต่อครั้ง |
| fetch_url (ดึงเนื้อหาเว็บ) | $0.0005 ต่อครั้ง |
| people_search (ค้นหาบุคคล) | $0.005 ต่อครั้ง |
| finance_search (ค้นหาข้อมูลการเงิน) | $0.005 ต่อครั้ง |
| sandbox (สภาพแวดล้อมทดสอบโค้ด) | $0.03 ต่อ Session 20 นาที |

---

## Search API

ราคาคงที่ ง่ายต่อการวางแผน:

| | ราคา |
|---|---|
| ราคาต่อ Request | $5.00 ต่อ 1,000 Requests |
| ค่า Token เพิ่มเติม | ไม่มี |
| ค่า Subscription | ไม่มี |

**ตัวอย่างประมาณการ:**
- ค้นหา 500 ครั้ง/วัน × 30 วัน = 15,000 Requests = **$75/เดือน**
- ค้นหา 100 ครั้ง/วัน × 30 วัน = 3,000 Requests = **$15/เดือน**

---

## Sonar API

**Sonar API** (API ถามตอบด้วย AI ของ Perplexity พร้อมค้นหาเว็บ) มีราคาสองส่วน:

### ราคา Token

| โมเดล | Input | Output |
|---|---|---|
| sonar | $1 / 1M | $1 / 1M |
| sonar-pro | $3 / 1M | $15 / 1M |
| sonar-reasoning-pro | $2 / 1M | $8 / 1M |
| sonar-deep-research | $2 / 1M + ค่าพิเศษ | $8 / 1M |

### ราคาต่อ Request (Sonar Deep Research มีค่าพิเศษเพิ่มเติม)

| ส่วนประกอบ | ราคา |
|---|---|
| Citation tokens (Token แหล่งอ้างอิง) | $2 / 1M |
| Search queries (การค้นหาเพิ่มเติม) | $5 / 1M |
| Reasoning tokens (Token ที่ใช้ให้เหตุผล) | $3 / 1M |

### ค่า Request ตาม Context Size

| Context Size | Sonar | Sonar Pro |
|---|---|---|
| Low | $5 / 1,000 req | $14 / 1,000 req |
| Medium | $8 / 1,000 req | $18 / 1,000 req |
| High | $12 / 1,000 req | $22 / 1,000 req |

---

## Embeddings API

| โมเดล | ราคา |
|---|---|
| pplx-embed-v1-0.6b | $0.004 / 1M tokens |
| pplx-embed-v1-4b | $0.03 / 1M tokens |
| pplx-embed-context-v1-0.6b | $0.008 / 1M tokens |
| pplx-embed-context-v1-4b | $0.05 / 1M tokens |

**ตัวอย่าง:** สร้าง Embedding ให้กับเอกสาร 1 ล้านคำ (~1.3 ล้าน tokens) ด้วยโมเดล 0.6b = **$5.20**

---

## ตัวเลือกการชำระเงิน

### 1. Pay-as-you-go (จ่ายตามใช้)
- เติมเงินล่วงหน้าผ่าน console.perplexity.ai
- ไม่มีการ Subscribe รายเดือน
- เริ่มต้นได้ทันที

### 2. AWS Marketplace
- ชำระผ่าน AWS Billing Account เดียว
- เหมาะสำหรับองค์กรที่ใช้ AWS อยู่แล้ว
- อาจได้รับส่วนลด Enterprise

### 3. Enterprise (องค์กร)
- ติดต่อทีมขายของ Perplexity โดยตรง
- ราคา Custom (กำหนดเองตามปริมาณการใช้งาน)
- SLA (Service Level Agreement — สัญญาระดับการให้บริการ)
- การสนับสนุนพิเศษ

---

## เปรียบเทียบค่าใช้จ่ายจริง

### Scenario 1: Research Bot ขนาดเล็ก
- 1,000 คำถาม/เดือน ด้วย pro-search preset
- ใช้ gpt-5.1-mini: ~500 input tokens, ~300 output tokens/คำถาม
- 1,000 × (500×$0.0004 + 300×output + 3×$0.005 tools) ≈ **$20-40/เดือน**

### Scenario 2: ระบบค้นหาข่าว
- 10,000 Search requests/เดือน ด้วย Search API
- 10,000 × ($5/1,000) = **$50/เดือน**

### Scenario 3: RAG System
- Index เอกสาร 10 ล้าน tokens ด้วย Embeddings
- 10M × $0.004/1M = **$40 ค่า Indexing ครั้งเดียว**
- ค้นหา Query 100,000 ครั้ง/เดือน (100 tokens/query) = 10M tokens = **$40/เดือน**

---

## Tips ประหยัดค่าใช้จ่าย

1. **เลือก Preset ให้เหมาะกับงาน** — fast-search ถูกกว่า advanced-deep-research มาก
2. **ใช้โมเดลขนาดเล็กสำหรับงานง่าย** — gemini-3-flash หรือ gpt-5.0-nano สำหรับคำถามตรงๆ
3. **Cache คำตอบ** ที่ถามซ้ำบ่อยๆ
4. **ลด max_steps** สำหรับคำถามที่ไม่ต้องการการค้นหาลึก
5. **ใช้ search_context_size: "low"** ถ้าไม่ต้องการเนื้อหาละเอียด

---

## สรุปเปรียบเทียบ API

| API | โมเดลราคาต่ำสุด | เหมาะกับ |
|---|---|---|
| Agent API | $0.20/1M tokens | งานซับซ้อน หลายโมเดล |
| Search API | $5/1,000 req | ค้นหาดิบ ราคาคงที่ |
| Sonar API | $1/1M tokens | ถามตอบ + ค้นหาเว็บ |
| Embeddings API | $0.004/1M tokens | RAG, Semantic Search |
