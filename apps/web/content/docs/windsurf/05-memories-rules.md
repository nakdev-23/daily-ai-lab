---
title: "Windsurf: Memories & Rules — ให้ AI จำสไตล์โปรเจกต์"
tool: "Windsurf"
icon: "tool-windsurf"
level: "intermediate"
summary: "ใช้ Memories และ Rules กำหนดให้ Cascade จำบริบทและทำตามแนวทางของโปรเจกต์"
readTime: "5 นาที"
readers: "0"
locked: false
order: 5
---

# Memories & Rules — สอน Windsurf ให้รู้ใจโปรเจกต์ 🧠

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [windsurf.com/docs](https://docs.windsurf.com/) หมวด Memories

เวลาทำงานโปรเจกต์เดิมซ้ำ ๆ คุณคงไม่อยากบอก AI ใหม่ทุกครั้งว่า "ใช้ TypeScript นะ" "ตั้งชื่อแบบนี้นะ" — **Memories** และ **Rules** ช่วยให้ Cascade จำสิ่งเหล่านี้ได้เอง

## 📖 สองอย่างนี้ต่างกันยังไง

| สิ่งที่ใช้ | คืออะไร |
|---|---|
| **Rules** | กฎที่ "คุณเขียนเอง" ให้ AI ทำตามเสมอ (เช่น สไตล์โค้ด ภาษาที่ใช้) |
| **Memories** | สิ่งที่ Cascade "จำเอง" ระหว่างทำงาน เพื่อใช้ต่อในอนาคต |

## ⭐ ใช้ทำอะไร

- กำหนดมาตรฐานโค้ด (เช่น "ใช้ 2 spaces", "คอมเมนต์เป็นภาษาไทย")
- บอกบริบทโปรเจกต์ (เช่น "นี่คือเว็บ Next.js + Supabase")
- ให้ AI จำสิ่งที่ตกลงกันไว้ ไม่ต้องพูดซ้ำ

## ▶️ วิธีตั้ง Rules

1. สร้างไฟล์กฎของโปรเจกต์ (เช่น ผ่านเมนู Rules ใน Windsurf)
2. เขียนแนวทางเป็นข้อ ๆ เช่น
   ```
   - ใช้ TypeScript เสมอ
   - ตั้งชื่อ component แบบ PascalCase
   - คอมเมนต์อธิบายเป็นภาษาไทย
   ```
3. Cascade จะอ้างอิงกฎเหล่านี้ทุกครั้งที่ทำงาน

## 🔗 อ้างอิง

- เอกสารทางการ: https://docs.windsurf.com/
