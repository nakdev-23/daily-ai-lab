---
title: "OpenRouter คืออะไร — API เดียว เรียกได้ทุกโมเดล AI"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "beginner"
summary: "ภาพรวม OpenRouter เกตเวย์ API ที่ให้เข้าถึงโมเดล AI หลายร้อยตัวผ่านที่เดียว"
readTime: "6 นาที"
readers: "0"
locked: false
order: 1
---

# OpenRouter — API เดียว ใช้ได้ทุกโมเดล 🔀

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [openrouter.ai/docs](https://openrouter.ai/docs)

**OpenRouter** คือ **เกตเวย์ (gateway) รวม API ของโมเดล AI หลายร้อยตัว** จากหลายเจ้า (OpenAI, Anthropic, Google, Meta, Mistral ฯลฯ) ไว้ในที่เดียว — คุณเขียนโค้ดแบบเดียว แล้วสลับใช้โมเดลไหนก็ได้ ไม่ต้องสมัครหลายบัญชี ไม่ต้องแก้โค้ดทุกครั้งที่เปลี่ยนโมเดล

## 📖 คำศัพท์ที่ควรรู้

| คำศัพท์ | ความหมายง่าย ๆ |
|---|---|
| **Gateway** | ตัวกลางที่ส่งคำขอของคุณต่อไปยังผู้ให้บริการโมเดลจริง |
| **Provider** | เจ้าของโมเดลตัวจริง (เช่น OpenAI, Anthropic) |
| **Routing** | การเลือกว่าจะส่งงานไปที่ provider ไหน (เร็วสุด/ถูกสุด/สำรอง) |
| **Credits** | เครดิตเติมเงินไว้ จ่ายตามการใช้งานจริง |
| **OpenAI-compatible** | ใช้รูปแบบ API แบบเดียวกับ OpenAI เปลี่ยน URL ก็ใช้ได้เลย |

## ⭐ จุดเด่น

- **โมเดลเยอะมากในที่เดียว** — สลับรุ่น/ยี่ห้อได้โดยเปลี่ยนแค่ชื่อโมเดล
- **เข้ากันได้กับ OpenAI API** — ย้ายโค้ดเดิมมาได้แทบทันที
- **Routing อัจฉริยะ** — เลือก provider ที่เร็ว/ถูก หรือสำรองอัตโนมัติเมื่อเจ้าหนึ่งล่ม
- **บิลรวมที่เดียว** — เติมเครดิตครั้งเดียว ใช้ได้ทุกโมเดล
- **มีฟีเจอร์ขั้นสูง** — Prompt Caching, Structured Outputs, Tool Calling

## 🚀 เริ่มต้นใช้งาน

1. สมัครและสร้าง API key ที่ [openrouter.ai](https://openrouter.ai/)
2. เรียกใช้แบบเดียวกับ OpenAI — แค่เปลี่ยน base URL:
   ```bash
   curl https://openrouter.ai/api/v1/chat/completions \
     -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     -d '{"model":"anthropic/claude-opus-4-8","messages":[{"role":"user","content":"สวัสดี"}]}'
   ```
3. อยากเปลี่ยนโมเดล? แก้แค่ค่า `model` เช่น `openai/gpt-4o`, `google/gemini-2.5-pro`

## 📚 สารบัญเอกสาร OpenRouter (ตาม official docs)

1. ✅ ภาพรวม (หน้านี้)
2. ⏳ Quickstart — เรียก API ครั้งแรก
3. ⏳ Models — รายชื่อและการตั้งชื่อโมเดล
4. ⏳ Provider Routing — เลือก/สำรอง provider
5. ⏳ Prompt Caching & Structured Outputs
6. ⏳ Tool Calling (Function Calling)
7. ⏳ API Reference

## 🔗 อ้างอิง

- เอกสารทางการ: https://openrouter.ai/docs
- รายชื่อโมเดล: https://openrouter.ai/models
