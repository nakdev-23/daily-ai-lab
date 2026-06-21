---
title: "Kimi: API — call Moonshot models from code"
tool: "Kimi"
icon: "tool-kimi"
level: "pro"
summary: "Call Kimi/Moonshot models through an OpenAI-compatible API"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---

# Kimi API — call it from code 🧑‍💻

> Compiled in English from the official docs at [platform.moonshot.ai](https://platform.moonshot.ai/)

Moonshot AI lets you call Kimi models through an **OpenAI-compatible API** — if you've used OpenAI-style code before, just change the base URL and key and you're ready.

## 🔑 What you need to prepare

| What you need | Description |
|---|---|
| **API key** | Create it in the developer platform (keep it secret) |
| **Base URL** | Moonshot's endpoint |
| **Model** | The model version name to use |

## 🧱 Example (OpenAI-compatible format)

```python
from openai import OpenAI
client = OpenAI(
    api_key="YOUR_MOONSHOT_KEY",
    base_url="https://api.moonshot.ai/v1",
)
r = client.chat.completions.create(
    model="kimi-k2-...",   # use the version name from the latest docs
    messages=[{"role": "user", "content": "Summarize this news for me"}],
)
print(r.choices[0].message.content)
```

## 💡 Tips

- Use the **long context** capability by passing documents into messages
- Supports **tool use** for agentic work
- See the latest model names, pricing, and limits in the platform docs

## 🔗 References

- Developer platform: https://platform.moonshot.ai/
