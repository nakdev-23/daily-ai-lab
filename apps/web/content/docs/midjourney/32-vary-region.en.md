---
title: "Vary Region — edit only an area"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use Vary Region to select a specific area in an image and create new content only in that part, good for editing detail or adding elements"
readTime: "5 min"
readers: "0"
locked: false
order: 32
---

# Vary Region — edit only an area

> Main reference: [Vary Region](https://docs.midjourney.com/hc/en-us/articles/32794723105549-Vary-Region)

---

## What is Vary Region

Vary Region (adjusting a specific area — selecting a part of the image and having Midjourney create new content only in that area, leaving the rest unchanged) is similar to the Inpainting feature (editing the part you want without changing the rest) in Photoshop.

---

## How to use

1. Upscale the image you want first
2. Click **"Vary (Region)"**
3. The drawing tools appear:
   - **Rectangle** — draw a rectangle to select an area
   - **Lasso** — draw freely to select an area
4. Draw to select the area you want to edit
5. Type a Prompt for that area (not required but recommended)
6. Click Generate

---

## Usage examples

### Edit the sky
```
Original image: a landscape with a white sky
Draw to select the sky + Prompt: "dramatic sunset sky, orange and pink clouds"
Result: the same landscape, but with a beautiful sky
```

### Change clothing
```
Original image: a character wearing a blue outfit
Draw to select the clothing + Prompt: "wearing a red dress"
Result: the same character but in a red outfit
```

### Add an element
```
Original image: a mountain landscape
Draw to select an empty area + Prompt: "a lone wolf silhouette"
Result: a wolf appears in the selected area
```

### Edit the face
```
Original image: a Portrait that looks good but the face isn't realistic
Draw to select the face + Prompt: "realistic face, detailed features"
Result: a more realistic face
```

---

## Vary Region tips

1. **Don't select too small an area** — if you select very small, Midjourney may not be able to create good content
2. **Always add a Prompt** — although not required, it helps the result match what you want
3. **Try Generating several times** — each time may give a different result
4. **You don't have to Upscale first** — but Upscaling first gives better quality

---

## Limitations

- Changing a complex central part of the image may give inconsistent results
- The selected area must not exceed 75% of the image (if more than this, use Variation instead)

---

## Drawing tool options

In Vary Region there are 2 area-selection tools:

### Rectangle
- Draw to select a rectangular area
- Good for areas with straight edges, such as the sky, background

### Lasso (freestyle)
- Draw freely to select per the shape you want
- Good for areas with a complex shape, such as a person's shape, an object

---

## Vary Region and the Editor

Vary Region is part of the Editor too:
- **Vary Region** on the main page = opens a separate window
- **Repaint in the Editor** = works the same, but with additional other tools

---

## A good Prompt for Vary Region

Once you've selected the area, add a Prompt that:
- Says **what** you want in that area
- Doesn't describe the rest of the image
- Uses a description consistent with the rest of the image

**Good Prompt examples:**
```
"dramatic sunset sky with orange and purple clouds"  ← for the sky area
"a black cat sitting on a cushion"  ← for the sofa area
```

---

## Summary

Vary Region is a powerful Editing tool that lets you edit a specific spot without destroying the good parts of the image. Use Rectangle to select simple areas, or Lasso to select complex-shaped areas. It's good for the final Fine-tune before using the image.
