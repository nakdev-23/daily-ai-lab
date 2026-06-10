---
title: "Video Generation — การสร้างวิดีโอ"
tool: "Kling AI"
icon: "icon-docs"
level: "beginner"
summary: "ส่ง Prompt (คำอธิบาย) เป็นข้อความ แล้ว AI จะสร้างวิดีโอให้ตาม Prompt นั้น"
readTime: "6 นาที"
readers: "0"
locked: false
order: 3
---
# 03 · Video Generation — การสร้างวิดีโอ

> อ้างอิง Official Docs:
> - [Video Models](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoModels)
> - [Video Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniVideo)
> - [Text to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToVideo)
> - [Image to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FimageToVideo)
> - [Reference to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToVideo)
> - [Motion Control](https://kling.ai/document-api/apiReference%2Fmodel%2FmotionControl)
> - [Multi-elements to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiElements)
> - [Extend Video](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoExtension)

---

## 1. Video Models — โมเดลวิดีโอทั้งหมด

> อ้างอิง: [Video Models](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoModels)

### โมเดลหลัก (แนะนำ)

#### kling-v3 / kling-v3-omni (รุ่นล่าสุด)

| รายการ | รายละเอียด |
|--------|-----------|
| Mode | std / pro |
| ความยาว | 3–15 วินาที |
| Text to Video | ✅ Single-shot และ Multi-shot |
| Image to Video | ✅ Single-shot, Multi-shot, Start+End Frame |
| Element Control | ✅ Video Character + Multi-image Elements |
| Motion Control | ✅ |
| Voice Control | ✅ |

> **kling-v3-omni** รองรับฟีเจอร์เพิ่มเติม เช่น Multi-shot และ Video Reference

---

#### kling-video-o1 (Unified Multimodal)

| รายการ | รายละเอียด |
|--------|-----------|
| Mode | std / pro |
| ความยาว | 3–10 วินาที (เฉพาะ 5s หรือ 10s) |
| Text to Video | ✅ |
| Image to Video | ✅ (เฉพาะ Start Frame) |
| Voice Control | ✅ |

---

#### kling-v2-6 (รุ่นก่อนหน้า)

| รายการ | รายละเอียด |
|--------|-----------|
| Mode | std / pro |
| ความยาว | 5s, 10s, และความยาวอื่นๆ |
| Native Audio | ✅ (เฉพาะเวอร์ชัน no-audio) |
| Motion Control | ✅ |
| Voice Control | ✅ |

---

#### โมเดลรุ่นเก่า (Legacy)

| Model | Modes | ความสามารถหลัก |
|-------|-------|--------------|
| `kling-v2-5-turbo` | std/pro 5s, 10s | ความเร็วสูงสุด |
| `kling-v2-1` | std/pro 5s, 10s | ครบทุกฟีเจอร์ |
| `kling-v2-master` | 10s only | คุณภาพสูงสุด |
| `kling-v1-6` | std/pro 5s, 10s | รองรับ Multi-image to Video |
| `kling-v1-5` | std/pro 5s, 10s | Motion Brush + Camera Control |
| `kling-v1` | std/pro 5s, 10s | Camera Control |

---

### ความละเอียดและ Frame Rate

| Model | Mode | Resolution | FPS |
|-------|------|-----------|-----|
| kling-v1 (std) | STD | 720p | 30fps |
| kling-v1 (pro) | PRO | 720p | 30fps |
| kling-v1-5 (pro) | PRO | 1080p | 30fps |
| kling-v2-1 (std) | STD | 720p | 24fps |
| kling-v2-1 (pro) | PRO | 1080p | 24fps |
| kling-v2-5 | PRO | 1080p | 24fps |

---

## 2. Text to Video — สร้างวิดีโอจากข้อความ

> อ้างอิง: [Text to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToVideo)

### หัวข้อนี้คืออะไร

ส่ง Prompt (คำอธิบาย) เป็นข้อความ แล้ว AI จะสร้างวิดีโอให้ตาม Prompt นั้น

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/text2video
```

### Request Header

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body — พารามิเตอร์

| พารามิเตอร์ | ประเภท | จำเป็น | ค่าเริ่มต้น | คำอธิบาย |
|------------|--------|--------|-----------|---------|
| `model` | string | ✅ | - | ชื่อโมเดล เช่น `kling-v2-6`, `kling-v3` |
| `prompt` | string | ✅ | - | คำอธิบายวิดีโอ (Prompt) |
| `negative_prompt` | string | ❌ | - | สิ่งที่ **ไม่ต้องการ** ให้มีในวิดีโอ |
| `cfg_scale` | float | ❌ | 0.5 | ระดับที่ AI ยึดตาม Prompt (0–1, มากขึ้น = ตาม Prompt มากขึ้น) |
| `mode` | string | ❌ | `std` | คุณภาพ: `std` (มาตรฐาน) หรือ `pro` (คุณภาพสูง) |
| `duration` | string | ❌ | `5` | ความยาววิดีโอ: `"5"` หรือ `"10"` (วินาที) |
| `aspect_ratio` | string | ❌ | `16:9` | อัตราส่วนภาพ: `16:9`, `9:16`, `1:1` |
| `callback_url` | string | ❌ | - | URL รับผลลัพธ์อัตโนมัติ |
| `external_task_id` | string | ❌ | - | Task ID ที่กำหนดเอง |

### ตัวอย่างการใช้งาน

```python
import requests, time, jwt

def get_token(ak, sk):
    payload = {"iss": ak, "exp": int(time.time()) + 1800, "nbf": int(time.time()) - 5}
    return jwt.encode(payload, sk, algorithm="HS256", headers={"alg": "HS256", "typ": "JWT"})

token = get_token("YOUR_AK", "YOUR_SK")
BASE = "https://api-singapore.klingai.com"

# สร้าง Task
resp = requests.post(f"{BASE}/v1/videos/text2video",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "model": "kling-v2-6",
        "prompt": "แมวขาวกำลังเล่นเปียโนในบาร์แจ๊ซบรรยากาศอบอุ่น แสงสีทอง",
        "negative_prompt": "ภาพเบลอ คุณภาพต่ำ",
        "cfg_scale": 0.7,
        "mode": "pro",
        "duration": "5",
        "aspect_ratio": "16:9"
    }
)
task_id = resp.json()["data"]["task_id"]
print(f"Task created: {task_id}")

