---
title: "Pricing, Limits, and Cyber Safety"
tool: "Codex"
icon: "icon-docs"
level: "pro"
summary: "Covers all of Codex's plans, usage limits, credit rates, sandboxing modes, and the Cyber Safety Program for developers and security teams"
readTime: "7 min"
readers: "0"
locked: false
order: 11
---

# Codex Guide — Part 11: Pricing, Limits, and Cyber Safety

> Primary reference: [Codex Pricing](https://developers.openai.com/codex/pricing) | [Codex Sandboxing](https://developers.openai.com/codex/concepts/sandboxing) | [Cyber Safety](https://developers.openai.com/codex/concepts/cyber-safety)

---

## Plans and Pricing

### Plans for individuals

| Plan | Price/month | Good for |
|------|-----------|---------|
| **Free** | $0 | Trying it out, quick coding tasks |
| **Go** | $8 | Light coding work |
| **Plus** | $20 | Developers who use it for real |
| **Pro** | From $100 | Power users, higher rate limits |

### Plans for organizations

| Plan | Price | Good for |
|------|------|---------|
| **Business** | Pay as you go | Teams, with SSO (one login that works for all services)/MFA (multi-step authentication) |
| **Enterprise & Edu** | Contact Sales | Large organizations, enterprise security |

---

## Features by Plan

### Plus ($20/month) — recommended for general developers

- Web interface, CLI (command-line interface), IDE Extension (code-editor add-on), iOS app
- Models: GPT-5.5, GPT-5.4, GPT-5.3-Codex
- Cloud integrations: Code review, Slack
- Extensible with extra credits (the usage unit)

### Pro (from $100/month) — for Power Users

Everything in Plus, plus:
- Rate limits 5x or 20x higher than Plus (your choice)
- GPT-5.3-Codex-Spark (Research Preview, low latency — response time)

### Business — Pay as you go

Everything in Plus, plus:
- Standard or usage-based seats
- Larger VMs (Virtual Machine — a simulated computer) for cloud tasks
- SAML SSO (the SSO standard for organizations), MFA
- Data not used for training by default

### Enterprise & Edu

Everything in Business, plus:
- Priority processing
- Enterprise security: SCIM (automatic user-management system), EKM (managing your own encryption keys), RBAC (role-based access control)
- Audit logs, usage monitoring
- Data residency controls (controlling where data is stored)

---

## Usage Limits (5-hour Rolling Window)

Rate limits are calculated over the **past 5 hours**, not a daily reset.

### Plus and Business

| Model | Messages per 5 hours |
|-------|----------------------|
| GPT-5.5 | 15–80 |
| GPT-5.4 | 20–100 |
| GPT-5.4-mini | 60–350 |

### Pro 5x

| Model | Messages per 5 hours |
|-------|----------------------|
| GPT-5.5 | 80–400 |
| GPT-5.4 | 100–500 |
| GPT-5.4-mini | 300–1,750 |

### Pro 20x

| Model | Messages per 5 hours |
|-------|----------------------|
| GPT-5.5 | 300–1,600 |
| GPT-5.4 | 400–2,000 |
| GPT-5.4-mini | 1,200–7,000 |

> **Note:** Limits are a range (e.g. 15–80) because they adjust to the system load at the time.

---

## Credit Rates (buy more)

If you exceed the limit, you can buy more credits, priced per 1 million tokens (text units — about 1 word):

| Model | Input | Cached Input (already-processed data) | Output |
|-------|-------|--------------|--------|
| GPT-5.5 | 125 credits | 12.50 credits | 750 credits |
| GPT-5.4 | 62.50 credits | 6.25 credits | 375 credits |
| GPT-5.4-mini | 18.75 credits | 1.875 credits | 113 credits |
| GPT-5.3-Codex | 43.75 credits | 4.375 credits | 350 credits |

### Average cost per message

GPT-5.5 uses about **5–45 credits per message**, depending on complexity.

**Fast Mode** uses more credits because it works faster with more resources (computing resources).

### API Key Pricing (used directly via the API)

- Priced at standard API rates
- Doesn't include cloud features (Code Review, Slack, etc.)
- Access to new models later than a subscription

---

## Sandboxing — the Execution Environment

Sandboxing (working in a restricted space) is an isolation system that lets Codex work in a safe bounded environment.

### How it works

The sandbox covers **every command Codex runs**, not just file operations:
- `git` commands
- Package managers (npm, pip, etc.)
- Test runners
- Build tools

**OS-level enforcement:**
- macOS: uses the built-in Seatbelt framework
- Windows: Windows Sandbox or WSL2 (Linux on Windows)
- Linux/WSL2: uses `bubblewrap` (must be installed separately)

### Sandbox Modes

| Mode | Reading files | Editing files | Running commands | Good for |
|------|-----------|------------|----------------|---------|
| **read-only** | ✓ | Needs approval | Needs approval | Review, Audit |
| **workspace-write** | ✓ | ✓ (in the workspace) | ✓ (routine) | General work (Default) |
| **danger-full-access** | ✓ | ✓ (anywhere) | ✓ (anything) | Advanced, careful! |

### Approval Policies

| Policy | Behavior |
|--------|---------|
| **untrusted** | Asks before every non-trusted command |
| **on-request** | Works automatically, asks when it needs to cross the sandbox boundary |
| **never** | Doesn't ask at all (works fully within the sandbox) |

### Configure in config.toml

```toml
[settings]
sandbox_mode = "workspace-write"       # or read-only, danger-full-access
approval_policy = "on-request"         # or untrusted, never

[sandbox_workspace_write]
writable_roots = [
  "~/projects/my-app",                 # allow writing in this folder
]
```

### Auto-review Mode

Instead of asking the user for approval directly, Codex can send the approval request to a **Reviewer Agent** (an AI agent that does the checking) to decide, letting it work continuously without interrupting the user.

### Command-level Rules

Adjust rules for specific commands without widening the whole sandbox:

```toml
[[rules]]
name = "allow npm scripts"
command_prefix = "npm run"
action = "allow"

[[rules]]
name = "block network access"
command_prefix = "curl"
action = "deny"

[[rules]]
name = "prompt for docker"
command_prefix = "docker"
action = "prompt"
```

---

## Installing Sandboxing on Linux/WSL2

Linux and WSL2 must install `bubblewrap` separately:

```bash
# Ubuntu/Debian
sudo apt install bubblewrap

# Fedora
sudo dnf install bubblewrap
```

Ubuntu 25.04+ has AppArmor profile (a program-permission control profile) support automatically.

Older versions may need to load the profile manually.

---

## Cyber Safety Program

GPT-5.3-Codex is classified as having **"High cybersecurity capability"** per the OpenAI Preparedness Framework, so it has special safeguards.

### Why there's a Cyber Safety program

Codex has high cybersecurity capability, which is useful for:
- Penetration Testing (simulating an attack to find vulnerabilities)
- Vulnerability Research
- Malware Analysis

But the same techniques could be used for bad purposes.

### Protective mechanisms

**1. Safety Training**
The model is trained to refuse requests that look malicious.

**2. Automated Monitoring**
A classifier (a categorization system) detects suspicious cyber activity. High-risk traffic is rerouted to GPT-5.2 (less capable) but affects very little traffic.

**3. Trusted Access Program**
For developers doing real security work, you can request additional permissions.

---

## Trusted Cyber Access — for Security Professionals

### How to request access

**Individuals:**
Verify your identity at [chatgpt.com/cyber](https://chatgpt.com/cyber)

**Organizations:**
Contact an OpenAI representative for team-wide access

**Advanced Researchers:**
There's an invite-only program for security researchers who need a more capable model

### Requirements

Those granted access must still follow:
- OpenAI Usage Policies
- All Terms of Use

### False Positives

Sometimes legitimate security work may be flagged incorrectly:

- Codex notifies you in-product when it's rerouted
- Report it via the `/feedback` command in the CLI
- OpenAI is moving from account-level to request-level safety checks

---

## Summary: choose the plan to suit your usage

### For an Individual Developer

| If you... | Recommended plan |
|----------|-----------|
| Want to try it first | Free |
| Use it occasionally | Go ($8) |
| Use it for real every day | Plus ($20) |
| Use it very heavily, need a high rate limit | Pro ($100+) |

### For a team/organization

| If the team... | Recommended plan |
|----------|-----------|
| Needs SSO, MFA | Business |
| Needs audit logs, data residency | Enterprise |
| Is an educational institution | Edu (contact Sales) |

### Credit-saving tips

1. **Use GPT-5.4-mini** for exploration and simple tasks
2. **Enable Context Caching** (reduces cost when sending the same data again) — cached input is 10x cheaper
3. **Split threads** when work is unrelated, to reduce unnecessary context
4. **Use Fast Mode only when needed** since it uses more credits
5. **Subagents with mini** for read-heavy tasks that don't need high reasoning
