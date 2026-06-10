---
title: "Function Calling — เชื่อม Gemini กับ API และ Tools"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Function Calling ช่วยให้ Gemini เรียกใช้ฟังก์ชันในแอปของคุณเพื่อดึงข้อมูล real-time หรือทำ action ต่างๆ เหมือนมี AI agent ควบคุมระบบ"
readTime: "10 นาที"
readers: "0"
locked: false
order: 23
---

# Function Calling — เชื่อม Gemini กับ API และ Tools

**Function Calling** (การเรียกใช้ฟังก์ชัน — ให้ AI บอกว่าควรเรียกคำสั่งอะไรในแอปของคุณ) คือความสามารถที่ให้ Gemini ระบุว่าควร "เรียกฟังก์ชันอะไร" และ "ด้วยพารามิเตอร์อะไร" แทนที่จะตอบจากความรู้เพียงอย่างเดียว — ทำให้ Gemini กลายเป็น AI agent (ตัวแทน AI ที่สามารถกระทำการต่างๆ ได้) ที่สามารถโต้ตอบกับโลกภายนอกได้

> **สำคัญ:** Gemini ไม่ได้ "รัน" ฟังก์ชันเอง แต่บอกว่า "ควรเรียกฟังก์ชันนี้ด้วย argument (ค่าที่ส่งเข้าฟังก์ชัน) เหล่านี้" แล้วให้แอปของคุณรันและส่งผลกลับมา

---

## ทำไมต้องใช้ Function Calling?

| กรณีการใช้งาน | ตัวอย่าง |
|---|---|
| ดึงข้อมูล real-time (ข้อมูลปัจจุบัน) | อัตราแลกเปลี่ยน, ราคาหุ้น, สภาพอากาศ |
| ทำ action (กระทำการ) | ส่งอีเมล, บันทึกข้อมูลใน database (ฐานข้อมูล) |
| เชื่อมกับ API (ช่องทางเชื่อมต่อโปรแกรม) | เรียก REST API ภายในองค์กร |
| คำนวณ | รัน code สำหรับ math หรือ data processing (ประมวลผลข้อมูล) |
| ควบคุม IoT (อุปกรณ์เชื่อมต่ออินเทอร์เน็ต) | เปิด/ปิดอุปกรณ์สมาร์ทโฮม |

---

## วิธีการทำงานของ Function Calling

กระบวนการมี 4 ขั้นตอน:

```
1. คุณ: กำหนด function declarations (คำอธิบายฟังก์ชัน) + ส่ง user prompt
        ↓
2. Gemini: วิเคราะห์ว่าควรเรียก function ไหน และด้วย args (ค่าพารามิเตอร์) อะไร
        ↓
3. คุณ: รัน function จริงๆ และรับผลลัพธ์
        ↓
4. Gemini: นำผลลัพธ์มาสร้างคำตอบให้ผู้ใช้
```

---

## การกำหนด Function Declaration (คำอธิบายฟังก์ชัน)

Function declaration ใช้รูปแบบ JSON Schema (โครงสร้างข้อมูล JSON มาตรฐาน):

```python
tools = [
    {
        "function_declarations": [
            {
                "name": "get_weather",
                "description": "ดูสภาพอากาศปัจจุบันของเมืองที่ระบุ",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {
                            "type": "string",
                            "description": "ชื่อเมือง เช่น Bangkok, Chiang Mai"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "หน่วยอุณหภูมิ"
                        }
                    },
                    "required": ["city"]
                }
            }
        ]
    }
]
```

---

## ตัวอย่างโค้ดเต็ม (Python)

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# กำหนด function ที่แอปของคุณรันจริง
def get_weather(city: str, unit: str = "celsius") -> dict:
    # ในจริงจะเรียก Weather API
    return {
        "city": city,
        "temperature": 32,
        "unit": unit,
        "condition": "Partly cloudy",
        "humidity": 75
    }

# Function declarations สำหรับบอก Gemini
tools = [{
    "function_declarations": [{
        "name": "get_weather",
        "description": "ดูสภาพอากาศปัจจุบัน",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "ชื่อเมือง"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }]
}]

# ส่ง prompt + tools
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="อากาศที่กรุงเทพวันนี้เป็นอย่างไร?",
    config={"tools": tools}
)

