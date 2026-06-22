---
title: "Omni Reference — universal reference"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Omni Reference, a new feature combining the abilities of Style Reference and Character Reference, with more flexible control"
readTime: "5 min"
readers: "0"
locked: false
order: 25
---

# Omni Reference — universal reference

> Main reference: [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)

---

## What is Omni Reference

Omni Reference (a feature that lets you use a reference image to transfer a style, character, object, or anything from a source image into a new image) is a feature that combines the power of `--sref` and `--cref`, plus the ability to reference objects, places, or any element from an image.

---

## How to use

```
[Prompt] --oref [reference image URL]
```

**Example:**
```
a knight exploring ruins --oref https://example.com/character.jpg
the same object in a new setting --oref https://example.com/object.jpg
```

---

## Omni Weight (--ow)

Use `--ow` (Omni Weight — the weight of the Omni reference) to control the strength of the reference:

```
--ow 100    → a weak reference
--ow 500    → a moderate reference (recommended value)
--ow 1000   → the strongest reference
```

---

## The difference from cref and sref

| Parameter | Emphasizes |
|-----------|-----|
| `--cref` | the character (face, features) |
| `--sref` | the drawing style (Aesthetic, color, technique) |
| `--oref` | everything (Character, Object, Style, Environment) |

`--oref` is more flexible, good for work needing to reference multiple aspects at once.

---

## Usage examples

### Reference an object
```
the same ancient sword in different settings --oref [sword URL]
```
→ create images of the same sword in various scenes

### Reference architecture
```
the same temple architecture at different times of day --oref [temple URL]
```
→ create images of the same temple in various lighting

### Reference a character + object
```
the character holding the artifact --oref [character + object URL]
```

---

## Tips

1. **A good reference image** — use a clear image with complete detail
2. **Adjust --ow** — start from 500, then adjust per the result
3. **Combine with a detailed Prompt** — add a Prompt describing the scene and mood you want

---

## Examples of using Omni Reference

### Reference a character + place
```
a hero standing in a marketplace --oref [URL of an image with both the character and a market]
```
→ get both a consistent character and market atmosphere

### Reference a car design
```
the same vehicle driving on a mountain road --oref [car URL]
```

### Reference an Outfit
```
the character wearing the same outfit in a different setting --oref [outfit URL]
```

---

## Omni Reference + Style Reference

Combine both for complete control:
```
[Prompt] --oref [character URL] --sref [style URL] --ow 500 --sw 300
```
→ keep the character and use the specified style

---

## Practical differences

| Case | Recommended to use |
|------|-----------|
| Just want to keep the character's face | `--cref` |
| Just want to use the drawing style | `--sref` |
| Want to keep both the character and style + object | `--oref` |
| Combine multiple References | `--oref` + `--sref` |

---

## Summary

Omni Reference is the most powerful image-reference feature, covering the character, object, and style at the same time. It's good for projects needing high consistency across several images. Use it with `--ow` to control the strength, and combine with `--sref` for additional style control.
