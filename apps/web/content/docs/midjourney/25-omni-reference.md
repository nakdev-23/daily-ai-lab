---
title: "Omni Reference — อ้างอิงสากล"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Omni Reference ฟีเจอร์ใหม่ที่รวมความสามารถของ Style Reference และ Character Reference เข้าด้วยกัน พร้อมการควบคุมที่ยืดหยุ่นกว่า"
readTime: "5 นาที"
readers: "0"
locked: false
order: 25
---

# Omni Reference — อ้างอิงสากล

> อ้างอิงหลัก: [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)

---

## Omni Reference คืออะไร

Omni Reference (การอ้างอิงสากล — ฟีเจอร์ที่ช่วยให้คุณใช้ภาพอ้างอิงเพื่อถ่ายทอดทั้งสไตล์ ตัวละคร วัตถุ หรือสิ่งใดก็ตามจากภาพต้นแบบมาสู่ภาพใหม่) เป็นฟีเจอร์ที่รวมพลังของ `--sref` และ `--cref` เข้าด้วยกัน และเพิ่มความสามารถในการอ้างอิงวัตถุ สถานที่ หรือองค์ประกอบใดๆ จากภาพ

---

## วิธีใช้

```
[Prompt] --oref [URL ภาพอ้างอิง]
```

**ตัวอย่าง:**
```
a knight exploring ruins --oref https://example.com/character.jpg
the same object in a new setting --oref https://example.com/object.jpg
```

---

## Omni Weight (--ow)

ใช้ `--ow` (Omni Weight — น้ำหนักการอ้างอิง Omni) ควบคุมความแรงของการอ้างอิง:

```
--ow 100    → อ้างอิงอ่อน
--ow 500    → อ้างอิงปานกลาง (ค่าแนะนำ)
--ow 1000   → อ้างอิงแรงสูงสุด
```

---

## ความแตกต่างจาก cref และ sref

| Parameter | เน้น |
|-----------|-----|
| `--cref` | ตัวละคร (ใบหน้า, ลักษณะ) |
| `--sref` | สไตล์การวาด (Aesthetic, สี, เทคนิค) |
| `--oref` | ทุกอย่าง (Character, Object, Style, Environment) |

`--oref` มีความยืดหยุ่นมากกว่า เหมาะสำหรับงานที่ต้องการอ้างอิงหลายด้านพร้อมกัน

---

## ตัวอย่างการใช้งาน

### อ้างอิงวัตถุ
```
the same ancient sword in different settings --oref [URL ดาบ]
```
→ สร้างภาพดาบตัวเดิมในฉากต่างๆ

### อ้างอิงสถาปัตยกรรม
```
the same temple architecture at different times of day --oref [URL วัด]
```
→ สร้างภาพวัดเดิมในแสงต่างๆ

### อ้างอิงตัวละคร + วัตถุ
```
the character holding the artifact --oref [URL ตัวละคร + ของ]
```

---

## เคล็ดลับ

1. **ภาพอ้างอิงที่ดี** — ใช้ภาพที่ชัดเจน มีรายละเอียดครบ
2. **ปรับ --ow** — เริ่มจาก 500 แล้วปรับตามผล
3. **ผสมกับ Prompt ละเอียด** — เพิ่ม Prompt อธิบายฉากและอารมณ์ที่ต้องการ

---

## ตัวอย่างการใช้ Omni Reference

### อ้างอิงตัวละคร + สถานที่
```
a hero standing in a marketplace --oref [URL ภาพที่มีทั้งตัวละครและตลาด]
```
→ ได้ทั้งตัวละครและบรรยากาศตลาดที่สอดคล้องกัน

### อ้างอิงดีไซน์รถ
```
the same vehicle driving on a mountain road --oref [URL รถ]
```

### อ้างอิง Outfit (ชุดเสื้อผ้า)
```
the character wearing the same outfit in a different setting --oref [URL outfit]
```

---

## Omni Reference + Style Reference

ผสมทั้งสองเพื่อควบคุมสมบูรณ์:
```
[Prompt] --oref [URL ตัวละคร] --sref [URL สไตล์] --ow 500 --sw 300
```
→ รักษาตัวละครและใช้สไตล์ที่กำหนด

---

## ข้อแตกต่างเชิงปฏิบัติ

| กรณี | แนะนำให้ใช้ |
|------|-----------|
| แค่อยากรักษาหน้าตาตัวละคร | `--cref` |
| แค่อยากใช้สไตล์การวาด | `--sref` |
| อยากรักษาทั้งตัวละครและสไตล์ + วัตถุ | `--oref` |
| ผสมหลาย Reference | `--oref` + `--sref` |

---

## สรุป

Omni Reference เป็นฟีเจอร์ที่ทรงพลังที่สุดในการอ้างอิงภาพ ครอบคลุมทั้งตัวละคร วัตถุ และสไตล์ในเวลาเดียวกัน เหมาะสำหรับโปรเจกต์ที่ต้องการความสม่ำเสมอสูงในหลายภาพ ใช้ร่วมกับ `--ow` เพื่อควบคุมความแรง และผสมกับ `--sref` เพื่อควบคุมสไตล์เพิ่มเติม
