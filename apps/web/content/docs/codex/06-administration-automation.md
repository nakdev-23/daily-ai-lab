---
title: "Administration & Automation"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "1. การยืนยันตัวตน (Authentication)"
readTime: "19 นาที"
readers: "0"
locked: false
order: 6
---
# Codex คู่มือภาษาไทย — หมวด Administration & Automation

> ไฟล์ที่ 6 จาก 6 | กลับไปที่ [INDEX](./00-INDEX.md)

---

## สารบัญ

1. [การยืนยันตัวตน (Authentication)](#1-การยืนยันตัวตน-authentication)
2. [Access Tokens](#2-access-tokens)
3. [การอนุมัติ Agent และความปลอดภัย (Agent Approvals & Security)](#3-การอนุมัติ-agent-และความปลอดภัย-agent-approvals--security)
4. [การเชื่อมต่อระยะไกล (Remote Connections)](#4-การเชื่อมต่อระยะไกล-remote-connections)
5. [Enterprise — Admin Setup](#5-enterprise--admin-setup)
6. [Enterprise — Governance](#6-enterprise--governance)
7. [Enterprise — Managed Configuration](#7-enterprise--managed-configuration)
8. [การใช้งานบน Windows](#8-การใช้งานบน-windows)
9. [Non-interactive Mode (โหมดไม่มี UI)](#9-non-interactive-mode-โหมดไม่มี-ui)
10. [Codex SDK](#10-codex-sdk)
11. [App Server](#11-app-server)
12. [MCP Server](#12-mcp-server)
13. [GitHub Action](#13-github-action)
14. [หัวข้อที่ยังไม่ได้เรียบเรียงครบถ้วน](#14-หัวข้อที่ยังไม่ได้เรียบเรียงครบถ้วน)

---

## 1. การยืนยันตัวตน (Authentication)

อ้างอิง: [Authentication — Codex Docs](https://developers.openai.com/codex/auth)

### หัวข้อนี้คืออะไร

หน้านี้อธิบายวิธีที่ Codex ตรวจสอบตัวตนผู้ใช้ เพื่อให้เชื่อมต่อกับ OpenAI API ได้ถูกต้อง ไม่ว่าจะใช้ผ่าน UI, CLI, หรือในสภาพแวดล้อมที่ไม่มีหน้าจอ (headless)

### วิธีลงชื่อเข้าใช้

Codex รองรับการยืนยันตัวตน 2 วิธีหลัก:

**1. ChatGPT (OAuth)**
- ลงชื่อเข้าใช้ด้วยบัญชี ChatGPT ผ่านเบราว์เซอร์
- จำเป็นต้องใช้สำหรับ Codex cloud (web tasks)
- ต้องเปิดใช้ MFA ถ้าลงชื่อแบบ email + password ร่วมกับการใช้ Codex cloud

**2. API Key**
- ใช้ OpenAI API key โดยตรง
- เหมาะสำหรับ CI/CD, automation, หรือสภาพแวดล้อมที่ไม่ต้องการ browser login
- ตั้งค่าผ่าน environment variable: `CODEX_API_KEY`

### การเก็บ Credentials

Codex เก็บ credential ไว้ที่:
- `~/.codex/auth.json` — ไฟล์หลักสำหรับเก็บ token
- หรือ OS keyring ถ้ามีการตั้งค่า `cli_auth_credentials_store`

### การเข้าสู่ระบบในสภาพแวดล้อม Headless

ในสภาพแวดล้อมที่ไม่มีเบราว์เซอร์ (เช่น เซิร์ฟเวอร์, Docker, CI):

```bash
codex login --device-auth
```

คำสั่งนี้จะแสดง URL ให้เปิดในเบราว์เซอร์เครื่องอื่น เพื่อทำ device code authorization

หรือคัดลอกไฟล์ `~/.codex/auth.json` จากเครื่องที่ login แล้วไปวางในเครื่อง headless

### การบังคับวิธี Login (Forced Login Method)

ถ้าต้องการควบคุมว่าผู้ใช้ต้องใช้วิธีไหนในการ login ตั้งค่าใน `config.toml`:

```toml
forced_login_method = "chatgpt"  # หรือ "api"
```

- `"chatgpt"` — บังคับให้ใช้ ChatGPT OAuth เท่านั้น
- `"api"` — บังคับให้ใช้ API key เท่านั้น

### Custom CA Certificate

สำหรับองค์กรที่มี corporate proxy หรือใช้ self-signed certificate:

```bash
export CODEX_CA_CERTIFICATE=/path/to/ca-bundle.pem
```

### สรุปสั้นๆ

Codex รองรับ 2 วิธี login: ChatGPT OAuth (ต้องการเบราว์เซอร์ + MFA สำหรับ cloud) หรือ API key (เหมาะกับ CI/automation) ในสภาพแวดล้อม headless ใช้ `codex login --device-auth` หรือคัดลอก `auth.json` ไปวาง

---

## 2. Access Tokens

อ้างอิง: [Access Tokens — Codex Docs](https://developers.openai.com/codex/enterprise/access-tokens)

### หัวข้อนี้คืออะไร

Access Token เป็น token ที่ใช้สำหรับสภาพแวดล้อม enterprise เพื่อควบคุมการเข้าถึง Codex ในระดับองค์กร แทนที่จะใช้ API key ส่วนตัวของแต่ละคน

### ใช้ทำอะไร

ในการตั้งค่าระดับองค์กร admin สามารถออก Access Token ให้กับทีมหรือระบบต่างๆ เพื่อให้ใช้งาน Codex โดยไม่ต้องแชร์ API key ส่วนตัว ช่วยให้ควบคุม permissions, rotation, และการ revoke ได้ง่ายขึ้น

### ข้อควรระวัง

- ดูรายละเอียดเพิ่มเติมได้ที่ [Enterprise Admin Setup](https://developers.openai.com/codex/enterprise/admin-setup)
- การจัดการ Access Token ทำได้จาก Admin panel ของ ChatGPT workspace

---

## 3. การอนุมัติ Agent และความปลอดภัย (Agent Approvals & Security)

อ้างอิง: [Agent Approvals & Security — Codex Docs](https://developers.openai.com/codex/agent-approvals-security)

### หัวข้อนี้คืออะไร

Codex ใช้ระบบ 2 ชั้นในการควบคุมความปลอดภัย: **Sandbox Mode** (ควบคุมสิทธิ์การเข้าถึง filesystem และ network) และ **Approval Policy** (ควบคุมว่า agent ต้องขออนุมัติก่อนทำอะไร)

### Sandbox Mode

Sandbox กำหนดขอบเขตที่ agent สามารถทำงานได้:

| Mode | คำอธิบาย |
|------|-----------|
| `workspace-write` | อ่านได้ทุกที่ เขียนได้เฉพาะใน workspace และ writable roots ที่กำหนด |
| `read-only` | อ่านได้อย่างเดียว เขียนไม่ได้ |
| `danger-full-access` | ไม่มีข้อจำกัดใดๆ (ใช้ด้วยความระมัดระวัง) |

#### การทำงานของ Sandbox ตามแพลตฟอร์ม

- **Codex cloud**: ทำงานใน isolated container ที่มีการตั้งค่า network ตอน setup แต่ agent phase จะเป็น offline
- **CLI บน macOS**: ใช้ Seatbelt (sandbox-exec)
- **CLI บน Linux**: ใช้ Landlock + seccomp
- **Windows**: ใช้ elevated หรือ unelevated sandbox (ดูรายละเอียดในหัวข้อ Windows)

#### Paths ที่ได้รับการปกป้องเสมอ

Codex จะไม่เขียนทับไฟล์เหล่านี้โดยไม่ได้รับอนุญาต:
- `.git/`
- `.agents/`
- `.codex/`

#### Network Access

```toml
network_access = true
```

ตั้งค่านี้เพื่อให้ agent เข้าถึงเครือข่ายได้ ค่าเริ่มต้นคือ `false`

การค้นหาเว็บ (web search) ใช้โหมด `"cached"` โดยค่าเริ่มต้น

### Approval Policy

Approval Policy กำหนดว่า agent ต้องหยุดรอการอนุมัติก่อนทำสิ่งใด:

| Policy | คำอธิบาย |
|--------|-----------|
| `on-request` | agent ขออนุมัติเฉพาะเมื่อจำเป็น (เช่น เขียนไฟล์นอก workspace) |
| `untrusted` | agent ต้องขออนุมัติทุกครั้งก่อนทำ action |
| `never` | agent ไม่ต้องขออนุมัติเลย ทำงานอัตโนมัติเต็มที่ |

### Presets ที่ใช้บ่อย

```bash
# Auto mode — ทำงานอัตโนมัติเต็มที่ (workspace-write + never approve)
codex --full-auto

# อ่านอย่างเดียว — ไม่เขียนไฟล์
codex --sandbox read-only

# ข้าม sandbox และ approval ทั้งหมด (อันตราย!)
codex --dangerously-bypass-approvals-and-sandbox
```

### OTel Monitoring (Telemetry)

Codex รองรับ OpenTelemetry (OTel) สำหรับการ monitoring แบบ opt-in โดยค่าเริ่มต้นปิดอยู่ เปิดใช้งานได้ผ่าน config

### สรุปสั้นๆ

ระบบความปลอดภัยของ Codex มี 2 ชั้น: Sandbox (จำกัด filesystem/network) และ Approval Policy (จำกัดว่าต้องขออนุมัติอะไรบ้าง) ใช้ preset `--full-auto` สำหรับ automation และ `read-only` เมื่อต้องการความปลอดภัยสูงสุด

---

## 4. การเชื่อมต่อระยะไกล (Remote Connections)

อ้างอิง: [Remote Connections — Codex Docs](https://developers.openai.com/codex/remote-connections)

### หัวข้อนี้คืออะไร

Remote Connections เป็นฟีเจอร์ **alpha** ที่ให้ Codex บนเครื่อง local เชื่อมต่อกับ Codex ที่รันบน remote server ผ่าน SSH

### ใช้ทำอะไร

เหมาะสำหรับนักพัฒนาที่ทำงานกับโปรเจกต์บน remote server (เช่น cloud VM, development server) แต่อยากใช้ Codex จาก local app หรือ IDE

### วิธีตั้งค่า

**1. ติดตั้ง Codex บนเครื่อง remote**

เครื่อง remote ต้องมี Codex CLI ติดตั้งอยู่ด้วย

**2. ตั้งค่า SSH Config**

เพิ่มข้อมูล remote server ใน `~/.ssh/config` ตามปกติ

**3. เพิ่ม Connection ใน Codex App**

ไปที่ **Settings > Connections** ในแอป Codex แล้วเพิ่ม remote server

### ข้อควรระวัง

- ฟีเจอร์นี้ยังอยู่ในสถานะ **alpha** อาจมีการเปลี่ยนแปลง
- การเชื่อมต่อใช้ SSH port forwarding เท่านั้น ไม่มี public listener
- สำหรับ server ที่ไม่ได้อยู่ในเครือข่ายเดียวกัน ให้ใช้ VPN หรือ Tailscale ก่อน

### สรุปสั้นๆ

Remote Connections ให้ใช้ Codex จาก local app กับโค้ดที่อยู่บน remote server ผ่าน SSH ฟีเจอร์นี้ยังเป็น alpha อยู่ ต้องติดตั้ง Codex ทั้งสองเครื่อง

---

## 5. Enterprise — Admin Setup

อ้างอิง: [Admin Setup — Codex Docs](https://developers.openai.com/codex/enterprise/admin-setup)

### หัวข้อนี้คืออะไร

Admin Setup คือขั้นตอนที่ผู้ดูแลระบบ (admin) ขององค์กรต้องทำเพื่อเปิดใช้งาน Codex ให้กับทีม ตั้งค่า policy และควบคุมการใช้งานในระดับ workspace

### รายละเอียดสำคัญ

- Admin สามารถเข้าถึงการตั้งค่า enterprise ได้จาก ChatGPT workspace admin panel
- ต้องมีสิทธิ์ Workspace Owner หรือ Admin
- สามารถกำหนด:
  - ว่าสมาชิกคนไหนเข้าถึง Codex ได้บ้าง
  - วิธีการ authentication ที่อนุญาต (ChatGPT OAuth หรือ API key)
  - นโยบาย sandbox และ approval สำหรับทั้ง workspace

### ข้อควรระวัง

เนื้อหาเต็มของหน้านี้ครอบคลุมขั้นตอนการตั้งค่าอย่างละเอียด ดูได้ที่ [Official Docs: Admin Setup](https://developers.openai.com/codex/enterprise/admin-setup)

---

## 6. Enterprise — Governance

อ้างอิง: [Governance — Codex Docs](https://developers.openai.com/codex/enterprise/governance)

### หัวข้อนี้คืออะไร

Governance คือชุดเครื่องมือที่ช่วยองค์กร enterprise ติดตาม, วิเคราะห์, และตรวจสอบการใช้งาน Codex ในทีม ครอบคลุมตั้งแต่ dashboard สำหรับดู adoption ไปจนถึง API สำหรับ export log สำหรับระบบ compliance

### 3 ช่องทางการติดตามการใช้งาน

| เครื่องมือ | เหมาะกับ |
|-----------|---------|
| **Analytics Dashboard** | ดู adoption และ impact ของ code review แบบ real-time |
| **Analytics API** | ดึง metrics อัตโนมัติเข้า data warehouse หรือ BI tools |
| **Compliance API** | export audit log สำหรับระบบ security และ compliance |

### Analytics Dashboard

เข้าใช้งานได้ที่ [chatgpt.com/codex/settings/analytics](https://chatgpt.com/codex/settings/analytics) — สำหรับ workspace admin เท่านั้น

Dashboard แสดงข้อมูลต่อไปนี้:
- จำนวนผู้ใช้รายวันแยกตาม product (CLI, IDE, cloud, Code Review)
- จำนวน code reviews รายวัน
- Code reviews แยกตาม priority level
- Code reviews แยกตาม sentiment (feedback)
- Cloud tasks รายวัน
- จำนวนผู้ใช้ VS Code extension รายวัน
- จำนวนผู้ใช้ CLI รายวัน

#### การ Export ข้อมูล Analytics

Admin ส่งออกข้อมูลได้ทั้งรูปแบบ CSV และ JSON ครอบคลุม:
- Code review users และ reviews (รายวัน)
- Code review findings และ feedback (reactions, replies, priority)
- Cloud users และ tasks (รายวัน)
- CLI และ VS Code users (รายวัน)
- Sessions และ messages ต่อผู้ใช้ (รายวัน)

### Analytics API

ใช้งานผ่าน [chatgpt.com/codex/settings/apireference](https://chatgpt.com/codex/settings/apireference) สำหรับการดึงข้อมูลแบบอัตโนมัติ

**ข้อมูลที่ API ให้:**

- **Daily usage and adoption**: thread, turns, credits แบบรายวัน แยกตาม client surface หรือแยกตาม user
- **Code review activity**: จำนวน PR reviews, comments, และ severity breakdown
- **User engagement**: replies และ reactions ต่อ Codex comments

ผลลัพธ์เรียงตามเวลา รองรับ cursor-based pagination

**Use cases ที่พบบ่อย:**
- Engineering observability dashboards
- รายงาน adoption สำหรับผู้บริหาร
- ติดตาม usage และ cost

### Compliance API

ใช้งานผ่าน [chatgpt.com/admin/api-reference](https://chatgpt.com/admin/api-reference) สำหรับระบบ audit และ compliance

**ข้อมูลที่ export ได้:**

- Prompt text ที่ส่งให้ Codex
- Response ที่ Codex สร้าง
- Identifiers: workspace, user, timestamp, model
- Token usage และ request metadata

**Use cases:**
- Security investigations
- Compliance reporting
- Policy enforcement audits
- ส่งข้อมูลเข้า SIEM และ eDiscovery pipelines

**ข้อจำกัด:** Audit log เก็บได้ไม่เกิน **30 วัน** และครอบคลุมเฉพาะการใช้งานที่ยืนยันตัวตนผ่าน ChatGPT เท่านั้น (ไม่รวมการใช้งานด้วย API key ตรงๆ)

**ไม่รองรับการวัด:**
- Lines of code ที่สร้าง (เป็น proxy ที่ไม่แม่นยำ)
- Acceptance rate ของ suggestions
- Code quality KPIs

### แนวทางที่แนะนำสำหรับองค์กร

ส่วนใหญ่ใช้ร่วมกัน 3 อย่าง:
1. **Analytics Dashboard** — ดูภาพรวมรายวัน
2. **Analytics API** — รายงานอัตโนมัติและ BI integration
3. **Compliance API** — audit trail สำหรับ security/legal

### สรุปสั้นๆ

Governance ของ Codex มี 3 ระดับ: Dashboard (ดูง่าย), Analytics API (สำหรับ automation), Compliance API (สำหรับ audit/compliance) admin สามารถ export ข้อมูลได้ทั้ง CSV และ JSON log เก็บสูงสุด 30 วัน

---

## 7. Enterprise — Managed Configuration

อ้างอิง: [Managed Configuration — Codex Docs](https://developers.openai.com/codex/enterprise/managed-configuration)

### หัวข้อนี้คืออะไร

Managed Configuration ช่วยให้ admin ขององค์กรสามารถกำหนด requirements และ default settings ของ Codex ให้กับผู้ใช้ทั้ง workspace ได้จากส่วนกลาง โดยผู้ใช้ไม่ต้องตั้งค่าเอง

### ใช้ทำอะไร

เหมาะสำหรับองค์กรที่ต้องการ:
- บังคับให้ใช้ authentication method เฉพาะ
- กำหนด default sandbox policy ให้ทั้งทีม
- ตั้งค่า policy ที่ผู้ใช้ไม่สามารถแก้ไขได้
- Deploy config ให้ผู้ใช้หลายคนพร้อมกัน

### ข้อควรระวัง

รายละเอียดเต็มของ Managed Configuration อยู่ที่ [Official Docs: Managed Configuration](https://developers.openai.com/codex/enterprise/managed-configuration) — เนื้อหาหน้านี้ค่อนข้างยาวและครอบคลุมรายละเอียด policy ต่างๆ

---

## 8. การใช้งานบน Windows

อ้างอิง: [Windows — Codex Docs](https://developers.openai.com/codex/windows)

### หัวข้อนี้คืออะไร

Codex รองรับ Windows ทั้งแบบ native และผ่าน WSL2 (Windows Subsystem for Linux) หน้านี้อธิบายวิธีตั้งค่า sandbox, ข้อแนะนำสำหรับแต่ละกรณี และการแก้ปัญหาที่พบบ่อยบน Windows

### 3 วิธีใช้ Codex บน Windows

1. **Native Windows (elevated sandbox)** — แนะนำสำหรับ Windows 11
2. **Native Windows (unelevated sandbox)** — fallback สำหรับเครื่องที่มี enterprise policy จำกัด
3. **WSL2 (Windows Subsystem for Linux)** — ใช้ Linux sandbox บน Windows

### Windows Sandbox

Codex บน Windows native ใช้ sandbox เพื่อจำกัดการเขียนไฟล์นอก working folder และป้องกันการเข้าถึงเครือข่ายโดยไม่ได้รับอนุญาต

ตั้งค่า sandbox mode ใน `config.toml`:

```toml
[windows]
sandbox = "elevated"  # หรือ "unelevated"
```

#### elevated sandbox (แนะนำ)

- ใช้ sandbox user ที่มีสิทธิ์ต่ำกว่า (lower-privilege)
- กำหนด filesystem permission boundaries
- ตั้ง firewall rules
- ต้องผ่าน UAC / admin approval ตอนติดตั้ง

#### unelevated sandbox (fallback)

- รันคำสั่งด้วย restricted Windows token จาก current user
- ใช้ ACL-based filesystem boundaries
- ใช้ environment-level offline controls แทน firewall rule
- อ่อนแอกว่า `elevated` แต่ยังมีประโยชน์เมื่อ admin setup ถูกบล็อก

#### Private Desktop

ค่าเริ่มต้น sandbox จะใช้ private desktop เพื่อความปลอดภัย UI ยิ่งขึ้น ปิดได้ถ้าต้องการ compatibility:

```toml
[windows]
sandbox_private_desktop = false
```

### Windows Version Matrix

| Windows Version | ระดับการรองรับ | หมายเหตุ |
|----------------|---------------|---------|
| Windows 11 | **แนะนำ** | เหมาะสำหรับ enterprise deployment |
| Windows 10 (อัปเดตล่าสุด) | Best effort | ต้องการ version 1809 หรือใหม่กว่า, ต้องมี ConPTY |
| Windows 10 รุ่นเก่า | ไม่แนะนำ | ขาด console components ที่จำเป็น |

**ข้อกำหนดเพิ่มเติม:**
- `winget` ต้องพร้อมใช้งาน
- elevated sandbox ต้องการ admin approval ตอนตั้งค่า
- บางองค์กร enterprise อาจบล็อก setup steps บางอย่าง

### Grant Sandbox Read Access

เมื่อ command ล้มเหลวเพราะ sandbox ไม่สามารถอ่าน directory บางอย่าง:

```
/sandbox-add-read-dir C:\absolute\directory\path
```

ต้องเป็น absolute path และ directory ต้องมีอยู่จริง

### Windows Subsystem for Linux (WSL2)

เลือกใช้ WSL2 เมื่อ:
- ต้องการ Linux-native tooling บน Windows
- workflow ของทีมอยู่ใน WSL2 อยู่แล้ว
- native Windows sandbox ไม่สามารถใช้งานได้

**หมายเหตุ:** WSL1 รองรับถึง Codex เวอร์ชัน `0.114` เท่านั้น ตั้งแต่ `0.115` เป็นต้นไป Linux sandbox ใช้ `bubblewrap` ซึ่งไม่รองรับ WSL1

#### ติดตั้งและเริ่มใช้งาน

```powershell
# ติดตั้ง WSL (รัน PowerShell แบบ Administrator)
wsl --install

# เปิด WSL shell
wsl
```

```bash
# ใน WSL shell — ติดตั้งและรัน Codex
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex
```

#### เปิด VS Code จาก WSL

```bash
# จาก WSL shell
cd ~/code/your-project
code .
```

ตรวจสอบว่า status bar ด้านล่าง VS Code แสดง `WSL: <distro>` และ terminal แสดง path แบบ Linux (`/home/...`)

#### คำแนะนำการจัดการไฟล์

- **อย่า**ทำงานใน `/mnt/c/...` — I/O ช้ากว่ามาก
- **ให้**เก็บ repository ไว้ใน Linux home directory เช่น `~/code/my-app`

```bash
mkdir -p ~/code && cd ~/code
git clone https://github.com/your/repo.git
cd repo
```

### การแก้ปัญหาที่พบบ่อย

**elevated sandbox ติดตั้งล้มเหลว**
- ตรวจสอบว่า approve UAC/admin prompt แล้ว
- เครื่องที่มี enterprise policy อาจบล็อกการสร้าง local user/group หรือเปลี่ยน firewall rules
- ถ้าไม่สามารถแก้ได้ทันที ให้ใช้ `unelevated` sandbox แทนก่อน
- ปรึกษา IT team เรื่อง logon rights สำหรับ sandbox users

**Error 1385**
- Windows ปฏิเสธ logon type ที่ sandbox user ต้องการ
- ให้ IT team ตรวจสอบ group policy ว่า sandbox user ของ Codex มีสิทธิ์ที่จำเป็น
- ในระหว่างแก้ปัญหา ใช้ `unelevated` sandbox ก่อน

**IDE Extension ไม่ตอบสนอง**
อาจขาด C++ development tools:
```bash
winget install --id Microsoft.VisualStudio.2022.BuildTools -e
```
หลังติดตั้ง ให้รีสตาร์ท VS Code ใหม่

**WSL repository ช้า**
- ย้าย repository จาก `/mnt/c/...` ไปไว้ที่ `~/code/...`
- อัปเดต WSL:
```bash
wsl --update
wsl --shutdown
```

**VS Code ใน WSL หา `codex` ไม่เจอ**
```bash
which codex || echo "codex not found"
```
ถ้าไม่เจอให้ติดตั้งใหม่ตาม [ขั้นตอนข้างต้น](#ติดตั้งและเริ่มใช้งาน)

**การส่ง diagnostics ให้ OpenAI**

ส่งไฟล์นี้:
- `CODEX_HOME/.sandbox/sandbox.log`

พร้อมข้อมูล: คำอธิบายปัญหา, เวอร์ชัน Windows, error message, และว่าใช้ `elevated` หรือ `unelevated` sandbox

**อย่าส่ง:** `CODEX_HOME/.sandbox-secrets/`

### สรุปสั้นๆ

Windows 11 + elevated sandbox คือ combination ที่ดีที่สุด ถ้า enterprise policy บล็อก ให้ใช้ unelevated sandbox แทน ถ้าต้องการ Linux tooling ใช้ WSL2 เก็บ repo ไว้ใน Linux home directory เสมอเพื่อประสิทธิภาพที่ดีกว่า

---

## 9. Non-interactive Mode (โหมดไม่มี UI)

อ้างอิง: [Non-interactive Mode — Codex Docs](https://developers.openai.com/codex/noninteractive)

### หัวข้อนี้คืออะไร

Non-interactive Mode คือการรัน Codex โดยไม่ต้องมี UI แบบ interactive ใช้สำหรับ CI/CD pipeline, automation scripts, หรือการเรียกใช้งานแบบ programmatic

### คำสั่งพื้นฐาน

```bash
codex exec "สิ่งที่ต้องการให้ Codex ทำ"
```

- **stderr** — แสดง progress และ status ขณะทำงาน
- **stdout** — แสดงเฉพาะ final response

### Options สำคัญ

```bash
# รันแบบ ephemeral (ไม่บันทึก session)
codex exec --ephemeral "prompt"

# Output เป็น JSONL (JSON Lines) — เหมาะสำหรับ parsing
codex exec --json "prompt"

# กำหนด output schema แบบ JSON Schema
codex exec --output-schema schema.json "prompt"

# บันทึก output ลงไฟล์
codex exec -o output.md "prompt"

# ข้าม git repo check
codex exec --skip-git-repo-check "prompt"
```

### ใช้ API Key ใน CI

```bash
export CODEX_API_KEY="your-api-key"
codex exec "prompt"
```

### การ Resume Session

```bash
# ต่อจาก session ล่าสุด
codex exec resume --last

# ต่อจาก session เฉพาะ
codex exec resume <session-id>
```

### รับ Input จาก stdin

```bash
cat prompt.txt | codex exec
```

### ตัวอย่าง GitHub Actions Workflow

```yaml
name: Auto Fix Issues
on:
  issues:
    types: [labeled]

jobs:
  fix:
    if: contains(github.event.label.name, 'codex-fix')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Codex Fix
        env:
          CODEX_API_KEY: ${{ secrets.CODEX_API_KEY }}
        run: |
          codex exec --json "Fix the issue described in #${{ github.event.issue.number }}"
```

### สรุปสั้นๆ

`codex exec` เป็นคำสั่งหลักสำหรับ automation ใช้ `--json` สำหรับ parsing, `CODEX_API_KEY` สำหรับ CI/CD และ `resume --last` เพื่อต่อจาก session เก่า

---

## 10. Codex SDK

อ้างอิง: [Codex SDK — Codex Docs](https://developers.openai.com/codex/sdk)

### หัวข้อนี้คืออะไร

Codex SDK เป็น library ที่ให้นักพัฒนาควบคุม Codex แบบ programmatic ภายใน application ของตัวเอง รองรับทั้ง TypeScript และ Python

### เมื่อไหรควรใช้ SDK

- ควบคุม Codex จาก CI/CD pipeline
- สร้าง agent ของตัวเองที่ใช้ Codex ทำงาน engineering tasks
- ฝัง Codex เข้าใน internal tools
- สร้าง integration ระหว่าง Codex กับ application ของตัวเอง

### TypeScript Library

**ข้อกำหนด:** Node.js 18 หรือใหม่กว่า

**การติดตั้ง:**

```bash
npm install @openai/codex-sdk
```

**การใช้งานพื้นฐาน:**

```typescript
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();
const result = await thread.run(
  "Make a plan to diagnose and fix the CI failures"
);

console.log(result);
```

**ต่อ thread เดิม หรือ resume thread เก่า:**

```typescript
// รันต่อใน thread เดิม
const result = await thread.run("Implement the plan");

// Resume thread เก่าด้วย thread ID
const threadId = "<thread-id>";
const thread2 = codex.resumeThread(threadId);
const result2 = await thread2.run("Pick up where you left off");
```

ดู source เพิ่มเติม: [TypeScript SDK repo](https://github.com/openai/codex/tree/main/sdk/typescript)

### Python Library

**ข้อกำหนด:** Python 3.10 หรือใหม่กว่า

Python SDK ควบคุม local Codex app-server ผ่าน JSON-RPC SDK builds จะ pin version ของ Codex CLI runtime โดยอัตโนมัติ

**การติดตั้ง:**

```bash
pip install openai-codex
```

**การใช้งานพื้นฐาน:**

```python
from openai_codex import Codex, Sandbox

with Codex() as codex:
    thread = codex.thread_start(
        model="gpt-5.4",
        sandbox=Sandbox.workspace_write,
    )
    result = thread.run("Make a plan to diagnose and fix the CI failures")
    print(result.final_response)
```

**Async version:**

```python
import asyncio
from openai_codex import AsyncCodex

async def main() -> None:
    async with AsyncCodex() as codex:
        thread = await codex.thread_start(model="gpt-5.4")
        result = await thread.run("Implement the plan")
        print(result.final_response)

asyncio.run(main())
```

### Sandbox Presets ใน Python SDK

```python
from openai_codex import Codex, Sandbox

with Codex() as codex:
    thread = codex.thread_start(sandbox=Sandbox.workspace_write)
    thread.run("Make the requested change.")
    
    # เปลี่ยน sandbox สำหรับ turn ต่อไป
    review = thread.run("Review the diff only.", sandbox=Sandbox.read_only)
```

| Preset | ความหมาย |
|--------|---------|
| `Sandbox.read_only` | อ่านไฟล์ได้อย่างเดียว ห้ามเขียน |
| `Sandbox.workspace_write` | อ่านและเขียนใน workspace ได้ |
| `Sandbox.full_access` | ไม่มีข้อจำกัด filesystem |

ถ้าไม่ระบุ `sandbox=` จะใช้ค่า default ของ app-server

ดู source เพิ่มเติม: [Python SDK repo](https://github.com/openai/codex/tree/main/sdk/python)

### สรุปสั้นๆ

Codex SDK มีให้ใช้ทั้ง TypeScript (Node.js 18+) และ Python (3.10+) ทั้งสองใช้แนวคิด thread-based เหมือนกัน เลือกระหว่าง SDK กับ `codex exec` ขึ้นอยู่กับว่าต้องการ integration ลึกแค่ไหน

---

## 11. App Server

อ้างอิง: [App Server — Codex Docs](https://developers.openai.com/codex/app-server)

### หัวข้อนี้คืออะไร

Codex App Server คือ interface ที่ Codex ใช้ภายในเพื่อขับเคลื่อน rich clients เช่น VS Code extension โดยใช้ protocol JSON-RPC 2.0 แบบ bidirectional ซึ่ง open source อยู่ที่ [openai/codex/codex-rs/app-server](https://github.com/openai/codex/tree/main/codex-rs/app-server)

> **เมื่อไหรควรใช้ App Server แทน SDK:**
> - ใช้ **App Server** เมื่อต้องการ deep integration ใน product ของตัวเอง: authentication, conversation history, approvals, streamed events
> - ใช้ **Codex SDK** เมื่อทำ CI/CD หรือ automation งาน

### Protocol

App Server ใช้ JSON-RPC 2.0 แบบ bidirectional (ไม่มี `"jsonrpc":"2.0"` header บน wire)

**Transports ที่รองรับ:**

| Transport | Flag | รายละเอียด |
|-----------|------|-----------|
| stdio | `--listen stdio://` (default) | JSONL — เหมาะสุดสำหรับ subprocess |
| WebSocket | `--listen ws://IP:PORT` | experimental, ไม่ได้รับการ support |
| Unix socket | `--listen unix://` หรือ `--listen unix://PATH` | WebSocket over Unix socket |
| Off | `--listen off` | ปิด transport ทั้งหมด |

**Health endpoints (WebSocket mode เท่านั้น):**
- `GET /readyz` — 200 OK เมื่อ listener พร้อมรับ connection
- `GET /healthz` — 200 OK (ถ้าไม่มี Origin header)
- Request ที่มี Origin header จะได้รับ 403 Forbidden

**WebSocket Auth Flags:**

```bash
--ws-auth capability-token --ws-token-file /absolute/path
--ws-auth capability-token --ws-token-sha256 HEX
--ws-auth signed-bearer-token --ws-shared-secret-file /absolute/path
```

Clients ส่ง credential ผ่าน `Authorization: Bearer <token>` ระหว่าง WebSocket handshake

### Message Schema

**Request:**
```json
{ "method": "thread/start", "id": 10, "params": { "model": "gpt-5.4" } }
```

**Response:**
```json
{ "id": 10, "result": { "thread": { "id": "thr_123" } } }
```

**Error:**
```json
{ "id": 10, "error": { "code": 123, "message": "Something went wrong" } }
```

**Notification (ไม่มี id):**
```json
{ "method": "turn/started", "params": { "turn": { "id": "turn_456" } } }
```

**Generate schema จาก CLI:**

```bash
codex app-server generate-ts --out ./schemas
codex app-server generate-json-schema --out ./schemas
```

### การเริ่มใช้งาน

```bash
# stdio (default)
codex app-server

# TCP WebSocket
codex app-server --listen ws://127.0.0.1:4500

# Unix socket
codex app-server --listen unix://
```

**ตัวอย่าง Node.js/TypeScript:**

```typescript
import { spawn } from "node:child_process";
import readline from "node:readline";

const proc = spawn("codex", ["app-server"], {
  stdio: ["pipe", "pipe", "inherit"],
});
const rl = readline.createInterface({ input: proc.stdout });

const send = (message: unknown) => {
  proc.stdin.write(`${JSON.stringify(message)}\n`);
};

let threadId: string | null = null;

rl.on("line", (line) => {
  const msg = JSON.parse(line) as any;
  if (msg.id === 1 && msg.result?.thread?.id && !threadId) {
    threadId = msg.result.thread.id;
    send({
      method: "turn/start",
      id: 2,
      params: {
        threadId,
        input: [{ type: "text", text: "Summarize this repo." }],
      },
    });
  }
});

send({ method: "initialize", id: 0, params: { clientInfo: { name: "my_product", title: "My Product", version: "0.1.0" } } });
send({ method: "initialized", params: {} });
send({ method: "thread/start", id: 1, params: { model: "gpt-5.4" } });
```

### Core Primitives

- **Thread** — conversation ระหว่าง user กับ Codex agent ประกอบด้วย turns
- **Turn** — user request เดียวและงานที่ agent ทำตาม ประกอบด้วย items
- **Item** — หน่วยข้อมูล input/output: user message, agent message, command, file change, tool call

### Lifecycle Overview

1. **Initialize**: ส่ง `initialize` request พร้อม client metadata แล้วตาม `initialized` notification ก่อนทำอื่น
2. **Start/Resume Thread**: `thread/start` สำหรับ conversation ใหม่, `thread/resume` ต่อ thread เดิม, `thread/fork` แยก history
3. **Begin Turn**: `turn/start` พร้อม threadId และ user input
4. **Steer Turn**: `turn/steer` เพิ่ม input ระหว่าง turn ที่กำลังทำงาน
5. **Stream Events**: อ่าน notifications: `item/started`, `item/completed`, `item/agentMessage/delta`, tool progress, ฯลฯ
6. **Finish Turn**: server emit `turn/completed` เมื่อ model เสร็จ หรือหลัง `turn/interrupt`

### Initialization

```json
{
  "method": "initialize",
  "id": 0,
  "params": {
    "clientInfo": {
      "name": "codex_vscode",
      "title": "Codex VS Code Extension",
      "version": "0.1.0"
    }
  }
}
```

**Notification opt-out** — ปิด notification method ที่ไม่ต้องการ:

```json
{
  "method": "initialize",
  "id": 1,
  "params": {
    "clientInfo": { "name": "my_client", "title": "My Client", "version": "0.1.0" },
    "capabilities": {
      "experimentalApi": true,
      "optOutNotificationMethods": ["thread/started", "item/agentMessage/delta"]
    }
  }
}
```

### Experimental API Opt-in

บาง methods ต้องเปิดใช้งาน experimental API ก่อน:

```json
{
  "capabilities": {
    "experimentalApi": true
  }
}
```

ถ้าไม่เปิด แล้วเรียก experimental method จะได้ error: `<descriptor> requires experimentalApi capability`

### API Overview (Methods ที่สำคัญ)

| Method | คำอธิบาย |
|--------|---------|
| `thread/start` | สร้าง thread ใหม่ |
| `thread/resume` | เปิด thread เดิมต่อ |
| `thread/fork` | แยก thread เป็น branch ใหม่ |
| `thread/list` | ดู thread ทั้งหมด (cursor pagination) |
| `thread/archive` | เก็บ thread เข้า archive |
| `turn/start` | เริ่ม turn ใหม่ด้วย user input |
| `turn/steer` | เพิ่ม input ระหว่าง turn ที่กำลังทำงาน |
| `turn/interrupt` | ยกเลิก turn ที่กำลังทำงาน |
| `review/start` | เรียก Codex reviewer |
| `command/exec` | รัน single command ใน sandbox |
| `model/list` | ดู models ที่ใช้ได้ |
| `skills/list` | ดู skills ตาม cwd |
| `plugin/list` | ดู plugins ที่ติดตั้ง |
| `plugin/install` | ติดตั้ง plugin |

### สรุปสั้นๆ

App Server เป็น core protocol ที่ Codex ใช้สำหรับ rich client integration ใช้ JSON-RPC 2.0 ผ่าน stdio (default), WebSocket (experimental), หรือ Unix socket เหมาะสำหรับสร้าง custom Codex client ที่ต้องการ streaming events และ conversation management

---

## 12. MCP Server

อ้างอิง: [MCP Server — Codex Docs](https://developers.openai.com/codex/guides/agents-sdk)

### หัวข้อนี้คืออะไร

Codex สามารถทำงานเป็น MCP (Model Context Protocol) server ได้ ซึ่งช่วยให้ external agents หรือ tools เชื่อมต่อและใช้งาน Codex ผ่าน standard MCP protocol

### ใช้ทำอะไร

เมื่อ Codex ทำงานเป็น MCP server ระบบ agents อื่นๆ (เช่น OpenAI Agents SDK) สามารถใช้ Codex เป็น tool ในการทำงานกับโค้ดได้โดยตรง ทำให้สร้าง multi-agent workflow ได้ง่ายขึ้น

### ข้อควรระวัง

รายละเอียดเต็มของ MCP Server integration ดูได้ที่ [Official Docs: MCP Server](https://developers.openai.com/codex/guides/agents-sdk) ซึ่งครอบคลุม configuration, endpoints, และตัวอย่างการเชื่อมต่อกับ OpenAI Agents SDK

---

## 13. GitHub Action

อ้างอิง: [GitHub Action — Codex Docs](https://developers.openai.com/codex/github-action)

### หัวข้อนี้คืออะไร

`openai/codex-action@v1` เป็น official GitHub Action ที่ให้รัน Codex task ใน GitHub Actions workflow ได้โดยตรง ไม่ต้องตั้งค่า CLI เอง

### วิธีใช้งาน

```yaml
- uses: openai/codex-action@v1
  with:
    prompt: "Fix all TypeScript type errors"
    model: "gpt-5.4"
    effort: "medium"
```

### Input Parameters

| Parameter | Required | Default | คำอธิบาย |
|-----------|----------|---------|---------|
| `prompt` | ✅ (หรือ `prompt-file`) | — | Prompt ที่ส่งให้ Codex |
| `prompt-file` | ✅ (หรือ `prompt`) | — | Path ไปยังไฟล์ที่มี prompt |
| `codex-args` | ❌ | — | Arguments เพิ่มเติมสำหรับ Codex CLI |
| `model` | ❌ | — | Model ที่ใช้ (เช่น `gpt-5.4`) |
| `effort` | ❌ | — | ระดับความพยายาม: `low`, `medium`, `high` |
| `sandbox` | ❌ | — | Sandbox mode |
| `output-file` | ❌ | — | Path ไฟล์สำหรับบันทึก output |
| `safety-strategy` | ❌ | `drop-sudo` | กลยุทธ์ความปลอดภัย |
| `allow-users` | ❌ | — | GitHub users ที่อนุญาตให้ trigger |
| `allow-bots` | ❌ | — | GitHub bot ที่อนุญาตให้ trigger |

### Output

| Output | คำอธิบาย |
|--------|---------|
| `final-message` | ข้อความสุดท้ายที่ Codex ตอบกลับ |

ใช้งาน:
```yaml
- id: codex
  uses: openai/codex-action@v1
  with:
    prompt: "Summarize what changed"

- name: Show result
  run: echo "${{ steps.codex.outputs.final-message }}"
```

### Safety Strategy

`safety-strategy` ควบคุมพฤติกรรม sandbox ใน GitHub Actions:

- `drop-sudo` (default) — ลบ sudo permissions สำหรับ agent commands
- ค่าอื่นๆ ดูได้จาก Official Docs

### แนวทางด้านความปลอดภัย

- **ทำความสะอาด prompt** ก่อนส่งเข้า workflow เพื่อป้องกัน prompt injection
- **ปกป้อง API key** — เก็บไว้ใน GitHub Secrets เสมอ (`${{ secrets.CODEX_API_KEY }}`)
- **ใช้ `drop-sudo`** เพื่อจำกัดสิทธิ์ของ agent ใน CI
- **ใช้ `allow-users`/`allow-bots`** เพื่อจำกัดว่าใครทริกเกอร์ได้

### ตัวอย่าง Workflow

```yaml
name: Codex Auto Fix
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  codex:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: Run Codex
        uses: openai/codex-action@v1
        with:
          prompt: "Review the diff and fix any obvious bugs or lint errors"
          model: "gpt-5.4"
          effort: "medium"
          safety-strategy: "drop-sudo"
        env:
          CODEX_API_KEY: ${{ secrets.CODEX_API_KEY }}
```

### สรุปสั้นๆ

`openai/codex-action@v1` ทำให้รัน Codex ใน GitHub Actions ได้ง่าย เสมอเก็บ API key ใน Secrets, ใช้ `drop-sudo` safety strategy, และระบุ `allow-users` เพื่อความปลอดภัย

---

## 14. หัวข้อที่ยังไม่ได้เรียบเรียงครบถ้วน

| หัวข้อ | เหตุผล | ลิงก์ |
|--------|--------|-------|
| Enterprise — Admin Setup (เต็ม) | หน้าใหญ่เกิน 59KB ไม่สามารถดึงเนื้อหาครบได้ | [Admin Setup](https://developers.openai.com/codex/enterprise/admin-setup) |
| Enterprise — Managed Configuration (เต็ม) | หน้าใหญ่เกิน 52KB มีรายละเอียด policy ที่ซับซ้อน | [Managed Configuration](https://developers.openai.com/codex/enterprise/managed-configuration) |
| MCP Server (เต็ม) | เนื้อหาเชื่อมโยงกับ OpenAI Agents SDK ที่มีรายละเอียดมาก | [MCP Server](https://developers.openai.com/codex/guides/agents-sdk) |
| Access Tokens (เต็ม) | ขึ้นอยู่กับ enterprise admin setup | [Access Tokens](https://developers.openai.com/codex/enterprise/access-tokens) |
| Amazon Bedrock Deployment | หัวข้อ Deployment แยกสำหรับ AWS | [Amazon Bedrock](https://developers.openai.com/codex/amazon-bedrock) |

---

*เอกสารนี้อ้างอิงจาก [Codex Official Documentation](https://developers.openai.com/codex) — ข้อมูล ณ วันที่ จัดทำ*

*กลับไปที่ [INDEX](./00-INDEX.md)*
