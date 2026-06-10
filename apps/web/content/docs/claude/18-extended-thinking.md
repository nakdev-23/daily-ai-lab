---
title: "Extended Thinking และ Adaptive Thinking — Claude คิดลึกขึ้น"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Extended Thinking ให้ Claude แสดงขั้นตอนการวิเคราะห์ภายใน ส่วน Adaptive Thinking ให้โมเดลตัดสินใจเองว่าต้องคิดมากแค่ไหน เหมาะกับงาน reasoning ซับซ้อน"
readTime: "10 นาที"
readers: "0"
locked: false
order: 18
---

## Thinking Capabilities คืออะไร?

"Thinking" (การคิด — ความสามารถที่ทำให้ Claude วิเคราะห์ปัญหาภายในก่อนตอบ เหมือนมนุษย์คิดก่อนพูด) คือความสามารถที่ทำให้ Claude **สร้างขั้นตอนการวิเคราะห์ภายใน** ก่อนที่จะตอบ

โดยทั่วไป Claude จะตอบโดยตรง แต่สำหรับปัญหาซับซ้อน การให้ Claude "คิด" ก่อนจะให้คำตอบที่แม่นยำกว่ามาก

---

## สองโหมดของ Thinking

### 1. Extended Thinking (การคิดแบบกำหนดขอบเขต — คุณตั้ง budget token เพื่อจำกัดว่า Claude จะใช้ token ในการคิดได้เท่าไหร่)

คุณกำหนด `budget_tokens` (งบ token) เพื่อจำกัดจำนวน token (ชิ้นส่วนข้อมูล) ที่ Claude ใช้คิด

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # Claude ใช้ได้ไม่เกิน 10k tokens สำหรับการคิด
    },
    messages=[{"role": "user", "content": "แก้สมการนี้..."}]
)
```

**สถานะ:** Deprecated (เลิกใช้แล้ว — ยังทำงานได้แต่ไม่แนะนำ) สำหรับ Claude 4.6+ แต่ยังใช้งานได้กับโมเดลเก่า

### 2. Adaptive Thinking (การคิดแบบปรับตัว — โมเดลตัดสินใจเองว่าต้องคิดนานแค่ไหน ตามความยากของปัญหา — โหมดแนะนำ)

โมเดลตัดสินใจเองว่าต้องคิดนานแค่ไหน ตามความยากของปัญหา ควบคุมด้วย `effort` (ระดับความพยายาม) parameter

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # หรือ "max", "medium", "low"
    messages=[{"role": "user", "content": "วิเคราะห์ strategy ธุรกิจนี้..."}]
)
```

**สถานะ:** แนะนำสำหรับ Claude 4.6+ และใหม่กว่า

---

## Model Support

| โมเดล | Extended Thinking | Adaptive Thinking |
|-------|-------------------|-------------------|
| Claude Fable 5 | ไม่รองรับ | เปิดอยู่เสมอ (ปิดไม่ได้) |
| Claude Mythos 5 | ไม่รองรับ | เปิดอยู่เสมอ (ปิดไม่ได้) |
| Claude Opus 4.8 | ไม่รองรับ | รองรับ (แนะนำ) |
| Claude Opus 4.7 | ไม่รองรับ | รองรับ (แนะนำ) |
| Claude Opus 4.6 | รองรับ (deprecated) | รองรับ (แนะนำ) |
| Claude Sonnet 4.6 | รองรับ (deprecated) | รองรับ (แนะนำ) |
| Claude Sonnet 4.5 | รองรับ | ไม่รองรับ |
| Claude Haiku 4.5 | รองรับ | ไม่รองรับ |

---

## Effort Levels

สำหรับ Adaptive Thinking ควบคุมความลึกของการคิดด้วย `effort`:

| Effort Level | คำอธิบาย | ใช้เมื่อ |
|-------------|---------|---------|
| `"low"` | คิดน้อย ตอบเร็ว | งานง่าย, ต้องการ latency (เวลาหน่วง) ต่ำ |
| `"medium"` | สมดุล | งานทั่วไป |
| `"high"` | คิดมาก (default — ค่าเริ่มต้น) | งานซับซ้อน |
| `"max"` | คิดสูงสุด | งานที่ต้องการ accuracy (ความแม่นยำ) สูงมาก |

