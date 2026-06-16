---
title: "OpenClaw: เริ่มต้นใช้งาน (ติดตั้ง → onboard → แชต)"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "beginner"
summary: "ติดตั้ง OpenClaw รัน onboarding และคุยกับผู้ช่วย AI ได้ใน ~5 นาที"
readTime: "5 นาที"
readers: "0"
locked: false
order: 2
---

# เริ่มต้นใช้งาน OpenClaw

> เรียบเรียงจากเอกสารทางการ [Getting Started](https://docs.openclaw.ai/start/getting-started)

เป้าหมาย: ติดตั้ง OpenClaw, ตั้งค่าเริ่มต้น (onboarding) และมี **Gateway** ที่ทำงาน + เซสชันแชตพร้อมใช้ ภายในประมาณ 5 นาที

## ✅ สิ่งที่ต้องมีก่อน

- **Node.js** — แนะนำเวอร์ชัน **24** (รองรับตั้งแต่ 22.19+)
- **API key** จากผู้ให้บริการโมเดลสักเจ้า — Anthropic (Claude), OpenAI (GPT), Google (Gemini) ฯลฯ

## 🚀 ขั้นตอน

1. **ติดตั้ง** — รันสคริปต์ติดตั้ง (macOS/Linux ใช้ bash, Windows ใช้ PowerShell) ตามคำสั่งในหน้า Getting Started ทางการ
2. **Onboarding** — รัน:
   ```bash
   openclaw onboard --install-daemon
   ```
   ตัวช่วยจะพาตั้งค่า provider/โทเคน และติดตั้ง daemon (ให้ Gateway รันค้างเป็นบริการ)
3. **ตรวจสถานะ Gateway**:
   ```bash
   openclaw gateway status
   ```
4. **เปิดแดชบอร์ด**:
   ```bash
   openclaw dashboard
   ```
5. **ส่งข้อความแรก** ผ่านหน้า Control UI — ถ้าตอบกลับได้ แปลว่าทุกอย่างพร้อมแล้ว

## ⚙️ ตั้งค่าเพิ่มเติม (ทางเลือก)

- ปรับ path/สถานะผ่าน environment variable: `OPENCLAW_HOME`, `OPENCLAW_STATE_DIR`, `OPENCLAW_CONFIG_PATH`
- ปรับโฟลเดอร์หน้า Control UI ที่ `gateway.controlUi.root`

## ก้าวต่อไป

เชื่อมช่องทางแชต (ดูหัวข้อ **Channels**), เปิดใช้ความปลอดภัย (**Security**), หรือสำรวจ **Tools & Plugins**
