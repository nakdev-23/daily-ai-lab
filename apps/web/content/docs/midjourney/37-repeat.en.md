---
title: "Repeat — create several times"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the --repeat Parameter to create several sets of images from the same Prompt at once, good for quickly creating many Assets"
readTime: "4 min"
readers: "0"
locked: false
order: 37
---

# Repeat — create several times

> Main reference: [Repeat](https://docs.midjourney.com/hc/en-us/articles/32757107922061-Repeat)

---

## What is Repeat

The `--repeat` or `--r` Parameter (repeating — telling Midjourney to create several sets of images from the same Prompt at once, each set having 4 images) lets you create several sets of images in one command.

---

## How to use

```
[Prompt] --repeat [number]
```

**Example:**
```
a fantasy landscape --repeat 4
```
→ creates 4 sets of images = 16 images (each set has 4 images)

**Can be shortened:**
```
a fantasy landscape --r 4
```

---

## Maximum Repeat count

| Plan | Max Repeat |
|-----|--------------|
| Basic | 4 |
| Standard | 10 |
| Pro | 40 |
| Mega | 40 |

---

## Repeat vs Permutations

| Method | Use when |
|------|---------|
| `--repeat` | you want several sets of images from the same Prompt (results differ by randomness) |
| `{}` Permutations | you want images from different Prompts |

---

## Usage examples

### Create Stock Images (ready-made images for various uses)
```
diverse people working in office, professional photography --repeat 10
```
→ get 40 images of people working (10 sets × 4 images)

### Find the Best Shot
```
a product photo of perfume bottle --repeat 5
```
→ get 20 options, choose the best

---

## Observations

- Each set uses its own GPU Time (Repeat 4 = uses 4 times the GPU Time)
- Good for the Standard plan and up that has Relax Mode

---

## Combining Repeat with other Parameters

```
a tropical beach --repeat 5 --chaos 50
```
→ get 5 sets of beach images (= 20 images), each set with moderate variety

```
a character design --repeat 3 --seed 42
```
→ get 3 sets of Character images from the same Seed

---

## Repeat for multi-project work

### Create an Asset Library
```
a seamless texture of wood grain --repeat 8 --tile
```
→ get 8 wood Patterns to choose from

### Create Social Media Content
```
a motivational quote background, minimal design --repeat 10
```
→ get 40 Backgrounds for 10 weeks of posts

---

## How to manage GPU Time with Repeat

| Usage | Efficiency |
|--------|-----------|
| Repeat + Fast Mode | fast, but uses a lot of GPU Time |
| Repeat + Relax Mode | slow, but saves GPU Time |
| Repeat + --q 0.5 | fast enough, saves half |

---

## Observations

- Each Repeat is a separate job, visible in the Job Queue
- If you want to cancel, you can cancel each Job individually
- Repeat is best suited to Relax Mode because it uses a lot of resources

---

## Summary

`--repeat` is good for work needing many images from the same Concept. Use it with Relax Mode to save GPU Fast Time. It's good for creating an Asset Library, Stock Content, or work needing many options in one command.