```python
# ต้องการ latency ต่ำ (ตอบเร็ว)
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    thinking={"type": "adaptive"},
    output_config={"effort": "low"},
    messages=[{"role": "user", "content": "แปลประโยคนี้เป็นภาษาอังกฤษ"}]
)

# ต้องการ accuracy สูง
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "max"},
    messages=[{"role": "user", "content": "พิสูจน์ทฤษฎีนี้ทางคณิตศาสตร์..."}]
)
```

---

## โครงสร้าง Response ที่มี Thinking

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "ให้ฉันวิเคราะห์ปัญหานี้ทีละขั้นตอน...\n\nขั้นที่ 1: ...\nขั้นที่ 2: ...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3U..."
    },
    {
      "type": "text",
      "text": "จากการวิเคราะห์ พบว่า..."
    }
  ]
}
```

- `thinking` block — ขั้นตอนการคิดภายใน (อาจถูก summarize — สรุปย่อ หรือ omit — ซ่อน ตาม `display` setting)
- `text` block — คำตอบสุดท้ายที่ให้ผู้ใช้

---

## Display Options

ควบคุมว่าจะเห็น thinking content แบบไหน:

```python
# แสดง summary (บทสรุป) ของ thinking (default สำหรับบางโมเดล)
thinking={
    "type": "enabled",
    "budget_tokens": 10000,
    "display": "summarized"
}

# ซ่อน thinking (แต่ยังคิดอยู่ ประหยัด bandwidth — ปริมาณข้อมูลที่ส่งผ่านเครือข่าย)
thinking={
    "type": "enabled",
    "budget_tokens": 10000,
    "display": "omitted"  # เร็วกว่า ไม่ส่ง thinking tokens มา
}
```

---

## Thinking กับ Tool Use

เมื่อใช้ thinking ร่วมกับ tool use (การเรียกใช้ฟังก์ชัน) ต้องส่ง thinking blocks กลับไปด้วย:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    tools=[weather_tool],
    messages=[{"role": "user", "content": "อากาศที่กรุงเทพเป็นอย่างไร?"}]
)

# แยก blocks
thinking_block = next((b for b in response.content if b.type == "thinking"), None)
tool_use_block = next((b for b in response.content if b.type == "tool_use"), None)

# เมื่อส่ง tool result กลับ ต้องส่ง thinking block กลับไปด้วย
messages.append({"role": "assistant", "content": [thinking_block, tool_use_block]})
messages.append({
    "role": "user",
    "content": [{
        "type": "tool_result",
        "tool_use_id": tool_use_block.id,
        "content": "Temperature: 34°C, Humidity: 80%"
    }]
})
```

> **สำคัญ:** ถ้าไม่ส่ง thinking block กลับไปพร้อม tool_result จะเกิด error

---

## Thinking กับ Streaming

Streaming (การส่งข้อมูลทีละส่วนแบบต่อเนื่อง) กับ Thinking:

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "วิเคราะห์สถานการณ์ตลาดหุ้นไทย"}],
) as stream:
    for event in stream:
        if hasattr(event, 'delta'):
            if hasattr(event.delta, 'type'):
                if event.delta.type == "thinking_delta":
                    print(f"[THINKING] {event.delta.thinking}", end="")
                elif event.delta.type == "text_delta":
                    print(event.delta.text, end="", flush=True)
