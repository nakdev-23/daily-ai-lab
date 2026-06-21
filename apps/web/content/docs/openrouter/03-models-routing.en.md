---
title: "OpenRouter: Models & Provider Routing — select and back up models"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "intermediate"
summary: "Choosing a model, configuring provider routing, and the fallback system when a provider goes down"
readTime: "5 min"
readers: "0"
locked: false
order: 3
---

# Models & Provider Routing 🔀

> Compiled in English from the official docs at [openrouter.ai/docs](https://openrouter.ai/docs/features/provider-routing)

The same model may be offered by several providers. OpenRouter helps **choose the best provider** and **auto-fallback** when one has a problem.

## 🎯 How Provider Routing works

- Default: picks a suitable provider (price/speed/availability)
- If the first provider goes down or is slow → **fallback** to the next one automatically
- You can set your own conditions, e.g. ordering providers, excluding ones you don't want

## ⚙️ Example of a custom config

Send an extra `provider` field in the request, e.g.
```json
{
  "model": "meta-llama/llama-3.3-70b-instruct",
  "provider": { "sort": "throughput" },
  "messages": [ ... ]
}
```
- `sort: "price"` — prioritize the cheapest
- `sort: "throughput"` — prioritize the fastest
- Specify `order` to set your own provider order

## 🧭 Model Routing (automatic model selection)

There are special models like `openrouter/auto` that let OpenRouter pick the model best suited to your question.

## 💡 Tips

- Production work should set up a fallback to guard against outages
- See each provider's uptime/latency on the model page

## 🔗 References

- Provider Routing: https://openrouter.ai/docs/features/provider-routing
