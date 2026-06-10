---
title: "Changelog — อัปเดตและฟีเจอร์ใหม่"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "ประวัติการอัปเดต Perplexity API ล่าสุด รวมถึงโมเดลใหม่ ฟีเจอร์ใหม่ และการเปลี่ยนแปลงสำคัญ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 18
---

# Changelog — อัปเดตและฟีเจอร์ใหม่

**Changelog** (บันทึกการเปลี่ยนแปลง — รายการอัปเดตและฟีเจอร์ใหม่ที่เพิ่งเผยแพร่) ของ Perplexity API ช่วยให้นักพัฒนาติดตามการเปลี่ยนแปลงและวางแผนการอัปเกรดระบบได้

---

## พฤษภาคม 2026

### Finance Search Tool — เครื่องมือค้นหาข้อมูลการเงิน

**Finance Search** (ค้นหาข้อมูลการเงิน — Tool ที่ดึงข้อมูลหุ้น กำไร และการวิเคราะห์จากนักวิเคราะห์) เปิดตัวเป็น Tool ใน Agent API:

```python
response = client.agent.create(
    model="openai/gpt-5.1",
    tools=[{"type": "finance_search"}],  # Tool ใหม่
    input="วิเคราะห์ผลประกอบการ GULF Energy Development ไตรมาส 1/2026"
)
```

ข้อมูลที่ดึงได้:
- **Stock Quotes** (ราคาหุ้นแบบ Real-time)
- **Earnings** (กำไรขาดทุน)
- **Analyst Estimates** (การคาดการณ์จากนักวิเคราะห์)
- **Corporate Actions** (เหตุการณ์ของบริษัท เช่น ปันผล แยกหุ้น)

---

## เมษายน 2026

### โมเดลใหม่

รองรับโมเดลเพิ่มเติม:
- **Claude Opus 4.7** (Anthropic) — รุ่นใหม่ความสามารถสูงสุด
- **GPT-5.5** (OpenAI) — Flagship รุ่นใหม่
- **Grok 4.20 Reasoning** (xAI) — รองรับ Multi-step Reasoning

### ความปลอดภัย API Key

**นโยบายใหม่:** ค่า API Key เต็มจะแสดงเฉพาะ **ครั้งแรกที่สร้าง** เท่านั้น หลังจากนั้นระบบจะแสดงเพียงส่วนต้นและส่วนท้ายเพื่อความปลอดภัย

**ผลกระทบ:** ถ้าทำ Key หาย ต้องสร้าง Key ใหม่ ดังนั้นควรบันทึก Key ทันทีหลังสร้าง

### GET /v1/models Endpoint ใหม่

```bash
# ดูรายชื่อโมเดลที่รองรับทั้งหมด
curl https://api.perplexity.ai/v1/models \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY"
```

Response คืน JSON รายชื่อโมเดลในรูปแบบ OpenAI-compatible

### Integrations ใหม่

- **n8n** — Node สำเร็จรูปใน n8n Workflow Automation
- **OpenClaw** — Terminal-based AI Coding Agent
- **AWS Marketplace** — ชำระผ่าน AWS Billing ได้แล้ว

---

## มีนาคม 2026

### โมเดลเพิ่มเติม

รองรับ:
- GPT-5.4 (OpenAI)
- NVIDIA Nemotron 3 Super
- Claude Sonnet 4.6 (Anthropic)
- Gemini 3.1 Pro Preview (Google)

### Deprecated Models (โมเดลที่ยกเลิกแล้ว)

**Deprecated** (เลิกใช้แล้ว — โมเดลที่ถูกแทนที่ด้วยรุ่นใหม่):
- ~~Gemini 2.5 Flash~~ → ใช้ Gemini 3 Flash แทน
- ~~Gemini 2.5 Pro~~ → ใช้ Gemini 3 Pro แทน
- ~~Gemini 3-pro-preview (รุ่นเก่า)~~

### Endpoint ใหม่ — `/v1/agent` เป็น Canonical

