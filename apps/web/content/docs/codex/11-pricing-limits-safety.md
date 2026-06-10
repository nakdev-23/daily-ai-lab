---
title: "Pricing, Limits และ Cyber Safety"
tool: "Codex"
icon: "icon-docs"
level: "pro"
summary: "ครอบคลุม Plans ทั้งหมดของ Codex, Usage Limits, Credit Rates, Sandboxing Modes และ Cyber Safety Program สำหรับนักพัฒนาและทีม Security"
readTime: "7 นาที"
readers: "0"
locked: false
order: 11
---

# Codex คู่มือภาษาไทย — ตอนที่ 11: Pricing, Limits และ Cyber Safety

> อ้างอิงหลัก: [Codex Pricing](https://developers.openai.com/codex/pricing) | [Codex Sandboxing](https://developers.openai.com/codex/concepts/sandboxing) | [Cyber Safety](https://developers.openai.com/codex/concepts/cyber-safety)

---

## Plans และ Pricing

### แผนสำหรับบุคคลทั่วไป

| Plan | ราคา/เดือน | เหมาะกับ |
|------|-----------|---------|
| **Free** | $0 | ลองใช้งาน, quick coding tasks |
| **Go** | $8 | งาน Coding เบาๆ |
| **Plus** | $20 | Developer ที่ใช้งานจริง |
| **Pro** | จาก $100 | Power users, Rate limits (ขีดจำกัดความถี่การใช้) สูงกว่า |

### แผนสำหรับองค์กร

| Plan | ราคา | เหมาะกับ |
|------|------|---------|
| **Business** | Pay as you go | ทีม, มี SSO (ลงชื่อเข้าระบบครั้งเดียวใช้ได้ทุกบริการ)/MFA (การยืนยันตัวตนหลายขั้นตอน) |
| **Enterprise & Edu** | ติดต่อ Sales | องค์กรขนาดใหญ่, Enterprise security |

---

## Features ตามแต่ละ Plan

### Plus ($20/เดือน) — แนะนำสำหรับ Developer ทั่วไป

- Web interface, CLI (ส่วนต่อประสานบรรทัดคำสั่ง), IDE Extension (ส่วนขยายโปรแกรมแก้โค้ด), iOS app
- Models: GPT-5.5, GPT-5.4, GPT-5.3-Codex
- Cloud integrations: Code review, Slack
- Extensible (ขยายได้) ด้วย Credits (หน่วยนับการใช้งาน) เพิ่มเติม

### Pro (จาก $100/เดือน) — สำหรับ Power Users

ทุกอย่างใน Plus บวก:
- Rate limits สูงกว่า Plus 5x หรือ 20x (เลือกได้)
- GPT-5.3-Codex-Spark (Research Preview, Latency (ความหน่วง — เวลาตอบสนอง) ต่ำ)

### Business — Pay as you go

ทุกอย่างใน Plus บวก:
- Standard หรือ Usage-based seats (ที่นั่งตามการใช้งาน)
- VM (Virtual Machine — เครื่องคอมพิวเตอร์เสมือน) ขนาดใหญ่กว่าสำหรับ Cloud tasks
- SAML SSO (มาตรฐาน SSO สำหรับองค์กร), MFA
- ไม่ใช้ข้อมูลสำหรับ Training โดย Default

### Enterprise & Edu

ทุกอย่างใน Business บวก:
- Priority processing (ประมวลผลก่อน)
- Enterprise security: SCIM (ระบบจัดการผู้ใช้อัตโนมัติ), EKM (การจัดการกุญแจเข้ารหัสของตัวเอง), RBAC (ควบคุมสิทธิ์ตามบทบาท)
- Audit logs (บันทึกการใช้งาน), Usage monitoring (ติดตามการใช้งาน)
- Data residency controls (ควบคุมว่าข้อมูลเก็บอยู่ที่ไหน)

---

## Usage Limits (5-hour Rolling Window)

Rate limits (ขีดจำกัดความถี่) คำนวณตาม **5 ชั่วโมงที่ผ่านมา** ไม่ใช่ reset รายวัน

### Plus และ Business

| Model | Messages ต่อ 5 ชั่วโมง |
|-------|----------------------|
| GPT-5.5 | 15–80 |
| GPT-5.4 | 20–100 |
| GPT-5.4-mini | 60–350 |

### Pro 5x

| Model | Messages ต่อ 5 ชั่วโมง |
|-------|----------------------|
| GPT-5.5 | 80–400 |
| GPT-5.4 | 100–500 |
| GPT-5.4-mini | 300–1,750 |

### Pro 20x

| Model | Messages ต่อ 5 ชั่วโมง |
|-------|----------------------|
| GPT-5.5 | 300–1,600 |
| GPT-5.4 | 400–2,000 |
| GPT-5.4-mini | 1,200–7,000 |

> **หมายเหตุ:** Limits อยู่ในช่วง (เช่น 15–80) เพราะปรับตาม System Load (ภาระงานของระบบ) ขณะนั้น

---

## Credit Rates (ซื้อเพิ่มได้)

ถ้าใช้เกิน Limit สามารถซื้อ Credits เพิ่มได้ คิดราคาต่อ 1 ล้าน Tokens (หน่วยข้อความ — ประมาณ 1 คำ):

| Model | Input | Cached Input (ข้อมูลที่เคยประมวลผลแล้ว) | Output |
|-------|-------|--------------|--------|
| GPT-5.5 | 125 credits | 12.50 credits | 750 credits |
| GPT-5.4 | 62.50 credits | 6.25 credits | 375 credits |
| GPT-5.4-mini | 18.75 credits | 1.875 credits | 113 credits |
| GPT-5.3-Codex | 43.75 credits | 4.375 credits | 350 credits |

### ค่าใช้จ่ายต่อ Message โดยเฉลี่ย

GPT-5.5 ใช้ประมาณ **5–45 Credits ต่อ message** ขึ้นกับความซับซ้อน

**Fast Mode** ใช้ Credits มากกว่า เพราะทำงานเร็วขึ้นด้วย Resources (ทรัพยากรคอมพิวเตอร์) มากกว่า

### API Key Pricing (ใช้โดยตรงผ่าน API)

- คิดราคาตาม Standard API rates
- ไม่รวม Cloud features (Code Review, Slack ฯลฯ)
- เข้าถึง Model ใหม่ช้ากว่า Subscription

---

## Sandboxing — Execution Environment

Sandboxing (การทำงานในพื้นที่จำกัด) คือระบบ Isolation (แยกพื้นที่ทำงาน) ที่ทำให้ Codex ทำงานใน Bounded Environment (สภาพแวดล้อมที่มีขอบเขต) ปลอดภัย

### ทำงานอย่างไร

Sandbox ครอบคลุม **ทุก Command ที่ Codex รัน** ไม่ใช่แค่ File Operations:
- `git` commands
- Package managers (npm, pip ฯลฯ)
- Test runners (โปรแกรมรันทดสอบ)
- Build tools (เครื่องมือสร้างโปรแกรม)

**OS-level Enforcement (การบังคับใช้ระดับระบบปฏิบัติการ):**
- macOS: ใช้ Built-in Seatbelt framework
- Windows: Windows Sandbox หรือ WSL2 (ระบบ Linux บน Windows)
- Linux/WSL2: ใช้ `bubblewrap` (ต้อง install แยก)

### Sandbox Modes

| Mode | การอ่านไฟล์ | การแก้ไขไฟล์ | การรัน Commands | เหมาะกับ |
|------|-----------|------------|----------------|---------|
| **read-only** (อ่านอย่างเดียว) | ✓ | ต้องขออนุมัติ | ต้องขออนุมัติ | Review, Audit |
| **workspace-write** (เขียนในพื้นที่ทำงาน) | ✓ | ✓ (ใน workspace) | ✓ (routine) | งานทั่วไป (Default) |
| **danger-full-access** (เข้าถึงทุกอย่าง) | ✓ | ✓ (ทุกที่) | ✓ (ทุกอย่าง) | Advanced, ระวัง! |

### Approval Policies (นโยบายขออนุมัติ)

| Policy | พฤติกรรม |
|--------|---------|
| **untrusted** | ถามก่อนทุก non-trusted command |
| **on-request** | ทำงานอัตโนมัติ ถามเมื่อต้องข้าม Sandbox boundary |
| **never** | ไม่ถามเลย (ทำงานใน Sandbox เต็มรูปแบบ) |

### ตั้งค่าใน config.toml

```toml
[settings]
sandbox_mode = "workspace-write"       # หรือ read-only, danger-full-access
approval_policy = "on-request"         # หรือ untrusted, never

[sandbox_workspace_write]
writable_roots = [
  "~/projects/my-app",                 # อนุญาตเขียนในโฟลเดอร์นี้
]
```

### Auto-review Mode

แทนที่จะขอ Approval (การอนุมัติ) จากผู้ใช้ตรงๆ Codex สามารถส่ง Approval Request ไปให้ **Reviewer Agent** (Agent AI ที่ทำหน้าที่ตรวจสอบ) ตัดสินใจแทนได้ ช่วยให้ทำงานได้ต่อเนื่องโดยไม่ Interrupt (ขัดจังหวะ) ผู้ใช้

### Command-level Rules

ปรับ Rules สำหรับ Command (คำสั่ง) เฉพาะได้ โดยไม่ต้องขยาย Sandbox ทั้งหมด:

```toml
[[rules]]
name = "allow npm scripts"
command_prefix = "npm run"
action = "allow"

[[rules]]
name = "block network access"
command_prefix = "curl"
action = "deny"

[[rules]]
name = "prompt for docker"
command_prefix = "docker"
action = "prompt"
```

---

## การติดตั้ง Sandboxing บน Linux/WSL2

Linux และ WSL2 ต้อง install `bubblewrap` แยก:

```bash
# Ubuntu/Debian
sudo apt install bubblewrap

# Fedora
sudo dnf install bubblewrap
```

Ubuntu 25.04+ จะมี AppArmor profile (โปรไฟล์ควบคุมสิทธิ์โปรแกรม) support อัตโนมัติ

รุ่นเก่ากว่าอาจต้อง load profile ด้วยตนเอง

---

## Cyber Safety Program

GPT-5.3-Codex ถูกจัดว่ามี **"High cybersecurity capability"** (ความสามารถด้านความมั่นคงไซเบอร์สูง) ตาม OpenAI Preparedness Framework จึงมีระบบป้องกันพิเศษ

### ทำไมต้องมี Cyber Safety

Codex มีความสามารถด้าน Cybersecurity (ความมั่นคงไซเบอร์) สูง ซึ่งมีประโยชน์สำหรับ:
- Penetration Testing (ทดสอบเจาะระบบ — การจำลองการโจมตีเพื่อหาช่องโหว่)
- Vulnerability Research (การวิจัยช่องโหว่)
- Malware Analysis (การวิเคราะห์มัลแวร์)

แต่เทคนิคเดียวกันอาจถูกใช้เพื่อจุดประสงค์ไม่ดีได้

### กลไกป้องกัน

**1. Safety Training**
Model ถูก Train ให้ปฏิเสธ Request ที่ดูเหมือน Malicious (เป็นอันตราย)

**2. Automated Monitoring (การตรวจสอบอัตโนมัติ)**
Classifier (ระบบจำแนกประเภท) ตรวจจับกิจกรรม Cyber ที่น่าสงสัย Traffic (การรับส่งข้อมูล) ที่มีความเสี่ยงสูงจะถูก Reroute (เปลี่ยนเส้นทาง) ไปยัง GPT-5.2 (ความสามารถน้อยกว่า) แต่กระทบ Traffic น้อยมาก

**3. Trusted Access Program (โปรแกรมเข้าถึงที่เชื่อถือได้)**
สำหรับนักพัฒนาที่ทำงาน Security จริงๆ สามารถขอสิทธิ์เพิ่มได้

---

## Trusted Cyber Access — สำหรับ Security Professionals

### วิธีขอสิทธิ์

**รายบุคคล:**
ยืนยันตัวตนที่ [chatgpt.com/cyber](https://chatgpt.com/cyber)

**ระดับองค์กร:**
ติดต่อ OpenAI representative เพื่อขอ Team-wide access

**Advanced Researchers:**
มี Invite-only program สำหรับ Security researcher ที่ต้องการ Model ที่มีความสามารถสูงขึ้น

### ข้อกำหนด

ผู้ที่ได้รับสิทธิ์ยังต้องปฏิบัติตาม:
- OpenAI Usage Policies (นโยบายการใช้งาน)
- Terms of Use ทั้งหมด

### False Positives (การแจ้งเตือนผิดพลาด)

บางครั้ง Legitimate security work (งาน security ที่ถูกกฎหมาย) อาจถูก Flag ผิด:

- Codex จะแจ้งใน-product เมื่อถูก Reroute
- รายงานผ่าน `/feedback` command ใน CLI
- OpenAI กำลังปรับจาก Account-level ไปเป็น Request-level safety checks

---

## สรุป: เลือก Plan ให้เหมาะกับการใช้งาน

### สำหรับ Individual Developer

| ถ้าคุณ... | แนะนำ Plan |
|----------|-----------|
| อยากลองดูก่อน | Free |
| ใช้เป็นครั้งคราว | Go ($8) |
| ใช้งานจริงทุกวัน | Plus ($20) |
| ใช้หนักมาก, ต้องการ Rate limit สูง | Pro ($100+) |

### สำหรับทีม/องค์กร

| ถ้าทีม... | แนะนำ Plan |
|----------|-----------|
| ต้องการ SSO, MFA | Business |
| ต้องการ Audit Logs, Data Residency | Enterprise |
| เป็นสถาบันการศึกษา | Edu (ติดต่อ Sales) |

### Tips การประหยัด Credits

1. **ใช้ GPT-5.4-mini** สำหรับงาน Exploration และ Simple tasks
2. **Enable Context Caching** (เปิดใช้การแคชบริบท — ลดค่าใช้จ่ายเมื่อส่งข้อมูลเดิมซ้ำ) — Cached input ถูกกว่า 10x
3. **แบ่ง Thread** เมื่องานไม่เกี่ยวกัน เพื่อลด Context ที่ไม่จำเป็น
4. **ใช้ Fast Mode เฉพาะเมื่อจำเป็น** เพราะใช้ Credits มากกว่า
5. **Subagents ด้วย mini** สำหรับ Read-heavy tasks ที่ไม่ต้องการ Reasoning สูง
