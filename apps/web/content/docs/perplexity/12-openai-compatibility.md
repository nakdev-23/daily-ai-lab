---
title: "OpenAI Compatibility — ใช้ OpenAI SDK กับ Perplexity"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "วิธีใช้ OpenAI SDK ที่มีอยู่แล้วเชื่อมต่อกับ Perplexity API โดยเปลี่ยนแค่ Base URL และ API Key"
readTime: "5 นาที"
readers: "0"
locked: false
order: 12
---

# OpenAI Compatibility — ใช้ OpenAI SDK กับ Perplexity

Perplexity Agent API **รองรับ OpenAI Responses API** (มาตรฐาน API ของ OpenAI — ทำให้ใช้ได้กับ Library ที่เขียนมาสำหรับ OpenAI ได้เลย) อย่างสมบูรณ์ ถ้าคุณมีโค้ดที่ใช้ OpenAI อยู่แล้ว สามารถเปลี่ยนมาใช้ Perplexity ได้โดยเปลี่ยนแค่ 2 บรรทัด

---

## การตั้งค่า — เปลี่ยนแค่ 2 ค่า

### Python (openai library)
```python
from openai import OpenAI

# เดิม (OpenAI)
# client = OpenAI(api_key="sk-...")

# ใหม่ (เปลี่ยนเป็น Perplexity)
client = OpenAI(
    base_url="https://api.perplexity.ai/v1",  # เปลี่ยน URL
    api_key="pplx-xxxxxxxxxxxxxxxx"           # เปลี่ยน API Key
)

# ใช้งานได้เหมือนเดิมทุกประการ
response = client.responses.create(
    model="openai/gpt-5.1",   # ระบุโมเดลที่ต้องการ
    input="อธิบาย Machine Learning ให้เข้าใจง่าย"
)

print(response.output_text)
```

### TypeScript / Node.js
```typescript
import OpenAI from "openai";

// เดิม (OpenAI)
// const client = new OpenAI({ apiKey: "sk-..." });

// ใหม่ (เปลี่ยนเป็น Perplexity)
const client = new OpenAI({
  baseURL: "https://api.perplexity.ai/v1",  // เปลี่ยน baseURL
  apiKey: "pplx-xxxxxxxxxxxxxxxx",          // เปลี่ยน apiKey
});

const response = await client.responses.create({
  model: "anthropic/claude-sonnet-4-6",
  input: "อธิบาย Machine Learning",
});

console.log(response.output_text);
```

---

## Endpoint Aliases (ชื่อทางเลือก)

Perplexity รับทั้งสอง Endpoint นี้:

| Endpoint | หมายเหตุ |
|---|---|
| `POST /v1/agent` | Endpoint หลักของ Perplexity (แนะนำ) |
| `POST /v1/responses` | Alias สำหรับความเข้ากันได้กับ OpenAI SDK |

เมื่อใช้ OpenAI SDK (`client.responses.create()`), SDK จะส่งไปที่ `/v1/responses` ซึ่ง Perplexity รับและประมวลผลเหมือนกับ `/v1/agent` ทุกประการ

---

## ฟีเจอร์ที่รองรับด้วย OpenAI SDK

### ใช้งานได้ปกติ
```python
# 1. Basic Request / Response
response = client.responses.create(
    model="openai/gpt-5.1",
    input="คำถามของฉัน"
)

# 2. กำหนด Instructions (System Prompt)
response = client.responses.create(
    model="openai/gpt-5.1",
    instructions="คุณเป็นผู้เชี่ยวชาญด้านการเงิน ตอบเป็นภาษาไทย",
    input="วิเคราะห์แนวโน้มทองคำ"
)

# 3. Streaming
stream = client.responses.create(
    model="openai/gpt-5.1",
    input="อธิบายยาว",
    stream=True
)
for event in stream:
    if hasattr(event, 'delta'):
        print(event.delta, end="")

# 4. Third-party Models
response = client.responses.create(
    model="anthropic/claude-sonnet-4-6",  # ใช้โมเดล Anthropic ผ่าน OpenAI SDK
    input="สวัสดีครับ"
)
```

