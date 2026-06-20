---
title: "Subagents and Models — choosing a Model and using Parallel Agents"
tool: "Codex"
icon: "icon-docs"
level: "pro"
summary: "Learn how to use Subagents for parallel work, choose the model suited to each task, adjust the Reasoning Level, and use AGENTS.md customization for teams"
readTime: "7 min"
readers: "0"
locked: false
order: 10
---

# Codex Guide — Part 10: Subagents and Models

> Primary reference: [Codex Subagents](https://developers.openai.com/codex/concepts/subagents) | [Codex Customization](https://developers.openai.com/codex/concepts/customization)

---

## What are Subagents

Subagents (child AI agents) are agents that Codex **creates and delegates work to**, to work in **parallel** (at the same time), separate from the main thread (the main conversation with the AI).

Instead of the main thread doing everything itself until the context window (the amount of information the AI takes in) is full of logs and intermediate output, Codex delegates suitable work to subagents to do separately, then brings back a summary.

### Why use Subagents

**Problems subagents solve:**

1. **Context Pollution** — intermediate output (logs, test results, intermediate analysis) buries the important info
2. **Context Rot** — performance drops as the conversation grows longer, because the model has to process irrelevant info

Subagents work in a separate thread, returning only a **summary** to the main thread.

---

## Work that suits Subagents

### Great: Read-heavy Tasks

| Task | Example |
|-----|---------|
| Exploration | "Explore the codebase and tell me where authentication is" |
| Test Execution | Run the test suite and summarize failures |
| Log Analysis | Analyze a large log to find patterns |
| Document Summary | Summarize several specs/docs files |
| Security Review | Find vulnerabilities in the code |
| Code Review | Analyze code to find issues |

### Not suitable: Write-heavy Tasks in Parallel

Avoid having multiple subagents **edit the same file** at once, because it causes conflicts and overhead in coordination.

---

## How to use Subagents

Subagents need **a clear instruction from the user** — Codex won't spawn them automatically.

### Example prompt

```
Create 3 subagents at once:
1. A subagent to check security risks in src/api/
2. A subagent to find test gaps in src/services/
3. A subagent to analyze performance bottlenecks (spots that slow the system) in src/db/

When done, summarize the findings by category
```

### The result

The main thread receives a summary from each subagent, e.g.:

```
Security Analysis:
- P0: SQL injection risk in /api/search (line 45)
- P1: Missing input sanitization in /api/upload

Test Gaps:
- UserService: 0% coverage on error paths
- AuthService: missing tests for token refresh

Performance:
- N+1 query in getUserOrders() — affects /dashboard
- Missing index on users.email column
```

Instead of thousands of lines of raw logs.

---

## Models available in Codex

Codex supports several models (an AI model — a version of the AI system with different abilities), each with different strengths:

### GPT-5.5 — the main model for complex work

- **Good for:** work needing planning, multi-step reasoning, mission-critical work (very important work where mistakes aren't allowed)
- **Pros:** the smartest, understands complex context well
- **Cons:** slower and uses more credits (the usage unit)

### GPT-5.4 — a balance of capability and speed

- **Good for:** general coding work, feature implementation, bug fixes
- **Pros:** reasonably fast, covers most coding work
- **Cons:** may not match GPT-5.5 on very complex work

### GPT-5.4-mini — fast and economical

- **Good for:** subagent tasks, exploration, quick questions, large file review
- **Pros:** very fast, uses few credits
- **Cons:** less capable for complex work

### GPT-5.3-Codex — specialized in code

- **Good for:** specialized coding work, code analysis
- **For:** Plus, Pro, Business plans
- **Pros:** optimized for coding work

### GPT-5.3-Codex-Spark — Research Preview

- **For:** Pro plan only
- **Good for:** work needing very low latency (response time)
- **Status:** research preview (experimental — not yet stable)

---

## Choosing the right Model

### Quick Decision Guide

```
What kind of work → use which model

Very complex, multi-step planning → GPT-5.5
General coding work → GPT-5.4
Subagent / Exploration / Quick → GPT-5.4-mini
Specialized code analysis → GPT-5.3-Codex
Need very low latency (Pro) → GPT-5.3-Codex-Spark
```

### Change the model with the /model command

```bash
# In the CLI
/model gpt-5.4-mini

# Or choose from the menu
/model
```

---

## Reasoning Level

Besides the model, you can also adjust the **Reasoning Level** (the level of analytical thinking — higher uses more tokens but gives better results):

| Level | Good for | Effect on tokens (text units — about 1 word) |
|-------|---------|------------|
| **High** | Security review, complex logic, edge cases | Uses more but high quality |
| **Medium** | General work (Default) | Balanced |
| **Low** | Straightforward work, needing speed | Faster, uses less |

### When to use High Reasoning

- Security vulnerability analysis
- Complex refactoring needing deep understanding of business logic
- Debugging with a complex stack trace
- Algorithm design and optimization

### When to use Low Reasoning

- Simple file operations
- Boilerplate generation
- Format conversion
- Straightforward documentation updates

---

## Subagents + Model Selection Strategy

When using subagents, you can set a different model for each subagent:

```
Main agent: use GPT-5.5 for planning and final synthesis (synthesizing the final result)

Create subagents:
- Security review subagent: use GPT-5.5 high reasoning
  (needs the highest accuracy)
- Exploration subagent: use GPT-5.4-mini
  (just reads and summarizes)
- Test analysis subagent: use GPT-5.4-mini
  (runs tests and reports results)
```

---

## AGENTS.md — Repository-level Customization

`AGENTS.md` is the most powerful way to customize Codex to suit the team.

### Structure

```
~/.codex/AGENTS.md          # Global — Personal preferences
repo-root/AGENTS.md         # Repo-wide — Team conventions
src/api/AGENTS.md           # Directory-specific — API rules
src/components/AGENTS.md    # Directory-specific — Component rules
```

**Principle:** the closer file overrides the farther file.

### A complete AGENTS.md example

```markdown
# Project Guidelines for Codex

## Build & Test Commands
- Install: `npm install`
- Build: `npm run build`
- Test: `npm test` or `npm run test:watch`
- Lint (check code quality): `npm run lint`
- Type check: `npm run typecheck`

## Repository Conventions
- Language: TypeScript strict mode
- Framework: Next.js 15 App Router
- Styling: Tailwind CSS + shadcn/ui
- State: Zustand (a state-management library) for global state, React Query for server state
- Database: Prisma + PostgreSQL

## Code Style
- Use named exports, not default exports (except page components)
- Every async function must have a try-catch or error boundary (a boundary that catches errors)
- Components must have a TypeScript interface for props (the properties passed into a component)
- No console.log in production code

## File Structure
- Components: src/components/[name]/index.tsx + [name].stories.tsx
- Services: src/services/[domain]/index.ts
- API routes: src/app/api/[endpoint]/route.ts
- Tests: in __tests__/ near the file being tested

## Review Guidelines
- Check for SQL injection in every query (always use Prisma parameterized queries (safe value insertion))
- Check authentication on every non-public API route
- Check input validation with zod on every user input
- Don't expose internal error messages in API responses

## Common Gotchas
- Prisma connection: use the singleton pattern (a pattern that creates a single instance) in src/lib/db.ts
- Environment variables: use src/config/env.ts, not process.env directly
- Date handling: use date-fns, not native Date methods
```

### When to update AGENTS.md

- When Codex repeats the same mistake
- When PR reviews have the same recurring comment
- When the team has a new convention
- When Codex reads too many irrelevant files (add routing guidance)

### Delegate the AGENTS.md update to Codex

```
@codex update AGENTS.md to include a new convention:
"Every API endpoint must have rate-limiting middleware (an intermediary that limits how often the API is called)"
See the implementation example from @src/middleware/rateLimiter.ts
```

---

## Skills — Reusable Workflows

Skills (saved, reusable workflows) are workflows saved as a package for reuse.

### Skill structure

```
.agents/skills/
  release-check/
    ├── SKILL.md          # Instructions (required)
    ├── scripts/
    │   ├── check.sh      # Executable scripts
    │   └── validate.py
    ├── references/       # Documentation
    └── assets/           # Templates
```

### Example SKILL.md

```markdown
# Release Check Skill

## Purpose
Check whether the codebase is ready to release

## Steps
1. Run the full test suite
2. Check for security vulnerabilities with npm audit
3. Check for TypeScript errors
4. Check for missing environment variables
5. Check for TODO/FIXME comments that may be blockers
6. Create a release checklist report

## Output
Create RELEASE-CHECK.md with:
- A pass/fail summary
- A list of issues to fix before release
- A timestamp
```

### Using a Skill

Codex can **discover skills automatically** from the task description:

```
Check whether the codebase is ready to deploy (put it on the server for use)
```

Codex chooses the `release-check` skill automatically.

Or call it directly:

```
Run the $release-check skill
```

### Global vs Project Skills

```
$HOME/.agents/skills/    # Personal global skills (every project)
.agents/skills/          # Project skills (repo-specific)
```

---

## Summary: when to use what

| Situation | Recommended choice |
|-----------|----------------|
| Complex, mission-critical work | GPT-5.5 + High Reasoning |
| Regular coding work | GPT-5.4 + Medium Reasoning |
| Exploring the codebase, quick tasks | GPT-5.4-mini |
| Analyzing several angles at once | Subagents in parallel |
| Want Codex to know team conventions | AGENTS.md |
| Frequently repeated workflows | Skills |
| Want to reduce context pollution | Subagents for exploration/analysis |
