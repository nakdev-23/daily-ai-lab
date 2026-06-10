---
title: "พื้นฐาน Prompt"
tool: "Midjourney"
icon: "tool-midjourney"
level: "intermediate"
summary: "เรียนรู้วิธีเขียน Prompt อย่างมีประสิทธิภาพ โครงสร้างที่ดีของ Prompt และตัวอย่างที่ช่วยให้ได้ภาพตรงตามที่ต้องการ"
readTime: "8 นาที"
readers: "0"
locked: false
order: 7
---

# พื้นฐาน Prompt

> อ้างอิงหลัก: [Prompt Basics](https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics)

---

## Prompt คืออะไร

Prompt (คำสั่งที่พิมพ์ให้ AI สร้างภาพ — เหมือนการบอกว่าอยากได้รูปแบบไหน) คือข้อความที่คุณพิมพ์เพื่อสื่อสารกับ Midjourney ว่าต้องการภาพแบบไหน

ตัวอย่างเช่น:
- `a cat` → ภาพแมวทั่วไป
- `a fluffy orange cat sitting on a windowsill, soft afternoon light, photorealistic` → ภาพแมวขนฟูสีส้มนั่งริมหน้าต่าง แสงบ่ายนุ่ม ภาพสมจริง

ยิ่งระบุรายละเอียดมาก ผลลัพธ์ยิ่งตรงกับที่ต้องการ

---

## โครงสร้างของ Prompt ที่ดี

Prompt ที่มีประสิทธิภาพมักประกอบด้วย:

```
[หัวเรื่อง/Subject] + [สภาพแวดล้อม/Environment] + [สไตล์/Style] + [รายละเอียดเพิ่มเติม]
```

### ตัวอย่าง

**ง่าย:**
```
a wolf howling at the moon
```

**ละเอียดขึ้น:**
```
a wolf howling at the full moon, dense pine forest, foggy night, dramatic lighting, oil painting style
```

**ขั้นสูง:**
```
a majestic wolf howling at the full moon, dense pine forest at midnight, thick fog, dramatic blue moonlight, hyperdetailed fur, oil painting by Ivan Shishkin, 8k resolution
```

---

## ส่วนประกอบของ Prompt

### 1. Subject (หัวเรื่อง — สิ่งหลักที่ต้องการให้ปรากฏในภาพ)
บอกว่าภาพเกี่ยวกับอะไร:
- คน: `a young woman`, `an elderly man`, `a child`
- สัตว์: `a golden retriever`, `a dragon`, `a butterfly`
- สถานที่: `a mountain village`, `a space station`, `a medieval castle`
- วัตถุ: `a vintage camera`, `a glowing sword`, `a teacup`

### 2. Style (สไตล์ — รูปแบบทางศิลปะ)
บอกว่าต้องการภาพแนวไหน:

| สไตล์ | คำที่ใช้ |
|-------|---------|
| ภาพถ่ายจริง | `photorealistic`, `photography`, `DSLR photo` |
| วาดด้วยมือ | `oil painting`, `watercolor`, `pencil sketch` |
| การ์ตูน | `anime style`, `cartoon`, `comic book` |
| ดิจิทัลอาร์ต | `digital art`, `concept art`, `illustration` |
| วินเทจ | `vintage`, `retro`, `1950s style` |
| ภาพยนตร์ | `cinematic`, `movie still`, `film photography` |

### 3. Lighting (แสง — บรรยากาศแสงในภาพ)
แสงส่งผลมากต่ออารมณ์ภาพ:
- `golden hour` — แสงทองของเช้าหรือเย็น
- `dramatic lighting` — แสงเข้มสร้างบรรยากาศ
- `soft light` — แสงนุ่มละมุน
- `studio lighting` — แสงสตูดิโอ
- `neon lights` — ไฟนีออนสีสดใส

### 4. Mood (อารมณ์ — ความรู้สึกที่ภาพควรสื่อ)
- `peaceful`, `serene` — สงบ เงียบ
- `dramatic`, `intense` — ดุเดือด เข้มข้น
- `playful`, `cheerful` — สนุกสนาน
- `mysterious`, `eerie` — ลึกลับ น่าขนลุก

