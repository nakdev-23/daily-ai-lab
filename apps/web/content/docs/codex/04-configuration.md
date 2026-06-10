---
title: "การตั้งค่า (Configuration)"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "อ้างอิง: Config Basics"
readTime: "17 นาที"
readers: "0"
locked: false
order: 4
---
# คู่มือ Codex ภาษาไทย — ตอนที่ 4: การตั้งค่า (Configuration)

> อ้างอิง Official Docs: [Codex Configuration](https://developers.openai.com/codex/config-basic)

---

## แผนผังเนื้อหาในไฟล์นี้

| หมวด | หัวข้อ | สถานะ |
|---|---|---|
| Config File | Config Basics | เรียบเรียงแล้ว |
| Config File | Advanced Config | เรียบเรียงแล้ว (ย่อ) |
| Config File | Config Reference | ต้องตรวจสอบเพิ่ม |
| Config File | Environment Variables | ต้องตรวจสอบเพิ่ม |
| Config File | Sample Config | ต้องตรวจสอบเพิ่ม |
| Configuration | Permissions | เรียบเรียงแล้ว (ย่อ) |
| Configuration | Speed | เรียบเรียงแล้ว |
| Configuration | Rules | เรียบเรียงแล้ว |
| Configuration | Hooks | เรียบเรียงแล้ว |
| Configuration | AGENTS.md | เรียบเรียงแล้ว |
| Configuration | MCP | เรียบเรียงแล้ว |
| Configuration | Plugins Overview | เรียบเรียงแล้ว |
| Configuration | Build Plugins | เรียบเรียงแล้ว |
| Configuration | Sites | เรียบเรียงแล้ว |
| Configuration | Skills | เรียบเรียงแล้ว |
| Configuration | Subagents | ต้องตรวจสอบเพิ่ม |

---

## 1. Config Basics — พื้นฐานการตั้งค่า

อ้างอิง: [Config Basics](https://developers.openai.com/codex/config-basic)

### หัวข้อนี้คืออะไร

Config Basics อธิบายวิธีตั้งค่า Codex ผ่านไฟล์ `config.toml` ซึ่งเป็นหัวใจหลักของการปรับพฤติกรรม Codex ในระดับ user และ project

### ตำแหน่งไฟล์ Config

Codex อ่านการตั้งค่าจากหลายระดับ:

| ระดับ | ตำแหน่ง | ความหมาย |
|---|---|---|
| User Config | `~/.codex/config.toml` | ค่าเริ่มต้นส่วนตัวของผู้ใช้ |
| Project Config | `.codex/config.toml` (ที่ root ของ project) | ค่าเฉพาะ project นั้น |
| System Config | `/etc/codex/config.toml` | ค่าจากผู้ดูแลระบบ (enterprise) |

### ลำดับความสำคัญ (Precedence)

เมื่อค่าเดียวกันมีอยู่หลายที่ Codex ใช้ลำดับดังนี้:

```
CLI flags  >  project config  >  profile  >  user config  >  system config  >  defaults
```

ค่าที่กำหนดผ่าน CLI flag จะ override ทุกอย่างเสมอ

### ตัวเลือกหลักที่ใช้บ่อย

| ตัวเลือก | ประเภท | ความหมาย |
|---|---|---|
| `model` | string | โมเดลที่ใช้งาน เช่น `"gpt-4.1"` |
| `approval_policy` | string | โหมดอนุมัติ: `"untrusted"` / `"on-request"` / `"never"` |
| `sandbox_mode` | string | โหมด sandbox สำหรับความปลอดภัย |
| `web_search` | string | การค้นหาเว็บ: `"cached"` / `"live"` / `"disabled"` |
| `model_reasoning_effort` | string | ความลึกของ reasoning: `"low"` / `"medium"` / `"high"` |
| `personality` | string | รูปแบบการตอบสนองของ Codex |
| `tui_keymap` | string | keyboard layout ใน TUI |
| `shell_environment_policy` | string | นโยบาย environment ของ shell |
| `log_dir` | string | โฟลเดอร์เก็บ log |

### ตัวอย่างไฟล์ Config เบื้องต้น

```toml
# ~/.codex/config.toml

model = "gpt-4.1"
approval_policy = "on-request"
web_search = "live"
model_reasoning_effort = "medium"
```

### Feature Flags

Codex มี feature flags ที่ควบคุมฟีเจอร์ต่างๆ ใน `[features]` section:

| Feature Flag | ค่าเริ่มต้น | ความสมบูรณ์ |
|---|---|---|
| `hooks` | `false` | Stable |
| `memories` | `false` | Stable |
| `multi_agent` | `false` | Stable |
| `shell_snapshot` | `false` | Stable |
| `undo` | `false` | Stable |
| `fast_mode` | `false` | Stable |
| `apps` | `false` | Experimental |
| `codex_git_commit` | `false` | Experimental |

ตัวอย่างการเปิด hooks:

```toml
[features]
codex_hooks = true
```

### สรุปสั้นๆ

ไฟล์ `config.toml` คือศูนย์กลางของการปรับแต่ง Codex ตั้งแต่เลือกโมเดล กำหนดนโยบายอนุมัติ ไปจนถึงเปิด feature ใหม่ๆ ค่าที่ตั้งไว้ใน project จะ override ค่าของผู้ใช้ และ CLI flags จะ override ทุกอย่าง

---

## 2. Advanced Config — การตั้งค่าขั้นสูง

อ้างอิง: [Advanced Config](https://developers.openai.com/codex/config-advanced)

### หัวข้อนี้คืออะไร

Advanced Config ครอบคลุมการตั้งค่าเชิงลึก เช่น profiles หลายชุด การค้นพบ project instructions และการตั้งค่า shell environment

### Profiles

Profiles คือชุดการตั้งค่าที่มีชื่อ ทำให้สามารถสลับระหว่างการตั้งค่าต่างๆ ได้ง่าย เช่น profile สำหรับงาน security review กับ profile สำหรับงาน refactor ทั่วไป

```toml
[profile.strict]
approval_policy = "untrusted"
model_reasoning_effort = "high"

[profile.quick]
approval_policy = "never"
model_reasoning_effort = "low"
```

เรียกใช้ profile ด้วย: `codex --profile strict`

### Project Instructions Discovery

Codex มีระบบค้นหา instruction files อัตโนมัติผ่าน parameter ต่อไปนี้:

| ตัวเลือก | ความหมาย |
|---|---|
| `project_doc_max_bytes` | ขนาดสูงสุดของ instruction files รวม (default: 32KiB) |
| `project_doc_fallback_filenames` | ชื่อไฟล์สำรองนอกจาก AGENTS.md |

ตัวอย่าง:

```toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
```

### Shell Environment Policy

กำหนดว่า Codex จะ inherit environment variables จาก shell อย่างไร โดยสามารถเลือกให้ inherit ทั้งหมด เฉพาะบางส่วน หรือไม่ inherit เลย

### ข้อควรระวัง

หน้า Advanced Config มีเนื้อหาขนาดใหญ่มาก ขอแนะนำให้อ่านเพิ่มเติมโดยตรงจาก [Official Docs](https://developers.openai.com/codex/config-advanced) เพื่อรายละเอียดครบถ้วน

---

## 3. Config Reference, Environment Variables & Sample Config

อ้างอิง: [Config Reference](https://developers.openai.com/codex/config-reference) | [Environment Variables](https://developers.openai.com/codex/environment-variables) | [Sample Config](https://developers.openai.com/codex/config-sample)

### Config Reference

เป็นเอกสาร reference สำหรับทุก key ที่รองรับใน `config.toml` พร้อม type, ค่าเริ่มต้น และคำอธิบาย ควรใช้ร่วมกับ Config Basics และ Advanced Config

### Environment Variables ที่สำคัญ

Codex รองรับการตั้งค่าบางอย่างผ่าน environment variables:

| Variable | ความหมาย |
|---|---|
| `OPENAI_API_KEY` | API Key สำหรับเชื่อมต่อ OpenAI |
| `CODEX_HOME` | เปลี่ยนตำแหน่ง home directory ของ Codex (แทน `~/.codex`) |
| `CODEX_QUIET_MODE` | ลดการแสดงผลให้เงียบลง |

### ข้อควรทราบ

ดู config ตัวอย่างครบถ้วนได้ที่ [Sample Config](https://developers.openai.com/codex/config-sample) ซึ่งเป็น template ที่สามารถ copy ไปปรับใช้ได้ทันที

---

## 4. Permissions — การกำหนดสิทธิ์

อ้างอิง: [Permissions](https://developers.openai.com/codex/permissions)

### หัวข้อนี้คืออะไร

Permissions ควบคุมว่า Codex สามารถเข้าถึงไฟล์ระบบ เครือข่าย และเรียกใช้คำสั่งอะไรได้บ้าง

### Named Permission Profiles

Codex มี named profiles สำเร็จรูปให้เลือกใช้:

| Profile | ความหมาย |
|---|---|
| `:read-only` | อ่านไฟล์ได้อย่างเดียว ห้ามแก้ไขหรือรัน |
| `:workspace` | ทำงานได้ภายใน working directory |
| `:danger-full-access` | เข้าถึงได้เต็มที่รวมถึง network |

ใช้ใน CLI: `codex --permissions :read-only "อ่านไฟล์ src/ ทั้งหมด"`

### Custom Permission Profiles

สร้าง profile เองใน config.toml:

```toml
[permissions.my-profile]
# กำหนด filesystem และ network access ตามต้องการ
```

### ข้อควรระวัง

หน้า Permissions มีรายละเอียดจำนวนมากเกี่ยวกับ filesystem scope และ network access control ขอแนะนำให้อ่านโดยตรงจาก [Official Docs](https://developers.openai.com/codex/permissions) สำหรับข้อมูลครบถ้วน

---

## 5. Speed — การเพิ่มความเร็ว

อ้างอิง: [Speed](https://developers.openai.com/codex/speed)

### หัวข้อนี้คืออะไร

Speed อธิบายวิธีเพิ่มความเร็วในการทำงานของ Codex โดยไม่เสียประสิทธิภาพมากนัก

### Fast Mode

Fast Mode เพิ่มความเร็วของโมเดลที่รองรับขึ้น **1.5x** แลกกับการใช้ credits สูงขึ้น

**โมเดลที่รองรับ:**

| โมเดล | อัตราการใช้ Credits ใน Fast Mode |
|---|---|
| GPT-5.5 | 2.5x เทียบกับ Standard |
| GPT-5.4 | 2x เทียบกับ Standard |

**วิธีเปิดใช้:**

ใน CLI — ใช้ slash commands:
```
/fast on      # เปิด Fast Mode
/fast off     # ปิด Fast Mode
/fast status  # ดูสถานะปัจจุบัน
```

ใน Config ถาวร:
```toml
service_tier = "fast"

[features]
fast_mode = true
```

**ใช้ได้ใน:** Codex IDE Extension, Codex CLI, Codex App (เมื่อล็อกอินด้วย ChatGPT)

**ไม่รองรับ:** เมื่อใช้ API key โดยตรง (ใช้ standard API pricing แทน)

### Codex-Spark

GPT-5.3-Codex-Spark เป็นโมเดลแยกต่างหาก (ไม่ใช่ Fast Mode) ที่ออกแบบมาสำหรับการ iteration โค้ดแบบ real-time ที่รวดเร็วมาก

- ความสามารถน้อยกว่า GPT-5.4/5.5 แต่ตอบสนองเกือบทันที
- ปัจจุบันใช้ได้เฉพาะสมาชิก **ChatGPT Pro** เท่านั้น (Research Preview)
- มี usage limits แยกต่างหาก

### สรุปสั้นๆ

Fast Mode เหมาะสำหรับงานที่ต้องการความเร็วและยอมแลกค่าใช้จ่ายเพิ่มขึ้น ส่วน Codex-Spark เหมาะสำหรับ iteration loop รวดเร็วที่ไม่ต้องการความสมบูรณ์สูงมาก

---

## 6. Rules — กฎการควบคุมพฤติกรรม

อ้างอิง: [Rules](https://developers.openai.com/codex/rules)

### หัวข้อนี้คืออะไร

Rules ช่วยให้กำหนดกฎว่า Codex อนุญาต ห้าม หรือต้องขออนุมัติก่อนรันคำสั่ง shell ใด

### ภาษา Starlark และ prefix_rule()

ไฟล์ `.rules` ใช้ภาษา Starlark (subset ของ Python) กำหนดกฎด้วยฟังก์ชัน `prefix_rule()`:

```python
prefix_rule(
    pattern = "rm -rf",
    decision = "forbidden",
    justification = "ห้ามลบไฟล์แบบ recursive โดยไม่ได้รับอนุมัติ",
    match = ["rm -rf /tmp"],
    not_match = ["rm -rf /nonexistent"]
)
```

**ฟิลด์ของ prefix_rule():**

| ฟิลด์ | ความหมาย |
|---|---|
| `pattern` | prefix ของคำสั่งที่ต้องการจับ |
| `decision` | `"allow"` / `"prompt"` / `"forbidden"` |
| `justification` | เหตุผลที่แสดงให้ผู้ใช้เห็น |
| `match` | ตัวอย่างคำสั่งที่ควร match |
| `not_match` | ตัวอย่างคำสั่งที่ไม่ควร match |

### การตัดสินใจ (Decisions)

| Decision | ความหมาย |
|---|---|
| `allow` | อนุญาตทันทีโดยไม่ถามผู้ใช้ |
| `prompt` | ขออนุมัติจากผู้ใช้ก่อนรัน |
| `forbidden` | ห้ามรันโดยสิ้นเชิง |

### Shell Compound Commands

Codex แยกคำสั่งที่ต่อกันด้วย `&&`, `||`, `;` ออกเป็นส่วนๆ ก่อนตรวจสอบกฎ เช่น:

```bash
npm test && rm -rf ./dist
```

Codex จะตรวจสอบ `npm test` และ `rm -rf ./dist` แยกกัน ดังนั้นกฎที่จับ `rm -rf` จะยังทำงานได้แม้อยู่ในคำสั่งซับซ้อน

### ทดสอบกฎ

```bash
codex execpolicy check "rm -rf /tmp/test"
```

ใช้คำสั่งนี้เพื่อตรวจสอบว่ากฎที่เขียนทำงานตามที่คาดหวังหรือไม่

### สรุปสั้นๆ

Rules ช่วยป้องกันการรันคำสั่งอันตรายโดยอัตโนมัติ เหมาะมากสำหรับทีมที่ต้องการ safety net ก่อน deploy หรือทำงานบน production environment

---

## 7. Hooks — เหตุการณ์อัตโนมัติ

อ้างอิง: [Hooks](https://developers.openai.com/codex/hooks)

### หัวข้อนี้คืออะไร

Hooks คือ event handlers ที่ทำงานอัตโนมัติเมื่อ Codex ทำเหตุการณ์ต่างๆ เช่น เริ่ม session, ก่อน/หลัง tool call, หรือเมื่อ agent หยุดทำงาน

### เปิดใช้งาน Hooks

ต้องเปิด feature flag ก่อน:

```toml
[features]
codex_hooks = true
```

> **หมายเหตุ:** Hooks ไม่รองรับบน Windows

### โครงสร้าง hooks.json

สร้างไฟล์ `~/.codex/hooks.json` หรือ `.codex/hooks.json` ใน project:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": {
        "tool_name": "shell"
      },
      "command": ["./scripts/log-tool-use.sh"]
    }
  ]
}
```

### Events ที่รองรับ

| Event | เมื่อไหร่ทำงาน |
|---|---|
| `SessionStart` | เมื่อเริ่ม session ใหม่ |
| `PreToolUse` | ก่อน Codex เรียกใช้ tool |
| `PostToolUse` | หลัง Codex เรียกใช้ tool เสร็จ |
| `UserPromptSubmit` | เมื่อผู้ใช้ส่ง prompt |
| `Stop` | เมื่อ agent หยุดทำงาน |

### Matcher Patterns

ใช้ matcher เพื่อกรอง event เฉพาะบาง tool:

```json
{
  "matcher": {
    "tool_name": "shell"
  }
}
```

หรือ match ชื่อคำสั่ง:

```json
{
  "matcher": {
    "command_prefix": "npm"
  }
}
```

### Input/Output ของ Hook

**Input (ส่งให้ hook script):** JSON object มี event type, tool name, arguments, timestamp

**Output (อ่านจาก hook script):** JSON object ที่ hook ส่งกลับ ใช้ modifier เช่น block, replace สำหรับ PreToolUse

### Concurrent Hooks

Hooks หลายอันที่ subscribe event เดียวกันจะทำงาน **พร้อมกัน** (concurrent) ดังนั้นออกแบบ hook ให้ทำงานอิสระจากกันได้

### Timeout

หาก hook ไม่ตอบกลับภายใน timeout ที่กำหนด Codex จะถือว่า hook นั้น pass และดำเนินงานต่อ

### สรุปสั้นๆ

Hooks เหมาะสำหรับ logging, audit trail, แจ้งเตือนทีม, หรือ block การกระทำบางอย่างแบบ programmatic ต้องเปิด feature flag และไม่ทำงานบน Windows

---

## 8. AGENTS.md — คำแนะนำแบบ Persistent สำหรับ Project

อ้างอิง: [AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

### หัวข้อนี้คืออะไร

`AGENTS.md` เป็นไฟล์ที่ Codex อ่านก่อนเริ่มทำงานทุกครั้ง ช่วยให้กำหนด working agreements, conventions, และข้อมูล project ที่ Codex ควรรู้ไว้ตลอด

### การค้นพบ AGENTS.md (Discovery)

Codex สร้าง "instruction chain" เมื่อเริ่มแต่ละ run ตามลำดับความสำคัญ:

1. **Global scope:** ค้นหาใน `~/.codex/` (หรือ `$CODEX_HOME/`)
   - อ่าน `AGENTS.override.md` ก่อน ถ้าไม่มีจึงอ่าน `AGENTS.md`
2. **Project scope:** เริ่มจาก Git root เดินลงมาถึง current directory
   - แต่ละโฟลเดอร์ตรวจสอบตามลำดับ: `AGENTS.override.md` → `AGENTS.md` → fallback filenames
   - อ่านได้สูงสุด 1 ไฟล์ต่อ 1 โฟลเดอร์
3. **Merge:** ต่อไฟล์จาก root ลงมา โดยไฟล์ที่อยู่ใกล้ current directory มากกว่าจะ override ค่าก่อนหน้า

ขนาดสูงสุดรวม: 32KiB (ปรับได้ผ่าน `project_doc_max_bytes`)

### สร้าง Global Guidance

```bash
mkdir -p ~/.codex
```

สร้าง `~/.codex/AGENTS.md`:

```markdown
# ~/.codex/AGENTS.md

## Working agreements

- Always run `npm test` after modifying JavaScript files.
- Prefer `pnpm` when installing dependencies.
- Ask for confirmation before adding new production dependencies.
```

ทดสอบ:
```bash
codex --ask-for-approval never "Summarize the current instructions."
```

### Layer Project Instructions

สร้าง `AGENTS.md` ที่ root ของ repository:

```markdown
# AGENTS.md

## Repository expectations

- Run `npm run lint` before opening a pull request.
- Document public utilities in `docs/` when you change behavior.
```

เพิ่ม override เฉพาะในโฟลเดอร์ย่อยเมื่อต้องการกฎพิเศษ:

```markdown
# services/payments/AGENTS.override.md

## Payments service rules

- Use `make test-payments` instead of `npm test`.
- Never rotate API keys without notifying the security channel.
```

### ลำดับการอ่านไฟล์

```
~/.codex/AGENTS.md (Global)
    ↓
AGENTS.md (Repository root)
    ↓
services/AGENTS.md (ถ้ามี)
    ↓
services/payments/AGENTS.override.md (Override)  ← อ่านสุดท้าย = override ทุกอย่าง
```

### Fallback Filenames

ถ้า project ใช้ชื่อไฟล์อื่น ตั้งค่า fallback:

```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
```

Codex จะตรวจสอบ: `AGENTS.override.md` → `AGENTS.md` → `TEAM_GUIDE.md` → `.agents.md`

### CODEX_HOME

เปลี่ยน home directory ของ Codex เพื่อใช้ profile ที่แตกต่าง:

```bash
CODEX_HOME=$(pwd)/.codex codex exec "List active instruction sources"
```

### Troubleshooting

| ปัญหา | วิธีแก้ |
|---|---|
| ไม่โหลดอะไรเลย | ตรวจสอบว่า Codex อยู่ใน repository ที่ถูกต้อง และไฟล์มีเนื้อหา |
| โหลด guidance ผิด | ค้นหา `AGENTS.override.md` ใน parent directory |
| Codex ไม่รับ fallback name | ตรวจสอบ typo ใน `project_doc_fallback_filenames` แล้ว restart |
| เนื้อหาถูกตัด | เพิ่ม `project_doc_max_bytes` หรือแบ่งไฟล์ไปไว้ในโฟลเดอร์ย่อย |

### สรุปสั้นๆ

`AGENTS.md` คือวิธีกำหนด "คำแนะนำถาวร" ให้ Codex จำสำหรับทุก task ใน project โดยไม่ต้องพิมพ์ซ้ำทุกครั้ง ยิ่ง layer กันมากเท่าไหร่ ยิ่งปรับพฤติกรรมได้ละเอียดตามแต่ละส่วนของ codebase

---

## 9. MCP — Model Context Protocol

อ้างอิง: [MCP](https://developers.openai.com/codex/mcp)

### หัวข้อนี้คืออะไร

MCP (Model Context Protocol) ช่วยให้ Codex เชื่อมต่อกับ external services และ tools ผ่านมาตรฐาน MCP ทั้งแบบ local process (STDIO) และ remote server (HTTP)

### ประเภทของ MCP Server

| ประเภท | วิธีเชื่อมต่อ | เหมาะสำหรับ |
|---|---|---|
| STDIO | ผ่าน process บนเครื่อง | Tools แบบ local เช่น file system, local database |
| Streamable HTTP | ผ่าน URL | Remote services, cloud APIs |

### ตั้งค่าใน config.toml

**STDIO Server:**

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

**HTTP Server:**

```toml
[mcp_servers.figma]
url = "https://figma.com/mcp"
headers = { "X-Api-Key" = "your-key" }
```

### เพิ่ม MCP Server ผ่าน CLI

```bash
codex mcp add
```

คำสั่งนี้ช่วย interactive เพิ่ม MCP server โดยไม่ต้องแก้ไข config.toml ด้วยมือ

### OAuth Authentication

สำหรับ MCP server ที่ต้องการ OAuth:

```bash
codex mcp login <server-name>
```

Port สำหรับ OAuth callback:
```toml
mcp_oauth_callback_port = 8085
```

### กรองเครื่องมือ (Tool Filtering)

เลือกเฉพาะบาง tools จาก MCP server:

```toml
[mcp_servers.figma]
url = "https://figma.com/mcp"
enabled_tools = ["get_file", "get_component"]  # เปิดเฉพาะ tools เหล่านี้
# หรือ
disabled_tools = ["delete_file"]               # ปิด tools เหล่านี้
```

### ตัวอย่าง MCP Servers ที่ใช้บ่อย

| Server | ใช้ทำอะไร |
|---|---|
| Context7 | ดึงข้อมูลจาก documentation ของ libraries |
| Figma MCP | ทำงานกับ Figma designs โดยตรง |
| Chrome DevTools | inspect browser state |
| GitHub MCP | อ่าน/เขียน GitHub issues, PRs |

### สรุปสั้นๆ

MCP ช่วยให้ Codex มี "ตา" และ "มือ" เพิ่มเติมผ่านการเชื่อมต่อกับ external services ทั้ง local และ remote ทำให้ Codex ทำงานกับ ecosystem ที่กว้างขึ้นโดยไม่ต้องเขียน custom integration

---

## 10. Plugins — ปลั๊กอินสำเร็จรูป

อ้างอิง: [Plugins Overview](https://developers.openai.com/codex/plugins)

### หัวข้อนี้คืออะไร

Plugins คือแพ็กเกจที่รวม Skills, App integrations, และ MCP servers เข้าด้วยกันในรูปแบบที่ติดตั้งและแชร์ได้ง่าย

### Plugins ประกอบด้วยอะไร

| ส่วนประกอบ | คืออะไร |
|---|---|
| **Skills** | คำแนะนำ (instructions) สำหรับงานเฉพาะด้าน Codex โหลดมาเมื่อจำเป็น |
| **Apps** | การเชื่อมต่อกับ tools เช่น GitHub, Slack, Google Drive |
| **MCP Servers** | Services ที่ให้ Codex เข้าถึงข้อมูลหรือ tools เพิ่มเติม |

### Plugin Directory

**ใน Codex App:** เปิด **Plugins** ในแถบด้านซ้าย → เลือกจาก 3 หมวด:
- **Curated by OpenAI** — plugins ที่ OpenAI คัดมาให้
- **Shared with you** — plugins จากสมาชิกใน workspace
- **Created by you** — plugins ที่สร้างเอง

**ใน CLI:**
```bash
/plugins
```

### วิธีติดตั้งและใช้งาน Plugin

1. เปิด Plugin Directory → ค้นหา Plugin ที่ต้องการ
2. กด **Add to Codex** (App) หรือ **Install plugin** (CLI)
3. เชื่อมต่อ external app ถ้า plugin ต้องการ (เช่น Gmail OAuth)
4. เริ่ม thread ใหม่ แล้วพิมพ์ task ที่ต้องการ

**วิธีเรียกใช้ plugin:**

```
# อธิบาย task โดยตรง
"Summarize unread Gmail threads from today"

# เรียก plugin โดยตรง (พิมพ์ @)
@Gmail "show me emails from last week about the project"
```

### ปิด Plugin โดยไม่ถอนติดตั้ง

```toml
# ~/.codex/config.toml
[plugins."gmail@openai-curated"]
enabled = false
```

### สรุปสั้นๆ

Plugins คือวิธีที่เร็วที่สุดในการขยายความสามารถของ Codex ด้วย workflow สำเร็จรูปจาก community หรือ OpenAI เหมาะสำหรับงานที่ต้องการเชื่อมต่อกับ external services โดยไม่ต้องตั้งค่า MCP ด้วยมือ

---

## 11. Build Plugins — สร้าง Plugin เอง

อ้างอิง: [Build Plugins](https://developers.openai.com/codex/plugins/build)

### หัวข้อนี้คืออะไร

Build Plugins อธิบายวิธีสร้าง, ทดสอบ และแจกจ่าย plugin ให้คนอื่นในทีมหรือ community

### สร้าง Plugin ด้วย $plugin-creator

วิธีเร็วที่สุด:

```
$plugin-creator
```

Skill นี้จะช่วย scaffold ไฟล์ manifest `.codex-plugin/plugin.json` และสร้าง local marketplace สำหรับทดสอบ

### โครงสร้าง Plugin

```
my-plugin/
├── .codex-plugin/
│   └── plugin.json          # Required: manifest
├── skills/
│   └── my-skill/
│       └── SKILL.md         # Optional: skill instructions
├── .app.json                # Optional: app/connector config
├── .mcp.json                # Optional: MCP server config
└── assets/                  # Optional: icons, logos
```

### Plugin Manifest (.codex-plugin/plugin.json)

**Minimal:**
```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "description": "Reusable greeting workflow",
  "skills": "./skills/"
}
```

**Full:**
```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "description": "Bundle reusable skills and app integrations.",
  "author": {
    "name": "Your team",
    "email": "team@example.com"
  },
  "skills": "./skills/",
  "mcpServers": "./.mcp.json",
  "apps": "./.app.json",
  "interface": {
    "displayName": "My Plugin",
    "shortDescription": "Reusable skills and apps",
    "category": "Productivity",
    "brandColor": "#10A37F",
    "composerIcon": "./assets/icon.png"
  }
}
```

### Marketplace

Marketplace คือ JSON catalog ที่ Codex ใช้ค้นหาและติดตั้ง plugins

**Repo marketplace:** `$REPO_ROOT/.agents/plugins/marketplace.json`
**Personal marketplace:** `~/.agents/plugins/marketplace.json`

```json
{
  "name": "local-example-plugins",
  "interface": {
    "displayName": "Local Example Plugins"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": {
        "source": "local",
        "path": "./plugins/my-plugin"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

**Policy options:**
- `installation`: `"AVAILABLE"` / `"INSTALLED_BY_DEFAULT"` / `"NOT_AVAILABLE"`
- `authentication`: `"ON_INSTALL"` / `"ON_FIRST_USE"`

### ติดตั้ง Plugin ที่ Repo

```bash
# คัดลอก plugin ไปไว้ใน repo
cp -R /path/to/my-plugin ./plugins/my-plugin

# เพิ่มใน marketplace.json
# แล้ว restart Codex
```

### Codex ติดตั้ง Plugin ไว้ที่ไหน

```
~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/
```

สำหรับ local plugins ใช้ `$VERSION = "local"`

### ข้อควรระวัง

- ใช้ kebab-case สำหรับ `name` เพราะ Codex ใช้เป็น identifier
- `source.path` ต้องขึ้นต้นด้วย `./` และ relative กับ marketplace root
- การ publish ไปยัง Official Plugin Directory ยัง "coming soon"

### สรุปสั้นๆ

Build Plugins เหมาะสำหรับทีมที่ต้องการ standardize workflows, แชร์ skills ข้าม repositories หรือ bundle MCP configs พร้อม app integrations ในที่เดียว

---

## 12. Sites — สร้างและ Deploy เว็บไซต์

อ้างอิง: [Sites](https://developers.openai.com/codex/sites)

### หัวข้อนี้คืออะไร

Sites เป็น plugin ที่ให้ Codex สร้าง, บันทึก, deploy, และจัดการ websites, web apps, และ games ที่ host โดย OpenAI โดยตรงจาก Codex โดยไม่ต้องตั้งค่า deployment pipeline เอง

### ข้อจำกัดการเข้าถึง

Sites อยู่ใน preview และ:
- **ChatGPT Business:** ใช้ได้เลย (default)
- **ChatGPT Enterprise:** admin ต้องเปิดใน RBAC settings ก่อน

### วิธีเริ่มต้น

1. เปิด Sites plugin จาก Plugin Directory ถ้ายังไม่มี
2. เริ่ม thread ใหม่ แล้วพิมพ์ task เช่น:

```
@Sites Build a project request dashboard for my operations team.
Let team members submit requests, see who owns each one,
update the status, and filter the list.
```

3. ตรวจสอบ build → บอก Codex ให้ save version หรือ deploy

### Two-Stage Publishing

Sites แยก publish เป็น 2 ขั้น:

1. **Save a version** — build และเชื่อมกับ Git commit นั้น ใช้สำหรับ review
2. **Deploy a version** — publish version ที่เลือกไปเป็น production URL

**ทุก deployment URL คือ production** ดังนั้นควร review ให้ดีก่อน deploy

### รูปแบบ Site ที่รองรับ

| ความต้องการ | ขอให้ Sites สร้าง |
|---|---|
| Landing page หรือ content site | Site ไม่มี persistent state |
| บันทึกข้อมูล, user progress | D1 (relational database) |
| รูปภาพ, ไฟล์, video uploads | R2 (object storage) |
| ไฟล์ + searchable metadata | D1 + R2 รวมกัน |
| Site ที่ต้อง login ด้วย workspace account | Workspace-authenticated user identity |

### Access Control

| โหมด | ใครเข้าได้ |
|---|---|
| `admins_only` | เจ้าของ + workspace admins |
| `workspace_all` | ทุกคนใน workspace |
| `custom` | เลือก users/groups เฉพาะ |

ตัวอย่าง:
```
@Sites Change this deployed site's access to everyone in my workspace.
```

### ไฟล์ .openai/hosting.json

Codex เก็บ linkage ของ project ไว้ที่ `.openai/hosting.json`:

```json
{
  "project_id": "<project-id>",
  "d1": "DB",
  "r2": null
}
```

### Runtime Secrets

เพิ่ม environment variables / secrets ผ่าน **Sites panel** ใน app sidebar (ห้ามเก็บลง git)

### Checklist ก่อน Deploy

- ตรวจสอบ source changes ใน Review Pane
- ยืนยัน build สำเร็จ
- ตั้ง access control ถูกต้อง
- ตรวจสอบว่าไม่ commit secrets ไว้ใน source files

### สรุปสั้นๆ

Sites ช่วยให้ deploy web project ได้เร็วขึ้นมากโดยไม่ต้องตั้งค่า CI/CD เอง เหมาะสำหรับ internal tools, dashboards, และ prototypes ที่ต้องการ URL ทันที

---

## 13. Skills — ทักษะ Agent

อ้างอิง: [Agent Skills](https://developers.openai.com/codex/skills)

### หัวข้อนี้คืออะไร

Skills คือ "ทักษะ" ที่สอน Codex วิธีทำงานเฉพาะด้าน เช่น วิธี run test suite ของ project นั้น, วิธีสร้าง PR ตาม convention ทีม, หรือวิธีใช้ toolchain เฉพาะ

Skills คือ **format สำหรับเขียน workflow** ส่วน Plugins คือ **unit สำหรับ distribute** skills เหล่านั้น

### Progressive Disclosure

Codex จัดการ context ผ่าน progressive disclosure:
- **เริ่มต้น:** Codex รู้แค่ชื่อ, description, และ path ของ skills ที่มีอยู่
- **เมื่อเลือกใช้:** Codex โหลด `SKILL.md` เต็มๆ ของ skill นั้น

Budget เริ่มต้น: ~2% ของ context window (หรือ 8,000 chars เมื่อไม่รู้ขนาด) สำหรับแสดงรายชื่อ skills

### โครงสร้าง Skill

```
my-skill/
├── SKILL.md           # Required: instructions + metadata
├── scripts/           # Optional: executable code
├── references/        # Optional: documentation
├── assets/            # Optional: templates, resources
└── agents/
    └── openai.yaml    # Optional: UI metadata + policy
```

### SKILL.md

```markdown
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---

Skill instructions for Codex to follow.
```

### วิธีที่ Codex เรียกใช้ Skill

1. **Explicit** — พิมพ์ชื่อ skill โดยตรง: `$skill-name` หรือ `/skills` เพื่อเลือก
2. **Implicit** — Codex เลือก skill เองจาก description ที่ตรงกับ task

### ตำแหน่งบันทึก Skills

| Scope | ตำแหน่ง | เหมาะสำหรับ |
|---|---|---|
| `REPO` (CWD) | `$CWD/.agents/skills` | Skills เฉพาะ working directory |
| `REPO` (root) | `$REPO_ROOT/.agents/skills` | Skills สำหรับทุกคนใน repo |
| `USER` | `$HOME/.agents/skills` | Skills ส่วนตัวข้าม repos ทั้งหมด |
| `ADMIN` | `/etc/codex/skills` | Skills จาก admin สำหรับทุก user บนเครื่อง |
| `SYSTEM` | Built-in ใน Codex | Skills มาตรฐานจาก OpenAI |

### สร้าง Skill

**วิธีเร็วที่สุด:**
```
$skill-creator
```

**วิธี manual:**
```bash
mkdir -p ~/.agents/skills/my-skill
cat > ~/.agents/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: ใช้สำหรับ...อธิบาย trigger ที่ชัดเจน
---

ขั้นตอนที่ Codex ต้องทำ...
EOF
```

### ติดตั้ง Curated Skills

```bash
$skill-installer linear    # ติดตั้ง Linear skill
```

Skill ติดตั้งจะแสดงใน Codex อัตโนมัติ ถ้าไม่ขึ้น restart Codex

### ปิด Skill โดยไม่ลบ

```toml
# ~/.codex/config.toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

### Optional Metadata (agents/openai.yaml)

```yaml
interface:
  display_name: "Optional user-facing name"
  short_description: "Optional description"
  icon_small: "./assets/small-logo.svg"
  brand_color: "#3B82F6"
  default_prompt: "Optional surrounding prompt"

policy:
  allow_implicit_invocation: false  # ปิด implicit matching

dependencies:
  tools:
    - type: "mcp"
      value: "openaiDeveloperDocs"
      description: "OpenAI Docs MCP server"
      transport: "streamable_http"
      url: "https://developers.openai.com/mcp"
```

`allow_implicit_invocation: false` หมาย Codex จะไม่เรียก skill นี้โดยอัตโนมัติ ต้องพิมพ์ `$skill-name` เท่านั้น

### Best Practices

- ให้ skill ทำงานเดียวดีๆ อย่าพยายามทำหลายอย่างใน skill เดียว
- เขียน description ชัดเจนว่า "เมื่อไหร่ควรใช้" และ "เมื่อไหร่ไม่ควรใช้"
- ใช้ instructions แทน scripts ยกเว้นต้องการ deterministic behavior
- เขียนเป็น imperative steps พร้อม inputs/outputs ชัดเจน

### สรุปสั้นๆ

Skills คือวิธีที่ดีที่สุดในการสอน Codex ให้ทำงานตาม convention ของ project หรือทีม เริ่มจาก `$skill-creator` เพื่อ scaffold ได้เลย

---

## 14. Subagents — Agent ย่อย

อ้างอิง: [Subagents](https://developers.openai.com/codex/subagents)

### หัวข้อนี้คืออะไร

Subagents คือ agent ย่อยที่ Codex สามารถ spawn ขึ้นมาทำงานแบบ parallel เพื่อแก้ปัญหาที่ต้องการ multi-agent coordination หรืองานที่แบ่งเป็นส่วนๆ ได้

### รายละเอียดสำคัญ

Subagents configuration มีเนื้อหาครอบคลุมการตั้งค่า custom agents, กำหนด model, permissions, และ workflow ของ subagent ในหน้า config ซึ่งมีขนาดใหญ่ ขอแนะนำอ่านเพิ่มเติมที่ [Official Docs — Subagents](https://developers.openai.com/codex/subagents)

ข้อมูลเบื้องต้นเกี่ยวกับ Subagents concept อยู่ใน [01-overview-concepts.md](./01-overview-concepts.md) หมวด Concepts

---

## หัวข้อที่ยังไม่ได้เรียบเรียงครบถ้วน

| หัวข้อ | เหตุผล | ลิงก์ |
|---|---|---|
| Config Reference (full) | หน้าขนาดใหญ่ เป็น reference table ควรดูจาก Official Docs โดยตรง | [Config Reference](https://developers.openai.com/codex/config-reference) |
| Environment Variables (full) | ข้อมูลที่อาจเปลี่ยนแปลงบ่อย ควรตรวจสอบจาก Official Docs | [Environment Variables](https://developers.openai.com/codex/environment-variables) |
| Sample Config (full) | Template สำเร็จรูป ดีที่สุดเมื่อเปิดจาก Official Docs โดยตรง | [Sample Config](https://developers.openai.com/codex/config-sample) |
| Permissions (full) | หน้าขนาดใหญ่ (61KB) ครอบคลุม filesystem/network rules ละเอียด | [Permissions](https://developers.openai.com/codex/permissions) |
| Advanced Config (full) | หน้าขนาดใหญ่ (53KB) มี profiles, shell policy details เพิ่มเติม | [Advanced Config](https://developers.openai.com/codex/config-advanced) |
| Subagents config (full) | หน้าขนาดใหญ่ ครอบคลุม custom agent definitions | [Subagents](https://developers.openai.com/codex/subagents) |
