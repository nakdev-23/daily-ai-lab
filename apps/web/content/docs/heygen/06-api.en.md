---
title: "HeyGen: API — generate videos from code"
tool: "HeyGen"
icon: "tool-heygen"
level: "pro"
summary: "An overview of calling the HeyGen API to generate avatar videos automatically"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---

# API — generate avatar videos with code 🧑‍💻

> Compiled in English from the official docs at [docs.heygen.com](https://docs.heygen.com/), the API Reference section

HeyGen has an **API** to generate avatar videos automatically, great for making large numbers of videos (e.g. personalized per recipient) or embedding video generation into your system.

## 🔑 What to prepare

| What you need | Description |
|---|---|
| **API key** | Create it on the account settings page (keep it secret) |
| **Avatar ID** | Specify the avatar to use |
| **Voice ID** | Specify the voice to speak |

## 🧱 General steps (asynchronous)

Rendering a video takes time, so it works asynchronously:

```text
POST /v2/video/generate   { avatar_id, voice_id, input_text, ... }
  -> { video_id }
GET  /v1/video_status.get?video_id=...
  -> { status: "completed", video_url }
```

1. **Send the create request** with the avatar/voice/script
2. Get a **video_id**
3. **Check status** periodically until done
4. Receive the **video link**

## 💡 Tips

- Use a **webhook** (if available) instead of polling to get notified when the video is done
- Store frequently used Avatar IDs / Voice IDs as constants
- Don't expose your API key on the client side — call through your own server

## 🔗 References

- API Reference: https://docs.heygen.com/
