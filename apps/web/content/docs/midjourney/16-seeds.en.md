---
title: "Seeds — reproduce results"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the --seed Parameter to reproduce the same result or create consistent image sets"
readTime: "5 min"
readers: "0"
locked: false
order: 16
---

# Seeds — reproduce results

> Main reference: [Seeds](https://docs.midjourney.com/hc/en-us/articles/32604356340877-Seeds)

---

## What is a Seed

A Seed (the random starting value — a number used as the starting point for creating an image; the same number gives the same result) is the number that determines from "which point" in the AI system Midjourney starts creating an image.

Normally, if you use the same Prompt twice, you get different images, because Midjourney randomizes a new Seed each time.

But if you specify a fixed Seed, Midjourney uses the same starting point, getting the same image every time.

---

## How to use

```
[Prompt] --seed [a number from 0 to 4294967295]
```

**Example:**
```
a serene lake at dawn --seed 12345
```

Every time you use this Prompt with Seed 12345, you get the same set of images.

---

## How to find the Seed of a created image

### On Discord
1. Click the ✉️ Emoji (Envelope) on the image message
2. The Midjourney Bot sends a DM with the Job ID and Seed Number
3. Save the Seed to reuse

### On the website
1. Click the image → choose "Copy Job ID"
2. Or see it from the image details in the Archive

---

## Benefits of Seed

### 1. Reproduce a result you like
If you get an image you like but want to adjust the Prompt slightly, use the same Seed to keep the main structure:

```
a woman in a red dress, park background --seed 42
```
Adjust to:
```
a woman in a blue dress, park background --seed 42
```
→ the structure and main composition stay similar, just the dress color changes

### 2. Create consistent image sets
For an Illustration Series or Character Sheet (a set of character images from various angles):

```
a knight character, front view --seed 500
a knight character, side view --seed 500
a knight character, back view --seed 500
```
→ the character is consistent across angles

### 3. Test variables
To compare the effects of various Parameters on the same base:

```
a forest --seed 999 --stylize 100
a forest --seed 999 --stylize 750
a forest --seed 999 --stylize 1000
```
→ clearly see the difference of Stylize

---

## Limitations

- The same Seed with the same Prompt gives the same result, but if you change the **Model version**, you may get a different result
- A Seed isn't a 100% Guarantee of an identical image down to every pixel, but it'll be very close

---

## Summary

`--seed` is a tool for Workflows needing consistency. Use it when you want to reproduce a result, compare variables, or create a consistent set of character images.
