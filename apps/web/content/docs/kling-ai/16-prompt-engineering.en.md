---
title: "Prompt Engineering — write Prompts that yield good results"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Advanced techniques for writing Prompts for Kling AI, both Text-to-Video and Image Generation, including Prompt Frameworks, professional vocabulary, and real examples"
readTime: "9 min"
readers: "0"
locked: false
order: 16
---
# 16 · Prompt Engineering — write Prompts that yield good results

---

## 1. Why the Prompt matters

A Prompt (the instruction or description sent to the AI) is the language you use to talk to the AI — the clearer and more detailed the Prompt, the better the AI understands what you want and produces a more on-target result.

**Example of the difference:**

| Bad Prompt | Good Prompt |
|-------------|-----------|
| `cat` | `A white Persian cat sleeping on red silk, afternoon light coming through the window, shot with a macro lens (macro — extreme close-up) up close` |
| `future city` | `Cyberpunk Bangkok 2150, neon signs in Thai script, flying vehicles between skyscrapers, rain-slicked streets, night scene, cinematic 4K, atmospheric fog` |

---

## 2. CIVAS Framework — a Prompt structure for video

**C**omposition · **I**mage Reference · **V**isual Style · **A**ction · **S**cene

```
[Shot type] [main subject] [action/state],
[background/location],
[lighting and atmosphere],
[visual style],
[camera movement],
[quality]
```

### CIVAS example

```
[Close-up shot] [a middle-aged female musician] [playing the violin with feeling],
[a large concert stage, the hall full of audience],
[golden spotlights, light smoke on the stage],
[shot Cinematic 35mm film (35mm film gives a cinematic feel)],
[the camera slowly zooms out revealing the audience],
[8K ultra quality, award-winning cinematography]
```

---

## 3. Prompts for Text-to-Video

### 3.1 Basic structure

```
[who/what] + [doing what] + [where] + [when/atmosphere] + [style]
```

### 3.2 Example video Prompts by genre

#### Nature & Landscape

```
Aerial drone footage of rice terraces in northern Thailand,
golden hour light casting long shadows,
farmers in colorful traditional clothing working in the fields,
misty mountains in background,
smooth cinematic movement, 4K, ultra wide angle
```

#### Character Animation

```
Young Thai woman in traditional Lanna costume,
gracefully performing classical Thai dance,
ornate gold jewelry catching light,
temple courtyard background with tropical flowers,
slow motion 120fps (frames per second — the more, the smoother), cinematic lighting, photorealistic
```

#### Product Commercial

```
Luxury sports car parked at edge of cliff overlooking ocean at sunset,
camera orbits slowly around the car revealing its sleek design,
reflections on polished surface, dramatic sky,
commercial photography quality, cinematic color grade
```

#### Abstract & Artistic

```
Abstract fluid simulation of liquid metal morphing into butterfly,
iridescent colors (colors that shift with viewing angle), metallic surfaces, macro photography,
hyper slow motion, studio black background,
ultra detailed 8K, particle effects
```

### 3.3 Camera and shooting vocabulary

| Shot type | Words to use |
|-----------|--------|
| Overview | `establishing shot`, `wide angle`, `aerial view`, `bird's eye` |
| Medium | `medium shot`, `waist-up shot` |
| Close-up | `close-up`, `extreme close-up`, `macro shot` |
| Following | `tracking shot`, `follow cam`, `dolly shot` |
| Orbiting | `orbit shot`, `360-degree shot`, `arc shot` |
| Descending from the sky | `crane shot`, `descending drone`, `top-down to eye level` |

### 3.4 Lighting vocabulary

| Light | Words to use |
|-----|--------|
| Golden light | `golden hour`, `magic hour`, `warm sunlight` |
| Blue light | `blue hour`, `twilight`, `cool ambient` |
| Night | `night scene`, `city lights`, `moonlight`, `neon glow` |
| Studio | `three-point lighting`, `key light`, `rim light`, `soft box` |
| Dramatic | `chiaroscuro` (classic light-shadow — very bright contrasting with very dark), `single source light`, `hard shadows` |
| Bright and airy | `overcast sky`, `diffused light`, `soft natural` |

