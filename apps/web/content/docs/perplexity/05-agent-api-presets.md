---
title: "Agent API — Presets (ชุดการตั้งค่าสำเร็จรูป)"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้ Presets ทั้ง 4 แบบของ Agent API ว่าแต่ละแบบใช้โมเดลอะไร เหมาะกับงานประเภทใด และวิธีเลือกให้ถูกต้อง"
readTime: "6 นาที"
readers: "0"
locked: false
order: 5
---

# Agent API — Presets (ชุดการตั้งค่าสำเร็จรูป)

**Presets** (พรีเซ็ต — ชุดการตั้งค่าสำเร็จรูป) คือวิธีที่ง่ายที่สุดในการใช้ Agent API Perplexity ได้เตรียม Presets ไว้ 4 แบบ แต่ละแบบรวมโมเดล + เครื่องมือ + การตั้งค่า ไว้เป็นชุดเดียวที่ทดสอบและปรับแต่งมาเป็นอย่างดีแล้ว

---

## ทำไมต้องใช้ Presets?

แทนที่จะต้องระบุโมเดล เครื่องมือ และจำนวนขั้นตอนเอง คุณแค่เรียก Preset ชื่อเดียว แล้วได้การตั้งค่าที่ Perplexity เลือกมาให้เหมาะกับงานประเภทนั้นที่สุด

ข้อดีเพิ่มเติม: เมื่อ Perplexity อัปเดต Preset ให้ดีขึ้น Code ของคุณก็ได้รับการปรับปรุงอัตโนมัติโดยไม่ต้องแก้ไขอะไรเลย

---

## Presets ทั้ง 4 แบบ

### 1. fast-search (ค้นหาเร็ว)

| รายละเอียด | ค่า |
|---|---|
| โมเดล | google/gemini-3-flash-preview |
| Max Steps (จำนวนขั้นตอนสูงสุด) | 1 |
| Tools | web_search |
| เหมาะกับ | คำถามตรงๆ ที่ต้องการคำตอบเร็ว |

```python
response = client.agent.create(
    preset="fast-search",
    input="อากาศกรุงเทพวันนี้เป็นอย่างไร?"
)
```

ใช้เมื่อ: ต้องการความเร็วมากกว่าความลึก เช่น ค้นหาข้อมูลง่ายๆ ราคาสินค้า หรือข่าวล่าสุด

---

### 2. pro-search (ค้นหาระดับมืออาชีพ)

| รายละเอียด | ค่า |
|---|---|
| โมเดล | openai/gpt-5.1 |
| Max Steps | 3 |
| Tools | web_search, fetch_url |
| เหมาะกับ | คำถามส่วนใหญ่ที่ต้องการความแม่นยำ |

```python
response = client.agent.create(
    preset="pro-search",
    input="เปรียบเทียบข้อดีข้อเสียของ React vs Vue.js ในปี 2026"
)
```

ใช้เมื่อ: งานปกติทั่วไปที่ต้องการความสมดุลระหว่างความเร็วและคุณภาพ **แนะนำสำหรับการใช้งานทั่วไป**

---

### 3. deep-research (วิจัยเชิงลึก)

| รายละเอียด | ค่า |
|---|---|
| โมเดล | openai/gpt-5.2 |
| Max Steps | 10 |
| Tools | web_search, fetch_url |
| เหมาะกับ | งานวิจัยที่ต้องการความครอบคลุม |

```python
response = client.agent.create(
    preset="deep-research",
    input="วิเคราะห์ผลกระทบของ AI ต่อตลาดแรงงานในประเทศไทย 2026-2030"
)
```

ใช้เมื่อ: ต้องการรายงานที่ครอบคลุม ค้นหาหลายมิติ หรืองานวิเคราะห์ที่ซับซ้อน

---

### 4. advanced-deep-research (วิจัยระดับสูงสุด)

| รายละเอียด | ค่า |
|---|---|
| โมเดล | anthropic/claude-opus-4-6 |
| Max Steps | 10 |
| Tools | web_search, fetch_url |
| เหมาะกับ | งานวิจัยระดับมืออาชีพที่ต้องการคุณภาพสูงสุด |

```python
response = client.agent.create(
    preset="advanced-deep-research",
    input="สรุปงานวิจัยล่าสุดเกี่ยวกับการรักษามะเร็งด้วย CAR-T Cell Therapy"
)
```

ใช้เมื่อ: งานระดับองค์กร รายงานที่ต้องการความแม่นยำสูงสุด หรือหัวข้อที่ซับซ้อนมาก

---

## การเปรียบเทียบ Presets

| Preset | ความเร็ว | ความลึก | ค่าใช้จ่าย |
|---|---|---|---|
| fast-search | เร็วมาก | ต่ำ | ต่ำ |
| pro-search | เร็ว | ปานกลาง | ปานกลาง |
| deep-research | ช้า | สูง | สูง |
| advanced-deep-research | ช้ามาก | สูงสุด | สูงสุด |

---

## Dynamic vs Frozen Preset

### Dynamic Preset (แนะนำ)
เรียกชื่อ Preset ตรงๆ — ได้การตั้งค่าล่าสุดจาก Perplexity เสมอ:

```python
# วิธีนี้: เมื่อ Perplexity อัปเดต pro-search คุณได้รับการปรับปรุงอัตโนมัติ
response = client.agent.create(
    preset="pro-search",
    input="คำถามของฉัน"
)
```

### Frozen Preset (ตรึงค่าไว้)
คัดลอกการตั้งค่าปัจจุบันของ Preset ลงใน Code โดยตรง — ไม่เปลี่ยนแปลงแม้ Perplexity อัปเดต:

```python
# วิธีนี้: ใช้เมื่อต้องการผลลัพธ์ที่คาดเดาได้ 100% และไม่ต้องการให้เปลี่ยน
response = client.agent.create(
    model="openai/gpt-5.1",  # โมเดลตายตัว
    tools=[{"type": "web_search"}, {"type": "fetch_url"}],
    max_steps=3,
    input="คำถามของฉัน"
)
```

**แนะนำ Dynamic** สำหรับงานส่วนใหญ่ และ **Frozen** สำหรับระบบ Production ที่ต้องการความเสถียรสูง

---

## การผสม Preset กับ Instructions

คุณสามารถใช้ Preset ร่วมกับ `instructions` (System Prompt) เพื่อกำหนดพฤติกรรมเพิ่มเติมได้:

```python
response = client.agent.create(
    preset="pro-search",
    instructions="""
    คุณเป็นผู้เชี่ยวชาญด้านการเงิน ตอบเป็นภาษาไทยเสมอ
    ใช้ตารางและหัวข้อประกอบคำตอบ
    ถ้าหาข้อมูลไม่พบ บอกตรงๆ อย่าเดา
    """,
    input="วิเคราะห์หุ้น ADVANC สัปดาห์นี้"
)
```

> **สำคัญ:** `instructions` จะ **แทนที่** System Prompt ของ Preset ทั้งหมด ไม่ใช่เพิ่มเติม ดังนั้นต้องเขียน Instructions ให้ครบถ้วน

---

## สรุป

- **fast-search** → ต้องการคำตอบเร็ว ข้อมูลง่ายๆ
- **pro-search** → งานทั่วไป ความสมดุลระหว่างเร็วและดี (แนะนำเป็นค่าเริ่มต้น)
- **deep-research** → วิจัยครอบคลุม หลายมิติ
- **advanced-deep-research** → คุณภาพสูงสุด งานระดับมืออาชีพ

เลือก Preset ให้ตรงกับงาน จะช่วยประหยัดค่าใช้จ่ายและเวลารอคอยได้อย่างมาก
