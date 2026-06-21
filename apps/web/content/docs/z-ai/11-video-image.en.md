---
title: "Z.ai: Video & Image — CogVideoX and CogView"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "Generate video with CogVideoX and images with CogView through Z.ai"
readTime: "5 min"
readers: "0"
locked: false
order: 11
---

# Video & Image — generate video and images 🎬🖼️

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

Besides language models, Z.ai also has media-generation models.

## 🎬 CogVideoX — generate video

Generate video from **text** or an **image**. Generating video takes time, so it works **asynchronously**:

1. Send the create request (prompt / starting image + parameters)
2. Get a **task id**
3. Check status periodically
4. Receive the video link when done

```text
POST .../videos/generations   { model, prompt, ... }  -> { id }
GET  .../async-result/{id}     -> { status, video_url }
```

## 🖼️ CogView — generate images

Generate images from a text description (text-to-image)

```python
r = client.images.generate(
    model="cogview-3",
    prompt="An orange cat sitting on a roof at sunset, watercolor painting style",
)
print(r.data[0].url)
```

## 💡 Tips

- Write the prompt visually (subject + scene + light + style)
- Video: one main event per clip
- See the latest version names/parameters in the Video / Image section of the docs

## 🔗 References

- Official docs: https://docs.z.ai/
