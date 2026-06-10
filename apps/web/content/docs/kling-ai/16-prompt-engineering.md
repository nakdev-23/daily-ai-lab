---
title: "Prompt Engineering — เขียน Prompt ให้ได้ผลลัพธ์ที่ดี"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "เทคนิคขั้นสูงในการเขียน Prompt สำหรับ Kling AI ทั้ง Text-to-Video และ Image Generation รวม Prompt Frameworks, คำศัพท์มืออาชีพ และตัวอย่างจริง"
readTime: "9 นาที"
readers: "0"
locked: false
order: 16
---
# 16 · Prompt Engineering — เขียน Prompt ให้ได้ผลลัพธ์ที่ดี

---

## 1. ทำไม Prompt ถึงสำคัญ

Prompt (คำสั่งหรือคำอธิบายที่ส่งให้ AI) คือภาษาที่คุณคุยกับ AI — ยิ่ง Prompt ชัดเจนและละเอียด AI ยิ่งเข้าใจสิ่งที่ต้องการและสร้างผลลัพธ์ได้ตรงกว่า

**ตัวอย่างความแตกต่าง:**

| Prompt ไม่ดี | Prompt ดี |
|-------------|-----------|
| `แมว` | `แมวเปอร์เซียขาวนอนหลับบนผ้าไหมสีแดง แสงบ่ายส่องผ่านหน้าต่าง ถ่ายด้วยเลนส์ macro (มาโคร — ถ่ายระยะใกล้มาก) ระยะใกล้` |
| `เมืองในอนาคต` | `Cyberpunk Bangkok 2150, neon signs in Thai script, flying vehicles between skyscrapers, rain-slicked streets, night scene, cinematic 4K, atmospheric fog` |

---

## 2. CIVAS Framework — โครงสร้าง Prompt สำหรับวิดีโอ

**C**omposition (องค์ประกอบภาพ) · **I**mage Reference (รูปอ้างอิง) · **V**isual Style (สไตล์ภาพ) · **A**ction (การกระทำ) · **S**cene (ฉาก)

```
[ประเภทการถ่าย] [หัวเรื่องหลัก] [การกระทำ/สถานะ],
[ฉากหลัง/สถานที่],
[แสงและบรรยากาศ],
[สไตล์ภาพ],
[การเคลื่อนไหวกล้อง],
[คุณภาพ]
```

### ตัวอย่าง CIVAS

```
[Close-up shot (ถ่ายระยะใกล้)] [นักดนตรีหญิงวัยกลางคน] [กำลังเล่นไวโอลินอย่างรู้สึก],
[เวทีคอนเสิร์ตขนาดใหญ่ ผู้ชมเต็มห้อง],
[แสงสปอตไลท์สีทอง ควันเบาๆ บนเวที],
[ถ่ายแบบ Cinematic 35mm film (ฟิล์ม 35 มม. ให้ความรู้สึกภาพยนตร์)],
[กล้องค่อยๆ ซูมออกเผยให้เห็นผู้ชม],
[8K ultra quality, award-winning cinematography]
```

---

## 3. Prompt สำหรับ Text-to-Video

### 3.1 โครงสร้างขั้นพื้นฐาน

```
[ใคร/อะไร] + [กำลังทำอะไร] + [ที่ไหน] + [เมื่อไหร่/บรรยากาศ] + [สไตล์]
```

### 3.2 ตัวอย่าง Prompt วิดีโอตามประเภท

#### Nature & Landscape (ธรรมชาติและภูมิทัศน์)

```
Aerial drone footage of rice terraces in northern Thailand,
golden hour light casting long shadows,
farmers in colorful traditional clothing working in the fields,
misty mountains in background,
smooth cinematic movement, 4K, ultra wide angle
```

#### Character Animation (แอนิเมชันตัวละคร)

```
Young Thai woman in traditional Lanna costume,
gracefully performing classical Thai dance,
ornate gold jewelry catching light,
temple courtyard background with tropical flowers,
slow motion 120fps (เฟรมต่อวินาที — ยิ่งมากยิ่งเนียน), cinematic lighting, photorealistic
```

#### Product Commercial (โฆษณาสินค้า)

```
Luxury sports car parked at edge of cliff overlooking ocean at sunset,
camera orbits (วนรอบ) slowly around the car revealing its sleek design,
reflections on polished surface, dramatic sky,
commercial photography quality, cinematic color grade
```

#### Abstract & Artistic (นามธรรมและศิลปะ)

```
Abstract fluid simulation of liquid metal morphing into butterfly,
iridescent colors (สีรุ้งที่เปลี่ยนตามมุมมอง), metallic surfaces, macro photography,
hyper slow motion (สโลว์โมชันมาก), studio black background,
ultra detailed 8K, particle effects (เอฟเฟกต์อนุภาค)
```

