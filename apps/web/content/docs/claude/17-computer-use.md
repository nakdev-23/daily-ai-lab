---
title: "Computer Use — Claude ควบคุมคอมพิวเตอร์ได้เองอัตโนมัติ"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Computer Use tool ช่วยให้ Claude มองเห็นหน้าจอ คลิกเมาส์ กดคีย์บอร์ด และทำงานบนคอมพิวเตอร์แทนมนุษย์ได้อัตโนมัติ"
readTime: "10 นาที"
readers: "0"
locked: false
order: 17
---

## Computer Use คืออะไร?

Computer Use เป็น feature (ฟีเจอร์) ของ Claude ที่อนุญาตให้โมเดล (สมองของ AI) **ควบคุม desktop environment** (สภาพแวดล้อมหน้าจอคอมพิวเตอร์) ได้เหมือนมนุษย์ โดยใช้:

- **Screenshot** (การจับภาพหน้าจอ) — มองเห็นสิ่งที่แสดงบนหน้าจอ
- **Mouse control** (การควบคุมเมาส์) — คลิก drag และเลื่อน cursor
- **Keyboard input** (การพิมพ์ผ่านคีย์บอร์ด) — พิมพ์ข้อความและใช้ keyboard shortcuts (ปุ่มลัด)

Claude สามารถทำงานหลายขั้นตอนแบบอัตโนมัติได้ เช่น เปิดโปรแกรม, กรอกฟอร์ม, ท่องเว็บ, และโต้ตอบกับ UI (หน้าตาของโปรแกรม) ใดๆ

> **หมายเหตุ:** Computer Use ยังอยู่ใน beta (เวอร์ชันทดสอบ) ต้องใส่ beta header เพื่อเปิดใช้งาน

---

## ความสามารถหลัก

| ความสามารถ | รายละเอียด |
|-----------|-----------|
| **Screenshot** | จับภาพหน้าจอปัจจุบัน |
| **Click** | คลิก left/right/double ที่ตำแหน่ง x,y |
| **Type** | พิมพ์ข้อความ |
| **Key** | กดปุ่มพิเศษ (Enter, Ctrl+C, Tab, etc.) |
| **Mouse move** | เลื่อน cursor โดยไม่คลิก |
| **Drag** | คลิกค้างและลาก |
| **Scroll** | เลื่อน scroll wheel (ล้อเลื่อน) |

---

## โมเดลที่รองรับ

| Beta Header | โมเดลที่ใช้ได้ |
|------------|---------------|
| `computer-use-2025-11-24` | Opus 4.8, 4.7, 4.6, Sonnet 4.6, Opus 4.5 |
| `computer-use-2025-01-24` | Sonnet 4.5, Haiku 4.5, รุ่นเก่า |

---

## Use Cases

### Desktop Automation (งานอัตโนมัติบนหน้าจอ)
- กรอกฟอร์มซ้ำๆ โดยอัตโนมัติ
- Extract (ดึง) ข้อมูลจากโปรแกรมที่ไม่มี API
- ทำ data entry (กรอกข้อมูล) จากเอกสาร
- สร้าง report จากหลายโปรแกรม

### Web Automation (งานอัตโนมัติบนเว็บ)
- ท่องเว็บและเก็บข้อมูล
- กรอกใบสมัครออนไลน์
- ทดสอบ web application แบบ E2E testing (การทดสอบจากต้นจนจบ)
- Monitor dashboard (แผงควบคุม) และแจ้งเตือน

### Software Testing (การทดสอบซอฟต์แวร์)
- ทดสอบ UI แบบ automated (อัตโนมัติ)
- Screenshot comparison testing (ทดสอบโดยเปรียบเทียบภาพหน้าจอ)
- Regression testing (การทดสอบซ้ำเพื่อตรวจว่าส่วนที่แก้ไม่ทำให้ส่วนอื่นพัง) ใน legacy systems (ระบบเก่า)

### Research
- ค้นหาข้อมูลจากหลายเว็บไซต์
- สรุปผลจากหลาย application
- Competitive analysis (การวิเคราะห์คู่แข่ง) อัตโนมัติ

---

## การ Implement Computer Use

### ขั้นตอนพื้นฐาน

1. ตั้งค่า virtual machine (เครื่องคอมพิวเตอร์จำลอง) หรือ container (สภาพแวดล้อมที่แยกออกมาเฉพาะ) ที่ Claude จะควบคุม
2. ส่ง request พร้อม computer_use tool
3. Loop (วนซ้ำ): Claude ส่ง action → คุณรัน action → ส่ง screenshot กลับ → Claude ตัดสินใจต่อ

