---
title: "Pricing & Billing — ราคาและการชำระเงิน"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Kling AI มีระบบราคาสองระบบแยกกัน:"
readTime: "3 นาที"
readers: "0"
locked: false
order: 8
---
# 08 · Pricing & Billing — ราคาและการชำระเงิน

> อ้างอิง Official Docs:
> - [Billing Info](https://kling.ai/document-api/productBilling%2FbillingMethod)
> - [Prepaid Resource Packs](https://kling.ai/document-api/productBilling%2FprePaidResourcePackage)

---

## 1. ระบบราคาของ Kling AI

Kling AI มีระบบราคาสองระบบแยกกัน:

| ระบบ | สำหรับ | รายละเอียด |
|------|--------|-----------|
| **Subscription Plans** | ผู้ใช้ทั่วไป (kling.ai/app) | รายเดือน/รายปี, ใช้ Credits |
| **API Resource Packages** | นักพัฒนา (kling.ai/dev) | Prepaid, ใช้ Units |

> ⚠️ สองระบบนี้ **แยกจากกันโดยสิ้นเชิง** — Credits ของ Subscription ไม่สามารถใช้กับ API ได้

---

## 2. Subscription Plans — แผนสมาชิก (สำหรับผู้ใช้ทั่วไป)

### แผนราคา (2026)

| แผน | ราคา/เดือน | ราคา/ปี (ประหยัด ~34%) |
|-----|-----------|----------------------|
| **Free** | ฟรี | - |
| **Standard** | ~$10/เดือน | ~$6.60/เดือน |
| **Pro** | ~$37/เดือน | ~$24.42/เดือน |
| **Premier** | ~$92/เดือน | ~$60.72/เดือน |
| **Ultra** | ~$180/เดือน | ไม่มีแผนรายปี |

> ราคาอาจแตกต่างกันตามภูมิภาค ตรวจสอบราคาปัจจุบันที่ [kling.ai/pricing](https://kling.ai/pricing)

### Credits ของแผนสมาชิก

- Credits รายเดือน **หมดอายุเมื่อครบรอบบิล** ไม่สะสมข้ามเดือน
- Credits จากการซื้อเพิ่ม (Add-on) มีอายุ **2 ปี**
- แผน Free ได้ 66 Credits/วัน แต่หมดอายุภายใน 24 ชั่วโมง

### ต้นทุน Credits ต่อการใช้งาน (Kling 3.0)

| คุณภาพ | Credits ต่อวินาที |
|--------|----------------|
| 720p ไม่มีเสียง | 6 credits/วินาที |
| 1080p + Native Audio | 12 credits/วินาที |

---

## 3. API Billing — การชำระเงินสำหรับ API

> อ้างอิง: [Billing Info](https://kling.ai/document-api/productBilling%2FbillingMethod)

### วิธีชำระเงิน

API ของ Kling ใช้ระบบ **Prepaid (ชำระล่วงหน้า)** โดย:
- ซื้อ Resource Package ล่วงหน้า
- แต่ละงานที่สร้างสำเร็จจะหัก Units จาก Package
- ถ้า Package หมด ต้องซื้อเพิ่มก่อนถึงจะใช้งานได้ต่อ

### ระบบชำระเงิน

- ใช้ **Stripe** (อัปเกรดจาก Checkout แล้ว)
- รองรับบัตรเครดิต/เดบิต ทั่วโลก

> ⚠️ **สำหรับการซื้อในนามองค์กร (ต้องการใบกำกับภาษี)**
> ต้องเลือก **"I'm purchasing as a business"** และกรอก Tax ID ขณะชำระเงิน
> ถ้าไม่ทำตอนนี้จะถือเป็นการซื้อส่วนตัว และ:
> - อาจมีภาษีเพิ่มเติม
> - ไม่สามารถแก้ไขรายละเอียดใบกำกับได้
> - ไม่สามารถ Refund ได้

---

## 4. Prepaid Resource Packages — แพ็กเกจทรัพยากรสำหรับ API

> อ้างอิง: [Prepaid Resource Packs](https://kling.ai/document-api/productBilling%2FprePaidResourcePackage)

### ประเภท Resource Package

มีแพ็กเกจแยกตาม Use Case:

| ประเภท | ใช้สำหรับ |
|--------|---------|
| **Video Generation Package** | Text to Video, Image to Video, Video Effects, Lip Sync, Avatar, Extend Video ฯลฯ |
| **Image Generation Package** | Image Generation, Reference to Image, Extend Image, AI Multi-Shot ฯลฯ |
| **Virtual Try-On Package** | Virtual Try-On โดยเฉพาะ |

### ตัวอย่างราคา Package (โดยประมาณ)

| Package | ราคา | Units |
|---------|------|-------|
| Trial Package | ~$9.80 | หน่วยทดลอง |
| Starter | ราคาถูกสุด | หน่วยน้อย |
| Large | ~$7,560 | 60,000 units |

> ราคาและ Units ที่แน่นอน ตรวจสอบได้ที่ [kling.ai/dev/pricing](https://kling.ai/dev/pricing)

### Concurrency ของ Package

แพ็กเกจแต่ละระดับให้ Concurrency ต่างกัน — Package ใหญ่กว่า = Concurrency สูงกว่า = ทำงานพร้อมกันได้มากกว่า

ถ้ามี Package หลายอัน ระบบจะใช้ค่า Concurrency **สูงสุด** จากทุก Package ที่ Active อยู่

### Trial Resource Package

มีให้สำหรับ **ทดสอบก่อนซื้อจริง** มีจำนวน Units จำกัด เหมาะสำหรับ:
- ทดสอบการเชื่อมต่อ API
- ตรวจสอบคุณภาพผลลัพธ์
- ทดสอบ Workflow ก่อน Production

---

## 5. Query User Info — ตรวจสอบข้อมูลบัญชี

> อ้างอิง: [Query User Info](https://kling.ai/document-api/apiReference%2FaccountInfoInquiry)

### ดูยอด Units คงเหลือ

```
GET https://api-singapore.klingai.com/v1/account/info
```

```python
resp = requests.get(f"{BASE}/v1/account/info",
    headers={"Authorization": f"Bearer {token}"}
)
info = resp.json()
print(info)  # แสดง Units คงเหลือ, Package ที่ Active, ฯลฯ
```
