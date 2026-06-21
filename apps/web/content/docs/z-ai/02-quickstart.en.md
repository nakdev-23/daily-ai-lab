---
title: "Z.ai: Quick Start — your first API call"
tool: "Z.ai"
icon: "tool-z-ai"
level: "beginner"
summary: "Create an API key and call a GLM model for the first time, both OpenAI- and Anthropic-compatible"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---

# Quick Start — start calling Z.ai 🚀

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/guides/overview/quick-start)

## 🔑 Getting started steps

1. Sign up for an account at [z.ai](https://z.ai/)
2. Create an **API key** on the key management page
3. Choose a model (e.g. `glm-4.6`) and call it via the API

## 🧱 Call it OpenAI-compatible

Z.ai supports the OpenAI format — just change the base URL and key:

```python
from openai import OpenAI
client = OpenAI(
    api_key="YOUR_ZAI_KEY",
    base_url="https://api.z.ai/api/paas/v4/",
)
r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role": "user", "content": "Hi, can you explain AI?"}],
)
print(r.choices[0].message.content)
```

## 🟧 Call it Anthropic-compatible

Z.ai also has an Anthropic-compatible endpoint (good for code tools like Claude Code) — point the base URL to `https://api.z.ai/api/anthropic` and use your z.ai key.

## 🌐 cURL

```bash
curl https://api.z.ai/api/paas/v4/chat/completions \
  -H "Authorization: Bearer YOUR_ZAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"glm-4.6","messages":[{"role":"user","content":"Hello"}]}'
```

## 💡 Tips

- Keep your API key in an environment variable; don't commit it to git
- Try a free/light model (e.g. GLM-4.5-Flash) during development, then move up to a larger one
- See rate limits and error codes in the Guides section of the docs

## 🔗 References

- Quick Start: https://docs.z.ai/guides/overview/quick-start
