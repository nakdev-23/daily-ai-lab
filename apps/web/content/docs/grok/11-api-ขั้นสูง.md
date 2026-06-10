---
title: "Advanced API Usage — การใช้งาน API ขั้นสูง"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Batch API ให้คุณส่ง Request จำนวนมากในครั้งเดียว และรอผลลัพธ์แบบ Asynchronous แทนที่จะรอทีละ Request ข้อดีคือ ราคาถูกกว่า 20–50% เ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 11
---
# Advanced API Usage — การใช้งาน API ขั้นสูง

> อ้างอิง: [Batch API](https://docs.x.ai/developers/advanced-api-usage/batch-api) | [Deferred Completions](https://docs.x.ai/developers/advanced-api-usage/deferred-chat-completions) | [Context Compaction](https://docs.x.ai/developers/advanced-api-usage/context-compaction) | [mTLS Authentication](https://docs.x.ai/developers/advanced-api-usage/mtls) | [Async Requests](https://docs.x.ai/developers/advanced-api-usage/async) | [WebSocket Mode](https://docs.x.ai/developers/advanced-api-usage/websocket-mode)

---

## Batch API — ประมวลผลปริมาณมากแบบประหยัด

อ้างอิง: [Batch API](https://docs.x.ai/developers/advanced-api-usage/batch-api)

### หัวข้อนี้คืออะไร?
Batch API ให้คุณส่ง Request จำนวนมากในครั้งเดียว และรอผลลัพธ์แบบ Asynchronous แทนที่จะรอทีละ Request ข้อดีคือ **ราคาถูกกว่า 20–50%** เหมาะสำหรับงานที่ไม่ต้องการผลทันที

### ใช้ทำอะไร?
- วิเคราะห์เอกสารหลายพันชิ้น
- แปลข้อความจำนวนมาก
- สร้างเนื้อหา Bulk
- ประเมิน/Classify ข้อมูลขนาดใหญ่

### เปรียบเทียบ

| | Real-time API | Batch API |
|---|---|---|
| ราคา | ราคาปกติ | **ลด 20–50%** |
| เวลาตอบสนอง | ทันที (วินาที) | ภายใน 24 ชั่วโมง |
| Rate Limit | นับ | **ไม่นับ** |
| เหมาะกับ | ต้องการทันที | ประหยัดต้นทุน |

### วิธีใช้งาน

**ขั้นตอนที่ 1: สร้างไฟล์ Batch (.jsonl)**
```jsonl
{"custom_id": "req-1", "method": "POST", "url": "/v1/responses", "body": {"model": "grok-4.3", "input": [{"role": "user", "content": "สรุปบทความนี้: ..."}]}}
{"custom_id": "req-2", "method": "POST", "url": "/v1/responses", "body": {"model": "grok-4.3", "input": [{"role": "user", "content": "แปลเป็นภาษาอังกฤษ: ..."}]}}
```

**ขั้นตอนที่ 2: อัปโหลดและสร้าง Batch**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# อัปโหลดไฟล์ Batch
with open("batch_requests.jsonl", "rb") as f:
    batch_file = client.files.create(file=f, purpose="batch")

# สร้าง Batch Job
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/responses",
    completion_window="24h",
)

print(f"Batch ID: {batch.id}")
print(f"Status: {batch.status}")
```

**ขั้นตอนที่ 3: ตรวจสอบและดึงผลลัพธ์**
```python
import time

# รอจนเสร็จ
while True:
    batch_status = client.batches.retrieve(batch.id)
    if batch_status.status == "completed":
        break
    print(f"กำลังประมวลผล... {batch_status.status}")
    time.sleep(60)

# ดึงผลลัพธ์
output_file = client.files.content(batch_status.output_file_id)
results = output_file.text.split("\n")
```

### ข้อควรระวัง
- Batch API รองรับเฉพาะ Text/Language Models เท่านั้น (ไม่รวม Image/Video)
- ส่วนลดราคาครอบคลุมทุก Token type: Input, Output, Cached, Reasoning

---

## Deferred Completions — ส่งคำขอแบบเลื่อนเวลา

อ้างอิง: [Deferred Completions](https://docs.x.ai/developers/advanced-api-usage/deferred-chat-completions)

### หัวข้อนี้คืออะไร?
เหมือน Batch API แต่สำหรับ Request เดี่ยว — ส่ง Request ไปก่อน แล้วค่อยมาดึงผลเมื่อพร้อม เหมาะเมื่อ Request นั้นใช้เวลานานมาก (เช่น Reasoning ลึก)

### วิธีใช้งาน

```python
# ส่ง Request แบบ Deferred
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "วิเคราะห์ข้อมูลนี้อย่างละเอียด..."}],
    reasoning={"effort": "high"},
    deferred=True,  # บอกว่าไม่ต้องรอ
)

