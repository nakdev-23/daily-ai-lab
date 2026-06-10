---
title: "Projects และฟีเจอร์ Claude.ai — พื้นที่ทำงานส่วนตัวและ Team"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "รู้จัก Projects, Artifacts, Memory และฟีเจอร์พิเศษต่างๆ บน Claude.ai ตั้งแต่แผน Free ไปจนถึง Pro, Max, Team และ Enterprise"
readTime: "8 นาที"
readers: "0"
locked: false
order: 19
---

## Claude.ai คืออะไร?

Claude.ai เป็น **web interface** (หน้าจอบนเว็บสำหรับใช้งาน) หลักสำหรับพูดคุยกับ Claude โดยตรง ไม่ต้องเขียนโค้ด เหมาะสำหรับผู้ใช้ทั่วไปและทีมงาน มีฟีเจอร์ (ความสามารถ) ที่ไม่มีใน API (ช่องทางเชื่อมต่อระหว่างโปรแกรม) โดยตรง เช่น Projects, Artifacts, Memory และการทำงานร่วมกัน

---

## Projects — พื้นที่ทำงานส่วนตัว

Projects (โปรเจกต์) เป็น **workspace** (พื้นที่ทำงาน) ที่เก็บบทสนทนาและ knowledge base (ฐานความรู้) ไว้ด้วยกัน

### ฟีเจอร์หลักของ Projects

**Knowledge Base (ฐานความรู้)**
- อัปโหลดเอกสาร, ข้อความ หรือ code files
- Claude จะอ้างอิงไฟล์เหล่านี้ในทุกบทสนทนาในโปรเจกต์
- เหมาะสำหรับ: นโยบายบริษัท, คู่มือ, reference docs (เอกสารอ้างอิง)

**Custom Instructions (คำสั่งเฉพาะ)**
- ตั้ง "บุคลิก" ของ Claude เฉพาะโปรเจกต์
- เช่น: "ตอบเป็นทางการเสมอ" หรือ "ใช้ภาษาไทยเท่านั้น"

**Chat History (ประวัติการสนทนา)**
- บทสนทนาทุกอันในโปรเจกต์เก็บแยกจากกัน
- ค้นหาและกลับมาดูได้ภายหลัง

### จำนวน Projects ที่ใช้ได้

| แผน | จำนวน Projects |
|-----|---------------|
| Free | สูงสุด 5 projects |
| Pro/Max | มากกว่า |
| Team/Enterprise | ไม่จำกัด |

### RAG (Retrieval-Augmented Generation — การสร้างคำตอบโดยดึงข้อมูลจากฐานความรู้ก่อน)

สำหรับแผน Pro, Max, Team, Enterprise จะได้ **RAG mode** ซึ่งขยาย capacity (ความจุ) ได้ถึง 10x เมื่อ context (บริบท) ใกล้เต็ม โดยยังรักษาคุณภาพ response (การตอบกลับ) ไว้

---

## Artifacts — ผลลัพธ์ที่แก้ไขได้ทันที

Artifacts (สิ่งที่ Claude สร้างขึ้น — output ที่แก้ไข preview และดาวน์โหลดได้โดยตรงในหน้าเว็บ) คือส่วน output ที่ Claude สร้างขึ้นซึ่งสามารถแก้ไข preview (ดูตัวอย่าง) และดาวน์โหลดได้

### ประเภทของ Artifacts

| ประเภท | คำอธิบาย | ตัวอย่าง |
|-------|---------|---------|
| **Code** | โค้ดที่ run (รัน) ได้ใน browser | JavaScript, HTML |
| **Documents** | เอกสาร Markdown (รูปแบบข้อความที่แปลงเป็น HTML ได้ง่าย) | บทความ, รายงาน |
| **SVG** | ภาพ Vector graphics (ภาพกราฟิกที่ไม่แตกแม้ขยาย) | ไดอะแกรม, logo |
| **React** | React components (ส่วนประกอบ UI ที่สร้างด้วย React) | UI components |

### การใช้ Artifacts

