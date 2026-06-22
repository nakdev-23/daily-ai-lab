---
title: "Stylize — artistic beauty"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "Learn how to use the --stylize Parameter to control how much artistic beauty and style Midjourney adds"
readTime: "5 min"
readers: "0"
locked: false
order: 17
---

# Stylize — artistic beauty

> Main reference: [Stylize](https://docs.midjourney.com/hc/en-us/articles/32196176868109-Stylize)

---

## What is Stylize

The `--stylize` or `--s` Parameter (the amount of beauty and artistic character Midjourney adds on its own) controls how much Midjourney "interprets" your Prompt artistically.

- **Low value** = closely follows the Prompt, but looks plain
- **High value** = Midjourney adds its own beauty, color, Composition, and style, which may stray from the Prompt

---

## Values and results

| Value | Result |
|-----|---------|
| `--s 0` | follows the Prompt the most, looks simple |
| `--s 100` | the default, balanced |
| `--s 250` | more beautiful, with a clearer style |
| `--s 500` | very beautiful, Midjourney adds artistic detail |
| `--s 750` | very Artistic |
| `--s 1000` | extremely beautiful, but interprets the Prompt freely |

---

## Comparison example

**Prompt:** `a rose`

```
a rose --s 0        → a straightforward rose image, like a dictionary picture
a rose --s 100      → a good-looking rose
a rose --s 500      → a beautiful rose, interesting light and Shadow
a rose --s 1000     → a rose in an artistic style, perhaps a Painting or Illustration
```

---

## Stylize Default Settings

In Settings, you can set the default Stylize value:
- **Stylize low** = 50
- **Stylize med** = 100 (default)
- **Stylize high** = 250
- **Stylize very high** = 750

---

## When to use a high or low value

### Use a low value (0-100) when:
- You want an image that precisely follows the Prompt
- Technical Illustration, Diagram work
- You want to control the result yourself

### Use a high value (500-1000) when:
- You want a beautiful image without specifying much detail
- Creative work needing visual impact
- You want Midjourney to "help enhance" the beauty

---

## Stylize and Raw Mode

- `--style raw` turns off Stylize completely — follows the Prompt the most
- It differs from `--s 0` in that Raw Mode turns off all style processing

---

## Tips

1. **Try 250-500 first** — often gives the best result in many cases
2. **Short Prompt + high Stylize** = create a beautiful image without writing a long Prompt
3. **Detailed Prompt + low Stylize** = control the result precisely

---

## Summary

`--stylize` is a Parameter that affects the image's "taste." A low value gives precision; a high value gives beauty and creativity. Experiment to find the value suited to each type of work.
