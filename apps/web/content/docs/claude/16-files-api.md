---
title: "Files API — อัปโหลดไฟล์ครั้งเดียว ใช้ซ้ำได้หลายครั้ง"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Files API ช่วยให้อัปโหลดไฟล์ครั้งเดียวและอ้างอิงด้วย file_id ในทุก API call ลด payload size ประหยัดเวลาและลดต้นทุนสำหรับเอกสารที่ใช้บ่อย"
readTime: "8 นาที"
readers: "0"
locked: false
order: 16
---

## Files API คืออะไร?

Files API (ระบบจัดการไฟล์ผ่าน API — ช่องทางเชื่อมต่อระหว่างโปรแกรม) เป็น feature (ฟีเจอร์) ที่ช่วยให้คุณ **อัปโหลดไฟล์ไปเก็บไว้ที่ Anthropic** แล้วอ้างอิงในทุก Messages API call ด้วย `file_id` (รหัสไฟล์ที่ใช้แทนการส่งไฟล์จริง) แทนที่จะส่งไฟล์ทั้งหมดทุกครั้ง

### ปัญหาที่ Files API แก้ไข

ก่อนมี Files API:
- ต้องแปลงเอกสารเป็น base64 (การเข้ารหัสไฟล์เป็นข้อความตัวอักษร เพื่อส่งผ่าน API ได้) ทุกครั้งที่เรียก API
- Request size (ขนาดของข้อมูลที่ส่ง) ใหญ่มาก ช้าและสิ้นเปลือง bandwidth (ปริมาณข้อมูลที่ส่งผ่านเครือข่าย)
- ถ้าใช้เอกสารเดียวกัน 100 ครั้ง ต้องส่ง 100 ครั้ง

หลังมี Files API:
- อัปโหลดครั้งเดียว ได้ `file_id`
- ใช้ `file_id` ใน request แทนการส่งไฟล์จริง
- เร็วกว่า ประหยัด bandwidth มาก

> **หมายเหตุ:** Files API ยังอยู่ใน beta (เวอร์ชันทดสอบ) ต้องใส่ header (ส่วนหัวคำขอ) `anthropic-beta: files-api-2025-04-14`

---

## ไฟล์ประเภทที่รองรับ

| ประเภทไฟล์ | MIME Type | Content Block | ใช้สำหรับ |
|-----------|----------|---------------|---------|
| **PDF** | `application/pdf` | `document` | วิเคราะห์เอกสาร |
| **Plain Text** | `text/plain` | `document` | วิเคราะห์ข้อความ |
| **JPEG** | `image/jpeg` | `image` | วิเคราะห์รูปภาพ |
| **PNG** | `image/png` | `image` | วิเคราะห์รูปภาพ |
| **GIF** | `image/gif` | `image` | วิเคราะห์รูปภาพ |
| **WebP** | `image/webp` | `image` | วิเคราะห์รูปภาพ |
| **CSV, Excel, อื่นๆ** | varies | `container_upload` | Code execution tool (เครื่องมือรันโค้ด) |

---

## การอัปโหลดไฟล์

### Python

```python
import anthropic

client = anthropic.Anthropic()

# อัปโหลด PDF (รูปแบบไฟล์เอกสาร)
with open("annual_report.pdf", "rb") as f:
    uploaded = client.beta.files.upload(
        file=("annual_report.pdf", f, "application/pdf"),
    )

print(f"File ID: {uploaded.id}")
print(f"Filename: {uploaded.filename}")
print(f"Size: {uploaded.size_bytes} bytes")
```

### cURL

```bash
FILE_ID=$(curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@annual_report.pdf" \
  | jq -r '.id')

echo "File ID: $FILE_ID"
```

