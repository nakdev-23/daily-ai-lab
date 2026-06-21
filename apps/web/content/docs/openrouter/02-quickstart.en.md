---
title: "OpenRouter: Quickstart — your first API call"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "beginner"
summary: "Create an API key and call your first model through OpenRouter, OpenAI-compatible"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---

# Quickstart — start calling OpenRouter 🚀

> Compiled in English from the official docs at [openrouter.ai/docs/quickstart](https://openrouter.ai/docs/quickstart)

## 🔑 Getting started steps

1. Sign up at [openrouter.ai](https://openrouter.ai/) and top up credits
2. Create an **API key** on the Keys page
3. Choose the model you want from [openrouter.ai/models](https://openrouter.ai/models)

## 🧱 Call it OpenAI-compatible

OpenRouter uses the same format as OpenAI — just change the base URL and key:

```python
from openai import OpenAI
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="YOUR_OPENROUTER_KEY",
)
r = client.chat.completions.create(
    model="anthropic/claude-opus-4-8",
    messages=[{"role": "user", "content": "Hello"}],
)
print(r.choices[0].message.content)
```

## 🏷️ Model naming

The format is `provider/model-name`, e.g.
- `anthropic/claude-opus-4-8`
- `openai/gpt-4o`
- `google/gemini-2.5-pro`
- `meta-llama/llama-3.3-70b-instruct`

Want to change models? Just edit the `model` value — the rest of the code stays the same.

## 💡 Tips

- Add the HTTP headers `HTTP-Referer` and `X-Title` (optional) so your app appears on OpenRouter's leaderboard
- Check each model's price before using it (charged by token)

## 🔗 References

- Quickstart: https://openrouter.ai/docs/quickstart
