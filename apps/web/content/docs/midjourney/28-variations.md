---
title: "Variations — สร้างภาพแบบเดิมพร้อมปรับแต่ง"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ฟีเจอร์ Variations เพื่อสร้างภาพใหม่ที่คล้ายกับภาพที่เลือก พร้อมตัวเลือก Subtle และ Strong สำหรับควบคุมระดับการเปลี่ยนแปลง"
readTime: "5 นาที"
readers: "0"
locked: false
order: 28
---

# Variations — สร้างภาพแบบเดิมพร้อมปรับแต่ง

> อ้างอิงหลัก: [Variations](https://docs.midjourney.com/hc/en-us/articles/32692978437005-Variations)

---

## Variations คืออะไร

Variations (การสร้างภาพแบบปรับแต่ง — ฟีเจอร์ที่สร้างภาพใหม่จากภาพที่เลือก โดยรักษาแนวคิดหลักแต่เปลี่ยนรายละเอียด) ช่วยให้คุณ Iterate (ปรับปรุงซ้ำ) จากภาพที่ "เกือบดี" ให้กลายเป็น "ดีสุดๆ"

---

## ประเภท Variations

### Vary (Subtle)
- เปลี่ยนรายละเอียดเล็กน้อย
- โครงสร้าง, สี, Composition หลักยังคงเดิม
- เหมาะเมื่อ: ชอบภาพมากแต่ต้องการ Refinement เล็กน้อย

### Vary (Strong)
- เปลี่ยนมากขึ้น อาจมีองค์ประกอบใหม่
- ยังคงแนวคิดหลักจาก Prompt เดิม
- เหมาะเมื่อ: ต้องการทางเลือกใหม่ที่ยังอยู่ใน "ธีม" เดิม

---

## วิธีใช้

### บนเว็บไซต์
1. คลิกที่ภาพที่ต้องการ
2. เลือก **"Vary (Subtle)"** หรือ **"Vary (Strong)"**
3. รอผลลัพธ์ชุดใหม่ 4 ภาพ

### บน Discord
หลังสร้างภาพ:
- กด **V1, V2, V3, V4** ใต้ภาพ (Variation แบบ Strong)

---

## Vary Region (แก้ไขเฉพาะส่วน)

Vary Region (การปรับแต่งเฉพาะพื้นที่ — เลือกส่วนใดส่วนหนึ่งในภาพแล้วสร้างเนื้อหาใหม่แค่ในส่วนนั้น) ช่วยให้คุณแก้ไขเฉพาะส่วนที่ต้องการ:

1. คลิก **"Vary (Region)"**
2. วาดพื้นที่ที่ต้องการเปลี่ยน
3. พิมพ์ Prompt ใหม่สำหรับพื้นที่นั้น
4. Generate

**ตัวอย่าง:**
- ต้องการเปลี่ยนท้องฟ้าในภาพ
- ต้องการเพิ่มคนเข้าไปในฉาก
- ต้องการเปลี่ยนสีเสื้อผ้าตัวละคร

---

## Remix Mode (โหมดผสม)

Remix Mode (โหมดแก้ไขพร้อมเปลี่ยน Prompt — ทำให้คุณแก้ไข Prompt ได้ขณะ Vary) ช่วยให้คุณเปลี่ยน Prompt ขณะทำ Variation:

1. เปิด Remix Mode ใน Settings
2. คลิก Vary
3. กล่อง Prompt จะปรากฏขึ้นให้แก้ไข
4. ปรับ Prompt แล้วกด Generate

**ตัวอย่าง:**
```
เดิม: a forest in summer
กด Vary + เปลี่ยน Prompt เป็น: a forest in winter
```
→ ได้ภาพป่าฤดูหนาวที่มีโครงสร้างคล้ายกับป่าฤดูร้อนเดิม

---

## กลยุทธ์การใช้ Variations

### Workflow ที่แนะนำ
1. สร้างภาพแรกด้วย Prompt
2. ถ้าไม่ถูกใจเลย → Re-run ด้วย Prompt ปรับปรุง
3. ถ้า "เกือบดี" → Vary (Subtle) 2-3 รอบ
4. ถ้าต้องการทางเลือกใหม่ → Vary (Strong)
5. ถ้าต้องการแก้เฉพาะส่วน → Vary (Region)

---

## High Variation vs Low Variation Mode

ใน Settings คุณตั้งค่าโหมด Variation Default:
- **High Variation Mode** — Vary จะเปลี่ยนแปลงมาก (เหมือน Vary Strong)
- **Low Variation Mode** — Vary จะเปลี่ยนน้อย (เหมือน Vary Subtle)

ตั้งค่าได้ที่:
- Discord: `/settings` → เลือก High/Low Variation
- เว็บ: Settings → Variation Mode

---

## Variation กับ Seed

ถ้าต้องการ Variation ที่ซ้ำได้:
```
a landscape --seed 42
กด Vary Subtle → บันทึกภาพที่ได้ + Job ID
```

ครั้งต่อไปใช้ Job ID เดิมและ Vary ใหม่ก็จะได้ชุดภาพเดิม

---

## ตัวอย่าง Iteration จริง

**โปรเจกต์: ออกแบบ Character สำหรับเกม**

```
รอบที่ 1: "a female warrior, fantasy armor" --chaos 50
→ เลือกท่าทางที่ถูกใจ

รอบที่ 2: Vary Subtle บนภาพที่เลือก ×3
→ เลือกสีชุดเกราะที่ดีที่สุด

รอบที่ 3: Vary Region บนใบหน้า
→ ปรับสีผมและสีตา

รอบที่ 4: Upscale Creative
→ งาน Final ความละเอียดสูง
```

---

## สรุป

Variations เป็นเครื่องมือ Iteration ที่ขาดไม่ได้ ใช้ Vary Subtle เมื่อเกือบพอใจและต้องการ Refinement เล็กน้อย Vary Strong เมื่อต้องการทางเลือกใหม่ในทิศทางเดิม และ Vary Region เมื่อต้องการแก้ไขเฉพาะส่วน เมื่อผสมกับ Remix Mode จะสามารถ Iterate ได้อย่างมีทิศทางและมีประสิทธิภาพยิ่งขึ้น
