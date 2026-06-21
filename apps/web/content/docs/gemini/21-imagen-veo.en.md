---
title: "Imagen and Veo — create images and video with pro-level AI"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "A deep dive into Imagen 4 for high-quality image creation and Veo 3 for video with audio, plus parameters and prompting techniques"
readTime: "9 min"
readers: "0"
locked: false
order: 21
---

# Imagen and Veo — create images and video with pro-level AI

Google has two main pro-level AI models (the AI brain) for creating visual and audio media: **Imagen** for still images and **Veo** for video. Both are usable through Gemini and the Gemini API (a program-connection channel).

---

## Imagen — high-quality image creation

### What is Imagen?
Imagen is Google's AI image-creation model (the AI brain) that creates "realistic and high quality" images from a text description. Every image created has a **SynthID watermark** (a digital watermark invisible to the naked eye — embedded to indicate the image was made by AI), invisible to the naked eye, to indicate it's AI-created.

### Available Imagen models

| Model | Suitability |
|---|---|
| **Imagen 4 Ultra** | Highest quality, realistic detail |
| **Imagen 4 Standard** | A balance of quality and speed |
| **Imagen 4 Fast** | Fastest, good for prototypes |

### Imagen 4's abilities

**Size and aspect ratio:**
- Aspect ratios: 1:1, 3:4, 4:3, 9:16, 16:9
- Resolution: 1K or 2K (for Ultra and Standard)
- Create 1–4 images at a time

**Special abilities:**
- Render text inside the image (recommended no more than 25 characters)
- Control whether people appear in the image (block, adults only, all ages)
- Create various styles: realistic, illustration, anime, painting, etc.

### How to write prompts for Imagen

A good prompt (an instruction or description telling the AI what you want) should have this structure:

**A good prompt structure:**
```
[subject] [action/pose] [environment] [lighting] [style] [quality]
```

**Examples:**
- Bad: "a cute cat"
- Good: "A fluffy orange tabby cat sitting on a window sill at golden hour, soft warm lighting, photorealistic, 4K"

**Key techniques:**
- Specify the style clearly: "oil painting", "watercolor", "digital art", "photorealistic"
- Specify the lighting: "golden hour", "studio lighting", "dramatic shadows", "soft diffused light"
- Specify the camera angle: "wide angle", "close-up portrait", "bird's eye view", "macro" (a very close-up shot)
- Specify the mood: "serene", "dramatic", "playful", "mysterious"

> **Note:** Imagen supports English prompts only, up to 480 tokens (pieces of text).

---

## Veo — AI video creation

### What is Veo?
Veo is Google's AI video-creation model. The latest, **Veo 3**, can create "high-fidelity, 8-second videos featuring stunning realism and natively generated audio" — including dialogue, sound effects, and background sound.

### Available Veo models

| Model | Properties |
|---|---|
| **Veo 3.1** | Latest, highest quality (Preview — still in testing) |
| **Veo 3.1 Fast** | A fast version (Preview) |
| **Veo 3.1 Lite** | A light version (Preview) |
| **Veo 3** | Stable, with AI audio |
| **Veo 3 Fast** | Fast, stable |
| **Veo 2** | The previous version, well-stable |

### Veo 3's abilities

**Video creation:**
- Length: 8 seconds per clip (a piece of video, extendable by another 7 seconds)
- Resolution: 720p, 1080p, 4K
- Aspect ratios: 16:9 (landscape) and 9:16 (portrait)
- **With AI audio:** dialogue, sound effects, ambient sound (background atmosphere sound)

**Creation modes:**

1. **Text-to-video** — create video from a text description
2. **Image-to-video** — animate an image into motion
3. **Reference images** — use up to 3 reference images to define style or characters
4. **Frame interpolation** (editing the first and last frames) — define both the first frame and last frame
5. **Video extension** — extend the length of an already-created video

### How to write prompts for Veo

**Video prompt structure:**
```
[camera movement] [subject] [action] [environment] [style/mood]
```

**Examples:**
- "Slow zoom in on a woman walking through a neon-lit Tokyo street at night, cinematic, shallow depth of field"
- "Drone shot flying over a misty mountain range at sunrise, 4K, smooth motion"
- "A chef flipping pancakes in a cozy kitchen, morning light streaming through windows, documentary style"

**Techniques for video:**
- Specify the camera movement: "pan left", "zoom in", "tracking shot", "static shot", "drone aerial"
- Specify the speed: "slow motion", "time-lapse" (compressing time to go fast), "real-time"
- Specify the mood: "cinematic", "documentary", "commercial", "artistic"

---

## Use it through Gemini (no API)

### Create images with Imagen
1. Open [gemini.google.com](https://gemini.google.com)
2. Type "Create an image..." or "Generate an image of..."
3. Gemini uses Imagen to create the image
4. Ask for a variation or edit it in the same conversation

### Create video with Veo
1. Open Gemini
2. Type "Create a video..." or "Create a video of..."
3. Choose options if available (length, style)
4. Wait for the video to render (the video processing — may take a moment)

> **Note:** The video feature may require Gemini Advanced depending on the region.

---

## Limits and policies

### What can't be done:
- Create images/video of identifiable real people
- Harmful, illegal, or explicit content
- Create images that misleadingly seem like news

### SynthID Watermark (a digital watermark marking AI):
- Every image and video from Imagen/Veo has a digital watermark
- Invisible to the naked eye but detectable by software
- For transparency that it was made by AI

---

## Comparison: should you use Imagen or Veo?

| You want | Use |
|---|---|
| A high-quality still image | Imagen 4 |
| An image for social media | Imagen 4 Fast |
| A short video with audio | Veo 3 |
| Animating an image | Veo (image-to-video) |
| A cinematic video | Veo 3.1 |
