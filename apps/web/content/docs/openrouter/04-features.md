---
title: "OpenRouter: ฟีเจอร์ขั้นสูง — Caching, Structured Outputs, Tools"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "pro"
summary: "ฟีเจอร์ขั้นสูงของ OpenRouter: prompt caching, structured outputs และ tool calling"
readTime: "5 นาที"
readers: "0"
locked: false
order: 4
---

# ฟีเจอร์ขั้นสูงของ OpenRouter ⚙️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [openrouter.ai/docs](https://openrouter.ai/docs/features)

OpenRouter รองรับฟีเจอร์ขั้นสูงที่ใช้ได้ข้ามโมเดล (ตามที่โมเดลนั้นรองรับ)

## 💾 Prompt Caching

ถ้าส่งบริบทเดิมซ้ำ ๆ (เช่น system prompt ยาว) **caching** ช่วยลดต้นทุนและเพิ่มความเร็ว โดยไม่ต้องประมวลผลส่วนเดิมใหม่ทุกครั้ง — รองรับตามที่ provider/โมเดลรองรับ

## 📐 Structured Outputs

บังคับให้คำตอบออกมาตรงตาม **โครงสร้าง JSON (schema)** ที่กำหนด เหมาะกับงานที่ต้องนำผลไปใช้ต่อในโปรแกรม

```json
{
  "model": "...",
  "response_format": {
    "type": "json_schema",
    "json_schema": { "name": "person", "schema": { ... } }
  }
}
```

## 🛠️ Tool Calling (Function Calling)

ให้โมเดลเรียก "เครื่องมือ" ที่คุณกำหนด (เช่น ค้นฐานข้อมูล, เรียก API) — โมเดลจะบอกว่าจะเรียกเครื่องมือไหนพร้อมพารามิเตอร์ แล้วคุณรันให้และส่งผลกลับ ใช้รูปแบบเดียวกับ OpenAI tools

## 🖼️ อื่น ๆ

- **Multimodal** — บางโมเดลรับรูปภาพได้
- **Streaming** — รับผลทีละส่วน
- **Web search** — บางโมเดล/โหมดเสริมการค้นเว็บ

## 💡 เคล็ดลับ

- ฟีเจอร์ใช้ได้เฉพาะเมื่อ "โมเดลที่เลือก" รองรับ — เช็คในหน้าโมเดล
- ใช้ structured outputs เมื่อต้องการผลที่ parse ได้แน่นอน

## 🔗 อ้างอิง

- Features: https://openrouter.ai/docs/features
