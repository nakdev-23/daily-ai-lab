---
title: "Extended Thinking and Adaptive Thinking — Claude thinks more deeply"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Extended Thinking has Claude show its internal analysis steps, while Adaptive Thinking lets the model decide how much to think — good for complex reasoning work"
readTime: "10 min"
readers: "0"
locked: false
order: 18
---

## What are Thinking Capabilities?

"Thinking" (the ability that lets Claude analyze a problem internally before answering, like a human thinking before speaking) is the capability that lets Claude **generate internal analysis steps** before answering.

Generally Claude answers directly, but for complex problems, having Claude "think" first gives a much more accurate answer.

---

## The two modes of Thinking

### 1. Extended Thinking (bounded thinking — you set a budget token to limit how many tokens Claude can use to think)

You set `budget_tokens` to limit the number of tokens Claude uses to think.

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # Claude can use up to 10k tokens for thinking
    },
    messages=[{"role": "user", "content": "Solve this equation..."}]
)
```

**Status:** Deprecated (still works but not recommended) for Claude 4.6+, but still usable with older models.

### 2. Adaptive Thinking (adaptive thinking — the model decides how long to think based on the problem's difficulty — the recommended mode)

The model decides for itself how long to think based on the problem's difficulty, controlled by the `effort` parameter.

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # or "max", "medium", "low"
    messages=[{"role": "user", "content": "Analyze this business strategy..."}]
)
```

**Status:** Recommended for Claude 4.6+ and newer.

---

## Model Support

| Model | Extended Thinking | Adaptive Thinking |
|-------|-------------------|-------------------|
| Claude Fable 5 | Not supported | Always on (can't turn off) |
| Claude Mythos 5 | Not supported | Always on (can't turn off) |
| Claude Opus 4.8 | Not supported | Supported (recommended) |
| Claude Opus 4.7 | Not supported | Supported (recommended) |
| Claude Opus 4.6 | Supported (deprecated) | Supported (recommended) |
| Claude Sonnet 4.6 | Supported (deprecated) | Supported (recommended) |
| Claude Sonnet 4.5 | Supported | Not supported |
| Claude Haiku 4.5 | Supported | Not supported |

---

## Effort Levels

For Adaptive Thinking, control the depth of thinking with `effort`:

| Effort Level | Description | Use when |
|-------------|---------|---------|
| `"low"` | Thinks little, answers fast | Easy work, needing low latency |
| `"medium"` | Balanced | General work |
| `"high"` | Thinks a lot (default) | Complex work |
| `"max"` | Maximum thinking | Work needing very high accuracy |

```python
# Want low latency (fast answer)
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    thinking={"type": "adaptive"},
    output_config={"effort": "low"},
    messages=[{"role": "user", "content": "Translate this sentence to English"}]
)

# Want high accuracy
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "max"},
    messages=[{"role": "user", "content": "Prove this theorem mathematically..."}]
)
```

---

## Structure of a Response with Thinking

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this problem step by step...\n\nStep 1: ...\nStep 2: ...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3U..."
    },
    {
      "type": "text",
      "text": "Based on the analysis, I find that..."
    }
  ]
}
```

- `thinking` block — the internal thinking steps (may be summarized or omitted per the `display` setting)
- `text` block — the final answer given to the user

---

## Display Options

Control how you see the thinking content:

```python
# Show a summary of the thinking (default for some models)
thinking={
    "type": "enabled",
    "budget_tokens": 10000,
    "display": "summarized"
}

