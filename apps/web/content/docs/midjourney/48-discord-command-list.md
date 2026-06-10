---
title: "รายการคำสั่ง Discord ทั้งหมด"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "รายการคำสั่ง Discord ทั้งหมดของ Midjourney พร้อมคำอธิบายภาษาไทย เป็น Reference Guide สำหรับผู้ใช้ Discord"
readTime: "6 นาที"
readers: "0"
locked: false
order: 48
---

# รายการคำสั่ง Discord ทั้งหมด

> อ้างอิงหลัก: [Discord Command List](https://docs.midjourney.com/hc/en-us/articles/32894521590669-Discord-Command-List)

---

## คำสั่งหลัก

### /imagine
**การใช้งาน:** สร้างภาพจาก Prompt
```
/imagine prompt: [คำอธิบายภาพ]
```
**ตัวอย่าง:**
```
/imagine prompt: a mountain at sunset, oil painting style --ar 16:9
```

### /blend
**การใช้งาน:** ผสมภาพ 2-5 รูปเข้าด้วยกัน
```
/blend
```
จากนั้นอัปโหลดภาพ 2-5 รูป

### /describe
**การใช้งาน:** วิเคราะห์ภาพและสร้าง Prompt จากภาพ
```
/describe [อัปโหลดภาพ]
```

---

## คำสั่งจัดการบัญชี

### /info
**การใช้งาน:** ดูข้อมูลบัญชี GPU Time ที่เหลือ และสถิติ
```
/info
```

### /subscribe
**การใช้งาน:** รับลิงก์หน้าสมัครสมาชิก
```
/subscribe
```

### /show
**การใช้งาน:** เรียกงานเดิมกลับมาด้วย Job ID
```
/show job_id: [Job ID]
```

---

## คำสั่งตั้งค่าโหมด

### /fast
**การใช้งาน:** สลับไปใช้ Fast Mode
```
/fast
```

### /relax
**การใช้งาน:** สลับไปใช้ Relax Mode (ต้องการแผน Standard+)
```
/relax
```

### /turbo
**การใช้งาน:** สลับไปใช้ Turbo Mode (เร็ว 4x ใช้ GPU Time 2x)
```
/turbo
```

### /stealth
**การใช้งาน:** เปิด Stealth Mode (ต้องการแผน Pro+)
```
/stealth
```

### /public
**การใช้งาน:** ปิด Stealth Mode กลับไป Public
```
/public
```

---

## คำสั่งตั้งค่าทั่วไป

### /settings
**การใช้งาน:** เปิดแผงตั้งค่า เลือก Model, Mode, และค่าต่างๆ
```
/settings
```

### /prefer option
**การใช้งาน:** บันทึก Parameter ที่ใช้บ่อย
```
/prefer option set [ชื่อ] [ค่า]
```
**ตัวอย่าง:**
```
/prefer option set mydefault --ar 16:9 --v 6
```
แล้วใช้:
```
/imagine prompt: a landscape --mydefault
```

### /prefer suffix
**การใช้งาน:** ตั้ง Parameter ที่จะเพิ่มท้าย Prompt ทุกครั้ง
```
/prefer suffix --ar 16:9 --v 6
```

### /prefer remix
**การใช้งาน:** เปิด/ปิด Remix Mode
```
/prefer remix
```

---

## คำสั่งอื่นๆ

### /help
**การใช้งาน:** แสดงรายการช่วยเหลือ
```
/help
```

### /docs
**การใช้งาน:** ลิงก์ไปยัง Documentation
```
/docs
```

### /invite
**การใช้งาน:** ลิงก์สำหรับเพิ่ม Midjourney Bot เข้า Server ของตัวเอง
```
/invite
```

---

## Emoji Reactions

ใน Discord มี Emoji Reaction ที่มีฟังก์ชันพิเศษ:

| Emoji | ฟังก์ชัน |
|-------|---------|
| ✉️ | ส่ง Job ID และ Seed ทาง DM |
| ❌ | ยกเลิกงานที่กำลัง Generate |
| 🌟 | ทำเครื่องหมาย Favorite |

---

## Prefer Options ยอดนิยม

```
/prefer option set landscape --ar 16:9 --v 6 --stylize 500
/prefer option set portrait --ar 2:3 --v 6
/prefer option set anime --niji 6 --ar 1:1
/prefer option set fast_test --quality 0.25
```

---

## สรุป

คำสั่งที่ใช้บ่อยที่สุดคือ `/imagine`, `/info`, `/settings`, และ `/fast`/`/relax` ส่วนคำสั่งขั้นสูงอย่าง `/prefer` ช่วยให้ตั้งค่าเริ่มต้นที่ใช้บ่อยเพื่อประหยัดเวลา
