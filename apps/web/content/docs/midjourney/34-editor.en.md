---
title: "Editor — advanced image editing"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "An overview of the Editor feature on the Midjourney web, gathering image-editing tools in one place, from Vary Region to Erase and Repaint"
readTime: "6 min"
readers: "0"
locked: false
order: 34
---

# Editor — advanced image editing

> Main reference: [Editor](https://docs.midjourney.com/hc/en-us/articles/32764383466893-Editor)

---

## What is the Editor

The Editor (a built-in image editor — a tool for editing Midjourney-created images directly on the website, with no separate program needed) is a feature gathering image-editing tools on the Midjourney web, letting you work with images directly without going out to Photoshop.

---

## How to enter the Editor

1. Create and Upscale the image first
2. Click **"Edit"** on the image
3. The Editor opens in a new page

---

## Tools in the Editor

### Erase (remove unwanted parts from the image)
- Draw over the part you want to remove
- Midjourney fills new content into the erased area
- Similar to Content-Aware Fill in Photoshop

### Repaint (draw to select an area and have the AI recreate it)
- Select an area and specify a Prompt
- Like Vary Region but with more detailed tools

### Outpaint (expand the image's boundaries beyond the original frame)
- Expand the image in any direction
- Like Zoom Out or Pan but done in the Editor page

### Adjust (edit the Prompt to change the image)
- Adjust the Prompt of the whole image
- Similar to Remix Mode

---

## The Editor workflow

### Scenario 1 — edit small details
1. Upscale the image
2. Open the Editor
3. Use Erase to remove unwanted parts
4. Midjourney fills the erased part with AI automatically

### Scenario 2 — change an important part
1. Upscale the image
2. Open the Editor
3. Use Repaint + Prompt to change the part you want

### Scenario 3 — create a wider image
1. Upscale the image
2. Open the Editor
3. Use Outpaint to expand in various directions

---

## Real examples of using the Editor

### Remove distractions
```
A landscape image with power lines in it
→ Erase the power line part
→ Midjourney fills the sky into that area
```

### Change the background
```
A Portrait with a white background
→ Repaint the background + Prompt: "lush garden, soft bokeh"
→ get the same Portrait but with a garden background
```

### Expand for a Banner
```
A 1:1 image
→ Outpaint left and right
→ get a 16:9 image for a Banner
```

---

## Tips

1. **Save often** — the Editor has no Auto-save
2. **Do it step by step** — editing one part at a time controls the result better
3. **Use Erase + Prompt** — specifying what you want in the erased area gives a better result than letting the AI guess

---

## Summary

The Editor is a convenient hub of image-editing tools, combining Vary Region, Zoom Out, Pan, and the Erase/Repaint features in one place. It's good for the final Fine-tune of an image before using it.
