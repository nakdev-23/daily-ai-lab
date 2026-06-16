---
title: "Hugging Face: Hub — โมเดล ชุดข้อมูล และ Spaces"
tool: "Hugging Face"
icon: "tool-huggingface"
level: "beginner"
summary: "ทำความรู้จัก Hugging Face Hub ศูนย์รวมโมเดล ชุดข้อมูล และแอปสาธิต"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---

# Hugging Face Hub — ศูนย์รวมของทุกอย่าง 🏛️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [huggingface.co/docs/hub](https://huggingface.co/docs/hub)

**Hub** คือหัวใจของ Hugging Face — เป็นที่ที่ทุกคนมาแชร์และค้นหา 3 อย่างหลัก

## 🗂️ สามสิ่งหลักบน Hub

| ประเภท | คืออะไร |
|---|---|
| **Models** | โมเดล AI ที่เทรนไว้แล้ว พร้อมนำไปใช้ |
| **Datasets** | ชุดข้อมูลสำหรับเทรน/ทดสอบ |
| **Spaces** | แอปสาธิต AI ที่รันบนเว็บได้ทันที |

## 🔍 การค้นหาโมเดล

- กรองตาม **task** (เช่น text generation, image classification, speech)
- กรองตามภาษา, ขนาด, ใบอนุญาต (license)
- ดู **Model Card** — หน้าอธิบายโมเดล (วิธีใช้ ข้อจำกัด ตัวอย่าง)

## 📦 Repository แบบ Git

ทุกโมเดل/ชุดข้อมูลคือ Git repository — มีประวัติเวอร์ชัน, ดาวน์โหลดได้, อัปโหลดของตัวเองได้ รองรับไฟล์ใหญ่ด้วย Git LFS

## ▶️ เริ่มต้น

1. สมัครบัญชีที่ [huggingface.co](https://huggingface.co/)
2. ค้นโมเดลในแท็บ **Models** เลือกตาม task ที่ต้องการ
3. อ่าน Model Card แล้วกด "Use this model" เพื่อดูวิธีเรียกใช้

## 📚 ถัดไป

- [Transformers — ใช้โมเดลด้วยโค้ด](03-transformers)
- [Inference — เรียกใช้โมเดลผ่าน API](04-inference)

## 🔗 อ้างอิง

- เอกสาร Hub: https://huggingface.co/docs/hub
