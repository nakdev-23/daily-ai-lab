---
title: "SDK Usage — using the xAI SDK and OpenAI SDK"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "xAI supports 2 main SDKs — the purpose-built xAI SDK, and an OpenAI-compatible SDK you can use with your existing code right away, in both Python and JavaScript."
readTime: "6 min"
readers: "0"
locked: false
order: 14
---
# SDK Usage — using the xAI SDK and OpenAI SDK

> Reference: [Quickstart](https://docs.x.ai/docs) | [xAI SDK (PyPI)](https://pypi.org/project/xai-sdk/) | [OpenAI SDK](https://github.com/openai/openai-python)

---

## Why two SDKs?

An **SDK** (Software Development Kit — a ready-made toolkit for developers that makes calling a service easier) is offered by xAI in 2 forms to suit every kind of developer:

| SDK | Good for | Highlight |
|---|---|---|
| **xAI SDK** (`xai-sdk`) | New projects using xAI directly | Most complete support for xAI features |
| **OpenAI SDK** (`openai`) | Existing projects already using OpenAI | Just change `base_url` and it works |
| **Vercel AI SDK** (`ai`) | Next.js / React apps | Supports Streaming and UI components |

---

## Python — xAI SDK

### Install

```bash
pip install xai-sdk
```

### Setting up the API Key

**API Key** (a secret code that verifies your identity — like a key that lets an app use a service):

```bash
# Set it via an Environment Variable (a value stored outside the code so the key doesn't leak)
export XAI_API_KEY="xai-..."

# or in a .env file
XAI_API_KEY=xai-...
```

### Basic example

```python
import xai_sdk
import os

client = xai_sdk.Client(api_key=os.environ["XAI_API_KEY"])

# Sync Chat (wait for the result immediately — unlike Async, which runs in parallel)
response = client.chat.create(
    model="grok-4.3",
    messages=[
        {"role": "system", "content": "You are an AI assistant that answers in English"},
        {"role": "user", "content": "Explain a Neural Network in simple terms"},
    ],
)
print(response.choices[0].message.content)
```

### Streaming

```python
import xai_sdk

client = xai_sdk.Client(api_key="YOUR_XAI_API_KEY")

# Streaming (receiving data continuously, piece by piece)
stream = client.chat.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "Tell me a short story"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### Async Support

**Async** (running without waiting — the program can do other work while waiting for a result):

```python
import asyncio
import xai_sdk

client = xai_sdk.AsyncClient(api_key="YOUR_XAI_API_KEY")

async def main():
    response = await client.chat.create(
        model="grok-4.3",
        messages=[{"role": "user", "content": "Hello"}],
    )
    print(response.choices[0].message.content)

asyncio.run(main())
```

---

## Python — OpenAI SDK (OpenAI-compatible)

### Install

```bash
pip install openai
```

### Setup

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",   # use your xAI API Key
    base_url="https://api.x.ai/v1",  # change only the base_url (the API's origin address)
)
```

> **Tip:** If you already use OpenAI, just change these 2 lines and you've moved to Grok instantly.

### Full example

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# --- Chat Completion (generating an answer from a conversation) ---
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {"role": "system", "content": "Answer briefly and concisely in English"},
        {"role": "user", "content": "How is Python better than JavaScript?"},
    ],
    temperature=0.7,
    max_tokens=500,
)
print(response.choices[0].message.content)
print(f"Tokens used: {response.usage.total_tokens}")

# --- Responses API (the newer format) ---
resp = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Summarize the advantages of TypeScript"}],
)
print(resp.output_text)
```

### Multi-turn Conversation

**Multi-turn** (multiple rounds of conversation — Grok remembers the earlier context):

```python
messages = [
    {"role": "system", "content": "You are a programming teacher"},
]

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})
    
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=messages,
    )
    
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message

# Talk over several rounds
print(chat("What is Python?"))
print(chat("How are List and Tuple different?"))
print(chat("Give me a real-world usage example"))
```

---

## JavaScript / TypeScript — OpenAI SDK

### Install

```bash
npm install openai
# or
yarn add openai
# or
pnpm add openai
```

### Basic example

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function main() {
  const response = await client.chat.completions.create({
    model: "grok-4.3",
    messages: [
      { role: "system", content: "You are an AI assistant that answers in English" },
      { role: "user", content: "Explain a REST API in simple terms" },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
```

### Streaming (TypeScript)

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function streamChat() {
  const stream = await client.chat.completions.create({
    model: "grok-4.3",
    messages: [{ role: "user", content: "Tell me the history of AI" }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
}

streamChat();
```

---

## JavaScript — Vercel AI SDK

Good for Next.js and React projects

### Install

```bash
npm install ai @ai-sdk/xai zod
```

### Server Component (Next.js App Router)

**App Router** (Next.js's new page-management system):

```typescript
// app/api/chat/route.ts
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: xai("grok-4.3"),
    system: "You are an AI assistant that answers in English",
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Client Component

```tsx
// components/ChatInterface.tsx
"use client";
import { useChat } from "ai/react";

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/chat" });

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && <div className="text-gray-400">Grok is typing...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
```

### generateText (no Streaming)

```typescript
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

const { text } = await generateText({
  model: xai("grok-4.3"),
  prompt: "Summarize the advantages of TypeScript in 3 points",
});

console.log(text);
```

---

## cURL — test the API directly

**cURL** (a command-line tool for sending HTTP requests to test an API):

```bash
curl https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4.3",
    "messages": [
      {
        "role": "user",
        "content": "Hi Grok! Introduce yourself"
      }
    ]
  }'
```

---

## Important Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | string | — | The Model name, e.g. `grok-4.3` |
| `messages` | array | — | Conversation history |
| `temperature` | float | 1.0 | Answer variety (0 = fixed, 2 = creative) |
| `max_tokens` | int | — | Max Tokens in the answer |
| `stream` | bool | false | Enable Streaming |
| `top_p` | float | 1.0 | Nucleus sampling (picking the highest-probability words by cumulative probability) |
| `frequency_penalty` | float | 0 | Reduce repetition |
| `presence_penalty` | float | 0 | Encourage new topics |

---

## Recommended Environment Variables

**Environment Variables** (values kept separate from the code for security):

```bash
# .env.local (for Next.js)
XAI_API_KEY=xai-your-api-key-here

# .env (Python)
XAI_API_KEY=xai-your-api-key-here
```

> **Security:** Never put your API Key directly in the code. Always use Environment Variables, and add `.env` to `.gitignore`.
