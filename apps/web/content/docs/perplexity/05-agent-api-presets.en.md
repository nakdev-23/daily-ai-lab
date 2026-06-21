---
title: "Agent API — Presets (ready-made setting sets)"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "Learn the Agent API's 4 Presets — which model each uses, which work it suits, and how to choose correctly"
readTime: "6 min"
readers: "0"
locked: false
order: 5
---

# Agent API — Presets (ready-made setting sets)

**Presets** (ready-made setting sets) are the easiest way to use the Agent API. Perplexity has prepared 4 Presets, each combining a model + tools + settings into one well-tested and tuned package.

---

## Why use Presets?

Instead of specifying the model, tools, and number of steps yourself, you just call one Preset name and get the settings Perplexity chose to best suit that kind of work.

Extra benefit: when Perplexity updates a Preset to be better, your Code is improved automatically without changing anything.

---

## The 4 Presets

### 1. fast-search

| Detail | Value |
|---|---|
| Model | google/gemini-3-flash-preview |
| Max Steps | 1 |
| Tools | web_search |
| Good for | Direct questions needing a fast answer |

```python
response = client.agent.create(
    preset="fast-search",
    input="What's the weather in Bangkok today?"
)
```

Use when: you want speed over depth, e.g. simple info lookups, product prices, or the latest news.

---

### 2. pro-search

| Detail | Value |
|---|---|
| Model | openai/gpt-5.1 |
| Max Steps | 3 |
| Tools | web_search, fetch_url |
| Good for | Most questions needing accuracy |

```python
response = client.agent.create(
    preset="pro-search",
    input="Compare the pros and cons of React vs Vue.js in 2026"
)
```

Use when: normal general work needing a balance of speed and quality. **Recommended for general use.**

---

### 3. deep-research

| Detail | Value |
|---|---|
| Model | openai/gpt-5.2 |
| Max Steps | 10 |
| Tools | web_search, fetch_url |
| Good for | Research needing thoroughness |

```python
response = client.agent.create(
    preset="deep-research",
    input="Analyze AI's impact on Thailand's labor market 2026-2030"
)
```

Use when: you want a comprehensive report, multi-dimensional searching, or complex analytical work.

---

### 4. advanced-deep-research

| Detail | Value |
|---|---|
| Model | anthropic/claude-opus-4-6 |
| Max Steps | 10 |
| Tools | web_search, fetch_url |
| Good for | Professional research needing the highest quality |

```python
response = client.agent.create(
    preset="advanced-deep-research",
    input="Summarize the latest research on treating cancer with CAR-T Cell Therapy"
)
```

Use when: enterprise-level work, reports needing the highest accuracy, or very complex topics.

---

## Comparing Presets

| Preset | Speed | Depth | Cost |
|---|---|---|---|
| fast-search | Very fast | Low | Low |
| pro-search | Fast | Medium | Medium |
| deep-research | Slow | High | High |
| advanced-deep-research | Very slow | Highest | Highest |

---

## Dynamic vs Frozen Preset

### Dynamic Preset (recommended)
Call the Preset name directly — always get the latest settings from Perplexity:

```python
# This way: when Perplexity updates pro-search, you get the improvements automatically
response = client.agent.create(
    preset="pro-search",
    input="My question"
)
```

### Frozen Preset (locked values)
Copy the Preset's current settings directly into your Code — unchanged even if Perplexity updates:

```python
# This way: use when you want 100% predictable results and don't want them to change
response = client.agent.create(
    model="openai/gpt-5.1",  # fixed model
    tools=[{"type": "web_search"}, {"type": "fetch_url"}],
    max_steps=3,
    input="My question"
)
```

**Recommend Dynamic** for most work, and **Frozen** for Production systems needing high stability.

---

## Combining a Preset with Instructions

You can use a Preset together with `instructions` (a System Prompt) to define extra behavior:

```python
response = client.agent.create(
    preset="pro-search",
    instructions="""
    You are a finance expert. Always answer in English.
    Use tables and headings in your answer.
    If you can't find data, say so directly, don't guess.
    """,
    input="Analyze the ADVANC stock this week"
)
```

> **Important:** `instructions` **replaces** the Preset's System Prompt entirely, it doesn't add to it, so you must write complete Instructions.

---

## Summary

- **fast-search** → want a fast answer, simple info
- **pro-search** → general work, balance of fast and good (recommended as the default)
- **deep-research** → comprehensive, multi-dimensional research
- **advanced-deep-research** → highest quality, professional work

Choosing the Preset that matches the work greatly saves cost and waiting time.
