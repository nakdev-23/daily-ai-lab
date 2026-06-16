---
title: "Ollama: คำสั่งพื้นฐาน — run, pull, list, rm"
tool: "Ollama"
icon: "tool-ollama"
level: "beginner"
summary: "คำสั่งหลักของ Ollama สำหรับดาวน์โหลด รัน และจัดการโมเดลในเครื่อง"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---

# คำสั่งพื้นฐานของ Ollama 🧰

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [github.com/ollama/ollama](https://github.com/ollama/ollama)

หลังติดตั้ง Ollama แล้ว ใช้งานผ่านเทอร์มินัลด้วยคำสั่งไม่กี่ตัว

## ⌨️ คำสั่งที่ใช้บ่อย

| คำสั่ง | ทำอะไร |
|---|---|
| `ollama run <model>` | รันโมเดล (ดาวน์โหลดให้อัตโนมัติถ้ายังไม่มี) แล้วเริ่มแชท |
| `ollama pull <model>` | ดาวน์โหลดโมเดลมาเก็บไว้เฉย ๆ |
| `ollama list` | ดูโมเดลที่มีในเครื่อง |
| `ollama ps` | ดูโมเดลที่กำลังรันอยู่ |
| `ollama rm <model>` | ลบโมเดลออกจากเครื่อง |
| `ollama cp <src> <dst>` | คัดลอกโมเดล (ไว้ปรับแต่งต่อ) |
| `ollama show <model>` | ดูรายละเอียดโมเดล |

## 🏷️ การระบุรุ่น/ขนาด (tag)

ใส่ขนาดต่อท้ายด้วย `:` เช่น
```bash
ollama run llama3.2:1b      # รุ่นเล็ก เบา
ollama run qwen2.5:7b       # รุ่นกลาง
ollama run llama3.3:70b     # รุ่นใหญ่ ต้องการเครื่องแรง
```

## ▶️ ตัวอย่างใช้งาน

```bash
ollama run llama3.2
>>> สวัสดี ช่วยอธิบาย AI ให้หน่อย
# พิมพ์ /bye เพื่อออกจากแชท
```

## 💡 เคล็ดลับ

- รุ่นยิ่งใหญ่ยิ่งฉลาดแต่กิน RAM/VRAM มากขึ้น — เริ่มจากรุ่นเล็กก่อน
- ลบโมเดลที่ไม่ใช้ด้วย `ollama rm` เพื่อประหยัดพื้นที่

## 🔗 อ้างอิง

- เอกสาร/ซอร์สโค้ด: https://github.com/ollama/ollama
