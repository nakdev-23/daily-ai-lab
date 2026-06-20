---
title: "Codex App"
tool: "Codex"
icon: "icon-docs"
level: "beginner"
summary: "Reference: App Overview"
readTime: "12 min"
readers: "0"
locked: false
order: 2
---
# Codex Guide — Part 2: Codex App
> Primary reference: [Codex App Overview](https://developers.openai.com/codex/app)

---

## Codex App overview
Reference: [App Overview](https://developers.openai.com/codex/app)

### What this topic is
The Codex App is a desktop application specifically for working with Codex. It has the most complete feature set of all the channels, suited to developers who want the best experience.

### What you can do with it
- Run several threads at once, in parallel
- Work with Git worktrees built in
- Use Computer Use on macOS (have Codex click/type in the real UI)
- Review diffs, commit, and push right from the App
- Set automations that run on a recurring schedule
- Open the in-app browser for web testing

### Supported platforms
- **macOS** (Apple Silicon + Intel) — the most complete features
- **Windows** — supported
- **Linux** — wait for an email notification (not yet available)

---

## Codex App features
Reference: [App Features](https://developers.openai.com/codex/app/features)

### Multitask Across Projects
The Codex App lets you run several threads at once and switch between projects quickly, without waiting for one job to finish before starting another.

### Worktree Support — run several branches at once
Built-in support for Git worktrees, letting Codex work in several branches at once without affecting the main work in progress (details in the [Worktrees section](#worktrees)).

### Image Generation — create images within coding work
Create or edit images in a thread while working with code and assets directly, good for frontend or UI development.

### Integrated Terminal — a terminal in each thread
Every thread has its own terminal, running the command line directly in that work's context. Use it to call tools, run tests, or check results immediately.

### Richer Outputs and Artifacts — full result display
The sidebar shows plans, sources, task summaries, and a preview of newly created files, so you can track progress clearly.

### Skills Support — use skills across projects
Supports reusable skills across the App, CLI, and IDE Extension. Save a workflow once, use it everywhere.

### Sync with the IDE Extension — use it together with the IDE
Connect auto context and active threads between the App and the IDE Extension, working seamlessly wherever you are.

---

## Settings — configuring the Codex App
Reference: [App Settings](https://developers.openai.com/codex/app/settings)

### What this topic is
The Settings page in the Codex App lets you adjust behavior, connect accounts, choose an editor, and manage Computer Use.

**Open Settings:** `Cmd` + `,` or click Settings in the sidebar

### Main settings categories

| Category | What it configures |
|---|---|
| Account | Sign in, connect GitHub |
| Model | Choose the default model for general threads |
| Sandbox | Sandbox Mode, Approval Policy |
| Memories | Turn the Memories feature on/off |
| Computer Use | Install the Computer Use plugin, manage allowed apps |
| Editor | Choose the default editor for opening files from the Review Pane |
| Worktrees | Set the maximum worktree limit |
| Storage | View and manage the disk space worktrees use |

---

## Review — reviewing and committing code from the App
Reference: [App Review](https://developers.openai.com/codex/app/review)

### What this topic is
The Review Pane is the window that lets you see all the diffs Codex made, add inline feedback, and decide what to keep, stage, or revert.

### Requirements
The Review Pane works only for **projects in a Git repository**. If the project isn't a Git repo yet, the App suggests creating one first.

### What the Review Pane shows
The Review Pane reflects the real Git repository state, so it shows:
- Changes Codex made
- Changes you made yourself
- Other uncommitted changes across the whole repo

**Selectable modes:**
- **Uncommitted changes** (default)
- **All branch changes** (diff against the base branch)
- **Last turn changes** (only the latest turn)

### Navigating the Review Pane

| Action | How |
|---|---|
| Open a file in the editor | Click the filename |
| Expand/collapse a diff | Click the background of the filename |
| Open a file at a specific line | `Cmd` + click that line |
| Add an inline comment | Hover the line → click `+` → write feedback |

### Inline Comments
The fastest way to give line-specific feedback:
1. Open the Review Pane
2. Hover the line you want to comment
3. Click `+`
4. Write the feedback and submit
5. Send a message back to Codex, e.g. "Address the inline comments and keep the scope minimal."

### Code Review with `/review`
If you use the `/review` command, Codex shows code review comments right in the Review Pane.

### Pull Request Reviews
If Codex can access GitHub, it can fetch PR feedback from reviewers in the sidebar and inline in the Review Pane, and address comments right from the same thread.

**Requires:** GitHub CLI (`gh`) installed and logged in

### Staging and reverting files

| Level | Can do |
|---|---|
| Entire Diff | Stage all / Revert all |
| Per File | Stage, Unstage, or Revert per file |
| Per Hunk | Stage, Unstage, or Revert per hunk |

---

## Automations — defining scheduled automated tasks
Reference: [App Automations](https://developers.openai.com/codex/app/automations)

### What this topic is
Automations let Codex do recurring work in the background, automatically on a schedule, e.g. running every morning at 8, checking PRs every hour, etc.

### Types of Automation

| Type | What it does |
|---|---|
| **Standalone Automation** | Runs a new task each time on schedule, reporting results in the Triage Inbox |
| **Thread Automation** | Runs a "heartbeat" in the existing thread to look after a thread still in progress |

### How to create an Automation
1. Go to the Automations Pane in the sidebar
2. Click Create Automation
3. Write a prompt saying what you want done each time
4. Choose a schedule (Daily, Weekly, Custom Cron, Minute-based, etc.)
5. Choose whether to run in the Local Project or a Worktree (for a Git repo)

Or have Codex create the Automation by telling it in a regular thread, e.g. "Create an automation that checks my commits every morning."

### What Thread Automations can do
- Wait until a long-running command finishes
- Poll Slack, GitHub, or other sources in the existing thread's context
- Remind Codex to continue a review loop on schedule
- Run a skill-driven workflow via plugins, e.g. check PR status

### Triage Inbox
Automation results that have something to report appear in the Triage section in the sidebar. You can filter to view all or only unread.

### Real Automation examples

**Track a project's activity:**
```
Look at the latest remote origin/main. Then produce an exec briefing
for the last 24 hours of commits.
```

**Create a skill automatically from past sessions:**
```
Scan all of the ~/.codex/sessions files from the past day and if there
have been any issues using particular skills, update the skills.
```

### Safety cautions
Automations run unattended, so be careful:
- `read-only` mode: commands that edit files or need network access will fail
- `workspace-write` mode: safe for general background work (recommended)
- `danger-full-access` mode: high risk since there's no limit; avoid it

---

## Worktrees — work on several branches at once
Reference: [App Worktrees](https://developers.openai.com/codex/app/worktrees)

### What this topic is
Worktrees let Codex run several jobs in the same project without interfering with each other, using the Git worktrees principle that creates a "copy" of the repository for each job.

### Worktrees work only with a Git repository

### Key terms

| Term | Meaning |
|---|---|
| **Local checkout** | The original repository on your machine ("Local" in the App) |
| **Worktree** | A Git worktree the Codex App creates from the local checkout |
| **Handoff** | The process of moving a thread between Local and a Worktree |

### Why use worktrees
1. Work in parallel with Codex without disturbing your current workspace
2. Queue background work while still focusing on the front-of-house work
3. Move a thread back to Local when you're ready to inspect or test

### How to start using a worktree

**Steps:**
1. In the New Thread view, choose **Worktree** under the composer
2. Choose the Git branch to start from (`main`, a feature branch, etc.)
3. Send the prompt and Codex creates a Git worktree, by default in a **Detached HEAD** state

### Working on a worktree vs handing off to Local

**Option 1 — work on the worktree throughout:**
- Hit **Create branch here** in the Thread header when ready
- Commit, push, open a PR from the worktree directly
- Open your IDE to the worktree with the "Open" button

> **Git limitation:** if the worktree is already using branch `feature/a`, you can't check out the same branch in the Local Checkout at the same time

**Option 2 — Handoff to Local:**
- Click **Hand off** in the Thread header → choose Local
- Good when you want to read changes in your normal IDE or run an existing dev server
- Codex handles all the Git operations needed to move the thread safely

> Files in `.gitignore` won't be moved during the handoff

### Permanent Worktrees
Besides Codex-managed worktrees (created temporarily per thread), you can create a **permanent worktree** from the 3-dot menu in the Project Sidebar, good for long-lived work needing a permanent environment.

### Worktree Cleanup
Codex keeps up to the 15 most recent worktrees (adjustable in Settings). Codex won't delete a worktree if:
- The connected thread is pinned
- The thread is still running
- It's a permanent worktree

Before deleting, Codex saves a snapshot to restore later.

---

## Local Environments — set an environment script for worktrees
Reference: [Local Environments](https://developers.openai.com/codex/app/local-environments)

### What this topic is
Local Environments are setup scripts that run automatically when a new worktree is created, ensuring dependencies, tools, and config are complete before Codex starts working.

### What it's used for
- Install `npm packages`, `Python dependencies`, `Go modules`, etc.
- Set environment variables
- Run a migration or seed a DB before starting

### How to set it up
1. Go to Project Settings in the sidebar
2. Hit **Add environment setup**
3. Write a shell script (e.g. `npm install`, `pip install -r requirements.txt`)
4. This script runs every time a new worktree is created from this project

---

## In-App Browser — a browser in the App
Reference: [In-app Browser](https://developers.openai.com/codex/app/browser)

### What this topic is
The in-app browser lets you open a web page preview right in the Codex App, good for testing a web app Codex is building without going out to a separate browser.

### What it's used for
- Open a rendered web page
- Leave comments on the page for Codex to fix
- Have Codex do browser flows on a local web app

### Tip
For a web app built locally, always use the in-app browser **before** Computer Use, because the in-app browser is faster and has a clearer scope.

---

## Chrome Extension — Codex in the Chrome browser
Reference: [Chrome Extension](https://developers.openai.com/codex/app/chrome-extension)

### What this topic is
Codex has a Chrome Extension that lets Codex work directly with Chrome, e.g. scrape content, inspect web UI, or do work needing browser context.

---

## Computer Use — control the GUI with Codex
Reference: [Computer Use](https://developers.openai.com/codex/app/computer-use)

### What this topic is
Computer Use lets Codex **see and control** the GUI of apps on macOS — click, type, scroll, open menus, etc. — good for work the command line or a structured integration can't do.

### Limits
- **macOS only** at present
- **Not yet supported**: EEA, the UK, Switzerland

### How to install and set up
1. Go to Codex Settings → Computer Use
2. Click **Install** to install the Computer Use plugin
3. When macOS asks for permission, grant:
   - **Screen Recording** — so Codex can see the app
   - **Accessibility** — so Codex can click, type, and navigate

### Work that suits Computer Use

| Great for | Not necessary |
|---|---|
| Testing a macOS app or iOS simulator | Work that already has a direct plugin/MCP |
| Doing a complex browser flow | A web app testable via the in-app browser |
| Reproducing a bug that only happens in the GUI | Work doable via the command line |
| Changing app settings that need UI clicks | |
| Workflows that span several apps | |

### How to use Computer Use
Type `@Computer Use` or `@appname` in the prompt:
```
Open the app with computer use, reproduce the onboarding bug, and fix the
smallest code path that causes it.
```
```
Open @Chrome and verify the checkout page still works after the latest changes.
```

### Permissions and Approvals
- **macOS system permissions** (Screen Recording + Accessibility): let Codex see and control the app
- **App approvals in Codex**: define which apps Codex is allowed to use
- Choose **Always allow** for apps you trust Codex with
- Manage the "Always allow" list in Settings → Computer Use

### Safety cautions
Computer Use can:
- View screen content, take screenshots
- Interact with the windows, menus, keyboard, and clipboard of the designated app

Safe approach:
- Give a clear target app, one app/flow at a time
- Stay near the computer for sensitive work
- Close sensitive apps if they're not needed
- Review app permission prompts before allowing
- If Codex starts working with the wrong window, cancel immediately

> **What Computer Use can't do:** automate terminal apps or Codex itself, authenticate as Admin, or approve macOS Security/Privacy prompts

---

## Commands and Keyboard Shortcuts
Reference: [App Commands](https://developers.openai.com/codex/app/commands)

### Keyboard Shortcuts

**General:**

| Shortcut | Action |
|---|---|
| `Cmd` + `Shift` + `P` / `Cmd` + `K` | Command Menu |
| `Cmd` + `,` | Settings |
| `Cmd` + `O` | Open Folder |
| `Cmd` + `[` | Navigate Back |
| `Cmd` + `]` | Navigate Forward |
| `Cmd` + `+` / `Cmd` + `=` | Increase Font Size |
| `Cmd` + `-` / `Cmd` + `_` | Decrease Font Size |
| `Cmd` + `B` | Toggle Sidebar |
| `Cmd` + `Option` + `B` | Toggle Diff Panel |
| `Cmd` + `J` | Toggle Terminal |
| `Ctrl` + `L` | Clear Terminal |

**Thread:**

| Shortcut | Action |
|---|---|
| `Cmd` + `N` / `Cmd` + `Shift` + `O` | New Thread |
| `Cmd` + `F` | Find in Thread |
| `Cmd` + `Shift` + `[` | Previous Thread |
| `Cmd` + `Shift` + `]` | Next Thread |
| `Ctrl` + `M` | Dictation |

### Slash Commands
Type `/` in the Thread composer to access:

| Slash Command | What it does |
|---|---|
| `/feedback` | Open the dialog to send feedback (with logs) |
| `/mcp` | See the status of connected MCP servers |
| `/plan-mode` | Turn Plan Mode on/off for planning multi-step work |
| `/review` | Start Code Review Mode |
| `/status` | Show the Thread ID, context usage, rate limits |

> **Skills:** type `$` to call a skill directly, e.g. `$skill-name`. Enabled skills also appear in the Slash Commands list.

### Deeplinks
The Codex App registers the URL scheme `codex://` to open the App directly from a link:

| Deeplink | Opens | Parameters |
|---|---|---|
| `codex://settings` | Settings | None |
| `codex://skills` | Skills | None |
| `codex://automations` | Automations | None |
| `codex://threads/<thread-id>` | The specified thread | UUID only |
| `codex://new` | A new thread | `prompt`, `path`, `originUrl` |

---

## Windows Support
Reference: [App Windows](https://developers.openai.com/codex/app/windows)

### What this topic is
The Codex App officially supports Windows, with most features the same as macOS but a few differences.

### How to download
- [Download from the Microsoft Store](https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi)

### Differences from macOS
- The sandbox on Windows uses Windows Sandbox or Linux (in WSL2)
- Computer Use isn't supported on Windows at the time of writing
- Keyboard shortcuts may differ a bit (use `Ctrl` instead of `Cmd`)

---

## Troubleshooting — common problems
Reference: [App Troubleshooting](https://developers.openai.com/codex/app/troubleshooting)

### Computer Use can't see/control the app
**Cause**: macOS permissions haven't been granted
**Fix**: go to System Settings → Privacy & Security → check that Screen Recording and Accessibility give Codex permission

### Pull Request context doesn't show in the sidebar
**Cause**: the GitHub CLI (`gh`) isn't installed or isn't logged in
**Fix**:
```
# Install the GitHub CLI
brew install gh

# Login
gh auth login
```

### Worktree Error: Branch already in use
**Cause**: the branch is already checked out in another worktree
**Fix**: use Handoff to move the thread back to Local instead of checking out the same branch twice

### App won't update / hangs
- Restart the App
- Check you're signed in successfully (ChatGPT account or API key)
- If problems persist, hit `/feedback` to send logs to OpenAI

---

## Summary of all Codex App features

| Feature | macOS | Windows | Note |
|---|---|---|---|
| Parallel Threads | ✅ | ✅ | |
| Git Worktrees | ✅ | ✅ | Must be a Git repo |
| Review Pane | ✅ | ✅ | Must be a Git repo |
| Automations | ✅ | ✅ | |
| In-app Browser | ✅ | ✅ | |
| Chrome Extension | ✅ | ✅ | |
| Computer Use | ✅ | ❌ | Not supported in EEA/UK/CH |
| Image Generation | ✅ | ✅ | |
| Skills / Plugins | ✅ | ✅ | |
| Integrated Terminal | ✅ | ✅ | |
| Local Environments | ✅ | ✅ | |

---

## Topics still to verify

| Topic | Reason | Link |
|---|---|---|
| Full App Settings details | Need to see the real UI | [link](https://developers.openai.com/codex/app/settings) |
| Appshots | Data not yet pulled | [link](https://developers.openai.com/codex/appshots) |
