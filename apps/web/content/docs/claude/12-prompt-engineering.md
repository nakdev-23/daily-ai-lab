---
title: "Prompt Engineering — ศิลปะการเขียน Prompt ให้ได้ผลดีที่สุด"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "เทคนิคการเขียน prompt อย่างมีประสิทธิภาพ ตั้งแต่หลักการพื้นฐาน ไปจนถึง XML tags, few-shot examples, chain of thought และ agentic prompting"
readTime: "15 นาที"
readers: "0"
locked: false
order: 12
---

## Prompt Engineering คืออะไร?

Prompt Engineering (การออกแบบคำสั่งสำหรับ AI — ศาสตร์ว่าด้วยการเขียนข้อความให้ AI เข้าใจและตอบได้ตรงความต้องการ) คือการออกแบบและปรับปรุง input (ข้อมูลที่ส่งให้ AI) ที่ส่งให้ Claude เพื่อให้ได้ output (ผลลัพธ์) ที่ต้องการอย่างสม่ำเสมอ การเขียน prompt ที่ดีไม่ใช่แค่ "การถามคำถาม" แต่คือการสื่อสารความต้องการอย่างชัดเจน รวมถึง context (บริบท — ข้อมูลพื้นหลังที่ช่วยให้ AI เข้าใจสถานการณ์), รูปแบบ output และข้อจำกัดต่างๆ

> **คิดว่า Claude เหมือนพนักงานใหม่ที่ฉลาดมาก แต่ไม่รู้ context ของคุณ** ยิ่งอธิบายชัดเท่าไหร่ ผลลัพธ์ยิ่งดีขึ้นเท่านั้น

---

## หลักการพื้นฐาน (General Principles)

### 1. ชัดเจนและตรงประเด็น

บอกสิ่งที่ต้องการให้ชัดเจน อย่าใช้ภาษาคลุมเครือ

```
# ไม่ดี
"ช่วยดูโค้ดนี้หน่อย"

# ดี
"ตรวจสอบ Python function นี้ หา bug (ข้อผิดพลาด) ที่อาจทำให้เกิด off-by-one error และแนะนำวิธีแก้ไข"
```

**Golden Rule:** ลองโชว์ prompt ให้คนอื่นดูโดยไม่บอก context แล้วถามว่าเข้าใจไหม ถ้าเขาสับสน Claude ก็จะสับสนด้วย

### 2. เพิ่ม Context และเหตุผล

การบอกว่า "ทำไม" ช่วยให้ Claude เข้าใจเป้าหมายและ generalize (นำไปใช้ได้หลายกรณี) ได้ดีกว่า

```
# ไม่ดี
"NEVER use ellipses"

# ดี
"ห้ามใช้ ellipsis (...) เพราะ response จะถูกอ่านด้วย text-to-speech (ระบบแปลงข้อความเป็นเสียง) และ TTS ไม่รู้จะออกเสียงอย่างไร"
```

### 3. เป็นรูปธรรม ไม่ใช้นามธรรม

ระบุ format (รูปแบบ), ความยาว, สไตล์ การเรียงลำดับ ให้ชัดเจน

```
# ไม่ดี
"สรุปบทความนี้"

# ดี
"สรุปบทความนี้ใน 3 bullet points ภาษาไทย แต่ละ bullet ไม่เกิน 1 ประโยค เน้นประเด็นหลักที่ผู้ตัดสินใจทางธุรกิจควรรู้"
```

---

## การใช้ Examples (Few-Shot Prompting — การให้ตัวอย่างก่อนถาม)

Examples (ตัวอย่าง) เป็นวิธีที่ทรงพลังที่สุดในการบอก Claude ว่าต้องการ output แบบไหน

### หลักการเลือก Examples ที่ดี

- **Relevant** — ตัวอย่างต้องใกล้เคียงกับงานจริง
- **Diverse** — ครอบคลุม edge cases (กรณีพิเศษที่อาจเกิดขึ้น) ต่างๆ
- **Structured** — ห่อด้วย XML tags (แท็กโครงสร้างข้อมูล) เพื่อให้ Claude แยกแยะได้

