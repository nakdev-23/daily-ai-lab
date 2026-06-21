---
title: "What is Kimi — the long-reading AI assistant from Moonshot AI"
tool: "Kimi"
icon: "tool-kimi"
level: "beginner"
summary: "An overview of Kimi, Moonshot AI's assistant known for its very long context that can read lots of documents/web content"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# Kimi — the long-reading AI assistant 🌙

> Compiled in English from the official docs of the [Moonshot AI Platform](https://platform.moonshot.ai/) and the [kimi.com](https://www.kimi.com/) website

**Kimi** is an AI assistant developed by **Moonshot AI (月之暗面)**, an AI company from China. What makes Kimi stand out is that it **supports a very long context** — it reads long documents across many files, or large amounts of web content, well in one go. It's great for summarizing/analyzing long documents.

Its latest model family is **Kimi K2**, an open-weights model (MoE) good at both coding and agent work.

---

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **Context window** | The AI's "short-term memory" that it can read at once — the longer it is, the more documents you can include |
| **Kimi K2** | Moonshot's flagship model (open-weights, MoE architecture) |
| **Moonshot AI** | The company that created Kimi |
| **API** | The channel for developers to use Kimi in their own apps (compatible with the OpenAI format) |
| **Tool use** | Letting the model call external tools/functions (e.g. web search) |

---

## ⭐ Highlights

- **Genuinely reads long** — supports a very long context, great for summarizing/Q&A from PDF documents, reports, long codebases
- **Reads files and links** — upload a file or paste a link, then have Kimi summarize/analyze it
- **Can search the web** — pulls current information to answer
- **Kimi K2 is good at agent/code work** — does multi-step work and writes code well
- **Has an OpenAI-compatible API** — easy to migrate code from OpenAI

---

## 🚀 Two ways to get started

**1) Via the app/web (no coding needed)** — go to [kimi.com](https://www.kimi.com/), then chat, upload files, or paste links for it to summarize/analyze right away

**2) Via the API (for developers)** on the **Moonshot AI Platform**:
- Sign up and create an **API key**
- Call the **Chat Completions** endpoint (same structure as OpenAI), specifying a model name such as `kimi-k2` / `moonshot-v1-*`
- Use extra features like tool use / function calling and context caching to cut costs when sending repeated context

---

## 📚 Kimi docs table of contents (ordered per the official docs)

1. ✅ Kimi overview (this page)
2. ⏳ Getting started — sign up and create an API key
3. ⏳ Chat Completions API — basic usage
4. ⏳ Available models (Kimi K2 / Moonshot v1) and the context window
5. ⏳ Tool Use / Function Calling
6. ⏳ Context Caching — save cost when reusing context
7. ⏳ Pricing and limits

---

## 🔗 References (official docs)

- Moonshot AI Platform (API): https://platform.moonshot.ai/
- Kimi web/app: https://www.kimi.com/
