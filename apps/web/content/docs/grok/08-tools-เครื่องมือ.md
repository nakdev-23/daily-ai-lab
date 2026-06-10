---
title: "Tools — เครื่องมือขยายความสามารถ"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Tools คือความสามารถเสริมที่ Grok ใช้เพื่อทำงานนอกเหนือจากการสร้างข้อความธรรมดา แบ่งเป็น 2 ประเภท:"
readTime: "4 นาที"
readers: "0"
locked: false
order: 8
---
# Tools — เครื่องมือขยายความสามารถ

> อ้างอิง: [Tools Overview](https://docs.x.ai/developers/tools/overview) | [Function Calling](https://docs.x.ai/developers/tools/function-calling) | [Web Search](https://docs.x.ai/developers/tools/web-search) | [X Search](https://docs.x.ai/developers/tools/x-search) | [Code Execution](https://docs.x.ai/developers/tools/code-execution) | [Collections Search](https://docs.x.ai/developers/tools/collections-search) | [Remote MCP Tools](https://docs.x.ai/developers/tools/remote-mcp)

---

## Tools คืออะไร?

**Tools** คือความสามารถเสริมที่ Grok ใช้เพื่อทำงานนอกเหนือจากการสร้างข้อความธรรมดา แบ่งเป็น 2 ประเภท:

| ประเภท | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| **Built-in Tools** | เครื่องมือที่ xAI ดูแล รันอัตโนมัติ | Web Search, X Search, Code Execution |
| **Function Calling** | ฟังก์ชันที่คุณเขียนเอง ให้ Grok เรียกใช้ | ดึงข้อมูลจาก Database, เรียก API |

---

## วิธีการทำงานของ Tools

เมื่อเปิดใช้ Tools กระบวนการทำงานเป็นดังนี้:

```
1. Grok วิเคราะห์คำถาม
2. ตัดสินใจว่าต้องใช้ Tool ไหน
3. เรียกใช้ Tool (หรือขอให้คุณเรียก ถ้าเป็น Function Calling)
4. ประมวลผลผลลัพธ์
5. ทำซ้ำจนกว่าจะได้ข้อมูลครบ
6. ส่งคำตอบสุดท้ายพร้อม Citation
```

---

## Web Search — ค้นหาจากอินเทอร์เน็ต

อ้างอิง: [Web Search](https://docs.x.ai/developers/tools/web-search)

### หัวข้อนี้คืออะไร?
ให้ Grok ค้นหาข้อมูลจากอินเทอร์เน็ตได้ แก้ปัญหาข้อจำกัด Knowledge Cutoff ทำให้ตอบเรื่องข่าวสารล่าสุดได้

### ราคา: **$5 ต่อ 1,000 calls**

### วิธีใช้งาน

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ข่าวล่าสุดเกี่ยวกับ AI ในไทย?"}],
    tools=[{"type": "web_search"}],
)

print(response.output_text)
```

### Image Understanding ใน Web Search

Grok สามารถวิเคราะห์ภาพที่พบในผลการค้นหาได้:

```python
tools=[
    {
        "type": "web_search",
        "image_understanding": True,  # เปิดการวิเคราะห์ภาพ
    }
]
```

> ภาพที่วิเคราะห์จะคิดค่าเป็น Image Tokens ไม่ใช่ Tool Invocation

### Citations
Web Search จะส่งคืน Citations (แหล่งอ้างอิง URL) อัตโนมัติพร้อมคำตอบ

---

## X Search — ค้นหาใน X (Twitter)

อ้างอิง: [X Search](https://docs.x.ai/developers/tools/x-search)

### หัวข้อนี้คืออะไร?
ค้นหาโพสต์ ผู้ใช้ และเธรดบน X (Twitter) ได้โดยตรง

### ราคา: **$5 ต่อ 1,000 calls**

### วิธีใช้งาน

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ความคิดเห็นของคนเกี่ยวกับ iPhone 17?"}],
    tools=[{"type": "x_search"}],
)
```

### Video Understanding ใน X Search

```python
tools=[
    {
        "type": "x_search",
        "video_understanding": True,  # เปิดการวิเคราะห์วิดีโอ
    }
]
```

---

## Code Execution — รันโค้ด Python

อ้างอิง: [Code Execution](https://docs.x.ai/developers/tools/code-execution)

### หัวข้อนี้คืออะไร?
ให้ Grok รันโค้ด Python ได้จริงในสภาพแวดล้อม Sandbox ทำให้วิเคราะห์ข้อมูล คำนวณ หรือสร้างกราฟได้

### ราคา: **$5 ต่อ 1,000 calls**

### ใช้ทำอะไร?
- วิเคราะห์ข้อมูลจากไฟล์ CSV
- คำนวณทางคณิตศาสตร์
- สร้างกราฟและแผนภูมิ
- ทดสอบโค้ด
- ประมวลผลข้อมูล

### วิธีใช้งาน

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "คำนวณค่าเฉลี่ย, median, และ standard deviation ของ [23, 45, 12, 67, 89, 34, 56]"
    }],
    tools=[{"type": "code_interpreter"}],
)

