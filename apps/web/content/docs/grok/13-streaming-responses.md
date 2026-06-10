---
title: "Streaming Responses — รับผลลัพธ์แบบ Real-time"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Streaming ช่วยให้แอปแสดงข้อความจาก Grok ได้ทันทีแบบ token ต่อ token แทนที่จะรอให้ตอบสำเร็จก่อน ทำให้ UX ดีขึ้นอย่างมาก"
readTime: "5 นาที"
readers: "0"
locked: false
order: 13
---
# Streaming Responses — รับผลลัพธ์แบบ Real-time

> อ้างอิง: [Responses API](https://docs.x.ai/docs) | [xAI API Reference](https://docs.x.ai/api-reference)

---

## Streaming คืออะไร?

ปกติเมื่อเรียก Grok API แอปจะต้อง **รอจนกว่า Grok จะตอบจบทั้งหมด** แล้วค่อยได้รับ Response (การตอบกลับ) เดียว

**Streaming** (การรับข้อมูลแบบต่อเนื่องทีละชิ้น — เหมือนดูวิดีโอออนไลน์แทนดาวน์โหลดก่อน) เปลี่ยนพฤติกรรมนี้ให้ Grok **ส่ง Token (ชิ้นส่วนข้อความ — ประมาณ 1 คำหรือ 3-4 ตัวอักษร AI นับคำเป็น token) ทีละตัวทันทีที่สร้างเสร็จ** ผ่านโปรโตคอล **SSE — Server-Sent Events** (วิธีส่งข้อมูลจากเซิร์ฟเวอร์ไปหาเบราว์เซอร์แบบต่อเนื่อง)

### เปรียบเทียบ

| | แบบปกติ (Non-streaming) | แบบ Streaming |
|---|---|---|
| วิธีรับข้อมูล | รอจนเสร็จ แล้วรับครั้งเดียว | รับทีละ token ทันที |
| UX | ผู้ใช้รออยู่นิ่งๆ | ผู้ใช้เห็นข้อความพิมพ์ออกมา |
| เหมาะกับ | Background jobs, Batch | Chatbot, UI แบบ Interactive |
| Latency (ความหน่วง — เวลาที่รอก่อนได้ผลแรก) รู้สึก | สูง | ต่ำมาก |

---

## เปิดใช้งาน Streaming

เพิ่ม `stream=True` ใน request เพียงแค่นั้น:

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# เปิด Streaming ด้วย stream=True
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "อธิบาย Quantum Computing ให้เข้าใจง่ายๆ"}],
    stream=True,
)

# วน loop รับ token ทีละตัว
for event in stream:
    if hasattr(event, "delta") and event.delta:
        print(event.delta, end="", flush=True)

print()  # ขึ้นบรรทัดใหม่เมื่อจบ
```

### Python (xAI SDK)

```python
import xai_sdk

client = xai_sdk.Client(api_key="YOUR_XAI_API_KEY")

async def stream_response():
    async with client.chat.sample_async(
        model="grok-4.3",
        messages=[{"role": "user", "content": "เล่าเรื่องสั้นให้ฟัง"}],
        stream=True,
    ) as response:
        async for chunk in response:
            print(chunk.text, end="", flush=True)
```

### JavaScript (OpenAI SDK)

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function streamResponse() {
  const stream = await client.responses.create({
    model: "grok-4.3",
    input: [{ role: "user", content: "อธิบาย Blockchain ให้เข้าใจง่ายๆ" }],
    stream: true,
  });

  for await (const event of stream) {
    if (event.delta) {
      process.stdout.write(event.delta);
    }
  }
  console.log(); // ขึ้นบรรทัดใหม่
}

streamResponse();
```

### JavaScript (Vercel AI SDK)

```javascript
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

const { textStream } = await streamText({
  model: xai("grok-4.3"),
  prompt: "อธิบาย Machine Learning ในภาษาไทย",
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```

---

## ประเภท Events ใน Stream

เมื่อใช้ Streaming Grok จะส่ง events (เหตุการณ์หรือสัญญาณที่ส่งออกมาระหว่างการทำงาน) หลายประเภท:

| Event Type | คำอธิบาย |
|---|---|
| `response.created` | เริ่มต้น Stream |
| `response.output_text.delta` | Token ใหม่ถูกสร้าง |
| `response.output_text.done` | ข้อความ Output เสร็จสมบูรณ์ |
| `response.reasoning.delta` | Reasoning token (การคิดวิเคราะห์ — สำหรับ Thinking mode) |
| `response.done` | Response ทั้งหมดสำเร็จ |

### ตัวอย่างการจัดการ Events ทุกประเภท

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "วิเคราะห์แนวโน้มเศรษฐกิจไทย"}],
    stream=True,
)

reasoning_text = ""
output_text = ""

for event in stream:
    event_type = event.type
    
    if event_type == "response.reasoning.delta":
        # Grok กำลังคิด (ไม่แสดงให้ผู้ใช้เห็นก็ได้)
        reasoning_text += event.delta
        
    elif event_type == "response.output_text.delta":
        # ข้อความตอบจริง — แสดงให้ผู้ใช้เห็น
        output_text += event.delta
        print(event.delta, end="", flush=True)
        
    elif event_type == "response.done":
        print("\n--- จบการตอบ ---")
        print(f"Reasoning tokens: {len(reasoning_text.split())}")
```

---

## Streaming กับ Tools

Streaming ทำงานร่วมกับ Tools (เครื่องมือเสริมที่ให้ Grok เรียกใช้ได้ เช่น ค้นเว็บ) ได้ด้วย:

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ข่าวล่าสุดเรื่อง AI ในไทย?"}],
    tools=[{"type": "web_search"}],
    stream=True,
)

for event in stream:
    if hasattr(event, "type"):
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
        elif event.type == "response.tool_call.delta":
            # กำลังค้นหาเว็บ
            print(f"\n[กำลังค้นหา: {event.delta}]", end="")
```

---

## Streaming ใน Next.js / React

```typescript
// app/api/chat/route.ts
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: xai("grok-4.3"),
    messages,
  });

  return result.toDataStreamResponse();
}
```

```tsx
// components/Chat.tsx
"use client";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">ส่ง</button>
      </form>
    </div>
  );
}
```

---

## Verbose Streaming — ดู Token แบบละเอียด

สำหรับ Debug (การตรวจสอบหาจุดผิดพลาดในโค้ด) หรือ Monitor (การติดตามดูระบบ) ขั้นสูง สามารถเปิด `verbose` เพื่อดูรายละเอียด Token ทุกตัว:

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "สวัสดี"}],
    stream=True,
    stream_options={"include_usage": True},  # รวมข้อมูล Usage (การใช้งาน) ใน Stream
)

for event in stream:
    print(event)  # แสดง event ทุกตัวพร้อม metadata
```

---

## ข้อควรระวัง

- **ค่าใช้จ่ายเท่าเดิม** — Streaming ไม่มีค่าใช้จ่ายเพิ่ม คิดราคาเหมือน Non-streaming
- **ต้องอ่าน Stream จนจบ** — ถ้าปิด connection กลางคัน อาจเกิด error ได้
- **Timeout** (เวลาหมดอายุของการเชื่อมต่อ) — ตั้ง timeout ให้นานพอเพราะ Streaming response ใช้เวลานานกว่า
- **Structured Output กับ Streaming** — ใช้ `.stream()` แทน `.parse()` เมื่อต้องการ JSON แบบ Stream
