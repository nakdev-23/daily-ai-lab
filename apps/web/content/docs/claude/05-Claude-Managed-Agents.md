---
title: "Claude Managed Agents"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Claude Managed Agents ให้ 'harness' (โครงสร้างสำเร็จรูปที่ครอบ Claude) และระบบโครงสร้างพื้นฐานสำหรับรัน Claude เป็น agent อัตโนมัต"
readTime: "4 นาที"
readers: "0"
locked: false
order: 5
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 5: Claude Managed Agents

> เรียบเรียงจาก [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview) — โครงสร้าง agent (AI ที่ทำงานหลายขั้นตอนอัตโนมัติ) สำเร็จรูปที่ Anthropic จัดการระบบโครงสร้างพื้นฐานให้ เหมาะกับงานที่รันนานและงานที่ทำเบื้องหลัง

---

## 📖 คำศัพท์สำคัญสำหรับ Managed Agents

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **Agent** | AI ที่ทำงานอัตโนมัติหลายขั้นตอนต่อเนื่อง โดยไม่ต้องสั่งทีละขั้น |
| **Managed** | มี Anthropic ดูแลระบบให้ คุณไม่ต้องสร้างหรือจัดการ server เอง |
| **Infrastructure** | ระบบโครงสร้างพื้นฐานที่รองรับการทำงาน เช่น server, database |
| **Harness** | โครงสร้างสำเร็จรูปที่รองรับการทำงานของ agent — เหมือน "กรอบ" ที่ครอบ Claude |
| **Sandbox** | พื้นที่ทำงานแยกต่างหาก ปลอดภัย ไม่กระทบระบบอื่น |
| **Stateful** | มีสถานะ — จำไฟล์ ประวัติ และสถานะการทำงานได้ข้ามคำขอ (ต่างจาก stateless ที่ลืมทุกครั้ง) |
| **Asynchronous** | ทำงานเบื้องหลัง ไม่รอผลทันที — ส่งงานไปแล้วไปทำอย่างอื่นรอ |
| **SSE** (Server-Sent Events) | เทคนิคส่งข้อมูลจากเซิร์ฟเวอร์มาหาแอปแบบต่อเนื่อง เพื่อรับผลลัพธ์ทีละชิ้น |
| **Self-hosted** | รันบน server ของตัวเอง แทนที่จะใช้บริการบนคลาวด์ |
| **ZDR** (Zero Data Retention) | ไม่เก็บข้อมูลหลังประมวลผลเสร็จ เหมาะกับข้อมูลที่ต้องการความเป็นส่วนตัวสูง |
| **HIPAA BAA** | สัญญาความร่วมมือตามกฎหมายสุขภาพของสหรัฐฯ สำหรับข้อมูลทางการแพทย์ |
| **Compliance** | การปฏิบัติตามมาตรฐานหรือกฎหมายที่กำหนด |
| **Data residency** | ข้อกำหนดว่าข้อมูลต้องเก็บในประเทศหรือภูมิภาคใด |
| **Vault** | ที่เก็บข้อมูลรับรอง เช่น รหัสผ่าน หรือ API key อย่างปลอดภัย |

---

