---
title: "Text Generation — สร้างตัวอักษรในภาพ"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีสร้างภาพที่มีตัวอักษรหรือข้อความภาษาอังกฤษที่อ่านได้จริงด้วย Midjourney เหมาะสำหรับงานออกแบบโลโก้ โปสเตอร์ และ Signage"
readTime: "6 นาที"
readers: "0"
locked: false
order: 26
---

# Text Generation — สร้างตัวอักษรในภาพ

> อ้างอิงหลัก: [Text Generation](https://docs.midjourney.com/hc/en-us/articles/32502277092109-Text-Generation)

---

## Text Generation คืออะไร

Text Generation (การสร้างตัวอักษรในภาพ — ความสามารถของ Midjourney ในการสร้างข้อความที่อ่านได้จริงภายในภาพ) เป็นฟีเจอร์ที่เพิ่มเข้ามาใน Midjourney เวอร์ชัน 6 ขึ้นไป ก่อนหน้านี้ Midjourney มักสร้างตัวอักษรที่เบลอหรืออ่านไม่ออก

---

## วิธีใส่ข้อความในภาพ

ใช้เครื่องหมายอัญประกาศคู่ (`"`) ล้อมรอบข้อความที่ต้องการ:

```
a poster with the text "Hello World"
a shop sign reading "Coffee Shop"
```

**ตัวอย่าง:**
```
a vintage travel poster for Paris, text reading "Discover Paris"
a warning sign in a dark forest that says "Beware"
```

---

## สิ่งที่ทำได้

### ป้ายและสัญลักษณ์
```
a neon sign glowing in the dark saying "Open 24 Hours"
a wooden sign on a trail reading "Summit - 2 miles"
```

### โลโก้และ Branding
```
a minimalist logo design with the text "NOVA" on white background
a coffee brand logo with script font saying "Morning Brew"
```

### โปสเตอร์และการ์ด
```
a motivational poster with mountains and text "Keep Going"
a birthday card design with "Happy Birthday" in bubble letters
```

### Book Cover (หน้าปกหนังสือ)
```
a fantasy book cover titled "The Last Dragon" 
```

---

## เคล็ดลับการสร้างข้อความ

1. **ใช้ภาษาอังกฤษเท่านั้น** — Midjourney สร้างข้อความภาษาอังกฤษได้ดีที่สุด
2. **ข้อความสั้นๆ** — 1-5 คำมักได้ผลดีที่สุด
3. **ระบุสไตล์ Font** — เช่น "in bold serif font", "handwritten style", "neon glowing"
4. **บอกตำแหน่ง** — "at the top", "centered", "at the bottom"

**ตัวอย่าง Prompt ที่ดี:**
```
a luxury perfume advertisement, elegant white bottle, gold text "ESSENCE" in serif font, minimalist background
```

---

## ข้อจำกัด

- ตัวอักษรอาจยังไม่สมบูรณ์ทุกครั้ง ลอง Re-run ถ้าไม่ถูกใจ
- ข้อความยาวมักได้ผลไม่ดี
- ภาษาไทยและภาษาอื่นที่ไม่ใช่ Latin Script อาจไม่ทำงาน

---

## แก้ไขข้อความด้วย Editor

ถ้าข้อความในภาพผิด ใช้ Editor:
1. คลิก **Edit** บนภาพที่สร้าง
2. ล้อมรอบพื้นที่ข้อความ
3. พิมพ์ Prompt ใหม่ระบุข้อความที่ต้องการ
4. Generate ส่วนนั้นใหม่

---

## สรุป

Text Generation ของ Midjourney V6+ ช่วยให้สร้างภาพที่มีข้อความอ่านได้จริงได้ดีขึ้นมาก ใช้เครื่องหมาย `"..."` ล้อมรอบข้อความใน Prompt และระบุสไตล์ Font เพื่อผลลัพธ์ที่ดีที่สุด
