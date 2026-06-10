---
title: "Gen-4 / Gen-4.5 — สร้างวิดีโอจากข้อความ"
tool: "Runway"
icon: "tool-runway"
level: "beginner"
summary: "เรียนรู้การใช้ Gen-4 และ Gen-4.5 โมเดล AI รุ่นล่าสุดของ Runway สำหรับสร้างวิดีโอจากข้อความ (Text-to-Video) พร้อมเทคนิคเขียน Prompt ภาษาอังกฤษให้ได้ผลลัพธ์ดีที่สุด"
readTime: "7 นาที"
readers: "0"
locked: false
order: 2
---

# Gen-4 / Gen-4.5 — สร้างวิดีโอจากข้อความ (Text-to-Video)

> **Gen-4.5** คือโมเดล AI สร้างวิดีโอรุ่นล่าสุดของ Runway ที่ได้รับการยกย่องว่าเป็น "วิดีโอโมเดลที่ดีที่สุดในโลก" ณ ปัจจุบัน

---

## Gen-4.5 คืออะไร?

**Gen-4.5** (Generation 4.5 — โมเดลสร้างวิดีโอรุ่นที่ 4.5 ของ Runway) คือโมเดล AI ที่สามารถสร้างวิดีโอความละเอียดสูงจากข้อความเพียงอย่างเดียว หรือจากรูปภาพ + ข้อความประกอบ

### ความสามารถหลักของ Gen-4.5:
- สร้างวิดีโอจากคำอธิบายข้อความล้วน (Text-to-Video)
- แปลงรูปภาพให้เป็นวิดีโอ (Image-to-Video)
- รองรับวิดีโอความยาว 5-10 วินาที
- ความละเอียดสูงสุด 1280x720 (Landscape) หรือ 720x1280 (Portrait)

### โมเดลในตระกูล Gen-4:
| โมเดล | ความเร็ว | คุณภาพ | Credits/วินาที |
|---|---|---|---|
| **Gen-4.5** | ปานกลาง | สูงสุด | 12 credits |
| **Gen-4 Turbo** | เร็ว | ดี | 5 credits |

---

## วิธีใช้ Text-to-Video

### ขั้นตอนที่ 1: เลือกเครื่องมือ

1. ล็อกอินเข้า Runway
2. ในหน้า Home คลิก **"Video"** หรือ **"Text/Image to Video"**
3. เลือกโมเดล **Gen-4.5** จากเมนูด้านบน

### ขั้นตอนที่ 2: เขียน Prompt

**Prompt** (พรอมต์ — คำอธิบายหรือคำสั่งให้ AI) คือหัวใจสำคัญของการสร้างวิดีโอ

**โครงสร้าง Prompt ที่ดี:**
```
[Subject] + [Action] + [Setting] + [Style/Mood] + [Camera movement]
```

**ตัวอย่าง Prompt ดีๆ:**

```
A golden retriever puppy running through a field of sunflowers, 
warm afternoon light, cinematic, slow motion, tracking shot
```
(ลูกสุนัขโกลเด้นรีทรีฟเวอร์วิ่งผ่านทุ่งทานตะวัน แสงยามบ่าย โทนภาพยนตร์ สโลว์โมชั่น กล้องติดตาม)

```
A futuristic city at night with neon lights reflecting on wet streets, 
cyberpunk aesthetic, aerial drone shot, rain
```
(เมืองอนาคตในค่ำคืนที่มีไฟนีออนสะท้อนบนถนนเปียก สไตล์ไซเบอร์พังก์ มุมกล้องโดรนจากด้านบน ฝนตก)

### ขั้นตอนที่ 3: ปรับการตั้งค่า

**Duration** (ระยะเวลา — ความยาวของวิดีโอ):
- **5 seconds** (5 วินาที) — ใช้ Credits น้อยกว่า เหมาะสำหรับทดลอง
- **10 seconds** (10 วินาที) — ได้วิดีโอยาวขึ้น ใช้ Credits มากกว่า

**Aspect Ratio** (อัตราส่วนภาพ — สัดส่วนความกว้างต่อความสูง):
- **16:9** (1280x720) — มาตรฐาน Landscape เหมาะสำหรับ YouTube, TV
- **9:16** (720x1280) — Portrait เหมาะสำหรับ TikTok, Instagram Reels

### ขั้นตอนที่ 4: Generate

1. คลิกปุ่ม **"Generate"** (สร้าง)
2. รอ AI ประมวลผล (ประมาณ 30-90 วินาที)
3. ดูผลลัพธ์ที่ได้

---

## เทคนิคการเขียน Prompt ให้ได้ผลดี

### คำศัพท์ที่ช่วยให้วิดีโอสวย

