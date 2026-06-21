---
title: "Vision and Multimodal — analyzing images with Claude"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Learn how to send images to Claude to analyze — via URL, base64, and the Files API — plus use cases and limitations to know"
readTime: "8 min"
readers: "0"
locked: false
order: 10
---

## What is Vision?

Claude has vision capabilities, or multimodal (the ability to receive both text and images at once), meaning the model (the AI's brain) can **accept images as input** and analyze that image content together with text. All current Claude models (Claude 4.x and newer) support vision.

---

## How to use Vision

### 1. Via Claude.ai (for general users)

- Click the attach-file button, or drag an image directly into the chat box
- Supports up to **20 images per message**

### 2. Via the API Console

In the API Console Workbench, there's a button to add images in the User message section.

### 3. Via the API directly

There are 3 ways to send images via the API:

#### Method 1: URL (for images on the internet)

```json
{
  "type": "image",
  "source": {
    "type": "url",
    "url": "https://example.com/image.jpg"
  }
}
```

#### Method 2: Base64 (converting a file into numeric text — to send directly via the API, for images on your machine)

```python
import anthropic
import base64

with open("image.jpg", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data,
                    },
                },
                {
                    "type": "text",
                    "text": "Describe what you see in this image"
                }
            ],
        }
    ],
)
```

#### Method 3: Files API (recommended for frequently used images)

Files API (a file-management system via the API — upload once, then reference repeatedly):

```python
# Upload once, reuse many times
uploaded = client.beta.files.upload(
    file=("image.jpg", open("image.jpg", "rb"), "image/jpeg"),
)

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": uploaded.id,
                    },
                },
                {"type": "text", "text": "Analyze this image"}
            ],
        }
    ],
)
```

---

## Limitations and Limits

### Maximum number of images

| Platform | Limit |
|----------|---------|
| Claude.ai | 20 images per message |
| API (models with 200k context) | 100 images per request |
| API (models with 1M+ context) | 600 images per request |

### Image size

| Condition | Maximum size |
|---------|-----------|
| File size (Claude API) | 10 MB per image |
| File size (Amazon Bedrock, Vertex AI) | 5 MB per image |
| File size (Claude.ai) | 10 MB per image |
| Resolution | 8,000 x 8,000 pixels |
| Resolution (when sending more than 20 images) | 2,000 x 2,000 pixels |

### Supported formats
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

---

## Use Cases Vision can do

### Document analysis
- Read and extract data from scanned documents (documents scanned as images)
- Analyze tables, graphs, and infographics (data-summary images)
- OCR (converting characters in an image into digital text) and turn images into text

### General image analysis
- Describe the content in an image
- Identify objects, places, or people in an image
- Analyze the mood and atmosphere in an image

### Design and UI work
- Analyze a screenshot of a UI/UX (interface and user experience)
- Review design mockups
- Compare before-and-after images

### Science and medicine
- Analyze scientific diagrams
- Interpret graphs and data visualization (showing data as graphs or diagrams)
- Help analyze medical images (not diagnosis)

### Computer Use
Claude can see screenshots of the screen and control a computer via the Computer Use tool (a tool that lets the AI control operations on screen).

---

## Sending multiple images at once

Claude can analyze multiple images at once, good for work like:
- Comparing images
- Analyzing a sequence of images, e.g. step-by-step
- Analyzing video by converting it into frames (still images at each moment of the video)

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "url", "url": "https://example.com/before.jpg"}},
                {"type": "image", "source": {"type": "url", "url": "https://example.com/after.jpg"}},
                {"type": "text", "text": "Compare the differences between these two images"}
            ],
        }
    ],
)
```

---

## Counting an image's Tokens

Images are also counted as tokens (chunks of data), depending on size:

- A typical image (1,092 x 1,092 px) ≈ 1,334 tokens
- An image smaller than 200 x 200 px ≈ 55 tokens (minimum)
- Large images are downscaled before processing

### Tips to reduce tokens from images
- Downscale the image before sending if you don't need high resolution
- Use the Files API to cache (remember an image to reuse) frequently used images
- Crop only the important part of the image instead of sending the whole image

---

## Best Practices

### Improve analysis quality

1. **State clearly what you want** — specify which part of the image you want Claude to look at
2. **Include context** — say where the image is from and what it is, for more accurate analysis
3. **Use a crop tool** — for images with lots of detail, zooming into the important part improves analysis
4. **Specify the language of text in the image** — if the image has text in another language, tell Claude in advance

### Limitations to know

- Claude can't identify a person's identity from their face (for privacy)
- Accuracy in reading handwriting may be imperfect
- Low-quality or very dark images may be hard to analyze
- It doesn't support video files directly; you must convert them into frames first

---

## Using Vision with PDF

Claude supports PDFs (a document file format — often containing both text and images) with both text and images:

```python
# Send a PDF directly via base64
with open("document.pdf", "rb") as f:
    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data,
                    },
                },
                {"type": "text", "text": "Summarize the content of this document"}
            ],
        }
    ],
)
```

---

## Summary

Claude's Vision capabilities open up the chance to build applications working with image data in many ways, from document analysis to automatic computer control. The key points are choosing the method of sending images (URL / base64 / Files API) to suit your use case, and optimizing tokens to control cost.
