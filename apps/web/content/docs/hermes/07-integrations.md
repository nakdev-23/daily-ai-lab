---
title: "Hermes: Integrations — ต่อกับโมเดลและบริการ"
tool: "Hermes"
icon: "tool-hermes"
level: "pro"
summary: "เลือก provider โมเดล (Nous Portal, OpenRouter, OpenAI หรือ endpoint ใดก็ได้) และต่อ MCP"
readTime: "4 นาที"
readers: "0"
locked: false
order: 7
---

# Integrations — ต่อ Hermes เข้ากับโมเดล/บริการ

> เรียบเรียงจากเอกสารทางการ [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/) หมวด Integrations

## 🧠 Providers (แหล่งโมเดล)

Hermes ไม่ผูกกับโมเดลเดียว — ต่อได้หลายแหล่ง:

| Provider | หมายเหตุ |
|---|---|
| **Nous Portal** | แพลตฟอร์มของ Nous Research เอง |
| **OpenRouter** | เกตเวย์รวมหลายโมเดลในที่เดียว |
| **OpenAI** | โมเดล GPT |
| **Endpoint ใดก็ได้** | ต่อกับ API ที่เข้ากันได้เอง (รวมถึงโมเดลโลคัล) |

เตรียม **API key** ของแหล่งที่เลือก แล้วตั้งค่าใน Hermes

## 🔌 MCP (Model Context Protocol)

ต่อ **MCP servers** เพื่อให้ Hermes เข้าถึงเครื่องมือ/ข้อมูลภายนอกแบบมาตรฐาน — ขยายความสามารถได้โดยไม่ต้องเขียนปลั๊กอินเอง

## 🏗️ รันที่ไหนก็ได้

นอกจากเครื่องตัวเอง Hermes รันบน Docker, SSH, Daytona, Singularity หรือ Modal ได้ — เลือกโครงสร้างพื้นฐานตามงาน (เช่น รันค้างบน VPS เพื่อให้คุยผ่านแชตได้ตลอด)

> ดูการต่อแพลตฟอร์มแชตที่ **Messaging Platforms** และคำสั่งทั้งหมดที่ **Reference**
