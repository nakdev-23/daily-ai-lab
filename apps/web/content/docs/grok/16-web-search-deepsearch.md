---
title: "Web Search & DeepSearch — ค้นหาข้อมูล Real-time"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Web Search ให้ Grok เข้าถึงข้อมูลล่าสุดจากอินเทอร์เน็ต ส่วน DeepSearch คือโหมดค้นหาเชิงลึกที่วิเคราะห์หลายแหล่งพร้อมกัน แก้ปัญหา Knowledge Cutoff"
readTime: "5 นาที"
readers: "0"
locked: false
order: 16
---
# Web Search & DeepSearch — ค้นหาข้อมูล Real-time

> อ้างอิง: [Web Search Tool](https://docs.x.ai/docs) | [Tools Overview](https://docs.x.ai/docs)

---

## ปัญหาที่ Web Search แก้ได้

Grok มี **Knowledge Cutoff** (วันที่ตัดความรู้ — Grok รู้เรื่องราวจนถึงช่วงเวลานี้เท่านั้น ณ เดือนพฤศจิกายน 2024) หมายความว่า Grok ไม่รู้เรื่องที่เกิดขึ้นหลังจากนั้น

**Web Search Tool** (เครื่องมือค้นหาเว็บ) แก้ปัญหานี้โดยให้ Grok:
- ค้นหาข้อมูลจากอินเทอร์เน็ตได้ทันที
- เข้าถึงข่าวล่าสุด ราคาหุ้น สภาพอากาศ เหตุการณ์ปัจจุบัน
- อ้างอิงแหล่งที่มาพร้อม URL

---

## การใช้งาน Web Search พื้นฐาน

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "ราคา Bitcoin วันนี้เท่าไหร่ และมีข่าวอะไรเกี่ยวกับ crypto บ้าง?"
    }],
    tools=[{"type": "web_search"}],
)

print(response.output_text)
# Grok จะค้นหาข้อมูลจริงและตอบพร้อม Citations (การอ้างอิงแหล่งข้อมูล)
```

### ราคา

**$5 ต่อ 1,000 tool calls** (การเรียกใช้เครื่องมือ)

---

## พารามิเตอร์ขั้นสูง

### Domain Filtering — กำหนดโดเมนที่ค้นหา

**Domain** (ชื่อเว็บไซต์ เช่น bangkokpost.com — ใช้กรองแหล่งข้อมูลที่ต้องการ):

```python
# ค้นหาเฉพาะในโดเมนที่เชื่อถือได้ (สูงสุด 5 โดเมน)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ข่าวเศรษฐกิจไทยล่าสุด?"}],
    tools=[{
        "type": "web_search",
        "allowed_domains": [
            "bangkokpost.com",
            "nationthailand.com",
            "bot.or.th",
            "nesdc.go.th",
        ],
    }],
)
```

```python
# ยกเว้นโดเมนที่ไม่ต้องการ (สูงสุด 5 โดเมน)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "รีวิว iPhone 16"}],
    tools=[{
        "type": "web_search",
        "excluded_domains": ["sponsored-reviews.com", "paid-content.net"],
    }],
)
```

> **หมายเหตุ:** ใช้ `allowed_domains` หรือ `excluded_domains` ได้เพียงอย่างเดียวในแต่ละ request

### Image Understanding — วิเคราะห์ภาพจากเว็บ

**Image Understanding** (การวิเคราะห์เนื้อหาในภาพ — AI อ่านกราฟ ตาราง หรือข้อมูลในรูปภาพได้):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "หาภาพกราฟ inflation ของไทยปีล่าสุด"}],
    tools=[{
        "type": "web_search",
        "enable_image_understanding": True,  # วิเคราะห์ภาพที่พบในเว็บ
        "enable_image_search": True,          # ค้นหาและฝังภาพในคำตอบ
    }],
)
```

> ภาพที่วิเคราะห์คิดราคาเป็น Image Tokens (หน่วยนับสำหรับข้อมูลภาพ) ไม่ใช่ Tool Call

---

## DeepSearch — การค้นหาเชิงลึก

**DeepSearch** คือโหมดการค้นหาที่ Grok จะ:
1. ตั้งคำถามย่อยหลายข้อจากคำถามหลัก
2. ค้นหาหลายรอบจากหลายแหล่ง
3. วิเคราะห์และ cross-reference (ตรวจสอบข้อมูลข้ามแหล่ง — เพื่อยืนยันความถูกต้อง)
4. สรุปผลพร้อมความเชื่อมั่นและแหล่งอ้างอิง

