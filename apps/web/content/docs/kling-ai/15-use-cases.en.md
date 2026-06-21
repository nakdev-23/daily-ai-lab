---
title: "Use Cases — real-world usage examples"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Examples of using Kling AI in real life across many industries, from advertising, fashion, and E-Commerce to film, education, and Social Media work"
readTime: "8 min"
readers: "0"
locked: false
order: 15
---
# 15 · Use Cases — real-world usage examples

---

## 1. E-Commerce & Retail — selling online

### 1.1 Create product images (Product Photography)

Instead of hiring expensive product photography, use Kling AI to create Lifestyle images (images of the product in everyday use) of the product.

```python
import requests, jwt, time

def get_token(ak, sk):
    now = int(time.time())
    return jwt.encode({"iss": ak, "exp": now+1800, "nbf": now-5}, sk, algorithm="HS256")

BASE = "https://api-singapore.klingai.com"
headers = {"Authorization": f"Bearer {get_token('AK', 'SK')}", "Content-Type": "application/json"}

# Create Lifestyle product images
product_images = [
    {
        "scene": "in a flower garden",
        "prompt": "luxury skincare cream jar placed on a marble surface surrounded by fresh flowers, soft natural lighting, professional product photography, shallow depth of field"
    },
    {
        "scene": "in a loft apartment",
        "prompt": "luxury skincare cream jar on modern minimalist table, loft apartment background, warm ambient lighting, bokeh (blurred background effect), lifestyle product photo"
    },
]

for scene in product_images:
    resp = requests.post(f"{BASE}/v1/images/generations",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": scene["prompt"],
            "negative_prompt": "text, watermark, bad quality, distortion",
            "aspect_ratio": "1:1",
            "n": 4
        }
    )
    task_id = resp.json()["data"]["task_id"]
    print(f"Scene '{scene['scene']}': {task_id}")
```

### 1.2 Virtual Try-On for fashion

Let customers see themselves wearing a shirt before buying.

```python
def batch_virtual_try_on(person_image: str, clothing_images: list) -> list:
    """Show several outfits on the same person"""
    results = []
    for cloth_url in clothing_images:
        resp = requests.post(f"{BASE}/v1/images/virtual-try-on",
            headers=headers,
            json={
                "human_image": person_image,
                "cloth_image": cloth_url,
                "mode": "pro"
            }
        )
        results.append(resp.json()["data"]["task_id"])
    return results

# Usage example
clothing_catalog = [
    "https://shop.com/shirt_red.jpg",
    "https://shop.com/shirt_blue.jpg",
    "https://shop.com/dress_white.jpg",
]

task_ids = batch_virtual_try_on(
    person_image="https://shop.com/model_photo.jpg",
    clothing_images=clothing_catalog
)
```

### 1.3 Product ad videos

```python
# Create a 5-second video showcasing the product
ad_video = requests.post(f"{BASE}/v1/videos/image2video",
    headers=headers,
    json={
        "model": "kling-v3",
        "image": "https://shop.com/product_hero.jpg",
        "prompt": (
            "The camera slowly rotates around the product, soft white studio light, "
            "the product floating on a white background, looking luxurious"
        ),
        "mode": "pro",
        "duration": "5",
        "camera_control": {
            "type": "advanced",
            "config": {"horizontal": 0, "vertical": 0, "zoom": 3, "tilt": 0, "pan": 5, "roll": 0}
        }
    }
)
```

---

## 2. Marketing & Advertising

### 2.1 TV Commercial-level ad videos

```python
# Create a 10-second ad
tv_commercial = {
    "model": "kling-v3",
    "prompt": (
        "Cinematic TV commercial for luxury car brand. "
        "Sleek black sports car driving through misty mountain road at dawn, "
        "dramatic lighting, rain on windshield, epic cinematic music implied, "
        "slow motion droplets, professional color grade, 4K"
    ),
    "negative_prompt": "low quality, amateur, text, watermark",
    "mode": "pro",
    "duration": "10",
    "aspect_ratio": "16:9",
    "cfg_scale": 0.8,
    "camera_control": {
        "type": "advanced",
        "config": {"horizontal": 2, "vertical": 0, "zoom": 4, "tilt": 1, "pan": -2, "roll": 0}
    }
}

resp = requests.post(f"{BASE}/v1/videos/text2video", headers=headers, json=tv_commercial)
task_id = resp.json()["data"]["task_id"]
```

### 2.2 Social Media Content — create lots of content

