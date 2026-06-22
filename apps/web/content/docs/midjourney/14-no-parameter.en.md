---
title: "–no — Negative Prompting"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the --no Parameter to tell Midjourney what you don't want to appear in the image"
readTime: "4 min"
readers: "0"
locked: false
order: 14
---

# –no — Negative Prompting

> Main reference: [No](https://docs.midjourney.com/hc/en-us/articles/32173351982093-No)

---

## What is --no

The `--no` Parameter (Negative Prompt — a removal command specifying what you don't want to appear in the image) tells Midjourney what you don't want to appear in the created image.

---

## How to use

```
[Prompt] --no [what you don't want]
```

**Example:**
```
a beach landscape --no people
a forest --no buildings, roads
a food photo --no text, watermarks
```

---

## Use several words at once

Separate with commas:
```
a product photo of a watch --no reflections, shadows, background clutter, text
```

---

## Real use cases

### A clean nature image
```
a mountain landscape at sunrise --no people, buildings, power lines, roads
```

### A food image
```
a delicious pasta dish, studio photography --no hands, cutlery in frame, napkins
```

### A Portrait image
```
portrait of a woman in garden --no sunglasses, hats, distracting background elements
```

### An Architecture image
```
a modern house exterior --no cars, people, street signs
```

---

## Limitations of --no

`--no` doesn't guarantee that thing will disappear entirely; it's just a "request," not an absolute command.

If unwanted things remain:
1. Try Re-running
2. Add more specificity to `--no`
3. Use Vary Region to fix only that part
4. Use a Multi-Prompts Negative Weight instead: `flowers::-1`

---

## --no compared to Multi-Prompt Negative Weight

| Method | Result |
|------|-----|
| `--no flowers` | tries to have no flowers |
| `flowers::-1` | reduces the weight of flowers (some may remain) |

`--no` has a stronger effect, but Multi-Prompt Negative gives more detailed level control.

---

## The correct way to write --no

### Method 1 — separate with commas
```
a landscape --no people, cars, buildings
```

### Method 2 — multiple --no
```
a landscape --no people --no buildings --no power lines
```

### Method 3 — use "and"
```
a portrait --no glasses and hats and heavy makeup
```

---

## --no and things Midjourney adds automatically

Midjourney often adds some things automatically that you may not want:

| Situation | Often adds | Fix with |
|----------|---------|--------|
| Food image | hands, cutlery | `--no hands, cutlery` |
| Landscape image | people, cars | `--no people, vehicles` |
| Product image | shadows, reflective surfaces | `--no shadows, reflections` |
| Abstract image | text | `--no text, letters, words` |

---

## Cases where --no doesn't work

Sometimes Midjourney doesn't listen to `--no`:
1. **Try Re-running** — the result differs each time
2. **Add specificity** — `--no realistic skin, human skin texture`
3. **Use Vary Region** — remove the unwanted part after creating
4. **Adjust the Prompt** — say what you want, instead of saying what you don't want

---

## Comparing --no with stating it in the Prompt

| Method | Example |
|------|---------|
| Use --no | `a forest --no people` |
| State in the Prompt | `a deserted empty forest with no humans` |

Both methods work, but `--no` is easier for removing unwanted things.

---

## Summary

`--no` is an easy and very useful Parameter. Use it when you want a clean image free of distractions, or when Midjourney often adds unwanted things automatically. If `--no` still doesn't work, try Vary Region or the Editor to remove that part after creating the image.
