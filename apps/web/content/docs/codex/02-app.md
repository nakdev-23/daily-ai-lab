---
title: "Codex App"
tool: "Codex"
icon: "icon-docs"
level: "beginner"
summary: "อ้างอิง: App Overview"
readTime: "12 นาที"
readers: "0"
locked: false
order: 2
---
# Codex คู่มือภาษาไทย — ตอนที่ 2: Codex App
> อ้างอิงหลัก: [Codex App Overview](https://developers.openai.com/codex/app)

---

## ภาพรวม Codex App
อ้างอิง: [App Overview](https://developers.openai.com/codex/app)

### หัวข้อนี้คืออะไร
Codex App คือแอปพลิเคชัน Desktop สำหรับทำงานกับ Codex โดยเฉพาะ มีฟีเจอร์ครบครันที่สุดในบรรดาช่องทางทั้งหมด เหมาะสำหรับนักพัฒนาที่ต้องการประสบการณ์ใช้งานที่ดีที่สุด

### ใช้ทำอะไรได้บ้าง
- รัน Thread หลายงานพร้อมกันแบบ Parallel
- ทำงานกับ Git Worktrees ในตัว
- ใช้ Computer Use บน macOS (ให้ Codex คลิก/พิมพ์ใน UI จริง)
- รีวิว Diff, Commit, Push ตรงจาก App
- ตั้ง Automations ที่รันซ้ำตามเวลา
- เปิด In-app Browser สำหรับ Web Testing

### รองรับ Platform
- **macOS** (Apple Silicon + Intel) — ฟีเจอร์ครบที่สุด
- **Windows** — รองรับ
- **Linux** — รอ Notification ทางอีเมล (ยังไม่เปิด)

---

## Features ของ Codex App
อ้างอิง: [App Features](https://developers.openai.com/codex/app/features)

### Multitask Across Projects — ทำงานหลายโปรเจกต์พร้อมกัน
Codex App ให้คุณรัน Thread หลายงานพร้อมกัน สลับไปมาระหว่าง Project ได้อย่างรวดเร็ว ไม่ต้องรอให้งานหนึ่งเสร็จก่อนเริ่มอีกงาน

### Worktree Support — รัน Branch หลายอันพร้อมกัน
รองรับ Git Worktrees ในตัว ช่วยให้ Codex ทำงานใน Branch หลายอันพร้อมกันโดยไม่กระทบงานหลักที่กำลังทำอยู่ (รายละเอียดใน [หัวข้อ Worktrees](#worktrees))

### Image Generation — สร้างรูปในงานโค้ด
สร้างหรือแก้ไขรูปภาพใน Thread ขณะทำงานกับโค้ดและ Asset โดยตรง เหมาะกับงาน Frontend หรือ UI Development

### Integrated Terminal — Terminal ในแต่ละ Thread
ทุก Thread มี Terminal ของตัวเอง รัน Command Line ได้โดยตรงใน Context ของงานนั้นๆ ใช้เรียก Tool, รัน Test หรือตรวจสอบผลลัพธ์ได้ทันที

### Richer Outputs and Artifacts — แสดงผลลัพธ์ครบ
Sidebar แสดง Plans, Sources, Task Summaries และ Preview ไฟล์ที่สร้างใหม่ได้ ติดตามความคืบหน้าของงานได้ชัดเจน

### Skills Support — ใช้ Skills ข้ามโปรเจกต์
สนับสนุน Skills ที่ใช้ซ้ำได้ทั้งใน App, CLI และ IDE Extension บันทึก Workflow ครั้งเดียว นำมาใช้ทุกที่

### Sync with the IDE Extension — ใช้งานร่วมกับ IDE
เชื่อม Auto Context และ Active Threads ระหว่าง App และ IDE Extension ได้ ทำงานต่อเนื่องไม่ว่าจะอยู่ที่ไหน

---

## Settings — ตั้งค่า Codex App
อ้างอิง: [App Settings](https://developers.openai.com/codex/app/settings)

### หัวข้อนี้คืออะไร
หน้า Settings ใน Codex App ให้ปรับแต่งพฤติกรรม เชื่อมต่อบัญชี เลือก Editor และจัดการ Computer Use

**เปิด Settings:** `Cmd` + `,` หรือคลิก Settings ใน Sidebar

### หมวด Settings หลัก

| หมวด | ใช้ตั้งค่าอะไร |
|---|---|
| Account | เข้าสู่ระบบ, เชื่อม GitHub |
| Model | เลือก Default Model สำหรับ Thread ทั่วไป |
| Sandbox | Sandbox Mode, Approval Policy |
| Memories | เปิด/ปิด Memories Feature |
| Computer Use | ติดตั้ง Computer Use Plugin, จัดการ Allowed Apps |
| Editor | เลือก Default Editor สำหรับเปิดไฟล์จาก Review Pane |
| Worktrees | ตั้ง Limit จำนวน Worktree สูงสุด |
| Storage | ดูและจัดการ Disk Space ที่ Worktrees ใช้ |

---

## Review — รีวิวและ Commit โค้ดจาก App
อ้างอิง: [App Review](https://developers.openai.com/codex/app/review)

### หัวข้อนี้คืออะไร
Review Pane คือหน้าต่างที่ให้ดู Diff ทั้งหมดที่ Codex แก้ไข ใส่ Feedback แบบ Inline และตัดสินใจว่าจะ Keep, Stage หรือ Revert อะไร

### ข้อกำหนด
Review Pane ทำงานได้เฉพาะ **โปรเจกต์ที่อยู่ใน Git Repository** ถ้าโปรเจกต์ยังไม่ใช่ Git Repo App จะแนะนำให้สร้างก่อน

### สิ่งที่ Review Pane แสดง
Review Pane สะท้อนสถานะ Git Repository จริงๆ คือจะแสดง:
- การเปลี่ยนแปลงที่ Codex ทำ
- การเปลี่ยนแปลงที่คุณทำเอง
- Uncommitted Changes อื่นๆ ใน Repo ทั้งหมด

**โหมดที่เลือกได้:**
- **Uncommitted changes** (ค่าเริ่มต้น)
- **All branch changes** (Diff กับ Base Branch)
- **Last turn changes** (เฉพาะ Turn ล่าสุด)

### การนำทางใน Review Pane

| การกระทำ | วิธี |
|---|---|
| เปิดไฟล์ใน Editor | คลิกชื่อไฟล์ |
| ขยาย/ย่อ Diff | คลิก Background ของชื่อไฟล์ |
| เปิดไฟล์ที่ Line ที่ต้องการ | `Cmd` + คลิกบรรทัดนั้น |
| ใส่ Inline Comment | Hover บรรทัด → คลิก `+` → เขียน Feedback |

### Inline Comments
เป็นวิธีที่เร็วที่สุดในการให้ Feedback แบบเจาะจงบรรทัด:
1. เปิด Review Pane
2. Hover บรรทัดที่ต้องการ Comment
3. คลิก `+`
4. เขียน Feedback แล้ว Submit
5. ส่ง Message กลับไปบอก Codex เช่น "Address the inline comments and keep the scope minimal."

### Code Review ด้วย `/review`
ถ้าใช้คำสั่ง `/review` Codex จะแสดง Code Review Comments ตรงใน Review Pane

### Pull Request Reviews
ถ้า Codex เข้าถึง GitHub ได้ สามารถเรียกดู PR Feedback จาก Reviewers ใน Sidebar และ Inline ใน Review Pane พร้อม Address Comments ได้เลยจาก Thread เดียวกัน

**ต้องการ:** GitHub CLI (`gh`) ติดตั้งและ Login แล้ว

### Staging และ Reverting ไฟล์

| ระดับ | ทำได้ |
|---|---|
| Entire Diff | Stage all / Revert all |
| Per File | Stage, Unstage หรือ Revert ทีละไฟล์ |
| Per Hunk | Stage, Unstage หรือ Revert ทีละ Hunk |

---

## Automations — กำหนดงานอัตโนมัติตารางเวลา
อ้างอิง: [App Automations](https://developers.openai.com/codex/app/automations)

### หัวข้อนี้คืออะไร
Automations ให้ Codex ทำงาน Recurring (ซ้ำๆ) ในพื้นหลัง โดยอัตโนมัติตามตารางเวลา เช่น รันทุกเช้าตอน 8 โมง ตรวจสอบ PR ทุกชั่วโมง ฯลฯ

### ประเภทของ Automation

| ประเภท | ใช้ทำอะไร |
|---|---|
| **Standalone Automation** | รัน Task ใหม่ทุกครั้งตามตาราง รายงานผลใน Triage Inbox |
| **Thread Automation** | รัน "Heartbeat" ใน Thread เดิม เพื่อดูแล Thread ที่ยังทำงานอยู่ |

### วิธีสร้าง Automation
1. ไปที่ Automations Pane ใน Sidebar
2. คลิก Create Automation
3. เขียน Prompt ที่บอกว่าต้องการให้ทำอะไรแต่ละครั้ง
4. เลือก Schedule (Daily, Weekly, Custom Cron, Minute-based ฯลฯ)
5. เลือกว่ารันใน Local Project หรือ Worktree (สำหรับ Git Repo)

หรือจะให้ Codex สร้าง Automation แทนก็ได้โดยบอกใน Thread ปกติ เช่น "Create an automation that checks my commits every morning."

### Thread Automations ทำอะไรได้บ้าง
- รอจนกว่า Long-running Command เสร็จ
- Poll Slack, GitHub หรือ Source อื่นๆ ใน Context ของ Thread เดิม
- เตือนให้ Codex Continue Review Loop ตามเวลาที่กำหนด
- รัน Skill-driven Workflow ผ่าน Plugins เช่น Check PR Status

### Triage Inbox
ผลลัพธ์ของ Automation ที่มีสิ่งที่ต้องรายงานจะปรากฏใน Triage Section ใน Sidebar กรองได้ว่าจะดูทั้งหมดหรือเฉพาะ Unread

### ตัวอย่าง Automation จริง

**ติดตามความเคลื่อนไหวของ Project:**
```
Look at the latest remote origin/main. Then produce an exec briefing
for the last 24 hours of commits.
```

**สร้าง Skill อัตโนมัติจาก Session ที่ผ่านมา:**
```
Scan all of the ~/.codex/sessions files from the past day and if there
have been any issues using particular skills, update the skills.
```

### ข้อควรระวังด้านความปลอดภัย
Automations รันแบบ Unattended จึงต้องระวัง:
- `read-only` mode: คำสั่งที่แก้ไขไฟล์หรือ Network Access จะ Fail
- `workspace-write` mode: ปลอดภัยสำหรับ Background งานทั่วไป (แนะนำ)
- `danger-full-access` mode: มีความเสี่ยงสูงเพราะไม่มีขีดจำกัด ควรหลีกเลี่ยง

---

## Worktrees — ทำงาน Branch หลาย Branch พร้อมกัน
อ้างอิง: [App Worktrees](https://developers.openai.com/codex/app/worktrees)

### หัวข้อนี้คืออะไร
Worktrees ให้ Codex รัน Task หลายงานใน Project เดียวกันโดยไม่กระทบกัน ใช้หลักการของ Git Worktrees ที่สร้าง "Copy" ของ Repository ให้แต่ละงาน

### Worktree ทำงานได้กับ Git Repository เท่านั้น

### คำศัพท์สำคัญ

| คำ | ความหมาย |
|---|---|
| **Local checkout** | Repository ต้นฉบับในเครื่องของคุณ ("Local" ใน App) |
| **Worktree** | Git Worktree ที่ Codex App สร้างจาก Local checkout |
| **Handoff** | กระบวนการย้าย Thread ระหว่าง Local กับ Worktree |

### ทำไมต้องใช้ Worktrees
1. ทำงาน Parallel กับ Codex โดยไม่รบกวน Workspace ปัจจุบัน
2. Queue งาน Background ในขณะที่ยังโฟกัสกับงานหน้าบ้าน
3. ย้าย Thread กลับมาที่ Local เมื่อพร้อม Inspect หรือ Test

### วิธีเริ่มใช้ Worktree

**ขั้นตอน:**
1. ใน New Thread View เลือก **Worktree** ใต้ Composer
2. เลือก Git Branch ที่ต้องการเป็นจุดเริ่มต้น (`main`, Feature Branch ฯลฯ)
3. ส่ง Prompt แล้ว Codex จะสร้าง Git Worktree โดย Default อยู่ใน **Detached HEAD** State

### ทำงานบน Worktree vs Handoff to Local

**Option 1 - ทำงานบน Worktree ตลอด:**
- กด **Create branch here** ใน Thread Header เมื่อพร้อม
- Commit, Push, Open PR จาก Worktree โดยตรง
- เปิด IDE ไปที่ Worktree ด้วยปุ่ม "Open"

> **ข้อจำกัด Git:** ถ้า Worktree ใช้ branch `feature/a` อยู่แล้ว จะ Checkout branch เดิมใน Local Checkout ไม่ได้พร้อมกัน

**Option 2 - Handoff to Local:**
- คลิก **Hand off** ใน Thread Header → เลือก Local
- เหมาะเมื่อต้องการอ่าน Changes ใน IDE ปกติ หรือรัน Dev Server ที่มีอยู่แล้ว
- Codex จัดการ Git Operations ที่ต้องทำให้ครบเพื่อย้าย Thread อย่างปลอดภัย

> Files ที่อยู่ใน `.gitignore` จะไม่ถูกย้ายไปด้วยตอน Handoff

### Permanent Worktrees
นอกจาก Codex-managed Worktrees (สร้างชั่วคราวต่อ Thread) ยังสร้าง **Permanent Worktree** ได้จาก 3-dot Menu ใน Project Sidebar เหมาะกับงาน Long-lived ที่ต้องการ Environment ถาวร

### Worktree Cleanup
Codex เก็บ Worktree ล่าสุดไว้สูงสุด 15 อัน (ปรับได้ใน Settings) Codex จะไม่ลบ Worktree ถ้า:
- Thread ที่เชื่อมอยู่ถูก Pin
- Thread ยังรันอยู่
- เป็น Permanent Worktree

ก่อนลบ Codex จะ Save Snapshot ไว้ให้ Restore ในภายหลัง

---

## Local Environments — ตั้ง Environment Script ให้ Worktree
อ้างอิง: [Local Environments](https://developers.openai.com/codex/app/local-environments)

### หัวข้อนี้คืออะไร
Local Environments คือ Setup Script ที่รันอัตโนมัติเมื่อสร้าง Worktree ใหม่ ให้แน่ใจว่า Dependencies, Tools และ Config ครบถ้วนก่อนที่ Codex จะเริ่มทำงาน

### ใช้ทำอะไร
- ติดตั้ง `npm packages`, `Python dependencies`, `Go modules` ฯลฯ
- ตั้งค่า Environment Variables
- รัน Migration หรือ Seed DB ก่อนเริ่มงาน

### วิธีตั้งค่า
1. ไปที่ Project Settings ใน Sidebar
2. กด **Add environment setup**
3. เขียน Shell Script (เช่น `npm install`, `pip install -r requirements.txt`)
4. Script นี้จะรันทุกครั้งที่สร้าง Worktree ใหม่จาก Project นี้

---

## In-App Browser — เบราว์เซอร์ใน App
อ้างอิง: [In-app Browser](https://developers.openai.com/codex/app/browser)

### หัวข้อนี้คืออะไร
In-app Browser ให้เปิดหน้าเว็บ Preview ตรงใน Codex App เหมาะกับการทดสอบ Web App ที่ Codex กำลัง Build โดยไม่ต้องออกไปเปิด Browser แยก

### ใช้ทำอะไร
- เปิดหน้าเว็บที่ Render แล้ว
- ทิ้ง Comment บนหน้าเว็บเพื่อให้ Codex แก้ไข
- ให้ Codex ทำ Browser Flows บน Local Web App

### ข้อแนะนำ
สำหรับ Web App ที่ Build ในเครื่อง ให้ใช้ In-app Browser **ก่อน** Computer Use เสมอ เพราะเบราว์เซอร์ใน App ทำงานได้เร็วกว่าและ Scope ชัดเจนกว่า

---

## Chrome Extension — Codex ในเบราว์เซอร์ Chrome
อ้างอิง: [Chrome Extension](https://developers.openai.com/codex/app/chrome-extension)

### หัวข้อนี้คืออะไร
Codex มี Chrome Extension ให้ Codex ทำงานร่วมกับ Chrome ได้โดยตรง เช่น Scrape เนื้อหา ตรวจสอบ Web UI หรือทำงานที่ต้องใช้ Browser Context

---

## Computer Use — ควบคุม GUI ด้วย Codex
อ้างอิง: [Computer Use](https://developers.openai.com/codex/app/computer-use)

### หัวข้อนี้คืออะไร
Computer Use ให้ Codex **มองเห็นและควบคุม** GUI ของแอปบน macOS ได้ เช่น คลิก พิมพ์ เลื่อน เปิดเมนู ฯลฯ เหมาะกับงานที่ Command Line หรือ Structured Integration ทำไม่ได้

### ข้อจำกัด
- **รองรับเฉพาะ macOS** ในปัจจุบัน
- **ยังไม่รองรับ**: EEA, สหราชอาณาจักร, สวิตเซอร์แลนด์

### วิธีติดตั้งและตั้งค่า
1. ไปที่ Codex Settings → Computer Use
2. คลิก **Install** เพื่อติดตั้ง Computer Use Plugin
3. เมื่อ macOS ขอ Permission ให้ Grant:
   - **Screen Recording** — เพื่อให้ Codex เห็นแอป
   - **Accessibility** — เพื่อให้ Codex คลิก, พิมพ์ และนำทาง

### งานที่เหมาะกับ Computer Use

| เหมาะมาก | ไม่จำเป็นต้องใช้ |
|---|---|
| ทดสอบ macOS App หรือ iOS Simulator | งานที่มี Plugin/MCP ตรงๆ อยู่แล้ว |
| ทำ Browser Flow ที่ซับซ้อน | Web App ที่ทดสอบได้ผ่าน In-app Browser |
| Reproduce Bug ที่เกิดเฉพาะใน GUI | งานที่ทำผ่าน Command Line ได้ |
| เปลี่ยน App Settings ที่ต้องคลิก UI | |
| Workflow ที่ Span หลาย App | |

### วิธีใช้ Computer Use
พิมพ์ `@Computer Use` หรือ `@ชื่อแอป` ใน Prompt:
```
Open the app with computer use, reproduce the onboarding bug, and fix the
smallest code path that causes it.
```
```
Open @Chrome and verify the checkout page still works after the latest changes.
```

### Permissions และ Approvals
- **macOS System Permissions** (Screen Recording + Accessibility): ให้ Codex เห็นและควบคุม App
- **App Approvals ใน Codex**: กำหนดว่า App ไหนอนุญาตให้ Codex ใช้ได้
- เลือก **Always allow** ได้สำหรับ App ที่เชื่อถือ Codex
- จัดการ "Always allow" list ใน Settings → Computer Use

### ข้อควรระวัง Safety
Computer Use มีความสามารถในการ:
- ดู Screen Content, ถ่าย Screenshot
- Interact กับ Windows, Menus, Keyboard, Clipboard ของ App ที่กำหนด

แนวทางปลอดภัย:
- ให้ Target App ชัดเจนทีละ App/Flow
- อยู่ใกล้คอมพิวเตอร์สำหรับงาน Sensitive
- ปิด App ที่ Sensitive ถ้าไม่จำเป็นต้องใช้
- รีวิว App Permission Prompts ก่อนอนุญาต
- ถ้า Codex เริ่มทำงานกับ Window ผิด ให้ยกเลิกทันที

> **สิ่งที่ Computer Use ทำไม่ได้:** Automate Terminal Apps หรือ Codex เอง, Authenticate เป็น Admin, Approve Security/Privacy Prompts ของ macOS

---

## Commands และ Keyboard Shortcuts
อ้างอิง: [App Commands](https://developers.openai.com/codex/app/commands)

### Keyboard Shortcuts

**General:**

| Shortcut | Action |
|---|---|
| `Cmd` + `Shift` + `P` / `Cmd` + `K` | Command Menu |
| `Cmd` + `,` | Settings |
| `Cmd` + `O` | Open Folder |
| `Cmd` + `[` | Navigate Back |
| `Cmd` + `]` | Navigate Forward |
| `Cmd` + `+` / `Cmd` + `=` | Increase Font Size |
| `Cmd` + `-` / `Cmd` + `_` | Decrease Font Size |
| `Cmd` + `B` | Toggle Sidebar |
| `Cmd` + `Option` + `B` | Toggle Diff Panel |
| `Cmd` + `J` | Toggle Terminal |
| `Ctrl` + `L` | Clear Terminal |

**Thread:**

| Shortcut | Action |
|---|---|
| `Cmd` + `N` / `Cmd` + `Shift` + `O` | New Thread |
| `Cmd` + `F` | Find in Thread |
| `Cmd` + `Shift` + `[` | Previous Thread |
| `Cmd` + `Shift` + `]` | Next Thread |
| `Ctrl` + `M` | Dictation |

### Slash Commands
พิมพ์ `/` ใน Thread Composer เพื่อเข้าถึง:

| Slash Command | ทำอะไร |
|---|---|
| `/feedback` | เปิด Dialog ส่ง Feedback (พร้อม Log ได้) |
| `/mcp` | ดูสถานะ MCP Servers ที่เชื่อมต่ออยู่ |
| `/plan-mode` | เปิด/ปิด Plan Mode สำหรับวางแผน Multi-step |
| `/review` | เริ่ม Code Review Mode |
| `/status` | แสดง Thread ID, Context Usage, Rate Limits |

> **Skills:** พิมพ์ `$` เพื่อเรียก Skill โดยตรง เช่น `$skill-name`. Skills ที่ Enable แล้วจะปรากฏในรายการ Slash Commands ด้วย

### Deeplinks
Codex App ลงทะเบียน URL Scheme `codex://` เพื่อเปิด App โดยตรงจาก Link:

| Deeplink | เปิดหน้า | Parameters |
|---|---|---|
| `codex://settings` | Settings | ไม่มี |
| `codex://skills` | Skills | ไม่มี |
| `codex://automations` | Automations | ไม่มี |
| `codex://threads/<thread-id>` | Thread ที่ระบุ | UUID เท่านั้น |
| `codex://new` | Thread ใหม่ | `prompt`, `path`, `originUrl` |

---

## Windows Support — รองรับ Windows
อ้างอิง: [App Windows](https://developers.openai.com/codex/app/windows)

### หัวข้อนี้คืออะไร
Codex App รองรับ Windows อย่างเป็นทางการ โดยมีฟีเจอร์ส่วนใหญ่เหมือน macOS แต่มีข้อแตกต่างบางส่วน

### วิธีดาวน์โหลด
- [ดาวน์โหลดจาก Microsoft Store](https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi)

### ความแตกต่างจาก macOS
- Sandbox บน Windows ใช้ Windows Sandbox หรือ Linux (ใน WSL2)
- Computer Use ยังไม่รองรับ Windows ณ เวลาที่เขียน
- Keyboard Shortcuts อาจต่างกันบ้าง (ใช้ `Ctrl` แทน `Cmd`)

---

## Troubleshooting — แก้ปัญหาที่พบบ่อย
อ้างอิง: [App Troubleshooting](https://developers.openai.com/codex/app/troubleshooting)

### Computer Use ไม่เห็น/ควบคุม App ไม่ได้
**สาเหตุ**: macOS Permissions ยังไม่ได้อนุมัติ
**แก้ไข**: ไปที่ System Settings → Privacy & Security → ตรวจสอบ Screen Recording และ Accessibility ให้ Codex มีสิทธิ์

### Pull Request Context ไม่แสดงใน Sidebar
**สาเหตุ**: GitHub CLI (`gh`) ยังไม่ได้ติดตั้งหรือยังไม่ได้ Login
**แก้ไข**: 
```
# ติดตั้ง GitHub CLI
brew install gh

# Login
gh auth login
```

### Worktree Error: Branch already in use
**สาเหตุ**: Branch ถูก Checkout ใน Worktree อื่นแล้ว
**แก้ไข**: ใช้ Handoff ย้าย Thread กลับมาที่ Local แทนการ Checkout Branch ซ้ำกัน

### App ไม่อัปเดต/ค้าง
- รีสตาร์ท App
- ตรวจสอบว่า Sign in สำเร็จแล้ว (ChatGPT Account หรือ API Key)
- ถ้ายังมีปัญหา กด `/feedback` เพื่อส่ง Logs ให้ OpenAI

---

## สรุปฟีเจอร์ทั้งหมดของ Codex App

| ฟีเจอร์ | macOS | Windows | หมายเหตุ |
|---|---|---|---|
| Parallel Threads | ✅ | ✅ | |
| Git Worktrees | ✅ | ✅ | ต้องเป็น Git Repo |
| Review Pane | ✅ | ✅ | ต้องเป็น Git Repo |
| Automations | ✅ | ✅ | |
| In-app Browser | ✅ | ✅ | |
| Chrome Extension | ✅ | ✅ | |
| Computer Use | ✅ | ❌ | ไม่รองรับ EEA/UK/CH |
| Image Generation | ✅ | ✅ | |
| Skills / Plugins | ✅ | ✅ | |
| Integrated Terminal | ✅ | ✅ | |
| Local Environments | ✅ | ✅ | |

---

## หัวข้อที่ยังต้องตรวจสอบเพิ่ม

| หัวข้อ | เหตุผล | ลิงก์ |
|---|---|---|
| App Settings รายละเอียดเต็ม | ต้องดู UI จริง | [link](https://developers.openai.com/codex/app/settings) |
| Appshots | ยังไม่ได้ดึงข้อมูล | [link](https://developers.openai.com/codex/appshots) |
