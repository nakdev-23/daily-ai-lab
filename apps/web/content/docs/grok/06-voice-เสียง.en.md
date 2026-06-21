---
title: "Voice API — audio capabilities"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "The Voice API is Grok's set of audio abilities, in 3 main parts:"
readTime: "3 min"
readers: "0"
locked: false
order: 6
---
# Voice API — audio capabilities

> Reference: [Voice Overview](https://docs.x.ai/developers/model-capabilities/audio/voice) | [Text to Speech](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech) | [Speech to Text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text) | [Custom Voices](https://docs.x.ai/developers/model-capabilities/audio/custom-voices) | [Ephemeral Tokens](https://docs.x.ai/developers/model-capabilities/audio/ephemeral-tokens)

---

## What is the Voice API?

The **Voice API** is Grok's set of audio abilities, in 3 main parts:

| Ability | Description | Price |
|---|---|---|
| **Voice Agent (Real-time)** | Real-time voice interaction, both input/output as audio | $3.00/hour |
| **Text-to-Speech (TTS)** | Turn text into speech | $15.00/1M characters |
| **Speech-to-Text (STT)** | Turn audio into text, supports 25 languages | $0.10/hour (REST), $0.20/hour (Streaming) |

Try it at [console.x.ai/playground/voice/agent](https://console.x.ai/playground/voice/agent)

---

## Voice Agent — real-time voice interaction

Reference: [Voice Overview](https://docs.x.ai/developers/model-capabilities/audio/voice)

### What is this topic?
The Voice Agent API lets you build an AI that talks by voice in real time, taking audio from the user and replying with audio, like a phone call with an AI.

### What is it used for?
- Call Center AI
- A voice assistant in an app
- Interactive Voice Response (IVR)
- A voice assistant on a device

### Connection
The Voice Agent uses a **WebSocket** connection for real-time communication.

```python
import websockets
import json
import os

async def voice_session():
    uri = "wss://api.x.ai/v1/audio/voice"
    headers = {"Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"}

    async with websockets.connect(uri, extra_headers=headers) as ws:
        # Send the config
        await ws.send(json.dumps({
            "type": "session.create",
            "model": "grok-4.3",
            "voice": "default"
        }))
        
        # Send audio (the bytes of audio)
        # await ws.send(audio_bytes)
```

---

## Ephemeral Tokens — tokens for Client-side

Reference: [Ephemeral Tokens](https://docs.x.ai/developers/model-capabilities/audio/ephemeral-tokens)

### What is this topic?
When you want a browser or mobile app to connect to the Voice API directly (client-side), using the real API key is unsafe. An Ephemeral Token is a short-lived token the server creates for the client to use instead.

### How it works

```
1. Your app (Backend) → request an Ephemeral Token from xAI
2. Backend → send the token to the Client (Browser/App)
3. Client → use the token to connect to the Voice API directly
4. The token expires automatically (no risk of the key leaking)
```

### Create an Ephemeral Token (Backend)

```python
import os
import requests

response = requests.post(
    "https://api.x.ai/v1/audio/ephemeral-tokens",
    headers={"Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"},
    json={"model": "grok-4.3", "expires_in": 300},  # 5-minute lifetime
)

token = response.json()["token"]
# Send this token to the client
```

---

## Text-to-Speech (TTS) — turn text into speech

Reference: [Text to Speech](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)

### What is this topic?
Send text and get speech back, supporting many voices and languages, now GA (Generally Available).

### Pricing
**$15.00 per 1 million characters**

### How to use it

**Python (OpenAI SDK):**
```python
from openai import OpenAI
from pathlib import Path

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.audio.speech.create(
    model="grok-tts",
    voice="nova",  # choose the voice you want
    input="Hello, welcome to the Grok Voice API",
)

# Save as an audio file
speech_file_path = Path("output.mp3")
response.stream_to_file(speech_file_path)
print(f"Saved the audio file at: {speech_file_path}")
```

**cURL:**
```bash
curl https://api.x.ai/v1/audio/speech \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-tts",
    "input": "Hello, welcome to Grok",
    "voice": "nova"
  }' \
  --output output.mp3
```

---

## Speech-to-Text (STT) — turn audio into text

Reference: [Speech to Text](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)

### What is this topic?
Upload an audio file or send a real-time audio stream and get a transcript back. It supports **25 languages** and has both Batch and Streaming modes.

### Supported modes

| Mode | Used when | Price |
|---|---|---|
| **REST (Batch)** | Uploading a ready-made audio file | $0.10/hour |
| **Streaming** | Sending audio in real time | $0.20/hour |

### Supported audio files
MP3, WAV, M4A, OGG, FLAC, AAC

### How to use it (Batch Mode)

**Python:**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

with open("recording.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="grok-stt",
        file=audio_file,
        language="th",  # specify the language if known (improves accuracy)
    )

print(transcript.text)
```

**cURL:**
```bash
curl https://api.x.ai/v1/audio/transcriptions \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -F file=@recording.mp3 \
  -F model=grok-stt \
  -F language=th
```

---

## Custom Voices

Reference: [Custom Voices](https://docs.x.ai/developers/model-capabilities/audio/custom-voices)

### What is this topic?
Instead of standard voices, you can create a speech voice with a unique character, e.g. a brand voice, a game character voice, or an assistant voice with a specific personality.

### Steps to create a Custom Voice

1. Upload a voice reference sample
2. Specify the voice characteristics you want
3. xAI creates a Custom Voice ID for you
4. Use that Voice ID when calling TTS

> This feature is still **New** and may change.

---

## Summary — which Voice API to use?

| You want | Use the API |
|---|---|
| AI that talks by voice in real time | Voice Agent |
| Turn document text into speech | Text-to-Speech |
| Transcribe from a recording | Speech-to-Text (Batch) |
| Transcribe audio live | Speech-to-Text (Streaming) |
| A voice with the brand's identity | Custom Voices |