**การเคลื่อนไหวกล้อง (Camera Movement):**
| คำศัพท์ | ความหมาย |
|---|---|
| `dolly in` | กล้องเคลื่อนเข้าหาวัตถุ |
| `pan left/right` | กล้องหมุนซ้าย/ขวา |
| `tracking shot` | กล้องติดตามวัตถุที่เคลื่อนไหว |
| `aerial shot` | มุมกล้องจากสูง |
| `close-up` | ภาพระยะใกล้ |
| `wide shot` | ภาพมุมกว้าง |

**สไตล์ภาพ (Visual Style):**
| คำศัพท์ | ความหมาย |
|---|---|
| `cinematic` | สไตล์ภาพยนตร์ |
| `photorealistic` | สมจริงเหมือนถ่ายรูปจริง |
| `anime style` | สไตล์การ์ตูนญี่ปุ่น |
| `oil painting` | สไตล์ภาพวาดสีน้ำมัน |
| `8K ultra HD` | ความละเอียดสูงมาก |

**แสงและบรรยากาศ (Lighting & Atmosphere):**
| คำศัพท์ | ความหมาย |
|---|---|
| `golden hour` | แสงช่วงพระอาทิตย์ตก |
| `soft lighting` | แสงนุ่มนวล |
| `dramatic lighting` | แสงดราม่า |
| `foggy` | มีหมอก |
| `volumetric light` | แสงที่มีปริมาตร ดูลึก |

---

## ตัวอย่าง Prompt และผลลัพธ์

### ตัวอย่างที่ 1: ธรรมชาติ
**Prompt ที่ดี:**
```
Majestic waterfall in a lush tropical forest, 
mist rising, golden hour lighting, 
slow motion water flow, cinematic wide shot
```

**Prompt ที่ควรหลีกเลี่ยง:**
```
น้ำตกสวย
```
(สั้นเกินไป ขาดรายละเอียด)

### ตัวอย่างที่ 2: บุคคล
**Prompt ที่ดี:**
```
A young woman with long dark hair walking through 
a cherry blossom park in Tokyo, spring afternoon, 
soft pink petals falling, medium shot, film grain
```

---

## Negative Prompt — บอก AI ว่าไม่ต้องการอะไร

**Negative Prompt** (พรอมต์เชิงลบ — คำอธิบายสิ่งที่ไม่ต้องการในวิดีโอ) ช่วยป้องกันไม่ให้ AI สร้างสิ่งที่ไม่ต้องการ

ตัวอย่าง Negative Prompt:
```
blurry, distorted, low quality, watermark, text overlay, 
unrealistic proportions, extra limbs
```
(ไม่ชัด, บิดเบี้ยว, คุณภาพต่ำ, ลายน้ำ, ข้อความซ้อน, สัดส่วนไม่ถูกต้อง, แขนขาเกิน)

---

## Gen-4 Turbo — ตัวเลือกประหยัด Credits

ถ้าต้องการทดลองและไม่อยากเสีย Credits มาก ใช้ **Gen-4 Turbo** (เทอร์โบ — รุ่นเร็ว ประหยัดทรัพยากร) แทน

- เร็วกว่า Gen-4.5 ประมาณ 2 เท่า
- ใช้ Credits เพียง 5 credits/วินาที (เทียบกับ 12 credits/วินาที ของ Gen-4.5)
- คุณภาพยังดีมาก เหมาะสำหรับงาน draft หรือทดลอง concept

---

## ข้อจำกัดและสิ่งที่ควรรู้

- **Runway ไม่สามารถสร้าง** ภาพที่มีความรุนแรง เนื้อหาผู้ใหญ่ หรือเนื้อหาที่ละเมิดลิขสิทธิ์
- **ใบหน้าคนจริง** อาจถูกกรองหากไม่ผ่านนโยบาย Content Moderation (การตรวจสอบเนื้อหา)
- **ข้อความในวิดีโอ** ยังอ่านยากหรือผิดเพี้ยนได้ (AI ยังสร้างตัวอักษรได้ไม่สมบูรณ์แบบ)
- Credits ที่ใช้ไปจะไม่คืนแม้ผลลัพธ์ไม่ถูกใจ

---

## สรุป

Gen-4.5 คือโมเดลสร้างวิดีโอที่ทรงพลังที่สุดของ Runway ปัจจุบัน กุญแจสำคัญคือการเขียน Prompt ที่ละเอียดและมีรายละเอียดเพียงพอ ยิ่ง Prompt ดี ผลลัพธ์ยิ่งสวย ลองฝึกเขียน Prompt หลายๆ แบบและเปรียบเทียบผลลัพธ์เพื่อหาสูตรที่เหมาะกับงานของคุณ
