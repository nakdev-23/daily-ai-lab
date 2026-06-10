---
title: "Imagen และ Veo — สร้างภาพและวิดีโอด้วย AI ระดับโปร"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "เจาะลึก Imagen 4 สำหรับสร้างภาพคุณภาพสูง และ Veo 3 สำหรับสร้างวิดีโอพร้อมเสียง รวมถึงพารามิเตอร์และเทคนิคการเขียน prompt"
readTime: "9 นาที"
readers: "0"
locked: false
order: 21
---

# Imagen และ Veo — สร้างภาพและวิดีโอด้วย AI ระดับโปร

Google มีโมเดล AI (ตัวสมองกล) สำหรับสร้างสื่อภาพและเสียงระดับโปรสองตัวหลัก ได้แก่ **Imagen** สำหรับสร้างภาพนิ่ง และ **Veo** สำหรับสร้างวิดีโอ ทั้งคู่สามารถใช้งานได้ผ่าน Gemini และ Gemini API (ช่องทางเชื่อมต่อโปรแกรม)

---

## Imagen — การสร้างภาพคุณภาพสูง

### Imagen คืออะไร?
Imagen คือโมเดล (ตัวสมองกล) สร้างภาพ AI ของ Google ที่สร้างภาพ "realistic and high quality" จากคำอธิบายข้อความ ภาพทุกภาพที่สร้างจะมี **SynthID watermark** (ลายน้ำดิจิทัลที่มองไม่เห็นด้วยตาเปล่า — ฝังไว้เพื่อระบุว่าภาพนั้นสร้างโดย AI) ที่มองไม่เห็นด้วยตาเปล่าเพื่อระบุว่าเป็นภาพที่สร้างโดย AI

### โมเดล Imagen ที่มีอยู่

| โมเดล | ความเหมาะสม |
|---|---|
| **Imagen 4 Ultra** | คุณภาพสูงสุด, รายละเอียดสมจริง |
| **Imagen 4 Standard** | สมดุลระหว่างคุณภาพและความเร็ว |
| **Imagen 4 Fast** | เร็วที่สุด, เหมาะกับ prototype (ต้นแบบเบื้องต้น) |

### ความสามารถของ Imagen 4

**ขนาดและสัดส่วน:**
- สัดส่วน: 1:1, 3:4, 4:3, 9:16, 16:9
- ความละเอียด: 1K หรือ 2K (สำหรับ Ultra และ Standard)
- สร้างได้ 1-4 ภาพต่อครั้ง

**ความสามารถพิเศษ:**
- สร้างข้อความภายในภาพได้ (แนะนำไม่เกิน 25 ตัวอักษร)
- ควบคุมการมีคนในภาพ (บล็อก, เฉพาะผู้ใหญ่, ทุกวัย)
- สร้างภาพสไตล์ต่างๆ: realistic (สมจริง), illustration (ภาพประกอบ), anime, painting (ภาพวาด) ฯลฯ

### วิธีเขียน Prompt สำหรับ Imagen

Prompt (คำสั่งหรือคำอธิบายที่บอก AI ว่าต้องการอะไร) ที่ดีควรมีโครงสร้างดังนี้:

**โครงสร้าง Prompt ที่ดี:**
```
[subject] [action/pose] [environment] [lighting] [style] [quality]
```

**ตัวอย่าง:**
- แย่: "แมวน่ารัก"
- ดี: "A fluffy orange tabby cat sitting on a window sill at golden hour, soft warm lighting, photorealistic, 4K"

**เทคนิคสำคัญ:**
- ระบุสไตล์ให้ชัดเจน: "oil painting" (ภาพสีน้ำมัน), "watercolor" (สีน้ำ), "digital art" (ศิลปะดิจิทัล), "photorealistic" (สมจริงแบบภาพถ่าย)
- ระบุแสง: "golden hour" (แสงอาทิตย์ตก), "studio lighting" (แสงสตูดิโอ), "dramatic shadows" (เงาดราม่า), "soft diffused light" (แสงนุ่มกระจาย)
- ระบุมุมกล้อง: "wide angle" (มุมกว้าง), "close-up portrait" (ภาพใกล้ใบหน้า), "bird's eye view" (มุมมองจากด้านบน), "macro" (มาโคร — ถ่ายระยะใกล้มาก)
- ระบุอารมณ์: "serene" (สงบ), "dramatic" (ดราม่า), "playful" (สนุกสนาน), "mysterious" (ลึกลับ)

> **หมายเหตุ:** Imagen รองรับ prompt ภาษาอังกฤษเท่านั้น ความยาวสูงสุด 480 tokens (ชิ้นส่วนข้อความ)

---

## Veo — การสร้างวิดีโอ AI

### Veo คืออะไร?
Veo คือโมเดลสร้างวิดีโอ AI ของ Google รุ่นล่าสุด **Veo 3** สามารถสร้าง "high-fidelity, 8-second videos featuring stunning realism and natively generated audio" — รวมถึงบทสนทนา, เอฟเฟกต์เสียง และเสียงพื้นหลัง

### โมเดล Veo ที่มีอยู่

