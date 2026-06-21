---
title: "Cursor: Context & Rules — make the AI understand your project"
tool: "Cursor"
icon: "tool-cursor"
level: "intermediate"
summary: "Indexing the codebase, using @-symbols, and Rules so the AI follows your project's guidelines"
readTime: "5 min"
readers: "0"
locked: false
order: 5
---

# Context & Rules — feed context to the AI 🧩

> Adapted from the official documentation at [cursor.com/docs](https://cursor.com/docs), the Context / Rules section

How good the AI's answer is depends on the "context" it sees. Cursor has several ways to feed context.

## 🗂️ Codebase Indexing

Cursor **indexes** the whole project so the AI can find and reference the relevant files itself — making its answers about the project more accurate without you pointing at files every time.

## 📎 @-symbols (point at context yourself)

| Symbol | Refers to |
|---|---|
| `@file / @folder` | Specific code |
| `@Code` | A piece of code |
| `@Web` | Search the internet |
| `@Docs` | External library documentation |
| `@Git` | History/changes |

## 📜 Rules (project rules)

**Rules** are guidelines you write for the AI to always follow, kept in the project (e.g. the `.cursor/rules` folder), such as:

```
- Always use TypeScript, never use any
- Name components in PascalCase
- Write explanatory comments in Thai
- Use Tailwind for styling
```

Every time the Agent/Chat works, it references these rules, making the resulting code consistent with the team's style.

## 💡 Tips

- Write Rules short, clear, as bullet points
- Add task-specific context with `@` on top of the index
- If the AI's answer goes off track, it's usually because there isn't enough context — point at files more clearly

## 🔗 Reference

- Official docs: https://cursor.com/docs
