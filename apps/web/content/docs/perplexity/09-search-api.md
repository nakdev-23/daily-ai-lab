---
title: "Search API — ค้นหาเว็บแบบ Raw"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "Search API ให้ผลการค้นหาเว็บแบบดิบ (ลิงก์ + สรุปสั้น) เหมาะสำหรับนักพัฒนาที่ต้องการข้อมูลดิบเพื่อประมวลผลต่อ"
readTime: "7 นาที"
readers: "0"
locked: false
order: 9
---

# Search API — ค้นหาเว็บแบบ Raw

**Search API** (API ค้นหา) ของ Perplexity แตกต่างจาก Agent API ตรงที่ **ไม่มี AI สรุปคำตอบ** — แต่ให้ผลลัพธ์การค้นหาเป็นรายการลิงก์ชื่อเรื่อง และตัวอย่างข้อความโดยตรง เหมาะสำหรับนักพัฒนาที่ต้องการนำข้อมูลดิบ (Raw Data — ข้อมูลที่ยังไม่ผ่านการสรุปหรือประมวลผล) ไปใช้ในระบบของตัวเอง

---

## Endpoint

```
POST https://api.perplexity.ai/v1/search
```

---

## ทำไมต้องใช้ Search API?

| ต้องการ | ใช้ |
|---|---|
| คำตอบสรุปจาก AI + แหล่งอ้างอิง | Agent API หรือ Sonar API |
| รายการลิงก์และ Snippet แบบดิบ | Search API |
| สร้างระบบค้นหาเองและต้องการ Index ดิบ | Search API |
| ประมวลผลผลลัพธ์เองก่อนแสดงผู้ใช้ | Search API |

---

## ตัวอย่างการใช้งาน

### Python — การค้นหาพื้นฐาน
```python
from perplexityai import Perplexity

client = Perplexity()

results = client.search.create(
    query="AI tools for Thai businesses 2026",  # คำค้นหา
    num_results=10  # จำนวนผลลัพธ์ (1-20, ค่าเริ่มต้น 10)
)

for result in results.results:
    print(f"ชื่อ: {result.title}")
    print(f"URL: {result.url}")
    print(f"สรุป: {result.snippet}")
    print(f"วันที่: {result.date}")
    print("---")
```

### TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const results = await client.search.create({
  query: "AI tools for Thai businesses 2026",
  num_results: 10,
});

results.results.forEach((result) => {
  console.log(`${result.title}: ${result.url}`);
});
```

---

## โครงสร้างผลลัพธ์ (Response Structure)

แต่ละผลลัพธ์ใน `results` array มีข้อมูลดังนี้:

```json
{
  "results": [
    {
      "title": "ชื่อบทความหรือหน้าเว็บ",
      "url": "https://example.com/article",
      "snippet": "ตัวอย่างข้อความ 1-3 ประโยคจากเว็บไซต์...",
      "date": "2026-05-15",
      "last_updated": "2026-06-01"
    }
  ],
  "query": "คำค้นหาที่ส่งไป",
  "total_results": 847000
}
```

| Field | ความหมาย |
|---|---|
| `title` | ชื่อหน้าเว็บหรือบทความ |
| `url` | ลิงก์เต็มของหน้าเว็บ |
| `snippet` | ตัวอย่างข้อความสั้นๆ จากหน้าเว็บ |
| `date` | วันที่เผยแพร่ (ถ้ามี) |
| `last_updated` | วันที่อัปเดตล่าสุด (ถ้ามี) |

---

## การกรองผลลัพธ์

### กรองตามภูมิภาค (Country Filter)
```python
results = client.search.create(
    query="ราคาที่ดินกรุงเทพ 2026",
    country="TH",  # ISO country code — TH = ประเทศไทย
    num_results=10
)
```

### กรองตามโดเมน (Domain Filter)
```python
results = client.search.create(
    query="บทความ AI",
    search_domain_filter=[
        "thairath.co.th",         # อนุญาตเฉพาะโดเมนนี้
        "bangkokpost.com",
        "-pantip.com"             # บล็อกโดเมนนี้ (ใส่ - นำหน้า)
    ],
    num_results=10
)
```

กฎการกรองโดเมน:
- ใส่โดเมนปกติ = อนุญาตเฉพาะโดเมนนั้น (**Allowlist** — รายการที่อนุญาต)
- ใส่ `-domain.com` = บล็อกโดเมนนั้น (**Denylist** — รายการที่ปฏิเสธ)
- ใส่ได้สูงสุด 20 โดเมนต่อ Request

### กรองตามภาษา (Language Filter)
```python
results = client.search.create(
    query="artificial intelligence news",
    search_language_filter=["th", "en"],  # ISO 639-1 language codes
    num_results=10
)
```

รหัสภาษาที่ใช้บ่อย: `th` (ไทย), `en` (อังกฤษ), `zh` (จีน), `ja` (ญี่ปุ่น), `ko` (เกาหลี)

---

## การค้นหาหลายคำพร้อมกัน (Multi-Query Search)

ส่งคำค้นหาสูงสุด 5 คำในครั้งเดียว:

```python
results = client.search.create(
    queries=[  # ใช้ queries (พหูพจน์) แทน query
        "AI startup Thailand 2026",
        "venture capital Southeast Asia AI",
        "Thai tech unicorn companies",
        "AI regulation Thailand"
    ],
    num_results=5  # จำนวนผลต่อคำค้นหา
)

