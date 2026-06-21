---
title: "Advanced API Usage"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "The Batch API lets you send many Requests at once and wait for results asynchronously, instead of waiting one at a time. The upside: 20–50% cheaper, gr"
readTime: "5 min"
readers: "0"
locked: false
order: 11
---
# Advanced API Usage

> Reference: [Batch API](https://docs.x.ai/developers/advanced-api-usage/batch-api) | [Deferred Completions](https://docs.x.ai/developers/advanced-api-usage/deferred-chat-completions) | [Context Compaction](https://docs.x.ai/developers/advanced-api-usage/context-compaction) | [mTLS Authentication](https://docs.x.ai/developers/advanced-api-usage/mtls) | [Async Requests](https://docs.x.ai/developers/advanced-api-usage/async) | [WebSocket Mode](https://docs.x.ai/developers/advanced-api-usage/websocket-mode)

---

## Batch API — high-volume processing on a budget

Reference: [Batch API](https://docs.x.ai/developers/advanced-api-usage/batch-api)

### What is this topic?
The Batch API lets you send many Requests at once and wait for results asynchronously, instead of waiting one Request at a time. The upside: **20–50% cheaper** — good for work that doesn't need instant results.

### What is it used for?
- Analyze thousands of documents
- Translate large amounts of text
- Bulk content generation
- Evaluate/Classify large datasets

### Comparison

| | Real-time API | Batch API |
|---|---|---|
| Price | Standard price | **20–50% off** |
| Response time | Instant (seconds) | Within 24 hours |
| Rate Limit | Counted | **Not counted** |
| Good for | Need it now | Saving cost |

### How to use it

**Step 1: Create the Batch file (.jsonl)**
```jsonl
{"custom_id": "req-1", "method": "POST", "url": "/v1/responses", "body": {"model": "grok-4.3", "input": [{"role": "user", "content": "Summarize this article: ..."}]}}
{"custom_id": "req-2", "method": "POST", "url": "/v1/responses", "body": {"model": "grok-4.3", "input": [{"role": "user", "content": "Translate to English: ..."}]}}
```

**Step 2: Upload and create the Batch**
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Upload the Batch file
with open("batch_requests.jsonl", "rb") as f:
    batch_file = client.files.create(file=f, purpose="batch")

# Create the Batch Job
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/responses",
    completion_window="24h",
)

print(f"Batch ID: {batch.id}")
print(f"Status: {batch.status}")
```

**Step 3: Check and fetch the results**
```python
import time

# Wait until done
while True:
    batch_status = client.batches.retrieve(batch.id)
    if batch_status.status == "completed":
        break
    print(f"Processing... {batch_status.status}")
    time.sleep(60)

# Fetch the results
output_file = client.files.content(batch_status.output_file_id)
results = output_file.text.split("\n")
```

### Cautions
- The Batch API supports only Text/Language Models (not Image/Video)
- The discount covers every Token type: Input, Output, Cached, Reasoning

---

## Deferred Completions — send a request to be picked up later

Reference: [Deferred Completions](https://docs.x.ai/developers/advanced-api-usage/deferred-chat-completions)

### What is this topic?
Like the Batch API but for a single Request — send the Request first, then come back to fetch the result when it's ready. Good when a Request takes a very long time (e.g. deep Reasoning).

### How to use it

```python
# Send a Deferred Request
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Analyze this data in detail..."}],
    reasoning={"effort": "high"},
    deferred=True,  # tells it not to wait
)

request_id = response.id

# Fetch the result later
final = client.responses.retrieve(request_id)
print(final.output_text)
```

---

## Context Compaction — compress a long Context

Reference: [Context Compaction](https://docs.x.ai/developers/advanced-api-usage/context-compaction)

### What is this topic?
When a conversation gets so long the Context Window fills up, Context Compaction automatically summarizes the conversation history so you can keep talking without wasting Tokens.

### What is it used for?
- Very long conversation Sessions
- Agents that run for many hours
- Grok Build doing long Coding work

### How to enable it

```python
response = client.responses.create(
    model="grok-4.3",
    input=messages,
    context_compaction={"enabled": True},
)
```

---

## mTLS Authentication — high-grade security

Reference: [mTLS Authentication](https://docs.x.ai/developers/advanced-api-usage/mtls)

### What is this topic?
**mTLS (Mutual TLS)** is two-way authentication — both the Server and the Client must present a Certificate before communicating. It's safer than using just an API Key.

### What is it used for?
- Enterprises that need maximum security
- Systems with strict Compliance requirements
- Preventing API Key leaks

### How to set it up

```python
import httpx
from openai import OpenAI

