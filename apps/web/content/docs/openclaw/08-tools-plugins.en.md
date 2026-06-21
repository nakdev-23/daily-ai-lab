---
title: "OpenClaw: Tools & Plugins — tools and extensions"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "pro"
summary: "The tools the agent can use, extra channel plugins, and mobile connections (Nodes)"
readTime: "4 min"
readers: "0"
locked: false
order: 8
---

# Tools & Plugins — extend OpenClaw's capabilities

> Compiled from the official docs at [docs.openclaw.ai](https://docs.openclaw.ai/), the Tools & Plugins / Nodes section

OpenClaw can be extended in many ways — from the tools the agent calls to channel plugins and mobile devices.

## 🧰 Tools

The agent uses tools to actually "take action," e.g. access files, run shell commands, control the browser, and handle media (images/audio/documents) — making it not just chat replies but able to get work done.

## 🧩 Plugins (extensions)

- **Channel plugins** — add chat channels beyond the built-in ones, e.g. **Nostr**, **Twitch** (from the community)
- Bundled or external extensions that add specialized capabilities

## 📱 Nodes — mobile connection

OpenClaw supports connecting **iOS / Android** as a "node" to unlock extra capabilities, e.g. camera/Canvas workflows, and using your phone as a channel/device for the agent.

## 🌐 Web Control UI

The browser control page (`openclaw dashboard`) is used to view status, configure, and chat with the agent directly. Customize the page folder at `gateway.controlUi.root`.

> See token/security settings for each tool in the **Gateway Configuration** and **Security** sections
