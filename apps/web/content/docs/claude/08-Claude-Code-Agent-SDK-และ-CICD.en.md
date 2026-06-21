---
title: "Agent SDK and CI/CD (GitHub / GitLab)"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Reference: Agent SDK overview"
readTime: "9 min"
readers: "0"
locked: false
order: 8
---
# Claude guide — Part 8: Agent SDK and CI/CD (GitHub / GitLab)

> Compiled from the [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) and [GitHub Actions](https://code.claude.com/docs/en/github-actions) — build production-grade AI agents and integrate Claude Code with CI/CD

---

## 📖 Key terms for the Agent SDK and CI/CD

| Term | Plain meaning |
|---|---|
| **Agent SDK** | A library that lets you build AI agents in your own program, with Claude managing the tool loop automatically |
| **Client SDK** | The basic library for calling the Claude API directly — you write the tool loop yourself |
| **Tool loop** | The repeating work cycle where Claude calls tools (read files, run commands) and sees the results, looping until done |
| **CI/CD** | An automated system that runs when code is updated — checking, testing, and deploying code without manual instruction |
| **Pipeline** | A sequence of automated steps that run continuously, e.g. build → test → deploy |
| **GitHub Actions** | A CI/CD system built into GitHub — runs workflows automatically on events like pushing code or opening a PR |
| **GitLab CI/CD** | A CI/CD system built into GitLab — runs pipelines automatically via the `.gitlab-ci.yml` file |
| **PR** (Pull Request) | A code-merge request in GitHub — opened so people can review before merging into the main branch |
| **MR** (Merge Request) | A code-merge request in GitLab (like GitHub's PR) |
| **Workflow YAML** | A file defining automated steps, written in YAML (a text file using indentation to show structure) |
| **Hook / callback** | A function "attached" to various points of a process to run extra code when that point is reached |
| **Subagent** | A sub-agent created to do a specific part — helps break complex work into small pieces |
| **Async / async for** | Receiving data "gradually" without waiting for it all to finish first — each new message appears as soon as it's ready |
| **GitHub Secret** | A secure store for important data in GitHub (e.g. API keys) so it doesn't appear in code |
| **OIDC** (OpenID Connect) | A standard for temporary, secure authentication — replacing risky static keys |
| **WIF** (Workload Identity Federation) | A way to authenticate on Google Cloud using an identity from another system (e.g. GitHub) instead of storing a permanent key |
| **Headless mode** | Running Claude Code without an interactive screen — good for automation scripts |
| **Runner** | The machine (server) that runs the workflow — GitHub Actions uses `ubuntu-latest` by default |
| **Regex** | An advanced text-search pattern, e.g. `**/*.ts` means "all .ts files in all folders" |
| **Working directory** | The current working folder — the agent reads/writes files in this folder |

---

## 1. Claude Agent SDK
Reference: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

### What is this topic?
The Agent SDK lets you build AI agents that read files, run commands, search the web, and edit code on their own, using the same tools, **agent loop** (the work cycle where Claude calls tools repeatedly until the task is done), and context management that powers Claude Code. You can program in both Python and TypeScript.

> Note: formerly called the "Claude Code SDK," now renamed the "Claude Agent SDK" (see the Migration Guide)

### What it's used for
- Build production agents (e.g. an email assistant, a research agent, a bug-fixing agent)
- Run in a CI/CD pipeline
- Embed Claude Code in your own app while controlling orchestration/tools/permissions yourself

### How it differs from the Client SDK
- **Client SDK (`anthropic`)** — direct API access, like calling Claude in a plain Q&A; you must write the **tool loop** (the loop that runs tools and feeds results back to Claude) yourself
- **Agent SDK** — Claude manages the tool loop and runs tools entirely for you; you just send a prompt and receive the result

> **In plain terms:** the Client SDK is like buying ingredients and cooking yourself; the Agent SDK is like ordering delivery — just say "I want pad krapow" and receive the finished food.

```python
# Client SDK: you write the loop yourself
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)
    response = client.messages.create(tool_result=result, **params)

# Agent SDK: Claude manages the tools automatically
async for message in query(prompt="Fix the bug in auth.py"):
    print(message)
```

### How to use it (Step-by-step)
1. Install: `pip install claude-agent-sdk` (Python) or `npm install @anthropic-ai/claude-agent-sdk` (TypeScript/Node.js)
2. Set the key: `export ANTHROPIC_API_KEY=your-api-key` (**environment variable** — a variable storing a value in the system, not written directly in code); supports Bedrock/Vertex/Azure via env: `CLAUDE_CODE_USE_BEDROCK=1`, `CLAUDE_CODE_USE_VERTEX=1`, `CLAUDE_CODE_USE_FOUNDRY=1`
3. Run your first agent

### Example (Python)
```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(  # async for = receive messages piece by piece, streaming
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),  # allowed_tools = the tools allowed to be used
    ):
        print(message)

asyncio.run(main())
```

### Example (TypeScript)
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

### Cautions
Anthropic doesn't allow third-party developers to use claude.ai login or claude.ai's rate limit with their products (including agents on the Agent SDK) unless approved — use API key authentication.

### Quick summary
The Agent SDK = Claude Code as a library (Python/TS) that manages the tool loop for you; use `query()` with allowed_tools.

---

## 2. Agent SDK capabilities
Reference: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

### Built-in tools
| Tool | What it does |
|---|---|
| **Read** | Read files in the working directory |
| **Write** | Create new files |
| **Edit** | Edit an existing file precisely |
| **Bash** | Run terminal commands/scripts/git |
| **Glob** | Find files by pattern (`**/*.ts`) |
| **Grep** | Search file contents with regex |
| **WebSearch** | Search the web |
| **WebFetch** | Fetch web page content |
| **AskUserQuestion** | Ask the user a multiple-choice question |

### Additional features
- **Hooks** — **callbacks** (functions called automatically when a point is reached) at various points of the **lifecycle**, namely `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit` — used to validate/log/block/transform data
- **Subagents** — create specialized **sub-agents** to do sub-tasks, good for complex work that splits into pieces (must include `Agent` in allowed_tools); track with `parent_tool_use_id`
- **MCP** — connect external systems (databases, browsers, various APIs) via `mcp_servers` — like a plug into external tools
- **Permissions** — control which tools the agent can use, e.g. if you want read-only, include only `allowed_tools=["Read","Glob","Grep"]`
- **Sessions** — maintain context (conversation context) across multiple questions, with the ability to **resume** (continue working)/fork (branch) a session by capturing the `session_id` from the init message and sending `resume=session_id`

### Supports Claude Code's file-based features
Set `setting_sources=["project"]` so the agent reads settings from the project: **Skills** (`.claude/skills/*/SKILL.md` — specialized capabilities), **Slash commands** (`.claude/commands/*.md` — shortcut commands), **Memory** (`CLAUDE.md` — the project's rules and context), and **Plugins** (additional extensions).

### Example (subagent)
```python
async for message in query(
    prompt="Use the code-reviewer agent to review this codebase",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep", "Agent"],
        agents={
            "code-reviewer": AgentDefinition(
                description="Expert code reviewer.",
                prompt="Analyze code quality and suggest improvements.",
                tools=["Read", "Glob", "Grep"],
            )
        },
    ),
):
    if hasattr(message, "result"):
        print(message.result)
```

### Quick summary
The Agent SDK has a full set of built-in tools + hooks, subagents, MCP, permissions, sessions, and can use Claude Code's file-based config.

---

## 3. Choosing the Agent SDK vs the CLI
Reference: [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

| Use case | Suitable choice |
|---|---|
| Interactive development | CLI |
| CI/CD pipeline | SDK |
| A custom-built app | SDK |
| A one-time task | CLI |
| Production automation | SDK |

Many teams use both: CLI for daily work, SDK for production — workflows convert across them directly.

### Quick summary
Use the CLI for interactive/one-time work, use the SDK for CI/CD and production automation.

---

## 4. Claude Code GitHub Actions
Reference: [GitHub Actions](https://code.claude.com/docs/en/github-actions) · [Code Review](https://code.claude.com/docs/en/code-review)

### What is this topic?
Bring Claude Code into automated work in a **GitHub workflow** (a sequence of automated steps running on GitHub). Just mention `@claude` in a **PR** (Pull Request — a code-merge request) or issue, and Claude analyzes the code, creates PRs, builds features, and fixes bugs per the project's standards (built on the Agent SDK).

### What it's used for
- Create a PR instantly from a description, turn an issue into code, automatically review every PR, do scheduled daily reports
- The code stays on GitHub runners, safe by default

### How to install (Quick setup)
1. In the terminal, open `claude` and run `/install-github-app` (must be a **repo admin** — a repository administrator)
2. Follow the steps to set up the GitHub app and the **secret** (a secure store for the API key in GitHub Settings)
3. Test by mentioning `@claude` in a comment on an issue/PR

**Manual install:** install the [Claude GitHub app](https://github.com/apps/claude) (requesting Contents, Issues, Pull requests as Read & Write) → add the **secret** `ANTHROPIC_API_KEY` in GitHub → copy the **workflow** file (a YAML file defining the steps) to `.github/workflows/`

### Example basic workflow
```yaml
name: Claude Code
on:                             # define the events that trigger the workflow
  issue_comment:
    types: [created]            # when someone comments on an issue
  pull_request_review_comment:
    types: [created]            # when someone comments on a PR
jobs:
  claude:
    runs-on: ubuntu-latest      # run on an Ubuntu runner (server machine)
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}  # pull the API key from the Secret
          # respond to @claude in a comment
```

### Example: automatic code review on every PR
```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this PR for code quality, correctness, and security, then post it as a review comment"
          claude_args: "--max-turns 5"
```

### Main parameters of the action (v1)
| Parameter | Description | Required |
|---|---|---|
| `prompt` | The instruction (text or a skill name) | No (if responding to @claude in a comment) |
| `claude_args` | CLI args passed to Claude Code | No |
| `anthropic_api_key` | The Claude API key | Yes (if using the direct API) |
| `trigger_phrase` | The trigger phrase (default `@claude`) | No |
| `use_bedrock` / `use_vertex` | Use Bedrock/Vertex instead of the direct API | No |

Commonly used `claude_args`: `--max-turns`, `--model`, `--mcp-config`, `--allowedTools`, `--debug`

### Cautions (security and cost)
- **Don't commit the API key to the repo** — always use **GitHub Secrets** (stored in Settings → Secrets so it doesn't appear in code)
- Limit the action's permissions to the minimum; review Claude's proposals before **merge** (merging code into the main branch)
- There are 2 cost parts: **GitHub Actions minutes** (the time the runner runs) + Claude API **tokens**; reduce cost with `--max-turns` (limit rounds), **timeout** (stop if it takes too long), and **concurrency control** (limit how many workflows run at once)
- v1.0 has **breaking changes** (changes that make old code stop working) from beta, e.g. `direct_prompt` → `prompt`, moving `model`/`max_turns` into `claude_args`

### Quick summary
Use `anthropics/claude-code-action@v1` + the `ANTHROPIC_API_KEY` secret; mention `@claude` or include a `prompt`; configure with `claude_args`.

---

## 5. Use GitHub Actions with Bedrock / Vertex
Reference: [Using with AWS Bedrock & Google Vertex AI](https://code.claude.com/docs/en/github-actions#using-with-aws-bedrock-%26-google-vertex-ai)

### Key details from the official docs
- For organizations wanting to control **data residency** (keeping data in a specified region)/billing through their own cloud
- It's recommended to create **your own GitHub App** and use `actions/create-github-app-token` to create a token (a temporary pass)
- Authenticate without storing permanent credentials:
  - **AWS Bedrock** — set up a **GitHub OIDC Identity Provider** (a temporary authentication system between GitHub and AWS) + IAM role (`AWS_ROLE_TO_ASSUME`), use `use_bedrock: "true"`, model IDs have a region prefix, e.g. `us.anthropic.claude-sonnet-4-6`
  - **Google Vertex AI** — set up **Workload Identity Federation / WIF** (an authentication system on Google Cloud using an identity from GitHub instead of storing a key) + a service account (`GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`), use `use_vertex: "true"`
- **OIDC/WIF is safer than a static key** because the credential is **temporary** (self-expiring) and auto-rotated — unlike a permanent API key that, if leaked, works forever

### Quick summary
Use OIDC (Bedrock) or WIF (Vertex) instead of a static key; set `use_bedrock`/`use_vertex: true` in the action.

---

## 6. Claude Code GitLab CI/CD
Reference: [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd)

### Key details from the official docs
- Integrate Claude Code with a **GitLab pipeline** (a sequence of automated steps in GitLab) for automated work (review **MR** / Merge Request — a code-merge request in GitLab, fix bugs, build features)
- Configure via `.gitlab-ci.yml` (a YAML file defining the pipeline) and store `ANTHROPIC_API_KEY` in **CI/CD variables** that are **masked** (hidden in logs) and **protected** (usable only on specified branches)
- Supports triggering from GitLab events and uses CLI args like the GitHub side
- Also supports Bedrock/Vertex for organizations

### Quick summary
GitLab CI/CD integrates Claude Code via `.gitlab-ci.yml` + the API key in CI/CD variables; does MR review/automation.

---

## 7. Other CI/CD and automation channels
Reference: [Overview](https://code.claude.com/docs/en/overview) · [Slack](https://code.claude.com/docs/en/slack) · [Headless](https://code.claude.com/docs/en/headless)

### Key details from the official docs
- **GitHub Code Review** — automatically review every PR without triggering (Claude analyzes the code and comments itself) ([code-review](https://code.claude.com/docs/en/code-review))
- **Slack** — assign work with `@Claude` in chat, get a PR back directly
- **Headless mode** — run Claude Code **without an interactive screen** via the Agent SDK/CLI (`claude -p`), good for automation scripts and CI/CD running in the background
- **GitHub Enterprise Server / GitLab self-managed** — supported for organizations running GitHub/GitLab on their own servers

### Quick summary
Besides GitHub/GitLab, there's auto code review, Slack, headless mode, and self-managed support for organizations.

---

## Additional reference topics
- Agent SDK quickstart: https://code.claude.com/docs/en/agent-sdk/quickstart
- Agent SDK (Python): https://code.claude.com/docs/en/agent-sdk/python
- Agent SDK (TypeScript): https://code.claude.com/docs/en/agent-sdk/typescript
- claude-code-action repo: https://github.com/anthropics/claude-code-action
- GitLab CI/CD: https://code.claude.com/docs/en/gitlab-ci-cd
