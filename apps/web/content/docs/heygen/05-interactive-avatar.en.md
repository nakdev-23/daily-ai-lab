---
title: "HeyGen: Interactive Avatar — a real-time responsive avatar"
tool: "HeyGen"
icon: "tool-heygen"
level: "pro"
summary: "A streaming avatar that listens and responds to users live, to embed in your app/web"
readTime: "5 min"
readers: "0"
locked: false
order: 5
---

# Interactive Avatar — an avatar that converses live 💬

> Compiled in English from the official docs at [docs.heygen.com](https://docs.heygen.com/), the Streaming / Interactive Avatar section

Unlike pre-recorded videos, an **Interactive Avatar** is a **real-time streaming** avatar that listens to the user and speaks a reply immediately — great for a digital storefront assistant, a virtual tutor, or an in-app receptionist.

## 🧩 How it works

| Step | Description |
|---|---|
| **Listen** | Receive audio/text from the user |
| **Think** | Send it to an LLM (yours or one connected) to process the answer |
| **Speak** | The avatar speaks the answer with live lip movement |

## ⭐ Highlights

- **Real-time** — responds immediately, no rendering wait
- **Embeddable** — put it in a web/app via the SDK (e.g. using WebRTC to stream video)
- **Bring your own brain** — connect to your LLM/knowledge base
- Choose an avatar and voice just like the video mode

## 🛠️ For developers

- There's a **Streaming API / SDK** to embed a streaming avatar in your app
- You need an **API key** and to manage the stream connection (session)
- Designed to connect to STT + LLM + your app's logic

## ▶️ Getting started (overview)

1. Enable the Interactive/Streaming Avatar feature in your account
2. Choose an avatar + voice
3. Use the SDK to create a session, then send text/audio into it
4. Receive the avatar's video stream back to display in your app

## 🔗 References

- Official docs: https://docs.heygen.com/
