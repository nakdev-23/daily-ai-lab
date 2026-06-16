---
title: "Google AI Studio: รับ API key และเรียกผ่านโค้ด"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "intermediate"
summary: "สร้าง API key จาก AI Studio แล้วเรียกใช้ Gemini ผ่าน Python/JavaScript"
readTime: "5 นาที"
readers: "0"
locked: false
order: 3
---

# รับ API key และเรียก Gemini จากโค้ด 🔑

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [ai.google.dev](https://ai.google.dev/gemini-api/docs)

เมื่อทดลองพรอมต์ใน AI Studio จนพอใจ ก็เอาไปใช้จริงในแอปด้วย **Gemini API**

## 🔑 รับ API key

1. ใน [aistudio.google.com](https://aistudio.google.com/) กด **Get API key**
2. สร้างคีย์ใหม่ แล้วเก็บไว้เป็นความลับ (อย่าใส่ในโค้ดฝั่ง client)

## 🐍 ตัวอย่าง Python

```python
from google import genai
client = genai.Client(api_key="YOUR_KEY")
r = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="อธิบาย AI ใน 2 ประโยค",
)
print(r.text)
```

## 🟨 ตัวอย่าง JavaScript

```js
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "YOUR_KEY" });
const r = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "สวัสดี",
});
console.log(r.text);
```

## 🆓 ขีดจำกัดฟรี

Gemini API มี **free tier** ให้ลองใช้ (มีลิมิตต่อนาที/ต่อวัน) เหมาะกับเรียนรู้และต้นแบบ — งานจริงปริมาณมากค่อยอัปเกรด

## 💡 เคล็ดลับ

- ใช้รุ่น **Flash** สำหรับงานเร็ว/ถูก, รุ่น **Pro** สำหรับงานคิดหนัก
- เก็บ key ไว้ใน environment variable ไม่ commit ลง git

## 🔗 อ้างอิง

- เอกสาร Gemini API: https://ai.google.dev/gemini-api/docs