## 1. ภาพรวม Managed Agents
อ้างอิง: [Overview](https://platform.claude.com/docs/en/managed-agents/overview)

### หัวข้อนี้คืออะไร
Claude Managed Agents ให้ **"harness"** (โครงสร้างสำเร็จรูปที่ครอบ Claude) และระบบโครงสร้างพื้นฐานสำหรับรัน Claude เป็น agent อัตโนมัติ แทนที่คุณจะต้องสร้าง agent loop (วงจรทำงาน), การรันเครื่องมือ และ runtime (สภาพแวดล้อมรัน) เอง — Anthropic จัดการให้หมด โดย Claude อ่านไฟล์ รันคำสั่ง ค้นเว็บ และรันโค้ดได้อย่างปลอดภัยใน **sandbox** (พื้นที่แยกต่างหาก) นอกจากนี้ยังมี prompt caching (แคชข้อมูลซ้ำ), compaction (บีบอัดบริบท) และการปรับแต่งประสิทธิภาพในตัวให้อัตโนมัติ

### เปรียบเทียบกับ Messages API
| | Messages API | Managed Agents |
|---|---|---|
| คืออะไร | เข้าถึงโมเดลโดยตรง | harness/agent สำเร็จรูปบน infrastructure ที่จัดการให้ |
| เหมาะกับ | agent loop ที่ควบคุมเอง ละเอียด | งานยาว ทำงาน asynchronous |

### ใช้ทำอะไร (เหมาะกับงานแบบไหน)
- งานที่รันนานหลายนาที/ชั่วโมง มี tool call หลายครั้ง
- ต้องการแซนด์บ็อกซ์คลาวด์ที่ติดตั้งแพ็กเกจไว้แล้วและเข้าเน็ตได้
- ต้องการรันบน infrastructure ตัวเอง (self-hosted) เพื่อ compliance/data residency
- ไม่อยากสร้าง agent loop/sandbox/tool execution เอง
- ต้องการ session แบบ stateful (ไฟล์ระบบและประวัติสนทนาอยู่ต่อเนื่อง)

### สรุปสั้น ๆ
Managed Agents = agent อัตโนมัติแบบ managed พร้อม sandbox + state เหมาะงานยาว/หลายขั้นตอน ไม่ต้องสร้าง loop เอง

---

## 2. แนวคิดหลัก 4 อย่าง (Core concepts)
อ้างอิง: [Overview](https://platform.claude.com/docs/en/managed-agents/overview)

| แนวคิด | คำอธิบาย |
|---|---|
| **Agent (เอเจนต์)** | การตั้งค่า Claude สำหรับงานนี้ — กำหนดโมเดล, system prompt (คำสั่งพฤติกรรม), เครื่องมือ, MCP servers, และ skills |
| **Environment (สภาพแวดล้อม)** | ที่รัน session — เป็น sandbox คลาวด์ของ Anthropic หรือ **self-hosted** (รันบน server ของคุณเอง) เพื่อ compliance |
| **Session (เซสชัน)** | การทำงานหนึ่งครั้ง — เป็น instance (ตัวอย่างที่กำลังทำงาน) ของ agent ใน environment สร้าง output และมีสถานะของตัวเอง |
| **Events (เหตุการณ์)** | ข้อความที่แลกเปลี่ยนระหว่างแอปและ agent เช่น คำถามจากผู้ใช้, ผลจากเครื่องมือ, สถานะ |

### สรุปสั้น ๆ
จำ 4 คำ: Agent (นิยาม), Environment (ที่รัน), Session (instance ทำงาน), Events (ข้อความสื่อสาร)

---

## 3. ขั้นตอนการทำงาน (How it works)
อ้างอิง: [Overview](https://platform.claude.com/docs/en/managed-agents/overview) · [Quickstart](https://platform.claude.com/docs/en/managed-agents/quickstart)

### วิธีใช้งาน (Step-by-step)
1. **สร้าง Agent** — นิยามโมเดล, system prompt, tools, MCP servers, skills แล้วอ้างด้วย ID ข้าม session ได้
2. **สร้าง Environment** — เลือกว่ารันที่แซนด์บ็อกซ์คลาวด์ หรือ [self-hosted sandbox](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)
3. **เริ่ม Session** — เปิด session ที่อ้าง agent + environment
4. **ส่ง Events และสตรีมผล** — ส่งข้อความผู้ใช้เป็น event; Claude รันเครื่องมืออัตโนมัติและสตรีม (ส่งทีละชิ้น) ผลกลับผ่าน **SSE (Server-Sent Events)** — เทคนิคส่งข้อมูลจากเซิร์ฟเวอร์แบบต่อเนื่อง; ประวัติ event ถูกเก็บฝั่งเซิร์ฟเวอร์และดึงได้ครบ
5. **ชี้นำหรือขัดจังหวะ** — ส่ง event เพิ่มเพื่อปรับทิศกลางคัน หรือ interrupt เพื่อเปลี่ยนทิศ

### Endpoint ที่เกี่ยวข้อง
- Agents: `POST /v1/agents`, `GET /v1/agents`
- Sessions: `POST /v1/sessions`, `GET /v1/sessions/{id}/stream`
- Environments: `POST /v1/environments`, `GET /v1/environments`

### สรุปสั้น ๆ
สร้าง Agent → สร้าง Environment → เริ่ม Session → ส่ง events/สตรีมผล → ชี้นำหรือ interrupt ได้

---

## 4. เครื่องมือที่รองรับ (Supported tools)
อ้างอิง: [Tools](https://platform.claude.com/docs/en/managed-agents/tools)

### รายละเอียดสำคัญจากเอกสารทางการ
Managed Agents ให้ Claude ใช้เครื่องมือในตัว:
- **Bash** — รันคำสั่งเชลล์ในแซนด์บ็อกซ์
- **File operations** — read, write, edit, glob, grep ไฟล์ในแซนด์บ็อกซ์
- **Web search & fetch** — ค้นเว็บและดึงเนื้อหาจาก URL
- **MCP servers** — เชื่อมผู้ให้บริการ tool ภายนอก

นอกจากนี้ยังมี [permission policies](https://platform.claude.com/docs/en/managed-agents/permission-policies), [Agent Skills](https://platform.claude.com/docs/en/managed-agents/skills) และ [vaults](https://platform.claude.com/docs/en/managed-agents/vaults) สำหรับเก็บข้อมูลรับรอง

### สรุปสั้น ๆ
มี Bash, การจัดการไฟล์, web search/fetch และ MCP ในตัว พร้อมระบบสิทธิ์และ vault

---

## 5. การเข้าถึงแบบ Beta และนโยบายข้อมูล
อ้างอิง: [Overview](https://platform.claude.com/docs/en/managed-agents/overview) · [Reference](https://platform.claude.com/docs/en/managed-agents/reference)

### รายละเอียดสำคัญจากเอกสารทางการ
- ปัจจุบันเป็น **beta** ทุก endpoint ต้องใส่ header `managed-agents-2026-04-01` (SDK ใส่ให้อัตโนมัติ)
- ต้องมี: API key + beta header + การเข้าถึง Managed Agents (เปิดให้ทุกบัญชี API โดยค่าเริ่มต้น)
- ภายใน beta: [MCP tunnels](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview) และ dreaming เป็น research preview จำกัด ต้อง [ขอเข้าถึง](https://claude.com/form/claude-managed-agents)

### ข้อควรระวัง (นโยบายข้อมูล)
- Managed Agents เป็น **stateful** (มีสถานะ) โดยออกแบบ: session อยู่ต่อเนื่อง resume (เปิดต่อ) ได้ เก็บประวัติ/สถานะ sandbox/output ฝั่งเซิร์ฟเวอร์
- ด้วยเหตุนี้ **ยังไม่เข้าเกณฑ์ Zero Data Retention (ZDR)** (ไม่เก็บข้อมูลหลังประมวลผล) **และ HIPAA BAA** (สัญญาสำหรับข้อมูลทางการแพทย์)
- คุณควบคุมข้อมูลได้: ลบ session และลบไฟล์ที่อัปโหลดได้ผ่าน API ตลอดเวลา

### สรุปสั้น ๆ
ยังเป็น beta (ต้องใส่ beta header), เป็น stateful จึงยังไม่รองรับ ZDR/HIPAA แต่ลบ session/ไฟล์เองได้

---

## 6. การจัดการ session ขั้นสูง
อ้างอิง: [Session operations](https://platform.claude.com/docs/en/managed-agents/session-operations) · [Events and streaming](https://platform.claude.com/docs/en/managed-agents/events-and-streaming) · [Multi-agent](https://platform.claude.com/docs/en/managed-agents/multi-agent)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Session operations** — สร้าง ดู หยุดชั่วคราว resume และลบ session
- **Event stream** — รับเหตุการณ์แบบเรียลไทม์ผ่าน SSE; subscribe [webhooks](https://platform.claude.com/docs/en/managed-agents/webhooks) เพื่อรับแจ้งเตือน
- **Define outcomes** — กำหนดผลลัพธ์/เงื่อนไขความสำเร็จที่คาดหวัง
- **Files** — แนบและดาวน์โหลดไฟล์เข้า/ออก session
- **GitHub access** — ให้ agent เข้าถึง GitHub repo
- **Multiagent sessions** — orchestrate หลาย agent ทำงานร่วมกัน

### สรุปสั้น ๆ
จัดการ session (resume/ลบ), รับ event ผ่าน SSE/webhooks, กำหนด outcomes, แนบไฟล์, ต่อ GitHub และทำ multi-agent ได้

---

## หัวข้ออ้างอิงเพิ่มเติม
- Quickstart: https://platform.claude.com/docs/en/managed-agents/quickstart
- Agent setup: https://platform.claude.com/docs/en/managed-agents/agent-setup
- Cloud environment setup: https://platform.claude.com/docs/en/managed-agents/environments
- Reference (event types, rate limits): https://platform.claude.com/docs/en/managed-agents/reference