### 3.3 คำศัพท์กล้องและการถ่ายทำ

| ประเภทช็อต | คำที่ใช้ |
|-----------|--------|
| ภาพรวม | `establishing shot` (ช็อตเปิดฉาก), `wide angle`, `aerial view`, `bird's eye` |
| ระยะกลาง | `medium shot`, `waist-up shot` |
| ระยะใกล้ | `close-up`, `extreme close-up`, `macro shot` |
| ตามตัว | `tracking shot` (ถ่ายตามวัตถุ), `follow cam`, `dolly shot` |
| วนรอบ | `orbit shot`, `360-degree shot`, `arc shot` |
| ลงจากฟ้า | `crane shot`, `descending drone`, `top-down to eye level` |

### 3.4 คำศัพท์แสง

| แสง | คำที่ใช้ |
|-----|--------|
| แสงทอง | `golden hour`, `magic hour`, `warm sunlight` |
| แสงฟ้า | `blue hour`, `twilight`, `cool ambient` |
| กลางคืน | `night scene`, `city lights`, `moonlight`, `neon glow` |
| Studio | `three-point lighting`, `key light`, `rim light` (แสงขอบ), `soft box` |
| ดราม่า | `chiaroscuro` (แสงเงาแบบคลาสสิก — สว่างมากตัดกับมืดมาก), `single source light`, `hard shadows` |
| สว่างและอากาศดี | `overcast sky` (ท้องฟ้าเมฆ), `diffused light`, `soft natural` |

### 3.5 คำศัพท์สไตล์

| สไตล์ | คำที่ใช้ |
|-------|--------|
| ภาพยนตร์ | `cinematic`, `anamorphic lens flare` (แสงหักเหจากเลนส์ภาพยนตร์), `35mm film` |
| Documentary (สารคดี) | `documentary style`, `handheld camera`, `raw footage` |
| โฆษณา | `commercial photography`, `advertising quality` |
| Music Video | `music video aesthetic`, `stylized`, `high contrast` |
| Animation (แอนิเมชัน) | `CGI animation`, `Pixar style`, `anime style` |

---

## 4. Prompt สำหรับ Image Generation

### 4.1 โครงสร้างมาตรฐาน

```
[Subject] + [Descriptors (คำอธิบายเพิ่มเติม)] + [Environment] + [Lighting] + [Art Style] + [Quality Tags (คำกำกับคุณภาพ)]
```

### 4.2 Quality Tags ที่ควรใส่เสมอ

```
# สำหรับงาน Commercial
"professional quality, award winning, magazine cover, ultra detailed, 8K"

# สำหรับงาน Artistic
"artstation trending, highly detailed, masterpiece, concept art"

# สำหรับภาพถ่าย
"DSLR photo, f/1.8, ISO 400, RAW, professional photographer"

# สำหรับ Illustration (งานวาดภาพ)
"digital illustration, clean lines, vibrant colors, smooth shading"
```

### 4.3 Negative Prompt ที่แนะนำ

```python
# Negative Prompt (สิ่งที่ไม่ต้องการให้มีในภาพ) สำหรับงานทั่วไป
general_negative = "low quality, blurry, out of focus, noisy, grain, distorted, deformed, ugly, bad anatomy, watermark, text, signature, extra limbs"

# สำหรับภาพถ่าย Realistic
photo_negative = "cartoon, anime, illustration, painting, drawing, sketch, CGI, digital art, plastic look, overexposed, underexposed"

# สำหรับงาน Art/Illustration
art_negative = "photo, realistic, 3D render, blurry, low quality, ugly, deformed"

# สำหรับ Portrait (ภาพบุคคล)
portrait_negative = "multiple people, crowd, extra face, bad face, asymmetric eyes, blurry face"
```

### 4.4 ตัวอย่าง Prompt รูปภาพตามอุตสาหกรรม

#### E-Commerce สินค้า

```python
ecommerce_prompts = {
    "เครื่องสำอาง": (
        "Luxury cosmetics product photography, rose gold lipstick tube "
        "standing on white marble, surrounded by rose petals, "
        "professional studio lighting, shallow depth of field (ระยะชัดตื้น — พื้นหลังเบลอ), "
        "clean white background, commercial quality, 8K"
    ),
    "เสื้อผ้า": (
        "Fashion editorial photography, elegant white silk dress, "
        "model on minimalist background, high fashion lighting, "
        "Vogue magazine quality, clean composition"
    ),
    "อาหาร": (
        "Thai green curry in rustic clay bowl, overhead flat lay (ถ่ายจากด้านบนลงมา), "
        "fresh herbs garnish, ingredients scattered artfully, "
        "professional food photography, warm lighting, appetizing"
    ),
}
```

#### Real Estate & Interior (อสังหาริมทรัพย์และการออกแบบภายใน)

