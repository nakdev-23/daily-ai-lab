---
title: "Image Generation — สร้างรูปภาพด้วย AI"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "เรียนรู้การสร้างรูปภาพด้วย AI ผ่าน Runway ไม่ว่าจะเป็น Gen4 Image, GPT Image 2, Gemini Image Pro รวมถึงการใช้ Reference Images เพื่อควบคุมสไตล์"
readTime: "7 นาที"
readers: "0"
locked: false
order: 11
---

# Image Generation — สร้างรูปภาพด้วย AI

> Runway ให้เข้าถึงโมเดลสร้างรูปภาพหลายตัวในที่เดียว ทั้ง Gen4 Image, GPT Image 2 และ Gemini Image Pro — เพื่อตอบโจทย์ทุกสไตล์

---

## โมเดลสร้างรูปภาพใน Runway

### 1. Gen4 Image (โมเดลสร้างภาพของ Runway เอง)
โมเดลที่ Runway พัฒนาเอง เหมาะสำหรับงาน Cinematic และ Artistic

**ราคา:**
- **Gen4 Image** (720p): 5 credits
- **Gen4 Image** (1080p): 8 credits
- **Gen4 Image Turbo** (ทุกความละเอียด): 2 credits

**จุดเด่น:**
- รองรับ Reference Images (รูปอ้างอิง) สำหรับกำหนดสไตล์
- ใช้ "@mention" ในพรอมต์เพื่อระบุ Reference ที่ต้องการ

### 2. GPT Image 2 (โมเดลจาก OpenAI)
**GPT Image 2** (จีพีที อิมเมจ 2 — โมเดลสร้างภาพของ OpenAI) เป็น Text-to-Image โมเดลที่รู้จักในชื่อ DALL-E รุ่นถัดไป

**ราคา:** 1-41 credits ขึ้นกับคุณภาพและความละเอียด

### 3. Gemini Image 3 Pro (โมเดลจาก Google)
**Gemini Image 3 Pro** (เจมินี อิมเมจ 3 โปร — โมเดลสร้างภาพของ Google) เป็นโมเดลที่เก่งในการสร้างภาพสมจริงและมีรายละเอียดสูง

**ราคา:** 20-40 credits ขึ้นกับความละเอียด

---

## วิธีสร้างรูปภาพด้วย Runway

### ขั้นตอนที่ 1: เลือกโมเดล

1. ไปที่เมนู **"Image"** หรือ **"Text to Image"**
2. เลือกโมเดลที่ต้องการจากรายการ

### ขั้นตอนที่ 2: เขียน Prompt

**Text-to-Image Prompt** (พรอมต์สร้างภาพจากข้อความ) ที่ดีควรมี:

```
[Subject] + [Description] + [Style] + [Lighting] + [Composition]
```

**ตัวอย่าง Prompt ที่ดี:**

สำหรับ Portrait (ภาพบุคคล):
```
A young Japanese woman with short black hair, wearing a red kimono, 
standing in a bamboo forest, soft morning light, 
photography style, shallow depth of field, 
highly detailed, 8K
```

สำหรับ Landscape (ภาพทิวทัศน์):
```
Ancient temple ruins in a tropical jungle, 
golden sunset light filtering through trees, 
atmospheric fog, painterly style, 
reminiscent of Studio Ghibli, highly detailed
```

สำหรับ Product (ภาพสินค้า):
```
Minimalist perfume bottle on white marble surface, 
soft studio lighting, commercial photography style, 
ultra detailed, photorealistic
```

### ขั้นตอนที่ 3: เลือก Aspect Ratio และ Resolution

**Aspect Ratio** (อัตราส่วนภาพ) ที่รองรับ:
- **1:1** (Square — สี่เหลี่ยมจัตุรัส) — Instagram, Profile pictures
- **4:3** — มาตรฐานกล้องดิจิทัล
- **16:9** (Landscape) — YouTube, Desktop wallpaper
- **9:16** (Portrait) — TikTok, Instagram Stories

### ขั้นตอนที่ 4: Generate และ Refine

1. คลิก **"Generate"**
2. ดูผลลัพธ์
3. ถ้าไม่พอใจ แก้ Prompt แล้ว Generate ใหม่
4. หรือใช้ **"Variations"** สร้างรูปที่คล้ายกันแต่แตกต่างเล็กน้อย

