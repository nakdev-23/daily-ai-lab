---
title: "Motion Brush — control motion with a brush"
tool: "Runway"
icon: "tool-runway"
level: "intermediate"
summary: "Learn to use Motion Brush, the tool for painting motion on an image to control which parts should move and in which direction"
readTime: "6 min"
readers: "0"
locked: false
order: 5
---

# Motion Brush — control motion with a brush

> **Motion Brush** (a motion-control brush — paint on the part you want to move) is a tool that lets you precisely specify which part of an image should move, and in which direction.

---

## What is Motion Brush?

Normally with Image-to-Video, the AI decides which part should move, but **Motion Brush** gives that control to you.

With Motion Brush you can:
- **Paint on the part you want to move** and set the direction
- **Leave the part you don't want to move** static
- Create complex motion, e.g. hair sways but the face stays still

---

## How to use Motion Brush

### Step 1: Upload an image

1. Open **Image-to-Video** in Runway
2. Upload the image you want
3. Click the **"Motion Brush"** button that appears after uploading the image

### Step 2: Choose a Brush Layer

**Motion Brush** supports painting in multiple separate Layers, each with a color:
- **Layer 1 (blue)** — paint area 1
- **Layer 2 (green)** — paint area 2
- **Layer 3 (yellow)** — paint area 3
- and other Layers

Each Layer can have its motion direction set separately.

### Step 3: Paint the desired area

1. Choose the Layer you want
2. Use the mouse or finger (for Touch devices) to paint over the part you want to move
3. Adjust the **Brush Size** as needed

### Step 4: Set the motion direction

For each Layer, set:

**Horizontal** (the horizontal axis — left-right movement):
- Positive (+) = move right
- Negative (-) = move left

**Vertical** (the vertical axis — up-down movement):
- Positive (+) = move down
- Negative (-) = move up

**Rotation:**
- Positive = rotate clockwise
- Negative = rotate counter-clockwise

**Speed** (the motion speed):
- 0 = perfectly still
- High = moves fast

### Step 5: Preview and Generate

1. Click **"Preview"** to see what the motion will look like
2. If satisfied, click **"Generate"**

---

## Motion Brush usage examples

### Example 1: Blowing hair
**Source image:** a young woman photographed in a garden

**Motion Brush:**
- Layer 1: paint the hair → Horizontal direction ±2, slightly
- Layer 2: paint the body → 0 on all axes (static)
- Layer 3: paint the surrounding leaves → Horizontal direction slightly

Result: the hair and leaves sway in the wind, but the face stays sharp and still

### Example 2: Moving clouds
**Source image:** a sky with clouds

**Motion Brush:**
- Layer 1: paint the clouds → Horizontal +3 (move right)
- Layer 2: paint the ground and trees → 0 (static)

Result: the clouds drift by, the background stays still

### Example 3: Flowing water
**Source image:** a river in a forest

**Motion Brush:**
- Layer 1: paint the water surface → Vertical +2 (move down with the current)
- Layer 2: paint the rocks, trees, and banks → 0 (static)

Result: the water flows realistically, the banks stay still

---

## Tips for using Motion Brush

### 1. Paint to cover the desired area
Don't just paint the edges; paint over the whole area you want to move.

### 2. Separate Layers for different motion directions
If two objects move differently, paint them in separate Layers.

### 3. Try small direction values first
Direction values of ±1 to ±3 usually give the most natural results.

### 4. Use the Erase Brush to fix mistakes
If you paint the wrong area, use the **Erase Brush** to remove it and paint again.

---

## Limitations of Motion Brush

- Works with Image-to-Video only; doesn't directly support Video-to-Video
- Areas where Layers overlap may give uncertain results
- Very complex motion may make the image look strange or distorted
- The result may differ each time you Generate, even with the same settings

---

## Comparison: using Motion Brush vs. not

| Situation | Without Motion Brush | With Motion Brush |
|---|---|---|
| A person in the image moving | The AI may move the whole image | Control so only the desired part moves |
| Static background | May move too | Can be set to stay still |
| Result | Up to the AI | More control |
| Difficulty | Easy | Takes practice |

---

## Summary

Motion Brush is a tool that gives high creativity and control in creating video from images. Though it takes some learning, once you're fluent it creates more professional-looking videos. It's good for creating Portrait animation, Landscape video, and Product showcases.
