---
title: "OpenClaw: Security — tokens, allowlists, and safety controls"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "pro"
summary: "Control who can talk to the AI and make an agent that accesses your machine/files run safely"
readTime: "4 min"
readers: "0"
locked: false
order: 7
---

# Security — OpenClaw's security

> Compiled from the official docs at [docs.openclaw.ai](https://docs.openclaw.ai/), the Security section

Because OpenClaw is an agent that accesses **files, the shell, and tools on your machine**, security control is very important, especially when connected to public/group chats.

## 🔒 Main measures

- **Allowlist** — define the list of people who can talk to the agent (e.g. `channels.whatsapp.allowFrom`); those off the list are ignored
- **Require a mention in groups** — in group chats, set it to reply only when @-mentioned to prevent replying to every message
- **Separate sessions per sender** — each person's context/permissions don't mix (see **Routing**)
- **Tokens** — used to authenticate access to the Gateway/Control UI

## ✅ Good practices

- Always use an allowlist when opening access from public chats
- Use the latest, powerful model (per the official recommendation) because it understands intent and resists prompt injection better
- Limit the tools/folders the agent can access to only what's necessary
- Review logs/activity periodically

> OpenClaw runs on your own machine (self-hosted) — data doesn't pass through a middleman, but the responsibility for configuring it securely is also yours
