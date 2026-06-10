---
title: "Context Caching — ลดต้นทุน API ด้วยการ Cache Context"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Context Caching ช่วยให้นักพัฒนาประหยัดค่า API ได้สูงสุด 75% โดย cache เนื้อหาที่ใช้ซ้ำบ่อย เช่น system prompt ยาว, เอกสาร หรือวิดีโอขนาดใหญ่"
readTime: "8 นาที"
readers: "0"
locked: false
order: 26
---

# Context Caching — ลดต้นทุน API ด้วยการ Cache Context

**Context Caching** (การเก็บบริบทชั่วคราว — เพื่อไม่ต้องส่งข้อมูลซ้ำทุกครั้ง ช่วยลดต้นทุน) คือฟีเจอร์ที่ให้นักพัฒนา "เก็บ" content ที่ใช้ซ้ำบ่อยไว้ล่วงหน้า แทนที่จะส่ง token (ชิ้นส่วนข้อความ) เดิมซ้ำทุก request (คำขอ) ทำให้ประหยัดต้นทุนและเพิ่มความเร็ว

---

## ทำไมต้องใช้ Context Caching?

### ปัญหาที่พบบ่อย

สมมติคุณสร้าง chatbot (บอทสนทนา) ที่ต้องอ่านคู่มือสินค้า 500 หน้าก่อนตอบทุกคำถาม:

```
Request 1: [คู่มือ 500 หน้า = 400,000 tokens] + [คำถาม 50 tokens]
Request 2: [คู่มือ 500 หน้า = 400,000 tokens] + [คำถาม 40 tokens]
Request 3: [คู่มือ 500 หน้า = 400,000 tokens] + [คำถาม 60 tokens]
```

ต้องจ่ายค่า 400,000 tokens ซ้ำทุก request!

### Context Caching แก้ปัญหาอย่างไร

```
ครั้งแรก: Cache [คู่มือ 500 หน้า = 400,000 tokens] → เก็บไว้ 1 ชั่วโมง

Request 1: [Cache ID] + [คำถาม 50 tokens]  → จ่ายแค่ 50 tokens + ค่า cache
Request 2: [Cache ID] + [คำถาม 40 tokens]  → จ่ายแค่ 40 tokens + ค่า cache
Request 3: [Cache ID] + [คำถาม 60 tokens]  → จ่ายแค่ 60 tokens + ค่า cache
```

**ประหยัดได้สูงสุด 75%** สำหรับ Gemini Flash

---

## สองแบบของ Caching (การเก็บชั่วคราว)

### 1. Implicit Caching (เก็บชั่วคราวอัตโนมัติ — ระบบจัดการเอง)
- เปิดโดยอัตโนมัติใน **Gemini 2.5** ขึ้นไป
- **ไม่ต้องตั้งค่าอะไร** — โมเดลจัดการเองทั้งหมด
- ไม่รับประกัน cache hit (การโดนบันทึก) แต่ไม่มีค่าใช้จ่ายเพิ่มเติม
- ต้องการ minimum tokens (จำนวนขั้นต่ำ): **2,048 tokens** (Gemini 2.5 Flash)

### 2. Explicit Caching (เก็บชั่วคราวแบบกำหนดเอง)
- กำหนดว่าจะ cache อะไร
- **รับประกัน** ว่าใช้ cache จริง
- จ่ายค่า storage (ค่าเก็บข้อมูล, ต่อชั่วโมง)
- ควบคุม TTL (Time-To-Live — ระยะเวลาที่ข้อมูลจะถูกเก็บไว้ก่อนหมดอายุ) ได้ (default 1 ชั่วโมง)

---

## การใช้งาน Explicit Caching (Python)

### สร้าง Cache

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# อ่านไฟล์ที่ต้องการ cache
with open("product_manual.pdf", "rb") as f:
    pdf_data = f.read()

# สร้าง cache
cache = client.caches.create(
    model="gemini-2.5-flash",
    config={
        "system_instruction": "คุณเป็นผู้เชี่ยวชาญผลิตภัณฑ์ที่ช่วยลูกค้าในการแก้ไขปัญหา",
        "contents": [
            {
                "parts": [
                    {"inline_data": {"mime_type": "application/pdf", "data": pdf_data}},
                    {"text": "นี่คือคู่มือผลิตภัณฑ์ฉบับสมบูรณ์"}
                ],
                "role": "user"
            }
        ],
        "ttl": "3600s"  # เก็บไว้ 1 ชั่วโมง (หรือกำหนดเป็น "86400s" สำหรับ 1 วัน)
    }
)

print(f"Cache ID: {cache.name}")
# ตัวอย่าง: cachedContents/abc123xyz
```

### ใช้ Cache ใน Request

```python
# ใช้ cache ที่สร้างไว้
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="ขั้นตอนการแก้ไขปัญหาหน้าจอค้างเป็นอย่างไร?",
    config={
        "cached_content": cache.name  # ระบุ cache ID
    }
)

