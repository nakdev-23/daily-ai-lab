---
title: "Streaming Responses — get results in real time"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Streaming lets your app show text from Grok instantly, token by token, instead of waiting for the full answer first — a big UX improvement."
readTime: "5 min"
readers: "0"
locked: false
order: 13
---
# Streaming Responses — get results in real time

> Reference: [Responses API](https://docs.x.ai/docs) | [xAI API Reference](https://docs.x.ai/api-reference)

---

## What is Streaming?

Normally when you call the Grok API, your app has to **wait until Grok finishes the entire answer** and then receives a single Response.

**Streaming** (receiving data continuously, piece by piece — like watching a video online instead of downloading it first) changes this so Grok **sends each Token (a chunk of text — about 1 word or 3–4 characters; AI counts words as tokens) one at a time as soon as it's generated**, over the **SSE — Server-Sent Events** protocol (a way to push data continuously from a server to a browser).

### Comparison

| | Normal (Non-streaming) | Streaming |
|---|---|---|
| How you receive data | Wait until done, then receive once | Receive each token instantly |
| UX | The user waits idly | The user sees text being typed out |
| Good for | Background jobs, Batch | Chatbot, Interactive UI |
| Perceived Latency (the wait before the first result) | High | Very low |

---

## Enable Streaming

Just add `stream=True` to the request — that's it:

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Enable Streaming with stream=True
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Explain Quantum Computing in simple terms"}],
    stream=True,
)

# Loop, receiving each token
for event in stream:
    if hasattr(event, "delta") and event.delta:
        print(event.delta, end="", flush=True)

print()  # newline when done
```

### Python (xAI SDK)

```python
import xai_sdk

client = xai_sdk.Client(api_key="YOUR_XAI_API_KEY")

async def stream_response():
    async with client.chat.sample_async(
        model="grok-4.3",
        messages=[{"role": "user", "content": "Tell me a short story"}],
        stream=True,
    ) as response:
        async for chunk in response:
            print(chunk.text, end="", flush=True)
```

### JavaScript (OpenAI SDK)

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function streamResponse() {
  const stream = await client.responses.create({
    model: "grok-4.3",
    input: [{ role: "user", content: "Explain Blockchain in simple terms" }],
    stream: true,
  });

  for await (const event of stream) {
    if (event.delta) {
      process.stdout.write(event.delta);
    }
  }
  console.log(); // newline
}

streamResponse();
```

### JavaScript (Vercel AI SDK)

```javascript
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

const { textStream } = await streamText({
  model: xai("grok-4.3"),
  prompt: "Explain Machine Learning in English",
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```

---

## Types of Events in a Stream

When using Streaming, Grok sends several types of events (signals emitted during processing):

| Event Type | Description |
|---|---|
| `response.created` | Stream begins |
| `response.output_text.delta` | A new Token was generated |
| `response.output_text.done` | The Output text is complete |
| `response.reasoning.delta` | A Reasoning token (the analysis — for Thinking mode) |
| `response.done` | The whole Response is complete |

### Example: handling every type of Event

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Analyze Thailand's economic trends"}],
    stream=True,
)

reasoning_text = ""
output_text = ""

for event in stream:
    event_type = event.type
    
    if event_type == "response.reasoning.delta":
        # Grok is thinking (you don't have to show this to the user)
        reasoning_text += event.delta
        
    elif event_type == "response.output_text.delta":
        # The real answer text — show it to the user
        output_text += event.delta
        print(event.delta, end="", flush=True)
        
    elif event_type == "response.done":
        print("\n--- end of answer ---")
        print(f"Reasoning tokens: {len(reasoning_text.split())}")
```

---

## Streaming with Tools

Streaming also works together with Tools (add-on tools Grok can call, e.g. web search):

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Latest news about AI in Thailand?"}],
    tools=[{"type": "web_search"}],
    stream=True,
)

for event in stream:
    if hasattr(event, "type"):
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
        elif event.type == "response.tool_call.delta":
            # searching the web
            print(f"\n[searching: {event.delta}]", end="")
```

---

## Streaming in Next.js / React

```typescript
// app/api/chat/route.ts
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: xai("grok-4.3"),
    messages,
  });

  return result.toDataStreamResponse();
}
```

```tsx
// components/Chat.tsx
"use client";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

---

## Verbose Streaming — see Tokens in detail

For advanced Debug (finding bugs in your code) or Monitor (watching the system), you can enable `verbose` to see the details of every Token:

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Hello"}],
    stream=True,
    stream_options={"include_usage": True},  # include Usage data in the Stream
)

for event in stream:
    print(event)  # print every event with its metadata
```

---

## Cautions

- **Same cost** — Streaming costs no extra; it's priced the same as Non-streaming
- **You must read the Stream to the end** — closing the connection midway can cause an error
- **Timeout** (the connection's expiry time) — set a long enough timeout, since a Streaming response takes longer
- **Structured Output with Streaming** — use `.stream()` instead of `.parse()` when you want streamed JSON
