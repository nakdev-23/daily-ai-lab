---
title: "Streaming API — รับ Response แบบ Real-Time"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "เรียนรู้วิธีใช้ streaming เพื่อแสดงผลลัพธ์แบบ real-time ประเภทของ events, การ implement ใน Python/TypeScript และ best practices"
readTime: "8 นาที"
readers: "0"
locked: false
order: 14
---

## Streaming คืออะไร?

ปกติเมื่อเรียก Claude API (ช่องทางเชื่อมต่อระหว่างโปรแกรม) จะต้องรอให้ Claude สร้างคำตอบทั้งหมดก่อน แล้วจึงได้รับ response (การตอบกลับ) ทีเดียว

**Streaming** (การส่งข้อมูลทีละส่วนแบบต่อเนื่อง — แทนที่จะรอให้เสร็จก่อนแล้วส่งทีเดียว) คือการรับ response แบบ **ทีละชิ้น** (incremental — เพิ่มขึ้นทีละนิด) ทำให้ผู้ใช้เห็นข้อความขึ้นทีละคำ ทีละประโยค ไม่ต้องรอนาน ให้ความรู้สึกเหมือน Claude กำลัง "พิมพ์" อยู่จริงๆ

---

## เหตุผลที่ควรใช้ Streaming

- **UX (ประสบการณ์ผู้ใช้) ดีขึ้น** — ผู้ใช้เห็นผลลัพธ์เร็วขึ้น ไม่ต้องรอหน้าจอว่างๆ
- **Time-to-first-token (เวลารอรับตัวอักษรแรก) ลดลง** — ได้รับตัวอักษรแรกในเวลาไม่กี่วินาที
- **Long responses** — สำหรับคำตอบยาวๆ streaming จำเป็นมาก
- **Real-time applications** — เหมาะกับ chatbots, code generation (การสร้างโค้ด), live translation (การแปลภาษาสด)

---

## วิธีเปิดใช้งาน Streaming

เพิ่ม `"stream": true` ใน API request (หรือใช้ SDK — ชุดเครื่องมือสำเร็จรูปสำหรับนักพัฒนา method `.stream()`)

### Python SDK

```python
import anthropic

client = anthropic.Anthropic()

# วิธีที่ 1: ใช้ context manager (แนะนำ)
with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "เขียนเรื่องสั้นเกี่ยวกับ AI"}],
    model="claude-opus-4-8",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# วิธีที่ 2: ใช้ raw streaming events
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
) as stream:
    for event in stream:
        print(event)
```

### TypeScript/JavaScript SDK

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// วิธีที่ 1: text stream
const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [{ role: "user", content: "เขียนบทกวีภาษาไทย" }],
});

// ฟัง text events
stream.on("text", (text) => {
  process.stdout.write(text);
});