### 5. Composition (การจัดองค์ประกอบ — มุมมองและการวางภาพ)
- `close-up portrait` — ภาพใกล้ เน้นใบหน้า
- `wide angle shot` — มุมกว้าง
- `aerial view` / `bird's eye view` — มุมมองจากด้านบน
- `eye level` — มุมระดับสายตา
- `symmetrical composition` — องค์ประกอบแบบสมมาตร

---

## กฎการเขียน Prompt

### ✅ สิ่งที่ควรทำ
- **ใช้ภาษาอังกฤษ** — ให้ผลลัพธ์ดีที่สุด
- **ระบุรายละเอียดสำคัญ** — บอกสีหลัก, อารมณ์, สไตล์
- **คั่นด้วยเครื่องหมายจุลภาค** — เช่น `a cat, fluffy fur, orange color, sunny day`
- **เรียงจากสำคัญไปน้อย** — สิ่งที่อยู่ต้น Prompt มีน้ำหนักมากกว่า

### ❌ สิ่งที่ควรหลีกเลี่ยง
- อย่าพิมพ์ยาวเกินไปโดยไม่จำเป็น — Midjourney ประมวลผล Prompt ได้ดีแม้ไม่ยาวมาก
- หลีกเลี่ยงคำขัดแย้งกัน เช่น `dark bright image`
- ไม่ต้องใช้ภาษาทางการหรือไวยากรณ์สมบูรณ์

---

## การใช้ Weights (น้ำหนักคำ)

คุณสามารถกำหนด Weight (น้ำหนัก — ระดับความสำคัญ) ให้กับส่วนต่างๆ ของ Prompt:

```
hot dog:: 5 cat:: 2
```

ความหมาย: ให้ความสำคัญกับ "hot dog" มากกว่า "cat"

หรือใช้เครื่องหมายลบเพื่อลดน้ำหนัก:
```
beautiful landscape:: flowers::-0.5
```

ความหมาย: ให้ภาพทิวทัศน์สวยงาม แต่ลดดอกไม้ให้น้อยลง

---

## Multi-Prompts (หลาย Prompt รวมกัน)

ใช้ `::` เพื่อแยก Prompt เป็นส่วนๆ:

```
space ship:: rocket engine:: alien planet
```

แต่ละส่วนจะถูกประมวลผลแยกกัน แล้วรวมเข้าด้วยกัน ต่างจาก:

```
space ship rocket engine alien planet
```

ที่ Midjourney ประมวลผลเป็น Phrase เดียว

---

## ตัวอย่าง Prompt จริง

### ภาพ Portrait (ภาพบุคคล)
```
portrait of a young Thai woman, traditional costume, temple background, soft golden light, detailed, professional photography
```

### ภาพธรรมชาติ
```
misty mountain valley at sunrise, cherry blossoms, reflection in still water, peaceful, landscape photography
```

### ภาพสถาปัตยกรรม
```
ancient Thai temple at twilight, dramatic sky, intricate golden details, long exposure photography
```

### ภาพแฟนตาซี
```
magical forest with glowing mushrooms, fairies, moonlight filtering through trees, fantasy art, highly detailed
```

---

## เคล็ดลับขั้นสูง

1. **ดูจาก Explore** — หาภาพที่ชอบแล้วดู Prompt เพื่อเรียนรู้รูปแบบ
2. **เพิ่มชื่อศิลปิน** — เช่น `in the style of Claude Monet` หรือ `inspired by Studio Ghibli`
3. **ระบุรายละเอียดกล้อง** — เช่น `shot on Canon 5D, 85mm lens, f/1.8` สำหรับภาพสมจริง
4. **ทดสอบซ้ำ** — Prompt เดิมให้ผลต่างกันในแต่ละครั้ง ลองหลายๆ รอบ

---

## สรุป

Prompt ที่ดีคือ Prompt ที่ชัดเจน ระบุ Subject, Style, Lighting และ Mood ได้ชัดเจน เริ่มจากง่ายแล้วเพิ่มรายละเอียดทีละอย่างจนได้ผลลัพธ์ที่ต้องการ การเรียนรู้การเขียน Prompt ดีๆ คือทักษะที่ยิ่งฝึกยิ่งเก่ง
