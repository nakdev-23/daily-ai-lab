---
title: "API Error Handling — จัดการข้อผิดพลาด"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "คู่มือจัดการ HTTP Errors, Task Failures และการตั้งค่า Retry Strategy อย่างถูกต้องสำหรับ Runway API เพื่อให้แอปพลิเคชันทำงานได้เสถียร"
readTime: "8 นาที"
readers: "0"
locked: false
order: 17
---

# API Error Handling — จัดการข้อผิดพลาด

> การจัดการ Error อย่างถูกต้องเป็นสิ่งจำเป็นสำหรับแอปพลิเคชัน Production ที่ใช้ Runway API

---

## ประเภท Error ใน Runway API

Error แบ่งออกเป็น 2 ประเภทหลัก:

1. **HTTP Errors** — ข้อผิดพลาดระดับ Request/Response
2. **Task Failures** — Task สร้างสำเร็จแต่ Generation ล้มเหลว

---

## HTTP Errors

### 400 — Bad Request (ข้อมูลที่ส่งไม่ถูกต้อง)

**เกิดเมื่อ:** Input validation ล้มเหลว — มีปัญหากับ Parameter ที่ส่งมา

**ตัวอย่าง:**
- รูปภาพใหญ่เกินกำหนด
- รูปแบบไฟล์ที่ไม่รองรับ
- Parameter ที่จำเป็นขาดหายไป
- Codec วิดีโอที่ไม่รองรับ

**วิธีแก้:**
- อ่าน Error message ใน Response body
- ตรวจสอบ Input ตาม API Documentation
- ห้าม Retry — แก้ Input ก่อนเสมอ

```typescript
try {
  await client.imageToVideo.create({ ... });
} catch (error) {
  if (error.status === 400) {
    console.error('Input error:', error.message);
    // ตรวจสอบ Input แล้วแก้ไข ห้าม Retry
  }
}
```

---

### 401 — Unauthorized (ไม่ได้รับอนุญาต)

**เกิดเมื่อ:** API Key ไม่ถูกต้องหรือหมดอายุ

**วิธีแก้:**
- ตรวจสอบว่า `RUNWAYML_API_SECRET` ตั้งค่าถูกต้อง
- ตรวจสอบว่า Key ยังไม่ถูก Revoke (ยกเลิก)
- สร้าง Key ใหม่ถ้าจำเป็น

---

### 404 — Not Found (ไม่พบ)

**เกิดเมื่อ:** Task ID ที่ Query ไม่มีในระบบ

**วิธีแก้:**
- ตรวจสอบว่าใช้ Task ID ที่ถูกต้อง
- Task อาจถูกลบหลังจากเวลาผ่านไปนาน

---

### 429 — Rate Limit Exceeded (เกินขีดจำกัด)

**เกิดเมื่อ:** สร้าง Request มากเกินไปในช่วงเวลาสั้น หรือเกิน Daily Generation Limit

**วิธีแก้:**
- **ต้อง Retry** หลังรอระยะหนึ่ง
- ใช้ Exponential Backoff (การถอยรอแบบเอกซ์โปเนนเชียล — รอนานขึ้นเรื่อยๆ ในแต่ละครั้งที่ Retry)

```typescript
async function retryOn429<T>(fn: () => Promise<T>): Promise<T> {
  const maxRetries = 5;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
        const jitter = Math.random() * delay * 0.5;
        await sleep(delay + jitter);
        continue;
      }
      throw error;
    }
  }
}
```

---

### 502, 503, 504 — Server Errors (เซิร์ฟเวอร์มีปัญหา)

**เกิดเมื่อ:** Runway Server มีปัญหาหรือโหลดสูง

**วิธีแก้:**
- **ต้อง Retry** ด้วย Exponential Backoff
- SDK จัดการ Retry อัตโนมัติสำหรับ Error เหล่านี้

---

## Task Failures — Task ล้มเหลว

เมื่อ Task Status เป็น `FAILED` จะมี `failureCode` บอกสาเหตุ:

