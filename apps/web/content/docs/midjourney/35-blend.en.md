---
title: "Blend — combine multiple images"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the /blend command to combine 2-5 images, creating a new image that takes the Essence of every image and mixes them together"
readTime: "5 min"
readers: "0"
locked: false
order: 35
---

# Blend — combine multiple images

> Main reference: [Blend Images in Discord](https://docs.midjourney.com/hc/en-us/articles/32635189884557-Blend-Images-in-Discord)

---

## What is Blend

The `/blend` command (combining images — using several images as Input and having Midjourney create a new image that blends the Essence, style, and elements from every image) works like multiple Image Prompts, but is designed specifically for blending images.

---

## How to use

### On Discord
1. Type `/blend`
2. The upload boxes appear — upload 2 images (required)
3. You can add a 3rd, 4th, 5th image optionally
4. Press Enter

### On the website
1. In the Prompt box, click the image-upload icon
2. Upload several images
3. Midjourney blends them automatically

---

## Important details

- Supports **2-5 images** at once
- No Text Prompt — uses only images
- If you also want a Text Prompt, use `/imagine` + Image URL instead

---

## Usage examples

### Blend 2 art styles
```
Image 1: a Watercolor flower image
Image 2: an Oil Painting landscape
Result: a flower landscape in a style mixing Watercolor and Oil Painting
```

### Blend 2 characters
```
Image 1: a cat character
Image 2: a dragon character
Result: a character with the features of a cat and a dragon mixed
```

### Blend environments
```
Image 1: a dense forest
Image 2: a futuristic city
Result: a forest with Cyberpunk city elements, or a city covered in trees
```

---

## Comparing Blend with Image Prompt

| Method | Use when |
|------|---------|
| `/blend` | you want to blend images without a Text Prompt |
| `/imagine` + Image URLs | you want to blend images + control with a Text Prompt |

---

## Tips

1. **Contrasting images** — give a more interesting result than similar images
2. **Use a consistent Aspect Ratio** — images with similar sizes and ratios blend better
3. **Experiment with the order** — an image placed earlier may carry more weight

---

## Interesting result examples

### Style Transfer
```
Image 1: a photo of a seascape
Image 2: a Van Gogh-style oil painting
Result: a sea painted in a Post-Impressionist style
```

### Character Fusion
```
Image 1: a wolf image
Image 2: a knight image
Result: a wolf knight or a wolf in armor
```

### Environment Mashup
```
Image 1: an underwater image
Image 2: a dense forest image
Result: an underwater forest or a mixed fantasy environment
```

---

## Blend vs Image Prompt — which to use

### Use /blend when:
- You want to blend images simply without a Text Prompt
- You want the AI to decide how to blend
- Experimenting with blending various styles quickly

### Use /imagine + Image URLs when:
- You want to control the result with a Text Prompt
- You want to adjust the Image Weight with `--iw`
- You want to add specific detail

---

## The image order affects the result

The order in which you upload images may affect the result:
- The first image may carry more weight
- Try swapping the order if the result isn't to your liking

---

## Summary

`/blend` is a fast and easy way to combine the styles and elements of several images. It supports 2-5 images and needs no complex Prompt. It's good for quickly experimenting with blending Concepts or Styles. If you want more control, use `/imagine` with Image URLs instead.
