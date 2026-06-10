---
title: "Creation Settings ใน Discord"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีตั้งค่าการสร้างภาพเริ่มต้นใน Discord ผ่านคำสั่ง /settings รวมถึงการตั้งค่า Model, Mode, และ Parameters เริ่มต้น"
readTime: "5 นาที"
readers: "0"
locked: false
order: 56
---

# Creation Settings ใน Discord

> อ้างอิงหลัก: [Creation Settings in Discord](https://docs.midjourney.com/hc/en-us/articles/32868982949517-Creation-Settings-in-Discord)

---

## /settings คืออะไร

คำสั่ง `/settings` เปิดแผงตั้งค่าแบบกราฟิกใน Discord ที่ช่วยให้ตั้งค่าเริ่มต้นสำหรับการสร้างภาพทุกครั้ง แทนที่จะต้องพิมพ์ Parameters ทุกครั้ง

---

## วิธีเข้าถึง

พิมพ์ `/settings` ใน Discord แล้ว Midjourney Bot จะส่งข้อความที่มีปุ่มต่างๆ ให้กด

---

## ตัวเลือกใน Settings

### Model Version
เลือก Model ที่ใช้สร้างภาพ:
- MJ Version 7
- MJ Version 6.1
- MJ Version 6
- MJ Version 5.2
- Niji Version 6

### Speed
เลือกโหมดความเร็ว:
- **Fast Mode** — ปกติ
- **Relax Mode** — ช้ากว่า ไม่ใช้ GPU Fast Time
- **Turbo Mode** — เร็วมาก ใช้ GPU 2x

### Quality
เลือกคุณภาพเริ่มต้น:
- Half Quality
- Base Quality
- High Quality (2x GPU)

### Stylize
เลือกระดับ Stylize เริ่มต้น:
- Stylize low (50)
- Stylize med (100) — ค่าเริ่มต้น
- Stylize high (250)
- Stylize very high (750)

### Public/Stealth
- Public Mode
- Stealth Mode (ต้องการแผน Pro+)

### Remix Mode
- เปิด/ปิด Remix Mode

### Variation Mode
- High Variation (Strong)
- Low Variation (Subtle)

---

## ตัวอย่าง Settings ที่แนะนำ

### สำหรับมือใหม่
```
Model: MJ Version 6.1
Speed: Fast Mode
Quality: Base Quality
Stylize: Stylize med
Remix: Off
```

### สำหรับงาน Professional
```
Model: MJ Version 7
Speed: Fast Mode
Quality: High Quality
Stylize: Stylize high
Remix: On (เพื่อ Iterate ง่าย)
Stealth: On (ถ้ามีแผน Pro)
```

### สำหรับ Anime/Illustration
```
Model: Niji Version 6
Stylize: Stylize high
```

---

## /prefer suffix — ตั้งค่า Parameters เริ่มต้น

ถ้าต้องการตั้ง Parameters เฉพาะที่จะเพิ่มท้าย Prompt ทุกครั้ง:

```
/prefer suffix --v 6.1 --ar 16:9
```

ทุกครั้งที่ใช้ `/imagine` Midjourney จะเพิ่ม `--v 6.1 --ar 16:9` ให้อัตโนมัติ

### ลบ Suffix
```
/prefer suffix
```
(ส่งโดยไม่มีค่า = ลบ Suffix ทั้งหมด)

---

## /prefer option — บันทึก Parameter ชุด

```
/prefer option set portrait --ar 2:3 --stylize 500 --v 6.1
```

ใช้:
```
/imagine prompt: a woman --portrait
```
= เท่ากับ:
```
/imagine prompt: a woman --ar 2:3 --stylize 500 --v 6.1
```

---

## การ Reset Settings

ถ้าต้องการรีเซ็ตการตั้งค่าทั้งหมดกลับไปเป็นค่าเริ่มต้น:
```
/settings
```
แล้วกดปุ่ม Reset หรือเลือกค่าเริ่มต้นแต่ละรายการ

---

## Prefer Option ที่ตั้งไว้ดูและลบได้

### ดูรายการ Prefer Options ทั้งหมด
```
/prefer option list
```

### ลบ Prefer Option
```
/prefer option set [ชื่อ]
```
(ส่งโดยไม่มีค่า = ลบ)

---

## ตัวอย่าง Settings Profile สำหรับงานต่างๆ

### สำหรับงาน Social Media
```
/prefer option set social --ar 1:1 --v 6.1 --stylize 400
```

### สำหรับงาน Illustration
```
/prefer option set illustration --ar 2:3 --stylize 750 --niji 6
```

### สำหรับงาน Photorealistic
```
/prefer option set photo --v 7 --style raw --stylize 100
```

### สำหรับงาน Draft ทดสอบ
```
/prefer option set draft --quality 0.25 --chaos 50
```

---

## เคล็ดลับ Settings ที่ดี

1. **ตั้ง Version ล่าสุดเสมอ** — อัปเดตเมื่อ Midjourney ออก Model ใหม่
2. **เปิด Remix Mode** — ช่วยให้ Iterate งานได้สะดวก
3. **ตั้ง Low Variation** — ถ้าต้องการผลที่สม่ำเสมอ
4. **บันทึก Profile ต่างๆ** — สร้าง `/prefer option` สำหรับแต่ละประเภทงาน

---

## สรุป

ใช้ `/settings` เพื่อตั้งค่าเริ่มต้นสำหรับการสร้างภาพทุกครั้ง ลดการพิมพ์ Parameters ซ้ำ และใช้ `/prefer option` เพื่อบันทึกชุด Parameters ที่ใช้บ่อยสำหรับงานแต่ละประเภท ทั้งนี้การตั้งค่าที่ดีช่วยให้ Workflow มีประสิทธิภาพและได้ผลลัพธ์ที่สม่ำเสมอ
