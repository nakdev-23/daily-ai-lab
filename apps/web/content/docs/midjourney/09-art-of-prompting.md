---
title: "ศิลปะแห่งการเขียน Prompt"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "เทคนิคและกลยุทธ์ขั้นสูงในการเขียน Prompt ให้ได้ภาพที่ตรงใจ ครอบคลุมวิธีคิด รูปแบบ และการแก้ปัญหาเมื่อผลลัพธ์ไม่เป็นอย่างที่ต้องการ"
readTime: "9 นาที"
readers: "0"
locked: false
order: 9
---

# ศิลปะแห่งการเขียน Prompt

> อ้างอิงหลัก: [Art of Prompting](https://docs.midjourney.com/hc/en-us/articles/32835253061645-Art-of-Prompting)

---

## ปรัชญาของ Prompt

Midjourney ไม่ใช่เครื่องมือที่ต้องการคำสั่งที่ "ถูกต้อง" เพียงอย่างเดียว แต่เป็นศิลปะในการสื่อสารกับ AI อย่างมีประสิทธิภาพ ยิ่งคุณเข้าใจวิธีที่ Midjourney ประมวลผลภาษา ยิ่งสร้างภาพที่ตรงใจได้มากขึ้น

### หลักการสำคัญ
- **Specificity** (ความเฉพาะเจาะจง) — รายละเอียดที่ชัดเจนให้ผลลัพธ์ที่แม่นยำกว่า
- **Simplicity** (ความเรียบง่าย) — ไม่จำเป็นต้องยาวมาก ถ้าสั้นและชัดเจนก็พอ
- **Iteration** (การปรับปรุงซ้ำ — กระบวนการทดลองและปรับแก้ซ้ำๆ จนได้ผลที่ต้องการ) — สร้างซ้ำและปรับ Prompt จนพอใจ

---

## วิธีคิด Prompt แบบ Visual (ภาพนึกถึง)

แทนที่จะบอกว่า "ต้องการอะไร" ลองนึกว่า "ภาพนี้ถูกถ่ายหรือวาดอย่างไร"

### แนวคิดที่ 1 — Think Like a Photographer (คิดแบบช่างภาพ)
```
คำถาม: กล้องอยู่ที่ไหน? แสงมาจากทิศไหน? เลนส์อะไร?
ตัวอย่าง: close-up macro shot, diffused natural light from left, shallow depth of field
```

### แนวคิดที่ 2 — Think Like a Director (คิดแบบผู้กำกับ)
```
คำถาม: บรรยากาศเป็นอย่างไร? อารมณ์ที่ต้องการสื่อคืออะไร?
ตัวอย่าง: tense atmosphere, low key lighting, desaturated colors, noir aesthetic
```

### แนวคิดที่ 3 — Think Like an Art Director (คิดแบบ Art Director)
```
คำถาม: สไตล์ไหน? ยุคสมัยไหน? อ้างอิงศิลปินใคร?
ตัวอย่าง: art nouveau style, 1920s aesthetic, inspired by Alphonse Mucha
```

---

## Anatomy of a Master Prompt (โครงสร้าง Prompt ระดับมือโปร)

```
[Type of image] of [Subject], [Environment/Background], [Lighting], [Style/Medium], [Mood/Atmosphere], [Technical details], [Quality modifiers]
```

**ตัวอย่างเต็มรูปแบบ:**
```
oil painting of an ancient samurai warrior standing on a misty mountain peak, 
dramatic stormy sky behind, golden hour side lighting, traditional Japanese art style 
blended with Western realism, contemplative melancholic mood, 
highly detailed armor with intricate engravings, masterpiece quality
```

---

## คำที่มีพลังใน Prompt

### Quality Boosters (คำเพิ่มคุณภาพ)
คำเหล่านี้ช่วยให้ภาพมีความละเอียดและสวยงามมากขึ้น:
- `highly detailed` — รายละเอียดสูง
- `masterpiece` — ผลงานชั้นยอด
- `professional photography` — ภาพถ่ายมืออาชีพ
- `8k resolution` — ความละเอียดสูง
- `award winning` — ระดับรางวัล
- `cinematic lighting` — แสงแบบภาพยนตร์

### Style Anchors (สมอสไตล์ — คำที่กำหนดสไตล์ชัดเจน)
- ชื่อศิลปิน: `in the style of Van Gogh`, `inspired by Hayao Miyazaki`
- นิตยสาร: `National Geographic photography`, `Vogue editorial`
- ยุคสมัย: `Renaissance painting`, `80s retro`, `futuristic 2200s`
- วัสดุ: `oil on canvas`, `pencil sketch`, `digital art`

---

## กลยุทธ์การ Iterate (ปรับปรุงซ้ำ)

### Step 1 — เริ่มจากแกนกลาง
```
a lighthouse at night
```

### Step 2 — เพิ่มสภาพแวดล้อม
```
a lighthouse at night, rocky coastline, stormy sea
```

### Step 3 — เพิ่มบรรยากาศและแสง
```
a lighthouse at night, rocky coastline, stormy sea, dramatic lightning in the sky
```

### Step 4 — เพิ่มสไตล์
```
a lighthouse at night, rocky coastline, stormy sea, dramatic lightning, oil painting style, dramatic composition
```

### Step 5 — เพิ่มรายละเอียดเฉพาะ
```
a lighthouse at night, rocky coastline, churning stormy sea, dramatic lightning illuminating dark clouds, 
thick oil painting, impasto technique, reminiscent of J.M.W. Turner, masterpiece
```

---

## แก้ปัญหาเมื่อผลลัพธ์ไม่ตรงใจ

### ปัญหา: ภาพดูธรรมดาเกินไป
**แก้ไข:** เพิ่ม Mood และ Quality modifiers
```
เดิม: a forest
ปรับ: an enchanted ancient forest, magical atmosphere, golden light filtering through leaves, ethereal, breathtaking
```

### ปัญหา: ภาพมีสิ่งที่ไม่ต้องการ
**แก้ไข:** ใช้ `--no` Parameter เพื่อบอกสิ่งที่ไม่ต้องการ
```
a beach scene --no people, umbrellas, buildings
```

### ปัญหา: สัดส่วนหรือ Composition ไม่ดี
**แก้ไข:** ระบุ Composition ชัดเจน
```
wide establishing shot, rule of thirds composition, subject on left third
```

### ปัญหา: สีไม่ตรงกับที่ต้องการ
**แก้ไข:** ระบุ Palette สี
```
warm earth tones color palette: terracotta, amber, deep brown
cool blue and purple color scheme
```

---

## Prompt สำหรับงานเฉพาะด้าน

### งานโฆษณาและการตลาด
```
product mockup of [สินค้า], clean white background, soft studio lighting, commercial photography, 
minimal aesthetic, high-end brand feel
```

### งานออกแบบ UI/UX
```
clean modern app interface for [ชื่อแอป], flat design, blue and white color scheme, 
iOS style icons, minimal, user-friendly layout
```

### งานศิลปะดิจิทัล
```
concept art for a [ชื่อเกม/หนัง], [ประเภทฉาก], professional concept art, 
detailed environment design, mood lighting
```

---

## ความแตกต่างระหว่าง Prompt ที่ดีและไม่ดี

| ❌ Prompt ที่อ่อนแอ | ✅ Prompt ที่แข็งแกร่ง |
|---------------------|----------------------|
| `a nice picture` | `a serene Japanese zen garden, cherry blossom tree, stone lantern, raked gravel` |
| `draw a cat` | `portrait of a regal persian cat, emerald eyes, soft studio lighting, oil painting` |
| `futuristic city` | `sprawling cyberpunk metropolis at night, neon reflections in rain-soaked streets, aerial view` |
| `beautiful woman` | `portrait of an elderly Thai woman, traditional silk dress, warm evening light, documentary photography` |

---

## เคล็ดลับจากผู้เชี่ยวชาญ

1. **สร้าง Prompt Template** — บันทึก Prompt ที่ได้ผลดีไว้ใช้ซ้ำ
2. **ทดสอบ Single Variable** — เปลี่ยนคำเดียวในแต่ละครั้งเพื่อเรียนรู้ผลกระทบ
3. **ใช้ Permutations** — สร้างหลาย Variation พร้อมกันโดยใช้ `{option1, option2}` ใน Prompt
4. **จดบันทึก** — เก็บ Prompt ที่ได้ผลดีพร้อมผลลัพธ์เพื่อสร้าง Library ส่วนตัว

---

## สรุป

การเขียน Prompt ที่ดีเป็นทักษะที่ต้องฝึก ไม่มีสูตรตายตัว แต่หลักการหลักคือ: **ชัดเจน + มีรายละเอียด + ระบุสไตล์** แล้วทดลองซ้ำจนพอใจ ยิ่งสร้างมาก ยิ่งเข้าใจภาษาของ Midjourney มากขึ้น