### ตัวอย่างโค้ด Python

```python
import anthropic
import base64
import subprocess
from pathlib import Path

client = anthropic.Anthropic()

def take_screenshot() -> str:
    """จับภาพหน้าจอและ return เป็น base64 (ข้อความเข้ารหัส)"""
    # ในการใช้จริง ใช้ library เช่น pyautogui หรือ scrot
    # นี่เป็นแค่ pseudo-code
    subprocess.run(["scrot", "/tmp/screenshot.png"])
    with open("/tmp/screenshot.png", "rb") as f:
        return base64.b64encode(f.read()).decode()

def execute_action(action: dict) -> str:
    """รัน action ที่ Claude สั่งและ return screenshot ใหม่"""
    action_type = action.get("type")
    
    if action_type == "screenshot":
        return take_screenshot()
    
    elif action_type == "left_click":
        x, y = action["coordinate"]
        subprocess.run(["xdotool", "click", "--clearmodifiers", 
                       f"--window", "root", str(x), str(y)])
    
    elif action_type == "type":
        text = action["text"]
        subprocess.run(["xdotool", "type", "--clearmodifiers", text])
    
    elif action_type == "key":
        key = action["key"]
        subprocess.run(["xdotool", "key", "--clearmodifiers", key])
    
    return take_screenshot()

# กำหนด computer tool
computer_tool = {
    "type": "computer_20251124",
    "name": "computer",
    "display_width_px": 1920,
    "display_height_px": 1080,
    "display_number": 1
}

# เริ่ม task
messages = [
    {
        "role": "user",
        "content": "เปิด Firefox ไปที่ google.com แล้วค้นหา 'Claude AI Anthropic'"
    }
]

# Agentic Loop (วงจรทำงานของ AI อัตโนมัติ)
while True:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=4096,
        tools=[computer_tool],
        messages=messages,
        betas=["computer-use-2025-11-24"]
    )
    
    # เพิ่ม response ลงใน messages
    messages.append({"role": "assistant", "content": response.content})
    
    # ถ้า Claude ตอบเสร็จแล้ว หยุด
    if response.stop_reason == "end_turn":
        print("Task completed!")
        break
    
    # Process tool calls
    tool_results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "computer":
            action = block.input
            
            # รัน action และ get screenshot
            new_screenshot = execute_action(action)
            
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": new_screenshot
                        }
                    }
                ]
            })
    
    # ส่ง tool results กลับ
    if tool_results:
        messages.append({"role": "user", "content": tool_results})
    else:
        break
```

---

## Action Types ทั้งหมด

### Mouse Actions (การกระทำของเมาส์)

```json
// คลิก left
{"type": "left_click", "coordinate": [x, y]}

// คลิก right  
{"type": "right_click", "coordinate": [x, y]}

// double click
{"type": "double_click", "coordinate": [x, y]}

// เลื่อน scroll
{"type": "scroll", "coordinate": [x, y], "direction": "down", "amount": 3}

// drag (ลากวาง)
{"type": "drag", "start_coordinate": [x1, y1], "end_coordinate": [x2, y2]}
```

### Keyboard Actions (การกระทำของคีย์บอร์ด)

```json
// พิมพ์ข้อความ
{"type": "type", "text": "Hello World"}

// กดปุ่มพิเศษ
{"type": "key", "key": "Return"}
{"type": "key", "key": "ctrl+c"}
{"type": "key", "key": "ctrl+v"}
{"type": "key", "key": "ctrl+shift+t"}
{"type": "key", "key": "alt+F4"}
```

### Screen Action

```json
// จับภาพหน้าจอ
{"type": "screenshot"}
```

---

## ค่าใช้จ่าย Computer Use

Computer Use ใช้ token (ชิ้นส่วนข้อมูล) เพิ่มเติม:

| รายการ | Token |
|--------|-------|
| Beta system prompt overhead (ต้นทุน system prompt เพิ่มเติม) | 466-499 tokens |
| Computer tool definition (คำอธิบาย tool) | 735 tokens (Claude 4.x) |
| Screenshot แต่ละรูป | ขึ้นกับ resolution (ความละเอียด) |

### การ Estimate ต้นทุน

Screenshot ขนาด 1920x1080 ≈ 1,000-1,500 tokens

Task ที่มี 20 steps (20 screenshots + actions):
- Screenshots: 20 × 1,200 tokens = 24,000 tokens
- Text/actions: ~5,000 tokens
- ต้นทุนโดยประมาณ (Opus 4.8): ~$0.15 ต่อ task

