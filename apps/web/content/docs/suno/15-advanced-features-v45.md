---
title: "ฟีเจอร์ขั้นสูง v4.5 — Creative Sliders, Song Editor, Inspire"
tool: "Suno"
icon: "tool-suno"
level: "pro"
summary: "เจาะลึกฟีเจอร์ขั้นสูงใน Suno v4.5 ได้แก่ Creative Sliders, Song Editor, Stem Extraction, Inspire และ Detailed Style Instructions"
readTime: "9 นาที"
readers: "0"
locked: false
order: 15
---

# ฟีเจอร์ขั้นสูง v4.5 — Creative Sliders, Song Editor, Inspire

Suno v4.5 หรือที่เรียกว่า **"Artist Update"** มาพร้อมกับชุดฟีเจอร์ใหม่ที่ให้ผู้ใช้ควบคุมกระบวนการสร้างเพลงได้ละเอียดและสร้างสรรค์มากขึ้น

---

## Creative Sliders (สไลเดอร์ความสร้างสรรค์)

**Creative Sliders** คือตัวควบคุมที่ให้คุณปรับระดับความ "ผิดแผก" และ "เข้มข้น" ของเพลงที่ AI สร้าง

### สไลเดอร์ทั้งสอง

#### 1. Creativity (ความสร้างสรรค์/ความหลากหลาย)

```
Conservative ◄──────────────────────────► Experimental
(อนุรักษ์นิยม)                           (ทดลองสร้างสรรค์)

Conservative = เพลงดูปกติ คาดเดาได้ ใกล้เคียงแนวเพลงที่กำหนด
Experimental = เพลงผิดแผก น่าแปลกใจ อาจผสม Genre ที่ไม่คาดคิด
```

#### 2. Intensity (ความเข้มข้น)

```
Subtle ◄──────────────────────────────► Intense
(เบาบาง)                               (เข้มข้น/รุนแรง)

Subtle = เสียงเบาลง ผ่อนคลาย ไม่มีความเข้มข้น
Intense = เสียงเต็มพลัง เข้มข้น Dynamic สูง
```

### เมื่อไหร่ควรใช้แต่ละระดับ

| เป้าหมาย | Creativity | Intensity |
|--------|-----------|---------|
| เพลงกล่อมนอน | Conservative | Subtle |
| เพลง Pop มาตรฐาน | กลาง | กลาง |
| เพลง Workout | Conservative | Intense |
| ทดลองสไตล์ใหม่ | Experimental | กลาง |
| เพลง Avant-garde | Experimental | Intense |

---

## Creative Prompt Boosting (การเพิ่มพลัง Prompt)

**Creative Prompt Boosting** ใน v4.5 ช่วยให้ AI เข้าใจ Style Prompt ได้ดีขึ้นโดยอัตโนมัติ

เมื่อเปิด Boosting, Suno จะ:
- ตีความ Prompt ที่คลุมเครือให้ชัดเจนขึ้น
- เพิ่มรายละเอียดที่ขาดหายไป
- ทำให้ผลลัพธ์ตรงกับเจตนามากขึ้น

### วิธีเปิด Creative Prompt Boosting

1. ใน Create Page คลิกที่ไอคอน ⚡ หรือ **"Boost"**
2. เปิด Toggle เป็น "On"
3. พิมพ์ Style Prompt ตามปกติ — Suno จะจัดการส่วนที่เหลือ

---

## Song Editor (โปรแกรมแก้ไขเพลง)

**Song Editor** ใน v4.5 ช่วยให้คุณแก้ไขส่วนต่าง ๆ ของเพลงได้โดยตรง ไม่ต้องสร้างใหม่ทั้งหมด

### ฟีเจอร์ของ Song Editor

