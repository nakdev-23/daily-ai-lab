---
title: "Changelog — updates and new features"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "The history of the latest Perplexity API updates, including new models, new features, and important changes"
readTime: "5 min"
readers: "0"
locked: false
order: 18
---

# Changelog — updates and new features

The Perplexity API's **Changelog** (a record of changes — a list of updates and new features recently released) helps developers track changes and plan system upgrades.

---

## May 2026

### Finance Search Tool

**Finance Search** (search financial data — a Tool that pulls stock data, earnings, and analyst analysis) launched as a Tool in the Agent API:

```python
response = client.agent.create(
    model="openai/gpt-5.1",
    tools=[{"type": "finance_search"}],  # the new Tool
    input="Analyze GULF Energy Development's Q1/2026 results"
)
```

Data it can pull:
- **Stock Quotes** (real-time stock prices)
- **Earnings** (profit and loss)
- **Analyst Estimates** (forecasts from analysts)
- **Corporate Actions** (company events, e.g. dividends, stock splits)

---

## April 2026

### New models

Additional model support:
- **Claude Opus 4.7** (Anthropic) — a new, highest-capability version
- **GPT-5.5** (OpenAI) — the new Flagship
- **Grok 4.20 Reasoning** (xAI) — supports Multi-step Reasoning

### API Key security

**New policy:** The full API Key value is shown only the **first time it's created**; after that the system shows only the beginning and end for security.

**Impact:** If you lose the Key, you must create a new one, so save the Key immediately after creating it.

### New GET /v1/models Endpoint

```bash
# See the full list of supported models
curl https://api.perplexity.ai/v1/models \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY"
```

The Response returns a JSON list of models in an OpenAI-compatible format.

### New Integrations

- **n8n** — a ready-made Node in n8n Workflow Automation
- **OpenClaw** — a Terminal-based AI Coding Agent
- **AWS Marketplace** — you can now pay via AWS Billing

---

## March 2026

### Additional models

Supports:
- GPT-5.4 (OpenAI)
- NVIDIA Nemotron 3 Super
- Claude Sonnet 4.6 (Anthropic)
- Gemini 3.1 Pro Preview (Google)

### Deprecated Models

**Deprecated** (no longer used — models replaced by newer versions):
- ~~Gemini 2.5 Flash~~ → use Gemini 3 Flash instead
- ~~Gemini 2.5 Pro~~ → use Gemini 3 Pro instead
- ~~Gemini 3-pro-preview (old version)~~

### New Endpoint — `/v1/agent` is Canonical

**`/v1/agent`** has become the official main Endpoint
**`/v1/responses`** still works (a Backward-compatible alias)

---

## February 2026

### Agent API — Generally Available

**GA (Generally Available)** (out of Beta and ready for Production use):

The Agent API left Beta to become GA with full features:
- Multi-provider model support
- Tools: web_search, fetch_url, people_search
- Model Fallback
- Presets: fast-search, pro-search, deep-research, advanced-deep-research
- Streaming responses

### Embeddings API — Generally Available

The Embeddings API left Beta with:
- Standard Embeddings (0.6b and 4b)
- Contextualized Embeddings
- Matryoshka Dimension Reduction
- Batch support up to 512 texts

---

## What to know when upgrading

### From the old Sonar API → the new Agent API

If you previously used the old Sonar API (before 2026) and want to migrate to the Agent API:

```python
# Old (old Sonar API)
response = client.chat.completions.create(
    model="sonar-medium-online",  # the old model
    messages=[{"role": "user", "content": "A question"}]
)

# New (Agent API)
response = client.agent.create(
    preset="pro-search",  # use a Preset instead
    input="A question"
)
# or
response = client.agent.create(
    model="sonar",  # the new Sonar
    tools=[{"type": "web_search"}],
    input="A question"
)
```

### Deprecated models — what to do

If your Code uses old, deprecated models, you'll get an Error:
```json
{"error": "Model 'gemini-2.5-flash' is deprecated. Use 'google/gemini-3-flash' instead."}
```

Update the model name in your Code per the table:

| Old model | Recommended new model |
|---|---|
| gemini-2.5-flash | google/gemini-3-flash |
| gemini-2.5-pro | google/gemini-3-pro |
| sonar-medium-online | sonar or sonar-pro |
| sonar-large-online | sonar-pro |

---

## Feature Roadmap

Features Perplexity plans to develop:

- **Memory Management** (memory management — letting the AI remember past conversations) for the Agent API
- **Custom Tool Integration** (connecting the customer's own Tools) in the Agent API
- **Batch Processing API** (large Batch processing at a low price)
- **Fine-tuning Support** (tuning the model with our own data)

---

## How to follow the Changelog

1. **Website:** [docs.perplexity.ai/changelog](https://docs.perplexity.ai/changelog)
2. **Discord:** the Perplexity Developer Discord community
3. **Blog:** blog.perplexity.ai for important announcements
4. **Status Page:** status.perplexity.ai to track system status

---

## Summary of key changes in 2026

| Month | Key change |
|---|---|
| February 2026 | Agent API and Embeddings API go GA |
| March 2026 | Added several models, deprecated Gemini 2.5 |
| April 2026 | API Key Show-once, GET /v1/models, n8n integration |
| May 2026 | Finance Search Tool launched |
