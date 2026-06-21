---
title: "What is DALL·E — overview and abilities"
tool: "DALL·E"
icon: "icon-docs"
level: "beginner"
summary: "An introduction to DALL·E, OpenAI's text-to-image AI model, from its first version to the present, and what it can do"
readTime: "5 min"
readers: "0"
locked: false
order: 1
---
# What is DALL·E — overview and abilities

> Primary reference: [OpenAI Images Guide](https://platform.openai.com/docs/guides/images)

---

## What is DALL·E

DALL·E (a name drawn from the famous painter Salvador Dalí and the robot WALL-E) is an AI model (artificial intelligence — a computer that learns and works like a human) developed by **OpenAI** with an amazing ability to **create images from text** (Text-to-Image — turning a description into a digital image) and **edit images** (Image Editing — changing or filling in parts of an existing image).

Put simply: you type a description of the image you want, and DALL·E creates it for you in seconds.

### Examples of what DALL·E can do

- Create an image of "an astronaut cat playing guitar on the moon"
- Draw logos or digital artwork in various styles
- Edit a photo by adding or removing objects in it
- Create a variation (another version of an original image) from an existing image

---

## DALL·E 2 vs DALL·E 3 — how they differ

OpenAI has developed several versions of DALL·E. Currently there are 2 main versions usable via the API (Application Programming Interface — a channel for programs to call DALL·E's services): **DALL·E 2** and **DALL·E 3**.

### DALL·E 2

DALL·E 2 launched in 2022 and was highly popular early on, with these properties:

- Creates images from text, but sometimes doesn't match the prompt (the command to make an image — a description of the desired image in English or Thai) very closely
- Supports the **Edit** (editing — changing part of the original image) and **Variation** (creating variations — several versions from an original image) features
- Image sizes (Size — the image's width × height in pixels): 256×256, 512×512, 1024×1024
- Cheaper than DALL·E 3

### DALL·E 3

DALL·E 3 launched in 2023 and is much more advanced, with these properties:

- **Much more accurate to the prompt** — understands complex context better
- Supports a **Revised Prompt** (a prompt the system adjusts — DALL·E 3 automatically expands or fixes your prompt to get a better image)
- Image sizes: 1024×1024, 1792×1024, 1024×1792 (supports landscape and portrait)
- Supports a **Quality** setting (the level of detail in generation): `standard` and `hd`
- Supports a **Style** setting (the desired image look): `vivid` and `natural`
- Doesn't support Edit and Variation (those features are DALL·E 2 only)

### DALL·E 2 vs DALL·E 3 comparison table

| Property | DALL·E 2 | DALL·E 3 |
|---|---|---|
| Launch year | 2022 | 2023 |
| Prompt accuracy | Medium | Very high |
| Image sizes | 256×256, 512×512, 1024×1024 | 1024×1024, 1792×1024, 1024×1792 |
| Quality (standard/hd) | ❌ | ✅ |
| Style (vivid/natural) | ❌ | ✅ |
| Edit Endpoint | ✅ | ❌ |
| Variation Endpoint | ✅ | ❌ |
| Revised Prompt | ❌ | ✅ |
| Price per image | Cheaper | More expensive |

---

## How DALL·E works

DALL·E uses a technology called a **Diffusion Model** (starting from a random "noise" image and gradually reducing the noise into a meaningful image) together with **CLIP** (Contrastive Language–Image Pre-training — a model that learns the relationship between descriptions and images).

DALL·E's image-creation process:

1. **Receive the prompt** — read the image description you typed
2. **Process the language** — understand the meaning of the words and the context
3. **Create the image** — start from noise (random "noise" — meaningless colored dots) and gradually adjust it into an image matching the description
4. **Return the result** — return it as a URL (a temporary link) or Base64 (image data in text form)

---

## Where can you use DALL·E

### 1. ChatGPT

ChatGPT Plus, Pro, Team, or Enterprise users can use DALL·E directly in ChatGPT. Just type a request to create an image and ChatGPT calls DALL·E automatically.

Example: "Create an image: a cat in an astronaut suit, sitting in a spaceship, cute cartoon illustration style"

### 2. OpenAI API

Developers can call DALL·E via the REST API (a way for programs to communicate over the internet) using various languages, e.g. Python, JavaScript, etc. You need an API Key (a secret code for authenticating API calls).

### 3. Other applications

Many apps use DALL·E behind the scenes, e.g. Bing Image Creator, Microsoft Designer, and other services.

---

## DALL·E's strengths

- **Easy to use** — no drawing skill needed, just describe it in words
- **Many styles** — can create realistic photos, paintings, cartoons, abstract images
- **Fast** — creates an image within seconds
- **Safe** — has a Content Policy filter (rules about which images aren't allowed) to prevent inappropriate content

---

## DALL·E's limits

- **Text in images** — DALL·E sometimes renders text in an image incorrectly (misspellings or distorted letters)
- **Fingers and bodies** — sometimes renders fingers or human body proportions incorrectly
- **Consistency** — images from the same prompt may give different results each time
- **Prohibited content** — can't create images that violate the Content Policy, e.g. violent images, adult content, or copyright-infringing images

---

## Summary

DALL·E is OpenAI's image-generation AI model that lets anyone create digital images just by describing them in words. There are 2 main versions: DALL·E 2 (supports editing and variations) and DALL·E 3 (more accurate, supports HD quality and various styles), usable both through ChatGPT and the OpenAI API.
