---
title: "Kimi: API — เรียกใช้โมเดล Moonshot ผ่านโค้ด"
tool: "Kimi"
icon: "tool-kimi"
level: "pro"
summary: "เรียกใช้โมเดล Kimi/Moonshot ผ่าน API ที่เข้ากันได้กับ OpenAI"
readTime: "5 นาที"
readers: "0"
locked: false
order: 4
---

# Kimi API — เรียกใช้จากโค้ด 🧑‍💻

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [platform.moonshot.ai](https://platform.moonshot.ai/)

Moonshot AI เปิดให้เรียกโมเดล Kimi ผ่าน **API ที่เข้ากันได้กับ OpenAI** — ถ้าเคยใช้โค้ดแบบ OpenAI มาก่อน แค่เปลี่ยน base URL กับ key ก็ใช้ได้เลย

## 🔑 สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | อธิบาย |
|---|---|
| **API key** | สร้างในแพลตฟอร์มนักพัฒนา (เก็บเป็นความลับ) |
| **Base URL** | เอนด์พอยต์ของ Moonshot |
| **Model** | ชื่อรุ่นโมเดลที่จะใช้ |

## 🧱 ตัวอย่าง (รูปแบบ OpenAI-compatible)

```python
from openai import OpenAI
client = OpenAI(
    api_key="YOUR_MOONSHOT_KEY",
    base_url="https://api.moonshot.ai/v1",
)
r = client.chat.completions.create(
    model="kimi-k2-...",   # ใส่ชื่อรุ่นตามเอกสารล่าสุด
    messages=[{"role": "user", "content": "สรุปข่าวนี้ให้หน่อย"}],
)
print(r.choices[0].message.content)
```

## 💡 เคล็ดลับ

- ใช้ความสามารถ **บริบทยาว** ด้วยการส่งเอกสารเข้าไปใน messages
- รองรับ **tool use** สำหรับงาน agentic
- ดูชื่อรุ่น ราคา และลิมิตล่าสุดได้ที่เอกสาร platform

## 🔗 อ้างอิง

- แพลตฟอร์มนักพัฒนา: https://platform.moonshot.ai/
