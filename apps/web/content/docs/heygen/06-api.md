---
title: "HeyGen: API — สร้างวิดีโอจากโค้ด"
tool: "HeyGen"
icon: "tool-heygen"
level: "pro"
summary: "ภาพรวมการเรียกใช้ HeyGen API เพื่อสร้างวิดีโออวตารอัตโนมัติ"
readTime: "5 นาที"
readers: "0"
locked: false
order: 6
---

# API — สร้างวิดีโออวตารด้วยโค้ด 🧑‍💻

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.heygen.com](https://docs.heygen.com/) หมวด API Reference

HeyGen มี **API** ให้สร้างวิดีโออวตารแบบอัตโนมัติ เหมาะกับการทำวิดีโอจำนวนมาก (เช่น ส่วนตัวต่อผู้รับแต่ละคน) หรือฝังการสร้างวิดีโอลงในระบบของคุณ

## 🔑 สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | อธิบาย |
|---|---|
| **API key** | สร้างในหน้าตั้งค่าบัญชี (เก็บเป็นความลับ) |
| **Avatar ID** | ระบุอวตารที่จะใช้ |
| **Voice ID** | ระบุเสียงที่จะพูด |

## 🧱 ขั้นตอนทั่วไป (asynchronous)

การเรนเดอร์วิดีโอใช้เวลา จึงทำงานแบบ async:

```text
POST /v2/video/generate   { avatar_id, voice_id, input_text, ... }
  -> { video_id }
GET  /v1/video_status.get?video_id=...
  -> { status: "completed", video_url }
```

1. **ส่งคำขอสร้าง** พร้อมอวตาร/เสียง/บท
2. ได้ **video_id**
3. **เช็คสถานะ** เป็นระยะจนเสร็จ
4. รับ **ลิงก์วิดีโอ**

## 💡 เคล็ดลับ

- ใช้ **webhook** (ถ้ามี) แทนการ poll เพื่อรับแจ้งเตือนเมื่อวิดีโอเสร็จ
- เก็บ Avatar ID / Voice ID ที่ใช้บ่อยไว้เป็นค่าคงที่
- อย่าเปิดเผย API key ฝั่ง client — เรียกผ่านเซิร์ฟเวอร์ของคุณ

## 🔗 อ้างอิง

- API Reference: https://docs.heygen.com/