# Load the Client Certificate
http_client = httpx.Client(
    cert=("path/to/client.crt", "path/to/client.key"),
    verify="path/to/ca.crt",
)

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
    http_client=http_client,
)
```

---

## Async Requests — sending requests asynchronously

Reference: [Async Requests](https://docs.x.ai/developers/advanced-api-usage/async)

### What is this topic?
Use `async/await` in Python to send several Requests at once instead of waiting for one at a time, making your app much faster when there are many jobs.

### How to use it

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

async def analyze_text(text: str):
    response = await client.responses.create(
        model="grok-4.3",
        input=[{"role": "user", "content": f"Analyze: {text}"}],
    )
    return response.output_text

async def main():
    texts = ["Text 1...", "Text 2...", "Text 3..."]
    
    # Send every Request at once
    results = await asyncio.gather(*[analyze_text(t) for t in texts])
    
    for i, result in enumerate(results):
        print(f"Result {i+1}: {result}")

asyncio.run(main())
```

---

## WebSocket Mode — a continuous connection

Reference: [WebSocket Mode](https://docs.x.ai/developers/advanced-api-usage/websocket-mode)

### What is this topic?
Instead of sending an HTTP Request every time, WebSocket Mode uses a Persistent Connection — good for apps that need very low Latency.

### What is it used for?
- Voice Agent (real-time audio)
- A chatbot that must respond very fast
- Real-time Collaboration Tools

### How to use it (Python example)

```python
import asyncio
import websockets
import json

async def connect():
    uri = "wss://api.x.ai/v1/ws"
    headers = {"Authorization": f"Bearer YOUR_XAI_API_KEY"}
    
    async with websockets.connect(uri, extra_headers=headers) as ws:
        # Send a message
        await ws.send(json.dumps({
            "type": "message",
            "model": "grok-4.3",
            "content": "Hello Grok"
        }))
        
        # Receive results as Streaming
        async for message in ws:
            data = json.loads(message)
            if data["type"] == "content_delta":
                print(data["delta"], end="", flush=True)
            elif data["type"] == "done":
                break

asyncio.run(connect())
```

---

## Prompt Caching — cut the cost of repeated Prompts

### What is this topic?
When you send the same Prompt many times (e.g. a long, identical System Prompt), xAI Caches that Prompt and charges a lower price.

### Cached Input price
- **$0.20 / 1M tokens** (about 6× cheaper than normal)

### How it works
xAI does the Caching automatically when it sees the same Prompt frequently — no special setup needed.

---

## Docs MCP

Reference: [Docs MCP](https://docs.x.ai/developers/docs-mcp)

### What is this topic?
xAI provides an **MCP Server for Documentation** — letting other AIs search and read xAI docs directly via the MCP Protocol.

### What is it used for?
- Let Claude, Cursor, or any MCP-capable IDE read the xAI Docs instantly
- Build a chatbot that knows the xAI API

### URL for the MCP Server
```
https://docs.x.ai/mcp
```

---

## Cost Tracking

Reference: [Cost Tracking](https://docs.x.ai/developers/cost-tracking)

### What is this topic?
See the cost per Request at the Token level — how much each part uses.

### Read the data from the Response

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Hello"}],
)

usage = response.usage
print(f"Input tokens: {usage.input_tokens}")
print(f"Output tokens: {usage.output_tokens}")
print(f"Reasoning tokens: {usage.reasoning_tokens}")
print(f"Cached tokens: {usage.cached_tokens}")
```

### View the Dashboard
See your total cost at [console.x.ai/team/default/billing](https://console.x.ai/team/default/billing)

---

## Debugging Errors

Reference: [Debugging Errors](https://docs.x.ai/developers/debugging)

### Common Errors

| HTTP Code | Meaning | How to fix |
|---|---|---|
| `400` | Bad Request | Check the Parameters you sent |
| `401` | Unauthorized | Check the API Key |
| `403` | Forbidden | Check access permissions |
| `429` | Rate Limit Exceeded | Wait and retry, use Exponential Backoff |
| `500` | Internal Server Error | Retry; if it persists, contact Support |

### Community Integrations

Reference: [Community Integrations](https://docs.x.ai/developers/community)

There are Libraries and Tools from the Community that support the xAI API, e.g. LangChain, LlamaIndex, VercelAI and others. See the list at [docs.x.ai/developers/community](https://docs.x.ai/developers/community)
