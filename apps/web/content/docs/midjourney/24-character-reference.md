---
title: "Character Reference — รักษาตัวละครเดิม"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ --cref เพื่อรักษาหน้าตาและลักษณะของตัวละครให้สอดคล้องกันในหลายภาพ เหมาะสำหรับสร้าง Character Sheet และ Storyboard"
readTime: "6 นาที"
readers: "0"
locked: false
order: 24
---

# Character Reference — รักษาตัวละครเดิม

> อ้างอิงหลัก: [Character Reference](https://docs.midjourney.com/hc/en-us/articles/32162917505293-Character-Reference)

---

## Character Reference คืออะไร

Parameter `--cref` (Character Reference — การอ้างอิงตัวละคร เพื่อรักษาหน้าตาและลักษณะของตัวละครให้คงเดิมในภาพต่างๆ) ช่วยให้คุณสร้างหลายภาพที่มีตัวละครเดิม ไม่ว่าจะเป็นมุมมองต่าง ท่าทางต่าง หรือฉากต่าง

---

## วิธีใช้

```
[Prompt] --cref [URL ภาพตัวละคร]
```

**ตัวอย่าง:**
```
the same character running through a forest --cref https://example.com/character.jpg
the same character sitting at a cafe --cref https://example.com/character.jpg
the same character fighting a dragon --cref https://example.com/character.jpg
```

---

## Character Weight (--cw)

ใช้ `--cw` (Character Weight — ระดับความแม่นยำในการรักษาลักษณะตัวละคร) ควบคุมว่าจะรักษาความเหมือนมากแค่ไหน:

```
--cw 0     → ใช้แค่สไตล์ ไม่รักษาหน้าตา
--cw 50    → รักษาบางส่วน
--cw 100   → รักษาหน้าตาเต็มที่ (ค่าเริ่มต้น)
```

**ตัวอย่าง:**
```
a warrior in battle --cref [URL] --cw 100
a warrior in disguise --cref [URL] --cw 50
```

---

## การสร้าง Character Sheet (ชุดภาพตัวละคร)

Character Sheet คือชุดภาพที่แสดงตัวละครในมุมมองและท่าทางต่างๆ:

```
character sheet, front view, multiple poses --cref [URL] --cw 100
character sheet, side view, neutral expression --cref [URL]
character sheet, back view --cref [URL]
```

---

## ตัวอย่างการใช้งาน

### นิยายภาพ / Storyboard
สร้างตัวละครที่มีความสม่ำเสมอตลอดเรื่อง:
```
[ตัวละคร] standing in rain, sad expression --cref [URL]
[ตัวละคร] celebrating victory --cref [URL]
[ตัวละคร] sleeping under stars --cref [URL]
```

### Avatar ส่วนตัว
สร้างรูปโปรไฟล์หลายแบบจากตัวละครเดิม:
```
avatar portrait, professional look --cref [URL ตัวละคร]
avatar portrait, casual style --cref [URL ตัวละคร]
avatar portrait, fantasy version --cref [URL ตัวละคร]
```

---

## ข้อจำกัด

- `--cref` ทำงานได้ดีที่สุดกับตัวละคร Illustration หรือ Animated
- สำหรับใบหน้าคนจริงอาจได้ผลที่ไม่แม่นยำเท่า
- ยิ่งภาพต้นแบบชัดเจนและมีรายละเอียดมาก ยิ่งได้ผลดี

---

## --cref กับ --sref

| Parameter | รักษาอะไร |
|-----------|---------|
| `--cref` | หน้าตา ลักษณะตัวละคร |
| `--sref` | สไตล์การวาด Aesthetic |

ใช้ทั้งคู่พร้อมกันได้:
```
[ตัวละคร] in adventure --cref [URL ตัวละคร] --sref [URL สไตล์]
```

---

## สรุป

`--cref` เป็นเครื่องมือสำคัญสำหรับนักสร้าง Content ที่ต้องการตัวละครสม่ำเสมอในหลายภาพ ใช้ร่วมกับ `--cw` เพื่อควบคุมระดับความเหมือน และ `--sref` เพื่อควบคุมสไตล์
