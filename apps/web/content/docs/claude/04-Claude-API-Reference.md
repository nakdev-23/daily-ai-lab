---
title: "API Reference (รายละเอียด Endpoint)"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "อ้างอิง: API overview"
readTime: "7 นาที"
readers: "0"
locked: false
order: 4
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 4: API Reference (รายละเอียด Endpoint)

> เรียบเรียงจาก [API overview](https://platform.claude.com/docs/en/api/overview) — รายละเอียด endpoint, การยืนยันตัวตน, ขีดจำกัด และรูปแบบคำขอ/คำตอบของ Claude API

---

## 📖 คำศัพท์สำคัญสำหรับ API Reference

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **RESTful API** | รูปแบบมาตรฐานของ API บนเว็บ — ส่ง request ไปยัง URL แล้วรับ response กลับ |
| **Endpoint** | URL ที่ระบุว่าจะทำอะไร เช่น `POST /v1/messages` = ส่งข้อความ, `GET /v1/models` = ดูรายการโมเดล |
| **POST / GET** | วิธีส่งข้อมูล — POST = ส่งข้อมูลไปสร้างหรือประมวลผล, GET = ขอดูข้อมูล |
| **Request body** | ข้อมูลที่ส่งไปพร้อมคำขอ เช่น model ที่ใช้ ข้อความ และ max_tokens |
| **Response** | ข้อมูลที่ได้รับกลับมาจาก API |
| **Authentication (การยืนยันตัวตน)** | การพิสูจน์ว่าคุณมีสิทธิ์ใช้ API โดยส่ง API key ไปพร้อมทุกคำขอ |
| **Header** | ข้อมูลเพิ่มเติมที่แนบไปกับ request นอกเหนือจาก body เช่น API key และเวอร์ชัน API |
| **Bearer token** | วิธีส่ง token ยืนยันตัวตนในรูปแบบ `Authorization: Bearer <token>` |
| **Rate limit** | ขีดจำกัดจำนวนคำขอที่ส่งได้ต่อหน่วยเวลา เพื่อป้องกันการใช้งานเกินพิกัด |
| **RPM / TPM** | Requests Per Minute (คำขอต่อนาที) / Tokens Per Minute (token ต่อนาที) |
| **Token bucket** | อัลกอริทึมจัดการ rate limit — เหมือน "ถัง" ที่เติม token ทีละนิดตลอดเวลา เบิกใช้ได้ไม่เกินที่มีในถัง |
| **Exponential backoff** | วิธีลองใหม่เมื่อเจอ error — รอ 1 วินาที → 2 วินาที → 4 วินาที → เพิ่มเรื่อยๆ |
| **Stateful** | มีสถานะ — จำข้อมูลและสถานะการทำงานไว้ได้ข้ามคำขอ |
| **Async** (Asynchronous) | ทำงานเบื้องหลัง ไม่รอผลทันที เช่น ส่ง batch แล้วมาดึงผลทีหลัง |
| **Beta** | ฟีเจอร์ที่ยังอยู่ในช่วงทดสอบ ต้องใส่ header พิเศษ `anthropic-beta` เพื่อเปิดใช้ |
| **GA** (General Availability) | ฟีเจอร์ที่พร้อมใช้งานแล้ว เสถียรและรองรับ production |

---

## 1. ภาพรวม Claude API
อ้างอิง: [API overview](https://platform.claude.com/docs/en/api/overview)

### หัวข้อนี้คืออะไร
Claude API เป็น **RESTful API** (รูปแบบมาตรฐานสำหรับส่งข้อมูลผ่านเว็บ) ที่ `https://api.anthropic.com` ให้เข้าถึงโมเดล Claude และ Claude Managed Agents แบบเขียนโปรแกรม

### สิ่งที่ต้องมี (Prerequisites)
- บัญชี [Claude Console](https://platform.claude.com)
- [API key](https://platform.claude.com/settings/keys) หรือกฎ [Workload Identity Federation (WIF)](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation) ที่ตั้งค่าไว้

### รายการ API ที่ให้บริการ
**General Availability (GA) — ฟีเจอร์พร้อมใช้งาน เสถียรแล้ว:**
- **Messages API** — ส่งข้อความให้ Claude (`POST /v1/messages`)
- **Message Batches API** — ประมวลผลคำขอจำนวนมากแบบ async (ทำงานเบื้องหลัง) ลดต้นทุน 50% (`POST /v1/messages/batches`)
- **Token Counting API** — นับ token ก่อนส่งเพื่อวางแผนต้นทุน (`POST /v1/messages/count_tokens`)
- **Models API** — แสดงรายการโมเดลที่ใช้ได้ (`GET /v1/models`)

**Beta — ฟีเจอร์ทดสอบ ต้องใส่ `anthropic-beta` header:**
- **Files API** — อัปโหลดไฟล์ไว้บน server แล้วใช้ซ้ำหลายคำขอโดยอ้างด้วย ID (`POST /v1/files`)
- **Skills API** — สร้าง/จัดการ agent skills (ชุดความสามารถเฉพาะทาง) (`POST /v1/skills`)
- **Agents API** — นิยาม agent config (การตั้งค่า agent) เพื่อใช้ซ้ำได้ (`POST /v1/agents`)
- **Sessions API** — รัน session แบบ **stateful** (มีสถานะ จำข้อมูลได้) ในแซนด์บ็อกซ์คลาวด์ (`POST /v1/sessions`)
- **Environments API** — ตั้งค่า template แซนด์บ็อกซ์ (แม่แบบสภาพแวดล้อม) (`POST /v1/environments`)

### สรุปสั้น ๆ
Claude API = REST ที่ api.anthropic.com มี Messages, Batches, Token Counting, Models (GA) และ Files, Skills, Agents, Sessions, Environments (beta)

---

## 2. การยืนยันตัวตน (Authentication)
อ้างอิง: [Authentication](https://platform.claude.com/docs/en/manage-claude/authentication)

### Header ที่ทุกคำขอต้องมี
| Header | ค่า | จำเป็น |
|---|---|---|
| `x-api-key` | API key (รหัสลับ) จาก Console | ต้องมีอย่างใดอย่างหนึ่ง (`x-api-key` หรือ `Authorization`) |
| `Authorization` | `Bearer <token>` — วิธีส่ง token ยืนยันสิทธิ์ (access token อายุสั้นจาก WIF) | ต้องมีอย่างใดอย่างหนึ่ง |
| `anthropic-version` | เวอร์ชัน API เช่น `2023-06-01` (ระบุว่าใช้ API รุ่นไหน) | ใช่ |
| `content-type` | `application/json` (บอกว่าข้อมูลที่ส่งเป็น JSON) | ใช่ |

- ถ้าใช้ **Client SDK** (ชุดเครื่องมือ Python/TypeScript ฯลฯ) SDK จะใส่ header เหล่านี้ให้อัตโนมัติ ไม่ต้องเขียนเอง
- สร้าง API key ใน [Account Settings](https://platform.claude.com/settings/keys) และใช้ [workspaces](https://platform.claude.com/settings/workspaces) แยกคีย์/ควบคุมค่าใช้จ่ายตาม use case
- เมื่อเข้าถึงผ่านแพลตฟอร์มคลาวด์ การยืนยันตัวตนจะรวมเข้ากับ IAM ของผู้ให้บริการนั้น

### ข้อควรระวัง
เก็บ API key เป็นความลับ ใช้ environment variable ไม่ commit ลง repo

### สรุปสั้น ๆ
ใส่ `x-api-key` (หรือ `Authorization: Bearer`) + `anthropic-version` + `content-type` ทุกคำขอ; SDK จัดการให้อัตโนมัติ

---

## 3. Messages API (endpoint หลัก)
อ้างอิง: [Messages API reference](https://platform.claude.com/docs/en/api/messages/create)

### Endpoint
`POST /v1/messages`

### พารามิเตอร์หลักใน Request body
- `model` (จำเป็น) — เช่น `claude-opus-4-8`
- `max_tokens` (จำเป็น) — เพดาน token ของผลลัพธ์
- `messages` (จำเป็น) — array ของ `{role, content}` (role = `user`/`assistant`)
- `system` — system prompt กำหนดบทบาท/พฤติกรรม
- `temperature` — ความสุ่มของผลลัพธ์ (0 = ตอบซ้ำเหมือนเดิมทุกครั้ง, 1 = สร้างสรรค์มากขึ้น)
- `top_p`, `top_k` — วิธีควบคุมการสุ่มอื่น ๆ (เหมือน temperature แต่ต่างตรรกะ)
- `stop_sequences` — ลำดับข้อความที่ให้หยุด
- `stream` — `true` เพื่อสตรีมผลลัพธ์
- `tools`, `tool_choice` — สำหรับ tool use
- `metadata` — ข้อมูลกำกับ เช่น `user_id`

### ตัวอย่าง (cURL)
```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-opus-4-8",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "สวัสดี Claude"}]
  }'
```

### โครงสร้าง Response
- `id`, `type`, `role`, `model`
- `content` — array ของ block (เช่น `{type: "text", text: ...}` หรือ `tool_use`)
- `stop_reason` — เหตุผลที่หยุด (`end_turn`, `max_tokens`, `tool_use`, `stop_sequence`)
- `usage` — `{input_tokens, output_tokens}`

### สรุปสั้น ๆ
`POST /v1/messages` ต้องมี model, max_tokens, messages; คืน content + stop_reason + usage

---

## 4. Message Batches API
อ้างอิง: [Creating message batches](https://platform.claude.com/docs/en/api/creating-message-batches) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

### รายละเอียดสำคัญจากเอกสารทางการ
- ส่งคำขอ Messages จำนวนมากแบบ asynchronous ในชุดเดียว (`POST /v1/messages/batches`)
- **ลดต้นทุน 50%** เทียบกับการเรียกแบบ synchronous
- เหมาะกับงาน offline ปริมาณมากที่ไม่ต้องการคำตอบทันที (เช่น จัดประเภทข้อมูลหลายหมื่นรายการ)
- ผลลัพธ์ทยอยเสร็จ ดึงผลเมื่อ batch เสร็จสมบูรณ์
- ขนาดคำขอสูงสุด 256 MB

### สรุปสั้น ๆ
Batches = ส่งคำขอจำนวนมากแบบ async ประหยัด 50% เหมาะงาน offline

---

## 5. Token Counting API
อ้างอิง: [Count tokens](https://platform.claude.com/docs/en/api/messages-count-tokens)

### รายละเอียดสำคัญจากเอกสารทางการ
- `POST /v1/messages/count_tokens` นับจำนวน token ของข้อความก่อนส่งจริง
- ใช้วางแผนต้นทุนและไม่ให้เกิน rate limit / context window
- รับพารามิเตอร์คล้าย Messages (model, messages, system, tools)

### สรุปสั้น ๆ
นับ token ล่วงหน้าเพื่อคุมต้นทุนและขนาดคำขอ

---

## 6. Models API
อ้างอิง: [Models list](https://platform.claude.com/docs/en/api/models-list)

### รายละเอียดสำคัญจากเอกสารทางการ
- `GET /v1/models` แสดงรายการโมเดลที่ใช้ได้พร้อมรายละเอียด
- Response มี `max_input_tokens`, `max_tokens` และ object `capabilities` ของแต่ละโมเดล
- ใช้คิวรีความสามารถ/เพดาน token ของโมเดลแบบโปรแกรม

### สรุปสั้น ๆ
`GET /v1/models` ดูรายการโมเดลและความสามารถแบบโปรแกรม

---

## 7. Files API (beta)
อ้างอิง: [Files API reference](https://platform.claude.com/docs/en/api/files-create) · [Files guide](https://platform.claude.com/docs/en/build-with-claude/files)

### รายละเอียดสำคัญจากเอกสารทางการ
- `POST /v1/files` อัปโหลดไฟล์, `GET /v1/files` แสดงรายการ, ลบได้ด้วย DELETE
- อ้างไฟล์ด้วย file ID ในหลายคำขอโดยไม่ต้องส่งซ้ำ
- ขนาดคำขอสูงสุด 500 MB
- เป็น beta ต้องใส่ beta header

### สรุปสั้น ๆ
อัปโหลดไฟล์ครั้งเดียว อ้างด้วย ID ในหลายคำขอ (beta)

---

## 8. ขนาดคำขอและ Header การตอบกลับ
อ้างอิง: [API overview](https://platform.claude.com/docs/en/api/overview)

### ขีดจำกัดขนาดคำขอ
| Endpoint | ขนาดสูงสุด |
|---|---|
| Messages, Token Counting | 32 MB |
| Message Batches | 256 MB |
| Files | 500 MB |
| Sessions, Agents, Environments | 32 MB |

เกินขีดจำกัดจะได้ error 413 `request_too_large` (บน Vertex จำกัด 30 MB, Bedrock 20 MB)

### Header การตอบกลับ
- `request-id` — รหัสคำขอที่ไม่ซ้ำทั่วโลก (ใช้แจ้งปัญหา/ติดตาม)
- `anthropic-organization-id` — รหัสองค์กรของ API key ที่ใช้

### สรุปสั้น ๆ
Messages จำกัด 32 MB, Batches 256 MB, Files 500 MB; ตอบกลับมี request-id เสมอ

---

## 9. Rate limits และ Spend limits
อ้างอิง: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits)

### รายละเอียดสำคัญจากเอกสารทางการ
- API มี **rate limit** (ขีดจำกัดคำขอ) และ **spend limit** (เพดานค่าใช้จ่าย) เพื่อป้องกันการใช้งานเกินพิกัดและบริหารกำลังเซิร์ฟเวอร์
- จัด **usage tiers** (ระดับการใช้งาน) ที่เพิ่มขึ้นอัตโนมัติตามประวัติการใช้งาน แต่ละระดับมี:
  - **Spend limit** — เพดานค่าใช้จ่ายรายเดือน (ถ้าเกินจะหยุดให้บริการ)
  - **Rate limit** — **RPM** (จำนวนคำขอต่อนาที) และ **TPM** (จำนวน token ต่อนาที)
- ใช้อัลกอริทึม **token bucket** (เปรียบเหมือนถังที่เติมเต็มทีละนิด เบิกได้แค่ที่มีในถัง) ในการจำกัดอัตรา
- ดูขีดจำกัดปัจจุบันใน [Console → Limits](https://platform.claude.com/settings/limits); ขอเพิ่มหรือ Priority Tier ติดต่อ sales

### ข้อควรระวัง
เมื่อเจอ error 429 (เกิน rate limit) ให้ทำ retry พร้อม **exponential backoff** — คือรอก่อนลองใหม่ และเพิ่มเวลารอขึ้นเรื่อยๆ เช่น รอ 1 วิ → รอ 2 วิ → รอ 4 วิ → รอ 8 วิ แทนที่จะส่งซ้ำทันที

### สรุปสั้น ๆ
มี rate limit (RPM/TPM) + spend limit เป็น tier ที่โตอัตโนมัติ; เจอ 429 ให้ retry แบบ backoff

---

## 10. ข้อผิดพลาด (Errors) และ Beta headers
อ้างอิง: [Errors](https://platform.claude.com/docs/en/api/errors) · [Beta headers](https://platform.claude.com/docs/en/api/beta-headers)

### รหัสข้อผิดพลาดที่พบบ่อย
- `400 invalid_request_error` — คำขอผิดรูปแบบ
- `401 authentication_error` — API key ไม่ถูกต้อง
- `403 permission_error` — ไม่มีสิทธิ์
- `404 not_found_error` — ไม่พบทรัพยากร
- `413 request_too_large` — คำขอใหญ่เกิน
- `429 rate_limit_error` — เกิน rate limit
- `500 api_error` / `529 overloaded_error` — ฝั่งเซิร์ฟเวอร์/โหลดสูง

### Beta headers
ฟีเจอร์ beta ต้องใส่ header `anthropic-beta` ที่ระบุ (เช่น `managed-agents-2026-04-01`)

### สรุปสั้น ๆ
จัดการ error ตามรหัส (401 คีย์, 429 rate limit, 5xx ฝั่งเซิร์ฟเวอร์); ฟีเจอร์ beta ต้องใส่ `anthropic-beta`

---

## 11. Client SDKs และความพร้อมใช้งานตามภูมิภาค
อ้างอิง: [Client SDKs](https://platform.claude.com/docs/en/api/client-sdks) · [Supported regions](https://platform.claude.com/docs/en/api/supported-regions)

### รายละเอียดสำคัญจากเอกสารทางการ
- SDK ทางการ: Python, TypeScript, Java, Go, C#, Ruby, PHP
- ประโยชน์ของ SDK: จัดการ header อัตโนมัติ, **type-safe** (ตรวจสอบชนิดข้อมูลตั้งแต่เขียนโค้ด), retry/error handling (ลองใหม่เมื่อเกิด error อัตโนมัติ), สตรีม (รับข้อมูลทีละชิ้น), timeout/connection management (จัดการเวลาและการเชื่อมต่อ)
- API ใช้ได้ในหลายประเทศ/ภูมิภาค ตรวจ [หน้าภูมิภาคที่รองรับ](https://platform.claude.com/docs/en/api/supported-regions)

### สรุปสั้น ๆ
ใช้ SDK ทางการ (7 ภาษา) เพื่อความสะดวก/ปลอดภัย; ตรวจภูมิภาคที่รองรับก่อนใช้

---

## หัวข้ออ้างอิงเพิ่มเติม
- Messages API: https://platform.claude.com/docs/en/api/messages/create
- Versioning: https://platform.claude.com/docs/en/api/versioning
- Workload Identity Federation: https://platform.claude.com/docs/en/manage-claude/workload-identity-federation
- Service tiers / Priority Tier: https://platform.claude.com/docs/en/api/service-tiers
