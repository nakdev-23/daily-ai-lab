---
title: "Code Execution และ Tools อื่นๆ ใน Gemini API"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "รู้จัก built-in tools ของ Gemini API ทั้ง Code Execution สำหรับรัน Python, URL Context สำหรับอ่านเว็บ, Google Maps และ Computer Use สำหรับควบคุมคอมพิวเตอร์"
readTime: "9 นาที"
readers: "0"
locked: false
order: 30
---

# Code Execution และ Tools อื่นๆ ใน Gemini API

Gemini API มี **built-in tools** (เครื่องมือในตัว — พร้อมใช้งานทันทีโดยไม่ต้องสร้างเอง) ที่ให้โมเดลทำสิ่งต่างๆ ได้เกินกว่าการตอบคำถามทั่วไป บทนี้ครอบคลุม Code Execution, URL Context, Google Maps และ Computer Use

---

## Code Execution Tool (เครื่องมือรันโค้ด)

### ทำงานอย่างไร?

เมื่อเปิด Code Execution tool, Gemini สามารถ:
1. **เขียนโค้ด Python** ตามที่ต้องการ
2. **รันโค้ดจริง** ในสภาพแวดล้อม sandbox (พื้นที่ทดสอบแยกออกจากระบบหลัก — ปลอดภัย)
3. **ดูผลลัพธ์** และปรับแก้หากผิดพลาด
4. **ตอบผู้ใช้** ด้วยคำตอบที่ผ่านการคำนวณจริง

### เปิดใช้ Code Execution

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="คำนวณ factorial (แฟกทอเรียล — ผลคูณของตัวเลขทั้งหมดตั้งแต่ 1 ถึง n) ของ 15 และหาผลรวมของ prime numbers (จำนวนเฉพาะ) ที่น้อยกว่า 100",
    config={
        "tools": [{"code_execution": {}}]
    }
)

# ดู code ที่รันและผลลัพธ์
for part in response.candidates[0].content.parts:
    if hasattr(part, 'executable_code'):
        print("--- Code ที่รัน ---")
        print(part.executable_code.code)
    elif hasattr(part, 'code_execution_result'):
        print("--- ผลลัพธ์ ---")
        print(part.code_execution_result.output)
    else:
        print("--- คำตอบ ---")
        print(part.text)
```

### ตัวอย่าง Output

```
--- Code ที่รัน ---
import math

# Factorial of 15
fact_15 = math.factorial(15)
print(f"Factorial of 15: {fact_15}")

# Sum of primes < 100
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5)+1):
        if n % i == 0: return False
    return True

primes = [n for n in range(2, 100) if is_prime(n)]
print(f"Sum of primes < 100: {sum(primes)}")

--- ผลลัพธ์ ---
Factorial of 15: 1307674368000
Sum of primes < 100: 1060

--- คำตอบ ---
Factorial ของ 15 = 1,307,674,368,000
และผลรวมของ prime numbers ที่น้อยกว่า 100 = 1,060
```

### วิเคราะห์ข้อมูลด้วย Code Execution

```python
csv_data = """
product,sales,revenue
สินค้า A,150,45000
สินค้า B,230,69000
สินค้า C,89,26700
สินค้า D,310,93000
"""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"วิเคราะห์ข้อมูลนี้และสร้างสถิติสรุป:\n{csv_data}",
    config={"tools": [{"code_execution": {}}]}
)
```

### ข้อมูลสำคัญเกี่ยวกับ Code Execution

| ข้อมูล | รายละเอียด |
|---|---|
| ภาษา | Python เท่านั้น (รัน), ภาษาอื่น (เขียนได้แต่ไม่รัน) |
| เวลา timeout (หมดเวลา) | 30 วินาที |
| จำนวน retry (ลองใหม่) | สูงสุด 5 ครั้ง |
| Libraries (ไลบรารี — ชุดเครื่องมือโค้ด) | 40+ รวมถึง NumPy, Pandas, Matplotlib, TensorFlow, sklearn |
| ติดตั้งเพิ่มไม่ได้ | ใช้ได้แค่ libraries ที่ให้มา |
| ค่าใช้จ่าย | ราคา token ปกติ (ไม่มีค่าพิเศษ) |

### Libraries ที่มีให้ใช้

```
ข้อมูล:        pandas, numpy, scipy
visualization: matplotlib, seaborn, plotly
ML/AI:         scikit-learn, tensorflow, torch
utilities:     datetime, json, re, math, statistics
web:           requests, beautifulsoup4
text:          nltk, spacy
```

---

## URL Context Tool (เครื่องมืออ่านเนื้อหาจาก URL)

ให้ Gemini อ่านเนื้อหาจาก URL (ที่อยู่เว็บไซต์) และนำมาตอบ:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="สรุปบทความนี้: https://example.com/article/ai-news-2025",
    config={
        "tools": [{"url_context": {}}]
    }
)
```

