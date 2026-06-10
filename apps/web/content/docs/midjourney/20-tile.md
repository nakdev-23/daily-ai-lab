---
title: "Tile — สร้าง Pattern ไร้รอยต่อ"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "วิธีใช้ Parameter --tile เพื่อสร้างภาพที่นำมาต่อกันได้แบบ Seamless สำหรับ Background, Texture และ Pattern"
readTime: "5 นาที"
readers: "0"
locked: false
order: 20
---

# Tile — สร้าง Pattern ไร้รอยต่อ

> อ้างอิงหลัก: [Tile](https://docs.midjourney.com/hc/en-us/articles/32197978340109-Tile)

---

## Tile คืออะไร

Parameter `--tile` (กระเบื้อง/ลวดลายต่อกัน — สร้างภาพที่เมื่อนำมาวางเรียงต่อกันจะไม่เห็นรอยต่อ) สร้างภาพที่สามารถนำมา "แปะ" ต่อกันในทิศทางใดก็ได้โดยไม่มีรอยต่อ

ใช้สำหรับ:
- **Background** (พื้นหลัง) ของเว็บไซต์, แอป
- **Texture** (พื้นผิว — ลักษณะผิวของวัตถุ) สำหรับงาน 3D
- **Fabric Pattern** (ลายผ้า)
- **Wallpaper Pattern** (วอลเปเปอร์ลายซ้ำ)
- **Packaging Design** (ออกแบบบรรจุภัณฑ์)

---

## วิธีใช้

```
[Prompt] --tile
```

ไม่ต้องใส่ค่าตัวเลข แค่เพิ่ม `--tile` ท้าย Prompt:

```
colorful tropical flowers and leaves --tile
geometric abstract pattern, blue and gold --tile
vintage floral wallpaper, pastel colors --tile
```

---

## ตัวอย่าง Prompt สำหรับ Tile

### Fabric / Textile
```
japanese indigo resist-dyed pattern, traditional motifs --tile
bohemian paisley pattern, warm earth tones --tile
```

### Nature Pattern
```
watercolor leaves and branches, green and gold --tile
small wildflowers on white background --tile
```

### Geometric
```
art deco geometric pattern, black and gold --tile
hexagonal mosaic, teal and white --tile
```

### Food & Playful
```
cute kawaii food icons pattern --tile
small stars and moons, pastel colors --tile
```

---

## ทดสอบ Seamless (ไร้รอยต่อ)

หลังสร้างภาพด้วย `--tile` ให้ทดสอบโดย:

1. นำภาพไปเปิดใน Photoshop หรือ GIMP (โปรแกรมแต่งภาพ)
2. ใช้ฟีเจอร์ Offset หรือ Tile Preview
3. หรือวางภาพซ้ำในกริดเพื่อดูว่าต่อกันได้สวยไหม

---

## ข้อแนะนำในการเขียน Prompt สำหรับ Tile

1. **ใช้ธีม Repeat** — คำว่า "pattern", "repeat", "motif" ช่วยให้ Midjourney เข้าใจ
2. **หลีกเลี่ยงองค์ประกอบใหญ่เดี่ยว** — เช่น "a single large tree" จะต่อกันไม่ดี
3. **ใช้ธีมที่มีหลายชิ้นเล็กๆ** — ดอกไม้, ใบไม้, ดาว, รูปทรงเรขาคณิต

---

## Tile กับ Aspect Ratio

`--tile` ทำงานได้ดีที่สุดกับ `--ar 1:1` (สี่เหลี่ยมจัตุรัส) เพราะต่อกันได้ง่ายทั้งแนวนอนและแนวตั้ง

```
floral pattern, pastel --tile --ar 1:1
```

---

## สรุป

`--tile` เป็น Parameter ที่มีประโยชน์มากสำหรับนักออกแบบที่ต้องการ Pattern และ Texture ใช้ร่วมกับ `--ar 1:1` เพื่อผลลัพธ์ที่ต่อกันได้ดีที่สุด
