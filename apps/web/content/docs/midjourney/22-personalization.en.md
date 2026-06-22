---
title: "Personalization — tune a personal style"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Learn Midjourney's Personalization system, which learns your taste from how you Rank images, then automatically creates images in the style you like"
readTime: "6 min"
readers: "0"
locked: false
order: 22
---

# Personalization — tune a personal style

> Main reference: [Personalization](https://docs.midjourney.com/hc/en-us/articles/32433330574221-Personalization)

---

## What is Personalization

Personalization (a system that learns which image style you like, then applies it automatically to image creation) is a feature that makes Midjourney learn your taste from how you Rank (deciding which image you prefer) images.

---

## How to enable it

### Step 1 — Rank images
Go to [midjourney.com/rank](https://midjourney.com/rank):
1. The system shows 2 images at once
2. Choose the image you prefer
3. Repeat until you reach the required count (you must Rank at least 200 pairs)

### Step 2 — Use Personalization in the Prompt
```
[Prompt] --p
```

Or the full name:
```
[Prompt] --personalize
```

---

## How it works

1. **You Rank images** → the system learns which style you like
2. **When you use `--p`** → Midjourney adjusts the Aesthetic to match your taste
3. **The more you Rank** → the better it understands your taste

---

## Example results

**Without Personalization:**
```
a forest landscape
```
→ a general forest image per Midjourney's Default

**With Personalization:**
```
a forest landscape --p
```
→ a forest image in the style you usually Rank as liking; e.g. if you like warm light, the image will have more Golden Hour light

---

## Personalization Code

Midjourney creates your personal Code, which you can share with others:

```
a landscape --p [code]
```

For example:
```
a landscape --p abc123
```

If a friend gives you a Code, you can use the same style as your friend.

---

## View your Personalization Code

- Go to Profile or Settings on the Midjourney web
- Or type `/info` in Discord to see the Code

---

## Ranking advice

To make the Personalization system accurate:
- **Rank honestly** — choose per your real taste
- **Rank variety** — not just 1-2 styles
- **Rank regularly** — do it routinely to update your taste

---

## Limitations

- You must Rank at least 200 pairs before you can use `--p`
- Results may differ by Prompt type
- Taste may change; you should Re-rank periodically

---

## Real examples of using Personalization

### Landscape work
```
a mountain at sunrise --p
```
→ if you usually like warm-light images, the image will have more Golden Hour

### Portrait work
```
a portrait of a woman --p
```
→ if you usually like Painterly images, the image will have a clearer style

### Combining with Parameters
```
a city scene --p --ar 16:9 --v 6.1
```
→ use Personalization together with other Parameters

---

## Someone else's Personalization Code

If you want to use another creator's Style:
```
a landscape --p [their Code]
```

This Code comes from:
- The creator sharing it directly
- Looking at `/info` of that account

---

## Short Personalization Code

Midjourney also has a Short Code that's easier to remember for personal Personalization.

Check your latest Code at:
- `/info` in Discord
- Settings → Personalization on the web

---

## When to use vs not use Personalization

### Use --p when:
- You want images specifically in the style "you like"
- Personal Projects
- You want images to have a unique character

### Don't use --p when:
- Client work needing results matching a Brief
- You want Neutral consistency
- Testing how a Prompt works without extra variables

---

## Summary

Personalization is the feature that makes Midjourney "know you" better. Rank 200+ pairs, then use `--p` in the Prompt to get images in the style matching your personal taste. You can share your Code with others, and use others' Codes to try a different style.
