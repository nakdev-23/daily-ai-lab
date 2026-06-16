---
title: "Z.ai: Quick Start — เรียก API ครั้งแรก"
tool: "Z.ai"
icon: "tool-z-ai"
level: "beginner"
summary: "สร้าง API key และเรียกโมเดล GLM ครั้งแรก ทั้งแบบ OpenAI และ Anthropic-compatible"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---

# Quick Start — เริ่มเรียก Z.ai 🚀

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/guides/overview/quick-start)

## 🔑 ขั้นตอนเริ่มต้น

1. สมัครบัญชีที่ [z.ai](https://z.ai/)
2. สร้าง **API key** ในหน้าจัดการคีย์
3. เลือกโมเดล (เช่น `glm-4.6`) แล้วเรียกผ่าน API

## 🧱 เรียกแบบ OpenAI-compatible

Z.ai รองรับรูปแบบ OpenAI — เปลี่ยนแค่ base URL และ key:

```python
from openai import OpenAI
client = OpenAI(
    api_key="YOUR_ZAI_KEY",
    base_url="https://api.z.ai/api/paas/v4/",
)
r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role": "user", "content": "สวัสดี ช่วยอธิบาย AI หน่อย"}],
)
print(r.choices[0].message.content)
```

## 🟧 เรียกแบบ Anthropic-compatible

Z.ai ยังมีเอนด์พอยต์ที่เข้ากันได้กับ Anthropic (เหมาะกับเครื่องมือสายโค้ดอย่าง Claude Code) — ชี้ base URL มาที่ `https://api.z.ai/api/anthropic` แล้วใช้ key ของ z.ai

## 🌐 cURL

```bash
curl https://api.z.ai/api/paas/v4/chat/completions \
  -H "Authorization: Bearer YOUR_ZAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"glm-4.6","messages":[{"role":"user","content":"สวัสดี"}]}'
```

## 💡 เคล็ดลับ

- เก็บ API key ใน environment variable อย่า commit ลง git
- ลองโมเดลฟรี/เบา (เช่น GLM-4.5-Flash) ตอนพัฒนา แล้วค่อยขยับเป็นรุ่นใหญ่
- ดู rate limit และ error codes ในเอกสารหมวด Guides

## 🔗 อ้างอิง

- Quick Start: https://docs.z.ai/guides/overview/quick-start
