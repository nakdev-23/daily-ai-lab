---
title: "Runway API SDKs — Node.js และ Python"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "คู่มือการใช้งาน Runway SDK สำหรับ Node.js และ Python อย่างละเอียด รวมถึงการจัดการ Task, Error Handling และเทคนิคการใช้งานขั้นสูง"
readTime: "10 นาที"
readers: "0"
locked: false
order: 15
---

# Runway API SDKs — Node.js และ Python

> **SDK** (Software Development Kit — ชุดเครื่องมือสำหรับนักพัฒนา) ของ Runway ช่วยให้เรียก API ได้ง่ายขึ้น มี Type Safety และ Error Handling ในตัว

---

## ทำไมต้องใช้ SDK แทนการเรียก HTTP ตรงๆ?

| SDK | HTTP Request ตรงๆ |
|---|---|
| มี Type Safety (TypeScript/Python) | ต้องจัดการเอง |
| จัดการ Retry อัตโนมัติ | ต้องเขียนเอง |
| มี Helper สำหรับ Polling | ต้องเขียน Loop เอง |
| Error ที่ Typed | ต้องแปลง JSON เอง |
| อัปเดตตาม API Version | ต้องอัปเดตโค้ดเอง |

---

## Node.js SDK

### การติดตั้ง

```bash
npm install --save @runwayml/sdk
```

```bash
yarn add @runwayml/sdk
```

```bash
pnpm add @runwayml/sdk
```

**Requirement:** Node.js 18+, TypeScript (แนะนำ)

### การตั้งค่าเริ่มต้น

```typescript
import RunwayML from '@runwayml/sdk';

// วิธีที่ 1: อ่านจาก Environment Variable อัตโนมัติ (แนะนำ)
const client = new RunwayML();

// วิธีที่ 2: ระบุ Key ตรงๆ (สำหรับทดสอบเท่านั้น)
const client = new RunwayML({
  apiKey: 'your_api_key_here' // ห้ามทำในโปรดักชั่น!
});
```

### API Endpoints → SDK Methods

| API Endpoint | Node.js Method |
|---|---|
| `POST /v1/image_to_video` | `client.imageToVideo.create()` |
| `POST /v1/text_to_image` | `client.textToImage.create()` |
| `GET /v1/tasks/{id}` | `client.tasks.retrieve(id)` |
| `POST /v1/uploads` | `client.uploads.createEphemeral()` |

---

## Python SDK

### การติดตั้ง

```bash
pip install runwayml
```

```bash
# หรือด้วย uv (เร็วกว่า)
uv add runwayml
```

**Requirement:** Python 3.8+, มี MyPy type annotations

### การตั้งค่าเริ่มต้น

```python
import runwayml

# วิธีที่ 1: อ่านจาก Environment Variable อัตโนมัติ
client = runwayml.RunwayML()

# วิธีที่ 2: ระบุ Key ตรงๆ (สำหรับทดสอบเท่านั้น)
client = runwayml.RunwayML(api_key='your_api_key_here')
```

### API Endpoints → Python Methods

| API Endpoint | Python Method |
|---|---|
| `POST /v1/image_to_video` | `client.image_to_video.create()` |
| `POST /v1/text_to_image` | `client.text_to_image.create()` |
| `GET /v1/tasks/{id}` | `client.tasks.retrieve(id)` |
| `POST /v1/uploads` | `client.uploads.create_ephemeral()` |

---

## ตัวอย่างโค้ดที่ใช้บ่อย

### Video Generation พื้นฐาน