### SAFETY.INPUT.* — Input ละเมิดนโยบาย

**รหัส Error:** `SAFETY.INPUT.TEXT`, `SAFETY.INPUT.IMAGE`, `SAFETY.INPUT.VIDEO`

**ความหมาย:** Input ที่ส่งมา (ข้อความหรือรูป) ละเมิดนโยบาย Content Moderation

**ควรทำ:**
- **ห้าม Retry** — ผลลัพธ์จะเหมือนเดิม
- Credits ที่ใช้ **จะไม่คืน**
- ตรวจสอบและแก้ไข Prompt หรือ Image ก่อน

```typescript
if (task.failureCode?.startsWith('SAFETY.INPUT.')) {
  console.error('Content moderation violation:', task.failureCode);
  // แก้ไข prompt หรือ image แล้วลองใหม่
  // ห้าม Retry ด้วย input เดิม
}
```

---

### SAFETY.OUTPUT.* — Output ละเมิดนโยบาย

**รหัส Error:** `SAFETY.OUTPUT.VIDEO`, `SAFETY.OUTPUT.IMAGE`

**ความหมาย:** Generation สำเร็จ แต่ผลลัพธ์ถูก Block โดย Moderation

**ควรทำ:**
- ปรับ Prompt ให้ต่างออกไป แล้วลองใหม่
- หรือปรับ `contentModeration` settings

---

### INPUT_PREPROCESSING.SAFETY.TEXT — Prompt ไม่ผ่าน

**ความหมาย:** ข้อความ Prompt ถูกกรองก่อน Processing

**ควรทำ:**
- **ห้าม Retry** ด้วย Prompt เดิม
- แก้ไข Prompt แล้วลองใหม่

---

### INTERNAL.BAD_OUTPUT.01 — Output คุณภาพต่ำ

**ความหมาย:** Generation เสร็จแต่ผลลัพธ์ถูก Reject เพราะคุณภาพต่ำหรือมีปัญหา

**สาเหตุที่พบบ่อย:**
- Input มี Logo, Watermark, หรือข้อความซ้อนอยู่
- Prompt ขอให้สร้างข้อความยาวๆ ในภาพ

**ควรทำ:**
- ลบ Logo/Watermark ออกจาก Input
- ปรับ Prompt แล้ว Retry ได้

---

### INPUT_PREPROCESSING.INTERNAL — ปัญหาภายใน

**ความหมาย:** ระบบ Preprocessing มีปัญหาชั่วคราว

**ควรทำ:**
- **Retry ได้** แต่รอ Delay ก่อน

---

### ASSET.INVALID — ไฟล์ไม่ตรงตามเงื่อนไข

**ความหมาย:** ไฟล์ที่ส่งมาไม่ตรงตาม Spec (ขนาด, Duration, ความละเอียด)

**ควรทำ:**
- **ห้าม Retry** ด้วยไฟล์เดิม
- แก้ไขไฟล์ให้ตรง Spec แล้วลองใหม่

---

### INTERNAL — ปัญหาภายในทั่วไป

**ความหมาย:** ข้อผิดพลาดภายในระบบที่ไม่ระบุ

**ควรทำ:**
- **Retry ได้** พร้อม Delay

---

### null failureCode — ไม่รู้สาเหตุ

**ความหมาย:** Task ล้มเหลวแต่ไม่มีรหัส Error

**ควรทำ:**
- **Retry ได้** พร้อม Delay

---

## สรุปตาราง Error Codes

| Error Code | Retry ได้? | Credits คืน? | วิธีแก้ |
|---|---|---|---|
| `SAFETY.INPUT.*` | ห้าม | ไม่คืน | แก้ Input |
| `SAFETY.OUTPUT.*` | ปรับ Prompt แล้ว Retry | ไม่คืน | ปรับ Prompt |
| `INPUT_PREPROCESSING.SAFETY.TEXT` | ห้าม | — | แก้ Prompt |
| `INPUT_PREPROCESSING.INTERNAL` | ได้ (+ Delay) | — | Retry พร้อม Delay |
| `INTERNAL.BAD_OUTPUT.01` | ปรับแล้ว Retry | — | ลบ Watermark |
| `ASSET.INVALID` | ห้าม (แก้ไฟล์ก่อน) | — | แก้ไฟล์ |
| `INTERNAL` / null | ได้ (+ Delay) | — | Retry พร้อม Delay |

