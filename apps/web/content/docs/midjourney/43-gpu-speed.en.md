---
title: "GPU Speed — Fast, Relax, Turbo"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Understand the three speed modes: Fast, Relax, and Turbo, to manage GPU Time efficiently"
readTime: "5 min"
readers: "0"
locked: false
order: 43
---

# GPU Speed — Fast, Relax, Turbo

> Main reference: [GPU Speed Fast Relax Turbo](https://docs.midjourney.com/hc/en-us/articles/32016412137741-GPU-Speed-Fast-Relax-Turbo)

---

## Overview

Midjourney has 3 image-creation speed modes, each with different speed and GPU Time usage:

| Mode | Speed | Uses GPU Time | Plan required |
|------|---------|-------------|-----------|
| **Fast** | fast | yes | all plans |
| **Relax** | slower | no | Standard+ |
| **Turbo** | fastest (4x) | uses 2x | all plans |

---

## Fast Mode

Fast Mode (the standard mode that creates images using the plan's GPU Fast Time) is the normal mode that uses GPU Time from your monthly quota.

### Characteristics
- Creates images in **1-2 minutes**
- Uses GPU Fast Time from the quota
- Good for work needing consistent quality and speed

### How to enable
- The default, or type `/fast` in Discord

---

## Relax Mode

Relax Mode (an unlimited mode that doesn't count GPU Fast Time but waits longer in the queue) lets you create unlimited images without using GPU Fast Time.

### Characteristics
- Creates images slower — **waits 0-10+ minutes** depending on the queue
- Doesn't use GPU Fast Time
- No limit on the number of images
- Good for non-urgent work

### How to enable
- Type `/relax` in Discord
- On the web: choose "Relax" in Settings

### Which plans it works with
- Standard, Pro, Mega (not Basic)

---

## Turbo Mode

Turbo Mode (the fastest mode, 4 times faster than Fast but using 2 times the GPU Time) is good for urgent work.

### Characteristics
- Creates images in **under 1 minute** (4 times faster than Fast)
- Uses **2 times** the GPU Fast Time
- Good for Real-time work or when you need an immediate result

### How to enable
- Type `/turbo` in Discord
- On the web: choose "Turbo" in Settings

---

## GPU Time management strategy

### For Basic users (3.3 hrs/month)
- Test the Prompt with `--quality 0.25` first
- Upscale only the images you really want
- Don't use Turbo Mode unless necessary

### For Standard users (15 hrs/month)
- Use Fast Mode for important work
- Use Relax Mode for test and non-urgent work
- Use Turbo Mode only for Urgent work

### For Pro/Mega users (30-60 hrs/month)
- Use Fast Mode primarily
- Relax Mode for Batch Generation (creating many images)

---

## View remaining GPU Time

- Type `/info` in Discord
- On the web: see it at Settings → Account

---

## Summary

Use **Fast Mode** for normal work, **Relax Mode** when GPU Fast Time is running low or work isn't urgent, and **Turbo Mode** when you need a result very fast but accept 2 times the GPU Time.
