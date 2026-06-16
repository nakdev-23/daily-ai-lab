---
title: "OpenRouter: Models & Provider Routing — เลือกและสำรองโมเดล"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "intermediate"
summary: "การเลือกโมเดล การกำหนด provider routing และระบบสำรองเมื่อ provider ล่ม"
readTime: "5 นาที"
readers: "0"
locked: false
order: 3
---

# Models & Provider Routing 🔀

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [openrouter.ai/docs](https://openrouter.ai/docs/features/provider-routing)

โมเดลตัวเดียวกันอาจมีหลาย provider ให้บริการ OpenRouter ช่วย **เลือก provider ที่ดีที่สุด** และ **สำรองอัตโนมัติ** เมื่อเจ้าหนึ่งมีปัญหา

## 🎯 Provider Routing ทำงานยังไง

- ค่าเริ่มต้น: เลือก provider ที่เหมาะ (ราคา/ความเร็ว/ความพร้อม)
- ถ้า provider แรกล่มหรือช้า → **fallback** ไปเจ้าถัดไปให้อัตโนมัติ
- คุณกำหนดเงื่อนไขเองได้ เช่น เรียงลำดับ provider, ตัด provider ที่ไม่ต้องการ

## ⚙️ ตัวอย่างกำหนดเอง

ส่งฟิลด์ `provider` เพิ่มในคำขอ เช่น
```json
{
  "model": "meta-llama/llama-3.3-70b-instruct",
  "provider": { "sort": "throughput" },
  "messages": [ ... ]
}
```
- `sort: "price"` — เน้นถูกสุด
- `sort: "throughput"` — เน้นเร็วสุด
- ระบุ `order` เพื่อกำหนดลำดับ provider เอง

## 🧭 Model Routing (เลือกโมเดลอัตโนมัติ)

มีโมเดลพิเศษ เช่น `openrouter/auto` ที่ให้ OpenRouter เลือกโมเดลที่เหมาะกับคำถามให้เอง

## 💡 เคล็ดลับ

- งาน production ควรตั้ง fallback ไว้กันล่ม
- ดู uptime/latency ของแต่ละ provider ได้ในหน้าโมเดล

## 🔗 อ้างอิง

- Provider Routing: https://openrouter.ai/docs/features/provider-routing
