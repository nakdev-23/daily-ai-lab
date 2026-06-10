---
title: "ภาพรวม, เริ่มต้นใช้งาน และ Concepts ทั้งหมด"
tool: "Codex"
icon: "icon-docs"
level: "beginner"
summary: "Codex คือ Coding Agent (ตัวแทน AI สำหรับงานพัฒนาซอฟต์แวร์) โดย OpenAI ออกแบบมาเพื่อช่วยนักพัฒนาและทีม Engineering ทำงานเขียนโค้ด ท"
readTime: "9 นาที"
readers: "0"
locked: false
order: 1
---
# Codex คู่มือภาษาไทย — ตอนที่ 1: ภาพรวม, เริ่มต้นใช้งาน และ Concepts ทั้งหมด
> อ้างอิงหลัก: [Codex Overview](https://developers.openai.com/codex) | [Codex Docs](https://developers.openai.com/codex)

---

## Codex คืออะไร
อ้างอิง: [Overview](https://developers.openai.com/codex)

### หัวข้อนี้คืออะไร
Codex คือ **Coding Agent (ตัวแทน AI สำหรับงานพัฒนาซอฟต์แวร์)** โดย OpenAI ออกแบบมาเพื่อช่วยนักพัฒนาและทีม Engineering ทำงานเขียนโค้ด ทบทวนโค้ด แก้บัค และจัดการงาน Dev ต่างๆ ในแบบ Agentic คือทำได้หลายขั้นตอนโดยอัตโนมัติ

สรุปในหนึ่งประโยค: **"One agent for everywhere you code"** — Codex ใช้ได้ทุกที่ที่คุณเขียนโค้ด

### ใช้ทำอะไรได้บ้าง
Codex ช่วยได้ทั้ง 5 ด้านหลัก:
- **เขียนโค้ด**: อธิบายว่าต้องการอะไร Codex จะสร้างโค้ดที่เหมาะกับ Project และ Convention ของคุณ
- **ทำความเข้าใจ Codebase ที่ไม่รู้จัก**: อ่านและอธิบายโค้ดซับซ้อนหรือ Legacy Code
- **รีวิวโค้ด**: วิเคราะห์โค้ดหา Bug, Logic Error และ Edge Cases
- **Debug และแก้ไขปัญหา**: ช่วยตามหาสาเหตุของ Error และเสนอวิธีแก้ไข
- **Automate งาน Dev**: Refactoring, Testing, Migration, Setup ซ้ำๆ โดยอัตโนมัติ

### แผนที่รองรับ
Codex รวมอยู่ในทุกแผนของ ChatGPT: **Free, Go, Plus, Pro, Business, Edu, และ Enterprise**

นอกจากนั้นยังใช้ Codex ผ่าน OpenAI API key ได้

---

## Quickstart — เริ่มต้นใช้งาน Codex
อ้างอิง: [Quickstart](https://developers.openai.com/codex/quickstart)

### หัวข้อนี้คืออะไร
วิธีเริ่มต้นใช้งาน Codex ตั้งแต่ศูนย์ มีให้เลือก 4 ช่องทาง ได้แก่ App (แนะนำ), IDE Extension, CLI และ Cloud

### ช่องทาง 1: Codex App (แนะนำ)

**วิธีติดตั้ง:**

1. ดาวน์โหลด Codex App
   - macOS (Apple Silicon): [ดาวน์โหลด](https://persistent.oaistatic.com/codex-app-prod/Codex.dmg)
   - macOS (Intel): [ดาวน์โหลด](https://persistent.oaistatic.com/codex-app-prod/Codex-latest-x64.dmg)
   - Windows: ดาวน์โหลดผ่าน Microsoft Store
   - Linux: รอ Notification ทางอีเมล (ยังไม่เปิดให้โหลด)
2. เปิด App และ Sign in ด้วย ChatGPT Account หรือ OpenAI API Key
3. เลือก Project Folder ที่ต้องการให้ Codex ทำงาน
4. ตั้งค่า **Local** และส่ง Prompt แรก

**ตัวอย่าง Prompt เริ่มต้น:**
```
Tell me about this project
Build a classic Snake game in this repo.
Find and fix bugs in my codebase with minimal, high-confidence changes.
```

> **หมายเหตุ**: ถ้า Sign in ด้วย OpenAI API Key บางฟีเจอร์อย่าง Cloud Threads อาจใช้ไม่ได้

### ช่องทาง 2: IDE Extension

**รองรับ IDE:**
- Visual Studio Code
- Cursor
- Windsurf
- Visual Studio Code Insiders

**วิธีติดตั้ง:**
1. ค้นหา "Codex" หรือ "openai.chatgpt" ใน Extension Marketplace ของ IDE ที่ใช้
2. เปิด Codex Panel ในแถบ Sidebar
3. Sign in แล้วเริ่มงานได้เลย

Codex IDE Extension เริ่มต้นใน **Agent Mode** — อ่านไฟล์, รันคำสั่ง และแก้ไขโค้ดใน Project ได้เลย

> **ข้อแนะนำ**: สร้าง Git Checkpoint ก่อนและหลังทำงานแต่ละ Task เสมอ เพื่อ Revert ได้ถ้าเกิดปัญหา

### ช่องทาง 3: CLI (Command Line Interface)

Codex CLI ทำงานในเทอร์มินัล รองรับ Agent Mode เช่นกัน

### ช่องทาง 4: Cloud (Web Browser)

ทำงานในระบบ Cloud ของ Codex โดยตรง เหมาะกับงาน Parallel หรืองานที่ต้องการ Delegate จากเครื่องอื่น

**วิธีทบทวนผลงาน (สำหรับ Cloud):**
หลังงานเสร็จ รีวิว Diff ที่เสนอมา จากนั้น Accept หรือ Checkout Branch มาทดสอบในเครื่องตัวเอง:
```
git fetch
git checkout <branch-name>
```

---

## ราคาและแผน (Pricing)
อ้างอิง: [Pricing](https://developers.openai.com/codex/pricing)

### หัวข้อนี้คืออะไร
Codex รวมอยู่ในทุก ChatGPT Plan โดยไม่คิดค่าใช้จ่ายเพิ่มเติม มีจำกัดการใช้งานตามแผน

### สรุปราคา

| แผน | Codex | หมายเหตุ |
|---|---|---|
| Free | ✅ มี | จำกัดการใช้งาน |
| Go | ✅ มี | จำกัดการใช้งาน |
| Plus ($20/เดือน) | ✅ มี | ใช้ได้มากขึ้น |
| Pro ($200/เดือน) | ✅ มี | ใช้ได้มากขึ้น + gpt-5.3-codex-spark (Preview) |
| Business / Team | ✅ มี | สำหรับทีม |
| Edu | ✅ มี | สำหรับสถาบันการศึกษา |
| Enterprise | ✅ มี | ปรับแต่งได้เต็มที่ |

นอกจากแผน ChatGPT ยังใช้ Codex ผ่าน API Credits ได้อีกด้วย

---

## การย้าย (Migrate to Codex)
อ้างอิง: [Migrate](https://developers.openai.com/codex/migrate)

### หัวข้อนี้คืออะไร
ถ้าเคยใช้เครื่องมือ AI Coding อื่นๆ อยู่ ต้องการ Migrate Config, MCP Server, Skills และ Subagents มาที่ Codex สามารถทำได้

### สิ่งที่รองรับการ Migrate:
- ไฟล์คำสั่ง (Instruction files) เช่น `.cursorrules`, `CLAUDE.md` ฯลฯ
- MCP Server Configuration
- Skills และ Subagents

---

## Concepts — แนวคิดสำคัญใน Codex

---

## Prompting — การสั่งงาน Codex
อ้างอิง: [Prompting](https://developers.openai.com/codex/prompting)

### หัวข้อนี้คืออะไร
วิธีการสั่งงาน (Prompt) Codex ให้ได้ผลลัพธ์ที่ดีที่สุด ครอบคลุมเรื่อง Threads, Context และ Goal Mode

### Prompts
คุณสื่อสารกับ Codex ผ่าน Prompt (ข้อความที่บอกว่าต้องการอะไร) เมื่อส่ง Prompt แล้ว Codex จะทำงานในลูป: เรียก AI Model → ดำเนินการตามที่ AI บอก (อ่านไฟล์, แก้ไขไฟล์, เรียก Tool) วนไปจนกว่างานจะเสร็จหรือคุณยกเลิก

**ตัวอย่าง Prompt:**
```
Explain how the transform module works and how other modules use it.
```
```
Add a new command-line option `--json` that outputs JSON.
```

**เคล็ดลับการ Prompt:**
- **บอกวิธีตรวจสอบผลงาน** — Codex ทำงานได้ดีขึ้นมากเมื่อรู้ว่าต้องทดสอบยังไง บอกขั้นตอน Reproduce, Validate Feature, Linting, Pre-commit Checks
- **แบ่งงานใหญ่เป็นชิ้นเล็กๆ** — งานเล็กทดสอบง่ายและรีวิวได้ง่ายกว่า ถ้าไม่แน่ใจว่าจะแบ่งยังไง ให้ถาม Codex ช่วยวาง Plan

### Threads (เธรด)
Thread คือ Session การทำงานหนึ่งครั้ง: Prompt + ผลลัพธ์ + Tool Calls ทั้งหมดที่ตามมา Thread หนึ่งอาจมี Prompt หลายครั้ง (เช่น Prompt แรก implement feature, Prompt ต่อมาเพิ่ม test)

**ประเภทของ Thread:**

| ประเภท | รันที่ไหน | เหมาะกับ |
|---|---|---|
| **Local Thread** | เครื่องของคุณ | งานที่ต้องดูการเปลี่ยนแปลง Real-time ใช้ Tools เดิมที่มี |
| **Cloud Thread** | Environment แยกต่างหาก | งาน Parallel หลายงาน หรือ Delegate จาก Device อื่น |

> **หมายเหตุ**: Local Threads รันใน Sandbox เพื่อลดความเสี่ยงการเปลี่ยนแปลงนอก Workspace โดยไม่ตั้งใจ

ใน Codex App ยังสร้าง **Chat** โดยไม่เลือก Project ได้ด้วย Chat ไม่ผูกกับ Repository ใด เหมาะกับงานวิจัย วางแผน หรือ Connected-tool Workflows

### Context Window
ข้อมูลทั้งหมดใน Thread ต้องจุอยู่ใน Context Window ของ Model Codex จะ Monitor และรายงาน Space ที่เหลือ สำหรับงานยาวๆ Codex อาจ **Compact** Context โดย Summarize ข้อมูลที่สำคัญและตัดข้อมูลที่ไม่จำเป็นออก

### Goal Mode
Goal Mode ให้ Codex มี **เป้าหมายถาวร** ที่ต้องทำจนสำเร็จ เหมาะกับงานที่ต้องใช้หลายขั้นตอน

**วิธีเริ่ม Goal Mode:** พิมพ์ `/goal` ใน Codex App, IDE Extension หรือ CLI

ถ้า `/goal` ไม่ปรากฏ ให้เปิดใน `config.toml`:
```toml
[features]
goals = true
```

**ตัวอย่าง Goal ที่ดี:**
```
Migrate this codebase from JavaScript to TypeScript. The app should compile in
strict mode without explicit `any` type definitions.
```
```
Reduce the time to interactive of the home page to below 1 second.
```

**เคล็ดลับเขียน Goal ดี:** ระบุผลลัพธ์ที่วัดได้ชัดเจน หรือเงื่อนไขทดสอบที่ชัดเจน ถ้ากำหนด Goal ยาก ใช้ `/plan` ก่อนแล้วให้ Codex ช่วยร่าง Goal

---

## Customization — ปรับแต่งพฤติกรรม Codex
อ้างอิง: [Customization](https://developers.openai.com/codex/concepts/customization)

### หัวข้อนี้คืออะไร
วิธีปรับให้ Codex ทำงานตรงกับสไตล์และ Workflow ของทีมหรือโปรเจกต์ ครอบคลุมตั้งแต่ AGENTS.md, Rules, Hooks ไปจนถึง MCP

### เครื่องมือปรับแต่ง

| เครื่องมือ | ใช้ทำอะไร |
|---|---|
| **AGENTS.md** | คำสั่งเฉพาะ Repository ที่ Codex อ่านก่อนทำงาน |
| **config.toml** | ตั้งค่าพื้นฐาน (Model, Permissions, Features) |
| **Rules** | กำหนดว่าคำสั่ง Shell ไหนอนุญาต/ห้าม |
| **Hooks** | Script ที่รันอัตโนมัติก่อน/หลังเหตุการณ์บางอย่าง |
| **Skills** | ชุดคำสั่ง/ขั้นตอนที่ใช้ซ้ำได้ข้ามโปรเจกต์ |
| **MCP** | เชื่อมต่อ Server ภายนอกเพื่อขยายความสามารถ |
| **Plugins** | Bundle ของ Tools, Skills และ MCP ที่ติดตั้งเพิ่มได้ |
| **Subagents** | Agent ย่อยที่ Codex สร้างขึ้นมาเพื่อทำงานย่อยๆ |

---

## Memories — ความทรงจำข้ามเธรด
อ้างอิง: [Memories](https://developers.openai.com/codex/memories)

### หัวข้อนี้คืออะไร
Memories ให้ Codex "จำ" บริบทจาก Thread เก่าๆ และนำมาใช้ใน Thread ใหม่ เช่น สไตล์การเขียนโค้ด, Tech Stack ที่ใช้, Convention ของโปรเจกต์

### รายละเอียดสำคัญ
- **ปิดไว้เป็นค่าเริ่มต้น** — ต้องเปิดด้วยตนเอง
- **ยังไม่รองรับ**: สหภาพยุโรป (EEA), สหราชอาณาจักร, และสวิตเซอร์แลนด์

### วิธีเปิด Memories

ใน Codex App: ไปที่ Settings → เปิด Memories

ใน config.toml:
```toml
[features]
memories = true
```

### วิธีการทำงาน
Codex แปลงบริบทจาก Thread ที่ผ่านมาเป็น Memory Files เก็บไว้ที่ `~/.codex/memories/` โดยอัตโนมัติ

Codex จะ:
- ข้ามการบันทึก Session สั้นๆ หรือ Session ที่ยังทำงานอยู่
- ลบ Secrets ออกก่อนบันทึก
- อัปเดต Memories ในพื้นหลัง ไม่ใช่ทันทีหลัง Thread จบ

### Settings ที่เกี่ยวข้อง

| Setting | ความหมาย |
|---|---|
| `memories.generate_memories` | ควบคุมว่า Thread ใหม่จะถูกบันทึกเป็น Memory Input หรือไม่ |
| `memories.use_memories` | ควบคุมว่า Codex จะดึง Memory มาใช้ใน Session ใหม่หรือไม่ |
| `memories.extract_model` | Override Model ที่ใช้ Extract Memory จาก Thread |
| `memories.consolidation_model` | Override Model ที่ใช้ Consolidate Memory ทั้งหมด |

### Chronicle
อ้างอิง: [Chronicle](https://developers.openai.com/codex/memories/chronicle)

Chronicle เป็น Feature เสริมของ Memories ที่บันทึก Timeline การทำงานของ Codex เช่น ทำงานอะไรไปบ้าง เมื่อไหร่ ผลลัพธ์เป็นอย่างไร

### ข้อควรระวัง
อย่าเก็บ Secret ใน Memories แม้ Codex จะ Redact อัตโนมัติ แต่ควรรีวิว Memory Files ก่อนแชร์ Codex Home Directory กับผู้อื่น

---

## Sandboxing — พื้นที่ทำงานที่ปลอดภัย
อ้างอิง: [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)

### หัวข้อนี้คืออะไร
Sandbox คือขอบเขตที่ Codex ทำงานได้ โดยไม่ให้ Codex เข้าถึงเครื่องของคุณแบบไม่จำกัด ช่วยให้ทำงาน Autonomous ได้โดยไม่ต้องกดยืนยันทุกคำสั่ง

### Sandbox ทำอะไรบ้าง
Sandbox ใช้กับ **คำสั่ง Shell ทั้งหมด** ไม่ใช่แค่การ Edit ไฟล์โดยตรง ดังนั้น `git`, `npm`, `pytest` และ Tool อื่นๆ ที่ Codex รันก็อยู่ใน Sandbox เช่นกัน

Codex ใช้ Platform-native Enforcement:
- **macOS**: Seatbelt Framework (ใช้ได้เลย ไม่ต้องติดตั้งเพิ่ม)
- **Windows**: Windows Sandbox (ใน PowerShell) หรือ Linux Sandbox (ใน WSL2)
- **Linux/WSL2**: `bubblewrap` — ต้องติดตั้งก่อน: `sudo apt install bubblewrap`

### Sandbox Modes

| Mode | ความหมาย |
|---|---|
| `read-only` | Codex อ่านไฟล์ได้ แต่แก้ไขหรือรันคำสั่งต้องขอ Approve |
| `workspace-write` | Codex อ่าน แก้ไขใน Workspace และรัน Routine Commands ได้ (ค่าเริ่มต้น) |
| `danger-full-access` | Codex รันโดยไม่มีขอบเขต — ไม่มี Filesystem/Network Limit |

### Approval Policies

| Policy | ความหมาย |
|---|---|
| `untrusted` | Codex ขอ Approve ก่อนรัน Command ที่ไม่อยู่ใน Trusted List |
| `on-request` | Codex ทำงานปกติใน Sandbox แต่ขอ Approve ถ้าต้องออกนอกขอบเขต (ค่าเริ่มต้น) |
| `never` | Codex ไม่หยุดขอ Approve เลย |

### ตัวเลือกผู้ Approve

| ค่า | ความหมาย |
|---|---|
| `user` | Approve ด้วยตัวเองผ่าน UI (ค่าเริ่มต้น) |
| `auto_review` | ให้ AI Reviewer Agent Approve อัตโนมัติ |

### ตั้งค่าใน config.toml
```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
approvals_reviewer = "user"
```

สำหรับ Full Access (ไม่มี Limit):
```toml
sandbox_mode = "danger-full-access"
approval_policy = "never"
```

### Auto-review
อ้างอิง: [Auto-review](https://developers.openai.com/codex/concepts/sandboxing/auto-review)

Auto-review คือตัวเลือกที่ให้ AI Agent ตรวจสอบและ Approve การกระทำที่ต้องขออนุญาต โดยอัตโนมัติ แทนที่จะต้องให้คนมากด Approve ทุกครั้ง

เปิดใช้: `approvals_reviewer = "auto_review"` ใน config.toml

---

## Subagents — การทำงานหลาย Agent พร้อมกัน
อ้างอิง: [Subagents](https://developers.openai.com/codex/concepts/subagents)

### หัวข้อนี้คืออะไร
Subagents คือ Agent ย่อยที่ Codex Main สร้างขึ้นเพื่อทำงานส่วนย่อยๆ ควบคู่กัน ทำให้ Codex ทำงานได้เร็วขึ้นโดยแบ่งงานใหญ่ออกเป็นงานเล็กๆ ที่รันพร้อมกัน

### ใช้ทำอะไร
- ทดสอบหลายสภาวะพร้อมกัน
- Refactor หลาย Module ในคราวเดียว
- รัน Script ต่างๆ แบบ Parallel

---

## Workflows — ขั้นตอนการทำงาน
อ้างอิง: [Workflows](https://developers.openai.com/codex/workflows)

### หัวข้อนี้คืออะไร
Workflows คือรูปแบบการทำงานแนะนำสำหรับ Task ประเภทต่างๆ เช่น การ Debug, การ Refactor, การเพิ่ม Feature ใหม่

### ตัวอย่าง Workflow ที่ควรรู้
- **Understand a codebase**: ให้ Codex สรุปโครงสร้างก่อน แล้วถามเรื่องส่วนที่สนใจ
- **Implement a feature**: เริ่มด้วยการให้ Codex ออกแบบ Plan ก่อน ทบทวน แล้วค่อยให้ implement
- **Fix a bug**: ส่ง Error Message + Steps to Reproduce ให้ Codex วิเคราะห์
- **Refactor**: แบ่งเป็น Chunk เล็กๆ ทดสอบทีละส่วน

---

## Models — โมเดล AI ที่ขับเคลื่อน Codex
อ้างอิง: [Models](https://developers.openai.com/codex/models)

### หัวข้อนี้คืออะไร
Codex ใช้หลาย AI Model แต่ละตัวมีจุดเด่นต่างกัน คุณเลือก Model ได้ตามลักษณะงาน

### โมเดลแนะนำ

| Model | ความสามารถ | ความเร็ว | ช่องทาง |
|---|---|---|---|
| **gpt-5.5** | สูงสุด — สำหรับงานซับซ้อน, Computer Use, Research | ปานกลาง | App, IDE, CLI, Cloud, API |
| **gpt-5.4** | สูงมาก — Flagship สำหรับงาน Professional | ดี | App, IDE, CLI, Cloud, API |
| **gpt-5.4-mini** | ดี — เร็ว ประหยัด เหมาะกับงาน Routine | เร็วมาก | App, IDE, CLI, Cloud, API |
| **gpt-5.3-codex** | สูงมาก — Industry-leading Coding Model | ปานกลาง | App, IDE, CLI, Cloud, API |
| **gpt-5.3-codex-spark** | ดี — Real-time iteration สำหรับ Pro Users | เร็วมาก | App (Pro เท่านั้น) |

> **คำแนะนำจาก OpenAI**: เริ่มด้วย `gpt-5.5` สำหรับงานทั่วไป ใช้ `gpt-5.4-mini` เมื่อต้องการความเร็วหรือประหยัดค่าใช้จ่าย

### ตั้งค่า Model ใน config.toml
```toml
model = "gpt-5.5"
```

### เปลี่ยน Model ชั่วคราวใน CLI
```
codex -m gpt-5.5
```
หรือพิมพ์ `/model` ใน Thread ที่กำลังรันอยู่

### วิธีเปลี่ยน Model ใน IDE Extension
ใช้ Model Selector ที่อยู่ใต้ช่อง Input ของ IDE Extension

> **ข้อจำกัด**: ปัจจุบันยังไม่สามารถเปลี่ยน Default Model สำหรับ Cloud Tasks ได้

---

## Cyber Safety — ความปลอดภัยทางไซเบอร์
อ้างอิง: [Cyber Safety](https://developers.openai.com/codex/concepts/cyber-safety)

### หัวข้อนี้คืออะไร
ข้อกำหนดด้านความปลอดภัยเกี่ยวกับสิ่งที่ Codex ทำได้และทำไม่ได้ในด้าน Cybersecurity

### สิ่งที่ Codex ไม่ทำ
Codex มีการควบคุม Safety เพื่อป้องกัน Dual-use ทางด้าน Cybersecurity เช่น Codex จะ **ไม่** ช่วยพัฒนา:
- Malware หรือ Ransomware
- Exploit Scripts ที่ใช้โจมตีระบบจริง
- Tools สำหรับ Unauthorized Access

### สิ่งที่ Codex ทำได้
- ช่วย Security Researchers ทำ Legitimate Research
- ช่วยวิเคราะห์ Vulnerabilities ใน Codebase ของตัวเอง
- Penetration Testing ในสภาวะที่มีการอนุญาต

---

## สรุป: ช่องทางเริ่มต้น Codex

| ถ้าคุณ... | ใช้ช่องทาง |
|---|---|
| ต้องการประสบการณ์ดีที่สุด | Codex App (macOS/Windows) |
| เขียนโค้ดอยู่ใน VS Code / Cursor | IDE Extension |
| ชอบทำงานในเทอร์มินัล | CLI |
| ต้องการรัน Task Parallel หรือจาก Device อื่น | Cloud (Web) |

---

## หัวข้อที่ยังไม่ได้เรียบเรียง

| หัวข้อ | เหตุผล | ลิงก์ |
|---|---|---|
| Use Cases ทั้งหมด | รวบรวมได้จากหน้า Use Cases | [link](https://developers.openai.com/codex/use-cases) |
| Glossary | อยู่ระหว่างรวบรวม | [link](https://developers.openai.com/codex/glossary) |
