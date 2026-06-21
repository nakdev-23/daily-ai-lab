---
title: "Z.ai: Web Search — let the model find the latest information"
tool: "Z.ai"
icon: "tool-z-ai"
level: "intermediate"
summary: "Enable the Web Search tool so GLM can pull current information from the internet to answer"
readTime: "4 min"
readers: "0"
locked: false
order: 9
---

# Web Search — answer with the latest information 🌐

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

A language model only knows information up to its training period. **Web Search** lets GLM **find current information** from the internet to inform its answer, e.g. news, prices, or recent events.

## 🔧 How to use it (overview)

Enable it by adding the **web search tool** to your request (per the format the z.ai docs specify). When the model sees it should search, it searches, then composes the results into an answer.

```python
r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role":"user","content":"Summarize this week's latest AI news"}],
    tools=[{"type": "web_search", "web_search": {"enable": True}}],
)
```

> For the exact parameter name/format, see the Web Search section of the z.ai docs

## 💡 Tips

- Use it when the question genuinely needs "current" information
- Ask the model to cite its sources for credibility
- Always double-check important information

## 🔗 References

- Official docs: https://docs.z.ai/
