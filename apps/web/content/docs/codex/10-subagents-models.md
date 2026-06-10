---
title: "Subagents และ Models — การเลือก Model และใช้ Parallel Agents"
tool: "Codex"
icon: "icon-docs"
level: "pro"
summary: "เรียนรู้วิธีใช้ Subagents เพื่อทำงานแบบ Parallel, การเลือก Model ที่เหมาะสมกับแต่ละงาน, การปรับ Reasoning Level และ AGENTS.md Customization สำหรับทีม"
readTime: "7 นาที"
readers: "0"
locked: false
order: 10
---

# Codex คู่มือภาษาไทย — ตอนที่ 10: Subagents และ Models

> อ้างอิงหลัก: [Codex Subagents](https://developers.openai.com/codex/concepts/subagents) | [Codex Customization](https://developers.openai.com/codex/concepts/customization)

---

## Subagents คืออะไร

Subagents (ตัวแทน AI ลูก) คือ Agent (ตัวแทน AI) ที่ Codex **สร้างและส่งงานไปให้** เพื่อทำงานแบบ **Parallel** (ขนาน — พร้อมกัน) โดยแยกออกจาก Main Thread (กระทู้หลัก — บทสนทนาหลักกับ AI)

แทนที่ Main Thread จะทำทุกอย่างเองจนเต็ม Context Window (หน้าต่างบริบท — ปริมาณข้อมูลที่ AI รับได้) ด้วย Logs และ Output ระหว่างทาง Codex จะ Delegate (มอบหมาย) งานที่เหมาะสมไปให้ Subagents ทำแยก แล้วนำ Summary (สรุป) กลับมา

### ทำไมต้องใช้ Subagents

**ปัญหาที่ Subagents แก้:**

1. **Context Pollution** (บริบทปนเปื้อน) — Output ระหว่างทาง (logs, test results, intermediate analysis) ทำให้ข้อมูลสำคัญถูกฝัง
2. **Context Rot** (บริบทเสื่อมคุณภาพ) — Performance ลดลงเมื่อ Conversation ยาวขึ้น เพราะ Model ต้อง Process ข้อมูลที่ไม่เกี่ยวข้อง

โดย Subagents ทำงานใน Thread แยก รับผลลัพธ์เป็น **Summary** กลับมายัง Main Thread เท่านั้น

---

## งานที่เหมาะกับ Subagents

### เหมาะมาก: Read-heavy Tasks

| งาน | ตัวอย่าง |
|-----|---------|
| Exploration (สำรวจ) | "สำรวจ codebase แล้วบอกว่า authentication อยู่ที่ไหนบ้าง" |
| Test Execution (รันทดสอบ) | รัน test suite และ summarize failures (สรุปผลที่ fail) |
| Log Analysis (วิเคราะห์บันทึก) | วิเคราะห์ log ขนาดใหญ่หา pattern |
| Document Summary | สรุป specs, docs หลายๆ ไฟล์ |
| Security Review (ตรวจสอบความปลอดภัย) | ตรวจหา vulnerabilities (ช่องโหว่) ในโค้ด |
| Code Review | วิเคราะห์โค้ดเพื่อหา issues |

### ไม่เหมาะ: Write-heavy Tasks แบบ Parallel

หลีกเลี่ยงการให้ Subagents หลายตัว **แก้ไขไฟล์เดียวกัน** พร้อมกัน เพราะจะเกิด Conflict (ความขัดแย้ง) และ Overhead (ภาระงานเพิ่มเติม) ในการ Coordinate (ประสานงาน)

---

## วิธีใช้ Subagents

Subagents ต้องการ **คำสั่งชัดเจนจากผู้ใช้** — Codex จะไม่ Spawn (สร้าง) เองอัตโนมัติ

### Prompt ตัวอย่าง

```
สร้าง subagents 3 ตัวพร้อมกัน:
1. Subagent สำหรับตรวจ security risks (ความเสี่ยงด้านความปลอดภัย) ใน src/api/
2. Subagent สำหรับหา test gaps (ช่องว่างของการทดสอบ) ใน src/services/
3. Subagent สำหรับ analyze performance bottlenecks (จุดที่ทำให้ระบบช้า) ใน src/db/

เสร็จแล้วให้ summarize findings แยกตาม category
```

### ผลที่ได้

Main Thread จะได้รับ Summary จากแต่ละ Subagent เช่น:

```
Security Analysis:
- P0: SQL injection risk in /api/search (line 45)
- P1: Missing input sanitization in /api/upload

Test Gaps:
- UserService: 0% coverage on error paths
- AuthService: missing tests for token refresh

Performance:
- N+1 query in getUserOrders() — affects /dashboard
- Missing index on users.email column
```

แทนที่จะได้ raw logs (ข้อมูลดิบ) หลายพันบรรทัด

---

## Models ที่ใช้ได้ใน Codex

Codex รองรับ Model (โมเดล AI — เวอร์ชันของระบบ AI ที่มีความสามารถต่างกัน) หลายตัว แต่ละตัวมีจุดเด่นต่างกัน:

### GPT-5.5 — Model หลักสำหรับงานซับซ้อน

- **เหมาะกับ:** งานที่ต้องการ Planning (วางแผน), Multi-step reasoning (การคิดหลายขั้นตอน), งาน Mission Critical (งานที่สำคัญมาก ผิดพลาดไม่ได้)
- **ข้อดี:** ฉลาดที่สุด, เข้าใจ context ซับซ้อนได้ดี
- **ข้อเสีย:** ช้ากว่าและใช้ Credits (หน่วยนับการใช้งาน) มากกว่า

### GPT-5.4 — สมดุลระหว่าง Capability และ Speed

- **เหมาะกับ:** งาน Coding ทั่วไป, Feature implementation, Bug fixes
- **ข้อดี:** เร็วพอสมควร, ครอบคลุมงาน coding ส่วนใหญ่
- **ข้อเสีย:** อาจสู้งานซับซ้อนมากๆ ไม่ได้เท่า GPT-5.5

### GPT-5.4-mini — เร็วและประหยัด

- **เหมาะกับ:** Subagent tasks, งาน Exploration (สำรวจ), Quick questions, Large file review
- **ข้อดี:** เร็วมาก, ใช้ Credits น้อย
- **ข้อเสีย:** ความสามารถน้อยกว่าสำหรับงานซับซ้อน

### GPT-5.3-Codex — เชี่ยวชาญด้าน Code โดยเฉพาะ

- **เหมาะกับ:** งาน Coding เฉพาะทาง, Code analysis
- **สำหรับ:** Plus, Pro, Business plans
- **ข้อดี:** Optimized (ปรับแต่งให้ดีที่สุด) สำหรับงาน coding

### GPT-5.3-Codex-Spark — Research Preview

- **สำหรับ:** Pro plan เท่านั้น
- **เหมาะกับ:** งานที่ต้องการ Latency (ความหน่วง — เวลาตอบสนอง) ต่ำมากๆ
- **สถานะ:** Research preview (ทดลองใช้งาน — ยังไม่เสถียร)

---

## การเลือก Model ที่เหมาะสม

### Quick Decision Guide

```
งานแบบไหน → ใช้ Model ไหน

ซับซ้อนมาก, Multi-step planning → GPT-5.5
งาน Coding ทั่วไป → GPT-5.4
Subagent / Exploration / Quick → GPT-5.4-mini
งาน Code analysis เฉพาะ → GPT-5.3-Codex
ต้องการ Latency ต่ำมาก (Pro) → GPT-5.3-Codex-Spark
```

### เปลี่ยน Model ด้วย /model command

```bash
# ใน CLI
/model gpt-5.4-mini

# หรือเลือกจาก menu
/model
```

---

## Reasoning Level

นอกจาก Model แล้ว ยังปรับ **Reasoning Level** (ระดับการคิดวิเคราะห์ — ยิ่งสูงยิ่งใช้ Token มากแต่ผลลัพธ์ดีกว่า) ได้:

| Level | เหมาะกับ | ผลต่อ Tokens (หน่วยข้อความ — ประมาณ 1 คำ) |
|-------|---------|------------|
| **High** | Security review, Complex logic, Edge cases | ใช้มากกว่า แต่คุณภาพสูง |
| **Medium** | งานทั่วไป (Default) | สมดุล |
| **Low** | งานตรงไปตรงมา, ต้องการ Speed | เร็วกว่า ใช้น้อยกว่า |

### กรณีที่ควรใช้ High Reasoning

- Security vulnerability analysis (วิเคราะห์ช่องโหว่ความปลอดภัย)
- Complex refactoring ที่ต้องเข้าใจ business logic (ตรรกะทางธุรกิจ) ลึก
- Debugging ที่ stack trace ซับซ้อน
- Algorithm design และ optimization (การออกแบบและปรับปรุงขั้นตอนวิธี)

### กรณีที่ควรใช้ Low Reasoning

- Simple file operations (การจัดการไฟล์พื้นฐาน)
- Boilerplate generation (สร้างโครงโค้ดพื้นฐาน)
- Format conversion (แปลงรูปแบบข้อมูล)
- Documentation updates ที่ตรงไปตรงมา

---

## Subagents + Model Selection Strategy

เมื่อใช้ Subagents สามารถกำหนด Model ต่างกันสำหรับแต่ละ Subagent:

```
Main agent: ใช้ GPT-5.5 สำหรับ Planning และ Final synthesis (สังเคราะห์ผลลัพธ์สุดท้าย)

สร้าง subagents:
- Security review subagent: ใช้ GPT-5.5 high reasoning
  (ต้องการ accuracy (ความแม่นยำ) สูงสุด)
- Exploration subagent: ใช้ GPT-5.4-mini
  (แค่อ่านและ summarize)
- Test analysis subagent: ใช้ GPT-5.4-mini
  (รัน tests และ report results)
```

---

## AGENTS.md — Customization ระดับ Repository

`AGENTS.md` คือวิธีที่ทรงพลังที่สุดในการ Customize (ปรับแต่ง) Codex ให้เหมาะกับทีม

### โครงสร้าง

```
~/.codex/AGENTS.md          # Global — Personal preferences
repo-root/AGENTS.md         # Repo-wide — Team conventions
src/api/AGENTS.md           # Directory-specific — API rules
src/components/AGENTS.md    # Directory-specific — Component rules
```

**หลัก:** ไฟล์ที่อยู่ใกล้กว่า Override (แทนที่) ไฟล์ที่อยู่ห่างกว่า

### ตัวอย่าง AGENTS.md ที่ครบถ้วน

```markdown
# Project Guidelines for Codex

## Build & Test Commands
- Install: `npm install`
- Build: `npm run build`
- Test: `npm test` or `npm run test:watch`
- Lint (ตรวจสอบคุณภาพโค้ด): `npm run lint`
- Type check (ตรวจสอบชนิดข้อมูล): `npm run typecheck`

## Repository Conventions
- Language: TypeScript strict mode
- Framework: Next.js 15 App Router
- Styling: Tailwind CSS + shadcn/ui
- State: Zustand (ไลบรารีจัดการ state) for global state, React Query for server state
- Database: Prisma + PostgreSQL

## Code Style
- ใช้ named exports ไม่ใช่ default exports (ยกเว้น page components)
- ทุก async function ต้องมี try-catch หรือ error boundary (ขอบเขตจับข้อผิดพลาด)
- Component ต้องมี TypeScript interface สำหรับ props (คุณสมบัติที่ส่งเข้า component)
- ไม่มี console.log ใน production code

## File Structure
- Components: src/components/[name]/index.tsx + [name].stories.tsx
- Services: src/services/[domain]/index.ts
- API routes: src/app/api/[endpoint]/route.ts
- Tests: ไว้ใน __tests__/ ใกล้ไฟล์ที่ test

## Review Guidelines
- ตรวจ SQL injection ทุก query (ใช้ Prisma parameterized queries (การใส่ค่าแบบปลอดภัย) เสมอ)
- ตรวจ authentication ทุก API route ที่ไม่ใช่ public
- ตรวจ input validation ด้วย zod ทุก user input
- ไม่ expose (เปิดเผย) internal error messages ใน API responses

## Common Gotchas
- Prisma connection: ใช้ singleton pattern (รูปแบบที่สร้าง instance เดียว) ใน src/lib/db.ts
- Environment variables (ตัวแปรสภาพแวดล้อม): ใช้ src/config/env.ts ไม่ใช่ process.env โดยตรง
- Date handling: ใช้ date-fns ไม่ใช่ native Date methods
```

### เมื่อไหรควร Update AGENTS.md

- เมื่อ Codex ทำผิดซ้ำๆ ในเรื่องเดิม
- เมื่อ PR review มี comment เดิมซ้ำๆ
- เมื่อทีมมี Convention ใหม่
- เมื่อ Codex อ่านไฟล์ที่ไม่เกี่ยวข้องมากเกินไป (เพิ่ม routing guidance)

### Delegate AGENTS.md Update ให้ Codex

```
@codex อัปเดต AGENTS.md ให้รวม convention ใหม่:
"ทุก API endpoint ต้องมี rate limiting middleware (ตัวกลางจำกัดความถี่เรียก API)"
ดูตัวอย่าง implementation จาก @src/middleware/rateLimiter.ts
```

---

## Skills — Reusable Workflows

Skills (ทักษะ — Workflow ที่บันทึกไว้ใช้ซ้ำ) คือ Workflow ที่บันทึกเป็น Package ใช้ซ้ำได้

### โครงสร้าง Skill

```
.agents/skills/
  release-check/
    ├── SKILL.md          # Instructions (required)
    ├── scripts/
    │   ├── check.sh      # Executable scripts
    │   └── validate.py
    ├── references/       # Documentation
    └── assets/           # Templates
```

### ตัวอย่าง SKILL.md

```markdown
# Release Check Skill

## Purpose
ตรวจสอบ codebase พร้อม release (ปล่อยให้ใช้งาน) หรือยัง

## Steps
1. รัน full test suite
2. ตรวจ security vulnerabilities (ช่องโหว่ความปลอดภัย) ด้วย npm audit
3. ตรวจ TypeScript errors
4. ตรวจ missing environment variables
5. ตรวจ TODO/FIXME comments ที่อาจเป็น blockers (สิ่งกีดขวาง)
6. สร้าง release checklist report

## Output
สร้าง RELEASE-CHECK.md พร้อม:
- Pass/Fail summary
- รายการ issues ที่ต้องแก้ก่อน release
- Timestamp (เวลาที่บันทึก)
```

### การใช้ Skill

Codex สามารถ **Discover Skills อัตโนมัติ** จาก task description:

```
เช็คว่า codebase พร้อม deploy (นำขึ้น server ให้ใช้งาน) ไหม
```

Codex จะเลือกใช้ `release-check` skill โดยอัตโนมัติ

หรือเรียกใช้โดยตรง:

```
รัน $release-check skill
```

### Global vs Project Skills

```
$HOME/.agents/skills/    # Personal global skills (ทุก project)
.agents/skills/          # Project skills (repo-specific)
```

---

## สรุป: เมื่อไหรใช้อะไร

| สถานการณ์ | ทางเลือกที่แนะนำ |
|-----------|----------------|
| งานซับซ้อน, Mission Critical | GPT-5.5 + High Reasoning |
| งาน Coding ปกติ | GPT-5.4 + Medium Reasoning |
| Explore codebase, Quick tasks | GPT-5.4-mini |
| วิเคราะห์หลายด้านพร้อมกัน | Subagents parallel (ขนาน) |
| ต้องการ Codex รู้ convention ทีม | AGENTS.md |
| Workflow ที่ทำซ้ำบ่อยๆ | Skills |
| ต้องการลด Context pollution | Subagents สำหรับ exploration/analysis |
