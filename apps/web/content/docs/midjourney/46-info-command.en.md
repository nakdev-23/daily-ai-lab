---
title: "Info Command — view account information"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the /info command to view account information, remaining GPU Time, the current plan, and usage statistics"
readTime: "3 min"
readers: "0"
locked: false
order: 46
---

# Info Command — view account information

> Main reference: [Info Command](https://docs.midjourney.com/hc/en-us/articles/32084927086861-Info-Command)

---

## What is /info

The `/info` command shows important information about your account and usage.

---

## How to use

### On Discord
Type `/info` in any chat room with the Midjourney Bot

### On the web
See the same information at Settings → Account or Profile

---

## Information shown

### Subscription
- The current plan: Basic, Standard, Pro, or Mega
- The next renewal date

### Fast Time Remaining
- The number of GPU Fast Time hours left this month
- Very important for planning your usage

### Lifetime Usage
- The total number of images ever created
- The total GPU Time used

### Mode
- The current mode: Fast, Relax, or Turbo
- Visibility: Public or Stealth

### Personalization Code
- Your personal Code for Personalization and Style

---

## Example of the information seen

```
Subscription: Pro Plan
Renewal: June 15, 2025
Fast Time Remaining: 18.5 hours
Relaxed Usage: 45 hours this month
Lifetime Usage: 2,847 jobs
Mode: Fast Mode
Visibility: Public
Personalization Code: abc123xyz
```

---

## Use often to track GPU Time

Check `/info` often to:
- Know how much GPU Fast Time is left
- Plan whether to use Fast or Relax Mode
- Decide whether you should buy more Fast Time

---

## Interpreting the information in /info

### Fast Time remaining vs used
If Fast Time is running low, you have options:
1. **Switch to Relax Mode** — usable unlimited (Standard+ plan)
2. **Buy more Fast Time** — $4 per hour, no expiration
3. **Wait for the new monthly cycle** — Fast Time resets

### Relaxed Usage
On the Standard Plan and up, you'll see "Relaxed Usage" — the number of hours used in Relax mode.

If Relaxed Usage is very high, the Relax speed may slow down during that time (Throttled — speed-limited).

---

## Planning by /info

### Early in the month (Fast Time full)
- Use Fast Mode for important work
- Use Turbo Mode for urgent work

### Mid-month (Fast Time half left)
- Start using Relax Mode for test work
- Save Fast Mode for Final work

### Late in the month (Fast Time low)
- Use Relax Mode primarily
- Use `--quality 0.25` or Draft Mode to save

---

## Personalization Code

The Code shown in `/info` is used with `--p`:
```
a landscape --p [code from /info]
```

Share the Code so others can use your Style.

---

## Summary

`/info` is an important command to use often to track usage and manage GPU Time efficiently. Check it before starting important work to know how much Fast Time is left, so you can plan correctly.
