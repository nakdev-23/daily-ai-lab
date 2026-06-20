---
title: "Configuration"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "Reference: Config Basics"
readTime: "17 min"
readers: "0"
locked: false
order: 4
---
# Codex Guide — Part 4: Configuration

> Official Docs reference: [Codex Configuration](https://developers.openai.com/codex/config-basic)

---

## Content map for this file

| Category | Topic | Status |
|---|---|---|
| Config File | Config Basics | Compiled |
| Config File | Advanced Config | Compiled (condensed) |
| Config File | Config Reference | Needs further checking |
| Config File | Environment Variables | Needs further checking |
| Config File | Sample Config | Needs further checking |
| Configuration | Permissions | Compiled (condensed) |
| Configuration | Speed | Compiled |
| Configuration | Rules | Compiled |
| Configuration | Hooks | Compiled |
| Configuration | AGENTS.md | Compiled |
| Configuration | MCP | Compiled |
| Configuration | Plugins Overview | Compiled |
| Configuration | Build Plugins | Compiled |
| Configuration | Sites | Compiled |
| Configuration | Skills | Compiled |
| Configuration | Subagents | Needs further checking |

---

## 1. Config Basics

Reference: [Config Basics](https://developers.openai.com/codex/config-basic)

### What this topic is

Config Basics explains how to configure Codex through the `config.toml` file, which is the core of adjusting Codex's behavior at the user and project level.

### Config file locations

Codex reads settings from several levels:

| Level | Location | Meaning |
|---|---|---|
| User Config | `~/.codex/config.toml` | The user's personal defaults |
| Project Config | `.codex/config.toml` (at the project root) | Settings specific to that project |
| System Config | `/etc/codex/config.toml` | Settings from the system admin (enterprise) |

### Precedence

When the same value exists in several places, Codex uses this order:

```
CLI flags  >  project config  >  profile  >  user config  >  system config  >  defaults
```

A value set via a CLI flag always overrides everything.

### Commonly used main options

| Option | Type | Meaning |
|---|---|---|
| `model` | string | The model to use, e.g. `"gpt-4.1"` |
| `approval_policy` | string | Approval mode: `"untrusted"` / `"on-request"` / `"never"` |
| `sandbox_mode` | string | Sandbox mode for safety |
| `web_search` | string | Web search: `"cached"` / `"live"` / `"disabled"` |
| `model_reasoning_effort` | string | Reasoning depth: `"low"` / `"medium"` / `"high"` |
| `personality` | string | Codex's response style |
| `tui_keymap` | string | Keyboard layout in the TUI |
| `shell_environment_policy` | string | The shell environment policy |
| `log_dir` | string | The folder where logs are kept |

### Basic config file example

```toml
# ~/.codex/config.toml

model = "gpt-4.1"
approval_policy = "on-request"
web_search = "live"
model_reasoning_effort = "medium"
```

### Feature Flags

Codex has feature flags that control various features in the `[features]` section:

| Feature Flag | Default | Maturity |
|---|---|---|
| `hooks` | `false` | Stable |
| `memories` | `false` | Stable |
| `multi_agent` | `false` | Stable |
| `shell_snapshot` | `false` | Stable |
| `undo` | `false` | Stable |
| `fast_mode` | `false` | Stable |
| `apps` | `false` | Experimental |
| `codex_git_commit` | `false` | Experimental |

Example of enabling hooks:

```toml
[features]
codex_hooks = true
```

### In short

The `config.toml` file is the center of customizing Codex, from choosing a model and setting the approval policy to enabling new features. Values set in the project override the user's, and CLI flags override everything.

---

## 2. Advanced Config

Reference: [Advanced Config](https://developers.openai.com/codex/config-advanced)

### What this topic is

Advanced Config covers deeper settings, e.g. multiple profiles, project-instructions discovery, and shell-environment settings.

### Profiles

Profiles are named sets of settings, making it easy to switch between configurations, e.g. a profile for security-review work and a profile for general refactor work.

```toml
[profile.strict]
approval_policy = "untrusted"
model_reasoning_effort = "high"

[profile.quick]
approval_policy = "never"
model_reasoning_effort = "low"
```

Invoke a profile with: `codex --profile strict`

### Project Instructions Discovery

Codex has a system for finding instruction files automatically via these parameters:

| Option | Meaning |
|---|---|
| `project_doc_max_bytes` | Max combined size of instruction files (default: 32KiB) |
| `project_doc_fallback_filenames` | Backup filenames besides AGENTS.md |

Example:

```toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
```

### Shell Environment Policy

Defines how Codex inherits environment variables from the shell — you can choose to inherit all, only some, or none.

### Caution

The Advanced Config page has a lot of content; we recommend reading further directly from the [Official Docs](https://developers.openai.com/codex/config-advanced) for full details.

---

## 3. Config Reference, Environment Variables & Sample Config

Reference: [Config Reference](https://developers.openai.com/codex/config-reference) | [Environment Variables](https://developers.openai.com/codex/environment-variables) | [Sample Config](https://developers.openai.com/codex/config-sample)

### Config Reference

A reference document for every key supported in `config.toml`, with type, default, and description. Use it together with Config Basics and Advanced Config.

### Important environment variables

Codex supports some settings via environment variables:

| Variable | Meaning |
|---|---|
| `OPENAI_API_KEY` | The API key for connecting to OpenAI |
| `CODEX_HOME` | Change Codex's home directory location (instead of `~/.codex`) |
| `CODEX_QUIET_MODE` | Reduce display output to be quieter |

### Worth knowing

See a full example config at [Sample Config](https://developers.openai.com/codex/config-sample), a template you can copy and adapt right away.

---

## 4. Permissions

Reference: [Permissions](https://developers.openai.com/codex/permissions)

### What this topic is

Permissions control what files, network, and commands Codex can access and run.

### Named Permission Profiles

Codex has ready-made named profiles to choose from:

| Profile | Meaning |
|---|---|
| `:read-only` | Read files only, no editing or running |
| `:workspace` | Can work within the working directory |
| `:danger-full-access` | Full access including network |

Use it in the CLI: `codex --permissions :read-only "Read all files in src/"`

### Custom Permission Profiles

Create your own profile in config.toml:

```toml
[permissions.my-profile]
# Define filesystem and network access as needed
```

### Caution

The Permissions page has a lot of detail about filesystem scope and network access control; we recommend reading directly from the [Official Docs](https://developers.openai.com/codex/permissions) for full information.

---

## 5. Speed

Reference: [Speed](https://developers.openai.com/codex/speed)

### What this topic is

Speed explains how to make Codex work faster without losing much performance.

### Fast Mode

Fast Mode increases the speed of supported models by **1.5x** in exchange for higher credit usage.

**Supported models:**

| Model | Credit usage rate in Fast Mode |
|---|---|
| GPT-5.5 | 2.5x vs Standard |
| GPT-5.4 | 2x vs Standard |

**How to enable:**

In the CLI — use slash commands:
```
/fast on      # Turn on Fast Mode
/fast off     # Turn off Fast Mode
/fast status  # View the current status
```

In permanent config:
```toml
service_tier = "fast"

[features]
fast_mode = true
```

**Available in:** Codex IDE Extension, Codex CLI, Codex App (when logged in with ChatGPT)

**Not supported:** when using an API key directly (uses standard API pricing instead)

### Codex-Spark

GPT-5.3-Codex-Spark is a separate model (not Fast Mode), designed for very fast real-time code iteration.

- Less capable than GPT-5.4/5.5 but responds almost instantly
- Currently available only to **ChatGPT Pro** members (Research Preview)
- Has separate usage limits

### In short

Fast Mode suits work needing speed where you accept the higher cost; Codex-Spark suits a fast iteration loop that doesn't need very high completeness.

---

## 6. Rules — rules for controlling behavior

Reference: [Rules](https://developers.openai.com/codex/rules)

### What this topic is

Rules let you define which shell commands Codex allows, forbids, or must ask for approval before running.

### The Starlark language and prefix_rule()

The `.rules` file uses the Starlark language (a subset of Python), defining rules with the `prefix_rule()` function:

```python
prefix_rule(
    pattern = "rm -rf",
    decision = "forbidden",
    justification = "Don't delete files recursively without approval",
    match = ["rm -rf /tmp"],
    not_match = ["rm -rf /nonexistent"]
)
```

**Fields of prefix_rule():**

| Field | Meaning |
|---|---|
| `pattern` | The prefix of the command to catch |
| `decision` | `"allow"` / `"prompt"` / `"forbidden"` |
| `justification` | The reason shown to the user |
| `match` | Examples of commands that should match |
| `not_match` | Examples of commands that should not match |

### Decisions

| Decision | Meaning |
|---|---|
| `allow` | Allow immediately without asking the user |
| `prompt` | Ask the user for approval before running |
| `forbidden` | Forbid running entirely |

### Shell Compound Commands

Codex splits commands joined with `&&`, `||`, `;` into parts before checking rules, e.g.:

```bash
npm test && rm -rf ./dist
```

Codex checks `npm test` and `rm -rf ./dist` separately, so a rule catching `rm -rf` still works even within a compound command.

### Test rules

```bash
codex execpolicy check "rm -rf /tmp/test"
```

Use this command to check whether the rules you wrote work as expected.

### In short

Rules help automatically prevent running dangerous commands, great for teams that want a safety net before deploying or working on a production environment.

---

## 7. Hooks — automatic events

Reference: [Hooks](https://developers.openai.com/codex/hooks)

### What this topic is

Hooks are event handlers that run automatically when Codex does various events, e.g. starting a session, before/after a tool call, or when the agent stops working.

### Enabling Hooks

You must enable the feature flag first:

```toml
[features]
codex_hooks = true
```

> **Note:** Hooks aren't supported on Windows.

### hooks.json structure

Create a `~/.codex/hooks.json` or `.codex/hooks.json` file in the project:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": {
        "tool_name": "shell"
      },
      "command": ["./scripts/log-tool-use.sh"]
    }
  ]
}
```

### Supported events

| Event | When it runs |
|---|---|
| `SessionStart` | When a new session starts |
| `PreToolUse` | Before Codex calls a tool |
| `PostToolUse` | After Codex finishes calling a tool |
| `UserPromptSubmit` | When the user submits a prompt |
| `Stop` | When the agent stops working |

### Matcher Patterns

Use a matcher to filter events to specific tools:

```json
{
  "matcher": {
    "tool_name": "shell"
  }
}
```

Or match a command name:

```json
{
  "matcher": {
    "command_prefix": "npm"
  }
}
```

### A hook's Input/Output

**Input (sent to the hook script):** a JSON object with the event type, tool name, arguments, timestamp

**Output (read from the hook script):** a JSON object the hook returns, using modifiers like block, replace for PreToolUse

### Concurrent Hooks

Several hooks subscribing to the same event run **concurrently**, so design hooks to work independently of each other.

### Timeout

If a hook doesn't respond within the set timeout, Codex treats that hook as passed and continues the work.

### In short

Hooks suit logging, an audit trail, team notifications, or blocking certain actions programmatically. You must enable the feature flag, and they don't work on Windows.

---

## 8. AGENTS.md — persistent instructions for a project

Reference: [AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

### What this topic is

`AGENTS.md` is a file Codex reads before starting every job, letting you define working agreements, conventions, and project information Codex should always know.

### AGENTS.md Discovery

Codex builds an "instruction chain" at the start of each run, in order of priority:

1. **Global scope:** searches in `~/.codex/` (or `$CODEX_HOME/`)
   - Reads `AGENTS.override.md` first; if there's none, it reads `AGENTS.md`
2. **Project scope:** starts from the Git root and walks down to the current directory
   - Each folder is checked in order: `AGENTS.override.md` → `AGENTS.md` → fallback filenames
   - At most 1 file per folder is read
3. **Merge:** concatenates files from the root down, with files closer to the current directory overriding the earlier ones

Max combined size: 32KiB (adjustable via `project_doc_max_bytes`)

### Create Global Guidance

```bash
mkdir -p ~/.codex
```

Create `~/.codex/AGENTS.md`:

```markdown
# ~/.codex/AGENTS.md

## Working agreements

- Always run `npm test` after modifying JavaScript files.
- Prefer `pnpm` when installing dependencies.
- Ask for confirmation before adding new production dependencies.
```

Test:
```bash
codex --ask-for-approval never "Summarize the current instructions."
```

### Layer Project Instructions

Create `AGENTS.md` at the repository root:

```markdown
# AGENTS.md

## Repository expectations

- Run `npm run lint` before opening a pull request.
- Document public utilities in `docs/` when you change behavior.
```

Add an override in a specific subfolder when you want special rules:

```markdown
# services/payments/AGENTS.override.md

## Payments service rules

- Use `make test-payments` instead of `npm test`.
- Never rotate API keys without notifying the security channel.
```

### File reading order

```
~/.codex/AGENTS.md (Global)
    ↓
AGENTS.md (Repository root)
    ↓
services/AGENTS.md (if present)
    ↓
services/payments/AGENTS.override.md (Override)  ← read last = overrides everything
```

### Fallback Filenames

If the project uses a different filename, set a fallback:

```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
```

Codex will check: `AGENTS.override.md` → `AGENTS.md` → `TEAM_GUIDE.md` → `.agents.md`

### CODEX_HOME

Change Codex's home directory to use a different profile:

```bash
CODEX_HOME=$(pwd)/.codex codex exec "List active instruction sources"
```

### Troubleshooting

| Problem | Fix |
|---|---|
| Nothing loads | Check that Codex is in the correct repository and the file has content |
| Loads the wrong guidance | Look for `AGENTS.override.md` in a parent directory |
| Codex doesn't accept the fallback name | Check for a typo in `project_doc_fallback_filenames` and restart |
| Content is truncated | Increase `project_doc_max_bytes` or split the file into subfolders |

### In short

`AGENTS.md` is how you give Codex "permanent instructions" to remember for every task in the project, without typing them every time. The more you layer them, the more finely you can adjust behavior per part of the codebase.

---

## 9. MCP — Model Context Protocol

Reference: [MCP](https://developers.openai.com/codex/mcp)

### What this topic is

MCP (Model Context Protocol) lets Codex connect to external services and tools via the MCP standard, both as a local process (STDIO) and a remote server (HTTP).

### Types of MCP Server

| Type | How it connects | Good for |
|---|---|---|
| STDIO | Through a process on the machine | Local tools, e.g. file system, local database |
| Streamable HTTP | Through a URL | Remote services, cloud APIs |

### Configure in config.toml

**STDIO Server:**

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

**HTTP Server:**

```toml
[mcp_servers.figma]
url = "https://figma.com/mcp"
headers = { "X-Api-Key" = "your-key" }
```

### Add an MCP Server via CLI

```bash
codex mcp add
```

This command helps you add an MCP server interactively without editing config.toml by hand.

### OAuth Authentication

For an MCP server requiring OAuth:

```bash
codex mcp login <server-name>
```

The port for the OAuth callback:
```toml
mcp_oauth_callback_port = 8085
```

### Tool Filtering

Choose only some tools from an MCP server:

```toml
[mcp_servers.figma]
url = "https://figma.com/mcp"
enabled_tools = ["get_file", "get_component"]  # enable only these tools
# or
disabled_tools = ["delete_file"]               # disable these tools
```

### Commonly used MCP Servers

| Server | What it does |
|---|---|
| Context7 | Pull data from libraries' documentation |
| Figma MCP | Work with Figma designs directly |
| Chrome DevTools | Inspect browser state |
| GitHub MCP | Read/write GitHub issues, PRs |

### In short

MCP gives Codex extra "eyes" and "hands" through connections to external services, both local and remote, letting Codex work with a broader ecosystem without writing a custom integration.

---

## 10. Plugins — ready-made plugins

Reference: [Plugins Overview](https://developers.openai.com/codex/plugins)

### What this topic is

Plugins are packages that bundle Skills, app integrations, and MCP servers together in a form that's easy to install and share.

### What a plugin contains

| Component | What it is |
|---|---|
| **Skills** | Instructions for specific work, which Codex loads when needed |
| **Apps** | Connections to tools like GitHub, Slack, Google Drive |
| **MCP Servers** | Services that give Codex access to extra data or tools |

### Plugin Directory

**In the Codex App:** open **Plugins** in the left bar → choose from 3 categories:
- **Curated by OpenAI** — plugins OpenAI selected
- **Shared with you** — plugins from members in your workspace
- **Created by you** — plugins you built

**In the CLI:**
```bash
/plugins
```

### How to install and use a plugin

1. Open the Plugin Directory → find the plugin you want
2. Hit **Add to Codex** (App) or **Install plugin** (CLI)
3. Connect an external app if the plugin needs it (e.g. Gmail OAuth)
4. Start a new thread and type the task you want

**How to invoke a plugin:**

```
# Describe the task directly
"Summarize unread Gmail threads from today"

# Call the plugin directly (type @)
@Gmail "show me emails from last week about the project"
```

### Disable a plugin without uninstalling

```toml
# ~/.codex/config.toml
[plugins."gmail@openai-curated"]
enabled = false
```

### In short

Plugins are the fastest way to extend Codex's abilities with ready-made workflows from the community or OpenAI, great for work that needs to connect to external services without setting up MCP by hand.

---

## 11. Build Plugins — build your own plugin

Reference: [Build Plugins](https://developers.openai.com/codex/plugins/build)

### What this topic is

Build Plugins explains how to build, test, and distribute a plugin to others on your team or in the community.

### Build a Plugin with $plugin-creator

The fastest way:

```
$plugin-creator
```

This skill helps scaffold the manifest file `.codex-plugin/plugin.json` and create a local marketplace for testing.

### Plugin structure

```
my-plugin/
├── .codex-plugin/
│   └── plugin.json          # Required: manifest
├── skills/
│   └── my-skill/
│       └── SKILL.md         # Optional: skill instructions
├── .app.json                # Optional: app/connector config
├── .mcp.json                # Optional: MCP server config
└── assets/                  # Optional: icons, logos
```

### Plugin Manifest (.codex-plugin/plugin.json)

**Minimal:**
```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "description": "Reusable greeting workflow",
  "skills": "./skills/"
}
```

**Full:**
```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "description": "Bundle reusable skills and app integrations.",
  "author": {
    "name": "Your team",
    "email": "team@example.com"
  },
  "skills": "./skills/",
  "mcpServers": "./.mcp.json",
  "apps": "./.app.json",
  "interface": {
    "displayName": "My Plugin",
    "shortDescription": "Reusable skills and apps",
    "category": "Productivity",
    "brandColor": "#10A37F",
    "composerIcon": "./assets/icon.png"
  }
}
```

### Marketplace

A marketplace is a JSON catalog Codex uses to find and install plugins.

**Repo marketplace:** `$REPO_ROOT/.agents/plugins/marketplace.json`
**Personal marketplace:** `~/.agents/plugins/marketplace.json`

```json
{
  "name": "local-example-plugins",
  "interface": {
    "displayName": "Local Example Plugins"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": {
        "source": "local",
        "path": "./plugins/my-plugin"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

**Policy options:**
- `installation`: `"AVAILABLE"` / `"INSTALLED_BY_DEFAULT"` / `"NOT_AVAILABLE"`
- `authentication`: `"ON_INSTALL"` / `"ON_FIRST_USE"`

### Install a Plugin in a Repo

```bash
# Copy the plugin into the repo
cp -R /path/to/my-plugin ./plugins/my-plugin

# Add it to marketplace.json
# Then restart Codex
```

### Where Codex installs plugins

```
~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/
```

For local plugins, `$VERSION = "local"`

### Cautions

- Use kebab-case for `name`, because Codex uses it as an identifier
- `source.path` must start with `./` and be relative to the marketplace root
- Publishing to the Official Plugin Directory is still "coming soon"

### In short

Build Plugins suits teams that want to standardize workflows, share skills across repositories, or bundle MCP configs with app integrations in one place.

---

## 12. Sites — build and deploy websites

Reference: [Sites](https://developers.openai.com/codex/sites)

### What this topic is

Sites is a plugin that lets Codex build, save, deploy, and manage websites, web apps, and games hosted by OpenAI, directly from Codex, without setting up a deployment pipeline yourself.

### Access limits

Sites is in preview and:
- **ChatGPT Business:** available right away (default)
- **ChatGPT Enterprise:** the admin must enable it in RBAC settings first

### How to get started

1. Open the Sites plugin from the Plugin Directory if you don't have it
2. Start a new thread and type a task, e.g.:

```
@Sites Build a project request dashboard for my operations team.
Let team members submit requests, see who owns each one,
update the status, and filter the list.
```

3. Review the build → tell Codex to save a version or deploy

### Two-Stage Publishing

Sites splits publishing into 2 stages:

1. **Save a version** — build and tie it to that Git commit, used for review
2. **Deploy a version** — publish the chosen version to a production URL

**Every deployment URL is production**, so review carefully before deploying.

### Supported site formats

| Need | Ask Sites to create |
|---|---|
| A landing page or content site | A site with no persistent state |
| Store data, user progress | D1 (relational database) |
| Images, files, video uploads | R2 (object storage) |
| Files + searchable metadata | D1 + R2 combined |
| A site requiring login with a workspace account | Workspace-authenticated user identity |

### Access Control

| Mode | Who can access |
|---|---|
| `admins_only` | The owner + workspace admins |
| `workspace_all` | Everyone in the workspace |
| `custom` | Specific selected users/groups |

Example:
```
@Sites Change this deployed site's access to everyone in my workspace.
```

### The .openai/hosting.json file

Codex keeps the project's linkage at `.openai/hosting.json`:

```json
{
  "project_id": "<project-id>",
  "d1": "DB",
  "r2": null
}
```

### Runtime Secrets

Add environment variables / secrets through the **Sites panel** in the app sidebar (don't store them in git).

### Pre-deploy checklist

- Check source changes in the Review Pane
- Confirm the build succeeded
- Set access control correctly
- Verify you didn't commit secrets in source files

### In short

Sites makes deploying a web project much faster without setting up CI/CD yourself, good for internal tools, dashboards, and prototypes that need a URL right away.

---

## 13. Skills — agent skills

Reference: [Agent Skills](https://developers.openai.com/codex/skills)

### What this topic is

Skills are "abilities" that teach Codex how to do specific work, e.g. how to run that project's test suite, how to create a PR per the team's convention, or how to use a specific toolchain.

Skills are the **format for writing a workflow**, while Plugins are the **unit for distributing** those skills.

### Progressive Disclosure

Codex manages context via progressive disclosure:
- **At the start:** Codex knows only the name, description, and path of available skills
- **When chosen:** Codex loads that skill's full `SKILL.md`

Initial budget: ~2% of the context window (or 8,000 chars when the size is unknown) for listing skills.

### Skill structure

```
my-skill/
├── SKILL.md           # Required: instructions + metadata
├── scripts/           # Optional: executable code
├── references/        # Optional: documentation
├── assets/            # Optional: templates, resources
└── agents/
    └── openai.yaml    # Optional: UI metadata + policy
```

### SKILL.md

```markdown
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---

Skill instructions for Codex to follow.
```

### How Codex invokes a skill

1. **Explicit** — type the skill name directly: `$skill-name` or `/skills` to choose
2. **Implicit** — Codex picks the skill itself from the description matching the task

### Where skills are stored

| Scope | Location | Good for |
|---|---|---|
| `REPO` (CWD) | `$CWD/.agents/skills` | Skills specific to the working directory |
| `REPO` (root) | `$REPO_ROOT/.agents/skills` | Skills for everyone in the repo |
| `USER` | `$HOME/.agents/skills` | Personal skills across all repos |
| `ADMIN` | `/etc/codex/skills` | Skills from the admin for all users on the machine |
| `SYSTEM` | Built into Codex | Standard skills from OpenAI |

### Create a skill

**The fastest way:**
```
$skill-creator
```

**The manual way:**
```bash
mkdir -p ~/.agents/skills/my-skill
cat > ~/.agents/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Use for...explain the clear trigger
---

The steps Codex must do...
EOF
```

### Install curated skills

```bash
$skill-installer linear    # install the Linear skill
```

An installed skill shows in Codex automatically; if it doesn't appear, restart Codex.

### Disable a skill without deleting

```toml
# ~/.codex/config.toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

### Optional Metadata (agents/openai.yaml)

```yaml
interface:
  display_name: "Optional user-facing name"
  short_description: "Optional description"
  icon_small: "./assets/small-logo.svg"
  brand_color: "#3B82F6"
  default_prompt: "Optional surrounding prompt"

policy:
  allow_implicit_invocation: false  # turn off implicit matching

dependencies:
  tools:
    - type: "mcp"
      value: "openaiDeveloperDocs"
      description: "OpenAI Docs MCP server"
      transport: "streamable_http"
      url: "https://developers.openai.com/mcp"
```

`allow_implicit_invocation: false` means Codex won't invoke this skill automatically; you must type `$skill-name`.

### Best Practices

- Have a skill do one thing well; don't try to do many things in one skill
- Write a clear description of "when to use it" and "when not to use it"
- Use instructions instead of scripts unless you want deterministic behavior
- Write imperative steps with clear inputs/outputs

### In short

Skills are the best way to teach Codex to work per a project's or team's conventions. Start with `$skill-creator` to scaffold one.

---

## 14. Subagents

Reference: [Subagents](https://developers.openai.com/codex/subagents)

### What this topic is

Subagents are sub-agents Codex can spawn to work in parallel, solving problems needing multi-agent coordination or work that splits into parts.

### Key details

Subagent configuration covers setting up custom agents, defining the model, permissions, and the subagent's workflow on the config page, which is large; we recommend reading further at [Official Docs — Subagents](https://developers.openai.com/codex/subagents).

Introductory information about the Subagents concept is in [01-overview-concepts.md](./01-overview-concepts.md) under Concepts.

---

## Topics not fully compiled

| Topic | Reason | Link |
|---|---|---|
| Config Reference (full) | A large page, a reference table; best viewed from the Official Docs directly | [Config Reference](https://developers.openai.com/codex/config-reference) |
| Environment Variables (full) | Info that may change often; best checked from the Official Docs | [Environment Variables](https://developers.openai.com/codex/environment-variables) |
| Sample Config (full) | A ready-made template; best opened from the Official Docs directly | [Sample Config](https://developers.openai.com/codex/config-sample) |
| Permissions (full) | A large page (61KB) covering detailed filesystem/network rules | [Permissions](https://developers.openai.com/codex/permissions) |
| Advanced Config (full) | A large page (53KB) with more profiles, shell-policy details | [Advanced Config](https://developers.openai.com/codex/config-advanced) |
| Subagents config (full) | A large page covering custom agent definitions | [Subagents](https://developers.openai.com/codex/subagents) |