// รอให้เสร็จสมบูรณ์
const finalMessage = await stream.finalMessage();
console.log("\nUsage:", finalMessage.usage);
```

### cURL

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-4-8",
    "max_tokens": 1024,
    "stream": true,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## ประเภทของ Streaming Events

Streaming ใช้ **Server-Sent Events (SSE)** (โปรโตคอลส่งข้อมูลจากเซิร์ฟเวอร์ไปยังเบราว์เซอร์แบบต่อเนื่องทางเดียว) format แต่ละ event มี `event:` และ `data:` field

### Event Types ทั้งหมด

| Event Type | คำอธิบาย |
|-----------|---------|
| `message_start` | เริ่มต้น message ใหม่ มี metadata (ข้อมูลเพิ่มเติมเกี่ยวกับ message) |
| `content_block_start` | เริ่ม content block ใหม่ (text, tool_use, thinking) |
| `content_block_delta` | ข้อมูลที่ส่งมาเพิ่ม (text_delta, input_json_delta, thinking_delta) |
| `content_block_stop` | จบ content block |
| `message_delta` | update ของ message (stop_reason, usage) |
| `message_stop` | message สมบูรณ์แล้ว |
| `ping` | keepalive signal (สัญญาณบอกว่าการเชื่อมต่อยังมีอยู่) |
| `error` | มี error เกิดขึ้น |

### ตัวอย่าง Raw Events

```
event: message_start
data: {"type":"message_start","message":{"id":"msg_01...","type":"message","role":"assistant","content":[],"model":"claude-opus-4-8","stop_reason":null,"usage":{"input_tokens":10,"output_tokens":1}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"สวัสดี"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" ครับ"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":15}}

event: message_stop
data: {"type":"message_stop"}
```

---

## Streaming กับ Tool Use

เมื่อใช้ streaming พร้อมกับ tool use (การเรียกใช้ฟังก์ชัน) จะได้รับ events เพิ่มเติม:

```python
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[weather_tool],
    messages=[{"role": "user", "content": "อากาศ Bangkok เป็นอย่างไร?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if hasattr(event.content_block, "type"):
                if event.content_block.type == "tool_use":
                    print(f"Claude กำลังเรียก tool: {event.content_block.name}")
        
        elif event.type == "content_block_delta":
            if event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
            elif event.delta.type == "input_json_delta":
                print(f"[Tool input]: {event.delta.partial_json}", end="")
```

---

## Streaming กับ Extended Thinking

สำหรับโมเดลที่รองรับ extended thinking (การคิดแบบขยาย — Claude แสดงกระบวนการคิดภายในก่อนตอบ):

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "แก้โจทย์คณิตศาสตร์นี้..."}],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Claude กำลังคิด
                print(f"[THINKING]: {event.delta.thinking}", end="")
            elif event.delta.type == "text_delta":
                # Claude กำลังตอบ
                print(event.delta.text, end="", flush=True)
```

---

## การ Implement Streaming ใน Web Application

### Node.js / Express

```javascript
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic();

app.get('/stream', async (req, res) => {
  // ตั้งค่า headers สำหรับ SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [{ role: 'user', content: req.query.message }],
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  });

  stream.on('finalMessage', (message) => {
    res.write(`data: ${JSON.stringify({ done: true, usage: message.usage })}\n\n`);
    res.end();
  });
});
```

### Next.js API Route (App Router)

```typescript
// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { message } = await req.json();

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const stream = client.messages.stream({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
      });

      stream.on("text", (text) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      });

      await stream.finalMessage();
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
```

### Frontend JavaScript (EventSource — ตัวรับ SSE ในเบราว์เซอร์)

```javascript
const eventSource = new EventSource('/stream?message=สวัสดี');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.done) {
    eventSource.close();
    console.log('Stream complete');
    return;
  }
  
  // แสดงข้อความทีละส่วน
  document.getElementById('output').textContent += data.text;
};

eventSource.onerror = () => {
  console.error('Stream error');
  eventSource.close();
};
```

---

## Error Handling ใน Streaming

```python
import anthropic

client = anthropic.Anthropic()

try:
    with client.messages.stream(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            
except anthropic.APIConnectionError:
    print("การเชื่อมต่อถูกตัด")
    
except anthropic.RateLimitError:
    print("เกิน Rate Limit (ขีดจำกัดการใช้งาน) กรุณาลองใหม่ภายหลัง")
    
except anthropic.APIStatusError as e:
    print(f"API Error: {e.status_code} - {e.message}")
```

---

## Streaming vs Non-Streaming

| ด้าน | Streaming | Non-Streaming |
|------|-----------|---------------|
| Time to first token (เวลารอรับข้อมูลชิ้นแรก) | เร็ว (วินาที) | ช้า (รอ complete) |
| User experience (ประสบการณ์ผู้ใช้) | ดีกว่ามาก | ดูช้า |
| Implementation (การนำไปใช้) | ซับซ้อนกว่า | ง่ายกว่า |
| ราคา | เท่ากัน | เท่ากัน |
| เหมาะกับ | Chatbots, live apps | Batch processing (การประมวลผลเป็นชุด) |

---

## Best Practices

### 1. Handle Connection Errors

Network connections (การเชื่อมต่อเครือข่าย) อาจหลุดระหว่าง stream ควรมี retry logic (ตรรกะลองใหม่อัตโนมัติ)

### 2. Show Loading State

แสดงสัญลักษณ์ "กำลังคิด..." ก่อน first token (ข้อมูลชิ้นแรก) มาถึง

### 3. Buffer ข้อความ

สำหรับ rendering (การแสดงผล) ที่ smooth อาจ buffer (เก็บไว้ชั่วคราว) text เล็กน้อยก่อน update UI

### 4. Handle Stop Reasons

ตรวจสอบ `stop_reason` ใน `message_delta` event:
- `end_turn` — Claude ตอบเสร็จแล้ว
- `max_tokens` — ถึง max_tokens แล้ว ต้องดักจับกรณีนี้
- `tool_use` — Claude ต้องการเรียก tool

### 5. Cleanup

เสมอ close stream เมื่อเสร็จหรือ error:

```python
stream = client.messages.stream(...)
try:
    for text in stream.text_stream:
        process(text)
finally:
    stream.close()  # ปิดเสมอ
```

---

## สรุป

Streaming เป็นสิ่งจำเป็นสำหรับ user-facing applications (แอปพลิเคชันที่ผู้ใช้โต้ตอบโดยตรง) ที่ใช้ Claude:

- ใช้ SDK method `.stream()` หรือ context manager `with client.messages.stream() as stream:`
- Handle events: `text`, `content_block_delta`, `message_delta`, `message_stop`
- สำหรับ web apps ใช้ Server-Sent Events (SSE) pattern (รูปแบบการส่งข้อมูลจากเซิร์ฟเวอร์ฝั่งเดียว)
- ราคาเท่ากับ non-streaming แต่ UX (ประสบการณ์ผู้ใช้) ดีกว่ามาก
