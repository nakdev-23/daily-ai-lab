---
title: "ราคาและ Rate Limits — ทำความเข้าใจค่าใช้จ่ายและข้อจำกัด"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "ราคา Claude API แบบครบถ้วน ทั้ง input/output tokens, prompt caching, batch API, ค่าใช้จ่าย tools ต่างๆ และวิธี optimize ต้นทุน"
readTime: "10 นาที"
readers: "0"
locked: false
order: 13
---

## ภาพรวมการคิดราคา

Claude API (ช่องทางเชื่อมต่อระหว่างโปรแกรม — เหมือนสะพานที่ให้แอพต่างๆ คุยกัน) คิดค่าบริการตาม **token** (ชิ้นส่วนข้อความ — ประมาณ 1 คำหรือ 3-4 ตัวอักษร) ที่ใช้ โดยแยกเป็น:
- **Input tokens** — ข้อความที่คุณส่งให้ Claude (prompt + context)
- **Output tokens** — ข้อความที่ Claude ตอบกลับ

**MTok = Million Tokens** (1,000,000 tokens — ชิ้นส่วนข้อความ 1 ล้านชิ้น)

---

## ราคาโมเดล (ณ มิถุนายน 2026)

### โมเดลปัจจุบัน

| โมเดล | Input | Output |
|-------|-------|--------|
| **Claude Fable 5** | $10 / MTok | $50 / MTok |
| **Claude Mythos 5** | $10 / MTok | $50 / MTok |
| **Claude Opus 4.8** | $5 / MTok | $25 / MTok |
| **Claude Opus 4.7** | $5 / MTok | $25 / MTok |
| **Claude Opus 4.6** | $5 / MTok | $25 / MTok |
| **Claude Sonnet 4.6** | $3 / MTok | $15 / MTok |
| **Claude Haiku 4.5** | $1 / MTok | $5 / MTok |