print(response.text)

# ดูจำนวน cached tokens (token ที่ใช้จาก cache) ที่ใช้
print(f"Cached tokens: {response.usage_metadata.cached_content_token_count}")
```

---

## จัดการ Cache

### ดู Cache ที่มีอยู่
```python
# แสดง cache ทั้งหมด
for cache in client.caches.list():
    print(f"Name: {cache.name}")
    print(f"Model: {cache.model}")
    print(f"Expire time: {cache.expire_time}")
    print(f"Token count: {cache.usage_metadata.total_token_count}")
    print("---")
```

### อัปเดต TTL (ขยายอายุการเก็บข้อมูล)
```python
# ขยายเวลา cache ออกไปอีก 2 ชั่วโมง
client.caches.update(
    name=cache.name,
    config={"ttl": "7200s"}
)
```

### ลบ Cache
```python
client.caches.delete(name=cache.name)
```

---

## สิ่งที่ Cache ได้

- **เอกสาร** — PDF, Word, text files (ไฟล์ข้อความ)
- **รูปภาพ** — ภาพหลายภาพพร้อมกัน
- **วิดีโอ** — วิดีโอยาวๆ สำหรับวิเคราะห์ซ้ำ
- **System instructions** (คำสั่งระดับระบบ) — คำแนะนำระบบที่ยาวมาก
- **Code** (โค้ด) — codebase (ชุดโค้ดทั้งหมด) ขนาดใหญ่
- **บทสนทนาก่อนหน้า** — conversation history (ประวัติการสนทนา)

---

## ราคาและการประหยัดต้นทุน

### โครงสร้างราคา

| ส่วน | ราคา |
|---|---|
| **Input tokens (ปกติ)** | ราคาเต็ม |
| **Cached input tokens (token จาก cache)** | ~25% ของราคา input ปกติ |
| **Storage cost (ค่าเก็บข้อมูล)** | คิดต่อ 1 ล้าน tokens ต่อชั่วโมง |
| **Output tokens (token คำตอบ)** | ราคาปกติ (ไม่เปลี่ยน) |

### ตัวอย่างการประหยัด

สมมติคุณส่ง 400,000 tokens เป็น system context (บริบทระบบ) 100 ครั้งต่อวัน:

**ไม่มี Cache:**
- 400,000 × 100 requests = 40,000,000 tokens/วัน (คิดราคาเต็ม)

**มี Cache (1 วัน TTL):**
- 400,000 tokens สร้าง cache ครั้งเดียว
- 100 requests ใช้ cached tokens (คิด 25% ของปกติ)
- **ประหยัดได้ ~75%** ของ input token costs

---

## Minimum Token Requirements (จำนวน token ขั้นต่ำ)

| โมเดล | Minimum tokens สำหรับ cache |
|---|---|
| Gemini 2.5 Flash | 2,048 tokens |
| Gemini 2.5 Pro | 2,048 tokens |
| Gemini 1.5 Flash | 32,768 tokens |
| Gemini 1.5 Pro | 32,768 tokens |

---

## Best Practices (แนวปฏิบัติที่ดีที่สุด)

### 1. ใช้กับ content ที่ใช้ซ้ำจริงๆ
```python
# ดี: เอกสารที่ทุก request ต้องอ่าน
cache_content = "เอกสาร legal 200 หน้า"

# ไม่คุ้ม: content ที่ใช้แค่ครั้งเดียว
# ไม่ควร cache prompt ที่เปลี่ยนทุก request
```

### 2. วาง cached content ไว้ "ก่อน" คำถาม
```
[Cached: system instruction + documents]
[Non-cached: user question]
```

### 3. ตั้ง TTL (อายุการเก็บข้อมูล) ให้เหมาะสม
```python
# เอกสารที่ไม่เปลี่ยนแปลง
ttl = "86400s"   # 24 ชั่วโมง

# เอกสารที่อาจ update บ่อย
ttl = "3600s"    # 1 ชั่วโมง

# Long-running application (แอปที่รันต่อเนื่องนาน)
ttl = "604800s"  # 7 วัน (ค่าสูงสุด)
```

### 4. Monitor cache usage (ติดตามการใช้งาน cache)
```python
# ตรวจสอบว่า cache ถูกใช้จริง
if response.usage_metadata.cached_content_token_count > 0:
    print("✓ Cache hit!")
else:
    print("✗ Cache miss")
```

---

## เมื่อไหรไม่ควรใช้ Explicit Caching

- Content เปลี่ยนแปลงทุก request
- มี request น้อย (ค่า storage ไม่คุ้มกับการประหยัด)
- Content สั้นกว่า minimum token threshold (เกณฑ์จำนวน token ขั้นต่ำ)
- ใช้ Gemini 2.5 แล้ว Implicit Caching ก็เพียงพอ
