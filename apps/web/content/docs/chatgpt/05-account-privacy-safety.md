---
title: "บัญชี, ความเป็นส่วนตัว & ความปลอดภัย"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "intermediate"
summary: "การใช้ ChatGPT ต้องมีบัญชี OpenAI สมัครได้ที่ chatgpt.com"
readTime: "6 นาที"
readers: "0"
locked: false
order: 5
---
# ChatGPT คู่มือภาษาไทย — ตอนที่ 5: บัญชี, ความเป็นส่วนตัว & ความปลอดภัย
> อ้างอิงหลัก: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## การจัดการบัญชี

### สมัครบัญชี OpenAI
การใช้ ChatGPT ต้องมีบัญชี OpenAI สมัครได้ที่ [chatgpt.com](https://chatgpt.com)

**วิธีสมัคร:**
1. ไปที่ [chatgpt.com](https://chatgpt.com) → กด **Sign Up** (สมัครสมาชิก)
2. เลือกวิธีสมัคร:
   - Email + Password (อีเมลและรหัสผ่าน)
   - Google Account
   - Microsoft Account
   - Apple ID (iOS)
3. ยืนยัน Email (ถ้าสมัครด้วย Email)
4. กรอกชื่อและวันเกิด
5. เสร็จสิ้น — เข้าใช้งานได้เลย

### ตั้งค่าภาษา
อ้างอิง: [How to change your language setting in ChatGPT](https://help.openai.com/en/articles/8077070-how-to-change-your-language-setting-in-chatgpt)

ChatGPT ตรวจจับภาษาจาก Browser Setting (การตั้งค่าภาษาของโปรแกรมท่องเว็บ) ของคุณ หากต้องการตั้งเป็นภาษาไทย:
1. ตั้ง Browser Language เป็นภาษาไทย
2. ChatGPT อาจแสดง UI (User Interface — ส่วนติดต่อผู้ใช้ เช่น เมนู ปุ่ม ข้อความ) เป็นภาษาไทยในบางส่วน ขึ้นอยู่กับ Region (ภูมิภาค) ที่รองรับ

---

## Billing & Subscription — การชำระเงิน

### วิธีจัดการ Subscription (การสมัครสมาชิก)
อ้างอิง: [How do I resolve a billing issue?](https://help.openai.com/en/articles/6943700-how-do-i-resolve-a-billing-issue)

1. ไปที่ **Settings → Manage Subscription** (จัดการการสมัครสมาชิก) บนเว็บ
2. จากที่นี่คุณสามารถ:
   - ดูรายละเอียดแผนปัจจุบัน
   - อัปเกรด (เพิ่มระดับแผน) หรือเปลี่ยนแผน
   - ยกเลิก Subscription
   - ดาวน์โหลด Invoice (ใบเสร็จ — เอกสารแสดงรายการค่าใช้จ่าย)

### รับ Invoice
- **Web/Desktop**: Settings → Manage Subscription → ดาวน์โหลด Invoice
- **iOS App Subscriber**: ต้องดู Invoice ผ่าน Apple App Store โดยตรง
- อ้างอิง: [How do I obtain my invoice if I subscribed from App Store?](https://help.openai.com/en/articles/7951521)

### ยกเลิก Subscription
- **Web**: Settings → Manage Subscription → Cancel Plan
- **iOS**: ต้องยกเลิกผ่าน App Store → Your Apple ID → Subscriptions
- **Android**: ต้องยกเลิกผ่าน Google Play Store → Subscriptions
- หลังยกเลิกยังใช้งานได้จนหมดรอบบิล (Billing Cycle — รอบการเรียกเก็บเงิน)

### ปัญหาการชำระเงิน
ปัญหาที่พบบ่อย:
- บัตรไม่ผ่าน: ตรวจสอบข้อมูลบัตร, วงเงิน, หรือถามธนาคาร
- ถูกเรียกเก็บซ้ำ: ติดต่อ Support พร้อมแนบ Screenshot (ภาพหน้าจอ)
- บัตรไม่รองรับ: ใช้บัตรที่รองรับ International Transaction (การทำธุรกรรมระหว่างประเทศ)

---

## Data Controls — ควบคุมข้อมูลของคุณ
อ้างอิง: [Data Controls FAQ](https://help.openai.com/en/articles/7730893-data-controls-faq)

### หัวข้อนี้คืออะไร
Data Controls (การควบคุมข้อมูล — การตั้งค่าที่ให้คุณกำหนดว่า ChatGPT จะจัดการข้อมูลของคุณอย่างไร) คือการตั้งค่าที่ให้คุณควบคุมว่า ChatGPT จะใช้ข้อมูลการสนทนาของคุณอย่างไร

### การตั้งค่าหลัก

**"Improve the model for everyone" (ช่วยพัฒนาโมเดลสำหรับทุกคน)**
- เมื่อเปิด: OpenAI อาจนำการสนทนาของคุณไปฝึกโมเดล (Train — กระบวนการที่ AI เรียนรู้จากข้อมูลเพื่อพัฒนาความสามารถ) AI ต่อไป
- เมื่อปิด: การสนทนาจะยังบันทึกใน History (ประวัติ) แต่ไม่ถูกนำไปฝึก

**วิธีปิด (บน Web):**
1. คลิกโปรไฟล์ → **Settings**
2. ไปที่ **Data Controls**
3. ปิด **"Improve the model for everyone"**

**วิธีปิด (บน Mobile):**
1. เปิด Sidebar (แถบด้านข้าง) → แตะโปรไฟล์
2. เลือก **Data Controls**
3. ปิด Toggle (สวิตช์เปิด-ปิด)

### สิ่งที่ควรรู้
- การตั้งค่านี้ sync (ซิงก์ — อัปเดตพร้อมกันทุกอุปกรณ์) ระหว่างทุกอุปกรณ์
- แผน **Team, Enterprise, Edu** ข้อมูลไม่ถูกนำไปฝึกโมเดลโดยค่าตั้งต้น
- การปิด Memory/Personalization **ไม่ได้** ปิด Safety Features (ฟีเจอร์ความปลอดภัย — ระบบที่ป้องกันการตอบสนองที่เป็นอันตราย) ที่ต้องใช้บริบทบางส่วนเพื่อตอบอย่างปลอดภัย

---

## ความเป็นส่วนตัวของข้อมูล
อ้างอิง: [How Your Data is Used to Improve Model Performance](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance)

### OpenAI ใช้ข้อมูลของคุณอย่างไร

**ข้อมูลที่อาจถูกใช้ฝึกโมเดล (ถ้าเปิด):**
- การสนทนาข้อความ
- ไฟล์ที่อัปโหลด
- Transcript (บทพูด — ข้อความที่แปลงมาจากเสียง) ของ Voice Conversation (การสนทนาด้วยเสียง)
- Feedback (การให้คะแนน — กดถูก/ผิด ว่าชอบหรือไม่ชอบคำตอบ) (Thumbs Up/Down)

**ข้อมูลที่ไม่ถูกนำไปฝึก (โดยค่าตั้งต้น):**
- Audio Clips (ไฟล์เสียง) จาก Voice Chat
- Video Clips (ไฟล์วิดีโอ) จาก Voice Chat
- ข้อมูลทุกอย่างของแผน Team, Enterprise, Edu

**สิทธิ์ที่คุณมี:**
- ปิดการใช้ข้อมูลสำหรับฝึกโมเดล
- Export (ส่งออก — ดาวน์โหลด) ข้อมูลของตัวเองออกมา
- ลบบัญชีและข้อมูลทั้งหมด

### เกี่ยวกับ API
OpenAI **ไม่นำข้อมูล API** (ข้อมูลที่ส่งผ่านช่องทางสำหรับนักพัฒนา) ไปฝึกโมเดล (ตั้งแต่ 1 มีนาคม 2023) ข้อมูล API เก็บ 30 วันแล้วลบ

---

## การเก็บรักษา Chat และไฟล์
อ้างอิง: [How are Files vs Chats Retained?](https://help.openai.com/en/articles/8983778-how-are-files-vs-chats-retained)

### Chat
- Chat (บทสนทนา) บันทึกในบัญชีจนกว่าคุณจะลบ
- ลบ Chat แล้ว → ถูกลบออกจากระบบภายใน **30 วัน**
- ลบบัญชีแล้ว → ถูกลบออกจากระบบภายใน **30 วัน**
- **ยกเว้น**: Chat ที่ถูก Anonymize (ทำให้ไม่ระบุตัวตน — แยกออกจากบัญชีแล้วแต่ยังเก็บเนื้อหา) อาจยังถูกเก็บไว้

### ไฟล์
- ไฟล์ที่อัปโหลดใน Chat เก็บตราบเท่าที่มี Chat อยู่
- ลบ Chat → ไฟล์ถูกลบภายใน 30 วัน
- ไฟล์ใน Custom GPT (GPT ปรับแต่งพิเศษ) → เก็บไว้จนกว่าจะลบ GPT
- ไฟล์ที่ประมวลผลผ่าน Data Analysis (การวิเคราะห์ข้อมูล): ระยะเวลาขึ้นอยู่กับแผน

### Archive vs Delete (เก็บถาวร vs ลบ)
- **Archive** (เก็บถาวร): Chat ยังอยู่ในระบบ แต่ไม่แสดงใน History หลัก — เหมือนใส่กล่องเก็บของ ยังมีอยู่แต่ไม่ขัดสายตา
- **Delete** (ลบ): ลบจริง ข้อมูลถูกลบภายใน 30 วัน ไม่สามารถกู้คืนได้

### Audio/Video จาก Voice Chat
- เก็บ 30 วันพร้อมกับ Chat
- ลบ Chat → Audio/Video ถูกลบภายใน 30 วัน

---

## Export ข้อมูล
อ้างอิง: [How do I export my ChatGPT history and data?](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data)

### วิธี Export
1. ไปที่ **Settings → Data Controls**
2. คลิก **Export Data** (ส่งออกข้อมูล)
3. ยืนยันผ่าน Email
4. OpenAI จะส่งไฟล์ .zip (ไฟล์บีบอัด — รวมหลายไฟล์เป็นไฟล์เดียวขนาดเล็กลง) มาที่ Email ของคุณ (อาจใช้เวลาสักครู่)

### ข้อมูลที่ได้รับใน Export
- ประวัติ Chat ทั้งหมด (ไฟล์ .html หรือ .json — รูปแบบไฟล์ข้อมูลที่โปรแกรมอ่านได้)
- ข้อมูลบัญชี
- หมายเหตุ: **Shared Links (ลิงก์แชร์) ไม่รวมอยู่ใน Export**

---

## ความปลอดภัยของบัญชี

### บัญชีถูก Hack หรือเข้าถึงโดยไม่ได้รับอนุญาต
อ้างอิง: [I'm seeing unrecognized activity on my OpenAI account](https://help.openai.com/en/articles/6986626)

**ทำทันที:**
1. **เปลี่ยนรหัสผ่าน** ที่ [account.openai.com](https://account.openai.com)
2. **ออกจากระบบ** ในทุกอุปกรณ์ (Settings → Sign Out All Devices)
3. ตรวจสอบ Email ว่ามีการใช้ที่ผิดปกติหรือไม่
4. ถ้า Email ก็ถูกเข้าถึง ให้รีบเปลี่ยน Email Password ด้วย
5. ติดต่อ [OpenAI Support](https://help.openai.com)

### ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต
- ใช้รหัสผ่านที่แข็งแรงและไม่ซ้ำกับที่อื่น
- เปิด Two-Factor Authentication หรือ 2FA (การยืนยันตัวตนสองขั้น — ต้องใส่รหัสจากโทรศัพท์เพิ่มเติมหลังจากใส่รหัสผ่าน เพื่อความปลอดภัยสองชั้น) ถ้ามี
- ระวัง Phishing Email (อีเมลหลอกลวง — ส่งมาแอบอ้างเป็น OpenAI เพื่อขโมยข้อมูล) ที่แอบอ้างเป็น OpenAI

---

## แอปมือถือ

### iOS App
อ้างอิง: [ChatGPT iOS App FAQ](https://help.openai.com/en/articles/7143494-chatgpt-ios-app-faq)

**ดาวน์โหลด**: App Store → ค้นหา "ChatGPT" (ไอคอนสีดำ)
**ความต้องการระบบ**: ขึ้นอยู่กับเวอร์ชัน iOS ปัจจุบัน

**ฟีเจอร์พิเศษใน iOS:**
- **Siri Integration** (การเชื่อมต่อกับ Siri — ผู้ช่วยเสียง AI ของ Apple): ถาม ChatGPT ผ่าน Siri ได้
  - Settings → Siri & Shortcuts (ทางลัด) → เพิ่ม Shortcut สำหรับ ChatGPT
- **iPad Drag & Drop** (ลากและวาง): ลากไฟล์หรือรูปจากแอปอื่นมาวางได้โดยตรง
- **iPad Support**: รองรับทั้ง iPhone และ iPad

**วิธีปิด Chat History บน iOS:**
1. Sidebar → แตะโปรไฟล์ → Data Controls
2. ปิด "Improve the model for everyone"

**ยกเลิก Plus บน iOS:**
- ต้องยกเลิกผ่าน **App Store** ไม่สามารถยกเลิกในแอปได้
- App Store → Apple ID → Subscriptions → ChatGPT Plus → Cancel

### Android App
อ้างอิง: [ChatGPT Android App FAQ](https://help.openai.com/en/articles/8494952-chatgpt-android-app-faq)

**ดาวน์โหลด**: [Google Play Store](https://play.google.com/) → ค้นหา "ChatGPT"
**Browser แนะนำ**: Google Chrome สำหรับประสบการณ์ที่ดีที่สุด

**วิธี Login (เข้าสู่ระบบ) ด้วย Microsoft Account บน Android:**
- เลือก "Continue with Microsoft" ในหน้า Login
- อ้างอิง: [How to login to Android app with Microsoft](https://help.openai.com/en/articles/9137706)

**Export (ส่งออก) ข้อมูลบน Android:**
1. Settings → Data Controls → Export Data

**ยกเลิก Plus บน Android:**
- Google Play Store → Account → Subscriptions → ChatGPT Plus → Cancel

### macOS App
อ้างอิง: [Downloading the ChatGPT macOS app](https://help.openai.com/en/articles/9275200-downloading-the-chatgpt-macos-app)

**ดาวน์โหลด**: [openai.com/chatgpt/desktop](https://openai.com/chatgpt/desktop/)
**ความต้องการ**: macOS 14+ และ Apple Silicon (ชิปประมวลผลที่ Apple ออกแบบเอง — M1 หรือดีกว่า)

**Quick Access (เข้าถึงด่วน):**
- กด **⌥ (Option) + Space** เพื่อเปิด Chat Bar (แถบแชต — หน้าต่างเล็กสำหรับพิมพ์คำถามโดยไม่ต้องเปิดแอปเต็ม) ได้ทุกเมื่อ แม้อยู่ใน App อื่น
- อ้างอิง: [How to launch the Chat Bar](https://help.openai.com/en/articles/9295241-how-to-launch-the-chat-bar)

---

## Troubleshooting — แก้ปัญหาที่พบบ่อย
อ้างอิง: [ChatGPT Error Messages](https://help.openai.com/en/articles/6897133-chatgpt-error-messages)

### ข้อความ Error (ข้อผิดพลาด) ที่พบบ่อยและวิธีแก้

**"Something went wrong"**
- ปัญหา: เซิร์ฟเวอร์ (Server — คอมพิวเตอร์ที่ให้บริการ) มีปัญหาชั่วคราว
- แก้: รีเฟรช (โหลดหน้าใหม่) หรือรอสักครู่แล้วลองใหม่
- ตรวจสอบ: [status.openai.com](https://status.openai.com)

**"There was a problem preparing your chat"**
- ปัญหา: โหลดการสนทนาไม่ได้
- แก้: ล้าง Cache (แคช — ข้อมูลชั่วคราวที่ Browser เก็บไว้เพื่อโหลดหน้าเว็บเร็วขึ้น)/Cookies (คุกกี้ — ข้อมูลเล็กๆ ที่เว็บบันทึกในเครื่องคุณ) ของ Browser, ลอง Incognito Mode (โหมดไม่ระบุตัวตน — เปิด Browser ใหม่ที่ไม่มี Cache และ Cookies เก่า)

**"We detect suspicious activity"**
- ปัญหา: IP (หมายเลขที่อยู่เครือข่าย) หรือพฤติกรรมถูกตั้งข้อสงสัย
- แก้: เปลี่ยน Network (เปลี่ยนเครือข่าย) ปิด VPN (โปรแกรมเปลี่ยน IP) ถ้าใช้อยู่ ลอง Network อื่น
- ถ้าไม่หาย: ติดต่อ Support

**"Our systems have detected unusual activity from your system"**
- คล้ายกับข้างต้น เกิดจาก Rate Limiting (การจำกัดความถี่ — ป้องกันการส่งคำขอมากเกินไปในเวลาสั้น) หรือ Security System (ระบบความปลอดภัย)
- แก้: หยุดใช้งานสักครู่แล้วลองใหม่

**ChatGPT ตอบช้า**
อ้างอิง: [Why is my ChatGPT taking so long to respond?](https://help.openai.com/en/articles/7965556)
- ช่วง Peak (ชั่วโมงเร่งด่วน — ช่วงที่มีผู้ใช้จำนวนมากพร้อมกัน) ผู้ใช้จำนวนมาก เซิร์ฟเวอร์อาจช้า
- เปลี่ยนไปใช้โมเดลที่เร็วกว่า เช่น GPT-5.5 mini
- ตรวจสอบ Status (สถานะระบบ): [status.openai.com](https://status.openai.com)

**CAPTCHA (แบบทดสอบยืนยันความเป็นมนุษย์) ขึ้นบ่อย**
อ้างอิง: [CAPTCHAs in ChatGPT](https://help.openai.com/en/articles/8098338-captchas-in-chatgpt)
- ปกติ: ใช้เพื่อยืนยันว่าเป็นมนุษย์ ไม่ใช่ Bot (โปรแกรมอัตโนมัติ)
- ถ้าขึ้นบ่อยมาก: ลอง Disable (ปิดการใช้งาน) Browser Extensions (ส่วนเสริม Browser) เช่น Ad Blocker (ตัวบล็อกโฆษณา)
- ลอง Browser อื่น

**ปัญหา Network / Network Recommendations (คำแนะนำด้านเครือข่าย)**
อ้างอิง: [Network recommendations for ChatGPT errors on web](https://help.openai.com/en/articles/8498848)

ChatGPT ต้องการ:
- การเชื่อมต่ออินเทอร์เน็ตที่เสถียร
- ไม่มี Firewall (กำแพงไฟ — ระบบป้องกันเครือข่ายที่กรองการเชื่อมต่อ)/Proxy (ตัวกลางเชื่อมต่อ) บล็อค domain (โดเมน — ที่อยู่เว็บ) ของ OpenAI
- ถ้าใช้ VPN บางตัวอาจมีปัญหา ลอง Disconnect (ตัดการเชื่อมต่อ) แล้วเชื่อมต่อใหม่
- ถ้า Corporate Network (เครือข่ายองค์กร) มีปัญหา ติดต่อ IT Admin (ผู้ดูแลระบบไอที) เพื่อ Whitelist (อนุญาตพิเศษ — เพิ่ม domain ในรายการที่ไม่บล็อก) domains ของ OpenAI

---

## Safety — ความปลอดภัยและ Content Policy

### ChatGPT ตอบแค่ไหน
ChatGPT มีขีดจำกัดเรื่อง:
- เนื้อหา **เป็นอันตราย** เช่น วิธีทำอาวุธ, เนื้อหา CSAM (ภาพล่วงละเมิดทางเพศเด็ก — ผิดกฎหมายอย่างเด็ดขาด)
- เนื้อหา **ผิดกฎหมาย**
- เนื้อหาที่ **ล่วงละเมิด** หรือ **คุกคาม**
- **การแอบอ้างตัวตน**

### ChatGPT บอกความจริงไหม
อ้างอิง: [Does ChatGPT tell the truth?](https://help.openai.com/en/articles/8313428-does-chatgpt-tell-the-truth)

ChatGPT พยายามให้ข้อมูลที่ถูกต้อง แต่:
- อาจ **Hallucinate** (ฮัลลูซิเนต — สร้างข้อมูลที่ฟังดูน่าเชื่อแต่ไม่มีจริง เหมือนฝันกลางวัน — เกิดจากวิธีที่ AI สร้างข้อความ) ได้
- ข้อมูลความรู้มีวันหมดอายุ หรือ Knowledge Cutoff (วันที่ตัดความรู้ — AI ไม่รู้เหตุการณ์ที่เกิดขึ้นหลังจากวันนี้)
- ควรตรวจสอบข้อมูลสำคัญจากแหล่งอื่นเสมอ
- ใช้ Search Mode (โหมดค้นเว็บ) เพื่อให้ได้ข้อมูล Real-time (ปัจจุบัน) ที่แม่นยำขึ้น

### Ads ใน ChatGPT
อ้างอิง: [Ads in ChatGPT](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)

- ChatGPT บางแพลตฟอร์มอาจมีโฆษณา (Ads — Advertisement)
- คุณมีสิทธิ์ควบคุมประสบการณ์โฆษณาได้ใน Settings → Data Controls

---

## Free Trial Invites
อ้างอิง: [Free Trial Invites FAQ](https://help.openai.com/en/articles/8053540-free-trial-invites-faq)

### คืออะไร
OpenAI มีโปรแกรมให้ผู้ใช้ Plus บางรายสร้างลิงก์เพื่อชวนเพื่อนทดลองใช้ ChatGPT Plus ฟรี

### วิธีดูว่ามีลิงก์ให้ชวนหรือไม่
- ไปที่ Settings → ดูว่ามีตัวเลือก "Invite Friends" (ชวนเพื่อน) หรือไม่
- ถ้ามีสิทธิ์จะสามารถสร้างลิงก์ Invite (เชิญ) ได้
