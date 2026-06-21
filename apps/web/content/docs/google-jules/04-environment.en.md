---
title: "Google Jules: Environment — configuring the code-running machine"
tool: "Google Jules"
icon: "tool-jules"
level: "pro"
summary: "Configure the environment (dependencies, setup commands) so Jules can run and test code correctly"
readTime: "4 min"
readers: "0"
locked: false
order: 4
---

# Environment — Jules's environment ⚙️

> Adapted from the official documentation at [jules.google](https://jules.google/docs)

Jules works in its own **cloud virtual machine (VM)** so it can really run and test code. You can configure it to match your project.

## 🧰 What you can configure

| What you set | Example |
|---|---|
| **Setup commands** | Install dependencies (e.g. `npm install`) |
| **Language/runtime version** | Node, Python, etc. |
| **Environment variables** | Values needed to run (don't put important secrets) |
| **Test command** | E.g. `npm test` so Jules can check the work itself |

## ⭐ Why it matters

- If setup is correct, Jules can **run tests itself** and be confident the changed code really works
- Reduces the "code passes in the AI's head but doesn't actually run" problem

## ▶️ How to configure

1. Specify the project's dependency-install command
2. Specify the test command (if any)
3. Jules uses these values every time it works in the VM

## 🔒 Safety

- Avoid putting important secrets directly
- Grant repo access only as needed

## 🔗 Reference

- Official docs: https://jules.google/docs
