---
title: "Raw Mode — raw, no embellishment"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Learn Raw Mode, which turns off Midjourney's automatic embellishment to get an image that follows the Prompt most closely"
readTime: "4 min"
readers: "0"
locked: false
order: 19
---

# Raw Mode — raw, no embellishment

> Main reference: [Raw](https://docs.midjourney.com/hc/en-us/articles/32634113811853-Raw)

---

## What is Raw Mode

`--style raw` (a mode that turns off Midjourney's automatic style or embellishment to get an image that follows the Prompt as closely as possible) makes Midjourney not add its own Aesthetic to the image.

Normally, Midjourney "interprets" the Prompt in the way it thinks is most beautiful. Raw Mode turns off that interpretation.

---

## How to use

```
[Prompt] --style raw
```

**Example:**
```
a product photo of a camera on white background --style raw
a technical diagram of a bicycle --style raw
a portrait photo --style raw
```

---

## Comparing Normal vs Raw

| Mode | Result |
|------|---------|
| Normal (no --style raw) | Midjourney adds Mood, color, style to its taste |
| `--style raw` | follows the Prompt directly, no added embellishment |

**Example:**
```
Prompt: a red apple
Normal:  a beautiful apple image, perhaps nice light, an artistic background
Raw:     a straightforward red apple on a white background
```

---

## What work is it good for

### Commercial Photography
```
a bottle of perfume, studio shot --style raw
```
→ get a Clean product image with no excessive embellishment

### Technical Illustration
```
a schematic diagram of a car engine --style raw
```
→ get a straightforward image with no added Artistry

### Testing a Prompt
```
a city skyline --style raw
```
→ see how Midjourney understands the Prompt without "help enhancing"

---

## Raw Mode vs Stylize 0

| `--style raw` | `--stylize 0` |
|--------------|---------------|
| turns off all embellishment | reduces Stylize but still has some processing |
| follows the Prompt the most | closer than the default, but not as much as Raw |

---

## Examples of using Raw Mode

### Product Photography
```
a bottle of olive oil on marble surface, studio photography --style raw
```
→ get a Clean, straightforward image with no added AI embellishment

### Food Photography
```
spaghetti carbonara in a white bowl, top view --style raw
```
→ a realistic food image with no light or Mood Midjourney adds itself

### Architecture
```
modern office building exterior, blue sky, daytime --style raw
```
→ a building image that follows the Prompt, with no added Mood or Filter

---

## Raw Mode and Realistic Photography

Raw Mode often gives a "more realistic" result in photography:

| Mode | Photo result |
|------|----------|
| Normal | may add a Cinematic Look, Grain, Color Grading |
| Raw Mode | a clean, straightforward image, like a real photo |

---

## Raw and the Niji Model

In the Niji Model, use `--style cute`, `--style scenic`, or `--style expressive` instead of `--style raw`, because Niji has its own specific style options.

---

## When to avoid Raw Mode

- Creative work needing high beauty → use high Stylize instead
- Artistic work needing interpretation → let Midjourney decide
- Fantasy/Sci-Fi work needing a special atmosphere → Raw makes it look plain

---

## Summary

Use `--style raw` when you want a result that follows the Prompt with no embellishment from Midjourney. It's good for Commercial Photography, Technical Illustration, and work needing maximum realism. Avoid Raw Mode for Creative work needing beauty and Atmosphere.
