---
title: "Vision และ Multimodal — การวิเคราะห์รูปภาพด้วย Claude"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "เรียนรู้วิธีส่งรูปภาพให้ Claude วิเคราะห์ ทั้งผ่าน URL, base64 และ Files API รวมถึง use cases และข้อจำกัดที่ควรรู้"
readTime: "8 นาที"
readers: "0"
locked: false
order: 10
---

## Vision คืออะไร?

Claude มีความสามารถด้าน vision (การมองเห็น) หรือ multimodal (หลายรูปแบบ — รับข้อมูลได้ทั้งข้อความและรูปภาพพร้อมกัน) ซึ่งหมายความว่าโมเดล (สมองของ AI) สามารถ **รับรูปภาพเป็น input** (ข้อมูลที่ส่งเข้าไป) และวิเคราะห์เนื้อหาภาพเหล่านั้นร่วมกับข้อความได้ โดยโมเดล Claude ทุกรุ่นในปัจจุบัน (Claude 4.x และใหม่กว่า) รองรับ vision

---

## วิธีใช้งาน Vision

### 1. ผ่าน Claude.ai (สำหรับผู้ใช้ทั่วไป)

- คลิกปุ่มแนบไฟล์ หรือลากรูปภาพลงในช่องแชทโดยตรง
- รองรับสูงสุด **20 รูปต่อ message** (ข้อความหนึ่งครั้ง)

### 2. ผ่าน API Console

ใน API (ช่องทางเชื่อมต่อระหว่างโปรแกรม) Console Workbench จะมีปุ่มสำหรับเพิ่มรูปภาพที่ส่วน User message

### 3. ผ่าน API โดยตรง

มี 3 วิธีในการส่งรูปภาพผ่าน API:

#### วิธีที่ 1: URL (สำหรับรูปที่อยู่บนอินเทอร์เน็ต)

```json
{
  "type": "image",
  "source": {
    "type": "url",
    "url": "https://example.com/image.jpg"
  }
}
```

#### วิธีที่ 2: Base64 (การแปลงไฟล์เป็นข้อความตัวเลข — เพื่อส่งผ่าน API ได้โดยตรง สำหรับรูปที่มีอยู่ในเครื่อง)

```python
import anthropic
import base64

with open("image.jpg", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data,
                    },
                },
                {
                    "type": "text",
                    "text": "อธิบายสิ่งที่เห็นในรูปนี้"
                }
            ],
        }
    ],
)
```

#### วิธีที่ 3: Files API (แนะนำสำหรับรูปที่ใช้บ่อย)

Files API (ระบบจัดการไฟล์ผ่าน API — อัปโหลดครั้งเดียวแล้วอ้างอิงซ้ำได้):

```python
# อัปโหลดครั้งเดียว ใช้ซ้ำได้หลายครั้ง
uploaded = client.beta.files.upload(
    file=("image.jpg", open("image.jpg", "rb"), "image/jpeg"),
)

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": uploaded.id,
                    },
                },
                {"type": "text", "text": "วิเคราะห์รูปนี้"}
            ],
        }
    ],
)
```

---

## ข้อจำกัดและ Limits

### จำนวนรูปภาพสูงสุด

| Platform | ขีดจำกัด |
|----------|---------|
| Claude.ai | 20 รูปต่อ message |
| API (โมเดลที่มี 200k context) | 100 รูปต่อ request |
| API (โมเดลที่มี 1M+ context) | 600 รูปต่อ request |

### ขนาดรูปภาพ

| เงื่อนไข | ขนาดสูงสุด |
|---------|-----------|
| ขนาดไฟล์ (Claude API) | 10 MB ต่อรูป |
| ขนาดไฟล์ (Amazon Bedrock, Vertex AI) | 5 MB ต่อรูป |
| ขนาดไฟล์ (Claude.ai) | 10 MB ต่อรูป |
| Resolution (ความละเอียดภาพ) | 8,000 x 8,000 pixels |
| Resolution (เมื่อส่งมากกว่า 20 รูป) | 2,000 x 2,000 pixels |

### Format ที่รองรับ
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

---

## Use Cases ที่ Vision ทำได้

### การวิเคราะห์เอกสาร
- อ่านและแยกข้อมูลจาก scanned documents (เอกสารที่สแกนเป็นรูปภาพ)
- วิเคราะห์ตาราง กราฟ และ infographic (ภาพข้อมูลสรุป)
- OCR (การแปลงตัวอักษรในภาพให้เป็นข้อความดิจิทัล) และแปลงรูปภาพเป็นข้อความ

### การวิเคราะห์รูปภาพทั่วไป
- อธิบายเนื้อหาในภาพ
- ระบุวัตถุ สถานที่ หรือบุคคลในภาพ
- วิเคราะห์อารมณ์และบรรยากาศในภาพ

