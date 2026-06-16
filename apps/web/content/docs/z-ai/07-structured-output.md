---
title: "Z.ai: Structured Output — บังคับผลเป็น JSON"
tool: "Z.ai"
icon: "tool-z-ai"
level: "pro"
summary: "ให้ GLM ตอบเป็น JSON ตามโครงสร้างที่กำหนด เพื่อนำผลไปใช้ต่อในโปรแกรม"
readTime: "4 นาที"
readers: "0"
locked: false
order: 7
---

# Structured Output — ผลลัพธ์ที่ parse ได้แน่นอน 📐

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/)

เวลาเอาคำตอบ AI ไปใช้ต่อในโค้ด เราต้องการรูปแบบที่แน่นอน **Structured Output** บังคับให้โมเดลตอบเป็น **JSON** ตามโครงสร้างที่กำหนด

## 🎯 ใช้ทำอะไร

- ดึงข้อมูลเป็นฟิลด์ (เช่น ชื่อ, ราคา, วันที่)
- จำแนกประเภทแล้วได้ผลเป็น JSON
- ป้อนผลเข้าระบบอื่นต่อโดยไม่ต้องแกะข้อความเอง

## 🧱 แนวทาง

ตั้ง `response_format` ให้เป็น JSON (หรือ JSON ตาม schema) เช่น

```python
r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role":"user","content":"แยกชื่อและอีเมลจาก: สมชาย somchai@mail.com"}],
    response_format={"type": "json_object"},
)
import json
data = json.loads(r.choices[0].message.content)
```

## 💡 เคล็ดลับ

- บอกใน prompt ให้ชัดว่าต้องการฟิลด์อะไรบ้าง
- ระบุตัวอย่างรูปแบบ JSON ที่อยากได้
- ตรวจ (validate) JSON ที่ได้ก่อนใช้งานจริงเสมอ

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