# ตรวจสอบว่า Gemini ขอเรียก function
if response.candidates[0].content.parts[0].function_call:
    func_call = response.candidates[0].content.parts[0].function_call
    
    # รัน function จริง
    result = get_weather(**func_call.args)
    
    # ส่งผลกลับให้ Gemini
    final_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            {"role": "user", "parts": [{"text": "อากาศที่กรุงเทพวันนี้เป็นอย่างไร?"}]},
            {"role": "model", "parts": [{"function_call": func_call}]},
            {"role": "tool", "parts": [{"function_response": {
                "name": func_call.name,
                "response": result
            }}]}
        ],
        config={"tools": tools}
    )
    
    print(final_response.text)
```

---

## Parallel Function Calling (เรียกหลาย function พร้อมกัน)

Gemini สามารถเรียกหลาย function พร้อมกันในการตอบครั้งเดียว:

```
User: "บอกสภาพอากาศที่กรุงเทพ, เชียงใหม่ และภูเก็ต"

Gemini เรียก:
→ get_weather("Bangkok")      (พร้อมกัน)
→ get_weather("Chiang Mai")   (พร้อมกัน)
→ get_weather("Phuket")       (พร้อมกัน)
```

แต่ละ function call มี `id` (รหัสระบุ) ที่ไม่ซ้ำกัน เพื่อ map (จับคู่) กลับกับ response

---

## Compositional Function Calling (เรียกฟังก์ชันต่อเนื่องกัน)

Function calls ที่ต้องอาศัยผลลัพธ์ของกันและกัน:

```
User: "หาร้านอาหารแนะนำใกล้ฉัน"

Step 1: Gemini เรียก get_location() → Bangkok
Step 2: Gemini เรียก search_restaurants(location="Bangkok") → รายการร้าน
Step 3: Gemini ตอบพร้อมคำแนะนำ
```

---

## Automatic Function Calling (Python เท่านั้น)

Python SDK (ชุดเครื่องมือนักพัฒนา) รองรับการเรียก function อัตโนมัติ — ไม่ต้องจัดการ loop (วนซ้ำ) เอง:

```python
from google import genai

def get_stock_price(ticker: str) -> float:
    """ดูราคาหุ้น
    
    Args:
        ticker: ชื่อหุ้น เช่น AAPL, GOOGL
    
    Returns:
        ราคาปิดล่าสุด
    """
    # ในจริงจะเรียก Stock API
    return 150.25

client = genai.Client(api_key="YOUR_API_KEY")

# ส่ง Python function โดยตรง — SDK จัดการ declaration และ execution ให้
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="ราคาหุ้น AAPL ตอนนี้เท่าไหร่?",
    config={"tools": [get_stock_price]}  # ส่ง function object โดยตรง
)

print(response.text)
```

---

## Best Practices (แนวปฏิบัติที่ดีที่สุด)

### 1. เขียน description ให้ชัดเจน
```python
# ไม่ดี
"description": "get data"

# ดี
"description": "ดึงข้อมูลยอดขายรายวันจากระบบ CRM (ระบบจัดการลูกค้าสัมพันธ์) สำหรับช่วงวันที่ที่ระบุ รองรับ filter (กรอง) ตาม product category และ sales region"
```

### 2. จำกัดจำนวน functions ต่อ request (คำขอ)
- แนะนำ **10-20 functions** ต่อ request สูงสุด
- มากเกินไปทำให้ Gemini เลือกยากและอาจเลือกผิด

### 3. ใช้ temperature (ค่าความสร้างสรรค์) ต่ำสำหรับ function calling
```python
config = {
    "temperature": 0.1,  # ต่ำ = คาดเดาได้ = เลือก function ถูกต้องกว่า
    "tools": tools
}
```

### 4. Validate (ตรวจสอบ) ก่อน execute (ดำเนินการ)
```python
# สำหรับ action สำคัญ ให้ขอยืนยันก่อนทำ
if func_call.name == "delete_user":
    if confirm_with_user():  # ถามผู้ใช้ก่อน
        execute_delete(func_call.args)
```

### 5. Error handling (จัดการข้อผิดพลาด)
```python
try:
    result = run_function(func_call)
except Exception as e:
    result = {"error": str(e)}
    # ส่ง error กลับให้ Gemini จัดการ — มันจะอธิบายปัญหาให้ผู้ใช้
```

---

## Function Calling vs Grounding with Search

| | Function Calling | Grounding with Search |
|---|---|---|
| ใช้งาน | เรียก API/tools ที่กำหนดเอง | ค้นหา Google Search |
| ตั้งค่า | ต้องกำหนด declarations | เปิด flag (สัญญาณ) เดียว |
| ข้อมูล | จากระบบของคุณ | จากเว็บ |
| เหมาะกับ | ข้อมูล internal (ภายในองค์กร), action | ข้อมูล real-time, ข่าว |