### 3.5 Style vocabulary

| Style | Words to use |
|-------|--------|
| Film | `cinematic`, `anamorphic lens flare`, `35mm film` |
| Documentary | `documentary style`, `handheld camera`, `raw footage` |
| Advertising | `commercial photography`, `advertising quality` |
| Music Video | `music video aesthetic`, `stylized`, `high contrast` |
| Animation | `CGI animation`, `Pixar style`, `anime style` |

---

## 4. Prompts for Image Generation

### 4.1 Standard structure

```
[Subject] + [Descriptors] + [Environment] + [Lighting] + [Art Style] + [Quality Tags]
```

### 4.2 Quality Tags to always include

```
# For Commercial work
"professional quality, award winning, magazine cover, ultra detailed, 8K"

# For Artistic work
"artstation trending, highly detailed, masterpiece, concept art"

# For photography
"DSLR photo, f/1.8, ISO 400, RAW, professional photographer"

# For Illustration
"digital illustration, clean lines, vibrant colors, smooth shading"
```

### 4.3 Recommended Negative Prompts

```python
# Negative Prompt (what you don't want in the image) for general work
general_negative = "low quality, blurry, out of focus, noisy, grain, distorted, deformed, ugly, bad anatomy, watermark, text, signature, extra limbs"

# For Realistic photography
photo_negative = "cartoon, anime, illustration, painting, drawing, sketch, CGI, digital art, plastic look, overexposed, underexposed"

# For Art/Illustration work
art_negative = "photo, realistic, 3D render, blurry, low quality, ugly, deformed"

# For Portraits
portrait_negative = "multiple people, crowd, extra face, bad face, asymmetric eyes, blurry face"
```

### 4.4 Example image Prompts by industry

#### E-Commerce products

```python
ecommerce_prompts = {
    "cosmetics": (
        "Luxury cosmetics product photography, rose gold lipstick tube "
        "standing on white marble, surrounded by rose petals, "
        "professional studio lighting, shallow depth of field (blurred background), "
        "clean white background, commercial quality, 8K"
    ),
    "clothing": (
        "Fashion editorial photography, elegant white silk dress, "
        "model on minimalist background, high fashion lighting, "
        "Vogue magazine quality, clean composition"
    ),
    "food": (
        "Thai green curry in rustic clay bowl, overhead flat lay (shot from above), "
        "fresh herbs garnish, ingredients scattered artfully, "
        "professional food photography, warm lighting, appetizing"
    ),
}
```

#### Real Estate & Interior

```python
interior_prompt = (
    "Luxury condo living room, floor-to-ceiling windows overlooking Bangkok skyline, "
    "modern minimalist furniture, neutral tones, natural daylight, "
    "interior design magazine quality, architectural photography, wide angle lens"
)
```

#### Portrait & People

```python
portrait_prompt = (
    "Professional headshot of confident Thai businesswoman in her 30s, "
    "wearing navy blazer, warm genuine smile, "
    "neutral grey studio background, three-point lighting, "
    "high-end corporate photography, Canon 85mm f/1.4, shallow DOF"
)
```

---

## 5. Advanced Prompt techniques

### 5.1 Prompt Weighting — emphasize importance

Some Models support emphasizing words with parentheses, or repeating words to add weight (Weighting — giving importance weight):

```
# Emphasize golden light
"golden hour lighting, warm golden light, soft golden glow, magical golden atmosphere"

# Emphasize detail
"ultra detailed, highly detailed, intricate details, fine details"
```

### 5.2 Chained Descriptions

Chained Descriptions (adding details in a chain — adding details on top of each other progressively):

```
"ancient temple in misty jungle → stone covered in moss and vines → 
carved reliefs telling ancient stories → single beam of sunlight piercing through canopy"
```

### 5.3 Imitating an artist's style (Artist Style Reference)

