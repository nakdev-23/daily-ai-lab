---
title: "Z.ai: Chat Completion — สนทนากับโมเดล"
tool: "Z.ai"
icon: "tool-z-ai"
level: "beginner"
summary: "พื้นฐานการเรียก Chat Completion ของ GLM พร้อมพารามิเตอร์ที่ใช้บ่อย"
readTime: "5 นาที"
readers: "0"
locked: false
order: 4
---

# Chat Completion — คุยกับโมเดล GLM 💬

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/)

เอนด์พอยต์หลักคือ **Chat Completion** — ส่งข้อความแบบมี role แล้วรับคำตอบ

## 🧱 โครงสร้าง messages

```python
messages = [
  {"role": "system",    "content": "คุณเป็นติวเตอร์ที่อธิบายง่าย ตอบเป็นภาษาไทย"},
  {"role": "user",      "content": "AI คืออะไร"},
  {"role": "assistant", "content": "AI คือ..."},   # ประวัติก่อนหน้า (ถ้ามี)
  {"role": "user",      "content": "ยกตัวอย่างหน่อย"},
]
```

| role | หมายถึง |
|---|---|
| **system** | กำหนดบทบาท/พฤติกรรม |
| **user** | ข้อความจากผู้ใช้ |
| **assistant** | คำตอบก่อนหน้าของโมเดล |

## 🎛️ พารามิเตอร์ที่ใช้บ่อย

| พารามิเตอร์ | ทำอะไร |
|---|---|
| `model` | ชื่อรุ่น เช่น `glm-4.6` |
| `temperature` | ความสร้างสรรค์ (ต่ำ=เป๊ะ สูง=หลากหลาย) |
| `max_tokens` | จำกัดความยาวคำตอบ |
| `top_p` | คุมความหลากหลายของการเลือกคำ |
| `stream` | รับผลทีละส่วน (ดู [Streaming](05-streaming)) |

## ▶️ ตัวอย่าง

```python
r = client.chat.completions.create(
    model="glm-4.6",
    messages=messages,
    temperature=0.6,
    max_tokens=1024,
)
print(r.choices[0].message.content)
```

## 💡 เคล็ดลับ

- ใส่ `system` message เพื่อกำหนดโทน/บทบาทให้สม่ำเสมอ
- เก็บประวัติบทสนทนาส่งกลับไปทุกครั้งเพื่อให้โมเดลจำบริบท

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
