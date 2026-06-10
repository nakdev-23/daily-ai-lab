---
title: "Agent SDK และ CI/CD (GitHub / GitLab)"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "อ้างอิง: Agent SDK overview"
readTime: "9 นาที"
readers: "0"
locked: false
order: 8
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 8: Agent SDK และ CI/CD (GitHub / GitLab)

> เรียบเรียงจาก [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) และ [GitHub Actions](https://code.claude.com/docs/en/github-actions) — สร้าง AI agent ระดับ production และผสาน Claude Code เข้ากับ CI/CD

---

## 📖 คำศัพท์สำคัญสำหรับ Agent SDK และ CI/CD

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **Agent SDK** | ไลบรารีที่ให้คุณสร้าง AI agent ในโปรแกรมของตัวเอง โดย Claude จัดการ tool loop ให้อัตโนมัติ |
| **Client SDK** | ไลบรารีพื้นฐานที่ให้เรียก Claude API ตรง ๆ — คุณต้องเขียน tool loop เอง |
| **Tool loop** | วงจรการทำงานซ้ำ ๆ ที่ Claude เรียกใช้เครื่องมือ (อ่านไฟล์, รันคำสั่ง) แล้วดูผลลัพธ์วนซ้ำจนเสร็จ |
| **CI/CD** | ระบบอัตโนมัติที่รันเมื่อมีการอัปเดตโค้ด — ตรวจสอบ ทดสอบ และ deploy โค้ดโดยไม่ต้องสั่งมือ |
| **Pipeline** | ลำดับขั้นตอนอัตโนมัติที่รันต่อเนื่องกัน เช่น build → test → deploy |
| **GitHub Actions** | ระบบ CI/CD ที่ฝังใน GitHub — รัน workflow อัตโนมัติเมื่อมีเหตุการณ์ เช่น push โค้ดหรือเปิด PR |
| **GitLab CI/CD** | ระบบ CI/CD ที่ฝังใน GitLab — รัน pipeline อัตโนมัติผ่านไฟล์ `.gitlab-ci.yml` |
| **PR** (Pull Request) | คำขอรวมโค้ดใน GitHub — เปิดเพื่อให้คนรีวิวก่อน merge เข้า branch หลัก |
| **MR** (Merge Request) | คำขอรวมโค้ดใน GitLab (เหมือน PR ของ GitHub) |
| **Workflow YAML** | ไฟล์กำหนดขั้นตอนอัตโนมัติ เขียนด้วยภาษา YAML (ไฟล์ข้อความที่มีการย่อหน้าเพื่อแสดงโครงสร้าง) |
| **Hook / callback** | ฟังก์ชันที่ "เกาะ" ไว้กับจุดต่าง ๆ ของกระบวนการ เพื่อรันโค้ดเพิ่มเมื่อถึงจุดนั้น |
| **Subagent** | agent ย่อยที่สร้างขึ้นมาทำงานเฉพาะส่วน — ช่วยแบ่งงานซับซ้อนออกเป็นชิ้นเล็กๆ |
| **Async / async for** | การรับข้อมูลแบบ "ทยอยรับ" โดยไม่ต้องรอให้เสร็จทั้งหมดก่อน — ข้อความใหม่แต่ละชิ้นจะปรากฏทันทีที่พร้อม |
| **GitHub Secret** | ที่เก็บข้อมูลสำคัญใน GitHub (เช่น API key) อย่างปลอดภัย ไม่ให้ปรากฏในโค้ด |
| **OIDC** (OpenID Connect) | มาตรฐานยืนยันตัวตนแบบชั่วคราวและปลอดภัย — แทน static key ที่เสี่ยงหลุด |
| **WIF** (Workload Identity Federation) | วิธียืนยันตัวตนบน Google Cloud โดยใช้ identity จากระบบอื่น (เช่น GitHub) แทนการเก็บ key ถาวร |
| **Headless mode** | รัน Claude Code แบบไม่มีหน้าจอโต้ตอบ — เหมาะกับสคริปต์อัตโนมัติ |
| **Runner** | เครื่อง (server) ที่รัน workflow — GitHub Actions ใช้ `ubuntu-latest` เป็นค่าเริ่มต้น |
| **Regex** | รูปแบบการค้นหาข้อความขั้นสูง เช่น `**/*.ts` คือ "ไฟล์ .ts ทุกไฟล์ในทุกโฟลเดอร์" |
| **Working directory** | โฟลเดอร์ทำงานปัจจุบัน — agent จะอ่าน/เขียนไฟล์ในโฟลเดอร์นี้ |

---

## 1. Claude Agent SDK
อ้างอิง: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

### หัวข้อนี้คืออะไร
Agent SDK ให้คุณสร้าง AI agent ที่อ่านไฟล์ รันคำสั่ง ค้นเว็บ แก้โค้ดได้เอง โดยใช้ tools, **agent loop** (วงจรการทำงานที่ Claude เรียกเครื่องมือซ้ำๆ จนงานเสร็จ) และ context management ชุดเดียวกับที่ขับเคลื่อน Claude Code เขียนโปรแกรมได้ทั้ง Python และ TypeScript

> หมายเหตุ: เดิมชื่อ "Claude Code SDK" เปลี่ยนเป็น "Claude Agent SDK" แล้ว (ดู Migration Guide)

### ใช้ทำอะไร
- สร้าง agent ใน production (เช่น ผู้ช่วยอีเมล, research agent, bug-fixing agent)
- รันใน CI/CD pipeline
- ฝัง Claude Code เข้าแอปของตัวเองโดยควบคุม orchestration/tool/permission เอง

### ต่างจาก Client SDK อย่างไร
- **Client SDK (`anthropic`)** — เข้าถึง API ตรง เหมือนโทรหา Claude แบบถามตอบธรรมดา คุณต้องเขียน **tool loop** (วงซ้ำที่รันเครื่องมือและป้อนผลกลับให้ Claude) เอง
- **Agent SDK** — Claude จัดการ tool loop และรัน tool ในตัวให้ทั้งหมด คุณแค่ส่ง prompt และรับผลลัพธ์

> **กล่าวง่ายๆ:** Client SDK เหมือนซื้อวัตถุดิบมาทำอาหารเอง; Agent SDK เหมือนสั่ง delivery — บอกแค่ "อยากได้ผัดกะเพรา" แล้วได้รับอาหารสำเร็จรูปเลย

```python
# Client SDK: คุณเขียน loop เอง
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)
    response = client.messages.create(tool_result=result, **params)

# Agent SDK: Claude จัดการ tool ให้อัตโนมัติ
async for message in query(prompt="Fix the bug in auth.py"):
    print(message)
```

### วิธีใช้งาน (Step-by-step)
1. ติดตั้ง: `pip install claude-agent-sdk` (Python) หรือ `npm install @anthropic-ai/claude-agent-sdk` (TypeScript/Node.js)
2. ตั้งคีย์: `export ANTHROPIC_API_KEY=your-api-key` (**environment variable** — ตัวแปรเก็บค่าในระบบ ไม่ต้องเขียนลงโค้ดโดยตรง); รองรับ Bedrock/Vertex/Azure ผ่าน env: `CLAUDE_CODE_USE_BEDROCK=1`, `CLAUDE_CODE_USE_VERTEX=1`, `CLAUDE_CODE_USE_FOUNDRY=1`
3. รัน agent แรก

### ตัวอย่าง (Python)
```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(  # async for = รับข้อความทีละชิ้นแบบ streaming
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),  # allowed_tools = เครื่องมือที่อนุญาตให้ใช้
    ):
        print(message)

asyncio.run(main())
```

### ตัวอย่าง (TypeScript)
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

### ข้อควรระวัง
Anthropic ไม่อนุญาตให้นักพัฒนาบุคคลที่สามใช้ claude.ai login หรือ rate limit ของ claude.ai กับผลิตภัณฑ์ของตน (รวม agent บน Agent SDK) เว้นแต่ได้รับอนุมัติ — ให้ใช้การยืนยันตัวตนด้วย API key

### สรุปสั้น ๆ
Agent SDK = Claude Code เป็นไลบรารี (Python/TS) ที่จัดการ tool loop ให้; ใช้ `query()` พร้อม allowed_tools

---

## 2. ความสามารถของ Agent SDK
อ้างอิง: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

### เครื่องมือในตัว (Built-in tools)
| Tool | ทำอะไร |
|---|---|
| **Read** | อ่านไฟล์ใน working directory |
| **Write** | สร้างไฟล์ใหม่ |
| **Edit** | แก้ไขไฟล์เดิมแบบเจาะจง |
| **Bash** | รันคำสั่ง terminal/สคริปต์/git |
| **Glob** | หาไฟล์ตาม pattern (`**/*.ts`) |
| **Grep** | ค้นเนื้อหาไฟล์ด้วย regex |
| **WebSearch** | ค้นเว็บ |
| **WebFetch** | ดึงเนื้อหาหน้าเว็บ |
| **AskUserQuestion** | ถามผู้ใช้แบบตัวเลือก |

### ฟีเจอร์เพิ่มเติม
- **Hooks** — **callback** (ฟังก์ชันที่เรียกอัตโนมัติเมื่อถึงจุดนั้น) ณ จุดต่าง ๆ ของ **lifecycle** (วงจรชีวิตการทำงาน) ได้แก่ `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` — ใช้เพื่อ validate (ตรวจสอบ)/log (บันทึก)/block (บล็อก)/transform (แปลง) ข้อมูล
- **Subagents** — สร้าง **agent ย่อย** เฉพาะทางมาทำงานส่วนย่อย เหมาะกับงานซับซ้อนที่แบ่งเป็นชิ้นได้ (ต้องใส่ `Agent` ใน allowed_tools); ติดตามด้วย `parent_tool_use_id`
- **MCP** — เชื่อมระบบภายนอก (ฐานข้อมูล, เบราว์เซอร์, API ต่างๆ) ผ่าน `mcp_servers` — เหมือนปลั๊กที่ต่อเข้ากับเครื่องมือภายนอก
- **Permissions** — คุมว่า agent ใช้ tool ใดได้บ้าง เช่น ถ้าต้องการให้อ่านอย่างเดียวก็ใส่ `allowed_tools=["Read","Glob","Grep"]` เท่านั้น
- **Sessions** — รักษา context (บริบทการสนทนา) ข้ามหลายคำถาม, **resume** (กลับมาทำงานต่อ)/fork (แยกสาย) session ได้ โดยจับ `session_id` จาก init message แล้วส่ง `resume=session_id`

### รองรับฟีเจอร์แบบไฟล์ของ Claude Code
ตั้ง `setting_sources=["project"]` เพื่อให้ agent อ่านการตั้งค่าจากโปรเจกต์: **Skills** (`.claude/skills/*/SKILL.md` — ความสามารถเฉพาะทาง), **Slash commands** (`.claude/commands/*.md` — คำสั่งลัด), **Memory** (`CLAUDE.md` — กฎและบริบทของโปรเจกต์) และ **Plugins** (ส่วนขยายเพิ่มเติม)

### ตัวอย่าง (subagent)
```python
async for message in query(
    prompt="Use the code-reviewer agent to review this codebase",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep", "Agent"],
        agents={
            "code-reviewer": AgentDefinition(
                description="Expert code reviewer.",
                prompt="Analyze code quality and suggest improvements.",
                tools=["Read", "Glob", "Grep"],
            )
        },
    ),
):
    if hasattr(message, "result"):
        print(message.result)
```

### สรุปสั้น ๆ
Agent SDK มี tools ในตัวครบ + hooks, subagents, MCP, permissions, sessions และใช้ config แบบไฟล์ของ Claude Code ได้

---

## 3. เลือกใช้ Agent SDK เทียบกับ CLI
อ้างอิง: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

| Use case | ตัวเลือกที่เหมาะ |
|---|---|
| พัฒนาแบบโต้ตอบ | CLI |
| CI/CD pipeline | SDK |
| แอปที่สร้างเอง | SDK |
| งานครั้งเดียว | CLI |
| automation ใน production | SDK |

หลายทีมใช้ทั้งคู่: CLI สำหรับงานประจำวัน, SDK สำหรับ production — workflow แปลงข้ามกันได้ตรง ๆ

### สรุปสั้น ๆ
ใช้ CLI สำหรับงานโต้ตอบ/ครั้งเดียว, ใช้ SDK สำหรับ CI/CD และ production automation

---

## 4. Claude Code GitHub Actions
อ้างอิง: [GitHub Actions](https://code.claude.com/docs/en/github-actions) · [Code Review](https://code.claude.com/docs/en/code-review)

### หัวข้อนี้คืออะไร
นำ Claude Code มาทำงานอัตโนมัติใน **GitHub workflow** (ลำดับขั้นตอนอัตโนมัติที่รันบน GitHub) เพียง mention `@claude` ใน **PR** (Pull Request — คำขอรวมโค้ด) หรือ issue Claude จะวิเคราะห์โค้ด สร้าง PR ทำฟีเจอร์ และแก้บั๊ก ตามมาตรฐานในโปรเจกต์ (สร้างบน Agent SDK)

### ใช้ทำอะไร
- สร้าง PR ทันทีจากคำอธิบาย, เปลี่ยน issue เป็นโค้ด, รีวิวโค้ดอัตโนมัติทุก PR, ทำรายงานประจำวันแบบตั้งเวลา
- โค้ดอยู่บน GitHub runners ปลอดภัยโดยค่าเริ่มต้น

### วิธีติดตั้ง (Quick setup)
1. ใน terminal เปิด `claude` แล้วรัน `/install-github-app` (ต้องเป็น **repo admin** — ผู้ดูแล repository)
2. ทำตามขั้นตอนตั้งค่า GitHub app และ **secret** (ที่เก็บ API key อย่างปลอดภัยใน GitHub Settings)
3. ทดสอบโดย mention `@claude` ใน comment ของ issue/PR

**ติดตั้งด้วยมือ:** ติดตั้ง [Claude GitHub app](https://github.com/apps/claude) (ขอสิทธิ์ Contents, Issues, Pull requests แบบ Read & Write) → เพิ่ม **secret** `ANTHROPIC_API_KEY` ใน GitHub → คัดลอกไฟล์ **workflow** (ไฟล์ YAML ที่กำหนดขั้นตอน) ไปที่ `.github/workflows/`

### ตัวอย่าง workflow พื้นฐาน
```yaml
name: Claude Code
on:                             # กำหนดเหตุการณ์ที่จะทริกเกอร์ workflow
  issue_comment:
    types: [created]            # เมื่อมีคนแสดงความคิดเห็นใน issue
  pull_request_review_comment:
    types: [created]            # เมื่อมีคนแสดงความคิดเห็นใน PR
jobs:
  claude:
    runs-on: ubuntu-latest      # รันบน runner (เครื่อง server) Ubuntu
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}  # ดึง API key จาก Secret
          # ตอบสนองต่อ @claude ใน comment
```

### ตัวอย่าง code review อัตโนมัติทุก PR
```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "รีวิว PR นี้เรื่องคุณภาพโค้ด ความถูกต้อง และความปลอดภัย แล้วโพสต์เป็น review comment"
          claude_args: "--max-turns 5"
```

### พารามิเตอร์หลักของ action (v1)
| พารามิเตอร์ | คำอธิบาย | จำเป็น |
|---|---|---|
| `prompt` | คำสั่ง (ข้อความหรือชื่อ skill) | ไม่ (ถ้าตอบ @claude ใน comment) |
| `claude_args` | CLI args ส่งเข้า Claude Code | ไม่ |
| `anthropic_api_key` | Claude API key | ใช่ (ถ้าใช้ API ตรง) |
| `trigger_phrase` | วลีทริกเกอร์ (ค่าเริ่มต้น `@claude`) | ไม่ |
| `use_bedrock` / `use_vertex` | ใช้ Bedrock/Vertex แทน API ตรง | ไม่ |

`claude_args` ที่ใช้บ่อย: `--max-turns`, `--model`, `--mcp-config`, `--allowedTools`, `--debug`

### ข้อควรระวัง (ความปลอดภัยและต้นทุน)
- **อย่า commit API key ลง repo** — ใช้ **GitHub Secrets** เสมอ (เก็บใน Settings → Secrets ไม่ให้ปรากฏในโค้ด)
- จำกัดสิทธิ์ action ให้น้อยที่สุด รีวิวข้อเสนอของ Claude ก่อน **merge** (รวมโค้ดเข้า branch หลัก)
- มีต้นทุน 2 ส่วน: **GitHub Actions minutes** (เวลาที่ runner ทำงาน) + **token** ของ Claude API; ลดต้นทุนด้วย `--max-turns` (จำกัดรอบ), **timeout** (หยุดถ้าใช้เวลาเกินกำหนด) และ **concurrency control** (จำกัดจำนวน workflow ที่รันพร้อมกัน)
- v1.0 มี **breaking changes** (การเปลี่ยนแปลงที่ทำให้โค้ดเก่าทำงานไม่ได้) จาก beta เช่น `direct_prompt` → `prompt`, ย้าย `model`/`max_turns` ไป `claude_args`

### สรุปสั้น ๆ
ใช้ `anthropics/claude-code-action@v1` + secret `ANTHROPIC_API_KEY`; mention `@claude` หรือใส่ `prompt`; ตั้งค่าด้วย `claude_args`

---

## 5. ใช้ GitHub Actions กับ Bedrock / Vertex
อ้างอิง: [Using with AWS Bedrock & Google Vertex AI](https://code.claude.com/docs/en/github-actions#using-with-aws-bedrock-%26-google-vertex-ai)

### รายละเอียดสำคัญจากเอกสารทางการ
- สำหรับองค์กรที่ต้องการคุม **data residency** (ข้อมูลอยู่ในภูมิภาคที่กำหนด)/billing ผ่านคลาวด์ของตัวเอง
- แนะนำสร้าง **GitHub App ของตัวเอง** และใช้ `actions/create-github-app-token` สร้าง token (ใบผ่านชั่วคราว)
- ยืนยันตัวตนแบบไม่เก็บ credential (ข้อมูลรับรองตัวตน) ถาวร:
  - **AWS Bedrock** — ตั้ง **GitHub OIDC Identity Provider** (ระบบยืนยันตัวตนชั่วคราวระหว่าง GitHub กับ AWS) + IAM role (`AWS_ROLE_TO_ASSUME`), ใช้ `use_bedrock: "true"`, model ID มี region prefix เช่น `us.anthropic.claude-sonnet-4-6`
  - **Google Vertex AI** — ตั้ง **Workload Identity Federation / WIF** (ระบบยืนยันตัวตนบน Google Cloud โดยใช้ identity จาก GitHub แทนการเก็บ key) + service account (`GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`), ใช้ `use_vertex: "true"`
- **OIDC/WIF ปลอดภัยกว่า static key** เพราะ credential เป็น **ชั่วคราว** (หมดอายุเอง) และหมุนอัตโนมัติ — ต่างจาก API key ถาวรที่ถ้าหลุดก็ใช้ได้ตลอด

### สรุปสั้น ๆ
ใช้ OIDC (Bedrock) หรือ WIF (Vertex) แทน static key; ตั้ง `use_bedrock`/`use_vertex: true` ใน action

---

## 6. Claude Code GitLab CI/CD
อ้างอิง: [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd)

### รายละเอียดสำคัญจากเอกสารทางการ
- ผสาน Claude Code เข้ากับ **GitLab pipeline** (ลำดับขั้นตอนอัตโนมัติใน GitLab) เพื่อทำงานอัตโนมัติ (รีวิว **MR** / Merge Request — คำขอรวมโค้ดใน GitLab, แก้บั๊ก, ทำฟีเจอร์)
- ตั้งค่าผ่าน `.gitlab-ci.yml` (ไฟล์ YAML ที่กำหนด pipeline) และเก็บ `ANTHROPIC_API_KEY` ใน **CI/CD variables** แบบ **masked** (ซ่อนในล็อก) และ **protected** (ใช้ได้เฉพาะ branch ที่กำหนด)
- รองรับ trigger จากเหตุการณ์ใน GitLab และใช้ CLI args เช่นเดียวกับฝั่ง GitHub
- รองรับ Bedrock/Vertex สำหรับองค์กรเช่นกัน

### สรุปสั้น ๆ
GitLab CI/CD ผสาน Claude Code ผ่าน `.gitlab-ci.yml` + API key ใน CI/CD variables; ทำ MR review/automation ได้

---

## 7. ช่องทาง CI/CD และ automation อื่น ๆ
อ้างอิง: [Overview](https://code.claude.com/docs/en/overview) · [Slack](https://code.claude.com/docs/en/slack) · [Headless](https://code.claude.com/docs/en/headless)

### รายละเอียดสำคัญจากเอกสารทางการ
- **GitHub Code Review** — รีวิวอัตโนมัติทุก PR โดยไม่ต้องทริกเกอร์ (Claude วิเคราะห์โค้ดและแสดงความคิดเห็นเอง) ([code-review](https://code.claude.com/docs/en/code-review))
- **Slack** — ส่งงานด้วย `@Claude` ในแชต ได้ PR กลับโดยตรง
- **Headless mode** — รัน Claude Code แบบ **ไม่มีหน้าจอโต้ตอบ** ผ่าน Agent SDK/CLI (`claude -p`) เหมาะกับสคริปต์อัตโนมัติและ CI/CD ที่รันเบื้องหลัง
- **GitHub Enterprise Server / GitLab self-managed** — รองรับสำหรับองค์กรที่รัน GitHub/GitLab บน server ของตัวเอง

### สรุปสั้น ๆ
นอกจาก GitHub/GitLab ยังมี auto code review, Slack, headless mode และรองรับ self-managed สำหรับองค์กร

---

## หัวข้ออ้างอิงเพิ่มเติม
- Agent SDK quickstart: https://code.claude.com/docs/en/agent-sdk/quickstart
- Agent SDK (Python): https://code.claude.com/docs/en/agent-sdk/python
- Agent SDK (TypeScript): https://code.claude.com/docs/en/agent-sdk/typescript
- claude-code-action repo: https://github.com/anthropics/claude-code-action
- GitLab CI/CD: https://code.claude.com/docs/en/gitlab-ci-cd