# Query จนเสร็จ
while True:
    status = requests.get(f"{BASE}/v1/videos/text2video/{task_id}",
        headers={"Authorization": f"Bearer {token}"}).json()
    s = status["data"]["task_status"]
    print(f"Status: {s}")
    if s in ["succeed", "failed"]:
        break
    time.sleep(10)

if s == "succeed":
    url = status["data"]["task_result"]["videos"][0]["url"]
    print(f"Video URL: {url}")
```

### Multi-Shot Text to Video

สำหรับโมเดล `kling-v3` / `kling-v3-omni` รองรับการสร้างวิดีโอแบบหลายช็อต (Multi-shot) โดยใส่คำอธิบายแต่ละฉากในรูปแบบที่กำหนด

---

## 3. Image to Video — สร้างวิดีโอจากรูปภาพ

> อ้างอิง: [Image to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FimageToVideo)

### หัวข้อนี้คืออะไร

ส่งรูปภาพเป็น "จุดเริ่มต้น" หรือ "จุดเริ่มและจุดจบ" แล้ว AI จะสร้างการเคลื่อนไหวที่เป็นธรรมชาติให้

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/image2video
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | จำเป็น | คำอธิบาย |
|------------|--------|--------|---------|
| `model` | string | ✅ | ชื่อโมเดล |
| `image` | string | ✅ | URL หรือ Base64 ของรูป Start Frame |
| `image_tail` | string | ❌ | URL หรือ Base64 ของรูป End Frame |
| `prompt` | string | ❌ | คำอธิบายการเคลื่อนไหว |
| `negative_prompt` | string | ❌ | สิ่งที่ไม่ต้องการ |
| `cfg_scale` | float | ❌ | ระดับยึดตาม Prompt (0–1) |
| `mode` | string | ❌ | `std` หรือ `pro` |
| `duration` | string | ❌ | `"5"` หรือ `"10"` วินาที |

### รูปแบบที่รองรับ

- **Start Frame only** — กำหนดเฉพาะภาพเริ่มต้น AI สร้างการเคลื่อนไหวต่อเอง
- **Start + End Frame** — กำหนดทั้งจุดเริ่มและจุดจบ AI สร้าง transition ตรงกลาง (รองรับใน `kling-v1-5`, `kling-v2-1`, `kling-v3`)

### ตัวอย่าง

```python
resp = requests.post(f"{BASE}/v1/videos/image2video",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "model": "kling-v2-6",
        "image": "https://example.com/cat.jpg",  # Start Frame
        "prompt": "แมวค่อยๆ หันหน้ามามองกล้อง ขยิบตาอย่างน่ารัก",
        "mode": "pro",
        "duration": "5"
    }
)
```

---

## 4. Reference to Video — สร้างวิดีโอจากรูปอ้างอิงหลายภาพ

> อ้างอิง: [Reference to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToVideo)

### หัวข้อนี้คืออะไร

ใช้รูปภาพหลายภาพเป็น "ตัวอ้างอิง" เพื่อให้ AI รักษาความสม่ำเสมอของตัวละคร สไตล์ หรือสิ่งของในวิดีโอ เหมาะสำหรับ:
- รักษาหน้าตาของตัวละครให้เหมือนกันตลอด
- ควบคุมสไตล์ภาพ
- นำวัตถุจากหลายภาพมาอยู่ในวิดีโอเดียวกัน

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/multi-image2video
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | คำอธิบาย |
|------------|--------|---------|
| `model` | string | ชื่อโมเดล (รองรับ: `kling-v1-6`, `kling-v3`, `kling-v3-omni`) |
| `image_list` | array | รายการรูปภาพอ้างอิง (URL หรือ Base64) |
| `prompt` | string | คำอธิบายการเคลื่อนไหว |
| `mode` | string | `std` หรือ `pro` |
| `duration` | string | ความยาววิดีโอ |

---

## 5. Motion Control — ควบคุมการเคลื่อนไหวกล้อง

> อ้างอิง: [Motion Control](https://kling.ai/document-api/apiReference%2Fmodel%2FmotionControl)

### หัวข้อนี้คืออะไร

ควบคุมการเคลื่อนที่ของกล้องในวิดีโอได้อย่างแม่นยำ เช่น ซูมเข้า ซูมออก หมุน เลื่อน — เหมือนเป็นผู้กำกับกล้องจริงๆ

### รองรับโมเดล

- `kling-v2-6` (Motion Control)
- `kling-v3` (Motion Control)
- `kling-v1` / `kling-v1-5` (Camera Control)

### ประเภทการควบคุมกล้อง

| ประเภท | รายละเอียด |
|--------|-----------|
| **Simple** | เลือกจากท่ากล้องมาตรฐาน เช่น Pan Left/Right, Tilt Up/Down, Zoom In/Out, Roll |
| **Advanced** | กำหนดพิกัดกล้องแบบ 6DoF (6 Degrees of Freedom) ได้ละเอียดมาก |
| **Motion Brush** | วาดทิศทางการเคลื่อนไหวบนรูปโดยตรง (รองรับใน `kling-v1-5`) |

---

## 6. Multi-elements to Video — วิดีโอจากหลาย Element

> อ้างอิง: [Multi-elements to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiElements)

### หัวข้อนี้คืออะไร

นำ "Element" (ตัวละคร สิ่งของ ฉากหลัง ที่สร้างไว้แล้ว) มาผสมกันเป็นวิดีโอเดียว โดยรักษาความสม่ำเสมอของแต่ละ Element

### ใช้ทำอะไร

- สร้างวิดีโอที่มีตัวละครจาก Element ที่กำหนดไว้ล่วงหน้า
- ควบคุมได้ว่าใครหรืออะไรจะอยู่ในวิดีโอ
- เหมาะสำหรับงานโฆษณา สื่อการเรียนรู้ หรือ Storytelling

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/multi-elements
```

