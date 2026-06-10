---
title: "Connectors — ตัวเชื่อมต่อบริการภายนอก"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Connectors ให้ Grok เชื่อมต่อกับบริการภายนอกได้โดยตรงในระหว่างสนทนา เช่น ค้นหาอีเมล ดูปฏิทิน เปิดไฟล์บน Cloud Drive โดยไม่ต้องออกจ"
readTime: "3 นาที"
readers: "0"
locked: false
order: 9
---
# Connectors — ตัวเชื่อมต่อบริการภายนอก

> อ้างอิง: [Connectors Overview](https://docs.x.ai/grok/connectors) | [Google Drive](https://docs.x.ai/grok/connectors/google-drive) | [Gmail & Google Calendar](https://docs.x.ai/grok/connectors/gmail-google-calendar) | [OneDrive](https://docs.x.ai/grok/connectors/onedrive) | [Outlook](https://docs.x.ai/grok/connectors/outlook) | [SharePoint](https://docs.x.ai/grok/connectors/sharepoint) | [Microsoft Teams](https://docs.x.ai/grok/connectors/microsoft-teams) | [Salesforce](https://docs.x.ai/grok/connectors/salesforce) | [Custom MCP Tunneling](https://docs.x.ai/grok/connectors/custom-mcp-tunneling)

---

## Connectors คืออะไร?

**Connectors** ให้ Grok เชื่อมต่อกับบริการภายนอกได้โดยตรงในระหว่างสนทนา เช่น ค้นหาอีเมล ดูปฏิทิน เปิดไฟล์บน Cloud Drive โดยไม่ต้องออกจากหน้าจอ Grok

Connectors **พร้อมใช้งานสำหรับผู้ใช้ Grok ทุกคน** ผ่าน [grok.com/connectors](https://grok.com/connectors)

---

## ประเภทของ Connectors

### 1. Built-in Connectors (รองรับโดย xAI)

xAI ดูแลและพัฒนาให้ เชื่อมต่อง่ายผ่าน OAuth (ล็อกอินครั้งเดียว)

| Connector | เชื่อมต่อกับ | ดูรายละเอียด |
|---|---|---|
| **Gmail & Google Calendar** | อีเมล Gmail + ปฏิทิน Google | [คู่มือ](https://docs.x.ai/grok/connectors/gmail-google-calendar) |
| **Google Drive** | Google Drive, Docs, Sheets, Slides | [คู่มือ](https://docs.x.ai/grok/connectors/google-drive) |
| **OneDrive** | Microsoft OneDrive | [คู่มือ](https://docs.x.ai/grok/connectors/onedrive) |
| **Outlook Mail & Calendar** | อีเมล Outlook + ปฏิทิน | [คู่มือ](https://docs.x.ai/grok/connectors/outlook) |
| **SharePoint** | Microsoft SharePoint Sites | [คู่มือ](https://docs.x.ai/grok/connectors/sharepoint) |

### 2. Connector Catalog (Third-party)

นอกจาก Built-in ยังมี Connector จาก Third-party ให้เลือกอีกมาก เช่น **HubSpot, Slack, Notion** และอื่นๆ เชื่อมต่อผ่าน OAuth เช่นกัน

ดูรายการทั้งหมดได้ที่ [grok.com/connectors](https://grok.com/connectors)

### 3. Custom MCP Connectors (กำหนดเอง)

ถ้าบริการที่ต้องการไม่มีใน Catalog สามารถเชื่อมต่อ MCP Server ของตัวเองได้

---

## วิธีเพิ่ม Connector

1. ไปที่ [grok.com/connectors](https://grok.com/connectors)
2. กด **"New Connector"**
3. เลือกบริการที่ต้องการ (หรือเลือก **Custom** สำหรับ MCP)
4. ทำ OAuth Login ตามขั้นตอน
5. Grok จะใช้ Connector นั้นอัตโนมัติเมื่อคำถามเกี่ยวข้อง

---

## Gmail & Google Calendar

อ้างอิง: [Gmail & Google Calendar](https://docs.x.ai/grok/connectors/gmail-google-calendar)

### ทำอะไรได้บ้าง?
- ค้นหาอีเมล: "หาอีเมลจาก John ในสัปดาห์ที่แล้ว"
- สรุปอีเมล: "สรุปอีเมลที่ยังไม่ได้อ่านวันนี้"
- ดูปฏิทิน: "ฉันมีประชุมอะไรพรุ่งนี้?"
- ค้นหานัดหมาย: "หาการประชุมกับทีม Marketing เดือนนี้"

### การเชื่อมต่อ
ใช้ OAuth กับบัญชี Google ของคุณ — Grok จะขอสิทธิ์เฉพาะที่จำเป็น

---

## Google Drive

อ้างอิง: [Google Drive](https://docs.x.ai/grok/connectors/google-drive)

### ทำอะไรได้บ้าง?
- ค้นหาไฟล์: "หาสไลด์นำเสนอ Q3 ที่ฉันสร้างเมื่อเดือนที่แล้ว"
- อ่านเนื้อหา: "สรุปรายงานที่ฉันส่งทีมเมื่อวาน"
- เปรียบเทียบไฟล์: "เปรียบ budget จากปี 2024 กับ 2025"

---

## OneDrive

อ้างอิง: [OneDrive](https://docs.x.ai/grok/connectors/onedrive)

### ทำอะไรได้บ้าง?
- เข้าถึงไฟล์ส่วนตัวบน Microsoft OneDrive
- ค้นหาและอ่านเอกสาร Word, Excel, PowerPoint

---

## Outlook Mail & Calendar

อ้างอิง: [Outlook Mail & Calendar](https://docs.x.ai/grok/connectors/outlook)

### ทำอะไรได้บ้าง?
- ค้นหาและอ่านอีเมล Outlook
- ดูปฏิทินและนัดหมาย
- "หาอีเมลจาก HR เรื่องนโยบายใหม่"

---

## SharePoint

อ้างอิง: [SharePoint](https://docs.x.ai/grok/connectors/sharepoint)

### ทำอะไรได้บ้าง?
- เข้าถึงเอกสารใน SharePoint Sites ขององค์กร
- ค้นหาข้อมูลใน Document Libraries
- "ค้นหา SOP การทำบัญชีในระบบ"

---

## Microsoft Teams

อ้างอิง: [Microsoft Teams](https://docs.x.ai/grok/connectors/microsoft-teams)

### ทำอะไรได้บ้าง?
- อ่านข้อความใน Teams Channels
- ค้นหาการสนทนาในทีม
- "มีข้อความใหม่อะไรใน channel Engineering บ้าง?"

---

## Salesforce

อ้างอิง: [Salesforce](https://docs.x.ai/grok/connectors/salesforce)

### ทำอะไรได้บ้าง?
- ดึงข้อมูล Leads และ Contacts
- ค้นหา Opportunities
- "แสดง Deal ที่ยังเปิดอยู่มูลค่าสูงกว่า 1 ล้านบาท"

---

## Custom MCP Tunneling

อ้างอิง: [Custom MCP Tunneling](https://docs.x.ai/grok/connectors/custom-mcp-tunneling)

### หัวข้อนี้คืออะไร?
ถ้าต้องการเชื่อมต่อ Grok กับระบบภายในองค์กรที่ไม่มีใน Catalog สามารถสร้าง MCP Server เองและนำมาเชื่อมกับ Grok ผ่าน Custom MCP Connector

### ทำอะไรได้บ้าง?
- เชื่อมต่อกับ Internal API ขององค์กร
- เชื่อมต่อกับ Database ภายใน
- สร้าง Tools แบบกำหนดเองได้ทุกอย่าง

### วิธีเพิ่ม Custom MCP

1. ไปที่ [grok.com/connectors](https://grok.com/connectors)
2. กด **"New Connector"** → เลือก **"Custom"**
3. ใส่ URL ของ MCP Server
4. ทำ Authentication ตามที่กำหนด
5. Grok จะค้นหา Tools ที่ MCP Server expose ไว้ และใช้งานได้ทันที

---

## ตัวอย่างการสนทนาด้วย Connectors

**ตัวอย่างที่ 1 — Gmail + Calendar:**
```
User: "ฉันมีประชุมอะไรพรุ่งนี้ และมีอีเมลที่รอตอบอะไรบ้าง?"

Grok: [ค้นหา Calendar]
"พรุ่งนี้คุณมีประชุม 2 รายการ:
- 09:00 น. — Weekly Standup กับทีม Dev
- 14:00 น. — Product Review กับ PM

อีเมลที่รอตอบ:
1. จาก Alice: เรื่องงบประมาณ Q4 (3 วันที่แล้ว)
2. จาก Bob: ขอรีวิว Proposal (เมื่อวาน)"
```

**ตัวอย่างที่ 2 — Google Drive:**
```
User: "หาไฟล์ Excel Budget ปีนี้และสรุปให้หน่อย"

Grok: [ค้นหาใน Google Drive]
"เจอไฟล์ 'Budget_2025_Final.xlsx' สร้างเมื่อ 15 ม.ค.
สรุป: งบรวม 5.2 ล้านบาท แบ่งเป็น Marketing 30%, R&D 40%, Ops 30%..."
```
