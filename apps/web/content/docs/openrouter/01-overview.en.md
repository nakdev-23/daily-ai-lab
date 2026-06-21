---
title: "What is OpenRouter — one API, call every AI model"
tool: "OpenRouter"
icon: "tool-openrouter"
level: "beginner"
summary: "An overview of OpenRouter, an API gateway that gives access to hundreds of AI models through one place"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# OpenRouter — one API, use every model 🔀

> Compiled in English from the official docs at [openrouter.ai/docs](https://openrouter.ai/docs)

**OpenRouter** is a **gateway that combines the APIs of hundreds of AI models** from many providers (OpenAI, Anthropic, Google, Meta, Mistral, etc.) in one place — you write one kind of code, then switch between any models, with no need to sign up for many accounts or change your code every time you switch models.

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **Gateway** | The intermediary that forwards your request to the actual model provider |
| **Provider** | The actual model owner (e.g. OpenAI, Anthropic) |
| **Routing** | Choosing which provider to send the work to (fastest/cheapest/backup) |
| **Credits** | Prepaid credits, pay for actual usage |
| **OpenAI-compatible** | Uses the same API format as OpenAI; change the URL and it works |

## ⭐ Highlights

- **Tons of models in one place** — switch versions/brands by changing just the model name
- **Compatible with the OpenAI API** — migrate existing code almost instantly
- **Smart Routing** — pick the fast/cheap provider, or auto-fallback when one goes down
- **One combined bill** — top up credits once, use any model
- **Has advanced features** — Prompt Caching, Structured Outputs, Tool Calling

## 🚀 Getting started

1. Sign up and create an API key at [openrouter.ai](https://openrouter.ai/)
2. Call it just like OpenAI — just change the base URL:
   ```bash
   curl https://openrouter.ai/api/v1/chat/completions \
     -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     -d '{"model":"anthropic/claude-opus-4-8","messages":[{"role":"user","content":"Hello"}]}'
   ```
3. Want to change models? Just edit the `model` value, e.g. `openai/gpt-4o`, `google/gemini-2.5-pro`

## 📚 OpenRouter docs table of contents (per the official docs)

1. ✅ Overview (this page)
2. ⏳ Quickstart — your first API call
3. ⏳ Models — model names and naming
4. ⏳ Provider Routing — select/backup providers
5. ⏳ Prompt Caching & Structured Outputs
6. ⏳ Tool Calling (Function Calling)
7. ⏳ API Reference

## 🔗 References

- Official docs: https://openrouter.ai/docs
- Model list: https://openrouter.ai/models
