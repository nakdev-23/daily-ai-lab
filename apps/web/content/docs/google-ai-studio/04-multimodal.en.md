---
title: "Google AI Studio: multimodal — images, audio, video"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "intermediate"
summary: "Add images, files, audio, or video to a Gemini prompt through AI Studio"
readTime: "4 min"
readers: "0"
locked: false
order: 4
---

# Multimodal — not just text 🖼️🎙️

> Adapted from the official documentation at [ai.google.dev](https://ai.google.dev/gemini-api/docs/vision)

Gemini's standout feature is being a **multimodal** model — it understands text, images, audio, and video in a single prompt.

## 📥 What you can add

| Type | Example use |
|---|---|
| **Images** | "Describe this image" / "Read the text in the image" |
| **PDF / documents** | "Summarize this document" |
| **Audio** | "Transcribe this audio into text" |
| **Video** | "Summarize what happens in the clip" |

## ▶️ In AI Studio

1. On the Prompt page, hit the **+ / attach file** button
2. Upload an image/file/audio/video
3. Type a question about what you attached
4. See the result, then take the code to use

## 🧑‍💻 In code (concept)

Send the file into `contents` together with text — the SDK has helpers to upload files and reference them in the prompt.

## 💡 Tips

- Images/video at appropriate resolution help the model understand better
- Be clear about what you want it to "do" with the file

## 🔗 Reference

- Vision/multimodal docs: https://ai.google.dev/gemini-api/docs/vision
