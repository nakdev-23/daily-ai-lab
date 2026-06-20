---
title: "Overview, getting started, and all the Concepts"
tool: "Codex"
icon: "icon-docs"
level: "beginner"
summary: "Codex is a Coding Agent (an AI agent for software development) by OpenAI, designed to help developers and engineering teams write code"
readTime: "9 min"
readers: "0"
locked: false
order: 1
---
# Codex Guide — Part 1: Overview, getting started, and all the Concepts
> Primary reference: [Codex Overview](https://developers.openai.com/codex) | [Codex Docs](https://developers.openai.com/codex)

---

## What is Codex
Reference: [Overview](https://developers.openai.com/codex)

### What this topic is
Codex is a **Coding Agent (an AI agent for software development)** by OpenAI, designed to help developers and engineering teams write code, review code, fix bugs, and handle various dev tasks in an agentic way — doing many steps automatically.

In one sentence: **"One agent for everywhere you code"** — Codex works everywhere you write code.

### What you can do with it
Codex helps across 5 main areas:
- **Writing code**: describe what you want and Codex creates code that fits your project and conventions
- **Understanding an unfamiliar codebase**: read and explain complex or legacy code
- **Reviewing code**: analyze code to find bugs, logic errors, and edge cases
- **Debugging and fixing problems**: help track down the cause of an error and propose fixes
- **Automating dev work**: refactoring, testing, migration, repetitive setup, automatically

### Supported plans
Codex is included in every ChatGPT plan: **Free, Go, Plus, Pro, Business, Edu, and Enterprise**.

You can also use Codex via an OpenAI API key.

---

## Quickstart — getting started with Codex
Reference: [Quickstart](https://developers.openai.com/codex/quickstart)

### What this topic is
How to start using Codex from scratch. There are 4 channels: the App (recommended), the IDE Extension, the CLI, and Cloud.

### Channel 1: Codex App (recommended)

**How to install:**

1. Download the Codex App
   - macOS (Apple Silicon): [download](https://persistent.oaistatic.com/codex-app-prod/Codex.dmg)
   - macOS (Intel): [download](https://persistent.oaistatic.com/codex-app-prod/Codex-latest-x64.dmg)
   - Windows: download via the Microsoft Store
   - Linux: wait for an email notification (not yet available for download)
2. Open the App and sign in with a ChatGPT account or an OpenAI API key
3. Choose the project folder you want Codex to work in
4. Set it to **Local** and send your first prompt

**Example starter prompts:**
```
Tell me about this project
Build a classic Snake game in this repo.
Find and fix bugs in my codebase with minimal, high-confidence changes.
```

> **Note**: if you sign in with an OpenAI API key, some features like Cloud Threads may not work.

### Channel 2: IDE Extension

**Supported IDEs:**
- Visual Studio Code
- Cursor
- Windsurf
- Visual Studio Code Insiders

**How to install:**
1. Search "Codex" or "openai.chatgpt" in your IDE's Extension Marketplace
2. Open the Codex Panel in the sidebar
3. Sign in and get started

The Codex IDE Extension starts in **Agent Mode** — it can read files, run commands, and edit code in the project.

> **Tip**: always create a Git checkpoint before and after each task, so you can revert if there's a problem.

### Channel 3: CLI (Command Line Interface)

The Codex CLI works in the terminal and also supports Agent Mode.

### Channel 4: Cloud (Web Browser)

Works directly in the Codex cloud, good for parallel work or work you want to delegate from another machine.

**How to review the work (for Cloud):**
After the work is done, review the proposed diff, then Accept or check out the branch to test on your own machine:
```
git fetch
git checkout <branch-name>
```

---

## Pricing and plans
Reference: [Pricing](https://developers.openai.com/codex/pricing)

### What this topic is
Codex is included in every ChatGPT plan at no extra cost, with usage limits per plan.

### Pricing summary

| Plan | Codex | Note |
|---|---|---|
| Free | ✅ Yes | Limited usage |
| Go | ✅ Yes | Limited usage |
| Plus ($20/month) | ✅ Yes | More usage |
| Pro ($200/month) | ✅ Yes | More usage + gpt-5.3-codex-spark (Preview) |
| Business / Team | ✅ Yes | For teams |
| Edu | ✅ Yes | For educational institutions |
| Enterprise | ✅ Yes | Fully customizable |

Besides the ChatGPT plans, you can also use Codex via API credits.

---

## Migrate to Codex
Reference: [Migrate](https://developers.openai.com/codex/migrate)

### What this topic is
If you've used other AI coding tools, you can migrate your config, MCP servers, skills, and subagents to Codex.

### What can be migrated:
- Instruction files such as `.cursorrules`, `CLAUDE.md`, etc.
- MCP server configuration
- Skills and subagents

---

## Concepts — key ideas in Codex

---

## Prompting — instructing Codex
Reference: [Prompting](https://developers.openai.com/codex/prompting)

### What this topic is
How to prompt Codex for the best results, covering Threads, Context, and Goal Mode.

### Prompts
You communicate with Codex through prompts (text saying what you want). After you send a prompt, Codex works in a loop: call the AI model → act on what the AI says (read files, edit files, call tools), repeating until the work is done or you cancel.

**Example prompts:**
```
Explain how the transform module works and how other modules use it.
```
```
Add a new command-line option `--json` that outputs JSON.
```

**Prompting tips:**
- **Tell it how to verify the work** — Codex works much better when it knows how to test. Give the steps to reproduce, validate the feature, lint, and pre-commit checks
- **Break big work into small pieces** — small tasks are easier to test and review. If you're unsure how to split it, ask Codex to help plan

### Threads
A thread is one work session: a prompt + the result + all the tool calls that follow. One thread may have several prompts (e.g. the first prompt implements a feature, the next adds a test).

**Types of thread:**

| Type | Runs where | Good for |
|---|---|---|
| **Local Thread** | Your machine | Work where you watch changes in real time, using your existing tools |
| **Cloud Thread** | A separate environment | Several parallel jobs, or delegating from another device |

> **Note**: Local Threads run in a sandbox to reduce the risk of unintended changes outside the workspace.

In the Codex App you can also create a **Chat** without choosing a project. A Chat isn't tied to any repository, good for research, planning, or connected-tool workflows.

### Context Window
All the information in a thread must fit in the model's context window. Codex monitors and reports the remaining space. For long work, Codex may **compact** the context by summarizing the important information and cutting what's unnecessary.

### Goal Mode
Goal Mode gives Codex a **persistent goal** it must achieve to completion, good for work that needs many steps.

**How to start Goal Mode:** type `/goal` in the Codex App, IDE Extension, or CLI.

If `/goal` doesn't appear, enable it in `config.toml`:
```toml
[features]
goals = true
```

**Examples of good goals:**
```
Migrate this codebase from JavaScript to TypeScript. The app should compile in
strict mode without explicit `any` type definitions.
```
```
Reduce the time to interactive of the home page to below 1 second.
```

**Tip for writing a good goal:** specify a clearly measurable result or a clear test condition. If the goal is hard to define, use `/plan` first and have Codex help draft the goal.

---

## Customization — adjusting Codex's behavior
Reference: [Customization](https://developers.openai.com/codex/concepts/customization)

### What this topic is
How to make Codex work in line with your team's or project's style and workflow, covering AGENTS.md, Rules, Hooks, and MCP.

### Customization tools

| Tool | What it does |
|---|---|
| **AGENTS.md** | Repository-specific instructions Codex reads before working |
| **config.toml** | Basic settings (Model, Permissions, Features) |
| **Rules** | Define which shell commands are allowed/forbidden |
| **Hooks** | Scripts that run automatically before/after certain events |
| **Skills** | Sets of instructions/steps reusable across projects |
| **MCP** | Connect external servers to extend abilities |
| **Plugins** | Bundles of Tools, Skills, and MCP you can install |
| **Subagents** | Sub-agents Codex creates to do small subtasks |

---

## Memories — memory across threads
Reference: [Memories](https://developers.openai.com/codex/memories)

### What this topic is
Memories lets Codex "remember" context from old threads and use it in new ones, e.g. your coding style, the tech stack used, the project's conventions.

### Key details
- **Off by default** — you must turn it on yourself
- **Not yet supported**: the European Union (EEA), the UK, and Switzerland

### How to turn Memories on

In the Codex App: go to Settings → turn on Memories

In config.toml:
```toml
[features]
memories = true
```

### How it works
Codex turns context from past threads into Memory Files, stored at `~/.codex/memories/` automatically.

Codex will:
- Skip saving short sessions or sessions still in progress
- Strip out secrets before saving
- Update Memories in the background, not immediately after a thread ends

### Related settings

| Setting | Meaning |
|---|---|
| `memories.generate_memories` | Controls whether a new thread is saved as Memory input |
| `memories.use_memories` | Controls whether Codex pulls Memory into a new session |
| `memories.extract_model` | Override the model used to extract Memory from a thread |
| `memories.consolidation_model` | Override the model used to consolidate all Memory |

### Chronicle
Reference: [Chronicle](https://developers.openai.com/codex/memories/chronicle)

Chronicle is an add-on feature of Memories that records a timeline of Codex's work — what it did, when, and what the results were.

### Cautions
Don't store secrets in Memories. Even though Codex redacts automatically, you should review the Memory Files before sharing the Codex home directory with others.

---

## Sandboxing — a safe workspace
Reference: [Sandboxing](https://developers.openai.com/codex/concepts/sandboxing)

### What this topic is
A sandbox is the boundary within which Codex works, without giving Codex unlimited access to your machine. It lets it work autonomously without you confirming every command.

### What the sandbox does
The sandbox applies to **all shell commands**, not just direct file edits. So `git`, `npm`, `pytest`, and other tools Codex runs are in the sandbox too.

Codex uses platform-native enforcement:
- **macOS**: the Seatbelt framework (works out of the box, no install)
- **Windows**: Windows Sandbox (in PowerShell) or the Linux Sandbox (in WSL2)
- **Linux/WSL2**: `bubblewrap` — must be installed first: `sudo apt install bubblewrap`

### Sandbox Modes

| Mode | Meaning |
|---|---|
| `read-only` | Codex can read files, but editing or running commands requires approval |
| `workspace-write` | Codex can read, edit in the workspace, and run routine commands (default) |
| `danger-full-access` | Codex runs without bounds — no filesystem/network limit |

### Approval Policies

| Policy | Meaning |
|---|---|
| `untrusted` | Codex asks for approval before running a command not on the trusted list |
| `on-request` | Codex works normally in the sandbox but asks for approval if it needs to go out of bounds (default) |
| `never` | Codex never stops to ask for approval |

### Approver options

| Value | Meaning |
|---|---|
| `user` | Approve yourself through the UI (default) |
| `auto_review` | Have an AI reviewer agent approve automatically |

### Configure in config.toml
```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
approvals_reviewer = "user"
```

For full access (no limit):
```toml
sandbox_mode = "danger-full-access"
approval_policy = "never"
```

### Auto-review
Reference: [Auto-review](https://developers.openai.com/codex/concepts/sandboxing/auto-review)

Auto-review is the option that has an AI agent check and approve actions requiring permission, automatically, instead of having a person approve each time.

Enable it: `approvals_reviewer = "auto_review"` in config.toml

---

## Subagents — running several agents at once
Reference: [Subagents](https://developers.openai.com/codex/concepts/subagents)

### What this topic is
Subagents are sub-agents the main Codex creates to do small parts of the work in parallel, letting Codex work faster by splitting a big job into small jobs that run at the same time.

### What it's used for
- Test several conditions at once
- Refactor several modules in one go
- Run various scripts in parallel

---

## Workflows
Reference: [Workflows](https://developers.openai.com/codex/workflows)

### What this topic is
Workflows are recommended patterns for various task types, e.g. debugging, refactoring, adding a new feature.

### Example workflows worth knowing
- **Understand a codebase**: have Codex summarize the structure first, then ask about the parts you care about
- **Implement a feature**: start by having Codex design a plan first, review it, then have it implement
- **Fix a bug**: send the error message + steps to reproduce for Codex to analyze
- **Refactor**: break it into small chunks, testing each part

---

## Models — the AI models that power Codex
Reference: [Models](https://developers.openai.com/codex/models)

### What this topic is
Codex uses several AI models, each with different strengths. You choose the model based on the task.

### Recommended models

| Model | Capability | Speed | Channel |
|---|---|---|---|
| **gpt-5.5** | Top — for complex work, Computer Use, research | Medium | App, IDE, CLI, Cloud, API |
| **gpt-5.4** | Very high — flagship for professional work | Good | App, IDE, CLI, Cloud, API |
| **gpt-5.4-mini** | Good — fast, economical, for routine work | Very fast | App, IDE, CLI, Cloud, API |
| **gpt-5.3-codex** | Very high — industry-leading coding model | Medium | App, IDE, CLI, Cloud, API |
| **gpt-5.3-codex-spark** | Good — real-time iteration for Pro users | Very fast | App (Pro only) |

> **OpenAI's recommendation**: start with `gpt-5.5` for general work; use `gpt-5.4-mini` when you need speed or to save cost.

### Set the model in config.toml
```toml
model = "gpt-5.5"
```

### Change the model temporarily in the CLI
```
codex -m gpt-5.5
```
Or type `/model` in a running thread.

### How to change the model in the IDE Extension
Use the Model Selector located below the IDE Extension's input box.

> **Limitation**: you currently can't change the default model for Cloud Tasks.

---

## Cyber Safety
Reference: [Cyber Safety](https://developers.openai.com/codex/concepts/cyber-safety)

### What this topic is
Safety requirements about what Codex can and can't do in cybersecurity.

### What Codex won't do
Codex has safety controls to prevent dual-use in cybersecurity. For example, Codex will **not** help develop:
- Malware or ransomware
- Exploit scripts used to attack real systems
- Tools for unauthorized access

### What Codex can do
- Help security researchers do legitimate research
- Help analyze vulnerabilities in your own codebase
- Penetration testing in authorized conditions

---

## Summary: how to get started with Codex

| If you... | Use the channel |
|---|---|
| Want the best experience | Codex App (macOS/Windows) |
| Code in VS Code / Cursor | IDE Extension |
| Like working in the terminal | CLI |
| Want to run parallel tasks or from another device | Cloud (Web) |

---

## Topics not yet compiled

| Topic | Reason | Link |
|---|---|---|
| All Use Cases | Collected from the Use Cases page | [link](https://developers.openai.com/codex/use-cases) |
| Glossary | Being compiled | [link](https://developers.openai.com/codex/glossary) |
