---
title: "Grok Build — Coding Agent"
tool: "Grok"
icon: "icon-docs"
level: "beginner"
summary: "Grok Build คือ Coding Agent ที่ทรงพลังและขยายได้ ออกแบบมาสำหรับงานเขียนโค้ดโดยเฉพาะ สามารถใช้งานได้ 3 รูปแบบ:"
readTime: "3 นาที"
readers: "0"
locked: false
order: 3
---
# Grok Build — Coding Agent

> อ้างอิง: [Getting Started](https://docs.x.ai/build/overview) | [Skills, Plugins & Marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces) | [Modes and Commands](https://docs.x.ai/build/modes-and-commands) | [Headless & Scripting](https://docs.x.ai/build/cli/headless-scripting) | [Enterprise](https://docs.x.ai/build/enterprise)

---

## Grok Build คืออะไร?

**Grok Build** คือ Coding Agent ที่ทรงพลังและขยายได้ ออกแบบมาสำหรับงานเขียนโค้ดโดยเฉพาะ สามารถใช้งานได้ 3 รูปแบบ:

- **Interactive TUI** — หน้าจอแบบ Terminal แบบ Full-screen รองรับเมาส์ สำหรับนั่งคุยกับ AI ขณะเขียนโค้ด
- **Headless / Script** — รันคำสั่งเดียวแล้วได้ผลลัพธ์ทันที เหมาะสำหรับ Automation
- **Agent Client Protocol (ACP)** — เชื่อมต่อกับแอปอื่น เช่น IDE หรือ Bot

โมเดลที่ขับเคลื่อน Grok Build คือ `grok-build-0.1` ซึ่งยังใช้ผ่าน API โดยตรงได้ด้วย

---

## ติดตั้ง Grok Build CLI

**macOS / Linux / WSL:**
```bash
curl -fsSL https://x.ai/cli/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://x.ai/cli/install.ps1 | iex
```

---

## เริ่มใช้งาน Interactive Session

```bash
cd your-project   # เข้าโฟลเดอร์โปรเจกต์
grok              # เปิด Grok Build
```

ครั้งแรกจะเปิดบราวเซอร์ให้ล็อกอิน ถ้าอยู่ในสภาพแวดล้อมที่ไม่มีบราวเซอร์ ให้ใช้ API Key:

```bash
export XAI_API_KEY="xai-..."
grok
```

**Prompt แรกที่แนะนำ:**
```
Explain this repo.
@src/main.rs Walk me through this file.
```

---

## รันแบบ Headless (ไม่ต้องเปิดหน้าจอ)

เหมาะสำหรับใช้ใน Script, CI/CD, หรือ Automation:

```bash
grok -p "อธิบาย codebase นี้"
grok -p "อธิบาย architecture" --output-format streaming-json
```

---

## Skills, Plugins และ Marketplaces

อ้างอิง: [Skills, Plugins and Marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces)

### Skills คืออะไร?
Skills คือชุดคำสั่งหรือ Prompt ที่บันทึกไว้ล่วงหน้า สามารถเรียกใช้ได้อย่างรวดเร็วในระหว่างสนทนา เช่น `/test`, `/deploy`, `/review`

### Plugins คืออะไร?
Plugins คือการขยายความสามารถของ Grok Build โดยเชื่อมต่อกับเครื่องมือภายนอก เช่น Database, API, หรือ Service ต่างๆ

### Marketplaces คืออะไร?
Marketplace คือร้านค้าที่รวบรวม Skills และ Plugins จากชุมชน สามารถติดตั้งและใช้งานได้ทันที

---

## Modes and Commands

อ้างอิง: [Modes and Commands](https://docs.x.ai/build/modes-and-commands)

Grok Build มีคำสั่งพิเศษที่ใช้ได้ภายใน TUI:

| คำสั่ง | ผล |
|---|---|
| `/model <name>` | เปลี่ยนโมเดลที่ใช้งาน |
| `grok inspect` | ดูข้อมูล config, skills, plugins, MCP servers ของโปรเจกต์ |

---

## ตั้งค่าโมเดล Custom

ถ้าต้องการใช้โมเดลอื่นที่ไม่ใช่ค่าเริ่มต้น สามารถตั้งค่าใน Config ได้:

```toml
[model.my-model]
model = "model-id"
base_url = "https://api.example.com/v1"
name = "ชื่อที่แสดง"
env_key = "API_KEY"

[models]
default = "my-model"
```

ตรวจสอบ config ด้วย:
```bash
grok inspect
```

เลือกโมเดลในโหมด Headless:
```bash
grok -p "Hello" -m my-model
```

---

## ใช้ grok-build-0.1 ผ่าน API โดยตรง

โมเดล `grok-build-0.1` พร้อมใช้งานผ่าน API (Early Access) สามารถนำไปใส่ใน Agent Loop, IDE Integration, หรือ Coding Tool ของตัวเองได้:

**Python:**
```python
import os
from xai_sdk import Client
from xai_sdk.chat import user

client = Client(api_key=os.getenv("XAI_API_KEY"))

chat = client.chat.create(model="grok-build-0.1")
chat.append(user("แก้ไข Function นี้ให้รองรับ null input ด้วย"))

print(chat.sample().content)
```

**cURL:**
```bash
curl https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-build-0.1",
    "input": "แก้ไข Function นี้ให้รองรับ null input ด้วย"
  }'
```

---

## Enterprise Deployments

อ้างอิง: [Enterprise Deployments](https://docs.x.ai/build/enterprise)

สำหรับองค์กรที่ต้องการ Deploy Grok Build ภายในระบบขององค์กร สามารถติดต่อ xAI ได้ที่ [x.ai/grok/business/enquire](https://x.ai/grok/business/enquire) เพื่อรับ White-glove support และฟีเจอร์ระดับ Enterprise

---

## สรุป — เมื่อไหรควรใช้อะไร?

| สถานการณ์ | วิธีใช้ |
|---|---|
| นั่งเขียนโค้ดทั่วไปกับ AI | Grok Build TUI (`grok`) |
| รัน Script อัตโนมัติ | Headless mode (`grok -p "..."`) |
| สร้างแอปหรือ IDE Plugin ของตัวเอง | API โดยตรง + `grok-build-0.1` |
| ใช้งานในองค์กรขนาดใหญ่ | Enterprise Deployment |
