---
title: "Z.ai: Vision — เข้าใจรูปภาพด้วย GLM-4.5V"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "ส่งรูปให้ GLM-4.5V อ่าน อธิบาย หรือตอบคำถามเกี่ยวกับภาพ"
readTime: "4 นาที"
readers: "0"
locked: false
order: 8
---

# Vision — ให้โมเดลมองเห็นรูป 👁️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/)

โมเดล **GLM-4.5V** เป็นโมเดลมัลติโมดัล — ส่งรูปเข้าไปแล้วถามได้ เช่น อธิบายภาพ, อ่านข้อความในภาพ, วิเคราะห์แผนภูมิ

## 🖼️ ใช้ทำอะไรได้

- อธิบายว่าในภาพมีอะไร
- อ่านข้อความ/ตัวเลขในภาพ (OCR)
- ตอบคำถามเกี่ยวกับภาพ
- วิเคราะห์กราฟ/ตาราง/หน้าจอ UI

## 🧱 ส่งรูปเข้าไป (รูปแบบ OpenAI-style)

```python
r = client.chat.completions.create(
    model="glm-4.5v",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "ในภาพนี้มีอะไรบ้าง"},
            {"type": "image_url",
             "image_url": {"url": "https://example.com/photo.jpg"}},
        ],
    }],
)
print(r.choices[0].message.content)
```

> ใส่รูปได้ทั้งแบบ URL และแบบ base64 (ตามที่เอกสารกำหนด)

## 💡 เคล็ดลับ

- ใช้รูปคมชัด ผลจะแม่นกว่า
- ถามให้เจาะจงว่าต้องการให้ "ทำอะไร" กับรูป
- งานเอกสาร/ตารางในภาพ บอกให้ตอบเป็นตาราง/JSON ได้

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