print(response.output_text)
# Grok จะเขียนโค้ด Python รันจริง แล้วแสดงผล
```

---

## Collections Search (RAG) — ค้นหาในเอกสารของคุณ

อ้างอิง: [Collections Search](https://docs.x.ai/developers/tools/collections-search)

### หัวข้อนี้คืออะไร?
ให้ Grok ค้นหาข้อมูลจาก Collections (คลังเอกสาร) ที่คุณอัปโหลดไว้ เหมาะสำหรับ Knowledge Base และ FAQ

### ราคา: **$2.50 ต่อ 1,000 calls**

### วิธีใช้งาน

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "วิธีขอลาป่วยทำอย่างไร?"}],
    tools=[
        {
            "type": "collections_search",
            "vector_store_ids": ["vs_your_collection_id"],
        }
    ],
)
```

---

## Function Calling — เรียกฟังก์ชันของตัวเอง

อ้างอิง: [Function Calling](https://docs.x.ai/developers/tools/function-calling)

### หัวข้อนี้คืออะไร?
บอก Grok ว่ามีฟังก์ชันอะไรบ้าง แล้ว Grok จะเรียกฟังก์ชันนั้นเมื่อจำเป็น คุณรับ Request จาก Grok แล้วส่งผลกลับไป

### ใช้ทำอะไร?
- ดึงข้อมูลราคาหุ้น Realtime
- เรียกใช้ Database ภายในองค์กร
- ส่งอีเมล/SMS
- เรียก API ภายนอกที่ไม่มีใน Built-in Tools

### ขั้นตอนการทำงาน

```
1. คุณบอก Grok ว่ามีฟังก์ชัน get_stock_price(symbol)
2. User ถามว่า "ราคา Apple อยู่ที่เท่าไหร่?"
3. Grok ส่งกลับมาว่า "ขอเรียก get_stock_price('AAPL')"
4. คุณเรียก API จริง ได้ราคา $195.50
5. คุณส่งราคากลับไปให้ Grok
6. Grok ตอบว่า "Apple (AAPL) ราคาปัจจุบัน $195.50"
```

### วิธีใช้งาน

```python
import json
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# กำหนด Tools ที่มี
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "ดูสภาพอากาศในเมืองที่ระบุ",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "ชื่อเมือง เช่น กรุงเทพมหานคร"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# ส่งคำถามครั้งแรก
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "อากาศกรุงเทพวันนี้เป็นอย่างไร?"}],
    tools=tools,
)

# ถ้า Grok ต้องการเรียก Function
if response.output[0].type == "function_call":
    function_call = response.output[0]
    args = json.loads(function_call.arguments)
    
    # เรียกฟังก์ชันจริง (ตัวอย่าง)
    weather_result = {"temperature": 35, "condition": "ร้อนและชื้น"}
    
    # ส่งผลกลับให้ Grok
    final_response = client.responses.create(
        model="grok-4.3",
        input=[
            {"role": "user", "content": "อากาศกรุงเทพวันนี้เป็นอย่างไร?"},
            {"role": "assistant", "content": None, "tool_calls": [function_call]},
            {
                "role": "tool",
                "tool_call_id": function_call.call_id,
                "content": json.dumps(weather_result),
            },
        ],
        tools=tools,
    )
    
    print(final_response.output_text)
```

---

## Remote MCP Tools — เชื่อมต่อ MCP Server

อ้างอิง: [Remote MCP Tools](https://docs.x.ai/developers/tools/remote-mcp)

### หัวข้อนี้คืออะไร?
**MCP (Model Context Protocol)** คือมาตรฐานเปิดที่ให้ AI เชื่อมต่อกับเครื่องมือและข้อมูลภายนอกผ่าน Protocol ที่เป็นมาตรฐาน

### ใช้ทำอะไร?
- เชื่อมต่อกับ API ภายในองค์กร
- ใช้เครื่องมือ Third-party ที่รองรับ MCP
- สร้าง Gateway สำหรับ Tools หลายตัว

### ราคา
ไม่มีค่า Tool Invocation — คิดแค่ Token ที่ใช้

### วิธีใช้งาน

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ดึงข้อมูลออเดอร์ล่าสุด"}],
    tools=[
        {
            "type": "mcp",
            "server_url": "https://your-mcp-server.com/mcp",
            "headers": {"Authorization": "Bearer YOUR_MCP_TOKEN"},
        }
    ],
)
```

---

## ใช้หลาย Tools พร้อมกัน

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "ข่าวล่าสุดเกี่ยวกับ Tesla บน X และเว็บ?"}],
    tools=[
        {"type": "web_search"},
        {"type": "x_search"},
        {"type": "code_interpreter"},
    ],
    stream=True,
)
```

---

## ราคาสรุป Tools

| Tool | ราคา |
|---|---|
| Web Search | $5 / 1,000 calls |
| X Search | $5 / 1,000 calls |
| Code Execution | $5 / 1,000 calls |
| File Attachments | $10 / 1,000 calls |
| Collections Search | $2.50 / 1,000 calls |
| Image Understanding | คิดตาม Image Token |
| Remote MCP | คิดตาม Token เท่านั้น |
