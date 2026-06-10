---
title: "Style Reference — อ้างอิงสไตล์จากภาพ"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ --sref เพื่อดึงสไตล์จากภาพต้นแบบมาใช้กับ Prompt ใหม่ โดยไม่คัดลอกเนื้อหาในภาพ"
readTime: "6 นาที"
readers: "0"
locked: false
order: 23
---

# Style Reference — อ้างอิงสไตล์จากภาพ

> อ้างอิงหลัก: [Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)

---

## Style Reference คืออะไร

Parameter `--sref` (Style Reference — การอ้างอิงสไตล์จากภาพ โดยดึงเฉพาะรูปแบบการวาด สี และ Aesthetic มาใช้ ไม่ใช่เนื้อหา) ช่วยให้คุณนำสไตล์จากภาพหนึ่งไปใช้กับเนื้อหาอื่นได้

**ต่างจาก Image Prompt:**
- `Image Prompt` = อ้างอิงทั้งเนื้อหาและสไตล์
- `--sref` = อ้างอิงเฉพาะสไตล์ (Aesthetic, สี, วิธีวาด) ไม่รับเนื้อหา

---

## วิธีใช้

```
[Prompt] --sref [URL ภาพสไตล์]
```

**ตัวอย่าง:**
```
a portrait of a samurai --sref https://example.com/watercolor-style.jpg
a city at night --sref https://example.com/neon-art-style.jpg
```

---

## Style Weight (--sw)

ใช้ `--sw` (Style Weight — น้ำหนักสไตล์ ควบคุมว่าสไตล์ต้นแบบจะส่งผลมากน้อยแค่ไหน) ควบคุมความแรงของ Style Reference:

```
a landscape --sref [URL] --sw 100    → สไตล์อ่อน
a landscape --sref [URL] --sw 500    → สไตล์ปานกลาง
a landscape --sref [URL] --sw 1000   → สไตล์แรง (ค่าสูงสุด)
```

ค่าเริ่มต้นของ `--sw` คือ **100**

---

## ใช้หลาย Style References พร้อมกัน

```
a forest --sref [URL1] [URL2]
```

Midjourney จะผสมสไตล์จากทั้งสองภาพ

---

## ตัวอย่างการใช้งาน

### ดึงสไตล์ศิลปิน
```
a dragon in flight --sref https://example.com/impressionist-painting.jpg
```
→ มังกรที่วาดในสไตล์ Impressionist (อิมเพรสชันนิสม์ — สไตล์การวาดที่เน้นความรู้สึกและแสงมากกว่ารายละเอียด)

### สร้าง Consistent Brand Style
สร้างภาพหลายรูปในสไตล์เดียวกัน:
```
a product photo of headphones --sref [URL ภาพสไตล์แบรนด์]
a product photo of earbuds --sref [URL ภาพสไตล์แบรนด์]
a product photo of speaker --sref [URL ภาพสไตล์แบรนด์]
```

### เปลี่ยนสื่อ (Medium)
```
a cat --sref [URL ภาพวาดด้วย charcoal]
```
→ ได้ภาพแมวที่วาดด้วย charcoal

---

## --sref vs --cref

| Parameter | ใช้เพื่อ |
|-----------|---------|
| `--sref` | อ้างอิงสไตล์ (Aesthetic, วิธีวาด, สี) |
| `--cref` | อ้างอิงตัวละคร (Character Reference — รักษาหน้าตาตัวละครเดิม) |

---

## เคล็ดลับ

1. **ใช้ภาพที่มีสไตล์ชัดเจน** — ภาพ Illustration, Painting หรือ Artwork ที่มีสไตล์เด่นชัดให้ผลดีกว่าภาพถ่ายทั่วไป
2. **ปรับ --sw** — เริ่มจาก 500 แล้วปรับตามต้องการ
3. **รวมกับ Personalization** — `--sref [URL] --p` ผสมสไตล์อ้างอิงกับรสนิยมส่วนตัว

---

## สรุป

`--sref` เป็นเครื่องมือทรงพลังสำหรับการสร้าง Consistent Style ในหลายภาพ หรือนำสไตล์จากภาพที่ชอบมาใช้กับเนื้อหาใหม่ ใช้ `--sw` เพื่อควบคุมความแรงของสไตล์
