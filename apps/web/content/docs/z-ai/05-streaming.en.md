---
title: "Z.ai: Streaming — receive the answer piece by piece"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "Enable stream mode to receive GLM's answer incrementally (SSE) and reduce the wait"
readTime: "4 min"
readers: "0"
locked: false
order: 5
---

# Streaming — watch the answer come out gradually ⚡

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

Instead of waiting for the whole answer to finish, **Streaming** sends the answer piece by piece (token) via SSE — letting the user see text typed out gradually, feeling faster, and great for chat.

## ▶️ Example (Python)

```python
stream = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role": "user", "content": "Tell a short story"}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

## 🧩 How it works

- Set `stream=True`
- The server sends **chunks** continuously
- Each chunk has a `delta` (the next part of the text)
- Concatenate the deltas until done

## 💡 Tips

- Great for chat UIs/long answers — the user doesn't have to stare at a blank screen
- Handle errors during the stream (e.g. dropped connection) too
- On the web, use EventSource/fetch stream to read SSE

## 🔗 References

- Official docs: https://docs.z.ai/