```python
style_references = {
    "Roger Deakins cinematography": "shot by Roger Deakins, intimate natural lighting, muted palette",
    "Wes Anderson style": "Wes Anderson aesthetic, symmetrical composition, pastel colors, whimsical",
    "Studio Ghibli": "Studio Ghibli animation style, painterly backgrounds, soft colors, magical",
    "Annie Leibovitz Portrait": "Annie Leibovitz portrait style, dramatic lighting, powerful composition",
    "National Geographic": "National Geographic photography, documentary style, authentic emotion",
}
```

### 5.4 Negative Prompt Strategies

```python
# Use the Negative Prompt to fix common problems
fixes = {
    "Deformed arms/hands": "extra fingers, missing fingers, deformed hands, bad hands, extra limbs",
    "Strange face": "bad face, asymmetric face, deformed face, ugly, distorted features",
    "Cluttered background": "cluttered background, busy background, distracting elements",
    "Blurry image": "blurry, out of focus, motion blur, soft focus",
    "Bad lighting": "overexposed, underexposed, harsh lighting, flat lighting",
    "Low quality": "low resolution, pixelated, jpeg artifacts, low quality, amateur",
}
```

---

## 6. Ready-made Prompt Templates

### Template for ad Videos

```python
AD_VIDEO_TEMPLATE = """
{shot_type} shot of {product_name} - {product_description}.
{environment}: {environment_detail}.
{lighting_type} lighting, {atmosphere}.
Camera {camera_movement}, revealing {reveal_element}.
{brand_aesthetic}, commercial quality, {resolution}.
No text, no people (unless specified), photorealistic.
"""

# Usage
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

### Template for Portraits

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
    pose="slight 3/4 angle (turning the face slightly to the side)",
    background="out-of-focus garden",
    background_detail="soft green bokeh",
    lighting="Golden hour backlight",
    lighting_detail="soft hair light, reflector fill",
    photography_style="fashion editorial photography",
    camera_spec="shot on Canon R5 with 85mm f/1.4",
    quality_tags="magazine quality, ultra detailed, 8K",
    negative_elements=""
)
```

---

## 7. Common mistakes and fixes

| Problem | Cause | How to fix |
|-------|--------|---------|
| Very random results | The Prompt is short and vague | Add details, specify what you want clearly |
| Unwanted text in the image | Didn't say you don't want it | Add `no text, no watermark` to the Negative |
| The AI adds unwanted people | Not specified | Add `no people, empty` to the Negative or Prompt |
| Colors wrong from what you wanted | Colors not specified clearly | Specify Pantone or hex code, e.g. `deep navy blue #001F5B` |
| Wrong Style | No Style Reference specified | Add a clear Artist/Style reference |
| The video moves too little | The Prompt has no motion description | Add a clear motion description |
| `cfg_scale` (the value controlling closeness to the Prompt) has no effect | The value is too low | Increase `cfg_scale` to 0.7–0.9 |

---

## 8. A/B Testing Prompts

A/B Testing (comparative testing — try several versions then see which is better):

```python
import requests, time

def test_prompts(base_config: dict, prompt_variants: list) -> list:
    """Test several Prompts at once"""
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

# Test several Prompts
base = {"model": "kling-v3", "aspect_ratio": "16:9", "n": 1}
variants = [
    "tropical beach at sunset",
    "tropical beach at golden hour, warm colors, peaceful atmosphere",
    "stunning tropical paradise beach, golden sunset sky, crystal clear turquoise water, professional travel photography, 8K",
]

results = test_prompts(base, variants)
# Compare the results then pick the best Prompt
```

---

## 9. Summary: 10 principles

1. **Be clear** — the more detailed the better, but don't be too long
2. **Order matters** — put the most important thing first
3. **Use a Negative Prompt** — specify what you don't want every time
4. **Specify the style** — Photography, Painting, Anime, etc.
5. **Specify the lighting** — light is the most important factor in an image
6. **Specify the motion** — for video, you must say what moves and how
7. **Use Quality Tags** — `8K`, `ultra detailed`, `professional`, `award winning`
8. **Test and iterate** — create several versions then pick the best
9. **Learn from results** — see which Prompts gave good results and what the Pattern is
10. **English yields better results** — for Style and Technical Terms, use English
