---
title: "Google AI Studio: get an API key and call it via code"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "intermediate"
summary: "Create an API key from AI Studio and call Gemini via Python/JavaScript"
readTime: "5 min"
readers: "0"
locked: false
order: 3
---

# Get an API key and call Gemini from code 🔑

> Adapted from the official documentation at [ai.google.dev](https://ai.google.dev/gemini-api/docs)

Once you're happy experimenting with prompts in AI Studio, use it for real in your app with the **Gemini API**.

## 🔑 Get an API key

1. In [aistudio.google.com](https://aistudio.google.com/), hit **Get API key**
2. Create a new key and keep it secret (don't put it in client-side code)

## 🐍 Python example

```python
from google import genai
client = genai.Client(api_key="YOUR_KEY")
r = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain AI in 2 sentences",
)
print(r.text)
```

## 🟨 JavaScript example

```js
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "YOUR_KEY" });
const r = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Hello",
});
console.log(r.text);
```

## 🆓 Free limits

The Gemini API has a **free tier** to try (with per-minute/per-day limits), good for learning and prototyping — for high-volume real work, upgrade later.

## 💡 Tips

- Use the **Flash** version for fast/cheap work, the **Pro** version for heavy reasoning
- Keep the key in an environment variable; don't commit it to git

## 🔗 Reference

- Gemini API docs: https://ai.google.dev/gemini-api/docs
