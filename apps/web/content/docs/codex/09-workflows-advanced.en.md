---
title: "Advanced Workflows — Multi-file, PR Automation, and GitHub Integration"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "Learn advanced workflows for editing many files at once, creating and reviewing PRs automatically, using @codex mentions on GitHub, and doing cloud-based parallel tasks"
readTime: "8 min"
readers: "0"
locked: false
order: 9
---

# Codex Guide — Part 9: Advanced Workflows

> Primary reference: [Codex Workflows](https://developers.openai.com/codex/workflows) | [Codex Web](https://developers.openai.com/codex/cloud) | [GitHub Integration](https://developers.openai.com/codex/integrations/github)

---

## Overview of Workflow Surfaces

Codex works on 3 main surfaces (work spaces), each suited to different work:

| Surface | Good for | How it works |
|---------|---------|---------|
| **CLI** (command-line interface) | Interactive work (immediate back-and-forth), debugging, quick tasks | Runs locally, sandboxed (works in a restricted space — doesn't affect other parts) |
| **IDE Extension** (code-editor add-on) | Everyday coding, reading the current file | Runs locally, context from the editor |
| **Codex Cloud** | Large work, multi-file (many files at once), background tasks | Runs in the cloud, can create PRs directly |

---

## Workflow 1: Multi-file Editing

Work that needs to edit many files at once, e.g. adding a new feature, migration, refactoring.

### Recommended to use Codex Cloud because:
- It runs in the background, no waiting
- It can create a PR (Pull Request — a request to merge code) directly
- You can review the diff (the difference before and after) before merging

### Steps

**Step 1: Plan first (Local)**

```
I want to add Dark Mode to the app
Help plan which files need changing
and what each step does. Don't start yet.
```

Codex lists out, e.g.:
1. Add theme tokens (color/size variables — values that define the design system's look) in `src/styles/tokens.css`
2. Update the `ThemeProvider` in `src/context/theme.tsx`
3. Add a toggle component in `src/components/ThemeToggle.tsx`
4. Update the global styles in `src/app/globals.css`

**Step 2: Delegate to Cloud**

Once you see the plan and it's OK, delegate it:

```
The plan is OK, go ahead
When done, run npm test and npm run build; they must pass
```

**Step 3: Review and Merge**

Codex Cloud creates a PR; check the diff before merging.

---

## Workflow 2: Bug Fix with full Context

### Steps

```
Bug: Users can't upload an image whose filename has a space
Reproduction:
1. Go to /profile
2. Click Change Avatar
3. Choose a file named "my photo.jpg"
4. Error: "Failed to upload"

Stack trace: (no error log in the console)
Network tab: POST /api/upload → 400 Bad Request, body: "Invalid filename"

Suspect: @src/api/upload.ts @src/utils/filename.ts
Constraint: don't change the API endpoint path

When done:
1. Run the reproduction steps again; the bug must be gone
2. Run npm test -- --testPathPattern=upload
```

### What Codex does

1. Reads the files `upload.ts` and `filename.ts`
2. Finds the filename validation logic
3. Discovers the regex (a regular expression — a text pattern for searching/matching) doesn't handle a space in the filename
4. Fixes the validation rule
5. Runs the test to confirm

---

## Workflow 3: A full test suite

### Create tests for existing code

```
Write a comprehensive test suite for @src/services/auth/

Cover:
1. Unit tests for each function
2. Integration tests for the whole auth flow
3. Edge cases: expired token, invalid credentials, account locked

Framework: Vitest + Testing Library
Mocking: use vi.mock for external dependencies (what the code relies on from outside)
Pattern: see @src/services/user/__tests__/

Target coverage: 80%+ statement coverage (the percentage of code that's tested)
```

### Write tests before writing code (TDD)

TDD (Test-Driven Development — developing by writing tests first, then writing the code):

```
Write failing tests first for the Cart feature that doesn't exist yet

Feature spec: @docs/cart-feature-spec.md
Framework: Vitest

The tests must fail at first because there's no implementation
Then implement so all tests pass
```

---

## Workflow 4: Automatic Code Review

### Way 1: Local Review with the CLI

```bash
# Run a code review before committing (saving changes to the repository)
codex review

# Or specify a focus area
codex review --focus security,performance
```

### Way 2: GitHub PR Review with @codex

When a PR is created, comment on the PR:

```
@codex review
```

Codex will:
- Read all the code in the PR
- Flag (raise an alert on) only **P0 (Critical)** and **P1 (High)** issues
- Post review comments on GitHub

### Way 3: Auto Review every PR

Enable it in Codex Settings:
1. Go to Codex Settings > GitHub Integration
2. Turn on "Automatic PR Reviews"
3. Codex reviews every PR that's opened automatically

### Custom Review Guidelines with AGENTS.md

Create an `AGENTS.md` file (a file defining the AI agent's behavior in the project) in the project to set review criteria:

```markdown
## Code Review Guidelines

### Security
- Check for SQL injection (injecting malicious SQL commands) in every database query
- Check input validation for every user input
- Check authentication for every protected endpoint

### Performance
- Avoid N+1 queries (unnecessarily repeated database queries)
- Check for unnecessary re-renders in React

### Code Quality
- Use TypeScript strict mode
- No console.log in production code
- Every async function must have error handling
```

Codex uses the guidelines from the `AGENTS.md` closest to the changed file.

---

## Workflow 5: GitHub @codex Integration

### Use @codex on GitHub Issues

When you find an issue (a problem/task report) on GitHub, tag Codex to give it work:

```
@codex implement this feature based on the spec above
```

Codex will:
1. Read the issue description
2. Create a new branch (a separate code area for working)
3. Implement the feature
4. Create a PR with a description

### Use @codex on PR Comments

```
# Ask it to fix the P1 issue the review found
@codex fix the P1 issue about missing error handling

# Ask it to fix failing CI (Continuous Integration — a system that runs tests automatically)
@codex fix the CI failures

# Ask it to add tests
@codex add tests for the new authentication flow

# Ask it to update docs
@codex update the README to reflect the API changes in this PR
```

### What @codex can do

- Read all the context from the PR/Issue
- Push commits (saved code changes) back to the same branch (if it has permission)
- Create a new PR
- Post a comment explaining the changes

---

## Workflow 6: Cloud-based Refactoring

### Case: migrate from REST API to tRPC

REST API (an API style using standard HTTP) and tRPC (a TypeScript library that makes calling an API feel like calling a function):

```
Refactor the whole API layer from REST to tRPC
Files to change: src/api/, src/pages/api/, src/hooks/

Plan:
1. Create a new tRPC router (the API route definer)
2. Move the business logic from the REST handlers
3. Update the client-side hooks
4. Remove the old REST endpoints

Constraint:
- Don't change the business logic
- The frontend behavior must stay exactly the same

Verification:
- Run npm test passing every test
- Run npm run build with no errors
```

### Case: Database Migration

```
Update the Prisma schema (the database structure) per @migrations/v2-spec.md
and update every affected query (a data-fetching command)

Steps:
1. Update schema.prisma
2. Create a migration file
3. Update the queries in src/lib/db/
4. Update the changed types

Don't touch: the business logic in src/services/
```

---

## Workflow 7: Large-scale Documentation

### Auto-generate API Documentation

```
Create an OpenAPI spec (a standard for describing an API — so other tools can read it automatically) from the route handlers in @src/app/api/

Format: OpenAPI 3.1
Output: docs/api/openapi.yaml

Cover:
- Every endpoint
- Request/Response schemas (the structures of data sent and received)
- Authentication requirements
- Error responses
```

### Auto-update the README

```
Read the current codebase in @src/ and @package.json
then update @README.md to match the current state

Update sections:
- Prerequisites (things to install first)
- Installation
- Environment variables (settings that change per environment)
- Available scripts
- Project structure

Don't change: the introduction and Vision section
```

---

## Context in Cloud vs Local

### Cloud Tasks have access to:
- The whole repository (the code store — like a project folder on Git) (the connected ones)
- Read/write/run commands in a sandbox (a restricted workspace — safe from touching external systems)
- Creating a PR on GitHub
- Running CI/CD checks (automatic test-and-deploy systems)

### Local Tasks have access to:
- The defined working directory
- Tools installed on the machine
- Files open in the IDE (the integrated development environment)

---

## Tips for an efficient workflow

### 1. Use threads wisely

- **A single thread:** continuous work, e.g. implement + test + review
- **Separate threads:** unrelated work, e.g. a bug fix and a new feature

### 2. Specify checkpoints

For long work, specify checkpoints (points where it reports progress) for Codex to report progress:

```
Do it step by step, and report after each step whether it's done and the tests pass
If a step fails, stop and tell me; don't do the next step
```

### 3. Parallel Tasks with Cloud

Codex Cloud can run several tasks at once:

```
Create a new task for each of these issues:
1. Fix the login bug in @src/auth/login.ts
2. Add validation in @src/api/upload.ts
3. Update the tests in @src/tests/
```

Each task runs in parallel (at the same time) in a separate sandbox.

### 4. Always review first

For Cloud work that will push to GitHub:
- Always check the diff Codex created
- Read the PR description Codex wrote
- Look at the test results in CI

---

## Best Practices summary

1. **Local for Interactive** — debugging, quick fixes, wanting to see output immediately
2. **Cloud for Background** — large work, multi-file, no waiting
3. **@codex on GitHub** — very convenient for PR workflows when the team already uses GitHub
4. **AGENTS.md for Conventions** — save team conventions for Codex to use every time
5. **Plan before Execute** — always plan complex work first
