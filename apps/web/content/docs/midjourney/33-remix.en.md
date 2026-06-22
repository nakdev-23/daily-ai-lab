---
title: "Remix Mode — adjust the Prompt while Varying"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use Remix Mode to change the Prompt while doing Variations, helping you Iterate images efficiently"
readTime: "4 min"
readers: "0"
locked: false
order: 33
---

# Remix Mode — adjust the Prompt while Varying

> Main reference: [Remix](https://docs.midjourney.com/hc/en-us/articles/32799074515213-Remix)

---

## What is Remix Mode

Remix Mode (a blend-and-adjust mode — a mode that lets you edit the Prompt while doing a Variation or Upscale, instead of having to use the same Prompt throughout) lets you edit the Prompt during the Vary step.

---

## How to enable Remix Mode

### On the website
- Usually enabled automatically when you Vary
- The Prompt box appears for editing before Generate

### On Discord
1. Type `/settings`
2. Click **"Remix Mode"** to enable it

---

## How to use

1. Create the first image
2. Click **Vary (Subtle)** or **Vary (Strong)**
3. The Prompt box appears with the original Prompt
4. Edit the Prompt as you wish
5. Press Submit

---

## Usage examples

### Change the weather
```
Original image: "a forest in summer"
Remix + Vary Strong: "a forest in winter, snow covered"
Result: a similar forest structure, but changed to winter
```

### Change the style
```
Original image: "a portrait of a woman, photorealistic"
Remix + Vary Subtle: "a portrait of a woman, oil painting style"
Result: the same pose, but in a painting style
```

### Add Parameters
```
Original image: "a dragon"
Remix + add: "a dragon --ar 16:9 --stylize 750"
Result: a similar dragon, but in Widescreen ratio and more beautiful
```

---

## The difference between Remix and Re-run

| Method | Result |
|------|-----|
| **Re-run (🔄)** | creates new from the entire original Prompt |
| **Remix + Vary** | creates new while still linked to the original image |

Remix gives a new image that still has the original's "DNA," unlike Re-run which starts entirely over.

---

## Tips

1. **Change one thing at a time** — to understand which part affects what
2. **Use with Vary Subtle** to change the Prompt but keep the main Composition
3. **Use with Vary Strong** to change direction more

---

## Remix Mode for all Variations

Remix Mode works with every Variation:
- **Vary Subtle** + Remix → change the Prompt slightly + the same Composition
- **Vary Strong** + Remix → change the Prompt a lot + still has the original DNA
- **Zoom Out** + Remix → specify a Prompt for the expanded area
- **Pan** + Remix → specify a Prompt for the panned area

---

## A real Remix Workflow example

### Change the Season
```
Original image: "a forest path in summer"
Remix + Vary Subtle → change to "a forest path in winter, snow on the ground"
Result: the same forest structure, but turned to winter
```

### Change the Time of Day
```
Original image: "a beach at noon, clear sky"
Remix + Vary Strong → "a beach at sunset, golden hour"
Result: the same beach, but a sunset atmosphere
```

### Add a character
```
Original image: "an empty medieval tavern"
Remix + Vary Region (select the middle of the room) → "a group of adventurers drinking"
Result: the same room but with people in it
```

---

## Remix Mode for creating a Series

Create an Image Series that's connected:
```
Image 1: "a hero in the village square"
Remix + Vary → "the hero leaving the village"
Remix + Vary → "the hero on a mountain trail"
Remix + Vary → "the hero arriving at the castle"
```
→ get an image Series with a consistent character and style

---

## Summary

Remix Mode is a powerful Iteration tool that lets you "steer" the development of an image directedly, instead of starting entirely over each time. It's good for work that needs to Evolve an image step by step, or to create a consistent Series.
