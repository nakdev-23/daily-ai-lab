---
title: "Claude Code"
tool: "Claude"
icon: "tool-claude"
level: "beginner"
summary: "Claude Code คือผู้ช่วยเขียนโค้ดที่ขับเคลื่อนด้วย AI แบบ agentic (ทำงานอัตโนมัติหลายขั้นตอน) ช่วยสร้างฟีเจอร์ แก้บั๊ก และทำงานซ้ำ ๆ"
readTime: "9 นาที"
readers: "0"
locked: false
order: 3
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 3: Claude Code

> เรียบเรียงจาก [code.claude.com/docs](https://code.claude.com/docs/en/overview) — เครื่องมือเขียนโค้ดแบบอัตโนมัติที่อ่านโค้ดเบส แก้ไฟล์ รันคำสั่ง และเชื่อมกับเครื่องมือพัฒนา ใช้ได้บน Terminal, IDE, แอปเดสก์ท็อป และเว็บ

---

## 📖 คำศัพท์สำคัญสำหรับ Claude Code

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **Terminal / CLI** (Command Line Interface) | หน้าต่างบรรทัดคำสั่ง เช่น Terminal บน Mac/Linux หรือ PowerShell บน Windows ใช้พิมพ์คำสั่งโดยตรง |
| **Agentic** | ทำงานอัตโนมัติหลายขั้นตอนต่อเนื่อง — Claude อ่านโค้ด คิด แก้ไฟล์ รันทดสอบ เองโดยไม่ต้องสั่งทีละขั้น |
| **โค้ดเบส (Codebase)** | ชุดไฟล์โค้ดทั้งหมดของโปรเจกต์ |
| **IDE** (Integrated Development Environment) | โปรแกรมแก้ไขโค้ดแบบครบวงจร เช่น VS Code, JetBrains |
| **Context** (ในบริบท Claude Code) | ปริมาณข้อมูลที่อยู่ใน "ความจำ" ของ Claude ขณะนั้น รวมประวัติสนทนา ไฟล์ที่อ่าน และคำสั่ง |
| **Environment variable** | ตัวแปรที่เก็บค่าสำคัญ เช่น API key ไว้ในระบบ ไม่ต้องเขียนในโค้ดโดยตรง |
| **Hook** | สคริปต์ที่รันอัตโนมัติเมื่อเกิดเหตุการณ์ เช่น รัน formatter ทุกครั้งที่บันทึกไฟล์ |
| **Sandbox** | พื้นที่ทำงานแยกต่างหาก โค้ดที่รันในนี้ไม่กระทบระบบหลัก ใช้ทดสอบได้อย่างปลอดภัย |
| **CI/CD** | ระบบทดสอบและปล่อยโค้ดอัตโนมัติ — CI (ทดสอบ) CD (ปล่อยขึ้น production) |
| **Branch** | สาขาของโค้ด ทำงานแยกจาก main code เพื่อทดสอบ feature ใหม่ |
| **PR (Pull Request)** | คำขอรวมโค้ดจากสาขาหนึ่งเข้าสาขาหลัก |
| **Prompt injection** | การโจมตีโดยซ่อนคำสั่งแฝงในไฟล์หรือหน้าเว็บ เพื่อหลอกให้ AI ทำงานที่ไม่ต้องการ |
| **Token** | หน่วยวัดขนาดข้อความที่ AI ประมวลผล (context เต็มหมายความว่าใช้ token ครบแล้ว) |
| **ZDR** (Zero Data Retention) | ไม่เก็บข้อมูลการใช้งานหลังประมวลผลเสร็จ |
| **mTLS** | การยืนยันตัวตนแบบสองฝ่าย — ทั้งคลาวด์และเซิร์ฟเวอร์คุณตรวจสอบกันเอง |

---

## 1. ภาพรวม Claude Code
อ้างอิง: [Overview](https://code.claude.com/docs/en/overview)

### หัวข้อนี้คืออะไร
Claude Code คือผู้ช่วยเขียนโค้ดที่ขับเคลื่อนด้วย AI แบบ **agentic** (ทำงานอัตโนมัติหลายขั้นตอน) ช่วยสร้างฟีเจอร์ แก้บั๊ก และทำงานซ้ำ ๆ ที่นักพัฒนาไม่อยากทำเอง มันเข้าใจทั้งโค้ดเบส (ไฟล์โค้ดทั้งหมดของโปรเจกต์) และทำงานข้ามหลายไฟล์/เครื่องมือได้ในคราวเดียว

### ใช้ทำอะไร
- ทำงานน่าเบื่อแทน: เขียนเทสต์ (ทดสอบโค้ด), แก้ lint (ข้อผิดพลาดรูปแบบโค้ด), แก้ merge conflict (ความขัดแย้งเมื่อรวมโค้ด), อัปเดต dependency (ไลบรารีที่โปรเจกต์พึ่งพา), เขียน release notes
- สร้างฟีเจอร์/แก้บั๊กจากคำอธิบายภาษาธรรมชาติ
- ทำงานกับ git: stage, commit, สร้าง branch, เปิด PR
- เชื่อมเครื่องมือผ่าน MCP, รัน agent teams, ตั้งเวลางาน

### แพลตฟอร์มที่ใช้ได้
- **Terminal (CLI)** — ฟีเจอร์ครบ ทำงานบนบรรทัดคำสั่ง (หน้าต่าง Terminal/PowerShell)
- **VS Code / JetBrains** — ส่วนขยายในโปรแกรมแก้โค้ด พร้อม inline diff (แสดงการเปลี่ยนแปลงแบบเคียงข้างกัน), @-mention, plan review
- **Desktop app** — แอปแยกต่างหาก ดู diff แบบภาพ รันหลาย session (เซสชัน — การทำงานหนึ่งครั้ง) ขนานกัน ตั้งเวลางาน
- **Web** ([claude.ai/code](https://claude.ai/code)) — รันบนคลาวด์ ไม่ต้องตั้งค่าเครื่อง
- เชื่อม CI/CD (GitHub Actions, GitLab), Slack, Chrome ได้

ทุกแพลตฟอร์มใช้เอนจิน Claude Code เดียวกัน ดังนั้น CLAUDE.md, settings และ MCP servers ใช้ร่วมกันได้ทุกที่

### สรุปสั้น ๆ
Claude Code = ผู้ช่วยเขียนโค้ด agentic ที่อ่าน/แก้โค้ดเบส รันคำสั่ง และเชื่อมเครื่องมือ ใช้ได้หลายแพลตฟอร์ม

---

## 2. การติดตั้งและเริ่มต้น (Quickstart)
อ้างอิง: [Quickstart](https://code.claude.com/docs/en/quickstart) · [Setup](https://code.claude.com/docs/en/setup)

### สิ่งที่ต้องมี
- Terminal และโปรเจกต์โค้ด
- บัญชี Claude แบบเสียเงิน (Pro/Max/Team/Enterprise), บัญชี Claude Console, หรือผ่าน cloud provider ที่รองรับ

### วิธีติดตั้ง (Step-by-step)
**แบบ Native Install (แนะนำ):**
```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```
ทางเลือกอื่น: `brew install --cask claude-code` (macOS), `winget install Anthropic.ClaudeCode` (Windows), หรือ apt/dnf/apk บน Linux

> บน Windows แนะนำติดตั้ง [Git for Windows](https://git-scm.com/downloads/win) เพื่อให้ Claude Code ใช้ Bash tool ได้ (ถ้าไม่มีจะใช้ PowerShell แทน)

**เริ่มใช้งาน:**
```bash
cd your-project
claude          # ครั้งแรกจะให้ล็อกอินผ่านเบราว์เซอร์
```
ล็อกอินด้วยบัญชี Pro/Max/Team/Enterprise (แนะนำ), Claude Console, หรือ Bedrock/Vertex/Foundry ใช้ `/login` เพื่อสลับบัญชีภายหลัง

### ลองใช้งานแรก
```text
what does this project do?        # ให้สรุปโปรเจกต์
add a hello world function...     # ให้แก้โค้ด (จะขออนุญาตก่อนแก้ไฟล์)
commit my changes...             # ให้ทำงาน git
```

### ข้อควรระวัง
Claude Code ขออนุญาตก่อนแก้ไฟล์เสมอ อนุมัติทีละรายการ หรือเปิดโหมด "Accept all" ต่อ session ได้

### สรุปสั้น ๆ
ติดตั้งด้วยสคริปต์ → `cd` เข้าโปรเจกต์ → `claude` → ล็อกอิน → สั่งงานเป็นภาษาธรรมชาติ

---

## 3. คำสั่ง CLI ที่ใช้บ่อย
อ้างอิง: [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Built-in commands](https://code.claude.com/docs/en/commands)

### คำสั่งหลัก
| คำสั่ง | ทำอะไร |
|---|---|
| `claude` | เริ่มโหมดโต้ตอบ (interactive) |
| `claude "task"` | รันงานครั้งเดียว |
| `claude -p "query"` | รันคำถามแบบครั้งเดียวแล้วออก (headless/pipe ได้) |
| `claude -c` | ต่อบทสนทนาล่าสุดในไดเรกทอรีนี้ |
| `claude -r` | เลือกบทสนทนาเก่ามาต่อ (resume) |
| `/clear` | ล้างประวัติบทสนทนา |
| `/help` | แสดงคำสั่งที่ใช้ได้ |
| `exit` / Ctrl+D | ออกจาก Claude Code |

### Slash commands ในเซสชัน
`/login`, `/init` (สร้าง CLAUDE.md อัตโนมัติ), `/memory` (ดู/แก้ memory), `/clear`, `/compact` (บีบอัดบริบท), `/resume`, `/schedule`, `/loop` ฯลฯ

### เคล็ดลับ
- พิมพ์ `/` เพื่อดูคำสั่งและ skills ทั้งหมด
- Tab = เติมคำสั่งอัตโนมัติ, ↑ = ประวัติคำสั่ง, **Shift+Tab** = สลับโหมดสิทธิ์ (permission mode)

### ตัวอย่าง pipe / สคริปต์
```bash
tail -200 app.log | claude -p "แจ้งเตือนถ้าพบความผิดปกติ"
git diff main --name-only | claude -p "รีวิวไฟล์ที่เปลี่ยนเรื่องความปลอดภัย"
```

### สรุปสั้น ๆ
ใช้ `claude` เปิดโหมดโต้ตอบ, `-p` สำหรับครั้งเดียว/pipe, และ slash command ในเซสชัน; Shift+Tab สลับโหมดสิทธิ์

---

## 4. Memory — CLAUDE.md และ auto memory
อ้างอิง: [Memory](https://code.claude.com/docs/en/memory)

### หัวข้อนี้คืออะไร
แต่ละ **เซสชัน** (session — การทำงานหนึ่งครั้ง) เริ่มด้วย context ใหม่ (ไม่จำเรื่องเก่า) มีสองกลไกที่พาความรู้ข้ามเซสชัน:
- **CLAUDE.md** — ไฟล์คำสั่งที่ "คุณเขียนเอง" เพื่อให้ Claude รู้บริบทโปรเจกต์ถาวร เช่น "ใช้ TypeScript เสมอ" หรือ "ทดสอบด้วย Jest"
- **Auto memory** — บันทึกที่ "Claude เขียนเองอัตโนมัติ" จากการสังเกตความชอบและรูปแบบการทำงานของคุณ

ทั้งคู่ถูกโหลดตอนเริ่มทุกบทสนทนา และเป็น "บริบท" (แนะนำ) ไม่ใช่กฎบังคับ — ถ้าต้องการบังคับให้ทำแน่นอนทุกครั้ง ต้องใช้ **hook** (สคริปต์อัตโนมัติ) แทน

### CLAUDE.md — ตำแหน่งและขอบเขต (เรียงตามลำดับโหลด)
| ขอบเขต | ตำแหน่ง | ใช้ทำอะไร |
|---|---|---|
| Managed policy | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux/WSL: `/etc/claude-code/CLAUDE.md`, Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | คำสั่งระดับองค์กร (IT/DevOps คุม) |
| User | `~/.claude/CLAUDE.md` | ความชอบส่วนตัวทุกโปรเจกต์ |
| Project | `./CLAUDE.md` หรือ `./.claude/CLAUDE.md` | คำสั่งของทีม (commit เข้า git) |
| Local | `./CLAUDE.local.md` | ความชอบเฉพาะโปรเจกต์ส่วนตัว (ใส่ใน .gitignore) |

### วิธีเขียนให้ได้ผล
- ขนาด: ควร **ไม่เกิน 200 บรรทัด** ต่อไฟล์ (ยาวเกินกิน context และทำให้ทำตามน้อยลง)
- ใช้ header/bullet จัดกลุ่มให้อ่านง่าย
- เจาะจงพอที่จะตรวจสอบได้ เช่น "ใช้ย่อหน้า 2 ช่อง" ดีกว่า "จัดรูปแบบให้สวย"
- หลีกเลี่ยงคำสั่งขัดแย้งกัน
- รัน `/init` เพื่อสร้าง CLAUDE.md เริ่มต้นจากการวิเคราะห์โค้ดเบสอัตโนมัติ
- นำเข้าไฟล์อื่นด้วย `@path/to/file` (ลึกได้สูงสุด 4 ระดับ)

### .claude/rules/ — แยกกฎเป็นไฟล์ย่อย
สำหรับโปรเจกต์ใหญ่ แยกคำสั่งเป็นหลายไฟล์ใน `.claude/rules/` และจำกัดให้โหลดเฉพาะบางไฟล์ด้วย frontmatter `paths`:
```markdown
---
paths:
  - "src/api/**/*.ts"
---
# กฎสำหรับ API
- ทุก endpoint ต้องมี input validation
```

### Auto memory
- เปิดโดยค่าเริ่มต้น (ต้อง Claude Code v2.1.59 ขึ้นไป) ปิดได้ใน `/memory` หรือ `autoMemoryEnabled: false`
- เก็บที่ `~/.claude/projects/<project>/memory/` มีไฟล์ดัชนี `MEMORY.md` (โหลด 200 บรรทัดแรกหรือ 25KB แรกทุกเซสชัน) + ไฟล์หัวข้อย่อย (โหลดเมื่อจำเป็น)
- เป็น markdown ที่แก้/ลบเองได้ ดูได้ผ่าน `/memory`

### ข้อควรระวัง
- ถ้า Claude ไม่ทำตาม CLAUDE.md: ตรวจด้วย `/memory` ว่าไฟล์ถูกโหลด, ทำคำสั่งให้เจาะจงขึ้น, ลบคำสั่งขัดแย้ง, หรือใช้ hook ถ้าต้องบังคับ
- CLAUDE.md ที่ project root จะถูกโหลดซ้ำหลัง `/compact` แต่ไฟล์ใน subdirectory ไม่ถูก re-inject อัตโนมัติ

### สรุปสั้น ๆ
CLAUDE.md = คุณเขียนคำสั่ง (สั้น เจาะจง <200 บรรทัด), Auto memory = Claude จำให้เอง; ทั้งคู่เป็นบริบท ไม่ใช่การบังคับ

---

## 5. การตั้งค่า (Settings)
อ้างอิง: [Settings](https://code.claude.com/docs/en/settings) · [Environment variables](https://code.claude.com/docs/en/env-vars)

### รายละเอียดสำคัญจากเอกสารทางการ
- ตั้งค่าผ่านไฟล์ `settings.json` หลายระดับ (ลำดับความสำคัญ: managed policy > local > project > user)
  - User: `~/.claude/settings.json`
  - Project: `.claude/settings.json` (แชร์กับทีม)
  - Local: `.claude/settings.local.json` (ส่วนตัว ใส่ .gitignore)
  - Managed: ระดับองค์กร บังคับใช้ทับการตั้งค่าผู้ใช้
- ตั้งค่าได้ เช่น สิทธิ์ (permissions), โมเดล, env vars, hooks, sandbox, การ login
- ควบคุมพฤติกรรมเพิ่มได้ผ่าน environment variables (ดู [env-vars](https://code.claude.com/docs/en/env-vars))

### สรุปสั้น ๆ
ตั้งค่าด้วย settings.json หลายระดับ (managed > local > project > user) คุมสิทธิ์/โมเดล/hooks/env ได้

---

## 6. สิทธิ์และโหมดการทำงาน (Permissions)
อ้างอิง: [Permissions](https://code.claude.com/docs/en/permissions) · [Permission modes](https://code.claude.com/docs/en/permission-modes)

### รายละเอียดสำคัญจากเอกสารทางการ
- Claude Code ขออนุญาตก่อนทำงานที่มีผลกระทบ (แก้ไฟล์ รันคำสั่ง) ตามกฎสิทธิ์ที่ตั้งไว้
- มีกฎ `allow` / `deny` / `ask` กำหนดได้ละเอียดถึงระดับเครื่องมือ คำสั่ง หรือ path
- **โหมดสิทธิ์** สลับด้วย **Shift+Tab** ใน CLI (หรือ mode selector ใน VS Code/Desktop):
  - โหมดแก้ไขแบบมีการกำกับ (ถามก่อนทุกครั้ง)
  - โหมดอ่านอย่างเดียว/วางแผน (plan mode)
  - โหมดอัตโนมัติ (auto) ใช้ classifier เบื้องหลังแทนการถามทีละครั้ง
- องค์กรใช้ **managed settings** บังคับ `permissions.deny`, sandbox, การ login ได้

### ข้อควรระวัง
ใช้โหมด auto อย่างเข้าใจความเสี่ยง โดยเฉพาะกับคำสั่งที่เปลี่ยนแปลงระบบ; พิจารณาใช้ sandbox

### สรุปสั้น ๆ
คุมสิทธิ์ด้วยกฎ allow/deny/ask; สลับโหมด plan/auto ด้วย Shift+Tab; องค์กรบังคับผ่าน managed settings

---

## 7. ขยายความสามารถ — Skills, Subagents, Hooks, Plugins
อ้างอิง: [Features overview](https://code.claude.com/docs/en/features-overview)

### Skills
อ้างอิง: [Skills](https://code.claude.com/docs/en/skills) — แพ็กเกจ workflow ที่ทำซ้ำได้ (เช่น `/review-pr`) โหลดเมื่อคุณเรียกหรือเมื่อ Claude เห็นว่าเกี่ยวข้อง แชร์ในทีมได้

### Subagents
อ้างอิง: [Subagents](https://code.claude.com/docs/en/sub-agents) — agent เฉพาะทางที่มี context แยก ช่วยแตกงานยาก ๆ ออกเป็นส่วน ๆ และทำขนานกัน; subagent มี auto memory ของตัวเองได้

### Hooks
อ้างอิง: [Hooks guide](https://code.claude.com/docs/en/hooks-guide) · [Hooks reference](https://code.claude.com/docs/en/hooks) — **Hooks** คือสคริปต์ที่รันอัตโนมัติเมื่อเกิดเหตุการณ์ในวงจรการทำงานของ Claude เช่น ก่อน/หลังแก้ไฟล์ หรือก่อน commit (บันทึกเวอร์ชันโค้ด) ใช้ **บังคับ** กฎได้จริง ต่างจาก CLAUDE.md ที่เป็นแค่คำแนะนำ ตัวอย่าง: จัด format โค้ดอัตโนมัติหลังแก้ไฟล์, รัน lint (ตรวจข้อผิดพลาด) ก่อน commit

### Plugins และ Marketplaces
อ้างอิง: [Plugins](https://code.claude.com/docs/en/plugins) · [Discover plugins](https://code.claude.com/docs/en/discover-plugins) — แพ็กเกจรวม skills, agents, hooks และ MCP servers ติดตั้งจาก marketplace เพื่อขยายความสามารถ และสร้าง/เผยแพร่ marketplace ของตัวเองได้

### เลือกใช้อะไรเมื่อไหร่
- คำสั่งที่ต้องอยู่ทุกเซสชัน → CLAUDE.md
- workflow ที่โหลดเมื่อต้องใช้ → Skill
- ต้องบังคับให้เกิดขึ้นแน่นอน ณ จุดหนึ่ง → Hook
- งานย่อยที่มี context แยก → Subagent
- รวมทั้งหมดเพื่อแจกจ่าย → Plugin

### สรุปสั้น ๆ
CLAUDE.md (บริบทถาวร), Skills (workflow ตามต้องการ), Hooks (บังคับด้วยเชลล์), Subagents (งานย่อยแยก context), Plugins (แพ็กเกจแจกจ่าย)

---

## 8. เชื่อมเครื่องมือผ่าน MCP
อ้างอิง: [MCP](https://code.claude.com/docs/en/mcp) · [MCP quickstart](https://code.claude.com/docs/en/mcp-quickstart)

### หัวข้อนี้คืออะไร
MCP (Model Context Protocol) เป็นมาตรฐานเปิดเชื่อม AI กับแหล่งข้อมูล/บริการภายนอก ทำให้ Claude Code อ่านดีไซน์ใน Google Drive, อัปเดต ticket ใน Jira, ดึงข้อมูลจาก Slack หรือใช้เครื่องมือภายในของคุณได้

### วิธีใช้งาน
1. เพิ่ม MCP server (ผ่านคำสั่ง `claude mcp add ...` หรือไฟล์ตั้งค่า)
2. อนุญาตสิทธิ์ที่ server ขอ
3. เรียกใช้ tools ของ server นั้นภายในเซสชัน

### สรุปสั้น ๆ
MCP เชื่อม Claude Code กับเครื่องมือภายนอก (Drive, Jira, Slack ฯลฯ) แบบมาตรฐานเดียว

---

## 9. เครื่องมือในตัว (Tools)
อ้างอิง: [Tools reference](https://code.claude.com/docs/en/tools-reference) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

### รายละเอียดสำคัญจากเอกสารทางการ
Claude Code ทำงานเป็น agentic loop และมีเครื่องมือในตัว เช่น อ่าน/เขียน/แก้ไฟล์ (Read/Write/Edit), ค้นหา (Grep/Glob), รันเชลล์ (Bash), งาน git, ค้นเว็บ ฯลฯ — แต่ละเครื่องมือมีข้อกำหนดเรื่องสิทธิ์ที่ต่างกัน

### สรุปสั้น ๆ
มีเครื่องมือในตัวครบ (อ่าน/เขียนไฟล์ ค้นหา รันเชลล์ git เว็บ) ทำงานเป็นวง agentic พร้อมระบบสิทธิ์

---

## 10. การทำงานอัตโนมัติและตั้งเวลา
อ้างอิง: [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) · [Routines](https://code.claude.com/docs/en/routines) · [Common workflows](https://code.claude.com/docs/en/common-workflows)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Routines** — รันบนเซิร์ฟเวอร์ของ Anthropic ทำงานต่อแม้ปิดเครื่อง ตั้งจากเว็บ/Desktop หรือ `/schedule`; **trigger** (เปิดใช้งาน) จาก API หรือ GitHub events ได้
- **Desktop scheduled tasks** — รันบนเครื่องคุณเอง เข้าถึงไฟล์/เครื่องมือในเครื่องได้
- **`/loop`** — วน prompt ซ้ำภายในเซสชัน CLI สำหรับ polling (ตรวจสอบสถานะซ้ำๆ) สั้น ๆ
- ตัวอย่างงานอัตโนมัติ: รีวิว PR (คำขอรวมโค้ด) ตอนเช้า, วิเคราะห์ **CI** (ระบบทดสอบ) ที่ล้มเหลวข้ามคืน, ตรวจ dependency (ไลบรารีที่ใช้) รายสัปดาห์

### สรุปสั้น ๆ
ตั้งเวลางานด้วย Routines (คลาวด์), Desktop tasks (เครื่อง local), หรือ `/loop` (วนในเซสชัน)

---

## 11. แพลตฟอร์มและการเชื่อมต่อ
อ้างอิง: [Platforms](https://code.claude.com/docs/en/platforms) · [VS Code](https://code.claude.com/docs/en/vs-code) · [Desktop](https://code.claude.com/docs/en/desktop) · [Web](https://code.claude.com/docs/en/claude-code-on-the-web)

### รายละเอียดสำคัญจากเอกสารทางการ
- **VS Code / Cursor / JetBrains** — ส่วนขยายพร้อม inline diff, @-mention, plan review
- **Desktop app** — รีวิว diff แบบภาพ, หลาย session ขนานด้วย Git isolation, ตั้งเวลางาน, Dispatch จากมือถือ
- **Web (claude.ai/code)** — รันงานยาวบนคลาวด์ ดึงกลับมาที่ terminal ด้วย `claude --teleport`
- **Remote Control** — ต่อเซสชัน local จากมือถือ/เบราว์เซอร์อื่น
- **CI/CD (ระบบทดสอบและปล่อยโค้ดอัตโนมัติ)** — [GitHub Actions](https://code.claude.com/docs/en/github-actions), [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd), รีวิวโค้ดอัตโนมัติทุก PR (Pull Request — คำขอรวมโค้ด)
- **Slack** — มอบหมายงานด้วย `@Claude` ในแชต, **Chrome** — ดีบักเว็บแอป

### สรุปสั้น ๆ
ใช้ได้ใน IDE, Desktop, Web, มือถือ และเชื่อม CI/CD, Slack, Chrome — ทุกที่ใช้เอนจิน/ตั้งค่าเดียวกัน

---

## 12. ความปลอดภัยและ Sandbox
อ้างอิง: [Security](https://code.claude.com/docs/en/security) · [Sandboxing](https://code.claude.com/docs/en/sandboxing) · [Data usage](https://code.claude.com/docs/en/data-usage)

### รายละเอียดสำคัญจากเอกสารทางการ
- มีระบบสิทธิ์และการอนุมัติก่อนทำงานที่มีผลกระทบ
- **Sandboxing (กักกันสภาพแวดล้อม)** — แยกระบบไฟล์และเครือข่ายออกมาเมื่อ Claude รันคำสั่ง Bash เพื่อให้ทำงานอัตโนมัติได้โดยไม่เสี่ยงกระทบระบบอื่น
- ระวัง **prompt injection** (คำสั่งแฝงในไฟล์หรือหน้าเว็บที่หลอกให้ AI ทำในสิ่งที่ไม่ต้องการ) จากเนื้อหาภายนอก
- องค์กรมี **Zero Data Retention (ZDR)** (ไม่เก็บข้อมูลหลังประมวลผล) สำหรับ Claude for Enterprise และตั้งค่าเครือข่าย เช่น proxy (เซิร์ฟเวอร์กลาง), CA (ใบรับรองความปลอดภัย), mTLS (การยืนยันตัวตนสองฝ่าย) ได้

### สรุปสั้น ๆ
มีระบบสิทธิ์ + sandbox แยกไฟล์/เครือข่าย; องค์กรมี ZDR และตั้งค่าเครือข่ายเฉพาะได้

---

## 13. การแก้ปัญหา (Troubleshooting)
อ้างอิง: [Troubleshooting](https://code.claude.com/docs/en/troubleshooting) · [Costs](https://code.claude.com/docs/en/costs)

### ปัญหาที่พบบ่อยและแนวทาง
- **ติดตั้งไม่ผ่าน** — ดู [installation troubleshooting](https://code.claude.com/docs/en/troubleshoot-install); บน Windows ตรวจว่าใช้ PowerShell หรือ CMD ให้ถูกคำสั่ง
- **Claude ไม่ทำตาม CLAUDE.md** — ใช้ `/memory` ตรวจว่าไฟล์ถูกโหลด ทำคำสั่งให้เจาะจง หรือใช้ hook
- **context เต็ม/ทำงานยาว** — เมื่อบทสนทนายาวมากจน Claude "จำไม่ไหว" ให้ใช้ `/compact` (สรุปบทสนทนา), เลือกโมเดลที่มี context ใหญ่กว่า, หรือใช้ preprocessing hooks ลดปริมาณข้อมูลที่ส่งไป
- **ต้นทุนสูง** — ติดตามการใช้ token, ตั้ง spend limit ของทีม, ปรับ extended thinking และการเลือกโมเดล (ดู [Costs](https://code.claude.com/docs/en/costs))

### สรุปสั้น ๆ
ปัญหาส่วนใหญ่แก้ได้ด้วยการตรวจการติดตั้ง, ใช้ `/memory` กับ CLAUDE.md, `/compact` จัดการ context และคุมต้นทุนด้วยการเลือกโมเดล/spend limit

---

## หัวข้ออ้างอิงเพิ่มเติม
- Best practices: https://code.claude.com/docs/en/best-practices
- Common workflows: https://code.claude.com/docs/en/common-workflows
- Agent SDK (headless): https://code.claude.com/docs/en/headless
- Changelog: https://code.claude.com/docs/en/changelog
- ดัชนีเอกสารทั้งหมด: https://code.claude.com/docs/llms.txt
