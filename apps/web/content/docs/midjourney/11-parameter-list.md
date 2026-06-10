---
title: "รายการ Parameters ทั้งหมด"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "คู่มืออ้างอิง Parameters ทุกตัวของ Midjourney พร้อมคำอธิบายภาษาไทยและตัวอย่างการใช้งาน"
readTime: "10 นาที"
readers: "0"
locked: false
order: 11
---

# รายการ Parameters ทั้งหมด

> อ้างอิงหลัก: [Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List)

---

## Parameter คืออะไร

Parameter (คำสั่งพิเศษ — ตัวเลือกเพิ่มเติมที่ควบคุมผลลัพธ์ของภาพ) คือคำสั่งที่เพิ่มท้าย Prompt ด้วยเครื่องหมาย `--` เพื่อปรับแต่งผลลัพธ์

**รูปแบบ:**
```
/imagine prompt: [คำอธิบายภาพ] --[parameter] [ค่า]
```

**ตัวอย่าง:**
```
/imagine prompt: a serene lake --ar 16:9 --stylize 500 --v 6
```

---

## Parameters หลัก

### --ar หรือ --aspect (Aspect Ratio — สัดส่วนภาพ)
กำหนดอัตราส่วนความกว้างต่อความสูงของภาพ

```
--ar 1:1      → ภาพสี่เหลี่ยมจัตุรัส (Instagram)
--ar 16:9     → ภาพวางนอน (วอลเปเปอร์, วิดีโอ)
--ar 9:16     → ภาพแนวตั้ง (Story, TikTok)
--ar 4:3      → ภาพมาตรฐาน
--ar 3:2      → ภาพถ่ายทั่วไป
--ar 21:9     → ภาพ Ultrawide (จอกว้างพิเศษ)
```

### --v หรือ --version (Model Version — เวอร์ชันโมเดล)
เลือกรุ่น AI ที่ใช้สร้างภาพ

```
--v 7         → เวอร์ชัน 7 (ล่าสุด ณ ปี 2025)
--v 6.1       → เวอร์ชัน 6.1 
--v 6         → เวอร์ชัน 6
--v 5.2       → เวอร์ชัน 5.2 (สไตล์เก่า)
--niji 6      → โมเดลสไตล์ Anime
```

### --stylize หรือ --s (Stylize — ระดับสไตล์)
ควบคุมว่า Midjourney จะเพิ่ม "ความเป็นศิลปะ" มากน้อยแค่ไหน

```
--stylize 0      → น้อยที่สุด — ตรงตาม Prompt มากที่สุด แต่ดูธรรมดา
--stylize 100    → ค่าเริ่มต้น
--stylize 500    → สวยงาม ลื่นไหล แต่อาจห่างจาก Prompt
--stylize 1000   → ความเป็นศิลปะสูงสุด — สวยมาก แต่ตีความ Prompt อิสระ
```

**ย่อได้เป็น `--s`:**
```
a forest --s 750
```

---

## Parameters ปรับรายละเอียด

### --chaos หรือ --c (Chaos — ความหลากหลาย)
ปรับความหลากหลายระหว่าง 4 ภาพที่สร้าง

```
--chaos 0     → 4 ภาพคล้ายกันมาก (ค่าเริ่มต้น)
--chaos 50    → มีความหลากหลายปานกลาง
--chaos 100   → 4 ภาพแตกต่างกันมากที่สุด
```

### --weird หรือ --w (Weird — ความแปลกประหลาด)
เพิ่มความแปลก ไม่ธรรมดาในภาพ

```
--weird 0     → ปกติ (ค่าเริ่มต้น)
--weird 1000  → แปลกสุดขีด
--weird 250   → เพิ่มความน่าสนใจโดยไม่แปลกเกินไป
```

### --quality หรือ --q (Quality — คุณภาพ)
ปรับเวลาในการ Render (ประมวลผลสร้างภาพ)

```
--quality 0.25  → เร็วมาก คุณภาพน้อย
--quality 0.5   → เร็ว
--quality 1     → ค่าเริ่มต้น — สมดุล
```

### --seed (Seed — ค่าตัวเลขเริ่มต้น)
กำหนดค่าเริ่มต้นของ Random (การสุ่ม — ทำให้ได้ผลเหมือนกันทุกครั้ง)

