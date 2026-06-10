---
title: "เริ่มต้นใช้งาน Midjourney บน Discord"
tool: "Midjourney"
icon: "tool-midjourney"
level: "intermediate"
summary: "คู่มือเริ่มต้นใช้งาน Midjourney ผ่าน Discord ตั้งแต่การเพิ่ม Bot ไปจนถึงการพิมพ์คำสั่งสร้างภาพแรก"
readTime: "6 นาที"
readers: "0"
locked: false
order: 5
---

# เริ่มต้นใช้งาน Midjourney บน Discord

> อ้างอิงหลัก: [Discord Quick Start](https://docs.midjourney.com/hc/en-us/articles/32631709682573-Discord-Quick-Start)

---

## Discord คืออะไร

Discord เป็นแอปพลิเคชัน (Application — โปรแกรม) สำหรับสนทนาออนไลน์ที่นิยมในกลุ่มนักเล่นเกมและชุมชน Tech ปัจจุบัน Midjourney ยังรองรับการใช้งานผ่าน Discord ซึ่งมีชุมชนขนาดใหญ่มาก

---

## ขั้นตอนเริ่มต้น

### ขั้นที่ 1 — ติดตั้ง Discord
1. ดาวน์โหลด Discord ได้ที่ [discord.com](https://discord.com)
2. สมัครสมาชิก Discord ฟรี (ไม่ต้องจ่ายเงิน)
3. ล็อกอินเข้าสู่ระบบ

### ขั้นที่ 2 — เข้าร่วม Midjourney Server
1. ไปที่ [midjourney.com](https://midjourney.com)
2. คลิก **"Join the Beta"** หรือลิงก์ Discord
3. กด **"Accept Invite"** เพื่อเข้าร่วม Server (เซิร์ฟเวอร์ Discord ของ Midjourney)

หรือ ค้นหา Midjourney ใน Discord Discover แล้วเข้าร่วม Server โดยตรง

### ขั้นที่ 3 — เข้าห้อง newbies
หลังเข้าร่วม Server แล้ว:
1. มองหาหมวด **"NEWCOMER ROOMS"** ในแถบซ้าย
2. เลือกห้อง **#newbies-1** หรือ **#newbies-2** (มีหลายห้อง)
3. ห้องเหล่านี้ออกแบบมาสำหรับผู้เริ่มต้นโดยเฉพาะ

---

## คำสั่งพื้นฐาน

### /imagine — สร้างภาพ
คำสั่งหลักที่ใช้สร้างภาพ:

```
/imagine prompt: a beautiful sunset over mountains, oil painting style
```

**วิธีใช้:**
1. พิมพ์ `/imagine` ในช่องแชต
2. Discord จะแสดง Autocomplete (ตัวช่วยเติมคำ) ให้เลือก
3. พิมพ์ Prompt หลัง `prompt:`
4. กด Enter

### /info — ดูข้อมูลบัญชี
```
/info
```
แสดงข้อมูล: แผนที่ใช้, GPU Time ที่เหลือ, จำนวนภาพที่สร้าง

### /help — ดูความช่วยเหลือ
```
/help
```
แสดงรายการคำสั่งและลิงก์ไปยังเอกสาร

---

## ทำความเข้าใจผลลัพธ์ใน Discord

เมื่อสร้างเสร็จ Midjourney Bot (บอท — โปรแกรมอัตโนมัติที่ทำงานใน Discord) จะส่งข้อความตอบกลับพร้อมภาพ 4 ช่อง

### ปุ่มใต้ภาพ

**แถวบน — Upscale:**
- **U1 U2 U3 U4** — Upscale (ขยายคุณภาพ) ภาพที่ 1, 2, 3, 4

**แถวล่าง — Variations:**
- **V1 V2 V3 V4** — สร้างภาพชุดใหม่แบบคล้ายๆ กับภาพที่ 1, 2, 3, 4

**ปุ่ม 🔄 (รีเฟรช):**
- สร้างชุดภาพใหม่ทั้งหมดจาก Prompt เดิม

---

## ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1 — ภาพธรรมชาติ
```
/imagine prompt: misty forest in the morning, golden light rays, cinematic
```

### ตัวอย่างที่ 2 — ภาพคน
```
/imagine prompt: portrait of a young woman, renaissance painting style, detailed
```

### ตัวอย่างที่ 3 — สถาปัตยกรรม
```
/imagine prompt: futuristic city skyline at night, neon lights, cyberpunk
```

---

## การใช้งานใน Direct Messages

หากไม่ต้องการให้งานของคุณถูกเห็นในห้องสาธารณะ:
1. ค้นหา **Midjourney Bot** ในแถบ Users ของ Server
2. คลิกที่ Bot แล้วเลือก **"Message"**
3. ส่งคำสั่ง `/imagine` ในห้อง DM (Direct Message — ข้อความส่วนตัว) ได้เลย

> **หมายเหตุ:** การใช้ DM ยังคงนับ GPU Time เช่นเดิม แต่งานจะไม่ปรากฏในห้องสาธารณะ

---

## เพิ่ม Midjourney Bot เข้า Server ของคุณ

หากต้องการใช้ Midjourney ใน Server ส่วนตัว:
1. ไปที่ [docs.midjourney.com](https://docs.midjourney.com) แล้วดูวิธีเพิ่ม Bot
2. หรือไปที่ Midjourney Server → คลิกที่ Midjourney Bot → เลือก "Add to Server"
3. เลือก Server ของคุณ → ยืนยันสิทธิ์ (Permissions — การอนุญาต)

---

## ข้อแตกต่างระหว่าง Discord กับเว็บ

| ฟีเจอร์ | Discord | เว็บไซต์ |
|--------|---------|---------|
| Imagine Command | ✅ `/imagine` | ✅ ช่อง Prompt |
| Editor | ❌ | ✅ |
| Zoom Out / Pan | ✅ | ✅ |
| Vary Region | ✅ | ✅ |
| Blend Command | ✅ `/blend` | ✅ |
| ดูงานชุมชน | ✅ ทุกห้อง | ✅ Explore |
| Draft Mode | ❌ | ✅ |
| Conversational Mode | ❌ | ✅ |

---

## เคล็ดลับ

1. **ใช้ห้อง newbies** — ไม่ต้องอาย ทุกคนเริ่มจากที่นี่
2. **ดู Prompt ของคนอื่น** — คลิกที่รูปใน Server เพื่อดู Prompt ที่ใช้
3. **ใช้ DM** — ถ้าต้องการความเป็นส่วนตัวมากขึ้น
4. **เพิ่ม Bot ใน Server ส่วนตัว** — สะดวกกว่าการใช้ Server กลาง

---

## สรุป

Midjourney บน Discord ใช้คำสั่ง `/imagine` เป็นหลัก เพิ่ม Bot เข้า Server → พิมพ์ `/imagine prompt: [คำอธิบาย]` → รอผล → กด U เพื่อ Upscale หรือ V เพื่อสร้างแบบใหม่ ง่ายและมีชุมชนช่วยเหลืออีกมากมาย
