---
title: "Cursor: Models & MCP — choose a model and connect external tools"
tool: "Cursor"
icon: "tool-cursor"
level: "pro"
summary: "Choose the AI model used in Cursor and connect external tools via MCP"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---

# Models & MCP — choose the brain and connect tools 🔌

> Adapted from the official documentation at [cursor.com/docs](https://cursor.com/docs), the Models / MCP section

## 🧠 Models — choose the model to use

Cursor lets you choose among several AI models from various providers (e.g. the Claude, GPT, Gemini families) from the model selector in the Chat/Agent panel.

- Models differ in capability, speed, and the context they can take
- Complex reasoning / editing many files → choose a model strong at reasoning
- Quick general work → choose a faster model
- **Auto** mode lets Cursor pick the model suited to the work for you

## 🔗 MCP (Model Context Protocol)

**MCP** is a common standard that lets Cursor's Agent **connect to external tools/services**, e.g. databases, task management systems, documents, or your organization's internal APIs.

### What it's used for
- Let the Agent pull/edit real data from other systems
- Connect to services the team uses (e.g. an issue tracker, a database)

### Setup (overview)
1. Open the MCP settings in Cursor
2. Add an MCP server (specify the run command or URL)
3. The Agent sees the new "tools" and calls them itself when needed

> ⚠️ An MCP server can access real data — only install ones you trust.

## 🔗 Reference

- Official docs: https://cursor.com/docs
- About MCP: https://modelcontextprotocol.io/