| ฟีเจอร์ | การใช้งาน |
|--------|---------|
| **Edit Lyrics** | เปลี่ยนเนื้อเพลงในส่วนที่เลือก |
| **Change Style** | เปลี่ยนสไตล์ดนตรีสำหรับส่วนนั้น ๆ |
| **Replace Section** | สร้างส่วนนั้นใหม่โดยสมบูรณ์ |
| **Adjust Timing** | ปรับความยาวของแต่ละส่วน |

### วิธีใช้ Song Editor

1. เปิดเพลงที่ต้องการแก้ไข
2. คลิก **"Edit"** หรือ **"Song Editor"**
3. เลือกส่วนของเพลงที่ต้องการแก้ไขบน Timeline
4. ทำการแก้ไขตามต้องการ
5. คลิก **"Generate"** หรือ **"Apply"**

---

## Stem Extraction (การแยกแทร็คเสียง)

**Stem Extraction** (การแยกแทร็ค — แยกไฟล์เสียงออกเป็นส่วน ๆ เช่น เสียงร้องแยก ดนตรีแยก) เป็นฟีเจอร์ขั้นสูงสำหรับ Pro/Premier

### ประเภท Stem ที่ดาวน์โหลดได้

| Stem | ความหมาย |
|------|---------|
| **Vocals** (เสียงร้อง) | เฉพาะเสียงร้องอย่างเดียว |
| **Instrumental** (ดนตรี) | เพลงไม่มีเสียงร้อง |
| **Drums** (กลอง) | เฉพาะเสียงกลอง |
| **Bass** (เบส) | เฉพาะเสียงเบส |
| **Other** | เครื่องดนตรีที่เหลือ |

> **หมายเหตุ:** ไม่ใช่ทุก Stem จะพร้อมใช้งาน ขึ้นอยู่กับเพลง

### วิธีใช้ Stem Extraction

1. เปิดเพลงที่ต้องการ
2. คลิก **"..."** แล้วเลือก **"Stems"** หรือ **"Stem Extraction"**
3. เลือก Stem ที่ต้องการ
4. รอประมวลผล (อาจใช้เวลา 1–3 นาที)
5. ดาวน์โหลด Stem ที่ต้องการ

### ประโยชน์ของ Stem Extraction

- นำ **Vocal Stem** ไปใช้ใน Karaoke (คาราโอเกะ)
- นำ **Instrumental Stem** ไปใช้เป็นเพลงพื้นหลัง
- นำ **Drum Stem** ไปใช้ใน Mix ของตัวเอง
- ส่งไฟล์ให้ Mastering Engineer (วิศวกรเสียง) แยกทำงาน

---

## Inspire (แรงบันดาลใจ)

**Inspire** (แรงบันดาลใจ) เป็นฟีเจอร์ที่ช่วยสร้าง Prompt ให้คุณเมื่อไม่รู้จะสร้างเพลงอะไร

### วิธีใช้ Inspire

1. คลิก **"Inspire"** ในหน้า Create
2. Suno จะสร้าง Prompt ตัวอย่างให้ 3–5 แบบ
3. เลือก Prompt ที่ชอบ หรือปรับแต่งก่อนใช้
4. คลิก Create

### ตัวอย่าง Inspire ที่ได้

```
"Dreamy synthwave ballad about neon-lit rainy streets"
```
```
"Cheerful bossa nova for a lazy Sunday afternoon"
```
```
"Intense electronic battle theme for a video game boss fight"
```

---

## Add Vocals (เพิ่มเสียงร้อง)

**Add Vocals** ใน v4.5 ช่วยให้คุณเพิ่มเสียงร้องเข้าไปในเพลง Instrumental ที่มีอยู่แล้ว

### วิธีใช้ Add Vocals

1. เปิดเพลง Instrumental ที่ต้องการ
2. คลิก **"Add Vocals"** (เพิ่มเสียงร้อง)
3. ระบุ:
   - **Lyrics** สำหรับส่วนที่ต้องการร้อง
   - **Vocal Style** เสียงนักร้องที่ต้องการ
4. คลิก Generate

---

## Detailed Style Instructions (คำสั่ง Style ละเอียด)