request_id = response.id

# ดึงผลภายหลัง
final = client.responses.retrieve(request_id)
print(final.output_text)
```

---

## Context Compaction — บีบอัด Context ยาว

อ้างอิง: [Context Compaction](https://docs.x.ai/developers/advanced-api-usage/context-compaction)

### หัวข้อนี้คืออะไร?
เมื่อการสนทนายาวมากจน Context Window เต็ม Context Compaction จะสรุปประวัติการสนทนาอัตโนมัติ เพื่อให้ยังคุยต่อได้โดยไม่เสีย Token ไปโดยเปล่าประโยชน์

### ใช้ทำอะไร?
- Session สนทนายาวมาก
- Agent ที่ทำงานหลายชั่วโมง
- Grok Build ที่ทำงาน Coding ยาวนาน

### วิธีเปิดใช้

```python
response = client.responses.create(
    model="grok-4.3",
    input=messages,
    context_compaction={"enabled": True},
)
```

---

## mTLS Authentication — ความปลอดภัยระดับสูง

อ้างอิง: [mTLS Authentication](https://docs.x.ai/developers/advanced-api-usage/mtls)

### หัวข้อนี้คืออะไร?
**mTLS (Mutual TLS)** คือการยืนยันตัวตนสองทาง — ทั้ง Server และ Client ต้องแสดง Certificate ก่อนสื่อสาร ปลอดภัยกว่าการใช้แค่ API Key

### ใช้ทำอะไร?
- Enterprise ที่ต้องการความปลอดภัยสูงสุด
- ระบบที่มีข้อกำหนด Compliance เข้มงวด
- ป้องกัน API Key รั่วไหล

### วิธีตั้งค่า

```python
import httpx
from openai import OpenAI

# โหลด Client Certificate
http_client = httpx.Client(
    cert=("path/to/client.crt", "path/to/client.key"),
    verify="path/to/ca.crt",
)

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
    http_client=http_client,
)
```

---

## Async Requests — การส่งคำขอแบบ Asynchronous

อ้างอิง: [Async Requests](https://docs.x.ai/developers/advanced-api-usage/async)

### หัวข้อนี้คืออะไร?
ใช้ `async/await` ใน Python เพื่อส่ง Request หลายรายการพร้อมกัน แทนที่จะรอทีละอัน ทำให้แอปทำงานเร็วขึ้นมากเมื่อมีงานหลายชิ้น

### วิธีใช้งาน

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

async def analyze_text(text: str):
    response = await client.responses.create(
        model="grok-4.3",
        input=[{"role": "user", "content": f"วิเคราะห์: {text}"}],
    )
    return response.output_text

async def main():
    texts = ["ข้อความ 1...", "ข้อความ 2...", "ข้อความ 3..."]
    
    # ส่งทุก Request พร้อมกัน
    results = await asyncio.gather(*[analyze_text(t) for t in texts])
    
    for i, result in enumerate(results):
        print(f"ผลที่ {i+1}: {result}")

asyncio.run(main())
```

---

## WebSocket Mode — เชื่อมต่อแบบต่อเนื่อง

