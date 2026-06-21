---
title: "Claude Managed Agents"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Claude Managed Agents provide a 'harness' (a ready-made structure wrapping Claude) and the infrastructure to run Claude as an automatic agent"
readTime: "4 min"
readers: "0"
locked: false
order: 5
---
# Claude guide — Part 5: Claude Managed Agents

> Compiled from [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview) — a ready-made agent structure (an AI that does automatic multi-step work) where Anthropic manages the infrastructure for you, good for long-running and background work

---

## 📖 Key terms for Managed Agents

| Term | Plain meaning |
|---|---|
| **Agent** | An AI that does automatic, continuous multi-step work without instructing each step |
| **Managed** | Anthropic maintains the system for you; you don't build or manage servers yourself |
| **Infrastructure** | The underlying systems supporting operation, e.g. servers, databases |
| **Harness** | A ready-made structure supporting the agent's operation — like a "frame" wrapping Claude |
| **Sandbox** | A separate, safe workspace that doesn't affect other systems |
| **Stateful** | Having state — remembers files, history, and working state across requests (unlike stateless, which forgets each time) |
| **Asynchronous** | Working in the background, not waiting for results immediately — send the work then do something else while you wait |
| **SSE** (Server-Sent Events) | A technique for continuously sending data from a server to an app, to receive results piece by piece |
| **Self-hosted** | Running on your own server instead of using a cloud service |
| **ZDR** (Zero Data Retention) | Not keeping data after processing, good for highly privacy-sensitive data |
| **HIPAA BAA** | A cooperation agreement under US health law for medical data |
| **Compliance** | Adhering to defined standards or laws |
| **Data residency** | A requirement that data be stored in a certain country or region |
| **Vault** | A secure store for credentials, e.g. passwords or API keys |

---