**`/v1/agent`** กลายเป็น Endpoint หลักอย่างเป็นทางการ
**`/v1/responses`** ยังใช้ได้ (Backward-compatible alias)

---

## กุมภาพันธ์ 2026

### Agent API — เปิดให้ใช้งาน Generally Available

**GA (Generally Available)** (พร้อมใช้งานทั่วไป — ออกจาก Beta และพร้อมสำหรับการใช้งาน Production):

Agent API ออกจากช่วง Beta เป็น GA พร้อมฟีเจอร์ครบถ้วน:
- Multi-provider model support
- Tools: web_search, fetch_url, people_search
- Model Fallback
- Presets: fast-search, pro-search, deep-research, advanced-deep-research
- Streaming responses

### Embeddings API — เปิดให้ใช้งาน Generally Available

Embeddings API ออกจาก Beta พร้อมด้วย:
- Standard Embeddings (0.6b และ 4b)
- Contextualized Embeddings
- Matryoshka Dimension Reduction
- Batch support สูงสุด 512 texts

---

## สิ่งที่ควรรู้เมื่ออัปเกรด

### จาก Sonar API เก่า → Agent API ใหม่

ถ้าเคยใช้ Sonar API เวอร์ชันเก่า (ก่อน 2026) และต้องการย้ายมา Agent API:

```python
# เก่า (Sonar API เก่า)
response = client.chat.completions.create(
    model="sonar-medium-online",  # โมเดลเก่า
    messages=[{"role": "user", "content": "คำถาม"}]
)

# ใหม่ (Agent API)
response = client.agent.create(
    preset="pro-search",  # ใช้ Preset แทน
    input="คำถาม"
)
# หรือ
response = client.agent.create(
    model="sonar",  # Sonar ใหม่
    tools=[{"type": "web_search"}],
    input="คำถาม"
)
```

### โมเดลที่ Deprecated — สิ่งที่ต้องทำ

ถ้า Code ใช้โมเดลเก่าที่ Deprecated แล้ว จะได้รับ Error:
```json
{"error": "Model 'gemini-2.5-flash' is deprecated. Use 'google/gemini-3-flash' instead."}
```

ให้อัปเดตชื่อโมเดลใน Code ตามตาราง:

| โมเดลเก่า | โมเดลใหม่ที่แนะนำ |
|---|---|
| gemini-2.5-flash | google/gemini-3-flash |
| gemini-2.5-pro | google/gemini-3-pro |
| sonar-medium-online | sonar หรือ sonar-pro |
| sonar-large-online | sonar-pro |

---

## Feature Roadmap (แผนฟีเจอร์ในอนาคต)

ฟีเจอร์ที่ Perplexity วางแผนพัฒนา:

- **Memory Management** (การจัดการความจำ — ให้ AI จำบทสนทนาเก่าได้) สำหรับ Agent API
- **Custom Tool Integration** (เชื่อมต่อ Tool ของลูกค้าเอง) ใน Agent API
- **Batch Processing API** (ประมวลผลเป็น Batch ใหญ่ในราคาถูก)
- **Fine-tuning Support** (ปรับแต่งโมเดลด้วยข้อมูลของเราเอง)

---

## วิธีติดตาม Changelog

1. **เว็บไซต์:** [docs.perplexity.ai/changelog](https://docs.perplexity.ai/changelog)
2. **Discord:** ชุมชน Perplexity Developer Discord
3. **Blog:** blog.perplexity.ai สำหรับประกาศสำคัญ
4. **Status Page:** status.perplexity.ai ติดตามสถานะระบบ

---

## สรุปการเปลี่ยนแปลงสำคัญในปี 2026

| เดือน | การเปลี่ยนแปลงสำคัญ |
|---|---|
| กุมภาพันธ์ 2026 | Agent API และ Embeddings API เปิด GA |
| มีนาคม 2026 | เพิ่มโมเดลหลายรายการ, ยกเลิก Gemini 2.5 |
| เมษายน 2026 | API Key Show-once, GET /v1/models, n8n integration |
| พฤษภาคม 2026 | Finance Search Tool เปิดตัว |
