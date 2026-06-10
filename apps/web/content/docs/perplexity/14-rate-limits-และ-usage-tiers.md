---
title: "Rate Limits และ Usage Tiers"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "ข้อจำกัดในการเรียกใช้ API ระดับการใช้งาน และวิธีจัดการ Rate Limit อย่างมืออาชีพในแอปพลิเคชัน"
readTime: "6 นาที"
readers: "0"
locked: false
order: 14
---

# Rate Limits และ Usage Tiers

**Rate Limits** (ขีดจำกัดอัตราการเรียก — จำนวนสูงสุดที่เรียก API ได้ในช่วงเวลาหนึ่ง) เป็นมาตรการที่ Perplexity ใช้เพื่อให้บริการมีเสถียรภาพสำหรับผู้ใช้ทุกคน การเข้าใจและจัดการ Rate Limits อย่างถูกต้องเป็นทักษะสำคัญสำหรับนักพัฒนา

---

## Usage Tiers (ระดับการใช้งาน)

**Usage Tier** (ระดับการใช้งาน — ระดับที่กำหนดว่าคุณเรียก API ได้มากแค่ไหน) จะเพิ่มขึ้นอัตโนมัติตามปริมาณการใช้งานและประวัติการจ่ายเงิน

| Tier | เงื่อนไข | Rate Limit ตัวอย่าง |
|---|---|---|
| Tier 1 (เริ่มต้น) | สมัครใหม่ | จำกัดสูง (ทดสอบ) |
| Tier 2 | ใช้งานสม่ำเสมอ + จ่ายเงินตรงเวลา | เพิ่มขึ้น |
| Tier 3 | ยอดใช้สูงขึ้น | เพิ่มขึ้นอีก |
| Enterprise | ติดต่อทีมขาย | ไม่มีขีดจำกัด (Custom) |

