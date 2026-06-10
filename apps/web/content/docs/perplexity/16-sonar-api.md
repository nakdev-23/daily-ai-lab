---
title: "Sonar API — ถามตอบ AI พร้อมค้นหาเว็บ"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "Sonar API ให้คุณถามตอบด้วย AI ของ Perplexity พร้อมการค้นหาเว็บในตัว เหมาะสำหรับ Chat Application และ Question Answering"
readTime: "7 นาที"
readers: "0"
locked: false
order: 16
---

# Sonar API — ถามตอบ AI พร้อมค้นหาเว็บ

**Sonar API** คือ API ของ Perplexity ที่ให้ความสามารถ "ถามตอบด้วย AI พร้อมการค้นหาเว็บแบบเรียลไทม์" เหมือนกับการใช้ Perplexity.ai โดยตรง แต่เรียกผ่าน API ได้ เหมาะสำหรับสร้าง Chat Application หรือระบบ Question Answering

---

## Sonar Models (โมเดลในตระกูล Sonar)

| โมเดล | จุดเด่น | ค้นหาเว็บ | Pro Search |
|---|---|---|---|
| `sonar` | เร็ว ประหยัด ทั่วไป | ใช่ | ไม่ |
| `sonar-pro` | คุณภาพสูง ค้นหาลึก | ใช่ | ใช่ |
| `sonar-reasoning-pro` | มีขั้นตอน Reasoning | ใช่ | ใช่ |
| `sonar-deep-research` | วิจัยเชิงลึกอัตโนมัติ | ใช่ (หลายรอบ) | ใช่ |

---

## Endpoint

```
POST https://api.perplexity.ai/chat/completions
```

Sonar API ใช้ **Chat Completions** (รูปแบบการสนทนา — Messages เป็น Array ของ role/content) เหมือน OpenAI Chat API

---

## ตัวอย่างการใช้งาน

### Python — การถามตอบพื้นฐาน
```python
from perplexityai import Perplexity

client = Perplexity()

# รูปแบบ Messages (ข้อความในรูปแบบสนทนา)
response = client.chat.completions.create(
    model="sonar",
    messages=[
        {
            "role": "system",
            "content": "คุณเป็นผู้ช่วยที่เป็นประโยชน์ ตอบเป็นภาษาไทย"
        },
        {
            "role": "user",
            "content": "ข่าวเทคโนโลยีที่น่าสนใจที่สุดในสัปดาห์นี้คืออะไร?"
        }
    ]
)

print(response.choices[0].message.content)
print("แหล่งอ้างอิง:", response.citations)
```

### Python — การสนทนาต่อเนื่อง (Multi-turn Conversation)
```python
# Multi-turn (หลายรอบ) — ถามต่อเนื่องได้
conversation_history = [
    {"role": "system", "content": "คุณเป็นผู้เชี่ยวชาญด้าน AI"}
]

# รอบที่ 1
conversation_history.append({
    "role": "user",
    "content": "Large Language Model คืออะไร?"
})

response1 = client.chat.completions.create(
    model="sonar-pro",
    messages=conversation_history
)
answer1 = response1.choices[0].message.content

# เพิ่มคำตอบเข้า History
conversation_history.append({
    "role": "assistant",
    "content": answer1
})

# รอบที่ 2 — ถามต่อ
conversation_history.append({
    "role": "user",
    "content": "แล้ว GPT-5 ต่างจาก GPT-4 อย่างไร?"
})

response2 = client.chat.completions.create(
    model="sonar-pro",
    messages=conversation_history
)
print(response2.choices[0].message.content)
```

### cURL
```bash
curl -X POST https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar",
    "messages": [
      {
        "role": "user",
        "content": "ราคา Bitcoin วันนี้เท่าไหร่?"
      }
    ]
  }'
```

---

## โครงสร้าง Response

```json
{
  "id": "chatcmpl-abc123",
  "model": "sonar",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "คำตอบจาก AI..."
      },
      "finish_reason": "stop"
    }
  ],
  "citations": [
    "https://coinmarketcap.com/currencies/bitcoin/",
    "https://www.coindesk.com/price/bitcoin/"
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 150,
    "total_tokens": 162
  }
}
```

| Field | ความหมาย |
|---|---|
| `choices[0].message.content` | คำตอบจาก AI |
| `citations` | รายการ URL ที่ใช้อ้างอิง |
| `usage` | จำนวน Token ที่ใช้ |

