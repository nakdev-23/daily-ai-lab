---
title: "Variations Endpoint — create variations from an original image"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "Learn to use POST /images/variations to create several versions from an original image with DALL·E 2"
readTime: "5 min"
readers: "0"
locked: false
order: 7
---
# Variations Endpoint — create variations from an original image

> Primary reference: [OpenAI API Reference — Create image variation](https://platform.openai.com/docs/api-reference/images/createVariation)

---

## What is the Variations Endpoint

The **Variations Endpoint** (the API endpoint for creating variations — takes an original image and creates several new versions with a similar style but differing in detail) is a DALL·E 2-specific feature that lets you create several variations (multiple versions from an original image) from a single image.

Use it when:
- You want several options from the same design
- You want an image "similar" to the original but with small differences
- You want A/B testing (comparing 2 versions to choose the better one) between several options

> **Note:** The Variations Endpoint supports only **DALL·E 2**.

**Endpoint:**
```
POST https://api.openai.com/v1/images/variations
```

---

## Parameters of the Variations Endpoint

| Parameter | Type | Required | Description |
|---|---|---|---|
| `image` | file | ✅ Required | The original image file (PNG, square, no larger than 4MB) |
| `model` | string | ❌ Optional | Must be `dall-e-2` |
| `n` | integer | ❌ Optional | The number of variations (1–10, default: 1) |
| `size` | string | ❌ Optional | The image size: `256x256`, `512x512`, `1024x1024` |
| `response_format` | string | ❌ Optional | `url` or `b64_json` |
| `user` | string | ❌ Optional | A user ID for tracking |

---

## Image file requirements

- Format: **PNG only**
- File size: no larger than **4MB**
- Image size: must be **square** (width = height)
- Doesn't need an alpha channel (transparency channel)

---

## Usage examples

### Python — create many variations

```python
import os
import requests
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def create_variations(image_path: str, num_variations: int = 4):
    """Create variations from an original image"""
    
    print(f"Creating {num_variations} variations from: {image_path}")
    
    with open(image_path, "rb") as image_file:
        response = client.images.create_variation(
            model="dall-e-2",
            image=image_file,
            n=num_variations,
            size="1024x1024",
        )
    
    # Save every image
    for i, image_data in enumerate(response.data):
        url = image_data.url
        img_response = requests.get(url)
        
        output_path = f"variation_{i+1}.png"
        with open(output_path, "wb") as f:
            f.write(img_response.content)
        
        print(f"Saved variation {i+1}: {output_path}")
    
    return [img.url for img in response.data]

# Usage
urls = create_variations("original_logo.png", num_variations=4)
print(f"Created {len(urls)} variations successfully")
```

### Python — receive the result as Base64

```python
import base64
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

with open("original.png", "rb") as image_file:
    response = client.images.create_variation(
        model="dall-e-2",
        image=image_file,
        n=2,
        size="512x512",
        response_format="b64_json",  # receive the image data directly
    )

# Save each variation
for i, img_data in enumerate(response.data):
    image_bytes = base64.b64decode(img_data.b64_json)
    output_file = f"variation_{i+1}.png"
    
    with open(output_file, "wb") as f:
        f.write(image_bytes)
    
    print(f"Saved: {output_file}")
```

### Node.js — create variations

```javascript
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function createVariations(imagePath: string, count: number = 3) {
  const response = await openai.images.createVariation({
    model: "dall-e-2",
    image: fs.createReadStream(imagePath),
    n: count,
    size: "1024x1024",
  });

  response.data.forEach((image, index) => {
    console.log(`Variation ${index + 1}: ${image.url}`);
  });

  return response.data.map(img => img.url);
}

// Usage
createVariations("logo.png", 4);
```

### cURL — a direct command

```bash
curl https://api.openai.com/v1/images/variations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@original.png" \
  -F n=4 \
  -F size="1024x1024"
```

---

## The difference between Variations and Generation

| Property | Generate Endpoint | Variations Endpoint |
|---|---|---|
| Input | A prompt (text) | An original image |
| Result | A new image per the prompt | An image similar to the original |
| Control | Controlled through the prompt | Less control |
| Supported models | DALL·E 2 and 3 | DALL·E 2 only |

---

## Real use cases

### 1. Test several variations for a logo

```python
# Upload a draft logo and create several versions
create_variations("company_logo_draft.png", num_variations=5)
# Choose the version you like from the 5 options
```

### 2. Create several avatars

```python
# Create several avatar styles from a base image
create_variations("character_design.png", num_variations=6)
```

### 3. Product images from several angles

```python
# Create several versions of a product image from a single original
create_variations("product_photo.png", num_variations=4)
```

---

## Tips for using Variations

1. **The clearer the original image, the better the result** — an image with a clear main element gives better variations
2. **Try different sizes** — `512x512` is faster and cheaper, good for testing
3. **Create many at once** — sending `n=8` once is faster than sending n=1 eight times
4. **Save the images immediately** — the URL expires in 1 hour, so download or save right away

---

## Common errors

| Problem | Cause | Fix |
|---|---|---|
| `invalid image format` | The file isn't PNG | Convert to PNG first |
| `image must be square` | The image isn't square | Resize so width = height |
| `file size too large` | The file is over 4MB | Compress or reduce the resolution |
| `n must be between 1 and 10` | You specified n over 10 | Lower n to no more than 10 |

---

## Summary

The Variations Endpoint is a good tool for creating several options from a single original image, suited to design work needing multiple iterations (creating several versions and choosing the best). Even though it supports only DALL·E 2 and has no prompt for control, the convenience of creating several options makes it very useful for creative work.