---

## ตัวอย่าง Full Error Handling

```typescript
import RunwayML, { TaskFailedError, TaskTimeoutError, APIError } from '@runwayml/sdk';

const client = new RunwayML();

async function generateVideoSafely(imageUrl: string, prompt: string) {
  // ขั้นตอน 1: สร้าง Task
  let task;
  try {
    task = await client.imageToVideo.create({
      model: 'gen4_turbo',
      promptImage: imageUrl,
      promptText: prompt,
      duration: 5,
      ratio: '1280:720',
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 400) {
        throw new Error(`Invalid input: ${error.message}`);
      } else if (error.status === 429) {
        // Rate limited — ควร Retry ด้วย backoff
        throw new Error('Rate limited, please retry later');
      } else if (error.status >= 500) {
        // Server error — Retry
        throw new Error('Server error, please retry');
      }
    }
    throw error;
  }

  // ขั้นตอน 2: รอผล
  try {
    const result = await client.tasks.waitForTaskOutput(task.id, {
      timeout: 300_000
    });
    return result.output[0];
    
  } catch (error) {
    if (error instanceof TaskFailedError) {
      const code = error.task.failureCode;
      
      if (code?.startsWith('SAFETY.INPUT.')) {
        throw new Error('Content policy violation in input');
      } else if (code === 'ASSET.INVALID') {
        throw new Error('Invalid media file - check format and size');
      } else if (code === 'INTERNAL.BAD_OUTPUT.01') {
        throw new Error('Remove watermarks from input and retry');
      } else {
        // INTERNAL หรือ null — Retry ได้
        throw new Error(`Generation failed: ${code || 'unknown'}`);
      }
    }
    
    if (error instanceof TaskTimeoutError) {
      console.warn(`Task ${task.id} timed out, check status manually`);
      throw error;
    }
    
    throw error;
  }
}
```

---

## การ Monitor Errors ในระบบ Production

แนะนำให้ Track Metrics เหล่านี้:

1. **Error Rate** (อัตราข้อผิดพลาด) — จำนวน Error ต่อจำนวน Request ทั้งหมด
2. **Safety Violation Rate** — ถ้าสูงเกิน แสดงว่า User Input มีปัญหา
3. **Timeout Rate** — ถ้าสูง อาจต้องเพิ่ม Timeout หรือเช็ค System Load
4. **Throttled Count** — จำนวนครั้งที่ถูก Rate Limit

**ระวัง:** ถ้ามี Safety Violations มากเกินไป Runway อาจ **Suspend Account** (ระงับบัญชี)

---

## Account Suspension (การระงับบัญชี)

**เมื่อไหร่ถูก Suspend:**
- มี Safety Violations ต่อเนื่องจำนวนมาก
- ใช้งานนอกเหนือ Terms of Service

**ป้องกัน:**
- ทำ Pre-filtering ของ User Input ก่อนส่ง API
- ตรวจสอบ Content ที่ผู้ใช้ส่งมา
- ดู Blocked Content categories ใน Help Center

**หากถูก Suspend:**
- ติดต่อ Runway ผ่าน Help Center เพื่อ Appeal

---

## สรุป

การจัดการ Error ที่ดีคือความแตกต่างระหว่างแอปพลิเคชันที่น่าเชื่อถือกับแอปที่ล่มบ่อย จำหลักสำคัญ: Error จาก Safety Violations ห้าม Retry ด้วย Input เดิม, Server Errors ให้ Retry พร้อม Exponential Backoff และต้องดาวน์โหลด Output ก่อน URL หมดอายุ
