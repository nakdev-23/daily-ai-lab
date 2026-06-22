---
title: "Style Creator — create a personal style"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the Style Creator to create and save a personal Style Code you can reuse in a Prompt for consistent results"
readTime: "5 min"
readers: "0"
locked: false
order: 41
---

# Style Creator — create a personal style

> Main reference: [Style Creator](https://docs.midjourney.com/hc/en-us/articles/41308374558221-Style-Creator)

---

## What is the Style Creator

The Style Creator (a style-creation tool — a feature that lets you create a unique style by Ranking images, then save it as a Code for reuse) lets you create a Style Code that defines a specific Aesthetic.

It differs from Personalization in that the Style Creator lets you create several styles and choose one per the work.

---

## How to create a Style

1. Go to **"Styles"** or **"Style Creator"** in the menu
2. Click **"Create New Style"**
3. Name the Style (e.g. "Moody Portrait", "Vibrant Commercial")
4. The system shows pairs of images to Rank
5. Choose the image matching the style you want
6. Repeat until done (about 20-50 pairs)
7. The system creates a **Style Code** for you

---

## Using the Style Code

Use the resulting Style Code with `--sref` or `--style`:

```
a portrait --sref [your Style Code]
```

Or through Personalization:
```
a landscape --p [Style Code]
```

---

## Benefits of the Style Creator

### 1. Brand Consistency
Create a Style Code specifically for a brand, making every image have the same style.

### 2. Create several Styles
- Style A: "Clean Corporate Look"
- Style B: "Artistic Editorial"
- Style C: "Dark Moody"

Choose per the work type.

### 3. Share the Style with the team
Share the Style Code with team members to use together for consistent results.

---

## Style Creator vs Style Reference (--sref)

| | Style Creator | --sref |
|--|--------------|--------|
| Input | Rank several pairs of images | a source image URL |
| Output | a Style Code | uses the style from the image directly |
| Accuracy | learns from Preference | matches the image more |
| Flexibility | can create several Styles | follows the image exactly |

---

## Tips

1. **Create a Style for each project** — separate Styles by client or Campaign
2. **Rank in detail** — the more you Rank, the more accurate
3. **Test with several Prompts** — check that the Style Code works well with various Prompt types

---

## Style Creator vs Personalization

| | Style Creator | Personalization (`--p`) |
|--|--------------|------------------------|
| How many Styles you can create | several Styles | 1 Style (your own) |
| Can name it | ✅ | ❌ |
| Share with others | ✅ share a Code | ✅ share a Code |
| How to create | Rank by Theme | Rank by general taste |

---

## Example Styles to create

### For a Commercial designer
- **"Clean Corporate"** — a clean, professional style
- **"Vibrant Marketing"** — bright, vivid colors
- **"Dark Luxury"** — dark, luxurious

### For an Illustrator
- **"Soft Watercolor"** — soft watercolors
- **"Bold Graphic"** — graphics with sharp lines
- **"Fantasy Detailed"** — high-detail fantasy

---

## How to use the Style Code

```
a portrait --sref [Style Code from the Style Creator]
```

Or if Midjourney supports it:
```
a portrait --style [the Style Name you set]
```

---

## Managing Styles

- See all created Styles in the Styles menu
- Delete Styles you no longer use
- Rename Styles as you wish

---

## Summary

The Style Creator is a tool for creating your own or your brand's Signature Style, helping every image be consistent. It's good for work needing Brand Consistency or a clear Visual Identity. Create several Styles for each work type for maximum efficiency.
