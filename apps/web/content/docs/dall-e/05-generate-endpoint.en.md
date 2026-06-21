---
title: "Generate Endpoint — create images from text"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "Learn to use POST /images/generations, every supported parameter, with code examples and real results"
readTime: "8 min"
readers: "0"
locked: false
order: 5
---
# Generate Endpoint — create images from text

> Primary reference: [OpenAI API Reference — Create image](https://platform.openai.com/docs/api-reference/images/create)

---

## What is the Generate Endpoint

The **Generate Endpoint** (the API endpoint for creating images — takes a prompt and creates a new image from scratch) is the main API for creating images from a description.

**Endpoint:**
```
POST https://api.openai.com/v1/images/generations
```

---

## All parameters (the variables that define the request's details)

### Main parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prompt` | string | ✅ Required | The description of the image to create |
| `model` | string | ❌ Optional | The model to use (`dall-e-2` or `dall-e-3`) |
| `n` | integer | ❌ Optional | The number of images you want (default: 1) |
| `size` | string | ❌ Optional | The image size (default: 1024×1024) |
| `quality` | string | ❌ Optional | The image quality (DALL·E 3 only) |
| `style` | string | ❌ Optional | The image style (DALL·E 3 only) |
| `response_format` | string | ❌ Optional | The result format (`url` or `b64_json`) |
| `user` | string | ❌ Optional | A user ID for tracking |

---

## The `prompt` parameter (the command to make an image)

The prompt (the command to make an image — describing the desired image in English or Thai) is the heart of image creation.

- **DALL·E 2:** prompt length up to 1,000 characters
- **DALL·E 3:** prompt length up to 4,000 characters

```python
# A short prompt example
prompt = "A red apple on a white table"

# A detailed prompt example
prompt = """
A cozy Thai coffee shop at sunset, wooden interior, warm Edison bulb lighting, 
potted tropical plants near the window, a barista preparing pour-over coffee,
watercolor painting style, soft muted colors, peaceful atmosphere
"""
```

---

## The `model` parameter (the model used to create images)

```python
model = "dall-e-3"   # use DALL·E 3 (recommended — better results)
model = "dall-e-2"   # use DALL·E 2 (cheaper, supports Edit and Variation)
```

If not specified, the default is `dall-e-2`.

---

## The `size` parameter (image size)

The supported **size** (the image's width × height in pixels) differs by model:

### For DALL·E 3

| Size | Meaning | Use for |
|---|---|---|
| `"1024x1024"` | Square image | General, profile, logo |
| `"1792x1024"` | Landscape image | Wallpaper, banner |
| `"1024x1792"` | Portrait image | Cover image, mobile content |

### For DALL·E 2

| Size | Meaning |
|---|---|
| `"256x256"` | Small image, cheapest |
| `"512x512"` | Medium image |
| `"1024x1024"` | Large image, best quality |

```python
# Example of setting size
response = client.images.generate(
    model="dall-e-3",
    prompt="A wide panoramic mountain landscape",
    size="1792x1024",  # choose landscape for a wide image
    n=1,
)
```

---

## The `quality` parameter (image quality)

**Quality** (the level of detail in generation) is supported only on **DALL·E 3**:

| Quality | Description | Relative price |
|---|---|---|
| `"standard"` | Standard quality, faster | Cheaper |
| `"hd"` | High quality (High Definition — high resolution, more detail), sharper lines, more detail | More expensive (about 2x) |

```python
# Standard — good for testing and general use
response = client.images.generate(
    model="dall-e-3",
    prompt="A forest scene",
    size="1024x1024",
    quality="standard",
)

# HD — good for work needing the highest quality
response = client.images.generate(
    model="dall-e-3",
    prompt="A detailed portrait of a wise old man",
    size="1024x1024",
    quality="hd",
)
```

> **Tip:** Use `standard` for testing prompts; once you're happy, regenerate with `hd` to save cost.

---

## The `style` parameter (image style)

**Style** (the overall look of the created image) is supported only on **DALL·E 3**:

| Style | Description | Good for |
|---|---|---|
| `"vivid"` | Vivid colors (bright, sharp, dramatic), the default | Art images, ads, creative work |
| `"natural"` | Natural colors (realistic, not exaggerated) | Real photos, article illustrations |

```python
# Vivid — bright, dramatic, good for creative work
response = client.images.generate(
    model="dall-e-3",
    prompt="A dragon flying over a volcano",
    size="1024x1024",
    style="vivid",
)

# Natural — realistic, good for places or people
response = client.images.generate(
    model="dall-e-3",
    prompt="A quiet morning in a Thai village",
    size="1024x1024",
    style="natural",
)
```

---

## The `n` parameter (number of images)

`n` is the number of images to create at once.

- **DALL·E 3:** supports `n=1` only (one image at a time)
- **DALL·E 2:** supports `n` from 1 to 10

```python
# DALL·E 2 — create 4 images at once
response = client.images.generate(
    model="dall-e-2",
    prompt="A cute robot",
    size="1024x1024",
    n=4,  # get 4 images at once
)

# Loop to show every image's URL
for i, image in enumerate(response.data):
    print(f"Image {i+1}: {image.url}")
```

---

## The `response_format` parameter (result format)

**Response Format** (the format of the data the API returns — choose to receive a URL or the image data directly):

| Format | Description | Good for |
|---|---|---|
| `"url"` | Returns a temporary URL (expires in 1 hour), the default | Showing the image on the web immediately |
| `"b64_json"` | Returns the image data in Base64 (image data encoded as text) | Saving the file directly, not wanting to rely on a URL |

```python
import base64

# Receive the image as Base64 and save it as a file
response = client.images.generate(
    model="dall-e-3",
    prompt="A mountain landscape",
    size="1024x1024",
    response_format="b64_json",
)

# Decode (convert Base64 back into image data) and save the file
image_data = base64.b64decode(response.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_data)
print("Image saved successfully: output.png")
```

---

## Complete code examples

### Python — create and save an image

```python
import os
import requests
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_image(prompt: str, output_path: str = "output.png"):
    """Create an image from a prompt and save it as a file"""
    
    print(f"Creating image: {prompt}")
    
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        style="vivid",
        n=1,
    )
    
    # Show the Revised Prompt (the prompt DALL·E 3 auto-adjusted)
    if response.data[0].revised_prompt:
        print(f"Revised Prompt: {response.data[0].revised_prompt}")
    
    # Download and save the image
    image_url = response.data[0].url
    image_response = requests.get(image_url)
    
    with open(output_path, "wb") as f:
        f.write(image_response.content)
    
    print(f"Image saved successfully: {output_path}")
    return output_path

# Usage
generate_image(
    prompt="A serene Thai temple at dawn, surrounded by misty mountains, golden light, photorealistic",
    output_path="thai_temple.png"
)
```

### JavaScript/TypeScript — create an image and show it in the browser

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    n: 1,
  });

  const imageUrl = response.data[0].url!;
  const revisedPrompt = response.data[0].revised_prompt;
  
  console.log("Revised Prompt:", revisedPrompt);
  console.log("Image URL:", imageUrl);
  
  return imageUrl;
}

// Usage
generateImage("A futuristic Bangkok skyline at night with flying cars")
  .then(url => console.log("Success:", url))
  .catch(err => console.error("Error:", err));
```

---

## DALL·E 2 vs DALL·E 3 summary table in the Generate Endpoint

| Capability | DALL·E 2 | DALL·E 3 |
|---|---|---|
| n (images per request) | 1–10 | 1 only |
| size | 256, 512, 1024 | 1024, 1792×1024, 1024×1792 |
| quality | Not supported | standard / hd |
| style | Not supported | vivid / natural |
| Max prompt | 1,000 characters | 4,000 characters |
| Revised Prompt | Not supported | ✅ Supported |

---

## Summary

The Generate Endpoint is DALL·E's main API for creating images from text. DALL·E 3 is far more capable than DALL·E 2 in quality and options but is limited to one image at a time. In real use, choose `dall-e-3` with `quality: "hd"` for important work, and `dall-e-3` with `quality: "standard"` for testing prompts.
