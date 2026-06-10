---
title: "Runway API — เริ่มต้นสำหรับนักพัฒนา"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "คู่มือเริ่มต้นใช้งาน Runway API สำหรับนักพัฒนา ตั้งแต่การสร้างบัญชี สร้าง API Key ซื้อ Credits ไปจนถึงการเรียก API ครั้งแรกด้วย Node.js และ Python"
readTime: "10 นาที"
readers: "0"
locked: false
order: 14
---

# Runway API — เริ่มต้นสำหรับนักพัฒนา

> **Runway API** ให้นักพัฒนาสามารถนำความสามารถสร้างวิดีโอและรูปภาพ AI ของ Runway ไปใช้ในแอปพลิเคชันของตัวเองผ่าน HTTP Requests

---

## Runway API คืออะไร?

**Runway API** (Application Programming Interface — ส่วนต่อประสานโปรแกรม) ช่วยให้นักพัฒนา:
- เรียกใช้โมเดล AI ของ Runway จากโค้ดของตัวเอง
- สร้างวิดีโอ รูปภาพ และเสียงอัตโนมัติ
- รวม AI Generation เข้ากับ Web App, Mobile App, หรือ Automation Workflow

---

## ขั้นตอนที่ 1: สร้างบัญชีนักพัฒนา