อ้างอิง: [WebSocket Mode](https://docs.x.ai/developers/advanced-api-usage/websocket-mode)

### หัวข้อนี้คืออะไร?
แทนที่จะส่ง HTTP Request ทุกครั้ง WebSocket Mode ใช้การเชื่อมต่อแบบต่อเนื่อง (Persistent Connection) เหมาะสำหรับแอปที่ต้องการ Latency ต่ำมาก

### ใช้ทำอะไร?
- Voice Agent (เสียงแบบ Real-time)
- Chatbot ที่ต้องตอบเร็วมาก
- Real-time Collaboration Tools

### วิธีใช้งาน (ตัวอย่าง Python)

```python
import asyncio
import websockets
import json

async def connect():
    uri = "wss://api.x.ai/v1/ws"
    headers = {"Authorization": f"Bearer YOUR_XAI_API_KEY"}
    
    async with websockets.connect(uri, extra_headers=headers) as ws:
        # ส่งข้อความ
        await ws.send(json.dumps({
            "type": "message",
            "model": "grok-4.3",
            "content": "สวัสดี Grok"
        }))
        
        # รับผลลัพธ์แบบ Streaming
        async for message in ws:
            data = json.loads(message)
            if data["type"] == "content_delta":
                print(data["delta"], end="", flush=True)
            elif data["type"] == "done":
                break

asyncio.run(connect())
```

---

## Prompt Caching — ลดต้นทุน Prompt ซ้ำ

### หัวข้อนี้คืออะไร?
เมื่อส่ง Prompt เดิมหลายครั้ง (เช่น System Prompt ยาวๆ ที่เหมือนกัน) xAI จะ Cache Prompt นั้นไว้ และคิดราคาถูกกว่า

### ราคา Cached Input
- **$0.20 / 1M tokens** (ถูกกว่าปกติ ~6 เท่า)

### วิธีทำงาน
xAI จะทำ Caching อัตโนมัติเมื่อเห็น Prompt ที่เหมือนกันบ่อยๆ ไม่ต้องตั้งค่าพิเศษ

---

## Docs MCP

อ้างอิง: [Docs MCP](https://docs.x.ai/developers/docs-mcp)

### หัวข้อนี้คืออะไร?
xAI ให้บริการ **MCP Server สำหรับ Documentation** — ทำให้ AI อื่นๆ สามารถค้นหาและอ่านเอกสาร xAI ได้โดยตรงผ่าน MCP Protocol

### ใช้ทำอะไร?
- ให้ Claude, Cursor หรือ IDE ที่รองรับ MCP อ่าน xAI Docs ได้ทันที
- สร้าง Chatbot ที่รู้เรื่อง xAI API

### URL สำหรับ MCP Server
```
https://docs.x.ai/mcp
```

---

## Cost Tracking — ติดตามค่าใช้จ่าย

อ้างอิง: [Cost Tracking](https://docs.x.ai/developers/cost-tracking)

### หัวข้อนี้คืออะไร?
ดูค่าใช้จ่ายต่อ Request ที่ระดับ Token ว่าแต่ละส่วนใช้เท่าไหร่

### ดูข้อมูลจาก Response

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "สวัสดี"}],
)

usage = response.usage
print(f"Input tokens: {usage.input_tokens}")
print(f"Output tokens: {usage.output_tokens}")
print(f"Reasoning tokens: {usage.reasoning_tokens}")
print(f"Cached tokens: {usage.cached_tokens}")
```

### ดู Dashboard
ดูค่าใช้จ่ายรวมได้ที่ [console.x.ai/team/default/billing](https://console.x.ai/team/default/billing)

---

## Debugging Errors — แก้ไขข้อผิดพลาด

อ้างอิง: [Debugging Errors](https://docs.x.ai/developers/debugging)

### Error ที่พบบ่อย

| HTTP Code | ความหมาย | วิธีแก้ |
|---|---|---|
| `400` | Bad Request | ตรวจสอบ Parameters ที่ส่ง |
| `401` | Unauthorized | ตรวจสอบ API Key |
| `403` | Forbidden | ตรวจสอบสิทธิ์การเข้าถึง |
| `429` | Rate Limit Exceeded | รอแล้วลองใหม่ ใช้ Exponential Backoff |
| `500` | Internal Server Error | ลองใหม่ ถ้ายังเกิดให้แจ้ง Support |

### Community Integrations

อ้างอิง: [Community Integrations](https://docs.x.ai/developers/community)

มี Library และ Tools จาก Community ที่รองรับ xAI API เช่น LangChain, LlamaIndex, VercelAI และอื่นๆ ดูรายการได้ที่ [docs.x.ai/developers/community](https://docs.x.ai/developers/community)