```

---

## Prompt Caching กับ Thinking

Prompt Caching (การจำ prompt ไว้ใช้ซ้ำ) กับ Thinking มีพฤติกรรมดังนี้:

- **System prompt cache** — ยังคงอยู่แม้จะเปลี่ยน thinking parameters
- **Message cache** — ถูก invalidate (ใช้งานไม่ได้) เมื่อเปลี่ยน budget_tokens หรือ type
- **Thinking blocks ใน cache** — นับเป็น input tokens เมื่ออ่านจาก cache

แนะนำให้ใช้ **1-hour cache duration** สำหรับงาน extended thinking ที่ใช้เวลานาน:

```python
system=[
    {
        "type": "text",
        "text": "System instructions...",
        "cache_control": {"type": "ephemeral", "ttl": 3600}  # cache 1 ชั่วโมง
    }
]
```

---

## เมื่อไหรที่ควรใช้ Thinking

### ควรใช้เมื่อ:
- **Math และ logic** — การพิสูจน์, การคำนวณซับซ้อน
- **Code debugging** (การหาและแก้ bug ในโค้ด) — วิเคราะห์ bug ที่ซับซ้อน
- **Strategic analysis** (การวิเคราะห์เชิงกลยุทธ์) — การตัดสินใจทางธุรกิจ
- **Research synthesis** (การสังเคราะห์งานวิจัย) — รวบรวมข้อมูลจากหลายแหล่ง
- **Multi-step reasoning** (การให้เหตุผลหลายขั้นตอน) — ปัญหาที่ต้องผ่านหลายขั้นตอน

### ไม่จำเป็นต้องใช้เมื่อ:
- Translation (การแปลภาษา) ง่ายๆ
- Summarization (การสรุป) สั้น
- Q&A ทั่วไปที่มีคำตอบชัดเจน
- Real-time chat (แชทแบบทันที) ที่ต้องการ latency ต่ำ

---

## การ Migrate จาก Extended Thinking ไป Adaptive Thinking

สำหรับโมเดล 4.6+:

```python
# เก่า (Extended Thinking)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=64000,
    thinking={"type": "enabled", "budget_tokens": 32000},
    messages=[{"role": "user", "content": "..."}]
)

# ใหม่ (Adaptive Thinking)
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

---

## ข้อจำกัดสำคัญ

### Prefilled Responses (การใส่ข้อความล่วงหน้าในคำตอบ)

สำหรับ Claude 4.6+ ไม่รองรับการใส่ข้อความล่วงหน้าใน assistant turn สุดท้าย:

```python
# ใช้ไม่ได้กับ Claude 4.6+
messages = [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "ผลลัพธ์:"}  # ❌ Error!
]
```

### Tool Choice

เมื่อใช้ thinking กับ tools รองรับเฉพาะ `tool_choice: auto` (อัตโนมัติ) หรือ `none` เท่านั้น

### Toggle Mid-Turn

ไม่สามารถเปิด/ปิด thinking ระหว่าง tool use loop (วงจรการใช้ฟังก์ชัน) ได้

---

## ราคาของ Thinking

Thinking tokens (ชิ้นส่วนข้อมูลที่ใช้ในขั้นตอนการคิด) ถูกคิดเป็น **input tokens** ด้วยราคาเดียวกัน

ตัวอย่าง: ถ้า Claude ใช้ 5,000 thinking tokens + 500 output tokens กับ Opus 4.8:
- Thinking: 5,000 × $5/MTok = $0.025
- Output: 500 × $25/MTok = $0.0125
- รวม input + thinking: ขึ้นกับ input ที่ส่งไปด้วย

> **Note:** สำหรับ `display: "omitted"` คุณยังถูกเก็บค่า thinking tokens แต่ไม่ส่ง content มาในคำตอบ ทำให้ streaming (การรับข้อมูลทีละส่วน) เร็วขึ้น

---

## สรุป

| Feature | Extended Thinking | Adaptive Thinking |
|---------|-------------------|-------------------|
| **Control** | Manual (`budget_tokens` — กำหนดเอง) | Automatic + Effort (อัตโนมัติ + ระดับความพยายาม) |
| **โมเดลที่แนะนำ** | 4.5 และเก่ากว่า | 4.6 และใหม่กว่า |
| **ใช้งาน** | กำหนด budget | ตั้ง effort level |
| **ความยืดหยุ่น** | ต่ำกว่า | สูงกว่า |
| **ประสิทธิภาพ** | ดี | ดีกว่า (ตาม Anthropic) |

เริ่มต้นด้วย Adaptive Thinking + `effort: "high"` สำหรับโมเดล 4.6+ และใช้ Extended Thinking เฉพาะโมเดลเก่าที่ยังไม่รองรับ adaptive mode
