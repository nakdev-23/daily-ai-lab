---
title: "Google AI Studio คืออะไร — สนามทดลอง Gemini ฟรี"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "beginner"
summary: "ภาพรวม Google AI Studio เครื่องมือสร้างต้นแบบและทดลองพรอมต์กับโมเดล Gemini"
readTime: "6 นาที"
readers: "0"
locked: false
order: 1
---

# Google AI Studio — ทดลอง Gemini ได้ฟรีในเบราว์เซอร์ ✨

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [ai.google.dev](https://ai.google.dev/) และ [aistudio.google.com](https://aistudio.google.com/)

**Google AI Studio** คือเว็บแอปฟรีสำหรับ **ทดลองและสร้างต้นแบบกับโมเดล Gemini ของ Google** — พิมพ์พรอมต์ ปรับค่าต่าง ๆ เห็นผลทันที แล้วกดเอาโค้ดไปใช้ต่อในแอปจริงได้เลย เหมาะมากสำหรับคนเริ่มต้นที่อยากลองเล่น AI ก่อนเขียนโค้ดจริง

## 📖 คำศัพท์ที่ควรรู้

| คำศัพท์ | ความหมายง่าย ๆ |
|---|---|
| **Gemini** | โมเดล AI หลักของ Google (ข้อความ รูป เสียง วิดีโอ) |
| **Prompt** | คำสั่ง/ข้อความที่เราพิมพ์ให้โมเดลทำงาน |
| **API key** | กุญแจสำหรับเรียก Gemini จากโค้ดของเราเอง |
| **Temperature** | ค่าความสร้างสรรค์ของคำตอบ (ต่ำ=เป๊ะ สูง=หลากหลาย) |
| **System instructions** | คำสั่งกำหนดบทบาท/พฤติกรรมของโมเดล |

## ⭐ จุดเด่น

- **ฟรีและเริ่มได้ทันที** — แค่ล็อกอินด้วยบัญชี Google
- **ลองพรอมต์แบบเห็นผลสด** — ปรับค่าแล้วเทียบผลได้ง่าย
- **รับ API key ได้ในคลิกเดียว** — เอาไปต่อกับโค้ด/แอปจริง
- **รองรับมัลติโมดัล** — ใส่รูป/ไฟล์/เสียงเข้าไปในพรอมต์ได้
- **มี Starter apps** — ตัวอย่างแอปสำเร็จรูปให้ดัดแปลงต่อ

## 🚀 เริ่มต้นใช้งาน

1. เข้า [aistudio.google.com](https://aistudio.google.com/) แล้วล็อกอินด้วย Google
2. เลือกโมเดล Gemini แล้วลองพิมพ์พรอมต์ในหน้า Chat
3. ปรับ **System instructions** และค่า temperature ให้ได้ผลที่ต้องการ
4. กด **Get API key** เพื่อนำไปเรียกผ่านโค้ด:
   ```python
   from google import genai
   client = genai.Client(api_key="YOUR_KEY")
   r = client.models.generate_content(model="gemini-2.5-flash", contents="สวัสดี")
   print(r.text)
   ```

## 📚 สารบัญเอกสาร (ตาม official docs)

1. ✅ ภาพรวม (หน้านี้)
2. ⏳ การออกแบบพรอมต์ (Prompt design)
3. ⏳ รับ API key และเรียกใช้ผ่านโค้ด
4. ⏳ มัลติโมดัล — รูป/เสียง/วิดีโอ
5. ⏳ Starter apps และตัวอย่าง

## 🔗 อ้างอิง

- เว็บแอป: https://aistudio.google.com/
- เอกสารนักพัฒนา (Gemini API): https://ai.google.dev/
