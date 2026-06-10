---
title: "Personalization — ปรับแต่งสไตล์ส่วนตัว"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "เรียนรู้ระบบ Personalization ของ Midjourney ที่เรียนรู้รสนิยมจากการ Rank ภาพของคุณ แล้วสร้างภาพในสไตล์ที่คุณชอบโดยอัตโนมัติ"
readTime: "6 นาที"
readers: "0"
locked: false
order: 22
---

# Personalization — ปรับแต่งสไตล์ส่วนตัว

> อ้างอิงหลัก: [Personalization](https://docs.midjourney.com/hc/en-us/articles/32433330574221-Personalization)

---

## Personalization คืออะไร

Personalization (การปรับแต่งส่วนตัว — ระบบที่เรียนรู้ว่าคุณชอบภาพสไตล์ไหน แล้วนำไปใช้ในการสร้างภาพอัตโนมัติ) เป็นฟีเจอร์ที่ทำให้ Midjourney เรียนรู้รสนิยมของคุณจากการ Rank (จัดอันดับ — การเลือกว่าชอบภาพไหนมากกว่า) ภาพ

---

## วิธีเปิดใช้งาน

### ขั้นที่ 1 — Rank ภาพ
ไปที่ [midjourney.com/rank](https://midjourney.com/rank):
1. ระบบจะแสดงภาพ 2 รูปพร้อมกัน
2. เลือกรูปที่คุณชอบมากกว่า
3. ทำซ้ำจนครบจำนวนที่กำหนด (ต้อง Rank อย่างน้อย 200 คู่)

### ขั้นที่ 2 — ใช้ Personalization ใน Prompt
```
[Prompt] --p
```

หรือชื่อเต็ม:
```
[Prompt] --personalize
```

---

## วิธีการทำงาน

1. **คุณ Rank ภาพ** → ระบบเรียนรู้ว่าคุณชอบสไตล์ไหน
2. **เมื่อใช้ `--p`** → Midjourney ปรับ Aesthetic ให้ตรงกับรสนิยมของคุณ
3. **ยิ่ง Rank มาก** → ยิ่งเข้าใจรสนิยมได้ดี

---

## ตัวอย่างผลลัพธ์

**โดยไม่มี Personalization:**
```
a forest landscape
```
→ ภาพป่าทั่วไปตาม Default ของ Midjourney

**ด้วย Personalization:**
```
a forest landscape --p
```
→ ภาพป่าในสไตล์ที่คุณมักจะ Rank ว่าชอบ เช่น ถ้าคุณชอบแสงอบอุ่น ภาพก็จะมีแสง Golden Hour มากขึ้น

---

## Personalization Code

Midjourney สร้าง Code ส่วนตัวของคุณ ซึ่งสามารถแชร์ให้ผู้อื่นได้:

```
a landscape --p [code]
```

เช่น:
```
a landscape --p abc123
```

ถ้าเพื่อนให้ Code มา คุณสามารถใช้สไตล์เดียวกับเพื่อนได้

---

## ดู Personalization Code

- ไปที่ Profile หรือ Settings ในเว็บ Midjourney
- หรือพิมพ์ `/info` ใน Discord เพื่อดู Code

---

## ข้อแนะนำการ Rank

เพื่อให้ระบบ Personalization แม่นยำ:
- **Rank อย่างซื่อสัตย์** — เลือกตามรสนิยมจริงของคุณ
- **Rank หลากหลาย** — ไม่ใช่แค่ 1-2 สไตล์
- **Rank สม่ำเสมอ** — ทำเป็นประจำเพื่ออัปเดตรสนิยม

---

## ข้อจำกัด

- ต้อง Rank อย่างน้อย 200 คู่ก่อนจึงจะใช้งาน `--p` ได้
- ผลลัพธ์อาจแตกต่างกันตามประเภทของ Prompt
- รสนิยมอาจเปลี่ยนไป ควร Re-rank เป็นระยะ

---

## ตัวอย่างการใช้ Personalization จริง

### งาน Landscape
```
a mountain at sunrise --p
```
→ ถ้าคุณมักชอบภาพที่มีแสงอบอุ่น ภาพจะมี Golden Hour มากขึ้น

### งาน Portrait
```
a portrait of a woman --p
```
→ ถ้าคุณมักชอบภาพ Painterly ภาพจะมีสไตล์ชัดเจนขึ้น

### ผสมกับ Parameters
```
a city scene --p --ar 16:9 --v 6.1
```
→ ใช้ Personalization ร่วมกับ Parameters อื่น

---

## Personalization Code ของคนอื่น

ถ้าต้องการใช้ Style ของนักสร้างสรรค์คนอื่น:
```
a landscape --p [Code ของเขา]
```

Code นี้ได้จาก:
- ผู้สร้างแชร์ให้ตรงๆ
- ดูจาก `/info` ของบัญชีนั้น

---

## Short Personalization Code

Midjourney ยังมี Short Code ที่จำง่ายกว่าสำหรับ Personalization ส่วนตัว

ตรวจสอบ Code ล่าสุดของคุณได้ที่:
- `/info` ใน Discord
- Settings → Personalization บนเว็บ

---

## เมื่อไรควรใช้ vs ไม่ใช้ Personalization

### ควรใช้ --p เมื่อ:
- ต้องการภาพในสไตล์ที่ "คุณชอบ" โดยเฉพาะ
- งาน Personal Projects
- ต้องการให้ภาพมีเอกลักษณ์เฉพาะตัว

### ไม่ควรใช้ --p เมื่อ:
- งาน Client ที่ต้องการผลตรงตาม Brief
- ต้องการความสม่ำเสมอแบบ Neutral
- ทดสอบว่า Prompt ทำงานอย่างไรโดยไม่มีตัวแปรเพิ่ม

---

## สรุป

Personalization คือฟีเจอร์ที่ทำให้ Midjourney "รู้จักคุณ" มากขึ้น โดย Rank ภาพให้ครบ 200+ คู่ แล้วใช้ `--p` ใน Prompt เพื่อให้ได้ภาพในสไตล์ที่ตรงกับรสนิยมส่วนตัวของคุณ แชร์ Code ให้คนอื่นได้ และใช้ Code ของผู้อื่นเพื่อลองสไตล์ที่ต่างออกไป
