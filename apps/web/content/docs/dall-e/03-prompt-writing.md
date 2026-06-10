---
title: "การเขียน Prompt สำหรับสร้างภาพ — เทคนิคและตัวอย่าง"
tool: "DALL·E"
icon: "icon-docs"
level: "beginner"
summary: "เรียนรู้วิธีเขียน Prompt ที่ดีสำหรับ DALL·E เพื่อสร้างภาพที่ตรงใจ พร้อมโครงสร้าง Prompt และตัวอย่างจริง"
readTime: "7 นาที"
readers: "0"
locked: false
order: 3
---
# การเขียน Prompt สำหรับสร้างภาพ — เทคนิคและตัวอย่าง

> อ้างอิงหลัก: [OpenAI Images Guide — Prompting](https://platform.openai.com/docs/guides/images)

---

## Prompt คืออะไร

**Prompt** (คำสั่งให้ AI สร้างภาพ — อธิบายภาพที่ต้องการเป็นภาษาอังกฤษหรือไทย) คือข้อความที่คุณพิมพ์เพื่อบอก DALL·E ว่าอยากได้ภาพแบบไหน ยิ่ง Prompt มีรายละเอียดมากและชัดเจนมากเท่าไร ผลลัพธ์ที่ได้ก็จะยิ่งตรงใจมากขึ้นเท่านั้น

---

## โครงสร้าง Prompt ที่ดี

Prompt ที่มีคุณภาพควรประกอบด้วยส่วนต่างๆ ดังนี้:

```
[วัตถุหลัก] + [การกระทำ/สถานการณ์] + [ฉากหลัง] + [สไตล์ภาพ] + [แสงสี] + [มุมกล้อง]
```

### ตัวอย่างโครงสร้างจริง

**Prompt เรียบง่าย:**
```
A cat sitting on a sofa
```

**Prompt ที่มีรายละเอียดดีขึ้น:**
```
A fluffy orange tabby cat sitting on a velvet blue sofa, afternoon sunlight streaming through the window, cozy living room background, photorealistic style, warm color tones
```

ความแตกต่างชัดเจน: Prompt ที่มีรายละเอียดมากกว่าจะให้ภาพที่ตรงใจกว่ามาก

---

## องค์ประกอบสำคัญของ Prompt

### 1. วัตถุหลัก (Subject)

อธิบายสิ่งที่เป็นใจกลางของภาพให้ชัดเจน

| ไม่ดี | ดีกว่า |
|---|---|
| "a dog" | "a golden retriever puppy with curly fur" |
| "a car" | "a vintage red Ferrari from the 1960s" |
| "a building" | "a Gothic cathedral with flying buttresses" |

### 2. การกระทำหรือสถานการณ์ (Action/Situation)

บอกว่าวัตถุกำลังทำอะไรหรืออยู่ในสถานการณ์ใด

- "running through a field"
- "sitting quietly under a cherry blossom tree"
- "flying over a city at night"
- "looking directly at the camera"

### 3. ฉากหลัง (Background/Setting)

- "in a futuristic city"
- "on a snowy mountain peak"
- "inside a cozy library"
- "underwater coral reef"

### 4. สไตล์ภาพ (Style)

สไตล์ที่ระบุได้จะส่งผลต่อลักษณะทั้งหมดของภาพ

| สไตล์ | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| `photorealistic` | สมจริงเหมือนภาพถ่าย | ภาพดูเหมือนถ่ายจากกล้องจริง |
| `oil painting` | ภาพวาดสีน้ำมัน | พื้นผิวหนา แสงเงาดราม่า |
| `watercolor` | สีน้ำ | ขอบนุ่ม สีโปร่งใส สวยงาม |
| `anime` | อนิเมะ | ตาโต เส้นคมชัด สไตล์ญี่ปุ่น |
| `flat illustration` | ภาพประกอบแบน | สีแบน ไม่มีเงา สไตล์โมเดิร์น |
| `pixel art` | พิกเซลอาร์ต | เหมือนเกม 8-bit คลาสสิก |
| `3D render` | ภาพ 3 มิติ | ดูมีมิติ เหมือนเรนเดอร์จาก Blender |
| `sketch` | ภาพร่าง | เส้นดินสอ ดูเหมือนร่างในสมุด |
| `impressionist` | อิมเพรสชันนิสม์ | ฝีแปรงชัดเจน เหมือน Monet |

### 5. แสงสี (Lighting & Color)

การระบุแสงและสีจะเปลี่ยนอารมณ์ของภาพได้มาก

- **"golden hour lighting"** — แสงพระอาทิตย์ตกดินสีทอง อบอุ่น
- **"dramatic studio lighting"** — แสงสตูดิโอ คมชัด มีเงาชัดเจน
- **"soft diffused light"** — แสงนุ่ม ไม่มีเงาแข็ง
- **"neon lights"** — แสงนีออนสีสดใส สไตล์ cyberpunk
- **"moonlit"** — แสงจันทร์ สีเย็น บรรยากาศลึกลับ
- **"high contrast"** — ความต่างระหว่างสว่างกับมืดสูง

### 6. มุมกล้อง (Camera Angle)

- **"close-up"** — ภาพระยะใกล้ เห็นรายละเอียด
- **"wide angle"** — มุมกว้าง เห็นฉากทั้งหมด
- **"bird's eye view"** — มุมมองจากด้านบน
- **"low angle"** — มุมต่ำ วัตถุดูยิ่งใหญ่
- **"portrait"** — ภาพเหมือนบุคคล เน้นใบหน้าและท่าทาง
- **"macro"** — ภาพมาโคร รายละเอียดสูงมาก เหมือนส่องด้วยแว่นขยาย

---

## เทคนิค Prompt ขั้นสูง

### เทคนิคที่ 1: ใช้คำคุณศัพท์ที่เจาะจง

แทนที่จะพูดว่า "สวย" ให้ระบุว่าสวยแบบไหน:

❌ "a beautiful forest"
✅ "an ancient forest with towering oak trees, dappled sunlight filtering through the canopy, misty morning atmosphere"

### เทคนิคที่ 2: ระบุสัดส่วน (Aspect Ratio — อัตราส่วนภาพ)

ใน DALL·E 3 คุณสามารถระบุทิศทางของภาพได้:
- "landscape orientation" → ภาพแนวนอน (1792×1024)
- "portrait orientation" → ภาพแนวตั้ง (1024×1792)
- "square format" → ภาพสี่เหลี่ยมจัตุรัส (1024×1024)

### เทคนิคที่ 3: อ้างอิงศิลปินหรือสไตล์ที่รู้จัก

```
in the style of Monet's impressionist paintings
in the style of Studio Ghibli anime
in the style of concept art for AAA video games
reminiscent of National Geographic photography
```

> **หมายเหตุ:** ควรใช้เพื่ออ้างอิงสไตล์เท่านั้น ไม่ควรขอให้ "คัดลอก" งานของศิลปินโดยตรง

### เทคนิคที่ 4: ระบุสิ่งที่ไม่ต้องการ (Negative Elements)

บอก ChatGPT ว่าไม่ต้องการอะไรในภาพ:

```
Create an image of a beach scene, but without any people or buildings, just pure nature
```

### เทคนิคที่ 5: ใช้การเปรียบเทียบ (Similes)

```
a cityscape that looks like a glowing circuit board
clouds that look like cotton candy
a building shaped like a seashell
```

---

## ตัวอย่าง Prompt จริงพร้อมคำอธิบาย

### ตัวอย่าง 1: ภาพโปรดักต์ (Product Photography)
```
A sleek black smartphone lying on a white marble surface, 
professional product photography, studio lighting, soft shadows, 
high resolution, commercial advertisement style
```
**ใช้สำหรับ:** ภาพสินค้าสำหรับเว็บไซต์หรือโฆษณา

### ตัวอย่าง 2: ภาพประกอบบทความ (Article Illustration)
```
An isometric illustration of a smart city with solar panels, 
electric vehicles, and green spaces, flat design style, 
bright and optimistic color palette, vector art look
```
**ใช้สำหรับ:** ภาพประกอบบทความเกี่ยวกับเทคโนโลยีหรือสิ่งแวดล้อม

### ตัวอย่าง 3: ภาพตัวละคร (Character Art)
```
A female warrior in ornate golden armor, holding a glowing sword, 
standing on a cliff overlooking a stormy sea, epic fantasy art, 
dramatic lighting, highly detailed, concept art style
```
**ใช้สำหรับ:** ตัวละครสำหรับเกม นิยาย หรือโปรเจกต์สร้างสรรค์

### ตัวอย่าง 4: ภาพโลโก้ (Logo Design)
```
A minimalist logo of a mountain peak inside a circle, 
monochrome black and white, clean lines, modern design, 
vector style, suitable for outdoor adventure brand
```
**ใช้สำหรับ:** ไอเดียโลโก้หรือแบรนดิ้ง

### ตัวอย่าง 5: ภาพพื้นหลัง (Background/Wallpaper)
```
A breathtaking aurora borealis over a snow-covered pine forest, 
purple and green lights dancing in the sky, reflection in a frozen lake, 
long exposure photography effect, ultra high resolution, cinematic
```
**ใช้สำหรับ:** วอลเปเปอร์หน้าจอหรือพื้นหลังพรีเซนเตชัน

---

## ข้อผิดพลาดที่พบบ่อยและวิธีแก้ไข

### ปัญหา: ภาพที่ได้ไม่ตรงกับที่ต้องการ

**สาเหตุ:** Prompt ไม่ชัดเจนพอ หรือใช้คำที่คลุมเครือ

**วิธีแก้:**
- เพิ่มรายละเอียดเฉพาะเจาะจงมากขึ้น
- ระบุสไตล์ แสง และบรรยากาศ
- ลองแบ่ง Prompt ออกเป็นส่วนๆ

### ปัญหา: ข้อความในภาพสะกดผิด

**สาเหตุ:** DALL·E ยังไม่สมบูรณ์แบบในการสร้างตัวหนังสือ

**วิธีแก้:**
- ใช้ข้อความสั้นๆ ที่เรียบง่าย
- ระบุว่า "clear legible text" หรือ "bold readable font"
- สำหรับข้อความสำคัญควรเพิ่มในโปรแกรมแก้ไขภาพหลังจากนั้น

### ปัญหา: AI ปฏิเสธ Prompt (Content Policy Violation)

**สาเหตุ:** Prompt มีคำที่ระบบตรวจพบว่าอาจสร้างเนื้อหาที่ไม่เหมาะสม

**วิธีแก้:**
- ปรับคำให้สุภาพและชัดเจนขึ้น
- หลีกเลี่ยงคำที่มีความหมายสองแง่
- ระบุบริบทที่ถูกต้อง เช่น "for educational purposes" หรือ "historical painting"

---

## สรุปหลักการเขียน Prompt ที่ดี

1. **ชัดเจน** — บอกสิ่งที่ต้องการอย่างตรงไปตรงมา
2. **มีรายละเอียด** — ยิ่งละเอียดมาก ยิ่งได้ภาพที่ตรงใจ
3. **ระบุสไตล์** — บอกว่าต้องการภาพสไตล์ใด
4. **ระบุอารมณ์** — บรรยายบรรยากาศและความรู้สึกที่ต้องการ
5. **ทดลองและปรับ** — อย่ากลัวที่จะลองหลายๆ ครั้ง ผลลัพธ์จะดีขึ้นเรื่อยๆ

การเขียน Prompt ที่ดีเป็นทักษะที่ต้องฝึกฝน ยิ่งใช้บ่อยก็จะยิ่งเก่งขึ้นเรื่อยๆ
