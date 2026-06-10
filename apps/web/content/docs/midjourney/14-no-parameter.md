---
title: "–no — Negative Prompting"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Parameter --no เพื่อบอก Midjourney ว่าไม่ต้องการให้สิ่งใดปรากฏในภาพ"
readTime: "4 นาที"
readers: "0"
locked: false
order: 14
---

# –no — Negative Prompting

> อ้างอิงหลัก: [No](https://docs.midjourney.com/hc/en-us/articles/32173351982093-No)

---

## --no คืออะไร

Parameter `--no` (Negative Prompt — คำสั่งลบ ระบุสิ่งที่ไม่ต้องการให้ปรากฏในภาพ) บอก Midjourney ว่าไม่ต้องการให้สิ่งใดปรากฏในภาพที่สร้าง

---

## วิธีใช้

```
[Prompt] --no [สิ่งที่ไม่ต้องการ]
```

**ตัวอย่าง:**
```
a beach landscape --no people
a forest --no buildings, roads
a food photo --no text, watermarks
```

---

## ใช้ได้หลายคำพร้อมกัน

แยกด้วยเครื่องหมายจุลภาค:
```
a product photo of a watch --no reflections, shadows, background clutter, text
```

---

## กรณีใช้งานจริง

### ภาพธรรมชาติสะอาด
```
a mountain landscape at sunrise --no people, buildings, power lines, roads
```

### ภาพอาหาร
```
a delicious pasta dish, studio photography --no hands, cutlery in frame, napkins
```

### ภาพ Portrait
```
portrait of a woman in garden --no sunglasses, hats, distracting background elements
```

### ภาพ Architecture
```
a modern house exterior --no cars, people, street signs
```

---

## ข้อจำกัดของ --no

`--no` ไม่ได้การันตีว่าสิ่งนั้นจะหายไปทั้งหมด เป็นเพียง "คำขอ" ไม่ใช่คำสั่งเด็ดขาด

ถ้ายังมีสิ่งที่ไม่ต้องการอยู่:
1. ลอง Re-run ใหม่
2. เพิ่มความเฉพาะเจาะจงใน `--no`
3. ใช้ Vary Region เพื่อแก้ไขเฉพาะส่วน
4. ใช้ Multi-Prompts Negative Weight แทน: `flowers::-1`

---

## --no เทียบกับ Multi-Prompt Negative Weight

| วิธี | ผล |
|------|-----|
| `--no flowers` | พยายามไม่ให้มีดอกไม้ |
| `flowers::-1` | ลดน้ำหนักดอกไม้ (อาจยังมีบ้าง) |

`--no` มีผลแรงกว่า แต่ Multi-Prompt Negative ให้การควบคุมระดับที่ละเอียดกว่า

---

## รูปแบบการเขียน --no ที่ถูกต้อง

### วิธีที่ 1 — คั่นด้วย comma
```
a landscape --no people, cars, buildings
```

### วิธีที่ 2 — หลาย --no
```
a landscape --no people --no buildings --no power lines
```

### วิธีที่ 3 — ใช้ "and"
```
a portrait --no glasses and hats and heavy makeup
```

---

## --no กับสิ่งที่ Midjourney เพิ่มอัตโนมัติ

Midjourney มักเพิ่มบางอย่างโดยอัตโนมัติที่คุณอาจไม่ต้องการ:

| สถานการณ์ | มักเพิ่ม | แก้ด้วย |
|----------|---------|--------|
| ภาพอาหาร | มือ, ช้อนส้อม | `--no hands, cutlery` |
| ภาพทิวทัศน์ | คน, รถ | `--no people, vehicles` |
| ภาพ Product | เงา, พื้นผิวสะท้อน | `--no shadows, reflections` |
| ภาพ Abstract | ตัวอักษร | `--no text, letters, words` |

---

## กรณีที่ --no ไม่ทำงาน

บางครั้ง Midjourney ไม่ฟัง `--no`:
1. **ลอง Re-run** — ผลลัพธ์ต่างกันแต่ละครั้ง
2. **เพิ่มความเฉพาะเจาะจง** — `--no realistic skin, human skin texture`
3. **ใช้ Vary Region** — ลบส่วนที่ไม่ต้องการหลังสร้าง
4. **ปรับ Prompt** — บอกว่าต้องการอะไร แทนที่จะบอกว่าไม่ต้องการ

---

## เปรียบเทียบ --no กับการบอกใน Prompt

| วิธี | ตัวอย่าง |
|------|---------|
| ใช้ --no | `a forest --no people` |
| บอกใน Prompt | `a deserted empty forest with no humans` |

ทั้งสองวิธีทำงานได้ แต่ `--no` ง่ายกว่าสำหรับการลบสิ่งที่ไม่ต้องการ

---

## สรุป

`--no` เป็น Parameter ที่ใช้ง่ายและมีประโยชน์มาก ใช้เมื่อต้องการภาพที่สะอาดปราศจากสิ่งรบกวน หรือเมื่อ Midjourney มักเพิ่มสิ่งที่ไม่ต้องการโดยอัตโนมัติ ถ้า `--no` ยังไม่ได้ผล ลองใช้ Vary Region หรือ Editor เพื่อลบส่วนนั้นออกหลังจากสร้างภาพแล้ว
