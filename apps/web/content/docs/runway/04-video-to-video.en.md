---
title: "Video to Video — edit and restyle videos"
tool: "Runway"
icon: "tool-runway"
level: "intermediate"
summary: "Learn to use Video-to-Video to change a video's style, edit content, or use an existing video as a basis to create a new video with AI"
readTime: "7 min"
readers: "0"
locked: false
order: 4
---

# Video to Video — edit and restyle videos

> **Video-to-Video** lets you take an existing video and restyle it, change its environment, or edit various elements using AI.

---

## What is Video-to-Video?

**Video-to-Video** (V2V) is the process of using a source video as the "backbone" of the motion, then having the AI replace the visual style as you want.

Usage examples:
- A dancing person video → change it to a dancing robot
- A city street video → change it to a future-world street
- A person video → change it to a cartoon character
- A daytime video → change it to nighttime

---

## Models used in Video-to-Video

### Aleph 2 (a powerful V2V model)
**Aleph 2** is an AI model designed specifically for Video-to-Video, highly capable at preserving the motion from the source video while changing the visual style.

- Uses 28 credits/second (minimum 56 credits)
- Good for work needing high quality

### Gen-4 Aleph
- A version combining Gen-4's capabilities with Aleph
- Preserves the source video's identity well

---

## How to use Video-to-Video

### Step 1: Prepare the source video

**Video requirements:**
- File formats: MP4, MOV, MKV, WebM
- Codec (a video-compression format): H.264, H.265, AV1
- File size: no more than 32MB (via URL) or 200MB (via Ephemeral Upload)
- Length: 2-10 seconds recommended for the best results

### Step 2: Upload the video

1. Click **"Video to Video"** in the menu
2. Upload the source video
3. Wait for the video to finish uploading and processing

### Step 3: Write a Prompt to define the new style

The Prompt in V2V mode tells the AI what you want the video to look like.

**Example V2V Prompts:**

Change to anime style:
```
Anime style, vibrant colors, Studio Ghibli aesthetic, 
hand-drawn look, detailed backgrounds
```

Change to a future style:
```
Futuristic cyberpunk city, neon lights, 
holographic displays, rainy night, 
blade runner aesthetic
```

Change to oil painting:
```
Oil painting style, impressionist brushstrokes, 
rich textures, museum quality artwork
```

### Step 4: Adjust the Style Strength

**Style Strength** (the level by which the AI changes from the source) is a value telling the AI how much to change.

- **Low** — the video still resembles the source, with only a little style
- **Medium** — a balance between the source and the new style
- **High** — the AI changes a lot, possibly very different from the source

---

## Techniques for effective Video-to-Video

### Choose a video with clear motion
A good video for V2V should have clear, consistent motion. Avoid shaky videos or ones with very frequent cuts.

### Use a Prompt consistent with the video content
If the video has people, specify in the prompt how you want the characters to look in the new style.

### Try several Style Strengths
Try several Style Strength levels to find a balance you're happy with.

---

## Real usage cases

### Use in Production (professional media production)

**Film & TV:**
- Change the background environment of a scene
- Add special effects to Live Action video

**Advertising:**
- Adapt an existing ad's style to a new campaign
- Create different versions of an ad for different target groups

**Content Creation:**
- Create a Lofi aesthetic (a Lo-fi style — soft retro imagery) from a plain video
- Turn a Vlog video into a film style

---

## Cautions

- **Consistency**: long videos may have style inconsistency between frames
- **Flickering** (an image that shakes or flickers): may occur if the Style Strength is too high
- **Small details**: the AI may change small details you didn't want
- **Copyright**: don't use others' copyrighted videos without permission

---

## Comparing V2V with T2V

| Topic | Video-to-Video (V2V) | Text-to-Video (T2V) |
|---|---|---|
| Source | An existing video | Text only |
| Control | Controls the motion well | Up to the AI entirely |
| Good for | Editing or restyling old work | Creating new from scratch |
| Credits | A bit higher | Normal |

---

## Summary

Video-to-Video opens the chance to creatively transform existing videos, whether changing the art style, the environment, or creating special Visual Effects. This tool is very useful for both content creators and media professionals.
