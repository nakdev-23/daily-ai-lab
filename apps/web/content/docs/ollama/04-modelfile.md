---
title: "Ollama: Modelfile — ปรับแต่งโมเดลของคุณเอง"
tool: "Ollama"
icon: "tool-ollama"
level: "intermediate"
summary: "ใช้ Modelfile กำหนดบุคลิก พารามิเตอร์ และระบบของโมเดลที่ปรับแต่งเอง"
readTime: "5 นาที"
readers: "0"
locked: false
order: 4
---

# Modelfile — สร้างโมเดลเวอร์ชันของคุณ 🛠️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [github.com/ollama/ollama](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)

**Modelfile** คือไฟล์สูตร (คล้าย Dockerfile) ที่ใช้สร้างโมเดลเวอร์ชันปรับแต่งของคุณเอง — กำหนดบุคลิก, ค่าพารามิเตอร์, และข้อความระบบ โดยต่อยอดจากโมเดลที่มีอยู่

## 📄 ตัวอย่าง Modelfile

```dockerfile
FROM llama3.2

# ตั้งบุคลิก/บทบาท
SYSTEM "คุณเป็นติวเตอร์ภาษาไทยที่อธิบายเรื่องยากให้เข้าใจง่าย พูดสุภาพ"

# ปรับพารามิเตอร์
PARAMETER temperature 0.7
PARAMETER num_ctx 8192
```

## 🔧 คำสั่งหลักใน Modelfile

| คำสั่ง | ทำอะไร |
|---|---|
| `FROM` | โมเดลฐานที่ใช้ต่อยอด |
| `SYSTEM` | ข้อความระบบ (บุคลิก/บทบาท) |
| `PARAMETER` | ตั้งค่า เช่น temperature, num_ctx |
| `TEMPLATE` | รูปแบบ prompt ของโมเดล |
| `ADAPTER` | ใส่ LoRA adapter (ขั้นสูง) |

## ▶️ สร้างและใช้งาน

```bash
# สร้างโมเดลจาก Modelfile
ollama create my-tutor -f ./Modelfile

# รันโมเดลที่ปรับแต่งเอง
ollama run my-tutor
```

## 💡 เหมาะกับอะไร

- ทำผู้ช่วยเฉพาะทาง (เช่น ติวเตอร์, ผู้ช่วยเขียนโค้ด) ที่มีบุคลิกคงที่
- ล็อกค่าพารามิเตอร์ให้ทีมใช้เหมือนกัน

## 🔗 อ้างอิง

- เอกสาร Modelfile: https://github.com/ollama/ollama/blob/main/docs/modelfile.md
