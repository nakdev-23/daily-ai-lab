---
title: "Kolors — the image model from Kuaishou"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Kolors is a world-class Text-to-Image model from Kuaishou behind Kling AI, supporting Thai-Chinese-English, 4K Native, and advanced style control"
readTime: "6 min"
readers: "0"
locked: false
order: 14
---
# 14 · Kolors — the image model from Kuaishou

> Official Docs reference:
> - [Image Models](https://kling.ai/document-api/apiReference%2Fmodel%2FimageModels)
> - [Image Generation](https://kling.ai/document-api/apiReference%2Fmodel%2FimageGeneration)
> - [Image Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniImage)

---

## 1. What is Kolors?

**Kolors** is a Text-to-Image Foundation Model (a foundation model for generating images from text — an AI that turns descriptions into pictures) developed by **Kuaishou Technology** (Kling AI's parent company), launched in 2024 with capabilities outstanding enough to win worldwide recognition.

Kolors is the model behind all of Kling AI's image capabilities, and is also available directly via the Kling API.

### Kolors's highlights

- **Multilingual**: understands Prompts in Thai, Chinese, English, Japanese, Korean, and more, well
- **4K Native** (creates 4K resolution directly without upscaling): generates high-resolution images without upscaling (enlarging after generation)
- **Text Rendering** (displaying text in images): displays text in images accurately (especially Chinese and English characters)
- **Photorealism**: high-level photorealistic images
- **Artistic Versatility**: supports a wide range of styles, from photography to anime and art

---

## 2. Models in the Kolors/Kling Image family

### Model Comparison table

| Model ID | Resolution | Main capabilities | Use Case |
|----------|-----------|----------------|----------|
| `kling-v3` | 1K / 2K / 4K | Text-to-Image, Img-to-Img, 4K, Multi-shot Series | General work, 4K Production |
| `kling-v3-omni` | 1K / 2K / 4K | Multimodal (accepts multiple data types), accepts 10+ References, Series | Complex workflows |
| `kling-v2-1` | 1K / 2K | Text-to-Image, Img-to-Img | General work |
| `kling-v1-5` | 1K | Basic Image Generation | Basic work |
| `kling-v1` | 1K | Basic Image Generation | Legacy |

### Supported resolutions

| Level | Actual resolution | Used for |
|-------|----------------|--------|
| **1K** | ~1024×1024 or proportional | General work, low cost |
| **2K** | ~2048×2048 or proportional | Print work, high detail |
| **4K** | ~4096×4096 or proportional | Production, Cinema, Billboard (large advertising signs) |

---

## 3. Text-to-Image API — create images from text

### Endpoint

```
POST https://api-singapore.klingai.com/v1/images/generations
```

### Full parameters

| Parameter | Type | Required | Default | Description |
|------------|--------|--------|-----------|---------|
| `model` | string | ✅ | - | The model name, e.g. `kling-v3` |
| `prompt` | string | ✅ | - | The image description (supports Thai/Chinese/English) |
| `negative_prompt` | string | ❌ | - | What you don't want in the image |
| `image` | string | ❌ | - | A reference image URL/Base64 (Image-to-Image) |
| `image_fidelity` | float | ❌ | 0.5 | Closeness to the reference image (0–1) |
| `human_fidelity` | float | ❌ | 0.2 | Closeness of the face to the reference image (0–1) |
| `n` | int | ❌ | 1 | The number of images (1–9) |
| `aspect_ratio` | string | ❌ | `1:1` | `1:1`, `16:9`, `9:16`, `4:3`, `3:4` |
| `callback_url` | string | ❌ | - | A URL to receive results automatically (Webhook) |
| `external_task_id` | string | ❌ | - | A self-defined Task ID |

---

## 4. Kolors usage examples

### 4.1 Photorealistic

```python
import requests, jwt, time

def get_token(ak, sk):
    now = int(time.time())
    return jwt.encode({"iss": ak, "exp": now+1800, "nbf": now-5}, sk, algorithm="HS256")

BASE = "https://api-singapore.klingai.com"
token = get_token("YOUR_AK", "YOUR_SK")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# A photorealistic image
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "Professional product photography, luxury perfume bottle on marble surface, "
            "soft studio lighting, shallow depth of field, bokeh background, "
            "8K ultra detailed, commercial photography style"
        ),
        "negative_prompt": "cartoon, illustration, painting, low quality, blur",
        "aspect_ratio": "1:1",
        "n": 1
    }
)
task_id = resp.json()["data"]["task_id"]
```

### 4.2 English-Language Prompt

```python
# Kolors understands many languages well
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "A photorealistic image of an ancient Thai temple at sunset, "
            "the golden sun shining on the golden pagoda spire, "
            "water in the pond reflecting the image, a calm, sacred atmosphere"
        ),
        "negative_prompt": "people, tourists, blurry, low quality",
        "aspect_ratio": "16:9",
        "n": 2
    }
)
```

### 4.3 Artistic Styles

```python
# Anime/Manga Style
anime_prompt = {
    "model": "kling-v3",
    "prompt": (
        "Anime style illustration, young girl with long black hair standing in a sunflower field, "
        "Studio Ghibli inspired, soft watercolor tones, dreamy atmosphere, detailed background"
    ),
    "negative_prompt": "realistic, 3D render, ugly, deformed",
    "aspect_ratio": "9:16",
    "n": 1
}

# Oil Painting Style
oil_painting_prompt = {
    "model": "kling-v3",
    "prompt": (
        "Classical oil painting style, portrait of elderly fisherman at sea, "
        "Rembrandt lighting, rich warm tones, detailed brushwork, museum quality"
    ),
    "negative_prompt": "digital art, photo, modern style",
    "aspect_ratio": "3:4",
    "n": 1
}

# Cyberpunk Style (a dark, neon-filled future)
cyberpunk_prompt = {
    "model": "kling-v3",
    "prompt": (
        "Cyberpunk cityscape at night, neon signs in Thai script, flying vehicles, "
        "rain-slicked streets reflecting lights, ultra detailed, cinematic"
    ),
    "negative_prompt": "daylight, natural, low quality",
    "aspect_ratio": "16:9",
    "n": 1
}
```

---

## 5. Image-to-Image — transform or reference an existing image

Image-to-Image (generating an image by referencing an existing one — using the old image as a base then adjusting per the Prompt):

```python
# Use a reference image to control the style
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": "The same image but in anime style, vivid colors, sharp lines",
        "image": "https://example.com/original_photo.jpg",
        "image_fidelity": 0.6,   # 0 = free, 1 = very close
        "aspect_ratio": "1:1",
        "n": 1
    }
)

# Use a face reference (for a Portrait)
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": "A woman in sportswear running in a park, afternoon light",
        "image": "https://example.com/face_reference.jpg",
        "image_fidelity": 0.3,
        "human_fidelity": 0.8,   # keep the face close to the reference image
        "aspect_ratio": "9:16",
        "n": 1
    }
)
```

---

## 6. 4K Native Image Generation

```python
# Create a 4K image with kling-v3
resp = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "4K ultra high resolution, aerial photograph of tropical island, "
            "crystal clear turquoise water, white sand beach, lush green jungle, "
            "golden hour lighting, professional drone photography"
        ),
        "negative_prompt": "low resolution, blur, grain, oversaturated",
        "aspect_ratio": "16:9",
        "n": 1
        # Note: specify 4K in the Prompt, and Kling uses the highest supported resolution
    }
)
```

> **Note**: Generating a 4K image takes longer and uses more Concurrency than usual.

---

## 7. Prompt Engineering for Kolors

### A good Prompt structure

```
[Subject] + [Action/State] + [Environment] + [Lighting] + [Style] + [Quality]
```

**Example:**
```
[A Siberian husky] [running] [on snow in a pine forest] [golden sunset light] 
[professional photography style] [8K ultra detailed, award winning photography]
```

### Style Keywords to know

| Style | English Keyword |
|-------|-------------------|
| Photorealistic | `photorealistic`, `DSLR photo`, `8K`, `ultra detailed` |
| Anime | `anime style`, `manga`, `Studio Ghibli`, `Makoto Shinkai` |
| Watercolor | `watercolor painting`, `soft colors`, `brush strokes` |
| Oil painting | `oil painting`, `classical art`, `Rembrandt style` |
| Digital Art | `digital illustration`, `concept art`, `artstation` |
| 3D Render | `3D render`, `Blender`, `Octane render`, `CGI` |
| Cyberpunk | `cyberpunk`, `neon lights`, `futuristic`, `sci-fi` |
| Vintage | `vintage photo`, `retro style`, `film grain`, `1970s` |

### Lighting Keywords

| Light | Words to use |
|-----|--------|
| Golden light | `golden hour`, `warm sunlight`, `soft golden light` |
| Studio light | `studio lighting`, `softbox`, `professional lighting` |
| Moonlight | `moonlight`, `night scene`, `moonlit` |
| Candlelight | `candlelight`, `warm ambient`, `low key` |
| Neon light | `neon lights`, `cyberpunk lighting`, `colorful neon` |

---

## 8. Multi-Shot Image Series (AI Multi-Shot — a series of continuous frames)

Kolors can create multiple continuous images, good for a Storyboard or a Comic Strip.

```python
# Create a 4-panel Storyboard
resp = requests.post(f"{BASE}/v1/images/ai-multi-shot",
    headers=headers,
    json={
        "model": "kling-v3",
        "result_type": "series",
        "n": 4,
        "shots": [
            {
                "prompt": "Scene 1: a detective walks into a dark room, a single light shining on the table"
            },
            {
                "prompt": "Scene 2: the detective finds a mysterious envelope on the table"
            },
            {
                "prompt": "Scene 3: the detective reads the letter, with a shocked expression"
            },
            {
                "prompt": "Scene 4: the detective makes a phone call, someone's shadow is behind the window"
            }
        ],
        "style": "noir graphic novel, high contrast black and white, dramatic shadows"
    }
)
```

---

## 9. Comparing Kolors with other models

| Item | Kolors/Kling | Midjourney | DALL-E 3 | Stable Diffusion |
|--------|-------------|-----------|---------|-----------------|
| Thai/Chinese | Excellent | Good | Good | Must translate yourself |
| 4K Native | ✅ | ✅ | ❌ | ✅ (must configure) |
| API | ✅ | ✅ (limited) | ✅ | ✅ |
| Text in images | Good | Good | Excellent | Fair |
| Video Generation | ✅ (Kling) | ❌ | ❌ | Partial |
| Pricing | Pay per use | Subscription | Pay per use | Self-hostable |

---

## 10. Summary

Kolors/Kling Image Models are good for:

- **Content Creators** who want high-quality images from Thai or Chinese Prompts
- **Developers** building AI image-generation systems for Thai platforms
- **E-Commerce businesses** that want low-cost product images
- **Designers** who want quick Concept Art (idea concepts)
- **Production Houses** that want a Storyboard or Previs (Pre-visualization — a mockup before the actual shoot) from text