### Response ที่ได้รับ

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "annual_report.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-06-10T00:00:00Z",
  "downloadable": false
}
```

---

## การใช้ File ใน Messages

### ใช้กับ PDF Document

```python
response = client.beta.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "สรุปประเด็นหลักในรายงานประจำปีนี้"
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    },
                    "title": "รายงานประจำปี 2025",  # ไม่บังคับ
                    "citations": {"enabled": True}   # เปิด citations (การอ้างอิงแหล่งที่มา) ไม่บังคับ
                }
            ],
        }
    ],
    betas=["files-api-2025-04-14"],
)
```

### ใช้กับ Image

```python
response = client.beta.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "อธิบายสิ่งที่เห็นในรูปนี้"
                },
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": "file_imageXXXXXX"
                    }
                }
            ],
        }
    ],
    betas=["files-api-2025-04-14"],
)
```

---

## ตัวอย่างการใช้งานจริง: Document Q&A System

```python
import anthropic

client = anthropic.Anthropic()

class DocumentQASystem:
    def __init__(self):
        self.documents = {}  # {name: file_id}
    
    def upload_document(self, name: str, file_path: str) -> str:
        """อัปโหลดเอกสารและเก็บ file_id"""
        with open(file_path, "rb") as f:
            filename = file_path.split("/")[-1]
            mime_type = "application/pdf" if file_path.endswith(".pdf") else "text/plain"
            uploaded = client.beta.files.upload(
                file=(filename, f, mime_type),
            )
        self.documents[name] = uploaded.id
        print(f"Uploaded '{name}': {uploaded.id}")
        return uploaded.id
    
    def ask(self, doc_name: str, question: str) -> str:
        """ถามคำถามเกี่ยวกับเอกสาร"""
        if doc_name not in self.documents:
            return f"ไม่พบเอกสาร '{doc_name}'"
        
        file_id = self.documents[doc_name]
        
        response = client.beta.messages.create(
            model="claude-opus-4-8",
            max_tokens=2048,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": question},
                        {
                            "type": "document",
                            "source": {"type": "file", "file_id": file_id}
                        }
                    ],
                }
            ],
            betas=["files-api-2025-04-14"],
        )
        return response.content[0].text

# การใช้งาน
qa = DocumentQASystem()
qa.upload_document("policy", "company_policy.pdf")
qa.upload_document("report", "annual_report.pdf")

# ถามคำถามโดยไม่ต้อง re-upload (อัปโหลดซ้ำ)
print(qa.ask("policy", "นโยบายลาพักร้อนคืออะไร?"))
print(qa.ask("report", "รายได้รวมปี 2025 เท่าไหร่?"))
print(qa.ask("policy", "กฎการแต่งกายมีอะไรบ้าง?"))  # ใช้ไฟล์เดิมซ้ำ
```

---

## การจัดการไฟล์

### List ไฟล์ทั้งหมด

```python
files = client.beta.files.list()
for file in files.data:
    print(f"{file.id}: {file.filename} ({file.size_bytes} bytes)")
```

### ดู Metadata ของไฟล์

Metadata (ข้อมูลที่อธิบายไฟล์ เช่น ชื่อ ขนาด วันที่สร้าง):

```python
file_info = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
print(f"Filename: {file_info.filename}")
print(f"Created: {file_info.created_at}")
print(f"Size: {file_info.size_bytes}")
```

### ลบไฟล์

```python
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
print("ลบไฟล์สำเร็จ")
```

---

## การดาวน์โหลดไฟล์

สามารถดาวน์โหลดได้เฉพาะไฟล์ที่ **สร้างโดย skills หรือ code execution tool** เท่านั้น (ไม่ใช่ไฟล์ที่อัปโหลดเอง):

```python
# ดาวน์โหลดไฟล์ที่ code execution tool สร้างขึ้น
file_content = client.beta.files.download("file_output_XXXXX")
with open("output_chart.png", "wb") as f:
    f.write(file_content.read())
```

---

## Storage Limits

| ข้อจำกัด | ค่า |
|---------|-----|
| ขนาดไฟล์สูงสุดต่อไฟล์ | 500 MB |
| ขนาด storage (พื้นที่จัดเก็บ) รวมต่อ organization | 500 GB |
| Rate limit (ขีดจำกัดอัตราการเรียก) API calls | ~100 requests/minute |
| ระยะเวลาเก็บข้อมูล | จนกว่าจะลบ |

---

## ค่าใช้จ่าย

| Operation | ราคา |
|-----------|------|
| Upload ไฟล์ | ฟรี |
| Download ไฟล์ | ฟรี |
| List / Get metadata | ฟรี |
| Delete ไฟล์ | ฟรี |
| **ใช้ไฟล์ใน Messages** | คิด token ปกติ |

ค่าใช้จ่ายหลักคือ token (ชิ้นส่วนข้อมูล) ที่เกิดจากเนื้อหาในไฟล์เมื่อส่งไปใน Messages API

---

## Error Handling

```python
import anthropic