1. ไปที่ [dev.runwayml.com](https://dev.runwayml.com)
2. สมัครบัญชีหรือล็อกอินด้วย Runway Account เดิม
3. สร้าง **Organization** (องค์กร — บัญชีหลักสำหรับ API)

> **Organization** คือภาชนะที่เก็บ API Keys และ Credits ขององค์กรหรือโปรเจกต์

---

## ขั้นตอนที่ 2: สร้าง API Key

**API Key** (กุญแจ API — รหัสลับสำหรับยืนยันตัวตนกับ API) ใช้ยืนยันว่าคุณคือใครเมื่อเรียก API

1. ในหน้า Developer Portal คลิก **"API Keys"**
2. คลิก **"Create new key"**
3. ตั้งชื่อ Key (เช่น "production", "development")
4. **คัดลอก Key ทันที** — Key จะแสดงเพียงครั้งเดียว!

### ความปลอดภัยของ API Key

**ข้อห้ามเด็ดขาด:**
- ห้าม Commit API Key ลงใน Git Repository
- ห้าม Hardcode ใน Source Code
- ห้าม แชร์ใน Slack, Discord, หรือสถานที่สาธารณะ

**วิธีที่ถูกต้อง:**
- ใช้ **Environment Variables** (ตัวแปรสภาพแวดล้อม) เก็บ Key
- ใช้ Secret Manager เช่น AWS Secrets Manager, HashiCorp Vault
- สร้าง Key แยกสำหรับแต่ละ Environment (Dev/Staging/Production)

```bash
# ตั้งค่า Environment Variable
export RUNWAYML_API_SECRET="your_api_key_here"
```

```powershell
# Windows PowerShell
$env:RUNWAYML_API_SECRET = "your_api_key_here"
```

---

## ขั้นตอนที่ 3: เพิ่ม Credits

ก่อนเรียก API ได้ต้องมี Credits ในบัญชี:
1. ไปที่ **Billing** ใน Developer Portal
2. เพิ่ม Payment Method (Visa, Mastercard ผ่าน Stripe)
3. ซื้อ Credits ขั้นต่ำ $10 (1,000 credits)

---

## ขั้นตอนที่ 4: ติดตั้ง SDK

**SDK** (Software Development Kit — ชุดเครื่องมือสำหรับนักพัฒนา) ช่วยให้เรียก API ง่ายขึ้น

### Node.js / TypeScript
```bash
npm install --save @runwayml/sdk
# หรือ
yarn add @runwayml/sdk
# หรือ
pnpm add @runwayml/sdk
```

**ต้องการ:** Node.js 18 หรือสูงกว่า

### Python
```bash
pip install runwayml
```

**ต้องการ:** Python 3.8 หรือสูงกว่า

---

## ขั้นตอนที่ 5: เรียก API ครั้งแรก

### Image-to-Video ด้วย Node.js

```javascript
import RunwayML from '@runwayml/sdk';

const client = new RunwayML();
// SDK จะอ่าน RUNWAYML_API_SECRET จาก Environment Variable อัตโนมัติ

// สร้างวิดีโอจากรูปภาพ
const imageToVideo = await client.imageToVideo.create({
  model: 'gen4_turbo',
  promptImage: 'https://example.com/your-image.jpg',
  promptText: 'Camera slowly pans right, golden sunset',
  duration: 5,
  ratio: '1280:720',
});

// รอให้งานเสร็จ
const task = await client.tasks.waitForTaskOutput(imageToVideo.id);
console.log('Video URL:', task.output[0]);
```

### Image-to-Video ด้วย Python

```python
import runwayml

client = runwayml.RunwayML()
# SDK อ่าน RUNWAYML_API_SECRET จาก Environment Variable อัตโนมัติ

# สร้างวิดีโอ
image_to_video = client.image_to_video.create(
    model='gen4_turbo',
    prompt_image='https://example.com/your-image.jpg',
    prompt_text='Camera slowly pans right, golden sunset',
    duration=5,
    ratio='1280:720',
)

# รอผล
task = client.tasks.wait_for_task_output(image_to_video.id)
print('Video URL:', task.output[0])
```

---

## ทำความเข้าใจ Async Tasks

Runway API ทำงานแบบ **Asynchronous** (อะซิงโครนัส — ประมวลผลในเบื้องหลัง ไม่บล็อกโปรแกรม):

1. เรียก API → ได้ **Task ID** กลับมาทันที
2. Task ทำงานอยู่เบื้องหลัง (PENDING → RUNNING)
3. เมื่อเสร็จ Status เปลี่ยนเป็น **SUCCEEDED** พร้อม Output URLs
4. ถ้าล้มเหลว Status เป็น **FAILED** พร้อม Error message

### Task Status ทั้งหมด:
| Status | ความหมาย |
|---|---|
| **PENDING** | รอประมวลผล |
| **RUNNING** | กำลังสร้าง |
| **SUCCEEDED** | สำเร็จ มี Output |
| **FAILED** | ล้มเหลว |
| **CANCELED** | ถูกยกเลิก |

### การตรวจสอบ Status ด้วย Manual Polling

```javascript
// Node.js — ตรวจสอบ Status ด้วยตัวเอง
async function waitForTask(taskId) {
  while (true) {
    const task = await client.tasks.retrieve(taskId);
    
    if (task.status === 'SUCCEEDED') {
      return task.output;
    } else if (task.status === 'FAILED') {
      throw new Error(`Task failed: ${task.failureCode}`);
    }
    
    // รอ 5 วินาทีก่อน Poll ครั้งต่อไป
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
```

### ใช้ Built-in Wait Method (แนะนำ)

SDK มีฟังก์ชัน `waitForTaskOutput()` / `wait_for_task_output()` ที่จัดการ Polling ให้อัตโนมัติ:
- Timeout เริ่มต้น: 10 นาที
- สามารถกำหนด Custom Timeout ได้

```javascript
// รอพร้อม Custom Timeout
const task = await client.tasks.waitForTaskOutput(taskId, {
  timeout: 300000 // 5 นาที (มิลลิวินาที)
});
```

---

## Text-to-Video

นอกจาก Image-to-Video ยังสร้างจากข้อความล้วนได้:

```javascript
// ไม่ต้องใส่ promptImage → เป็น Text-to-Video
const task = await client.imageToVideo.create({
  model: 'gen4.5',
  promptText: 'A futuristic cityscape at night with flying cars',
  duration: 5,
  ratio: '1280:720',
});
```

---

## Text-to-Image

```javascript
const imageTask = await client.textToImage.create({
  model: 'gen4_image',
  promptText: 'A beautiful sunset over mountains, photorealistic',
  ratio: '1280:720',
});

const result = await client.tasks.waitForTaskOutput(imageTask.id);
console.log('Image URL:', result.output[0]);
```

---

## API Version Header

ทุก Request ต้องระบุ **API Version** ผ่าน Header:

```
X-Runway-Version: 2024-11-06
```

SDK จัดการ Header นี้อัตโนมัติ แต่ถ้าเรียกตรงผ่าน HTTP ต้องใส่เอง:

```bash
curl -X POST https://api.runwayml.com/v1/image_to_video \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Runway-Version: 2024-11-06" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gen4_turbo",
    "promptImage": "https://example.com/image.jpg",
    "duration": 5,
    "ratio": "1280:720"
  }'
```

---

## สรุป

Runway API เปิดโอกาสให้นักพัฒนานำ AI Video Generation ไปสร้างผลิตภัณฑ์ใหม่ๆ ขั้นตอนหลักคือ: สร้าง Organization → สร้าง API Key → เพิ่ม Credits → ติดตั้ง SDK → เรียก API บทต่อไปจะอธิบายรายละเอียด SDK และการจัดการ Error อย่างละเอียด
