---
title: "Aspect Ratio"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to set the image's Aspect Ratio with the --ar Parameter to get the right image size for your use"
readTime: "5 min"
readers: "0"
locked: false
order: 12
---

# Aspect Ratio

> Main reference: [Aspect Ratio](https://docs.midjourney.com/hc/en-us/articles/31894244298125-Aspect-Ratio)

---

## What is Aspect Ratio

Aspect Ratio (the ratio between the width and height of the image) sets the shape of the image Midjourney creates.

Examples:
- `1:1` = a square (1 part wide, 1 part tall)
- `16:9` = a landscape image (16 parts wide, 9 parts tall)
- `9:16` = a vertical image (9 parts wide, 16 parts tall)

---

## How to use

Use the `--ar` or `--aspect` Parameter at the end of the Prompt:

```
a beautiful sunset --ar 16:9
```

```
a portrait of a woman --ar 2:3
```

---

## Popular ratios

| Aspect Ratio | Shape | Use |
|-------------|---------|----------|
| **1:1** | square | Instagram posts, profile pictures |
| **4:3** | standard landscape | general print, presentations |
| **3:2** | photo landscape | DSLR photos, cards |
| **16:9** | Widescreen | video, wallpaper, YouTube |
| **21:9** | Ultrawide | ultrawide screens, banner images |
| **2:3** | standard portrait | posters, book covers |
| **9:16** | Vertical | Instagram Story, TikTok, Reels |
| **3:4** | general portrait | Pinterest, blog posts |

---

## Examples of choosing by platform

### Social Media

```
a product photo of sneakers --ar 1:1
```
→ for an Instagram Feed post

```
a fashion model portrait --ar 9:16
```
→ for Instagram Story / TikTok

```
a landscape photo --ar 16:9
```
→ for a YouTube Thumbnail or Facebook Cover

### Print work

```
a movie poster design --ar 2:3
```
→ a standard poster (e.g. A4 vertical)

```
a business card design --ar 7:4
```
→ a business card

```
a book cover design --ar 2:3
```
→ a book cover

### Digital work

```
a website hero banner --ar 21:9
```
→ a website banner

```
a wallpaper for desktop --ar 16:9
```
→ a computer wallpaper

---

## Limitations of Aspect Ratio

- The maximum ratio Midjourney supported was **2:1** to **1:2** in older versions
- Version 5 and up supports wider ratios, such as **1:3** or **3:1**
- Very unusual ratios may give strange results

---

## Image Size and Resolution

Aspect Ratio doesn't directly set the Pixel (the smallest dot in a digital image) size, but the shape.

Images Midjourney creates have a resolution of about **1024x1024 pixels** (for 1:1) and adjust per the Aspect Ratio:
- `--ar 16:9` → about 1456x816 pixels
- `--ar 9:16` → about 816x1456 pixels

If you want higher resolution, use **Upscale** after creating the image.

---

## Tips

1. **Plan before creating** — know where you'll use the image, then choose a suitable Aspect Ratio
2. **Test several Ratios** — sometimes a different Aspect Ratio gives a different Composition
3. **Use broad numbers** — `--ar 16:9` and `--ar 32:18` give the same result, but the first is easier
4. **Vertical for Portraits** — person images often look good at `--ar 2:3` or `--ar 3:4`

---

## Summary

`--ar` or `--aspect` is the most frequently used Parameter. Choose the ratio matching your use: `1:1` for Instagram, `9:16` for Story, `16:9` for video, and `2:3` for posters.
