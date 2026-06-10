---
title: "API Versioning และ Changelog — การจัดการเวอร์ชัน"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "ทำความเข้าใจระบบ Versioning ของ Runway API วิธีระบุเวอร์ชัน นโยบาย Breaking Changes และการ Migrate ไปยังเวอร์ชันใหม่อย่างปลอดภัย"
readTime: "6 นาที"
readers: "0"
locked: false
order: 19
---

# API Versioning และ Changelog — การจัดการเวอร์ชัน

> Runway ใช้ระบบ Versioning ผ่าน HTTP Header เพื่อให้แอปพลิเคชันของคุณทำงานได้ต่อเนื่องแม้ API จะมีการเปลี่ยนแปลง

---

## ระบบ Versioning ของ Runway API

### วิธีระบุเวอร์ชัน

Runway ใช้ **`X-Runway-Version` HTTP Header** (เฮดเดอร์) เพื่อระบุเวอร์ชัน API:

```http
X-Runway-Version: 2024-11-06
```

รูปแบบเวอร์ชัน: **YYYY-MM-DD** (ปี-เดือน-วัน)

### SDK จัดการให้อัตโนมัติ

ถ้าใช้ Official SDK ไม่ต้องระบุ Header เอง SDK เวอร์ชันใหม่จะส่ง Version ที่ถูกต้องให้อัตโนมัติ

ถ้าเรียก HTTP ตรงๆ (cURL, fetch, Axios):
```bash
curl -X POST https://api.runwayml.com/v1/image_to_video \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Runway-Version: 2024-11-06" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## เวอร์ชัน: 2024-11-06

**เวอร์ชันปัจจุบัน** ณ เวลาที่เอกสารนี้เขียน

เวอร์ชันนี้ครอบคลุม:
- Image-to-Video Generation (Gen-4.5, Gen-4 Turbo, Gen-3 Turbo)
- Text-to-Image (Gen4 Image, GPT Image 2, Gemini Image Pro)
- Characters/Avatars API
- Audio Generation
- Uploads API

---

## เมื่อไหร่ Runway สร้างเวอร์ชันใหม่?

Runway สร้างเวอร์ชันใหม่เฉพาะเมื่อมี **Breaking Changes** (การเปลี่ยนแปลงที่ทำให้โค้ดเก่าหยุดทำงาน) เท่านั้น:

### Breaking Changes ที่ทำให้มีเวอร์ชันใหม่:
1. **เปลี่ยน Type ของ Parameter** — เช่น เปลี่ยนจาก string URL เป็น object
2. **เปลี่ยนชื่อ Parameter** — เช่น `promptImage` เป็น `inputImage`
3. **ลบ Feature** — นำ Endpoint หรือ Parameter ออก

### ไม่สร้างเวอร์ชันใหม่เมื่อ:
- เพิ่ม Parameter ใหม่ (Backward compatible)
- เพิ่ม Model ใหม่
- ปรับปรุงคุณภาพ

---

## นโยบายรองรับเวอร์ชันเก่า

> "เราจะรองรับเวอร์ชัน API เก่าเป็นเวลา **4 เดือน** หลังจากมีเวอร์ชันใหม่"

**ตัวอย่าง Timeline:**
```
วันที่ 1 มกราคม  — เปิดตัวเวอร์ชัน 2025-01-01
วันที่ 1 พฤษภาคม — เวอร์ชัน 2024-11-06 หมดการรองรับ (4 เดือนต่อมา)
```

**ดังนั้น:** ต้อง Migrate ไปยังเวอร์ชันใหม่ภายใน 4 เดือน

---

## หมายเหตุเกี่ยวกับ `/v1/` ใน URL

เส้นทาง `/v1/` ใน URL ของ Endpoint **ไม่ใช่ Version Number** — มันสงวนไว้สำหรับใช้ในอนาคตหาก Runway ต้องการเปิดตัว Endpoint ใหม่พร้อมกันหลายชุด

ดังนั้น URL จะยังคงเป็น `/v1/image_to_video` แม้จะมีเวอร์ชัน API ใหม่

---

## API Changelog (บันทึกการเปลี่ยนแปลง)

### การดู Changelog

Changelog ทั้งหมดอยู่ที่ [docs.dev.runwayml.com/api-details/api_changelog/](https://docs.dev.runwayml.com/api-details/api_changelog/)

### โมเดลล่าสุดที่เพิ่มเข้ามา (ณ กลางปี 2025)
- **GWM-1** — General World Model สำหรับ Avatar
- **Gen-4.5** — อัปเกรดจาก Gen-4
- **Aleph 2.0** — Video-to-Video รุ่นใหม่
- **Act-Two** — Character Animation รุ่นที่ 2
- **Veo3, Veo3.1** — โมเดลจาก Google พร้อมเสียง

---

## วิธี Migrate ไปยังเวอร์ชันใหม่

### ขั้นตอนที่ 1: ตรวจสอบ Breaking Changes

อ่าน Changelog อย่างละเอียดเพื่อหา Parameter ที่เปลี่ยนแปลง

### ขั้นตอนที่ 2: อัปเดต SDK

```bash
# Node.js
npm update @runwayml/sdk

