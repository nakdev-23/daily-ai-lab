---
title: "Seeds — ทำซ้ำผลลัพธ์"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Parameter --seed เพื่อทำซ้ำผลลัพธ์เดิมหรือสร้างชุดภาพที่สอดคล้องกัน"
readTime: "5 นาที"
readers: "0"
locked: false
order: 16
---

# Seeds — ทำซ้ำผลลัพธ์

> อ้างอิงหลัก: [Seeds](https://docs.midjourney.com/hc/en-us/articles/32604356340877-Seeds)

---

## Seed คืออะไร

Seed (ค่าเริ่มต้นสุ่ม — ตัวเลขที่ใช้เป็นจุดเริ่มต้นในการสร้างภาพ ถ้าใช้ตัวเลขเดิมจะได้ผลเดิม) คือตัวเลขที่กำหนดว่า Midjourney เริ่มต้นสร้างภาพจาก "จุดไหน" ในระบบ AI

โดยปกติ ถ้าคุณใช้ Prompt เดิมสองครั้ง จะได้ภาพต่างกัน เพราะ Midjourney สุ่มค่า Seed ใหม่ทุกครั้ง

แต่ถ้าคุณระบุ Seed ตายตัว Midjourney จะใช้จุดเริ่มต้นเดิม ทำให้ได้ภาพเดิมทุกครั้ง

---

## วิธีใช้

```
[Prompt] --seed [ตัวเลข 0 ถึง 4294967295]
```

**ตัวอย่าง:**
```
a serene lake at dawn --seed 12345
```

ทุกครั้งที่ใช้ Prompt นี้กับ Seed 12345 จะได้ภาพชุดเดิม

---

## วิธีค้นหา Seed ของภาพที่สร้างแล้ว

### บน Discord
1. คลิก Emoji ✉️ (Envelope — ซองจดหมาย) ที่ข้อความภาพ
2. Midjourney Bot จะส่ง DM พร้อม Job ID และ Seed Number
3. บันทึก Seed เพื่อใช้ซ้ำ

### บนเว็บไซต์
1. คลิกที่ภาพ → เลือก "Copy Job ID"
2. หรือดูจากรายละเอียดภาพใน Archive

---

## ประโยชน์ของ Seed

### 1. ทำซ้ำผลลัพธ์ที่ชอบ
ถ้าได้ภาพที่ถูกใจแต่ต้องการปรับ Prompt เล็กน้อย ใช้ Seed เดิมเพื่อรักษาโครงสร้างหลัก:

```
a woman in a red dress, park background --seed 42
```
ปรับเป็น:
```
a woman in a blue dress, park background --seed 42
```
→ โครงสร้างและองค์ประกอบหลักยังคล้ายกัน แค่เปลี่ยนสีชุด

### 2. สร้างชุดภาพที่สอดคล้องกัน
สำหรับงาน Illustration Series หรือ Character Sheet (ชุดภาพตัวละครในมุมต่างๆ):

```
a knight character, front view --seed 500
a knight character, side view --seed 500
a knight character, back view --seed 500
```
→ ตัวละครจะมีความสอดคล้องกันในแต่ละมุม

### 3. ทดสอบตัวแปร
เพื่อเปรียบเทียบผลของ Parameter ต่างๆ บนพื้นฐานเดียวกัน:

```
a forest --seed 999 --stylize 100
a forest --seed 999 --stylize 750
a forest --seed 999 --stylize 1000
```
→ เห็นความต่างของ Stylize ได้ชัดเจน

---

## ข้อจำกัด

- Seed เดิมกับ Prompt เดิมให้ผลเดิม แต่ถ้าเปลี่ยน **เวอร์ชัน Model** อาจได้ผลต่างออกไป
- Seed ไม่ใช่ Guarantee (การรับประกัน) แบบ 100% ว่าจะได้ภาพเหมือนกันทุกพิกเซล แต่จะใกล้เคียงมาก

---

## สรุป

`--seed` เป็นเครื่องมือสำหรับ Workflow ที่ต้องการความสม่ำเสมอ ใช้เมื่อต้องการทำซ้ำผลลัพธ์ เปรียบเทียบตัวแปร หรือสร้างชุดภาพตัวละครที่สอดคล้องกัน
