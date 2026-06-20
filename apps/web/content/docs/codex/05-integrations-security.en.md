---
title: "Integrations & Codex Security"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "- 1. Connecting GitHub (Code Review)"
readTime: "14 min"
readers: "0"
locked: false
order: 5
---
# Codex Guide — Part 5: Integrations & Codex Security

> This file covers: GitHub Integration, Slack Integration, Linear Integration, Codex Security Overview, Codex Security Plugin, Codex Security Cloud Setup, Improving the Threat Model, FAQ

---

## Contents

- [1. Connecting GitHub (Code Review)](#1-connecting-github-code-review)
- [2. Using Codex in Slack](#2-using-codex-in-slack)
- [3. Using Codex in Linear](#3-using-codex-in-linear)
- [4. Codex Security — overview](#4-codex-security--overview)
- [5. Codex Security Plugin](#5-codex-security-plugin)
- [6. Codex Security Cloud — setup](#6-codex-security-cloud--setup)
- [7. Improving the Threat Model](#7-improving-the-threat-model)
- [8. Codex Security FAQ](#8-codex-security-faq)

---

## 1. Connecting GitHub (Code Review)

Reference: [Official Docs](https://developers.openai.com/codex/integrations/github)

### What this topic is

The **Codex Code Review in GitHub** feature lets Codex act as a reviewer on a GitHub Pull Request automatically. Codex analyzes the PR's diff according to the guidance you set in `AGENTS.md`, then posts a GitHub code review focused on important issues.

### Prerequisites

Before getting started, you need:

- [Codex cloud](https://developers.openai.com/codex/cloud) set up for the repository you want to review
- Access to the [Codex code review settings](https://chatgpt.com/codex/settings/code-review)
- An `AGENTS.md` file if you want Codex to follow the repository's specific review guidelines

### How to set up Codex Code Review

1. Set up Codex cloud for the repository you want
2. Go to [Codex settings](https://chatgpt.com/codex/settings/code-review)
3. Turn on the **Code review** switch for that repository

### How to ask Codex to review

On a Pull Request page on GitHub, comment:

```
@codex review
```

Codex shows a 👀 icon to say it's working, then posts a review on the PR like a teammate would. Codex flags only **P0 and P1** issues, to keep review comments focused on important problems.

### Enabling Automatic Reviews

If you want Codex to review every PR automatically, turn on **Automatic reviews** in [Codex settings](https://chatgpt.com/codex/settings/code-review). Codex reviews every time a new PR is opened, without typing `@codex review`.

### Defining what Codex reviews

Codex looks for the `AGENTS.md` file in the repository and follows the **Review guidelines** you set.

How to add review guidelines:

```markdown
## Review guidelines

- Don't log personal data (PII)
- Verify auth middleware covers every route
```

Codex uses the `AGENTS.md` closest to the changed file. You can put more specific instructions deeper in the directory tree for packages needing special checking.

For a one-off review, add a focus in the comment:

```
@codex review for security regressions
```

### Fixing the issues found

After Codex posts a review, you can ask it to fix the issues right away in the same PR:

```
@codex fix the P1 issue
```

Codex creates a cloud task using the PR's context and can push fixes back to the branch if it has permission.

### Having Codex do other work

If you type `@codex` in a comment with text other than `review`, Codex starts a cloud task using the PR as context, e.g.:

```
@codex fix the CI failures
```

### Basic troubleshooting

If Codex doesn't respond or doesn't post a review, check:

- Whether you've enabled **Code review** for that repository in Codex settings
- Whether the PR is in a repository that has Codex cloud set up
- Use the correct `@codex review` in the PR comment
- For automatic reviews, check that **Automatic reviews** is enabled

### Summary

Codex Code Review in GitHub helps teams get high-quality reviews automatically. Use `@codex review` to trigger it manually, or turn on automatic reviews so Codex reviews every PR. Customize with `AGENTS.md` so Codex understands the project's context and requirements.

---

## 2. Using Codex in Slack

Reference: [Official Docs](https://developers.openai.com/codex/integrations/slack)

### What this topic is

**Codex in Slack** lets teams give Codex work directly from Slack channels and threads. Just mention `@Codex` with a prompt and Codex creates a cloud task and replies with the result.

### Prerequisites

You need:
- A Plus, Pro, Business, Enterprise, or Edu plan
- A connected GitHub account
- At least 1 environment in Codex cloud

### How to set up the Slack App

1. Set up [Codex cloud tasks](https://developers.openai.com/codex/cloud) first
2. Go to [Codex settings](https://chatgpt.com/codex/settings/connectors) and install the Slack app for your workspace (your Slack workspace admin may need to approve first)
3. Add `@Codex` to the channel you want

### How to start work

1. In a channel or thread, mention `@Codex` with the prompt you want — Codex can read context from earlier messages in the thread, so you don't need to retype the context
2. (Optional) specify an environment or repository, e.g.: `@Codex fix the above in openai/codex`
3. Wait for Codex to show the 👀 icon, then reply with a link to the task; when done it posts the result in the thread

### How Codex picks the Environment and Repo

- Codex looks at the environments you can access and picks the one best suited to the request. If unclear, it uses the most recently used environment
- The task runs on the default branch of the first repo in that environment's repo map
- If there's no suitable environment or repo, Codex replies in Slack with how to fix it

### Data control (Enterprise)

By default, Codex replies in the thread with a result that may include data from the environment. Enterprise admins can turn this reply off in [ChatGPT workspace settings](https://chatgpt.com/admin/settings) by turning off **Allow Codex Slack app to post answers on task completion** — when off, Codex replies only with the task link.

### On privacy and security

When you mention `@Codex`, Codex receives the message and thread history to create the task. Data handling follows OpenAI's Privacy Policy and Terms of Use.

### Tips and troubleshooting

- **Not connected**: if Codex can't verify the Slack or GitHub connection, it replies with a link to reconnect
- **Wrong environment chosen**: reply in the thread specifying the environment you want, e.g. `Please run this in openai/openai (applied)`, then mention `@Codex` again
- **Long or complex thread**: summarize the important context in the latest message so Codex doesn't miss info buried above

### Summary

Codex in Slack lets teams give coding work directly from a conversation without opening a new ChatGPT page, great for teams that work mainly on Slack.

---

## 3. Using Codex in Linear

Reference: [Official Docs](https://developers.openai.com/codex/integrations/linear)

### What this topic is

**Codex in Linear** lets you assign work to Codex directly from Linear issues. Just assign an issue to Codex or mention `@Codex` in a comment, and Codex creates a cloud task and replies with progress and results.

Codex in Linear is available on Pro and above — for Enterprise, the ChatGPT workspace admin must enable Codex cloud tasks in [workspace settings](https://chatgpt.com/admin/settings) and enable **Codex for Linear** in [connector settings](https://chatgpt.com/admin/ca).

### How to set up the Linear Integration

1. Set up [Codex cloud tasks](https://developers.openai.com/codex/cloud) by connecting GitHub and creating an environment for the repository you want
2. Go to [Codex settings](https://chatgpt.com/codex/settings/connectors) and install **Codex for Linear**
3. Connect your Linear account by mentioning `@Codex` in the comment thread of a Linear issue

### How to assign work to Codex

There are 2 ways:

#### Way 1: Assign an issue to Codex

After installing the integration, assign an issue to Codex just like assigning to another teammate. Codex starts working and posts updates back in the issue.

#### Way 2: Mention @Codex in comments

Type `@Codex` in the comment thread to assign work or ask a question. After Codex replies, you can follow up in the same thread to continue in the same session.

To pin a specific repository, specify it in the comment, e.g.: `@Codex fix this in openai/codex`

### Tracking progress

- Open **Activity** in the issue to see progress updates
- Open the task link to follow the details

When the task is done, Codex posts a summary and a link to the completed task so you can create a PR.

### How Codex picks the Environment and Repo

- Linear suggests a repository based on the issue's context; Codex picks the suitable environment. If unclear, it uses the most recent environment
- The task runs on the default branch of the first repo in the environment's repo map
- If there's no suitable environment or repo, Codex replies in Linear with how to fix it

### Auto-assigning issues to Codex

Use triage rules in Linear to assign issues to Codex automatically:

1. Go to **Settings** in Linear
2. Under **Your teams**, choose a team
3. Open **Triage** in the workflow settings
4. In **Triage rules**, create a rule and choose **Delegate** → **Codex**

Linear auto-assigns new issues entering triage to Codex — the task runs in the issue creator's account.

### Connecting Linear for Local Tasks (MCP)

If you use the Codex app, CLI, or IDE Extension and want Codex to access Linear issues locally, set up the Linear MCP server.

**Add it via CLI (recommended)**:

```bash
codex mcp add linear --url https://mcp.linear.app/mcp
```

**Set it up manually** — open `~/.codex/config.toml` and add:

```toml
[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"
```

Then run:

```bash
codex mcp login linear
```

### On privacy and security

When you mention `@Codex` or assign an issue to Codex, Codex receives the issue content to create the task. Data handling follows OpenAI's Privacy Policy.

### Tips and troubleshooting

- **Not connected**: Codex replies in the issue with a link to connect your account
- **Wrong environment chosen**: reply in the thread specifying the environment, e.g. `@Codex please run this in openai/codex`
- **Wrong part of the code**: add context in the issue or give specific guidance in a comment

### Summary

Codex in Linear lets teams that use Linear for work management assign coding work directly to Codex, whether by assigning an issue or mentioning in a comment, and you can also automate it with triage rules.

---

## 4. Codex Security — overview

Reference: [Official Docs](https://developers.openai.com/codex/security)

### What this topic is

**Codex Security** is a set of AI-powered code security analysis tools that help developer and security teams discover and fix vulnerabilities effectively.

There are 2 main forms:

1. **Codex Security Plugin** — works in your Codex thread, used for repositories or diffs you can access
2. **Codex Security Cloud** — scans GitHub repositories connected through Codex Web (currently in research preview)

### How Codex Security Cloud works

Codex Security Cloud scans connected repositories commit by commit by:

1. **Building a scan context** from the repository — understanding the structure and architecture
2. **Checking suspected vulnerabilities** against that context
3. **Confirming high-signal issues** in an isolated environment before displaying results

The result is a workflow that emphasizes:
- Repository-specific context rather than generic signatures
- Confirmation evidence to reduce false positives
- Suggested fixes you can review in GitHub

### Access to Codex Security Cloud

Codex Security is available for ChatGPT Enterprise, Edu, Business, and Pro users, working with GitHub repositories connected through Codex Web.

### The difference between Plugin and Cloud

| Aspect | Plugin | Cloud |
|--------|--------|-------|
| Where it works | Codex thread | Codex Web |
| Target | A repo/diff you can access | Connected GitHub repos |
| Triggering | You trigger it | Automatically commit by commit |
| Status | Available | Research Preview |

### Summary

Codex Security helps code-security teams by using AI for semantic analysis instead of old pattern matching, reducing false positives and proposing patches to review before merging.

---

## 5. Codex Security Plugin

Reference: [Official Docs](https://developers.openai.com/codex/security/plugin)

### What this topic is

The **Codex Security Plugin** adds security-review workflows to your Codex thread, used to scan a repository, check a diff before merge, confirm findings, and prepare reviewed fixes.

### Installing the Plugin

**Install on the Codex App**:
Go to the Plugin Directory in the Codex App and search "Codex Security".

**Install on the Codex CLI**:
```bash
codex plugins install codex-security
```

After installing, start a new thread in the repository you want to scan.

### Choosing the right Security Workflow

Choose the narrowest workflow that answers your question:

| Goal | Skill | Scope and result |
|----------|-------|-----------------|
| Review a repository or a specific path | `$codex-security:security-scan` | Does threat modeling, finding discovery, validation, attack-path analysis, then creates a Markdown and HTML report |
| A high-recall audit | `$codex-security:deep-security-scan` | Does repository-wide discovery again with delegated workers before validation and reporting — use on the whole repository only |
| Review a change before merge | `$codex-security:security-diff-scan` | Checks a PR, commit, branch diff, or working-tree patch, then creates a Markdown report |
| Fix 1 finding | `$codex-security:fix-finding` | Confirms or reproduces 1 finding, then makes a minimal fix |

### Example Prompts

**Scan the whole repository**:

```
Use $codex-security:security-scan to scan this repository for security
vulnerabilities. Keep the scan grounded in code evidence, validate plausible
findings where feasible, and return the final report paths. Do not modify code.
```

**Check the current changes**:

```
Use $codex-security:security-diff-scan to review the current branch diff for
security regressions. Keep the review scoped to changed code and directly
supporting files. Do not modify code.
```

### Repository scan steps

Repository scans use a staged workflow:

1. **Threat modeling** — identify entry points, trust boundaries, sensitive actions, and risky components
2. **Finding discovery** — find source-to-sink paths or broken controls within the defined scope
3. **Validation** — test or confirm plausible findings, recording evidence or evidence gaps
4. **Attack-path analysis** — trace exploitable paths and score severity for validated findings
5. **Reporting** — write findings, locations, validation evidence, and remediation guidance to files

The scan creates a `report.md` and `report.html` you can read in its own scan directory.

### Fixing Findings

When a finding is actionable, ask for a clearly scoped fix:

```
Use $codex-security:fix-finding to fix finding [finding ID or report reference].
Add focused regression coverage, verify legitimate behavior still works,
and show that the original issue no longer reproduces.
Do not broaden the change beyond this finding.
```

### Safety cautions

- Scan only repositories you own or your organization has approved you to check
- A finding is an input for review, not a command to merge code or test other targets
- The first scan should always be read-only until you ask Codex to prepare a fix
- Always review build, run, or reproduce commands before approving, especially in an unfamiliar repository
- Review every patch and validation result before merging

### Summary

The Codex Security Plugin is a security-review toolkit that works inside a Codex thread. Use the workflow suited to the job for maximum efficiency and easier review.

---

## 6. Codex Security Cloud — setup

Reference: [Official Docs](https://developers.openai.com/codex/security/setup)

### What this topic is

This page explains the steps from initial setup to reviewing findings and creating remediation pull requests with Codex Security Cloud.

### Step 1: Verify access and environment

You must set up Codex Cloud first — see [Codex Cloud](https://developers.openai.com/codex/cloud)

Codex Security scans GitHub repositories connected through Codex Cloud. Then:

- Verify that your workspace has access to Codex Security
- Verify that the repository you want to scan is in Codex Cloud

Go to [Codex environments](https://chatgpt.com/codex/settings/environments) and check that the repository already has an environment; if not, create one first.

### Step 2: Create a new Security Scan

Go to [Create a security scan](https://chatgpt.com/codex/security/scans/new) and choose a repository.

Codex Security scans the repository from the newest commits backward, building and refreshing the scan context as new commits arrive.

Configuration steps:

1. Choose the GitHub organization
2. Choose the repository
3. Choose the branch to scan
4. Choose the environment
5. Choose the **history window** — a longer window gives more context but takes longer to backfill
6. Click **Create**

### Step 3: Wait for the initial scan

When you create a scan, Codex Security runs a commit-level security pass across the chosen history window. The initial backfill may take several hours, especially for large repositories.

> **Important**: if findings don't appear immediately, that's normal. Wait for the initial scan to finish before troubleshooting.

### Step 4: Review scans and the threat model

Once the initial scan is done, open the scan and review the generated threat model.

After findings appear for the first time, update the threat model to match the real architecture, trust boundaries, and business context, to help Codex Security rank issues correctly.

See more at [Improving the threat model](#7-improving-the-threat-model)

### Step 5: Review findings and create patches

After the initial backfill is done, review findings from the **Findings view** in [Codex Security](https://chatgpt.com/codex/security/findings)

There are 2 views:

- **Recommended Findings** — the top 10 most important issues in the repository (continuously updated)
- **All Findings** — the full table you can filter and sort

Click a finding to see details, which include:
- A short description of the problem
- Metadata such as commit details and file paths
- Reasoning about impact
- Relevant code excerpts
- Call-path or data-flow context (if available)
- Validation steps and validation output

You can review the finding and create a PR directly from the finding detail page.

### Summary

Codex Security Cloud setup is a 5-step process: verify access → create a scan → wait for the initial scan → adjust the threat model → review findings and create a PR to fix.

---

## 7. Improving the Threat Model

Reference: [Official Docs](https://developers.openai.com/codex/security/threat-model)

### What this topic is

The **Threat Model** is a security summary of the repository that Codex Security uses as the scan context for future scans, prioritization, and review.

Codex Security creates the first draft from the code automatically, but if findings don't seem to match reality, that's a sign the threat model needs adjusting.

### What a good threat model should include

- **Entry points and untrusted inputs** — where data comes in
- **Trust boundaries and auth assumptions** — how much each part can be trusted
- **Sensitive data paths or privileged actions** — where important data flows
- **Areas the team wants checked first** — high-risk spots

**Example of a good threat model**:

> Public API for account changes. Accepts JSON requests and file uploads. Uses an internal auth service for identity checks and writes billing changes through an internal service. Focus review on auth checks, upload parsing, and service-to-service trust boundaries.

### How to improve the Threat Model

Improve it when:
- Findings don't cover the areas you care about
- Findings appear in unexpected places

An updated threat model changes the scan context for future scans, not past ones.

**A popular user technique**: copy the current threat model → take it to chat in Codex to improve it → paste the better version back.

### How to edit the Threat Model

Go to [Codex Security scans](https://chatgpt.com/codex/security/scans) → open the repository → click **Edit**

### Summary

The threat model is the heart of Codex Security. Updating it to match the real architecture and business context helps Codex Security show on-point findings and rank them correctly.

---

## 8. Codex Security FAQ

Reference: [Official Docs](https://developers.openai.com/codex/security/faq)

### What is Codex Security

Codex Security is an LLM-driven security analysis toolkit that examines source code and returns structured, ranked vulnerability findings with proposed patches, helping developer and security teams discover and fix security issues at scale.

### Why does it matter

Software is the foundation of modern industry and society; vulnerabilities create systemic risk. Codex Security supports a defender-first workflow by continuously finding issues, confirming when possible, and proposing fixes to help teams improve security without slowing development.

### What problem does Codex Security solve

It shortens the path from a suspected issue to a confirmed, reproducible finding with evidence and a proposed patch, reducing triage load and false positives compared with traditional scanners alone.

### How does Codex Security work

It runs analysis in an ephemeral, isolated container and clones the repository temporarily, then does code-level analysis and returns structured findings with: description, file location, criticality, root cause, and suggested remediation.

For findings with verification steps, the system executes commands or tests in the same sandbox, records success/failure, exit codes, stdout, stderr, test results, and artifacts, then attaches them as evidence.

### Can it replace SAST

No. Codex Security complements SAST by adding semantic, LLM-based reasoning and automated validation; traditional SAST still provides broad deterministic coverage.

### What is the Analysis Pipeline

1. **Analysis** — build a threat model for the repository
2. **Commit scanning** — check merged commits and repository history
3. **Validation** — try to reproduce vulnerabilities in a sandbox to reduce false positives
4. **Patching** — integrate with Codex to propose patches for review before opening a PR

### Which programming languages are supported

Codex Security is language-agnostic; in practice performance depends on the model's ability to reason about the language and framework used.

### What's the result after a scan

You get ranked findings with criticality, validation status, and a proposed patch (if any). Findings may include crash output, reproduction evidence, call-path context, and related annotations.

### How is customer code isolated

Each analysis and validation job runs in an ephemeral Codex container with session-scoped tools. Artifacts are extracted for review, then the container is torn down after the job finishes.

### Can Codex Security auto-apply patches

No. A proposed patch is only a recommended remediation. You must review it first, then push it as a PR to GitHub from the findings UI — Codex Security doesn't apply changes for you automatically.

### Do I need to build the project before scanning

Not necessarily. Codex Security creates findings from the repository and commit context without compiling. During auto-validation it may try to build in the container if that helps reproduce the issue.

### How does Codex Security reduce false positives

It uses 2 steps:
1. The model ranks likely issues
2. Auto-validation tries to reproduce each issue in a clean container

Findings that reproduce successfully are marked "validated," helping reduce false positives before human review.

### How long does the initial scan take

The initial scan depends on the repository size, build time, and the number of findings to validate. For some repositories it may take several hours; for large repositories it may take several days. Subsequent scans are faster because they focus on new commits and incremental changes.

### How is the threat model created

Codex Security instructs the model to summarize the repository architecture and security entry points, classifies the repository type, runs specialized extractors, then combines the results into a project overview or threat model artifact used throughout the scan.

### Can it replace manual security review

No. Codex Security speeds up review and helps rank findings, but doesn't replace code-level validation, exploitability checks, or human threat assessment.

### Can I edit the threat model

Yes. Codex Security creates an initial threat model, then you can update it as architecture, risks, and business context change. See details at [Improving the threat model](#7-improving-the-threat-model)

### What is auto-validation

Auto-validation is the step that tries to reproduce a suspected issue in an isolated container, recording success/failure with logs, commands, and artifacts as evidence. If validation fails, the finding stays in an unvalidated state with logs recording what was attempted.

---

## Topics not fully compiled

| Topic | Reason | Link |
|--------|--------|-------|
| Codex Security — Use Cases (Deep scan, Scan code changes, Remediate backlog) | The content is in the Use Cases section, not directly in Integrations/Security | [Use Cases](https://developers.openai.com/codex/use-cases) |

---

*Based on OpenAI Codex's Official Documentation as of the date of writing — always check the source links for the latest information*