> **หมายเหตุ:** ดู Rate Limits ปัจจุบันของ API Key ของคุณได้ที่ [console.perplexity.ai](https://console.perplexity.ai) ในหน้า API Keys เนื่องจากตัวเลขอาจเปลี่ยนแปลงตาม Tier และนโยบายปัจจุบัน

---

## ประเภทของ Rate Limits

### RPM (Requests Per Minute)
จำนวน Request สูงสุดที่ส่งได้ใน 1 นาที

### RPD (Requests Per Day)
จำนวน Request สูงสุดที่ส่งได้ใน 1 วัน (24 ชั่วโมง)

### TPM (Tokens Per Minute)
จำนวน Token สูงสุดที่ประมวลผลได้ใน 1 นาที (Input + Output รวมกัน)

---

## Error Code เมื่อ Rate Limit

เมื่อเกินขีดจำกัด API จะส่ง HTTP 429 กลับมา:

```json
{
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded. Please wait before retrying.",
    "retry_after": 30  // วินาทีที่ต้องรอ
  }
}
```

---

## การจัดการ Rate Limits ใน Code

### วิธีที่ 1 — Exponential Backoff (รอนานขึ้นเรื่อยๆ)

**Exponential Backoff** (การถอยถอน — รอนานขึ้นทุกครั้งที่ Request ล้มเหลว ป้องกันการ Spam Server):

```python
import time
import random
from perplexityai import Perplexity, RateLimitError, APIStatusError

client = Perplexity()

def call_with_backoff(func, max_retries=5):
    """เรียก API โดยมีการลองซ้ำแบบ Exponential Backoff"""
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise  # ลองครบแล้วยังไม่ได้ ส่ง Error ต่อไป
            
            # คำนวณเวลารอ: 1s, 2s, 4s, 8s, 16s + ความสุ่มเล็กน้อย (Jitter)
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limit hit. รอ {wait_time:.1f} วินาที... (ครั้งที่ {attempt+1})")
            time.sleep(wait_time)
        except APIStatusError as e:
            if e.status_code == 429:  # HTTP 429 = Too Many Requests
                wait_time = int(e.response.headers.get("Retry-After", 30))
                time.sleep(wait_time)
            else:
                raise

# การใช้งาน
result = call_with_backoff(
    lambda: client.agent.create(preset="pro-search", input="คำถาม")
)
```

### วิธีที่ 2 — Semaphore สำหรับงาน Concurrent (ทำพร้อมกันหลายอัน)

**Semaphore** (สัญญาณควบคุม — จำกัดจำนวนงานที่ทำพร้อมกันได้):

```python
import asyncio
from perplexityai import AsyncPerplexity

async def search_many(queries, max_concurrent=5):
    """ค้นหาพร้อมกัน แต่จำกัดไม่เกิน 5 Request พร้อมกัน"""
    client = AsyncPerplexity()
    semaphore = asyncio.Semaphore(max_concurrent)  # อนุญาต 5 พร้อมกัน
    
    async def search_one(query):
        async with semaphore:  # รอให้มีที่ว่างก่อนส่ง Request
            return await client.search.create(query=query)
    
    tasks = [search_one(q) for q in queries]
    results = await asyncio.gather(*tasks)
    return results

# ค้นหา 50 คำพร้อมกัน แต่ส่งได้แค่ 5 Request พร้อมกัน
queries = [f"AI topic {i}" for i in range(50)]
results = asyncio.run(search_many(queries))
```

### วิธีที่ 3 — Rate Limiter แบบ Token Bucket

**Token Bucket** (ถังโทเคน — เทคนิควัดอัตราการส่ง Request ให้ไม่เกินขีดจำกัด):

```python
import time

class RateLimiter:
    """จำกัดการเรียก API ไม่เกิน X ครั้งต่อนาที"""
    
    def __init__(self, max_requests_per_minute):
        self.max_rpm = max_requests_per_minute
        self.min_interval = 60.0 / max_requests_per_minute  # วินาทีต่อ request
        self.last_request_time = 0
    
    def wait_if_needed(self):
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        if elapsed < self.min_interval:
            sleep_time = self.min_interval - elapsed
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()

# การใช้งาน
limiter = RateLimiter(max_requests_per_minute=50)

for query in large_query_list:
    limiter.wait_if_needed()  # รอถ้าจำเป็น
    result = client.search.create(query=query)
```

---

## การตรวจสอบ Usage ปัจจุบัน

Response ของ API มีข้อมูล Header ที่บอก Rate Limit ปัจจุบัน:

```python
import httpx  # HTTP Client

response = httpx.post(
    "https://api.perplexity.ai/v1/search",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"query": "test"}
)

# ดู Rate Limit จาก Response Headers
print(response.headers.get("x-ratelimit-limit-requests"))    # ขีดจำกัด
print(response.headers.get("x-ratelimit-remaining-requests"))  # คงเหลือ
print(response.headers.get("x-ratelimit-reset-requests"))      # เวลา Reset
```

---

## แนวทางปฏิบัติที่ดี (Best Practices)

### 1. ไม่ต้อง Poll แบบต่อเนื่อง
```python
# ไม่แนะนำ — Spam API ทำให้โดน Rate Limit
while True:
    result = client.search.create(query="latest news")
    time.sleep(1)  # รอแค่ 1 วินาที ยังเร็วเกินไป

# แนะนำ — ใช้ Webhook หรือ Scheduled Job
# รันทุก 15 นาที ด้วย cron job แทน
```

### 2. Cache ผลลัพธ์
```python
import functools
import time

cache = {}
CACHE_TTL = 300  # 5 นาที

def cached_search(query):
    """Cache ผลลัพธ์ 5 นาที ถ้าถามคำเดิมซ้ำ"""
    cache_key = query.lower().strip()
    
    if cache_key in cache:
        result, timestamp = cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            return result  # คืน Cache
    
    result = client.search.create(query=query)  # เรียก API จริง
    cache[cache_key] = (result, time.time())
    return result
```

### 3. ใช้ Batch สำหรับงานหลายชิ้น
```python
# ไม่แนะนำ — ส่งทีละอัน
for doc in documents:
    embedding = client.embeddings.create(model="pplx-embed-v1-0.6b", input=[doc])

# แนะนำ — Batch สูงสุด 512 ชิ้นต่อ Request
BATCH_SIZE = 512
for i in range(0, len(documents), BATCH_SIZE):
    batch = documents[i:i+BATCH_SIZE]
    embeddings = client.embeddings.create(model="pplx-embed-v1-0.6b", input=batch)
```

---

## สรุป

- Rate Limits แบ่งตาม Tier และเพิ่มขึ้นตามประวัติการใช้งาน
- ใช้ **Exponential Backoff** เมื่อเจอ HTTP 429
- ใช้ **Semaphore** สำหรับงาน Concurrent เพื่อควบคุมจำนวน Request พร้อมกัน
- **Cache** ผลลัพธ์เพื่อลดการเรียก API ที่ไม่จำเป็น
- **Batch** งานหลายชิ้นในครั้งเดียวเมื่อทำได้ (เช่น Embeddings)
- ตรวจสอบ Rate Limit ปัจจุบันที่ console.perplexity.ai