```
--seed 12345    → ใช้ตัวเลขใดก็ได้ 0-4294967295
```

ประโยชน์: สร้างภาพเดิมซ้ำได้แม้ใช้ Prompt เดิม หรือเปรียบเทียบผลต่างของ Prompt

---

## Parameters ควบคุมเนื้อหา

### --no (Negative Prompt — สิ่งที่ไม่ต้องการ)
บอกสิ่งที่ไม่ต้องการให้ปรากฏในภาพ

```
a beach --no people
a forest --no buildings, roads, cars
a portrait --no glasses, hats
```

### --tile (Tile — สร้างแบบ Pattern)
สร้างภาพที่ต่อกันได้แบบ Seamless (ไร้รอยต่อ)

```
a floral pattern --tile
```

เหมาะสำหรับ: Background, Texture, Pattern การออกแบบ

### --repeat หรือ --r (Repeat — ทำซ้ำ)
สร้างภาพจาก Prompt เดิมหลายครั้งพร้อมกัน

```
a sunset --repeat 4
```
ความหมาย: สร้าง 4 ชุดภาพจาก Prompt เดิม (ใช้ GPU Time มากขึ้น)

---

## Parameters สไตล์พิเศษ

### --style raw (Raw Mode — โหมดดิบ)
ปิดการตกแต่งโดย AI ให้ตรงตาม Prompt มากที่สุด

```
a product photo of headphones --style raw
```

เหมาะสำหรับ: ภาพถ่าย, งาน Commercial ที่ต้องการความตรงไปตรงมา

### --niji (Niji — โมเดล Anime)
ใช้โมเดลพิเศษสำหรับสไตล์ Anime และ Illustration

```
a warrior princess --niji 6
```

---

## Parameters อ้างอิงภาพ

### --sref (Style Reference — อ้างอิงสไตล์)
ใช้ภาพเพื่ออ้างอิงสไตล์

```
a mountain landscape --sref https://example.com/style.jpg
```

### --cref (Character Reference — อ้างอิงตัวละคร)
ใช้ภาพเพื่อรักษาความเป็นตัวละครเดิม

```
the same character in a new scene --cref https://example.com/character.jpg
```

### --iw (Image Weight — น้ำหนักภาพ)
ควบคุมอิทธิพลของ Image Prompt

```
[image URL] a new scene --iw 1.5
```

---

## ตาราง Quick Reference

| Parameter | ย่อ | ค่า | ใช้เมื่อ |
|-----------|-----|-----|---------|
| `--aspect` | `--ar` | W:H เช่น 16:9 | ปรับสัดส่วนภาพ |
| `--version` | `--v` | 5, 6, 7 | เลือกรุ่น AI |
| `--stylize` | `--s` | 0-1000 | ปรับความสวยงาม |
| `--chaos` | `--c` | 0-100 | ปรับความหลากหลาย |
| `--weird` | `--w` | 0-3000 | เพิ่มความแปลก |
| `--quality` | `--q` | 0.25-1 | ปรับคุณภาพ |
| `--seed` | - | 0-4294967295 | ทำซ้ำผลลัพธ์ |
| `--no` | - | คำต่างๆ | ลบสิ่งไม่ต้องการ |
| `--tile` | - | (ไม่มีค่า) | สร้าง Pattern |
| `--repeat` | `--r` | 1-40 | สร้างซ้ำหลายครั้ง |
| `--style raw` | - | raw | โหมดดิบไม่ตกแต่ง |
| `--niji` | - | 5, 6 | สไตล์ Anime |

---

## ตัวอย่างการใช้ Parameters รวมกัน

```
a serene japanese garden at dawn, koi pond, cherry blossoms 
--ar 3:2 --v 6.1 --stylize 400 --no people --seed 42
```

```
cyberpunk street market --ar 9:16 --weird 500 --stylize 750 --v 7
```

---

## สรุป

Parameters คือเครื่องมือปรับแต่งที่ทรงพลัง เริ่มจาก `--ar` เพื่อกำหนดสัดส่วน และ `--v` เพื่อเลือกเวอร์ชัน จากนั้นค่อยๆ เพิ่ม `--stylize`, `--chaos`, `--weird` ตามต้องการ เมื่อคุ้นเคยแล้ว Parameters จะช่วยให้คุณควบคุมผลลัพธ์ได้อย่างแม่นยำ
