---
title: "API Characters และ Avatars — สร้าง AI Digital Persona"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "เรียนรู้การใช้ Runway Characters API สำหรับสร้าง Digital Persona แบบ Real-time ที่พูดและแสดงอารมณ์ได้ เหมาะสำหรับ Customer Support, Education และ Brand Engagement"
readTime: "10 นาที"
readers: "0"
locked: false
order: 18
---

# API Characters และ Avatars — สร้าง AI Digital Persona

> **Runway Characters** ช่วยให้นักพัฒนาสร้าง Digital Persona (ตัวตนดิจิทัล) ที่สามารถสนทนาแบบ Real-time ได้ จากรูปภาพเพียงรูปเดียว

---

## Runway Characters คืออะไร?

**Runway Characters** (รันเวย์ แคแรคเตอร์ส — ระบบตัวละครดิจิทัลแบบ Real-time) เป็น Platform สำหรับสร้าง Conversational AI Persona ที่:
- พูดและแสดงอารมณ์ได้แบบ Real-time
- สร้างจากรูปภาพเดียว (ไม่ต้อง 3D model หรือ Fine-tuning)
- รองรับทั้งตัวละครคน การ์ตูน และ Non-human character
- ขับเคลื่อนด้วย **GWM-1** (General World Model รุ่น 1 ของ Runway)

---

## Use Cases หลัก

### Customer Support (บริการลูกค้า)
- Branded Avatar ที่แทน Brand ของคุณ
- ตอบคำถามลูกค้าแบบ Real-time
- ทำงานได้ตลอด 24 ชั่วโมง

### Educational Content (การศึกษา)
- ครู AI ที่มีอารมณ์และบุคลิกภาพ
- Tutor (ติวเตอร์) ที่ตอบสนองต่อคำถามนักเรียน
- Training Program ที่น่าสนใจ

### Brand Engagement (การมีส่วนร่วมกับแบรนด์)
- Mascot ที่พูดได้
- Virtual Ambassador (แบรนด์แอมบาสเดอร์เสมือนจริง)
- Interactive Product Demo

### Gaming (เกม)
- NPC ที่สนทนาได้จริงๆ
- Game Master (ผู้ดำเนินเกม) AI
- Story-driven interaction

---

## สถาปัตยกรรม Runway Characters

```
User (ผู้ใช้) ←→ Your App (แอปของคุณ) ←→ Runway Characters API ←→ GWM-1 Model
```

ระบบทำงานผ่าน **WebRTC** (เว็บอาร์ทีซี — เทคโนโลยีสำหรับการสื่อสาร Real-time ผ่านเบราว์เซอร์) หรือ **LiveKit** (ไลฟ์คิต — Framework สำหรับ Real-time Video/Audio)

---

## เริ่มต้นใช้ Characters API

### Quickstart (เริ่มเร็ว)

```bash
# ติดตั้ง Runway Avatars SDK
npm install @runwayml/avatars-sdk-react
```

### Components พื้นฐาน (React)

```tsx
import { RunwayAvatar } from '@runwayml/avatars-sdk-react';

function MyApp() {
  return (
    <RunwayAvatar
      apiKey={process.env.RUNWAY_API_KEY}
      characterId="your-character-id"
      onMessage={(message) => {
        console.log('Avatar said:', message);
      }}
    />
  );
}
```

---

## การสร้าง Custom Character

### ขั้นตอนที่ 1: เตรียมรูปตัวละคร

**ข้อกำหนดรูป Character:**
- ใบหน้าหันตรงหรือเอียงเล็กน้อย
- แสงดี เห็นลักษณะใบหน้าชัด
- ความละเอียดอย่างน้อย 512x512
- รูปแบบ: JPEG, PNG

**รองรับทุกประเภทตัวละคร:**
- คนจริง (Photorealistic)
- การ์ตูน / Illustration
- สัตว์ หรือ Non-human

### ขั้นตอนที่ 2: กำหนด Personality

**Personality** (บุคลิกภาพ) กำหนดด้วย System Prompt:

```javascript
const character = await runwayClient.characters.create({
  imageUri: 'https://example.com/character.jpg',
  name: 'Aria',
  personality: `
    You are Aria, a friendly customer support AI for TechCorp.
    You are helpful, professional, and speak in a warm tone.
    You specialize in software troubleshooting.
  `,
  voice: 'warm_female_voice_id',
  language: 'en-US'
});
```

### ขั้นตอนที่ 3: Knowledge Base (ฐานความรู้)

**Knowledge Base** (ฐานความรู้ — เอกสารที่ตัวละครจะรู้) คือเอกสารที่ตัวละครใช้ตอบคำถาม

```javascript
// เพิ่มเอกสารในฐานความรู้
await runwayClient.characters.documents.upload(characterId, {
  file: fs.createReadStream('/path/to/manual.pdf'),
  name: 'Product Manual'
});
```

ประเภทเอกสารที่รองรับ:
- PDF
- TXT
- Markdown
- Word Documents

---

## Custom Voices (เสียงที่กำหนดเอง)

### การสร้าง Custom Voice

**Custom Voice** (เสียงที่กำหนดเอง) ให้ตัวละครมีเสียงเฉพาะตัว

```javascript
// สร้าง Custom Voice จากตัวอย่างเสียง
const voice = await runwayClient.characters.voices.create({
  name: 'MyBrandVoice',
  samples: [
    { uri: 'https://example.com/voice-sample-1.mp3' },
    { uri: 'https://example.com/voice-sample-2.mp3' },
  ]
});

console.log('Voice ID:', voice.id);
```

