---
title: "ElevenLabs: API & credits — call it via code"
tool: "ElevenLabs"
icon: "tool-elevenlabs"
level: "pro"
summary: "An overview of calling ElevenLabs via the API and how credits are counted"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---

# API & credits — call ElevenLabs from code 🧑‍💻

> Adapted from the official documentation at [elevenlabs.io/docs/api-reference](https://elevenlabs.io/docs/api-reference)

Every ElevenLabs feature can be called via the **API** to embed in your app/service. There are SDKs in both Python and JavaScript.

## 🔑 What to prepare

| What you need | Description |
|---|---|
| **API key** | Created on the profile page (keep it secret) |
| **Voice ID** | Specifies which voice to use |
| **Model ID** | Choose the model, e.g. multilingual / flash |

## 🧱 Text to Speech example (Python)

```python
from elevenlabs import ElevenLabs
client = ElevenLabs(api_key="YOUR_KEY")
audio = client.text_to_speech.convert(
    voice_id="VOICE_ID",
    model_id="eleven_multilingual_v2",
    text="Hello, and welcome",
)
# Take the audio (bytes) and save it as an .mp3 file
```

## 💳 How credits are counted

- **TTS** is counted by the **number of characters** converted to speech
- **Dubbing / STT** is counted by the **media duration**
- Each plan has a different monthly credit quota (there's a free plan to start)

## 💡 Tips

- Use the **Flash** model when you need speed/low latency (e.g. real time)
- Use **streaming** to start playing audio before the whole thing is generated
- Don't embed the API key on the web (client) side — call it through your server

## 🔗 Reference

- API Reference: https://elevenlabs.io/docs/api-reference
- Official docs: https://elevenlabs.io/docs
