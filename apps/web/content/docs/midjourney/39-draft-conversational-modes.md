---
title: "Draft และ Conversational Modes"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "ทำความรู้จัก Draft Mode สำหรับสร้างภาพร่างรวดเร็ว และ Conversational Mode สำหรับโต้ตอบกับ AI เพื่อปรับแต่งภาพ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 39
---

# Draft และ Conversational Modes

> อ้างอิงหลัก: [Draft Conversational Modes](https://docs.midjourney.com/hc/en-us/articles/35577175650957-Draft-Conversational-Modes)

---

## Draft Mode (โหมดร่าง)

Draft Mode (โหมดร่าง — โหมดสร้างภาพเร็วที่ใช้ทรัพยากรน้อยกว่า เหมาะสำหรับทดสอบ Prompt ก่อนสร้างภาพจริง) ช่วยให้คุณทดสอบ Prompt ได้รวดเร็วโดยใช้ GPU Time น้อยกว่า

### ลักษณะของ Draft Mode
- สร้างภาพ **เร็วกว่า** โหมดปกติ
- ใช้ **GPU Time น้อยกว่า** (ประหยัดประมาณ 50%)
- ความละเอียด **ต่ำกว่า** เล็กน้อย
- เหมาะสำหรับ **Prototype** (การสร้างต้นแบบ — ภาพทดสอบก่อนสร้างจริง)

### วิธีใช้ Draft Mode
- บนเว็บไซต์: เลือก **"Draft"** ใน Settings ก่อนสร้าง
- หรือดูในตัวเลือกก่อน Generate

### เมื่อไรควรใช้ Draft Mode
- ทดสอบ Prompt ใหม่ที่ยังไม่แน่ใจ
- สร้างตัวเลือกจำนวนมากเพื่อเลือก
- งานที่ต้องการ Iterate บ่อยครั้ง
- เมื่อ GPU Fast Time เหลือน้อย

---

## Conversational Mode (โหมดสนทนา)

Conversational Mode (โหมดสนทนา — โหมดที่ช่วยให้คุณโต้ตอบกับ Midjourney เหมือนสนทนากับผู้ช่วย โดย AI จำบริบทการสนทนาก่อนหน้าและปรับแต่งภาพตามคำขอ) ช่วยให้ Workflow ที่ต้องปรับแต่งภาพซ้ำๆ ง่ายขึ้น

### วิธีการทำงาน
1. สร้างภาพแรกด้วย Prompt
2. บอก AI ว่าต้องการปรับอะไร เป็นภาษาพูดธรรมชาติ
3. AI จะจำบริบทและสร้างภาพใหม่ตามที่ขอ

**ตัวอย่าง:**
```
Prompt แรก: "a cozy living room"
คุณ: "make it more minimalist and add plants"
AI: สร้างห้องนั่งเล่นแบบ Minimalist ที่มีต้นไม้
คุณ: "add a cat on the sofa"
AI: สร้างห้องเดิมแต่เพิ่มแมวบนโซฟา
```

### ข้อดีของ Conversational Mode
- ไม่ต้องเขียน Prompt ใหม่ทั้งหมดทุกครั้ง
- AI เข้าใจบริบทการสนทนาก่อนหน้า
- เหมาะสำหรับการ Iterate อย่างรวดเร็ว
- ใช้ภาษาพูดธรรมชาติได้

### ข้อจำกัด
- ใช้ได้บนเว็บไซต์เท่านั้น (ไม่มีใน Discord)
- บริบทจะรีเซ็ตเมื่อเริ่ม Session ใหม่

---

## Draft + Conversational ใช้ด้วยกัน

กลยุทธ์ที่มีประสิทธิภาพ:
1. เปิด **Draft Mode** เพื่อทดสอบ Concept เร็วๆ
2. เมื่อพอใจกับทิศทาง ปิด Draft Mode
3. ใช้ **Conversational Mode** เพื่อ Fine-tune รายละเอียด
4. สร้างภาพ Final คุณภาพเต็มและ Upscale

---

## สรุป

Draft Mode ช่วยประหยัด GPU Time ระหว่างการทดสอบ ส่วน Conversational Mode ทำให้การปรับแต่งภาพง่ายขึ้นผ่านการสนทนาธรรมชาติ ทั้งสองโหมดใช้บนเว็บไซต์ Midjourney เท่านั้น
