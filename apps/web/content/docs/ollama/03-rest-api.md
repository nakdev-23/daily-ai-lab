---
title: "Ollama: REST API & OpenAI-compatible"
tool: "Ollama"
icon: "tool-ollama"
level: "intermediate"
summary: "เรียกใช้โมเดลที่รันด้วย Ollama จากโค้ดผ่าน REST API"
readTime: "5 นาที"
readers: "0"
locked: false
order: 3
---

# เรียก Ollama จากโค้ดผ่าน API 🔌

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [github.com/ollama/ollama](https://github.com/ollama/ollama/blob/main/docs/api.md)

เมื่อ Ollama ทำงาน มันเปิดเซิร์ฟเวอร์ API ในเครื่องที่ **`http://localhost:11434`** ให้โปรแกรมอื่นเรียกใช้โมเดลได้

## 🧱 เอนด์พอยต์หลัก

| เอนด์พอยต์ | ใช้ทำอะไร |
|---|---|
| `POST /api/generate` | สร้างข้อความจาก prompt เดียว |
| `POST /api/chat` | สนทนาแบบหลายข้อความ (มี role) |
| `POST /api/embeddings` | สร้าง embedding ของข้อความ |
| `GET /api/tags` | ดูโมเดลที่มีในเครื่อง |

## ▶️ ตัวอย่าง generate

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "อธิบาย AI ใน 2 ประโยค",
  "stream": false
}'
```

## ▶️ ตัวอย่าง chat

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role":"user","content":"สวัสดี"}]
}'
```

## 🔄 OpenAI-compatible

Ollama ยังมีเอนด์พอยต์ที่ **เข้ากันได้กับ OpenAI** ที่ `/v1/...` — ใช้ SDK ของ OpenAI ได้โดยชี้ base URL มาที่ `http://localhost:11434/v1` ทำให้ย้ายโค้ดเดิมมาได้ง่าย

## 💡 เคล็ดลับ

- ตั้ง `"stream": true` เพื่อรับผลทีละส่วน (ตอบเร็วขึ้น)
- รันบนเครื่อง = ข้อมูลไม่ออกไปไหน เหมาะกับงานที่ห่วงความเป็นส่วนตัว

## 🔗 อ้างอิง

- เอกสาร API: https://github.com/ollama/ollama/blob/main/docs/api.md