### งานออกแบบและ UI
- วิเคราะห์ screenshot (ภาพจับหน้าจอ) ของ UI/UX (หน้าตาและประสบการณ์ใช้งาน)
- ตรวจสอบ design mockups (แบบร่างการออกแบบ)
- เปรียบเทียบภาพก่อน-หลัง

### วิทยาศาสตร์และการแพทย์
- วิเคราะห์แผนภาพทางวิทยาศาสตร์
- ตีความกราฟและ data visualization (การแสดงข้อมูลในรูปกราฟหรือแผนภาพ)
- ช่วยวิเคราะห์ภาพทางการแพทย์ (ไม่ใช่การวินิจฉัย)

### Computer Use
Claude สามารถมองเห็น screenshot ของหน้าจอและควบคุมคอมพิวเตอร์ได้ผ่าน Computer Use tool (เครื่องมือที่ให้ AI ควบคุมการทำงานบนหน้าจอได้)

---

## การส่งหลายรูปพร้อมกัน

Claude วิเคราะห์รูปหลายรูปได้พร้อมกัน เหมาะสำหรับงาน:
- เปรียบเทียบรูปภาพ
- วิเคราะห์ sequence (ลำดับ) ของภาพ เช่น step-by-step
- วิเคราะห์วิดีโอโดยแปลงเป็น frames (เฟรม — ภาพนิ่งแต่ละช่วงเวลาในวิดีโอ)

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "url", "url": "https://example.com/before.jpg"}},
                {"type": "image", "source": {"type": "url", "url": "https://example.com/after.jpg"}},
                {"type": "text", "text": "เปรียบเทียบความแตกต่างระหว่างสองรูปนี้"}
            ],
        }
    ],
)
```

---

## การนับ Token ของรูปภาพ

รูปภาพถูกคิดเป็น token (ชิ้นส่วนข้อมูล) เช่นกัน ขึ้นอยู่กับขนาด:

- รูปภาพทั่วไป (1,092 x 1,092 px) ≈ 1,334 tokens
- รูปขนาดเล็กกว่า 200 x 200 px ≈ 55 tokens (minimum)
- รูปขนาดใหญ่จะถูกย่อก่อนประมวลผล

### Tips ลด Token จากรูปภาพ
- ย่อขนาดรูปก่อนส่ง ถ้าไม่ต้องการความละเอียดสูง
- ใช้ Files API เพื่อ cache (จำรูปไว้ใช้ซ้ำ) รูปที่ใช้บ่อย
- ตัดเฉพาะส่วนที่สำคัญของรูปแทนการส่งรูปทั้งหมด

---

## Best Practices

### เพิ่มประสิทธิภาพการวิเคราะห์

1. **บอกให้ชัดว่าต้องการอะไร** — ระบุว่าต้องการให้ Claude ดูส่วนใดของภาพ
2. **ใส่ context (บริบท)** — บอกว่ารูปนี้มาจากไหน คืออะไร เพื่อให้การวิเคราะห์แม่นยำขึ้น
3. **ใช้ crop tool** — สำหรับรูปที่มีรายละเอียดมาก การ zoom เข้าไปในส่วนที่สำคัญช่วยให้วิเคราะห์ได้ดีขึ้น
4. **ระบุภาษาของข้อความในภาพ** — ถ้ารูปมีข้อความภาษาอื่น ควรบอก Claude ล่วงหน้า

### ข้อจำกัดที่ควรรู้

- Claude ไม่สามารถระบุตัวตนของบุคคลจากใบหน้าได้ (เพื่อความเป็นส่วนตัว)
- ความแม่นยำในการอ่าน handwriting (ลายมือ) อาจไม่สมบูรณ์
- รูปที่มีคุณภาพต่ำหรือมืดมากอาจวิเคราะห์ได้ยาก
- ไม่รองรับไฟล์วิดีโอโดยตรง ต้องแปลงเป็น frames ก่อน

---

## การใช้ Vision กับ PDF

Claude รองรับ PDF (รูปแบบไฟล์เอกสาร — มักมีทั้งข้อความและรูปภาพอยู่ด้วยกัน) ที่มีทั้งข้อความและรูปภาพ:

```python
# ส่ง PDF โดยตรงผ่าน base64
with open("document.pdf", "rb") as f:
    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data,
                    },
                },
                {"type": "text", "text": "สรุปเนื้อหาของเอกสารนี้"}
            ],
        }
    ],
)
```

---

## สรุป

Vision capabilities ของ Claude เปิดโอกาสให้สร้างแอปพลิเคชันที่ทำงานกับข้อมูลภาพได้หลากหลาย ตั้งแต่การวิเคราะห์เอกสาร ไปจนถึงการควบคุมคอมพิวเตอร์อัตโนมัติ จุดสำคัญคือการเลือก method (วิธีการ) ในการส่งรูป (URL / base64 / Files API) ให้เหมาะกับ use case (กรณีการใช้งาน) และการ optimize token (ปรับจำนวน token ให้เหมาะสม) เพื่อควบคุมต้นทุน
