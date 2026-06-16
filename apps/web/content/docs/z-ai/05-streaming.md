---
title: "Z.ai: Streaming — รับคำตอบทีละส่วน"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "เปิดโหมด stream เพื่อรับคำตอบ GLM แบบทยอยมา (SSE) ลดเวลารอ"
readTime: "4 นาที"
readers: "0"
locked: false
order: 5
---

# Streaming — เห็นคำตอบทยอยมา ⚡

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/)

แทนที่จะรอจนตอบเสร็จทั้งก้อน **Streaming** ส่งคำตอบมาทีละชิ้น (token) ผ่าน SSE — ทำให้ผู้ใช้เห็นข้อความค่อย ๆ พิมพ์ออกมา รู้สึกเร็วขึ้น เหมาะกับงานแชท

## ▶️ ตัวอย่าง (Python)

```python
stream = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role": "user", "content": "เล่านิทานสั้น ๆ"}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

## 🧩 ทำงานยังไง

- ตั้ง `stream=True`
- เซิร์ฟเวอร์ส่ง **chunk** มาเรื่อย ๆ
- แต่ละ chunk มี `delta` (ส่วนต่อของข้อความ)
- นำ delta มาต่อกันจนจบ

## 💡 เคล็ดลับ

- เหมาะกับ UI แชต/คำตอบยาว — ผู้ใช้ไม่ต้องจ้องหน้าจอว่าง
- จัดการ error ระหว่างสตรีม (เช่น การเชื่อมต่อหลุด) ด้วย
- ฝั่งเว็บใช้ EventSource/fetch stream อ่าน SSE

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
