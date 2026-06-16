---
title: "Z.ai คืออะไร — แพลตฟอร์มโมเดล GLM จาก Zhipu AI"
tool: "Z.ai"
icon: "tool-z-ai"
level: "beginner"
summary: "ภาพรวม Z.ai แพลตฟอร์มโมเดล GLM (แชท เหตุผล โค้ด วิชัน วิดีโอ ภาพ) จาก Zhipu AI"
readTime: "6 นาที"
readers: "0"
locked: false
order: 1
---

# Z.ai — แพลตฟอร์มโมเดล GLM 🧠

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/) และ [z.ai](https://z.ai/)

**Z.ai** คือแพลตฟอร์ม AI ระดับโลกจาก **Zhipu AI** ผู้พัฒนาตระกูลโมเดล **GLM** — ใช้ได้ทั้งแชทฟรีบนเว็บ และเรียกผ่าน API สำหรับนักพัฒนา ครอบคลุมงานข้อความ เหตุผล เขียนโค้ด อ่านรูป (vision) สร้างวิดีโอ และสร้างภาพ จุดเด่นคือ **โมเดลเก่งด้านโค้ด/เอเจนต์ในราคาประหยัด** และ API ที่เข้ากันได้ทั้งรูปแบบ OpenAI และ Anthropic

## 📖 คำศัพท์ที่ควรรู้

| คำศัพท์ | ความหมายง่าย ๆ |
|---|---|
| **GLM** | ตระกูลโมเดลของ Zhipu AI (เช่น GLM-4.6) |
| **Zhipu AI** | บริษัทผู้พัฒนา (z.ai คือแบรนด์สากล) |
| **API key** | กุญแจสำหรับเรียกโมเดลจากโค้ด |
| **OpenAI/Anthropic-compatible** | ใช้รูปแบบ API เดียวกับ OpenAI/Anthropic เปลี่ยน URL ก็ใช้ได้ |
| **Thinking / Reasoning** | โหมดให้โมเดลคิดเป็นขั้นตอนก่อนตอบ |
| **GLM Coding Plan** | แพ็กเกจรายเดือนสำหรับสายเขียนโค้ด |

## ⭐ ใช้ทำอะไรได้ (ตามเมนู official docs)

- **แชท / เหตุผล / โค้ด** — โมเดล GLM-4.6, GLM-4.5 series
- **Vision** — อ่านและเข้าใจรูปภาพ (GLM-4.5V)
- **สร้างวิดีโอ** — CogVideoX
- **สร้างภาพ** — CogView
- **เครื่องมือ** — Function/Tool calling, Web Search, Structured Output
- **Agents** — งานหลายขั้นตอนแบบเอเจนต์
- **Coding Plan** — ใช้กับ Claude Code/Cline ฯลฯ

## 🚀 เริ่มต้นใช้งาน

1. ลองแชทฟรีที่ [chat.z.ai](https://chat.z.ai/)
2. นักพัฒนา: สมัครและสร้าง API key ที่ [z.ai](https://z.ai/) → ดู [Quick Start](02-quickstart)

## 📚 สารบัญเอกสาร Z.ai (ตาม official docs)

1. ✅ ภาพรวม (หน้านี้)
2. ✅ [Quick Start — เรียก API ครั้งแรก](02-quickstart)
3. ✅ [Models — ตระกูลโมเดล GLM](03-models)
4. ✅ [Chat Completion](04-chat-completion)
5. ✅ [Streaming](05-streaming)
6. ✅ [Tool / Function Calling](06-tool-calling)
7. ✅ [Structured Output](07-structured-output)
8. ✅ [Vision — เข้าใจรูปภาพ](08-vision)
9. ✅ [Web Search](09-web-search)
10. ✅ [Reasoning — โหมดคิดลึก](10-reasoning)
11. ✅ [Video & Image — CogVideoX / CogView](11-video-image)
12. ✅ [Agents](12-agents)
13. ✅ [GLM Coding Plan](13-coding-plan)

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
- แชทฟรี: https://chat.z.ai/
