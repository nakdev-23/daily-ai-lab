---
title: "Audio Generation"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Generate accompanying audio (Sound Effects, Background Music, Ambient Sound) from a text description — e.g. 'heavy rain in a forest' or 'the sound of evening sea waves'"
readTime: "3 min"
readers: "0"
locked: false
order: 5
---
# 05 · Audio Generation

> Official Docs reference:
> - [Text to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToAudio)
> - [Video to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoToAudio)
> - [Text to Speech](https://kling.ai/document-api/apiReference%2Fmodel%2FTTS)
> - [Voice Clone](https://kling.ai/document-api/apiReference%2Fmodel%2FcustomVoices)

---

## 1. Text to Audio — generate audio from text

> Reference: [Text to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FtextToAudio)

### What is this topic?

Generate accompanying audio (Sound Effects, Background Music, Ambient Sound) from a text description — e.g. "heavy rain in a forest" or "the sound of evening sea waves".

### What it's used for

- Create Sound Effects for video
- Create atmospheric Background Music
- Create nature or ambient sounds

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/audio/text2audio
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `prompt` | string | ✅ | A description of the audio you want |
| `negative_prompt` | string | ❌ | Audio you don't want |
| `duration` | float | ❌ | The audio length (seconds) |
| `callback_url` | string | ❌ | URL to receive the result |

### Example

```python
resp = requests.post(f"{BASE}/v1/audio/text2audio",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "prompt": "Heavy rain in a tropical forest, with distant thunder and frogs croaking",
        "negative_prompt": "human voices",
        "duration": 10.0
    }
)
```

---

## 2. Video to Audio — generate audio for a video

> Reference: [Video to Audio](https://kling.ai/document-api/apiReference%2Fmodel%2FvideoToAudio)

### What is this topic?

The AI analyzes the content of a video and generates appropriate accompanying audio automatically — e.g. if the video shows a person walking, the AI generates footstep sounds; if there's a sea, it generates wave sounds.

### What it's used for

- Add audio to a video that previously had none
- Add Sound Effects to an already-created AI video
- Supports both Kling videos and videos you upload yourself

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/audio/video2audio
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `video_id` | string | ✅ (or URL) | The video ID from Kling |
| `video_url` | string | ✅ (or ID) | The video URL |
| `prompt` | string | ❌ | Additional guidance |
| `negative_prompt` | string | ❌ | Audio you don't want |

### Cautions

> Kling supports **adding audio to videos created from any Kling model**, including videos uploaded by the user.

---

## 3. Text to Speech (TTS) — convert text to speech

> Reference: [Text to Speech](https://kling.ai/document-api/apiReference%2Fmodel%2FTTS)

### What is this topic?

Convert text into natural-sounding speech, with selectable voice, style, and speed. There are many voices to choose from (timbre).

### What it's used for

- Create a Voice Over for video
- Use with Avatar or Lip Sync
- Create an Audio Book or podcast

### API Endpoint

```
POST https://api-singapore.klingai.com/v1/audio/tts
```

### Main parameters

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `text` | string | ✅ | The text to convert to speech |
| `voice_id` | string | ❌ | The voice (timbre) ID to use |
| `speed` | float | ❌ | The speaking speed (normal = 1.0) |
| `volume` | float | ❌ | The volume level |

### Example

```python
resp = requests.post(f"{BASE}/v1/audio/tts",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "text": "Hello, welcome to the world of Kling AI, your AI creative assistant",
        "voice_id": "female_warm_01",
        "speed": 1.0
    }
)
```

---

## 4. Voice Clone

> Reference: [Voice Clone](https://kling.ai/document-api/apiReference%2Fmodel%2FcustomVoices)

### What is this topic?

Upload a source voice, and the system creates a "Custom Voice" that sounds like the source. Then use that Custom Voice with TTS or Avatar.

### What it's used for

- Make the AI speak in your own voice (a Brand Voice)
- Do dubbing with a familiar voice
- Create a Digital Twin of a voice

### How to use it

**Step 1: Create a Custom Voice**

```
POST https://api-singapore.klingai.com/v1/audio/voice-clone
```

| Parameter | Type | Required | Description |
|------------|--------|--------|---------|
| `voice_name` | string | ✅ | A name for this Custom Voice |
| `audio_url` | string | ✅ | The URL of the source audio (should be 30–120 seconds, clear) |

**Step 2: Use the Custom Voice in TTS**

After creating it, you get a `voice_id` to put in the TTS `voice_id` parameter.

### Cautions

- The source audio should be good quality with no noise
- Suitable audio length: 30 seconds to 2 minutes
- Don't use someone else's voice without permission
- A created Custom Voice is stored per the account policy (usually kept 30 days)
