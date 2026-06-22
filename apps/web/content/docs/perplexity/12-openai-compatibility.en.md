---
title: "OpenAI Compatibility — use the OpenAI SDK with Perplexity"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "How to use your existing OpenAI SDK to connect to the Perplexity API by changing only the Base URL and API Key"
readTime: "5 min"
readers: "0"
locked: false
order: 12
---

# OpenAI Compatibility — use the OpenAI SDK with Perplexity

The Perplexity Agent API **fully supports the OpenAI Responses API** (OpenAI's API standard — making it usable with libraries written for OpenAI). If you already have code using OpenAI, you can switch to Perplexity by changing just 2 lines.

---

## Setup — change just 2 values

### Python (openai library)
```python
from openai import OpenAI

# Before (OpenAI)
# client = OpenAI(api_key="sk-...")

# After (switch to Perplexity)
client = OpenAI(
    base_url="https://api.perplexity.ai/v1",  # change the URL
    api_key="pplx-xxxxxxxxxxxxxxxx"           # change the API Key
)

# Use it exactly as before
response = client.responses.create(
    model="openai/gpt-5.1",   # specify the model you want
    input="Explain Machine Learning simply"
)

print(response.output_text)
```

### TypeScript / Node.js
```typescript
import OpenAI from "openai";

// Before (OpenAI)
// const client = new OpenAI({ apiKey: "sk-..." });

// After (switch to Perplexity)
const client = new OpenAI({
  baseURL: "https://api.perplexity.ai/v1",  // change baseURL
  apiKey: "pplx-xxxxxxxxxxxxxxxx",          // change apiKey
});

const response = await client.responses.create({
  model: "anthropic/claude-sonnet-4-6",
  input: "Explain Machine Learning",
});

console.log(response.output_text);
```

---

## Endpoint Aliases

Perplexity accepts both of these Endpoints:

| Endpoint | Note |
|---|---|
| `POST /v1/agent` | Perplexity's main Endpoint (recommended) |
| `POST /v1/responses` | An Alias for OpenAI SDK compatibility |

When using the OpenAI SDK (`client.responses.create()`), the SDK sends to `/v1/responses`, which Perplexity receives and processes exactly like `/v1/agent`.

---

## Features supported with the OpenAI SDK

### Works normally
```python
# 1. Basic Request / Response
response = client.responses.create(
    model="openai/gpt-5.1",
    input="My question"
)

# 2. Set Instructions (System Prompt)
response = client.responses.create(
    model="openai/gpt-5.1",
    instructions="You are a finance expert. Answer in English.",
    input="Analyze the gold price trend"
)

# 3. Streaming
stream = client.responses.create(
    model="openai/gpt-5.1",
    input="Explain at length",
    stream=True
)
for event in stream:
    if hasattr(event, 'delta'):
        print(event.delta, end="")

# 4. Third-party Models
response = client.responses.create(
    model="anthropic/claude-sonnet-4-6",  # use the Anthropic model via the OpenAI SDK
    input="Hello"
)
```

### Use a Preset via extra_body
```python
# Presets must be sent via extra_body when using the OpenAI SDK
response = client.responses.create(
    model="openai/gpt-5.1",  # model still required, but preset overrides
    input="Search for the latest info about AI",
    extra_body={
        "preset": "pro-search"  # send the preset via extra_body
    }
)
```

---

## Differences between the Native SDK and the OpenAI SDK

| Feature | Native Perplexity SDK | OpenAI SDK |
|---|---|---|
| Type Safety | Complete | Partial |
| Preset Support | `preset="pro-search"` directly | Via `extra_body` |
| Model Fallback | `models=[...]` directly | Via `extra_body` |
| Finance Search Tool | Supported directly | Via `extra_body` |
| Migration from OpenAI | Requires minor code changes | Almost no changes |

**Recommendation:**
- **Native SDK** — for new projects that want full features
- **OpenAI SDK** — for existing projects wanting to migrate to Perplexity quickly

---

## Example of migrating a project from OpenAI

### Before (OpenAI)
```python
from openai import OpenAI

client = OpenAI(api_key="sk-proj-...")

def ask_ai(question: str) -> str:
    response = client.responses.create(
        model="gpt-5.5",
        input=question,
    )
    return response.output_text

result = ask_ai("What's the weather today?")
print(result)
```

### After (switch to Perplexity — change just 2 lines)
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.perplexity.ai/v1",  # <-- change this line
    api_key="pplx-xxxxxxxx"                   # <-- and this line
)

# This part doesn't need any changes!
def ask_ai(question: str) -> str:
    response = client.responses.create(
        model="openai/gpt-5.5",  # add "openai/" before the model name
        input=question,
    )
    return response.output_text

result = ask_ai("What's the weather today?")
print(result)
```

---

## Using it with LangChain and other Frameworks

Frameworks built on the OpenAI SDK (e.g. LangChain, LlamaIndex) can use Perplexity by configuring:

```python
from langchain_openai import ChatOpenAI

# Use Perplexity via LangChain
llm = ChatOpenAI(
    openai_api_base="https://api.perplexity.ai/v1",
    openai_api_key="pplx-xxxxxxxx",
    model_name="openai/gpt-5.1"
)

# Use it like a normal ChatOpenAI
response = llm.invoke("Explain Perplexity AI")
```

---

## Summary

- Perplexity fully supports the OpenAI SDK; change just `base_url` and `api_key`
- Use `/v1/responses` or `/v1/agent` — the results are the same
- Perplexity's special features (Presets, Model Fallback) are sent via `extra_body` when using the OpenAI SDK
- For new projects, the Native Perplexity SDK is recommended for Type Safety and full features
