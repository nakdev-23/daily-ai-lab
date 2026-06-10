---
title: "Function Calling — เชื่อม Grok กับ API และข้อมูลภายนอก"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Function Calling ให้ Grok เรียกใช้ฟังก์ชันที่คุณกำหนด เพื่อดึงข้อมูล Real-time ส่งอีเมล อัปเดต Database หรือทำงานกับ API ภายนอกได้ทุกอย่าง"
readTime: "8 นาที"
readers: "0"
locked: false
order: 23
---
# Function Calling — เชื่อม Grok กับ API และข้อมูลภายนอก

> อ้างอิง: [Function Calling Docs](https://docs.x.ai/docs) | [Tools Overview](https://docs.x.ai/docs)

---

## Function Calling คืออะไร?

**Function Calling** (การเรียกใช้ฟังก์ชัน — ให้ Grok ขอให้โปรแกรมของคุณทำงานบางอย่างแล้วส่งผลกลับมา) ให้คุณบอก Grok ว่ามีฟังก์ชันอะไรให้ใช้ เมื่อ Grok ต้องการข้อมูลที่ไม่มีใน Training data มันจะ "ขอ" ให้คุณเรียกฟังก์ชันนั้น แล้วส่งผลกลับมาให้ก่อนตอบ

```
User: "ราคา AAPL ตอนนี้เท่าไหร่?"
    ↓
Grok: "ขอเรียก get_stock_price('AAPL')"
    ↓
คุณ: เรียก API จริง → ได้ราคา $195.50
    ↓
คุณ: ส่งราคากลับให้ Grok
    ↓
Grok: "Apple (AAPL) ราคาปัจจุบัน $195.50 (ณ 14:32 น.)"
```

### ทำไมไม่ให้ Grok เรียกเอง?

- **ความปลอดภัย** — คุณควบคุมว่าจะอนุญาตให้ทำอะไรได้บ้าง
- **Authentication** (การยืนยันตัวตน) — Grok ไม่มีสิทธิ์เข้าถึง API ส่วนตัวของคุณ
- **Side Effects** (ผลข้างเคียง — การกระทำที่เปลี่ยนแปลงสภาพจริง เช่น ส่งอีเมล) — คุณ validate (ตรวจสอบ) ก่อนทำ action จริง

---

## การทำงานแบบ Step-by-Step

```
Step 1: คุณกำหนด tool schema (แบบแผนของเครื่องมือ — ชื่อ, description, parameters)
Step 2: ส่ง request พร้อม tools ไปให้ Grok
Step 3: Grok ส่ง tool_call กลับมา (ถ้าจำเป็น)
Step 4: คุณเรียกฟังก์ชันจริงและได้ผลลัพธ์
Step 5: ส่งผลลัพธ์กลับให้ Grok
Step 6: Grok ตอบคำถามสุดท้าย
```

---

## ตัวอย่างพื้นฐาน — ดูราคาหุ้น

```python
import json
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Step 1: กำหนด Tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "ดูราคาหุ้นปัจจุบันของหุ้นที่ระบุ",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Ticker symbol (รหัสย่อหุ้น) ของหุ้น เช่น AAPL, GOOGL, PTT.BK",
                    },
                    "currency": {
                        "type": "string",
                        "enum": ["USD", "THB"],
                        "description": "สกุลเงินที่ต้องการ",
                    },
                },
                "required": ["symbol"],
            },
        },
    }
]

# ฟังก์ชันจริงของคุณ (ตัวอย่าง)
def get_stock_price(symbol: str, currency: str = "USD") -> dict:
    # จริงๆ ควรเรียก Stock API เช่น Yahoo Finance, Alpha Vantage
    mock_prices = {
        "AAPL": 195.50,
        "GOOGL": 140.25,
        "PTT.BK": 32.75,
    }
    price = mock_prices.get(symbol.upper(), 0)
    return {
        "symbol": symbol,
        "price": price,
        "currency": currency,
        "timestamp": "2025-06-10T14:32:00Z"
    }

# Step 2: ส่ง Request
messages = [{"role": "user", "content": "ราคาหุ้น Apple และ PTT ตอนนี้เท่าไหร่?"}]

response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
)

# Step 3: ตรวจสอบว่า Grok ต้องการเรียก Function ไหม
while response.choices[0].finish_reason == "tool_calls":
    tool_calls = response.choices[0].message.tool_calls
    
    # เพิ่ม assistant message (ที่มี tool_calls) ลง history
    messages.append(response.choices[0].message)
    
    # Step 4: เรียกทุก Function ที่ Grok ขอ
    for tool_call in tool_calls:
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)
        
        print(f"Grok ขอเรียก: {function_name}({function_args})")
        
        if function_name == "get_stock_price":
            result = get_stock_price(**function_args)
        
        # Step 5: ส่งผลกลับ
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result, ensure_ascii=False),
        })
    
    # Step 6: ส่งใหม่พร้อมผลลัพธ์
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=messages,
        tools=tools,
    )

# แสดงคำตอบสุดท้าย
print(response.choices[0].message.content)
```

---

## Parallel Function Calling

**Parallel Function Calling** (การเรียกหลายฟังก์ชันพร้อมกัน — ประหยัดเวลาแทนที่จะเรียกทีละอัน):

```python
# Grok สามารถเรียก get_stock_price("AAPL") และ get_stock_price("GOOGL") พร้อมกัน
# ไม่ต้องรอทีละอัน

# Process ทุก tool calls ก่อน แล้วค่อยส่งผลรวมกลับไป
tool_results = []
for tool_call in tool_calls:
    result = execute_function(tool_call)
    tool_results.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result),
    })

# ส่งทุกผลพร้อมกัน
messages.extend(tool_results)
```

---

## Tool Choice — ควบคุมการใช้ Function

**Tool Choice** (การกำหนดว่า Grok จะเรียกฟังก์ชันหรือไม่):

```python
# auto (default) — Grok ตัดสินใจเอง
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

# required — บังคับให้เรียก function อย่างน้อย 1 ตัว
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice="required",
)

# none — ห้ามเรียก function เลย
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice="none",
)

# บังคับเรียก function เฉพาะเจาะจง
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "get_stock_price"},
    },
)
```

---

## ตัวอย่างจริง — AI Assistant ครบวงจร

**Agent Loop** (วงรอบการทำงานของ AI — Grok เรียกฟังก์ชัน ดูผล แล้วตัดสินใจว่าจะทำอะไรต่อ):

```python
import json
import smtplib
import requests
from datetime import datetime
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# --- กำหนด Tools หลายตัว ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "ดูสภาพอากาศของเมืองที่ระบุ",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "ชื่อเมือง"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["city"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "ส่งอีเมลถึงผู้รับที่ระบุ",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {"type": "string", "description": "อีเมลผู้รับ"},
                    "subject": {"type": "string", "description": "หัวข้ออีเมล"},
                    "body": {"type": "string", "description": "เนื้อหาอีเมล"},
                },
                "required": ["to", "subject", "body"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "ดูวันที่และเวลาปัจจุบัน",
            "parameters": {
                "type": "object",
                "properties": {
                    "timezone": {"type": "string", "description": "เช่น Asia/Bangkok"},
                },
                "required": [],
            },
        },
    },
]

# --- Implement Functions ---
def get_weather(city: str, unit: str = "celsius") -> dict:
    return {"city": city, "temp": 35, "unit": unit, "condition": "ร้อนและชื้น"}

def send_email(to: str, subject: str, body: str) -> dict:
    # จริงๆ ใช้ smtplib หรือ SendGrid API
    print(f"[Simulation] ส่งอีเมลถึง {to}: {subject}")
    return {"status": "sent", "to": to, "timestamp": datetime.now().isoformat()}

def get_current_time(timezone: str = "Asia/Bangkok") -> dict:
    return {"datetime": datetime.now().isoformat(), "timezone": timezone}

FUNCTION_MAP = {
    "get_weather": get_weather,
    "send_email": send_email,
    "get_current_time": get_current_time,
}

# --- Agent Loop ---
def run_agent(user_message: str) -> str:
    messages = [
        {"role": "system", "content": "คุณเป็น AI Assistant ที่ช่วยจัดการงานและให้ข้อมูล"},
        {"role": "user", "content": user_message},
    ]
    
    for _ in range(10):  # max 10 rounds (รอบสูงสุด — ป้องกัน infinite loop)
        response = client.chat.completions.create(
            model="grok-4.3",
            messages=messages,
            tools=tools,
        )
        
        if response.choices[0].finish_reason != "tool_calls":
            return response.choices[0].message.content
        
        # Process tool calls
        messages.append(response.choices[0].message)
        
        for tool_call in response.choices[0].message.tool_calls:
            fn = FUNCTION_MAP.get(tool_call.function.name)
            args = json.loads(tool_call.function.arguments)
            result = fn(**args) if fn else {"error": "function not found"}
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result, ensure_ascii=False),
            })
    
    return "หมดรอบแล้ว"

# ทดสอบ
print(run_agent("อากาศกรุงเทพวันนี้เป็นยังไง? แล้วส่งรายงานให้ boss@company.com ด้วย"))
```

---

## Pydantic สำหรับ Type-safe Tools

**Type-safe** (ปลอดภัยในแง่ชนิดข้อมูล — รับประกันว่าข้อมูลที่รับมาถูกชนิดเสมอ):

```python
from pydantic import BaseModel, Field
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

class SearchParams(BaseModel):
    query: str = Field(description="คำค้นหา")
    max_results: int = Field(default=10, ge=1, le=100, description="จำนวนผลลัพธ์สูงสุด")
    language: str = Field(default="th", description="ภาษา เช่น th, en")

# แปลง Pydantic → JSON Schema อัตโนมัติ
tool_schema = {
    "type": "function",
    "function": {
        "name": "search_database",
        "description": "ค้นหาข้อมูลในฐานข้อมูล",
        "parameters": SearchParams.model_json_schema(),
    },
}
```

---

## ข้อควรระวัง

- **Validate ก่อนทำ** — ตรวจสอบ arguments (ค่าที่ Grok ส่งมา) เสมอ อาจมีค่าผิดปกติ
- **Handle Errors** (จัดการข้อผิดพลาด) — ถ้าเรียก Function แล้ว error ให้ส่ง error message กลับไปด้วย
- **Max 200 tools** — ใส่ tool ไม่เกิน 200 ตัวต่อ request
- **Description สำคัญ** — Grok ตัดสินใจเรียก function จาก description (คำอธิบาย) ต้องเขียนชัดเจน
- **Circular loops** (การวนซ้ำไม่รู้จบ) — ตั้ง max iterations (จำนวนรอบสูงสุด) เพื่อป้องกัน infinite loop
