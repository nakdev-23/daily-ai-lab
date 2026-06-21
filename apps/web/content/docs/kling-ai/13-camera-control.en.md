---
title: "Camera Control & Cinematography — control the camera professionally"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Learn to control camera motion in Kling AI, from standard camera moves to Advanced 6DoF coordinate control, like being a cinematographer"
readTime: "7 min"
readers: "0"
locked: false
order: 13
---
# 13 · Camera Control & Cinematography — control the camera professionally

> Official Docs reference:
> - [Motion Control](https://kling.ai/document-api/apiReference%2Fmodel%2FmotionControl)
> - [Video Models](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoModels)

---

## 1. Camera Control overview

Kling AI has a three-level camera-control system to choose by your needs:

| Level | Name | Detail | Good for |
|-------|------|-----------|----------|
| 1 | **Simple Camera Control** | Choose from standard camera moves | Beginners |
| 2 | **Advanced Camera Control (6DoF)** | Specify camera coordinates on every axis | Intermediate-advanced |
| 3 | **Motion Brush** | Draw the direction directly on the image | Detailed control |

### Models supporting Camera Control

| Model | Simple | Advanced (6DoF) | Motion Brush |
|-------|--------|-----------------|--------------|
| kling-v1 | ✅ | ❌ | ❌ |
| kling-v1-5 | ✅ | ❌ | ✅ |
| kling-v2-1 | ✅ | ✅ | ❌ |
| kling-v2-6 | ✅ | ✅ | ❌ |
| kling-v3 | ✅ | ✅ | ❌ |

---

## 2. Simple Camera Control — standard camera moves

### Supported camera moves

| Camera move | Parameter value | Description | Used for |
|---------|--------------|---------|---------|
| **Move Left** | `move_left` | The camera moves left | Follow an object moving right |
| **Move Right** | `move_right` | The camera moves right | Follow an object moving left |
| **Move Up** | `move_up` | The camera moves up | Reveal the scene above |
| **Move Down** | `move_down` | The camera moves down | Reveal the scene below |
| **Push In (Zoom In)** | `push_in` | The camera approaches the subject | Emphasize the focus, dramatic effect |
| **Pull Out (Zoom Out)** | `pull_out` | The camera moves back | Reveal a wide scene |
| **Pan Left** | `pan_left` | The camera turns left | Explore the scene horizontally |
| **Pan Right** | `pan_right` | The camera turns right | Explore the scene horizontally |
| **Tilt Up** | `tilt_up` | The camera tilts up | Show grandeur |
| **Tilt Down** | `tilt_down` | The camera tilts down | Look down from a high angle |
| **Roll Clockwise** | `roll_clockwise` | The camera rolls clockwise | Unusual, exciting scenes |
| **Roll Counter-Clockwise** | `roll_counterclockwise` | The camera rolls counter-clockwise | Unusual, exciting scenes |

### API Example — Simple Camera Control

```python
import requests, jwt, time

def get_token(ak, sk):
    now = int(time.time())
    return jwt.encode({"iss": ak, "exp": now+1800, "nbf": now-5}, sk, algorithm="HS256")

BASE = "https://api-singapore.klingai.com"
token = get_token("YOUR_AK", "YOUR_SK")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Example: the camera zooms into the Eiffel Tower
resp = requests.post(f"{BASE}/v1/videos/image2video",
    headers=headers,
    json={
        "model": "kling-v2-6",
        "image": "https://example.com/eiffel_tower.jpg",
        "prompt": "The camera slowly zooms into the Eiffel Tower at golden sunset",
        "mode": "pro",
        "duration": "5",
        "camera_control": {
            "type": "simple",
            "config": {
                "horizontal": 0,      # -10 to 10 (negative = left, positive = right)
                "vertical": 0,        # -10 to 10
                "zoom": 8,            # -10 to 10 (negative = out, positive = in)
                "tilt": 0,            # -10 to 10
                "roll": 0,            # -10 to 10
                "pan": 0              # -10 to 10
            }
        }
    }
)
task_id = resp.json()["data"]["task_id"]
print(f"Task: {task_id}")
```

---

## 3. Advanced Camera Control — 6DoF

**6DoF (Six Degrees of Freedom)** is specifying the camera's position and orientation precisely on every axis, giving a much more accurate result than Simple.

### The 6 axes of 6DoF

**3 translation axes (moving position):**
| Axis | Parameter name | Direction |
|-----|----------------|--------|
| X | `horizontal` | Left (-) / Right (+) |
| Y | `vertical` | Down (-) / Up (+) |
| Z | `zoom` | Out (-) / In (+) |

**3 rotation axes:**
| Axis | Parameter name | Direction |
|-----|----------------|--------|
| X | `tilt` | Tilt down (-) / Tilt up (+) |
| Y | `pan` | Left (-) / Right (+) |
| Z | `roll` | Counter-clockwise (-) / Clockwise (+) |

### Parameter values

- Full value range: **-10 to 10**
- Value **0** = no movement on that axis
- The higher the value, the faster and greater the movement

### Various Shot examples with 6DoF

```python
# ====================================
# 1. DOLLY IN — the camera walks toward the subject
# (Deep zoom + slightly tilt up)
# ====================================
camera_dolly_in = {
    "type": "advanced",
    "config": {
        "horizontal": 0,
        "vertical": 0,
        "zoom": 8,      # in
        "tilt": 2,      # tilt up a bit
        "roll": 0,
        "pan": 0
    }
}

# ====================================
# 2. CRANE SHOT — the camera floats up
# (Move up + tilt down)
# ====================================
camera_crane = {
    "type": "advanced",
    "config": {
        "horizontal": 0,
        "vertical": 8,   # up
        "zoom": 0,
        "tilt": -3,      # tilt down slightly
        "roll": 0,
        "pan": 0
    }
}

# ====================================
# 3. ARC SHOT — the camera circles the subject
# (Move right + pan left)
# ====================================
camera_arc = {
    "type": "advanced",
    "config": {
        "horizontal": 5,  # move right
        "vertical": 0,
        "zoom": 0,
        "tilt": 0,
        "roll": 0,
        "pan": -5         # turn left to keep the subject centered
    }
}

# ====================================
# 4. DUTCH ANGLE — a tilted angle creating tension
# ====================================
camera_dutch = {
    "type": "advanced",
    "config": {
        "horizontal": 0,
        "vertical": 0,
        "zoom": 2,        # zoom in a bit
        "tilt": 0,
        "roll": 5,        # roll clockwise
        "pan": 0
    }
}

# ====================================
# 5. ESTABLISHING SHOT — reveal a wide scene
# ====================================
camera_establishing = {
    "type": "advanced",
    "config": {
        "horizontal": 3,   # move right
        "vertical": 2,     # up a bit
        "zoom": -5,        # pull back
        "tilt": -2,        # tilt down to see the scene
        "roll": 0,
        "pan": -2          # turn left
    }
}
```

---

## 4. Motion Brush — draw the direction of motion

Motion Brush is supported only on `kling-v1-5` and usable with Image-to-Video only.

### How it works

1. Define **multiple Zones** on the image
2. Each zone defines the **direction of motion** of the pixels in that area
3. The AI generates motion as drawn

### Parameter structure

```json
{
  "model": "kling-v1-5",
  "image": "https://example.com/scene.jpg",
  "prompt": "A description of the motion",
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

| Parameter | Type | Description |
|------------|--------|---------|
| `static_mask` | Base64 (an image-data encoding format) | A white Mask = the area you **don't want to move** |
| `dynamic_masks` | Array | A list of Mask + Trajectory for each area you want to move |
| `mask` | Base64 | A white Mask defining the area to control |
| `trajectories` | Array | The (x, y) coordinate points of the motion path (at least 2 points) |

---

## 5. Cinematography techniques with Kling AI

### 5.1 Classic Shots for advertising

```python
# PRODUCT REVEAL — show the product impressively
product_reveal = {
    "model": "kling-v2-6",
    "image": "https://example.com/product.jpg",
    "prompt": "The product slowly rotates on a table, white studio light, a full 360-degree turn",
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

### 5.2 Cinematic Openings for films

```python
# AERIAL TO GROUND — the camera descends from the sky
aerial_to_ground = {
    "prompt": "The camera descends from the sky toward a dense forest, through thin clouds until the trees are clearly visible",
    "camera_control": {
        "type": "advanced",
        "config": {
            "horizontal": 0,
            "vertical": -8,   # down
            "zoom": 6,        # toward
            "tilt": 3,        # tilt up a bit while descending
            "roll": 0,
            "pan": 0
        }
    }
}
```

### 5.3 Recommendations by Genre

| Genre | Suitable camera moves | Recommended zoom |
|--------|----------------|----------------|
| **Product advertising** | Push In, Arc, Zoom In | +5 to +8 |
| **Drama film** | Slow Push In, Crane Up | +2 to +4 |
| **Action/Thriller** | Dutch Angle, Quick Pan | Roll ±5 |
| **Documentary** | Pan, Tilt, Steady Push | ±3 |
| **Music/MV** | Dynamic Arc, Roll | Varied |
| **Real estate** | Crane, Dolly, Pan | -3 to +5 |
| **Food/Lifestyle** | Push In, Tilt Down | +4 to +7 |

---

## 6. Prompt Engineering for Camera Movement

Specifying the camera motion in the Prompt helps improve the result:

### Vocabulary used in the Prompt

```
# Movement
- "camera slowly pushes in"
- "camera pulls back to reveal"
- "camera pans from left to right"
- "bird's eye view descending"
- "handheld camera movement"
- "smooth tracking shot"
- "360-degree orbit around subject"
```

### A full Prompt example

```python
# Cinematic Drone Shot
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

## 7. Quick reference table summary

### Camera Control values for Shot Types

| Shot Type | horizontal | vertical | zoom | tilt | pan | roll |
|-----------|-----------|---------|------|------|-----|------|
| Static | 0 | 0 | 0 | 0 | 0 | 0 |
| Zoom In | 0 | 0 | +7 | 0 | 0 | 0 |
| Zoom Out | 0 | 0 | -7 | 0 | 0 | 0 |
| Pan Right | 0 | 0 | 0 | 0 | +6 | 0 |
| Pan Left | 0 | 0 | 0 | 0 | -6 | 0 |
| Tilt Up | 0 | 0 | 0 | +6 | 0 | 0 |
| Crane Up | 0 | +7 | 0 | -3 | 0 | 0 |
| Dolly In | 0 | 0 | +5 | +2 | 0 | 0 |
| Arc Right | +5 | 0 | 0 | 0 | -5 | 0 |
| Dutch Angle | 0 | 0 | +2 | 0 | 0 | +5 |

> **Tip:** Combine 2–3 axes at once for more natural and interesting movement than using a single axis.
