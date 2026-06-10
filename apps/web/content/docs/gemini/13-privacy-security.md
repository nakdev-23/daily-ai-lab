---
title: "Privacy & Security — ความเป็นส่วนตัวและความปลอดภัย"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "อ้างอิง: Gemini Apps Privacy Hub | Manage & Delete Activity | SynthID"
readTime: "3 นาที"
readers: "0"
locked: false
order: 13
---
# 13 — Privacy & Security — ความเป็นส่วนตัวและความปลอดภัย

อ้างอิง: [Gemini Apps Privacy Hub](https://support.google.com/gemini/answer/13594961) | [Manage & Delete Activity](https://support.google.com/gemini/answer/13278892) | [SynthID](https://support.google.com/gemini/answer/16722517)

---

## Gemini Apps Privacy Hub

**Privacy Hub** คือศูนย์รวมข้อมูลเกี่ยวกับวิธีที่ Gemini เก็บและใช้ข้อมูลของคุณ

อ้างอิง: [Privacy Hub](https://support.google.com/gemini/answer/13594961)

---

## ข้อมูลที่ Gemini เก็บ

### Gemini Apps Activity

Gemini จะบันทึก **Gemini Apps Activity** ซึ่งรวมถึง:
- แชทและ prompt ที่คุณส่ง
- คำตอบที่ Gemini ให้
- ไฟล์ที่คุณอัปโหลด

**Keep Activity** คือการเปิดให้ Gemini บันทึก Activity ไว้:
- ถ้าเปิด → แชทจะถูกบันทึกและเข้าถึงได้ในภายหลัง Gemini อาจใช้ข้อมูลนี้เพื่อปรับปรุงบริการ
- ถ้าปิด → แชทจะไม่ถูกบันทึก ประวัติแชทจะหายไป ฟีเจอร์หลายอย่างจะใช้ไม่ได้

### ข้อมูลจาก Gemini Live

การสนทนาด้วยเสียงใน Gemini Live จะถูกประมวลผล แต่เสียงจะไม่ถูกเก็บบนเซิร์ฟเวอร์ Google อย่างถาวร — เก็บเฉพาะ transcript ข้อความ

---

## วิธีจัดการ Gemini Apps Activity

### ดูกิจกรรม
1. ไปที่ [myactivity.google.com/product/gemini](https://myactivity.google.com/product/gemini)
2. หรือไปที่ gemini.google.com → Settings & help → Activity

### ลบกิจกรรม
1. ไปที่ Activity
2. เลือกแชทหรือช่วงเวลาที่ต้องการลบ
3. คลิก **Delete**

**ตัวเลือกการลบ:**
- ลบทีละแชท
- ลบตามช่วงเวลา (เช่น 7 วันที่ผ่านมา, 30 วัน, ทั้งหมด)
- ตั้งให้ลบอัตโนมัติทุก 3, 18, หรือ 36 เดือน

---

## Gemini กับข้อมูลใน Google Workspace

เมื่อเชื่อมต่อ Google Workspace (Gmail, Drive ฯลฯ) Gemini จะเข้าถึงข้อมูลนั้นเพื่อตอบคำถามของคุณ แต่:
- Google จะไม่นำข้อมูลใน Gmail หรือ Drive ไปฝึกโมเดล AI โดยไม่ได้รับอนุญาต
- ดูนโยบายละเอียดได้ที่ [Privacy Hub](https://support.google.com/gemini/answer/13594961#data_exchange)

---

## ดาวน์โหลดข้อมูล Gemini ของคุณ

คุณสามารถดาวน์โหลดข้อมูลทั้งหมดที่ Gemini เก็บเกี่ยวกับคุณ:

1. ไปที่ [Google Takeout](https://takeout.google.com)
2. เลือก **Gemini Apps**
3. ดาวน์โหลดเป็นไฟล์ ZIP

อ้างอิง: [Download Your Gemini Data](https://support.google.com/gemini/answer/16920332)

---

## Canvas Safety

เนื้อหาที่สร้างใน Canvas และแอปที่แชร์สาธารณะมีนโยบายด้านความปลอดภัยเพิ่มเติม เช่น:
- ป้องกัน prompt injection ในแอปที่สร้าง
- ตรวจสอบเนื้อหาก่อนแสดงผล

อ้างอิง: [Canvas Safety](https://support.google.com/gemini/answer/16419134)

---

## SynthID — ตรวจสอบสื่อที่สร้างโดย AI

**SynthID** คือ watermark ที่มองไม่เห็นด้วยตาเปล่า ฝังอยู่ในรูปภาพ, วิดีโอ, เสียง และข้อความที่สร้างโดย AI ของ Google

**ทำไมถึงสำคัญ:**
- ช่วยตรวจสอบว่าสื่อนั้นสร้างโดย AI จริงๆ หรือไม่
- ลดการแพร่กระจาย Deepfake และสื่อปลอม
- ใช้เครื่องมือตรวจสอบ SynthID ได้ที่: [SynthID Detector](https://support.google.com/gemini/answer/16722517)

---

## การป้องกัน Prompt Injection

Gemini มีระบบป้องกัน prompt injection — กรณีที่เว็บไซต์หรือเอกสารมีคำสั่งซ่อนอยู่เพื่อหลอก Gemini:

- Gemini จะพยายามตรวจจับและไม่ทำตามคำสั่งที่ซ่อนอยู่
- แต่ระบบไม่ได้สมบูรณ์ 100% — ดังนั้นควรดูแลอย่างใกล้ชิดเมื่อใช้ Gemini Agent กับเว็บไซต์ภายนอก

อ้างอิง: [Prompt Injection Protection](https://support.google.com/gemini/answer/16188217)

---

## Generative AI Prohibited Use Policy

Gemini มีนโยบายห้ามการใช้งานบางประเภท เช่น:
- สร้างเนื้อหาที่เป็นอันตราย, ผิดกฎหมาย
- ละเมิดลิขสิทธิ์หรือความเป็นส่วนตัวของบุคคล
- สร้างข้อมูลเท็จเพื่อหลอกลวง
- สร้างเนื้อหาทางเพศที่เกี่ยวข้องกับผู้เยาว์

หากพบการละเมิด: [Report a Violation](https://support.google.com/gemini/answer/16719589)

อ้างอิง: [Prohibited Use Policy](https://support.google.com/gemini/answer/16625148)

---

## การใช้งานของเด็กและผู้ปกครอง

| อายุ | ความสามารถ |
|---|---|
| ต่ำกว่า 13 ปี | ใช้ Gemini ไม่ได้ (ต้องมีบัญชี Family Link) |
| 13-17 ปี | ใช้ Gemini ได้ แต่บางฟีเจอร์ถูกจำกัด |
| 18 ปีขึ้นไป | ใช้ได้เต็มรูปแบบ |

**ผู้ปกครองสามารถ:**
- ปิดการเข้าถึง Gemini สำหรับเด็กในบัญชี Family Link
- ตรวจสอบและจัดการกิจกรรมของเด็ก

อ้างอิง: [Guide Your Child's Gemini Experience](https://support.google.com/gemini/answer/16109150)

---

## สรุป

Gemini ให้ความสำคัญกับ Privacy โดยให้คุณควบคุมข้อมูลของตัวเองได้เต็มที่ — ดู, แก้ไข, ลบ หรือดาวน์โหลดได้ตลอด นอกจากนี้ยังมีระบบ SynthID, ป้องกัน Prompt Injection และนโยบายที่ชัดเจนในการใช้งาน AI อย่างรับผิดชอบ

---

*ถัดไป: [14 — การตั้งค่า](14-การตั้งค่า.md)*
