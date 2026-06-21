---
title: "Z.ai: Reasoning — deep-thinking mode before answering"
tool: "Z.ai"
icon: "tool-z-ai"
level: "pro"
summary: "Enable thinking/reasoning mode to have GLM think step by step before answering, good for hard problems"
readTime: "4 min"
readers: "0"
locked: false
order: 10
---

# Reasoning — let the model think before answering 🧠

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

Hard problems (math, logic, planning, complex coding) come out better if the model **thinks step by step before answering**. GLM has a **thinking / reasoning** mode for this kind of work.

## ⚙️ How to use it

Enable thinking mode via the `thinking` parameter (per the format the z.ai docs specify), e.g.

```python
r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role":"user","content":"Solve: ... (a hard logic problem)"}],
    extra_body={"thinking": {"type": "enabled"}},
)
```

- When enabled, the model takes more time to think but is more accurate
- Keep it off for easy work / when you need speed

## 🎯 When to enable it

| Enable (deep thinking) | Off (fast answers) |
|---|---|
| Math/logic/proofs | General Q&A |
| Writing/debugging complex code | Short summaries |
| Multi-step planning | High-volume, speed-focused work |

## 💡 Tips

- For easy work, don't enable it — it wastes time/cost
- Use it together with tool calling for agentic work that needs planning

## 🔗 References

- Official docs: https://docs.z.ai/
