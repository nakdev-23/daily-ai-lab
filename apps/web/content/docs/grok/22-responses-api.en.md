---
title: "Responses API — the new recommended API for developers"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "The Responses API is xAI's new API supporting Stateful conversations, Tools, Structured Outputs, and Streaming in one place — different from the old Chat Completions."
readTime: "6 min"
readers: "0"
locked: false
order: 22
---
# Responses API — the new recommended API for developers

> Reference: [xAI Responses API](https://docs.x.ai/docs) | [API Reference](https://docs.x.ai/api-reference)

---

## What is the Responses API?

The **Responses API** is xAI's new API (an interface between programs) designed to replace the old Chat Completions API.

### Key differences

| Feature | Chat Completions | Responses API |
|---|---|---|
| Endpoint (destination address) | `/v1/chat/completions` | `/v1/responses` |
| Input format | `messages` array | `input` array |
| Output | `choices[0].message.content` | `output_text` |
| Tools (add-on tools) | Supported | Supported + more |
| Stateful (remembers the conversation) | No (you send the history yourself) | Supports `previous_response_id` |
| Structured Output | `response_format` | `text_format` (Pydantic/Zod) |
| Reasoning | None | `reasoning` parameter |
| Context Compaction | None | `context_compaction` |

---

## Getting started with the Responses API

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Responses API — the new format
response = client.responses.create(
    model="grok-4.3",
    input=[
        {"role": "system", "content": "You are an AI assistant that answers in English"},
        {"role": "user", "content": "Explain Microservices in simple terms"},
    ],
)

# Get the answer text directly
print(response.output_text)
```

### Compared to Chat Completions (the old format)

```python
# Chat Completions — the old format (still works)
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {"role": "system", "content": "You are an AI assistant that answers in English"},
        {"role": "user", "content": "Explain Microservices in simple terms"},
    ],
)
print(response.choices[0].message.content)  # you have to dig deeper
```

---

## Stateful Conversations — remembering the conversation

**Stateful** (having state — the system remembers what was said earlier, unlike Stateless, which forgets every time). The main highlight of the Responses API is that xAI stores the conversation history for you:

```python
# Send the first message
response1 = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "My name is Somchai"}],
)

first_id = response1.id
print(response1.output_text)
# "Hello, Somchai..."

# Send a follow-up message — no need to resend the history!
response2 = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "What's my name?"}],
    previous_response_id=first_id,  # reference the previous response
)

print(response2.output_text)
# "Your name is Somchai"
```

### Compared to the old way (you send the history yourself)

```python
# The old way — you manage the history yourself
messages = []

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=messages,
    )
    assistant_msg = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_msg})
    return assistant_msg
```

---

## New Parameters in the Responses API

### Reasoning — control the depth of thinking

**Reasoning** (deep analytical thinking — the AI takes time to "think" before answering, good for hard problems):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "Solve: if f(x) = x² + 3x - 10, find the x where f(x) = 0"
    }],
    reasoning={
        "effort": "high",  # "low" | "medium" | "high"
    },
)
```

| effort | Time taken | Good for |
|---|---|---|
| `low` | Fast | Easy questions, needing low latency |
| `medium` | Moderate | General questions (default) |
| `high` | Slow but accurate | Complex problems, Coding, Math |

### Context Compaction — manage the Context Window automatically

**Context Window** (the maximum number of tokens the AI can remember in one conversation) and **Context Compaction** (automatic context summarization — when a conversation gets too long):

```python
# Enable Context Compaction for long conversations
response = client.responses.create(
    model="grok-4.3",
    input=long_conversation_messages,
    context_compaction={"enabled": True},
)
```

### Max Output Tokens

**Max Output Tokens** (the max number of tokens in the answer — controls the length of the result):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Write an Essay about AI"}],
    max_output_tokens=2000,  # limit the output
)
```

---

## Output Parsing

**Output Parsing** (parsing the result — pulling each type of data out of the response):

The Responses API has several output types:

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Explain 3 things"}],
    tools=[{"type": "web_search"}],
)

# Loop through all the output items
for item in response.output:
    print(f"Type: {item.type}")
    
    if item.type == "message":
        # A normal answer message
        print(f"Content: {item.content[0].text}")
    
    elif item.type == "web_search_call":
        # Grok called Web Search
        print(f"Search query: {item.query}")
    
    elif item.type == "function_call":
        # Grok wants to call a Function (an external function)
        print(f"Function: {item.name}({item.arguments})")

# Or get the text output directly
print(response.output_text)  # shorthand for text only
```

---

## Usage Tracking

**Usage Tracking** (tracking usage — seeing how many tokens you used):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Hello"}],
)

usage = response.usage
print(f"Input tokens: {usage.input_tokens}")
print(f"Output tokens: {usage.output_tokens}")
print(f"Reasoning tokens: {usage.reasoning_tokens}")  # new in the Responses API
print(f"Cached tokens: {usage.cached_tokens}")  # tokens pulled from cache (not charged in full)
```

---

## Streaming with the Responses API

**Streaming** (receiving data continuously, piece by piece — showing the answer instantly without waiting for it to finish):

```python
stream = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Tell me a short story"}],
    stream=True,
)

for event in stream:
    if event.type == "response.output_text.delta":
        print(event.delta, end="", flush=True)
    elif event.type == "response.reasoning.delta":
        pass  # the reasoning process (can be hidden)
    elif event.type == "response.done":
        print(f"\n\nTokens used: {event.response.usage.output_tokens}")
```

---

## Deferred Responses — send now, fetch later

**Deferred** (deferring the result — send the request and fetch the result later, good for long-running work):

```python
# Send a deferred request (don't wait for the result)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Analyze this large dataset..."}],
    reasoning={"effort": "high"},
    deferred=True,
)

request_id = response.id
print(f"Request ID: {request_id} — fetch later")

# ... do other work while waiting ...

# Fetch the result when ready
import time
while True:
    result = client.responses.retrieve(request_id)
    if result.status == "completed":
        print(result.output_text)
        break
    elif result.status == "failed":
        print("An error occurred")
        break
    time.sleep(5)
```

---

## When should you use the Responses API?

**Use the Responses API when:**
- Building a new project
- You want Stateful conversations (conversations that remember context)
- Using several Tools at once
- You want Reasoning control (controlling the level of analytical thinking)
- Using Structured Outputs with Pydantic/Zod

**Use Chat Completions when:**
- You have existing code already using it
- You need compatibility with other OpenAI libraries
- Simple single-turn queries (short questions, no continuity)

> **Recommended:** Every new project should use the **Responses API** because it supports all of xAI's features.
