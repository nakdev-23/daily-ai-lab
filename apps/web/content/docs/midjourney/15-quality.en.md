---
title: "Quality — adjust the Render quality"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the --quality Parameter to balance image quality and creation speed"
readTime: "4 min"
readers: "0"
locked: false
order: 15
---

# Quality — adjust the Render quality

> Main reference: [Quality](https://docs.midjourney.com/hc/en-us/articles/32176522101773-Quality)

---

## What is Quality

The `--quality` or `--q` Parameter (the level of time and resources used to create the image) controls how much Render time Midjourney spends.

A high value = uses more time and GPU Time, but may get better detail
A low value = faster, saves GPU Time, but with less detail

---

## Usable values

| Value | Meaning | GPU Time used |
|-----|---------|----------------|
| `--quality 0.25` | very fast, low quality | very little |
| `--quality 0.5` | fast | half the normal |
| `--quality 1` | the default — balanced | normal |

---

## When to use a low value

- **Testing a Prompt** — before creating for real, test with `--quality 0.25` to save GPU Time
- **Draft Mode** — quickly sketch an image
- **Many Permutations** — when creating several images at once

**Example:**
```
a forest landscape --quality 0.25
```
→ get an image quickly, to test the Prompt direction first

---

## When to use the normal value (1.0)

- Creating a real image needing good quality
- Final work that's actually used

---

## Important notes

- In Midjourney version 5 and up, a value higher than 1 isn't guaranteed to always be better
- Upscaling after creation adds more detail than just increasing Quality alone

---

## Example Workflow using Quality

### A GPU-Time-saving Workflow
```
Step 1: test the Prompt with --quality 0.25 (very fast)
Step 2: once the Prompt is good, try with --quality 0.5
Step 3: Final with --quality 1 and Upscale
```

### Example commands

**Quick test:**
```
a mountain landscape --q 0.25 --chaos 80
```

**Comparison:**
```
a mountain landscape --q 0.25
a mountain landscape --q 1
```

---

## Quality and Model Version

In Midjourney V6 and up, the `--quality` value affects the detail the AI spends time creating. However, the difference between 0.5 and 1.0 may not always be clear on every Prompt.

---

## Tips for saving GPU Time with Quality

1. **Use Draft Mode** on the web instead of `--q 0.25` — a similar result, but more convenient
2. **Relax + Quality 0.5** for lots of test work
3. **Turbo + Quality 1** for Final work needing speed and quality

---

## Summary

Use `--quality 0.25` or `--q 0.25` when you want to test a Prompt quickly and save GPU Time. Use `1` (the default) when you want a good-quality image for real work. For an efficient Workflow, test with a low value first, then create for real with a high value.
