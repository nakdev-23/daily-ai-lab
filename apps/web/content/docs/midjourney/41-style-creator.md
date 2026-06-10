---
title: "Style Creator — สร้างสไตล์ส่วนตัว"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Style Creator เพื่อสร้างและบันทึก Style Code ส่วนตัวที่สามารถนำมาใช้ซ้ำได้ใน Prompt เพื่อผลลัพธ์ที่สม่ำเสมอ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 41
---

# Style Creator — สร้างสไตล์ส่วนตัว

> อ้างอิงหลัก: [Style Creator](https://docs.midjourney.com/hc/en-us/articles/41308374558221-Style-Creator)

---

## Style Creator คืออะไร

Style Creator (เครื่องมือสร้างสไตล์ — ฟีเจอร์ที่ให้คุณสร้างสไตล์เฉพาะตัวโดยการ Rank ภาพ แล้วบันทึกเป็น Code สำหรับใช้ซ้ำ) ช่วยให้คุณสร้าง Style Code ที่กำหนดลักษณะ Aesthetic เฉพาะ

ต่างจาก Personalization ตรงที่ Style Creator ให้คุณสร้างสไตล์หลายแบบและเลือกใช้ตามงาน

---

## วิธีสร้าง Style

1. ไปที่ **"Styles"** หรือ **"Style Creator"** ในเมนู
2. คลิก **"Create New Style"**
3. ตั้งชื่อ Style (เช่น "Moody Portrait", "Vibrant Commercial")
4. ระบบจะแสดงภาพคู่ให้ Rank
5. เลือกภาพที่ตรงกับสไตล์ที่ต้องการ
6. ทำซ้ำจนครบ (ประมาณ 20-50 คู่)
7. ระบบสร้าง **Style Code** ให้

---

## การใช้ Style Code

ใช้ Style Code ที่ได้กับ `--sref` หรือ `--style`:

```
a portrait --sref [Style Code ของคุณ]
```

หรือผ่าน Personalization:
```
a landscape --p [Style Code]
```

---

## ประโยชน์ของ Style Creator

### 1. Brand Consistency (ความสม่ำเสมอของแบรนด์)
สร้าง Style Code เฉพาะสำหรับแบรนด์ ทำให้ภาพทุกรูปมีสไตล์เดียวกัน

### 2. สร้างหลาย Styles
- Style A: "Clean Corporate Look"
- Style B: "Artistic Editorial"
- Style C: "Dark Moody"

เลือกใช้ตามประเภทงาน

### 3. แชร์ Style กับทีม
แชร์ Style Code ให้สมาชิกทีมใช้ร่วมกันเพื่อผลลัพธ์ที่สอดคล้อง

---

## Style Creator vs Style Reference (--sref)

| | Style Creator | --sref |
|--|--------------|--------|
| Input | Rank ภาพหลายคู่ | URL ภาพต้นแบบ |
| Output | Style Code | ใช้สไตล์จากภาพโดยตรง |
| ความแม่นยำ | เรียนรู้จาก Preference | ตรงกับภาพมากกว่า |
| ยืดหยุ่น | สร้างได้หลาย Style | ใช้ตรงตามภาพ |

---

## เคล็ดลับ

1. **สร้าง Style สำหรับแต่ละโปรเจกต์** — แยก Style ตามลูกค้าหรือ Campaign
2. **Rank อย่างละเอียด** — ยิ่ง Rank มาก ยิ่งแม่นยำ
3. **ทดสอบกับ Prompt หลายแบบ** — ตรวจสอบว่า Style Code ทำงานได้ดีกับ Prompt ประเภทต่างๆ

---

## Style Creator vs Personalization

| | Style Creator | Personalization (`--p`) |
|--|--------------|------------------------|
| สร้างได้กี่ Style | หลาย Style | 1 Style (ของคุณเอง) |
| ตั้งชื่อได้ | ✅ | ❌ |
| แชร์กับคนอื่น | ✅ แชร์ Code | ✅ แชร์ Code |
| วิธีสร้าง | Rank ตาม Theme | Rank ตามรสนิยมทั่วไป |

---

## ตัวอย่าง Style ที่ควรสร้าง

### สำหรับนักออกแบบ Commercial
- **"Clean Corporate"** — สไตล์สะอาด เป็นมืออาชีพ
- **"Vibrant Marketing"** — สีสันจัด สดใส
- **"Dark Luxury"** — มืด หรูหรา

### สำหรับ Illustrator
- **"Soft Watercolor"** — สีน้ำอ่อนๆ
- **"Bold Graphic"** — กราฟิกตัดเส้นชัด
- **"Fantasy Detailed"** — แฟนตาซีรายละเอียดสูง

---

## วิธีใช้ Style Code

```
a portrait --sref [Style Code จาก Style Creator]
```

หรือถ้า Midjourney รองรับ:
```
a portrait --style [Style Name ที่ตั้งไว้]
```

---

## การจัดการ Styles

- ดู Style ทั้งหมดที่สร้างได้ที่เมนู Styles
- ลบ Style ที่ไม่ใช้แล้ว
- เปลี่ยนชื่อ Style ได้ตามต้องการ

---

## สรุป

Style Creator เป็นเครื่องมือสร้าง Signature Style ของคุณหรือแบรนด์ ช่วยให้ภาพทุกรูปมีความสอดคล้องกัน เหมาะสำหรับงานที่ต้องการ Brand Consistency หรือ Visual Identity ที่ชัดเจน สร้างหลาย Style สำหรับงานแต่ละประเภทเพื่อประสิทธิภาพสูงสุด