---

## Best Practices

### 1. ใช้ Resolution ที่เหมาะสม

ลด resolution เพื่อประหยัด tokens แต่ให้ Claude มองเห็นชัดพอ:
- สำหรับงานทั่วไป: 1280×800 เพียงพอ
- สำหรับงาน detail (รายละเอียดสูง): 1920×1080

### 2. ตั้ง Timeout (เวลาหมดอายุ)

```python
import threading

def run_with_timeout(func, timeout=300):
    """รัน function ด้วย timeout 5 นาที"""
    result = [None]
    exception = [None]
    
    def target():
        try:
            result[0] = func()
        except Exception as e:
            exception[0] = e
    
    thread = threading.Thread(target=target)
    thread.start()
    thread.join(timeout)
    
    if thread.is_alive():
        raise TimeoutError("Task exceeded timeout")
    
    if exception[0]:
        raise exception[0]
    
    return result[0]
```

### 3. Handle Errors อย่างระมัดระวัง

Computer Use อาจ fail ด้วยสาเหตุหลายอย่าง:
- Element (องค์ประกอบบนหน้าจอ) ไม่ปรากฏบนหน้าจอ
- Application ช้าหรือ hang (ค้าง)
- UI เปลี่ยนแปลงระหว่างทาง

### 4. เพิ่ม Verification Steps (ขั้นตอนการตรวจสอบ)

```
หลังจากทำแต่ละขั้นตอน ให้ถ่าย screenshot ตรวจสอบว่าสำเร็จแล้วก่อนดำเนินการต่อ
ถ้าไม่เป็นไปตามที่คาดหวัง ให้รายงานและหยุด
```

### 5. ระมัดระวัง Destructive Actions (การกระทำที่ย้อนกลับไม่ได้)

```
ก่อนลบไฟล์ ปิดโปรแกรม หรือทำการ irreversible (ย้อนกลับไม่ได้) ใดๆ
ให้ถาม user ก่อนเสมอ
```

---

## ข้อจำกัดที่ควรรู้

### Hallucination ด้าน Visual (การหลอนภาพ — AI เห็นสิ่งที่ไม่มีอยู่จริง)
Claude อาจ "เห็น" บางอย่างที่ไม่มีในหน้าจอจริง หรือเข้าใจ UI ผิด ควรเพิ่ม verification (การตรวจสอบ)

### Performance (ประสิทธิภาพ)
- แต่ละ step ใช้เวลาหลายวินาที
- Screenshot + API call + action ≈ 5-15 วินาทีต่อ step
- งาน 20 steps อาจใช้เวลา 5-10 นาที

### รองรับเฉพาะ Desktop
Computer Use ไม่รองรับ mobile devices โดยตรง ต้องใช้ emulator (โปรแกรมจำลองอุปกรณ์)

### ความปลอดภัย
อย่าให้ Claude เข้าถึงระบบที่มีข้อมูลสำคัญโดยไม่มี human oversight (การดูแลของมนุษย์) เพราะอาจเกิด unintended actions (การกระทำที่ไม่ได้ตั้งใจ)

---

## ตัวอย่าง Use Case: Web Scraping (การเก็บข้อมูลจากเว็บ)

```python
task_prompt = """
ไปที่เว็บไซต์ https://example-jobs.com
ค้นหางาน 'Python Developer' ในกรุงเทพ
รวบรวมรายการชื่อตำแหน่ง บริษัท และเงินเดือน จาก 5 ตำแหน่งแรก
แล้วสรุปให้ในรูปแบบตาราง
"""
```

---

## สรุป

Computer Use เปิดโอกาสสำหรับ automation (การทำงานอัตโนมัติ) ที่ไม่เคยทำได้มาก่อน โดยเฉพาะสำหรับ:

| Use Case | ประโยชน์ |
|----------|---------|
| Legacy systems (ระบบเก่า) | ระบบเก่าที่ไม่มี API |
| Complex workflows (กระบวนการซับซ้อน) | งานหลายแอปที่ซับซ้อน |
| Testing (การทดสอบ) | Automated E2E testing |
| Research (การวิจัย) | Data collection หลายแหล่ง |

เริ่มต้นด้วย task ง่ายๆ และ verify (ตรวจสอบ) ผลลัพธ์ทุกขั้นตอน ก่อนจะขยายไปสู่งานที่ซับซ้อนและ autonomous (อัตโนมัติเต็มรูปแบบ) มากขึ้น
