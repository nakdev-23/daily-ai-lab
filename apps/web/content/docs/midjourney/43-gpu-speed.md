---
title: "GPU Speed — Fast, Relax, Turbo"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "ทำความเข้าใจโหมดความเร็วทั้งสาม: Fast, Relax, และ Turbo เพื่อบริหารจัดการ GPU Time อย่างมีประสิทธิภาพ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 43
---

# GPU Speed — Fast, Relax, Turbo

> อ้างอิงหลัก: [GPU Speed Fast Relax Turbo](https://docs.midjourney.com/hc/en-us/articles/32016412137741-GPU-Speed-Fast-Relax-Turbo)

---

## ภาพรวม

Midjourney มีโหมดความเร็วในการสร้างภาพ 3 โหมด แต่ละโหมดมีความเร็วและการใช้ GPU Time ต่างกัน:

| โหมด | ความเร็ว | ใช้ GPU Time | ต้องการแผน |
|------|---------|-------------|-----------|
| **Fast** | เร็ว | ใช่ | ทุกแผน |
| **Relax** | ช้ากว่า | ไม่ใช้ | Standard+ |
| **Turbo** | เร็วที่สุด (4x) | ใช้ 2x | ทุกแผน |

---

## Fast Mode (โหมดเร็ว)

Fast Mode (โหมดเร็ว — โหมดมาตรฐานที่สร้างภาพโดยใช้ GPU Fast Time ของแผน) คือโหมดปกติที่ใช้ GPU Time จากโควตาประจำเดือน

### ลักษณะ
- สร้างภาพใน **1-2 นาที**
- ใช้ GPU Fast Time จากโควตา
- เหมาะสำหรับงานที่ต้องการคุณภาพและความเร็วสม่ำเสมอ

### วิธีเปิด
- ค่าเริ่มต้น หรือพิมพ์ `/fast` ใน Discord

---

## Relax Mode (โหมดผ่อนคลาย)

Relax Mode (โหมดผ่อนคลาย — โหมดที่ใช้ได้ไม่จำกัด ไม่นับ GPU Fast Time แต่ต้องรอในคิวนานกว่า) ให้สร้างภาพได้ไม่จำกัดโดยไม่ใช้ GPU Fast Time

### ลักษณะ
- สร้างภาพช้ากว่า — **รอ 0-10+ นาที** ขึ้นอยู่กับคิว
- ไม่ใช้ GPU Fast Time
- ไม่จำกัดจำนวนภาพ
- เหมาะสำหรับงานที่ไม่รีบ

### วิธีเปิด
- พิมพ์ `/relax` ใน Discord
- บนเว็บ: เลือก "Relax" ใน Settings

### ใช้ได้กับแผนไหน
- Standard, Pro, Mega (ไม่รวม Basic)

---

## Turbo Mode (โหมดเทอร์โบ)

Turbo Mode (โหมดเทอร์โบ — โหมดความเร็วสูงสุด เร็วกว่า Fast 4 เท่า แต่ใช้ GPU Time 2 เท่า) เหมาะสำหรับงานเร่งด่วน

### ลักษณะ
- สร้างภาพใน **ไม่ถึง 1 นาที** (เร็วกว่า Fast 4 เท่า)
- ใช้ GPU Fast Time **2 เท่า**
- เหมาะสำหรับงาน Real-time หรือเมื่อต้องการผลทันที

### วิธีเปิด
- พิมพ์ `/turbo` ใน Discord
- บนเว็บ: เลือก "Turbo" ใน Settings

---

## กลยุทธ์บริหาร GPU Time

### สำหรับผู้ใช้ Basic (3.3 ชม./เดือน)
- ทดสอบ Prompt ด้วย `--quality 0.25` ก่อน
- Upscale เฉพาะภาพที่ต้องการจริงๆ
- ไม่ใช้ Turbo Mode เว้นแต่จำเป็น

### สำหรับผู้ใช้ Standard (15 ชม./เดือน)
- ใช้ Fast Mode สำหรับงานสำคัญ
- ใช้ Relax Mode สำหรับงานทดสอบและงานไม่เร่งด่วน
- ใช้ Turbo Mode เฉพาะงาน Urgent

### สำหรับผู้ใช้ Pro/Mega (30-60 ชม./เดือน)
- ใช้ Fast Mode เป็นหลัก
- Relax Mode สำหรับ Batch Generation (สร้างภาพจำนวนมาก)

---

## ดู GPU Time ที่เหลือ

- พิมพ์ `/info` ใน Discord
- บนเว็บ: ดูที่ Settings → Account

---

## สรุป

ใช้ **Fast Mode** สำหรับงานปกติ, **Relax Mode** เมื่อ GPU Fast Time เหลือน้อยหรืองานไม่เร่งด่วน, และ **Turbo Mode** เมื่อต้องการผลเร็วมากๆ แต่ยอมแลก GPU Time 2 เท่า
