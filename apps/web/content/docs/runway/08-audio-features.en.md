---
title: "Audio Features — audio and music with AI"
tool: "Runway"
icon: "tool-runway"
level: "intermediate"
summary: "Learn all of Runway's audio features — Text-to-Speech, Voice Cloning, Sound Effects, Voice Isolation, and Video Dubbing for creating audio for content"
readTime: "7 min"
readers: "0"
locked: false
order: 8
---

# Audio Features — audio and music with AI

> Runway has a complete audio system, from creating speech (Text-to-Speech) to Voice Isolation and Dubbing — all using AI.

---

## Audio features in Runway

Runway uses audio technology from **ElevenLabs** (a leading AI audio company) along with its own models.

### List of audio features:
1. **Text-to-Speech** (TTS) — convert text into speech
2. **Voice Cloning** — create a voice that sounds like a real one
3. **Sound Effects** — create environmental and accompanying sounds
4. **Voice Isolation** — separate a person's voice from noise
5. **Voice Dubbing** — change the voice in a video
6. **Speech-to-Speech** — convert speech to another speech style
7. **Custom Voices** — for API developers

---

## 1. Text-to-Speech (TTS)

**Text-to-Speech** (converting text into speech) creates speech from typed text.

**Price:** 1 credit per 50 characters (very economical)

### How to use it:
1. Go to Audio Tools or Voice in the menu
2. Type the text you want read
3. Choose the Voice you want
4. Adjust the Speed and Tone
5. Click Generate

### Choose from many voices:
- Male/female voices
- Many language accents
- Tones: Professional, Casual, Warm, Authoritative

---

## 2. Voice Cloning

**Voice Cloning** (creating a voice that sounds like a source voice) lets you create a voice with characteristics like a given voice.

**Available via API only (for developers)**

**Important note:** You must have rights to the source voice used; don't clone others' voices without permission.

---

## 3. Sound Effects

**Sound Effects** (accompanying scene sounds) use AI to create accompanying sound from a description.

Examples:
```
Heavy rain on a window, distant thunder

Crowd cheering at a football stadium

Spaceship engine humming
```

---

## 4. Voice Isolation

**Voice Isolation** (separating a person's voice from noise) uses AI to separate speech from unwanted Background sound.

**Price:** 1 credit per 6 seconds

**Use when:**
- Recording audio in a noisy place
- You want to separate speech from music
- Cleaning up interview audio with noise

**How to use it:**
1. Upload an audio or video file
2. Choose **"Voice Isolation"**
3. Click Process
4. Download the isolated audio

---

## 5. Video Dubbing

**Video Dubbing** (changing or adding audio in a video) lets you change the audio in a video while preserving lip movement.

**Price:** 1 credit per 2 seconds

**Usage examples:**
- Translate an English video into Thai with Thai audio
- Change the spoken voice in a video
- Add audio to a video with none

---

## 6. Speech-to-Speech

**Speech-to-Speech** (converting speech into another speech style) takes source speech and converts it to a new voice as specified.

**Use when:**
- You want your own voice to sound more professional
- Change the Accent
- Make the voice match a character

---

## Audio in Veo3 — video with audio

**Veo3** and **Veo3.1** (Google's video-generation models available in the Runway API) support creating videos **with audio** in one go.

**Veo3 pricing:**
- With audio: 40 credits/second
- Without audio: 20 credits/second

---

## Examples of using Audio Features in real work

### Create an Explainer Video
1. Create a video with Gen-4.5 (no audio)
2. Write a Script
3. Use TTS to create speech from the Script
4. Combine the video and audio with an editing program

### Podcast / Educational Audio
1. Write the content
2. Use TTS to create audio reading the content
3. Add accompanying Sound Effects

### Translate a foreign video
1. Use Voice Isolation to separate the speech
2. Translate the script
3. Use TTS to create audio in the new language
4. Use Video Dubbing to insert the new audio into the video

---

## Audio price comparison

| Feature | Price |
|---|---|
| Text-to-Speech | 1 credit / 50 characters |
| Voice Dubbing | 1 credit / 2 seconds |
| Voice Isolation | 1 credit / 6 seconds |
| Sound Effects | per generation |
| Veo3 (with audio) | 40 credits / second |
| Veo3 (no audio) | 20 credits / second |

---

## Audio usage tips

- **TTS:** add punctuation to the text so the voice pauses correctly
- **Voice Isolation:** the better the source audio, the better the result — audio recorded in a quiet room works best
- **Dubbing:** the translated text should be close in length to the original so the lips move consistently

---

## Summary

Runway's audio features open the chance to create complete video content without relying on voice actors or expensive recording equipment. Whether creating speech, removing noise, or completely re-dubbing a video, it can all be done from the browser.
