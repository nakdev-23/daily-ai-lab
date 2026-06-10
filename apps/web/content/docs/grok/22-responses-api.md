---
title: "Responses API — API รูปแบบใหม่ที่แนะนำสำหรับนักพัฒนา"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Responses API คือ API รุ่นใหม่ของ xAI ที่รองรับ Stateful conversations, Tools, Structured Outputs และ Streaming ในที่เดียว แตกต่างจาก Chat Completions แบบเดิม"
readTime: "6 นาที"
readers: "0"
locked: false
order: 22
---
# Responses API — API รูปแบบใหม่ที่แนะนำสำหรับนักพัฒนา

> อ้างอิง: [xAI Responses API](https://docs.x.ai/docs) | [API Reference](https://docs.x.ai/api-reference)

---

## Responses API คืออะไร?

**Responses API** คือ API (ช่องทางเชื่อมต่อระหว่างโปรแกรม) รุ่นใหม่ของ xAI ที่ออกแบบมาเพื่อแทนที่ Chat Completions API แบบเดิม

### ความแตกต่างหลัก

| Feature | Chat Completions | Responses API |
|---|---|---|
| Endpoint (ที่อยู่ปลายทาง) | `/v1/chat/completions` | `/v1/responses` |
| Format Input | `messages` array | `input` array |
| Output | `choices[0].message.content` | `output_text` |
| Tools (เครื่องมือเสริม) | รองรับ | รองรับ + เพิ่มเติม |
| Stateful (จำการสนทนา) | ไม่มี (ต้องส่ง history เอง) | รองรับ `previous_response_id` |
| Structured Output (ผลลัพธ์โครงสร้าง) | `response_format` | `text_format` (Pydantic/Zod) |
| Reasoning (การคิดวิเคราะห์) | ไม่มี | `reasoning` parameter |
| Context Compaction (การย่อบริบท) | ไม่มี | `context_compaction` |

---

## เริ่มต้นใช้งาน Responses API

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Responses API — รูปแบบใหม่
response = client.responses.create(
    model="grok-4.3",
    input=[
        {"role": "system", "content": "คุณเป็นผู้ช่วย AI ที่ตอบเป็นภาษาไทย"},
        {"role": "user", "content": "อธิบาย Microservices ในภาษาง่ายๆ"},
    ],
)

# ดึงข้อความตอบได้โดยตรง
print(response.output_text)
```

### เทียบกับ Chat Completions (รูปแบบเดิม)

```python
# Chat Completions — รูปแบบเดิม (ยังใช้ได้)
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {"role": "system", "content": "คุณเป็นผู้ช่วย AI ที่ตอบเป็นภาษาไทย"},
        {"role": "user", "content": "อธิบาย Microservices ในภาษาง่ายๆ"},
    ],
)
print(response.choices[0].message.content)  # ต้องเจาะลึกกว่า
```

---

## Stateful Conversations — จำการสนทนา

**Stateful** (มีสถานะ — ระบบจำสิ่งที่คุยกันไปก่อนหน้าได้ ต่างจาก Stateless ที่ลืมทุกครั้ง) จุดเด่นหลักของ Responses API คือ xAI จัดเก็บ conversation history (ประวัติการสนทนา) ให้:

```python
# ส่งข้อความแรก
response1 = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ชื่อของฉันคือ สมชาย"}],
)

first_id = response1.id
print(response1.output_text)
# "สวัสดีครับ คุณสมชาย..."

# ส่งข้อความต่อเนื่อง — ไม่ต้องส่ง history ซ้ำ!
response2 = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ชื่อของฉันคืออะไร?"}],
    previous_response_id=first_id,  # อ้างถึง response ก่อนหน้า
)

print(response2.output_text)
# "ชื่อของคุณคือ สมชายครับ"
```

### เทียบกับวิธีเดิม (ต้องส่ง history เอง)

```python
# วิธีเดิม — ต้องจัดการ history เอง
messages = []

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=messages,
    )
    assistant_msg = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_msg})
    return assistant_msg
```

---

## Parameters ใหม่ใน Responses API

### Reasoning — ควบคุมความลึกในการคิด

**Reasoning** (การคิดวิเคราะห์เชิงลึก — AI ใช้เวลา "คิด" ก่อนตอบ เหมาะกับปัญหายาก):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "แก้โจทย์: ถ้า f(x) = x² + 3x - 10 หาค่า x ที่ทำให้ f(x) = 0"
    }],
    reasoning={
        "effort": "high",  # "low" | "medium" | "high"
    },
)
```

| effort | ใช้เวลา | เหมาะกับ |
|---|---|---|
| `low` | เร็ว | คำถามง่าย, ต้องการ latency (ความหน่วง) ต่ำ |
| `medium` | ปานกลาง | คำถามทั่วไป (default) |
| `high` | ช้า แต่แม่นยำ | โจทย์ซับซ้อน, Coding, Math |