| โมเดล | คุณสมบัติ |
|---|---|
| **Veo 3.1** | ล่าสุด, คุณภาพสูงสุด (Preview — ยังอยู่ระหว่างทดสอบ) |
| **Veo 3.1 Fast** | เวอร์ชันเร็ว (Preview) |
| **Veo 3.1 Lite** | เวอร์ชันเบา (Preview) |
| **Veo 3** | เสถียร, มีเสียง AI |
| **Veo 3 Fast** | เร็ว, เสถียร |
| **Veo 2** | รุ่นก่อนหน้า, เสถียรดี |

### ความสามารถของ Veo 3

**การสร้างวิดีโอ:**
- ความยาว: 8 วินาทีต่อ clip (คลิป — ชิ้นวิดีโอ, ขยายได้อีก 7 วินาที)
- ความละเอียด: 720p, 1080p, 4K
- สัดส่วน: 16:9 (landscape — แนวนอน) และ 9:16 (portrait — แนวตั้ง)
- **มีเสียง AI:** บทสนทนา, เอฟเฟกต์เสียง, ambient sound (เสียงบรรยากาศพื้นหลัง)

**โหมดการสร้าง:**

1. **Text-to-video** — สร้างวิดีโอจากคำอธิบายข้อความ
2. **Image-to-video** — แอนิเมทรูปภาพให้เคลื่อนไหว
3. **Reference images** — ใช้ภาพอ้างอิงสูงสุด 3 ภาพเพื่อกำหนด style (สไตล์) หรือตัวละคร
4. **Frame interpolation** (การแก้ไขเฟรมต้นและจบ) — กำหนดทั้ง first frame และ last frame
5. **Video extension** — ต่อความยาววิดีโอที่สร้างไว้แล้ว

### วิธีเขียน Prompt สำหรับ Veo

**โครงสร้าง Prompt วิดีโอ:**
```
[camera movement] [subject] [action] [environment] [style/mood]
```

**ตัวอย่าง:**
- "Slow zoom in on a woman walking through a neon-lit Tokyo street at night, cinematic, shallow depth of field"
- "Drone shot flying over a misty mountain range at sunrise, 4K, smooth motion"
- "A chef flipping pancakes in a cozy kitchen, morning light streaming through windows, documentary style"

**เทคนิคสำหรับวิดีโอ:**
- ระบุ camera movement (การเคลื่อนกล้อง): "pan left" (หมุนซ้าย), "zoom in" (ซูมเข้า), "tracking shot" (ถ่ายตามวัตถุ), "static shot" (กล้องนิ่ง), "drone aerial" (มุมอากาศจากโดรน)
- ระบุความเร็ว: "slow motion" (สโลว์โมชัน), "time-lapse" (ไทม์แลปส์ — บีบเวลาให้เร็ว), "real-time" (ความเร็วปกติ)
- ระบุ mood (บรรยากาศ): "cinematic" (แบบหนัง), "documentary" (แบบสารคดี), "commercial" (แบบโฆษณา), "artistic" (แบบศิลปะ)

---

## ใช้งานผ่าน Gemini (ไม่ใช้ API)

### สร้างภาพด้วย Imagen
1. เปิด [gemini.google.com](https://gemini.google.com)
2. พิมพ์ "สร้างภาพ..." หรือ "Generate an image of..."
3. Gemini จะใช้ Imagen สร้างภาพให้
4. ขอ variation (รูปแบบอื่น) หรือแก้ไขได้ในการสนทนาเดียวกัน

### สร้างวิดีโอด้วย Veo
1. เปิด Gemini
2. พิมพ์ "สร้างวิดีโอ..." หรือ "Create a video of..."
3. เลือกตัวเลือกถ้ามี (ความยาว, style)
4. รอวิดีโอ render (ประมวลผลสร้างวิดีโอ — อาจใช้เวลาสักครู่)

> **หมายเหตุ:** ฟีเจอร์วิดีโออาจต้องการ Gemini Advanced ขึ้นอยู่กับภูมิภาค

---

## ข้อจำกัดและนโยบาย

### สิ่งที่ทำไม่ได้:
- สร้างภาพ/วิดีโอของบุคคลจริงที่ระบุตัวตนได้
- เนื้อหาที่เป็นอันตราย, ผิดกฎหมาย หรือ explicit (โจ่งแจ้ง)
- สร้างภาพที่ทำให้เข้าใจผิดว่าเป็นข่าว

### SynthID Watermark (ลายน้ำดิจิทัลระบุ AI):
- ภาพและวิดีโอทุกชิ้นจาก Imagen/Veo มี digital watermark (ลายน้ำดิจิทัล)
- มองไม่เห็นด้วยตาเปล่า แต่ตรวจจับได้ด้วยซอฟต์แวร์
- เพื่อความโปร่งใสว่าสร้างโดย AI

---

## เปรียบเทียบ: ควรใช้ Imagen หรือ Veo?

| ต้องการ | ใช้ |
|---|---|
| ภาพนิ่งคุณภาพสูง | Imagen 4 |
| ภาพสำหรับ social media | Imagen 4 Fast |
| วิดีโอสั้นพร้อมเสียง | Veo 3 |
| แอนิเมทรูปภาพ | Veo (image-to-video) |
| วิดีโอ cinematic (แบบภาพยนตร์) | Veo 3.1 |
