---
title: "Live API — build real-time audio and video AI"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "The Gemini Live API lets developers build apps that interact by voice and video in real time, good for voice assistants, live translation, and interactive AI"
readTime: "9 min"
readers: "0"
locked: false
order: 29
---

# Live API — build real-time audio and video AI

The **Gemini Live API** (a live API channel — for continuous voice and video interaction) is an API for building applications that interact with Gemini in real time through voice and video. Unlike the normal API, which sends a request and waits for a response, the Live API works as a continuous **streaming session** — like a phone call with the AI.

---

## What is the Live API?

The Live API is designed for:
- **Voice assistants** — AI that listens and speaks naturally
- **Real-time translation** — translating while speaking
- **Video analysis** — analyzing live video and responding
- **Interactive tutoring** — an interactive AI teacher
- **Customer service bots** — an AI call-center system

---

## Main abilities

### Supported input
- **Audio:** PCM 16-bit at 16kHz (a standard digital audio format)
- **Images:** JPEG, up to 1 frame/second
- **Text:** plain text

### Output
- **Audio:** PCM 24kHz (natural audio, higher quality than the input)
- **Text:** a transcript of both the user and the AI
- **Function calls:** call functions during the conversation

### Special features
- **70+ languages** including Thai
- **Barge-in:** the user can speak over it immediately (the AI stops to listen)
- **Affective dialog:** the AI adjusts its tone to the user's emotion
- **Live Translation:** translate speech in real time

---

## Models for the Live API

| Model | Properties |
|---|---|
| `gemini-2.5-flash-live` | Fast, stable, good for production |
| `gemini-3.1-flash-live` | Latest, better audio quality (Preview — still in testing) |

---

## Architecture: two connection types

### 1. Server-to-Server (recommended for production)
```
[Client App] → [Your Backend Server] → [Gemini Live API]
```
- The backend receives the audio stream from the client
- The backend connects to Gemini via WebSocket (a persistent connection protocol)
- **More secure** — the API key isn't exposed on the client
- Good for apps with many users

### 2. Client-to-Server (good for development)
```
[Client App] ──────────────→ [Gemini Live API]
```
- The client (the user-side app) connects directly to Gemini
- Must use an **Ephemeral Token** (a short-lived token — a code that expires quickly, for security) instead of an API key on the client
- Lower latency
- Good for prototypes and testing

---

## Code example: Basic Voice Session (Python)

```python
import asyncio
import pyaudio
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

async def voice_session():
    # Create a Live session
    async with client.aio.live.connect(
        model="gemini-2.5-flash-live",
        config={
            "response_modalities": ["AUDIO"],  # or ["TEXT"] or ["AUDIO", "TEXT"]
            "system_instruction": "You are an AI assistant that speaks Thai, answering short and clear"
        }
    ) as session:
        
        # Send the user's audio
        await session.send_realtime_input(
            audio={"data": audio_bytes, "mime_type": "audio/pcm;rate=16000"}
        )
        
        # Receive the response
        async for response in session.receive():
            if response.data:
                # Play the AI's audio
                play_audio(response.data)
            if response.text:
                print(f"AI: {response.text}")

asyncio.run(voice_session())
```

---

## Ephemeral Tokens (for Client-side)

For security, use an ephemeral token (a token that expires quickly) instead of the API key on the client:

```python
# Backend: create an ephemeral token
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# Create a token that expires in 1 minute
token_response = client.auth_tokens.create(
    config={
        "uses": 1,       # usable once
        "ttl": "60s"     # expires in 60 seconds
    }
)

ephemeral_token = token_response.name
# Send this token to the client
```

```javascript
// Client: use the ephemeral token
const ai = new GoogleGenAI({ apiKey: ephemeralToken });

const session = await ai.live.connect({
  model: "gemini-2.5-flash-live",
  config: { responseModalities: ["AUDIO"] }
});
```

---

## Live Translation

Real-time translation with Gemini 3.x:

```python
async with client.aio.live.connect(
    model="gemini-3.1-flash-live",
    config={
        "response_modalities": ["AUDIO"],
        "system_instruction": """
        You are a real-time interpreter
        When you hear English audio, translate it into Thai immediately
        When you hear Thai audio, translate it into English immediately
        """
    }
) as session:
    # Send audio from the microphone
    # Receive the translated audio back
    ...
```

---

## Function Calling in a Live Session

```python
tools = [{
    "function_declarations": [{
        "name": "get_weather",
        "description": "Get the weather",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"}
            }
        }
    }]
}]

async with client.aio.live.connect(
    model="gemini-2.5-flash-live",
    config={"tools": tools}
) as session:
    
    async for response in session.receive():
        if response.tool_call:
            # Gemini requests a function call
            func_name = response.tool_call.function_calls[0].name
            func_args = response.tool_call.function_calls[0].args
            
            # Run the function
            result = run_function(func_name, func_args)
            
            # Send the result back
            await session.send_tool_response(result)
```

---

## Managing the Session

### Control the turn
```python
# Tell Gemini the user has finished speaking
await session.send_realtime_input(audio_stream_end=True)
```

### Interrupt (Barge-in)
The Live API supports automatic barge-in — when the AI is talking and the user speaks over it, the AI stops immediately.

### Session Resumption (continuing a conversation from where it left off)
```python
# Save the session handle to resume
session_handle = session.session_resumption_handle

# In a new session
async with client.aio.live.connect(
    model="gemini-2.5-flash-live",
    config={"session_resumption": {"handle": session_handle}}
) as resumed_session:
    # Continue the conversation from where it left off
    ...
```

---

## Real use cases

| Use Case | Input | Output |
|---|---|---|
| Voice assistant | Audio | Audio + Text |
| Real-time translator | Audio | Audio (another language) |
| Video analysis | Video frames + Audio | Text/Audio |
| Interactive tutor | Audio + Images | Audio + Text |
| Customer service | Audio | Audio |
| Accessibility tool | Audio/Video | Text transcript |

---

## Differences from Gemini Live (in the Gemini App)

| | Gemini Live (App) | Live API |
|---|---|---|
| For | General users | Developers |
| Control | Limited | Full |
| Integrate into your own app | ✗ | ✓ |
| Custom system instruction (define the AI's personality) | ✗ | ✓ |
| Function calling | ✗ | ✓ |
| Build a voice app | ✗ | ✓ |
