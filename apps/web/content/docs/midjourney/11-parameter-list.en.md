---
title: "The full Parameter list"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "A reference guide to every Midjourney Parameter, with explanations and usage examples"
readTime: "10 min"
readers: "0"
locked: false
order: 11
---

# The full Parameter list

> Main reference: [Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List)

---

## What is a Parameter

A Parameter (a special command — an extra option that controls the image result) is a command added at the end of the Prompt with the `--` mark to adjust the result.

**Format:**
```
/imagine prompt: [image description] --[parameter] [value]
```

**Example:**
```
/imagine prompt: a serene lake --ar 16:9 --stylize 500 --v 6
```

---

## Main Parameters

### --ar or --aspect (Aspect Ratio)
Sets the width-to-height ratio of the image

```
--ar 1:1      → a square image (Instagram)
--ar 16:9     → a landscape image (wallpaper, video)
--ar 9:16     → a vertical image (Story, TikTok)
--ar 4:3      → a standard image
--ar 3:2      → a general photo
--ar 21:9     → an Ultrawide image
```

### --v or --version (Model Version)
Choose the AI version used to create the image

```
--v 7         → version 7 (latest as of 2025)
--v 6.1       → version 6.1 
--v 6         → version 6
--v 5.2       → version 5.2 (old style)
--niji 6      → the Anime-style model
```

### --stylize or --s (Stylize)
Controls how much "artistry" Midjourney adds

```
--stylize 0      → the least — closest to the Prompt, but looks plain
--stylize 100    → the default
--stylize 500    → beautiful, smooth, but may stray from the Prompt
--stylize 1000   → maximum artistry — very beautiful, but interprets the Prompt freely
```

**Can be shortened to `--s`:**
```
a forest --s 750
```

---

## Detail-adjusting Parameters

### --chaos or --c (Chaos)
Adjusts the variety among the 4 images created

```
--chaos 0     → the 4 images are very similar (default)
--chaos 50    → moderate variety
--chaos 100   → the 4 images differ the most
```

### --weird or --w (Weird)
Adds strangeness, the unusual, to the image

```
--weird 0     → normal (default)
--weird 1000  → extremely weird
--weird 250   → adds interest without being too weird
```

### --quality or --q (Quality)
Adjusts the Render time

```
--quality 0.25  → very fast, low quality
--quality 0.5   → fast
--quality 1     → the default — balanced
```

### --seed (Seed)
Sets the starting value of the Random (makes the result the same every time)

```
--seed 12345    → use any number 0-4294967295
```

Benefit: recreate the same image even with the same Prompt, or compare the difference of Prompts

---

## Content-controlling Parameters

### --no (Negative Prompt)
Specify what you don't want to appear in the image

```
a beach --no people
a forest --no buildings, roads, cars
a portrait --no glasses, hats
```

### --tile (Tile — create a Pattern)
Create an image that tiles Seamlessly

```
a floral pattern --tile
```

Good for: Backgrounds, Textures, design Patterns

### --repeat or --r (Repeat)
Create images from the same Prompt several times at once

```
a sunset --repeat 4
```
Meaning: create 4 sets of images from the same Prompt (uses more GPU Time)

---

## Special-style Parameters

### --style raw (Raw Mode)
Turns off the AI's embellishment to match the Prompt as closely as possible

```
a product photo of headphones --style raw
```

Good for: photos, Commercial work needing directness

### --niji (Niji — the Anime model)
Uses the special model for Anime and Illustration styles

```
a warrior princess --niji 6
```

---

## Image-reference Parameters

### --sref (Style Reference)
Use an image to reference the style

```
a mountain landscape --sref https://example.com/style.jpg
```

### --cref (Character Reference)
Use an image to keep the same character

```
the same character in a new scene --cref https://example.com/character.jpg
```

### --iw (Image Weight)
Control the influence of an Image Prompt

```
[image URL] a new scene --iw 1.5
```

---

## Quick Reference table

| Parameter | Short | Value | Use when |
|-----------|-----|-----|---------|
| `--aspect` | `--ar` | W:H e.g. 16:9 | adjusting the image ratio |
| `--version` | `--v` | 5, 6, 7 | choosing the AI version |
| `--stylize` | `--s` | 0-1000 | adjusting the beauty |
| `--chaos` | `--c` | 0-100 | adjusting the variety |
| `--weird` | `--w` | 0-3000 | adding strangeness |
| `--quality` | `--q` | 0.25-1 | adjusting quality |
| `--seed` | - | 0-4294967295 | reproducing a result |
| `--no` | - | various words | removing unwanted things |
| `--tile` | - | (no value) | creating a Pattern |
| `--repeat` | `--r` | 1-40 | creating several times |
| `--style raw` | - | raw | raw mode, no embellishment |
| `--niji` | - | 5, 6 | Anime style |

---

## Examples of combining Parameters

```
a serene japanese garden at dawn, koi pond, cherry blossoms 
--ar 3:2 --v 6.1 --stylize 400 --no people --seed 42
```

```
cyberpunk street market --ar 9:16 --weird 500 --stylize 750 --v 7
```

---

## Summary

Parameters are powerful adjustment tools. Start with `--ar` to set the ratio and `--v` to choose the version, then gradually add `--stylize`, `--chaos`, `--weird` as needed. Once familiar, Parameters help you control the result precisely.
