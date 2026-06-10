---
title: "SDK Usage — การใช้งาน xAI SDK และ OpenAI SDK"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "xAI รองรับ SDK 2 แบบหลัก — xAI SDK ที่สร้างมาโดยเฉพาะ และ OpenAI-compatible SDK ที่ใช้โค้ดเดิมได้ทันที ทั้ง Python และ JavaScript"
readTime: "6 นาที"
readers: "0"
locked: false
order: 14
---
# SDK Usage — การใช้งาน xAI SDK และ OpenAI SDK

> อ้างอิง: [Quickstart](https://docs.x.ai/docs) | [xAI SDK (PyPI)](https://pypi.org/project/xai-sdk/) | [OpenAI SDK](https://github.com/openai/openai-python)

---

## ทำไมต้องมี 2 SDK?

**SDK** (Software Development Kit — ชุดเครื่องมือสำเร็จรูปสำหรับนักพัฒนาที่ช่วยเรียกใช้บริการได้ง่ายขึ้น) xAI รองรับ 2 แบบเพื่อให้เหมาะกับนักพัฒนาทุกกลุ่ม:

| SDK | เหมาะกับ | จุดเด่น |
|---|---|---|
| **xAI SDK** (`xai-sdk`) | โปรเจกต์ใหม่ที่ใช้ xAI โดยตรง | รองรับฟีเจอร์ xAI ครบที่สุด |
| **OpenAI SDK** (`openai`) | โปรเจกต์เดิมที่ใช้ OpenAI อยู่แล้ว | เปลี่ยนแค่ `base_url` ก็ใช้ได้เลย |
| **Vercel AI SDK** (`ai`) | Next.js / React apps | รองรับ Streaming และ UI components |

---

## Python — xAI SDK

### ติดตั้ง

```bash
pip install xai-sdk
```

### การตั้งค่า API Key

**API Key** (รหัสลับสำหรับยืนยันตัวตน — เหมือนกุญแจที่ให้แอพเข้าใช้บริการได้):

```bash
# ตั้งค่าผ่าน Environment Variable (ตัวแปรสภาพแวดล้อม — ค่าที่เก็บไว้นอกโค้ด เพื่อไม่ให้ key หลุดออกไป)
export XAI_API_KEY="xai-..."

# หรือใน .env file
XAI_API_KEY=xai-...
```

### ตัวอย่างพื้นฐาน

```python
import xai_sdk
import os

client = xai_sdk.Client(api_key=os.environ["XAI_API_KEY"])

# Chat แบบ Sync (รอผลทันที — ต่างจาก Async ที่ทำงานขนาน)
response = client.chat.create(
    model="grok-4.3",
    messages=[
        {"role": "system", "content": "คุณเป็นผู้ช่วย AI ที่ตอบเป็นภาษาไทย"},
        {"role": "user", "content": "อธิบาย Neural Network ให้เข้าใจง่ายๆ"},
    ],
)
print(response.choices[0].message.content)
```

### Streaming

```python
import xai_sdk

client = xai_sdk.Client(api_key="YOUR_XAI_API_KEY")

# Streaming (การรับข้อมูลแบบต่อเนื่องทีละชิ้น)
stream = client.chat.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "เล่าเรื่องสั้นให้ฟัง"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### Async Support

**Async** (การทำงานแบบไม่ต้องรอ — โปรแกรมทำงานอื่นต่อได้ระหว่างรอผล):

```python
import asyncio
import xai_sdk

client = xai_sdk.AsyncClient(api_key="YOUR_XAI_API_KEY")

async def main():
    response = await client.chat.create(
        model="grok-4.3",
        messages=[{"role": "user", "content": "สวัสดี"}],
    )
    print(response.choices[0].message.content)

asyncio.run(main())
```

---

## Python — OpenAI SDK (OpenAI-compatible)

### ติดตั้ง

```bash
pip install openai
```

### การตั้งค่า

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",   # ใช้ xAI API Key
    base_url="https://api.x.ai/v1",  # เปลี่ยน base_url (ที่อยู่ต้นทางของ API) เท่านั้น
)
```

> **เคล็ดลับ:** ถ้าเดิมใช้ OpenAI อยู่แล้ว แค่เปลี่ยน 2 บรรทัดนี้ก็ย้ายมาใช้ Grok ได้ทันที

### ตัวอย่างครบ

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# --- Chat Completion (การสร้างคำตอบจากบทสนทนา) ---
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {"role": "system", "content": "ตอบสั้นๆ กระชับ ภาษาไทย"},
        {"role": "user", "content": "Python ดีกว่า JavaScript ยังไง?"},
    ],
    temperature=0.7,
    max_tokens=500,
)
print(response.choices[0].message.content)
print(f"Tokens ที่ใช้: {response.usage.total_tokens}")

