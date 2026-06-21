---
title: "Imagine API — create and edit images/video"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "The Imagine API is Grok's image and video ability. It can:"
readTime: "3 min"
readers: "0"
locked: false
order: 5
---
# Imagine API — create and edit images/video

> Reference: [Imagine Overview](https://docs.x.ai/developers/model-capabilities/imagine) | [Image Generation](https://docs.x.ai/developers/model-capabilities/images/generation) | [Image Editing](https://docs.x.ai/developers/model-capabilities/images/editing) | [Video Generation](https://docs.x.ai/developers/model-capabilities/video/generation)

---

## What is the Imagine API?

The **Imagine API** is Grok's image and video ability. It can:

- Create images from a text prompt
- Edit existing images
- Create video from text or images
- Extend videos, edit videos

Try it at [console.x.ai/playground/imagine](https://console.x.ai/playground/imagine)

---

## Image Generation

Reference: [Image Generation](https://docs.x.ai/developers/model-capabilities/images/generation)

### Supported models

| Model | Quality | Price (1K) | Price (2K) |
|---|---|---|---|
| `grok-imagine-image-quality` | Highest | $0.05/image | $0.07/image |
| `grok-imagine-image` | Standard | $0.02/image | $0.02/image |

### How to use it

**Python (xAI SDK):**
```python
import os
import xai_sdk

client = xai_sdk.Client(api_key=os.getenv("XAI_API_KEY"))

response = client.image.sample(
    prompt="A white cat sleeping on a house roof at sunset, watercolor style",
    model="grok-imagine-image-quality",
)

print(response.url)  # The URL of the created image
```

**Python (OpenAI SDK):**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.images.generate(
    model="grok-imagine-image-quality",
    prompt="A white cat sleeping on a house roof at sunset, watercolor style",
)

print(response.data[0].url)
```

**cURL:**
```bash
curl -X POST https://api.x.ai/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-imagine-image-quality",
    "prompt": "A white cat sleeping on a house roof at sunset"
  }'
```

---

## Image Editing

Reference: [Image Editing](https://docs.x.ai/developers/model-capabilities/images/editing)

### What is this topic?
Send an original image with a prompt and Grok edits it as told, e.g. change the background, add objects, remove unwanted things, adjust the image style.

### How to use it

```python
import base64

# Read the image file
with open("original_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.images.edit(
    model="grok-imagine-image-quality",
    image=f"data:image/jpeg;base64,{image_data}",
    prompt="Change the background to a sunset beach",
)

print(response.data[0].url)
```

---

## Multi-Image Editing

Reference: [Multi-Image Editing](https://docs.x.ai/developers/model-capabilities/images/multi-image-editing)

### What is this topic?
Send several images at once and have Grok combine or process them together, e.g. combine the style from one image with the content from another.

### Example use cases
- Take an artwork's style + a photo → create a new image in that style
- Change the clothing in an image by referencing an example clothing image

---

## Video Generation

Reference: [Video Generation](https://docs.x.ai/developers/model-capabilities/video/generation)

### What is this topic?
Create video from a text prompt or from an image; the model creates a video moving as told.

### Pricing

| Resolution | Price per second |
|---|---|
| 480p | $0.05 |
| 720p | $0.07 |

> **Note:** 720p video falls back to 480p automatically when the set quota is reached.

### How to use it

```python
response = client.videos.generate(
    model="grok-imagine-video",
    prompt="Sea waves washing the beach at sunrise, slow-motion footage",
    resolution="720p",
    duration=5,  # seconds
)

print(response.data[0].url)
```

---

## Image-to-Video

Reference: [Image-to-Video](https://docs.x.ai/developers/model-capabilities/video/image-to-video)

### What is this topic?
Send a still image and Grok creates a video where that image "comes to life."

### How to use it

```python
with open("still_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.videos.generate(
    model="grok-imagine-video",
    image=f"data:image/jpeg;base64,{image_data}",
    prompt="Wind blowing across a flower field, petals fluttering",
    resolution="480p",
)
```

---

## Video Editing

Reference: [Video Editing](https://docs.x.ai/developers/model-capabilities/video/editing)

### What is this topic?
Send an original video with a prompt to edit it, e.g. change the style, add effects, or adjust the atmosphere.

---

## Reference-to-Video

Reference: [Reference-to-Video](https://docs.x.ai/developers/model-capabilities/video/reference-to-video)

### What is this topic?
Send a reference image (e.g. a character or location) and Grok creates a video referencing it, making the character or location look consistent.

**Pricing (grok-imagine-video-1.5-preview):**
- 480p: $0.08/second
- 720p: $0.14/second

---

## Video Extension

Reference: [Video Extension](https://docs.x.ai/developers/model-capabilities/video/extension)

### What is this topic?
Send an existing video and have Grok extend it to be longer; the content flows continuously from where it stopped.

---

## Watermark in images/video

Images and video created by Grok may have a "grok" watermark, especially in some countries with legal requirements (e.g. India, Australia). It can't be removed because it's a legal requirement.

---

## Tips for writing image prompts

- Specify the **image style** clearly: `watercolor`, `photorealistic`, `anime`, `oil painting`
- Specify the **lighting**: `golden hour`, `studio lighting`, `dramatic shadows`
- Specify the **angle**: `bird's eye view`, `close-up portrait`, `wide shot`
- Specify the **image mood**: `peaceful`, `dramatic`, `mysterious`

**Example of a good prompt:**
```
A white cat sleeping on a rooftop at sunset, 
watercolor painting style, warm golden lighting, 
soft pastel colors, dreamy atmosphere
```