### ข้อจำกัด Custom Voice
- ต้องมีสิทธิ์ในเสียงต้นแบบ
- ห้ามโคลนเสียงผู้อื่นโดยไม่ได้รับอนุญาต
- เสียงต้นแบบควรมีความยาวรวมอย่างน้อย 30 วินาที

---

## Embedded Widget (วิดเจ็ตฝังตัว)

**Embedded Widget** (วิดเจ็ตฝังตัว — Component ที่ฝังในเว็บไซต์ได้ง่าย) ช่วยให้เพิ่ม Avatar ลงในเว็บไซต์ได้โดยไม่ต้องพัฒนา UI เอง

```html
<!-- เพิ่ม Script Tag -->
<script src="https://cdn.runwayml.com/avatars-widget.js"></script>

<!-- วาง Widget -->
<div 
  id="runway-avatar"
  data-character-id="your-character-id"
  data-api-key="your-public-key"
  style="width: 400px; height: 600px;"
></div>
```

---

## Tool Calling — ให้ Avatar ทำงานกับระบบของคุณ

**Tool Calling** (การเรียกใช้เครื่องมือ — ให้ AI Avatar ทำงานกับ API ภายนอก) ช่วยให้ Avatar ทำได้มากกว่าแค่พูดคุย

### Client Tools (เครื่องมือฝั่ง Client)

ทำงานในเบราว์เซอร์หรือ Client application:

```javascript
const widget = new RunwayAvatarWidget({
  characterId: 'your-character-id',
  tools: [
    {
      name: 'search_products',
      description: 'Search for products in the catalog',
      parameters: {
        query: { type: 'string', description: 'Search query' }
      },
      handler: async ({ query }) => {
        const results = await searchProductDatabase(query);
        return results;
      }
    }
  ]
});
```

### Server Tools (เครื่องมือฝั่ง Server)

ทำงานบน Backend Server ของคุณ — ปลอดภัยกว่าสำหรับ Sensitive data:

```javascript
// กำหนด Server Tool
const tools = [
  {
    name: 'get_order_status',
    description: 'Get the status of a customer order',
    parameters: {
      orderId: { type: 'string' }
    },
    // URL ที่ Runway จะ call เพื่อรับผล
    serverUrl: 'https://api.yourcompany.com/order-status'
  }
];

// Runway จะ POST ไปที่ serverUrl ด้วย parameters
```

---

## Video Meeting Integration

**Video Meeting** (วิดีโอมีตติ้ง — การประชุมวิดีโอ) ช่วยให้ Avatar เข้าร่วมการประชุมวิดีโอได้

```javascript
// เริ่ม Video Meeting Session
const meeting = await runwayClient.characters.videoMeeting.start({
  characterId: 'your-character-id',
  roomUrl: 'https://meet.example.com/room/123',
  // หรือ
  callId: 'webrtc-call-id'
});
```

---

## LiveKit Integration

**LiveKit** (ไลฟ์คิต — Platform สำหรับ Real-time Audio/Video) สำหรับนักพัฒนาที่ต้องการควบคุม Audio/Video Pipeline เอง

```javascript
import { RunwayAvatarLiveKit } from '@runwayml/avatars-sdk-react';

function LiveAvatarRoom() {
  return (
    <RunwayAvatarLiveKit
      livekitUrl={process.env.LIVEKIT_URL}
      token={livekitToken}
      characterId="your-character-id"
    />
  );
}
```

---

## Camera and Screen Sharing

Avatar สามารถ "มองเห็น" สิ่งที่ผู้ใช้แชร์:

```javascript
// เปิด Camera Sharing
await avatarSession.enableCameraShare({
  onCapture: (frame) => {
    // Avatar จะรับ Visual context จาก Camera
  }
});

// เปิด Screen Sharing
await avatarSession.enableScreenShare({
  sourceId: 'entire-screen'
});
```

---

## ราคา Characters API

**GWM-1 Avatars Pricing:**
- 2 credits เมื่อเริ่มต้น Session
- 2 credits ต่อ 6 วินาที ของการโต้ตอบ

**ตัวอย่าง:**
- การสนทนา 1 นาที = 2 + (60/6 × 2) = 2 + 20 = **22 credits**
- การสนทนา 10 นาที = 2 + (600/6 × 2) = 2 + 200 = **202 credits**

---

## Troubleshooting — การแก้ปัญหา

### Avatar ไม่พูด / เสียงเงียบ
- ตรวจสอบ Browser Permissions สำหรับ Audio
- ตรวจสอบว่า Character มี Voice ที่กำหนด
- ตรวจสอบ Network Connection

### Avatar ใบปากไม่สอดคล้องกับเสียง (Lip Sync)
- ตรวจสอบ Network Latency (ความหน่วงของเครือข่าย)
- ลด Video Quality ถ้า Connection ช้า

### Character ไม่ตอบสนองต่อคำถาม
- ตรวจสอบ Personality Prompt ว่าครอบคลุมพอ
- ตรวจสอบ Knowledge Base ว่ามีข้อมูลที่เกี่ยวข้อง

---

## สรุป

Runway Characters API เปิดโอกาสสร้างประสบการณ์ที่ไม่เหมือนใคร ตั้งแต่ Customer Support Avatar ไปจนถึง Interactive Game Character ด้วย Tool Calling ตัวละครไม่ได้แค่พูดได้ แต่ทำงานกับระบบจริงของคุณได้ด้วย ซึ่งทำให้ Use Case ขยายออกไปไม่มีที่สิ้นสุด
