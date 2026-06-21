---
title: "Agent API — build an AI Agent"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "A guide to the Agent API for building an AI Agent that searches the web, uses models from many providers, and works through multiple steps automatically"
readTime: "8 min"
readers: "0"
locked: false
order: 4
---

# Agent API — build an AI Agent

The **Agent API** is the core of Perplexity for developers — an API that lets you build an **AI Agent** (an AI agent — an AI program that can decide and work through multiple steps itself) smarter than plain Q&A.

---

## What is the Agent API?

The Agent API is a **Multi-provider API** (an API supporting models from many providers) that brings together AI models from:

- **Anthropic** — Claude Opus, Sonnet, Haiku
- **OpenAI** — the GPT-5 family
- **Google** — the Gemini 3 family
- **xAI** — Grok 4.x
- **NVIDIA** — Nemotron
- **Perplexity** — Sonar (Perplexity's own model)

You don't need an API Key for each service; using just **one Perplexity API Key** you can call all the models, paying the same price as the source, with no extra service fee.

---

## Endpoint

```
POST https://api.perplexity.ai/v1/agent
```

Or use the alias for OpenAI SDK compatibility:
```
POST https://api.perplexity.ai/v1/responses
```

---

## Usage examples

### Python — using a ready-made Preset
```python
from perplexityai import Perplexity

client = Perplexity()

response = client.agent.create(
    preset="pro-search",  # Preset (a ready-made set of settings)
    input="Summarize the important AI news this week"
)

print(response.output_text)
# shows the answer text
print(response.citations)
# shows the citations used
```

### Python — specify the model yourself
```python
response = client.agent.create(
    model="openai/gpt-5.1",  # specify the model directly
    tools=[{"type": "web_search"}],  # enable web search
    input="Compare Python vs JavaScript for the Backend",
    instructions="Answer in English, use headings and tables"
)
```

### TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const response = await client.agent.create({
  preset: "deep-research",
  input: "Analyze the EV market trends in Thailand in 2026",
});

console.log(response.output_text);
```

---

## Main parameters (the values sent in to control behavior)

| Parameter | Type | Description |
|---|---|---|
| `preset` | string | A ready-made set of settings (instead of model+tools) |
| `model` | string | The model name, e.g. "openai/gpt-5.1" |
| `models` | array | A list of backup models, for Fallback |
| `input` | string | The user's question or instruction |
| `instructions` | string | The System Prompt (a base instruction — defining the AI's role and behavior) |
| `tools` | array | The tools the AI can use, e.g. web_search |
| `max_steps` | integer | The maximum number of steps the AI can take |
| `stream` | boolean | Enable Streaming (receive the answer piece by piece) |

---

## Tools the Agent can use

**Tools** (special capabilities the AI can use while answering) available:

### web_search
```python
tools=[{
    "type": "web_search",
    "search_context_size": "high",  # low / medium / high
    "recency_filter": "week",  # hour / day / week / month / year
    "search_domain_filter": ["site:thairath.co.th", "-site:gossip.com"]
}]
```

### fetch_url (fetch web content)
```python
tools=[{"type": "fetch_url"}]  # have the AI read content from a specified URL
```

### finance_search (search financial data)
```python
tools=[{"type": "finance_search"}]  # stock prices, earnings, analysts
```

### people_search (search for information on a person)
```python
tools=[{"type": "people_search"}]  # public profiles of people
```

---

## Pricing

The Agent API is charged in two parts:

**1. Model price** — charged by Token (a unit of text) used, the same price as the source for every provider

**2. Tools price** — charged per call:
- `web_search` — $0.005 per call
- `fetch_url` — $0.0005 per call
- `people_search` — $0.005 per call
- `finance_search` — $0.005 per call
- `sandbox` — $0.03 per Session (20 minutes)

---

## Check the cost in the Response

The Response has a `usage` field that clearly shows the cost info:

```json
{
  "output_text": "The AI's answer...",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 800,
    "tool_calls": 3,
    "total_cost": 0.0085
  },
  "model": "openai/gpt-5.1"
}
```

---

## Differences between the Agent API and other APIs

| | Agent API | Search API | Sonar API |
|---|---|---|---|
| AI models | Many providers | None | Sonar (Perplexity) |
| Web search | Yes (as a Tool) | The main thing | Yes (built-in) |
| Results | A summarized answer | A list of raw links | A summarized answer |
| Good for | Complex, multi-step work | Wanting raw data | General Q&A |

---

## Summary

The Agent API is Perplexity's most powerful API, good for:
- Building a Research Assistant that searches and summarizes information itself
- Building a Chatbot with live data
- Doing multi-step analytical work using the best AI models on the market
- Building an Application that needs flexibility in choosing models
