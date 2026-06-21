---
title: "Pricing and Rate Limits — understanding costs and limits"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Complete Claude API pricing — input/output tokens, prompt caching, batch API, the costs of various tools, and how to optimize cost"
readTime: "10 min"
readers: "0"
locked: false
order: 13
---

## Pricing overview

The Claude API (an interface between programs — like a bridge that lets apps talk) charges based on the **tokens** (chunks of text — about 1 word or 3–4 characters) used, split into:
- **Input tokens** — the text you send to Claude (prompt + context)
- **Output tokens** — the text Claude replies with

**MTok = Million Tokens** (1,000,000 tokens)

---

## Model pricing (as of June 2026)

### Current models

| Model | Input | Output |
|-------|-------|--------|
| **Claude Fable 5** | $10 / MTok | $50 / MTok |
| **Claude Mythos 5** | $10 / MTok | $50 / MTok |
| **Claude Opus 4.8** | $5 / MTok | $25 / MTok |
| **Claude Opus 4.7** | $5 / MTok | $25 / MTok |
| **Claude Opus 4.6** | $5 / MTok | $25 / MTok |
| **Claude Sonnet 4.6** | $3 / MTok | $15 / MTok |
| **Claude Haiku 4.5** | $1 / MTok | $5 / MTok |

> For the latest prices, check [claude.com/pricing](https://claude.com/pricing)

---

## Prompt Caching — reduce cost for repeated Prompts

Prompt caching (caching a prompt to reuse — when you resend the same system prompt or document, the system pulls from cache instead of reprocessing, making it much cheaper) saves money when reusing the same system prompt (the initial instruction for the AI), document, or context.

### How it works

1. Send the first request with `cache_control` → the data is cached
2. The next request using the same context → reads from cache, much cheaper

### Caching price table

| Operation | Multiplier | Cache duration |
|-----------|------------|----------------|
| Cache write (5 min) | 1.25x input | 5 minutes |
| Cache write (1 hour) | 2.0x input | 1 hour |
| Cache read (hit — successful read from cache) | 0.1x input | as set |

**Example (Claude Sonnet 4.6 at $3/MTok):**
- No cache: $3.00 per 1M input tokens
- Cache write (5 min): $3.75 per 1M tokens
- Cache read: **$0.30 per 1M tokens** (90% savings!)

### Worth it after

- 5-minute cache: worth it after the **2nd cache read**
- 1-hour cache: worth it after the **3rd cache read**

### How to use it

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant that helps analyze documents...",
        },
        {
            "type": "text",
            "text": "{{LARGE_DOCUMENT_CONTENT}}",  # long content that's reused
            "cache_control": {"type": "ephemeral"}  # cache this
        }
    ],
    messages=[{"role": "user", "content": "Summarize the key points"}]
)
```

---

## Batch API — 50% discount for Async work

The Batch API (batch processing — send hundreds or thousands of requests at once, then wait for results later) is good for work that doesn't need a real-time response.

### Batch API pricing

| Model | Batch Input | Batch Output |
|-------|------------|--------------|
| Claude Opus 4.8 | $2.50 / MTok | $12.50 / MTok |
| Claude Sonnet 4.6 | $1.50 / MTok | $7.50 / MTok |
| Claude Haiku 4.5 | $0.50 / MTok | $2.50 / MTok |

### Good for work types

- Classification of large data
- Sentiment analysis (analyzing feeling — positive/negative/neutral from text)
- Data extraction from many documents
- Large-scale evaluation/testing
- Non-urgent content generation

---

## Special feature pricing

### Web Search Tool

- **$10 per 1,000 searches** + standard token costs
- 1 search = 1 time the tool is called, regardless of how many results

### Code Execution Tool

- **Free** when used with web_search or web_fetch
- When used alone: $0.05 per container-hour (the hour the system runs)
- Every organization gets **1,550 free hours per month**

### Fast Mode (Research Preview)

For Claude Opus 4.6+:

| Model | Fast Mode Input | Fast Mode Output |
|-------|----------------|-----------------|
| Opus 4.6 / 4.7 | $30 / MTok | $150 / MTok |
| Opus 4.8 | $10 / MTok | $50 / MTok |

### Computer Use Tool

- System prompt overhead (the extra cost from the system prompt Anthropic adds): **466–499 tokens**
- Tool definition cost: **735 tokens** (Claude 4.x)
- Each screenshot image = input tokens

---

## Context Window and Pricing

Models with a 1M token context window (a temporary memory of 1 million tokens, e.g. Opus 4.8, Sonnet 4.6, Fable 5) are charged at the **standard rate throughout**, with no premium for a large context.

Example: a request with 900k tokens costs the same per-token as 9k tokens.

---

## Claude Managed Agents Pricing

For Managed Agents (beta — the test version), there are 2 cost parts:

| Item | Price |
|--------|------|
| Token usage | The standard price by model |
| Session runtime (the time the system runs) | $0.08 per session-hour |

**Calculation example (Opus 4.8, 1 hour):**
- Input: 50,000 tokens × $5/MTok = **$0.25**
- Output: 15,000 tokens × $25/MTok = **$0.375**
- Runtime: 1 hour × $0.08 = **$0.08**
- **Total: $0.705**

---

## Rate Limits

Rate limits (caps on the usage rate — defining how much you can call the API in a time window) are set by **Usage Tier**, which increases with usage and account verification.

### The various Tiers

| Tier | Description |
|------|---------|
| Tier 1 | Starting, basic limits |
| Tier 2 | For growing apps |
| Tier 3 | For established apps |
| Tier 4 | The highest standard limits |
| Enterprise | Custom per your needs |

### Types of Rate Limits

- **Requests Per Minute (RPM)** — the number of API calls per minute
- **Tokens Per Minute (TPM)** — the total tokens per minute
- **Tokens Per Day (TPD)** — the total tokens per day

For the exact limits of each tier, see [claude.com](https://docs.anthropic.com/en/api/rate-limits)

---

## Handling Rate Limit Errors

When you exceed the rate limit, you get an HTTP 429 error; use **exponential backoff** (waiting increasingly, multiplicatively — wait 1, 2, 4, 8 seconds in order, so you don't hammer the API too frequently):

```python
import anthropic
import time

