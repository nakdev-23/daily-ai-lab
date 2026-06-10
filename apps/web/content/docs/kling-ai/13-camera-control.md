---
title: "Camera Control & Cinematography — ควบคุมกล้องอย่างมืออาชีพ"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "เรียนรู้การควบคุมการเคลื่อนไหวกล้องใน Kling AI ตั้งแต่ท่ากล้องมาตรฐาน ไปจนถึงการกำหนดพิกัด 6DoF แบบ Advanced เหมือนเป็นผู้กำกับภาพยนตร์"
readTime: "7 นาที"
readers: "0"
locked: false
order: 13
---
# 13 · Camera Control & Cinematography — ควบคุมกล้องอย่างมืออาชีพ

> อ้างอิง Official Docs:
> - [Motion Control](https://kling.ai/document-api/apiReference%2Fmodel%2FmotionControl)
> - [Video Models](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoModels)

---

## 1. ภาพรวม Camera Control

Kling AI มีระบบควบคุมกล้องสามระดับ ให้เลือกตามความต้องการ:

| ระดับ | ชื่อ | รายละเอียด | เหมาะกับ |
|-------|------|-----------|----------|
| 1 | **Simple Camera Control** (ควบคุมกล้องแบบง่าย) | เลือกจากท่ากล้องมาตรฐาน | ผู้เริ่มต้น |
| 2 | **Advanced Camera Control (6DoF)** (ควบคุมกล้องขั้นสูง 6 องศาอิสระ) | กำหนดพิกัดกล้องทุกแกนเอง | ระดับกลาง-สูง |
| 3 | **Motion Brush** (แปรงควบคุมการเคลื่อนไหว) | วาดทิศทางบนรูปโดยตรง | ควบคุมรายละเอียด |

### โมเดลที่รองรับ Camera Control

| โมเดล | Simple | Advanced (6DoF) | Motion Brush |
|-------|--------|-----------------|--------------|
| kling-v1 | ✅ | ❌ | ❌ |
| kling-v1-5 | ✅ | ❌ | ✅ |
| kling-v2-1 | ✅ | ✅ | ❌ |
| kling-v2-6 | ✅ | ✅ | ❌ |
| kling-v3 | ✅ | ✅ | ❌ |

---

## 2. Simple Camera Control — ท่ากล้องมาตรฐาน

### ท่ากล้องที่รองรับ

| ท่ากล้อง | ค่าพารามิเตอร์ | คำอธิบาย | ใช้ทำอะไร |
|---------|--------------|---------|---------|
| **Move Left** | `move_left` | กล้องเลื่อนซ้าย | ติดตามวัตถุที่เคลื่อนไปทางขวา |
| **Move Right** | `move_right` | กล้องเลื่อนขวา | ติดตามวัตถุที่เคลื่อนไปทางซ้าย |
| **Move Up** | `move_up` | กล้องเลื่อนขึ้น | เปิดเผยฉากด้านบน |
| **Move Down** | `move_down` | กล้องเลื่อนลง | เปิดเผยฉากด้านล่าง |
| **Push In (Zoom In)** | `push_in` | กล้องเข้าหาวัตถุ | เน้นจุดสนใจ, Dramatic effect (ผลสะดุดตา) |
| **Pull Out (Zoom Out)** | `pull_out` | กล้องถอยออก | เปิดเผยฉากกว้าง |
| **Pan Left** | `pan_left` | กล้องหมุนซ้าย | สำรวจฉากแนวนอน |
| **Pan Right** | `pan_right` | กล้องหมุนขวา | สำรวจฉากแนวนอน |
| **Tilt Up** | `tilt_up` | กล้องเงยขึ้น | แสดงความยิ่งใหญ่ |
| **Tilt Down** | `tilt_down` | กล้องก้มลง | มองจากมุมสูงลงมา |
| **Roll Clockwise** | `roll_clockwise` | กล้องหมุนตามเข็ม | ฉากไม่ปกติ, ตื่นเต้น |
| **Roll Counter-Clockwise** | `roll_counterclockwise` | กล้องหมุนทวนเข็ม | ฉากไม่ปกติ, ตื่นเต้น |

### API Example — Simple Camera Control

```python
import requests, jwt, time

def get_token(ak, sk):
    now = int(time.time())
    return jwt.encode({"iss": ak, "exp": now+1800, "nbf": now-5}, sk, algorithm="HS256")

BASE = "https://api-singapore.klingai.com"
token = get_token("YOUR_AK", "YOUR_SK")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# ตัวอย่าง: กล้องซูมเข้าหาหอไอเฟล
resp = requests.post(f"{BASE}/v1/videos/image2video",
    headers=headers,
    json={
        "model": "kling-v2-6",
        "image": "https://example.com/eiffel_tower.jpg",
        "prompt": "กล้องค่อยๆ ซูมเข้าหาหอไอเฟล ยามพระอาทิตย์ตกสีทอง",
        "mode": "pro",
        "duration": "5",
        "camera_control": {
            "type": "simple",
            "config": {
                "horizontal": 0,      # -10 ถึง 10 (ลบ = ซ้าย, บวก = ขวา)
                "vertical": 0,        # -10 ถึง 10
                "zoom": 8,            # -10 ถึง 10 (ลบ = ออก, บวก = เข้า)
                "tilt": 0,            # -10 ถึง 10
                "roll": 0,            # -10 ถึง 10
                "pan": 0              # -10 ถึง 10
            }
        }
    }
)
task_id = resp.json()["data"]["task_id"]
print(f"Task: {task_id}")
```

---

## 3. Advanced Camera Control — 6DoF

**6DoF (Six Degrees of Freedom — หกองศาอิสระ)** คือการกำหนดตำแหน่งและทิศทางของกล้องอย่างละเอียดในทุกแกน ให้ผลลัพธ์ที่แม่นยำกว่า Simple มาก

### 6 แกนของ 6DoF

**3 แกนการเคลื่อนที่ (Translation — การเลื่อนตำแหน่ง):**
| แกน | ชื่อพารามิเตอร์ | ทิศทาง |
|-----|----------------|--------|
| X | `horizontal` | ซ้าย (-) / ขวา (+) |
| Y | `vertical` | ลง (-) / ขึ้น (+) |
| Z | `zoom` | ออก (-) / เข้า (+) |

**3 แกนการหมุน (Rotation — การหมุนทิศทาง):**
| แกน | ชื่อพารามิเตอร์ | ทิศทาง |
|-----|----------------|--------|
| X | `tilt` | ก้ม (-) / เงย (+) |
| Y | `pan` | ซ้าย (-) / ขวา (+) |
| Z | `roll` | ทวนเข็ม (-) / ตามเข็ม (+) |

### ค่าพารามิเตอร์

- ช่วงค่าทั้งหมด: **-10 ถึง 10**
- ค่า **0** = ไม่เคลื่อนไหวในแกนนั้น
- ยิ่งค่ามาก ยิ่งเคลื่อนไหวเร็วและมาก

### ตัวอย่าง Shot (มุมกล้อง) ต่างๆ ด้วย 6DoF

```python
# ====================================
# 1. DOLLY IN — กล้องเดินเข้าหาวัตถุ
# (Zoom ลึก + เงยขึ้นเล็กน้อย)
# ====================================
camera_dolly_in = {
    "type": "advanced",
    "config": {
        "horizontal": 0,
        "vertical": 0,
        "zoom": 8,      # เข้า
        "tilt": 2,      # เงยขึ้นนิดหน่อย
        "roll": 0,
        "pan": 0
    }
}

# ====================================
# 2. CRANE SHOT — กล้องลอยขึ้น
# (เลื่อนขึ้น + ก้มลง)
# ====================================
camera_crane = {
    "type": "advanced",
    "config": {
        "horizontal": 0,
        "vertical": 8,   # ขึ้น
        "zoom": 0,
        "tilt": -3,      # ก้มลงเล็กน้อย
        "roll": 0,
        "pan": 0
    }
}

# ====================================
# 3. ARC SHOT — กล้องวนรอบวัตถุ
# (เลื่อนขวา + หมุนซ้าย)
# ====================================
camera_arc = {
    "type": "advanced",
    "config": {
        "horizontal": 5,  # เลื่อนขวา
        "vertical": 0,
        "zoom": 0,
        "tilt": 0,
        "roll": 0,
        "pan": -5         # หันซ้ายรักษาวัตถุไว้กลางเฟรม
    }
}

# ====================================
# 4. DUTCH ANGLE — มุมเอียงสร้างความตึงเครียด
# ====================================
camera_dutch = {
    "type": "advanced",
    "config": {
        "horizontal": 0,
        "vertical": 0,
        "zoom": 2,        # ซูมเข้าเล็กน้อย
        "tilt": 0,
        "roll": 5,        # หมุนตามเข็ม
        "pan": 0
    }
}

# ====================================
# 5. ESTABLISHING SHOT — เปิดเผยฉากกว้าง
# ====================================
camera_establishing = {
    "type": "advanced",
    "config": {
        "horizontal": 3,   # เลื่อนขวา
        "vertical": 2,     # ขึ้นเล็กน้อย
        "zoom": -5,        # ถอยออก
        "tilt": -2,        # ก้มลงดูฉาก
        "roll": 0,
        "pan": -2          # หันซ้าย
    }
}
```

---

## 4. Motion Brush — วาดทิศทางการเคลื่อนไหว

Motion Brush (แปรงควบคุมการเคลื่อนไหว) รองรับเฉพาะ `kling-v1-5` และใช้ได้กับ Image-to-Video เท่านั้น

### หลักการทำงาน

1. กำหนด **หลายพื้นที่ (Zones — โซน)** บนรูปภาพ
2. แต่ละพื้นที่กำหนด **ทิศทางการเคลื่อนไหว** ของ Pixel (พิกเซล — จุดภาพ) ในบริเวณนั้น
3. AI จะสร้างการเคลื่อนไหวตามที่วาดไว้

### โครงสร้างพารามิเตอร์

```json
{
  "model": "kling-v1-5",
  "image": "https://example.com/scene.jpg",
  "prompt": "คำอธิบายการเคลื่อนไหว",
  "motion_brush": {
    "static_mask": "base64_of_mask_image",
    "dynamic_masks": [
      {
        "mask": "base64_of_mask_1",
        "trajectories": [
          {"x": 100, "y": 200},
          {"x": 150, "y": 180},
          {"x": 200, "y": 160}
        ]
      },
      {
        "mask": "base64_of_mask_2",
        "trajectories": [
          {"x": 300, "y": 100},
          {"x": 320, "y": 90},
          {"x": 340, "y": 80}
        ]
      }
    ]
  }
}
```

| พารามิเตอร์ | ประเภท | คำอธิบาย |
|------------|--------|---------|
| `static_mask` | Base64 (รูปแบบเข้ารหัสข้อมูลภาพ) | Mask (หน้ากาก — พื้นที่ที่กำหนด) สีขาว = พื้นที่ที่ **ไม่ต้องการให้เคลื่อนไหว** |
| `dynamic_masks` | Array (รายการ) | รายการ Mask + Trajectory (เส้นทางการเคลื่อนไหว) สำหรับแต่ละพื้นที่ที่ต้องการเคลื่อนไหว |
| `mask` | Base64 | Mask สีขาวกำหนดพื้นที่ที่ต้องการควบคุม |
| `trajectories` | Array | จุดพิกัด (x, y) ของเส้นทางการเคลื่อนไหว (อย่างน้อย 2 จุด) |

---

## 5. เทคนิค Cinematography (ศิลปะการถ่ายภาพยนตร์) กับ Kling AI

### 5.1 Classic Shots สำหรับโฆษณา

```python
# PRODUCT REVEAL — แสดงสินค้าอย่างน่าประทับใจ
product_reveal = {
    "model": "kling-v2-6",
    "image": "https://example.com/product.jpg",
    "prompt": "สินค้าหมุนช้าๆ บนโต๊ะ แสง Studio สีขาว หมุนรอบ 360 องศา",
    "mode": "pro",
    "duration": "5",
    "camera_control": {
        "type": "advanced",
        "config": {
            "horizontal": 0, "vertical": 0, "zoom": 3,
            "tilt": 0, "roll": 0, "pan": 5
        }
    }
}
```

### 5.2 Cinematic Openings (การเปิดฉากแบบภาพยนตร์) สำหรับภาพยนตร์

```python
# AERIAL TO GROUND — กล้องลงจากฟ้า
aerial_to_ground = {
    "prompt": "กล้องลงมาจากท้องฟ้าเข้าหาป่าทึบ ผ่านเมฆบางๆ จนเห็นต้นไม้ชัดเจน",
    "camera_control": {
        "type": "advanced",
        "config": {
            "horizontal": 0,
            "vertical": -8,   # ลงมา
            "zoom": 6,        # เข้าหา
            "tilt": 3,        # เงยขึ้นเล็กน้อยตอนลง
            "roll": 0,
            "pan": 0
        }
    }
}
```

### 5.3 คำแนะนำตาม Genre (ประเภท)

| ประเภท | ท่ากล้องที่เหมาะ | ค่า zoom แนะนำ |
|--------|----------------|----------------|
| **โฆษณาสินค้า** | Push In, Arc (วนรอบ), Zoom In | +5 ถึง +8 |
| **ภาพยนตร์ดราม่า** | Slow Push In, Crane Up (กล้องลอยขึ้น) | +2 ถึง +4 |
| **Action/Thriller** | Dutch Angle (มุมเอียงตื่นเต้น), Quick Pan | Roll ±5 |
| **Documentary** (สารคดี) | Pan, Tilt, Steady Push | ±3 |
| **ดนตรี/MV** | Dynamic Arc, Roll | หลากหลาย |
| **อสังหาริมทรัพย์** | Crane, Dolly (กล้องเดินหน้าหลัง), Pan | -3 ถึง +5 |
| **อาหาร/Lifestyle** | Push In, Tilt Down | +4 ถึง +7 |

---

## 6. Prompt Engineering สำหรับ Camera Movement

การระบุการเคลื่อนไหวกล้องใน Prompt ช่วยเสริมให้ผลดีขึ้น:

### คำศัพท์ที่ใช้ใน Prompt

```
# การเคลื่อนที่
- "camera slowly pushes in" / "กล้องค่อยๆ ซูมเข้า"
- "camera pulls back to reveal" / "กล้องถอยออกเผยให้เห็น"
- "camera pans from left to right" / "กล้องแพนจากซ้ายไปขวา"
- "bird's eye view descending" / "มุมมองจากฟ้าลงมา"
- "handheld camera movement" / "กล้องสั่นเล็กน้อยแบบมือถือ"
- "smooth tracking shot" / "กล้อง Tracking (ติดตามวัตถุ) เรียบ"
- "360-degree orbit around subject" / "กล้องวนรอบวัตถุ 360 องศา"
```

### ตัวอย่าง Prompt ครบชุด

```python
# Cinematic Drone Shot (การถ่ายภาพยนตร์ด้วยโดรน)
resp = requests.post(f"{BASE}/v1/videos/text2video",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "Cinematic aerial drone shot, camera slowly descends from misty mountain top "
            "revealing a small village below, golden hour lighting, epic wide angle, "
            "smooth camera movement, 4K ultra quality, cinematic color grading"
        ),
        "negative_prompt": "shaky camera, blur, low quality, distortion",
        "mode": "pro",
        "duration": "5",
        "aspect_ratio": "16:9",
        "cfg_scale": 0.8,
        "camera_control": {
            "type": "advanced",
            "config": {
                "horizontal": 0, "vertical": -7, "zoom": 5,
                "tilt": -2, "roll": 0, "pan": 0
            }
        }
    }
)
```

---

## 7. สรุปตารางอ้างอิงด่วน

### ค่า Camera Control สำหรับ Shot Types

| Shot Type | horizontal | vertical | zoom | tilt | pan | roll |
|-----------|-----------|---------|------|------|-----|------|
| Static (นิ่ง) | 0 | 0 | 0 | 0 | 0 | 0 |
| Zoom In (ซูมเข้า) | 0 | 0 | +7 | 0 | 0 | 0 |
| Zoom Out (ซูมออก) | 0 | 0 | -7 | 0 | 0 | 0 |
| Pan Right (แพนขวา) | 0 | 0 | 0 | 0 | +6 | 0 |
| Pan Left (แพนซ้าย) | 0 | 0 | 0 | 0 | -6 | 0 |
| Tilt Up (เงยขึ้น) | 0 | 0 | 0 | +6 | 0 | 0 |
| Crane Up (ลอยขึ้น) | 0 | +7 | 0 | -3 | 0 | 0 |
| Dolly In (เดินเข้า) | 0 | 0 | +5 | +2 | 0 | 0 |
| Arc Right (วนขวา) | +5 | 0 | 0 | 0 | -5 | 0 |
| Dutch Angle (มุมเอียง) | 0 | 0 | +2 | 0 | 0 | +5 |

> **เคล็ดลับ:** ผสม 2–3 แกนพร้อมกันเพื่อให้ได้การเคลื่อนไหวที่เป็นธรรมชาติและน่าสนใจกว่าการใช้แกนเดียว
