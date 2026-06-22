---
title: "Pricing and payment plans"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "The full pricing table for the Perplexity API, covering the Agent API, Search API, Sonar API, Embeddings, and payment options"
readTime: "6 min"
readers: "0"
locked: false
order: 13
---

# Pricing and payment plans

The Perplexity API uses a **Pay-as-you-go** system (pay for what you actually use — no minimum membership fee). You can start using it immediately without subscribing.

---

## Agent API

### Model pricing (charged by Token — the unit of text the AI processes)

Every model is charged at **the same price as the source, with no Markup** (no extra service fee).

**Perplexity Models:**
| Model | Input | Output |
|---|---|---|
| sonar | $0.25 / 1M tokens | $2.50 / 1M tokens |

**Anthropic Models (Claude):**
| Model | Input | Output |
|---|---|---|
| claude-opus-4-6 | $5.00 / 1M | $25.00 / 1M |
| claude-sonnet-4-6 | $3.00 / 1M | $15.00 / 1M |
| claude-haiku-4-6 | $1.00 / 1M | $5.00 / 1M |

**OpenAI Models (GPT-5):**
| Model | Input | Output |
|---|---|---|
| gpt-5.5 | $5.00 / 1M | per OpenAI's price |
| gpt-5.1-mini | $0.40 / 1M | per OpenAI's price |
| gpt-5.0-nano | $0.20 / 1M | per OpenAI's price |

**Google Models (Gemini 3):**
| Model | Input |
|---|---|
| gemini-3-pro | $4.00 / 1M |
| gemini-3-flash | $0.25 / 1M |

**xAI Models (Grok):**
| Model | Input | Output |
|---|---|---|
| grok-4.3 / grok-4.20 | $1.25 / 1M | $2.50 / 1M |

**NVIDIA:**
| Model | Input | Output |
|---|---|---|
| nemotron-3-super | $0.25 / 1M | $2.50 / 1M |

---

### Tools pricing in the Agent API (charged per call)

| Tool | Price |
|---|---|
| web_search | $0.005 per call |
| fetch_url | $0.0005 per call |
| people_search | $0.005 per call |
| finance_search | $0.005 per call |
| sandbox (a code test environment) | $0.03 per 20-minute Session |

---

## Search API

A fixed price, easy to plan:

| | Price |
|---|---|
| Price per Request | $5.00 per 1,000 Requests |
| Extra Token charge | None |
| Subscription fee | None |

**Estimate examples:**
- 500 searches/day × 30 days = 15,000 Requests = **$75/month**
- 100 searches/day × 30 days = 3,000 Requests = **$15/month**

---

## Sonar API

The **Sonar API** (Perplexity's AI Q&A API with web search) has two pricing parts:

### Token pricing

| Model | Input | Output |
|---|---|---|
| sonar | $1 / 1M | $1 / 1M |
| sonar-pro | $3 / 1M | $15 / 1M |
| sonar-reasoning-pro | $2 / 1M | $8 / 1M |
| sonar-deep-research | $2 / 1M + extra fees | $8 / 1M |

### Per-Request pricing (Sonar Deep Research has extra fees)

| Component | Price |
|---|---|
| Citation tokens | $2 / 1M |
| Search queries (additional searches) | $5 / 1M |
| Reasoning tokens | $3 / 1M |

### Request fee by Context Size

| Context Size | Sonar | Sonar Pro |
|---|---|---|
| Low | $5 / 1,000 req | $14 / 1,000 req |
| Medium | $8 / 1,000 req | $18 / 1,000 req |
| High | $12 / 1,000 req | $22 / 1,000 req |

---

## Embeddings API

| Model | Price |
|---|---|
| pplx-embed-v1-0.6b | $0.004 / 1M tokens |
| pplx-embed-v1-4b | $0.03 / 1M tokens |
| pplx-embed-context-v1-0.6b | $0.008 / 1M tokens |
| pplx-embed-context-v1-4b | $0.05 / 1M tokens |

**Example:** Creating Embeddings for a 1-million-word document (~1.3 million tokens) with the 0.6b model = **$5.20**

---

## Payment options

### 1. Pay-as-you-go
- Prepay via console.perplexity.ai
- No monthly Subscription
- Start immediately

### 2. AWS Marketplace
- Pay through a single AWS Billing Account
- Good for organizations already using AWS
- May get an Enterprise discount

### 3. Enterprise
- Contact Perplexity's sales team directly
- Custom pricing (set per your usage volume)
- SLA (Service Level Agreement)
- Special support

---

## Comparing real costs

### Scenario 1: A small Research Bot
- 1,000 questions/month with the pro-search preset
- Using gpt-5.1-mini: ~500 input tokens, ~300 output tokens/question
- 1,000 × (500×$0.0004 + 300×output + 3×$0.005 tools) ≈ **$20-40/month**

### Scenario 2: A news search system
- 10,000 Search requests/month with the Search API
- 10,000 × ($5/1,000) = **$50/month**

### Scenario 3: A RAG System
- Index documents of 10 million tokens with Embeddings
- 10M × $0.004/1M = **$40 one-time Indexing cost**
- 100,000 search Queries/month (100 tokens/query) = 10M tokens = **$40/month**

---

## Cost-saving tips

1. **Choose the Preset that suits the work** — fast-search is much cheaper than advanced-deep-research
2. **Use small models for easy work** — gemini-3-flash or gpt-5.0-nano for direct questions
3. **Cache answers** for frequently repeated questions
4. **Reduce max_steps** for questions that don't need deep searching
5. **Use search_context_size: "low"** if you don't need detailed content

---

## API comparison summary

| API | Lowest model price | Good for |
|---|---|---|
| Agent API | $0.20/1M tokens | Complex work, multiple models |
| Search API | $5/1,000 req | Raw search, fixed price |
| Sonar API | $1/1M tokens | Q&A + web search |
| Embeddings API | $0.004/1M tokens | RAG, Semantic Search |
