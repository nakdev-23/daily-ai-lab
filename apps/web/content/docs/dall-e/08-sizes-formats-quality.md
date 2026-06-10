---
title: "ขนาด รูปแบบ และคุณภาพภาพ — Size, Format, Quality"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "คู่มือครบถ้วนเรื่องขนาดภาพที่รองรับ รูปแบบไฟล์ผลลัพธ์ และการตั้งค่าคุณภาพ standard vs hd สำหรับแต่ละโมเดล"
readTime: "6 นาที"
readers: "0"
locked: false
order: 8
---
# ขนาด รูปแบบ และคุณภาพภาพ — Size, Format, Quality

> อ้างอิงหลัก: [OpenAI Images API Reference](https://platform.openai.com/docs/api-reference/images)

---

## ภาพรวม

เมื่อใช้ DALL·E API คุณสามารถควบคุมผลลัพธ์ของภาพได้ผ่านตัวเลือกสำคัญ 3 อย่าง:

1. **Size** (ขนาดภาพ — ความกว้างxความสูงของภาพในหน่วย pixel)
2. **Response Format** (รูปแบบผลลัพธ์ — วิธีที่ API ส่งภาพกลับมา)
3. **Quality** (คุณภาพ — ระดับรายละเอียดและความคมชัด สำหรับ DALL·E 3 เท่านั้น)

---

## Size (ขนาดภาพ)

### DALL·E 3 — Sizes ที่รองรับ

| Size | Orientation | ใช้กับงานประเภทไหน |
|---|---|---|
| `1024x1024` | Square (สี่เหลี่ยมจัตุรัส) | โพสต์โซเชียล, โปรไฟล์, โลโก้, Thumbnail |
| `1792x1024` | Landscape (แนวนอน — กว้างกว่าสูง) | วอลเปเปอร์, แบนเนอร์เว็บ, ฉากกว้าง |
| `1024x1792` | Portrait (แนวตั้ง — สูงกว่ากว้าง) | Story บน Instagram, โปสเตอร์, เนื้อหามือถือ |

### DALL·E 2 — Sizes ที่รองรับ

| Size | จำนวน Pixel รวม | ใช้กับงานประเภทไหน |
|---|---|---|
| `256x256` | 65,536 px | ไอคอน, Thumbnail เล็ก, ทดสอบ Prompt |
| `512x512` | 262,144 px | ภาพขนาดกลาง, ทดสอบ, ประหยัดค่าใช้จ่าย |
| `1024x1024` | 1,048,576 px | ภาพคุณภาพสูง, งาน Final |

### เปรียบเทียบขนาดภาพ

```
DALL·E 3:                          DALL·E 2:
┌─────────┐  ┌──────────────────┐  ┌──┐ ┌────┐ ┌────────┐
│         │  │                  │  │  │ │    │ │        │
│1024x1024│  │   1792x1024      │  │  │ │    │ │        │
│         │  │                  │  └──┘ └────┘ │        │
└─────────┘  └──────────────────┘  256  512    │        │
                                               └────────┘
  1024                                           1024
  x1792
```

---

## Quality (คุณภาพ)

**Quality** (คุณภาพ — ระดับความพยายามในการสร้างรายละเอียดของภาพ) รองรับเฉพาะ **DALL·E 3** เท่านั้น

### `standard` — คุณภาพมาตรฐาน

- การสร้างภาพปกติ รวดเร็ว
- เหมาะกับการทดสอบ Prompt และงานที่ไม่ต้องการรายละเอียดสูงสุด
- ราคาถูกกว่า `hd`

### `hd` — คุณภาพสูง (High Definition)

- กระบวนการสร้างภาพที่ละเอียดมากขึ้น
- รายละเอียดและความสม่ำเสมอของภาพดีขึ้น
- เส้นขอบชัดเจนกว่า รายละเอียดเล็กๆ ชัดขึ้น
- ราคาแพงกว่า `standard` ประมาณ 2 เท่า
- เหมาะกับงาน Final หรืองานที่ต้องการคุณภาพสูงสุด

### เมื่อไหรที่ควรใช้ `hd`

ใช้ `hd` เมื่อ:
- ภาพจะถูกพิมพ์หรือแสดงขนาดใหญ่
- งานที่มีรายละเอียดสถาปัตยกรรม เครื่องประดับ หรือพื้นผิวซับซ้อน
- ภาพ Final ที่จะนำไปใช้จริงใน Production (การใช้งานจริง — ระบบที่ผู้ใช้จริงเห็น)
- Portrait ที่ต้องการรายละเอียดใบหน้าสูง

ใช้ `standard` เมื่อ:
- ทดสอบ Prompt หาแบบที่ต้องการก่อน
- สร้างภาพจำนวนมาก เช่น Batch Processing (การประมวลผลแบบกลุ่ม — สร้างหลายภาพพร้อมกัน)
- ภาพที่ใช้ชั่วคราว

```python
# ทดสอบด้วย standard ก่อน
test_response = client.images.generate(
    model="dall-e-3",
    prompt="A detailed architectural blueprint of a modern house",
    size="1024x1024",
    quality="standard",  # ทดสอบก่อน
)

# เมื่อพอใจกับ Prompt แล้ว สร้างใหม่ด้วย hd
final_response = client.images.generate(
    model="dall-e-3",
    prompt="A detailed architectural blueprint of a modern house",
    size="1024x1024",
    quality="hd",  # สำหรับงาน Final
)
```

---

## Style (สไตล์) — เฉพาะ DALL·E 3

**Style** (สไตล์ภาพ — เช่น vivid สีสันจัด, natural ดูเป็นธรรมชาติ) ควบคุมลักษณะโดยรวมของภาพ:

### `vivid` — สีสันสดใส (ค่าเริ่มต้น)

- สีสดใส คมชัด
- ดูดราม่า มีชีวิตชีวา
- เหมาะกับงาน Illustration (ภาพประกอบ), Fantasy Art, โฆษณา
- ภาพมักดู "เกินจริง" นิดหน่อย

### `natural` — สีธรรมชาติ

- สีสมจริง ไม่สด
- ดูเป็นภาพถ่ายจริงมากกว่า
- เหมาะกับ Photorealistic (ภาพสมจริงเหมือนภาพถ่าย), Documentary (สารคดี), ภาพบุคคล
- ภาพดูธรรมชาติและเรียบกว่า

```python
# vivid — เหมาะกับงาน Fantasy และ Illustration
vivid_response = client.images.generate(
    model="dall-e-3",
    prompt="A mystical forest with glowing mushrooms",
    size="1024x1024",
    style="vivid",
)

# natural — เหมาะกับภาพสมจริง
natural_response = client.images.generate(
    model="dall-e-3",
    prompt="A quiet morning at a Thai rice paddy",
    size="1024x1024",
    style="natural",
)
```

---

## Response Format (รูปแบบผลลัพธ์)

**Response Format** (รูปแบบของข้อมูลที่ API ส่งกลับ — เลือกว่าจะรับเป็น URL หรือข้อมูลภาพโดยตรง) ควบคุมวิธีที่ API ส่งภาพกลับมา:

### `url` — URL ชั่วคราว (ค่าเริ่มต้น)

```json
{
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/..."
    }
  ]
}
```

- ได้รับ HTTPS URL สำหรับดาวน์โหลดภาพ
- URL **หมดอายุหลัง 1 ชั่วโมง**
- เหมาะสำหรับแสดงภาพในเว็บหรือแอปทันที
- ต้องดาวน์โหลดไฟล์แยกต่างหากถ้าต้องการเก็บ

### `b64_json` — Base64 JSON

```json
{
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

- ได้รับข้อมูลภาพในรูปแบบ Base64 String (ข้อมูลภาพเข้ารหัสเป็นข้อความ — สามารถแปลงกลับเป็นไฟล์ได้)
- ไม่มีวันหมดอายุ
- เหมาะสำหรับบันทึกไฟล์ทันทีโดยไม่ผ่าน URL
- Response Size (ขนาดของข้อมูลที่ตอบกลับ) ใหญ่กว่า `url` มาก

```python
import base64

# รับเป็น base64 และบันทึกไฟล์ทันที
response = client.images.generate(
    model="dall-e-3",
    prompt="A beautiful Thai temple",
    size="1024x1024",
    response_format="b64_json",
)

# แปลง Base64 กลับเป็นไฟล์
image_data = base64.b64decode(response.data[0].b64_json)
with open("temple.png", "wb") as f:
    f.write(image_data)
print("บันทึกสำเร็จ!")
```

---

## ตารางสรุปตัวเลือกทั้งหมด

### DALL·E 3

| Parameter | ค่าที่รองรับ | ค่าเริ่มต้น |
|---|---|---|
| `size` | `1024x1024`, `1792x1024`, `1024x1792` | `1024x1024` |
| `quality` | `standard`, `hd` | `standard` |
| `style` | `vivid`, `natural` | `vivid` |
| `response_format` | `url`, `b64_json` | `url` |
| `n` | `1` เท่านั้น | `1` |

### DALL·E 2

| Parameter | ค่าที่รองรับ | ค่าเริ่มต้น |
|---|---|---|
| `size` | `256x256`, `512x512`, `1024x1024` | `1024x1024` |
| `quality` | ไม่รองรับ | — |
| `style` | ไม่รองรับ | — |
| `response_format` | `url`, `b64_json` | `url` |
| `n` | `1`-`10` | `1` |

---

## คำแนะนำในการเลือก Size

### สำหรับโซเชียลมีเดีย

| Platform | Size ที่แนะนำ |
|---|---|
| Instagram Post | `1024x1024` (square) |
| Instagram Story | `1024x1792` (portrait) |
| Facebook Cover | `1792x1024` (landscape) |
| Twitter Header | `1792x1024` (landscape) |
| LinkedIn Post | `1024x1024` (square) |

### สำหรับเว็บไซต์

| การใช้งาน | Size ที่แนะนำ |
|---|---|
| Hero Banner (แบนเนอร์หลักบนเว็บ) | `1792x1024` (landscape) |
| Blog Thumbnail | `1024x1024` (square) |
| Mobile Content | `1024x1792` (portrait) |
| Icon / Logo | `1024x1024` → ย่อขนาดภายหลัง |

---

## สรุป

การเลือก Size, Quality, Style และ Response Format ที่เหมาะสมจะช่วยให้ได้ภาพที่ตรงความต้องการและคุ้มค่าเงิน สูตรง่ายๆ คือ: ทดสอบ Prompt ด้วย `standard` + `1024x1024` ก่อน เมื่อพอใจแล้วสร้างงาน Final ด้วย `hd` + ขนาดที่เหมาะกับการใช้งาน
