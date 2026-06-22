---
title: "Multi-Prompts and Prompt Weights"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Techniques for using Multi-Prompts to separate and control the weight of each part of a Prompt for a more precise result"
readTime: "6 min"
readers: "0"
locked: false
order: 10
---

# Multi-Prompts and Prompt Weights

> Main reference: [Multi-Prompts Weights](https://docs.midjourney.com/hc/en-us/articles/32658968492557-Multi-Prompts-Weights)

---

## What are Multi-Prompts

Normally, when you type `hot dog`, Midjourney sees it as a single Phrase and creates an image of a "hot dog" (the food).

But what if you want an image of a "hot dog" (a dog that's hot)?

This is where Multi-Prompts (separating the Prompt — a technique of dividing the command into parts so the AI processes them separately) is useful.

### How to use `::` (Double Colon)
The `::` mark separates the Prompt into parts that are processed separately:

```
hot:: dog
```
Result: a dog that looks hot (not a hot dog)

```
hot dog
```
Result: a hot dog (the food)

---

## Prompt Weights

### The principle
After the `::` mark, you can specify a number to set the weight:

```
[Prompt A]::[weight A] [Prompt B]::[weight B]
```

**Example:**
```
forest:: 2 waterfall:: 1
```
Meaning: emphasize the forest 2 times more than the waterfall

### Default weight value
If unspecified, every part has an equal weight of `1`:
```
forest:: waterfall::
```
= is equal to
```
forest:: 1 waterfall:: 1
```

### Weights can be decimals
```
epic castle:: 1.5 surrounded by dragons:: 0.5
```
Meaning: emphasize the castle heavily, dragons are a secondary detail

---

## Usage examples

### Example 1 — blend concepts
```
vibrant watercolor painting:: tropical jungle:: glowing neon lights::
```
Result: a vibrant watercolor image of a tropical jungle with neon lights

### Example 2 — emphasize what's important
```
majestic lion:: 3 savanna landscape:: 1
```
Result: the lion is the main subject, the savanna landscape is the background

### Example 3 — separate potentially confusing concepts
```
apple:: fruit:: 2 apple:: technology company:: 0.5
```
Result: emphasize the apple fruit, not the company logo

---

## Negative Weights

You can use negative weights to "remove" something from the image:

```
beautiful forest:: colorful flowers::-1
```
Meaning: want a beautiful forest, but don't want brightly colored flowers

> **Note:** The total of all weights must not equal 0 or be negative, otherwise Midjourney shows an Error.

---

## The difference between Multi-Prompts and --no

| Method | How it works |
|------|---------|
| `flowers::-1` | reduces the weight of flowers (some may still remain) |
| `--no flowers` | tries to remove flowers entirely |

Use `--no` when you seriously want to avoid that thing.

---

## Combining Multi-Prompts with Parameters

Multi-Prompts work with Parameters:

```
epic dragon:: 2 ancient ruins:: 1 --ar 16:9 --stylize 500
```

The Parameters apply to the whole image, not just one part.

---

## Real use cases

### Create an image blending two concepts
```
ocean:: 1 sky:: 1 reflection:: 2
```
Emphasizing reflection gives the image depth.

### Control style and content separately
```
a warrior in battle:: 2 oil painting technique:: 1 dramatic lighting:: 1
```

### Blend two eras
```
ancient Egyptian architecture:: medieval European castle::
```

---

## Tips

1. **Start with equal weights** — see the result first, then adjust the weights
2. **Use simple numbers** — values of 1, 2, 3 are usually enough; no need to be very precise
3. **Test with a plain Prompt first** — to understand how Midjourney interprets a Phrase
4. **Combine with `--no`** — use Multi-Prompts to emphasize, and `--no` to avoid

---

## Summary

Multi-Prompts with `::` let you control the blending of concepts in a Prompt precisely. Use it when you want to separate potentially confusing words, or when you want to emphasize one part more. Prompt Weights let you adjust the proportion of each element as you wish.