### ใช้ DeepSearch ผ่าน API

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": """
        วิเคราะห์ตลาด EV (รถยนต์ไฟฟ้า) ในไทยปี 2025:
        - ส่วนแบ่งตลาดของแต่ละแบรนด์
        - นโยบายรัฐบาลที่สนับสนุน
        - แนวโน้มในอีก 3 ปีข้างหน้า
        """
    }],
    tools=[{
        "type": "web_search",
        "enable_image_understanding": True,
    }],
    # Reasoning (การคิดวิเคราะห์) สูงเพื่อให้วิเคราะห์ลึก
    reasoning={"effort": "high"},
)

print(response.output_text)
```

### DeepSearch บน Grok.com

ใน Grok.com และแอปมือถือ มีปุ่ม **"DeepSearch"** โดยตรง:
- คลิก **DeepSearch** ก่อนส่งคำถาม
- Grok จะแสดง thinking process (กระบวนการคิด) ให้เห็น
- ใช้เวลานานกว่าปกติ (20–120 วินาที) แต่ได้คำตอบลึกกว่า

---

## X Search — ค้นหาใน X (Twitter)

ใช้คู่กับ Web Search เพื่อค้นหาความเห็นล่าสุดบน X:

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "คนไทยคิดอย่างไรกับนโยบาย AI ใหม่?"}],
    tools=[
        {"type": "web_search"},    # ข่าวทั่วไป
        {"type": "x_search"},      # โพสต์บน X
    ],
)
```

### X Search พร้อม Video Understanding

**Video Understanding** (การวิเคราะห์เนื้อหาในวิดีโอ — AI ดูและเข้าใจสิ่งที่เกิดขึ้นในคลิปได้):

```python
tools=[{
    "type": "x_search",
    "video_understanding": True,  # วิเคราะห์วิดีโอในโพสต์
}]
```

---

## Citations — แหล่งอ้างอิง

Web Search จะส่งคืน Citations (การอ้างอิงแหล่งข้อมูล — บอกว่าข้อมูลมาจากที่ไหน) อัตโนมัติ ดึงออกมาได้แบบนี้:

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ผลการเลือกตั้งล่าสุดในไทย?"}],
    tools=[{"type": "web_search"}],
)

# ดึง Citations จาก response
for item in response.output:
    if hasattr(item, "type") and item.type == "web_search_call":
        print("แหล่งข้อมูลที่ใช้:", item.search_results)
    elif hasattr(item, "type") and item.type == "message":
        for block in item.content:
            if hasattr(block, "annotations"):
                for annotation in block.annotations:
                    print(f"อ้างอิง: {annotation.url}")
```

---

## ตัวอย่าง Use Cases

### ติดตามราคาสินค้า

```python
def check_prices(product_name: str) -> str:
    response = client.responses.create(
        model="grok-4.3",
        input=[{
            "role": "user",
            "content": f"ราคา {product_name} ในไทยตอนนี้เท่าไหร่? หาจาก Shopee, Lazada, JD Central"
        }],
        tools=[{
            "type": "web_search",
            "allowed_domains": ["shopee.co.th", "lazada.co.th", "jd.co.th"],
        }],
    )
    return response.output_text

print(check_prices("iPhone 16 Pro Max 256GB"))
```

### สรุปข่าวรายวัน

```python
import datetime

today = datetime.date.today().strftime("%d %B %Y")

response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "system",
        "content": "สรุปข่าวเป็นภาษาไทย กระชับ ชัดเจน",
    }, {
        "role": "user",
        "content": f"สรุปข่าวสำคัญของไทยวันที่ {today} ใน 5 หัวข้อ",
    }],
    tools=[{"type": "web_search"}],
)

print(response.output_text)
```

---

## ข้อควรระวัง

- **ราคา** เพิ่มขึ้นทุก Tool Call — ค้นหาหลายรอบคิดหลายครั้ง
- **ความแม่นยำ** — ตรวจสอบ Citations เสมอ ข้อมูลบางแหล่งอาจไม่ถูกต้อง
- **Rate Limit** (ขีดจำกัดจำนวนคำขอ — จำกัดว่าใน 1 นาทีส่งคำขอได้กี่ครั้ง) — Web Search นับ Rate Limit เหมือน API Call ปกติ
- **ไม่รองรับ** — Web Search ไม่ทำงานกับ Batch API (การส่งคำขอจำนวนมากพร้อมกันในพื้นหลัง — ไม่รองรับ async background jobs)
