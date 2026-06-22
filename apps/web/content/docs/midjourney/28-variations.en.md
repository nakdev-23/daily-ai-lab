---
title: "Variations — create similar images with adjustments"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the Variations feature to create new images similar to a chosen image, with Subtle and Strong options for controlling the level of change"
readTime: "5 min"
readers: "0"
locked: false
order: 28
---

# Variations — create similar images with adjustments

> Main reference: [Variations](https://docs.midjourney.com/hc/en-us/articles/32692978437005-Variations)

---

## What are Variations

Variations (a feature that creates a new image from a chosen one, keeping the main concept but changing the details) lets you Iterate from an "almost good" image into a "really good" one.

---

## Types of Variations

### Vary (Subtle)
- Changes the details slightly
- The main structure, color, and Composition stay the same
- Good when: you like the image a lot but want slight Refinement

### Vary (Strong)
- Changes more, may have new elements
- Still keeps the main concept from the original Prompt
- Good when: you want a new option still within the same "theme"

---

## How to use

### On the website
1. Click the image you want
2. Choose **"Vary (Subtle)"** or **"Vary (Strong)"**
3. Wait for a new set of 4 images

### On Discord
After creating an image:
- Press **V1, V2, V3, V4** under the image (Strong-type Variation)

---

## Vary Region (edit only a part)

Vary Region (adjusting a specific area — selecting a part of the image and creating new content only in that part) lets you edit only the part you want:

1. Click **"Vary (Region)"**
2. Draw the area you want to change
3. Type a new Prompt for that area
4. Generate

**Example:**
- Want to change the sky in the image
- Want to add a person into the scene
- Want to change the character's clothing color

---

## Remix Mode

Remix Mode (an edit-while-changing-the-Prompt mode — lets you edit the Prompt while doing a Vary) lets you change the Prompt while making a Variation:

1. Enable Remix Mode in Settings
2. Click Vary
3. The Prompt box appears for you to edit
4. Adjust the Prompt and press Generate

**Example:**
```
Before: a forest in summer
Press Vary + change the Prompt to: a forest in winter
```
→ get a winter forest image with a structure similar to the original summer forest

---

## Variation usage strategy

### The recommended Workflow
1. Create the first image with a Prompt
2. If you don't like it at all → Re-run with an improved Prompt
3. If it's "almost good" → Vary (Subtle) 2-3 rounds
4. If you want a new option → Vary (Strong)
5. If you want to fix only a part → Vary (Region)

---

## High Variation vs Low Variation Mode

In Settings, you can set the default Variation mode:
- **High Variation Mode** — Vary changes a lot (like Vary Strong)
- **Low Variation Mode** — Vary changes little (like Vary Subtle)

Set it at:
- Discord: `/settings` → choose High/Low Variation
- Web: Settings → Variation Mode

---

## Variation and Seed

If you want a reproducible Variation:
```
a landscape --seed 42
Press Vary Subtle → save the resulting image + Job ID
```

Next time, use the same Job ID and Vary again to get the same set of images.

---

## A real Iteration example

**Project: design a Character for a game**

```
Round 1: "a female warrior, fantasy armor" --chaos 50
→ choose the pose you like

Round 2: Vary Subtle on the chosen image ×3
→ choose the best armor color

Round 3: Vary Region on the face
→ adjust the hair and eye color

Round 4: Upscale Creative
→ a high-resolution Final piece
```

---

## Summary

Variations are an indispensable Iteration tool. Use Vary Subtle when you're almost satisfied and want slight Refinement, Vary Strong when you want a new option in the same direction, and Vary Region when you want to fix only a part. Combined with Remix Mode, you can Iterate more directedly and efficiently.
