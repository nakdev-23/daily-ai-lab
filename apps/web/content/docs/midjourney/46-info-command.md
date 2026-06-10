---
title: "Info Command — ดูข้อมูลบัญชี"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้คำสั่ง /info เพื่อดูข้อมูลบัญชี GPU Time ที่เหลือ แผนปัจจุบัน และสถิติการใช้งาน"
readTime: "3 นาที"
readers: "0"
locked: false
order: 46
---

# Info Command — ดูข้อมูลบัญชี

> อ้างอิงหลัก: [Info Command](https://docs.midjourney.com/hc/en-us/articles/32084927086861-Info-Command)

---

## /info คืออะไร

คำสั่ง `/info` แสดงข้อมูลสำคัญเกี่ยวกับบัญชีและการใช้งานของคุณ

---

## วิธีใช้

### บน Discord
พิมพ์ `/info` ในห้องแชทใดก็ได้ที่มี Midjourney Bot

### บนเว็บ
ดูข้อมูลเดียวกันได้ที่ Settings → Account หรือ Profile

---

## ข้อมูลที่แสดง

### Subscription (แผนสมาชิก)
- แผนปัจจุบัน: Basic, Standard, Pro, หรือ Mega
- วันต่ออายุครั้งถัดไป

### Fast Time Remaining (GPU Fast Time ที่เหลือ)
- จำนวนชั่วโมง GPU Fast Time ที่ยังเหลือในเดือนนี้
- สำคัญมากในการวางแผนการใช้งาน

### Lifetime Usage (การใช้งานตลอดอายุ)
- จำนวนภาพทั้งหมดที่เคยสร้าง
- GPU Time ที่ใช้ไปทั้งหมด

### Mode
- โหมดปัจจุบัน: Fast, Relax, หรือ Turbo
- Visibility: Public หรือ Stealth

### Personalization Code
- Code ส่วนตัวสำหรับ Personalization และ Style

---

## ตัวอย่างข้อมูลที่เห็น

```
Subscription: Pro Plan
Renewal: June 15, 2025
Fast Time Remaining: 18.5 hours
Relaxed Usage: 45 hours this month
Lifetime Usage: 2,847 jobs
Mode: Fast Mode
Visibility: Public
Personalization Code: abc123xyz
```

---

## ใช้บ่อยเพื่อติดตาม GPU Time

ตรวจสอบ `/info` บ่อยๆ เพื่อ:
- รู้ว่าเหลือ GPU Fast Time เท่าไร
- วางแผนว่าจะใช้ Fast หรือ Relax Mode
- ตัดสินใจว่าควรซื้อ Fast Time เพิ่มหรือไม่

---

## ตีความข้อมูลใน /info

### Fast Time ที่เหลือ vs ที่ใช้ไป
ถ้า Fast Time เหลือน้อย คุณมีตัวเลือก:
1. **สลับไป Relax Mode** — ใช้ได้ไม่จำกัด (แผน Standard+)
2. **ซื้อ Fast Time เพิ่ม** — $4 ต่อชั่วโมง ไม่หมดอายุ
3. **รอรอบเดือนใหม่** — Fast Time จะรีเซ็ต

### Relaxed Usage
ใน Standard Plan ขึ้นไป จะเห็น "Relaxed Usage" — จำนวนชั่วโมงที่ใช้ในโหมด Relax

ถ้า Relaxed Usage สูงมาก ความเร็ว Relax อาจช้าลงในช่วงนั้น (Throttled — จำกัดความเร็ว)

---

## การวางแผนตาม /info

### ช่วงต้นเดือน (Fast Time เต็ม)
- ใช้ Fast Mode สำหรับงานสำคัญ
- ใช้ Turbo Mode สำหรับงานเร่งด่วน

### ช่วงกลางเดือน (Fast Time เหลือครึ่ง)
- เริ่มใช้ Relax Mode สำหรับงานทดสอบ
- เก็บ Fast Mode ไว้สำหรับงาน Final

### ช่วงปลายเดือน (Fast Time เหลือน้อย)
- ใช้ Relax Mode เป็นหลัก
- ใช้ `--quality 0.25` หรือ Draft Mode เพื่อประหยัด

---

## Personalization Code

Code ที่แสดงใน `/info` ใช้กับ `--p`:
```
a landscape --p [code จาก /info]
```

แชร์ Code ให้คนอื่นได้ใช้ Style ของคุณ

---

## สรุป

`/info` เป็นคำสั่งสำคัญที่ควรใช้บ่อยเพื่อติดตามการใช้งานและบริหาร GPU Time อย่างมีประสิทธิภาพ ตรวจสอบก่อนเริ่มงานสำคัญเพื่อรู้ว่าเหลือ Fast Time เท่าไร และวางแผนได้ถูกต้อง
