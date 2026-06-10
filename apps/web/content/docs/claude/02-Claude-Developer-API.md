---
title: "Developer Docs / API"
tool: "Claude"
icon: "tool-claude"
level: "beginner"
summary: "อ้างอิง: Intro to Claude"
readTime: "9 นาที"
readers: "0"
locked: false
order: 2
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 2: Developer Docs / API

> เรียบเรียงจาก [platform.claude.com/docs](https://platform.claude.com/docs) สำหรับนักพัฒนาที่ต้องการนำ Claude ไปใช้ในแอปของตัวเองผ่าน API

---

## 📖 คำศัพท์สำคัญสำหรับนักพัฒนา

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **API** (Application Programming Interface) | ช่องทางสำเร็จรูปที่ให้โปรแกรมของคุณ "คุย" กับ Claude ได้ โดยส่งข้อมูลผ่านอินเทอร์เน็ต |
| **Endpoint** | URL (ที่อยู่เว็บ) สำหรับรับ-ส่งข้อมูลกับ API เช่น `POST /v1/messages` คือ URL ที่ใช้ส่งข้อความ |
| **SDK** (Software Development Kit) | ชุดเครื่องมือและโค้ดสำเร็จรูปที่ทำให้เรียกใช้ API ง่ายขึ้น เช่น ไม่ต้องเขียน HTTP request เอง |
| **API Key** | รหัสลับส่วนตัวที่ใช้ยืนยันว่าคุณมีสิทธิ์ใช้ API เหมือน "บัตรผ่าน" ที่ต้องส่งไปทุกครั้ง |
| **Token** | หน่วยที่ AI ใช้วัดขนาดข้อความ ประมาณ 1 token ≈ 0.75 คำภาษาอังกฤษ หรือ ≈ 1-3 ตัวอักษรไทย |
| **Max tokens** | จำนวน token สูงสุดที่อนุญาตให้ Claude ตอบกลับ ถ้าคำตอบยาวเกินจะถูกตัด |
| **Context window** | "ขนาดหน่วยความจำ" ของโมเดล คือจำนวน token สูงสุดที่ส่งได้ในคำขอเดียว รวมทั้งคำถามและประวัติสนทนา |
| **Stateless** | ไม่มีความจำ — API ไม่จำบทสนทนาเก่าเลย ต้องส่งประวัติทั้งหมดกลับไปทุกครั้งที่ส่งคำขอ |
| **Prompt** | ข้อความหรือคำสั่งที่ส่งให้ AI ประมวลผล |
| **System prompt** | คำสั่งเบื้องต้นที่กำหนดบทบาทหรือพฤติกรรมโดยรวมของ Claude เช่น "คุณเป็นผู้ช่วยลูกค้าของบริษัท X" |
| **Prompt caching** | การบันทึก (แคช) ส่วนของ prompt ที่ส่งซ้ำบ่อย ๆ เพื่อลดต้นทุนและเพิ่มความเร็ว |
| **Streaming** | รับคำตอบทีละชิ้นแบบเรียลไทม์ เหมือนดูพิมพ์ทีละตัวอักษร แทนที่จะรอจนคำตอบครบ |
| **Agentic loop** | วงจรที่ AI ทำงานซ้ำหลายรอบ: ถามคำถาม → เรียกใช้เครื่องมือ → ดูผล → ทำต่อ → จนเสร็จ |
| **Tool use** | การให้ Claude "เรียกใช้" ฟังก์ชันหรือเครื่องมือของแอปคุณ เช่น ค้นเว็บ คำนวณ ดึงข้อมูล |
| **Batch processing** | การส่งคำขอจำนวนมากพร้อมกันแบบไม่รอผลทันที (asynchronous) เหมาะกับงานปริมาณมาก |
| **Asynchronous** | ทำงานเบื้องหลัง ไม่รอให้เสร็จก่อนทำต่อ เหมือนสั่งอาหาร แล้วไปทำงานอื่นรอ |
| **Rate limit** | ขีดจำกัดจำนวนคำขอที่ส่งได้ต่อช่วงเวลา ป้องกันการใช้งานเกินพิกัด |
| **Latency** | ความหน่วง — เวลาที่ใช้รอตั้งแต่ส่งคำขอจนได้รับคำตอบ ยิ่งน้อยยิ่งเร็ว |
| **Guardrails** | กฎหรือตัวกรองที่ควบคุมพฤติกรรม AI ไม่ให้ตอบสิ่งที่ไม่ต้องการ |
| **Evals** (Evaluations) | การทดสอบคุณภาพของ prompt หรือโมเดลก่อนนำไปใช้จริง |
| **Environment variable** | ตัวแปรที่เก็บค่าสำคัญ เช่น API key ไว้ในระบบ แทนที่จะเขียนตรงๆ ในโค้ด เพื่อความปลอดภัย |

---

## 1. ภาพรวมการพัฒนาด้วย Claude
อ้างอิง: [Intro to Claude](https://platform.claude.com/docs/en/intro)

### หัวข้อนี้คืออะไร
Anthropic ให้สองวิธีหลักในการสร้างงานกับ Claude:
- **Messages API** — เข้าถึงโมเดลโดยตรง คุณสร้างทุก "รอบสนทนา" เอง จัดการสถานะบทสนทนาและวงจรการเรียกเครื่องมือเอง เหมาะกับงานที่ต้องการควบคุมละเอียด
- **Claude Managed Agents** — โครงสร้าง agent (AI ที่ทำงานหลายขั้นตอนอัตโนมัติ) สำเร็จรูปที่ Anthropic จัดการ infrastructure (ระบบโครงสร้างพื้นฐาน) ให้ เหมาะกับงานยาว ๆ และงานที่รันเบื้องหลัง

### เครื่องมือสำหรับนักพัฒนา
- **Developer Console** ([platform.claude.com](https://platform.claude.com/)) — ทดลองและทดสอบ prompt ใน Workbench, สร้าง prompt อัตโนมัติ, จัดการ API key
- **API Reference** — เอกสาร endpoint และ client SDK ครบถ้วน
- **Cookbook / Quickstarts** — โน้ตบุ๊กและแอปตัวอย่างพร้อมใช้

### สรุปสั้น ๆ
เลือก Messages API ถ้าต้องการควบคุมเอง หรือ Managed Agents ถ้าต้องการ agent สำเร็จรูปแบบ managed

---

## 2. Quickstart — เรียก API ครั้งแรก
อ้างอิง: [Quickstart](https://platform.claude.com/docs/en/get-started)

### วิธีใช้งาน (Step-by-step)
1. สมัครและสร้าง **API key** (รหัสลับสำหรับใช้งาน API) ที่ [platform.claude.com/settings/keys](https://platform.claude.com/settings/keys)
2. ตั้งค่า **environment variable** (ตัวแปรสภาพแวดล้อม — วิธีเก็บค่าลับไว้ในระบบโดยไม่ต้องเขียนในโค้ด): `ANTHROPIC_API_KEY`
3. ติดตั้ง **SDK** (ชุดเครื่องมือสำเร็จรูปสำหรับเรียกใช้ API ง่ายขึ้น) บน Python: `pip install anthropic`
4. ส่งข้อความแรก

### ตัวอย่าง (Python)
```python
import anthropic

client = anthropic.Anthropic()  # อ่านคีย์จาก ANTHROPIC_API_KEY

message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "สวัสดี Claude ช่วยแนะนำตัวหน่อย"}
    ],
)
print(message.content[0].text)
```

มี SDK อย่างเป็นทางการสำหรับ Python, TypeScript, Go, Java, Ruby, PHP, C# และเรียกผ่าน cURL/CLI ได้

### ข้อควรระวัง
- เก็บ API key เป็นความลับ อย่า commit ลง repo
- `max_tokens` คือเพดานจำนวน token (หน่วยวัดข้อความ) ของคำตอบ ต้องกำหนดเสมอ ถ้าคำตอบยาวเกินค่านี้จะถูกตัดกลางคัน

### สรุปสั้น ๆ
สร้างคีย์ → ตั้ง env → ติดตั้ง SDK → เรียก `messages.create` พร้อม model, max_tokens, messages

---

## 3. Messages API (โครงสร้างหลัก)
อ้างอิง: [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)

### หัวข้อนี้คืออะไร
Messages API คือ endpoint หลักในการคุยกับ Claude โดยส่งรายการข้อความ (messages) แบบสลับบทบาท `user` และ `assistant` แล้วรับคำตอบกลับ

### รายละเอียดสำคัญจากเอกสารทางการ
- **โครงสร้างคำขอ:** `model`, `max_tokens`, `messages` (จำเป็น) และ `system`, `temperature`, `tools`, `stream` ฯลฯ (ทางเลือก)
- **บทสนทนาหลายรอบ:** API ไม่มีความจำ (**stateless** — ไม่จำสิ่งที่คุยกันไปก่อนหน้า) ดังนั้นต้องส่งประวัติบทสนทนาทั้งหมดกลับไปทุกครั้ง ต่อบทสนทนาด้วยการต่อรายการ messages
- **System prompt:** ใส่ในพารามิเตอร์ `system` เพื่อกำหนดบทบาท/พฤติกรรมโดยรวม
- **เนื้อหา (content):** เป็นข้อความ หรือ array ของ block (ข้อความ, รูปภาพ, ไฟล์, tool_use, tool_result)

### ตัวอย่าง (บทสนทนาหลาย turn + system)
```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="คุณเป็นติวเตอร์คณิตศาสตร์ ตอบเป็นภาษาไทยแบบเข้าใจง่าย",
    messages=[
        {"role": "user", "content": "อธิบายทฤษฎีบทพีทาโกรัส"},
        {"role": "assistant", "content": "ทฤษฎีบทพีทาโกรัสกล่าวว่า..."},
        {"role": "user", "content": "ยกตัวอย่างหน่อย"},
    ],
)
```

### สรุปสั้น ๆ
ส่ง array ของ messages (user/assistant) + system; API ไม่จำสถานะ ต้องส่งประวัติเองทุกครั้ง

---

## 4. Handling stop reasons (เหตุผลที่ Claude หยุด)
อ้างอิง: [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

### รายละเอียดสำคัญจากเอกสารทางการ
คำตอบจะมีฟิลด์ `stop_reason` บอกว่าทำไมโมเดลหยุดสร้างผลลัพธ์ ค่าที่พบบ่อย:
- `end_turn` — ตอบจบตามปกติ โปรแกรมทำงานต่อได้เลย
- `max_tokens` — คำตอบชนเพดาน token ที่ตั้งไว้ คำตอบอาจถูกตัดกลางคัน ควรเพิ่มค่า max_tokens หรือสั่งให้ทำต่อ
- `stop_sequence` — เจอคำ/วลีที่กำหนดให้หยุด (เช่น กำหนดว่าพอเจอคำว่า "END" ให้หยุด)
- `tool_use` — Claude ต้องการเรียกใช้เครื่องมือ โปรแกรมต้องรันเครื่องมือนั้น แล้วส่งผลกลับให้ Claude ทำต่อ
- `pause_turn` / `refusal` — กรณีพิเศษ เช่น หยุดชั่วคราว หรือ Claude ปฏิเสธที่จะตอบ

### ข้อควรระวัง
ควรเขียนโค้ดจัดการทุกค่า `stop_reason` โดยเฉพาะ `tool_use` และ `max_tokens` เพื่อให้ loop ทำงานถูกต้อง

### สรุปสั้น ๆ
ตรวจ `stop_reason` ทุกครั้ง: `tool_use` ต้องรันเครื่องมือต่อ, `max_tokens` คือคำตอบถูกตัด

---

## 5. โมเดลและการเลือกใช้ (Models)
อ้างอิง: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

### รายละเอียดสำคัญจากเอกสารทางการ
ตระกูลรุ่นล่าสุด:

| คุณสมบัติ | Opus 4.8 | Sonnet 4.6 | Haiku 4.5 |
|---|---|---|---|
| จุดเด่น | เก่งสุด เหตุผลซับซ้อน + coding | สมดุลเร็ว/ฉลาด | เร็วสุด |
| API ID | `claude-opus-4-8` | `claude-sonnet-4-6` | `claude-haiku-4-5-20251001` |
| ราคา (input/output ต่อ 1M tokens) | $5 / $25 | $3 / $15 | $1 / $5 |
| Context window | 1M tokens | 1M tokens | 200k tokens |
| Max output | 128k tokens | 64k tokens | 64k tokens |
| Extended thinking | ไม่ | ใช่ | ใช่ |
| Adaptive thinking | ใช่ | ใช่ | ไม่ |

- ทุกรุ่นรองรับ input ข้อความ+รูปภาพ, output ข้อความ, หลายภาษา และ vision
- ใช้ได้ผ่าน Claude API, AWS Bedrock, Vertex AI และ Microsoft Foundry
- บน Opus 4.8 พารามิเตอร์ `effort` ค่าเริ่มต้นเป็น `high` ทุกแพลตฟอร์ม

### Model IDs และเวอร์ชัน
อ้างอิง: [Model IDs and versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions)
- ทุก model ID เป็น snapshot ที่ตรึงไว้ (pinned) ตั้งแต่รุ่น 4.6 เป็นต้นไปใช้รูปแบบไม่มีวันที่แต่ก็ยังเป็น snapshot ตรึง ไม่ใช่ตัวชี้แบบ evergreen
- คิวรีความสามารถและเพดาน token ของโมเดลได้ผ่าน [Models API](https://platform.claude.com/docs/en/api/models/list)

### ข้อควรระวัง
- เริ่มจาก Opus 4.8 สำหรับงานยากสุด แต่ใช้ Sonnet/Haiku เพื่อประหยัดต้นทุนในงานทั่วไป
- ตรวจตาราง deprecations ก่อนตรึงรุ่นเก่าระยะยาว

### สรุปสั้น ๆ
Opus = เก่งสุด, Sonnet = สมดุล, Haiku = เร็ว/ถูก; เลือกตามความยากและงบประมาณ

---

## 6. Tool use (การเรียกใช้เครื่องมือ)
อ้างอิง: [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

### หัวข้อนี้คืออะไร
Tool use ให้ Claude เรียกฟังก์ชันที่คุณนิยาม หรือเครื่องมือที่ Anthropic ให้มา Claude ตัดสินใจเองว่าจะเรียกเครื่องมือเมื่อไหร่จากคำอธิบายของ tool แล้วคืนการเรียกแบบมีโครงสร้างให้แอปไปรัน

### รายละเอียดสำคัญจากเอกสารทางการ
แบ่งตามที่โค้ดทำงาน:
- **Client tools (เครื่องมือฝั่งคุณ)** — รันในแอปของคุณเอง คุณเขียนฟังก์ชันไว้ แล้ว Claude จะขอเรียกเมื่อต้องการ Claude ส่ง `stop_reason: "tool_use"` มาพร้อมรายละเอียด คุณรันฟังก์ชัน แล้วส่งผลกลับเป็น `tool_result`
- **Server tools (เครื่องมือฝั่ง Anthropic)** — รันบนเซิร์ฟเวอร์ของ Anthropic เช่น ค้นเว็บ ดึงหน้าเว็บ รันโค้ด Python คุณได้ผลลัพธ์โดยไม่ต้องเขียนโค้ดเครื่องมือเอง

**Agentic loop (วงจรการทำงานซ้ำ):** ส่งคำขอ → Claude อาจขอเรียกเครื่องมือ → แอปรันเครื่องมือ → ส่งผลกลับ → Claude ใช้ผลทำต่อ → วนซ้ำจนตอบจบ (`end_turn`)

> **เปรียบเหมือน:** Claude เป็นเหมือนพนักงานที่ทำงานให้คุณ เมื่อต้องการข้อมูลก็จะ "ขอ" ให้คุณไปหาข้อมูลมาให้ (client tool) หรือบางอย่างเขาหาได้เองเลย (server tool)

**ควบคุมการเรียกเครื่องมือ:** `tool_choice` ค่าเริ่มต้นเป็น `{"type": "auto"}` (Claude ตัดสินใจเองว่าจะเรียกหรือไม่) ปรับเป็น `any`/`tool` เพื่อบังคับให้เรียกเสมอ และเพิ่ม `strict: true` เพื่อรับประกันว่าข้อมูลที่ส่งมาตรงรูปแบบที่กำหนดไว้ (schema)

### ตัวอย่าง (server tool: web search)
```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user", "content": "ข่าวล่าสุดเรื่อง Mars rover มีอะไรบ้าง"}],
)
```

### ตัวอย่าง (client tool: นิยามเอง)
```python
tools = [{
    "name": "get_weather",
    "description": "ดึงสภาพอากาศปัจจุบันของเมืองที่ระบุ",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string", "description": "ชื่อเมือง"}},
        "required": ["city"],
    },
}]
# เมื่อ stop_reason == "tool_use" ให้รันฟังก์ชันจริง แล้วส่ง tool_result กลับ
```

### ข้อควรระวัง
- การให้ tools เพิ่ม token ของ system prompt (เช่น Opus 4.8 ใช้เพิ่ม ~290–410 tokens)
- Server tools อาจมีค่าใช้จ่ายเพิ่มตามการใช้งาน (เช่น web search คิดต่อครั้งค้นหา)

### สรุปสั้น ๆ
Client tools รันที่แอปคุณ (ต้องส่ง tool_result กลับ), Server tools รันฝั่ง Anthropic; วน agentic loop จนได้คำตอบ

---

## 7. Server tools ที่สำคัญ
อ้างอิง: [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Web search** — ค้นเว็บแบบเรียลไทม์ คิดเงินต่อครั้งค้นหา ([web-search-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool))
- **Web fetch** — ดึงเนื้อหาจาก URL ที่ระบุ ([web-fetch-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool))
- **Code execution** — รันโค้ด Python ในแซนด์บ็อกซ์ เหมาะกับการคำนวณ/วิเคราะห์ข้อมูล ([code-execution-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool))
- **Memory tool** — ให้ Claude เก็บ/อ่านความจำข้ามคำขอผ่านไฟล์ ([memory-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool))
- **Bash / Computer use / Text editor** — เครื่องมือฝั่งคุณ (client tools) แต่ใช้รูปแบบ (schema) มาตรฐานที่ Anthropic กำหนด ใช้สำหรับสั่งบรรทัดคำสั่ง ควบคุมหน้าจอ และแก้ไขไฟล์

### สรุปสั้น ๆ
มีเครื่องมือสำเร็จ: ค้นเว็บ, ดึง URL, รันโค้ด, ความจำ, เชลล์, computer use, แก้ไฟล์

---

## 8. ความสามารถของโมเดล (Model capabilities)
อ้างอิง: [Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) · [Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Extended thinking (คิดแบบขยาย)** — ให้โมเดลใช้ "พื้นที่คิด" ก่อนตอบ เหมือนคนทำงานที่ต้องคิดทบทวนก่อนตอบ เพิ่มคุณภาพในงานที่ต้องการเหตุผลซับซ้อน (รองรับใน Sonnet/Haiku รุ่นล่าสุด)
- **Adaptive thinking / Effort (ปรับระดับความพยายาม)** — กำหนดว่าจะให้โมเดล "คิดมากแค่ไหน" เพื่อสมดุลระหว่างคุณภาพและต้นทุน
- **Structured outputs (ผลลัพธ์เป็นโครงสร้าง)** — บังคับให้คำตอบออกมาเป็นรูปแบบที่กำหนด เช่น JSON (รูปแบบข้อมูลที่โปรแกรมอ่านได้ง่าย) เพื่อนำไปใช้ต่อในแอปได้ทันที
- **Streaming (รับแบบสตรีม)** — รับคำตอบทีละส่วนแบบเรียลไทม์ผ่าน **Server-Sent Events (SSE)** (เทคนิคส่งข้อมูลจากเซิร์ฟเวอร์แบบต่อเนื่อง) แทนที่จะรอจนคำตอบครบ ทำให้ผู้ใช้เห็นคำตอบได้เร็วขึ้น
- **Batch processing (ประมวลผลเป็นชุด)** — ส่งคำขอจำนวนมากพร้อมกันแบบ **asynchronous** (ทำงานเบื้องหลัง ไม่รอผลทันที) ในราคาลดพิเศษ 50% เหมาะกับงานปริมาณมากที่ไม่รีบ
- **Citations (การอ้างอิง)** — ให้ Claude อ้างอิงแหล่งที่มาจากเอกสารที่ให้ไป ([Citations](https://platform.claude.com/docs/en/build-with-claude/citations))

### สรุปสั้น ๆ
ปรับการคิด (thinking/effort), บังคับรูปแบบ (structured outputs), สตรีมผลลัพธ์, และประมวลผลเป็นชุด (batch) เพื่อประหยัด

---

## 9. การจัดการบริบท (Context management)
อ้างอิง: [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) · [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Context window (หน้าต่างบริบท)** — จำนวน token สูงสุดที่ใส่ได้ในคำขอเดียว เปรียบเหมือน "ขนาดกระดาษ" ที่ Claude อ่านได้ต่อครั้ง (Opus 4.8/Sonnet 4.6 = 1 ล้าน tokens, Haiku 4.5 = 200,000 tokens)
- **Prompt caching (แคชส่วน prompt)** — บันทึกส่วน prompt ที่ส่งซ้ำบ่อย เช่น system prompt หรือเอกสารยาว เพื่อลดต้นทุนและความหน่วง (**latency**) ของคำขอถัดไป
- **Compaction / Context editing (บีบอัดบริบท)** — เมื่อบทสนทนายาวมาก ระบบจะสรุปหรือตัดประวัติเก่าออก เพื่อไม่ให้ล้นขนาด context window
- **Token counting (นับ token)** — นับจำนวน token ล่วงหน้าก่อนส่งจริง เพื่อวางแผนต้นทุนและตรวจว่าขนาดเกินหรือไม่

### ข้อควรระวัง
ยิ่ง context ยาว ยิ่งกินต้นทุน ใช้ prompt caching และ compaction ช่วยเมื่อทำงานยาว/ซ้ำ

### สรุปสั้น ๆ
รู้ขนาด context window, ใช้ prompt caching ลดต้นทุนเนื้อหาซ้ำ, นับ token ล่วงหน้าเพื่อวางแผน

---

## 10. การทำงานกับไฟล์ (Files / PDF / Vision)
อ้างอิง: [Files API](https://platform.claude.com/docs/en/build-with-claude/files) · [PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support) · [Vision](https://platform.claude.com/docs/en/build-with-claude/vision)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Files API** — อัปโหลดไฟล์เก็บไว้แล้วอ้างถึงด้วย file ID ในหลายคำขอ โดยไม่ต้องส่งซ้ำ
- **PDF support** — ส่ง PDF ให้ Claude อ่านทั้งข้อความและองค์ประกอบภาพในหน้า
- **Vision** — ส่งรูปภาพ (base64 หรือ URL/file) ให้ Claude วิเคราะห์ บรรยาย หรือดึงข้อมูล

### สรุปสั้น ๆ
อัปโหลดผ่าน Files API แล้วอ้างด้วย ID; รองรับอ่าน PDF และวิเคราะห์รูปภาพ (vision)

---

## 11. Skills (ในบริบท API)
อ้างอิง: [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Skills in the API](https://platform.claude.com/docs/en/build-with-claude/skills-guide)

### หัวข้อนี้คืออะไร
Skills คือชุดความสามารถแบบแพ็กเกจ (โฟลเดอร์ที่มีไฟล์ `SKILL.md` พร้อมคำสั่งและสคริปต์) ที่ Claude โหลดมาใช้เมื่องานนั้นต้องการ เปรียบเหมือน "ปลั๊กอิน" ที่เพิ่มความสามารถเฉพาะทาง เช่น สร้างเอกสาร Word/PowerPoint/Excel

### รายละเอียดสำคัญจากเอกสารทางการ
- โหลดเฉพาะตอนที่เกี่ยวข้อง (**progressive disclosure** — ไม่โหลดทั้งหมดพร้อมกัน ประหยัด context)
- ใช้ได้ทั้งใน Claude apps, Claude Code และผ่าน API
- มี best practices และโหมดสำหรับองค์กร

### สรุปสั้น ๆ
Skills = แพ็กเกจความสามารถเฉพาะทางที่โหลดเมื่อจำเป็น ใช้ซ้ำและแชร์ได้

---

## 12. MCP (Model Context Protocol)
อ้างอิง: [Remote MCP servers](https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers) · [MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector)

### หัวข้อนี้คืออะไร
MCP เป็นมาตรฐานเปิดสำหรับเชื่อมเครื่องมือ AI กับแหล่งข้อมูลและบริการภายนอก Claude API เชื่อม **MCP server** (เซิร์ฟเวอร์ที่ให้บริการเครื่องมือต่าง ๆ) จากระยะไกลได้ผ่าน **MCP connector** เพื่อให้โมเดลเรียกใช้เครื่องมือของ server เหล่านั้นโดยตรง

> **กล่าวง่ายๆ:** MCP เปรียบเหมือน "ปลั๊กไฟมาตรฐาน" ที่ทำให้ AI เสียบเข้ากับเครื่องมือต่าง ๆ ได้โดยไม่ต้องเขียนโค้ดเชื่อมต่อแบบพิเศษแต่ละตัว

### รายละเอียดสำคัญจากเอกสารทางการ
- เชื่อม remote MCP server (MCP server ที่อยู่บนอินเทอร์เน็ต) เข้ากับคำขอ Messages API ได้โดยตรง
- รองรับการยืนยันตัวตน (**auth** = authentication) เพื่อความปลอดภัยในการเข้าถึง server
- สำหรับสร้าง MCP client เองดูได้ที่ [modelcontextprotocol.io](https://modelcontextprotocol.io)

### สรุปสั้น ๆ
MCP connector ให้ Claude API เรียก tools จาก MCP server ภายนอกได้แบบมาตรฐานเดียว

---

## 13. ราคา (Pricing)
อ้างอิง: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

### รายละเอียดสำคัญจากเอกสารทางการ
- คิดเงินตามจำนวน token แยก input/output (ดูตารางในหัวข้อโมเดล)
- มีส่วนลดสำหรับ **Batch API** และอัตราพิเศษสำหรับ **prompt caching**
- Server tools (เช่น web search) มีค่าใช้จ่ายเพิ่มตามการใช้งาน
- ราคาบนแพลตฟอร์มคลาวด์ (Bedrock/Vertex/Foundry) อาจต่างกันตาม endpoint

### สรุปสั้น ๆ
จ่ายตาม token (input/output); ลดต้นทุนด้วย batch และ prompt caching; tool ฝั่ง server มีค่าใช้จ่ายเพิ่ม

---

## 14. การทดสอบและความปลอดภัย (Evaluate & Guardrails)
อ้างอิง: [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) · [Develop tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Strengthen guardrails](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Prompt engineering (การเขียน prompt ที่ดี)** — เทคนิคเขียนคำสั่งให้ AI: ชัดเจนและละเอียด ใส่ตัวอย่างทั้งที่ถูกและผิด ให้คิดเป็นขั้นตอน ขอผลในแท็ก XML (เครื่องหมาย `<tag>`) เพื่อแยกส่วนข้อความ ระบุความยาวและรูปแบบที่ต้องการ
- **Evals (Evaluations — การประเมินคุณภาพ)** — สร้างชุดทดสอบเพื่อวัดว่า prompt หรือโมเดลทำงานได้ดีแค่ไหน ก่อนนำไปใช้จริง (production)
- **Guardrails (ตัวกันความเสี่ยง)** — กฎหรือตัวกรองที่เพิ่มเข้าไปเพื่อควบคุมพฤติกรรม AI ป้องกันไม่ให้ตอบสิ่งที่ไม่ต้องการ และจัดการกรณีที่ AI ปฏิเสธตอบ
- **Rate limits & errors (ขีดจำกัดและข้อผิดพลาด)** — API มีขีดจำกัดจำนวนคำขอต่อนาที ถ้าส่งเกินจะได้รหัสข้อผิดพลาด 429 ต้องทำ **retry with backoff** (ลองใหม่โดยรอนานขึ้นเรื่อยๆ) ([Rate limits](https://platform.claude.com/docs/en/api/rate-limits))

### สรุปสั้น ๆ
เขียน prompt ให้ดี → ทดสอบด้วย evals → เสริม guardrails → จัดการ rate limit/error ก่อนขึ้นจริง

---

## หัวข้ออ้างอิงเพิ่มเติม
- API Reference: https://platform.claude.com/docs/en/api/overview
- Client SDKs: https://platform.claude.com/docs/en/api/client-sdks
- Release notes (API): https://platform.claude.com/docs/en/release-notes/overview
- Managed Agents: https://platform.claude.com/docs/en/managed-agents/overview
- Cookbook: https://platform.claude.com/cookbooks
