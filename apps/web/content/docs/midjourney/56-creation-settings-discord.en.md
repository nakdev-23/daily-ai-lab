---
title: "Creation Settings in Discord"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to set up default image-creation settings in Discord via the /settings command, including setting the Model, Mode, and default Parameters"
readTime: "5 min"
readers: "0"
locked: false
order: 56
---

# Creation Settings in Discord

> Main reference: [Creation Settings in Discord](https://docs.midjourney.com/hc/en-us/articles/32868982949517-Creation-Settings-in-Discord)

---

## What is /settings

The `/settings` command opens a graphical settings panel in Discord that lets you set defaults for every image creation, instead of having to type Parameters every time.

---

## How to access

Type `/settings` in Discord, and the Midjourney Bot sends a message with buttons to press.

---

## Options in Settings

### Model Version
Choose the Model used to create images:
- MJ Version 7
- MJ Version 6.1
- MJ Version 6
- MJ Version 5.2
- Niji Version 6

### Speed
Choose the speed mode:
- **Fast Mode** — normal
- **Relax Mode** — slower, doesn't use GPU Fast Time
- **Turbo Mode** — very fast, uses 2x GPU

### Quality
Choose the default quality:
- Half Quality
- Base Quality
- High Quality (2x GPU)

### Stylize
Choose the default Stylize level:
- Stylize low (50)
- Stylize med (100) — the default
- Stylize high (250)
- Stylize very high (750)

### Public/Stealth
- Public Mode
- Stealth Mode (requires the Pro+ plan)

### Remix Mode
- Enable/disable Remix Mode

### Variation Mode
- High Variation (Strong)
- Low Variation (Subtle)

---

## Recommended Settings examples

### For beginners
```
Model: MJ Version 6.1
Speed: Fast Mode
Quality: Base Quality
Stylize: Stylize med
Remix: Off
```

### For Professional work
```
Model: MJ Version 7
Speed: Fast Mode
Quality: High Quality
Stylize: Stylize high
Remix: On (for easy Iteration)
Stealth: On (if you have the Pro plan)
```

### For Anime/Illustration
```
Model: Niji Version 6
Stylize: Stylize high
```

---

## /prefer suffix — set default Parameters

If you want to set specific Parameters added to the end of every Prompt:

```
/prefer suffix --v 6.1 --ar 16:9
```

Every time you use `/imagine`, Midjourney adds `--v 6.1 --ar 16:9` automatically.

### Delete the Suffix
```
/prefer suffix
```
(sending with no value = delete the entire Suffix)

---

## /prefer option — save a Parameter set

```
/prefer option set portrait --ar 2:3 --stylize 500 --v 6.1
```

Use:
```
/imagine prompt: a woman --portrait
```
= is equal to:
```
/imagine prompt: a woman --ar 2:3 --stylize 500 --v 6.1
```

---

## Resetting Settings

If you want to reset all settings back to default:
```
/settings
```
Then press the Reset button or choose the default for each item.

---

## Saved Prefer Options can be viewed and deleted

### View all Prefer Options
```
/prefer option list
```

### Delete a Prefer Option
```
/prefer option set [name]
```
(sending with no value = delete)

---

## Example Settings Profiles for various work

### For Social Media work
```
/prefer option set social --ar 1:1 --v 6.1 --stylize 400
```

### For Illustration work
```
/prefer option set illustration --ar 2:3 --stylize 750 --niji 6
```

### For Photorealistic work
```
/prefer option set photo --v 7 --style raw --stylize 100
```

### For Draft test work
```
/prefer option set draft --quality 0.25 --chaos 50
```

---

## Tips for good Settings

1. **Always set the latest Version** — update when Midjourney releases a new Model
2. **Enable Remix Mode** — helps you Iterate work conveniently
3. **Set Low Variation** — if you want consistent results
4. **Save various Profiles** — create a `/prefer option` for each work type

---

## Summary

Use `/settings` to set defaults for every image creation, reducing repeated Parameter typing, and use `/prefer option` to save frequently used Parameter sets for each work type. Good settings help your Workflow be efficient and get consistent results.
