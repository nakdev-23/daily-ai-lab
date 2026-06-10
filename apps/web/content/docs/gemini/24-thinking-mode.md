---
title: "Thinking Mode — โหมดคิดเชิงลึกสำหรับปัญหาซับซ้อน"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Thinking Mode ให้ Gemini คิดผ่านปัญหาอย่างเป็นขั้นตอนก่อนตอบ เหมาะสำหรับคณิตศาสตร์, เขียนโค้ด, การวิเคราะห์เชิงตรรกะ และงานที่ต้องการความแม่นยำสูง"
readTime: "8 นาที"
readers: "0"
locked: false
order: 24
---

# Thinking Mode — โหมดคิดเชิงลึกสำหรับปัญหาซับซ้อน

**Thinking Mode** (โหมดคิดเชิงลึก — AI จะใช้เวลาคิดทบทวนปัญหาก่อนตอบ) คือกระบวนการที่ Gemini "คิดก่อนตอบ" โดยสร้างเหตุผลภายในก่อนแสดงคำตอบสุดท้าย เปรียบเหมือนนักเรียนที่ทำงานหนักในกระดาษทด ก่อนเขียนคำตอบสะอาดลงในกระดาษข้อสอบ

---

## Thinking Mode คืออะไร?

เมื่อเปิด Thinking Mode โมเดลจะ:
1. **วิเคราะห์ปัญหา** — แตกปัญหาออกเป็นส่วนย่อย
2. **คิดทีละขั้นตอน** — reasoning (การให้เหตุผล) แบบ chain-of-thought (ลูกโซ่ความคิด — คิดต่อเนื่องเป็นขั้น) ภายใน
3. **ตรวจสอบตัวเอง** — ย้อนกลับมาตรวจสอบความถูกต้อง
4. **สรุปคำตอบ** — แสดงผลลัพธ์ที่ผ่านการคิดอย่างรอบคอบ

ผู้ใช้ API (ช่องทางเชื่อมต่อโปรแกรม) สามารถดู "thought summary" (สรุปกระบวนการคิด) ได้

---

## เมื่อไหรควรใช้ Thinking Mode?

### ใช้ Thinking เมื่อ:
- **คณิตศาสตร์และสถิติ** — สมการซับซ้อน, probability (ความน่าจะเป็น), calculus (แคลคูลัส)
- **เขียนโค้ด** — debugging (การหาและแก้ข้อผิดพลาด), algorithm design (การออกแบบขั้นตอนวิธี), code review (ตรวจสอบโค้ด)
- **การวิเคราะห์เชิงตรรกะ** — ปัญหา logic (ตรรกะ), เกมกลยุทธ์
- **การวางแผนหลายขั้นตอน** — project planning (วางแผนโปรเจกต์), decision trees (ผังการตัดสินใจ)
- **การอ่านกฎหมาย/สัญญา** — ตีความเอกสารซับซ้อน
- **วิทยาศาสตร์** — การออกแบบ experiment (การทดลอง), วิเคราะห์ผล

### ไม่จำเป็นต้องใช้ Thinking เมื่อ:
- ถามข้อเท็จจริงทั่วไป ("เมืองหลวงของไทยคืออะไร?")
- งานแปลภาษา
- การสรุปข้อความสั้นๆ
- คำถามที่มีคำตอบชัดเจน

---

## โมเดลที่รองรับ Thinking

| โมเดล | รองรับ Thinking | หมายเหตุ |
|---|---|---|
| `gemini-2.5-pro` | ✓ เต็มรูปแบบ | Thinking ดีที่สุด |
| `gemini-2.5-flash` | ✓ เต็มรูปแบบ | สมดุลดี |
| `gemini-2.5-flash-lite` | ✓ จำกัด | budget (งบประมาณการคิด) ต่ำ |

---

## การใช้งาน Thinking ใน Gemini (ไม่ใช้ API)

### ใน gemini.google.com
1. เปิด Gemini และพิมพ์ prompt (คำสั่ง)
2. คลิกไอคอน ⚡ หรือเลือก **"Deep Think"** ก่อนส่ง
3. สังเกตว่า Gemini จะแสดง "Thinking..." ก่อนตอบ
4. คำตอบที่ได้จะแม่นยำและละเอียดกว่าปกติ

### ใน Gemini Advanced
- เลือก **Gemini 2.5 Pro with Deep Think** จากเมนูโมเดล
- เหมาะสำหรับปัญหาที่ยากที่สุด

---

## การใช้งาน Thinking ผ่าน API

