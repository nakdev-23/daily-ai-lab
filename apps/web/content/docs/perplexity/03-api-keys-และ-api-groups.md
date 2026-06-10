---
title: "API Keys และ API Groups"
tool: "Perplexity"
icon: "icon-docs"
level: "beginner"
summary: "วิธีสร้างและจัดการ API Keys รวมถึงการใช้ API Groups เพื่อบริหารทีมและการเรียกเก็บเงิน"
readTime: "5 นาที"
readers: "0"
locked: false
order: 3
---

# API Keys และ API Groups

ก่อนเรียกใช้ Perplexity API ทุกครั้ง คุณต้องมี **API Key** (กุญแจ API — รหัสลับที่พิสูจน์ตัวตนว่าคุณมีสิทธิ์ใช้บริการ) และเข้าใจระบบ **API Groups** (กลุ่ม API — พื้นที่ทำงานขององค์กรสำหรับจัดการทีมและการเรียกเก็บเงิน)

---

## API Key คืออะไร?

API Key คือรหัสลับในรูปแบบตัวอักษร เช่น `pplx-abc123xyz...` ที่คุณแนบไปกับทุก Request (คำขอ — การส่งข้อมูลไปยัง API) เพื่อพิสูจน์ว่าเป็นคุณ

### วิธีสร้าง API Key
1. ไปที่ **[console.perplexity.ai](https://console.perplexity.ai)**
2. เลือกเมนู **API Keys** ในแถบด้านซ้าย
3. กด **"Generate New Key"**
4. ตั้งชื่อ Key เพื่อให้จำได้ว่าใช้กับโปรเจกต์ไหน
5. **คัดลอกค่า Key ทันที** — ระบบจะแสดงค่าเต็มครั้งเดียวตอนสร้าง หลังจากนั้นจะซ่อนไว้

> **นโยบายความปลอดภัยใหม่ (เมษายน 2026):** ค่า Key เต็มจะแสดงให้เห็น **เฉพาะตอนสร้างเท่านั้น** หลังจากนั้นจะแสดงแค่ส่วนต้นและส่วนท้าย เพื่อป้องกันการรั่วไหล

---

## วิธีใช้ API Key ใน Code

วิธีที่ปลอดภัยที่สุดคือใช้ **Environment Variable** (ตัวแปรสภาพแวดล้อม — เก็บข้อมูลลับแยกจาก Code):

### Python
```python
import os
from perplexityai import Perplexity

# SDK จะดึง PERPLEXITY_API_KEY จาก Environment อัตโนมัติ
client = Perplexity()

# หรือระบุ API Key ตรงๆ (ไม่แนะนำสำหรับ Production)
client = Perplexity(api_key="pplx-xxxxxxxx")
```

### TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

// ดึง Key จาก Environment อัตโนมัติ
const client = new Perplexity();

// หรือระบุตรงๆ
const client = new Perplexity({ apiKey: "pplx-xxxxxxxx" });
```

### HTTP Header (cURL)
```bash
curl -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
     https://api.perplexity.ai/v1/agent
```

---

## การ Revoke API Key (ยกเลิก)

ถ้า Key รั่วไหลหรือไม่ต้องการใช้แล้ว:
1. ไปที่หน้า **API Keys** ใน Console
2. กด **"Revoke"** ข้างชื่อ Key นั้น
3. Key จะหมดอายุทันที — Code ที่ใช้ Key นั้นจะเรียก API ไม่ได้อีก

> **แนวทางที่ดี:** สร้าง Key แยกสำหรับแต่ละโปรเจกต์ เพื่อง่ายต่อการยกเลิกเฉพาะโปรเจกต์นั้นโดยไม่กระทบโปรเจกต์อื่น

---

## API Groups คืออะไร?

**API Group** คือพื้นที่ทำงาน (Workspace) ขององค์กรใน Perplexity Console ช่วยให้:

- **จัดการการชำระเงิน** — ตั้งวิธีชำระและดูใบแจ้งหนี้
- **บริหาร API Keys** — สร้าง ยกเลิก และดูประวัติการใช้งาน
- **เชิญสมาชิกทีม** — กำหนดสิทธิ์ให้นักพัฒนาในทีม
- **ติดตามค่าใช้จ่าย** — ดูยอดใช้งานแยกตาม Key หรือตาม API

### สิทธิ์ (Permissions) ในทีม

| บทบาท | สิทธิ์ |
|---|---|
| Owner (เจ้าของ) | ทำได้ทุกอย่าง รวมถึงการจ่ายเงิน |
| Admin (ผู้ดูแล) | จัดการ Key และสมาชิก ไม่มีสิทธิ์จ่ายเงิน |
| Developer (นักพัฒนา) | ดูและสร้าง Key เฉพาะของตัวเอง |

---

## ความปลอดภัยของ API Key — สิ่งที่ควรทำและไม่ควรทำ

### ควรทำ
- เก็บ Key ใน Environment Variable หรือ Secret Manager (ระบบเก็บความลับ)
- ใช้ Key แยกสำหรับ Development และ Production
- ตรวจสอบ Usage (การใช้งาน) สม่ำเสมอเพื่อดูความผิดปกติ
- Rotate Key (หมุนเวียน — เปลี่ยนเป็น Key ใหม่) ทุก 3-6 เดือน

### ไม่ควรทำ
- **อย่า** ใส่ Key ตรงใน Code ที่จะ Push ขึ้น GitHub
- **อย่า** แชร์ Key ผ่าน Line, Email, หรือ Chat
- **อย่า** ใช้ Key เดียวกันทั้งหมดทุกโปรเจกต์
- **อย่า** ใส่ Key ใน Client-side Code (โค้ดที่รันในเบราว์เซอร์ของผู้ใช้) เพราะคนอื่นจะมองเห็นได้

---

## การซื้อผ่าน AWS Marketplace

สำหรับองค์กรที่ต้องการรวมค่าใช้จ่าย Perplexity เข้ากับบิล AWS สามารถสมัครผ่าน **AWS Marketplace** (ตลาดบริการของ Amazon) ได้ ซึ่งช่วยให้:

- ชำระเงินผ่าน AWS Billing เดียว
- ได้รับส่วนลด Enterprise ตามสัญญา AWS
- จัดการตาม Policy (นโยบาย) ของ AWS ได้

---

## สรุป

- **API Key** คือรหัสลับที่ต้องเก็บให้ดี สร้างได้ที่ console.perplexity.ai
- ระบบแสดงค่า Key เต็มเพียงครั้งเดียวตอนสร้าง — คัดลอกทันที
- ใช้ **Environment Variable** เสมอ อย่าใส่ Key ตรงใน Code
- **API Groups** ช่วยบริหารทีม กำหนดสิทธิ์ และดูค่าใช้จ่าย
- Revoke Key ทันทีหากสงสัยว่ารั่วไหล
