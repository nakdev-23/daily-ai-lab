---
title: "What is OpenClaw — an open-source AI Agent that runs on your own machine"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "beginner"
summary: "An overview of OpenClaw, an open-source AI agent gateway, and how to get started (install → onboard → chat)"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# OpenClaw — an open-source personal AI assistant 🦞

> Compiled in English from the official docs at [docs.openclaw.ai](https://docs.openclaw.ai/) — especially the [Getting Started](https://docs.openclaw.ai/start/getting-started) page

**OpenClaw** is an **open-source AI agent (free)** that **runs on your own machine (self-hosted)**. It acts as a **Gateway** connecting language models (Claude, GPT, Gemini, DeepSeek, Grok, or local models) to **files, the shell, the browser, chat apps, and various services** — and lets you talk to it from the chat apps you use every day.

Its mascot is a "lobster" 🦞 and its slogan is "Any OS. Any Platform. The lobster way."

---

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **Agent** | An AI that "takes action" itself, not just chat replies (open files, run commands, search the web, etc.) |
| **Gateway** | The intermediary running on your machine that receives messages from chat apps and hands them to the AI to work on |
| **Channel** | A connected chat channel, e.g. Discord, Slack, Telegram, WhatsApp |
| **Provider** | The model provider (Anthropic, OpenAI, Google, etc.) for which you need an API key |
| **Self-hosted** | You run it yourself on your machine/server; data doesn't pass through a middleman |

---

## ⭐ Highlights

- **Open source + self-hosted** — full control over your data and privacy
- **Connects many chat apps** — Discord, Google Chat, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo, and more
- **Choose models freely** — connect to Claude/GPT/Gemini/Grok/DeepSeek or local models
- **Actually does work on your machine** — accesses files, the shell, the browser, and other tools
- **Has a security system** — tokens, allowlists, workspace isolation, separate sessions per agent

---

## 🚀 Get started in ~5 minutes

**What you need:** Node.js (version 24 recommended, supports 22.19+) and an **API key** from some model provider (e.g. Anthropic, OpenAI, Google)

**Steps:**

1. **Install** — run the install script (macOS/Linux via bash, Windows via PowerShell)
2. **Onboarding** — run `openclaw onboard --install-daemon` to do the initial setup + install the daemon
3. **Check the Gateway status** — `openclaw gateway status`
4. **Open the dashboard** — `openclaw dashboard`
5. **Send your first message** via the Control UI — once done, you'll have a working Gateway + auth configured + a chat session ready

> Configure further via environment variables like `OPENCLAW_HOME`, `OPENCLAW_STATE_DIR`, `OPENCLAW_CONFIG_PATH`, and tune the Control UI at `gateway.controlUi.root`

**Next steps:** connect chat channels (Discord/Slack/Telegram, etc.), set up safety pairing, customize the Gateway, or explore the available tools

---

## 📚 OpenClaw docs table of contents (ordered per the official docs)

1. ✅ OpenClaw overview (this page)
2. ⏳ Getting Started — install and first chat
3. ⏳ Core Gateway — configuration, tokens, setting up a provider
4. ⏳ Channels — connect chats (Discord, Slack, Telegram, WhatsApp, Teams, etc.)
5. ⏳ Routing & Media — routing messages and media
6. ⏳ Tools — the tools the agent can use
7. ⏳ Safety & Workspace — allowlists, tokens, workspace isolation

---

## 🔗 References (official docs)

- Main docs: https://docs.openclaw.ai/
- Getting started: https://docs.openclaw.ai/start/getting-started
- Source code (GitHub): https://github.com/openclaw/openclaw
