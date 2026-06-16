---
title: "Hugging Face: Transformers — ใช้โมเดลด้วยโค้ด"
tool: "Hugging Face"
icon: "tool-huggingface"
level: "intermediate"
summary: "ใช้ไลบรารี transformers โหลดและรันโมเดลจาก Hub ด้วย pipeline ง่าย ๆ"
readTime: "6 นาที"
readers: "0"
locked: false
order: 3
---

# Transformers — ไลบรารีหลักของ Hugging Face 🐍

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [huggingface.co/docs/transformers](https://huggingface.co/docs/transformers)

**Transformers** คือไลบรารี Python ยอดนิยมที่ใช้โหลดและรันโมเดลจาก Hub ได้ในไม่กี่บรรทัด รองรับ PyTorch / TensorFlow / JAX

## ⚡ วิธีง่ายที่สุด: pipeline

`pipeline` ห่อทุกอย่าง (โหลดโมเดล + เตรียมข้อมูล + รัน) ไว้ให้แล้ว

```python
from transformers import pipeline

# วิเคราะห์อารมณ์ข้อความ
clf = pipeline("sentiment-analysis")
print(clf("ฉันชอบเรียน AI มาก!"))

# สร้างข้อความ
gen = pipeline("text-generation", model="gpt2")
print(gen("Once upon a time"))
```

## 🧩 task ที่ใช้บ่อย

| task | ทำอะไร |
|---|---|
| `text-generation` | สร้างข้อความต่อ |
| `sentiment-analysis` | วิเคราะห์อารมณ์ |
| `translation` | แปลภาษา |
| `summarization` | สรุปความ |
| `image-classification` | จำแนกภาพ |
| `automatic-speech-recognition` | ถอดเสียงเป็นข้อความ |

## 🔧 ควบคุมเองมากขึ้น

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
tok = AutoTokenizer.from_pretrained("model-name")
model = AutoModelForCausalLM.from_pretrained("model-name")
```
ใช้เมื่อต้องการคุมรายละเอียด (เช่น batching, การตั้งค่า generate)

## 💡 เคล็ดลับ

- ติดตั้ง: `pip install transformers torch`
- โมเดลใหญ่ดาวน์โหลดครั้งแรกอาจนาน — จะถูก cache ไว้
- ดูตัวอย่างโค้ดได้จาก Model Card ของแต่ละโมเดล

## 🔗 อ้างอิง

- เอกสาร Transformers: https://huggingface.co/docs/transformers
