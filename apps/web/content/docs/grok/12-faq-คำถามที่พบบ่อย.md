---
title: "FAQ — คำถามที่พบบ่อย"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "ขึ้นอยู่กับช่องทางที่สมัคร:"
readTime: "4 นาที"
readers: "0"
locked: false
order: 12
---
# FAQ — คำถามที่พบบ่อย

> อ้างอิง: [FAQ - Grok Website/Apps](https://docs.x.ai/grok/faq) | [Data & Privacy](https://docs.x.ai/developers/faq/security) | [General FAQ](https://docs.x.ai/developers/faq/general)

---

## Billing & Subscriptions

### ยกเลิก SuperGrok ทำอย่างไร?

ขึ้นอยู่กับช่องทางที่สมัคร:

- **Web (grok.com):** ไปที่ [grok.com/?_s=billing](https://grok.com/?_s=billing) → Manage Subscription → Cancel
- **iOS:** จัดการผ่าน Apple App Store — [ยกเลิก](https://support.apple.com/en-us/118428) / [ขอเงินคืน](https://support.apple.com/en-us/118223)
- **Android:** จัดการผ่าน Google Play — [ยกเลิก](https://support.google.com/googleplay/answer/7018481) / [ขอเงินคืน](https://support.google.com/googleplay/workflow/9813244)

> **เคล็ดลับ:** ถ้าปุ่ม "Manage Subscription" ไม่ทำงาน ให้ลองใช้ Incognito Window หรือปิด Ad-blocker

### ขอเงินคืนได้ไหม?

| ช่องทาง | นโยบาย |
|---|---|
| Web (grok.com) | ทีม Refunds ของ xAI ตรวจสอบ ใช้เวลา 5–10 วันทำการ |
| iOS App Store | Apple จัดการ — ขอผ่าน Apple โดยตรง |
| Google Play | Google จัดการ — ขอผ่าน Google โดยตรง |
| API Credits | **ไม่สามารถขอคืนได้** |

### ทำไม Subscription ไม่แสดงในแอปมือถือ?

มักเกิดจากล็อกอินคนละบัญชี ตรวจสอบว่าล็อกอินด้วยบัญชีเดิมที่สมัครหรือเปล่า

### ใบแจ้งหนี้จำนวนมากที่ไม่รู้จักคืออะไร?

อาจเป็น **SuperGrok Heavy แบบรายปี** ไม่ใช่ค่า API ตรวจสอบวันที่ซื้อและประวัติ Subscription ก่อนโต้แย้ง

---

## บัญชีและการล็อกอิน

### เปลี่ยนอีเมลล็อกอินทำอย่างไร?

เพิ่มหรือเปลี่ยน Sign-in Methods ได้ที่ [accounts.x.ai](https://accounts.x.ai)

### ล็อกอินด้วย Apple "Hide My Email" แล้ว Subscription ไม่แสดง?

ต้องล็อกอินด้วย Apple Sign-in เท่านั้น (ไม่ใช่อีเมล private relay) ให้ใช้ "Sign in with Apple" ตัวเดิม

### ลบบัญชีทำอย่างไร?

ไปที่ [accounts.x.ai/account](https://accounts.x.ai/account) บัญชีที่ลบสามารถกู้คืนได้ภายใน **30 วัน**

---

## ภาพและวิดีโอ (Grok Imagine)

### ทำไมภาพที่สร้างมี Watermark "grok"? ลบได้ไหม?

**ไม่ได้** Watermark เป็นข้อกำหนดทางกฎหมายในบางประเทศ (เช่น อินเดีย ออสเตรเลีย) xAI ไม่สามารถปิดได้ในที่ที่กฎหมายกำหนด

### เปิด NSFW แล้วยังถูก Block อยู่?

การเปิด NSFW ไม่ได้ทำให้ Grok ไม่มีการ Moderate — ยังมีการกรองเนื้อหาอยู่ Algorithm เปลี่ยนบ่อย ไม่มีกฎตายตัว

### วิดีโอ 720p ได้แค่ 480p?

วิดีโอ 720p จะ Fallback เป็น 480p โดยอัตโนมัติเมื่อถึง Quota 720p ของ Plan นั้น

---

## ผลิตภัณฑ์และโมเดล

### Grok Studio ไปไหน?

**Grok Studio ถูกยกเลิกแล้ว** ให้ใช้ **Grok Build** แทน ถ้า Third-party App ใดใช้ Grok Credentials เพื่อเข้า Studio ให้เพิกถอนสิทธิ์ทันที

### ควรใช้ grok.com หรือ grok.x.ai?

ใช้ **grok.com** ใน Chrome/Chromium มาตรฐาน grok.x.ai อาจมีฟีเจอร์บางอย่างไม่ครบ เช่น Projects

---

## ไฟล์และข้อมูล

### อัปโหลดไฟล์ทำอย่างไร?

1. กดปุ่ม **+** ข้างช่องพิมพ์
2. เลือกไฟล์ (หรือลากวางบน Web)
3. ส่งพร้อมข้อความ

### ไฟล์ขนาดสูงสุดเท่าไหร่?

**150 MB ต่อไฟล์** สำหรับเอกสาร ภาพ โค้ด และเสียง

### Grok เห็นไฟล์ได้กี่ไฟล์พร้อมกัน?

- Web: ~100 ไฟล์
- Android: 20 ไฟล์
- iOS: หลายไฟล์

### ลบไฟล์ทำอย่างไร?

ไปที่ [grok.com/files](https://grok.com/files) หรือ **Profile → Settings → Data Controls**

---

## คำถามสำหรับนักพัฒนา (Data & Privacy FAQ)

อ้างอิง: [Data & Privacy](https://docs.x.ai/developers/faq/security)

### xAI เก็บข้อมูล Conversation ของฉันไหม?

xAI มี Data Retention Policy ที่แตกต่างกันตาม Plan:
- **API Free Tier:** อาจใช้ข้อมูลเพื่อพัฒนาโมเดล
- **Enterprise:** มีนโยบาย Custom Retention ตามที่ตกลง

ดูรายละเอียดเพิ่มเติมที่ [x.ai/legal](https://x.ai/legal)

### API Key ควรเก็บอย่างไร?

- **ไม่ควร:** Hardcode ใน Source Code
- **ควร:** ใช้ Environment Variables หรือ Secret Manager
- **ควร:** Rotate API Key เป็นประจำ
- **ควร:** ใช้ mTLS สำหรับระบบ High Security

### ถ้า API Key รั่ว ต้องทำอะไร?

1. ไปที่ [console.x.ai/team/default/api-keys](https://console.x.ai/team/default/api-keys) ทันที
2. ลบ API Key ที่รั่ว
3. สร้าง API Key ใหม่
4. อัปเดต Key ในทุกระบบที่ใช้งาน

### xAI มีปัญหาเรื่องโฆษณาไหม?

xAI ไม่มีโฆษณาใน Products และไม่รับเงินจาก Advertiser เพื่อโปรโมทสินค้าในการสนทนา

---

## General FAQ

อ้างอิง: [General FAQ](https://docs.x.ai/developers/faq/general)

### Grok รู้เรื่องปัจจุบันไหม?

โมเดล Grok 3 และ Grok 4 มี Knowledge Cutoff **พฤศจิกายน 2024** หากต้องการข้อมูลล่าสุด ต้องเปิดใช้ **Web Search** หรือ **X Search** Tool

### API Compatible กับ OpenAI SDK ได้ไหม?

ได้ เพียงเปลี่ยน `base_url` เป็น `https://api.x.ai/v1` — ไม่จำเป็นต้องเปลี่ยนโค้ดอื่น

### มี SDK อะไรบ้าง?

| SDK | ติดตั้ง |
|---|---|
| xAI SDK (Python) | `pip install xai-sdk` |
| OpenAI SDK (Python) | `pip install openai` |
| AI SDK (JavaScript) | `npm install ai @ai-sdk/xai` |
| OpenAI SDK (JavaScript) | `npm install openai` |

### ติดต่อ xAI ได้ช่องทางไหนบ้าง?

| ช่องทาง | ใช้สำหรับ |
|---|---|
| [support@x.ai](mailto:support@x.ai) | Support ทั่วไป |
| [sales@x.ai](mailto:sales@x.ai) | Enterprise Sales / Rate Limit เพิ่ม |
| [Discord](https://discord.gg/x-ai) | Community Developer |
| [grok.com/report](https://grok.com) | Report Bug ในแอป |
| [x.ai/legal](https://x.ai/legal) | Terms & Policies |
| [status.x.ai](https://status.x.ai) | API Status |

---

## Migration Guides

### Model Retirement (15 พฤษภาคม 2026)

อ้างอิง: [Model Retirement May 15](https://docs.x.ai/developers/migration/may-15-retirement)

xAI เลิกรองรับโมเดลเก่าบางตัวในวันที่ 15 พฤษภาคม 2026 ตรวจสอบว่าใช้โมเดลอะไรอยู่และ Migrate มายัง `grok-4.3` หรือเวอร์ชันใหม่กว่า

### Migrate จาก Chat Completions API มา Responses API

อ้างอิง: [Migrating to Responses API](https://docs.x.ai/developers/model-capabilities/text/comparison)

| เดิม (Chat Completions) | ใหม่ (Responses API) |
|---|---|
| `client.chat.completions.create()` | `client.responses.create()` |
| `messages` parameter | `input` parameter |
| `choices[0].message.content` | `output_text` |

**ตัวอย่าง Migration:**

```python
# แบบเก่า (Chat Completions)
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "สวัสดี"}]
)
text = response.choices[0].message.content

# แบบใหม่ (Responses API)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "สวัสดี"}]
)
text = response.output_text
```