### Context Compaction — จัดการ Context Window อัตโนมัติ

**Context Window** (หน้าต่างบริบท — จำนวน token สูงสุดที่ AI จำได้ในการสนทนาครั้งเดียว) และ **Context Compaction** (การย่อบริบทอัตโนมัติ — เมื่อสนทนายาวเกินไป):

```python
# เปิด Context Compaction สำหรับ conversation ยาวๆ
response = client.responses.create(
    model="grok-4.3",
    input=long_conversation_messages,
    context_compaction={"enabled": True},
)
```

### Max Output Tokens

**Max Output Tokens** (จำนวน token สูงสุดในคำตอบ — ควบคุมความยาวของผลลัพธ์):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "เขียน Essay เรื่อง AI"}],
    max_output_tokens=2000,  # จำกัด output
)
```

---

## Output Parsing

**Output Parsing** (การแยกผลลัพธ์ — ดึงข้อมูลแต่ละประเภทออกจาก response):

Responses API มี output types หลายแบบ:

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "อธิบาย 3 เรื่อง"}],
    tools=[{"type": "web_search"}],
)

# วน loop ดู output items ทั้งหมด
for item in response.output:
    print(f"Type: {item.type}")
    
    if item.type == "message":
        # ข้อความตอบปกติ
        print(f"Content: {item.content[0].text}")
    
    elif item.type == "web_search_call":
        # Grok เรียก Web Search
        print(f"Search query: {item.query}")
    
    elif item.type == "function_call":
        # Grok ต้องการเรียก Function (ฟังก์ชันภายนอก)
        print(f"Function: {item.name}({item.arguments})")

# หรือดึง text output โดยตรง
print(response.output_text)  # shorthand (ทางลัด) สำหรับ text เท่านั้น
```

---

## Usage Tracking

**Usage Tracking** (การติดตามการใช้งาน — ดูว่าใช้ token ไปเท่าไหร่):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "สวัสดี"}],
)

usage = response.usage
print(f"Input tokens: {usage.input_tokens}")
print(f"Output tokens: {usage.output_tokens}")
print(f"Reasoning tokens: {usage.reasoning_tokens}")  # ใหม่ใน Responses API
print(f"Cached tokens: {usage.cached_tokens}")  # token ที่ดึงจาก cache (ไม่คิดราคาเต็ม)
```

---

## Streaming กับ Responses API

**Streaming** (การรับข้อมูลแบบต่อเนื่องทีละชิ้น — แสดงคำตอบทันทีโดยไม่ต้องรอจนจบ):

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "เล่าเรื่องสั้นให้ฟัง"}],
    stream=True,
)

for event in stream:
    if event.type == "response.output_text.delta":
        print(event.delta, end="", flush=True)
    elif event.type == "response.reasoning.delta":
        pass  # reasoning process (ซ่อนได้)
    elif event.type == "response.done":
        print(f"\n\nTokens used: {event.response.usage.output_tokens}")
```

---

## Deferred Responses — ส่งแล้วมาดึงทีหลัง

**Deferred** (การเลื่อนผล — ส่ง request แล้วมาดึงผลในภายหลัง เหมาะกับงานที่ใช้เวลานาน):

```python
# ส่ง request แบบ deferred (ไม่รอผล)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "วิเคราะห์ข้อมูลขนาดใหญ่นี้..."}],
    reasoning={"effort": "high"},
    deferred=True,
)

request_id = response.id
print(f"Request ID: {request_id} — จะมาดึงทีหลัง")

# ... ทำงานอื่นระหว่างรอ ...

# ดึงผลเมื่อพร้อม
import time
while True:
    result = client.responses.retrieve(request_id)
    if result.status == "completed":
        print(result.output_text)
        break
    elif result.status == "failed":
        print("เกิดข้อผิดพลาด")
        break
    time.sleep(5)
```

---

## เมื่อไหร่ควรใช้ Responses API?

**ใช้ Responses API เมื่อ:**
- สร้างโปรเจกต์ใหม่
- ต้องการ Stateful conversations (สนทนาแบบจำบริบท)
- ใช้ Tools หลายตัวพร้อมกัน
- ต้องการ Reasoning control (ควบคุมระดับการคิดวิเคราะห์)
- ใช้ Structured Outputs ด้วย Pydantic/Zod

**ใช้ Chat Completions เมื่อ:**
- มีโค้ดเดิมที่ใช้อยู่แล้ว
- ต้องการความเข้ากันได้กับ OpenAI libraries อื่นๆ
- Simple single-turn queries (คำถามสั้นๆ ไม่ต้องต่อเนื่อง)

> **แนะนำ:** โปรเจกต์ใหม่ทุกโปรเจกต์ควรใช้ **Responses API** เพราะรองรับฟีเจอร์ xAI ทั้งหมด
