---
title: "Batch API — ประมวลผลปริมาณมากราคาถูก 50%"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "ใช้ Message Batches API เพื่อส่ง request จำนวนมากแบบ async ราคาถูกลง 50% เหมาะสำหรับ evaluation, content generation และ data processing ขนาดใหญ่"
readTime: "8 นาที"
readers: "0"
locked: false
order: 15
---

## Batch API คืออะไร?

**Message Batches API** (API สำหรับส่งคำขอเป็นชุด) เป็นวิธีส่ง request (คำขอ) หลายพันรายการพร้อมกันแบบ **asynchronous** (อะซิงโครนัส — ไม่ต้องรอผลทีละอัน แต่ส่งทั้งหมดแล้วค่อยรับผลทีหลัง) โดยได้รับ **ส่วนลด 50%** ทั้ง input และ output tokens (ชิ้นส่วนข้อความ)

แทนที่จะส่ง 1,000 request ทีละอัน (และรอผลแต่ละอัน) คุณสามารถส่งทั้งหมดในครั้งเดียว รอ 1 ชั่วโมงหรือน้อยกว่า แล้วดึงผลลัพธ์ทั้งหมดมาพร้อมกัน

---

## เหมาะกับงานแบบไหน?

### ใช้ Batch API เมื่อ:
- **ไม่ต้องการ real-time response** (การตอบกลับทันที) เช่น ประมวลผลกลางคืน
- **ปริมาณมาก** — classification (การจำแนกหมวดหมู่), extraction (การดึงข้อมูล) หลายพัน/หมื่นรายการ
- **Cost-sensitive** — งานที่ต้องการประหยัดต้นทุนสูงสุด
- **Evaluation/Testing** — รัน test suite (ชุดทดสอบ) ขนาดใหญ่
- **Content generation** (การสร้างเนื้อหา) — สร้างเนื้อหาจำนวนมากล่วงหน้า

### ไม่เหมาะกับ:
- Chatbot / interactive applications (แอปที่ผู้ใช้โต้ตอบโดยตรง)
- งานที่ต้องการ response ภายใน 10 วินาที
- Sequential tasks (งานที่ต้องทำตามลำดับ) ที่ขึ้นกัน (ผลลัพธ์ step 1 ต้องใช้ใน step 2)

---

## ราคา Batch API

| โมเดล | Standard Input | **Batch Input** | Standard Output | **Batch Output** |
|-------|---------------|----------------|-----------------|-----------------|
| Opus 4.8 | $5/MTok | **$2.50/MTok** | $25/MTok | **$12.50/MTok** |
| Sonnet 4.6 | $3/MTok | **$1.50/MTok** | $15/MTok | **$7.50/MTok** |
| Haiku 4.5 | $1/MTok | **$0.50/MTok** | $5/MTok | **$2.50/MTok** |

---

## วิธีใช้งาน

### ขั้นตอนที่ 1: สร้าง Batch

ส่ง request หลายรายการพร้อมกัน แต่ละรายการมี `custom_id` (รหัสที่คุณกำหนดเพื่อระบุแต่ละรายการ) ที่ unique:

```python
import anthropic

client = anthropic.Anthropic()

# เตรียม batch requests
requests = [
    {
        "custom_id": "review-001",
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [
                {
                    "role": "user",
                    "content": "จำแนก sentiment (ความรู้สึก): 'อาหารอร่อยมาก ชอบมากเลย!' ตอบแค่ positive/negative/neutral"
                }
            ]
        }
    },
    {
        "custom_id": "review-002",
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [
                {
                    "role": "user",
                    "content": "จำแนก sentiment: 'รอนานมาก บริการแย่' ตอบแค่ positive/negative/neutral"
                }
            ]
        }
    },
    {
        "custom_id": "review-003",
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [
                {
                    "role": "user",
                    "content": "จำแนก sentiment: 'ราคาโอเค ของโอเค' ตอบแค่ positive/negative/neutral"
                }
            ]
        }
    }
]

# ส่ง batch
batch = client.messages.batches.create(requests=requests)
print(f"Batch ID: {batch.id}")
print(f"Status: {batch.processing_status}")
```

