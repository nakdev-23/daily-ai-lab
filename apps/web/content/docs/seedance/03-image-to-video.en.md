---
title: "Seedance: Image-to-Video — turn a still image into video"
tool: "Seedance"
icon: "tool-seedance"
level: "beginner"
summary: "Provide an image as the start, then have Seedance generate an animated video continuing from that image"
readTime: "5 min"
readers: "0"
locked: false
order: 3
---

# Image-to-Video — a still image becomes a clip 🖼️→🎬

> Compiled in English from the official Seedance docs (ByteDance / BytePlus ModelArk)

The **Image-to-Video (I2V)** mode lets you **upload an image as the start**, then write text describing how you want that image to move. The model generates a video that continues from the image — great for bringing photos/paintings to life.

## 📖 What to prepare

| What you provide | Description |
|---|---|
| **Starting image** | The image to use as the first frame |
| **Prompt** | Describe the motion/camera you want |
| **Duration / Resolution** | The clip's length and resolution |

## 💡 Tips

- Use a **sharp image with clear composition** for a better result
- Describe only the **motion** you want (e.g. "hair fluttering in the wind, the camera zooming in slowly")
- If you want the character/scene to stay the same, the starting image is the key

Example:
> Image: a mountain landscape + Prompt: "clouds drifting slowly over the peaks, sunlight gradually shining down, the camera panning up"

## 📚 Next

- [Prompt-writing techniques](04-prompting)
- [Calling it via the API](05-api)

## 🔗 References

- BytePlus ModelArk (Seedance): https://www.byteplus.com/
