---
title: "Seedance: calling it via the API"
tool: "Seedance"
icon: "tool-seedance"
level: "pro"
summary: "An overview of calling the Seedance model via the API for developers"
readTime: "5 min"
readers: "0"
locked: false
order: 5
---

# Calling Seedance via the API 🧑‍💻

> Compiled in English from the official Seedance docs (ByteDance / BytePlus ModelArk)

Besides using it through the website, Seedance can be called via the **API** to generate videos automatically in your app (offered through BytePlus ModelArk / Volcengine and partner platforms).

## 📖 How it works (overview)

Video generation takes time, so it usually runs **asynchronously**:

1. **Send the request (create task)** — send a prompt + parameters (resolution, duration, aspect ratio; for I2V, attach an image)
2. **Get a task ID** back
3. **Check status (poll)** until the job is done
4. **Get the video link** for the finished video

## 🔑 What to prepare

| What you need | Description |
|---|---|
| **API key** | The authentication key (create it in the provider's dashboard) |
| **Model ID** | Specify the Seedance model version to use |
| **Endpoint** | The service URL (per the provider, e.g. ModelArk) |

## 🧱 General steps (pseudo)

```text
POST /video/generation   { model, prompt, resolution, duration, ratio, [image] }
  -> { task_id }
GET  /video/generation/{task_id}
  -> { status: "succeeded", video_url }
```

> For endpoint details, parameter names, and quotas, see the docs of the provider you use (BytePlus ModelArk / Volcengine / partners like fal, Replicate)

## 🔗 References

- BytePlus ModelArk: https://www.byteplus.com/
- Volcengine (Chinese): https://www.volcengine.com/