```
ต่อไปนี้คือตัวอย่างการจำแนกประเภทความคิดเห็น:

<examples>
  <example>
    <input>สินค้ามาเร็วมาก แพ็คเกจสวยงาม ประทับใจมาก!</input>
    <output>positive</output>
  </example>
  <example>
    <input>รอนานมาก กว่าจะได้รับ ไม่ประทับใจเลย</input>
    <output>negative</output>
  </example>
  <example>
    <input>ของมาครบ แต่ box บุบนิดหน่อย</input>
    <output>mixed</output>
  </example>
</examples>

จำแนกความคิดเห็นต่อไปนี้:
{USER_REVIEW}
```

> **Tip:** ใช้ 3-5 examples เพื่อผลลัพธ์ที่ดีที่สุด

---

## XML Tags — โครงสร้างที่ชัดเจน

XML tags (แท็ก XML — สัญลักษณ์วงเล็บมุมที่ใช้ระบุชื่อส่วนต่างๆ เช่น `<instructions>...</instructions>`) ช่วยให้ Claude แยกแยะส่วนต่างๆ ของ prompt ได้ชัดเจน โดยเฉพาะเมื่อ prompt มีหลายส่วนผสมกัน

```xml
<instructions>
  วิเคราะห์เอกสารต่อไปนี้และสรุปประเด็นหลัก
</instructions>

<context>
  เอกสารนี้เป็นรายงานประจำปีของบริษัท XYZ
</context>

<document>
  {{DOCUMENT_CONTENT}}
</document>

<format>
  ตอบเป็น bullet points ภาษาไทย ไม่เกิน 5 ข้อ
</format>
```

### Tags ที่นิยมใช้

| Tag | ใช้สำหรับ |
|-----|---------|
| `<instructions>` | คำสั่งหลัก |
| `<context>` | บริบทหรือข้อมูลพื้นหลัง |
| `<examples>` / `<example>` | ตัวอย่าง |
| `<document>` | เนื้อหาเอกสาร |
| `<input>` / `<output>` | ใน few-shot examples |
| `<thinking>` | สำหรับ chain of thought (ห่วงโซ่ความคิด) |
| `<answer>` | คำตอบสุดท้าย |

---

## การกำหนด Role (Role Prompting — การกำหนดบทบาทให้ AI)

การให้ Claude รับ "บทบาท" ช่วยปรับ tone (น้ำเสียง) และ focus (จุดเน้น) ของการตอบ

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="คุณคือผู้เชี่ยวชาญด้านกฎหมายไทยที่มีประสบการณ์ 20 ปี เชี่ยวชาญด้านกฎหมายแรงงานและสัญญา ตอบด้วยความระมัดระวังและแนะนำให้ปรึกษาทนายความเสมอสำหรับกรณีเฉพาะเจาะจง",
    messages=[
        {"role": "user", "content": "สัญญาจ้างงานควรมีข้อกำหนดอะไรบ้าง?"}
    ]
)
```

---

## Chain of Thought (CoT) — ให้ Claude "คิดก่อนตอบ"

Chain of Thought (ห่วงโซ่ความคิด — เทคนิคให้ AI แสดงขั้นตอนการคิดทีละขั้นก่อนสรุปคำตอบ) ช่วยเพิ่มความแม่นยำสำหรับปัญหาซับซ้อน

### วิธีที่ 1: ขอให้คิดก่อน

```
วิเคราะห์ความเป็นไปได้ทางการเงินของโปรเจกต์นี้:
- ต้นทุนเริ่มต้น: 5 ล้านบาท
- รายได้คาดการณ์: 2 ล้านบาทต่อปี
- ค่าใช้จ่ายรายปี: 500,000 บาท

กรุณา คิดทีละขั้นตอน และแสดงการคำนวณอย่างละเอียดก่อนสรุป
```

### วิธีที่ 2: ใช้ XML tags แยก Thinking และ Answer

```
<thinking>
  ให้คุณคิดวิเคราะห์ทีละขั้นตอนในส่วนนี้
