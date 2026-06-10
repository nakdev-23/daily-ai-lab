---
title: "Tool Use และ Function Calling — ให้ Claude เรียกใช้ฟังก์ชัน"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "เรียนรู้วิธีให้ Claude เรียกใช้ฟังก์ชันและ API ภายนอก ครอบคลุม client tools, server tools, tool choice และ agentic loop ทั้งหมด"
readTime: "12 นาที"
readers: "0"
locked: false
order: 11
---

## Tool Use คืออะไร?

Tool use (หรือ function calling — การเรียกใช้ฟังก์ชัน — ความสามารถของ AI ในการสั่งให้โปรแกรมทำงานบางอย่างแทนการตอบแค่ข้อความ) คือความสามารถที่ทำให้ Claude สามารถ **เรียกใช้ฟังก์ชันที่คุณกำหนด** ได้ แทนที่จะตอบแค่ข้อความ Claude จะส่งคำสั่งกลับมาว่าต้องการเรียกฟังก์ชันอะไร พร้อม argument (ค่าพารามิเตอร์ที่ส่งเข้าฟังก์ชัน) ที่ถูกต้อง

ตัวอย่าง: ถ้าคุณถาม Claude ว่า "อากาศที่กรุงเทพวันนี้เป็นอย่างไร?" Claude ไม่รู้ข้อมูล real-time (ข้อมูลปัจจุบัน) แต่ถ้าคุณให้ tool `get_weather` ไว้ Claude จะเรียก tool นั้นด้วย argument `{ "location": "Bangkok" }` และนำผลลัพธ์มาตอบ

---

## ประเภทของ Tool

### 1. Client Tools (User-Defined Tools — เครื่องมือที่ผู้ใช้สร้างเอง)

Tools ที่คุณสร้างเองและ **รันในฝั่ง application ของคุณ**

Flow (ขั้นตอนการทำงาน) การทำงาน:
1. คุณส่ง tools definition (คำอธิบายเครื่องมือที่มีให้ Claude เลือกใช้) ไปกับ request
2. Claude ตอบกลับด้วย `stop_reason: "tool_use"` พร้อม `tool_use` block
3. Application ของคุณรัน function จริงๆ
4. ส่ง `tool_result` (ผลลัพธ์จากฟังก์ชัน) กลับไปให้ Claude
5. Claude ตอบด้วยข้อมูลที่ได้

### 2. Server Tools (Anthropic-Provided Tools — เครื่องมือที่ Anthropic มีให้สำเร็จรูป)

Tools ที่ **Anthropic รันให้** คุณไม่ต้องจัดการ execution (การประมวลผล) เอง ได้แก่:
- `web_search` — ค้นหาข้อมูลจากอินเทอร์เน็ต
- `code_execution` — รันโค้ด Python
- `web_fetch` — ดึงข้อมูลจาก URL
- `text_editor` — แก้ไขไฟล์ข้อความ
- `bash` — รันคำสั่ง shell (บรรทัดคำสั่ง)

---

## การกำหนด Tool (Tool Definition)

### โครงสร้างพื้นฐาน

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "ดึงข้อมูลสภาพอากาศปัจจุบันของเมืองที่ระบุ",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "ชื่อเมืองหรือสถานที่ เช่น 'Bangkok, Thailand'"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "หน่วยอุณหภูมิ"
                }
            },
            "required": ["location"]
        }
    }
]

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "อากาศที่กรุงเทพเป็นอย่างไรบ้าง?"}
    ]
)
```

---

## Tool Call Lifecycle (Agentic Loop — วงจรทำงานของ AI อัตโนมัติ)

### ขั้นตอนทั้งหมด

```
1. User → Claude: ส่ง message + tools definition
2. Claude → App:  ส่ง tool_use block (Claude ต้องการข้อมูล)
3. App → Function: รัน function จริงๆ
4. App → Claude:  ส่ง tool_result กลับไป
5. Claude → User: ตอบด้วยข้อมูลจาก tool result
```

### ตัวอย่างโค้ดเต็ม

```python
import anthropic
import json

client = anthropic.Anthropic()

# สมมติฟังก์ชันนี้เชื่อมต่อ weather API จริงๆ
def get_weather(location: str, unit: str = "celsius") -> dict:
    return {
        "location": location,
        "temperature": 32,
        "unit": unit,
        "condition": "sunny",
        "humidity": 75
    }

tools = [
    {
        "name": "get_weather",
        "description": "ดึงข้อมูลสภาพอากาศ",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
]

messages = [{"role": "user", "content": "อากาศที่กรุงเทพเป็นอย่างไร?"}]

# ขั้นที่ 1: ส่ง request แรก
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

# ขั้นที่ 2: ตรวจสอบว่า Claude ต้องการ tool ไหม
if response.stop_reason == "tool_use":
    # หา tool_use block
    tool_use = next(b for b in response.content if b.type == "tool_use")
    
    # ขั้นที่ 3: รัน function
    tool_result = get_weather(**tool_use.input)
    
    # ขั้นที่ 4: ส่ง result กลับ
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": json.dumps(tool_result)
            }
        ]
    })
    
    # ขั้นที่ 5: ขอ Claude ตอบสุดท้าย
    final_response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )
    print(final_response.content[0].text)
