---
title: "Ollama: basic commands — run, pull, list, rm"
tool: "Ollama"
icon: "tool-ollama"
level: "beginner"
summary: "Ollama's main commands for downloading, running, and managing models on your machine"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---

# Ollama's basic commands 🧰

> Compiled in English from the official docs at [github.com/ollama/ollama](https://github.com/ollama/ollama)

After installing Ollama, you use it through the terminal with just a few commands.

## ⌨️ Commonly used commands

| Command | What it does |
|---|---|
| `ollama run <model>` | Run a model (auto-downloads if you don't have it) and start chatting |
| `ollama pull <model>` | Just download a model to keep |
| `ollama list` | See the models on your machine |
| `ollama ps` | See the models currently running |
| `ollama rm <model>` | Remove a model from your machine |
| `ollama cp <src> <dst>` | Copy a model (to customize further) |
| `ollama show <model>` | See a model's details |

## 🏷️ Specifying the version/size (tag)

Add the size after a `:`, e.g.
```bash
ollama run llama3.2:1b      # small, light version
ollama run qwen2.5:7b       # mid-size version
ollama run llama3.3:70b     # large version, needs a powerful machine
```

## ▶️ Usage example

```bash
ollama run llama3.2
>>> Hi, please explain AI for me
# Type /bye to exit the chat
```

## 💡 Tips

- A bigger version is smarter but uses more RAM/VRAM — start with a small one
- Remove unused models with `ollama rm` to save space

## 🔗 References

- Docs/source code: https://github.com/ollama/ollama
