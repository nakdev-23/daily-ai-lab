---
title: "Prompt Patterns — เทคนิคการเขียน Prompt สำหรับงาน Coding"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้เทคนิคและ Pattern การเขียน Prompt ที่ได้ผลดีสำหรับ Codex ตั้งแต่การให้ Context, การแบ่งงาน, การใช้ Goal Mode ไปจนถึง Pattern สำเร็จรูปสำหรับงานแต่ละประเภท"
readTime: "7 นาที"
readers: "0"
locked: false
order: 8
---

# Codex คู่มือภาษาไทย — ตอนที่ 8: Prompt Patterns เทคนิคการเขียน Prompt

> อ้างอิงหลัก: [Codex Prompting](https://developers.openai.com/codex/prompting) | [Codex Workflows](https://developers.openai.com/codex/workflows)

---

## ทำไม Prompt ถึงสำคัญมาก

Codex ทำงานเป็น **Agentic Loop** (วงลูปการทำงานอัตโนมัติ — AI ตัดสินใจและลงมือทำซ้ำจนงานเสร็จ) — มันเรียก Model (โมเดล AI), อ่านไฟล์, รันคำสั่ง, แล้ววนซ้ำจนกว่างานจะเสร็จ คุณภาพของผลลัพธ์จึงขึ้นอยู่กับว่า Codex เข้าใจงานได้ถูกต้องหรือไม่ตั้งแต่แรก

> "Codex works best when you treat it like a teammate with explicit context and a clear definition of 'done.'"
> — OpenAI Codex Docs

---

## หลักการพื้นฐาน 3 ข้อ

### 1. ให้ Context ที่ครบถ้วน

Codex ต้องการ Context (บริบท — ข้อมูลพื้นหลังที่จำเป็น) เหมือนกับโปรแกรมเมอร์มือใหม่ที่เพิ่งเข้าทีม ยิ่งมีข้อมูลมาก ผลลัพธ์ยิ่งดี

**Context ที่ควรให้:**
- ไฟล์ที่เกี่ยวข้อง (ใช้ `@filename` ใน CLI/IDE)
- Stack (ชุดเทคโนโลยี) และ Framework (กรอบงาน) ที่ใช้
- Convention (แนวทางปฏิบัติ) ของทีม
- Error message หรือ Stack Trace (เส้นทางที่โปรแกรมรันก่อนพัง) เต็มๆ
- รูป Screenshot (กรณีทำ UI)

### 2. กำหนด Definition of Done ให้ชัด

บอกว่า "เสร็จ" หมายความว่าอะไร เพื่อให้ Codex ตรวจสอบงานตัวเองได้

**แทนที่จะเขียน:**
```
แก้ bug ให้หน่อย
```

**ควรเขียนว่า:**
```
แก้ bug ให้หน่อย เสร็จแล้วต้อง:
- รัน npm test ผ่านทุก test case
- ไม่มี TypeScript error
- รัน reproduction steps แล้ว bug ไม่เกิดซ้ำ
```

### 3. แบ่งงานใหญ่เป็นชิ้นเล็ก

งานซับซ้อนควรแบ่งเป็นหลาย Prompt แทนที่จะยัดทุกอย่างในที่เดียว ถ้าไม่รู้จะแบ่งยังไง ให้ถาม Codex ก่อนว่า:

```
ช่วยแบ่งงาน Refactor นี้เป็น Milestones (จุดหมายย่อย — ขั้นตอนเป้าหมายระหว่างทาง) ที่ทำได้ทีละขั้นหน่อย
ก่อนที่จะเริ่มทำ
```

---

## Prompt Patterns สำเร็จรูป

### Pattern 1: Code Generation

```
สร้าง [ชื่อ feature/component] ที่ทำหน้าที่ [อธิบายสั้นๆ]

Requirements:
- [requirement 1]
- [requirement 2]

Tech stack: [framework, language, libraries]
Convention: ดูตัวอย่างจาก @[ไฟล์ตัวอย่าง]
Output: สร้างไฟล์ที่ [path ปลายทาง]
```

**ตัวอย่างจริง:**
```
สร้าง React Hook (ฟังก์ชันพิเศษของ React สำหรับจัดการ Logic ที่ใช้ซ้ำได้) สำหรับ fetch user data ที่จัดการ loading, error, retry

Requirements:
- TypeScript
- Support AbortController (ยกเลิก request เมื่อ component unmount)
- Exponential backoff retry (รอนานขึ้นเรื่อยๆ ก่อน retry — เพื่อไม่ให้ส่งคำขอถี่เกินไป) สูงสุด 3 ครั้ง
- Return { data, loading, error, refetch }

Tech stack: React 18, TypeScript 5
Convention: ดูตัวอย่างจาก @src/hooks/useAuth.ts
Output: src/hooks/useUserData.ts พร้อม test ที่ src/hooks/__tests__/useUserData.test.ts
```

---

### Pattern 2: Bug Fix

```
Bug: [อธิบาย symptom (อาการ)]

Reproduction steps:
1. [step 1]
2. [step 2]

Error: [paste error message / stack trace]

Suspect files: @[file1] @[file2]
Constraint: [อย่าเปลี่ยน X, ต้องทำงานกับ Y ได้]

เสร็จแล้วรัน [คำสั่ง test] เพื่อยืนยัน
```

---

### Pattern 3: Test Writing

```
เขียน [Unit/Integration] Test สำหรับ [function/module] ใน @[ไฟล์]

Framework: [Jest/Vitest/Pytest/etc.]
ครอบคลุม:
- Happy path: [กรณีปกติที่ทุกอย่างทำงานถูกต้อง]
- Edge cases: [กรณีพิเศษ — สถานการณ์ขอบเขต]
- Error cases: [กรณี error]

ดู pattern จาก @[test file ตัวอย่าง]
```

---

### Pattern 4: Refactoring

```
Refactor @[ไฟล์/โฟลเดอร์] เพื่อ [เหตุผล เช่น แยก concerns (ความรับผิดชอบ), ปรับตาม pattern ใหม่]

เป้าหมาย:
- [goal 1]
- [goal 2]

ข้อจำกัด:
- อย่าเปลี่ยน public API / interface (ส่วนต่อประสานที่ผู้อื่นใช้งาน)
- ต้องทำงานกับ [dependency (สิ่งที่โค้ดต้องพึ่งพา)] ได้เหมือนเดิม

Verification: รัน [test command] ต้องผ่านทุก test
```

---

### Pattern 5: Code Review

```
Review โค้ดใน @[ไฟล์/PR] โดยเน้น:
- [focus area 1 เช่น security (ความปลอดภัย)]
- [focus area 2 เช่น performance (ประสิทธิภาพ)]
- [focus area 3 เช่น edge cases (กรณีพิเศษ)]

Severity levels: P0 = Critical (วิกฤต), P1 = High (สำคัญมาก), P2 = Medium (ปานกลาง)
```

---

### Pattern 6: Code Explanation

```
อธิบาย @[ไฟล์/function/service] ให้เข้าใจในระดับ [junior/senior] engineer

อยากรู้:
1. หน้าที่หลักของ module/function นี้คืออะไร
2. Data flow (การไหลของข้อมูล) ทำงานยังไง
3. จุดที่ซับซ้อนหรือมี gotcha (จุดพลาดที่คาดไม่ถึง) อยู่ที่ไหน
4. Dependency (สิ่งที่โค้ดต้องพึ่งพา) กับส่วนอื่นของระบบเป็นยังไง
```

---

## เทคนิค Context Management

### การแนบไฟล์

**ใน CLI:**
```bash
# พิมพ์ @ แล้ว Tab เพื่อ autocomplete path
@src/utils/pricing.ts
```

**ใน IDE:**
- เลือก code แล้วใช้ "Add to Codex Thread"
- เปิดไฟล์ไว้ใน editor — IDE extension (ส่วนขยายโปรแกรมแก้โค้ด) จะใส่ context ให้อัตโนมัติ

**ใน Cloud:**
- ระบุ path ในข้อความ Codex จะอ่านไฟล์เอง

### Context Window Limits

Codex มี Context Window (หน้าต่างบริบท — ปริมาณข้อมูลที่ AI รับได้ต่อครั้ง) จำกัด เมื่อ conversation ยาวขึ้น Codex จะ **Auto-compact** (บีบอัดอัตโนมัติ) โดยสรุปข้อมูลเก่าที่ยังเกี่ยวข้องไว้ ถ้าต้องการเริ่มงานใหม่ที่ไม่เกี่ยวกัน ควรเปิด Thread (กระทู้สนทนา) ใหม่

---

## Goal Mode — สำหรับงานยาวหลายขั้นตอน

ใช้ `/goal` command เพื่อกำหนด Objective (เป้าหมาย) ระยะยาวให้ Codex ทำงานได้เองโดยไม่ต้องรอ Prompt ทุกขั้น

### Goal ที่ดีต้องมี:
- **Specific outcome** — ผลลัพธ์ที่ต้องการชัดเจน
- **Measurable target** — วัดได้ว่าเสร็จหรือยัง
- **Test criteria** — เงื่อนไขที่ Codex ตรวจสอบได้เอง

### ตัวอย่าง Goal

```
/goal
เพิ่ม Rate Limiting (การจำกัดอัตราการเรียกใช้งาน — ป้องกันไม่ให้ใครเรียก API บ่อยเกินไป) ให้ API ทุก endpoint ใน src/api/

Criteria:
- ทุก endpoint ต้องรองรับไม่เกิน 100 req/min ต่อ IP
- ถ้าเกิน ต้อง return 429 Too Many Requests พร้อม Retry-After header
- ต้องมี Integration Test ครอบคลุม limit scenarios
- รัน npm test ผ่านทุก test
```

---

## Verification — ให้ Codex ตรวจงานตัวเอง

หนึ่งในเทคนิคที่สำคัญที่สุด: **ขอให้ Codex verify งานตัวเอง**

### Verification ที่ดีมีหลายระดับ

| ระดับ | วิธี | เหมาะกับ |
|-------|------|---------|
| Basic | รัน Test Suite (ชุดทดสอบทั้งหมด) | ทุกงาน |
| Type Check | รัน `tsc --noEmit` | TypeScript projects |
| Lint (ตรวจสอบคุณภาพโค้ด) | รัน ESLint/Prettier | Code quality |
| Integration | รัน E2E tests (ทดสอบแบบ end-to-end — จำลองการใช้งานจริงตั้งแต่ต้นจนจบ) | Feature ใหม่ |
| Manual | บอก Reproduction steps | Bug fixes |

### ตัวอย่าง Verification ใน Prompt

```
หลังแก้ไขเสร็จ:
1. รัน `npm run lint` ต้องไม่มี error
2. รัน `npm test` ต้องผ่านทุก test
3. ลอง reproduce bug เดิม ต้องไม่เกิดขึ้นอีก
4. ตรวจ TypeScript types ด้วย `tsc --noEmit`
```

---

## Anti-patterns ที่ควรหลีกเลี่ยง

### Prompt ที่ให้ผลแย่

| Anti-pattern (รูปแบบที่ควรหลีกเลี่ยง) | ปัญหา | วิธีแก้ |
|-------------|-------|---------|
| "แก้ code ให้ดีขึ้น" | ไม่รู้ว่า "ดีขึ้น" หมายถึงอะไร | ระบุ criteria (เกณฑ์) ที่วัดได้ |
| "fix all bugs" | กว้างเกินไป | ระบุ bug เฉพาะเจาะจง |
| ยัดทุก requirement ใน Prompt เดียว | Codex ทำหลายอย่างพร้อมกัน ยากตรวจสอบ | แบ่งเป็นหลาย Prompt |
| ไม่แนบไฟล์ที่เกี่ยวข้อง | Codex ต้องเดา context | ใช้ `@filename` อ้างอิงไฟล์ |
| ไม่บอก Verification steps | Codex ไม่รู้ว่า "เสร็จ" คืออะไร | ระบุ test/lint commands |

---

## Template Prompt สำหรับงานประจำวัน

### Morning Code Review

```
Review PR ของฉันใน @[branch/file changes]
โฟกัส:
1. Logic errors และ edge cases
2. Security issues (SQL injection (การฝังคำสั่ง SQL ที่เป็นอันตราย), XSS (การฝังสคริปต์อันตรายในหน้าเว็บ), auth bypasses (การข้ามระบบยืนยันตัวตน))
3. Performance bottlenecks (จุดที่ทำให้ระบบช้า)
4. Missing error handling

Flag เฉพาะ P0/P1 ก็พอ ไม่ต้องรายงาน style issues
```

### Feature Implementation

```
Implement [feature name] ตาม spec ใน @[spec file หรือ issue]

Stack: [tech stack]
Files to create/modify: [list ถ้ารู้]
Must NOT change: [critical files ที่อย่าแตะ]

Complete เมื่อ:
- [ ] Feature ทำงานตาม spec
- [ ] Tests ผ่าน
- [ ] No TypeScript errors
- [ ] PR-ready (clean commits, no debug code)
```

### Documentation Update

```
อัปเดต documentation ใน @[doc files]
ให้ตรงกับโค้ดปัจจุบันใน @[source files]

เปลี่ยนแปลงล่าสุด: [อธิบายว่าโค้ดเปลี่ยนอะไรไป]
ห้ามเปลี่ยน: tone, structure โดยรวม
```

---

## สรุป Prompt Checklist

ก่อนส่ง Prompt ให้ตรวจ:

- [ ] บอก **งานที่ต้องทำ** ชัดเจน
- [ ] แนบ **ไฟล์ที่เกี่ยวข้อง** ด้วย `@filename`
- [ ] ระบุ **tech stack / framework**
- [ ] บอก **ข้อจำกัด** (อย่าเปลี่ยน X, ต้องทำงานกับ Y)
- [ ] กำหนด **Definition of Done** และ Verification steps
- [ ] ถ้างานซับซ้อน — แบ่งเป็น Prompt ย่อยหรือใช้ Goal Mode