### ขั้นตอนที่ 2: ตรวจสอบ Status

```python
import time

# Poll (ถามซ้ำเป็นระยะ) จนกว่าจะเสร็จ
while True:
    batch = client.messages.batches.retrieve(batch.id)
    
    print(f"Status: {batch.processing_status}")
    print(f"Completed: {batch.request_counts.succeeded}")
    print(f"Failed: {batch.request_counts.errored}")
    
    if batch.processing_status == "ended":
        break
    
    time.sleep(60)  # รอ 1 นาทีก่อนถามใหม่
```

### ขั้นตอนที่ 3: ดึงผลลัพธ์

```python
# ดึง results ทั้งหมด
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        custom_id = result.custom_id
        message = result.result.message
        text = message.content[0].text
        print(f"{custom_id}: {text}")
    
    elif result.result.type == "errored":
        print(f"{result.custom_id}: ERROR - {result.result.error}")
```

### ผลลัพธ์ที่คาดหวัง:
```
review-001: positive
review-002: negative
review-003: neutral
```

---

## ตัวอย่างจริง: ประมวลผล CSV ขนาดใหญ่

```python
import anthropic
import csv
import json
import time

client = anthropic.Anthropic()

def process_reviews_batch(csv_file: str) -> dict:
    """
    รับไฟล์ CSV (รูปแบบไฟล์ข้อมูลตาราง — แต่ละช่องคั่นด้วยจุลภาค) ที่มีคอลัมน์ 'id' และ 'review'
    ส่งไป batch sentiment analysis (วิเคราะห์ความรู้สึกจากข้อความเป็นชุด)
    คืน dict ของผลลัพธ์ {id: sentiment}
    """
    
    # อ่าน CSV
    requests = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            requests.append({
                "custom_id": row['id'],
                "params": {
                    "model": "claude-haiku-4-5",
                    "max_tokens": 50,
                    "messages": [
                        {
                            "role": "user",
                            "content": f"Sentiment (positive/negative/neutral): {row['review']}"
                        }
                    ]
                }
            })
    
    print(f"Submitting {len(requests)} requests...")
    batch = client.messages.batches.create(requests=requests)
    print(f"Batch created: {batch.id}")
    
    # รอผลลัพธ์
    while True:
        batch = client.messages.batches.retrieve(batch.id)
        progress = batch.request_counts.succeeded + batch.request_counts.errored
        print(f"Progress: {progress}/{len(requests)}")
        
        if batch.processing_status == "ended":
            break
        time.sleep(30)
    
    # รวบรวมผลลัพธ์
    results = {}
    for result in client.messages.batches.results(batch.id):
        if result.result.type == "succeeded":
            sentiment = result.result.message.content[0].text.strip().lower()
            results[result.custom_id] = sentiment
        else:
            results[result.custom_id] = "error"
    
    return results
```

---

## ข้อจำกัดและ Limits

| ข้อจำกัด | ค่า |
|---------|-----|
| Requests สูงสุดต่อ batch | 100,000 requests |
| ขนาดไฟล์ batch สูงสุด | 256 MB |
| เวลาประมวลผล | ส่วนใหญ่ < 1 ชั่วโมง |
| ผลลัพธ์เก็บไว้ | 29 วัน |

---

## Status ของ Batch

| Status | ความหมาย |
|--------|---------|
| `in_progress` | กำลังประมวลผล |
| `ended` | เสร็จแล้ว (อาจมีบาง request ที่ error) |
| `canceling` | กำลังยกเลิก |
| `canceled` | ยกเลิกแล้ว |

### Request Counts

```python
batch = client.messages.batches.retrieve(batch_id)
counts = batch.request_counts
print(f"Processing: {counts.processing}")
print(f"Succeeded: {counts.succeeded}")
print(f"Errored: {counts.errored}")
print(f"Canceled: {counts.canceled}")
print(f"Expired: {counts.expired}")
```

---

## Result Types

แต่ละ result ใน batch มี type ดังนี้:

