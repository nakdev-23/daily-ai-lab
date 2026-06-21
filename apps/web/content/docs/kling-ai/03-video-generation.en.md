---
title: "Video Generation"
tool: "Kling AI"
icon: "icon-docs"
level: "beginner"
summary: "Send a Prompt (description) as text, and the AI generates a video following that Prompt"
readTime: "6 min"
readers: "0"
locked: false
order: 3
---
# 03 · Video Generation

> Official Docs reference:
> - [Video Models](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoModels)
> - [Video Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniVideo)
> - [Text to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToVideo)
> - [Image to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FimageToVideo)
> - [Reference to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToVideo)
> - [Motion Control](https://kling.ai/document-api/apiReference%2Fmodel%2FmotionControl)
> - [Multi-elements to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiElements)
> - [Extend Video](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoExtension)

---

## 1. Video Models — all video models

> Reference: [Video Models](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoModels)

### Main models (recommended)

#### kling-v3 / kling-v3-omni (latest)

| Item | Detail |
|--------|-----------|
| Mode | std / pro |
| Length | 3–15 seconds |
| Text to Video | ✅ Single-shot and Multi-shot |
| Image to Video | ✅ Single-shot, Multi-shot, Start+End Frame |
| Element Control | ✅ Video Character + Multi-image Elements |
| Motion Control | ✅ |
| Voice Control | ✅ |

> **kling-v3-omni** supports extra features like Multi-shot and Video Reference

---

#### kling-video-o1 (Unified Multimodal)

| Item | Detail |
|--------|-----------|
| Mode | std / pro |
| Length | 3–10 seconds (only 5s or 10s) |
| Text to Video | ✅ |
| Image to Video | ✅ (Start Frame only) |
| Voice Control | ✅ |

---

#### kling-v2-6 (previous version)

| Item | Detail |
|--------|-----------|
| Mode | std / pro |
| Length | 5s, 10s, and other lengths |
| Native Audio | ✅ (only the no-audio version) |
| Motion Control | ✅ |
| Voice Control | ✅ |

---

#### Legacy models

| Model | Modes | Main capabilities |
|-------|-------|--------------|
| `kling-v2-5-turbo` | std/pro 5s, 10s | Fastest speed |
| `kling-v2-1` | std/pro 5s, 10s | All features |
| `kling-v2-master` | 10s only | Highest quality |
| `kling-v1-6` | std/pro 5s, 10s | Supports Multi-image to Video |
| `kling-v1-5` | std/pro 5s, 10s | Motion Brush + Camera Control |
| `kling-v1` | std/pro 5s, 10s | Camera Control |

---

### Resolution and Frame Rate

| Model | Mode | Resolution | FPS |
|-------|------|-----------|-----|
| kling-v1 (std) | STD | 720p | 30fps |
| kling-v1 (pro) | PRO | 720p | 30fps |
| kling-v1-5 (pro) | PRO | 1080p | 30fps |
| kling-v2-1 (std) | STD | 720p | 24fps |
| kling-v2-1 (pro) | PRO | 1080p | 24fps |
| kling-v2-5 | PRO | 1080p | 24fps |

---

## 2. Text to Video — create video from text

> Reference: [Text to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToVideo)

### What is this topic?

Send a Prompt (description) as text, and the AI generates a video following that Prompt.

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/text2video
```

### Request Header

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body — parameters

| Parameter | Type | Required | Default | Description |
|------------|--------|--------|-----------|---------|
| `model` | string | ✅ | - | The model name, e.g. `kling-v2-6`, `kling-v3` |
| `prompt` | string | ✅ | - | The video description (Prompt) |
| `negative_prompt` | string | ❌ | - | What you **don't want** in the video |
| `cfg_scale` | float | ❌ | 0.5 | How strictly the AI follows the Prompt (0–1, higher = follows the Prompt more) |
| `mode` | string | ❌ | `std` | Quality: `std` (standard) or `pro` (high quality) |
| `duration` | string | ❌ | `5` | Video length: `"5"` or `"10"` (seconds) |
| `aspect_ratio` | string | ❌ | `16:9` | Image ratio: `16:9`, `9:16`, `1:1` |
| `callback_url` | string | ❌ | - | URL to receive results automatically |
| `external_task_id` | string | ❌ | - | A self-defined Task ID |

### Usage example

```python
import requests, time, jwt

def get_token(ak, sk):
    payload = {"iss": ak, "exp": int(time.time()) + 1800, "nbf": int(time.time()) - 5}
    return jwt.encode(payload, sk, algorithm="HS256", headers={"alg": "HS256", "typ": "JWT"})

token = get_token("YOUR_AK", "YOUR_SK")
BASE = "https://api-singapore.klingai.com"

# Create the Task
resp = requests.post(f"{BASE}/v1/videos/text2video",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "model": "kling-v2-6",
        "prompt": "A white cat playing the piano in a cozy jazz bar, golden lighting",
        "negative_prompt": "blurry, low quality",
        "cfg_scale": 0.7,
        "mode": "pro",
        "duration": "5",
        "aspect_ratio": "16:9"
    }
)
task_id = resp.json()["data"]["task_id"]
print(f"Task created: {task_id}")

