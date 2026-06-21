---
title: "Grok Build — Coding Agent"
tool: "Grok"
icon: "icon-docs"
level: "beginner"
summary: "Grok Build is a powerful, extensible coding agent designed specifically for coding work. It can be used in 3 ways:"
readTime: "3 min"
readers: "0"
locked: false
order: 3
---
# Grok Build — Coding Agent

> Reference: [Getting Started](https://docs.x.ai/build/overview) | [Skills, Plugins & Marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces) | [Modes and Commands](https://docs.x.ai/build/modes-and-commands) | [Headless & Scripting](https://docs.x.ai/build/cli/headless-scripting) | [Enterprise](https://docs.x.ai/build/enterprise)

---

## What is Grok Build?

**Grok Build** is a powerful, extensible coding agent designed specifically for coding work. It can be used in 3 ways:

- **Interactive TUI** — a full-screen terminal screen with mouse support, for sitting and chatting with the AI while coding
- **Headless / Script** — run a single command and get the result immediately, good for automation
- **Agent Client Protocol (ACP)** — connect to other apps, e.g. an IDE or bot

The model powering Grok Build is `grok-build-0.1`, which you can also use directly via the API.

---

## Install the Grok Build CLI

**macOS / Linux / WSL:**
```bash
curl -fsSL https://x.ai/cli/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://x.ai/cli/install.ps1 | iex
```

---

## Start an Interactive Session

```bash
cd your-project   # enter the project folder
grok              # open Grok Build
```

The first time, a browser opens to log in. If you're in an environment with no browser, use an API key:

```bash
export XAI_API_KEY="xai-..."
grok
```

**Recommended first prompts:**
```
Explain this repo.
@src/main.rs Walk me through this file.
```

---

## Run Headless (no screen needed)

Good for use in scripts, CI/CD, or automation:

```bash
grok -p "Explain this codebase"
grok -p "Explain the architecture" --output-format streaming-json
```

---

## Skills, Plugins, and Marketplaces

Reference: [Skills, Plugins and Marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces)

### What are Skills?
Skills are pre-saved sets of commands or prompts you can invoke quickly during a conversation, e.g. `/test`, `/deploy`, `/review`.

### What are Plugins?
Plugins extend Grok Build's abilities by connecting to external tools, e.g. a database, API, or various services.

### What are Marketplaces?
A marketplace is a store collecting Skills and Plugins from the community, installable and usable immediately.

---

## Modes and Commands

Reference: [Modes and Commands](https://docs.x.ai/build/modes-and-commands)

Grok Build has special commands usable within the TUI:

| Command | Effect |
|---|---|
| `/model <name>` | Change the model in use |
| `grok inspect` | View the project's config, skills, plugins, MCP servers |

---

## Configure a custom model

If you want to use a model other than the default, you can configure it in your config:

```toml
[model.my-model]
model = "model-id"
base_url = "https://api.example.com/v1"
name = "Display name"
env_key = "API_KEY"

[models]
default = "my-model"
```

Check the config with:
```bash
grok inspect
```

Choose the model in headless mode:
```bash
grok -p "Hello" -m my-model
```

---

## Use grok-build-0.1 directly via the API

The `grok-build-0.1` model is available via the API (Early Access). You can put it in your own agent loop, IDE integration, or coding tool:

**Python:**
```python
import os
from xai_sdk import Client
from xai_sdk.chat import user

client = Client(api_key=os.getenv("XAI_API_KEY"))

chat = client.chat.create(model="grok-build-0.1")
chat.append(user("Edit this function to also handle null input"))

print(chat.sample().content)
```

**cURL:**
```bash
curl https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-build-0.1",
    "input": "Edit this function to also handle null input"
  }'
```

---

## Enterprise Deployments

Reference: [Enterprise Deployments](https://docs.x.ai/build/enterprise)

For organizations that want to deploy Grok Build inside their own systems, contact xAI at [x.ai/grok/business/enquire](https://x.ai/grok/business/enquire) for white-glove support and enterprise-grade features.

---

## Summary — when to use what?

| Situation | How to use |
|---|---|
| General coding with the AI | Grok Build TUI (`grok`) |
| Running automated scripts | Headless mode (`grok -p "..."`) |
| Building your own app or IDE plugin | The API directly + `grok-build-0.1` |
| Use in a large organization | Enterprise Deployment |
