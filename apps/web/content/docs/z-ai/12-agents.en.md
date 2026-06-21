---
title: "Z.ai: Agents — multi-step agent work"
tool: "Z.ai"
icon: "tool-z-ai"
level: "pro"
summary: "Use GLM's agent capabilities to do multi-step work with tool calling"
readTime: "4 min"
readers: "0"
locked: false
order: 12
---

# Agents — have GLM work step by step 🤖

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

The GLM model is designed to be good at **agentic** work — not just answering, but planning, calling tools, and doing multi-step work to completion.

## 🧩 Components of an agent

| Part | Role |
|---|---|
| **Reasoning** | Think/plan step by step |
| **Tool calling** | Call defined tools/APIs |
| **Web search** | Pull current information |
| **Memory/context** | Remember what it did in the task |

## 🔄 How it works

1. Receive the goal from the user
2. **Plan** the steps (using reasoning)
3. **Call tools** step by step (tool calling / web search)
4. Combine the results and summarize the answer/output

## 🧑‍💻 Build your own

Assemble an agent from the pieces z.ai offers:
- [Tool / Function Calling](06-tool-calling)
- [Web Search](09-web-search)
- [Reasoning](10-reasoning)

Or use it through ready-made agent experiences on [chat.z.ai](https://chat.z.ai/) (e.g. a slide-making assistant / full-process work)

## 💡 Tips

- Write the goal + success criteria clearly
- Limit the number of rounds/tools to control cost
- Check the result before actually using it

## 🔗 References

- Official docs: https://docs.z.ai/
