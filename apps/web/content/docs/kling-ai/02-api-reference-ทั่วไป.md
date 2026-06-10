---
title: "API Reference — ข้อมูลทั่วไป"
tool: "Kling AI"
icon: "icon-docs"
level: "beginner"
summary: "https://api-singapore.klingai.com"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---
# 02 · API Reference — ข้อมูลทั่วไป

> อ้างอิง Official Docs:
> - [General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)
> - [Rate Limits](https://kling.ai/document-api/apiReference%2FrateLimits)
> - [Callback Schema](https://kling.ai/document-api/apiReference%2FcallbackProtocol)

---

## 1. General Information — ข้อมูลทั่วไป

> อ้างอิง: [General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)

### 1.1 API Domain (Endpoint หลัก)

```
https://api-singapore.klingai.com
```

> **หมายเหตุ:** ที่อยู่ API เดิม (`https://api.klingai.com`) ถูกเปลี่ยนมาใช้ `api-singapore.klingai.com` แล้ว ให้ใช้ endpoint ใหม่เสมอ

---

### 1.2 API Authentication — การยืนยันตัวตน

Kling AI ใช้ **JWT (JSON Web Token)** ในการยืนยันตัวตน ซึ่งต่างจาก API Key ธรรมดา ตรงที่ต้องสร้าง Token ใหม่ทุกครั้งที่เรียก API

#### วิธีสร้าง JWT Token (3 ขั้นตอน)

**ขั้นที่ 1:** รับ AccessKey และ SecretKey จากหน้า Account ของ Kling AI

**ขั้นที่ 2:** สร้าง JWT Token โดยใช้การเข้ารหัสแบบ HS256

ข้อมูลใน JWT:
| ส่วน | รายละเอียด |
|------|-----------|
| Header | `alg: HS256`, `typ: JWT` |
| Payload `iss` | ใส่ค่า AccessKey |
| Payload `exp` | เวลาหมดอายุ = เวลาปัจจุบัน + 1800 วินาที (30 นาที) |
| Payload `nbf` | เวลาเริ่มใช้งาน = เวลาปัจจุบัน − 5 วินาที |

```python
import time
import jwt  # pip install PyJWT

def encode_jwt_token(ak: str, sk: str) -> str:
    headers = {
        "alg": "HS256",
        "typ": "JWT"
    }
    payload = {
        "iss": ak,                          # AccessKey
        "exp": int(time.time()) + 1800,     # หมดอายุใน 30 นาที
        "nbf": int(time.time()) - 5         # เริ่มใช้ได้ก่อน 5 วินาที
    }
    token = jwt.encode(payload, sk, algorithm="HS256", headers=headers)
    return token

# สร้าง Token
token = encode_jwt_token("your_access_key", "your_secret_key")
print(f"API Token: {token}")
```

**ขั้นที่ 3:** ใส่ Token ใน Request Header ทุกครั้งที่เรียก API

```
Authorization: Bearer <TOKEN_ที่สร้างจากขั้นที่_2>
```

> ⚠️ ต้องมีช่องว่างระหว่าง `Bearer` และ Token เสมอ

---

### 1.3 Error Code — รหัสข้อผิดพลาด

| HTTP Status | Service Code | ประเภท | ความหมาย | วิธีแก้ |
|-------------|-------------|--------|----------|---------|
| 200 | - | สำเร็จ | Request สำเร็จ | - |
| 401 | 1000 | Authentication Failed | ยืนยันตัวตนล้มเหลว | ตรวจสอบ Authorization Header |
| 401 | 1001 | Authentication Failed | ไม่มี Authorization | ใส่ Authorization Header ให้ถูกต้อง |
| 401 | 1002 | Authentication Failed | Authorization ไม่ถูกต้อง | ตรวจสอบรูปแบบ Authorization |
| 401 | 1003 | Authentication Failed | Token ยังไม่ถึงเวลาใช้ได้ | รอให้ Token มีผล หรือสร้างใหม่ |
| 401 | 1004 | Authentication Failed | Token หมดอายุแล้ว | สร้าง Token ใหม่ |
| 429 | 1100 | Account Exception | บัญชีมีปัญหา | ตรวจสอบการตั้งค่าบัญชี |
| 429 | 1101 | Account Exception | บัญชีติดค้างชำระ | เติมเงินให้เพียงพอ |
| 429 | 1102 | Account Exception | Resource Pack หมดหรือหมดอายุ | ซื้อแพ็กเกจเพิ่ม |
| 403 | 1103 | Account Exception | ไม่มีสิทธิ์ใช้ API/Model นั้น | ตรวจสอบ Permission บัญชี |
| 400 | 1200 | Invalid Parameters | พารามิเตอร์ไม่ถูกต้อง | ตรวจสอบพารามิเตอร์ทั้งหมด |
| 400 | 1201 | Invalid Parameters | Key หรือค่าพารามิเตอร์ผิด | ดูข้อความใน `message` field |
| 404 | 1202 | Invalid Parameters | HTTP Method ไม่ถูกต้อง | ใช้ Method ให้ตรงตาม Docs |
| 404 | 1203 | Invalid Parameters | Resource ไม่มีอยู่ (เช่น Model) | ดูข้อความใน `message` field |
| 400 | 1300 | Policy Triggered | ผิด Platform Policy | ตรวจสอบว่าทำอะไรผิดกฎ |
| 400 | 1301 | Policy Triggered | เนื้อหาละเมิด Content Policy | แก้ไข Prompt แล้วส่งใหม่ |
| 429 | 1302 | Policy Triggered | เรียก API เร็วเกินไป (Rate Limit) | ลด Frequency หรือติดต่อ Support |
| 429 | 1303 | Policy Triggered | เกิน Concurrency ของแพ็กเกจ | ลด Frequency, รอแล้วลองใหม่ |
| 429 | 1304 | Policy Triggered | IP ไม่อยู่ใน Whitelist | ติดต่อ Support |
| 500 | 5000 | Internal Error | Server Error | รอแล้วลองใหม่ หรือติดต่อ Support |
| 503 | 5001 | Internal Error | Server ชั่วคราวไม่พร้อม (บำรุงรักษา) | รอแล้วลองใหม่ |
| 504 | 5002 | Internal Error | Server Timeout (งานค้างคิว) | รอแล้วลองใหม่ |

---

## 2. Rate Limits — ข้อจำกัดการใช้งานพร้อมกัน

> อ้างอิง: [Rate Limits / Concurrency Rules](https://kling.ai/document-api/apiReference%2FrateLimits)

### หัวข้อนี้คืออะไร

**Kling API Concurrency** หมายถึงจำนวนงาน (Task) สูงสุดที่บัญชีสามารถประมวลผลพร้อมกันได้ในเวลาเดียวกัน ซึ่งขึ้นอยู่กับแพ็กเกจทรัพยากรที่ซื้อไว้

### กฎหลักของ Concurrency

| มิติ | รายละเอียด |
|------|-----------|
| **ระดับการนับ** | นับที่ระดับบัญชี (Account Level) แยกคำนวณตามประเภท Resource Pack (Video/Image/Try-On) |
| **เวลาที่นับ** | นับตั้งแต่งานอยู่ในสถานะ `submitted` จนกว่าจะ `succeed` หรือ `failed` |
| **การคำนวณ Quota** | ใช้ค่า Concurrency สูงสุดจากแพ็กเกจที่ Active ทั้งหมด เช่น ถ้ามีแพ็กเกจ A (5 concurrent) และ B (10 concurrent) พร้อมกัน ค่าที่ใช้ = 10 |

> **หมายเหตุ:** Concurrency Limit ใช้กับ **การสร้างงาน (Create Task)** เท่านั้น การ Query ดูสถานะไม่นับ

### การนับ Concurrency ต่อประเภทงาน

- **วิดีโอ / Virtual Try-On**: งาน 1 ชิ้น = ใช้ 1 Concurrency เสมอ
- **รูปภาพ**: ใช้ Concurrency = ค่าพารามิเตอร์ `n` ที่ส่งไป เช่น ขอสร้างรูป 9 ภาพ = ใช้ 9 Concurrency

### เมื่อเกิน Limit จะได้ Error นี้

```json
{
  "code": 1303,
  "message": "parallel task over resource pack limit",
  "request_id": "9984d27b-a408-4073-ae28-17ca6a13622d"
}
```

### วิธีแก้ที่แนะนำ

**1. Backoff Retry Strategy** — ถ้าได้รับ Error 1303 ให้รอก่อนแล้วลองใหม่ โดยใช้ Exponential Backoff (รอเพิ่มขึ้นเรื่อยๆ) เริ่มต้นรอ ≥ 1 วินาที

**2. Queue Management** — ควบคุมอัตราการส่งงานผ่าน Task Queue และปรับตาม Concurrency ที่มีอยู่ในขณะนั้น

---

## 3. Callback Schema — รูปแบบการแจ้งผลลัพธ์

> อ้างอิง: [Callback Protocol](https://kling.ai/document-api/apiReference%2FcallbackProtocol)

### หัวข้อนี้คืออะไร

เนื่องจาก Kling API ทำงานแบบ **Asynchronous (ไม่รอผล)** เมื่องานเสร็จ ระบบสามารถส่งผลไปยัง URL ที่กำหนด (Callback URL) ได้โดยอัตโนมัติ แทนที่จะต้องมาถามสถานะตลอดเวลา

### โครงสร้างข้อมูล Callback (JSON)

```json
{
  "task_id": "string",           // Task ID ที่ระบบสร้างให้
  "task_status": "string",       // สถานะ: submitted | processing | succeed | failed
  "task_status_msg": "string",   // ข้อความสถานะ (แสดงสาเหตุถ้า failed)
  "created_at": 1722769557708,   // เวลาสร้างงาน (Unix timestamp, ms)
  "updated_at": 1722769557708,   // เวลาอัปเดตล่าสุด (Unix timestamp, ms)
  "final_unit_deduction": "string", // จำนวน Unit ที่หักไป
  "task_info": { ... },          // พารามิเตอร์ที่ส่งตอนสร้างงาน
  "external_task_id": "string",  // Task ID ที่ผู้ใช้กำหนดเอง (ถ้ามี)
  "task_result": {
    "images": [                  // ผลลัพธ์งานรูปภาพ
      {
        "index": 0,              // ลำดับรูป
        "url": "string"          // URL รูปที่สร้าง (ชั่วคราว!)
      }
    ],
    "videos": [                  // ผลลัพธ์งานวิดีโอ
      {
        "id": "string",          // Video ID (Unique ทั่วโลก)
        "url": "string",         // URL วิดีโอที่สร้าง (ชั่วคราว!)
        "duration": "string"     // ความยาววิดีโอ (วินาที)
      }
    ]
  }
}
```

### สถานะของงาน (Task Status)

| Status | ความหมาย |
|--------|---------|
| `submitted` | งานถูกส่งและรอประมวลผล |
| `processing` | กำลังสร้างอยู่ |
| `succeed` | สำเร็จ — พร้อมดาวน์โหลด |
| `failed` | ล้มเหลว — ดูสาเหตุใน `task_status_msg` |

### ข้อควรระวัง

> ⚠️ **URL ของรูปภาพและวิดีโอเป็นแบบชั่วคราว** — จะถูกลบหลังจากสักระยะ ดาวน์โหลดและบันทึกไว้ทันทีที่ได้รับผล

### วิธีใช้ Callback URL

เมื่อสร้างงาน ใส่พารามิเตอร์ `callback_url` ในคำขอ:

```json
{
  "model": "kling-v2-6",
  "prompt": "...",
  "callback_url": "https://your-server.com/kling-callback"
}
```

ระบบจะ POST ผลลัพธ์มาที่ URL นั้นโดยอัตโนมัติเมื่องานเสร็จ
