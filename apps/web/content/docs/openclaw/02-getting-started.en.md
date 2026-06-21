---
title: "OpenClaw: getting started (install → onboard → chat)"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "beginner"
summary: "Install OpenClaw, run onboarding, and chat with your AI assistant in ~5 minutes"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---

# Getting started with OpenClaw

> Compiled from the official docs at [Getting Started](https://docs.openclaw.ai/start/getting-started)

Goal: install OpenClaw, do the initial setup (onboarding), and have a working **Gateway** + a chat session ready, in about 5 minutes.

## ✅ What you need first

- **Node.js** — version **24** recommended (supports 22.19+)
- An **API key** from some model provider — Anthropic (Claude), OpenAI (GPT), Google (Gemini), etc.

## 🚀 Steps

1. **Install** — run the install script (macOS/Linux uses bash, Windows uses PowerShell) per the commands on the official Getting Started page
2. **Onboarding** — run:
   ```bash
   openclaw onboard --install-daemon
   ```
   The helper walks you through setting up the provider/token and installs the daemon (so the Gateway runs persistently as a service)
3. **Check the Gateway status**:
   ```bash
   openclaw gateway status
   ```
4. **Open the dashboard**:
   ```bash
   openclaw dashboard
   ```
5. **Send your first message** via the Control UI — if it replies, everything is ready

## ⚙️ Further configuration (optional)

- Adjust paths/state via environment variables: `OPENCLAW_HOME`, `OPENCLAW_STATE_DIR`, `OPENCLAW_CONFIG_PATH`
- Adjust the Control UI folder at `gateway.controlUi.root`

## Next steps

Connect chat channels (see the **Channels** section), enable security (**Security**), or explore **Tools & Plugins**
