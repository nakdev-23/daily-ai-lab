---
title: "OpenClaw: Gateway Configuration — core settings"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "intermediate"
summary: "Configure OpenClaw's Gateway — provider/model, tokens, paths, and config file"
readTime: "5 min"
readers: "0"
locked: false
order: 5
---

# Gateway Configuration — OpenClaw's core settings

> Compiled from the official docs at [docs.openclaw.ai](https://docs.openclaw.ai/), the Gateway section

The **Gateway** is the heart of OpenClaw — a single process running on your machine that acts as the bridge connecting chat apps to the AI model. Most configuration lives here.

## 🧠 Provider & model

- You need an **API key** for your chosen provider (Anthropic / OpenAI / Google, etc.)
- The official docs recommend using **the latest, most powerful model** for agent quality and safety
- Specify the provider/model/token in the config file

## 🔑 Tokens and channels

- Each **channel's** token (Discord, Telegram, etc.) goes in that channel's config section
- A token for accessing the Gateway/Control UI for authentication

## 📁 File locations and paths

Adjust via environment variables:

| Variable | What it's for |
|---|---|
| `OPENCLAW_HOME` | OpenClaw's main folder |
| `OPENCLAW_STATE_DIR` | Where state/runtime data is stored |
| `OPENCLAW_CONFIG_PATH` | The config file path |
| `gateway.controlUi.root` | The Control UI page folder (customizable) |

## 🔧 Commonly used commands

```bash
openclaw onboard --install-daemon   # initial setup + install the service
openclaw gateway status             # check whether the Gateway is running
openclaw dashboard                  # open the control page
```

> After editing the config, restart the Gateway for the new values to take effect