</thinking>

<answer>
  สรุปคำตอบสุดท้ายในส่วนนี้
</answer>
```

### วิธีที่ 3: Adaptive Thinking (API — ผ่านช่องทางเชื่อมต่อโปรแกรม)

สำหรับโมเดล Claude 4.6+ ใช้ adaptive thinking (การคิดแบบปรับตัว — โมเดลตัดสินใจเองว่าต้องคิดนานแค่ไหน) ซึ่งโมเดลตัดสินใจเองว่าต้องคิดนานแค่ไหน:

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content": "แก้ปัญหาคณิตศาสตร์ที่ซับซ้อนนี้..."}]
)
```

---

## Long Context Prompting

เมื่อทำงานกับเอกสารขนาดใหญ่ (20k+ tokens — ชิ้นส่วนข้อความมากกว่า 20,000 ชิ้น):

### วาง Data ก่อน Query

วางเนื้อหายาวๆ ไว้ด้านบน และคำถามไว้ด้านล่าง ช่วยเพิ่ม performance (ประสิทธิภาพ) ได้ถึง 30%

```xml
<documents>
  <document index="1">
    <source>annual_report_2025.pdf</source>
    <document_content>
      {{ANNUAL_REPORT_CONTENT}}
    </document_content>
  </document>
</documents>

คำถาม: สรุปความเสี่ยงหลักที่กล่าวถึงในรายงานนี้
```

### ขอให้ Quote ก่อนตอบ

```
อ่านเอกสารต่อไปนี้ แล้ว:
1. หาและ quote (ยกข้อความ) ส่วนที่เกี่ยวข้องกับคำถาม วางใน <quotes> tags
2. จากนั้นตอบคำถามโดยอิงจาก quotes เหล่านั้น

คำถาม: บริษัทมีแผนขยายตลาดต่างประเทศอย่างไร?
```

---

## การควบคุม Output Format

### 1. บอกสิ่งที่ต้องการ ไม่ใช่สิ่งที่ไม่ต้องการ

```
# ไม่ดี
"อย่าใช้ markdown"

# ดี
"ตอบเป็น plain text (ข้อความธรรมดา) ไม่ใช้ heading หรือ bullet points"
```

### 2. ระบุ Format อย่างชัดเจน

```
ตอบในรูปแบบ JSON (รูปแบบข้อมูลมาตรฐาน — ใช้ {} และ [] จัดเก็บข้อมูลเป็นคู่ชื่อ-ค่า) ดังนี้:
{
  "sentiment": "positive/negative/neutral",
  "score": (0-100),
  "key_phrases": ["phrase1", "phrase2"],
  "summary": "สรุป 1 ประโยค"
}
```

### 3. ตัวอย่าง Prompt สำหรับลด Markdown

```
เมื่อเขียนรายงานหรือเนื้อหายาว ให้เขียนเป็น prose (ร้อยแก้ว) ธรรมดาในย่อหน้า 
ใช้ markdown เฉพาะ `inline code` และ code blocks เท่านั้น
อย่าใช้ bold, italic, หรือ bullet lists ถ้าไม่จำเป็น
```

---

## Agentic Prompting

สำหรับ use cases (กรณีการใช้งาน) ที่ Claude ต้องทำงานหลายขั้นตอนอัตโนมัติ:

### ควบคุม Autonomy (ความเป็นอิสระของ AI)

```python
system_prompt = """
พิจารณา reversibility (ความสามารถย้อนกลับ — ทำแล้วแก้ไขได้ไหม) ของการกระทำก่อนเสมอ:
- การกระทำที่ reversible (แก้ไขไฟล์, รันเทส): ทำได้เลย
- การกระทำที่ irreversible (ลบข้อมูล, push code, ส่งอีเมล): ต้องขอ confirm ก่อน

ถ้าไม่แน่ใจ ให้ถามผู้ใช้
"""
```

### จัดการ Context Window (ขนาดหน่วยความจำชั่วคราว)

