---
title: "Z.ai: Video & Image — CogVideoX และ CogView"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "สร้างวิดีโอด้วย CogVideoX และสร้างภาพด้วย CogView ผ่าน Z.ai"
readTime: "5 นาที"
readers: "0"
locked: false
order: 11
---

# Video & Image — สร้างวิดีโอและภาพ 🎬🖼️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.z.ai](https://docs.z.ai/)

นอกจากโมเดลภาษา Z.ai ยังมีโมเดลสร้างสื่อ

## 🎬 CogVideoX — สร้างวิดีโอ

สร้างวิดีโอจาก **ข้อความ** หรือ **ภาพ** การสร้างวิดีโอใช้เวลา จึงทำงานแบบ **asynchronous**:

1. ส่งคำขอสร้าง (prompt / ภาพเริ่ม + พารามิเตอร์)
2. ได้ **task id**
3. เช็คสถานะเป็นระยะ
4. รับลิงก์วิดีโอเมื่อเสร็จ

```text
POST .../videos/generations   { model, prompt, ... }  -> { id }
GET  .../async-result/{id}     -> { status, video_url }
```

## 🖼️ CogView — สร้างภาพ

สร้างภาพจากคำบรรยายข้อความ (text-to-image)

```python
r = client.images.generate(
    model="cogview-3",
    prompt="แมวส้มนั่งบนหลังคาตอนพระอาทิตย์ตก สไตล์ภาพวาดสีน้ำ",
)
print(r.data[0].url)
```

## 💡 เคล็ดลับ

- เขียน prompt เป็นภาพ (subject + ฉาก + แสง + สไตล์)
- วิดีโอ: หนึ่งคลิปหนึ่งเหตุการณ์หลัก
- ชื่อรุ่น/พารามิเตอร์ล่าสุด ดูในเอกสารหมวด Video / Image

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.z.ai/
