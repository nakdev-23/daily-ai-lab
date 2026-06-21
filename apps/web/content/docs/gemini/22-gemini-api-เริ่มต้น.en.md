---
title: "Gemini API — getting started for developers"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "A getting-started guide to the Gemini API for developers, covering getting an API key, installing the SDK, calling models, and the basics you should know"
readTime: "10 min"
readers: "0"
locked: false
order: 22
---

# Gemini API — getting started for developers

The **Gemini API** (a program-connection channel — like a bridge that lets your app talk to Gemini) is the interface for developers who want to use Gemini's abilities to build their own applications, whether a chatbot, a data-analysis tool, an automated AI system, or anything else.

---

## Why use the Gemini API?

- **Full control** — choose the model, adjust parameters (settings), define the system instruction (a system-level instruction telling the AI what to be)
- **Integrate it into your app** — build AI features into your own product
- **Use advanced features** — Function calling, Context caching, Grounding (anchoring to real data), Thinking (deep reasoning)
- **Scalable** — Batch processing, flexible rate limits
- **Start free** — Google AI Studio gives a free quota (the number of uses allowed) for development

---

## Step 1: Get an API Key (an API access code)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with a Google account
3. Click **"Get API key"** or **"Create API key"**
4. Choose a Google Cloud project (or create a new one)
5. Copy the API key to a safe place

> **Caution:** Don't write the API key directly in code; use environment variables (variables that store important values outside the code) instead.

```bash
# Example of setting an environment variable
export GEMINI_API_KEY="your_api_key_here"
```

---

## Step 2: Install the SDK (the developer toolkit)

### Python (recommended for beginners)
```bash
pip install -q -U google-genai
```
Requires Python 3.9+

### JavaScript / Node.js
```bash
npm install @google/genai
```
Requires Node.js v18+

### Go
```bash
go get google.golang.org/genai
```

### REST API (no installation)
Use `curl` or any HTTP client (a program that sends web requests); no SDK needed.

---

## Step 3: Make your first API call

### Python
```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain what Machine Learning is, in Thai"
)

print(response.text)
```

### JavaScript
```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Explain what Machine Learning is, in Thai",
});

console.log(response.text);
```

### REST (curl)
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "Explain Machine Learning"}]}]}'
```

---

## Available models

### Models for Text & Multimodal

| Model | Strength | Good for |
|---|---|---|
| `gemini-2.5-pro` | Smartest, good reasoning | Complex work, in-depth analysis |
| `gemini-2.5-flash` | Best price-performance | General work, low latency |
| `gemini-2.5-flash-lite` | Fastest and cheapest | High-volume work |

### Specialized models

| Model | Used for |
|---|---|
| `imagen-4.0-generate-001` | Create images |
| `veo-3` | Create video |
| `gemini-embedding-2` | Create embedding vectors (converting text to numbers to search by meaning) |
| `gemini-2.5-flash-live` | Live API (audio/video streaming) |

---

## Basic structure: Content and Parts

The Gemini API uses a `Content` and `Part` structure to send data:

```python
# Plain text
contents = "Hello Gemini"

# Several parts (text + image)
contents = [
    {
        "parts": [
            {"text": "What's in this image?"},
            {"inline_data": {"mime_type": "image/jpeg", "data": base64_image}}
        ]
    }
]

# A conversation (multi-turn)
contents = [
    {"role": "user", "parts": [{"text": "Hello"}]},
    {"role": "model", "parts": [{"text": "Hello, how can I help?"}]},
    {"role": "user", "parts": [{"text": "Tell me a joke"}]},
]
```

---

## Important parameters

### Generation Config (settings controlling answer generation)
```python
config = {
    "temperature": 0.7,        # creativity (0 = deterministic, 2 = highly creative)
    "top_p": 0.95,             # Nucleus sampling (sampling from high-probability words)
    "top_k": 40,               # Top-k sampling (choose from the top k words)
    "max_output_tokens": 8192, # max number of tokens (pieces of text) in the answer
    "stop_sequences": ["\n\n"] # stop when this sequence is found
}
```

### System Instruction (a system-level instruction — defining the AI's personality and behavior)
```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    config={
        "system_instruction": "You are an AI assistant that always answers in Thai, using polite, professional language"
    },
    contents="Explain REST API"
)
```

---

## Streaming (receive the answer in real time — piece by piece)

Instead of waiting for the whole answer, you can receive it piece by piece — like live typing:

```python
for chunk in client.models.generate_content_stream(
    model="gemini-2.5-flash",
    contents="Write a long article about AI"
):
    print(chunk.text, end="", flush=True)
```

---

## Multi-turn Chat (multiple rounds — the AI remembers context continuously)

```python
chat = client.chats.create(model="gemini-2.5-flash")

response1 = chat.send_message("Hi, my name is Nook")
print(response1.text)

response2 = chat.send_message("What is my name?")
print(response2.text)  # Gemini remembers the name "Nook"
```

---

## Pricing and the free quota

### Free use through Google AI Studio
- **gemini-2.5-flash**: 15 requests/minute, 1,500 requests/day
- **gemini-2.5-pro**: 2 requests/minute, 50 requests/day

### Paid use (Pay-as-you-go)
- Charged by input and output tokens (pieces of text)
- Pricing differs by model
- See the latest pricing at [ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## Google AI Studio — a playground for developers

[AI Studio](https://aistudio.google.com) is a web-based tool (used in a browser) for:
- Testing prompts without coding
- Adjusting model settings visually (seeing results instantly)
- Viewing the token count
- Exporting to Python/JavaScript/curl code instantly
- Managing API keys

---

## Next steps

After getting started, you should learn:
- **Function Calling** — connect Gemini to your APIs/tools
- **Context Caching** — reduce cost for reused content
- **Grounding with Search** — pull real-time data from Google Search
- **Thinking Mode** — turn on reasoning mode for complex problems
- **Structured Output** — receive answers in a custom JSON (a standard data format) format
