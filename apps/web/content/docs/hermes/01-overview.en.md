---
title: "What is Hermes Agent — an AI Agent that learns and improves itself"
tool: "Hermes"
icon: "tool-hermes"
level: "beginner"
summary: "An overview of Nous Research's Hermes Agent — an open-source AI agent with a learning loop and persistent memory"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# Hermes Agent — an AI Agent that "grows with you" ☤

> Compiled in English from the official docs at [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)

**Hermes Agent** is an **open-source AI agent (MIT License)** developed by **Nous Research**. Its unique highlight is a built-in **"learning loop"** — it builds skills from experience, improves those skills as it's used, saves knowledge itself, can search its own past conversations, and gradually understands "you" more across sessions.

Slogan: *"The agent that grows with you."*

---

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **Agent** | An AI that does work itself (search the web, control a browser, generate images, etc.) |
| **Learning loop** | The cycle where Hermes "learns from use" and keeps getting better |
| **Skill** | A skill Hermes creates/improves itself from experience |
| **Memory** | Persistent memory that carries across sessions (searched with FTS5 + summarized with an LLM) |
| **Gateway** | The runner that lets you talk to Hermes through various chat apps |
| **MCP** | Model Context Protocol — the standard for connecting AI to external tools/data |

---

## ⭐ Highlights

- **Learns and improves itself** — a closed feedback loop builds new skills + improves itself
- **Persistent memory** — remembers data across sessions, searched with FTS5 and summarized with an LLM
- **Lots of tools** — 60+ built-in tools, including web control, vision, image generation, text-to-speech
- **Works with many models** — connect to Nous Portal, OpenRouter, OpenAI, or any endpoint
- **Reachable on 20+ chat platforms** — Telegram, Discord, Slack, WhatsApp, Signal, Email, etc. from one gateway
- **Run it anywhere** — your own machine, Docker, SSH, Daytona, Singularity, or Modal
- **Supports MCP** — connect to MCP servers to add capabilities

---

## 🚪 Two entry points

1. **Terminal UI** — run `hermes` to open the usage screen in the terminal
2. **Gateway** — run the gateway and talk to Hermes via Telegram / Discord / Slack / WhatsApp / Signal / Email

Once in a conversation, there are several **slash commands** that work in both modes.

**Install:** download the Desktop installer, or run the script for your system (bash for Linux/macOS/WSL2, PowerShell for Windows), e.g.:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

---

## 📚 Hermes docs table of contents (ordered per the official docs)

1. ✅ Hermes overview (this page)
2. ⏳ User Stories & Use Cases — real-world usage examples
3. ⏳ Getting Started — initial Quickstart
4. ⏳ Using Hermes — using it via the CLI
5. ⏳ Features — capabilities overview
6. ⏳ Messaging Platforms — connect chat platforms
7. ⏳ Integrations — connecting to external services/models
8. ⏳ Guides & Tutorials — practical guides
9. ⏳ Developer Guide — for developers/contributing
10. ⏳ Reference — the list of CLI commands

---

## 🔗 References (official docs)

- Main docs: https://hermes-agent.nousresearch.com/docs/
- Website: https://hermes-agent.nousresearch.com/
- Source code (GitHub): https://github.com/nousresearch/hermes-agent
