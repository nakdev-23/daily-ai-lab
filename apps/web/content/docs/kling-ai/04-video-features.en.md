---
title: "Video Features — special features for video"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Lip Sync uses AI to make a character's mouth movements in a video match the given audio, whether speech, singing, or dialogue"
readTime: "4 min"
readers: "0"
locked: false
order: 4
---
# 04 · Video Features — special features for video

> Official Docs reference:
> - [Lip Sync](https://kling.ai/document-api/apiReference%2Fmodel%2FlipSync)
> - [Avatar](https://kling.ai/document-api/apiReference%2Fmodel%2Favatar)
> - [Video Effects](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoEffects)
> - [Effect Templates](https://kling.ai/document-api/quickStart%2FproductIntroduction%2FeffectsCenter)
> - [Video Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniVideo)

---

## 1. Lip Sync — sync lips to audio

> Reference: [Lip Sync](https://kling.ai/document-api/apiReference%2Fmodel%2FlipSync)

### What is this topic?

Lip Sync uses AI to make a character's mouth movements in a video match the given audio, whether speech, singing, or dialogue.

### What it's used for

- Dubbing a video into multiple languages
- Creating an AI character that speaks from given text
- Making a character in a video move their lips to match audio

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/lip-sync
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `video_id` | string | ✅ (if not using URL) | The source video ID from Kling |
| `video_url` | string | ✅ (if not using ID) | The URL of the video to sync |
| `mode` | string | ✅ | How to provide audio: `text2audio` (text→audio) or `audio2lip` (use existing audio) |
| `tts_text` | string | ❌ | The text to speak (for mode: text2audio) |
| `tts_timbre` | string | ❌ | The speaking voice style (timbre) |
| `tts_speed` | float | ❌ | The speaking speed |
| `audio_url` | string | ❌ | The URL of the audio to sync (for mode: audio2lip) |

### Pricing

About $0.10 per 5 seconds

### Cautions

- The source video must have a clear human face
- Supports both Kling-generated videos and externally uploaded videos
- Supports English, Chinese, Japanese, Korean

---

## 2. Avatar — a digital human from a single image

> Reference: [Avatar](https://kling.ai/document-api/apiReference%2Fmodel%2Favatar)

### What is this topic?

Create a Digital Human video that speaks and moves its lips to match given audio, using just **one front-facing photo** — as if the person in the photo came to life and spoke.

### What it's used for

- Create a Virtual Spokesperson for a brand
- Make tutorial/lecture videos with an AI character
- Create an AI Presenter from a person's photo

### Special capabilities

| Feature | Detail |
|---------|-----------|
| **Kling Avatar 2.0** | Create continuous videos up to **5 minutes** long |
| **Resolution** | 1080p / 48 FPS |
| **Supported languages** | English, Chinese, Japanese, Korean |
| **Lip Sync** | Highly accurate, supports singing and fast dialogue |

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/avatar
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `avatar_image` | string | ✅ | URL or Base64 of a clear front-facing photo |
| `audio_url` | string | ✅ (or tts) | The URL of the desired audio |
| `tts_text` | string | ✅ (or audio) | The text to speak |
| `tts_voice` | string | ❌ | The speaking voice to use |
| `prompt` | string | ❌ | Additional description, e.g. the gesture style |

### Cautions

- The photo must be a **clear, front-facing face** with no objects blocking it
- The video length depends on the audio length

---

## 3. Video Effects — special effects for video

> Reference: [Video Effects](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoEffects)

### What is this topic?

Add special effects to an existing video, or create a new video with effects. Used for interactive content, e.g. Hug, Kiss, or special gestures between two characters.

### Supported effect types

**Dual-character Effects:**
- `hug` — a hug
- `kiss` — a kiss
- `heart_gesture` — a heart-hands gesture

> Supported in `kling-v1`, `kling-v1-5`, `kling-v1-6`

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/effects
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `model` | string | ✅ | The model name |
| `effect_scene` | string | ✅ | The effect type, e.g. `hug`, `kiss`, `heart_gesture` |
| `image` | string | ✅ | An image or the source video URL |
| `mode` | string | ❌ | `std` or `pro` |

---

## 4. Effect Templates

> Reference: [Effect Templates](https://kling.ai/document-api/quickStart%2FproductIntroduction%2FeffectsCenter)

### What is this topic?

Effect Templates are a library of ready-made effects developers can use directly without specifying the details themselves. There are many to choose from — motion effects, style effects, and special effects.

### How to use it

1. View the Effect Templates available in the Effects Center library
2. Choose the Template ID you want
3. Call the API specifying the Template ID and an image or video
4. The system creates a video with that effect automatically

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/effects
```

### Cautions

- Effect Templates are updated periodically; check the available list via the API
- Some Templates may require images in a specific format

---

## 5. Video Omni — multimodal video

> Reference: [Video Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniVideo)

### What is this topic?

Video Omni uses the `kling-v3-omni` model, a **Multimodal Model** that combines various capabilities in one model, supporting Text, Image, Video, and Audio in the same request.

### Special capabilities of Video Omni

- **Multi-shot Generation** — create a video with several continuous scenes
- **Native Audio Generation** — generate accompanying audio along with the video (no need to add audio afterward)
- **Video Reference** — use a reference video to control the style
- **Element Control** — use characters and objects from the Element Library

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/text2video
```
(specify `model: "kling-v3-omni"`)

### Multi-shot example

```json
{
  "model": "kling-v3-omni",
  "mode": "pro",
  "duration": "10",
  "multi_shot": [
    {
      "shot_prompt": "Scene 1: a cat wakes up in the morning, sunlight streaming through the window",
      "shot_duration": "3"
    },
    {
      "shot_prompt": "Scene 2: the cat walks to its food bowl and eats",
      "shot_duration": "4"
    },
    {
      "shot_prompt": "Scene 3: the cat goes back to sleep on the sofa",
      "shot_duration": "3"
    }
  ]
}
```
