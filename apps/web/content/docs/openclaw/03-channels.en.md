---
title: "OpenClaw: Channels — connect chat apps"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "intermediate"
summary: "Connect OpenClaw to Discord, Slack, Telegram, WhatsApp, Teams, and more to chat with the AI from the apps you use daily"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---

# Channels — connect chat apps to OpenClaw

> Compiled from the official docs at [docs.openclaw.ai](https://docs.openclaw.ai/), the Channels section

A **Channel** is a chat channel connected to the Gateway so you can talk to the AI assistant from the apps you use daily, instead of always opening the Control UI.

## 💬 Supported channels (built-in)

- **Discord**
- **Slack**
- **Telegram**
- **WhatsApp**
- **Microsoft Teams**
- **Google Chat**
- **Signal**
- **iMessage**
- **Matrix**
- **Zalo**
- **WebChat** (a chat page in the browser)

And there are additional **community plugins**, e.g. **Nostr** and **Twitch**

## 🔌 How to connect (overview)

Each channel has its own setup steps, but the principle is similar:

1. Create a bot/app on that platform (e.g. a Discord Bot, a Telegram Bot from BotFather) and get a **token**
2. Put the token in OpenClaw's config file (see the **Gateway Configuration** section)
3. Restart the Gateway and message the bot in that app

## 🛡️ Group chat security

- Set an **allowlist** of who can talk to the AI (e.g. `channels.whatsapp.allowFrom`)
- In groups, set it to reply only when **mentioned** (type @ the bot) to keep it from replying to every message
- Separate sessions per sender/per group (see the **Routing** section)

> Mobile: see the **Nodes** section for connecting iOS/Android as a channel/auxiliary device
