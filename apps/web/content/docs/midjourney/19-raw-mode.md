---
title: "Raw Mode — โหมดดิบไม่ตกแต่ง"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "เรียนรู้ Raw Mode ที่ปิดการตกแต่งอัตโนมัติของ Midjourney เพื่อให้ได้ภาพที่ตรงตาม Prompt ที่สุด"
readTime: "4 นาที"
readers: "0"
locked: false
order: 19
---

# Raw Mode — โหมดดิบไม่ตกแต่ง

> อ้างอิงหลัก: [Raw](https://docs.midjourney.com/hc/en-us/articles/32634113811853-Raw)

---

## Raw Mode คืออะไร

`--style raw` (โหมดดิบ — โหมดที่ปิดการเพิ่มสไตล์หรือการตกแต่งอัตโนมัติของ Midjourney ให้ได้ภาพตรงตาม Prompt มากที่สุด) ทำให้ Midjourney ไม่เพิ่ม Aesthetic (รสนิยมทางศิลปะ) ของตัวเองเข้าไปในภาพ

ปกติ Midjourney จะ "ตีความ" Prompt ในแบบที่มันคิดว่าสวยที่สุด Raw Mode ปิดการตีความนั้น

---

## วิธีใช้

```
[Prompt] --style raw
```

**ตัวอย่าง:**
```
a product photo of a camera on white background --style raw
a technical diagram of a bicycle --style raw
a portrait photo --style raw
```

---

## เปรียบเทียบ Normal vs Raw

| โหมด | ผลลัพธ์ |
|------|---------|
| ปกติ (ไม่มี --style raw) | Midjourney เพิ่ม Mood, สี, สไตล์ตามความชอบ |
| `--style raw` | ตรงตาม Prompt โดยตรง ไม่มีการตกแต่งเพิ่ม |

**ตัวอย่าง:**
```
Prompt: a red apple
ปกติ:    ภาพแอปเปิ้ลสวยงาม อาจมีแสงสวย ฉากหลังศิลปะ
Raw:     ภาพแอปเปิ้ลสีแดงตรงๆ บนพื้นขาว
```

---

## เหมาะสำหรับงานอะไร

### Commercial Photography (ภาพถ่ายเชิงพาณิชย์)
```
a bottle of perfume, studio shot --style raw
```
→ ได้ภาพผลิตภัณฑ์ที่ Clean ไม่มีการตกแต่งเกิน

### Technical Illustration (ภาพทางเทคนิค)
```
a schematic diagram of a car engine --style raw
```
→ ได้ภาพที่ตรงไปตรงมา ไม่มีความ Artistic เพิ่ม

### การทดสอบ Prompt
```
a city skyline --style raw
```
→ เห็นว่า Midjourney เข้าใจ Prompt อย่างไรโดยไม่มีการ "ช่วยเสริม"

---

## Raw Mode vs Stylize 0

| `--style raw` | `--stylize 0` |
|--------------|---------------|
| ปิดการตกแต่งทั้งหมด | ลด Stylize แต่ยังมีการประมวลผลบางส่วน |
| ตรงตาม Prompt มากที่สุด | ตรงกว่าค่าปกติ แต่ไม่เท่า Raw |

---

## ตัวอย่างการใช้ Raw Mode

### Product Photography (ภาพถ่ายผลิตภัณฑ์)
```
a bottle of olive oil on marble surface, studio photography --style raw
```
→ ได้ภาพที่ Clean ตรงไปตรงมา ไม่มีการตกแต่งเพิ่มเติมจาก AI

### Food Photography (ภาพอาหาร)
```
spaghetti carbonara in a white bowl, top view --style raw
```
→ ภาพอาหารที่สมจริง ไม่มีแสงหรือ Mood ที่ Midjourney เพิ่มเอง

### Architecture (สถาปัตยกรรม)
```
modern office building exterior, blue sky, daytime --style raw
```
→ ภาพอาคารที่ตรงตาม Prompt ไม่มีการเพิ่ม Mood หรือ Filter

---

## Raw Mode กับ Realistic Photography

Raw Mode มักให้ผลที่ "สมจริงมากขึ้น" ในการถ่ายภาพ:

| โหมด | ผลภาพถ่าย |
|------|----------|
| ปกติ | อาจเพิ่ม Cinematic Look, Grain, Color Grading |
| Raw Mode | ภาพสะอาดตรงไปตรงมา เหมือนภาพถ่ายจริง |

---

## Raw กับ Niji Model

ใน Niji Model ใช้ `--style cute`, `--style scenic`, หรือ `--style expressive` แทน `--style raw` เพราะ Niji มีตัวเลือกสไตล์เฉพาะของตัวเอง

---

## เมื่อไรควรหลีกเลี่ยง Raw Mode

- งาน Creative ที่ต้องการความสวยงามสูง → ใช้ Stylize สูงแทน
- งาน Artistic ที่ต้องการการตีความ → ปล่อยให้ Midjourney ตัดสินใจ
- งาน Fantasy/Sci-Fi ที่ต้องการบรรยากาศพิเศษ → Raw จะทำให้ดูธรรมดา

---

## สรุป

ใช้ `--style raw` เมื่อต้องการผลลัพธ์ที่ตรงตาม Prompt โดยไม่มีการตกแต่งจาก Midjourney เหมาะสำหรับงาน Commercial Photography, Technical Illustration และงานที่ต้องการความสมจริงสูงสุด หลีกเลี่ยง Raw Mode สำหรับงาน Creative ที่ต้องการความสวยงามและ Atmosphere