# Query until done
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

For the `kling-v3` / `kling-v3-omni` models, multi-shot video generation is supported by including a description of each scene in the specified format.

---

## 3. Image to Video — create video from an image

> Reference: [Image to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FimageToVideo)

### What is this topic?

Send an image as the "start point" or "start and end point," and the AI generates natural motion for you.

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/image2video
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `model` | string | ✅ | The model name |
| `image` | string | ✅ | URL or Base64 of the Start Frame image |
| `image_tail` | string | ❌ | URL or Base64 of the End Frame image |
| `prompt` | string | ❌ | A description of the motion |
| `negative_prompt` | string | ❌ | What you don't want |
| `cfg_scale` | float | ❌ | How strictly it follows the Prompt (0–1) |
| `mode` | string | ❌ | `std` or `pro` |
| `duration` | string | ❌ | `"5"` or `"10"` seconds |

### Supported formats

- **Start Frame only** — specify only the starting image; the AI generates the motion itself
- **Start + End Frame** — specify both the start and end points; the AI creates the transition in between (supported in `kling-v1-5`, `kling-v2-1`, `kling-v3`)

### Example

```python
resp = requests.post(f"{BASE}/v1/videos/image2video",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "model": "kling-v2-6",
        "image": "https://example.com/cat.jpg",  # Start Frame
        "prompt": "The cat slowly turns to face the camera and winks cutely",
        "mode": "pro",
        "duration": "5"
    }
)
```

---

## 4. Reference to Video — create video from multiple reference images

> Reference: [Reference to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToVideo)

### What is this topic?

Use multiple images as "references" so the AI keeps the consistency of characters, style, or objects in the video. Good for:
- Keeping a character's face consistent throughout
- Controlling the visual style
- Bringing objects from multiple images into one video

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/multi-image2video
```

### Main parameters

| Parameter | Type | Description |
|------------|--------|---------|
| `model` | string | The model name (supported: `kling-v1-6`, `kling-v3`, `kling-v3-omni`) |
| `image_list` | array | The list of reference images (URL or Base64) |
| `prompt` | string | A description of the motion |
| `mode` | string | `std` or `pro` |
| `duration` | string | The video length |

---

## 5. Motion Control — control the camera motion

> Reference: [Motion Control](https://kling.ai/document-api/apiReference%2Fmodel%2FmotionControl)

### What is this topic?

Control the camera's movement in the video precisely, e.g. zoom in, zoom out, rotate, pan — like being a real camera director.

### Supported models

- `kling-v2-6` (Motion Control)
- `kling-v3` (Motion Control)
- `kling-v1` / `kling-v1-5` (Camera Control)

### Types of camera control

| Type | Detail |
|--------|-----------|
| **Simple** | Choose from standard camera moves like Pan Left/Right, Tilt Up/Down, Zoom In/Out, Roll |
| **Advanced** | Specify camera coordinates as 6DoF (6 Degrees of Freedom) very precisely |
| **Motion Brush** | Draw the direction of motion directly on the image (supported in `kling-v1-5`) |

---

## 6. Multi-elements to Video — video from multiple Elements

> Reference: [Multi-elements to Video](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiElements)

### What is this topic?

Bring "Elements" (characters, objects, backgrounds already created) together into one video, keeping each Element consistent.

### What it's used for

- Create a video with characters from predefined Elements
- Control who or what appears in the video
- Good for advertising, learning materials, or storytelling

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/multi-elements
```

---

## 7. Extend Video — make a video longer

> Reference: [Extend Video](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoExtension)

### What is this topic?

Extend an existing video to be longer, with the AI generating a continuation that looks reasonable and blends with the original.

### What it's used for

- Want a 5-second video extended to 10+ seconds
- Create a long video from several short shots

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/videos/extend
```

### Main parameters

| Parameter | Type | Description |
|------------|--------|---------|
| `video_id` | string | The ID of the source video to extend |
| `prompt` | string | A description of the part to extend (optional) |
| `cfg_scale` | float | How strictly it follows the Prompt |

### Cautions

- `kling-v1` and `kling-v2-master` **don't support** `negative_prompt` and `cfg_scale` in Extend Video
- You must use a `video_id` of a video created with the Kling API only
