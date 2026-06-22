---
title: "Prompt basics"
tool: "Midjourney"
icon: "tool-midjourney"
level: "intermediate"
summary: "Learn how to write Prompts effectively, the good structure of a Prompt, and examples that help you get the image you want"
readTime: "8 min"
readers: "0"
locked: false
order: 7
---

# Prompt basics

> Main reference: [Prompt Basics](https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics)

---

## What is a Prompt

A Prompt (the command you type for the AI to create an image — like telling it what kind of image you want) is the text you type to communicate to Midjourney what kind of image you want.

For example:
- `a cat` → a general cat image
- `a fluffy orange cat sitting on a windowsill, soft afternoon light, photorealistic` → an image of a fluffy orange cat sitting by a window, soft afternoon light, a realistic image

The more detail you specify, the more the result matches what you want.

---

## The structure of a good Prompt

An effective Prompt usually consists of:

```
[Subject] + [Environment] + [Style] + [additional detail]
```

### Examples

**Simple:**
```
a wolf howling at the moon
```

**More detailed:**
```
a wolf howling at the full moon, dense pine forest, foggy night, dramatic lighting, oil painting style
```

**Advanced:**
```
a majestic wolf howling at the full moon, dense pine forest at midnight, thick fog, dramatic blue moonlight, hyperdetailed fur, oil painting by Ivan Shishkin, 8k resolution
```

---

## The components of a Prompt

### 1. Subject (the main thing you want to appear in the image)
Says what the image is about:
- People: `a young woman`, `an elderly man`, `a child`
- Animals: `a golden retriever`, `a dragon`, `a butterfly`
- Places: `a mountain village`, `a space station`, `a medieval castle`
- Objects: `a vintage camera`, `a glowing sword`, `a teacup`

### 2. Style (the artistic form)
Says what kind of image you want:

| Style | Words to use |
|-------|---------|
| Realistic photo | `photorealistic`, `photography`, `DSLR photo` |
| Hand-drawn | `oil painting`, `watercolor`, `pencil sketch` |
| Cartoon | `anime style`, `cartoon`, `comic book` |
| Digital art | `digital art`, `concept art`, `illustration` |
| Vintage | `vintage`, `retro`, `1950s style` |
| Cinematic | `cinematic`, `movie still`, `film photography` |

### 3. Lighting (the lighting atmosphere in the image)
Light greatly affects the image's mood:
- `golden hour` — the golden light of morning or evening
- `dramatic lighting` — intense light creating atmosphere
- `soft light` — soft, gentle light
- `studio lighting` — studio light
- `neon lights` — bright neon lights

### 4. Mood (the feeling the image should convey)
- `peaceful`, `serene` — calm, quiet
- `dramatic`, `intense` — fierce, intense
- `playful`, `cheerful` — fun
- `mysterious`, `eerie` — mysterious, creepy

### 5. Composition (the viewpoint and layout of the image)
- `close-up portrait` — a close image emphasizing the face
- `wide angle shot` — a wide angle
- `aerial view` / `bird's eye view` — a view from above
- `eye level` — an eye-level angle
- `symmetrical composition` — a symmetrical composition

---

## Rules for writing a Prompt

### ✅ What to do
- **Use English** — gives the best results
- **State important details** — say the main color, mood, style
- **Separate with commas** — e.g. `a cat, fluffy fur, orange color, sunny day`
- **Order from important to less** — what's at the start of the Prompt carries more weight

### ❌ What to avoid
- Don't type too long unnecessarily — Midjourney processes a Prompt well even if it's not very long
- Avoid contradictory words, e.g. `dark bright image`
- No need to use formal language or perfect grammar

---

## Using Weights

You can assign a Weight (the level of importance) to various parts of the Prompt:

```
hot dog:: 5 cat:: 2
```

Meaning: give more importance to "hot dog" than "cat"

Or use a minus sign to reduce the weight:
```
beautiful landscape:: flowers::-0.5
```

Meaning: a beautiful landscape image, but with fewer flowers

---

## Multi-Prompts

Use `::` to separate the Prompt into parts:

```
space ship:: rocket engine:: alien planet
```

Each part is processed separately, then combined. This differs from:

```
space ship rocket engine alien planet
```

which Midjourney processes as a single Phrase.

---

## Real Prompt examples

### A Portrait image
```
portrait of a young Thai woman, traditional costume, temple background, soft golden light, detailed, professional photography
```

### A nature image
```
misty mountain valley at sunrise, cherry blossoms, reflection in still water, peaceful, landscape photography
```

### An architecture image
```
ancient Thai temple at twilight, dramatic sky, intricate golden details, long exposure photography
```

### A fantasy image
```
magical forest with glowing mushrooms, fairies, moonlight filtering through trees, fantasy art, highly detailed
```

---

## Advanced tips

1. **Look at Explore** — find images you like and look at the Prompt to learn the patterns
2. **Add an artist's name** — e.g. `in the style of Claude Monet` or `inspired by Studio Ghibli`
3. **Specify camera details** — e.g. `shot on Canon 5D, 85mm lens, f/1.8` for a realistic image
4. **Test repeatedly** — the same Prompt gives different results each time; try several rounds

---

## Summary

A good Prompt is a clear Prompt that clearly specifies the Subject, Style, Lighting, and Mood. Start simple, then add detail one at a time until you get the result you want. Learning to write good Prompts is a skill that improves with practice.
