---
title: "Kling Skills — use Kling AI in an AI Agent"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Kling Skills is a Tool Suite that lets developers use Kling AI's capabilities directly in an AI Agent, via the MCP (Mo..."
readTime: "3 min"
readers: "0"
locked: false
order: 7
---
# 07 · Kling Skills — use Kling AI in an AI Agent

> Reference: [Kling Skills Suite](https://kling.ai/document-api/apiReference%2Fskill)

---

## 1. What is the Kling Skills Suite?

### What is this topic?

**Kling Skills** is a Tool Suite that lets developers use Kling AI's capabilities directly in an **AI Agent**, via the **MCP (Model Context Protocol)** standard — good for those who use Claude, ChatGPT, or other AI Agents and want that Agent to create videos or images from Kling automatically.

### What it's used for

Instead of calling the Kling API directly, it lets an AI Agent do:

- **Video Generation**: Text-to-Video, Image-to-Video, Video Editing (Omni 3.0)
  - Supported models: `kling-v3`, `kling-v3-omni`, etc.
- **Image Generation**: Text-to-Image, Image-to-Image, 4K Image
  - Supported models: `kling-v3`, `kling-v3-omni`, etc.
- **Element/Character Management**: create and manage reusable characters

---

## 2. Installation

### Install URL

```
https://clawhub.ai/klingai-dev/klingai
```

Open this link and click **One-click Bind** to bind your Kling AI account to the Agent automatically.

### Environment requirements

- **Node.js 18+** (no extra Dependencies needed)

### Authentication Methods

There are two ways:

**Method 1: One-click Bind (recommended)**
Open the install URL above; the system asks you to log in with your Kling AI account, then binds automatically.

**Method 2: Manual AK/SK**
Run this command in the Terminal:

```bash
node kling.mjs account --import-credentials \
  --access_key_id <YOUR_AK> \
  --secret_access_key <YOUR_SK>
```

---

## 3. Additional info

### Regions

If you don't set `KLING_API_BASE`, the system detects and caches the appropriate Endpoint automatically (China or Global).

### Connecting to various Platforms

| Platform | Detail |
|---------|-----------|
| **ClawHub** | The main install page, for general Agents |
| **Claude (MCP)** | Usable directly via Claude MCP |

---

## 4. Notes — cautions

- **There's a charge every time you request a creation.** Before submitting a Task, check the Prompt is correct, because once submitted, credits are deducted immediately
- **Approximate creation times:**
  - Create a video: **1–5 minutes**
  - Create an image: **20–60 seconds**
  - Create an Element: **1–3 minutes**
- **File lifetime**: created results are stored for **30 days**; download before they expire
- **Bilingual support**: you can interact with the Agent in both Thai/Chinese and English; the system detects the user's language automatically

---

## 5. Usage example in Claude

After installing Kling Skills, you can type a request like this:

> "Create a 5-second video from the text: a white cat walking on a sandy beach at sunset, peaceful atmosphere. Use the kling-v3 model, quality pro"

> "Create a 4K image of a red rose on a wooden table, soft bokeh light"

Claude calls the Kling API automatically and sends the result back.