1. ขอให้ Claude สร้างสิ่งที่ต้องการ (เว็บไซต์, โค้ด, เอกสาร)
2. Claude สร้าง Artifact แสดงใน panel (ช่อง) ขวา
3. Preview ดูผลลัพธ์ได้ทันที
4. คลิก "Edit" เพื่อแก้ไข หรือ "Copy" เพื่อนำไปใช้

---

## Memory — Claude จำได้ข้ามบทสนทนา

Memory (ความจำ — ฟีเจอร์ที่ให้ Claude บันทึกข้อมูลสำคัญเกี่ยวกับคุณและเรียกใช้ได้ในการสนทนาครั้งต่อๆ ไป) ช่วยให้ Claude จำข้อมูลสำคัญเกี่ยวกับคุณข้ามบทสนทนา

### วิธีทำงาน

- Claude บันทึกข้อมูลสำคัญโดยอัตโนมัติ (หรือตามที่คุณขอ)
- ครั้งต่อไปที่คุยกัน Claude จะรู้ข้อมูลนั้นอยู่แล้ว

### ตัวอย่างข้อมูลที่ Memory เก็บ

- "ผู้ใช้เป็นนักพัฒนา Python ที่ทำงานด้าน data science"
- "ชอบ response ภาษาไทยสั้นๆ"
- "โปรเจกต์ปัจจุบันชื่อ DataPipeline ใช้ FastAPI"

### การจัดการ Memory

- ดูและแก้ไข memory ได้ใน Settings (การตั้งค่า)
- ลบข้อมูลที่ไม่ต้องการได้
- ปิด memory ได้ถ้าไม่ต้องการ

---

## แผนต่างๆ ของ Claude.ai

### Free
- พูดคุยกับ Claude ได้ฟรี
- จำกัด usage (การใช้งาน) รายวัน
- เข้าถึงโมเดล (สมองของ AI) Claude ได้ (อาจจำกัดรุ่น)
- Projects สูงสุด 5 โปรเจกต์

### Pro ($20/เดือน)
- Usage มากขึ้นอย่างมีนัยสำคัญ
- เข้าถึงโมเดล Claude ทุกรุ่นรวม Opus
- Projects ไม่จำกัด + RAG
- Priority access (สิทธิ์เข้าถึงก่อน) ช่วง peak hours (ช่วงเวลาใช้งานสูงสุด)

### Max ($100/เดือน)
- Usage มากที่สุด สำหรับ power users (ผู้ใช้ที่ต้องการมาก)
- ทุกอย่างใน Pro + priority support

### Team ($25-30/user/เดือน)
- ทุกอย่างใน Pro
- **Collaboration (การทำงานร่วมกัน)** — แชร์ Projects กับทีมได้
- **Permission management (การจัดการสิทธิ์)** — กำหนดสิทธิ์ "Can use" / "Can edit"
- **Sharing options** — แชร์แบบ individual (รายบุคคล), bulk (เป็นกลุ่ม) หรือ organization-wide (ทั้งองค์กร)
- Admin dashboard (แผงควบคุมสำหรับผู้ดูแล)
- Centralized billing (การเรียกเก็บเงินศูนย์กลาง)

### Enterprise (ราคาตามสัญญา)
- ทุกอย่างใน Team
- Custom data retention policies (นโยบายการเก็บข้อมูลที่กำหนดเอง)
- SSO (Single Sign-On — ล็อกอินครั้งเดียวใช้ได้ทุกระบบ), SCIM provisioning (การจัดการบัญชีผู้ใช้อัตโนมัติ)
- Priority support
- Custom usage limits
- SLA guarantees (การรับประกันระดับการให้บริการ)

---

## การแชร์ Projects (Team/Enterprise)

### Permission Levels

| Permission | ความสามารถ |
|-----------|----------|
| **Can use** | ดูและพูดคุยใน project เท่านั้น |
| **Can edit** | เพิ่ม/แก้ไข instructions (คำสั่ง), files และ settings |

### วิธีแชร์

1. เปิด Project ที่ต้องการแชร์
2. คลิก "Share" หรือ "Manage members"
3. เพิ่ม email หรือ invite ทั้งองค์กร
4. เลือก permission level (ระดับสิทธิ์)

---

## Connectors — เชื่อมต่อกับเครื่องมืออื่น

