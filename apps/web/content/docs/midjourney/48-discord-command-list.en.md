---
title: "The full Discord command list"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "The full list of Midjourney's Discord commands with explanations, as a Reference Guide for Discord users"
readTime: "6 min"
readers: "0"
locked: false
order: 48
---

# The full Discord command list

> Main reference: [Discord Command List](https://docs.midjourney.com/hc/en-us/articles/32894521590669-Discord-Command-List)

---

## Main commands

### /imagine
**Use:** create an image from a Prompt
```
/imagine prompt: [image description]
```
**Example:**
```
/imagine prompt: a mountain at sunset, oil painting style --ar 16:9
```

### /blend
**Use:** combine 2-5 images
```
/blend
```
Then upload 2-5 images

### /describe
**Use:** analyze an image and create a Prompt from it
```
/describe [upload an image]
```

---

## Account-management commands

### /info
**Use:** view account information, remaining GPU Time, and statistics
```
/info
```

### /subscribe
**Use:** get a link to the subscription page
```
/subscribe
```

### /show
**Use:** bring an old job back with a Job ID
```
/show job_id: [Job ID]
```

---

## Mode-setting commands

### /fast
**Use:** switch to Fast Mode
```
/fast
```

### /relax
**Use:** switch to Relax Mode (requires the Standard+ plan)
```
/relax
```

### /turbo
**Use:** switch to Turbo Mode (4x faster, uses 2x GPU Time)
```
/turbo
```

### /stealth
**Use:** enable Stealth Mode (requires the Pro+ plan)
```
/stealth
```

### /public
**Use:** turn off Stealth Mode, back to Public
```
/public
```

---

## General settings commands

### /settings
**Use:** open the settings panel, choose the Model, Mode, and various values
```
/settings
```

### /prefer option
**Use:** save frequently used Parameters
```
/prefer option set [name] [value]
```
**Example:**
```
/prefer option set mydefault --ar 16:9 --v 6
```
Then use:
```
/imagine prompt: a landscape --mydefault
```

### /prefer suffix
**Use:** set Parameters to be added to the end of every Prompt
```
/prefer suffix --ar 16:9 --v 6
```

### /prefer remix
**Use:** enable/disable Remix Mode
```
/prefer remix
```

---

## Other commands

### /help
**Use:** show the help list
```
/help
```

### /docs
**Use:** link to the Documentation
```
/docs
```

### /invite
**Use:** a link to add the Midjourney Bot to your own Server
```
/invite
```

---

## Emoji Reactions

In Discord there are Emoji Reactions with special functions:

| Emoji | Function |
|-------|---------|
| ✉️ | send the Job ID and Seed via DM |
| ❌ | cancel a job currently Generating |
| 🌟 | mark as Favorite |

---

## Popular Prefer Options

```
/prefer option set landscape --ar 16:9 --v 6 --stylize 500
/prefer option set portrait --ar 2:3 --v 6
/prefer option set anime --niji 6 --ar 1:1
/prefer option set fast_test --quality 0.25
```

---

## Summary

The most frequently used commands are `/imagine`, `/info`, `/settings`, and `/fast`/`/relax`. Advanced commands like `/prefer` let you set frequently used defaults to save time.
