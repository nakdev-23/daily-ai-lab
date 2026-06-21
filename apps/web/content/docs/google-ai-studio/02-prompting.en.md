---
title: "Google AI Studio: prompt design"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "beginner"
summary: "Use AI Studio's Prompt page to experiment with prompts, set System instructions, and adjust settings"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---

# Prompt design in AI Studio ✍️

> Adapted from the official documentation at [ai.google.dev](https://ai.google.dev/gemini-api/docs/prompting-strategies)

AI Studio is a prompt playground for Gemini — adjust and see results instantly.

## 🎛️ Adjustable settings

| Setting | What it does |
|---|---|
| **System instructions** | Define the model's role/behavior |
| **Temperature** | Creativity (low = precise, high = varied) |
| **Output length** | Limit the answer length |
| **Top P / Top K** | Control the variety of word choices |
| **Safety settings** | The level of content filtering |

## 🧱 System Instructions

Set the model's role, e.g.:
```
You are a Thai tutor who explains hard topics simply.
Answer in Thai, using everyday examples.
```
This makes answers consistent with what you want.

## 💡 Prompt-writing tips

- **Be specific** — state the context, goal, and desired output format
- **Give examples** (few-shot) — provide input/output examples for the model to mimic
- **Break it into steps** — for complex work, lay out the steps
- **Experiment with temperature** — higher for creative work, lower for factual work

## ▶️ Steps

1. Open the Chat/Prompt page in [aistudio.google.com](https://aistudio.google.com/)
2. Set the System instructions
3. Type a prompt, adjust settings, and see the result
4. Once happy, hit **Get code / API key** to use it for real

## 🔗 Reference

- Prompting strategies: https://ai.google.dev/gemini-api/docs/prompting-strategies