---

## Search Filters สำหรับ Sonar

Sonar รองรับ Search Filters ผ่าน parameter พิเศษ:

```python
response = client.chat.completions.create(
    model="sonar-pro",
    messages=[{"role": "user", "content": "ข่าวเศรษฐกิจไทย"}],
    # Search Filters
    search_domain_filter=["bangkokpost.com", "thairath.co.th"],
    search_recency_filter="week",  # hour / day / week / month / year
)
```

---

## Pro Search Mode

**Pro Search** (การค้นหาแบบละเอียด — ใช้หลายขั้นตอนในการค้นหา ค้นหาซ้ำจากหลายมุมมอง ได้ผลลัพธ์แม่นยำกว่า) เปิดให้ใช้ด้วยโมเดล `sonar-pro`:

```python
# Pro Search ใช้โมเดล sonar-pro
response = client.chat.completions.create(
    model="sonar-pro",  # sonar-pro เปิด Pro Search อัตโนมัติ
    messages=[{
        "role": "user",
        "content": "วิเคราะห์ผลกระทบของ AI ต่อการจ้างงานในประเทศไทย พร้อมตัวเลขสถิติ"
    }]
)
```

---

## Sonar Deep Research

**Sonar Deep Research** (การวิจัยเชิงลึกอัตโนมัติ — โมเดลที่ค้นหาเว็บหลายรอบอัตโนมัติ วิเคราะห์ และสังเคราะห์ข้อมูลเป็นรายงาน) เหมาะกับงานวิจัยที่ต้องการความครอบคลุมสูง:

```python
response = client.chat.completions.create(
    model="sonar-deep-research",
    messages=[{
        "role": "user",
        "content": """
        สรุปสถานการณ์ความปลอดภัยของ AI ในปัจจุบัน
        ครอบคลุม: นโยบายภาครัฐ, งานวิจัยล่าสุด, และความเสี่ยงที่นักวิชาการกังวล
        """
    }]
)
# หมายเหตุ: Deep Research อาจใช้เวลานานกว่า 30-60 วินาที
```

---

## Sonar Reasoning Pro

**Sonar Reasoning Pro** (โมเดลให้เหตุผลก่อนตอบ — ใช้ Chain-of-Thought เพื่อวิเคราะห์ก่อนสรุปคำตอบ):

```python
response = client.chat.completions.create(
    model="sonar-reasoning-pro",
    messages=[{
        "role": "user",
        "content": """
        ถ้าลงทุน 100,000 บาทในหุ้นที่ให้ผลตอบแทน 8% ต่อปี เป็นเวลา 10 ปี
        จะได้เงินรวมเท่าไหร่? อธิบายการคำนวณด้วย
        """
    }]
)
# จะเห็น <think>...</think> tags ใน response แสดงขั้นตอนความคิด
```

---

## เปรียบเทียบ Sonar API กับ Agent API

| | Sonar API | Agent API |
|---|---|---|
| โมเดลที่ใช้ | Sonar (Perplexity เท่านั้น) | หลายผู้ให้บริการ |
| Interface | Chat Completions (messages[]) | Input / Instructions |
| Web Search | ในตัว อัตโนมัติ | ผ่าน web_search Tool |
| ความยืดหยุ่น | ปานกลาง | สูงมาก |
| เหมาะกับ | Chat App ทั่วไป | Application ซับซ้อน |
| Compatibility | OpenAI Chat API | OpenAI Responses API |

---

## Media Attachments (แนบไฟล์)

Sonar Pro รองรับการแนบรูปภาพ:

```python
response = client.chat.completions.create(
    model="sonar-pro",
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {"url": "https://example.com/chart.png"}
            },
            {
                "type": "text",
                "text": "วิเคราะห์กราฟนี้และบอกแนวโน้ม"
            }
        ]
    }]
)
```

---

## สรุป

Sonar API เหมาะสำหรับ:
- **Chatbot** ที่ต้องการข้อมูลสดจากอินเทอร์เน็ต
- **Question Answering System** พร้อม Citations
- **Research Tool** ที่ต้องการความลึก (ใช้ sonar-deep-research)
- **Application ที่ใช้ OpenAI Chat API อยู่แล้ว** และต้องการเพิ่มความสามารถค้นหาเว็บ
- โปรเจกต์ที่ต้องการ Interface แบบ Messages[] (OpenAI-compatible)
