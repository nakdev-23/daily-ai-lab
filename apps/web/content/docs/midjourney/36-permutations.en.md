---
title: "Permutations — create several Variations at once"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use Permutations to create several variations at once from a single Prompt, by specifying options in curly braces"
readTime: "5 min"
readers: "0"
locked: false
order: 36
---

# Permutations — create several Variations at once

> Main reference: [Permutations](https://docs.midjourney.com/hc/en-us/articles/32761322355597-Permutations)

---

## What are Permutations

Permutations (creating combination sets — a technique using `{}` to specify several options, then Midjourney creates images from every possible combination at once) saves time when you need to test multiple variables.

---

## How to use

Put the options inside `{}` marks, separated by commas:

```
a {red, blue, green} car
```

Result: Midjourney creates 3 sets of images:
- "a red car"
- "a blue car"
- "a green car"

---

## Usage examples

### Test colors
```
a rose in {red, white, yellow, pink} color
```
→ creates 4 sets of images (roses in 4 colors)

### Test styles
```
a mountain landscape, {watercolor, oil painting, pencil sketch, digital art} style
```
→ creates 4 sets of images (mountain landscape in various styles)

### Test the weather
```
a forest in {spring, summer, autumn, winter}
```
→ creates 4 sets of images (a forest in each season)

### Test Parameters
```
a portrait --stylize {100, 500, 1000}
```
→ creates 3 sets of images (different Stylize levels)

---

## Nested Permutations

Use several `{}` in one Prompt:

```
a {red, blue} {cat, dog}
```

Result: 4 sets of images:
- "a red cat"
- "a red dog"
- "a blue cat"
- "a blue dog"

---

## Limitations

- The maximum number of Permutations depends on the plan
  - Basic: 4 Permutations
  - Standard: 16 Permutations
  - Pro/Mega: 40 Permutations
- Each Permutation uses its own GPU Time

---

## Main benefits

1. **Test a Concept** — compare several directions at once
2. **Client Presentation** — show the client several Variations to choose from
3. **Color Palette Testing** — test colors before choosing the one you like
4. **Save time** — send one command instead of many

---

## Real usage examples

### A/B Testing for Marketing
```
a product advertisement with {minimalist, vibrant, dark} aesthetic
```
→ test 3 Styles at once, present to the client to choose

### Create Mood Variations
```
a mountain landscape in {morning mist, golden sunset, stormy weather, blue hour}
```
→ the same image in 4 atmospheres, choose the most suitable

### Test a Character
```
a warrior with {red, blue, black, gold} armor
```
→ see all 4 Color Schemes at once

---

## Permutations with Parameters

You can use {} with Parameters too:
```
a portrait --ar {1:1, 2:3, 9:16}
```
→ 3 sets of images in different ratios

```
a landscape --stylize {100, 500, 1000}
```
→ 3 sets of images, differing in beauty

---

## Count the Permutations before sending

Before sending the command, count how many sets the total Permutations are:
- `{A, B, C}` = 3 sets
- `{A, B} {X, Y}` = 2×2 = 4 sets
- `{A, B, C} {X, Y, Z}` = 3×3 = 9 sets

Check that it doesn't exceed your plan's limit before pressing Send.

---

## Summary

Permutations are a powerful time-saving tool. Use `{option1, option2}` in the Prompt to create several variations at once. It's good for testing a Concept, A/B Testing for Marketing, or comparing various Color Schemes and styles before choosing the final direction.
