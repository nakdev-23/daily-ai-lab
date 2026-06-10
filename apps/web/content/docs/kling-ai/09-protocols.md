---
title: "Protocols — นโยบายและข้อกำหนด"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Kling AI เก็บรวบรวมข้อมูลเพื่อให้บริการ API ซึ่งรวมถึง:"
readTime: "3 นาที"
readers: "0"
locked: false
order: 9
---
# 09 · Protocols — นโยบายและข้อกำหนด

> อ้างอิง Official Docs:
> - [Privacy Policy of API Service](https://kling.ai/document-api/protocols%2FprivacyPolicy)
> - [Terms of API Service](https://kling.ai/document-api/protocols%2FpaidServiceProtocol)
> - [API Service Level Agreement (SLA)](https://kling.ai/document-api/protocols%2FpaidLevelProtocol)

---

## 1. Privacy Policy of API Service — นโยบายความเป็นส่วนตัว

> อ้างอิง: [Privacy Policy](https://kling.ai/document-api/protocols%2FprivacyPolicy)

### สรุปประเด็นสำคัญ

Kling AI เก็บรวบรวมข้อมูลเพื่อให้บริการ API ซึ่งรวมถึง:

- **ข้อมูลบัญชี**: ชื่อ, อีเมล, ข้อมูลการชำระเงิน
- **ข้อมูลการใช้งาน**: Request ที่ส่ง, Output ที่สร้าง, Logs
- **เนื้อหา Input/Output**: Prompt, รูปภาพ, วิดีโอที่ส่งหรือสร้าง

### การเก็บข้อมูล

- **ผลลัพธ์ (รูปภาพ/วิดีโอ)** ถูกเก็บในระบบ **30 วัน** แล้วลบอัตโนมัติ
- URL ของผลลัพธ์ใช้ได้เพียงชั่วคราว ต้องดาวน์โหลดก่อนหมดอายุ
- ข้อมูลอาจถูกใช้เพื่อปรับปรุงโมเดล AI (ตามที่ระบุในนโยบาย)

### สิทธิ์ของผู้ใช้

- สามารถขอลบข้อมูลส่วนตัวได้
- ติดต่อทีม Support หากมีข้อสงสัย

> ⚠️ **อ่านนโยบายฉบับเต็มได้ที่**: [kling.ai/document-api/protocols/privacyPolicy](https://kling.ai/document-api/protocols%2FprivacyPolicy)

---

## 2. Terms of API Service — ข้อกำหนดการใช้บริการ API

> อ้างอิง: [Terms of Service](https://kling.ai/document-api/protocols%2FpaidServiceProtocol)

### ประเด็นสำคัญที่ควรรู้

**สิ่งที่ทำได้:**
- นำ API ไปใช้กับแอปพลิเคชันเชิงพาณิชย์ (ตามแผนที่เลือก)
- สร้างคอนเทนต์สำหรับลูกค้าหรือสาธารณะ
- ใช้ Output ที่สร้างได้ในทางการค้า

**สิ่งที่ห้ามทำ:**
- สร้างเนื้อหาที่ละเมิดกฎหมาย, ลามกอนาจาร, หรือก่อความเกลียดชัง
- ใช้เพื่อปลอมแปลง Deepfake โดยมิชอบ
- แชร์ API Key หรือ Credentials ให้ผู้อื่น
- Resell การเข้าถึง API โดยตรง (ไม่ใช่ผ่านแอปที่สร้างขึ้น)

**เรื่องการคืนเงิน:**
- โดยทั่วไป Resource Package **ไม่สามารถ Refund ได้** หลังใช้งานแล้ว
- หากซื้อในนามบุคคล (ไม่ใช่องค์กร) และยังไม่ได้ใช้ อาจขอ Refund ได้ภายในระยะเวลาที่กำหนด

> ⚠️ **อ่านข้อกำหนดฉบับเต็มได้ที่**: [kling.ai/document-api/protocols/paidServiceProtocol](https://kling.ai/document-api/protocols%2FpaidServiceProtocol)

---

## 3. API Service Level Agreement (SLA) — ข้อตกลงระดับบริการ

> อ้างอิง: [SLA](https://kling.ai/document-api/protocols%2FpaidLevelProtocol)

### ระดับการรับประกันบริการ

| รายการ | เป้าหมาย |
|--------|---------|
| **Uptime** | 99.9% |
| **Planned Maintenance** | แจ้งล่วงหน้า |
| **Response Time** | Standard ~30s, Pro ~60s (โดยประมาณ) |

### กรณีระบบล่ม

ถ้าระบบมีปัญหาและ Uptime ต่ำกว่า SLA ผู้ใช้อาจมีสิทธิ์ได้รับการชดเชย ตามเงื่อนไขที่ระบุในข้อตกลง

### การแจ้งเตือน Maintenance

- Scheduled Maintenance จะแจ้งล่วงหน้าผ่านช่องทางทางการ
- Emergency Maintenance อาจเกิดขึ้นได้โดยไม่แจ้งล่วงหน้า

> ⚠️ **อ่าน SLA ฉบับเต็มได้ที่**: [kling.ai/document-api/protocols/paidLevelProtocol](https://kling.ai/document-api/protocols%2FpaidLevelProtocol)

---

## 4. Content Safety Policy — นโยบายความปลอดภัยของเนื้อหา

นอกเหนือจากข้อกำหนดทางกฎหมาย Kling AI มี **Content Security Policy** อัตโนมัติที่ตรวจสอบ Input และ Output:

- Prompt หรือรูปภาพที่ละเมิดนโยบายจะถูกปฏิเสธ (Error 1301)
- เนื้อหาที่สร้างได้ถูก Scan ก่อนส่งคืนผู้ใช้
- ถ้าได้รับ Error 1301 บ่อยครั้ง ให้ตรวจสอบ Prompt และแก้ไขเนื้อหา

> อ้างอิงเพิ่มเติม: [Content Policy Error 1301](https://kling.ai/document-api/apiReference%2FcommonInfo)