| Result Type | ความหมาย |
|------------|---------|
| `succeeded` | สำเร็จ มี `message` object |
| `errored` | เกิด error มี `error` object |
| `canceled` | ถูกยกเลิก |
| `expired` | หมดเวลา (เกิน 29 วัน) |

---

## Extended Output สำหรับ Batch

สำหรับ Claude Opus และ Sonnet 4.6 รองรับ output สูงถึง 300k tokens (ชิ้นส่วนข้อความ 300,000 ชิ้น) ต่อ request:

```python
requests = [
    {
        "custom_id": "long-doc-001",
        "params": {
            "model": "claude-opus-4-8",
            "max_tokens": 300000,  # 300k tokens!
            "messages": [{"role": "user", "content": "เขียนรายงานยาวๆ..."}]
        }
    }
]

batch = client.messages.batches.create(
    requests=requests,
    # ต้องใส่ beta header (ส่วนหัวระบุว่าใช้ฟีเจอร์ทดสอบ) สำหรับ extended output
    betas=["output-300k-2026-03-24"]
)
```

---

## การยกเลิก Batch

```python
# ยกเลิก batch ที่ยังประมวลผลอยู่
batch = client.messages.batches.cancel(batch_id)
print(f"Status: {batch.processing_status}")
```

---

## การ List Batches

```python
# ดูรายการ batches ทั้งหมด
batches = client.messages.batches.list()
for batch in batches.data:
    print(f"{batch.id}: {batch.processing_status} ({batch.request_counts.succeeded} succeeded)")
```

---

## Best Practices

### 1. ใช้ Custom IDs ที่มีความหมาย

```python
# ไม่ดี
"custom_id": "req_1234"

# ดี
"custom_id": "user-123-review-2025-06-10-001"
```

### 2. Handle Errors

ไม่ใช่ทุก request ที่จะสำเร็จ ต้อง handle cases ที่ fail:

```python
for result in client.messages.batches.results(batch_id):
    if result.result.type == "errored":
        # Log และ retry ถ้าจำเป็น
        failed_requests.append(result.custom_id)
```

### 3. แบ่ง Batch ขนาดใหญ่

ถ้ามีมากกว่า 100,000 requests แบ่งออกเป็นหลาย batches

### 4. ดาวน์โหลดผลลัพธ์ภายใน 29 วัน

ผลลัพธ์จะถูกลบหลังจาก 29 วัน ดาวน์โหลดและเก็บไว้ที่ตัวเองก่อน

### 5. ใช้ Haiku สำหรับงาน Simple

สำหรับ classification (จำแนกหมวดหมู่) หรือ extraction (ดึงข้อมูล) ง่ายๆ ใช้ Haiku ประหยัดได้มากที่สุด

---

## เปรียบเทียบ Standard vs Batch

| ด้าน | Standard API | Batch API |
|------|-------------|----------|
| Response time (เวลารอผล) | Real-time (ทันที) | 1 ชั่วโมง+ |
| ราคา | 100% | 50% |
| Max concurrent (จำนวนที่ส่งพร้อมกันได้) | Rate limited | 100k requests |
| เหมาะกับ | Interactive (โต้ตอบสด) | Bulk processing (ประมวลผลจำนวนมาก) |
| Complexity (ความซับซ้อน) | ง่าย | ปานกลาง |

---

## สรุป

Batch API เหมาะสำหรับ:

1. **Sentiment analysis** (การวิเคราะห์ความรู้สึก) ของ reviews/ความคิดเห็นปริมาณมาก
2. **Data extraction** (การดึงข้อมูล) จากเอกสารหลายพันชิ้น
3. **Translation** (การแปลภาษา) ของเนื้อหาจำนวนมาก
4. **Evaluation/Testing** ของ prompt (คำสั่งสำหรับ AI) หรือโมเดล
5. **Content generation** (การสร้างเนื้อหา) ที่เตรียมล่วงหน้า

ด้วยการประหยัด 50% Batch API เป็นวิธีที่คุ้มค่าที่สุดสำหรับงาน AI ขนาดใหญ่ที่ไม่ต้องการ real-time response
