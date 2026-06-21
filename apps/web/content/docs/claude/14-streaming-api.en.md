---
title: "Streaming API — receive the Response in real time"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Learn how to use streaming to display results in real time — the types of events, implementation in Python/TypeScript, and best practices"
readTime: "8 min"
readers: "0"
locked: false
order: 14
---

## What is Streaming?

Normally when you call the Claude API (an interface between programs), you must wait for Claude to generate the entire answer before receiving the response all at once.

**Streaming** (sending data piece by piece continuously — instead of waiting for it to finish then sending it all at once) is receiving the response **piece by piece** (incremental), letting the user see the text appear word by word, sentence by sentence, without a long wait, feeling like Claude is actually "typing."

---

## Why you should use Streaming

- **Better UX (user experience)** — users see results faster, without waiting on a blank screen
- **Lower time-to-first-token** — receive the first character within a few seconds
- **Long responses** — for long answers, streaming is essential
- **Real-time applications** — good for chatbots, code generation, live translation

---

## How to enable Streaming

Add `"stream": true` to the API request (or use the SDK — a ready-made developer toolkit — method `.stream()`)

### Python SDK

```python
import anthropic

client = anthropic.Anthropic()

# Method 1: use the context manager (recommended)
with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short story about AI"}],
    model="claude-opus-4-8",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Method 2: use raw streaming events
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
) as stream:
    for event in stream:
        print(event)
```

### TypeScript/JavaScript SDK

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Method 1: text stream
const stream = client.messages.stream({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a poem" }],
});

// Listen for text events
stream.on("text", (text) => {
  process.stdout.write(text);
});

// Wait for completion
const finalMessage = await stream.finalMessage();
console.log("\nUsage:", finalMessage.usage);
```

### cURL

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-4-8",
    "max_tokens": 1024,
    "stream": true,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## Types of Streaming Events

Streaming uses the **Server-Sent Events (SSE)** (a protocol for continuously sending data one-way from server to browser) format. Each event has an `event:` and a `data:` field.

### All Event Types

| Event Type | Description |
|-----------|---------|
| `message_start` | Start of a new message, with metadata (extra info about the message) |
| `content_block_start` | Start of a new content block (text, tool_use, thinking) |
| `content_block_delta` | Additional data sent (text_delta, input_json_delta, thinking_delta) |
| `content_block_stop` | End of a content block |
| `message_delta` | An update to the message (stop_reason, usage) |
| `message_stop` | The message is complete |
| `ping` | A keepalive signal (a signal that the connection is still alive) |
| `error` | An error occurred |

### Example of Raw Events

```
event: message_start
data: {"type":"message_start","message":{"id":"msg_01...","type":"message","role":"assistant","content":[],"model":"claude-opus-4-8","stop_reason":null,"usage":{"input_tokens":10,"output_tokens":1}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" there"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":15}}

event: message_stop
data: {"type":"message_stop"}
```

---

## Streaming with Tool Use

When using streaming together with tool use (function calling), you get additional events:

```python
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[weather_tool],
    messages=[{"role": "user", "content": "What's the weather in Bangkok?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if hasattr(event.content_block, "type"):
                if event.content_block.type == "tool_use":
                    print(f"Claude is calling the tool: {event.content_block.name}")
        
        elif event.type == "content_block_delta":
            if event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
            elif event.delta.type == "input_json_delta":
                print(f"[Tool input]: {event.delta.partial_json}", end="")
```

---

## Streaming with Extended Thinking

For models that support extended thinking (Claude shows its internal thinking process before answering):

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Solve this math problem..."}],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Claude is thinking
                print(f"[THINKING]: {event.delta.thinking}", end="")
            elif event.delta.type == "text_delta":
                # Claude is answering
                print(event.delta.text, end="", flush=True)
```

---

## Implementing Streaming in a Web Application

### Node.js / Express

```javascript
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const client = new Anthropic();

app.get('/stream', async (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [{ role: 'user', content: req.query.message }],
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  });

  stream.on('finalMessage', (message) => {
    res.write(`data: ${JSON.stringify({ done: true, usage: message.usage })}\n\n`);
    res.end();
  });
});
```

### Next.js API Route (App Router)

```typescript
// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { message } = await req.json();

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const stream = client.messages.stream({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
      });

      stream.on("text", (text) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      });

      await stream.finalMessage();
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
```

### Frontend JavaScript (EventSource — the SSE receiver in the browser)

```javascript
const eventSource = new EventSource('/stream?message=Hello');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.done) {
    eventSource.close();
    console.log('Stream complete');
    return;
  }
  
  // Display the text piece by piece
  document.getElementById('output').textContent += data.text;
};

eventSource.onerror = () => {
  console.error('Stream error');
  eventSource.close();
};
```

---

## Error Handling in Streaming

```python
import anthropic

client = anthropic.Anthropic()

try:
    with client.messages.stream(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            
except anthropic.APIConnectionError:
    print("The connection was dropped")
    
except anthropic.RateLimitError:
    print("Rate Limit exceeded, please try again later")
    
except anthropic.APIStatusError as e:
    print(f"API Error: {e.status_code} - {e.message}")
```

---

## Streaming vs Non-Streaming

| Aspect | Streaming | Non-Streaming |
|------|-----------|---------------|
| Time to first token | Fast (seconds) | Slow (wait for complete) |
| User experience | Much better | Feels slow |
| Implementation | More complex | Simpler |
| Price | Same | Same |
| Good for | Chatbots, live apps | Batch processing |

---

## Best Practices

### 1. Handle Connection Errors

Network connections may drop during a stream; you should have retry logic.

### 2. Show Loading State

Show a "thinking..." indicator before the first token arrives.

### 3. Buffer the text

For smooth rendering, you may buffer (temporarily hold) text a bit before updating the UI.

### 4. Handle Stop Reasons

Check `stop_reason` in the `message_delta` event:
- `end_turn` — Claude finished answering
- `max_tokens` — reached max_tokens; you must catch this case
- `tool_use` — Claude wants to call a tool

### 5. Cleanup

Always close the stream when done or on error:

```python
stream = client.messages.stream(...)
try:
    for text in stream.text_stream:
        process(text)
finally:
    stream.close()  # always close
```

---

## Summary

Streaming is essential for user-facing applications using Claude:

- Use the SDK method `.stream()` or the context manager `with client.messages.stream() as stream:`
- Handle events: `text`, `content_block_delta`, `message_delta`, `message_stop`
- For web apps, use the Server-Sent Events (SSE) pattern (a one-way server-to-client data-sending pattern)
- The price is the same as non-streaming, but the UX is much better
