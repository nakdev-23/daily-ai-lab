---
title: "Grounding with Google Search — ข้อมูล Real-time จากเว็บ"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Grounding เชื่อม Gemini กับ Google Search ให้ตอบคำถามด้วยข้อมูลปัจจุบัน ลด hallucination และอ้างอิงแหล่งที่มาได้ชัดเจน"
readTime: "7 นาที"
readers: "0"
locked: false
order: 25
---

# Grounding with Google Search — ข้อมูล Real-time จากเว็บ

**Grounding with Google Search** (การยึดโยงกับข้อมูลจริงจาก Google Search — ทำให้ AI ตอบจากข้อมูลจริงแทนการเดา) คือฟีเจอร์ที่ให้ Gemini ค้นหาข้อมูลจากเว็บ Google Search แบบ real-time (ทันทีในขณะนั้น) ก่อนตอบ แทนที่จะพึ่งเฉพาะความรู้ที่ฝึกมา ทำให้คำตอบแม่นยำ ทันสมัย และมีแหล่งอ้างอิง

---

## ทำไมต้องใช้ Grounding?

### ปัญหาที่ Grounding แก้:

| ปัญหา | ผลลัพธ์ |
|---|---|
| ข้อมูลเก่า | Gemini ฝึกสิ้นสุดที่วันหนึ่ง — ไม่รู้เหตุการณ์ล่าสุด |
| Hallucination (การแต่งข้อมูลที่ไม่มีจริง) | AI สร้างข้อมูลที่ไม่มีจริงขึ้นมา |
| ไม่มีแหล่งอ้างอิง | ไม่รู้ว่าข้อมูลมาจากไหน |
| ราคา/ข้อมูลเฉพาะ | ราคาสินค้า, ผลการแข่งขัน, ข่าวสด |

### Grounding ช่วยได้:
- ค้นหาข้อมูลเพิ่มเติมจาก Google Search อัตโนมัติ
- ระบุแหล่งที่มาในคำตอบ
- ลด hallucination สำหรับคำถาม factual (เกี่ยวกับข้อเท็จจริง)

---

## วิธีการทำงาน

```
1. รับ prompt (คำถาม/คำสั่ง) จากผู้ใช้
        ↓
2. Gemini วิเคราะห์ว่าควรค้นหาอะไร
        ↓
3. ส่ง query (คำค้นหา) ไปยัง Google Search
        ↓
4. ประมวลผล search results (ผลการค้นหา)
        ↓
5. สร้างคำตอบพร้อม citation (การอ้างอิง) จาก search results
```

---

## การใช้งาน: ผู้ใช้ทั่วไป (Gemini App)

Grounding ใน Gemini App เปิดใช้งานอัตโนมัติเมื่อ Gemini ตัดสินว่าคำถามต้องการข้อมูลเพิ่มเติม:

1. ถามคำถามที่ต้องการข้อมูล real-time เช่น:
   - "ราคา Bitcoin วันนี้เท่าไหร่?"
   - "ผลบอลไทยพรีเมียร์ลีกเมื่อคืนเป็นอย่างไร?"
   - "iPhone 16 ราคาในไทยเท่าไหร่?"

2. Gemini จะแสดงกล่อง **"Searching Google"** ก่อนตอบ

3. คำตอบจะมีลิงก์แหล่งอ้างอิงที่คลิกได้

---

## การใช้งานผ่าน API (นักพัฒนา)

### เปิด Grounding อย่างง่าย

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="ราคาน้ำมันดิบ Brent วันนี้เท่าไหร่?",
    config={
        "tools": [{"google_search": {}}]  # เปิด grounding
    }
)

print(response.text)
```

### ดู Search Queries (คำค้นหา) และ Citations (แหล่งอ้างอิง)

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="ใครชนะ Oscar สาขา Best Picture ปีล่าสุด?",
    config={
        "tools": [{"google_search": {}}]
    }
)

# ดูคำตอบ
print(response.text)

# ดู grounding metadata (ข้อมูลเกี่ยวกับการค้นหา)
if response.candidates[0].grounding_metadata:
    meta = response.candidates[0].grounding_metadata
    
    # Search queries ที่ใช้
    print("\n--- Search Queries ที่ใช้ ---")
    for query in meta.web_search_queries:
        print(f"- {query}")
    
    # แหล่งอ้างอิง
    print("\n--- แหล่งอ้างอิง ---")
    for chunk in meta.grounding_chunks:
        if hasattr(chunk, 'web'):
            print(f"- {chunk.web.title}: {chunk.web.uri}")
```

