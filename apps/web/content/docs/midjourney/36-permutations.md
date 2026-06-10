---
title: "Permutations — สร้างหลาย Variations พร้อมกัน"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Permutations เพื่อสร้างภาพหลายแบบพร้อมกันจาก Prompt เดียว โดยระบุตัวเลือกในวงเล็บปีกกา"
readTime: "5 นาที"
readers: "0"
locked: false
order: 36
---

# Permutations — สร้างหลาย Variations พร้อมกัน

> อ้างอิงหลัก: [Permutations](https://docs.midjourney.com/hc/en-us/articles/32761322355597-Permutations)

---

## Permutations คืออะไร

Permutations (การสร้างชุดผสม — เทคนิคที่ใช้ `{}` เพื่อระบุตัวเลือกหลายอย่าง แล้ว Midjourney จะสร้างภาพจากทุกการผสมที่เป็นไปได้พร้อมกัน) ช่วยประหยัดเวลาเมื่อต้องทดสอบตัวแปรหลายอย่าง

---

## วิธีใช้

ใส่ตัวเลือกในเครื่องหมาย `{}` แยกด้วยเครื่องหมายจุลภาค:

```
a {red, blue, green} car
```

ผล: Midjourney สร้าง 3 ชุดภาพ:
- "a red car"
- "a blue car"
- "a green car"

---

## ตัวอย่างการใช้งาน

### ทดสอบสี
```
a rose in {red, white, yellow, pink} color
```
→ สร้าง 4 ชุดภาพ (กุหลาบ 4 สี)

### ทดสอบสไตล์
```
a mountain landscape, {watercolor, oil painting, pencil sketch, digital art} style
```
→ สร้าง 4 ชุดภาพ (ทิวทัศน์ภูเขาในสไตล์ต่างๆ)

### ทดสอบสภาพอากาศ
```
a forest in {spring, summer, autumn, winter}
```
→ สร้าง 4 ชุดภาพ (ป่าในแต่ละฤดู)

### ทดสอบ Parameters
```
a portrait --stylize {100, 500, 1000}
```
→ สร้าง 3 ชุดภาพ (ระดับ Stylize ต่างกัน)

---

## Permutations ซ้อนกัน (Nested)

ใช้หลาย `{}` ใน Prompt เดียว:

```
a {red, blue} {cat, dog}
```

ผล: 4 ชุดภาพ:
- "a red cat"
- "a red dog"
- "a blue cat"
- "a blue dog"

---

## ข้อจำกัด

- จำนวนสูงสุดของ Permutations ขึ้นอยู่กับแผน
  - Basic: 4 Permutations
  - Standard: 16 Permutations
  - Pro/Mega: 40 Permutations
- แต่ละ Permutation ใช้ GPU Time ของตัวเอง

---

## ประโยชน์หลัก

1. **ทดสอบ Concept** — เปรียบเทียบหลายทิศทางพร้อมกัน
2. **Client Presentation** — แสดง Variation ให้ลูกค้าเลือกได้หลายแบบ
3. **Color Palette Testing** — ทดสอบสีก่อนเลือกสีที่ชอบ
4. **ประหยัดเวลา** — ส่งคำสั่งครั้งเดียวแทนหลายครั้ง

---

## ตัวอย่างการใช้งานจริง

### A/B Testing สำหรับ Marketing
```
a product advertisement with {minimalist, vibrant, dark} aesthetic
```
→ ทดสอบ 3 Style พร้อมกัน นำเสนอลูกค้าเพื่อเลือก

### สร้าง Mood Variations
```
a mountain landscape in {morning mist, golden sunset, stormy weather, blue hour}
```
→ ภาพเดิม 4 บรรยากาศ เลือกที่เหมาะสุด

### ทดสอบ Character
```
a warrior with {red, blue, black, gold} armor
```
→ เห็น Color Scheme ทั้ง 4 แบบพร้อมกัน

---

## Permutations กับ Parameters

ใช้ {} กับ Parameters ได้ด้วย:
```
a portrait --ar {1:1, 2:3, 9:16}
```
→ 3 ชุดภาพในสัดส่วนต่างกัน

```
a landscape --stylize {100, 500, 1000}
```
→ 3 ชุดภาพ แตกต่างกันด้านความสวยงาม

---

## นับ Permutations ก่อนส่ง

ก่อนส่งคำสั่ง นับว่า Permutations ทั้งหมดมีกี่ชุด:
- `{A, B, C}` = 3 ชุด
- `{A, B} {X, Y}` = 2×2 = 4 ชุด
- `{A, B, C} {X, Y, Z}` = 3×3 = 9 ชุด

ตรวจสอบว่าไม่เกินขีดจำกัดของแผน ก่อนกด Send

---

## สรุป

Permutations เป็นเครื่องมือประหยัดเวลาที่ทรงพลัง ใช้ `{option1, option2}` ใน Prompt เพื่อสร้างภาพหลายแบบพร้อมกัน เหมาะสำหรับการทดสอบ Concept, A/B Testing สำหรับ Marketing, หรือเปรียบเทียบ Color Scheme และสไตล์ต่างๆ ก่อนเลือกทิศทางสุดท้าย