# ผลลัพธ์แยกตามแต่ละคำค้นหา
for i, query_results in enumerate(results.results_per_query):
    print(f"\nผลลัพธ์สำหรับ Query #{i+1}:")
    for result in query_results:
        print(f"  - {result.title}")
```

---

## การควบคุม Content Budget (งบประมาณเนื้อหา)

**Content Budget** (งบประมาณเนื้อหา — จำนวน Token สูงสุดที่ดึงเนื้อหาจากแต่ละหน้า) ช่วยควบคุม Token ที่ใช้และค่าใช้จ่าย:

```python
# วิธีที่ 1: ใช้ Preset ที่กำหนดไว้
results = client.search.create(
    query="AI technology trends",
    search_context_size="high"  # low / medium / high
)

# วิธีที่ 2: ระบุ Token เอง (ละเอียดกว่า)
results = client.search.create(
    query="AI technology trends",
    max_tokens=50000,           # Token รวมทั้งหมด
    max_tokens_per_page=5000    # Token ต่อหน้าเว็บ
)
# หมายเหตุ: ใช้ search_context_size หรือ max_tokens ได้ แต่ไม่ใช้พร้อมกัน
```

| search_context_size | เหมาะกับ |
|---|---|
| `low` | ต้องการสรุปสั้น ประหยัด Token |
| `medium` | ข้อมูลพอสมควร (ค่าเริ่มต้น) |
| `high` | ต้องการเนื้อหาละเอียด เต็มๆ |

---

## ราคา Search API

- **$5.00 ต่อ 1,000 Requests** (คำขอ)
- ไม่มีค่า Token เพิ่มเติม (ต่างจาก Agent API)
- ไม่ต้องสมัคร Subscription (สมาชิก) เพิ่ม จ่ายตามที่ใช้

**ตัวอย่างการคำนวณ:**
- ค้นหา 100 ครั้งต่อวัน × 30 วัน = 3,000 Requests
- 3,000 × ($5/1,000) = **$15 ต่อเดือน**

---

## Best Practices สำหรับ Search API

### 1. ใช้คำค้นหาที่เจาะจง
```python
# คลุมเครือ
query = "AI"

# เจาะจง
query = "large language model performance benchmark 2026 comparison"
```

### 2. Implement Retry ด้วย Exponential Backoff
**Exponential Backoff** (การรอนานขึ้นเรื่อยๆ เมื่อเกิด Error — ป้องกันการ Request ซ้ำถี่เกินไป):

```python
import time
import random
from perplexityai import Perplexity, RateLimitError

def search_with_retry(client, query, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.search.create(query=query)
        except RateLimitError:
            if attempt < max_retries - 1:
                # รอนานขึ้นเรื่อยๆ: 1s, 2s, 4s + ความสุ่มเล็กน้อย
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
    raise Exception("ค้นหาไม่สำเร็จหลังจากลอง 3 ครั้ง")
```

### 3. ใช้ Async สำหรับงานหลายคำค้นหา
```python
import asyncio
from perplexityai import AsyncPerplexity

async def search_multiple(queries):
    client = AsyncPerplexity()
    tasks = [client.search.create(query=q) for q in queries]
    results = await asyncio.gather(*tasks)
    return results
```

---

## สรุป

Search API เหมาะสำหรับ:
- สร้าง Custom Search Engine (เครื่องมือค้นหาที่ปรับแต่งเอง) โดยใช้ index ของ Perplexity
- ดึงข้อมูลดิบเพื่อประมวลผลด้วยโมเดล AI ของตัวเอง
- สร้างระบบ News Aggregator (รวบรวมข่าว)
- Research Tools ที่ต้องการผลลัพธ์หลายแหล่งพร้อมกัน
- ราคาคงที่ง่ายต่อการวางแผนงบประมาณ ($5/1,000 requests)