# --- Responses API (รูปแบบใหม่กว่า) ---
resp = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "สรุปข้อดีของ TypeScript"}],
)
print(resp.output_text)
```

### Multi-turn Conversation

**Multi-turn** (การสนทนาหลายรอบ — Grok จำบริบทก่อนหน้าได้):

```python
messages = [
    {"role": "system", "content": "คุณเป็นครูสอนโปรแกรมมิ่ง"},
]

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})
    
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=messages,
    )
    
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message

# คุยต่อเนื่องหลายรอบ
print(chat("Python คืออะไร?"))
print(chat("แล้ว List กับ Tuple ต่างกันยังไง?"))
print(chat("ช่วยยกตัวอย่างการใช้งานจริงหน่อย"))
```

---

## JavaScript / TypeScript — OpenAI SDK

### ติดตั้ง

```bash
npm install openai
# หรือ
yarn add openai
# หรือ
pnpm add openai
```

### ตัวอย่างพื้นฐาน

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function main() {
  const response = await client.chat.completions.create({
    model: "grok-4.3",
    messages: [
      { role: "system", content: "คุณเป็นผู้ช่วย AI ที่ตอบเป็นภาษาไทย" },
      { role: "user", content: "อธิบาย REST API ให้เข้าใจง่ายๆ" },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
```

### Streaming (TypeScript)

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function streamChat() {
  const stream = await client.chat.completions.create({
    model: "grok-4.3",
    messages: [{ role: "user", content: "เล่าประวัติ AI ให้ฟัง" }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
}

streamChat();
```

---

## JavaScript — Vercel AI SDK

เหมาะสำหรับโปรเจกต์ Next.js และ React

### ติดตั้ง

```bash
npm install ai @ai-sdk/xai zod
```

### Server Component (Next.js App Router)

**App Router** (ระบบจัดการหน้าเพจรูปแบบใหม่ของ Next.js):

```typescript
// app/api/chat/route.ts
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: xai("grok-4.3"),
    system: "คุณเป็นผู้ช่วย AI ที่ตอบเป็นภาษาไทย",
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Client Component

```tsx
// components/ChatInterface.tsx
"use client";
import { useChat } from "ai/react";

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/chat" });

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && <div className="text-gray-400">Grok กำลังพิมพ์...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 border rounded-lg p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg">
          ส่ง
        </button>
      </form>
    </div>
  );
}
```

### generateText (ไม่ใช้ Streaming)

```typescript
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

const { text } = await generateText({
  model: xai("grok-4.3"),
  prompt: "สรุปข้อดีของ TypeScript ใน 3 ข้อ",
});

console.log(text);
```

---

## cURL — ทดสอบ API โดยตรง

**cURL** (เครื่องมือบรรทัดคำสั่งสำหรับส่ง HTTP request ทดสอบ API):

```bash
curl https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4.3",
    "messages": [
      {
        "role": "user",
        "content": "สวัสดี Grok! แนะนำตัวหน่อย"
      }
    ]
  }'
```

---

## Parameters สำคัญ

| Parameter | Type | Default | คำอธิบาย |
|---|---|---|---|
| `model` | string | — | ชื่อ Model เช่น `grok-4.3` |
| `messages` | array | — | ประวัติการสนทนา |
| `temperature` | float | 1.0 | ความหลากหลายของคำตอบ (0 = แน่นอน, 2 = สร้างสรรค์) |
| `max_tokens` | int | — | จำนวน Token สูงสุดในคำตอบ |
| `stream` | bool | false | เปิด Streaming |
| `top_p` | float | 1.0 | Nucleus sampling (วิธีเลือกคำที่มีความน่าจะเป็นสูงสุดรวมกัน) |
| `frequency_penalty` | float | 0 | ลดการพูดซ้ำ |
| `presence_penalty` | float | 0 | ส่งเสริมหัวข้อใหม่ |

---

## Environment Variables แนะนำ

**Environment Variables** (ตัวแปรสภาพแวดล้อม — ค่าที่เก็บแยกจากโค้ดเพื่อความปลอดภัย):

```bash
# .env.local (สำหรับ Next.js)
XAI_API_KEY=xai-your-api-key-here

# .env (Python)
XAI_API_KEY=xai-your-api-key-here
```

> **ความปลอดภัย:** ห้ามใส่ API Key ในโค้ดโดยตรง ควรใช้ Environment Variables เสมอ และเพิ่ม `.env` ใน `.gitignore`