## 1. Managed Agents overview
Reference: [Overview](https://platform.claude.com/docs/en/managed-agents/overview)

### What is this topic?
Claude Managed Agents provide a **"harness"** (a ready-made structure wrapping Claude) and infrastructure to run Claude as an automatic agent. Instead of building the agent loop (working cycle), tool execution, and runtime (execution environment) yourself, Anthropic handles all of it, with Claude reading files, running commands, searching the web, and running code safely in a **sandbox** (a separate space). It also has prompt caching (caching repeated data), compaction (compressing context), and built-in automatic performance tuning.

### Compared to the Messages API
| | Messages API | Managed Agents |
|---|---|---|
| What it is | Direct model access | A ready-made harness/agent on managed infrastructure |
| Good for | A self-controlled, fine-grained agent loop | Long work, asynchronous operation |

### What it's used for (what kind of work)
- Work that runs for many minutes/hours with many tool calls
- Needing a cloud sandbox with packages pre-installed and internet access
- Wanting to run on your own infrastructure (self-hosted) for compliance/data residency
- Not wanting to build the agent loop/sandbox/tool execution yourself
- Wanting stateful sessions (the file system and conversation history persist)

### Quick summary
Managed Agents = a managed automatic agent with a sandbox + state, good for long/multi-step work, no need to build the loop yourself.

---

## 2. The 4 core concepts
Reference: [Overview](https://platform.claude.com/docs/en/managed-agents/overview)

| Concept | Description |
|---|---|
| **Agent** | The configuration of Claude for this work — defines the model, system prompt (behavior instructions), tools, MCP servers, and skills |
| **Environment** | Where the session runs — Anthropic's cloud sandbox or **self-hosted** (running on your own server) for compliance |
| **Session** | One working session — an instance (a running example) of the agent in an environment, producing output and having its own state |
| **Events** | The messages exchanged between the app and the agent, e.g. user questions, tool results, status |

### Quick summary
Remember 4 words: Agent (the definition), Environment (where it runs), Session (the running instance), Events (the communication messages).

---

## 3. How it works
Reference: [Overview](https://platform.claude.com/docs/en/managed-agents/overview) · [Quickstart](https://platform.claude.com/docs/en/managed-agents/quickstart)

### How to use it (Step-by-step)
1. **Create an Agent** — define the model, system prompt, tools, MCP servers, skills, then reference it by ID across sessions
2. **Create an Environment** — choose to run it on the cloud sandbox or a [self-hosted sandbox](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)
3. **Start a Session** — open a session referencing the agent + environment
4. **Send Events and stream results** — send user messages as events; Claude runs tools automatically and streams (sends piece by piece) results back via **SSE (Server-Sent Events)** — a technique for continuously sending data from a server; the event history is stored server-side and fully retrievable
5. **Steer or interrupt** — send more events to adjust direction mid-way, or interrupt to change direction

### Related endpoints
- Agents: `POST /v1/agents`, `GET /v1/agents`
- Sessions: `POST /v1/sessions`, `GET /v1/sessions/{id}/stream`
- Environments: `POST /v1/environments`, `GET /v1/environments`

### Quick summary
Create an Agent → create an Environment → start a Session → send events/stream results → steer or interrupt.

---

## 4. Supported tools
Reference: [Tools](https://platform.claude.com/docs/en/managed-agents/tools)

### Key details from the official docs
Managed Agents give Claude built-in tools:
- **Bash** — run shell commands in the sandbox
- **File operations** — read, write, edit, glob, grep files in the sandbox
- **Web search & fetch** — search the web and fetch content from URLs
- **MCP servers** — connect external tool providers

There are also [permission policies](https://platform.claude.com/docs/en/managed-agents/permission-policies), [Agent Skills](https://platform.claude.com/docs/en/managed-agents/skills), and [vaults](https://platform.claude.com/docs/en/managed-agents/vaults) for storing credentials.

### Quick summary
There's built-in Bash, file management, web search/fetch, and MCP, with a permission system and vault.

---

## 5. Beta access and data policy
Reference: [Overview](https://platform.claude.com/docs/en/managed-agents/overview) · [Reference](https://platform.claude.com/docs/en/managed-agents/reference)

### Key details from the official docs
- It's currently **beta**; every endpoint must include the header `managed-agents-2026-04-01` (the SDK adds it automatically)
- You need: an API key + beta header + access to Managed Agents (enabled for all API accounts by default)
- Within beta: [MCP tunnels](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview) and dreaming are a limited research preview; you must [request access](https://claude.com/form/claude-managed-agents)

### Cautions (data policy)
- Managed Agents are **stateful** by design: sessions persist and can be resumed, and the history/sandbox state/output is stored server-side
- For this reason it **doesn't yet qualify for Zero Data Retention (ZDR)** (no data kept after processing) **or a HIPAA BAA** (an agreement for medical data)
- You can control the data: delete sessions and uploaded files via the API at any time

### Quick summary
Still beta (must include the beta header), stateful so ZDR/HIPAA isn't yet supported, but you can delete sessions/files yourself.

---

## 6. Advanced session management
Reference: [Session operations](https://platform.claude.com/docs/en/managed-agents/session-operations) · [Events and streaming](https://platform.claude.com/docs/en/managed-agents/events-and-streaming) · [Multi-agent](https://platform.claude.com/docs/en/managed-agents/multi-agent)

### Key details from the official docs
- **Session operations** — create, view, pause, resume, and delete sessions
- **Event stream** — receive events in real time via SSE; subscribe to [webhooks](https://platform.claude.com/docs/en/managed-agents/webhooks) to get notified
- **Define outcomes** — define the expected results/success conditions
- **Files** — attach and download files into/out of the session
- **GitHub access** — give the agent access to a GitHub repo
- **Multiagent sessions** — orchestrate several agents working together

### Quick summary
Manage sessions (resume/delete), receive events via SSE/webhooks, define outcomes, attach files, connect GitHub, and do multi-agent.

---

## Additional reference topics
- Quickstart: https://platform.claude.com/docs/en/managed-agents/quickstart
- Agent setup: https://platform.claude.com/docs/en/managed-agents/agent-setup
- Cloud environment setup: https://platform.claude.com/docs/en/managed-agents/environments
- Reference (event types, rate limits): https://platform.claude.com/docs/en/managed-agents/reference
