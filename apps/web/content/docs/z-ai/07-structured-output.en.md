---
title: "Z.ai: Structured Output — force the result to be JSON"
tool: "Z.ai"
icon: "tool-z-ai"
level: "pro"
summary: "Have GLM answer as JSON in a defined structure so you can use the result in your program"
readTime: "4 min"
readers: "0"
locked: false
order: 7
---

# Structured Output — a result that parses reliably 📐

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

When using an AI's answer in code, we need a reliable format. **Structured Output** forces the model to answer as **JSON** in a defined structure.

## 🎯 What it's for

- Extract data into fields (e.g. name, price, date)
- Classify and get the result as JSON
- Feed the result into another system without parsing text yourself

## 🧱 Approach

Set `response_format` to JSON (or JSON per a schema), e.g.

```python
r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role":"user","content":"Extract the name and email from: Somchai somchai@mail.com"}],
    response_format={"type": "json_object"},
)
import json
data = json.loads(r.choices[0].message.content)
```

## 💡 Tips

- State clearly in the prompt which fields you want
- Provide an example of the JSON format you want
- Always validate the resulting JSON before actually using it

## 🔗 References

- Official docs: https://docs.z.ai/
