---
title: "Seedance: Text-to-Video — generate video from text"
tool: "Seedance"
icon: "tool-seedance"
level: "beginner"
summary: "Generate video clips from a text description with ByteDance's Seedance model"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---

# Text-to-Video — describe it in text, get a video 🎥

> Compiled in English from the official Seedance docs (ByteDance / BytePlus ModelArk)

**Seedance** is ByteDance's AI video-generation model. The **Text-to-Video (T2V)** mode lets you type a scene description in text, and the model generates a video clip to match.

## 📖 Commonly adjusted values

| Value | Meaning |
|---|---|
| **Prompt** | The scene description you want |
| **Resolution** | The resolution (e.g. 480p / 1080p) |
| **Duration** | The clip length (seconds) |
| **Aspect ratio** | The image ratio (16:9, 9:16, 1:1) |

## ✍️ Write a good Prompt

Including these elements fully yields a more on-target result:
- **Subject/character** — who/what is in the frame
- **Action** — what they're doing
- **Scene/atmosphere** — where, what time, what kind of light
- **Camera angle and motion** — e.g. close-up, slow pan
- **Visual style** — e.g. realistic, cartoon, film

Example:
> "A girl playing in a flower field in the evening, golden light, the camera panning slowly to follow, realistic, 16:9"

## 📚 Next

- [Image-to-Video — use an image as the start](03-image-to-video)
- [Prompt-writing techniques](04-prompting)

## 🔗 References

- BytePlus ModelArk (Seedance): https://www.byteplus.com/