```python
# Create Social Media images in several sizes at once
social_prompts = [
    {"ratio": "1:1",  "platform": "Instagram Feed"},
    {"ratio": "9:16", "platform": "Instagram Story / TikTok"},
    {"ratio": "16:9", "platform": "Facebook / YouTube Thumbnail"},
]

base_prompt = (
    "Thai street food market at night, colorful lights, "
    "various delicious dishes, warm atmosphere, vibrant"
)

tasks = []
for item in social_prompts:
    resp = requests.post(f"{BASE}/v1/images/generations",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": base_prompt,
            "aspect_ratio": item["ratio"],
            "n": 3  # create 3 options per size
        }
    )
    task_id = resp.json()["data"]["task_id"]
    tasks.append({"platform": item["platform"], "task_id": task_id})
    print(f"Created for {item['platform']}: {task_id}")
```

### 2.3 An Avatar Virtual Spokesperson

```python
# Create a spokesperson who presents a product
spokesperson = {
    "avatar_image": "https://brand.com/spokesperson.jpg",
    "tts_text": (
        "Hello, today we'd like to introduce our newest product, "
        "a special skincare cream developed from Korean innovation. "
        "Try it and your skin will become smoother within 7 days"
    ),
    "tts_voice": "female_professional",  # TTS — Text-to-Speech
    "mode": "pro"
}

resp = requests.post(f"{BASE}/v1/videos/avatar", headers=headers, json=spokesperson)
task_id = resp.json()["data"]["task_id"]
```

---

## 3. Film & Video Production

### 3.1 Storyboard from a Script

```python
# Create a Storyboard from a film Script
script_scenes = [
    "Opening scene: cut to Bangkok at night, skyscraper lights glowing, viewed from above",
    "Scene 2: the male protagonist steps out of an elevator in a modern office building, a tense face",
    "Scene 3: Close-up of the protagonist's hand entering the code to open a secret room",
    "Scene 4: inside, a table covered with secret data, images of people being tracked",
]

storyboard_tasks = []
for i, scene in enumerate(script_scenes):
    resp = requests.post(f"{BASE}/v1/images/generations",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": f"Storyboard frame, cinematic composition, noir thriller style. {scene}",
            "negative_prompt": "color, bright, cheerful",
            "aspect_ratio": "16:9",
            "n": 1
        }
    )
    task_id = resp.json()["data"]["task_id"]
    storyboard_tasks.append({"scene": i+1, "task_id": task_id})
```

### 3.2 Pre-visualization (Previs) for CGI scenes

```python
# Create Reference images for the VFX (Visual Effects) team
vfx_reference = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "Epic battle scene in ancient Thai kingdom, "
            "hundreds of warriors in traditional armor, "
            "explosions and magical energy, dramatic camera angle from low angle, "
            "cinematic lighting, concept art for VFX reference"
        ),
        "aspect_ratio": "16:9",
        "n": 4
    }
)
```

### 3.3 Create backgrounds (Virtual Background)

```python
# Create backgrounds for a Green Screen Studio
backgrounds = [
    "Modern Bangkok skyline at sunset, golden hour, ultra detailed",
    "Traditional Thai temple with lotus pond, misty morning",
    "Futuristic space station interior, sci-fi, blue lighting",
    "Tropical beach with crystal clear water, paradise",
]

for bg in backgrounds:
    resp = requests.post(f"{BASE}/v1/images/generations",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": f"{bg}, no people, clean background, ultra high resolution",
            "negative_prompt": "people, person, human, text, watermark",
            "aspect_ratio": "16:9",
            "n": 2
        }
    )
```

---

## 4. Education & Training

### 4.1 Create videos for lessons

```python
# Videos explaining scientific concepts
science_videos = [
    {
        "topic": "The Earth's rotation",
        "prompt": (
            "Planet Earth rotating slowly in space, stars in background, "
            "sunlight illuminating one side, North pole visible, "
            "educational 3D animation style, clean and clear"
        )
    },
    {
        "topic": "The water cycle",
        "prompt": (
            "Water cycle animation: evaporation from ocean, cloud formation, "
            "rain falling on mountains, rivers flowing back to sea, "
            "educational diagram style, labeled, colorful"
        )
    }
]

for video in science_videos:
    resp = requests.post(f"{BASE}/v1/videos/text2video",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": video["prompt"],
            "mode": "std",
            "duration": "5",
            "aspect_ratio": "16:9"
        }
    )
    print(f"Topic '{video['topic']}': {resp.json()['data']['task_id']}")
```

### 4.2 Textbook illustrations

```python
# Create illustrations for a history textbook
history_illustrations = [
    "Ancient Ayutthaya kingdom, Thai warriors in traditional battle armor, historical painting style",
    "King Naresuan the Great on elephant, epic battle scene, Thai history illustration",
    "Rattanakosin era Bangkok, Grand Palace under construction, historical artwork",
]

for illus in history_illustrations:
    resp = requests.post(f"{BASE}/v1/images/generations",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": f"{illus}, detailed historical illustration, educational style",
            "aspect_ratio": "4:3",
            "n": 3
        }
    )
```

