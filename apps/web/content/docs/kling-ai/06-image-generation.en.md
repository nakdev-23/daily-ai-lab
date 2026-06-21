---
title: "Image Generation — creating and editing images"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "- 1K (1024x1024 or proportional)"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---
# 06 · Image Generation — creating and editing images

> Official Docs reference:
> - [Image Models](https://kling.ai/document-api/apiReference%2Fmodel%2FimageModels)
> - [Image Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniImage)
> - [Image Generation](https://kling.ai/document-api/apiReference%2Fmodel%2FimageGeneration)
> - [Reference to Image](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToImage)
> - [Extend Image](https://kling.ai/document-api/apiReference%2Fmodel%2FimageExpansion)
> - [AI Multi-Shot](https://kling.ai/document-api/apiReference%2Fmodel%2FaiMultiShot)
> - [Virtual Try-On](https://kling.ai/document-api/apiReference%2Fmodel%2FvirtualTryOn)
> - [Image Recognize](https://kling.ai/document-api/apiReference%2Fmodel%2FimageRecognize)
> - [Element](https://kling.ai/document-api/apiReference%2Fmodel%2Felement)

---

## 1. Image Models — all image models

> Reference: [Image Models](https://kling.ai/document-api/apiReference%2Fmodel%2FimageModels)

### Main image models

| Model | Main features |
|-------|-----------|
| `kling-v3` | Text-to-Image, Image-to-Image, 4K Native, Multi-shot Series |
| `kling-v3-omni` | Multimodal, supports up to 10 Reference Images |
| `kling-v2-1` | Text-to-Image, Image-to-Image |
| `kling-v1-5` | General Image Generation |
| `kling-v1` | Basic Image Generation |

### Supported resolutions

- 1K (1024x1024 or proportional)
- 2K
- **4K Native** (only kling-v3 and newer)

### Aspect Ratios

`1:1`, `3:4`, `4:3`, `16:9`, `9:16`

---

## 2. Image Generation — create images from text

> Reference: [Image Generation](https://kling.ai/document-api/apiReference%2Fmodel%2FimageGeneration)

### What is this topic?

Send a Prompt as text, and the AI creates an image per that description. Supports generating several images at once.

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/generations
```

### Main parameters

| Parameter | Type | Required | Default | Description |
|------------|--------|--------|-----------|---------|
| `model` | string | ✅ | - | The model name, e.g. `kling-v3` |
| `prompt` | string | ✅ | - | The image description |
| `negative_prompt` | string | ❌ | - | What you don't want in the image |
| `image_reference` | string | ❌ | - | The URL of a style reference image |
| `image_fidelity` | float | ❌ | 0.5 | How close to the reference image (0–1) |
| `aspect_ratio` | string | ❌ | `1:1` | The image ratio |
| `n` | int | ❌ | 1 | The number of images you want (1–9) |
| `callback_url` | string | ❌ | - | URL to receive the result |

### Example

```python
resp = requests.post(f"{BASE}/v1/images/generations",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "model": "kling-v3",
        "prompt": "A photorealistic photo of a pink lotus blooming in a pond, morning light, dewdrops on the petals",
        "negative_prompt": "cartoon, painting, low quality",
        "aspect_ratio": "1:1",
        "n": 4
    }
)
```

> ⚠️ **Watch the Concurrency**: if `n=9`, the system counts it as 9 Concurrency at once.

---

## 3. Image Omni — Multimodal Image Creation

> Reference: [Image Omni](https://kling.ai/document-api/apiReference%2Fmodel%2FOmniImage)

### What is this topic?

Image Omni uses the `kling-v3-omni` model, which supports accepting multiple Input types at once — text, multiple images, and Reference Images.

### Special capabilities

- Accepts up to **10 Reference Images**
- Create 4K Native images
- Create images as a Series (continuous, with consistent style)
- Supports editing images with a description (Image Editing)

### Example

```json
{
  "model": "kling-v3-omni",
  "prompt": "Blend the styles of these three images together, creating an image in one unified style",
  "reference_images": [
    "https://example.com/style1.jpg",
    "https://example.com/style2.jpg",
    "https://example.com/style3.jpg"
  ],
  "aspect_ratio": "16:9"
}
```

---

## 4. Reference to Image — create images from multiple reference images

> Reference: [Reference to Image](https://kling.ai/document-api/apiReference%2Fmodel%2FmultiImageToImage)

### What is this topic?

Use multiple images as References, and the AI creates a new image that keeps the consistency of characters, style, or elements from the reference images.

### What it's used for

- Create images of a character in different poses or scenes while keeping the same face
- Blend elements from multiple images
- Create consistent image Variants

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/multi-reference
```

---

## 5. Extend Image — expand the image area (Outpainting)

> Reference: [Extend Image](https://kling.ai/document-api/apiReference%2Fmodel%2FimageExpansion)

### What is this topic?

Expand the image area beyond its original edges; the AI generates content that blends with the original image. Good for changing the image ratio or making the image wider.

### What it's used for

- Convert a Portrait image (9:16) to Landscape (16:9)
- Widen the background
- Add empty space around the main subject

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/expand
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `image` | string | ✅ | URL or Base64 of the source image |
| `prompt` | string | ❌ | A description of the part to expand |
| `aspect_ratio` | string | ✅ | The target ratio, e.g. `16:9` |

---

## 6. AI Multi-Shot — create a continuous image Series

> Reference: [AI Multi-Shot](https://kling.ai/document-api/apiReference%2Fmodel%2FaiMultiShot)

### What is this topic?

Create multiple images that are continuous in narrative or style, good for a Story Board, Comic, or Photo Series.

### What it's used for

- Create a Storyboard for a video or ad
- Create a Comic Strip or Manga
- Create a Photo Series with the same character in multiple scenes

### Main parameters

| Parameter | Type | Description |
|------------|--------|---------|
| `result_type` | string | `single` (a single image) or `series` (a set of images) |
| `n` | int | The number of images (1-9 for single; 2-9 for series) |
| `shots` | array | A description of each image in the series |

---

## 7. Virtual Try-On

> Reference: [Virtual Try-On](https://kling.ai/document-api/apiReference%2Fmodel%2FvirtualTryOn)

### What is this topic?

Virtual Try-On is a feature where the AI puts clothing or apparel onto a person in an image — just give a photo of the person and a photo of the clothing, and the AI makes it look like that person is really wearing it.

### What it's used for

- Showcase clothing products without photographing every Look
- Let customers virtually try on clothes before buying
- Create a low-cost fashion product Catalog

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/virtual-try-on
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `human_image` | string | ✅ | URL or Base64 of the person photo (body clearly visible) |
| `cloth_image` | string | ✅ | URL or Base64 of the clothing photo |
| `mode` | string | ❌ | `std` or `pro` |

### Cautions

- The person photo should clearly show the upper body or the part to be dressed
- Virtual Try-On has a separate Resource Package from Video and Image

### Example

```python
resp = requests.post(f"{BASE}/v1/images/virtual-try-on",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "human_image": "https://example.com/person.jpg",
        "cloth_image": "https://example.com/shirt.jpg",
        "mode": "pro"
    }
)
```

---

## 8. Image Recognize — analyze an image

> Reference: [Image Recognize](https://kling.ai/document-api/apiReference%2Fmodel%2FimageRecognize)

### What is this topic?

The AI analyzes an image and describes what it sees — like a Reverse Prompt, helping you know what's in the image.

### What it's used for

- Auto-create a Prompt from an image
- Analyze an image's content before using it
- Pull a Description from an image to use for creating a video next

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/images/recognize
```

---

## 9. Element — manage Elements/characters

> Reference: [Element](https://kling.ai/document-api/apiReference%2Fmodel%2Felement)

### What is this topic?

An Element is creating and storing a custom "character" or "object" in the Kling Library to reuse repeatedly in image and video creation — keeping the consistency of a face, style, or object throughout your creations.

### Element types

| Type | Detail |
|--------|-----------|
| **Character Element** | A person character that keeps a consistent face and style |
| **Object Element** | An object you want to reuse |
| **Multi-image Element** | An Element created from multiple reference images |

### How to use it

**Step 1: Create an Element**

```
POST https://api-singapore.klingai.com/v1/elements
```

| Parameter | Type | Description |
|------------|--------|---------|
| `element_name` | string | The Element name |
| `element_type` | string | `character` or `object` |
| `reference_images` | array | 1–10 reference images |
| `description` | string | A description of the Element |

**Step 2: Use the Element when creating video/images**

Specify `element_id` in the Request of Text to Video or Image Generation.

### Key notes

- A created Element is stored for **30 days** from creation
- Use Elements with `kling-v3`, `kling-v3-omni`, `kling-v1-6` and up
- Supports up to **multiple Elements** in the same job