```
Context window ของคุณจะถูก compact (บีบอัด) อัตโนมัติเมื่อใกล้เต็ม
คุณสามารถทำงานต่อไปได้ไม่จำกัด ไม่ต้องหยุดงานก่อนกำหนด
ก่อน context จะถูกล้าง ให้บันทึก progress ลงในไฟล์ progress.txt
```

### ลด Overengineering (การสร้างซับซ้อนเกินความจำเป็น)

```
ทำเฉพาะที่ถูกขอเท่านั้น อย่าเพิ่ม feature ที่ไม่ได้ขอ
อย่า refactor (จัดระเบียบโค้ดใหม่) โค้ดส่วนที่ไม่เกี่ยวข้อง
ทำให้ solution เรียบง่ายที่สุดเท่าที่จะทำได้
```

---

## Prompt ที่ดีสำหรับ Use Cases ต่างๆ

### Customer Service Bot

```
คุณคือ AI assistant ของร้าน [ชื่อร้าน] 
ตอบด้วยน้ำเสียงที่เป็นมิตรและมืออาชีพ ภาษาไทย
ถ้าไม่รู้คำตอบ ให้บอกว่าจะส่งต่อให้ทีมงานและถามชื่อ-เบอร์โทรเพื่อติดต่อกลับ
อย่าสัญญาว่าจะทำสิ่งที่อยู่นอกเหนือความสามารถ
```

### Code Review

```
คุณคือ senior developer (นักพัฒนาอาวุโส) ที่ตรวจ code review (การตรวจสอบโค้ด)
ตรวจสอบและรายงาน:
1. Bugs หรือ potential issues (ปัญหาที่อาจเกิดขึ้น)
2. Security vulnerabilities (ช่องโหว่ด้านความปลอดภัย)
3. Performance problems (ปัญหาด้านประสิทธิภาพ)
4. Code quality และ readability (คุณภาพและความอ่านง่ายของโค้ด)
ให้คะแนน severity (ระดับความรุนแรง): critical / high / medium / low สำหรับแต่ละ issue
```

### Data Extraction

```
Extract (ดึง) ข้อมูลต่อไปนี้จากข้อความและตอบเป็น JSON เท่านั้น:
- ชื่อ (name)
- อีเมล (email)  
- เบอร์โทร (phone)
- ที่อยู่ (address)

ถ้าไม่พบข้อมูล ให้ใส่ null
ห้ามเพิ่ม field อื่นนอกจากที่กำหนด
```

---

## Prompt Engineering Checklist

ก่อน deploy (นำไปใช้งานจริง) prompt ตรวจสอบรายการนี้:

- [ ] ระบุ task และ goal อย่างชัดเจน
- [ ] มี context หรือ background information ที่จำเป็น
- [ ] ระบุ output format ที่ต้องการ
- [ ] มี examples สำหรับ edge cases (กรณีพิเศษ)
- [ ] ระบุสิ่งที่ "ไม่ต้องการ" เช่น ห้ามเดา, ห้ามสร้างข้อมูลใหม่
- [ ] ทดสอบกับ input หลายรูปแบบ
- [ ] ตรวจสอบว่า output ใช้งานได้จริงกับ downstream process (กระบวนการถัดไปที่จะนำผลลัพธ์ไปใช้)

---

## สรุป

| เทคนิค | เหมาะกับงาน |
|--------|-----------|
| **Clear Instructions** | ทุกงาน |
| **Role Prompting** | การสนทนา, expert advice |
| **Few-Shot Examples** | Classification, extraction, formatting |
| **XML Tags** | Prompt ซับซ้อนหลายส่วน |
| **Chain of Thought** | Math, reasoning, analysis |
| **Long Context Tips** | Document analysis |
| **Agentic Prompting** | Multi-step automation (งานอัตโนมัติหลายขั้นตอน) |

Prompt engineering เป็นทักษะที่ต้องฝึกฝน ทดลอง และวัดผลอย่างต่อเนื่อง เริ่มจากหลักการง่ายๆ แล้วค่อยๆ เพิ่มความซับซ้อนตามความต้องการ
