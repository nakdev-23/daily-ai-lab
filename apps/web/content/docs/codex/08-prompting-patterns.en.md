---
title: "Prompt Patterns — prompting techniques for coding work"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "Learn effective prompting techniques and patterns for Codex, from giving context and splitting work to using Goal Mode and ready-made patterns for each kind of task"
readTime: "7 min"
readers: "0"
locked: false
order: 8
---

# Codex Guide — Part 8: Prompt Patterns

> Primary reference: [Codex Prompting](https://developers.openai.com/codex/prompting) | [Codex Workflows](https://developers.openai.com/codex/workflows)

---

## Why prompts matter so much

Codex works as an **agentic loop** (an automatic work loop — the AI decides and acts repeatedly until the work is done) — it calls the model, reads files, runs commands, then repeats until the work is done. So the quality of the result depends on whether Codex understands the task correctly from the start.

> "Codex works best when you treat it like a teammate with explicit context and a clear definition of 'done.'"
> — OpenAI Codex Docs

---

## 3 basic principles

### 1. Give complete context

Codex needs context (the necessary background information) like a new programmer who just joined the team. The more info, the better the result.

**Context you should give:**
- Relevant files (use `@filename` in CLI/IDE)
- The stack and framework used
- The team's conventions
- The full error message or stack trace (the path the program ran before crashing)
- Screenshots (for UI work)

### 2. Define the Definition of Done clearly

State what "done" means, so Codex can verify its own work.

**Instead of writing:**
```
fix the bug
```

**Write:**
```
fix the bug; when done it must:
- Run npm test passing every test case
- Have no TypeScript errors
- Run the reproduction steps and the bug doesn't recur
```

### 3. Break big work into small pieces

Complex work should be split into several prompts rather than cramming everything in one. If you don't know how to split it, ask Codex first:

```
Help break this refactor into milestones (intermediate target steps) that can be done one at a time
before starting
```

---

## Ready-made Prompt Patterns

### Pattern 1: Code Generation

```
Create [feature/component name] that [brief description]

Requirements:
- [requirement 1]
- [requirement 2]

Tech stack: [framework, language, libraries]
Convention: see the example from @[example file]
Output: create the file at [destination path]
```

**Real example:**
```
Create a React Hook (a special React function for managing reusable logic) to fetch user data that handles loading, error, retry

Requirements:
- TypeScript
- Support AbortController (cancel the request when the component unmounts)
- Exponential backoff retry (wait increasingly longer before retrying — so as not to send requests too frequently), up to 3 times
- Return { data, loading, error, refetch }

Tech stack: React 18, TypeScript 5
Convention: see the example from @src/hooks/useAuth.ts
Output: src/hooks/useUserData.ts with a test at src/hooks/__tests__/useUserData.test.ts
```

---

### Pattern 2: Bug Fix

```
Bug: [describe the symptom]

Reproduction steps:
1. [step 1]
2. [step 2]

Error: [paste error message / stack trace]

Suspect files: @[file1] @[file2]
Constraint: [don't change X, must work with Y]

When done, run [test command] to confirm
```

---

### Pattern 3: Test Writing

```
Write a [Unit/Integration] test for [function/module] in @[file]

Framework: [Jest/Vitest/Pytest/etc.]
Cover:
- Happy path: [the normal case where everything works correctly]
- Edge cases: [special cases — boundary situations]
- Error cases: [error cases]

See the pattern from @[example test file]
```

---

### Pattern 4: Refactoring

```
Refactor @[file/folder] to [reason, e.g. separate concerns (responsibilities), adapt to a new pattern]

Goals:
- [goal 1]
- [goal 2]

Constraints:
- Don't change the public API / interface (the interface others use)
- Must still work with [dependency (what the code relies on)] the same way

Verification: run [test command]; all tests must pass
```

---

### Pattern 5: Code Review

```
Review the code in @[file/PR], focusing on:
- [focus area 1, e.g. security]
- [focus area 2, e.g. performance]
- [focus area 3, e.g. edge cases]

Severity levels: P0 = Critical, P1 = High, P2 = Medium
```

---

### Pattern 6: Code Explanation

```
Explain @[file/function/service] at a [junior/senior] engineer level

I want to know:
1. What is this module/function's main job
2. How does the data flow work
3. Where are the complex spots or gotchas (unexpected pitfalls)
4. How does the dependency (what the code relies on) interact with the rest of the system
```

---

## Context Management techniques

### Attaching files

**In the CLI:**
```bash
# Type @ then Tab to autocomplete the path
@src/utils/pricing.ts
```

**In the IDE:**
- Select code and use "Add to Codex Thread"
- Keep the file open in the editor — the IDE extension (the code-editor add-on) adds the context automatically

**In Cloud:**
- Specify the path in the message; Codex reads the file itself

### Context Window Limits

Codex has a limited context window (the amount of information the AI takes in at once). As the conversation grows longer, Codex **auto-compacts** by summarizing the still-relevant old information. If you want to start unrelated new work, open a new thread.

---

## Goal Mode — for long, multi-step work

Use the `/goal` command to set a long-term objective so Codex can work on its own without waiting for a prompt at each step.

### A good goal must have:
- **Specific outcome** — a clear desired result
- **Measurable target** — measurable as to whether it's done
- **Test criteria** — conditions Codex can verify itself

### Example goal

```
/goal
Add rate limiting (limiting how often something is called — preventing anyone from calling the API too frequently) to every API endpoint in src/api/

Criteria:
- Every endpoint must support no more than 100 req/min per IP
- If exceeded, return 429 Too Many Requests with a Retry-After header
- There must be integration tests covering the limit scenarios
- Run npm test passing every test
```

---

## Verification — have Codex check its own work

One of the most important techniques: **ask Codex to verify its own work**.

### Good verification has several levels

| Level | How | Good for |
|-------|------|---------|
| Basic | Run the test suite (all the tests) | Every task |
| Type Check | Run `tsc --noEmit` | TypeScript projects |
| Lint (check code quality) | Run ESLint/Prettier | Code quality |
| Integration | Run E2E tests (end-to-end tests — simulating real use from start to finish) | New features |
| Manual | State the reproduction steps | Bug fixes |

### Example verification in a prompt

```
After finishing the fix:
1. Run `npm run lint`; there must be no errors
2. Run `npm test`; all tests must pass
3. Try to reproduce the original bug; it must not happen again
4. Check TypeScript types with `tsc --noEmit`
```

---

## Anti-patterns to avoid

### Prompts that give bad results

| Anti-pattern (a pattern to avoid) | Problem | Fix |
|-------------|-------|---------|
| "make the code better" | Doesn't know what "better" means | Specify measurable criteria |
| "fix all bugs" | Too broad | Specify the specific bug |
| Cramming every requirement into one prompt | Codex does many things at once, hard to verify | Split into several prompts |
| Not attaching relevant files | Codex has to guess the context | Use `@filename` to reference files |
| Not stating verification steps | Codex doesn't know what "done" is | Specify test/lint commands |

---

## Template prompts for everyday work

### Morning Code Review

```
Review my PR in @[branch/file changes]
Focus:
1. Logic errors and edge cases
2. Security issues (SQL injection (injecting malicious SQL commands), XSS (injecting malicious scripts into a web page), auth bypasses (skipping the authentication system))
3. Performance bottlenecks (spots that slow the system down)
4. Missing error handling

Just flag P0/P1; don't report style issues
```

### Feature Implementation

```
Implement [feature name] per the spec in @[spec file or issue]

Stack: [tech stack]
Files to create/modify: [list if known]
Must NOT change: [critical files not to touch]

Complete when:
- [ ] The feature works per the spec
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] PR-ready (clean commits, no debug code)
```

### Documentation Update

```
Update the documentation in @[doc files]
to match the current code in @[source files]

Latest changes: [describe what the code changed]
Don't change: the overall tone and structure
```

---

## Prompt Checklist summary

Before sending a prompt, check:

- [ ] State the **task to do** clearly
- [ ] Attach the **relevant files** with `@filename`
- [ ] Specify the **tech stack / framework**
- [ ] State the **constraints** (don't change X, must work with Y)
- [ ] Define the **Definition of Done** and verification steps
- [ ] If the work is complex — split into sub-prompts or use Goal Mode