```typescript
// Node.js/TypeScript
import RunwayML from '@runwayml/sdk';

const client = new RunwayML();

async function generateVideo(imageUrl: string, prompt: string) {
  // เริ่มสร้างวิดีโอ
  const task = await client.imageToVideo.create({
    model: 'gen4_turbo',
    promptImage: imageUrl,
    promptText: prompt,
    duration: 5,
    ratio: '1280:720',
  });

  console.log(`Task started: ${task.id}`);
  
  // รอจนเสร็จ (timeout 5 นาที)
  const result = await client.tasks.waitForTaskOutput(task.id, {
    timeout: 300_000
  });
  
  return result.output[0]; // URL ของวิดีโอที่สร้าง
}

// ใช้งาน
const videoUrl = await generateVideo(
  'https://example.com/photo.jpg',
  'Gentle waves moving, soft morning light'
);
console.log('Video ready:', videoUrl);
```

```python
# Python
import runwayml

client = runwayml.RunwayML()

def generate_video(image_url: str, prompt: str) -> str:
    # เริ่มสร้างวิดีโอ
    task = client.image_to_video.create(
        model='gen4_turbo',
        prompt_image=image_url,
        prompt_text=prompt,
        duration=5,
        ratio='1280:720',
    )
    
    print(f"Task started: {task.id}")
    
    # รอจนเสร็จ
    result = client.tasks.wait_for_task_output(task.id, timeout=300)
    
    return result.output[0]  # URL ของวิดีโอ

video_url = generate_video(
    'https://example.com/photo.jpg',
    'Gentle waves moving, soft morning light'
)
print(f'Video ready: {video_url}')
```

---

## Error Handling — การจัดการข้อผิดพลาด

### ประเภท Error ที่ SDK Throw:

**TaskFailedError** (Task ล้มเหลว):
```typescript
import { TaskFailedError } from '@runwayml/sdk';

try {
  const result = await client.tasks.waitForTaskOutput(taskId);
} catch (error) {
  if (error instanceof TaskFailedError) {
    console.error('Generation failed:', error.task.failureCode);
    // เช่น: SAFETY.INPUT.TEXT, INTERNAL.BAD_OUTPUT.01
  }
}
```

**TaskTimeoutError** (Task ใช้เวลานานเกินกำหนด):
```typescript
import { TaskTimeoutError } from '@runwayml/sdk';

try {
  const result = await client.tasks.waitForTaskOutput(taskId, {
    timeout: 120_000 // 2 นาที
  });
} catch (error) {
  if (error instanceof TaskTimeoutError) {
    console.log('Task timed out, checking manually...');
    // สามารถ Retrieve task.id แล้วตรวจสอบภายหลัง
  }
}
```

**HTTP Errors** (ข้อผิดพลาด HTTP):
```typescript
import { APIError } from '@runwayml/sdk';

try {
  const task = await client.imageToVideo.create({ ... });
} catch (error) {
  if (error instanceof APIError) {
    console.error('HTTP Error:', error.status, error.message);
    
    if (error.status === 429) {
      // Rate limit — รอแล้วลองใหม่
    } else if (error.status === 400) {
      // Input ผิด — แก้ไขก่อนลองใหม่
    }
  }
}
```

---

## Ephemeral Uploads — อัปโหลดไฟล์ขนาดใหญ่

**Ephemeral Upload** (การอัปโหลดชั่วคราว) ใช้เมื่อไฟล์ใหญ่เกิน 32MB

```typescript
// Node.js
import { createReadStream } from 'fs';

// อัปโหลดไฟล์จาก disk
const upload = await client.uploads.createEphemeral(
  createReadStream('/path/to/video.mp4'),
  { filename: 'video.mp4' }
);

// ใช้ runway:// URI ใน API request
const task = await client.imageToVideo.create({
  model: 'gen4_turbo',
  promptImage: upload.id, // runway:// URI
  promptText: 'Ocean waves',
  duration: 5,
  ratio: '1280:720',
});
```

```python
# Python
with open('/path/to/image.jpg', 'rb') as f:
    upload = client.uploads.create_ephemeral(f, filename='image.jpg')

task = client.image_to_video.create(
    model='gen4_turbo',
    prompt_image=upload.id,  # runway:// URI
    prompt_text='Ocean waves',
    duration=5,
    ratio='1280:720',
)
```