---

## 7. Extend Video — ต่อวิดีโอให้ยาวขึ้น

> อ้างอิง: [Extend Video](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoExtension)

### หัวข้อนี้คืออะไร

ต่อความยาววิดีโอที่มีอยู่แล้วให้ยาวขึ้น โดย AI จะสร้างส่วนต่อเนื่องที่ดูสมเหตุสมผลและกลมกลืนกับต้นฉบับ

### ใช้ทำอะไร

- ต้องการให้วิดีโอ 5 วินาทียาวขึ้นเป็น 10+ วินาที
- สร้างวิดีโอยาวจากช็อตสั้นๆ หลายช็อต

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/extend
```

### พารามิเตอร์หลัก

| พารามิเตอร์ | ประเภท | คำอธิบาย |
|------------|--------|---------|
| `video_id` | string | ID ของวิดีโอต้นฉบับที่ต้องการต่อ |
| `prompt` | string | คำอธิบายส่วนที่ต้องการต่อ (ไม่บังคับ) |
| `cfg_scale` | float | ระดับยึดตาม Prompt |

### ข้อควรระวัง

- `kling-v1` และ `kling-v2-master` **ไม่รองรับ** `negative_prompt` และ `cfg_scale` ใน Extend Video
- ต้องใช้ `video_id` ของวิดีโอที่สร้างจาก Kling API เท่านั้น
