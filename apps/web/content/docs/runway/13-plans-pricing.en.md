---
title: "Plans and pricing — Credits and payment"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "Details of all Runway plans, the Credit price for each model, how to buy more credits, and setting up Autobilling so service isn't interrupted"
readTime: "7 min"
readers: "0"
locked: false
order: 13
---

# Plans and pricing — Credits and payment

> Understand Runway's Credit system and how to choose the most cost-effective plan for your usage.

---

## Runway's Credit system

**Credits** (a resource unit for creating media) are the main currency in Runway.

- Credits can be bought at **$0.01 per 1 credit** (or 100 credits = $1, or about 35 baht)
- Minimum purchase $10 (1,000 credits) per time
- Uses Stripe (a popular online payment system) for payment

---

## Credit price by model

### Video models (Video Generation)

| Model | Credits/second | Note |
|---|---|---|
| **Gen-4.5** | 12 credits/second | Highest quality |
| **Gen-4 Turbo** | 5 credits/second | Fast, economical |
| **Gen-3 Turbo** | 5 credits/second | Previous version |
| **Aleph 2** | 28 credits/second | Powerful V2V (minimum 56 credits) |
| **Veo3** (with audio) | 40 credits/second | Video + audio |
| **Veo3** (no audio) | 20 credits/second | Video only |
| **Seedance 2** | 36-40 credits/second | Depends on Resolution |
| **Seedance 2 Fast** | 29 credits/second | Fast version |

### Example video costs

| Task | Credits | Price (USD) | Price (THB) |
|---|---|---|---|
| 5s video (Gen-4.5) | 60 credits | $0.60 | ~21 baht |
| 10s video (Gen-4.5) | 120 credits | $1.20 | ~42 baht |
| 5s video (Gen-4 Turbo) | 25 credits | $0.25 | ~9 baht |
| 5s video (Veo3 with audio) | 200 credits | $2.00 | ~70 baht |

### Image models (Image Generation)

| Model | Credits | Note |
|---|---|---|
| **Gen4 Image** (720p) | 5 credits | |
| **Gen4 Image** (1080p) | 8 credits | |
| **Gen4 Image Turbo** | 2 credits | All resolutions |
| **GPT Image 2** | 1-41 credits | Depends on quality/size |
| **Gemini Image 3 Pro** | 20-40 credits | Depends on Resolution |

### Audio

| Feature | Credits |
|---|---|
| **Text-to-Speech** | 1 credit / 50 characters |
| **Voice Dubbing** | 1 credit / 2 seconds |
| **Voice Isolation** | 1 credit / 6 seconds |

### Others

| Feature | Credits |
|---|---|
| **Magnific Upscaler** (general) | 25 credits |
| **Magnific Upscaler** (beyond 4096px) | 150 credits |
| **GWM-1 Avatars** | 2 credits to start + 2 credits/6 seconds |

---

## Runway plans

### For general users (runwayml.com)

Runway has plans for Web App users:

- **Free** — limited Credits, for trying it out
- **Standard** — monthly Credits + can buy more
- **Pro** — more Credits + advanced features
- **Unlimited** — unlimited Credits for some models

### For API developers (dev.runwayml.com)

A Pay-as-you-go system via Credits:

- Buy Credits as needed
- No monthly Subscription fee for the API
- Must buy a minimum of **$10** in Credits before starting

---

## Usage Tiers — API usage levels

A **Usage Tier** (a level defining the API usage limit) determines how much an organization can create per day.

The level upgrades automatically when spending reaches the set threshold:

| Tier | Max Concurrency | Creations/day | Limit/month | Upgrade when |
|---|---|---|---|---|
| **Tier 1** (starting) | 1-2 | 50-200 | $100 | Starting |
| **Tier 2** | 3 | 500-1,000 | $500 | Spent $50 |
| **Tier 3** | 5 | 1,000-2,000 | $2,000 | Spent $100 |
| **Tier 4** | 10 | 5,000-10,000 | $20,000 | Spent $1,000 |
| **Tier 5** | 20 | 25,000-30,000 | $100,000 | Spent $5,000 |

**Concurrency** (the number of jobs that can be processed at once) is the maximum number of Tasks that can run simultaneously.

---

## Autobilling — automatic payment

**Autobilling** prevents service from being interrupted because Credits run out.

### How to set up Autobilling
1. Go to the Developer Portal → Billing
2. Add a Payment Method via Stripe
3. Set:
   - **"Recharge below"**: the Credit amount that triggers a recharge
   - **"Recharge amount"**: the Credits to buy each time (minimum 1,000 credits or $10)
4. Save

### The system checks every hour
Runway checks Credits every hour; when below the threshold, it charges automatically.

### If payment fails
1. Runway notifies you by email
2. Retries after 24 hours
3. Tries 3 times over a total of 72 hours
4. If all fail, Autobilling is paused

---

## Organizations and Roles

An **Organization** (the main account for the API) is a container holding API Keys, Credits, and team members.

### Add members
- Invite by Email via the Developer Portal
- New members have the same rights as the owner (except they can't delete the owner)
- Removing a member ≠ deleting their API Key; you must delete the Key separately

### API Keys
- You can create several Keys for each Environment (Dev, Staging, Production)
- A Key is shown only once when created — you must save it immediately
- Don't Hardcode it (write it directly in code) — use an Environment Variable instead

---

## Credit-saving tips

### Use Turbo for Drafts
- Use **Gen-4 Turbo** (5 credits/s) for testing concepts
- Switch to **Gen-4.5** (12 credits/s) only for the Final output

### Create short videos, then join them
- A 5s video uses half the Credits of a 10s one
- If you want a long video, try creating several short clips then joining them with an editor

### Test the Prompt before the real Generate
- Use a low Resolution first to test the concept
- Once the Prompt is good enough, then Generate at high resolution

### Set Autobilling carefully
- Don't set the Recharge Amount unnecessarily high
- Check daily Usage early on to estimate real use

---

## Summary

Runway's Credit system is highly flexible — pay for what you actually use, no upfront commitment. For beginners, the Free Plan is recommended for trying it out, then buy more Credits when needed. For API developers, set up Autobilling to prevent service interruption, and choose the model that suits the work to save Credits in the long run.
