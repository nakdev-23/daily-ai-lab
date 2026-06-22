---
title: "Style Reference — reference a style from an image"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use --sref to pull a style from a source image into a new Prompt, without copying the image's content"
readTime: "6 min"
readers: "0"
locked: false
order: 23
---

# Style Reference — reference a style from an image

> Main reference: [Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)

---

## What is Style Reference

The `--sref` Parameter (Style Reference — referencing a style from an image, pulling only the drawing manner, colors, and Aesthetic, not the content) lets you apply the style from one image to other content.

**Different from an Image Prompt:**
- `Image Prompt` = references both content and style
- `--sref` = references only the style (Aesthetic, color, drawing manner), takes no content

---

## How to use

```
[Prompt] --sref [style image URL]
```

**Example:**
```
a portrait of a samurai --sref https://example.com/watercolor-style.jpg
a city at night --sref https://example.com/neon-art-style.jpg
```

---

## Style Weight (--sw)

Use `--sw` (Style Weight — controls how much the source style affects the result) to control the strength of the Style Reference:

```
a landscape --sref [URL] --sw 100    → a weak style
a landscape --sref [URL] --sw 500    → a moderate style
a landscape --sref [URL] --sw 1000   → a strong style (maximum value)
```

The default of `--sw` is **100**.

---

## Use multiple Style References at once

```
a forest --sref [URL1] [URL2]
```

Midjourney blends the styles from both images.

---

## Usage examples

### Pull an artist's style
```
a dragon in flight --sref https://example.com/impressionist-painting.jpg
```
→ a dragon drawn in an Impressionist style (a drawing style emphasizing feeling and light over detail)

### Create a Consistent Brand Style
Create several images in the same style:
```
a product photo of headphones --sref [brand style image URL]
a product photo of earbuds --sref [brand style image URL]
a product photo of speaker --sref [brand style image URL]
```

### Change the Medium
```
a cat --sref [URL of a charcoal drawing]
```
→ get a cat image drawn with charcoal

---

## --sref vs --cref

| Parameter | Use to |
|-----------|---------|
| `--sref` | reference the style (Aesthetic, drawing manner, color) |
| `--cref` | reference the character (Character Reference — keep the same character's face) |

---

## Tips

1. **Use an image with a clear style** — an Illustration, Painting, or Artwork with a distinct style gives a better result than a general photo
2. **Adjust --sw** — start from 500, then adjust as needed
3. **Combine with Personalization** — `--sref [URL] --p` blends the reference style with your personal taste

---

## Summary

`--sref` is a powerful tool for creating a Consistent Style across several images, or applying the style from an image you like to new content. Use `--sw` to control the strength of the style.