---

## 5. Real Estate

### 5.1 Virtual Staging — virtually decorate a room

Virtual Staging (virtually furnishing a room — placing digital furniture in an empty-room image):

```python
# Transform an empty room to look furnished
staging = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "Modern living room interior design, Scandinavian style, "
            "white walls, oak wood floor, comfortable sofa, plants, "
            "natural light from large windows, interior design magazine quality"
        ),
        "image": "https://realestate.com/empty_room.jpg",
        "image_fidelity": 0.7,  # keep the room structure
        "aspect_ratio": "16:9",
        "n": 4
    }
)
```

### 5.2 Drone Tour Video

```python
# Create a house tour video
property_tour = requests.post(f"{BASE}/v1/videos/image2video",
    headers=headers,
    json={
        "model": "kling-v3",
        "image": "https://realestate.com/house_exterior.jpg",
        "prompt": (
            "A drone camera flying toward the house from the front, through a beautiful garden, "
            "coming in to see the front-door details, bright afternoon light"
        ),
        "mode": "pro",
        "duration": "5",
        "camera_control": {
            "type": "advanced",
            "config": {"horizontal": 0, "vertical": -3, "zoom": 6, "tilt": -2, "pan": 0, "roll": 0}
        }
    }
)
```

---

## 6. Healthcare & Wellness

```python
# Create wellness illustrations (no risky medical content)
wellness_content = [
    "Person meditating in peaceful garden, morning sun, calm atmosphere, wellness lifestyle",
    "Healthy colorful salad bowl top view, fresh vegetables, professional food photography",
    "Woman doing yoga on beach at sunrise, peaceful, motivational, lifestyle photo",
    "Family exercising together in park, happy, active lifestyle, natural lighting",
]

for content in wellness_content:
    resp = requests.post(f"{BASE}/v1/images/generations",
        headers=headers,
        json={
            "model": "kling-v3",
            "prompt": content,
            "negative_prompt": "medical equipment, hospital, injury, blood",
            "aspect_ratio": "16:9",
            "n": 2
        }
    )
```

---

## 7. Architecture & Interior Design

```python
# Architectural Visualization
arch_viz = requests.post(f"{BASE}/v1/images/generations",
    headers=headers,
    json={
        "model": "kling-v3",
        "prompt": (
            "Architectural visualization of modern Thai resort villa, "
            "tropical garden, infinity pool overlooking ocean, "
            "sustainable design with natural materials, golden hour, "
            "professional architectural rendering, photorealistic"
        ),
        "negative_prompt": "cartoon, sketch, low quality",
        "aspect_ratio": "16:9",
        "n": 4
    }
)
```

---

## 8. Use Cases summary table

| Industry | Features used | Results obtained |
|-----------|--------------|-------------|
| **E-Commerce** | Image Gen, Virtual Try-On, Image-to-Video | Product images, Virtual try-on, ad videos |
| **Marketing** | Text-to-Video, Avatar (AI spokesperson), Image Gen | TV ads, virtual spokesperson, Social content |
| **Film** | Image Gen, Text-to-Video, Multi-Shot | Storyboard, Previs, VFX Reference |
| **Education** | Text-to-Video, Image Gen | Accompanying videos, illustrations |
| **Real estate** | Image-to-Image, Image-to-Video | Virtual Staging, Drone Tour |
| **Healthcare** | Image Gen | Wellness illustrations |
| **Architecture** | Image Gen, Image-to-Video | Architectural Viz, Walkthrough (walk-through videos) |

---

## 9. Production tips

### Reduce cost

```python
# 1. Use mode="std" for Drafts, mode="pro" for the Final
# 2. Create several options (n=4) then pick the best, cheaper than creating one at a time
# 3. Use Image-to-Video instead of Text-to-Video when you have a base image (more control)
# 4. Cache (temporarily reuse) good results, don't recreate them

DRAFT_CONFIG = {"mode": "std", "model": "kling-v2-1"}
FINAL_CONFIG = {"mode": "pro", "model": "kling-v3"}
```

### Improve quality

```python
# A Prompt Template for high-quality Commercial work
COMMERCIAL_TEMPLATE = """
{main_subject}, {action_or_state},
{environment_details}, 
{lighting}: {lighting_details},
{style}: professional commercial photography, 
award winning, magazine quality, 8K ultra detailed,
no text, no watermark, no people (unless specified)
"""

prompt = COMMERCIAL_TEMPLATE.format(
    main_subject="luxury watch",
    action_or_state="placed on black marble surface",
    environment_details="dark minimalist background, water droplets",
    lighting="dramatic studio lighting",
    lighting_details="single key light, rim light",
    style="product photography"
)
```
