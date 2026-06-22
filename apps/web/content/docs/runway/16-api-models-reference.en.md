---
title: "API Models Reference — the full list of models"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "A list of all AI models the Runway API supports, with Parameters, Input/Output details, and pricing, for developers choosing the right model for the job"
readTime: "12 min"
readers: "0"
locked: false
order: 16
---

# API Models Reference — the full list of models

> A reference guide to all the AI models in the Runway API, with Parameters and usage details.

---

## Video models category (Video Generation)

### gen4.5 — the main high-quality model

**Model ID:** `gen4.5`

**Input:** Text + Image (Image required, 1 image) or Text only (Text-to-Video)

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | ✓ | `"gen4.5"` |
| `promptText` | string | ✓ | The video description (up to 1000 characters) |
| `promptImage` | string | — | The image's URL or Data URI |
| `duration` | number | ✓ | `5` or `10` (seconds) |
| `ratio` | string | ✓ | `"1280:720"` or `"720:1280"` |
| `seed` | number | — | A Seed for Reproducibility (recreating the same result) |
| `contentModeration` | object | — | Adjust Moderation settings |

**Price:** 12 credits/second

---

### gen4_turbo — fast and economical

**Model ID:** `gen4_turbo`

**Input:** Image only (doesn't support Text-only)

**Parameters same as gen4.5** but:
- Supports Image Input only
- Doesn't support `duration: 10`

**Price:** 5 credits/second

---

### aleph2 — Video-to-Video

**Model ID:** `aleph2`

**Input:** Video + Text/Image (for editing video)

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | ✓ | `"aleph2"` |
| `promptText` | string | ✓ | The new-style description |
| `promptVideo` | string | ✓ | The source video's URL or URI |
| `duration` | number | ✓ | The video length (seconds) |

**Price:** 28 credits/second (minimum 56 credits = 2 seconds)

---

### gen4_aleph — Gen-4 x Video-to-Video

**Model ID:** `gen4_aleph`

Combines Gen-4's capabilities with Aleph for Video-to-Video that preserves identity better.

---

### veo3 — video with audio (Google)

**Model ID:** `veo3`

**Input:** Text + Image (optional)

**Highlight:** creates video **with audio** in one command

**Price:**
- With audio: 40 credits/second
- Without audio: 20 credits/second

---

### veo3.1 / veo3.1_fast — upgraded versions

**Model IDs:** `veo3.1`, `veo3.1_fast`

Upgraded versions of Veo3 with improved quality; `veo3.1_fast` is faster and uses fewer Credits.

---

### seedance2 / seedance2_fast — high flexibility

**Model IDs:** `seedance2`, `seedance2_fast`

**Input:** Text, Image, or Video

**Price:**
- seedance2: 36-40 credits/second (depends on Resolution)
- seedance2_fast: 29 credits/second

---

### act_two — Character Animation

**Model ID:** `act_two`

**Input:** Image (character) + Video (performance)

**Used for:** transferring motion from a Performance Video to a character

---

### happyhorse_1_0 — Text/Image-to-Video

**Model ID:** `happyhorse_1_0`

An alternative model for Text or Image to Video.

---

## Image models category (Image Generation)

### gen4_image — Gen-4 Image

**Model ID:** `gen4_image`

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | ✓ | `"gen4_image"` |
| `promptText` | string | ✓ | The image description |
| `promptImages` | array | — | Reference images (can include several) |
| `ratio` | string | ✓ | The desired Aspect Ratio |
| `resolution` | string | — | `"720p"` or `"1080p"` |

**Price:**
- 720p: 5 credits
- 1080p: 8 credits

**Using Reference Images with a Tag:**
```json
{
  "model": "gen4_image",
  "promptText": "A photo of @person1 standing in a park",
  "promptImages": [
    {
      "uri": "https://example.com/person.jpg",
      "tag": "person1"
    }
  ],
  "ratio": "1280:720"
}
```

### gen4_image_turbo — fast version

**Model ID:** `gen4_image_turbo`

**Price:** 2 credits (all Resolutions)

---

### gpt_image_2 — OpenAI Image

**Model ID:** `gpt_image_2`

A model from OpenAI that's high quality and versatile.

**Price:** 1-41 credits (depends on quality and resolution)

---

### gemini_image3_pro — Google Image

**Model ID:** `gemini_image3_pro`

A model from Google good at realistic images.

**Price:** 20-40 credits (depends on resolution)

---

### gemini_2.5_flash — Google Fast Image

**Model ID:** `gemini_2.5_flash`

A fast version from Google for work needing speed.

---

### magnific_precision_upscaler_v2 — Image Upscaling

**Model ID:** `magnific_precision_upscaler_v2`

**Input:** an image to increase resolution

**Price:**
- General: 25 credits
- Beyond 4096px: 150 credits

---

## Real-time models category (Avatars)

### gwm1_avatars — Live Avatar

**Model ID:** `gwm1_avatars`

**Used for:** creating an Avatar that interacts in Real-time via API Characters

**Price:** 2 credits to start + 2 credits every 6 seconds

---

## Audio models category (Audio)

### elevenlabs_tts — Text-to-Speech

**Model ID:** `elevenlabs_tts` (or the specified ElevenLabs name)

**Price:** 1 credit / 50 characters

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `text` | string | The text to read |
| `voice` | string | The chosen voice |
| `speed` | number | The speed (0.5 - 2.0) |

---

### voice_isolation — Voice Isolation

**Price:** 1 credit / 6 seconds

---

### voice_dubbing — Video Dubbing

**Price:** 1 credit / 2 seconds

---

## Input/Output Format Summary

### Supported Input formats

**Images:**
- JPEG/JPG, PNG, WebP
- Max size via URL: 16MB
- Max size via Data URI: 5MB
- Max size via Ephemeral Upload: 200MB
- Recommended resolution: 640x640 - 4096x4096

**Videos:**
- MP4, MOV, MKV, WebM, 3GPP, OGG
- Codec: H.264, H.265, AV1, VP8, VP9, ProRes
- Max size via URL: 32MB
- Max size via Ephemeral Upload: 200MB

**Audio:**
- MP3, WAV, FLAC, M4A, AAC
- Max size via URL: 32MB

### Output formats

**Video:** MP4 (H.264/H.265) primarily
**Image:** PNG or JPEG
**Audio:** MP3 or WAV

### Output URL

- The resulting URL **expires in 24-48 hours**
- You must download and store it in your own Storage immediately

---

## Auto-cropping behavior

If the Input Image doesn't match the specified Output Ratio, Runway will:
1. **Auto-crop from the center** (Center crop)
2. Not squeeze or stretch the image

**Example:**
- A 1080x1080 (1:1) image → Output 1280:720 (16:9)
- Runway crops off the top and bottom, keeping only the center

**How to prevent it:** Use an Input image with a Ratio close to the desired Output.

---

## Content Moderation Parameters

For some work needing extra Moderation control:

```json
{
  "model": "gen4.5",
  "promptText": "...",
  "contentModeration": {
    "publicFigureRecognition": "disabled"
  }
}
```

**Note:** Even with adjusted Moderation, it must still comply with Runway's Terms of Service.

---

## Model selection summary

### Choose by Use Case:

| Use Case | Recommended model |
|---|---|
| Highest quality (video) | gen4.5 |
| Fast, economical (video) | gen4_turbo |
| Video-to-Video | aleph2, gen4_aleph |
| Video + audio in one command | veo3 |
| High-quality images | gemini_image3_pro |
| Cheap images | gen4_image_turbo |
| Character Animation | act_two |
| Live Avatar | gwm1_avatars |
| Text-to-Speech | elevenlabs_tts |