```python
interior_prompt = (
    "Luxury condo living room, floor-to-ceiling windows overlooking Bangkok skyline, "
    "modern minimalist furniture, neutral tones, natural daylight, "
    "interior design magazine quality, architectural photography, wide angle lens"
)
```

#### Portrait & People (ภาพบุคคล)

```python
portrait_prompt = (
    "Professional headshot of confident Thai businesswoman in her 30s, "
    "wearing navy blazer, warm genuine smile, "
    "neutral grey studio background, three-point lighting, "
    "high-end corporate photography, Canon 85mm f/1.4, shallow DOF"
)
```

---

## 5. เทคนิค Prompt ขั้นสูง

### 5.1 Prompt Weighting — เน้นความสำคัญ

บาง Model รองรับการเน้นคำโดยวงเล็บ หรือใช้คำซ้ำเพื่อเพิ่มน้ำหนัก (Weighting — การให้น้ำหนักความสำคัญ):

```
# เน้นแสงทอง
"golden hour lighting, warm golden light, soft golden glow, magical golden atmosphere"

# เน้นรายละเอียด
"ultra detailed, highly detailed, intricate details, fine details"
```

### 5.2 Chained Descriptions — ต่อคำอธิบายซ้อนกัน

Chained Descriptions (การอธิบายแบบลูกโซ่ — เพิ่มรายละเอียดซ้อนกันไปเรื่อยๆ):

```
"ancient temple in misty jungle → stone covered in moss and vines → 
carved reliefs telling ancient stories → single beam of sunlight piercing through canopy"
```

### 5.3 เลียนแบบสไตล์ศิลปิน (Artist Style Reference — อ้างอิงสไตล์ศิลปิน)

```python
style_references = {
    "ภาพยนตร์ Roger Deakins": "shot by Roger Deakins, intimate natural lighting, muted palette",
    "Wes Anderson style": "Wes Anderson aesthetic, symmetrical composition (องค์ประกอบสมมาตร), pastel colors, whimsical",
    "Studio Ghibli": "Studio Ghibli animation style, painterly backgrounds, soft colors, magical",
    "Annie Leibovitz Portrait": "Annie Leibovitz portrait style, dramatic lighting, powerful composition",
    "National Geographic": "National Geographic photography, documentary style, authentic emotion",
}
```

### 5.4 Negative Prompt Strategies (กลยุทธ์ Negative Prompt)

```python
# ใช้ Negative Prompt แก้ปัญหาที่พบบ่อย
fixes = {
    "แขน/มือผิดรูป": "extra fingers, missing fingers, deformed hands, bad hands, extra limbs",
    "ใบหน้าแปลก": "bad face, asymmetric face (ใบหน้าไม่สมมาตร), deformed face, ugly, distorted features",
    "ฉากหลังรกรุงรัง": "cluttered background, busy background, distracting elements",
    "ภาพเบลอ": "blurry, out of focus, motion blur, soft focus",
    "แสงไม่ดี": "overexposed (รับแสงมากเกินไป), underexposed (รับแสงน้อยเกินไป), harsh lighting, flat lighting",
    "คุณภาพต่ำ": "low resolution, pixelated (แตกเป็นพิกเซล), jpeg artifacts, low quality, amateur",
}
```

---

## 6. Prompt Templates สำเร็จรูป

### Template สำหรับโฆษณา Video

```python
AD_VIDEO_TEMPLATE = """
{shot_type} shot of {product_name} - {product_description}.
{environment}: {environment_detail}.
{lighting_type} lighting, {atmosphere}.
Camera {camera_movement}, revealing {reveal_element}.
{brand_aesthetic}, commercial quality, {resolution}.
No text, no people (unless specified), photorealistic.
"""

# ใช้งาน
prompt = AD_VIDEO_TEMPLATE.format(
    shot_type="Medium close-up",
    product_name="Thai herbal tea blend",
    product_description="golden liquid pouring into clear glass with ice",
    environment="outdoor bamboo garden",
    environment_detail="morning dew on leaves, soft natural light",
    lighting_type="Diffused soft",
    atmosphere="refreshing, peaceful",
    camera_movement="slowly zooms in",
    reveal_element="steam rising from hot tea version",
    brand_aesthetic="premium wellness brand aesthetic",
    resolution="4K ultra detailed"
)
```

### Template สำหรับ Portrait

