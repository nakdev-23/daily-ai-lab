---
title: "Repeat — สร้างซ้ำหลายครั้ง"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Parameter --repeat เพื่อสร้างภาพจาก Prompt เดิมหลายชุดพร้อมกัน เหมาะสำหรับการสร้าง Assets จำนวนมากอย่างรวดเร็ว"
readTime: "4 นาที"
readers: "0"
locked: false
order: 37
---

# Repeat — สร้างซ้ำหลายครั้ง

> อ้างอิงหลัก: [Repeat](https://docs.midjourney.com/hc/en-us/articles/32757107922061-Repeat)

---

## Repeat คืออะไร

Parameter `--repeat` หรือ `--r` (การทำซ้ำ — สั่งให้ Midjourney สร้างภาพจาก Prompt เดิมหลายชุดพร้อมกัน แต่ละชุดมี 4 ภาพ) ช่วยให้คุณสร้างภาพหลายชุดในคำสั่งเดียว

---

## วิธีใช้

```
[Prompt] --repeat [จำนวน]
```

**ตัวอย่าง:**
```
a fantasy landscape --repeat 4
```
→ สร้าง 4 ชุดภาพ = 16 ภาพ (แต่ละชุดมี 4 ภาพ)

**ย่อได้:**
```
a fantasy landscape --r 4
```

---

## จำนวน Repeat สูงสุด

| แผน | Repeat สูงสุด |
|-----|--------------|
| Basic | 4 |
| Standard | 10 |
| Pro | 40 |
| Mega | 40 |

---

## Repeat vs Permutations

| วิธี | ใช้เมื่อ |
|------|---------|
| `--repeat` | ต้องการภาพหลายชุดจาก Prompt เดิม (ผลต่างกันตามการสุ่ม) |
| `{}` Permutations | ต้องการภาพจาก Prompt ที่แตกต่างกัน |

---

## ตัวอย่างการใช้งาน

### สร้าง Stock Images (ภาพสต็อก — ภาพสำเร็จรูปสำหรับใช้ในงานต่างๆ)
```
diverse people working in office, professional photography --repeat 10
```
→ ได้ภาพคนทำงาน 40 รูป (10 ชุด × 4 ภาพ)

### หา Best Shot
```
a product photo of perfume bottle --repeat 5
```
→ ได้ตัวเลือก 20 ภาพ เลือกที่ดีที่สุด

---

## ข้อสังเกต

- แต่ละชุดใช้ GPU Time ของตัวเอง (Repeat 4 = ใช้ GPU Time 4 เท่า)
- เหมาะสำหรับแผน Standard ขึ้นไปที่มี Relax Mode

---

## ผสม Repeat กับ Parameters อื่น

```
a tropical beach --repeat 5 --chaos 50
```
→ ได้ชุดภาพชายหาด 5 ชุด (= 20 ภาพ) แต่ละชุดมีความหลากหลายปานกลาง

```
a character design --repeat 3 --seed 42
```
→ ได้ชุดภาพ Character 3 ชุดจาก Seed เดิม

---

## Repeat กับงานหลายโปรเจกต์

### สร้าง Asset Library (คลังทรัพยากรภาพ)
```
a seamless texture of wood grain --repeat 8 --tile
```
→ ได้ Pattern ไม้ 8 แบบสำหรับเลือกใช้

### สร้าง Social Media Content
```
a motivational quote background, minimal design --repeat 10
```
→ ได้ Background 40 แบบสำหรับโพสต์ 10 สัปดาห์

---

## วิธีบริหาร GPU Time กับ Repeat

| วิธีใช้ | ประสิทธิภาพ |
|--------|-----------|
| Repeat + Fast Mode | เร็ว แต่ใช้ GPU Time มาก |
| Repeat + Relax Mode | ช้า แต่ประหยัด GPU Time |
| Repeat + --q 0.5 | เร็วพอ ประหยัดครึ่งหนึ่ง |

---

## ข้อสังเกต

- แต่ละ Repeat เป็นงานแยกกัน ดูได้ใน Job Queue (คิวงาน)
- ถ้าต้องการยกเลิก ยกเลิกแต่ละ Job ได้ทีละชิ้น
- Repeat เหมาะกับ Relax Mode มากที่สุด เพราะใช้ทรัพยากรมาก

---

## สรุป

`--repeat` เหมาะสำหรับงานที่ต้องการภาพจำนวนมากจาก Concept เดียวกัน ใช้ร่วมกับ Relax Mode เพื่อประหยัด GPU Fast Time เหมาะสำหรับสร้าง Asset Library, Stock Content หรืองานที่ต้องการตัวเลือกมากๆ ในคำสั่งเดียว
