---
title: "Lovable: Integrations — Supabase และ GitHub"
tool: "Lovable"
icon: "tool-lovable"
level: "intermediate"
summary: "เชื่อม Lovable กับ Supabase สำหรับฐานข้อมูล/ล็อกอิน และ sync โค้ดกับ GitHub"
readTime: "5 นาที"
readers: "0"
locked: false
order: 3
---

# Integrations — ต่อ Supabase และ GitHub 🔌

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [docs.lovable.dev](https://docs.lovable.dev/)

Lovable สร้างหน้าตาได้ แต่แอปจริงต้องมีที่เก็บข้อมูลและระบบสมาชิก — ตรงนี้ใช้ Supabase

## 🗄️ Supabase (ฐานข้อมูล + Auth)

**Supabase** คือบริการฐานข้อมูล + ระบบล็อกอินที่ Lovable ต่อให้ในตัว

- **Database** — เก็บข้อมูลแอป (เช่น โน้ต ผู้ใช้ คำสั่งซื้อ)
- **Authentication** — ระบบสมัคร/ล็อกอิน
- **Storage** — เก็บไฟล์/รูป

วิธีเชื่อม (ภาพรวม):
1. กดเชื่อม Supabase ในโปรเจกต์ Lovable
2. อนุญาต/สร้างโปรเจกต์ Supabase
3. สั่ง Lovable เพิ่มฟีเจอร์ที่ใช้ข้อมูล เช่น "ให้บันทึกโน้ตลงฐานข้อมูล และให้ผู้ใช้เห็นเฉพาะของตัวเอง"

## 🐙 GitHub (sync โค้ด)

เชื่อม GitHub เพื่อ:
- **sync โค้ด** ออกไปเก็บใน repository
- แก้โค้ดเองนอก Lovable แล้วซิงก์กลับ
- ทำงานร่วมกับนักพัฒนาในทีม

## 💡 เคล็ดลับ

- ต่อ Supabase ตั้งแต่ตอนเริ่มเก็บข้อมูลจริง
- ใช้ GitHub เป็น backup และทางออกถ้าอยากย้ายไปแก้เองภายหลัง
- ระวังเรื่องสิทธิ์การเข้าถึงข้อมูล (ให้ผู้ใช้เห็นเฉพาะของตัวเอง)

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.lovable.dev/
