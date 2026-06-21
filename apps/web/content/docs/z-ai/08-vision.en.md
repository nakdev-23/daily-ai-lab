---
title: "Z.ai: Vision — understand images with GLM-4.5V"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "Send an image to GLM-4.5V to read, describe, or answer questions about it"
readTime: "4 min"
readers: "0"
locked: false
order: 8
---

# Vision — let the model see images 👁️

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

The **GLM-4.5V** model is multimodal — send an image and ask about it, e.g. describe the image, read text in the image, analyze a chart.

## 🖼️ What it can do

- Describe what's in the image
- Read text/numbers in the image (OCR)
- Answer questions about the image
- Analyze graphs/tables/UI screens

## 🧱 Send an image (OpenAI-style format)

```python
r = client.chat.completions.create(
    model="glm-4.5v",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {"type": "image_url",
             "image_url": {"url": "https://example.com/photo.jpg"}},
        ],
    }],
)
print(r.choices[0].message.content)
```

> You can provide images as a URL or as base64 (as the docs specify)

## 💡 Tips

- Use sharp images for more accurate results
- Ask specifically what you want it to "do" with the image
- For document/table images, you can ask it to answer as a table/JSON

## 🔗 References

- Official docs: https://docs.z.ai/