# Hide the thinking (but it still thinks, saving bandwidth — the amount of data sent over the network)
thinking={
    "type": "enabled",
    "budget_tokens": 10000,
    "display": "omitted"  # faster, doesn't send the thinking tokens
}
```

---

## Thinking with Tool Use

When using thinking together with tool use (function calling), you must send the thinking blocks back too:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    tools=[weather_tool],
    messages=[{"role": "user", "content": "What's the weather in Bangkok?"}]
)

# Separate the blocks
thinking_block = next((b for b in response.content if b.type == "thinking"), None)
tool_use_block = next((b for b in response.content if b.type == "tool_use"), None)

# When sending the tool result back, you must send the thinking block back too
messages.append({"role": "assistant", "content": [thinking_block, tool_use_block]})
messages.append({
    "role": "user",
    "content": [{
        "type": "tool_result",
        "tool_use_id": tool_use_block.id,
        "content": "Temperature: 34°C, Humidity: 80%"
    }]
})
```

> **Important:** If you don't send the thinking block back with the tool_result, an error occurs.

---

## Thinking with Streaming

Streaming (sending data piece by piece continuously) with Thinking:

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Analyze the Thai stock market situation"}],
) as stream:
    for event in stream:
        if hasattr(event, 'delta'):
            if hasattr(event.delta, 'type'):
                if event.delta.type == "thinking_delta":
                    print(f"[THINKING] {event.delta.thinking}", end="")
                elif event.delta.type == "text_delta":
                    print(event.delta.text, end="", flush=True)
```

---

## Prompt Caching with Thinking

Prompt Caching (caching a prompt to reuse) with Thinking behaves as follows:

- **System prompt cache** — persists even if you change thinking parameters
- **Message cache** — invalidated when you change budget_tokens or type
- **Thinking blocks in cache** — counted as input tokens when read from cache

It's recommended to use a **1-hour cache duration** for long-running extended thinking work:

```python
system=[
    {
        "type": "text",
        "text": "System instructions...",
        "cache_control": {"type": "ephemeral", "ttl": 3600}  # cache 1 hour
    }
]
```

---

## When to use Thinking

### Use it when:
- **Math and logic** — proofs, complex calculations
- **Code debugging** — analyzing complex bugs
- **Strategic analysis** — business decisions
- **Research synthesis** — combining information from many sources
- **Multi-step reasoning** — problems that go through many steps

### Not needed when:
- Simple translation
- Short summarization
- General Q&A with a clear answer
- Real-time chat needing low latency

---

## Migrating from Extended Thinking to Adaptive Thinking

For 4.6+ models:

```python
# Old (Extended Thinking)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=64000,
    thinking={"type": "enabled", "budget_tokens": 32000},
    messages=[{"role": "user", "content": "..."}]
)

# New (Adaptive Thinking)
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

---

## Important limitations

### Prefilled Responses (putting text into the answer in advance)

For Claude 4.6+, prefilling text in the final assistant turn is not supported:

```python
# Doesn't work with Claude 4.6+
messages = [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "Result:"}  # ❌ Error!
]
```

### Tool Choice

When using thinking with tools, only `tool_choice: auto` or `none` is supported.

### Toggle Mid-Turn

You can't turn thinking on/off during a tool use loop.

---

## Thinking pricing

Thinking tokens (the chunks of data used in the thinking step) are charged as **input tokens** at the same price.

Example: if Claude uses 5,000 thinking tokens + 500 output tokens with Opus 4.8:
- Thinking: 5,000 × $5/MTok = $0.025
- Output: 500 × $25/MTok = $0.0125
- Total input + thinking: depends on the input you sent too

> **Note:** For `display: "omitted"`, you're still charged for thinking tokens but the content isn't sent in the answer, making streaming faster.

---

## Summary

| Feature | Extended Thinking | Adaptive Thinking |
|---------|-------------------|-------------------|
| **Control** | Manual (`budget_tokens` — set yourself) | Automatic + Effort |
| **Recommended models** | 4.5 and older | 4.6 and newer |
| **Usage** | Set the budget | Set the effort level |
| **Flexibility** | Lower | Higher |
| **Performance** | Good | Better (per Anthropic) |

Start with Adaptive Thinking + `effort: "high"` for 4.6+ models, and use Extended Thinking only for older models that don't yet support adaptive mode.
