---
title: "What is Ollama — run open-source AI models on your own machine"
tool: "Ollama"
icon: "tool-ollama"
level: "beginner"
summary: "An overview of Ollama, a tool for running language models (LLMs) on your own machine, simply"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# Ollama — run AI models on your own machine 🦙

> Compiled in English from the official docs at [ollama.com](https://ollama.com/) and [GitHub: ollama/ollama](https://github.com/ollama/ollama)

**Ollama** is a tool that makes it very easy to **run open-source language models (LLMs) on your own machine** — download a model, then run it with a single command. It works **offline**, your data never leaves the machine, making it great for work where you care about privacy or want to save on API costs.

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **LLM** | A large language model (e.g. Llama, Mistral, Qwen) |
| **Local / offline** | Runs on your machine, no internet needed, no data sent out |
| **Pull** | Download a model to store on your machine |
| **Model tag** | A model's name+size, e.g. `llama3.2`, `qwen2.5:7b` |
| **REST API** | A channel for other programs to call Ollama (at `localhost:11434`) |

## ⭐ Highlights

- **Easy to install, run with one command** — `ollama run <model>`
- **Offline + private** — your data stays on the machine
- **Lots of models to choose from** — Llama, Mistral, Qwen, Gemma, DeepSeek, Phi, etc.
- **Built-in API** — connect with your app/code (supports an OpenAI-compatible format)
- **Cross-platform** — macOS, Windows, Linux

## 🚀 Getting started

1. Download and install from [ollama.com](https://ollama.com/)
2. Open a terminal and run a model (it downloads automatically the first time):
   ```bash
   ollama run llama3.2
   ```
3. Just start typing — or call it via the API:
   ```bash
   curl http://localhost:11434/api/generate -d '{"model":"llama3.2","prompt":"Hello"}'
   ```
4. Download a model to keep: `ollama pull qwen2.5` · See what you have: `ollama list`

> Model size (e.g. 7b, 70b) — bigger is smarter but uses more RAM/GPU — pick what fits your machine

## 📚 Ollama docs table of contents (per the official docs)

1. ✅ Overview (this page)
2. ⏳ Installation and basic commands (run, pull, list, rm)
3. ⏳ REST API & OpenAI-compatible API
4. ⏳ Modelfile — create/customize your own model
5. ⏳ Using a GPU and performance tuning

## 🔗 References

- Website/download: https://ollama.com/
- Docs/source code: https://github.com/ollama/ollama
