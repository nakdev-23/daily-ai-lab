---
title: "Image Prompts — use images as commands"
tool: "Midjourney"
icon: "tool-midjourney"
level: "intermediate"
summary: "How to use images as a Prompt so Midjourney creates new images inspired by or referencing the style of an image you provide"
readTime: "6 min"
readers: "0"
locked: false
order: 8
---

# Image Prompts — use images as commands

> Main reference: [Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)

---

## What is an Image Prompt

An Image Prompt (using an image as a command — giving the AI an image for inspiration instead of typing a description) lets you use an existing image as part of the Prompt, instead of or in addition to a text description.

Midjourney analyzes the image you provide, then creates a new image referencing:
- The artistic style
- The colors and atmosphere
- The composition and structure
- The content in the image

---

## How to use an Image Prompt

### On the website
1. Click the **Image icon** in the Prompt bar
2. Choose **"Upload from device"** or **"Paste URL"**
3. Add a text description (if you want) after the image
4. Click Generate

### On Discord
Put the image's URL before the Prompt:
```
/imagine prompt: https://example.com/your-image.jpg a beautiful landscape
```

> **Important:** The image URL must end with `.jpg`, `.png`, `.gif`, `.webp` and be a publicly accessible link.

### How to upload an image on Discord
1. Drag the image into the Discord chat box first
2. Discord uploads it and creates a link for you
3. Copy the URL and use it in `/imagine`

---

## Image Weight

The `--iw` Parameter (Image Weight — the weight given to the source image) controls how much influence the source image has:

| `--iw` value | Meaning |
|-----------|---------|
| 0.5 | the new image differs greatly from the source |
| 1.0 | the default — a balanced blend |
| 2.0 | the new image is more similar to the source |

**Example:**
```
/imagine prompt: https://example.com/photo.jpg cyberpunk city --iw 1.5
```

---

## Combining multiple Image Prompts

You can use several images at once:
```
/imagine prompt: [image URL 1] [image URL 2] blend these two styles together
```

Midjourney blends the styles and compositions from both images.

---

## Blend Command

For blending images specifically, use the `/blend` command (on both web and Discord):

```
/blend
```

Then upload 2-5 images, and the system blends all the images together.

> See more details in the "Blend Images" topic.

---

## Hosting images on Discord

If you want a stable image link:
1. Drag the image into the Discord chat box (don't send it)
2. Right-click the uploaded image → Copy Link
3. Use this link in the Image Prompt

> **Note:** Discord links may expire; use a permanent image-hosting service such as Imgur or Google Drive for long-term work.

---

## Real usage examples

### Transfer an artist's style
```
/imagine prompt: [URL of a painting in a style you like] a portrait of a woman --iw 1.0
```
Result: a portrait in the same style as the source image

### Redesign a product
```
/imagine prompt: [URL of the original product photo] futuristic redesign, product photography
```
Result: the original product image redesigned in a futuristic style

### Create images in the same theme
```
/imagine prompt: [source image URL] autumn forest version --iw 0.8
```
Result: a new image with similar composition but in an autumn atmosphere

---

## Limitations and cautions

1. **Copyright** — don't use copyrighted images as a Prompt without permission
2. **Photos of people** — beware of using real people's photos to create new images; it may violate Privacy
3. **The image must be accessible** — the link must be public, not one that requires login first

---

## Tips

1. **Try inserting an image without text** — to see how Midjourney interprets your image
2. **Combine with Style Reference** — use with `--sref` to control the style in detail
3. **Adjust --iw first** — before adding detail to the Prompt, try adjusting the Image Weight value first
4. **Use a high-quality image** — a clear, detailed source image gives a better result

---

## Summary

The Image Prompt is a powerful tool for transferring a style or composition from one image to a new one. Use it with a Text Prompt to control the result more precisely, and adjust `--iw` to set how much influence the source image has.
