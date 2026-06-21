---
title: "Z.ai: Chat Completion — converse with the model"
tool: "Z.ai"
icon: "tool-z-ai"
level: "beginner"
summary: "The basics of calling GLM's Chat Completion, with commonly used parameters"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---

# Chat Completion — talk to the GLM model 💬

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

The main endpoint is **Chat Completion** — send messages with roles and get an answer back.

## 🧱 The messages structure

```python
messages = [
  {"role": "system",    "content": "You are a tutor who explains simply; answer in English"},
  {"role": "user",      "content": "What is AI?"},
  {"role": "assistant", "content": "AI is..."},   # prior history (if any)
  {"role": "user",      "content": "Give me an example"},
]
```

| role | Meaning |
|---|---|
| **system** | Define the role/behavior |
| **user** | A message from the user |
| **assistant** | The model's previous answer |

## 🎛️ Commonly used parameters

| Parameter | What it does |
|---|---|
| `model` | The version name, e.g. `glm-4.6` |
| `temperature` | Creativity (low = precise, high = varied) |
| `max_tokens` | Limit the answer length |
| `top_p` | Control the variety of word choice |
| `stream` | Receive the result piece by piece (see [Streaming](05-streaming)) |

## ▶️ Example

```python
r = client.chat.completions.create(
    model="glm-4.6",
    messages=messages,
    temperature=0.6,
    max_tokens=1024,
)
print(r.choices[0].message.content)
```

## 💡 Tips

- Add a `system` message to set a consistent tone/role
- Keep the conversation history and resend it each time so the model remembers context

## 🔗 References

- Official docs: https://docs.z.ai/