client = anthropic.Anthropic()

def call_with_retry(messages, max_retries=5):
    for attempt in range(max_retries):
        try:
            return client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=messages
            )
        except anthropic.RateLimitError as e:
            if attempt == max_retries - 1:
                raise e
            wait_time = (2 ** attempt) * 1  # 1, 2, 4, 8, 16 seconds
            print(f"Rate limited. Waiting {wait_time} seconds...")
            time.sleep(wait_time)
```

---

## Cost Optimization Strategies

### 1. Choose the right model for the job

```
Task → recommended model → savings vs Opus 4.8

Classification / extraction → Haiku 4.5 → save 80%
Production chatbot → Sonnet 4.6 → save 40%
Complex reasoning → Opus 4.8 → baseline
```

### 2. Use Prompt Caching

For long system prompts or reused documents, you can save 60–90%.

### 3. Use the Batch API

For non-real-time work, save 50% immediately.

### 4. Truncate Context (cut out unnecessary context)

Reduce unnecessary context, e.g. very old conversation history.

### 5. Output Length Control (control the answer length)

Tell Claude to answer briefly when detail isn't needed.

```
"Answer briefly, no more than 3 sentences"
"Just give the main keywords, no explanation"
```

### 6. Structured Output instead of Free Text

Use JSON (a compact data format) output to reduce verbose text in the response.

---

## Monitoring usage

See usage and cost at the [Claude Console](https://console.anthropic.com/settings/limits)

Every API response has a `usage` object (a summary of token usage):

```json
{
  "usage": {
    "input_tokens": 1523,
    "output_tokens": 289,
    "cache_creation_input_tokens": 1200,
    "cache_read_input_tokens": 323
  }
}
```

---

## Cost calculation examples

### Use Case: Customer Support Bot

Assume: 10,000 tickets/month, averaging 3,700 tokens/conversation

| Model | Input Cost | Output Cost | Total |
|-------|-----------|-------------|-----|
| Haiku 4.5 | ~$37 | small | **~$37** |
| Sonnet 4.6 | ~$111 | higher | **~$150** |
| Opus 4.8 | ~$185 | highest | **~$350** |

### Use Case: Document Analysis

Assume: analyze a 100-page report (≈150,000 tokens) per time

- No cache: $0.75 per request (Haiku)
- Cache hit 2nd time+: $0.015 per request (98% savings!)

---

## Summary

| Strategy | Savings | Good for |
|--------|----------|---------|
| Choose Haiku over Opus | 80% | Simple work |
| Batch API | 50% | Non-realtime work |
| Prompt Caching | 60–90% | Repeated context |
| Truncate Context | proportional | Long conversations |
| Output Control | 10–50% | Every task |

The best approach is to start with Haiku, then upgrade only for work needing higher quality. Use Prompt Caching for repeated context, and the Batch API for non-realtime work.
