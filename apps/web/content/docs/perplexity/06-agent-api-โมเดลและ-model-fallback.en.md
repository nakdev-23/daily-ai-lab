---
title: "Agent API — models and Model Fallback"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "The full list of models in the Agent API from every provider, and how to set up Model Fallback so the system keeps working"
readTime: "7 min"
readers: "0"
locked: false
order: 6
---

# Agent API — models and Model Fallback

Perplexity's Agent API supports AI models from many leading providers, charging at each model's source price with no extra service fee. There's also a **Model Fallback** system (model backup — automatically switching to a backup model when the primary one is unavailable) to keep the system running.

---

## List of supported models

### Perplexity (its own model)

| Model | Highlight | Input price | Output price |
|---|---|---|---|
| sonar | Perplexity's search model with built-in Web Search | $0.25/1M tokens | $2.50/1M tokens |

### Anthropic — Claude Family

| Model | Highlight | Input price | Output price |
|---|---|---|---|
| anthropic/claude-opus-4-6 | Highest capability, good at complex analysis | $5/1M | $25/1M |
| anthropic/claude-sonnet-4-6 | Balance of capability and speed | $3/1M | $15/1M |
| anthropic/claude-haiku-4-6 | Fastest, cheapest | $1/1M | $5/1M |

### OpenAI — GPT-5 Family

| Model | Highlight | Input price | Output price |
|---|---|---|---|
| openai/gpt-5.5 | Flagship, OpenAI's highest capability | $5/1M | - |
| openai/gpt-5.1-mini | Mini, good capability at an economical price | $0.40/1M | - |
| openai/gpt-5.0-nano | Nano, very fast and very cheap | $0.20/1M | - |

### Google — Gemini 3 Family

| Model | Highlight | Input price |
|---|---|---|
| google/gemini-3-pro | Long-context, best for long documents | $4/1M |
| google/gemini-3-flash | High speed, good for Real-time | $0.25/1M |
| google/gemini-3-flash-preview | Preview, the newest version | $0.25/1M |

### xAI — Grok Family

| Model | Highlight | Input price | Output price |
|---|---|---|---|
| xai/grok-4.3 | Supports Reasoning and Multi-agent | $1.25/1M | $2.50/1M |
| xai/grok-4.20 | A stable version with Multi-agent capability | $1.25/1M | $2.50/1M |

### NVIDIA

| Model | Highlight | Input price | Output price |
|---|---|---|---|
| nvidia/nemotron-3-super | Open-weight (the parameters are public), supports Reasoning | $0.25/1M | $2.50/1M |

---

## Specify the model in Code

```python
from perplexityai import Perplexity

client = Perplexity()

# Specify a single model
response = client.agent.create(
    model="anthropic/claude-sonnet-4-6",
    input="Explain how Quantum Computing works"
)

# See GET /v1/models for the latest model list
```

---

## Model Fallback — the model backup system

**Model Fallback** is a feature that keeps your app running even when the primary model isn't available, by automatically trying **the next model in the order**.

### How to use Model Fallback

Instead of `model` (a single one), use `models` (an array — a list):

```python
response = client.agent.create(
    models=[
        "openai/gpt-5.5",          # try this first
        "anthropic/claude-opus-4-6",  # if the first doesn't work, try this
        "xai/grok-4.3",            # if the second doesn't work, try this
        "sonar"                     # the last backup
    ],
    input="Analyze this data..."
)

# See which model was actually used
print(response.model)  # e.g. "anthropic/claude-opus-4-6"
```

### TypeScript
```typescript
const response = await client.agent.create({
  models: [
    "openai/gpt-5.5",
    "anthropic/claude-opus-4-6",
    "xai/grok-4.3",
  ],
  input: "My question",
});

console.log(`Used model: ${response.model}`);
```

---

## Rules for using the `models` array

1. **Order matters** — the system tries from Index 0 onward until it succeeds
2. **Up to 5 models** — you can include no more than 5 in the array
3. **`models` replaces `model`** — if you include both, the system always uses `models`
4. **Charged by the actual model** — you pay the price of the model that answered successfully, not all of them

---

## How to choose the Fallback order

### Prioritize capability → cost
```python
models=[
    "anthropic/claude-opus-4-6",  # best, most expensive
    "openai/gpt-5.5",
    "anthropic/claude-sonnet-4-6",
    "openai/gpt-5.1-mini",        # cheapest
]
```

### Prioritize speed → quality
```python
models=[
    "google/gemini-3-flash",  # fastest
    "openai/gpt-5.1-mini",
    "openai/gpt-5.5",         # slow but best
]
```

### Prioritize provider variety (highest availability)
```python
models=[
    "openai/gpt-5.5",              # OpenAI
    "anthropic/claude-sonnet-4-6", # Anthropic
    "google/gemini-3-flash",       # Google
    "xai/grok-4.3",               # xAI
]
```

---

## View the latest model list (GET /v1/models)

A new endpoint (April 2026) that lets you view the available models in an OpenAI-compatible format:

```bash
curl https://api.perplexity.ai/v1/models \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY"
```

The Response is a JSON list of all the models currently available.

---

## Key points summary

- The Agent API supports models from Perplexity, Anthropic, OpenAI, Google, xAI, NVIDIA
- Priced at the source, no extra service fee
- Use a `models` array to set a Fallback Chain of up to 5 models
- Charged only for the model actually used
- The Response tells you which model was used in the `model` field
