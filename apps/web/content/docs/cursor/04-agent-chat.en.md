---
title: "Cursor: Agent & Chat — command the AI across the whole project"
tool: "Cursor"
icon: "tool-cursor"
level: "intermediate"
summary: "Use Chat to ask about code, and the Agent to edit files / run commands across the whole project"
readTime: "6 min"
readers: "0"
locked: false
order: 4
---

# Agent & Chat — chat with and command the whole project 🤖

> Adapted from the official documentation at [cursor.com/docs](https://cursor.com/docs), the Chat / Agent section

Cursor's AI panel (open it with `Ctrl/Cmd + L`) can both do Q&A and edit the code for you.

## 💬 Chat (Ask) vs 🛠️ Agent

| Mode | What it does |
|---|---|
| **Ask / Chat** | Ask about code, explain, find bugs, without editing files |
| **Agent** | Edits files, runs commands, does multi-step work to completion |

## 🧠 What the Agent can do

- Edit multiple files from a single instruction
- Find related files/code on its own
- Run commands in the terminal (e.g. install packages, run tests)
- See an error and keep fixing it

## 📎 Add context with @

Type `@` to point the AI at what it should look at:
- `@file` — reference a specific file
- `@folder` — reference a whole folder
- `@Web` — have it search the web
- `@Docs` — reference a library's documentation

## ▶️ Usage example

1. Press `Ctrl/Cmd + L` to open the panel
2. Choose **Agent** mode
3. Type "Add a user profile page, pulling data from @api/user.ts"
4. Review the proposed edits, then hit **Accept** spot by spot or all at once

## 💡 Tips

- The clearer the goal + the more you use `@` to point at relevant files, the more on-target the result
- Break big work into steps; it's easier to control

## 🔗 Reference

- Official docs: https://cursor.com/docs
