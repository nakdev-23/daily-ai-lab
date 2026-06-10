---
title: "Gemini Agent, Deep Think และ Schedule Actions"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "อ้างอิง: Gemini Agent | Schedule Actions | Deep Think"
readTime: "3 นาที"
readers: "0"
locked: false
order: 10
---
# 10 — Gemini Agent, Deep Think และ Schedule Actions

อ้างอิง: [Gemini Agent](https://support.google.com/gemini/answer/16596215) | [Schedule Actions](https://support.google.com/gemini/answer/16316416) | [Deep Think](https://support.google.com/gemini/answer/16345172)

---

## Gemini Agent — ผู้ช่วยที่ทำงานแทนคุณได้

### Gemini Agent คืออะไร

**Gemini Agent** คือฟีเจอร์ทดลองที่ให้ Gemini ทำงานหลายขั้นตอนแทนคุณ โดยคุณแค่ระบุว่าต้องการทำอะไร Gemini จะวางแผนและดำเนินการให้ โดยคุณคอยดูแลและอนุมัติในขั้นตอนสำคัญ

**ตัวอย่างงานที่ Agent ทำได้:**
- จัดหมวดหมู่ email และเขียนตอบกลับให้
- สรุปสิ่งที่ต้องทำในวันนั้น
- ปรับตารางงาน/ประชุมใน Calendar
- ค้นคว้าข้อมูลผ่านเว็บแบบ live รวมถึงเว็บที่ต้อง login
- จองร้านอาหารหรือที่พัก

### สิ่งที่ต้องมี

- อายุ **18 ปีขึ้นไป** และอยู่ใน **สหรัฐอเมริกา** (ตอนนี้ยังจำกัดประเทศ)
- บัญชี **Google ส่วนตัว** (ไม่รองรับบัญชีงาน/โรงเรียน)
- แผน **Google AI Ultra**
- เปิด **Keep Activity**

### วิธีใช้ Gemini Agent

1. เปิดแอป Gemini หรือไปที่ gemini.google.com
2. ในช่องพิมพ์ คลิก **Tools** → **Agent**
3. อธิบายงานที่ต้องการ
4. คลิก Submit
5. **ตรวจสอบแผนงาน** ที่ Gemini วางไว้ แล้วคลิก **Decline** หรือ **Confirm** ในแต่ละขั้นตอน
6. Gemini ดำเนินการ — ปกติใช้เวลาสักครู่

### ตัวอย่าง Prompt สำหรับ Agent

```
"ทุกเช้า 7 โมง ดูอีเมลที่ยังไม่ได้อ่าน สรุปสิ่งสำคัญ สร้าง task สำหรับสิ่งที่ต้องติดตาม และ archive อีเมลที่ไม่สำคัญ"

"ทุกวันจันทร์-ศุกร์ เวลา 8 โมง ส่งเอกสารสรุปความพร้อมสำหรับวันนั้นมาให้ฉัน"

"สั่งกาแฟ Iced Vanilla Latte ที่ร้านใกล้บ้าน pre-fill ออเดอร์ไว้ให้ฉันกดยืนยันเอง"
```

### ควบคุม Browser ของ Gemini

เมื่อ Agent ใช้เว็บ คุณสามารถ "เข้าควบคุม" ได้ตลอด:
1. ในแชท ใต้ "Using browser" → คลิก **Open** → **Take control**
2. ทำขั้นตอนที่ต้องการเอง (เช่น กรอกรหัสผ่าน, ยืนยันการชำระเงิน)
3. คลิก **End control** → **Resume** เพื่อคืนการควบคุมให้ Gemini

### ขีดจำกัด Agent

| แผน | ขีดจำกัด |
|---|---|
| Ultra | 200 requests/วัน, 3 tasks พร้อมกัน |

---

## ข้อควรระวังการใช้ Gemini Agent

**เรื่องความปลอดภัย:**
- ❌ อย่าพิมพ์รหัสผ่านหรือข้อมูลบัตรเครดิตใน chat — ให้กรอกเองในหน้าเว็บผ่าน Take Control
- ❌ อย่าตั้งเวลาอัตโนมัติสำหรับงานที่สำคัญหรือ sensitive มาก
- ⚠️ **Prompt Injection:** เว็บไซต์ที่ Gemini เข้าอาจมีคำสั่งซ่อนอยู่เพื่อหลอก Gemini ให้ทำสิ่งที่ไม่ต้องการ — ดูแลอย่างใกล้ชิดสำหรับงานสำคัญ

**Gemini จะขอยืนยันก่อน:**
- ส่งอีเมล, ส่งข้อความ
- แก้ไขข้อมูล, ซื้อของ
- กรอก form ออนไลน์

---

## Schedule Actions — ตั้งเวลาทำงานอัตโนมัติ

**Schedule Actions** คือการตั้งให้ Gemini ทำงานซ้ำๆ ในเวลาที่กำหนด เช่น ส่งสรุปรายวัน ทุกเช้า

### วิธีตั้ง Scheduled Action

1. ใน Agent mode พิมพ์งานพร้อมระบุเวลา:
   ```
   "ทุกวัน 8 โมงเช้า ส่งสรุปงานที่ต้องทำวันนี้มาให้ฉัน"
   ```
2. Gemini จะสร้าง Scheduled Action โดยอัตโนมัติ

### ดูและจัดการ Scheduled Actions

ไปที่ Settings → Scheduled Actions เพื่อดู, แก้ไข, หรือลบ Action ที่ตั้งไว้

**ขีดจำกัด:**
- Plus, Pro, Ultra: สูงสุด 10 active actions พร้อมกัน

> **ข้อควรระวัง:** ถ้า Action รันขณะที่คุณ offline คุณอาจหยุดไม่ทัน ดังนั้นอย่าตั้ง Action สำหรับงานที่ sensitive หรือสำคัญมาก

อ้างอิง: [Schedule Actions](https://support.google.com/gemini/answer/16316416)

---

## Deep Think — โมดคิดลึกสำหรับปัญหาซับซ้อน

### Deep Think คืออะไร

**Deep Think** คือโหมดพิเศษที่ให้ Gemini "คิดนาน" กว่าปกติก่อนตอบ เหมาะสำหรับปัญหาที่ต้องการเหตุผลเชิงลึก เช่น:
- โจทย์คณิตศาสตร์ขั้นสูง
- ปัญหาตรรกะซับซ้อน
- การออกแบบสถาปัตยกรรมซอฟต์แวร์
- การวิเคราะห์เชิงกลยุทธ์

### สิ่งที่ต้องมี

- แผน **Google AI Ultra** เท่านั้น
- ขีดจำกัด: **10 prompts ต่อวัน** พร้อม Context Window **192K tokens**

### วิธีใช้ Deep Think

1. ใน Gemini เลือกโมเดล **Thinking** หรือเปิด **Deep Think** ในการตั้งค่า
2. พิมพ์ prompt ที่ต้องการให้คิดลึก

อ้างอิง: [Deep Think](https://support.google.com/gemini/answer/16345172)

---

## Screen Automation — ควบคุมแอปบน Android

**Screen Automation** คือฟีเจอร์ที่ให้ Gemini ทำงานหลายขั้นตอนในแอปบน Android แทนคุณ เช่น กรอก form, ส่งข้อความ, เปิดแอปและทำตามขั้นตอน

| แผน | ขีดจำกัด/วัน |
|---|---|
| ฟรี | 5 requests |
| Plus | 12 requests |
| Pro | 20 requests |
| Ultra | 120 requests |

อ้างอิง: [Screen Automation](https://support.google.com/gemini/answer/16940971)

---

## Dynamic View — มุมมองภาพ Gemini

**Dynamic View** เป็นโหมดแสดงผลที่ Gemini จัดเรียงคำตอบให้อ่านง่ายขึ้น เช่น แยกหัวข้อ, ใส่ icon, จัดรูปแบบสวยงาม

| แผน | จำนวน prompts |
|---|---|
| ฟรี, Plus | 25/วัน |
| Pro, Ultra | 250/วัน |

---

## สรุป

Gemini Agent, Schedule Actions และ Deep Think เป็นฟีเจอร์ระดับสูงที่ทำให้ Gemini ไม่ใช่แค่ chatbot แต่เป็นผู้ช่วยที่ "ทำงานจริง" ได้แทนคุณ อย่างไรก็ตาม ฟีเจอร์เหล่านี้ยังอยู่ในขั้น "experimental" และต้องการการดูแลจากผู้ใช้เสมอ

---

*ถัดไป: [11 — Connected Apps](11-connected-apps.md)*
