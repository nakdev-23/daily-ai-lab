---
title: "Remix Mode — ปรับ Prompt ขณะ Vary"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Remix Mode เพื่อเปลี่ยน Prompt ขณะทำ Variations ช่วยให้ Iterate ภาพได้อย่างมีประสิทธิภาพ"
readTime: "4 นาที"
readers: "0"
locked: false
order: 33
---

# Remix Mode — ปรับ Prompt ขณะ Vary

> อ้างอิงหลัก: [Remix](https://docs.midjourney.com/hc/en-us/articles/32799074515213-Remix)

---

## Remix Mode คืออะไร

Remix Mode (โหมดผสมปรับแต่ง — โหมดที่ให้คุณแก้ไข Prompt ได้ขณะทำ Variation หรือ Upscale แทนที่จะต้องใช้ Prompt เดิมตลอด) เปิดให้คุณแก้ไข Prompt ได้ในขั้นตอน Vary

---

## วิธีเปิด Remix Mode

### บนเว็บไซต์
- มักเปิดใช้งานโดยอัตโนมัติเมื่อคุณ Vary
- กล่อง Prompt จะปรากฏให้แก้ไขก่อน Generate

### บน Discord
1. พิมพ์ `/settings`
2. คลิก **"Remix Mode"** เพื่อเปิด

---

## วิธีใช้

1. สร้างภาพแรก
2. คลิก **Vary (Subtle)** หรือ **Vary (Strong)**
3. กล่อง Prompt จะปรากฏพร้อม Prompt เดิม
4. แก้ไข Prompt ตามต้องการ
5. กด Submit

---

## ตัวอย่างการใช้งาน

### เปลี่ยนสภาพอากาศ
```
ภาพเดิม: "a forest in summer"
Remix + Vary Strong: "a forest in winter, snow covered"
ผล: โครงสร้างป่าคล้ายกัน แต่เปลี่ยนเป็นฤดูหนาว
```

### เปลี่ยนสไตล์
```
ภาพเดิม: "a portrait of a woman, photorealistic"
Remix + Vary Subtle: "a portrait of a woman, oil painting style"
ผล: ท่าทางเหมือนกัน แต่เป็นสไตล์ภาพวาด
```

### เพิ่ม Parameters
```
ภาพเดิม: "a dragon"
Remix + เพิ่ม: "a dragon --ar 16:9 --stylize 750"
ผล: มังกรคล้ายกัน แต่ในสัดส่วน Widescreen และสวยงามขึ้น
```

---

## ความแตกต่างระหว่าง Remix กับ Re-run

| วิธี | ผล |
|------|-----|
| **Re-run (🔄)** | สร้างใหม่จาก Prompt เดิมทั้งหมด |
| **Remix + Vary** | สร้างใหม่ที่ยังมีความเชื่อมโยงกับภาพเดิม |

Remix ให้ภาพใหม่ที่ยังมี "DNA" ของภาพเดิม ต่างจาก Re-run ที่เริ่มใหม่ทั้งหมด

---

## เคล็ดลับ

1. **เปลี่ยนทีละอย่าง** — เพื่อเข้าใจว่าส่วนไหนส่งผลต่ออะไร
2. **ใช้กับ Vary Subtle** เพื่อเปลี่ยน Prompt แต่รักษา Composition หลัก
3. **ใช้กับ Vary Strong** เพื่อเปลี่ยนทิศทางมากขึ้น

---

## Remix Mode สำหรับ Variation ทั้งหมด

Remix Mode ทำงานกับทุก Variation:
- **Vary Subtle** + Remix → เปลี่ยน Prompt เล็กน้อย + Composition เดิม
- **Vary Strong** + Remix → เปลี่ยน Prompt มาก + ยังมี DNA เดิม
- **Zoom Out** + Remix → กำหนด Prompt สำหรับพื้นที่ที่ขยายออกไป
- **Pan** + Remix → กำหนด Prompt สำหรับพื้นที่ที่ Pan ไป

---

## ตัวอย่าง Remix Workflow จริง

### เปลี่ยน Season (ฤดูกาล)
```
ภาพเดิม: "a forest path in summer"
Remix + Vary Subtle → เปลี่ยนเป็น "a forest path in winter, snow on the ground"
ผล: ป่าโครงสร้างเดิม แต่กลายเป็นฤดูหนาว
```

### เปลี่ยน Time of Day
```
ภาพเดิม: "a beach at noon, clear sky"
Remix + Vary Strong → "a beach at sunset, golden hour"
ผล: ชายหาดเดิม แต่บรรยากาศพระอาทิตย์ตก
```

### เพิ่มตัวละคร
```
ภาพเดิม: "an empty medieval tavern"
Remix + Vary Region (เลือกพื้นที่กลางห้อง) → "a group of adventurers drinking"
ผล: ห้องเดิมแต่มีคนแผนที่อยู่ด้วย
```

---

## Remix Mode ในการสร้าง Series

สร้าง Image Series ที่มีความเชื่อมโยงกัน:
```
รูปที่ 1: "a hero in the village square"
Remix + Vary → "the hero leaving the village"
Remix + Vary → "the hero on a mountain trail"
Remix + Vary → "the hero arriving at the castle"
```
→ ได้ภาพ Series ที่มีตัวละครและสไตล์สอดคล้องกัน

---

## สรุป

Remix Mode เป็นเครื่องมือ Iteration ที่ทรงพลัง ช่วยให้คุณ "นำทาง" การพัฒนาภาพอย่างมีทิศทาง แทนที่จะเริ่มใหม่ทั้งหมดทุกครั้ง เหมาะสำหรับงานที่ต้องการ Evolve ภาพอย่างมีขั้นตอน หรือสร้าง Series ที่มีความสอดคล้องกัน
