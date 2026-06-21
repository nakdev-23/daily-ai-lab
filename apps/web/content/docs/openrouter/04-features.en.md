---
title: "OpenRouter: advanced features — Caching, Structured Outputs, Tools"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "pro"
summary: "OpenRouter's advanced features: prompt caching, structured outputs, and tool calling"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---

# OpenRouter's advanced features ⚙️

> Compiled in English from the official docs at [openrouter.ai/docs](https://openrouter.ai/docs/features)

OpenRouter supports advanced features that work across models (where that model supports them).

## 💾 Prompt Caching

If you send the same context repeatedly (e.g. a long system prompt), **caching** helps cut cost and increase speed by not reprocessing the same part every time — supported where the provider/model supports it.

## 📐 Structured Outputs

Force the answer to conform to a defined **JSON structure (schema)**, good for work where you need to use the result further in a program.

```json
{
  "model": "...",
  "response_format": {
    "type": "json_schema",
    "json_schema": { "name": "person", "schema": { ... } }
  }
}
```

## 🛠️ Tool Calling (Function Calling)

Let the model call "tools" you define (e.g. searching a database, calling an API) — the model says which tool to call with which parameters, then you run it and send the result back. It uses the same format as OpenAI tools.

## 🖼️ Others

- **Multimodal** — some models accept images
- **Streaming** — receive the result piece by piece
- **Web search** — some models/modes add web search

## 💡 Tips

- A feature works only when "the selected model" supports it — check the model page
- Use structured outputs when you need a result that parses reliably

## 🔗 References

- Features: https://openrouter.ai/docs/features
