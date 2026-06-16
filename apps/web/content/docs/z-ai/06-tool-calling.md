---
title: "Z.ai: Tool / Function Calling — ให้โมเดลเรียกเครื่องมือ"
tool: "Z.ai"
icon: "tool-z-ai"
level: "pro"
summary: "ให้ GLM เรียกฟังก์ชัน/เครื่องมือที่คุณกำหนด เพื่อทำงานจริงต่อ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 6
---

# Tool / Function Calling 🛠️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/)

**Tool calling** ให้คุณบอกโมเดลว่ามี "เครื่องมือ" อะไรให้เรียกได้ (เช่น เช็คอากาศ, ค้นฐานข้อมูล) เมื่อจำเป็น โมเดลจะบอกว่าจะเรียกเครื่องมือไหนพร้อมพารามิเตอร์ แล้วคุณรันให้และส่งผลกลับ

## 🔄 วงจรการทำงาน

1. ส่งคำถาม + รายการ **tools** (ชื่อ + คำอธิบาย + schema พารามิเตอร์)
2. โมเดลตอบกลับว่าจะเรียก tool ไหน พร้อม arguments
3. **คุณรันฟังก์ชันจริง** ในโค้ดของคุณ
4. ส่งผลลัพธ์กลับเข้าไป โมเดลสรุปคำตอบสุดท้าย

## 🧱 ตัวอย่างนิยาม tool

```python
tools = [{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "ดูสภาพอากาศของเมือง",
    "parameters": {
      "type": "object",
      "properties": {"city": {"type": "string"}},
      "required": ["city"]
    }
  }
}]

r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role":"user","content":"อากาศกรุงเทพวันนี้เป็นไง"}],
    tools=tools,
)
# ตรวจ r.choices[0].message.tool_calls แล้วรันฟังก์ชันจริง
```

## 💡 เคล็ดลับ

- เขียน `description` ของ tool ให้ชัด โมเดลจะเลือกใช้ได้ถูก
- ใช้ร่วมกับ agent เพื่อทำงานหลายขั้นตอน
- ตรวจ/validate arguments ก่อนรันจริงเสมอ

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
