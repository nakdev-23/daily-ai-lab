---
title: "Google AI Studio: การออกแบบพรอมต์"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "beginner"
summary: "ใช้หน้า Prompt ของ AI Studio ทดลองพรอมต์ ตั้ง System instructions และปรับค่า"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---

# การออกแบบพรอมต์ใน AI Studio ✍️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [ai.google.dev](https://ai.google.dev/gemini-api/docs/prompting-strategies)

AI Studio คือสนามทดลองพรอมต์กับ Gemini — ปรับแล้วเห็นผลทันที

## 🎛️ ค่าที่ปรับได้

| ค่า | ทำอะไร |
|---|---|
| **System instructions** | กำหนดบทบาท/พฤติกรรมของโมเดล |
| **Temperature** | ความสร้างสรรค์ (ต่ำ=เป๊ะ สูง=หลากหลาย) |
| **Output length** | จำกัดความยาวคำตอบ |
| **Top P / Top K** | คุมความหลากหลายของการเลือกคำ |
| **Safety settings** | ระดับการกรองเนื้อหา |

## 🧱 System Instructions

ตั้งบทบาทให้โมเดล เช่น:
```
คุณเป็นติวเตอร์ภาษาไทยที่อธิบายเรื่องยากให้เข้าใจง่าย
ตอบเป็นภาษาไทย ใช้ตัวอย่างใกล้ตัว
```
ช่วยให้คำตอบสม่ำเสมอตามที่ต้องการ

## 💡 เคล็ดลับเขียนพรอมต์

- **เจาะจง** — บอกบริบท เป้าหมาย และรูปแบบผลที่อยากได้
- **ยกตัวอย่าง** (few-shot) — ใส่ตัวอย่าง input/output ให้โมเดลเลียนแบบ
- **แบ่งขั้นตอน** — งานซับซ้อนให้บอกเป็นสเต็ป
- **ทดลองปรับ temperature** — งานสร้างสรรค์สูงขึ้น, งานข้อเท็จจริงต่ำลง

## ▶️ ขั้นตอน

1. เปิดหน้า Chat/Prompt ใน [aistudio.google.com](https://aistudio.google.com/)
2. ตั้ง System instructions
3. พิมพ์พรอมต์ ปรับค่า แล้วดูผล
4. พอใจแล้วกด **Get code / API key** เพื่อนำไปใช้จริง

## 🔗 อ้างอิง

- กลยุทธ์การเขียนพรอมต์: https://ai.google.dev/gemini-api/docs/prompting-strategies
