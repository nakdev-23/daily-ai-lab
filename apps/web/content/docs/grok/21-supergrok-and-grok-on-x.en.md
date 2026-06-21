---
title: "SuperGrok & Grok on X — subscription plans and using it on the Platform"
tool: "Grok"
icon: "icon-docs"
level: "beginner"
summary: "Compare the Free, Premium, Premium+, and SuperGrok plans, plus how to use Grok on X (Twitter) on both Desktop and mobile."
readTime: "4 min"
readers: "0"
locked: false
order: 21
---
# SuperGrok & Grok on X — subscription plans and using it on the Platform

> Reference: [Grok.com](https://grok.com) | [x.ai/grok](https://x.ai/grok) | [X Help Center](https://help.x.com/en/using-x/grok)

---

## Ways to access Grok

Grok is offered through 3 main channels:

| Channel | For | URL / App |
|---|---|---|
| **Grok.com** | General users | [grok.com](https://grok.com) |
| **The X (Twitter) app** | X users | The left menu bar |
| **xAI API** (a channel for developers to call the service via code) | Developers | api.x.ai |

---

## Subscription plans

### Free

Use it for free at [grok.com](https://grok.com) after Signing in with an X account

**Capabilities:**
- Chat with Grok (limited number of times)
- Basic Web Search
- Generate images with Aurora (limited)
- Access Grok on X

**Limitations:**
- Limited number of messages per day
- No full DeepSearch
- An older Model version

---

### X Premium ($8/month)

Subscribe via the X (Twitter) Blue Subscription (X's paid subscription)

**Additional capabilities:**
- More Grok access on X
- Summarize Articles and Posts on X
- Explain Trending Topics
- Grok in DMs (Direct Messages)

---

### X Premium+ ($22/month)

**Additional capabilities:**
- More Grok messages than Premium
- Big Reply Boost (increased visibility for your replies)
- Access Grok features before others

---

### SuperGrok ($30/month or $300/year)

Grok.com's Premium plan directly — good for Power Users

**All capabilities:**
- **Grok 4.3** — the latest and best Model (AI model)
- **Unlimited DeepSearch** — full deep searching
- **Think Mode** — Extended Reasoning (extended thinking time — more accurate)
- **Image Generation** (creating images with AI) — the Aurora model, unlimited
- **Video Generation** (creating videos with AI) — generate videos with AI
- **Voice Mode** — Real-time voice conversation
- **File Upload** — upload documents: PDF, images, various files
- **X Data Access** — search posts and data on X in Real-time
- **Early Access** — get new features before others

---

## Plan comparison table

| Feature | Free | Premium | Premium+ | SuperGrok |
|---|---|---|---|---|
| Grok Model | Basic | Grok | Grok | Grok 4.3 |
| Messages/day | Few | More | Much more | Nearly unlimited |
| DeepSearch | None | Partial | Partial | Full |
| Think Mode | None | None | Partial | Full |
| Image Gen | Limited | Limited | Moderate | Unlimited |
| Video Gen | None | None | None | Yes |
| Voice Mode | None | None | None | Yes |
| File Upload | Limited | Moderate | Moderate | Full |
| Price/month | $0 | $8 | $22 | $30 |

---

## How to use Grok on X (Twitter)

### Desktop

1. Open [x.com](https://x.com) and Sign in
2. Look for the **Grok** icon in the left menu bar (a star ✦)
3. Click to open the Grok window
4. Start typing your question

### Mobile (iOS / Android)

1. Open the X app
2. Tap the Grok icon (the star) on the bottom bar
3. Or tap your Profile icon and choose **Grok**

### Special features on X

**Explain a Post / Tweet:**
- Click "..." on a Post
- Choose "Grok" or "Ask Grok"
- Grok explains the context and fact-checks it for you

**Grok in Spaces:**
- During an X Space (a live audio room on X), you can ask Grok about what's being discussed

**Trending Topics:**
- The Explore page has an "Explain" button on some Trending Topics
- Grok summarizes what the trend is and why it's trending

---

## Aurora — Image Generation on Grok

**Aurora** (the name of xAI's image-generation AI) is xAI's Image Generation model (an AI image-generating model) built into Grok

### Use it via Grok.com / the X app

```
Type: "Generate an image of [image description]"

Examples:
"Generate an image of an orange cat sitting on a window on a rainy day, Watercolor style"
"Generate an image of Bangkok skyline at sunset, photorealistic"
```

### Use it via the API

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.images.generate(
    model="grok-imagine-image-quality",
    prompt="A street in Bangkok at night, neon lights, rain, Cyberpunk style",
    n=1,
    size="1024x1024",
)

image_url = response.data[0].url
print(f"Image: {image_url}")
```

---

## DeepSearch — using it on Grok.com

DeepSearch (deep searching — analyzing several sources at once before summarizing an answer) works more deeply than ordinary Web Search:

1. Open [grok.com](https://grok.com) and Sign in
2. Before sending your question, click the **"DeepSearch"** or **"Think"** button
3. Grok shows its thinking process:
   - Forms sub-questions to search
   - Searches several rounds
   - Analyzes and cross-references (checks across sources)
4. The result comes with full Citations (source references)

### What kind of questions is it good for?

| Good for | Not good for |
|---|---|
| Analyzing the stock/business market | Simple general questions |
| Comparing products/services | Questions needing a fast answer |
| Academic Research | General conversation |
| News and current events | Creative/writing |

---

## Think Mode — let Grok think before answering

**Think Mode** (a thinking mode — Grok takes time to "think" internally before answering, good for hard problems):

1. Click **"Think"** before sending your question
2. Grok shows its reasoning process (the analysis — displayed in gray)
3. Then it gives the final answer

**Good for:** math problems, logical analysis, complex decisions

---

## Subscribe to SuperGrok

1. Go to [grok.com](https://grok.com)
2. Sign in with an X account
3. Click **"Get SuperGrok"** or go to Settings
4. Choose the monthly or yearly plan (17% cheaper)
5. Pay by Credit Card or Crypto (digital currency)

> **Tip:** The yearly plan ($300/year) saves $60 over the monthly plan ($360/year).