### เปิด Thinking ด้วย thinkingBudget (งบประมาณการคิด) สำหรับ Gemini 2.5

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="พิสูจน์ว่า √2 เป็นจำนวนอตรรกยะ",
    config={
        "thinking_config": {
            "thinking_budget": 8192  # จำนวน thinking tokens (ชิ้นส่วนความคิด, 0-24576)
        }
    }
)

print(response.text)
```

### ดู Thought Summary (สรุปกระบวนการคิด)

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="แก้สมการ: 3x² + 5x - 2 = 0",
    config={
        "thinking_config": {
            "thinking_budget": 4096,
            "include_thoughts": True  # เปิดดู thought summary
        }
    }
)

# แยก thoughts (ความคิด) และ answer (คำตอบ)
for part in response.candidates[0].content.parts:
    if hasattr(part, 'thought') and part.thought:
        print("--- กระบวนการคิด ---")
        print(part.text)
    else:
        print("--- คำตอบ ---")
        print(part.text)
```

### ปิด Thinking (สำหรับงานง่าย)

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="แปลประโยคนี้เป็นภาษาอังกฤษ: สวัสดีครับ",
    config={
        "thinking_config": {
            "thinking_budget": 0  # ปิด thinking ลด latency (ความล่าช้า) และ cost (ต้นทุน)
        }
    }
)
```

---

## thinkingBudget — ตั้งค่าความลึกของการคิด

| Budget | เหมาะกับ | Latency (ความล่าช้า) | Cost (ต้นทุน) |
|---|---|---|---|
| 0 | งานง่าย, ตอบเร็ว | ต่ำ | ต่ำ |
| 1,024-4,096 | งานกลาง | ปานกลาง | ปานกลาง |
| 8,192-16,384 | งานยาก | สูง | สูง |
| 24,576 (max) | งานยากที่สุด | สูงมาก | สูงมาก |
| -1 (dynamic — ปรับอัตโนมัติ) | ให้โมเดลเลือกเอง | ตามความจำเป็น | ตามความจำเป็น |

> **แนะนำ:** ใช้ `-1` (dynamic) เพื่อให้โมเดลปรับ budget อัตโนมัติตามความซับซ้อนของปัญหา

---

## ตัวอย่างผลลัพธ์: มีและไม่มี Thinking

**คำถาม:** "ถ้าคุณมีเหรียญ 3 แบบ (1, 5, 10 บาท) และต้องจ่าย 23 บาท โดยใช้เหรียญน้อยที่สุด ควรใช้เหรียญอะไร?"

**ไม่มี Thinking:**
"ใช้เหรียญ 10 บาท x2 และ 1 บาท x3 = 5 เหรียญ"

**มี Thinking (ถูกต้อง):**
```
[Thinking]:
- 23 บาท
- 10 + 10 = 20, เหลือ 3 บาท
- 3 บาท = 1 + 1 + 1 = 3 เหรียญ
- รวม: 2+3 = 5 เหรียญ
- ลอง: 10 + 5 + 5 + 1 + 1 + 1 = 6 เหรียญ (ไม่ดีกว่า)
- ลอง: 10 + 10 + 1 + 1 + 1 = 5 เหรียญ
- ✓ ตอบ: 5 เหรียญ

[Answer]:
ควรใช้:
- เหรียญ 10 บาท x 2 = 20 บาท
- เหรียญ 1 บาท x 3 = 3 บาท
รวม 5 เหรียญ ซึ่งเป็นจำนวนน้อยที่สุด
```

---

## ราคา Thinking Tokens

Thinking tokens (ชิ้นส่วนความคิดภายใน) คิดราคาเหมือน output tokens ปกติ แต่:
- ผู้ใช้เห็นแค่ **thought summary** (สั้นกว่า thinking จริง)
- billing (การเรียกเก็บเงิน) คิดจาก thinking tokens ทั้งหมด ไม่ใช่แค่ summary
- ใช้ `response.usage_metadata.thoughts_token_count` ดูจำนวน

---

## เปรียบเทียบ Deep Think ใน Gemini App vs API

| | Gemini App (Deep Think) | API (thinkingBudget) |
|---|---|---|
| ควบคุม budget | ไม่ได้ | ✓ กำหนดได้ |
| ดู thought | เห็นบางส่วน | ✓ include_thoughts |
| ปรับ dynamically (อัตโนมัติ) | ไม่ได้ | ✓ ใช้ -1 |
| เหมาะกับ | ผู้ใช้ทั่วไป | นักพัฒนา |
