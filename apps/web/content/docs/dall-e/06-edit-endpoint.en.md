---
title: "Edit Endpoint — edit and fill in images with AI"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "Learn to use POST /images/edits for editing parts of an image (Inpainting) and filling in images with DALL·E 2"
readTime: "7 min"
readers: "0"
locked: false
order: 6
---
# Edit Endpoint — edit and fill in images with AI

> Primary reference: [OpenAI API Reference — Create image edit](https://platform.openai.com/docs/api-reference/images/createEdit)

---

## What is the Edit Endpoint

The **Edit Endpoint** (the API endpoint for editing images — takes an original image with a prompt and edits or fills in content in the image) lets you:

- **Edit part of an image** using a mask (a black-and-white image that says which part of the image to edit)
- **Fill empty space in an image** (Outpainting — extending the image beyond its original edges)
- **Remove or replace objects** in the image

> **Important note:** The Edit Endpoint supports only **DALL·E 2**, not DALL·E 3.

**Endpoint:**
```
POST https://api.openai.com/v1/images/edits
```

---

## What is Inpainting

**Inpainting** (editing part of an image — selecting an area and having the AI fill it in anew) is a technique that lets you specify the part of the image to edit using a mask, then have DALL·E create new content to replace that area.

Examples of using Inpainting:
- Remove a car from a street image, and have the AI fill in empty road instead
- Replace the sky in an image with a sunset sky
- Change the clothing of a person in the image
- Add a new object to an existing image

---

## Parameters of the Edit Endpoint

| Parameter | Type | Required | Description |
|---|---|---|---|
| `image` | file | ✅ Required | The original image file (PNG, RGBA, no larger than 4MB) |
| `prompt` | string | ✅ Required | The description of the desired image in the edited part |
| `mask` | file | ❌ Optional | A PNG mask file (transparent area = edit, opaque = keep) |
| `model` | string | ❌ Optional | Must be `dall-e-2` |
| `n` | integer | ❌ Optional | The number of images to create (1–10, default: 1) |
| `size` | string | ❌ Optional | The image size (256×256, 512×512, 1024×1024) |
| `response_format` | string | ❌ Optional | `url` or `b64_json` |

---

## Image file requirements

### The original image (`image`)

- Format: **PNG only**
- File size: no larger than **4MB**
- Must be a **square image** (width = height)
- If no mask is included, the whole image is edited per the prompt

### The mask image (`mask`)

- Format: **PNG only**
- Size must be **equal to the original image**
- **Transparent** area (Alpha=0) = the area DALL·E will edit
- **Opaque** area (full color, Alpha=255) = the area kept unchanged

---

## How to create a mask

### Way 1: Use an image editor (Photoshop, GIMP)

1. Open the original image in the image editor
2. Create a new layer with an opaque white background
3. Paint transparent (erase pixels) in the area you want to edit
4. Save as a PNG with an alpha channel (the transparency channel — the data for the transparent part of an image)

### Way 2: Create a mask with Python and Pillow

```python
from PIL import Image
import numpy as np

def create_mask(image_path: str, mask_area: tuple, output_path: str = "mask.png"):
    """
    Create a mask for DALL·E Edit
    mask_area: (x_start, y_start, x_end, y_end) — the area you want to edit
    """
    # Open the original image to get its size
    original = Image.open(image_path)
    width, height = original.size
    
    # Create an opaque white mask (edits nothing)
    mask = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    
    # Make the area you want to edit transparent
    x1, y1, x2, y2 = mask_area
    mask_array = np.array(mask)
    mask_array[y1:y2, x1:x2] = [0, 0, 0, 0]  # transparent (Alpha=0)
    
    # Save the mask
    mask_image = Image.fromarray(mask_array)
    mask_image.save(output_path, "PNG")
    print(f"Mask created successfully: {output_path}")
    return output_path

# Example: create a mask for the center of a 1024x1024 image
create_mask(
    image_path="original.png",
    mask_area=(300, 300, 700, 700),  # the center area
    output_path="mask.png"
)
```

---

## Edit Endpoint usage examples

### Example 1: Replace the sky in an image

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Replace the sky (the top part of the image) with a sunset sky
with open("landscape.png", "rb") as image_file, \
     open("sky_mask.png", "rb") as mask_file:
    
    response = client.images.edit(
        model="dall-e-2",
        image=image_file,
        mask=mask_file,
        prompt="A dramatic sunset sky with orange and purple clouds",
        size="1024x1024",
        n=1,
    )

new_image_url = response.data[0].url
print(f"Edited image: {new_image_url}")
```

### Example 2: Fill in space (no mask)

When no mask is included, the whole image is edited per the prompt:

```python
# Change the whole image per a new prompt
with open("photo.png", "rb") as image_file:
    
    response = client.images.edit(
        model="dall-e-2",
        image=image_file,
        prompt="The same scene but during winter with snow",
        size="1024x1024",
        n=2,  # create 2 options
    )

for i, img in enumerate(response.data):
    print(f"Option {i+1}: {img.url}")
```

### Example 3: Remove an object from an image

```python
# Remove a person from an image (you need a mask covering the person)
with open("crowded_street.png", "rb") as image_file, \
     open("person_mask.png", "rb") as mask_file:
    
    response = client.images.edit(
        model="dall-e-2",
        image=image_file,
        mask=mask_file,
        prompt="An empty street with no people, just the buildings and pavement",
        size="1024x1024",
        n=1,
    )

print(f"Image with the person removed: {response.data[0].url}")
```

### Example with Node.js

```javascript
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function editImage() {
  const response = await openai.images.edit({
    model: "dall-e-2",
    image: fs.createReadStream("original.png"),
    mask: fs.createReadStream("mask.png"),
    prompt: "A sunlit indoor lounge area with a pool containing a flamingo",
    n: 1,
    size: "1024x1024",
  });

  console.log("Edited image URL:", response.data[0].url);
}

editImage();
```

---

## cURL example

```bash
curl https://api.openai.com/v1/images/edits \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@original.png" \
  -F mask="@mask.png" \
  -F prompt="A sunlit indoor lounge area with a pool containing a flamingo" \
  -F n=1 \
  -F size="1024x1024"
```

---

## Common errors

| Problem | Cause | Fix |
|---|---|---|
| `image must be a PNG` | The file isn't PNG | Convert to PNG first |
| `image must be square` | The image isn't square | Crop or resize so width = height |
| `image too large` | The file is over 4MB | Compress it smaller |
| `mask and image must be same size` | The mask size doesn't match the image | Resize the mask to match |

---

## Edit Endpoint tips

1. **Make the mask slightly larger than needed** — give the AI enough room to create a natural boundary
2. **The prompt should describe the whole image**, not just the edited part — tell the AI the surrounding context too
3. **Create several n** and choose the best result — each one gives a different result
4. **Images with simple content** often work better than very complex images

---

## Summary

The Edit Endpoint is a powerful tool for editing existing images with AI using the inpainting technique, by defining a mask that tells DALL·E 2 which area to edit. Even though it supports only DALL·E 2 and needs a square PNG file, its flexibility in editing images makes it very useful for work that needs to adjust an existing image.
