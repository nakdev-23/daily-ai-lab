---
title: "Writing prompts for image generation — techniques and examples"
tool: "DALL·E"
icon: "icon-docs"
level: "beginner"
summary: "Learn how to write good prompts for DALL·E to create the images you want, with prompt structure and real examples"
readTime: "7 min"
readers: "0"
locked: false
order: 3
---
# Writing prompts for image generation — techniques and examples

> Primary reference: [OpenAI Images Guide — Prompting](https://platform.openai.com/docs/guides/images)

---

## What is a prompt

A **prompt** (the command to make an image — describing the desired image in English or Thai) is the text you type to tell DALL·E what kind of image you want. The more detailed and specific the prompt, the more on-target the result.

---

## A good prompt structure

A quality prompt should include these parts:

```
[main subject] + [action/situation] + [background] + [image style] + [lighting/color] + [camera angle]
```

### Real structure example

**A simple prompt:**
```
A cat sitting on a sofa
```

**A more detailed prompt:**
```
A fluffy orange tabby cat sitting on a velvet blue sofa, afternoon sunlight streaming through the window, cozy living room background, photorealistic style, warm color tones
```

The difference is clear: a more detailed prompt gives a much more on-target image.

---

## Key elements of a prompt

### 1. Main subject

Describe what's at the center of the image clearly.

| Bad | Better |
|---|---|
| "a dog" | "a golden retriever puppy with curly fur" |
| "a car" | "a vintage red Ferrari from the 1960s" |
| "a building" | "a Gothic cathedral with flying buttresses" |

### 2. Action or situation

Say what the subject is doing or what situation it's in.

- "running through a field"
- "sitting quietly under a cherry blossom tree"
- "flying over a city at night"
- "looking directly at the camera"

### 3. Background/Setting

- "in a futuristic city"
- "on a snowy mountain peak"
- "inside a cozy library"
- "underwater coral reef"

### 4. Style

A specified style affects the entire look of the image.

| Style | Description | Example |
|---|---|---|
| `photorealistic` | Realistic like a photo | The image looks shot with a real camera |
| `oil painting` | Oil painting | Thick texture, dramatic light and shadow |
| `watercolor` | Watercolor | Soft edges, translucent color, beautiful |
| `anime` | Anime | Big eyes, sharp lines, Japanese style |
| `flat illustration` | Flat illustration | Flat color, no shadows, modern style |
| `pixel art` | Pixel art | Like a classic 8-bit game |
| `3D render` | 3D image | Looks dimensional, like a Blender render |
| `sketch` | Sketch | Pencil lines, like a sketchbook draft |
| `impressionist` | Impressionism | Clear brushstrokes, like Monet |

### 5. Lighting & Color

Specifying light and color can change the image's mood a lot.

- **"golden hour lighting"** — warm golden sunset light
- **"dramatic studio lighting"** — sharp studio light with clear shadows
- **"soft diffused light"** — soft light, no hard shadows
- **"neon lights"** — bright neon, cyberpunk style
- **"moonlit"** — moonlight, cool color, mysterious atmosphere
- **"high contrast"** — high difference between bright and dark

### 6. Camera Angle

- **"close-up"** — a near shot, sees the detail
- **"wide angle"** — a wide angle, sees the whole scene
- **"bird's eye view"** — looking down from above
- **"low angle"** — a low angle, the subject looks grand
- **"portrait"** — a portrait, emphasizing the face and pose
- **"macro"** — a macro shot, very high detail, like looking through a magnifier

---

## Advanced prompt techniques

### Technique 1: Use specific adjectives

Instead of saying "beautiful," specify how it's beautiful:

❌ "a beautiful forest"
✅ "an ancient forest with towering oak trees, dappled sunlight filtering through the canopy, misty morning atmosphere"

### Technique 2: Specify the aspect ratio

In DALL·E 3 you can specify the image's orientation:
- "landscape orientation" → landscape image (1792×1024)
- "portrait orientation" → portrait image (1024×1792)
- "square format" → square image (1024×1024)

### Technique 3: Reference a known artist or style

```
in the style of Monet's impressionist paintings
in the style of Studio Ghibli anime
in the style of concept art for AAA video games
reminiscent of National Geographic photography
```

> **Note:** Use it only to reference a style; don't ask it to "copy" an artist's work directly.

### Technique 4: Specify what you don't want (Negative Elements)

Tell ChatGPT what you don't want in the image:

```
Create an image of a beach scene, but without any people or buildings, just pure nature
```

### Technique 5: Use similes

```
a cityscape that looks like a glowing circuit board
clouds that look like cotton candy
a building shaped like a seashell
```

---

## Real prompt examples with explanations

### Example 1: Product Photography
```
A sleek black smartphone lying on a white marble surface, 
professional product photography, studio lighting, soft shadows, 
high resolution, commercial advertisement style
```
**Use for:** product images for a website or ad

### Example 2: Article Illustration
```
An isometric illustration of a smart city with solar panels, 
electric vehicles, and green spaces, flat design style, 
bright and optimistic color palette, vector art look
```
**Use for:** illustrations for an article about technology or the environment

### Example 3: Character Art
```
A female warrior in ornate golden armor, holding a glowing sword, 
standing on a cliff overlooking a stormy sea, epic fantasy art, 
dramatic lighting, highly detailed, concept art style
```
**Use for:** characters for a game, novel, or creative project

### Example 4: Logo Design
```
A minimalist logo of a mountain peak inside a circle, 
monochrome black and white, clean lines, modern design, 
vector style, suitable for outdoor adventure brand
```
**Use for:** logo or branding ideas

### Example 5: Background/Wallpaper
```
A breathtaking aurora borealis over a snow-covered pine forest, 
purple and green lights dancing in the sky, reflection in a frozen lake, 
long exposure photography effect, ultra high resolution, cinematic
```
**Use for:** a screen wallpaper or presentation background

---

## Common mistakes and how to fix them

### Problem: the image doesn't match what you wanted

**Cause:** the prompt isn't clear enough, or uses vague words

**Fix:**
- Add more specific detail
- Specify the style, lighting, and atmosphere
- Try splitting the prompt into parts

### Problem: text in the image is misspelled

**Cause:** DALL·E isn't yet perfect at rendering text

**Fix:**
- Use short, simple text
- Specify "clear legible text" or "bold readable font"
- For important text, add it in image-editing software afterward

### Problem: the AI refuses the prompt (Content Policy Violation)

**Cause:** the prompt has words the system detects as possibly creating inappropriate content

**Fix:**
- Make the words more polite and clear
- Avoid words with double meanings
- Specify the correct context, e.g. "for educational purposes" or "historical painting"

---

## Summary of good prompt-writing principles

1. **Clear** — state what you want directly
2. **Detailed** — the more detailed, the more on-target the image
3. **Specify the style** — say what image style you want
4. **Specify the mood** — describe the desired atmosphere and feeling
5. **Experiment and adjust** — don't be afraid to try many times; the results keep getting better

Writing good prompts is a skill that takes practice. The more you use it, the better you get.
