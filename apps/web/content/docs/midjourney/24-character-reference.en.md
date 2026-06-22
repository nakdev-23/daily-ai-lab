---
title: "Character Reference — keep the same character"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use --cref to keep a character's face and features consistent across several images, good for creating a Character Sheet and Storyboard"
readTime: "6 min"
readers: "0"
locked: false
order: 24
---

# Character Reference — keep the same character

> Main reference: [Character Reference](https://docs.midjourney.com/hc/en-us/articles/32162917505293-Character-Reference)

---

## What is Character Reference

The `--cref` Parameter (Character Reference — referencing a character to keep its face and features the same across various images) lets you create several images with the same character, whether at different viewpoints, poses, or scenes.

---

## How to use

```
[Prompt] --cref [character image URL]
```

**Example:**
```
the same character running through a forest --cref https://example.com/character.jpg
the same character sitting at a cafe --cref https://example.com/character.jpg
the same character fighting a dragon --cref https://example.com/character.jpg
```

---

## Character Weight (--cw)

Use `--cw` (Character Weight — the accuracy level for keeping the character's features) to control how much likeness is kept:

```
--cw 0     → use only the style, don't keep the face
--cw 50    → keep some
--cw 100   → keep the face fully (default)
```

**Example:**
```
a warrior in battle --cref [URL] --cw 100
a warrior in disguise --cref [URL] --cw 50
```

---

## Creating a Character Sheet

A Character Sheet is a set of images showing the character at various viewpoints and poses:

```
character sheet, front view, multiple poses --cref [URL] --cw 100
character sheet, side view, neutral expression --cref [URL]
character sheet, back view --cref [URL]
```

---

## Usage examples

### Graphic novel / Storyboard
Create a character consistent throughout the story:
```
[character] standing in rain, sad expression --cref [URL]
[character] celebrating victory --cref [URL]
[character] sleeping under stars --cref [URL]
```

### Personal Avatar
Create several profile pictures from the same character:
```
avatar portrait, professional look --cref [character URL]
avatar portrait, casual style --cref [character URL]
avatar portrait, fantasy version --cref [character URL]
```

---

## Limitations

- `--cref` works best with Illustration or Animated characters
- For real human faces, results may be less accurate
- The clearer and more detailed the source image, the better the result

---

## --cref and --sref

| Parameter | Keeps what |
|-----------|---------|
| `--cref` | the face, character features |
| `--sref` | the drawing style, Aesthetic |

You can use both together:
```
[character] in adventure --cref [character URL] --sref [style URL]
```

---

## Summary

`--cref` is an important tool for Content creators who want a consistent character across several images. Use it with `--cw` to control the likeness level, and `--sref` to control the style.
