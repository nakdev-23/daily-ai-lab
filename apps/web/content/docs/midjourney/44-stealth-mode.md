---
title: "Stealth Mode — ความเป็นส่วนตัว"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Stealth Mode เพื่อป้องกันไม่ให้ภาพที่สร้างปรากฏในแกลเลอรี่สาธารณะ เหมาะสำหรับงาน Commercial และความเป็นส่วนตัว"
readTime: "4 นาที"
readers: "0"
locked: false
order: 44
---

# Stealth Mode — ความเป็นส่วนตัว

> อ้างอิงหลัก: [Stealth Mode](https://docs.midjourney.com/hc/en-us/articles/32019750070669-Stealth-Mode)

---

## Stealth Mode คืออะไร

Stealth Mode (โหมดซ่อนตัว — โหมดที่ทำให้ภาพที่คุณสร้างไม่ปรากฏในแกลเลอรี่สาธารณะหรือ Explore ของ Midjourney) เหมาะสำหรับงานที่ต้องการความเป็นส่วนตัว

---

## ทำไมต้องใช้ Stealth Mode

โดยปกติ ทุกภาพที่สร้างบน Midjourney (แม้แต่ใน Discord DM) จะปรากฏใน Explore สาธารณะ Stealth Mode ป้องกันไม่ให้เกิดเรื่องนี้

### กรณีที่ควรใช้
- งาน Client ที่ต้องการความลับ
- โปรเจกต์ที่ยังไม่ประกาศ
- งาน Personal ที่ไม่ต้องการเปิดเผย
- งาน Commercial ที่มีข้อตกลงความลับ

---

## เงื่อนไขการใช้ Stealth Mode

Stealth Mode ใช้ได้เฉพาะ **แผน Pro และ Mega** เท่านั้น (ไม่รวม Basic และ Standard)

---

## วิธีเปิด Stealth Mode

### บน Discord
```
/stealth
```
หรือผ่าน `/settings` แล้วเลือก "Stealth Mode"

### บนเว็บ
- ไปที่ Settings
- Toggle "Stealth Mode" เป็น On

---

## ข้อจำกัดของ Stealth Mode

- งานที่สร้างก่อนเปิด Stealth Mode ยังคงเป็น Public
- คุณยังเห็นงานของตัวเองทั้งหมดใน Archive
- Midjourney เก็บข้อมูลงานทั้งหมด แม้อยู่ใน Stealth Mode
- Stealth Mode ไม่ใช่การ Delete — ทีม Midjourney ยังเห็นงานได้

---

## เปิดปิด Stealth Mode เมื่อไรก็ได้

- เปิด Stealth Mode ก่อนเริ่มงาน Confidential
- ปิด Stealth Mode เมื่อกลับมาทำงานปกติ
- การสลับจะมีผลทันทีกับงานที่สร้างหลังจากนั้น

---

## Visibility Settings (การตั้งค่าความมองเห็น)

แม้ไม่มีแผน Pro ยังสามารถตั้งค่า Visibility ของงานแต่ละชิ้นได้:
- คลิกขวาที่ภาพ → "Make Private" (ซ่อนจาก Public)
- หรือ "Make Public" (เปิดให้เห็น)

---

## ตรวจสอบสถานะ Stealth

ดูว่าเปิด Stealth Mode อยู่หรือไม่:
- พิมพ์ `/info` ใน Discord — จะแสดง "Stealth Mode: On/Off"
- บนเว็บ: ดูที่ Settings หรือ Indicator ในหน้า Create

---

## Stealth Mode กับ Watermark

ภาพที่สร้างด้วย Midjourney ไม่มี Watermark (ลายน้ำ — เครื่องหมายหรือข้อความที่แสดงความเป็นเจ้าของ) อยู่แล้ว ไม่ว่าจะอยู่ใน Stealth Mode หรือไม่

---

## ทางเลือกสำหรับแผน Standard

หากไม่มีแผน Pro แต่ต้องการความเป็นส่วนตัว:

1. **Make Private แต่ละชิ้น** — คลิกขวา → "Make Private"
2. **เพิ่ม Bot ใน Server ส่วนตัว** — งานยังเป็น Public แต่อยู่ใน Server ที่ควบคุมได้
3. **ใช้ DM กับ Bot** — งานยังเป็น Public แต่ไม่มีคนในห้องอื่นเห็น

---

## เมื่อ Stealth Mode ไม่เพียงพอ

สำหรับงานที่ต้องการความลับสูงสุด เช่น งาน Corporate ที่มี NDA (Non-Disclosure Agreement — สัญญาการรักษาความลับ):
- ใช้ Stealth Mode + Private Mode
- พิจารณาใช้ API ของ Midjourney แทน (ถ้ามี)
- หรือใช้เครื่องมือ AI อื่นที่ให้ความเป็นส่วนตัวสูงกว่า

---

## สรุป

Stealth Mode ใช้ได้กับแผน Pro/Mega เพื่อป้องกันงานทั้งหมดไม่ให้ปรากฏสาธารณะ ถ้าไม่มีแผน Pro ยังสามารถซ่อนงานแต่ละชิ้นได้ด้วย Make Private ควรเปิด Stealth Mode ก่อนเริ่มงาน Confidential เสมอ
