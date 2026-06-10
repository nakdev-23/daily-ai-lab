---
title: "Workflows ขั้นสูง — Multi-file, PR Automation และ GitHub Integration"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้ Workflow ขั้นสูงสำหรับการแก้ไขหลายไฟล์พร้อมกัน, การสร้างและ Review PR อัตโนมัติ, การใช้ @codex mention บน GitHub และการทำ Cloud-based parallel tasks"
readTime: "8 นาที"
readers: "0"
locked: false
order: 9
---

# Codex คู่มือภาษาไทย — ตอนที่ 9: Workflows ขั้นสูง

> อ้างอิงหลัก: [Codex Workflows](https://developers.openai.com/codex/workflows) | [Codex Web](https://developers.openai.com/codex/cloud) | [GitHub Integration](https://developers.openai.com/codex/integrations/github)

---

## ภาพรวม Workflow Surfaces

Codex ทำงานได้ 3 Surface (พื้นที่ทำงาน) หลัก แต่ละอันเหมาะกับงานต่างกัน:

| Surface | เหมาะกับ | การทำงาน |
|---------|---------|---------|
| **CLI** (ส่วนต่อประสานบรรทัดคำสั่ง) | งาน Interactive (โต้ตอบทันที), Debug, Quick tasks | รันในเครื่อง, Sandboxed (ทำงานในพื้นที่จำกัด — ไม่กระทบส่วนอื่น) |
| **IDE Extension** (ส่วนขยายโปรแกรมแก้โค้ด) | เขียนโค้ดประจำวัน, อ่านไฟล์ปัจจุบัน | รันในเครื่อง, context จาก editor |
| **Codex Cloud** | งานใหญ่, Multi-file (หลายไฟล์พร้อมกัน), Background tasks | รันบน Cloud, สร้าง PR ได้โดยตรง |

---

## Workflow 1: Multi-file Editing

งานที่ต้องแก้ไขหลายไฟล์พร้อมกัน เช่น เพิ่ม Feature ใหม่, Migration (การย้ายระบบ), Refactoring (ปรับโครงสร้างโค้ด)

### แนะนำให้ใช้ Codex Cloud เพราะ:
- รัน Background (ทำงานเบื้องหลัง) ไม่ต้องรอ
- สร้าง PR (Pull Request — คำขอรวมโค้ด) ได้โดยตรง
- Review diff (ดูความแตกต่างก่อนและหลัง) ก่อน Merge ได้

### ขั้นตอน

**ขั้นที่ 1: วางแผนก่อน (Local)**

```
ฉันต้องการเพิ่ม Dark Mode ให้กับ App
ช่วยวาง plan ว่าต้องแก้ไขไฟล์อะไรบ้าง
และแต่ละขั้นทำอะไร อย่าเริ่มทำก่อน
```

Codex จะ List ออกมาเช่น:
1. เพิ่ม theme tokens (ตัวแปรสี/ขนาด — ค่าที่กำหนดรูปลักษณ์ของ Design System) ใน `src/styles/tokens.css`
2. อัปเดต `ThemeProvider` ใน `src/context/theme.tsx`
3. เพิ่ม toggle component ใน `src/components/ThemeToggle.tsx`
4. อัปเดต global styles ใน `src/app/globals.css`

**ขั้นที่ 2: Delegate ไป Cloud**

หลังเห็น plan แล้วถ้าโอเค ให้ Delegate (มอบหมาย):

```
Plan โอเค เริ่มทำได้เลย
หลังเสร็จรัน npm test และ npm run build ต้องผ่าน
```

**ขั้นที่ 3: Review และ Merge**

Codex Cloud จะสร้าง PR ให้ ตรวจสอบ diff ก่อน merge

---

## Workflow 2: Bug Fix พร้อม Context ครบ

### ขั้นตอน

```
Bug: User ไม่สามารถ upload รูปที่มีชื่อไฟล์มี space ได้
Reproduction:
1. ไปที่ /profile
2. คลิก Change Avatar
3. เลือกไฟล์ชื่อ "my photo.jpg"
4. Error: "Failed to upload"

Stack trace: (ไม่มี error log ใน console)
Network tab: POST /api/upload → 400 Bad Request, body: "Invalid filename"

Suspect: @src/api/upload.ts @src/utils/filename.ts
Constraint: อย่าเปลี่ยน API endpoint path

เสร็จแล้ว:
1. รัน reproduction steps อีกครั้ง bug ต้องหาย
2. รัน npm test -- --testPathPattern=upload
```

### สิ่งที่ Codex จะทำ

1. อ่านไฟล์ `upload.ts` และ `filename.ts`
2. ค้นหา filename validation logic (ตรรกะตรวจสอบชื่อไฟล์)
3. พบว่า regex (นิพจน์ปกติ — รูปแบบข้อความสำหรับค้นหา/จับคู่) ไม่ handle space ใน filename
4. แก้ไข validation rule (กฎการตรวจสอบ)
5. รัน test เพื่อยืนยัน

---

## Workflow 3: Test Suite ครบวงจร

### สร้าง Test สำหรับ Existing Code

```
เขียน comprehensive test suite (ชุดทดสอบครบวงจร) สำหรับ @src/services/auth/

ครอบคลุม:
1. Unit tests สำหรับแต่ละ function
2. Integration tests สำหรับ auth flow ทั้งหมด
3. Edge cases: expired token (token หมดอายุ), invalid credentials (ข้อมูลประจำตัวไม่ถูกต้อง), account locked

Framework: Vitest + Testing Library
Mocking: ใช้ vi.mock สำหรับ external dependencies (สิ่งที่โค้ดต้องพึ่งพาจากภายนอก)
Pattern: ดูจาก @src/services/user/__tests__/

Target coverage: 80%+ statement coverage (เปอร์เซ็นต์โค้ดที่ถูกทดสอบ)
```

### สร้าง Test ก่อนเขียน Code (TDD)

TDD (Test-Driven Development — การพัฒนาโดยเขียน Test ก่อน แล้วค่อยเขียนโค้ด):

```
เขียน failing tests ก่อนสำหรับ feature Cart ที่ยังไม่มี

Feature spec: @docs/cart-feature-spec.md
Framework: Vitest

Tests ต้อง fail ตอนแรก เพราะ implementation ยังไม่มี
จากนั้น implement ให้ tests ผ่านทั้งหมด
```

---

## Workflow 4: Code Review อัตโนมัติ

### วิธีที่ 1: Local Review ด้วย CLI

```bash
# รัน code review ก่อน commit (บันทึกการเปลี่ยนแปลงลง repository)
codex review

# หรือระบุ focus area
codex review --focus security,performance
```

### วิธีที่ 2: GitHub PR Review ด้วย @codex

เมื่อ PR ถูกสร้างขึ้น Comment บน PR:

```
@codex review
```

Codex จะ:
- อ่านโค้ดทั้งหมดใน PR
- Flag (ติดธงแจ้งเตือน) เฉพาะ **P0 (Critical — วิกฤต)** และ **P1 (High — สำคัญมาก)** issues
- Post review comments บน GitHub

### วิธีที่ 3: Auto Review ทุก PR

เปิดใน Codex Settings:
1. ไปที่ Codex Settings > GitHub Integration
2. เปิด "Automatic PR Reviews"
3. Codex จะ Review ทุก PR ที่ถูก Open โดยอัตโนมัติ

### Custom Review Guidelines ด้วย AGENTS.md

สร้างไฟล์ `AGENTS.md` (ไฟล์กำหนดพฤติกรรมของ Agent AI ในโปรเจกต์) ในโปรเจกต์เพื่อกำหนด Review criteria:

```markdown
## Code Review Guidelines

### Security
- ตรวจ SQL injection (การฝังคำสั่ง SQL ที่เป็นอันตราย) ทุก database query
- ตรวจ input validation (การตรวจสอบข้อมูลขาเข้า) ทุก user input
- ตรวจ authentication (การยืนยันตัวตน) ทุก protected endpoint

### Performance
- หลีกเลี่ยง N+1 queries (การ query ฐานข้อมูลซ้ำโดยไม่จำเป็น)
- ตรวจ unnecessary re-renders ใน React

### Code Quality
- ใช้ TypeScript strict mode
- ไม่มี console.log ใน production code
- ทุก async function ต้องมี error handling
```

Codex จะใช้ Guidelines จาก `AGENTS.md` ที่ใกล้ที่สุดกับไฟล์ที่เปลี่ยน

---

## Workflow 5: GitHub @codex Integration

### ใช้ @codex บน GitHub Issues

เมื่อเจอ Issue (รายงานปัญหา/งาน) บน GitHub ให้ tag Codex เพื่อสั่งงาน:

```
@codex implement this feature based on the spec above
```

Codex จะ:
1. อ่าน Issue description
2. สร้าง Branch (สาขา — พื้นที่โค้ดแยกสำหรับทำงาน) ใหม่
3. Implement feature
4. สร้าง PR พร้อม description

### ใช้ @codex บน PR Comments

```
# ขอให้แก้ไข P1 issue ที่ review เจอ
@codex fix the P1 issue about missing error handling

# ขอให้แก้ CI (Continuous Integration — ระบบรันทดสอบอัตโนมัติ) ที่ fail
@codex fix the CI failures

# ขอให้เพิ่ม tests
@codex add tests for the new authentication flow

# ขอให้อัปเดต docs
@codex update the README to reflect the API changes in this PR
```

### สิ่งที่ @codex ทำได้

- อ่าน context จาก PR/Issue ได้ทั้งหมด
- Push commits (บันทึกการเปลี่ยนแปลงโค้ด) กลับไปยัง branch เดิมได้ (ถ้ามี permission)
- สร้าง PR ใหม่ได้
- Post comment พร้อมอธิบายการเปลี่ยนแปลง

---

## Workflow 6: Cloud-based Refactoring

### กรณี: ย้ายจาก REST API เป็น tRPC

REST API (รูปแบบ API ที่ใช้ HTTP มาตรฐาน) และ tRPC (ไลบรารี TypeScript ที่ทำให้เรียก API เหมือนเรียกฟังก์ชัน):

```
Refactor ทั้ง API layer จาก REST เป็น tRPC
ไฟล์ที่ต้องเปลี่ยน: src/api/, src/pages/api/, src/hooks/

Plan:
1. สร้าง tRPC router (ตัวกำหนดเส้นทาง API) ใหม่
2. ย้าย business logic จาก REST handlers
3. อัปเดต client-side hooks
4. ลบ REST endpoints เก่า

Constraint:
- อย่าเปลี่ยน business logic
- Frontend behavior ต้องเหมือนเดิมทุกอย่าง

Verification:
- รัน npm test ผ่านทุก test
- รัน npm run build ไม่มี error
```

### กรณี: Database Migration

```
อัปเดต Prisma schema (โครงสร้างฐานข้อมูล) ตาม @migrations/v2-spec.md
และ update ทุก query (คำสั่งดึงข้อมูล) ที่ได้รับผลกระทบ

Steps:
1. อัปเดต schema.prisma
2. สร้าง migration file
3. อัปเดต queries ใน src/lib/db/
4. อัปเดต types ที่เปลี่ยนแปลง

ห้ามแตะ: business logic ใน src/services/
```

---

## Workflow 7: Documentation ขนาดใหญ่

### Auto-generate API Documentation

```
สร้าง OpenAPI spec (มาตรฐานอธิบาย API — ให้เครื่องมืออื่นอ่านได้อัตโนมัติ) จาก route handlers ใน @src/app/api/

Format: OpenAPI 3.1
Output: docs/api/openapi.yaml

ครอบคลุม:
- ทุก endpoint
- Request/Response schemas (โครงสร้างข้อมูลที่รับ-ส่ง)
- Authentication requirements
- Error responses
```

### อัปเดต README อัตโนมัติ

```
อ่าน codebase ปัจจุบันใน @src/ และ @package.json
แล้วอัปเดต @README.md ให้ตรงกับสถานะปัจจุบัน

อัปเดต sections:
- Prerequisites (สิ่งที่ต้องติดตั้งก่อน)
- Installation
- Environment variables (ตัวแปรสภาพแวดล้อม — การตั้งค่าที่เปลี่ยนได้ตามสภาพแวดล้อม)
- Available scripts
- Project structure

อย่าเปลี่ยน: บทนำและ Vision section
```

---

## Context ใน Cloud vs Local

### Cloud Tasks มี Access ถึง:
- Repository (ที่เก็บโค้ด — เหมือนโฟลเดอร์โปรเจกต์บน Git) ทั้งหมด (ที่ connect ไว้)
- อ่าน/เขียน/รัน commands ใน Sandbox (พื้นที่ทำงานจำกัด — ปลอดภัยจากการแตะระบบภายนอก)
- สร้าง PR บน GitHub
- รัน CI/CD checks (ระบบตรวจสอบและ deploy อัตโนมัติ)

### Local Tasks มี Access ถึง:
- Working directory ที่กำหนด
- Tools ที่ติดตั้งในเครื่อง
- ไฟล์ที่เปิดใน IDE (สภาพแวดล้อมพัฒนาแบบรวม)

---

## Tips สำหรับ Workflow ที่มีประสิทธิภาพ

### 1. ใช้ Thread อย่างชาญฉลาด

- **Thread เดียว:** งานที่ต่อเนื่องกัน เช่น implement + test + review
- **Thread แยก:** งานที่ไม่เกี่ยวกัน เช่น bug fix กับ feature ใหม่

### 2. ระบุ Checkpoints

สำหรับงานยาว ระบุ Checkpoint (จุดตรวจ — จุดที่ให้รายงานความคืบหน้า) ให้ Codex รายงานความคืบหน้า:

```
ทำทีละขั้น และ report หลังแต่ละขั้นว่าเสร็จและ test ผ่านหรือไม่
ถ้าขั้นไหน fail ให้หยุดและบอกฉัน ไม่ต้องทำขั้นต่อไป
```

### 3. Parallel Tasks ด้วย Cloud

Codex Cloud รันได้หลาย Task พร้อมกัน:

```
สร้าง task ใหม่สำหรับแต่ละ issue นี้:
1. Fix login bug ใน @src/auth/login.ts
2. Add validation ใน @src/api/upload.ts
3. Update tests ใน @src/tests/
```

แต่ละ Task จะรัน parallel (ขนาน — พร้อมกัน) ใน Sandbox แยกกัน

### 4. Review ก่อนเสมอ

สำหรับงาน Cloud ที่จะ Push to GitHub:
- ตรวจ diff ที่ Codex สร้างก่อนเสมอ
- อ่าน PR description ที่ Codex เขียน
- ดู test results ใน CI

---

## สรุป Best Practices

1. **Local สำหรับ Interactive** — Debug, Quick fixes, อยากเห็น output ทันที
2. **Cloud สำหรับ Background** — งานใหญ่, Multi-file, ไม่ต้องรอ
3. **@codex บน GitHub** — สะดวกมากสำหรับ PR workflow ที่ทีมใช้ GitHub อยู่แล้ว
4. **AGENTS.md สำหรับ Convention** — บันทึก team convention ไว้ให้ Codex ใช้ทุกครั้ง
5. **Plan ก่อน Execute** — งานซับซ้อนให้วาง plan ก่อนเสมอ
