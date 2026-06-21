---
title: "Using DALL·E in ChatGPT — how to create images through chat"
tool: "DALL·E"
icon: "icon-docs"
level: "beginner"
summary: "How to use DALL·E to create images directly in ChatGPT without coding, plus techniques and limits worth knowing"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---
# Using DALL·E in ChatGPT — how to create images through chat

> Primary reference: [DALL·E 3 in ChatGPT — OpenAI Help Center](https://help.openai.com/en/articles/6679295-dall-e-3-in-chatgpt)

---

## Overview

ChatGPT has DALL·E 3 built in, letting you create images directly from the conversation — no separate subscription, no coding, and no technical knowledge needed. Just type a description of the image you want and ChatGPT calls DALL·E automatically.

---

## Who can use it

DALL·E in ChatGPT is supported on these plans:

| Plan | Can use DALL·E? |
|---|---|
| ChatGPT Free | ❌ Not supported |
| ChatGPT Plus ($20/month) | ✅ Available |
| ChatGPT Pro ($200/month) | ✅ Available |
| ChatGPT Team | ✅ Available |
| ChatGPT Enterprise | ✅ Available |

> **Note:** The free plan doesn't support DALL·E; you must upgrade (raise your plan tier) to Plus or above to use it.

---

## How to create an image in ChatGPT

### Basic steps

1. Open [chatgpt.com](https://chatgpt.com) and log in
2. Start a new chat or use an existing one
3. Type a request to create an image, e.g. "Create an image..." or "Draw..."
4. ChatGPT acknowledges and calls DALL·E automatically
5. Wait a moment (about 10–30 seconds) and the image appears

### Working prompt examples (the command to make an image — describe the desired image)

```
Create an image: a volcano at sunset, orange and purple, with a reflection in a lake, watercolor painting style
```

```
Generate an image of a cozy Japanese coffee shop at night, warm lighting, rain outside the window, photorealistic style
```

```
Draw an owl wearing glasses, reading a book under a tree, cute Pixar cartoon style
```

---

## Revised Prompt — DALL·E 3 adjusts the prompt automatically

One of DALL·E 3's key features in ChatGPT is the **Revised Prompt** (a prompt the system adjusts — DALL·E 3 automatically expands or fixes your original prompt to get a higher-quality, more detailed image).

Example:
- **Your prompt:** "an astronaut cat"
- **The Revised Prompt DALL·E actually uses:** "A fluffy orange cat dressed as an astronaut, floating in outer space surrounded by stars and planets, wearing a white space suit with a helmet, realistic digital illustration style"

### How to see the Revised Prompt

When ChatGPT creates an image, it often shows the Revised Prompt. You can adapt it or learn from it to write better prompts.

### Turning off the Revised Prompt

If you want DALL·E to use your prompt exactly without adjusting it, tell ChatGPT:

```
Please use my prompt exactly as written without revising it: [your prompt]
```

---

## Prompting techniques in ChatGPT

### 1. Specify the desired image style

```
Create an image: [what you want] in [style] style
```

Commonly used styles:
- **Photorealistic** (realistic like a photo — high detail, looks like a real image)
- **Oil painting** (thick texture, clear light and shadow)
- **Watercolor** (soft edges, translucent color)
- **Anime** (Japanese cartoon style)
- **Cartoon** (clear lines, flat color)
- **Pixel art** (8-bit images like old games)
- **3D render** (looks like 3D objects)

### 2. Specify mood and lighting

```
An evening atmosphere, warm light, orange and gold, conveying a warm, calm feeling
```

### 3. Specify the camera angle

- **Close-up** (a near shot — sees the detail clearly)
- **Wide shot** (a wide angle — sees the whole scene)
- **Bird's eye view** (looking down from above)
- **Low angle** (looking up from below, making the subject look large)

### 4. Ask for edits in the same chat

After DALL·E creates the image, you can ask for edits by typing in the same chat:

```
Change the background to a forest instead of the sea
```

```
Add a crescent moon in the sky, and make the overall image a bit darker
```

---

## DALL·E's limits in ChatGPT

### Content Policy (rules about which images aren't allowed)

DALL·E has a content filter that will refuse prompts that:

- Contain adult content
- Contain violence at too intense a level
- Use the name or face of a real famous person directly
- Infringe copyright of artwork or characters with a clear owner
- Contain hate speech

### Technical limits

- **Text in images**: DALL·E still renders text in images imperfectly; sometimes it misspells
- **Image size**: in ChatGPT it creates a standard size; you can't adjust the size yourself like using the API directly
- **Images per request**: it creates 1 image at a time in ChatGPT

---

## How to download a created image

1. Click the image DALL·E created
2. Click the **Download** icon at the top right
3. The image is saved as a `.webp` or `.png` file in your Downloads folder

> **Tip:** Images created by DALL·E are 1024×1024 pixels by default.

---

## Copyright of created images

OpenAI states that users who create images through DALL·E (via ChatGPT or the API) **have the right to use those images for any purpose**, including printing, selling, and commercial use (using it to make money or in business), per the terms in OpenAI's usage policies.

---

## Summary

Using DALL·E in ChatGPT is the easiest and fastest way to create AI images. Just have a ChatGPT Plus or higher plan, type a description of the image you want, and DALL·E 3 creates a high-quality image for you instantly. You can also ask for edits or changes in the same chat, making image creation fun and easy for everyone.
