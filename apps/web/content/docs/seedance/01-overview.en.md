---
title: "What is Seedance — ByteDance's AI video generation model"
tool: "Seedance"
icon: "tool-seedance"
level: "beginner"
summary: "An overview of Seedance, ByteDance's text/image-to-video model, and how to get started"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# Seedance — ByteDance's AI video generation model

> Compiled in English from the official docs [BytePlus ModelArk — Video Generation](https://docs.byteplus.com/en/docs/ModelArk/) and ByteDance's Seedance model pages

**Seedance** is a family of AI models for **video generation** developed by **ByteDance** (the same company as TikTok). It's the engine behind the **Dreamina / Jimeng (即梦)** app and is offered via API on the **BytePlus ModelArk** platform, as well as through third-party providers such as fal.ai, Replicate, and PiAPI.

---

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **Text-to-Video (T2V)** | Generate video from "text" (a prompt) |
| **Image-to-Video (I2V)** | Generate video from a "given image" (e.g. animating a still image) |
| **Reference-to-Video** | Generate video by referencing multiple media (images/videos/audio) to set the direction |
| **Prompt** | The instruction describing what you want the video to be |
| **ModelArk** | BytePlus's API platform used to call Seedance models |
| **Task** | One video-generation job — you request it and "wait" until it's done (asynchronous) |

---

## ⭐ Main capabilities

- **Generate video from text** — type a scene description and get a video out
- **Generate video from an image** — provide a starting image (and you can set the first/last frame)
- **Multimodal reference** — newer versions accept up to **12 files per request** (up to 9 images, 3 videos, 3 audio); input video/audio length up to ~15 seconds
- **Native audio** — the 2.0 version can synthesize audio to match the video
- **Realistic physics + cinematic camera control** — motion and camera angles look natural
- **High quality** — supports up to 2K resolution in the latest version

---

## 🧩 Model versions (briefly)

| Version | Highlight |
|---|---|
| **Seedance 1.0 Lite** | Fast/economical, good for general work (T2V, I2V) |
| **Seedance 1.0 Pro** | Higher quality, better detail/consistency |
| **Seedance 2.0** | Multimodal (image+video+audio), native audio, cinematic camera control, multi-media reference |

> For models/version names called via API, refer to the latest list in the ModelArk docs

---

## 🚀 Two ways to get started

**1) Via the app (no coding needed)** — use it through **Dreamina / Jimeng**: type a prompt or upload an image and click generate. Good for general creators.

**2) Via the API (for developers)** on **BytePlus ModelArk** — the workflow is an **asynchronous task**:

1. **Create a Task** — send a request (prompt + image/parameters) to the video-generation endpoint → get a `task_id`
2. **Check status (poll)** — query the Task status periodically until it becomes `succeeded`
3. **Get the result** — get a video URL back to download/use

Common parameters: `prompt` (text), reference image (first/last frame), aspect ratio, length, resolution, seed

---

## 📚 Seedance docs table of contents (ordered per the official docs)

This page is the "overview"; the following topics will be translated in order to complete it per the official docs:

1. ✅ Seedance overview (this page)
2. ⏳ Calling the Video Generation API — create a Task
3. ⏳ Checking status and getting the result (Query Task)
4. ⏳ Request parameters (values and accepted ranges)
5. ⏳ Text-to-Video / Image-to-Video / Reference-to-Video
6. ⏳ Pricing, quotas, and cautions

---

## 🔗 References (official docs)

- BytePlus ModelArk — Video Generation API: https://docs.byteplus.com/en/docs/ModelArk/
- Seedance (ByteDance) on fal.ai / Replicate / PiAPI (third-party API providers)
