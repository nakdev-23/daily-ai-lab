---
title: "Rate Limits และราคา — ขีดจำกัดและค่าใช้จ่าย"
tool: "DALL·E"
icon: "icon-docs"
level: "pro"
summary: "ข้อมูลครบถ้วนเรื่อง Rate Limits ของ DALL·E API จำนวนภาพที่สร้างได้ต่อนาที ราคาต่อภาพแต่ละขนาดและคุณภาพ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 10
---
# Rate Limits และราคา — ขีดจำกัดและค่าใช้จ่าย

> อ้างอิงหลัก: [OpenAI Rate Limits](https://platform.openai.com/docs/guides/rate-limits) | [OpenAI Pricing](https://openai.com/api/pricing)

---

## Rate Limits คืออะไร

**Rate Limits** (ขีดจำกัดอัตราการใช้งาน — จำนวนครั้งสูงสุดที่คุณเรียก API ได้ในช่วงเวลาหนึ่ง เพื่อป้องกันการใช้งานเกินควร) ของ DALL·E API กำหนดว่าในแต่ละนาทีคุณสร้างภาพได้กี่ภาพ

### หน่วยวัด Rate Limits

- **RPM** — Requests Per Minute (จำนวน Request ต่อนาที — นับจำนวนครั้งที่ส่งคำขอไปยัง API ต่อนาที)
- **IPM** — Images Per Minute (จำนวนภาพต่อนาที — นับจำนวนภาพทั้งหมดที่สร้างต่อนาที)

---

## Rate Limits แต่ละโมเดล

### DALL·E 3

| Tier | RPM | IPM |
|---|---|---|
| Free / Trial | 1 RPM | 1 IPM |
| Tier 1 | 5 RPM | 5 IPM |
| Tier 2 | 7 RPM | 7 IPM |
| Tier 3 | 7 RPM | 7 IPM |
| Tier 4 | 15 RPM | 15 IPM |
| Tier 5 | 50 RPM | 50 IPM |

### DALL·E 2

| Tier | RPM | IPM |
|---|---|---|
| Free / Trial | 5 RPM | 5 IPM |
| Tier 1 | 20 RPM | 40 IPM |
| Tier 2 | 40 RPM | 40 IPM |
| Tier 3 | 60 RPM | 60 IPM |
| Tier 4 | 100 RPM | 100 IPM |
| Tier 5 | 200 RPM | 200 IPM |

> **หมายเหตุ:** DALL·E 2 มี Rate Limits สูงกว่า DALL·E 3 เนื่องจาก DALL·E 3 ใช้ทรัพยากรในการสร้างภาพมากกว่า

---

## Tier System (ระบบระดับการเข้าถึง)

OpenAI แบ่งระดับการเข้าถึง API ออกเป็น Tier (ระดับ — กลุ่มผู้ใช้ที่มีสิทธิ์และขีดจำกัดแตกต่างกัน):

| Tier | เงื่อนไขการเลื่อนระดับ |
|---|---|
| Free | สมัครบัญชีใหม่ |
| Tier 1 | ชำระเงินครั้งแรก $5+ |
| Tier 2 | ใช้ API ไปแล้ว $50+ และผ่านไป 7 วันนับจาก Tier 1 |
| Tier 3 | ใช้ API ไปแล้ว $100+ และผ่านไป 7 วันนับจาก Tier 2 |
| Tier 4 | ใช้ API ไปแล้ว $250+ และผ่านไป 14 วันนับจาก Tier 3 |
| Tier 5 | ใช้ API ไปแล้ว $1,000+ และผ่านไป 30 วันนับจาก Tier 4 |

---

## ราคา DALL·E 3

DALL·E 3 คิดราคาตามขนาดและคุณภาพ:

### Standard Quality

| Size | ราคา/ภาพ |
|---|---|
| `1024x1024` | $0.040 |
| `1024x1792` | $0.080 |
| `1792x1024` | $0.080 |

### HD Quality

| Size | ราคา/ภาพ |
|---|---|
| `1024x1024` | $0.080 |
| `1024x1792` | $0.120 |
| `1792x1024` | $0.120 |

---

## ราคา DALL·E 2

DALL·E 2 ถูกกว่า DALL·E 3 มาก:

| Size | ราคา/ภาพ |
|---|---|
| `1024x1024` | $0.020 |
| `512x512` | $0.018 |
| `256x256` | $0.016 |

---

## เปรียบเทียบราคา DALL·E 2 vs DALL·E 3

| โมเดล | Size | Quality | ราคา/ภาพ |
|---|---|---|---|
| DALL·E 2 | 256x256 | - | **$0.016** (ถูกสุด) |
| DALL·E 2 | 512x512 | - | $0.018 |
| DALL·E 2 | 1024x1024 | - | $0.020 |
| DALL·E 3 | 1024x1024 | standard | $0.040 |
| DALL·E 3 | 1024x1792 | standard | $0.080 |
| DALL·E 3 | 1024x1024 | hd | $0.080 |
| DALL·E 3 | 1024x1792 | hd | **$0.120** (แพงสุด) |

---

## วิธีคำนวณค่าใช้จ่าย

### ตัวอย่างที่ 1: สร้างภาพบล็อก 100 ภาพ

สถานการณ์: เว็บบล็อกต้องการภาพประกอบ 100 ภาพ/เดือน ขนาด 1024x1024 DALL·E 3 Standard

```
จำนวน: 100 ภาพ
ราคา: $0.040/ภาพ
รวม: 100 × $0.040 = $4.00/เดือน
```

### ตัวอย่างที่ 2: แอปสร้างภาพสำหรับ 1,000 ผู้ใช้

สถานการณ์: แอปที่ผู้ใช้แต่ละคนสร้างภาพ 5 ภาพ/วัน ขนาด 1024x1024 DALL·E 3 Standard

```
จำนวน: 1,000 × 5 = 5,000 ภาพ/วัน
ราคา: $0.040/ภาพ
รวม/วัน: 5,000 × $0.040 = $200/วัน
รวม/เดือน: $200 × 30 = $6,000/เดือน
```

### ตัวอย่างที่ 3: ทดสอบ Prompt ประหยัดค่าใช้จ่าย

สถานการณ์: ทดสอบ Prompt 50 ครั้ง ใช้ DALL·E 2 512x512 แทน DALL·E 3

```
DALL·E 2 512x512: 50 × $0.018 = $0.90
DALL·E 3 Standard: 50 × $0.040 = $2.00
ประหยัดได้: $1.10 (55%)
```

---

## เทคนิคประหยัดค่าใช้จ่าย

### 1. ทดสอบด้วย DALL·E 2 ก่อน

เมื่อพัฒนาและทดสอบ Prompt ใช้ DALL·E 2 ซึ่งถูกกว่ามาก แล้วเปลี่ยนมาใช้ DALL·E 3 ตอนจะสร้างงาน Final

### 2. ใช้ `standard` ในระหว่างทดสอบ

```python
# ทดสอบ — ถูก
test = client.images.generate(
    model="dall-e-3",
    prompt=your_prompt,
    quality="standard",  # $0.040
)

# Final — แพงกว่าแต่คุณภาพสูง
final = client.images.generate(
    model="dall-e-3", 
    prompt=your_prompt,
    quality="hd",  # $0.080
)
```

### 3. ตั้ง Budget Alert (การแจ้งเตือนงบประมาณ)

ใน OpenAI Dashboard ตั้งค่า Spending Limit (ขีดจำกัดการใช้จ่าย) เพื่อไม่ให้เกินงบ:

1. ไปที่ [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing)
2. ตั้ง **Monthly Budget** (งบประมาณรายเดือน)
3. ตั้ง **Email Alert** (การแจ้งเตือนทางอีเมล) เมื่อถึง 80% ของงบ

### 4. Cache ผลลัพธ์ที่ใช้บ่อย

```python
import hashlib
import json
import os

def generate_with_cache(prompt: str, **kwargs) -> str:
    """สร้างภาพพร้อม Caching (การเก็บผลลัพธ์ไว้ใช้ซ้ำ — ไม่ต้องเรียก API ซ้ำสำหรับ Prompt เดิม)"""
    
    # สร้าง Cache Key จาก Prompt และ Parameters
    cache_key = hashlib.md5(
        json.dumps({"prompt": prompt, **kwargs}, sort_keys=True).encode()
    ).hexdigest()
    
    cache_path = f"cache/{cache_key}.png"
    
    # ถ้ามีในแคชแล้ว ใช้จาก Cache แทน
    if os.path.exists(cache_path):
        print("ใช้ภาพจาก Cache (ประหยัดค่าใช้จ่าย)")
        return cache_path
    
    # ถ้าไม่มี ค่อยเรียก API
    response = client.images.generate(prompt=prompt, **kwargs)
    # ... บันทึกและ return
```

---

## การจัดการเมื่อเกิน Rate Limit

เมื่อเกิน Rate Limit API จะตอบกลับด้วย HTTP 429:

```json
{
  "error": {
    "message": "Rate limit reached for images per minute...",
    "type": "requests",
    "code": "rate_limit_exceeded"
  }
}
```

### วิธีจัดการด้วย Exponential Backoff (การรอแบบเพิ่มเวลาทีละขั้น — รอ 1 วินาที, 2, 4, 8... ก่อนลองใหม่)

```python
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI()

def generate_with_retry(prompt: str, max_retries: int = 5):
    """สร้างภาพพร้อม Retry อัตโนมัติเมื่อเกิน Rate Limit"""
    
    for attempt in range(max_retries):
        try:
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
            )
            return response.data[0].url
            
        except RateLimitError:
            if attempt == max_retries - 1:
                raise  # ลองครบแล้ว ยอมแพ้
            
            # คำนวณเวลารอแบบ Exponential Backoff
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limit เกิน รอ {wait_time:.1f} วินาทีก่อนลองใหม่...")
            time.sleep(wait_time)

# ใช้งาน
url = generate_with_retry("A beautiful sunset")
print(f"สำเร็จ: {url}")
```

---

## ตรวจสอบการใช้งาน

ดูปริมาณการใช้งานและค่าใช้จ่ายได้ที่:

- **Usage Dashboard:** [platform.openai.com/usage](https://platform.openai.com/usage)
- **Billing:** [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing)

---

## สรุป

Rate Limits และราคาของ DALL·E API แตกต่างกันตาม Tier และโมเดลที่ใช้ DALL·E 3 มีคุณภาพสูงกว่าแต่ราคาแพงกว่าและ Rate Limits ต่ำกว่า ส่วน DALL·E 2 ถูกกว่าและมี Rate Limits สูงกว่า เหมาะกับการทดสอบหรือใช้งานปริมาณมาก การวางแผนการใช้งานที่ดีและ Cache ผลลัพธ์จะช่วยประหยัดค่าใช้จ่ายได้อย่างมีนัยสำคัญ