### ตัวอย่าง Output ของ grounding_metadata

```json
{
  "web_search_queries": [
    "Oscar Best Picture 2025 winner"
  ],
  "grounding_chunks": [
    {
      "web": {
        "uri": "https://variety.com/...",
        "title": "Oscars 2025: Complete List of Winners"
      }
    }
  ],
  "grounding_supports": [
    {
      "segment": {
        "start_index": 0,
        "end_index": 45,
        "text": "The 2025 Academy Award for Best Picture went to..."
      },
      "grounding_chunk_indices": [0],
      "confidence_scores": [0.97]
    }
  ]
}
```

---

## Dynamic Retrieval — ควบคุมการค้นหา

Dynamic Retrieval (การค้นหาแบบปรับตัว — ให้โมเดลตัดสินใจเองว่าจะค้นหาหรือไม่) ช่วยควบคุมเมื่อไหรที่ Gemini จะค้นหา:

```python
config = {
    "tools": [{
        "google_search": {
            "dynamic_retrieval_config": {
                "mode": "MODE_DYNAMIC",  # ให้โมเดลตัดสินใจเอง
                "dynamic_threshold": 0.3  # ค่า threshold (เกณฑ์ตัดสิน, 0-1)
                # ยิ่งสูง = ค้นหาน้อยลง (เฉพาะเมื่อแน่ใจว่าต้องการ)
                # ยิ่งต่ำ = ค้นหาบ่อยขึ้น
            }
        }
    }]
}
```

**โหมดการค้นหา:**
- `MODE_DYNAMIC` — โมเดลตัดสินใจเองว่าจะค้นหาหรือไม่
- `MODE_UNSPECIFIED` — ค้นหาเสมอ (ค่าเริ่มต้น)

---

## ราคาการใช้ Grounding

สำหรับ Gemini 3+ models:
- คิดราคา **ต่อ search query (คำค้นหา)** ที่ถูกใช้ ไม่ใช่ต่อ prompt
- 1 prompt อาจมีหลาย search queries
- ดูราคาล่าสุดที่ [ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## กรณีการใช้งานที่เหมาะสม

### เหมาะมากสำหรับ:
- **ข่าวสารและเหตุการณ์ปัจจุบัน** — ราคา, ข่าว, ผลกีฬา
- **ข้อมูลที่เปลี่ยนแปลงบ่อย** — ราคาหุ้น, สภาพอากาศ, ตาราง
- **Research (การวิจัย)** — ค้นหาข้อมูลก่อนเขียน
- **Fact-checking (ตรวจสอบข้อเท็จจริง)** — ตรวจสอบข้อเท็จจริง

### ไม่จำเป็นสำหรับ:
- คำถามทางคณิตศาสตร์หรือตรรกะ
- งานเขียนสร้างสรรค์
- Code generation (การสร้างโค้ด)
- ข้อมูลที่ไม่เปลี่ยนแปลง (ประวัติศาสตร์, วิทยาศาสตร์พื้นฐาน)

---

## Grounding vs Function Calling

| | Grounding with Search | Function Calling |
|---|---|---|
| แหล่งข้อมูล | Google Search (เว็บสาธารณะ) | API/ระบบที่กำหนดเอง |
| ตั้งค่า | เปิด flag (สัญญาณ) เดียว | ต้องเขียน declarations (คำอธิบายฟังก์ชัน) |
| ควบคุม | จำกัด | เต็มที่ |
| ข้อมูล internal (ภายในองค์กร) | ✗ | ✓ |
| Citation (อ้างอิง) อัตโนมัติ | ✓ | ✗ |
| เหมาะกับ | ข้อมูลสาธารณะ real-time | ข้อมูล business ภายใน |

---

## เคล็ดลับการใช้งาน

- **ระบุ timeframe (ช่วงเวลา)** — "ราคา BTC **วันนี้** เท่าไหร่?" ดีกว่า "ราคา BTC"
- **ถามเฉพาะเจาะจง** — คำถามเฉพาะเจาะจงได้ผลดีกว่าคำถามกว้างๆ
- **ตรวจสอบ citations (แหล่งอ้างอิง)** — คลิกลิงก์อ้างอิงเพื่อยืนยันข้อมูล
- **ใช้กับ Function Calling** — สามารถใช้ทั้งสองพร้อมกันในครั้งเดียวได้
