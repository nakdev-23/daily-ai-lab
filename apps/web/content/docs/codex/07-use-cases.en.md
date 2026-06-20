---
title: "Use Cases — real-world Codex use cases"
tool: "Codex"
icon: "icon-docs"
level: "intermediate"
summary: "The main use cases Codex genuinely helps with in everyday engineering work, from writing code, debugging, and code review to refactoring and building UI from a design"
readTime: "8 min"
readers: "0"
locked: false
order: 7
---

# Codex Guide — Part 7: Use Cases

> Primary reference: [Codex Use Cases](https://developers.openai.com/codex/use-cases) | [Codex Workflows](https://developers.openai.com/codex/workflows)

---

## Overview

Codex isn't just a typical "AI that writes code" — it's a **Coding Agent** (an AI agent that does multi-step work on its own) that can work on many steps at once, reading files, running commands, editing code, and creating a Pull Request (a request to merge code — a way to propose changes for the team to review before merging) in one go.

The OpenAI team groups the use cases into 7 main categories:

| Category | Example work |
|------|------------|
| Productivity & Collaboration | Replying to email, coordinating across tools |
| Web Development | Building UI from a design spec |
| Game Development | Prototyping game mechanics |
| Native Development | iOS/macOS apps |
| Production Systems | Navigating and refactoring a large codebase |
| Security | Finding vulnerabilities, penetration testing |
| Life Sciences | Analyzing research data |

---

## 1. Code Generation

**Good for:** building new features, boilerplate (basic code scaffolding — repetitive code every project needs), utility functions

### How to use it effectively

- Give the **project's context** first, e.g. the stack, framework, conventions
- Specify the **desired result** clearly, e.g. "create an API endpoint (a URL that serves data) for GET /users that returns JSON"
- Attach related files, e.g. the schema, types, existing code examples in the project

### Example prompt

```
Create a React component to display a user profile card
- Use TypeScript
- Props: { name: string, avatar: string, role: string }
- It must be responsive and use Tailwind CSS
- See the pattern from @src/components/Card.tsx
```

### What Codex does

1. Reads `Card.tsx` to understand the project's pattern
2. Creates a component matching the team's convention
3. Adds correct TypeScript types
4. Uses Tailwind CSS per the existing style guide

---

## 2. Debugging and fixing bugs

**Good for:** fixing errors, finding the cause of a problem, tracing a stack trace (the path the program ran before crashing — tells you which line of which file it crashed on)

### How to get the best result

- Attach the full **error message** or stack trace
- State the **steps to reproduce the error** (reproduction steps)
- Specify the **suspect files** if any

### Example prompt

```
The app crashes when the user hits Submit in /checkout
Error: "Cannot read properties of undefined (reading 'price')"
Stack trace: @error.log
Likely relevant files: @src/pages/checkout.tsx @src/hooks/useCart.ts
Help find the cause and fix it
```

### What Codex does

1. Reads the stack trace and follows the call stack (the order functions were called)
2. Finds the relevant call sites (where the function is called)
3. Proposes the root cause with an explanation
4. Fixes the code and runs tests to confirm

---

## 3. Writing tests

**Good for:** unit tests (testing small functions — testing each piece of code in isolation), integration tests (testing components working together), edge cases (boundary situations that may make the program fail)

### How to use it effectively

- Specify what kind of test you want (Unit/Integration/E2E)
- State the framework used (Jest, Vitest, Pytest, etc.)
- Specify the project's conventions, e.g. filenames, structure

### Example prompt

```
Write a unit test for the calculateDiscount function in @src/utils/pricing.ts
- Use Vitest
- Cover the happy path and edge cases (discount 0%, 100%, invalid input)
- See the pattern from @src/utils/__tests__/tax.test.ts
```

### Example output code

```typescript
import { describe, it, expect } from 'vitest'
import { calculateDiscount } from '../pricing'

describe('calculateDiscount', () => {
  it('applies 20% discount correctly', () => {
    expect(calculateDiscount(100, 20)).toBe(80)
  })

  it('returns original price when discount is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100)
  })

  it('returns 0 when discount is 100', () => {
    expect(calculateDiscount(100, 100)).toBe(0)
  })

  it('throws error for negative discount', () => {
    expect(() => calculateDiscount(100, -5)).toThrow()
  })
})
```

---

## 4. Refactoring code

**Good for:** improving structure, reducing duplication (repeated code), adapting to a new design pattern

### The best approach (Cloud Mode)

Refactoring (restructuring code without changing behavior) a lot of code is good to delegate to Codex Cloud because:
- It takes time, so should run in the background
- It needs to touch many files at once
- It needs to run the test suite (all the tests) afterward

### Recommended steps

1. **Plan first (Local):** use the `$plan` skill to design the refactoring strategy
2. **Delegate to Cloud:** send the work to Codex Cloud to do in the background
3. **Review the diff:** check the diff (the difference in code before and after) before merging

### Example prompt for Cloud

```
Refactor the authentication module in src/auth/
- Separate concerns: validation, token management, session handling
- Use the Repository Pattern
- Don't change the public API
- Run npm test after; all tests must pass
```

---

## 5. Building UI from a design

**Good for:** turning a Figma screenshot or design spec into code

### How to use it

1. Attach a screenshot of the design
2. Specify the framework and styling approach
3. State the constraints, e.g. responsive (adapting to screen size), dark mode

### Example prompt

```
[attach a screenshot of the design]
Create a React component from this design
- Use Next.js + TypeScript
- Styling: Tailwind CSS
- It must be responsive (mobile, tablet, desktop)
- Put it in src/components/HeroBanner.tsx
```

---

## 6. Code Explanation

**Good for:** onboarding (getting started understanding a new project), taking over legacy code (old code still in use), understanding an unfamiliar service

### Example prompt

```
Explain this service @src/services/payment/
- What does the service do
- How does the data flow
- Where are the validation points
- Are there any gotchas (unexpected pitfalls) or edge cases to watch out for
```

---

## 7. Automatic Code Review

**Good for:** PR review (checking code before merge), finding bugs, checking security

### How to use it

- **Local:** run the `/review` command in the CLI (the command-line interface)
- **GitHub:** comment `@codex review` on a PR
- **Auto Review:** enable it in Settings to have Codex review every PR automatically

### Example

```
# In a GitHub PR comment:
@codex review pay special attention to security issues and edge cases
```

Codex flags (raises an alert on) only **P0 (Critical)** and **P1 (High)** issues, to keep review comments from getting too cluttered.

---

## Additional Use Case categories

### Production Systems
- **Codebase Navigation:** find which part of the code does what
- **Dependency Updates:** update library (a reusable set of ready-made code) versions and fix breaking changes (changes that break existing code)
- **API Migration:** move from an old API (a connection channel between programs — like a bridge that lets apps talk) to a new one across the codebase

### Security
- **Vulnerability Scanning:** find OWASP Top 10 vulnerabilities (the 10 most common security vulnerabilities)
- **Dependency Audit:** check for problematic npm/pip packages
- **Code Hardening:** add input validation, error handling

### Documentation
- **Auto-generate Docs:** create JSDoc/docstrings (standard-format code descriptions) from code
- **README Update:** update the README to match the real codebase
- **API Docs:** create an OpenAPI spec (a standard for describing an API) from the route handlers

---

## Tips for choosing the right use case

| For this kind of work | Use this surface | Reason |
|-----------|----------------|---------|
| Quick question / brief code explanation | CLI / IDE | Quick answer, no waiting |
| Building a new feature across many files | Codex Cloud | Runs in the background |
| Urgent bug debugging | CLI / IDE | Interactive (responds immediately), tight feedback loop |
| Large refactor | Codex Cloud | Runs in parallel, review the diff before merge |
| PR Review | GitHub @codex | Full context, can push the fix back |
| Building UI from a design | IDE (attach image) | Can see the design directly |

---

## Summary

Codex is most useful when you:
1. **Give full context** — attach files, stack traces, existing code examples
2. **Specify the Definition of Done** — say what "done" means
3. **Choose the surface to suit the work** — Interactive vs Cloud/Background
4. **Have Codex verify its own work** — tell it to run tests, lint (check code quality) after finishing