ใน v4.5 คุณสามารถใช้ **Detailed Style Instructions** ที่ซับซ้อนและละเอียดมากขึ้นใน Style field

### ตัวอย่างการใช้ Style Instructions แบบละเอียด

แบบธรรมดา:
```
pop rock
```

แบบละเอียด v4.5:
```
indie pop rock with jangly guitar, warm analog synths, driving rhythm section,
intimate vocals with subtle reverb, bridge drops to half-time with atmospheric pads,
chorus explodes with layered harmonies, bridge brings back full energy for final chorus
```

### องค์ประกอบที่ระบุได้ในคำสั่ง Style

```
เครื่องดนตรี: guitar, piano, synth, drums, bass, violin, cello, flute...
ลักษณะเสียง: warm, crisp, bright, dark, lo-fi, hi-fi, vintage, modern...
เทคนิค Mix: reverb, chorus effect, distortion, compression...
โครงสร้าง: verse builds to chorus, half-time bridge, dramatic drop...
อ้างอิงยุค: 80s, 90s, 2000s, modern...
Tempo: slow at 70 BPM, driving at 128 BPM...
```

---

## Personas (เพอร์โซนา — บุคลิกเพลง)

**Personas** ช่วยให้คุณบันทึก "DNA" ของเพลงที่ชอบเพื่อใช้ซ้ำ

### วิธีสร้าง Persona

1. เปิดเพลงที่ต้องการบันทึก Vibe
2. คลิก **"Save as Persona"** หรือ **"Create Persona"**
3. ตั้งชื่อ Persona เช่น "Dark Electronic", "Warm Indie Folk"
4. ใช้ Persona นั้นเมื่อต้องการสร้างเพลงในสไตล์เดิม

### การใช้ Persona

1. ในหน้า Create คลิก **"Personas"**
2. เลือก Persona ที่ต้องการ
3. สร้างเพลงใหม่โดยมี Persona นั้นเป็นพื้นฐาน

---

## Remaster (รีมาสเตอร์)

**Remaster** (ปรับปรุงคุณภาพ — นำเพลงเก่ามาทำใหม่ด้วยโมเดลที่ดีกว่า) ช่วยให้คุณ:

- อัปเกรดเพลงที่สร้างด้วย v3 หรือ v4 ให้ดีขึ้น
- สร้าง Variation เล็กน้อยของเพลงเดิม
- ปรับปรุงเสียงโดยไม่เปลี่ยนเนื้อหา

### วิธีใช้ Remaster

1. เปิดเพลงที่ต้องการ
2. คลิก **"Remaster"** ใน Creative Tools
3. เลือกระดับการเปลี่ยนแปลง (Subtle / Moderate / Major)
4. รอผลลัพธ์

> Remaster ไม่แทนที่เพลงต้นฉบับ แต่สร้างเวอร์ชันใหม่แยกออกมา

---

## Suno Sounds — สร้าง Audio Samples

**Suno Sounds** เป็นฟีเจอร์ทดลอง (Experimental) ที่ช่วยสร้าง **Custom Audio Samples** (ไฟล์เสียงตัวอย่างกำหนดเอง — เสียงสั้น ๆ สำหรับนำไปใช้ใน Production)

ตัวอย่างที่สร้างได้:
- เสียงเอฟเฟกต์ (Sound Effects) สำหรับวิดีโอหรือเกม
- Loop ดนตรีสั้น ๆ
- Ambient textures (เนื้อสัมผัสเสียงแวดล้อม)
- เสียงประกอบต่าง ๆ

### วิธีใช้ Suno Sounds

1. ไปที่ **Create > Sounds**
2. อธิบายเสียงที่ต้องการ เช่น `"mysterious forest at night with crickets and distant owl"`
3. คลิก Create
4. ดาวน์โหลดไฟล์ที่ได้

> **หมายเหตุ:** Suno Sounds ยังอยู่ในช่วงทดลอง อาจมีการเปลี่ยนแปลง
