---
title: "Claude Code"
tool: "Claude"
icon: "tool-claude"
level: "beginner"
summary: "Claude Code is an AI-powered, agentic (automatic multi-step) coding assistant that helps build features, fix bugs, and do repetitive work"
readTime: "9 min"
readers: "0"
locked: false
order: 3
---
# Claude guide — Part 3: Claude Code

> Compiled from [code.claude.com/docs](https://code.claude.com/docs/en/overview) — an automatic coding tool that reads the codebase, edits files, runs commands, and connects to development tools. Usable on Terminal, IDE, the desktop app, and the web.

---

## 📖 Key terms for Claude Code

| Term | Plain meaning |
|---|---|
| **Terminal / CLI** (Command Line Interface) | A command-line window, e.g. Terminal on Mac/Linux or PowerShell on Windows, used to type commands directly |
| **Agentic** | Works automatically through multiple continuous steps — Claude reads code, thinks, edits files, runs tests, itself, without instructing each step |
| **Codebase** | All of a project's code files |
| **IDE** (Integrated Development Environment) | An all-in-one code editor, e.g. VS Code, JetBrains |
| **Context** (in the Claude Code context) | The amount of information in Claude's "memory" at the moment, including conversation history, files read, and commands |
| **Environment variable** | A variable that stores important values, e.g. an API key, in the system, not written directly in code |
| **Hook** | A script that runs automatically when an event occurs, e.g. run a formatter every time a file is saved |
| **Sandbox** | A separate workspace; code run here doesn't affect the main system, usable for safe testing |
| **CI/CD** | A system that tests and ships code automatically — CI (testing) CD (shipping to production) |
| **Branch** | A branch of the code, worked on separately from the main code to test a new feature |
| **PR (Pull Request)** | A request to merge code from one branch into the main branch |
| **Prompt injection** | An attack that hides embedded instructions in a file or web page to trick the AI into unwanted work |
| **Token** | The unit measuring the text size the AI processes (full context means the tokens are used up) |
| **ZDR** (Zero Data Retention) | Not keeping usage data after processing |
| **mTLS** | Two-way authentication — both the cloud and your server verify each other |

---

## 1. Claude Code overview
Reference: [Overview](https://code.claude.com/docs/en/overview)

### What is this topic?
Claude Code is an AI-powered, **agentic** (automatic multi-step) coding assistant that helps build features, fix bugs, and do repetitive work developers don't want to do themselves. It understands the whole codebase (all of a project's code files) and works across many files/tools at once.

### What it's used for
- Do boring work for you: write tests (test code), fix lint (code-format errors), fix merge conflicts (conflicts when merging code), update dependencies (libraries the project relies on), write release notes
- Build features/fix bugs from a natural-language description
- Work with git: stage, commit, create branches, open PRs
- Connect tools via MCP, run agent teams, schedule tasks

### Available platforms
- **Terminal (CLI)** — full features, works on the command line (the Terminal/PowerShell window)
- **VS Code / JetBrains** — an editor extension with inline diff (changes shown side by side), @-mention, plan review
- **Desktop app** — a dedicated app, view diffs visually, run multiple sessions in parallel, schedule tasks
- **Web** ([claude.ai/code](https://claude.ai/code)) — runs in the cloud, no machine setup needed
- Connect CI/CD (GitHub Actions, GitLab), Slack, Chrome

All platforms use the same Claude Code engine, so CLAUDE.md, settings, and MCP servers can be shared everywhere.

### Quick summary
Claude Code = an agentic coding assistant that reads/edits the codebase, runs commands, and connects tools, usable on many platforms.

---

## 2. Installation and getting started (Quickstart)
Reference: [Quickstart](https://code.claude.com/docs/en/quickstart) · [Setup](https://code.claude.com/docs/en/setup)

### What you need
- A Terminal and a code project
- A paid Claude account (Pro/Max/Team/Enterprise), a Claude Console account, or via a supported cloud provider

### How to install (Step-by-step)
**Native Install (recommended):**
```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```
Alternatives: `brew install --cask claude-code` (macOS), `winget install Anthropic.ClaudeCode` (Windows), or apt/dnf/apk on Linux

> On Windows, it's recommended to install [Git for Windows](https://git-scm.com/downloads/win) so Claude Code can use the Bash tool (without it, it uses PowerShell instead)

**Get started:**
```bash
cd your-project
claude          # the first time, it has you log in via the browser
```
Log in with a Pro/Max/Team/Enterprise account (recommended), Claude Console, or Bedrock/Vertex/Foundry. Use `/login` to switch accounts later.

### Try it for the first time
```text
what does this project do?        # have it summarize the project
add a hello world function...     # have it edit code (it asks permission before editing files)
commit my changes...             # have it do git work
```

### Cautions
Claude Code always asks permission before editing files; approve item by item, or enable "Accept all" per session.

### Quick summary
Install with the script → `cd` into the project → `claude` → log in → instruct in natural language.

---

## 3. Commonly used CLI commands
Reference: [CLI reference](https://code.claude.com/docs/en/cli-reference) · [Built-in commands](https://code.claude.com/docs/en/commands)

### Main commands
| Command | What it does |
|---|---|
| `claude` | Start interactive mode |
| `claude "task"` | Run a one-time task |
| `claude -p "query"` | Run a one-time query and exit (headless/pipeable) |
| `claude -c` | Continue the latest conversation in this directory |
| `claude -r` | Pick an old conversation to resume |
| `/clear` | Clear the conversation history |
| `/help` | Show available commands |
| `exit` / Ctrl+D | Exit Claude Code |

### Slash commands in a session
`/login`, `/init` (auto-create CLAUDE.md), `/memory` (view/edit memory), `/clear`, `/compact` (compress context), `/resume`, `/schedule`, `/loop`, etc.

### Tips
- Type `/` to see all commands and skills
- Tab = auto-complete commands, ↑ = command history, **Shift+Tab** = switch permission mode

### Pipe / script examples
```bash
tail -200 app.log | claude -p "Alert me if you find anything abnormal"
git diff main --name-only | claude -p "Review the changed files for security"
```

### Quick summary
Use `claude` to open interactive mode, `-p` for one-time/pipe, and slash commands in a session; Shift+Tab switches permission mode.

---

## 4. Memory — CLAUDE.md and auto memory
Reference: [Memory](https://code.claude.com/docs/en/memory)

### What is this topic?
Each **session** (one working session) starts with fresh context (it doesn't remember old things). There are two mechanisms that carry knowledge across sessions:
- **CLAUDE.md** — an instruction file "you write yourself" so Claude knows the project's permanent context, e.g. "always use TypeScript" or "test with Jest"
- **Auto memory** — notes "Claude writes itself automatically" from observing your preferences and working style

Both are loaded at the start of every conversation and are "context" (advisory), not binding rules — if you need to force something to happen for sure every time, use a **hook** (an automatic script) instead.

### CLAUDE.md — locations and scope (in load order)
| Scope | Location | What it's for |
|---|---|---|
| Managed policy | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux/WSL: `/etc/claude-code/CLAUDE.md`, Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Organization-level instructions (IT/DevOps controlled) |
| User | `~/.claude/CLAUDE.md` | Personal preferences for all projects |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | The team's instructions (committed to git) |
| Local | `./CLAUDE.local.md` | Personal project-specific preferences (put in .gitignore) |

### How to write it effectively
- Size: should be **no more than 200 lines** per file (too long eats context and makes it follow less)
- Use headers/bullets to group for easy reading
- Be specific enough to be verifiable, e.g. "use 2-space indentation" is better than "format nicely"
- Avoid contradictory instructions
- Run `/init` to create an initial CLAUDE.md from automatic codebase analysis
- Import other files with `@path/to/file` (up to 4 levels deep)

### .claude/rules/ — split rules into sub-files
For large projects, split instructions into multiple files in `.claude/rules/` and limit them to load only for certain files via the `paths` frontmatter:
```markdown
---
paths:
  - "src/api/**/*.ts"
---
# Rules for the API
- Every endpoint must have input validation
```

### Auto memory
- On by default (requires Claude Code v2.1.59+), can be turned off in `/memory` or with `autoMemoryEnabled: false`
- Stored at `~/.claude/projects/<project>/memory/` with an index file `MEMORY.md` (loads the first 200 lines or first 25KB each session) + subtopic files (loaded when needed)
- It's markdown you can edit/delete yourself, viewable via `/memory`

### Cautions
- If Claude doesn't follow CLAUDE.md: check with `/memory` that the file is loaded, make instructions more specific, remove contradictory instructions, or use a hook if you must enforce it
- The project-root CLAUDE.md is reloaded after `/compact`, but subdirectory files are not re-injected automatically

### Quick summary
CLAUDE.md = you write instructions (short, specific, <200 lines), Auto memory = Claude remembers for you; both are context, not enforcement.

---

## 5. Settings
Reference: [Settings](https://code.claude.com/docs/en/settings) · [Environment variables](https://code.claude.com/docs/en/env-vars)

### Key details from the official docs
- Configure via `settings.json` files at multiple levels (priority order: managed policy > local > project > user)
  - User: `~/.claude/settings.json`
  - Project: `.claude/settings.json` (shared with the team)
  - Local: `.claude/settings.local.json` (personal, put in .gitignore)
  - Managed: organization-level, overrides user settings
- Configure things like permissions, model, env vars, hooks, sandbox, login
- Control more behavior via environment variables (see [env-vars](https://code.claude.com/docs/en/env-vars))

### Quick summary
Configure with multi-level settings.json (managed > local > project > user) to control permissions/model/hooks/env.

---

## 6. Permissions and operating modes
Reference: [Permissions](https://code.claude.com/docs/en/permissions) · [Permission modes](https://code.claude.com/docs/en/permission-modes)

### Key details from the official docs
- Claude Code asks permission before impactful work (editing files, running commands) per the permission rules you set
- There are `allow` / `deny` / `ask` rules definable down to the tool, command, or path level
- **Permission modes** switch with **Shift+Tab** in the CLI (or the mode selector in VS Code/Desktop):
  - A supervised edit mode (asks before each time)
  - A read-only/plan mode (plan mode)
  - An auto mode that uses a background classifier instead of asking each time
- Organizations use **managed settings** to enforce `permissions.deny`, sandbox, and login

### Cautions
Use auto mode understanding the risk, especially with commands that change the system; consider using the sandbox.

### Quick summary
Control permissions with allow/deny/ask rules; switch plan/auto mode with Shift+Tab; organizations enforce via managed settings.

---

## 7. Extend capabilities — Skills, Subagents, Hooks, Plugins
Reference: [Features overview](https://code.claude.com/docs/en/features-overview)

### Skills
Reference: [Skills](https://code.claude.com/docs/en/skills) — packages of repeatable workflows (e.g. `/review-pr`) loaded when you call them or when Claude sees they're relevant; shareable with the team

### Subagents
Reference: [Subagents](https://code.claude.com/docs/en/sub-agents) — specialized agents with separate context that help break hard work into parts and work in parallel; a subagent can have its own auto memory

### Hooks
Reference: [Hooks guide](https://code.claude.com/docs/en/hooks-guide) · [Hooks reference](https://code.claude.com/docs/en/hooks) — **Hooks** are scripts that run automatically when an event occurs in Claude's working cycle, e.g. before/after editing a file or before a commit (saving a code version). They can **enforce** rules for real, unlike CLAUDE.md which is only advisory. Example: auto-format code after editing a file, run lint (error checking) before commit

### Plugins and Marketplaces
Reference: [Plugins](https://code.claude.com/docs/en/plugins) · [Discover plugins](https://code.claude.com/docs/en/discover-plugins) — packages bundling skills, agents, hooks, and MCP servers, installed from a marketplace to extend capabilities, and you can create/publish your own marketplace

### When to use what
- Instructions that must be present every session → CLAUDE.md
- A workflow loaded when needed → Skill
- Something that must happen for sure at a point → Hook
- A sub-task with separate context → Subagent
- Bundle everything for distribution → Plugin

### Quick summary
CLAUDE.md (permanent context), Skills (on-demand workflows), Hooks (enforced via shell), Subagents (separate-context sub-tasks), Plugins (distribution packages).

---

## 8. Connect tools via MCP
Reference: [MCP](https://code.claude.com/docs/en/mcp) · [MCP quickstart](https://code.claude.com/docs/en/mcp-quickstart)

### What is this topic?
MCP (Model Context Protocol) is an open standard connecting AI to external data sources/services, letting Claude Code read designs in Google Drive, update tickets in Jira, pull data from Slack, or use your internal tools.

### How to use it
1. Add an MCP server (via the `claude mcp add ...` command or a config file)
2. Authorize the permissions the server requests
3. Call that server's tools within the session

### Quick summary
MCP connects Claude Code to external tools (Drive, Jira, Slack, etc.) in one standard way.

---

## 9. Built-in tools
Reference: [Tools reference](https://code.claude.com/docs/en/tools-reference) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)

### Key details from the official docs
Claude Code works as an agentic loop and has built-in tools, e.g. read/write/edit files (Read/Write/Edit), search (Grep/Glob), run shell (Bash), git work, web search, etc. — each tool has different permission requirements.

### Quick summary
It has a full set of built-in tools (read/write files, search, run shell, git, web), working as an agentic loop with a permission system.

---

## 10. Automation and scheduling
Reference: [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) · [Routines](https://code.claude.com/docs/en/routines) · [Common workflows](https://code.claude.com/docs/en/common-workflows)

### Key details from the official docs
- **Routines** — run on Anthropic's servers, keep working even if your machine is off; set from the web/Desktop or `/schedule`; can be **triggered** from the API or GitHub events
- **Desktop scheduled tasks** — run on your own machine, can access local files/tools
- **`/loop`** — repeat a prompt within a CLI session for short polling (repeatedly checking status)
- Automation examples: review PRs (merge requests) in the morning, analyze failed **CI** (testing system) overnight, check dependencies (libraries used) weekly

### Quick summary
Schedule tasks with Routines (cloud), Desktop tasks (local machine), or `/loop` (loop within a session).

---

## 11. Platforms and connections
Reference: [Platforms](https://code.claude.com/docs/en/platforms) · [VS Code](https://code.claude.com/docs/en/vs-code) · [Desktop](https://code.claude.com/docs/en/desktop) · [Web](https://code.claude.com/docs/en/claude-code-on-the-web)

### Key details from the official docs
- **VS Code / Cursor / JetBrains** — an extension with inline diff, @-mention, plan review
- **Desktop app** — visual diff review, multiple parallel sessions with Git isolation, scheduled tasks, Dispatch from mobile
- **Web (claude.ai/code)** — run long tasks in the cloud, pull them back to the terminal with `claude --teleport`
- **Remote Control** — connect to a local session from a phone/another browser
- **CI/CD (automatic testing and code-shipping system)** — [GitHub Actions](https://code.claude.com/docs/en/github-actions), [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd), automatic code review on every PR (Pull Request — a merge request)
- **Slack** — assign work with `@Claude` in chat, **Chrome** — debug web apps

### Quick summary
Usable in the IDE, Desktop, Web, mobile, and connects CI/CD, Slack, Chrome — everywhere uses the same engine/settings.

---

## 12. Security and Sandbox
Reference: [Security](https://code.claude.com/docs/en/security) · [Sandboxing](https://code.claude.com/docs/en/sandboxing) · [Data usage](https://code.claude.com/docs/en/data-usage)

### Key details from the official docs
- There's a permission and approval system before impactful work
- **Sandboxing** — isolates the file system and network when Claude runs Bash commands, so it can work automatically without risking other systems
- Beware of **prompt injection** (embedded instructions in a file or web page that trick the AI into unwanted things) from external content
- Organizations have **Zero Data Retention (ZDR)** (no data kept after processing) for Claude for Enterprise and can configure the network, e.g. a proxy (central server), CA (security certificate), mTLS (two-way authentication)

### Quick summary
There's a permission system + a sandbox isolating files/network; organizations have ZDR and can configure specific networking.

---

## 13. Troubleshooting
Reference: [Troubleshooting](https://code.claude.com/docs/en/troubleshooting) · [Costs](https://code.claude.com/docs/en/costs)

### Common problems and approaches
- **Install fails** — see [installation troubleshooting](https://code.claude.com/docs/en/troubleshoot-install); on Windows, check you're using PowerShell or CMD with the right command
- **Claude doesn't follow CLAUDE.md** — use `/memory` to check the file is loaded, make instructions specific, or use a hook
- **Context full/long work** — when the conversation gets so long Claude "can't remember," use `/compact` (summarize the conversation), choose a model with a larger context, or use preprocessing hooks to reduce the data sent
- **High cost** — track token usage, set a team spend limit, adjust extended thinking and model selection (see [Costs](https://code.claude.com/docs/en/costs))

### Quick summary
Most problems are solved by checking the install, using `/memory` with CLAUDE.md, `/compact` to manage context, and controlling cost with model selection/spend limits.

---

## Additional reference topics
- Best practices: https://code.claude.com/docs/en/best-practices
- Common workflows: https://code.claude.com/docs/en/common-workflows
- Agent SDK (headless): https://code.claude.com/docs/en/headless
- Changelog: https://code.claude.com/docs/en/changelog
- Full docs index: https://code.claude.com/docs/llms.txt