### ใช้กับหลาย URL พร้อมกัน

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        "เปรียบเทียบเนื้อหาจาก 2 URL นี้:",
        "https://site1.com/article",
        "https://site2.com/article"
    ],
    config={"tools": [{"url_context": {}}]}
)
```

### URL Context vs Grounding with Search

| | URL Context | Grounding with Search |
|---|---|---|
| ใช้สำหรับ | อ่าน URL ที่ระบุ | ค้นหา Google แล้วอ่าน |
| ควบคุม source (แหล่งข้อมูล) | ✓ คุณเลือก URL | ✗ Gemini เลือกเอง |
| เหมาะกับ | อ่านบทความเฉพาะ | ข้อมูล real-time ทั่วไป |

---

## Google Maps Tool (เครื่องมือค้นหาสถานที่)

ให้ Gemini ค้นหาข้อมูลสถานที่:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="หาร้านอาหารไทยในย่าน Silom กรุงเทพ ที่มีเวลาเปิดถึงดึก",
    config={
        "tools": [{"google_maps": {}}]
    }
)
```

### ความสามารถของ Google Maps Tool

- ค้นหาสถานที่, ร้านอาหาร, ธุรกิจ
- ดูเวลาเปิด-ปิด, rating (คะแนนรีวิว), รีวิว
- หาเส้นทาง
- ดูข้อมูล address (ที่อยู่) และ contact (ช่องทางติดต่อ)

---

## Computer Use Tool (เครื่องมือควบคุมคอมพิวเตอร์, Preview)

ความสามารถขั้นสูงที่ให้ Gemini ควบคุม UI (ส่วนติดต่อผู้ใช้ — หน้าจอที่เห็นและคลิกได้) ของคอมพิวเตอร์:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        screenshot_image,
        "คลิกปุ่ม Submit ในหน้าจอนี้"
    ],
    config={
        "tools": [{"computer_use": {}}]
    }
)

# Gemini ตอบด้วย action (การกระทำ) ที่ควรทำ
action = response.candidates[0].content.parts[0].computer_use
print(f"Action: {action.type}")      # "click"
print(f"Coordinate: {action.coordinate}")  # [x, y]
```

### Computer Use ทำอะไรได้?

| Action (การกระทำ) | รายละเอียด |
|---|---|
| `click` | คลิก element (องค์ประกอบ) ในหน้าจอ |
| `type` | พิมพ์ข้อความ |
| `scroll` | เลื่อนหน้าจอ |
| `key` | กดปุ่ม keyboard (แป้นพิมพ์) |
| `screenshot` | ถ่าย screenshot (ภาพหน้าจอ) |

> **ข้อสังเกต:** Computer Use ยังอยู่ใน Preview (ช่วงทดสอบ) ใช้งานอย่างระมัดระวัง เหมาะสำหรับ automation (ระบบอัตโนมัติ) และ testing (การทดสอบ)

---

## ใช้ Tools หลายอันพร้อมกัน

สามารถรวม tools ได้ใน request เดียว:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="วิเคราะห์ data จาก URL นี้และสร้างกราฟ: https://data.example.com/sales.csv",
    config={
        "tools": [
            {"url_context": {}},      # อ่าน URL
            {"code_execution": {}}    # สร้างกราฟด้วย Python
        ]
    }
)
```

### ลำดับที่ Gemini จัดการ Tools

```
1. อ่าน URL → ดึง data (ข้อมูล)
2. เขียน Python code (pandas + matplotlib)
3. รัน code → สร้างกราฟ
4. ตอบผู้ใช้พร้อมกราฟและ analysis (การวิเคราะห์)
```

---

## สรุป: เลือก Tool ไหน?

| ต้องการทำอะไร | Tool ที่ใช้ |
|---|---|
| รัน Python, คำนวณ, วิเคราะห์ข้อมูล | Code Execution |
| อ่านบทความจาก URL | URL Context |
| ค้นหาข้อมูล real-time จากเว็บ | Grounding with Search |
| เชื่อมกับ API ของตัวเอง | Function Calling |
| ค้นหาสถานที่ | Google Maps |
| ควบคุม UI (หน้าจอ) | Computer Use |
| เก็บ/เรียก vector (ตัวเลขแทนความหมาย) | Embeddings |
| ประหยัด token (ลดต้นทุน) | Context Caching |