```

---

## Tool Choice — ควบคุมการใช้ Tool

### ค่าที่รองรับ

| Tool Choice | ความหมาย |
|-------------|----------|
| `{"type": "auto"}` | Claude ตัดสินใจเองว่าจะใช้ tool หรือตอบตรง (default — ค่าเริ่มต้น) |
| `{"type": "any"}` | Claude ต้องใช้ tool อย่างน้อยหนึ่งอัน |
| `{"type": "tool", "name": "..."}` | บังคับให้ใช้ tool ที่ระบุ |
| `{"type": "none"}` | ห้ามใช้ tool |

```python
# บังคับให้ใช้ specific tool
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "get_weather"},
    messages=[{"role": "user", "content": "สอบถามเรื่องอากาศ"}]
)
```

---

## Strict Tool Use

เพิ่ม `strict: true` เพื่อให้ Claude output (ผลลัพธ์) ตรงตาม schema (โครงสร้างข้อมูลที่กำหนดไว้) 100%:

```python
tools = [
    {
        "name": "create_calendar_event",
        "description": "สร้างนัดหมายในปฏิทิน",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "date": {"type": "string", "format": "date"},
                "time": {"type": "string"}
            },
            "required": ["title", "date", "time"]
        },
        "strict": True  # บังคับให้ output ตรง schema
    }
]
```

---

## Parallel Tool Calls

Claude สามารถเรียก tool หลายอันพร้อมกันในครั้งเดียว เพื่อเพิ่มความเร็ว:

```python
# Claude อาจส่ง tool_use หลายอันในคราวเดียว
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[weather_tool, news_tool, calendar_tool],
    messages=[{
        "role": "user",
        "content": "บอกอากาศ ข่าววันนี้ และนัดหมายพรุ่งนี้"
    }]
)

# ตรวจสอบ tool calls ทั้งหมด
tool_calls = [b for b in response.content if b.type == "tool_use"]
# อาจได้ 3 tool_use blocks พร้อมกัน
```

---

## Server Tools (Anthropic-Provided)

### Web Search Tool

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user", "content": "ข่าวล่าสุดเกี่ยวกับ AI ในปี 2026"}]
)
# Claude จะค้นหาและตอบโดยอัตโนมัติ ไม่ต้องจัดการ execution เอง
```

### ราคา Web Search
- **$10 ต่อ 1,000 searches** (บวกกับ standard token costs — ค่า token ปกติ)

### Code Execution Tool

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=4096,
    tools=[{"type": "code_execution_20250522", "name": "code_execution"}],
    messages=[{
        "role": "user",
        "content": "คำนวณ fibonacci sequence 20 ตัวแรก และพล็อตกราฟ"
    }]
)
```

---

## การ Handle Error ใน Tool Results

```python
# ถ้า function error ให้ส่ง error ใน tool_result
messages.append({
    "role": "user",
    "content": [
        {
            "type": "tool_result",
            "tool_use_id": tool_use.id,
            "content": "Error: ไม่สามารถเชื่อมต่อกับ weather API ได้",
            "is_error": True  # แจ้ง Claude ว่าเกิด error
        }
    ]
})
```

---

## ราคาของ Tool Use

Tool use ทำให้ token เพิ่มขึ้นจาก:

1. **Tools definition** ที่ส่งไปใน `tools` parameter
2. **Tool_use blocks** ใน response ของ Claude
3. **Tool_result blocks** ที่คุณส่งกลับ
4. **System prompt (คำสั่งตั้งต้น) สำหรับ tool** ที่ Anthropic เพิ่มให้อัตโนมัติ

| Model | Tool choice auto/none | Tool choice any/tool |
|-------|----------------------|---------------------|
| Claude Opus 4.8 | +290 tokens | +410 tokens |
| Claude Sonnet 4.6 | +497 tokens | +589 tokens |
| Claude Haiku 4.5 | +496 tokens | +588 tokens |

---

## Best Practices

### 1. เขียน Description ให้ชัดเจน

```python
# ไม่ดี
"description": "get weather"

# ดี
"description": "ดึงข้อมูลสภาพอากาศปัจจุบัน รวมถึงอุณหภูมิ ความชื้น และสภาพท้องฟ้า สำหรับเมืองที่ระบุ"
```

### 2. ระบุ Required Fields อย่างชัดเจน

ใส่ field ที่จำเป็นใน `required` array เสมอ เพื่อให้ Claude รู้ว่าต้องถามข้อมูลอะไรก่อน

### 3. Handle Tool Errors อย่างสวยงาม

เสมอ handle กรณีที่ Claude ส่ง tool_use มาแต่ function ของคุณ error

### 4. จำกัดจำนวน Tool

อย่าให้ tools มากเกินไปในครั้งเดียว เพราะเพิ่ม token และอาจสับสน ใช้เฉพาะที่จำเป็น

### 5. ใช้ Parallel Tool Calls

ให้ Claude เรียก tools หลายอันพร้อมกันได้เพื่อเพิ่มความเร็ว โดยเพิ่ม instruction ใน system prompt:

```
"ถ้ามี tool calls ที่ไม่ขึ้นกัน ให้เรียกพร้อมกันทั้งหมดเพื่อประหยัดเวลา"
```

---

## สรุป

Tool use เป็นหัวใจสำคัญของการสร้าง AI agents (ตัวแทน AI อัตโนมัติ) ด้วย Claude:

| ประเด็น | สรุป |
|--------|------|
| **Client Tools** | คุณรัน function เอง Claude แค่บอกว่าต้องการเรียก tool ใด |
| **Server Tools** | Anthropic รันให้ (web search, code execution) |
| **Tool Choice** | ควบคุมว่า Claude ต้องใช้ tool ไหม |
| **Strict Mode** | บังคับ output ตรงตาม schema |
| **Parallel Calls** | Claude เรียก tools หลายอันพร้อมกันได้ |

เริ่มต้นด้วย client tools ง่ายๆ เช่น weather หรือ database lookup ก่อน แล้วค่อยขยายไปสู่ agentic systems (ระบบ AI อัตโนมัติหลายขั้นตอน) ที่ซับซ้อนมากขึ้น