---

## การใช้ Reference Images

**Reference Images** (รูปอ้างอิง — รูปที่ใช้กำหนดสไตล์หรือลักษณะ) ช่วยให้ AI เข้าใจว่าต้องการสไตล์แบบไหน

### ใน Gen4 Image:

**วิธีที่ 1: Tagged Reference** (อ้างอิงที่ระบุ Tag)
- อัปโหลด Reference Image
- Tag รูปด้วย `@name` เช่น `@mycharacter`
- ใช้ Tag ใน Prompt: `"A character like @mycharacter in a forest"`

**วิธีที่ 2: Untagged Reference** (อ้างอิงทั่วไปสำหรับสไตล์)
- อัปโหลด Reference Image โดยไม่ Tag
- AI ใช้เป็นแรงบันดาลใจสไตล์ โดยไม่ copy ตรงๆ

---

## Style Keywords ที่มีประโยชน์

### สไตล์ศิลปะ
```
hyperrealistic photography (ภาพถ่ายสมจริงสุดๆ)
oil painting (ภาพวาดสีน้ำมัน)
watercolor (สีน้ำ)
digital art (ศิลปะดิจิทัล)
concept art (ภาพ Concept สำหรับเกม/ภาพยนตร์)
anime (การ์ตูนสไตล์ญี่ปุ่น)
Studio Ghibli (สไตล์สตูดิโอจิบลิ)
comic book (การ์ตูนแบบอเมริกัน)
minimalist illustration (ภาพประกอบสไตล์เรียบง่าย)
```

### แสง
```
golden hour (แสงพระอาทิตย์ตก)
blue hour (แสงพลบค่ำ)
studio lighting (แสงสตูดิโอ)
Rembrandt lighting (แสงสไตล์เรมบรันด์ — แสงด้านข้าง)
neon lights (ไฟนีออน)
backlit (แสงสวนหลัง)
volumetric lighting (แสงที่มีปริมาตร)
```

### Camera/Composition
```
close-up portrait (ภาพระยะใกล้บุคคล)
wide angle (มุมกว้าง)
aerial view (มุมนก)
macro photography (มาโคร — ถ่ายระยะใกล้มาก)
bokeh background (พื้นหลังเบลอสวย)
rule of thirds (หลักสามส่วน)
```

---

## เปรียบเทียบโมเดลสร้างภาพ

| โมเดล | จุดเด่น | เหมาะสำหรับ | ราคา |
|---|---|---|---|
| Gen4 Image | Cinematic, รองรับ Reference | ภาพยนตร์, Art | 5-8 credits |
| Gen4 Image Turbo | เร็ว, ราคาถูก | Draft, ทดลอง | 2 credits |
| GPT Image 2 | หลากหลาย, คุณภาพสูง | ทั่วไป | 1-41 credits |
| Gemini Image 3 Pro | รายละเอียดสูง, สมจริง | Photography style | 20-40 credits |

---

## เคล็ดลับการสร้างภาพ

### 1. ระบุสัดส่วนและขนาด
```
full body portrait (บุคคลเต็มตัว)
head and shoulders (ศีรษะและไหล่)
landscape shot (ภาพกว้าง)
extreme close-up (ระยะใกล้มาก)
```

### 2. ระบุจำนวนวัตถุ
AI มักสับสนเมื่อต้องสร้างหลายวัตถุ ระบุให้ชัด:
```
One person standing alone (คนเดียว ยืนอยู่คนเดียว)
Two people facing each other (สองคน หันหน้าเข้าหากัน)
```

### 3. หลีกเลี่ยงคำที่ขัดแย้งกัน
```
ไม่ดี: "dark but bright" (มืดแต่สว่าง)
ดีกว่า: "moody dark background with single bright spotlight"
```

---

## สรุป

Runway เป็น Platform ที่รวบรวมโมเดลสร้างรูปภาพชั้นนำหลายตัวไว้ในที่เดียว การรู้จักจุดเด่นของแต่ละโมเดลและการเขียน Prompt ที่ดีจะช่วยให้ได้รูปภาพตรงใจมากขึ้น สำหรับงานที่ต้องการรายละเอียดสูง แนะนำ Gemini Image 3 Pro และสำหรับงานที่ต้องการ Cinematic feel แนะนำ Gen4 Image