> สำหรับราคาล่าสุดให้ตรวจสอบที่ [claude.com/pricing](https://claude.com/pricing)

---

## Prompt Caching — ลดต้นทุนสำหรับ Prompt ซ้ำๆ

Prompt caching (การจำ prompt ไว้ใช้ซ้ำ — เมื่อส่ง system prompt หรือเอกสารเดิมซ้ำ ระบบดึงจาก cache แทนการประมวลผลใหม่ ทำให้ถูกกว่ามาก) ช่วยประหยัดเงินเมื่อใช้ system prompt (คำสั่งตั้งต้นให้ AI), เอกสาร หรือ context (บริบท) เดิมซ้ำๆ

### วิธีทำงาน

1. ส่ง request แรกพร้อม `cache_control` → ข้อมูลถูก cache
2. Request ถัดไปที่ใช้ context เดิม → อ่านจาก cache ราคาถูกกว่ามาก

### ตารางราคา Caching

| Operation | Multiplier | ระยะเวลา Cache |
|-----------|------------|----------------|
| Cache write (5 นาที) | 1.25x input | 5 นาที |
| Cache write (1 ชั่วโมง) | 2.0x input | 1 ชั่วโมง |
| Cache read (hit — อ่านจาก cache สำเร็จ) | 0.1x input | ตามที่ตั้งไว้ |

**ตัวอย่าง (Claude Sonnet 4.6 ที่ $3/MTok):**
- ไม่ cache: $3.00 ต่อ 1M input tokens
- Cache write (5 min): $3.75 ต่อ 1M tokens
- Cache read: **$0.30 ต่อ 1M tokens** (ประหยัด 90%!)

### คุ้มค่าหลังจาก

- Cache 5 นาที: คุ้มค่าหลังจาก **cache read ครั้งที่ 2**
- Cache 1 ชั่วโมง: คุ้มค่าหลังจาก **cache read ครั้งที่ 3**

### วิธีใช้งาน

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "คุณคือ AI assistant ที่ช่วยวิเคราะห์เอกสาร...",
        },
        {
            "type": "text",
            "text": "{{LARGE_DOCUMENT_CONTENT}}",  # เนื้อหายาวๆ ที่ใช้ซ้ำ
            "cache_control": {"type": "ephemeral"}  # cache นี้
        }
    ],
    messages=[{"role": "user", "content": "สรุปประเด็นหลัก"}]
)
```

---

## Batch API — ส่วนลด 50% สำหรับงาน Async

Batch API (การประมวลผลเป็นชุด — ส่ง request หลายร้อยหรือหลายพันรายการพร้อมกัน แล้วรอผลทีหลัง) เหมาะสำหรับงานที่ไม่ต้องการ real-time response (การตอบกลับทันที)

### ราคา Batch API

| โมเดล | Batch Input | Batch Output |
|-------|------------|--------------|
| Claude Opus 4.8 | $2.50 / MTok | $12.50 / MTok |
| Claude Sonnet 4.6 | $1.50 / MTok | $7.50 / MTok |
| Claude Haiku 4.5 | $0.50 / MTok | $2.50 / MTok |

### เหมาะกับงานประเภท

- Classification (การจำแนกหมวดหมู่) ข้อมูลขนาดใหญ่
- Sentiment analysis (การวิเคราะห์ความรู้สึก — บวก/ลบ/กลาง จากข้อความ)
- Data extraction (การดึงข้อมูล) จากเอกสารจำนวนมาก
- Evaluation/testing ขนาดใหญ่
- Content generation (การสร้างเนื้อหา) ที่ไม่ด่วน

---

## ราคา Feature พิเศษ

### Web Search Tool

- **$10 ต่อ 1,000 searches** + standard token costs
- 1 search = 1 ครั้งที่ tool ถูกเรียก ไม่ว่าจะได้ผลกี่ results

### Code Execution Tool

- **ฟรี** เมื่อใช้ร่วมกับ web_search หรือ web_fetch
- เมื่อใช้คนเดียว: $0.05 ต่อ container-hour (ชั่วโมงที่ระบบทำงาน)
- ทุก organization ได้ **1,550 ชั่วโมงฟรีต่อเดือน**

### Fast Mode (Research Preview)

สำหรับ Claude Opus รุ่น 4.6+:

| โมเดล | Fast Mode Input | Fast Mode Output |
|-------|----------------|-----------------|
| Opus 4.6 / 4.7 | $30 / MTok | $150 / MTok |
| Opus 4.8 | $10 / MTok | $50 / MTok |

### Computer Use Tool

- ค่า system prompt overhead (ต้นทุนที่เพิ่มจาก system prompt ที่ Anthropic เพิ่มให้): **466-499 tokens**
- ค่า tool definition (คำอธิบาย tool): **735 tokens** (Claude 4.x)
- ภาพ screenshot แต่ละรูป = input tokens

---

## Context Window และ Pricing

โมเดลที่มี 1M token context window (หน่วยความจำชั่วคราวขนาด 1 ล้าน token เช่น Opus 4.8, Sonnet 4.6, Fable 5) คิดราคา **standard rate ตลอด** ไม่มีค่า premium สำหรับ context ขนาดใหญ่

ตัวอย่าง: request ที่มี 900k tokens คิดราคาเดียวกันกับ 9k tokens (per-token — ต่อ token)

---

## Claude Managed Agents Pricing

สำหรับ Managed Agents (beta — เวอร์ชันทดสอบ) มีค่าใช้จ่าย 2 ส่วน:

| รายการ | ราคา |
|--------|------|
| Token usage | ราคา standard ตามโมเดล |
| Session runtime (เวลาที่ระบบทำงาน) | $0.08 ต่อ session-hour |

**ตัวอย่างการคำนวณ (Opus 4.8, 1 ชั่วโมง):**
- Input: 50,000 tokens × $5/MTok = **$0.25**
- Output: 15,000 tokens × $25/MTok = **$0.375**
- Runtime: 1 hour × $0.08 = **$0.08**
- **รวม: $0.705**

---

## Rate Limits

Rate limits (ขีดจำกัดอัตราการใช้งาน — กำหนดว่าเรียก API ได้มากแค่ไหนในช่วงเวลาหนึ่ง) กำหนดตาม **Usage Tier** (ระดับการใช้งาน) ซึ่งเพิ่มขึ้นตามการใช้งานและการ verify ของ account

### Tier ระดับต่างๆ

| Tier | คำอธิบาย |
|------|---------|
| Tier 1 | เริ่มต้น ขีดจำกัดพื้นฐาน |
| Tier 2 | สำหรับแอปที่กำลังเติบโต |
| Tier 3 | สำหรับแอปที่มั่นคงแล้ว |
| Tier 4 | ขีดจำกัดมาตรฐานสูงสุด |
| Enterprise | กำหนดเองตามความต้องการ |

### ประเภทของ Rate Limits

- **Requests Per Minute (RPM)** — จำนวน API calls ต่อนาที
- **Tokens Per Minute (TPM)** — จำนวน tokens ทั้งหมดต่อนาที
- **Tokens Per Day (TPD)** — จำนวน tokens ทั้งหมดต่อวัน

สำหรับข้อมูล limits ที่แน่นอนแต่ละ tier ดูได้ที่ [claude.com](https://docs.anthropic.com/en/api/rate-limits)

---

## การจัดการ Rate Limit Errors

เมื่อเกิน rate limit จะได้รับ HTTP 429 error ควรใช้ **exponential backoff** (การรอเพิ่มขึ้นแบบทวีคูณ — รอ 1, 2, 4, 8 วินาทีตามลำดับ เพื่อไม่ให้ยิง API ซ้ำถี่เกินไป):

```python
import anthropic
import time

