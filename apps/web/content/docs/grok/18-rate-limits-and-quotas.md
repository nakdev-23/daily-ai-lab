---
title: "Rate Limits & Quotas — ขีดจำกัดและโควต้าการใช้งาน API"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "เข้าใจ Rate Limits ของ xAI API จัดการ Error 429 ด้วย Exponential Backoff และออกแบบแอปให้รองรับขีดจำกัดได้อย่างถูกต้อง"
readTime: "5 นาที"
readers: "0"
locked: false
order: 18
---
# Rate Limits & Quotas — ขีดจำกัดและโควต้าการใช้งาน API

> อ้างอิง: [xAI API Reference](https://docs.x.ai/api-reference) | [Batch API](https://docs.x.ai/docs)

---

## Rate Limits คืออะไร?

**Rate Limits** (ขีดจำกัดจำนวนคำขอ — จำกัดว่าใน 1 นาทีส่งคำขอได้กี่ครั้ง) คือขีดจำกัดจำนวน Request (คำขอ) ที่สามารถส่งไปยัง API ได้ในช่วงเวลาหนึ่ง xAI ใช้ Rate Limits เพื่อ:

- รักษาเสถียรภาพของบริการสำหรับทุกคน
- ป้องกัน Abuse (การใช้งานในทางที่ผิด)
- จัดการทรัพยากร GPU (หน่วยประมวลผลกราฟิก — ใช้รัน AI) อย่างยุติธรรม

---

## ประเภทของ Rate Limits

xAI วัด Rate Limits หลายมิติพร้อมกัน:

| ประเภท | หน่วยวัด | คำอธิบาย |
|---|---|---|
| **RPM** (Requests Per Minute — จำนวนคำขอต่อนาที) | จำนวน Request | สูงสุดกี่ Request ต่อนาที |
| **TPM** (Tokens Per Minute — จำนวน token ต่อนาที) | จำนวน Token | สูงสุดกี่ Token ต่อนาที |
| **RPD** (Requests Per Day — จำนวนคำขอต่อวัน) | จำนวน Request | สูงสุดกี่ Request ต่อวัน |
| **TPD** (Tokens Per Day — จำนวน token ต่อวัน) | จำนวน Token | สูงสุดกี่ Token ต่อวัน |

> **หมายเหตุ:** Limit จริงขึ้นอยู่กับ Plan และ Model ตรวจสอบได้ที่ [console.x.ai](https://console.x.ai/)

---

## HTTP Error Codes

**HTTP Error Codes** (รหัสข้อผิดพลาดมาตรฐาน — ตัวเลขที่บอกว่าเกิดอะไรผิดพลาด):

| Code | ชื่อ | สาเหตุ | วิธีแก้ |
|---|---|---|---|
| `400` | Bad Request | Parameters ไม่ถูกต้อง | ตรวจสอบ request body |
| `401` | Unauthorized | API Key ไม่ถูกต้องหรือหมดอายุ | ตรวจสอบ API Key |
| `403` | Forbidden | ไม่มีสิทธิ์ใช้ feature นี้ | ตรวจสอบ Plan / สิทธิ์ |
| `404` | Not Found | Model หรือ Endpoint (ที่อยู่ปลายทาง) ไม่มี | ตรวจสอบชื่อ Model |
| `422` | Unprocessable Entity | Schema ไม่ถูกต้อง | ตรวจสอบ JSON Schema |
| `429` | Too Many Requests | เกิน Rate Limit | รอแล้วลองใหม่ |
| `500` | Internal Server Error | ข้อผิดพลาดฝั่ง xAI | ลองใหม่ใน 1–2 นาที |
| `503` | Service Unavailable | ระบบ Overload (รับงานเกินกำลัง) | รอแล้วลองใหม่ |

---

## จัดการ Rate Limit (Error 429)

### วิธีที่ 1: Exponential Backoff (แนะนำมาก)

**Exponential Backoff** (การรอนานขึ้นเรื่อยๆ แบบทวีคูณ — เช่น รอ 1 วิ, 2 วิ, 4 วิ, 8 วิ แทนที่จะรอเท่ากันทุกครั้ง):

```python
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

def call_with_backoff(messages: list, max_retries: int = 5) -> str:
    """เรียก API พร้อม Exponential Backoff"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="grok-4.3",
                messages=messages,
            )
            return response.choices[0].message.content
            
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise  # ลองครบแล้ว throw error
            
            # คำนวณเวลารอ: 2^attempt + random jitter (ค่าสุ่มเล็กน้อย — ป้องกันทุกคนลองพร้อมกัน)
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limit! รอ {wait_time:.1f} วินาที... (ครั้งที่ {attempt + 1}/{max_retries})")
            time.sleep(wait_time)

# ใช้งาน
result = call_with_backoff([
    {"role": "user", "content": "อธิบาย Rate Limiting"}
])
print(result)
```

### วิธีที่ 2: ใช้ Library tenacity

**tenacity** (ไลบรารี Python สำหรับลองซ้ำอัตโนมัติเมื่อเกิดข้อผิดพลาด):

```python
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
from openai import RateLimitError

@retry(
    retry=retry_if_exception_type(RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def call_grok(prompt: str) -> str:
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
```

### วิธีที่ 3: ตรวจสอบ Headers

**Headers** (ส่วนหัวของ HTTP response — บรรจุข้อมูลเพิ่มเติม เช่น จำนวน request ที่เหลือ):

```python
import httpx

# ใช้ httpx โดยตรงเพื่อดู headers
response = httpx.post(
    "https://api.x.ai/v1/chat/completions",
    headers={
        "Authorization": f"Bearer YOUR_XAI_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "grok-4.3",
        "messages": [{"role": "user", "content": "สวัสดี"}],
    },
)

# ดู Rate Limit Headers
print(f"X-RateLimit-Limit: {response.headers.get('x-ratelimit-limit-requests')}")
print(f"X-RateLimit-Remaining: {response.headers.get('x-ratelimit-remaining-requests')}")
print(f"X-RateLimit-Reset: {response.headers.get('x-ratelimit-reset-requests')}")
```

---

## หลีกเลี่ยง Rate Limit ด้วยการออกแบบที่ดี

### 1. ใช้ Batch API สำหรับงานจำนวนมาก

**Batch API** (API สำหรับส่งงานจำนวนมากพร้อมกัน — ประมวลผลในพื้นหลัง ไม่นับ Rate Limit):

```python
# แทนที่จะส่ง 1,000 requests แยกกัน
# ใช้ Batch API แทน — ไม่นับ Rate Limit!

batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
)
```

### 2. Token Estimation ก่อนส่ง

**Token Estimation** (การประมาณจำนวน token ก่อนส่ง — ช่วยวางแผนไม่ให้เกิน quota):

```python
import tiktoken

def estimate_tokens(text: str, model: str = "grok-4.3") -> int:
    """ประมาณจำนวน Token ก่อนส่ง"""
    # ใช้ cl100k_base (ระบบนับ token ที่ใช้กับ Grok)
    enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))

# ตรวจสอบก่อนส่ง
prompt = "..." 
estimated = estimate_tokens(prompt)
print(f"คาดว่าใช้ ~{estimated} tokens")
```

### 3. Request Queue + Rate Limiter

**Request Queue** (คิวคำขอ — เรียงลำดับงานเพื่อควบคุมไม่ให้ส่งเร็วเกินไป):

```python
import asyncio
import time
from collections import deque

class RateLimiter:
    def __init__(self, rpm: int = 60):
        self.rpm = rpm
        self.requests = deque()
    
    async def acquire(self):
        now = time.time()
        # ลบ requests ที่เก่ากว่า 60 วินาที
        while self.requests and now - self.requests[0] > 60:
            self.requests.popleft()
        
        if len(self.requests) >= self.rpm:
            # รอจนกว่าจะมีช่อง
            wait = 60 - (now - self.requests[0])
            await asyncio.sleep(wait)
        
        self.requests.append(time.time())

limiter = RateLimiter(rpm=50)  # ตั้งต่ำกว่า limit จริงเล็กน้อย

async def safe_call(prompt: str) -> str:
    await limiter.acquire()
    response = await async_client.chat.completions.create(
        model="grok-4.3",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
```

---

## Batch API Limits

Batch API มี Limits แยกต่างหาก:

| ขีดจำกัด | ค่า |
|---|---|
| สร้าง Batch ได้สูงสุด | 2 batches/วินาที/team |
| เพิ่ม requests ต่อ batch | 1,000 calls/30 วินาที |
| ขนาด payload (ข้อมูลที่ส่ง) ต่อ request | 25 MB |
| ขนาดไฟล์ upload สูงสุด | 200 MB |
| requests ต่อไฟล์ | 50,000 |

---

## ตรวจสอบ Usage และ Limits

**Usage** (การใช้งาน — สรุปว่าใช้ token ไปเท่าไหร่แล้ว):

ดู Usage ปัจจุบันได้ที่ Console:

1. ไปที่ [console.x.ai](https://console.x.ai/)
2. เลือก **Settings** → **API Keys**
3. ดู Usage Dashboard (หน้าสรุปการใช้งาน)

### ดู Usage จาก Response

```python
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "สวัสดี"}],
)

usage = response.usage
print(f"Prompt tokens: {usage.prompt_tokens}")
print(f"Completion tokens: {usage.completion_tokens}")
print(f"Total tokens: {usage.total_tokens}")
```

---

## สรุป Best Practices

1. **ใช้ Exponential Backoff** เสมอเมื่อได้รับ Error 429
2. **ใช้ Batch API** สำหรับงานไม่เร่งด่วนจำนวนมาก
3. **Monitor Usage** (ติดตามดูการใช้งาน) ผ่าน Console เพื่อไม่ให้เกิน Quota (โควต้า — ปริมาณที่ได้รับสิทธิ์ใช้)
4. **ตั้ง Timeout** ที่เหมาะสมในทุก Request
5. **Log Errors** (บันทึกข้อผิดพลาด) เพื่อ Debug และ Monitor ปัญหา
6. **อย่า Retry ทันที** — รอ Jitter (ค่าสุ่มเล็กน้อย) เสมอเพื่อไม่ให้ thundering herd (ปัญหาเมื่อทุกคนลองซ้ำพร้อมกันจนระบบล่ม)