### ใช้ Preset ผ่าน extra_body
```python
# Presets ต้องส่งผ่าน extra_body เมื่อใช้ OpenAI SDK
response = client.responses.create(
    model="openai/gpt-5.1",  # model ยังต้องระบุ แต่ preset จะ override
    input="ค้นหาข้อมูลล่าสุดเกี่ยวกับ AI",
    extra_body={
        "preset": "pro-search"  # ส่ง preset ผ่าน extra_body
    }
)
```

---

## ความแตกต่างระหว่าง Native SDK และ OpenAI SDK

| ฟีเจอร์ | Native Perplexity SDK | OpenAI SDK |
|---|---|---|
| Type Safety (ความปลอดภัยของ Type) | สมบูรณ์ | บางส่วน |
| Preset Support | `preset="pro-search"` ตรงๆ | ต้องผ่าน `extra_body` |
| Model Fallback | `models=[...]` ตรงๆ | ต้องผ่าน `extra_body` |
| Finance Search Tool | รองรับตรงๆ | ต้องผ่าน `extra_body` |
| Migration จาก OpenAI | ต้องแก้โค้ดเล็กน้อย | แทบไม่ต้องแก้ |

**แนะนำ:**
- **Native SDK** — สำหรับโปรเจกต์ใหม่ที่ต้องการฟีเจอร์เต็ม
- **OpenAI SDK** — สำหรับโปรเจกต์ที่มีอยู่แล้วที่ต้องการย้ายมา Perplexity เร็วๆ

---

## ตัวอย่างการ Migrate โปรเจกต์จาก OpenAI

### ก่อน (OpenAI)
```python
from openai import OpenAI

client = OpenAI(api_key="sk-proj-...")

def ask_ai(question: str) -> str:
    response = client.responses.create(
        model="gpt-5.5",
        input=question,
    )
    return response.output_text

result = ask_ai("วันนี้อากาศเป็นอย่างไร?")
print(result)
```

### หลัง (เปลี่ยนเป็น Perplexity — แก้แค่ 2 บรรทัด)
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.perplexity.ai/v1",  # <-- เปลี่ยนบรรทัดนี้
    api_key="pplx-xxxxxxxx"                   # <-- และบรรทัดนี้
)

# ส่วนนี้ไม่ต้องแก้เลย!
def ask_ai(question: str) -> str:
    response = client.responses.create(
        model="openai/gpt-5.5",  # เพิ่ม "openai/" นำหน้าชื่อโมเดล
        input=question,
    )
    return response.output_text

result = ask_ai("วันนี้อากาศเป็นอย่างไร?")
print(result)
```

---

## การใช้กับ LangChain และ Framework อื่นๆ

Framework ที่ใช้ OpenAI SDK เป็นฐาน (เช่น LangChain, LlamaIndex) สามารถใช้ Perplexity ได้โดยตั้งค่า:

```python
from langchain_openai import ChatOpenAI

# ใช้ Perplexity ผ่าน LangChain
llm = ChatOpenAI(
    openai_api_base="https://api.perplexity.ai/v1",
    openai_api_key="pplx-xxxxxxxx",
    model_name="openai/gpt-5.1"
)

# ใช้งานได้เหมือน ChatOpenAI ปกติ
response = llm.invoke("อธิบาย Perplexity AI")
```

---

## สรุป

- Perplexity รองรับ OpenAI SDK อย่างสมบูรณ์ เปลี่ยนแค่ `base_url` และ `api_key`
- ใช้ `/v1/responses` หรือ `/v1/agent` ก็ได้ ผลลัพธ์เหมือนกัน
- ฟีเจอร์พิเศษของ Perplexity (Presets, Model Fallback) ส่งผ่าน `extra_body` เมื่อใช้ OpenAI SDK
- สำหรับโปรเจกต์ใหม่แนะนำ Native Perplexity SDK เพื่อ Type Safety และฟีเจอร์เต็ม
