---
title: "Hermes: Integrations — connect to models and services"
tool: "Hermes"
icon: "tool-hermes"
level: "pro"
summary: "Choose a model provider (Nous Portal, OpenRouter, OpenAI, or any endpoint) and connect MCP"
readTime: "4 min"
readers: "0"
locked: false
order: 7
---

# Integrations — connect Hermes to models/services

> Compiled from the official docs at [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/), the Integrations section

## 🧠 Providers (model sources)

Hermes isn't tied to one model — it connects to many sources:

| Provider | Note |
|---|---|
| **Nous Portal** | Nous Research's own platform |
| **OpenRouter** | A gateway combining many models in one place |
| **OpenAI** | GPT models |
| **Any endpoint** | Connect to any compatible API yourself (including local models) |

Have the **API key** for your chosen source ready, then configure it in Hermes.

## 🔌 MCP (Model Context Protocol)

Connect **MCP servers** so Hermes can access external tools/data in a standard way — extending capabilities without writing a plugin yourself.

## 🏗️ Run it anywhere

Besides your own machine, Hermes can run on Docker, SSH, Daytona, Singularity, or Modal — choose the infrastructure that suits the job (e.g. running persistently on a VPS so you can chat with it anytime).

> See chat-platform connections in **Messaging Platforms** and all commands in **Reference**
