---
title: "Hermes: Getting Started — install and start using it"
tool: "Hermes"
icon: "tool-hermes"
level: "beginner"
summary: "Install Hermes Agent and start chatting via the Terminal UI or the Gateway"
readTime: "4 min"
readers: "0"
locked: false
order: 3
---

# Getting started with Hermes

> Compiled from the official docs at [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/), the Getting Started / Quickstart section

## ⬇️ Install

Choose one option:

- **The Desktop installer** — download from the official website
- **A script for your system** — bash for Linux/macOS/WSL2, PowerShell for Windows, e.g.:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

## 🔑 Connect a model (Provider)

Hermes can connect to models from many sources — **Nous Portal**, **OpenRouter**, **OpenAI**, or any endpoint (see the **Integrations** section). Have the API key for your chosen source ready.

## 🚪 Two ways to start chatting

1. **Terminal UI** — run `hermes` to open the usage screen in the terminal
2. **Gateway** — run the gateway and chat via Telegram / Discord / Slack / WhatsApp / Signal / Email

Once in a conversation, there are several **slash commands** that work in both modes (see the **Reference** section).

## 🏃 Run it anywhere

Hermes can run on your own machine, Docker, SSH, Daytona, Singularity, or Modal — pick whatever's convenient.

> Next step: see **Using Hermes (CLI)** to use it from the command line, and **Features** to learn about all its capabilities