client = anthropic.Anthropic()

try:
    response = client.beta.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "วิเคราะห์เอกสารนี้"},
                    {
                        "type": "document",
                        "source": {"type": "file", "file_id": "file_XXXXX"}
                    }
                ],
            }
        ],
        betas=["files-api-2025-04-14"],
    )
    
except anthropic.NotFoundError:
    print("ไม่พบไฟล์ อาจถูกลบหรือ file_id ไม่ถูกต้อง")
    
except anthropic.BadRequestError as e:
    if "invalid file type" in str(e):
        print("ประเภทไฟล์ไม่ตรงกับ content block")
    elif "exceeds context window" in str(e):
        print("ไฟล์ใหญ่เกิน context window (ขนาดหน่วยความจำชั่วคราว)")
    else:
        print(f"Request error: {e}")
```

### Error Codes ที่พบบ่อย

| Error | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| 404 Not Found | ไม่พบ file_id | ตรวจสอบว่า upload สำเร็จ |
| 400 Invalid file type | ประเภทไฟล์ไม่ตรงกับ content block | ใช้ image block กับรูปภาพ, document block กับ PDF |
| 400 Exceeds context window | ไฟล์ใหญ่เกินไป | ตัดไฟล์ให้เล็กลง หรือใช้โมเดลที่มี context window ใหญ่กว่า |
| 413 File too large | ไฟล์เกิน 500 MB | ลดขนาดไฟล์ |
| 403 Storage limit exceeded | Organization เต็ม 500 GB | ลบไฟล์ที่ไม่ใช้ |

---

## Files API vs Base64 Inline

| เกณฑ์ | Files API | Base64 Inline |
|-------|----------|---------------|
| **ใช้ครั้งเดียว** | ไม่แนะนำ (overhead — ต้นทุนเพิ่มเติม) | เหมาะกว่า |
| **ใช้ซ้ำหลายครั้ง** | แนะนำอย่างยิ่ง | ต้องส่งซ้ำทุกครั้ง |
| **Request size (ขนาดข้อมูลที่ส่ง)** | เล็กมาก (แค่ file_id) | ใหญ่มาก |
| **ความเร็ว upload** | อัปโหลดครั้งเดียว | ทุก request |
| **ค่าใช้จ่าย** | token เท่ากัน | token เท่ากัน |

---

## Best Practices

1. **เก็บ file_id ไว้ใน database (ฐานข้อมูล)** — อย่าอัปโหลดไฟล์เดิมซ้ำ
2. **ลบไฟล์ที่ไม่ใช้** — เพื่อไม่ให้เกิน storage limit
3. **ตรวจสอบ file_id** ก่อนใช้งาน ด้วย `retrieve_metadata`
4. **จัดกลุ่มไฟล์** ด้วย naming convention (รูปแบบการตั้งชื่อ) ใน custom_id หรือ metadata
5. **Handle errors ทุกกรณี** โดยเฉพาะ 404 เพราะไฟล์อาจถูกลบโดยคนอื่น

---

## สรุป

Files API เหมาะสำหรับ:

- **Knowledge base (ฐานความรู้)** — เอกสารนโยบาย, คู่มือที่ใช้บ่อย
- **Document processing (การประมวลผลเอกสาร)** — วิเคราะห์รายงาน, สัญญา
- **Multimodal apps (แอปพลิเคชันที่รับข้อมูลหลายรูปแบบ)** — ระบบที่ใช้รูปภาพซ้ำๆ
- **Code execution (การรันโค้ด)** — ส่ง dataset (ชุดข้อมูล) ไปรัน analysis

อัปโหลดครั้งเดียว ใช้ได้ตลอด ประหยัดทั้งเวลาและ bandwidth
