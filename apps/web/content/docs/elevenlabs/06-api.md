---
title: "ElevenLabs: API & เครดิต — เรียกใช้ผ่านโค้ด"
tool: "ElevenLabs"
icon: "tool-elevenlabs"
level: "pro"
summary: "ภาพรวมการเรียกใช้ ElevenLabs ผ่าน API และวิธีคิดเครดิต"
readTime: "5 นาที"
readers: "0"
locked: false
order: 6
---

# API & เครดิต — เรียก ElevenLabs จากโค้ด 🧑‍💻

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [elevenlabs.io/docs/api-reference](https://elevenlabs.io/docs/api-reference)

ทุกฟีเจอร์ของ ElevenLabs เรียกผ่าน **API** ได้ เพื่อนำไปฝังในแอป/บริการของคุณ มี SDK ทั้ง Python และ JavaScript

## 🔑 สิ่งที่ต้องเตรียม

| สิ่งที่ต้องมี | อธิบาย |
|---|---|
| **API key** | สร้างในหน้าโปรไฟล์ (เก็บเป็นความลับ) |
| **Voice ID** | ระบุว่าจะใช้เสียงไหน |
| **Model ID** | เลือกโมเดล เช่น multilingual / flash |

## 🧱 ตัวอย่าง Text to Speech (Python)

```python
from elevenlabs import ElevenLabs
client = ElevenLabs(api_key="YOUR_KEY")
audio = client.text_to_speech.convert(
    voice_id="VOICE_ID",
    model_id="eleven_multilingual_v2",
    text="สวัสดีครับ ยินดีต้อนรับ",
)
# นำ audio (bytes) ไปบันทึกเป็นไฟล์ .mp3
```

## 💳 เครดิตคิดยังไง

- **TTS** คิดตาม **จำนวนตัวอักษร** ที่แปลงเป็นเสียง
- **Dubbing / STT** คิดตาม **ความยาวเวลา** ของสื่อ
- แต่ละแพ็กเกจมีโควตาเครดิตต่อเดือนต่างกัน (มีแพ็กเกจฟรีให้เริ่ม)

## 💡 เคล็ดลับ

- ใช้โมเดล **Flash** เมื่อต้องการความเร็ว/หน่วงต่ำ (เช่น เรียลไทม์)
- ใช้ **streaming** เพื่อเริ่มเล่นเสียงได้ก่อนสร้างเสร็จทั้งก้อน
- อย่าฝัง API key ไว้ในฝั่งหน้าเว็บ (client) — เรียกผ่านเซิร์ฟเวอร์ของคุณ

## 🔗 อ้างอิง

- API Reference: https://elevenlabs.io/docs/api-reference
- เอกสารทางการ: https://elevenlabs.io/docs
