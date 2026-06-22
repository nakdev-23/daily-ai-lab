---
title: "Tile — create seamless Patterns"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the --tile Parameter to create images that tile Seamlessly, for Backgrounds, Textures, and Patterns"
readTime: "5 min"
readers: "0"
locked: false
order: 20
---

# Tile — create seamless Patterns

> Main reference: [Tile](https://docs.midjourney.com/hc/en-us/articles/32197978340109-Tile)

---

## What is Tile

The `--tile` Parameter (creates an image that, when laid out side by side, shows no seams) creates an image you can "paste" together in any direction with no seams.

Used for:
- The **Background** of a website, app
- **Texture** (the surface character of an object) for 3D work
- **Fabric Pattern**
- **Wallpaper Pattern** (a repeating-pattern wallpaper)
- **Packaging Design**

---

## How to use

```
[Prompt] --tile
```

No need to add a number value, just add `--tile` at the end of the Prompt:

```
colorful tropical flowers and leaves --tile
geometric abstract pattern, blue and gold --tile
vintage floral wallpaper, pastel colors --tile
```

---

## Example Prompts for Tile

### Fabric / Textile
```
japanese indigo resist-dyed pattern, traditional motifs --tile
bohemian paisley pattern, warm earth tones --tile
```

### Nature Pattern
```
watercolor leaves and branches, green and gold --tile
small wildflowers on white background --tile
```

### Geometric
```
art deco geometric pattern, black and gold --tile
hexagonal mosaic, teal and white --tile
```

### Food & Playful
```
cute kawaii food icons pattern --tile
small stars and moons, pastel colors --tile
```

---

## Testing for Seamlessness

After creating an image with `--tile`, test it by:

1. Opening the image in Photoshop or GIMP (image-editing programs)
2. Using the Offset or Tile Preview feature
3. Or placing the image repeatedly in a grid to see if it tiles nicely

---

## Advice for writing a Prompt for Tile

1. **Use a Repeat theme** — the words "pattern", "repeat", "motif" help Midjourney understand
2. **Avoid a single large element** — e.g. "a single large tree" tiles poorly
3. **Use a theme with many small pieces** — flowers, leaves, stars, geometric shapes

---

## Tile and Aspect Ratio

`--tile` works best with `--ar 1:1` (square), because it tiles easily both horizontally and vertically.

```
floral pattern, pastel --tile --ar 1:1
```

---

## Summary

`--tile` is a very useful Parameter for designers who want Patterns and Textures. Use it with `--ar 1:1` for the best tiling result.
