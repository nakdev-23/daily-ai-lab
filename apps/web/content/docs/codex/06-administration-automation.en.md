---
title: "Administration & Automation"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "1. Authentication"
readTime: "19 min"
readers: "0"
locked: false
order: 6
---
# Codex Guide — Administration & Automation

> File 6 of 6 | Back to the [INDEX](./00-INDEX.md)

---

## Contents

1. [Authentication](#1-authentication)
2. [Access Tokens](#2-access-tokens)
3. [Agent Approvals & Security](#3-agent-approvals--security)
4. [Remote Connections](#4-remote-connections)
5. [Enterprise — Admin Setup](#5-enterprise--admin-setup)
6. [Enterprise — Governance](#6-enterprise--governance)
7. [Enterprise — Managed Configuration](#7-enterprise--managed-configuration)
8. [Using it on Windows](#8-using-it-on-windows)
9. [Non-interactive Mode](#9-non-interactive-mode)
10. [Codex SDK](#10-codex-sdk)
11. [App Server](#11-app-server)
12. [MCP Server](#12-mcp-server)
13. [GitHub Action](#13-github-action)
14. [Topics not fully compiled](#14-topics-not-fully-compiled)

---

## 1. Authentication

Reference: [Authentication — Codex Docs](https://developers.openai.com/codex/auth)

### What this topic is

This page explains how Codex verifies a user's identity to connect correctly to the OpenAI API, whether used through the UI, CLI, or in a headless environment.

### How to sign in

Codex supports 2 main authentication methods:

**1. ChatGPT (OAuth)**
- Sign in with a ChatGPT account through a browser
- Required for Codex cloud (web tasks)
- You must enable MFA if you sign in with email + password together with using Codex cloud

**2. API Key**
- Use an OpenAI API key directly
- Good for CI/CD, automation, or environments that don't want browser login
- Set it via the environment variable: `CODEX_API_KEY`

### Storing Credentials

Codex stores credentials at:
- `~/.codex/auth.json` — the main file for storing the token
- Or the OS keyring if `cli_auth_credentials_store` is configured

### Signing in in a Headless environment

In an environment with no browser (e.g. a server, Docker, CI):

```bash
codex login --device-auth
```

This command shows a URL to open in a browser on another machine to do device-code authorization.

Or copy the `~/.codex/auth.json` file from a logged-in machine to the headless machine.

### Forced Login Method

If you want to control which method users must use to log in, set it in `config.toml`:

```toml
forced_login_method = "chatgpt"  # or "api"
```

- `"chatgpt"` — force ChatGPT OAuth only
- `"api"` — force API key only

### Custom CA Certificate

For organizations with a corporate proxy or a self-signed certificate:

```bash
export CODEX_CA_CERTIFICATE=/path/to/ca-bundle.pem
```

### In short

Codex supports 2 login methods: ChatGPT OAuth (needs a browser + MFA for cloud) or API key (good for CI/automation). In a headless environment, use `codex login --device-auth` or copy `auth.json` over.

---

## 2. Access Tokens

Reference: [Access Tokens — Codex Docs](https://developers.openai.com/codex/enterprise/access-tokens)

### What this topic is

An Access Token is a token for enterprise environments to control access to Codex at the organization level, instead of using each person's personal API key.

### What it's used for

In an organizational setup, an admin can issue access tokens to teams or systems so they use Codex without sharing personal API keys, making it easier to control permissions, rotation, and revocation.

### Caution

- See more details at [Enterprise Admin Setup](https://developers.openai.com/codex/enterprise/admin-setup)
- Access tokens are managed from the ChatGPT workspace admin panel

---

## 3. Agent Approvals & Security

Reference: [Agent Approvals & Security — Codex Docs](https://developers.openai.com/codex/agent-approvals-security)

### What this topic is

Codex uses a 2-layer system for security control: **Sandbox Mode** (controls filesystem and network access) and **Approval Policy** (controls whether the agent must get approval before doing something).

### Sandbox Mode

The sandbox defines the bounds within which the agent can work:

| Mode | Description |
|------|-----------|
| `workspace-write` | Read anywhere, write only in the workspace and defined writable roots |
| `read-only` | Read only, no writing |
| `danger-full-access` | No restrictions (use carefully) |

#### How the sandbox works by platform

- **Codex cloud**: runs in an isolated container with network set up during setup, but the agent phase is offline
- **CLI on macOS**: uses Seatbelt (sandbox-exec)
- **CLI on Linux**: uses Landlock + seccomp
- **Windows**: uses an elevated or unelevated sandbox (see the Windows section)

#### Always-protected paths

Codex won't overwrite these files without permission:
- `.git/`
- `.agents/`
- `.codex/`

#### Network Access

```toml
network_access = true
```

Set this to give the agent network access; the default is `false`.

Web search uses `"cached"` mode by default.

### Approval Policy

The Approval Policy defines what the agent must stop and wait for approval before doing:

| Policy | Description |
|--------|-----------|
| `on-request` | The agent asks for approval only when necessary (e.g. writing a file outside the workspace) |
| `untrusted` | The agent must ask for approval before every action |
| `never` | The agent never asks for approval, working fully automatically |

### Common Presets

```bash
# Auto mode — fully automatic (workspace-write + never approve)
codex --full-auto

# Read only — no writing files
codex --sandbox read-only

# Skip the sandbox and approvals entirely (dangerous!)
codex --dangerously-bypass-approvals-and-sandbox
```

### OTel Monitoring (Telemetry)

Codex supports OpenTelemetry (OTel) for opt-in monitoring, off by default. Enable it via config.

### In short

Codex's security system has 2 layers: the Sandbox (limits filesystem/network) and the Approval Policy (limits what needs approval). Use the `--full-auto` preset for automation and `read-only` when you want maximum safety.

---

## 4. Remote Connections

Reference: [Remote Connections — Codex Docs](https://developers.openai.com/codex/remote-connections)

### What this topic is

Remote Connections is an **alpha** feature that lets Codex on a local machine connect to Codex running on a remote server via SSH.

### What it's used for

Good for developers working with a project on a remote server (e.g. a cloud VM, development server) who want to use Codex from a local app or IDE.

### How to set it up

**1. Install Codex on the remote machine**

The remote machine must also have the Codex CLI installed.

**2. Set up the SSH Config**

Add the remote server's info to `~/.ssh/config` as usual.

**3. Add the Connection in the Codex App**

Go to **Settings > Connections** in the Codex app and add the remote server.

### Cautions

- This feature is still in **alpha** and may change
- The connection uses SSH port forwarding only, no public listener
- For a server not on the same network, use a VPN or Tailscale first

### In short

Remote Connections lets you use Codex from a local app with code on a remote server via SSH. This feature is still alpha; you must install Codex on both machines.

---

## 5. Enterprise — Admin Setup

Reference: [Admin Setup — Codex Docs](https://developers.openai.com/codex/enterprise/admin-setup)

### What this topic is

Admin Setup is the steps an organization's administrator must do to enable Codex for the team, set policy, and control usage at the workspace level.

### Key details

- The admin can access enterprise settings from the ChatGPT workspace admin panel
- You need Workspace Owner or Admin rights
- You can define:
  - Which members can access Codex
  - The allowed authentication methods (ChatGPT OAuth or API key)
  - Sandbox and approval policies for the whole workspace

### Caution

This page's full content covers the setup steps in detail; see it at [Official Docs: Admin Setup](https://developers.openai.com/codex/enterprise/admin-setup)

---

## 6. Enterprise — Governance

Reference: [Governance — Codex Docs](https://developers.openai.com/codex/enterprise/governance)

### What this topic is

Governance is a set of tools that help enterprise organizations track, analyze, and audit Codex usage on their teams, covering everything from a dashboard for viewing adoption to an API for exporting logs for compliance systems.

### 3 channels for tracking usage

| Tool | Good for |
|-----------|---------|
| **Analytics Dashboard** | View adoption and code-review impact in real time |
| **Analytics API** | Pull metrics automatically into a data warehouse or BI tools |
| **Compliance API** | Export audit logs for security and compliance systems |

### Analytics Dashboard

Accessible at [chatgpt.com/codex/settings/analytics](https://chatgpt.com/codex/settings/analytics) — for workspace admins only.

The dashboard shows:
- Daily active users by product (CLI, IDE, cloud, Code Review)
- Daily code reviews
- Code reviews by priority level
- Code reviews by sentiment (feedback)
- Daily cloud tasks
- Daily VS Code extension users
- Daily CLI users

#### Exporting Analytics data

Admins can export data in both CSV and JSON, covering:
- Code review users and reviews (daily)
- Code review findings and feedback (reactions, replies, priority)
- Cloud users and tasks (daily)
- CLI and VS Code users (daily)
- Sessions and messages per user (daily)

### Analytics API

Used via [chatgpt.com/codex/settings/apireference](https://chatgpt.com/codex/settings/apireference) for automated data pulls.

**What the API provides:**

- **Daily usage and adoption**: threads, turns, credits daily, by client surface or by user
- **Code review activity**: number of PR reviews, comments, and severity breakdown
- **User engagement**: replies and reactions to Codex comments

Results are ordered by time, supporting cursor-based pagination.

**Common use cases:**
- Engineering observability dashboards
- Adoption reports for executives
- Tracking usage and cost

### Compliance API

Used via [chatgpt.com/admin/api-reference](https://chatgpt.com/admin/api-reference) for audit and compliance systems.

**What can be exported:**

- The prompt text sent to Codex
- The response Codex generated
- Identifiers: workspace, user, timestamp, model
- Token usage and request metadata

**Use cases:**
- Security investigations
- Compliance reporting
- Policy enforcement audits
- Sending data into SIEM and eDiscovery pipelines

**Limitation:** Audit logs are retained for no more than **30 days** and cover only ChatGPT-authenticated usage (not direct API-key usage).

**Doesn't measure:**
- Lines of code generated (an imprecise proxy)
- Suggestion acceptance rate
- Code quality KPIs

### Recommended approach for organizations

Most use all 3 together:
1. **Analytics Dashboard** — view the daily overview
2. **Analytics API** — automated reports and BI integration
3. **Compliance API** — an audit trail for security/legal

### In short

Codex's Governance has 3 levels: the Dashboard (easy viewing), the Analytics API (for automation), and the Compliance API (for audit/compliance). Admins can export data in both CSV and JSON; logs are kept up to 30 days.

---

## 7. Enterprise — Managed Configuration

Reference: [Managed Configuration — Codex Docs](https://developers.openai.com/codex/enterprise/managed-configuration)

### What this topic is

Managed Configuration lets an organization's admin define Codex requirements and default settings for the whole workspace's users centrally, so users don't have to configure it themselves.

### What it's used for

Good for organizations that want to:
- Force a specific authentication method
- Set a default sandbox policy for the whole team
- Set policies users can't change
- Deploy config to many users at once

### Caution

The full details of Managed Configuration are at [Official Docs: Managed Configuration](https://developers.openai.com/codex/enterprise/managed-configuration) — this page is fairly long and covers various policy details.

---

## 8. Using it on Windows

Reference: [Windows — Codex Docs](https://developers.openai.com/codex/windows)

### What this topic is

Codex supports Windows both natively and through WSL2 (Windows Subsystem for Linux). This page explains how to set up the sandbox, recommendations for each case, and common Windows troubleshooting.

### 3 ways to use Codex on Windows

1. **Native Windows (elevated sandbox)** — recommended for Windows 11
2. **Native Windows (unelevated sandbox)** — a fallback for machines with restrictive enterprise policy
3. **WSL2 (Windows Subsystem for Linux)** — use the Linux sandbox on Windows

### Windows Sandbox

Codex on native Windows uses a sandbox to limit writing files outside the working folder and prevent unauthorized network access.

Set the sandbox mode in `config.toml`:

```toml
[windows]
sandbox = "elevated"  # or "unelevated"
```

#### elevated sandbox (recommended)

- Uses a lower-privilege sandbox user
- Defines filesystem permission boundaries
- Sets firewall rules
- Requires UAC / admin approval during installation

#### unelevated sandbox (fallback)

- Runs commands with a restricted Windows token from the current user
- Uses ACL-based filesystem boundaries
- Uses environment-level offline controls instead of firewall rules
- Weaker than `elevated` but still useful when admin setup is blocked

#### Private Desktop

By default the sandbox uses a private desktop for more UI security. Disable it if you need compatibility:

```toml
[windows]
sandbox_private_desktop = false
```

### Windows Version Matrix

| Windows Version | Support level | Note |
|----------------|---------------|---------|
| Windows 11 | **Recommended** | Good for enterprise deployment |
| Windows 10 (latest update) | Best effort | Needs version 1809 or newer, requires ConPTY |
| Older Windows 10 | Not recommended | Lacks the necessary console components |

**Additional requirements:**
- `winget` must be available
- The elevated sandbox needs admin approval during setup
- Some enterprises may block certain setup steps

### Grant Sandbox Read Access

When a command fails because the sandbox can't read a certain directory:

```
/sandbox-add-read-dir C:\absolute\directory\path
```

It must be an absolute path and the directory must exist.

### Windows Subsystem for Linux (WSL2)

Choose WSL2 when:
- You want Linux-native tooling on Windows
- The team's workflow is already in WSL2
- The native Windows sandbox can't be used

**Note:** WSL1 is supported only up to Codex version `0.114`. From `0.115` onward, the Linux sandbox uses `bubblewrap`, which doesn't support WSL1.

#### Install and get started

```powershell
# Install WSL (run PowerShell as Administrator)
wsl --install

# Open a WSL shell
wsl
```

```bash
# In the WSL shell — install and run Codex
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex
```

#### Open VS Code from WSL

```bash
# From the WSL shell
cd ~/code/your-project
code .
```

Check that the status bar at the bottom of VS Code shows `WSL: <distro>` and the terminal shows a Linux-style path (`/home/...`).

#### File-management advice

- **Don't** work in `/mnt/c/...` — I/O is much slower
- **Do** keep the repository in the Linux home directory, e.g. `~/code/my-app`

```bash
mkdir -p ~/code && cd ~/code
git clone https://github.com/your/repo.git
cd repo
```

### Common troubleshooting

**The elevated sandbox fails to install**
- Check that you approved the UAC/admin prompt
- Machines with enterprise policy may block creating a local user/group or changing firewall rules
- If you can't fix it immediately, use the `unelevated` sandbox instead for now
- Consult your IT team about logon rights for the sandbox users

**Error 1385**
- Windows refused the logon type the sandbox user needs
- Have the IT team check group policy so Codex's sandbox user has the necessary rights
- While troubleshooting, use the `unelevated` sandbox first

**The IDE Extension doesn't respond**
It may be missing C++ development tools:
```bash
winget install --id Microsoft.VisualStudio.2022.BuildTools -e
```
After installing, restart VS Code.

**The WSL repository is slow**
- Move the repository from `/mnt/c/...` to `~/code/...`
- Update WSL:
```bash
wsl --update
wsl --shutdown
```

**VS Code in WSL can't find `codex`**
```bash
which codex || echo "codex not found"
```
If not found, reinstall per the [steps above](#install-and-get-started)

**Sending diagnostics to OpenAI**

Send this file:
- `CODEX_HOME/.sandbox/sandbox.log`

Along with: a problem description, the Windows version, the error message, and whether you use the `elevated` or `unelevated` sandbox.

**Don't send:** `CODEX_HOME/.sandbox-secrets/`

### In short

Windows 11 + elevated sandbox is the best combination. If enterprise policy blocks it, use the unelevated sandbox instead. If you need Linux tooling, use WSL2 and always keep the repo in the Linux home directory for better performance.

---

## 9. Non-interactive Mode

Reference: [Non-interactive Mode — Codex Docs](https://developers.openai.com/codex/noninteractive)

### What this topic is

Non-interactive Mode is running Codex without an interactive UI, used for CI/CD pipelines, automation scripts, or programmatic invocation.

### Basic command

```bash
codex exec "What you want Codex to do"
```

- **stderr** — shows progress and status while working
- **stdout** — shows only the final response

### Important options

```bash
# Run ephemerally (don't save the session)
codex exec --ephemeral "prompt"

# Output as JSONL (JSON Lines) — good for parsing
codex exec --json "prompt"

# Define the output schema as JSON Schema
codex exec --output-schema schema.json "prompt"

# Save output to a file
codex exec -o output.md "prompt"

# Skip the git repo check
codex exec --skip-git-repo-check "prompt"
```

### Using an API Key in CI

```bash
export CODEX_API_KEY="your-api-key"
codex exec "prompt"
```

### Resuming a Session

```bash
# Continue from the latest session
codex exec resume --last

# Continue from a specific session
codex exec resume <session-id>
```

### Receiving input from stdin

```bash
cat prompt.txt | codex exec
```

### Example GitHub Actions Workflow

```yaml
name: Auto Fix Issues
on:
  issues:
    types: [labeled]

jobs:
  fix:
    if: contains(github.event.label.name, 'codex-fix')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Codex Fix
        env:
          CODEX_API_KEY: ${{ secrets.CODEX_API_KEY }}
        run: |
          codex exec --json "Fix the issue described in #${{ github.event.issue.number }}"
```

### In short

`codex exec` is the main command for automation. Use `--json` for parsing, `CODEX_API_KEY` for CI/CD, and `resume --last` to continue from an old session.

---

## 10. Codex SDK

Reference: [Codex SDK — Codex Docs](https://developers.openai.com/codex/sdk)

### What this topic is

The Codex SDK is a library that lets developers control Codex programmatically within their own application, supporting both TypeScript and Python.

### When to use the SDK

- Control Codex from a CI/CD pipeline
- Build your own agent that uses Codex to do engineering tasks
- Embed Codex in internal tools
- Build an integration between Codex and your own application

### TypeScript Library

**Requirement:** Node.js 18 or newer

**Installation:**

```bash
npm install @openai/codex-sdk
```

**Basic usage:**

```typescript
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();
const result = await thread.run(
  "Make a plan to diagnose and fix the CI failures"
);

console.log(result);
```

**Continue the same thread, or resume an old thread:**

```typescript
// Continue in the same thread
const result = await thread.run("Implement the plan");

// Resume an old thread by thread ID
const threadId = "<thread-id>";
const thread2 = codex.resumeThread(threadId);
const result2 = await thread2.run("Pick up where you left off");
```

See more source: [TypeScript SDK repo](https://github.com/openai/codex/tree/main/sdk/typescript)

### Python Library

**Requirement:** Python 3.10 or newer

The Python SDK controls a local Codex app-server via JSON-RPC. SDK builds automatically pin the Codex CLI runtime version.

**Installation:**

```bash
pip install openai-codex
```

**Basic usage:**

```python
from openai_codex import Codex, Sandbox

with Codex() as codex:
    thread = codex.thread_start(
        model="gpt-5.4",
        sandbox=Sandbox.workspace_write,
    )
    result = thread.run("Make a plan to diagnose and fix the CI failures")
    print(result.final_response)
```

**Async version:**

```python
import asyncio
from openai_codex import AsyncCodex

async def main() -> None:
    async with AsyncCodex() as codex:
        thread = await codex.thread_start(model="gpt-5.4")
        result = await thread.run("Implement the plan")
        print(result.final_response)

asyncio.run(main())
```

### Sandbox Presets in the Python SDK

```python
from openai_codex import Codex, Sandbox

with Codex() as codex:
    thread = codex.thread_start(sandbox=Sandbox.workspace_write)
    thread.run("Make the requested change.")
    
    # Change the sandbox for the next turn
    review = thread.run("Review the diff only.", sandbox=Sandbox.read_only)
```

| Preset | Meaning |
|--------|---------|
| `Sandbox.read_only` | Read files only, no writing |
| `Sandbox.workspace_write` | Read and write in the workspace |
| `Sandbox.full_access` | No filesystem restrictions |

If you don't specify `sandbox=`, it uses the app-server's default.

See more source: [Python SDK repo](https://github.com/openai/codex/tree/main/sdk/python)

### In short

The Codex SDK is available in both TypeScript (Node.js 18+) and Python (3.10+). Both use the same thread-based concept. Choose between the SDK and `codex exec` depending on how deep an integration you need.

---

## 11. App Server

Reference: [App Server — Codex Docs](https://developers.openai.com/codex/app-server)

### What this topic is

The Codex App Server is the interface Codex uses internally to power rich clients like the VS Code extension, using a bidirectional JSON-RPC 2.0 protocol, open source at [openai/codex/codex-rs/app-server](https://github.com/openai/codex/tree/main/codex-rs/app-server).

> **When to use the App Server instead of the SDK:**
> - Use the **App Server** when you want deep integration in your own product: authentication, conversation history, approvals, streamed events
> - Use the **Codex SDK** for CI/CD or automation work

### Protocol

The App Server uses bidirectional JSON-RPC 2.0 (without a `"jsonrpc":"2.0"` header on the wire).

**Supported transports:**

| Transport | Flag | Details |
|-----------|------|-----------|
| stdio | `--listen stdio://` (default) | JSONL — best for a subprocess |
| WebSocket | `--listen ws://IP:PORT` | experimental, unsupported |
| Unix socket | `--listen unix://` or `--listen unix://PATH` | WebSocket over Unix socket |
| Off | `--listen off` | Turn off all transports |

**Health endpoints (WebSocket mode only):**
- `GET /readyz` — 200 OK when the listener is ready to accept connections
- `GET /healthz` — 200 OK (if there's no Origin header)
- A request with an Origin header gets 403 Forbidden

**WebSocket Auth Flags:**

```bash
--ws-auth capability-token --ws-token-file /absolute/path
--ws-auth capability-token --ws-token-sha256 HEX
--ws-auth signed-bearer-token --ws-shared-secret-file /absolute/path
```

Clients send the credential via `Authorization: Bearer <token>` during the WebSocket handshake.

### Message Schema

**Request:**
```json
{ "method": "thread/start", "id": 10, "params": { "model": "gpt-5.4" } }
```

**Response:**
```json
{ "id": 10, "result": { "thread": { "id": "thr_123" } } }
```

**Error:**
```json
{ "id": 10, "error": { "code": 123, "message": "Something went wrong" } }
```

**Notification (no id):**
```json
{ "method": "turn/started", "params": { "turn": { "id": "turn_456" } } }
```

**Generate schema from the CLI:**

```bash
codex app-server generate-ts --out ./schemas
codex app-server generate-json-schema --out ./schemas
```

### Getting started

```bash
# stdio (default)
codex app-server

# TCP WebSocket
codex app-server --listen ws://127.0.0.1:4500

# Unix socket
codex app-server --listen unix://
```

**Node.js/TypeScript example:**

```typescript
import { spawn } from "node:child_process";
import readline from "node:readline";

const proc = spawn("codex", ["app-server"], {
  stdio: ["pipe", "pipe", "inherit"],
});
const rl = readline.createInterface({ input: proc.stdout });

const send = (message: unknown) => {
  proc.stdin.write(`${JSON.stringify(message)}\n`);
};

let threadId: string | null = null;

rl.on("line", (line) => {
  const msg = JSON.parse(line) as any;
  if (msg.id === 1 && msg.result?.thread?.id && !threadId) {
    threadId = msg.result.thread.id;
    send({
      method: "turn/start",
      id: 2,
      params: {
        threadId,
        input: [{ type: "text", text: "Summarize this repo." }],
      },
    });
  }
});

send({ method: "initialize", id: 0, params: { clientInfo: { name: "my_product", title: "My Product", version: "0.1.0" } } });
send({ method: "initialized", params: {} });
send({ method: "thread/start", id: 1, params: { model: "gpt-5.4" } });
```

### Core Primitives

- **Thread** — a conversation between the user and the Codex agent, made of turns
- **Turn** — a single user request and the work the agent does for it, made of items
- **Item** — a unit of input/output data: user message, agent message, command, file change, tool call

### Lifecycle Overview

1. **Initialize**: send an `initialize` request with client metadata, followed by the `initialized` notification before doing anything else
2. **Start/Resume Thread**: `thread/start` for a new conversation, `thread/resume` to continue an old thread, `thread/fork` to split history
3. **Begin Turn**: `turn/start` with the threadId and user input
4. **Steer Turn**: `turn/steer` adds input during a running turn
5. **Stream Events**: read notifications: `item/started`, `item/completed`, `item/agentMessage/delta`, tool progress, etc.
6. **Finish Turn**: the server emits `turn/completed` when the model finishes, or after `turn/interrupt`

### Initialization

```json
{
  "method": "initialize",
  "id": 0,
  "params": {
    "clientInfo": {
      "name": "codex_vscode",
      "title": "Codex VS Code Extension",
      "version": "0.1.0"
    }
  }
}
```

**Notification opt-out** — turn off unwanted notification methods:

```json
{
  "method": "initialize",
  "id": 1,
  "params": {
    "clientInfo": { "name": "my_client", "title": "My Client", "version": "0.1.0" },
    "capabilities": {
      "experimentalApi": true,
      "optOutNotificationMethods": ["thread/started", "item/agentMessage/delta"]
    }
  }
}
```

### Experimental API Opt-in

Some methods require enabling the experimental API first:

```json
{
  "capabilities": {
    "experimentalApi": true
  }
}
```

If you don't enable it and call an experimental method, you get the error: `<descriptor> requires experimentalApi capability`

### API Overview (important methods)

| Method | Description |
|--------|---------|
| `thread/start` | Create a new thread |
| `thread/resume` | Reopen an existing thread |
| `thread/fork` | Split a thread into a new branch |
| `thread/list` | View all threads (cursor pagination) |
| `thread/archive` | Archive a thread |
| `turn/start` | Start a new turn with user input |
| `turn/steer` | Add input during a running turn |
| `turn/interrupt` | Cancel a running turn |
| `review/start` | Invoke the Codex reviewer |
| `command/exec` | Run a single command in the sandbox |
| `model/list` | View available models |
| `skills/list` | View skills by cwd |
| `plugin/list` | View installed plugins |
| `plugin/install` | Install a plugin |

### In short

The App Server is the core protocol Codex uses for rich-client integration. It uses JSON-RPC 2.0 over stdio (default), WebSocket (experimental), or Unix socket. Good for building a custom Codex client needing streaming events and conversation management.

---

## 12. MCP Server

Reference: [MCP Server — Codex Docs](https://developers.openai.com/codex/guides/agents-sdk)

### What this topic is

Codex can run as an MCP (Model Context Protocol) server, letting external agents or tools connect to and use Codex through the standard MCP protocol.

### What it's used for

When Codex runs as an MCP server, other agent systems (e.g. the OpenAI Agents SDK) can use Codex as a tool for working with code directly, making it easier to build multi-agent workflows.

### Caution

The full details of the MCP Server integration are at [Official Docs: MCP Server](https://developers.openai.com/codex/guides/agents-sdk), covering configuration, endpoints, and an example of connecting with the OpenAI Agents SDK.

---

## 13. GitHub Action

Reference: [GitHub Action — Codex Docs](https://developers.openai.com/codex/github-action)

### What this topic is

`openai/codex-action@v1` is the official GitHub Action that lets you run a Codex task directly in a GitHub Actions workflow, without setting up the CLI yourself.

### How to use it

```yaml
- uses: openai/codex-action@v1
  with:
    prompt: "Fix all TypeScript type errors"
    model: "gpt-5.4"
    effort: "medium"
```

### Input Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|---------|
| `prompt` | ✅ (or `prompt-file`) | — | The prompt sent to Codex |
| `prompt-file` | ✅ (or `prompt`) | — | Path to a file with the prompt |
| `codex-args` | ❌ | — | Extra arguments for the Codex CLI |
| `model` | ❌ | — | The model to use (e.g. `gpt-5.4`) |
| `effort` | ❌ | — | Effort level: `low`, `medium`, `high` |
| `sandbox` | ❌ | — | Sandbox mode |
| `output-file` | ❌ | — | File path to save output |
| `safety-strategy` | ❌ | `drop-sudo` | Safety strategy |
| `allow-users` | ❌ | — | GitHub users allowed to trigger |
| `allow-bots` | ❌ | — | GitHub bots allowed to trigger |

### Output

| Output | Description |
|--------|---------|
| `final-message` | The last message Codex replied with |

Usage:
```yaml
- id: codex
  uses: openai/codex-action@v1
  with:
    prompt: "Summarize what changed"

- name: Show result
  run: echo "${{ steps.codex.outputs.final-message }}"
```

### Safety Strategy

`safety-strategy` controls the sandbox behavior in GitHub Actions:

- `drop-sudo` (default) — removes sudo permissions for agent commands
- For other values, see the Official Docs

### Security guidance

- **Sanitize the prompt** before sending it into the workflow, to prevent prompt injection
- **Protect the API key** — always keep it in GitHub Secrets (`${{ secrets.CODEX_API_KEY }}`)
- **Use `drop-sudo`** to limit the agent's privileges in CI
- **Use `allow-users`/`allow-bots`** to limit who can trigger it

### Example Workflow

```yaml
name: Codex Auto Fix
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  codex:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: Run Codex
        uses: openai/codex-action@v1
        with:
          prompt: "Review the diff and fix any obvious bugs or lint errors"
          model: "gpt-5.4"
          effort: "medium"
          safety-strategy: "drop-sudo"
        env:
          CODEX_API_KEY: ${{ secrets.CODEX_API_KEY }}
```

### In short

`openai/codex-action@v1` makes it easy to run Codex in GitHub Actions. Always keep the API key in Secrets, use the `drop-sudo` safety strategy, and specify `allow-users` for security.

---

## 14. Topics not fully compiled

| Topic | Reason | Link |
|--------|--------|-------|
| Enterprise — Admin Setup (full) | Page too large, over 59KB, couldn't pull all content | [Admin Setup](https://developers.openai.com/codex/enterprise/admin-setup) |
| Enterprise — Managed Configuration (full) | Page too large, over 52KB, with complex policy details | [Managed Configuration](https://developers.openai.com/codex/enterprise/managed-configuration) |
| MCP Server (full) | Content tied to the OpenAI Agents SDK, which has a lot of detail | [MCP Server](https://developers.openai.com/codex/guides/agents-sdk) |
| Access Tokens (full) | Depends on the enterprise admin setup | [Access Tokens](https://developers.openai.com/codex/enterprise/access-tokens) |
| Amazon Bedrock Deployment | A separate deployment topic for AWS | [Amazon Bedrock](https://developers.openai.com/codex/amazon-bedrock) |

---

*This document is based on the [Codex Official Documentation](https://developers.openai.com/codex) — information as of the date of writing*

*Back to the [INDEX](./00-INDEX.md)*