Connectors (ตัวเชื่อมต่อ — ฟีเจอร์ที่ให้ Claude ดึงข้อมูลจากแอปอื่นๆ มาใช้ได้โดยตรง) ช่วยให้ Claude เข้าถึงข้อมูลจากแหล่งภายนอก:

| Connector | ข้อมูลที่เข้าถึงได้ |
|-----------|-----------------|
| Google Drive | เอกสาร, spreadsheet (ตาราง) |
| Google Calendar | นัดหมาย, ตารางเวลา |
| Slack | ข้อความ, channel (ช่อง) |
| Jira | tickets (คำของาน), projects |
| Confluence | เอกสาร, wiki (คลังความรู้) |
| GitHub | repositories (คลังโค้ด), code |
| Zapier | เชื่อมกับ 6,000+ apps |

> Connectors ต้องการ Team หรือ Enterprise plan สำหรับบางฟีเจอร์

---

## Claude ใน Chrome Extension

**Claude for Chrome** ช่วยให้ใช้ Claude โดยตรงในเบราว์เซอร์ (โปรแกรมท่องเว็บ):

- เลือกข้อความบนเว็บแล้วถาม Claude ได้ทันที
- Summarize (สรุป) หน้าเว็บที่กำลังดูอยู่
- ช่วย draft (ร่าง) reply สำหรับ email หรือ comment
- ไม่ต้องเปลี่ยน tab (หน้าต่างเบราว์เซอร์)

---

## Claude Mobile Apps

Claude มีแอปสำหรับ iOS และ Android:

- พูดคุยกับ Claude ด้วย voice input (การป้อนเสียง)
- เข้าถึง Projects และ conversation history (ประวัติการสนทนา)
- Offline-ready (ใช้งานได้แม้ไม่มีอินเทอร์เน็ต บางฟีเจอร์)
- Widget (ส่วนเสริมบนหน้าจอ) สำหรับ iOS/Android

---

## Claude for Education

สำหรับสถาบันการศึกษา:

- ราคาพิเศษสำหรับ EDU
- ฟีเจอร์ที่เหมาะกับการเรียนการสอน
- นโยบาย privacy (ความเป็นส่วนตัว) ที่เข้มงวดสำหรับผู้เรียน

---

## Tips การใช้ Claude.ai อย่างมีประสิทธิภาพ

### สร้าง Projects ให้ตรงกับงาน

```
Project: "งานวิจัย Marketing 2025"
Instructions (คำสั่ง): ตอบเป็นภาษาไทย เน้นข้อมูลเชิงปริมาณ
Files (ไฟล์): research_brief.pdf, competitor_data.xlsx
```

### ใช้ Custom Instructions อย่างฉลาด

```
"คุณคือที่ปรึกษาด้านกฎหมายไทย ตอบอย่างระมัดระวัง
และเตือนให้ปรึกษาทนายความสำหรับกรณีเฉพาะเจาะจงเสมอ"
```

### เลือก Model ให้เหมาะกับงาน

ใน Claude.ai สามารถเลือกโมเดลได้:
- **Claude Haiku** — งานเร็ว ง่าย ตอบสั้น
- **Claude Sonnet** — งานทั่วไป production-ready (พร้อมใช้งานจริง)
- **Claude Opus** — งานซับซ้อน ต้องการความแม่นยำสูง

---

## สรุป

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|-----------|
| Projects | 5 | ไม่จำกัด | ไม่จำกัด | ไม่จำกัด |
| RAG Mode | - | ✓ | ✓ | ✓ |
| Collaboration (ทำงานร่วมกัน) | - | - | ✓ | ✓ |
| Connectors (ตัวเชื่อมต่อ) | บางส่วน | บางส่วน | เต็ม | เต็ม |
| SSO/SCIM | - | - | - | ✓ |
| Custom Limits | - | - | - | ✓ |

Claude.ai เหมาะสำหรับผู้ที่ต้องการใช้ Claude โดยไม่เขียนโค้ด ด้วย Projects ทำให้สามารถสร้าง AI assistant (ผู้ช่วย AI) เฉพาะงานได้ง่ายๆ ส่วน Team plan เหมาะสำหรับองค์กรที่ต้องการให้ทีมทำงานร่วมกันบน Claude