```python
PORTRAIT_TEMPLATE = """
{shot_type} portrait of {subject_description},
{clothing}: {clothing_detail},
{expression} expression, {pose} pose,
{background}: {background_detail},
{lighting}: {lighting_detail},
{photography_style}, {camera_spec}, {quality_tags},
{negative_elements}
"""

prompt = PORTRAIT_TEMPLATE.format(
    shot_type="Professional headshot",
    subject_description="Thai woman in her late 20s",
    clothing="wearing elegant traditional Thai silk dress",
    clothing_detail="deep red with gold embroidery",
    expression="confident and warm",
    pose="slight 3/4 angle (มุม 3 ส่วน 4 — ผินหน้าเฉียงเล็กน้อย)",
    background="out-of-focus garden",
    background_detail="soft green bokeh",
    lighting="Golden hour backlight (แสงหลัง)",
    lighting_detail="soft hair light, reflector fill",
    photography_style="fashion editorial photography",
    camera_spec="shot on Canon R5 with 85mm f/1.4",
    quality_tags="magazine quality, ultra detailed, 8K",
    negative_elements=""
)
```

---

## 7. ข้อผิดพลาดที่พบบ่อยและวิธีแก้

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| ผลลัพธ์ random (สุ่ม) มาก | Prompt สั้นและคลุมเครือ | เพิ่มรายละเอียด ระบุสิ่งที่ต้องการชัดเจน |
| มีข้อความในภาพโดยไม่ต้องการ | ไม่ได้บอกว่าไม่ต้องการ | เพิ่ม `no text, no watermark` ใน Negative |
| AI เพิ่มคนที่ไม่ต้องการ | ไม่ได้ระบุ | เพิ่ม `no people, empty` ใน Negative หรือ Prompt |
| สีผิดจากที่ต้องการ | ไม่ระบุสีชัดเจน | ระบุ Pantone หรือ hex code (รหัสสี) เช่น `deep navy blue #001F5B` |
| Style ไม่ตรง | ไม่ระบุ Style Reference | เพิ่ม Artist/Style reference ที่ชัดเจน |
| วิดีโอขยับน้อยเกินไป | Prompt ไม่มีคำอธิบายการเคลื่อนไหว | เพิ่มคำอธิบายการเคลื่อนไหวชัดเจน |
| cfg_scale (ค่าควบคุมความใกล้เคียงกับ Prompt) ไม่ส่งผล | ค่าน้อยเกินไป | เพิ่ม `cfg_scale` เป็น 0.7–0.9 |

---

## 8. A/B Testing Prompts

A/B Testing (การทดสอบเปรียบเทียบ — ลองหลายแบบแล้วดูว่าแบบไหนดีกว่า):

```python
import requests, time

def test_prompts(base_config: dict, prompt_variants: list) -> list:
    """ทดสอบ Prompt หลายแบบพร้อมกัน"""
    tasks = []
    for i, prompt in enumerate(prompt_variants):
        config = {**base_config, "prompt": prompt, "external_task_id": f"test_{i}"}
        resp = requests.post(
            "https://api-singapore.klingai.com/v1/images/generations",
            headers=headers,
            json=config
        )
        task_id = resp.json()["data"]["task_id"]
        tasks.append({"variant": i, "prompt": prompt[:50], "task_id": task_id})
        print(f"Variant {i}: {task_id}")
    return tasks

# ทดสอบ Prompt หลายแบบ
base = {"model": "kling-v3", "aspect_ratio": "16:9", "n": 1}
variants = [
    "tropical beach at sunset",
    "tropical beach at golden hour, warm colors, peaceful atmosphere",
    "stunning tropical paradise beach, golden sunset sky, crystal clear turquoise water, professional travel photography, 8K",
]

results = test_prompts(base, variants)
# เปรียบเทียบผลลัพธ์แล้วเลือก Prompt ที่ดีที่สุด
```

---

## 9. สรุปหลักการ 10 ข้อ

1. **ระบุให้ชัดเจน** — ยิ่งละเอียดยิ่งดี แต่ไม่ต้องยาวเกินไป
2. **ลำดับสำคัญ** — สิ่งสำคัญที่สุดใส่ก่อน
3. **ใช้ Negative Prompt** — ระบุสิ่งที่ไม่ต้องการทุกครั้ง
4. **ระบุสไตล์** — Photography, Painting, Anime ฯลฯ
5. **ระบุแสง** — แสงเป็นปัจจัยสำคัญที่สุดในภาพ
6. **ระบุการเคลื่อนไหว** — สำหรับวิดีโอ ต้องบอกว่าอะไรเคลื่อนไหวอย่างไร
7. **ใช้ Quality Tags** — `8K`, `ultra detailed`, `professional`, `award winning`
8. **ทดสอบและปรับ (Iterate — วนซ้ำปรับปรุง)** — สร้างหลายแบบแล้วเลือกที่ดีที่สุด
9. **เรียนรู้จากผลลัพธ์** — ดูว่า Prompt ไหนให้ผลดีแล้ว Pattern คืออะไร
10. **ภาษาอังกฤษให้ผลดีกว่า** — สำหรับ Style และ Technical Terms (คำศัพท์เทคนิค) ให้ใช้ภาษาอังกฤษ
