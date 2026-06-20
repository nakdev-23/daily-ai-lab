---
title: "IDE Extension, CLI, and Web/Cloud"
tool: "Codex"
icon: "icon-docs"
level: "beginner"
summary: "- Part 1: IDE Extension"
readTime: "14 min"
readers: "0"
locked: false
order: 3
---
# IDE Extension, CLI, and Web/Cloud — Guide
> Primary reference: [Codex IDE Extension Docs](https://developers.openai.com/codex/ide) | [Codex CLI Docs](https://developers.openai.com/codex/cli) | [Codex Web/Cloud Docs](https://developers.openai.com/codex/cloud)
> Last updated: June 2026

---

## Contents

- [Part 1: IDE Extension](#part-1-ide-extension)
  - [1.1 IDE Extension — overview](#11-ide-extension--overview)
  - [1.2 IDE Extension — features](#12-ide-extension--features)
  - [1.3 IDE Extension — Settings](#13-ide-extension--settings)
  - [1.4 IDE Commands](#14-ide-commands)
  - [1.5 Slash Commands in the IDE](#15-slash-commands-in-the-ide)
- [Part 2: CLI (Command Line Interface)](#part-2-cli-command-line-interface)
  - [2.1 CLI — overview](#21-cli--overview)
  - [2.2 CLI — main features](#22-cli--main-features)
  - [2.3 CLI — Command Line Options](#23-cli--command-line-options)
  - [2.4 Slash Commands in the CLI](#24-slash-commands-in-the-cli)
- [Part 3: Web/Cloud](#part-3-webcloud)
  - [3.1 Web/Cloud — overview](#31-webcloud--overview)
  - [3.2 Cloud Environments](#32-cloud-environments)
  - [3.3 Internet Access](#33-internet-access)

---

# Part 1: IDE Extension

---

## 1.1 IDE Extension — overview
Reference: [Official Docs](https://developers.openai.com/codex/ide)

### What is the IDE Extension

The Codex IDE Extension is an add-on installed in popular code editors, letting you use Codex directly inside your IDE without switching windows. This extension uses the same agent and configuration as the Codex CLI, so the behavior is consistent across both platforms.

### Which IDEs are supported

- **VS Code** — install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt) or open the link `vscode:extension/openai.chatgpt` in a browser
- **Cursor** — use the link `cursor:extension/openai.chatgpt`
- **Windsurf** — use the link `windsurf:extension/openai.chatgpt`
- **JetBrains IDEs** (IntelliJ IDEA, PyCharm, WebStorm, etc.) — install a separate plugin from the JetBrains Marketplace

### How to install and sign in

1. Open your IDE and go to the Extensions/Plugins Marketplace
2. Search for **ChatGPT** or **OpenAI**
3. Install the extension
4. Sign in with a **ChatGPT account** or an **OpenAI API key** (for an API key you need credits in the account)
5. The extension updates automatically when a new version is available

### Worth knowing

- The extension uses the same agent engine as the CLI — config set in `codex.yaml` or `AGENTS.md` affects both
- If the Codex CLI is already installed, the extension detects it and can work together with it

---

## 1.2 IDE Extension — features
Reference: [Official Docs](https://developers.openai.com/codex/ide/features)

### Main features of the IDE Extension

#### @file — reference files in the conversation

Type `@` followed by a filename or folder in the prompt box to attach that file's content to Codex's context, so Codex understands the project structure and file contents accurately without you copying and pasting code.

#### Model Switcher — change models instantly

Choose the AI model you want directly from the UI in the panel. Switch between models to suit the work — a light model for quick work, a high-reasoning model for complex work.

#### Reasoning Effort — control the depth of thinking

| Level | Meaning |
|---|---|
| `low` | Thinks fast, uses few tokens, good for easy work |
| `medium` | A balance of speed and accuracy (default) |
| `high` | Thinks more deeply, uses more tokens, good for complex problems |

#### Approval Mode — control the agent's permission level

| Mode | Permission |
|---|---|
| **Chat** | Shows suggestions only, doesn't edit any files |
| **Agent** (default) | Reads and edits files + runs commands within the working directory |
| **Agent (Full Access)** | Like Agent but adds network access |

#### Cloud Delegation — send work to run in the cloud from the IDE

You can transfer work in progress in the IDE to run on the Codex cloud directly, without starting over. How:
1. Set up a Cloud Environment first (see the Web/Cloud section)
2. While using the agent in the IDE, choose **"Run in the cloud"**
3. You can choose to start from the `main` branch or from existing local changes
4. All the context is transferred to the cloud seamlessly

#### Cloud Task Follow-up — track cloud work from the IDE

When a cloud task finishes running or needs review, you can load the cloud task back into the IDE using the slash command `/cloud` to see the diff, approve, or continue.

#### Web Search — search for information from the web

- **Cached mode** (default): Codex searches from an index OpenAI maintains, fast and requiring no network access
- **Live search** (Full Access mode): searches for the latest info in real time, requires Agent (Full Access)

#### Image Input — send images into the prompt

Drag and drop images into the chat box directly. To drag-and-drop, hold **Shift** while dragging (some IDE versions may require this to prevent the IDE from opening the file instead).

---

## 1.3 IDE Extension — Settings
Reference: [Official Docs](https://developers.openai.com/codex/ide/settings)

### How to access Settings

Go to **File > Preferences > Settings** (or `Cmd+,` / `Ctrl+,`) and search "ChatGPT" or "Codex".

### Full settings table

| Setting Key | Type | Default | Description |
|---|---|---|---|
| `chat.fontSize` | number | (system value) | Font size in the Chat panel |
| `chat.editor.fontSize` | number | (system value) | Font size in the editor inside chat |
| `chatgpt.cliExecutable` | string | `codex` | Path to the Codex CLI binary you want to use, if the CLI is installed in a non-standard path |
| `chatgpt.commentCodeLensEnabled` | boolean | `true` | Show CodeLens on comments so you can click to implement a TODO instantly |
| `chatgpt.localeOverride` | string | (value from OS) | Force the UI to display a set language, e.g. `th`, `en`, `ja` |
| `chatgpt.openOnStartup` | boolean | `false` | Open the Codex panel automatically when the IDE starts |
| `chatgpt.runCodexInWindowsSubsystemForLinux` | boolean | `false` | Run the Codex CLI through WSL on Windows |

### Worth knowing about the CLI Executable

The `chatgpt.cliExecutable` value is useful when:
- You have several Codex CLI versions and want to specify which to use
- The CLI is installed in a path not in the system `$PATH`
- You use a virtual environment or container with the CLI in a separate path

---

## 1.4 IDE Commands
Reference: [Official Docs](https://developers.openai.com/codex/ide/commands)

### What are IDE Commands

IDE Commands are commands invoked through the Command Palette of VS Code/Cursor/Windsurf (press `Cmd+Shift+P` or `Ctrl+Shift+P`) or via an assigned keyboard shortcut.

### Full command table

| Command ID | Display name | Default shortcut | Description |
|---|---|---|---|
| `chatgpt.addToThread` | Add to Thread | — | Add the selected code or text to the current conversation |
| `chatgpt.addFileToThread` | Add File to Thread | — | Add the whole open file to the conversation |
| `chatgpt.newChat` | New Chat | `Cmd+N` / `Ctrl+N` | Start a new conversation (clears the old context) |
| `chatgpt.implementTodo` | Implement TODO | — | Have Codex act on the `// TODO` comment where the cursor is |
| `chatgpt.newCodexPanel` | New Codex Panel | — | Open a new Codex panel in a separate window |
| `chatgpt.openSidebar` | Open Sidebar | — | Open/show the Codex sidebar in the IDE view |

### How to assign your own keyboard shortcut

1. Open **Keyboard Shortcuts** (`Cmd+K Cmd+S` or `Ctrl+K Ctrl+S`)
2. Search by command ID, e.g. `chatgpt.newChat`
3. Click + to assign the keys you want

---

## 1.5 Slash Commands in the IDE
Reference: [Official Docs](https://developers.openai.com/codex/ide/slash-commands)

### What are Slash Commands

Slash commands are special commands typed starting with `/` in the chat box in the IDE to invoke Codex's features or special modes directly.

### Full Slash Commands table

| Command | Description |
|---|---|
| `/auto-context` | Have Codex analyze and select the files or context relevant to the question automatically, without @mentioning each file |
| `/cloud` | Load a running or finished cloud task back into the IDE to see the diff, review, or continue |
| `/cloud-environment` | Choose or change the cloud environment to use for running in the cloud |
| `/feedback` | Send feedback about the latest response directly to the OpenAI team |
| `/local` | Force the task to run locally instead of in the cloud (when cloud is set as default) |
| `/review` | Ask Codex to review the latest diff or changes in the project and comment |
| `/status` | Show the status of the running Codex agent, including pending cloud tasks |

### Usage tips

- `/auto-context` is very useful when the project has many files; it saves you specifying files each time
- `/review` is good before committing, for Codex to help check the code's correctness
- `/status` lets you know what stage a delegated cloud task is at, without opening a browser

---

# Part 2: CLI (Command Line Interface)

---

## 2.1 CLI — overview
Reference: [Official Docs](https://developers.openai.com/codex/cli)

### What is the Codex CLI

The Codex CLI is an open-source command-line tool developed in **Rust**, letting you use the Codex AI agent directly from the terminal without opening an application. The CLI supports both interactive mode (back-and-forth conversation) and non-interactive mode (running as an automated script).

### Supported operating systems

| System | Supported |
|---|---|
| macOS | ✅ Fully supported |
| Linux | ✅ Fully supported |
| Windows | ⚠️ Experimental support — recommended via WSL (Windows Subsystem for Linux) |

### How to install

**Install via npm (recommended):**
```bash
npm i -g @openai/codex
```

**Install via Homebrew (macOS):**
```bash
brew install openai-codex
```

### How to update the CLI

```bash
npm i -g @openai/codex@latest
```

### How to get started

```bash
# Open interactive mode
codex

# Run a prompt directly (non-interactive)
codex "Fix the bug in main.py"

# See help
codex --help
```

### Source code

The Codex CLI is open source; you can view it or contribute at OpenAI's GitHub repository.

---

## 2.2 CLI — main features
Reference: [Official Docs](https://developers.openai.com/codex/cli/features)

### Interactive TUI (Text User Interface)

The CLI has a text UI that works directly in the terminal, showing the conversation, the diff of changes, and the agent's status in real time. It has scrollback to view conversation history and supports pressing `Ctrl+C` to stop a task mid-way.

### Model and Reasoning Control

- Choose a model with `--model <model-name>` or set it in config
- Control reasoning effort with `--reasoning-effort low|medium|high`
- Switch models during a session using the slash command `/model`

### Image Input

Supports sending images into the prompt directly, by specifying the image file path or URL using the `--image` flag.

### Local Code Review

Use the `/review` command to have Codex analyze the latest diff in a git repository and comment on code quality, potential bugs, and security issues.

### Subagents

The Codex CLI supports creating and delegating work to subagents, which are sub-agents that run work in parallel or sequence, letting you handle complex work split into multiple tasks (see more in `04-configuration.md`).

### Web Search

Like the IDE Extension — supports cached search and live search depending on the chosen approval mode.

### Cloud Tasks

Have a task run on the Codex cloud directly from the CLI using the slash command `/cloud` or related flags; results are sent back when done.

### Scripting / Non-Interactive Mode

Run the CLI non-interactively, good for automation in CI/CD or shell scripts:
```bash
# Run non-interactively
codex --non-interactive "Create unit tests for the parse_user() function"

# Use a pipe to send input
echo "Explain this error: $(cat error.log)" | codex
```

### MCP (Model Context Protocol) Support

The CLI supports connecting to MCP servers, extending the agent's abilities with tools and data sources from outside. Configure it in `codex.yaml` (see the Configuration section).

### Approval Modes

Like the IDE — there are Chat, Agent, and Agent (Full Access) modes, controlled with the `--approval-mode` flag or set in config.

---

## 2.3 CLI — Command Line Options
Reference: [Official Docs](https://developers.openai.com/codex/cli/reference)

### Main command structure

```bash
codex [OPTIONS] [PROMPT]
```

### Commonly used options

| Flag | Value | Description |
|---|---|---|
| `--model`, `-m` | `<model-name>` | Choose a model, e.g. `codex-1`, `o4-mini` |
| `--reasoning-effort` | `low\|medium\|high` | The model's reasoning level |
| `--approval-mode` | `chat\|agent\|full` | The agent's permission mode |
| `--non-interactive` | — | Run the task with no TUI (for scripting) |
| `--image` | `<path/url>` | Attach an image to the prompt |
| `--config` | `<path>` | Specify the path of the config file to use |
| `--no-auto-context` | — | Turn off auto-context (don't let Codex pick files automatically) |
| `--working-dir`, `-w` | `<path>` | Set the working directory the agent works in |
| `--version` | — | Show the CLI version |
| `--help`, `-h` | — | Show all help |

### Subcommands

Besides a direct prompt, the CLI has more subcommands:

| Subcommand | Description |
|---|---|
| `codex auth` | Manage authentication with the OpenAI API |
| `codex config` | View or edit the CLI's config |
| `codex update` | Update the CLI to the latest version |

### Usage examples

```bash
# Open an interactive session with high reasoning
codex --reasoning-effort high

# Run a task non-interactively with a specified model
codex --non-interactive --model codex-1 "Add error handling to all API calls in this project"

# Attach an image in the prompt
codex --image screenshot.png "Adjust the UI to match this image"

# Set the working directory
codex --working-dir /path/to/project "Write tests to reach 80% coverage"
```

### Environment Variables for the CLI

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | API key for authentication |
| `CODEX_MODEL` | The default model (override with --model) |
| `CODEX_REASONING_EFFORT` | The default reasoning effort value |
| `NO_COLOR` | Disable ANSI color in terminal output |

---

## 2.4 Slash Commands in the CLI
Reference: [Official Docs](https://developers.openai.com/codex/cli/slash-commands)

### What are Slash Commands in the CLI

While using interactive mode, type `/` followed by a command name to issue special commands without leaving the session.

### Full Slash Commands table

| Command | Description |
|---|---|
| `/help` | Show the list of all slash commands and how to use them |
| `/model <name>` | Change the AI model during a session, e.g. `/model o4-mini` |
| `/reasoning <level>` | Change the reasoning level during a session (`low`, `medium`, `high`) |
| `/review` | Analyze the latest git diff and comment |
| `/cloud` | Send the current task to run on the Codex cloud, or load a cloud task back |
| `/status` | Show the agent and cloud-task status |
| `/clear` | Clear the conversation history in the current window |
| `/exit` | Exit the CLI session |
| `/auto-context` | Turn on/off letting Codex pick context files automatically |
| `/feedback` | Send feedback to OpenAI about the latest response |
| `/mcp` | Show or manage the connected MCP servers |
| `/subagents` | Show the status of running subagents |
| `/local` | Force the task to run locally instead of in the cloud |

### Tips

- Use `/model` to switch models without exiting and reopening a session, saving a lot of time
- Use `/review` before every commit to check code quality
- If the work takes a long time, use `/cloud` to offload it and do other work while you wait

---

# Part 3: Web/Cloud

---

## 3.1 Web/Cloud — overview
Reference: [Official Docs](https://developers.openai.com/codex/cloud)

### What is Codex Web/Cloud

Codex Web/Cloud is a system that lets Codex run agent tasks on OpenAI's servers instead of on your machine, letting you send work to run in the background while you do something else, including running tasks in **parallel** — several at once.

### Main benefits

- **No need to leave your machine on**: the work runs in the cloud; you can turn off the machine or close the IDE
- **Parallel tasks**: run several tasks at once, no waiting one at a time
- **A clean environment**: each task runs in an isolated container, preventing side effects

### How to get started

1. Go to **[chatgpt.com/codex](https://chatgpt.com/codex)**
2. Connect your GitHub account (required to clone repositories)
3. Set up a Cloud Environment (see the next topic)
4. Start giving work from the web UI, IDE, or CLI

### Connecting to GitHub

Connecting GitHub lets Codex:
- Clone your repository into the cloud environment
- Create Pull Requests on your behalf
- Read issues and context from the repository

---

## 3.2 Cloud Environments
Reference: [Official Docs](https://developers.openai.com/codex/cloud/environments)

### What is a Cloud Environment

A Cloud Environment is the container configuration Codex uses to run tasks in the cloud, comprising: a base image, environment variables, secrets, setup scripts, and other settings. You can have several environments and choose different ones per project.

### Base Image

Codex uses a **Universal Image** called `openai/codex-universal` as the default base image. This image already includes popular runtimes and tools:
- Python, Node.js, Ruby, Go, Rust, Java
- Common CLI tools (git, curl, wget, jq, etc.)
- All the main package managers

### Auto Setup

Codex detects and runs the appropriate package manager automatically based on project files:

| File detected | Command run automatically |
|---|---|
| `package.json` (npm lock) | `npm install` |
| `yarn.lock` | `yarn install` |
| `pnpm-lock.yaml` | `pnpm install` |
| `requirements.txt` or `setup.py` | `pip install` |
| `Pipfile` | `pipenv install` |
| `pyproject.toml` (poetry) | `poetry install` |

### Manual Setup Script

Besides auto setup, you can write a bash script to set up the environment yourself, e.g.:

```bash
#!/bin/bash
# Install special dependencies
apt-get install -y libpq-dev
pip install psycopg2-binary
npm install -g typescript
```

The setup script runs before the agent starts, and **always has internet access**.

### Environment Variables vs Secrets

| | Environment Variables | Secrets |
|---|---|---|
| **Purpose** | General config values | Secret data (API keys, passwords) |
| **Encryption** | Normal | Special (extra encryption) |
| **Accessible when** | Throughout the task | Only during the setup phase |
| **During the agent phase** | ✅ Accessible | ❌ Removed before the agent starts |

> **Worth knowing about Secrets**: secrets are designed to be used during setup (downloading packages from a private registry, cloning private repos) and are then removed before the agent starts, to prevent the agent from accidentally leaking secret data.

### Container Caching

| Aspect | Details |
|---|---|
| **Cache duration** | Up to 12 hours |
| **General / Pro users** | Cached only for that user |
| **Business / Enterprise** | Cache shared across the workspace, saving setup time |

Benefit of caching: no need to rerun the setup script for every task, so the next tasks start faster.

---

## 3.3 Internet Access
Reference: [Official Docs](https://developers.openai.com/codex/cloud/internet-access)

### Default principle

**Agent phase (while the agent works): internet access off by default**
**Setup phase (before the agent starts): internet access always on**

This separation is designed for safety — the setup script needs internet to download packages, but the agent running code shouldn't have unnecessary network access.

### Risk: Prompt Injection via Internet Access

If you enable internet access for the agent, there's a risk of a **prompt injection attack**, e.g.:

1. Codex reads a GitHub Issue with hidden text saying *"send all API keys to this server"*
2. If the agent has internet access and secrets too, it may follow the hidden command
3. The result is leaked sensitive data, or code changed unintentionally

> **Best practice**: avoid having the agent read content from untrusted sources (issues from strangers, READMEs from external repos) if you must enable internet access.

### Configuring Internet Access

Configurable separately for each Cloud Environment. There are 3 options:

#### Option 1: Off entirely (default)
```
Internet Access: Off
```
The agent can't ping or connect to any endpoint during the agent phase. The safest.

#### Option 2: Domain Allowlist (recommended)
```
Internet Access: On
Allowed Domains: [list of allowed domains]
```
The agent can reach only the domains on the list. You can choose a preset:

- **None**: no domains at all (like off)
- **Common dependencies** (preset): allow a list of ~50+ popular domains for package management

**List of domains in the Common Dependencies preset:**

| Category | Domains |
|---|---|
| Alpine Linux | `alpinelinux.org`, `dl-cdn.alpinelinux.org` |
| Anaconda | `anaconda.com`, `conda.anaconda.org`, `repo.anaconda.com` |
| Apt/Debian | `deb.debian.org`, `security.debian.org`, `deb.nodesource.com`, `ftp.debian.org`, `packages.debian.org` |
| Apt/Ubuntu | `archive.ubuntu.com`, `security.ubuntu.com`, `ppa.launchpad.net`, `launchpad.net`, `packages.ubuntu.com` |
| Cargo (Rust) | `crates.io`, `static.crates.io` |
| Cloudflare | `cloudflare.com`, `registry-1.docker.io`, `auth.docker.io` |
| Conda Forge | `conda-static.anaconda.org`, `conda.anaconda.org/conda-forge` |
| GitHub | `github.com`, `raw.githubusercontent.com`, `objects.githubusercontent.com`, `api.github.com`, `codeload.github.com` |
| Go | `proxy.golang.org`, `sum.golang.org`, `storage.googleapis.com` |
| Gradle | `plugins.gradle.org`, `jcenter.bintray.com`, `services.gradle.org`, `downloads.gradle.org` |
| Java/Maven | `repo.maven.apache.org`, `central.maven.org`, `repo1.maven.org` |
| JetBrains | `plugins.jetbrains.com`, `download.jetbrains.com` |
| npm | `registry.npmjs.org`, `npmjs.com`, `yarnpkg.com`, `registry.yarnpkg.com` |
| PyPI | `pypi.org`, `files.pythonhosted.org`, `bootstrap.pypa.io`, `pypi.python.org` |
| RubyGems | `rubygems.org`, `production.cloudfront.net` |
| Other | `keybase.io`, `keys.openpgp.org`, `keyserver.ubuntu.com` |

- **All unrestricted**: no domain restriction (highest risk)

#### Option 3: HTTP Method Restriction

Besides the domain allowlist, you can also restrict the **HTTP method**:
- Allow only `GET` (can read but not send data out)
- Allow `GET`, `POST` (can send some data)
- Allow all methods

### Example config for Internet Access

```yaml
# Example config in a Cloud Environment
internet_access:
  enabled: true
  preset: common_dependencies
  extra_domains:
    - api.mycompany.com
    - internal.registry.io
  allowed_methods:
    - GET
    - POST
```

### Best-practice summary

- Use the **Common dependencies preset** for general development work
- Use **Off** (default) when the task doesn't need network, for more safety
- Be careful **not to let the agent read untrusted content** like GitHub issues from outsiders when internet access is on
- If you need secrets and internet at the same time, review the task's input thoroughly first

---

## Topics not yet compiled

| Topic | Reason | Link |
|---|---|---|
| CLI Features (detailed) | Source file too large (53KB), exceeds the limit | [link](https://developers.openai.com/codex/cli/features) |
| CLI Reference (detailed) | Source file too large (82KB), exceeds the limit — covers every flag | [link](https://developers.openai.com/codex/cli/reference) |
| CLI Slash Commands (detailed) | Source file too large (64KB), exceeds the limit | [link](https://developers.openai.com/codex/cli/slash-commands) |

> **Note**: the CLI section above already covers every main concept and feature from the Official Docs. For specific flag or slash-command details, refer directly to the links above.

---

*Next file: [04-configuration.md](./04-configuration.md) — Config File, Permissions, Rules, Hooks, AGENTS.md, MCP, Plugins, Skills*