# Python
pip install --upgrade runwayml
```

SDK เวอร์ชันใหม่จะส่ง API Version ที่ถูกต้องให้อัตโนมัติ

### ขั้นตอนที่ 3: ใช้ TypeScript/Python Type Checker

Type Checker จะบอกว่าโค้ดไหนต้องแก้ไข:

```bash
# TypeScript
npx tsc --noEmit

# Python
mypy your_app.py
```

### ขั้นตอนที่ 4: ทดสอบใน Staging Environment

**Staging Environment** (สภาพแวดล้อมทดสอบ — ระบบที่เหมือน Production แต่ใช้ทดสอบ) ก่อน Deploy จริง:

1. อัปเดต SDK ใน Staging ก่อน
2. ทดสอบ Generation ทุกประเภทที่ใช้
3. ตรวจสอบ Error Handling
4. Monitor 24-48 ชั่วโมง
5. Deploy ไป Production

---

## Best Practices สำหรับ Version Management

### 1. Pin SDK Version ใน package.json

```json
{
  "dependencies": {
    "@runwayml/sdk": "1.2.3"
  }
}
```

อย่าใช้ `^1.2.3` หรือ `~1.2.3` ใน Production เพราะอาจ Auto-upgrade

### 2. Subscribe รับ Notification

ติดตาม Runway Developer Newsletter หรือ GitHub Releases เพื่อรับแจ้งเตือนเมื่อมีเวอร์ชันใหม่

### 3. มี Key แยกสำหรับ Staging และ Production

```bash
# Staging
RUNWAYML_API_SECRET=key_staging_...

# Production
RUNWAYML_API_SECRET=key_prod_...
```

ทำให้ทดสอบ Migration ได้โดยไม่กระทบ Production

---

## Go-Live Checklist — รายการตรวจก่อน Launch

ก่อน Launch แอปพลิเคชันไปใช้งานจริง ตรวจสอบ:

### การจัดการ Usage
- [ ] ตรวจสอบ Tier ว่ารองรับปริมาณที่คาดหวังได้
- [ ] ตั้งค่า Autobilling
- [ ] กำหนด Threshold ที่เหมาะสม

### การทดสอบ Integration
- [ ] ทดสอบ Rate Limiting (429 error)
- [ ] ทดสอบ Server Outage (503 error)
- [ ] ตรวจสอบ Input Validation ทุกกรณี
- [ ] ทดสอบ Timeout scenarios

### ความปลอดภัย
- [ ] API Key ไม่อยู่ใน Code (ใช้ Environment Variable หรือ Secret Manager)
- [ ] มี Key แยกสำหรับ Dev/Staging/Production
- [ ] ตรวจสอบ `git grep "key_"` ก่อน Deploy
- [ ] ปิดการใช้ Key ที่ไม่ต้องการแล้ว

### Monitoring
- [ ] ติดตาม Error Rate
- [ ] ติดตาม Daily Generation Count
- [ ] ติดตาม Throttled Task Count
- [ ] ตั้งค่า Alerting สำหรับ Error Rate สูง
- [ ] ตรวจสอบว่า Email จาก Runway ไม่ถูก Spam

### Compliance
- [ ] ตรวจสอบ Content Policy
- [ ] มี Pre-filtering สำหรับ User Input
- [ ] แสดง Attribution "Powered by Runway"

---

## สรุป

ระบบ Versioning ของ Runway ออกแบบมาให้ Stable และ Predictable นักพัฒนาสามารถวางใจได้ว่าโค้ดที่เขียนวันนี้จะยังทำงานได้อีกอย่างน้อย 4 เดือนหลังมีเวอร์ชันใหม่ สิ่งสำคัญคือ Subscribe รับ Changelog notifications และมีแผน Migration ก่อนเวอร์ชันเก่าจะ Deprecate
