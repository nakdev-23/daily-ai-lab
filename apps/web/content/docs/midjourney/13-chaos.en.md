---
title: "Chaos — adjust the variety"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Learn to use the --chaos Parameter to control the variety of the 4 images from the same Prompt"
readTime: "4 min"
readers: "0"
locked: false
order: 13
---

# Chaos — adjust the variety

> Main reference: [Chaos Variety](https://docs.midjourney.com/hc/en-us/articles/32099348346765-Chaos-Variety)

---

## What is Chaos

The `--chaos` Parameter (the level of difference among the 4 images Midjourney creates at once) controls how similar or different the 4 images from the same Prompt are.

---

## Values and meanings

```
--chaos 0      → the 4 images are very similar (default)
--chaos 25     → slight variety
--chaos 50     → moderate variety
--chaos 75     → high variety
--chaos 100    → the 4 images differ the most
```

**Can be shortened to `--c`:**
```
a mountain --c 50
```

---

## When to use a high vs low value

### Low Chaos (0-25) — good when:
- You know exactly what you want
- You want to choose from similar options
- Doing Branding or a style that must be consistent
- Refining from an almost-perfect image

### High Chaos (50-100) — good when:
- Finding Inspiration (new creative ideas)
- You want to see many Interpretations from one Prompt
- You're not yet sure which style you want
- Concept Art work needing many options

---

## Comparison examples

### The same Prompt, different Chaos

**`a dragon in a cave --chaos 0`**
→ the 4 images are dragons in a cave, very similar, differing only in small details

**`a dragon in a cave --chaos 80`**
→ the 4 images are dragons in a cave, but some may be a fire dragon, some a water dragon, some a different camera angle, some a different drawing style

---

## Chaos and Seed

Seed (the random starting value — a number that lets you reproduce the same result) and Chaos work together:

- `--seed 1234 --chaos 0` → get the same image every time (Reproducible)
- `--seed 1234 --chaos 100` → the 4 images are varied, but you always get the same set if you use the same Seed

---

## Tips

1. **Use high Chaos when exploring** — when starting a new project, use `--chaos 80` to see various directions
2. **Lower Chaos when Refining** — once you've chosen a direction, lower Chaos to get similar options
3. **Combine with `--seed`** — to save and reproduce the result you like

---

## Chaos in a real workflow

### Starting a new project — use high Chaos
```
a product design concept --chaos 80
```
→ see various possible directions, 4 at once

### Narrow Down — lower Chaos
Once you've chosen a direction:
```
a product design concept, minimalist style --chaos 30
```
→ see Variations of the chosen direction

### Final — low Chaos
```
a product design concept, minimalist style --chaos 0
```
→ get 4 consistent images to choose the best

---

## Examples of using Chaos by work type

### Brand Identity
- Low value (0-20) — needs consistency

### Concept Art
- High value (60-100) — explore various directions

### Editorial Illustration
- Medium value (30-50) — fairly varied

### Character Design
- Low value (10-30) — keep the character consistent

---

## Chaos and learning

For beginners, high Chaos is a good learning tool:
- See how the same Prompt can be interpreted many ways
- Learn various styles and Aesthetics
- Understand how Midjourney "thinks"

---

## Summary

`--chaos` is a Parameter that helps you control the variety of results. Use a high value (60-100) when you want Inspiration or to explore various directions; use a low value (0-25) when you want consistent results or are in the Fine-tune stage. Adjust the Chaos value per your work stage for the best result.
