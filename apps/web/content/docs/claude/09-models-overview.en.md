---
title: "Claude Models — overview and comparison"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Get to know every Claude model — Haiku, Sonnet, Opus, and Fable — comparing capabilities, context window, price, and how to choose the right model for the job"
readTime: "10 min"
readers: "0"
locked: false
order: 9
---

## What are Claude Models?

Claude is a family of large language models (LLM — large models that learn from enormous amounts of text) developed by Anthropic. Each model (the "brain" of the AI trained for the job) is designed for different work, from work needing speed and low cost to work needing deep analysis and complex reasoning (the ability to analyze and reference information to find answers).

Anthropic groups the models into 3 main tiers:

- **Haiku** — the fastest, cheapest, good for general and real-time (instant-response) work
- **Sonnet** — balanced between speed and intelligence, good for most production (real system) use
- **Opus** — the most powerful, good for complex and agentic tasks (work the AI does in multiple continuous steps automatically)
- **Fable / Mythos** — the latest models as of 2026, for top-tier work

---

## Current Models

### Comparing the main models

| Model | API ID | Context Window | Max Output | Input Price | Output Price | Highlight |
|-------|--------|----------------|------------|-------------|--------------|------------|
| **Claude Opus 4.8** | `claude-opus-4-8` | 1M tokens | 128k tokens | $5/MTok | $25/MTok | Complex reasoning, agentic coding |
| **Claude Sonnet 4.6** | `claude-sonnet-4-6` | 1M tokens | 64k tokens | $3/MTok | $15/MTok | Speed + intelligence balance |
| **Claude Haiku 4.5** | `claude-haiku-4-5` | 200k tokens | 64k tokens | $1/MTok | $5/MTok | Fastest, near-frontier |

### Claude Fable 5 and Mythos 5 (the latest models, 2026)

| Model | API ID | Context Window | Input Price | Output Price |
|-------|--------|----------------|-------------|--------------|
| **Claude Fable 5** | `claude-fable-5` | 1M tokens | $10/MTok | $50/MTok |
| **Claude Mythos 5** | `claude-mythos-5` | 1M tokens | $10/MTok | $50/MTok |

> **Note:** Claude Fable 5 is generally available; Claude Mythos 5 is offered only to customers invited via [Project Glasswing](https://anthropic.com/glasswing).

---

## Understanding Tokens and the Context Window

### What is a Token?

A token (a chunk of text — about 1 word or 3–4 characters) is the unit the model uses to process text. Roughly:
- English: **1 token ≈ 4 characters** or **0.75 words**
- Thai: may use more tokens because the characters are more complex

### Context Window

The Context Window (the temporary memory size — the amount of text the AI can remember in one conversation) is the maximum amount of text the model can "remember" in a single conversation, including both input (the text sent in) and output (the text replied).

- **1M tokens** ≈ 750,000 English words ≈ about a 1,500-page book
- **200k tokens** ≈ 150,000 words ≈ about a 300-page book

---

## Special features of each model

### Extended Thinking and Adaptive Thinking

| Model | Extended Thinking | Adaptive Thinking |
|-------|-------------------|-------------------|
| Claude Fable 5 | Not supported | Always on |
| Claude Opus 4.8 | Not supported | Supported (recommended) |
| Claude Sonnet 4.6 | Supported (deprecated) | Supported (recommended) |
| Claude Haiku 4.5 | Supported | Not supported |

- **Extended Thinking** (Claude shows its internal thinking process before answering): Claude shows its internal "thinking steps" before answering, good for complex reasoning work
- **Adaptive Thinking** (the model gauges the question's difficulty and decides how much to think): the model decides for itself how much to "think" based on the question's difficulty

### Vision / Multimodal

Multimodal (the ability to receive both text and images) in all current Claude models supports:
- Input: text + images
- Output: text
- Languages: many, including Thai

---

## Knowledge Cutoff

| Model | Reliable Knowledge Cutoff | Training Data Cutoff |
|-------|--------------------------|----------------------|
| Claude Opus 4.8 | January 2026 | January 2026 |
| Claude Sonnet 4.6 | August 2025 | January 2026 |
| Claude Haiku 4.5 | February 2025 | July 2025 |

> **Reliable Knowledge Cutoff** (the date the training data is still complete and accurate) is the date the model's knowledge is most complete and reliable.

---

## How to choose the right model

### Use Haiku when:
- You need a very fast response, e.g. real-time chat, autocomplete
- High-volume repetitive work, e.g. batch classification, data extraction
- Limited budget
- Simple work, e.g. summarizing short text, translating

### Use Sonnet when:
- You want a balance between quality and speed
- General production work
- Coding assistance, content generation
- Customer service chatbots

### Use Opus when:
- Work needs deep reasoning, e.g. legal analysis, research
- Long-horizon agentic tasks (AI automation with many continuous steps — multi-step projects)
- Work needing high accuracy
- Complex coding, architecture design

### Use Fable 5 when:
- You need the highest available performance
- Agentic work needing very complex decision-making

---

## Accessing the models

Claude models are available via:
- **Claude API** (api.anthropic.com) (an interface between programs — like a bridge that lets apps talk) — for developers
- **Amazon Bedrock** — for AWS customers
- **Google Vertex AI** — for Google Cloud customers
- **Microsoft Foundry** — for Microsoft customers
- **Claude.ai** — for general users

---

## Model IDs and Versioning

From Claude 4.6 onward, Anthropic changed the model ID format (the code used to specify the model when calling the API):

- **New format** (4.6+): `claude-sonnet-4-6` (no date)
- **Old format** (before 4.6): `claude-sonnet-4-5-20250929` (with a date)

> Both formats are pinned snapshots (a snapshot of the model at that time — unchanging over time). If you always want the latest model, you must update the ID yourself.

---

## Pricing and optimization

### Batch API Discount
Send requests as a batch (sent together as a group — no waiting in real time one by one) and get a **50%** discount on both input and output tokens.

### Prompt Caching
Cache (remembering data to reuse — so you don't resend the same data every time) the system prompt (the initial instruction for the AI) or repeated documents to reduce cost:
- Cache read costs **10%** of the normal input
- Cache write (5 minutes): **125%** of the normal input
- Cache write (1 hour): **200%** of the normal input

### Cost-saving example
For a 10,000-token system prompt reused 100 times:
- Without cache: 10,000 × 100 = 1,000,000 tokens → full price
- With cache (after the first time): 10,000 × 0.1 × 99 = 99,000 tokens → big savings

---

## Summary

| Need | Recommended model |
|------------|-----------|
| Fastest | Haiku 4.5 |
| Balanced production | Sonnet 4.6 |
| Complex work | Opus 4.8 |
| Highest performance | Fable 5 |
| Low budget, batch | Haiku + Batch API |

Start with Sonnet for general production work, and move up to Opus for higher quality, or down to Haiku to reduce cost.
