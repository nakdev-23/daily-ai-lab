---
title: "Claude บนแพลตฟอร์มคลาวด์"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "อ้างอิง: API overview"
readTime: "5 นาที"
readers: "0"
locked: false
order: 7
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 7: Claude บนแพลตฟอร์มคลาวด์

> เรียบเรียงจาก [Claude API vs cloud platforms](https://platform.claude.com/docs/en/api/overview#claude-api-vs-cloud-platforms) และหน้าคู่มือแต่ละแพลตฟอร์ม — การใช้ Claude ผ่าน AWS, Google Cloud และ Microsoft Azure

---

## 📖 คำศัพท์สำคัญสำหรับ Cloud Platforms

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **Cloud platform** | บริการคลาวด์ เช่น AWS (Amazon), Google Cloud, Microsoft Azure — ให้เซิร์ฟเวอร์และบริการต่าง ๆ บนอินเทอร์เน็ต |
| **IAM** (Identity and Access Management) | ระบบจัดการว่าใครมีสิทธิ์ทำอะไรในระบบคลาวด์ |
| **Commitment** | สัญญากับผู้ให้บริการคลาวด์ว่าจะใช้บริการขั้นต่ำเท่าไหร่ แลกกับราคาดีกว่า |
| **Compliance** | การปฏิบัติตามมาตรฐานหรือกฎหมาย เช่น ข้อกำหนดด้านความปลอดภัยของอุตสาหกรรม |
| **Data residency** | ข้อกำหนดว่าข้อมูลต้องเก็บในภูมิภาคใด |
| **Payload** | ข้อมูลทั้งหมดที่ส่งไปพร้อมคำขอ (ขนาดจำกัดตามแพลตฟอร์ม) |
| **Provisioned throughput** | การจองกำลังประมวลผลล่วงหน้า — รับประกันความเร็วคงที่แต่ต้องจ่ายเพิ่ม |
| **Routing** | การกำหนดทิศทางว่าคำขอจะถูกส่งไปประมวลผลที่เซิร์ฟเวอร์ไหน |
| **Pay-as-you-go** | จ่ายตามที่ใช้จริง ไม่ต้องจองล่วงหน้า |
| **Premium (10%)** | ค่าบริการเพิ่มเติม 10% สำหรับ routing ที่รับประกันภูมิภาค |
| **Model Garden** | หน้าสำรวจและเลือกโมเดล AI บน Google Cloud Vertex AI |
| **GCP project** | โปรเจกต์บน Google Cloud Platform ที่ใช้จัดการทรัพยากรและการเรียกเก็บเงิน |

---

## 1. ภาพรวม: Claude API ตรง vs แพลตฟอร์มคลาวด์
อ้างอิง: [API overview](https://platform.claude.com/docs/en/api/overview)

### หัวข้อนี้คืออะไร
Claude ใช้ได้ทั้งผ่าน Claude API โดยตรง และผ่านแพลตฟอร์มคลาวด์ เลือกตาม infrastructure, ฟีเจอร์ที่ต้องการ, ข้อกำหนด compliance และรูปแบบการเรียกเก็บเงิน

### เปรียบเทียบ
- **Claude API (ตรง)** — เข้าถึงโมเดล/ฟีเจอร์ล่าสุดก่อนใคร, จ่ายเงินและรับการสนับสนุนตรงกับ Anthropic, เหมาะกับงานใหม่ที่ต้องการฟีเจอร์ครบ
- **แพลตฟอร์มคลาวด์** — รวมบิลค่าใช้จ่ายกับบริการคลาวด์ที่ใช้อยู่แล้ว และใช้ **IAM** (Identity and Access Management — ระบบควบคุมสิทธิ์) ของคลาวด์นั้น ๆ ได้เลย, ฟีเจอร์ต่างกันตามแพลตฟอร์ม, เหมาะกับผู้ที่มีสัญญา (commitment) กับคลาวด์อยู่แล้วหรือมีข้อกำหนด compliance เฉพาะ

### ตารางแพลตฟอร์ม
| แพลตฟอร์ม | ผู้ให้บริการ | หมายเหตุ |
|---|---|---|
| **Claude Platform on AWS** | AWS (Anthropic ดำเนินการ) | ใช้ model ID เหมือน Claude API ตรง |
| **Amazon Bedrock** | AWS (พาร์ตเนอร์ดำเนินการ) | ใช้ Bedrock-style model ID |
| **Vertex AI** | Google Cloud (พาร์ตเนอร์) | model ใส่ใน URL, `anthropic_version` ใน body |
| **Microsoft Foundry** | Microsoft Azure (Anthropic ดำเนินการ) | Opus context window 200k บน Foundry |

### สรุปสั้น ๆ
ใช้ Claude API ตรงถ้าต้องการฟีเจอร์ล่าสุดครบ; ใช้คลาวด์ถ้ามี commitment/compliance กับ AWS, GCP หรือ Azure อยู่แล้ว

---

## 2. Claude บน Vertex AI (Google Cloud)
อ้างอิง: [Claude on Vertex AI](https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai)

### หัวข้อนี้คืออะไร
โมเดล Claude ใช้ได้ผ่าน Google Cloud Vertex AI โดย API เกือบเหมือน Messages API ทุกอย่าง

### ความแตกต่างสำคัญจาก Claude API ตรง
- **`model` ไม่ส่งใน body** แต่ระบุใน endpoint URL ของ Google Cloud
- **`anthropic_version` ส่งใน body** (ไม่ใช่ header) และต้องเป็นค่า `vertex-2023-10-16`

### วิธีใช้งาน
1. มี GCP project ที่เปิด Vertex AI
2. ติดตั้ง SDK เช่น `from anthropic import AnthropicVertex`
3. ยืนยันตัวตน: `gcloud auth application-default login`

### ตัวอย่าง (Python)
```python
from anthropic import AnthropicVertex

client = AnthropicVertex(project_id="MY_PROJECT_ID", region="global")

message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=100,
    messages=[{"role": "user", "content": "Hey Claude!"}],
)
print(message)
```

### Model IDs (Vertex)
`claude-opus-4-8`, `claude-sonnet-4-6`, `claude-sonnet-4-5@20250929`, `claude-haiku-4-5@20251001` ฯลฯ — ความพร้อมต่างกันตามภูมิภาค ตรวจใน Vertex AI Model Garden

### ประเภท Endpoint (จุดรับ-ส่งข้อมูล)
- **Global (แนะนำ)** — **routing** (กำหนดทิศทาง) แบบ dynamic ไปเซิร์ฟเวอร์ที่ว่างที่สุด เพื่อ availability (ความพร้อมใช้งาน) สูงสุด ไม่มีค่าพรีเมียม รองรับเฉพาะ **pay-as-you-go** (จ่ายตามที่ใช้)
- **Multi-region** (`us`/`eu`) — routing ภายในพื้นที่ภูมิศาสตร์ใดภูมิศาสตร์หนึ่ง เพื่อ **data residency** (ข้อมูลอยู่ในภูมิภาคที่กำหนด) แบบกว้าง ๆ และ availability สูง มีค่าพรีเมียมเพิ่ม 10%
- **Regional** (เช่น `us-east1`) — รับประกันว่าข้อมูลผ่านภูมิภาคเฉพาะเท่านั้น จำเป็นสำหรับ data residency เข้มงวด/compliance เฉพาะ/**provisioned throughput** (กำลังประมวลผลที่จองไว้) มีค่าพรีเมียม 10%

### ฟีเจอร์ที่ไม่รองรับบน Vertex
- Input จาก URL (รูป/เอกสาร), Files API
- Server-side tools (code execution, web fetch, advisor)
- Agent infrastructure (Agent Skills, MCP connector, programmatic tool calling)
- Endpoints: Message Batches, Models, Admin, Compliance, Usage and Cost
- Claude Managed Agents

### Context window
Opus 4.8/4.7/4.6 และ Sonnet 4.6 = 1M tokens บน Vertex; รุ่นอื่น (Sonnet 4.5 ฯลฯ) = 200k; จำกัด payload 30 MB

### ข้อควรระวัง
- data retention อยู่ภายใต้ Google Cloud Vertex AI; Anthropic แนะนำเปิด request-response logging แบบ rolling อย่างน้อย 30 วันเพื่อตรวจสอบการใช้งานผิด

### สรุปสั้น ๆ
Vertex: ใส่ model ใน URL, `anthropic_version: vertex-2023-10-16` ใน body, ใช้ AnthropicVertex SDK; global endpoint แนะนำ; บางฟีเจอร์ไม่รองรับ

---

## 3. Claude บน Amazon Bedrock (AWS)
อ้างอิง: [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock)

### หัวข้อนี้คืออะไร
โมเดล Claude ใช้ได้ผ่าน Amazon Bedrock รวมการเรียกเก็บเงินและ IAM เข้ากับ AWS

### รายละเอียดสำคัญจากเอกสารทางการ
- ใช้ **Bedrock-style model ID** เช่น `anthropic.claude-sonnet-4-6`, และมี region prefix สำหรับ cross-region เช่น `us.anthropic.claude-sonnet-4-6`
- ยืนยันตัวตนผ่าน AWS credentials/IAM; SDK รองรับ (เช่น `AnthropicBedrock`)
- ตั้งแต่ Sonnet 4.5 เป็นต้นไป Bedrock มี **global endpoints** (routing แบบ dynamic) และ **regional endpoints** (รับประกันเส้นทางข้อมูลตามภูมิภาค)
- ต้องขอเปิดการเข้าถึงโมเดล Claude ใน Bedrock (และทุกภูมิภาคที่ต้องใช้สำหรับ cross-region)
- จำกัด payload คำขอ 20 MB
- lifecycle/วันเลิกใช้โมเดลกำหนดโดยพาร์ตเนอร์ อาจต่างจาก Claude API

### วิธีใช้งาน (ภาพรวม)
1. เปิดใช้ Amazon Bedrock และขอสิทธิ์เข้าถึงโมเดล Claude
2. ตั้งค่า AWS credentials/IAM role
3. เรียกผ่าน SDK โดยระบุ Bedrock model ID

### สรุปสั้น ๆ
Bedrock: ใช้ Bedrock model ID (มี region prefix), ยืนยันด้วย AWS IAM, ต้องขอเปิดสิทธิ์โมเดลก่อน, payload จำกัด 20 MB

---

## 4. Claude Platform on AWS (Anthropic ดำเนินการบน AWS)
อ้างอิง: [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws)

### รายละเอียดสำคัญจากเอกสารทางการ
- เป็นแพลตฟอร์มบน AWS ที่ **Anthropic ดำเนินการเอง** ต่างจาก Bedrock (พาร์ตเนอร์ดำเนินการ)
- **ใช้ model ID เหมือน Claude API ตรง** (เช่น `claude-opus-4-6`) ไม่ใช่ Bedrock-style
- lifecycle โมเดลตามตาราง deprecations ของ Anthropic เอง
- รองรับ Claude Managed Agents ด้วย (มีความแตกต่างบางส่วน)
- เพิ่ม header `x-amzn-requestid` ควบคู่ `request-id` มาตรฐาน

### สรุปสั้น ๆ
Claude Platform on AWS = Anthropic ดำเนินการบน AWS ใช้ model ID แบบเดียวกับ API ตรง และ lifecycle ตาม Anthropic

---

## 5. Claude บน Microsoft Foundry (Azure)
อ้างอิง: [Claude in Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry)

### รายละเอียดสำคัญจากเอกสารทางการ
- โมเดล Claude ใช้ได้ผ่าน Microsoft Azure (Foundry) ซึ่ง **Anthropic ดำเนินการ**
- รวมการยืนยันตัวตนเข้ากับ Azure credentials/IAM
- **หมายเหตุ:** บน Foundry, Claude Opus 4.8 มี context window 200k tokens (ต่างจาก 1M บน API ตรง)

### สรุปสั้น ๆ
Foundry: ใช้ Claude ผ่าน Azure (Anthropic ดำเนินการ); Opus context window 200k บนแพลตฟอร์มนี้

---

## 6. การเลือกแพลตฟอร์มและราคา
อ้างอิง: [Cloud platform pricing](https://platform.claude.com/docs/en/about-claude/pricing#cloud-platform-pricing)

### แนวทางการเลือก
- มี commitment กับ **AWS** → Bedrock หรือ Claude Platform on AWS
- มี commitment กับ **Google Cloud** → Vertex AI
- มี commitment กับ **Azure** → Microsoft Foundry
- ต้องการ **ฟีเจอร์ล่าสุดครบที่สุด** → Claude API ตรง

### ข้อควรระวังด้านราคา
- regional/multi-region endpoints มักมีพรีเมียม 10% เหนือ global endpoint
- ราคาและฟีเจอร์ต่างกันตามแพลตฟอร์ม ตรวจหน้าราคาทางการเสมอ

### สรุปสั้น ๆ
เลือกแพลตฟอร์มตามคลาวด์ที่ใช้อยู่; global endpoint ถูกกว่า regional 10%; ฟีเจอร์/ราคาต่างกันตามแพลตฟอร์ม

---

## หัวข้ออ้างอิงเพิ่มเติม
- Amazon Bedrock: https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock
- Claude Platform on AWS: https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws
- Microsoft Foundry: https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry
- Features overview (ฟีเจอร์ตามแพลตฟอร์ม): https://platform.claude.com/docs/en/build-with-claude/overview