client = anthropic.Anthropic()

def call_with_retry(messages, max_retries=5):
    for attempt in range(max_retries):
        try:
            return client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=messages
            )
        except anthropic.RateLimitError as e:
            if attempt == max_retries - 1:
                raise e
            wait_time = (2 ** attempt) * 1  # 1, 2, 4, 8, 16 วินาที
            print(f"Rate limited. Waiting {wait_time} seconds...")
            time.sleep(wait_time)
```

---

## Strategies การ Optimize ต้นทุน

### 1. เลือกโมเดลให้เหมาะกับงาน

```
งาน → โมเดลแนะนำ → ประหยัดเทียบ Opus 4.8

Classification / extraction → Haiku 4.5 → ประหยัด 80%
Production chatbot → Sonnet 4.6 → ประหยัด 40%
Complex reasoning (การวิเคราะห์ซับซ้อน) → Opus 4.8 → baseline
```

### 2. ใช้ Prompt Caching

สำหรับ system prompt ยาวๆ หรือเอกสารที่ใช้ซ้ำ อาจประหยัดได้ 60-90%

### 3. ใช้ Batch API

สำหรับงาน non-real-time (ไม่ต้องการผลทันที) ประหยัดทันที 50%

### 4. Truncate Context (ตัดบริบทที่ไม่จำเป็นออก)

ลด context ที่ไม่จำเป็นออก เช่น history การสนทนาที่เก่ามาก

### 5. Output Length Control (ควบคุมความยาวของคำตอบ)

บอก Claude ให้ตอบสั้นเมื่อไม่จำเป็นต้องละเอียด

```
"ตอบสั้นๆ ไม่เกิน 3 ประโยค"
"ให้แค่ keyword หลัก ไม่ต้องอธิบาย"
```

### 6. Structured Output แทน Free Text

ใช้ JSON (รูปแบบข้อมูลกระชับ) output เพื่อลด verbose (คำฟุ่มเฟือย) ใน response

---

## การ Monitor การใช้งาน

ดู usage และค่าใช้จ่ายได้ที่ [Claude Console](https://console.anthropic.com/settings/limits)

ทุก API response มี `usage` object (ข้อมูลสรุปการใช้ token):

```json
{
  "usage": {
    "input_tokens": 1523,
    "output_tokens": 289,
    "cache_creation_input_tokens": 1200,
    "cache_read_input_tokens": 323
  }
}
```

---

## ตัวอย่างการคำนวณต้นทุน

### Use Case: Customer Support Bot

สมมติ: 10,000 tickets/เดือน, เฉลี่ย 3,700 tokens/บทสนทนา

| โมเดล | Input Cost | Output Cost | รวม |
|-------|-----------|-------------|-----|
| Haiku 4.5 | ~$37 | เล็กน้อย | **~$37** |
| Sonnet 4.6 | ~$111 | เพิ่มขึ้น | **~$150** |
| Opus 4.8 | ~$185 | สูงสุด | **~$350** |

### Use Case: Document Analysis

สมมติ: วิเคราะห์รายงาน 100 หน้า (≈150,000 tokens) ต่อครั้ง

- ไม่ cache: $0.75 ต่อ request (Haiku)
- Cache hit ครั้งที่ 2+: $0.015 ต่อ request (ประหยัด 98%!)

---

## สรุป

| กลยุทธ์ | ประหยัดได้ | เหมาะกับ |
|--------|----------|---------|
| เลือก Haiku แทน Opus | 80% | งานง่ายๆ |
| Batch API | 50% | งาน non-realtime |
| Prompt Caching | 60-90% | Context ซ้ำๆ |
| Truncate Context | ตามสัดส่วน | Long conversations |
| Output Control | 10-50% | ทุกงาน |

วิธีที่ดีที่สุดคือเริ่มด้วย Haiku ก่อน แล้วอัปเกรดเฉพาะงานที่ต้องการคุณภาพสูงขึ้น ใช้ Prompt Caching สำหรับ context ที่ซ้ำ และ Batch API สำหรับงาน non-realtime
