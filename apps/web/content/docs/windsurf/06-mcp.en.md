---
title: "Windsurf: MCP — connect external tools to Cascade"
tool: "Windsurf"
icon: "tool-windsurf"
level: "pro"
summary: "Connect Cascade to external tools/services via the Model Context Protocol (MCP)"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---

# MCP — let Cascade use external tools 🔌

> Compiled in English from the official docs at [windsurf.com/docs](https://docs.windsurf.com/), the MCP section

**MCP (Model Context Protocol)** is a common standard that lets AI assistants like Cascade **connect to external tools and services** such as databases, GitHub, document systems, or your own company's API — so the AI doesn't just know the code on your machine but can pull data/operate other systems too.

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **MCP Server** | The intermediary that exposes a particular tool/data to the AI |
| **Tool** | A capability the MCP server exposes (e.g. query a database) |
| **Client** | The side that calls it (here, Windsurf/Cascade) |

## ⭐ What it's for

- Have Cascade search/edit data in a real database
- Connect to GitHub, a task manager, or internal company services
- Add new capabilities to the AI without waiting for a built-in feature

## ▶️ How to start (overview)

1. Open the MCP settings in Windsurf
2. Add the MCP server you want (specify the run command or the server's URL)
3. Once connected, Cascade sees the new "tools" and can call them itself when needed

> ⚠️ An MCP server can access real data — only install trusted ones, and be careful with access permissions

## 🔗 References

- Official docs: https://docs.windsurf.com/
- About MCP: https://modelcontextprotocol.io/