**ข้อจำกัด Ephemeral Upload:**
- URI ใช้ได้ **24 ชั่วโมงเท่านั้น**
- ขนาดไฟล์: 512 bytes - 200MB
- ถ้าล้มเหลว ต้องเริ่ม Upload ใหม่ (ห้าม Retry เดิม)

---

## Data URI — ฝัง Base64 ในโค้ดตรงๆ

**Data URI** (ดาต้า URI — การเข้ารหัสไฟล์เป็น Base64 แล้วฝังในโค้ด) ใช้เมื่อต้องการส่งรูปภาพโดยไม่ต้องใช้ URL ภายนอก

```typescript
import { readFileSync } from 'fs';

// แปลงรูปเป็น Base64 Data URI
const imageBuffer = readFileSync('/path/to/image.jpg');
const base64 = imageBuffer.toString('base64');
const dataUri = `data:image/jpeg;base64,${base64}`;

const task = await client.imageToVideo.create({
  model: 'gen4_turbo',
  promptImage: dataUri,
  promptText: 'Ocean waves',
  duration: 5,
  ratio: '1280:720',
});
```

**ข้อจำกัด Data URI:**
- รูปภาพ: สูงสุด **5MB**
- วิดีโอ: สูงสุด **16MB**
- Base64 ทำให้ขนาดไฟล์เพิ่มขึ้น ~33%

---

## Retry Strategy — กลยุทธ์ลองซ้ำ

SDK จัดการ Retry อัตโนมัติสำหรับ Error บางประเภท แต่สำหรับ Rate Limit (429) และ Server Error (502-504) แนะนำให้ใช้ **Exponential Backoff with Jitter**:

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const baseDelay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      const jitter = Math.random() * baseDelay * 0.5; // เพิ่ม randomness
      await new Promise(r => setTimeout(r, baseDelay + jitter));
    }
  }
  throw new Error('Max retries exceeded');
}

// ใช้งาน
const result = await withRetry(() => 
  client.imageToVideo.create({ ... })
);
```

**Jitter** (จิตเตอร์ — ความสุ่มที่เพิ่มในเวลารอ) ป้องกัน **Thundering Herd** (ฝูงสัตว์ฟาดฟ้า — ปัญหาที่ Client หลายตัว Retry พร้อมกันจนท่วม Server)

---

## การจัดการ Concurrency

เมื่อต้องสร้างหลายวิดีโอพร้อมกัน ระวัง **Concurrency Limit** (ขีดจำกัดการทำงานพร้อมกัน):

```typescript
// สร้าง 5 วิดีโอพร้อมกัน (ถ้า Concurrency Limit >= 5)
const promises = imageUrls.map(url => 
  client.imageToVideo.create({
    model: 'gen4_turbo',
    promptImage: url,
    promptText: 'Ocean waves',
    duration: 5,
    ratio: '1280:720',
  })
);

const tasks = await Promise.all(promises);

// รอทุกวิดีโอ
const results = await Promise.all(
  tasks.map(task => client.tasks.waitForTaskOutput(task.id))
);
```

**หมายเหตุ:** ถ้าส่งเกิน Concurrency Limit งานจะถูก Queue (คิว) ไว้รอ ไม่ได้ Error ทันที

---

## สรุป

Runway SDK สำหรับ Node.js และ Python ครอบคลุมทุกความต้องการ ตั้งแต่การ Generate พื้นฐานไปจนถึงการจัดการ Error, Upload ไฟล์ขนาดใหญ่ และการทำงานพร้อมกันหลาย Task แนะนำให้ใช้ `waitForTaskOutput()` เสมอแทนการเขียน Polling เอง และอย่าลืมจัดการ Error อย่างเหมาะสมเพื่อให้แอปพลิเคชันแข็งแกร่ง
