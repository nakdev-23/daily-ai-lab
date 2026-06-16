---
title: "OpenRouter: Quickstart — เรียก API ครั้งแรก"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "beginner"
summary: "สร้าง API key และเรียกโมเดลแรกผ่าน OpenRouter แบบ OpenAI-compatible"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---

# Quickstart — เริ่มเรียก OpenRouter 🚀

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [openrouter.ai/docs/quickstart](https://openrouter.ai/docs/quickstart)

## 🔑 ขั้นตอนเริ่มต้น

1. สมัครที่ [openrouter.ai](https://openrouter.ai/) แล้วเติมเครดิต
2. สร้าง **API key** ในหน้า Keys
3. เลือกโมเดลที่อยากใช้จาก [openrouter.ai/models](https://openrouter.ai/models)

## 🧱 เรียกแบบ OpenAI-compatible

OpenRouter ใช้รูปแบบเดียวกับ OpenAI — เปลี่ยนแค่ base URL และ key:

```python
from openai import OpenAI
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="YOUR_OPENROUTER_KEY",
)
r = client.chat.completions.create(
    model="anthropic/claude-opus-4-8",
    messages=[{"role": "user", "content": "สวัสดี"}],
)
print(r.choices[0].message.content)
```

## 🏷️ การตั้งชื่อโมเดล

รูปแบบคือ `ผู้ให้บริการ/ชื่อโมเดล` เช่น
- `anthropic/claude-opus-4-8`
- `openai/gpt-4o`
- `google/gemini-2.5-pro`
- `meta-llama/llama-3.3-70b-instruct`

อยากเปลี่ยนโมเดล? แก้แค่ค่า `model` — โค้ดที่เหลือเหมือนเดิม

## 💡 เคล็ดลับ

- ใส่ HTTP headers `HTTP-Referer` และ `X-Title` (ไม่บังคับ) เพื่อให้แอปคุณปรากฏใน leaderboard ของ OpenRouter
- ดูราคาแต่ละโมเดลก่อนใช้ (คิดตาม token)

## 🔗 อ้างอิง

- Quickstart: https://openrouter.ai/docs/quickstart
