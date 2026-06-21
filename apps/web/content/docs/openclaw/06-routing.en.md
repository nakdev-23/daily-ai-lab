---
title: "OpenClaw: Multi-Agent Routing — separate sessions and workspaces"
tool: "OpenClaw"
icon: "tool-openclaw"
level: "pro"
summary: "Route messages to multiple agents and separate sessions/workspaces for security and tidiness"
readTime: "4 min"
readers: "0"
locked: false
order: 6
---

# Multi-Agent Routing — many agents, separate spaces

> Compiled from the official docs at [docs.openclaw.ai](https://docs.openclaw.ai/), the Routing section

OpenClaw supports having **multiple agents** and routing messages to the right agent, with **separate sessions** so one person's data doesn't mix with another's.

## 🧩 Core concepts

- **Workspace isolation** — each agent/workspace is separate, files/context don't mix
- **Separate sessions per agent / workspace / sender** — e.g. each person in a group has their own conversation
- **Routing** — define which agent a message from which channel/sender should go to

## 💡 Why it matters

- **Security** — prevents one person's context/permissions from leaking to another
- **Tidiness** — different projects/teams use different agents
- **Continuity** — each session remembers its own context without confusion

> Use it together with the **Security** section (allowlists, mentions in groups) to control who can access which agent
