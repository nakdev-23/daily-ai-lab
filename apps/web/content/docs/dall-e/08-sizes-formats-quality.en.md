---
title: "Sizes, formats, and quality — Size, Format, Quality"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "A complete guide to the supported image sizes, output file formats, and the standard vs hd quality settings for each model"
readTime: "6 min"
readers: "0"
locked: false
order: 8
---
# Sizes, formats, and quality — Size, Format, Quality

> Primary reference: [OpenAI Images API Reference](https://platform.openai.com/docs/api-reference/images)

---

## Overview

When using the DALL·E API, you can control the image's output through 3 key options:

1. **Size** (the image's width × height in pixels)
2. **Response Format** (how the API returns the image)
3. **Quality** (the level of detail and sharpness, DALL·E 3 only)

---

## Size

### DALL·E 3 — supported sizes

| Size | Orientation | What kind of work to use it for |
|---|---|---|
| `1024x1024` | Square | Social posts, profile, logo, thumbnail |
| `1792x1024` | Landscape (wider than tall) | Wallpaper, web banner, wide scene |
| `1024x1792` | Portrait (taller than wide) | Instagram Story, poster, mobile content |

### DALL·E 2 — supported sizes

| Size | Total pixels | What kind of work to use it for |
|---|---|---|
| `256x256` | 65,536 px | Icons, small thumbnails, testing prompts |
| `512x512` | 262,144 px | Medium images, testing, saving cost |
| `1024x1024` | 1,048,576 px | High-quality images, final work |

### Image size comparison

```
DALL·E 3:                          DALL·E 2:
┌─────────┐  ┌──────────────────┐  ┌──┐ ┌────┐ ┌────────┐
│         │  │                  │  │  │ │    │ │        │
│1024x1024│  │   1792x1024      │  │  │ │    │ │        │
│         │  │                  │  └──┘ └────┘ │        │
└─────────┘  └──────────────────┘  256  512    │        │
                                               └────────┘
  1024                                           1024
  x1792
```

---

## Quality

**Quality** (the level of effort in generating the image's detail) is supported only on **DALL·E 3**.

### `standard` — standard quality

- Normal, fast image generation
- Good for testing prompts and work that doesn't need maximum detail
- Cheaper than `hd`

### `hd` — high quality (High Definition)

- A more detailed generation process
- Better detail and consistency
- Sharper edges, clearer small details
- About 2x more expensive than `standard`
- Good for final work or work needing maximum quality

### When to use `hd`

Use `hd` when:
- The image will be printed or shown large
- Work with architectural details, jewelry, or complex textures
- A final image to be used in production (real use — the system real users see)
- A portrait needing high facial detail

Use `standard` when:
- Testing prompts to find the look you want first
- Creating many images, e.g. batch processing (creating many images at once)
- An image used temporarily

```python
# Test with standard first
test_response = client.images.generate(
    model="dall-e-3",
    prompt="A detailed architectural blueprint of a modern house",
    size="1024x1024",
    quality="standard",  # test first
)

# Once you're happy with the prompt, regenerate with hd
final_response = client.images.generate(
    model="dall-e-3",
    prompt="A detailed architectural blueprint of a modern house",
    size="1024x1024",
    quality="hd",  # for final work
)
```

---

## Style — DALL·E 3 only

**Style** (the image style — e.g. vivid for bright colors, natural for a realistic look) controls the image's overall look:

### `vivid` — bright colors (default)

- Bright, sharp color
- Dramatic, lively
- Good for illustration, fantasy art, ads
- Images often look a bit "exaggerated"

### `natural` — natural colors

- Realistic, not bright
- Looks more like a real photo
- Good for photorealistic, documentary, portraits
- Images look more natural and plainer

```python
# vivid — good for fantasy and illustration
vivid_response = client.images.generate(
    model="dall-e-3",
    prompt="A mystical forest with glowing mushrooms",
    size="1024x1024",
    style="vivid",
)

# natural — good for realistic images
natural_response = client.images.generate(
    model="dall-e-3",
    prompt="A quiet morning at a Thai rice paddy",
    size="1024x1024",
    style="natural",
)
```

---

## Response Format

**Response Format** (the format of the data the API returns — choose to receive a URL or the image data directly) controls how the API returns the image:

### `url` — a temporary URL (default)

```json
{
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/..."
    }
  ]
}
```

- You get an HTTPS URL to download the image
- The URL **expires after 1 hour**
- Good for showing the image on the web or app immediately
- You must download the file separately if you want to keep it

### `b64_json` — Base64 JSON

```json
{
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

- You get the image data as a Base64 string (image data encoded as text — convertible back into a file)
- Never expires
- Good for saving a file immediately without a URL
- The response size is much larger than `url`

```python
import base64

# Receive as base64 and save the file immediately
response = client.images.generate(
    model="dall-e-3",
    prompt="A beautiful Thai temple",
    size="1024x1024",
    response_format="b64_json",
)

# Convert Base64 back into a file
image_data = base64.b64decode(response.data[0].b64_json)
with open("temple.png", "wb") as f:
    f.write(image_data)
print("Saved successfully!")
```

---

## Summary table of all options

### DALL·E 3

| Parameter | Supported values | Default |
|---|---|---|
| `size` | `1024x1024`, `1792x1024`, `1024x1792` | `1024x1024` |
| `quality` | `standard`, `hd` | `standard` |
| `style` | `vivid`, `natural` | `vivid` |
| `response_format` | `url`, `b64_json` | `url` |
| `n` | `1` only | `1` |

### DALL·E 2

| Parameter | Supported values | Default |
|---|---|---|
| `size` | `256x256`, `512x512`, `1024x1024` | `1024x1024` |
| `quality` | Not supported | — |
| `style` | Not supported | — |
| `response_format` | `url`, `b64_json` | `url` |
| `n` | `1`–`10` | `1` |

---

## Advice on choosing a Size

### For social media

| Platform | Recommended size |
|---|---|
| Instagram Post | `1024x1024` (square) |
| Instagram Story | `1024x1792` (portrait) |
| Facebook Cover | `1792x1024` (landscape) |
| Twitter Header | `1792x1024` (landscape) |
| LinkedIn Post | `1024x1024` (square) |

### For websites

| Use | Recommended size |
|---|---|
| Hero Banner (the main web banner) | `1792x1024` (landscape) |
| Blog Thumbnail | `1024x1024` (square) |
| Mobile Content | `1024x1792` (portrait) |
| Icon / Logo | `1024x1024` → shrink later |

---

## Summary

Choosing the right size, quality, style, and response format helps you get the image you want at good value. The simple formula: test prompts with `standard` + `1024x1024` first; once you're happy, create the final work with `hd` + the size suited to the use.
