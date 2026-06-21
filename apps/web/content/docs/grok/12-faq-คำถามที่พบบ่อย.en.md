---
title: "FAQ — frequently asked questions"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "It depends on the channel you signed up through:"
readTime: "4 min"
readers: "0"
locked: false
order: 12
---
# FAQ — frequently asked questions

> Reference: [FAQ - Grok Website/Apps](https://docs.x.ai/grok/faq) | [Data & Privacy](https://docs.x.ai/developers/faq/security) | [General FAQ](https://docs.x.ai/developers/faq/general)

---

## Billing & Subscriptions

### How do I cancel SuperGrok?

It depends on the channel you signed up through:

- **Web (grok.com):** Go to [grok.com/?_s=billing](https://grok.com/?_s=billing) → Manage Subscription → Cancel
- **iOS:** Manage via the Apple App Store — [cancel](https://support.apple.com/en-us/118428) / [request a refund](https://support.apple.com/en-us/118223)
- **Android:** Manage via Google Play — [cancel](https://support.google.com/googleplay/answer/7018481) / [request a refund](https://support.google.com/googleplay/workflow/9813244)

> **Tip:** If the "Manage Subscription" button doesn't work, try an Incognito Window or disable your Ad-blocker.

### Can I get a refund?

| Channel | Policy |
|---|---|
| Web (grok.com) | xAI's Refunds team reviews it; takes 5–10 business days |
| iOS App Store | Apple handles it — request through Apple directly |
| Google Play | Google handles it — request through Google directly |
| API Credits | **Non-refundable** |

### Why doesn't my Subscription show in the mobile app?

It's usually from logging in with a different account. Check that you logged in with the same account you signed up with.

### What's this large invoice I don't recognize?

It may be the **yearly SuperGrok Heavy**, not an API charge. Check the purchase date and Subscription history before disputing.

---

## Accounts and login

### How do I change my login email?

Add or change your Sign-in Methods at [accounts.x.ai](https://accounts.x.ai)

### I logged in with Apple "Hide My Email" and my Subscription doesn't show?

You must log in with Apple Sign-in only (not the private relay email). Use the same "Sign in with Apple" as before.

### How do I delete my account?

Go to [accounts.x.ai/account](https://accounts.x.ai/account). A deleted account can be recovered within **30 days**.

---

## Images and video (Grok Imagine)

### Why do generated images have a "grok" Watermark? Can I remove it?

**No.** The Watermark is a legal requirement in some countries (e.g. India, Australia). xAI can't turn it off where the law requires it.

### I enabled NSFW but it's still Blocked?

Enabling NSFW doesn't make Grok skip Moderation — content filtering still applies. The Algorithm changes often; there's no fixed rule.

### My 720p video only came out 480p?

720p video automatically Falls back to 480p when you hit that Plan's 720p Quota.

---

## Products and models

### Where did Grok Studio go?

**Grok Studio has been discontinued** — use **Grok Build** instead. If any Third-party App uses your Grok Credentials to access Studio, revoke its permission immediately.

### Should I use grok.com or grok.x.ai?

Use **grok.com** in standard Chrome/Chromium. grok.x.ai may be missing some features, e.g. Projects.

---

## Files and data

### How do I upload a file?

1. Click the **+** button next to the input box
2. Choose a file (or drag and drop on the Web)
3. Send it with your message

### What's the maximum file size?

**150 MB per file** for documents, images, code, and audio.

### How many files can Grok see at once?

- Web: ~100 files
- Android: 20 files
- iOS: several files

### How do I delete files?

Go to [grok.com/files](https://grok.com/files) or **Profile → Settings → Data Controls**

---

## Questions for developers (Data & Privacy FAQ)

Reference: [Data & Privacy](https://docs.x.ai/developers/faq/security)

### Does xAI keep my Conversation data?

xAI has a Data Retention Policy that differs by Plan:
- **API Free Tier:** may use data to improve the model
- **Enterprise:** has a Custom Retention policy as agreed

See more details at [x.ai/legal](https://x.ai/legal)

### How should I store my API Key?

- **Don't:** Hardcode it in your Source Code
- **Do:** use Environment Variables or a Secret Manager
- **Do:** Rotate the API Key regularly
- **Do:** use mTLS for High Security systems

### What if my API Key leaks?

1. Go to [console.x.ai/team/default/api-keys](https://console.x.ai/team/default/api-keys) immediately
2. Delete the leaked API Key
3. Create a new API Key
4. Update the Key in every system that uses it

### Does xAI have an advertising problem?

xAI has no ads in its Products and takes no money from Advertisers to promote products in conversations.

---

## General FAQ

Reference: [General FAQ](https://docs.x.ai/developers/faq/general)

### Does Grok know about current events?

The Grok 3 and Grok 4 models have a Knowledge Cutoff of **November 2024**. For the latest information, enable the **Web Search** or **X Search** Tool.

### Is the API Compatible with the OpenAI SDK?

Yes — just change `base_url` to `https://api.x.ai/v1`. No other code changes needed.

### What SDKs are there?

| SDK | Install |
|---|---|
| xAI SDK (Python) | `pip install xai-sdk` |
| OpenAI SDK (Python) | `pip install openai` |
| AI SDK (JavaScript) | `npm install ai @ai-sdk/xai` |
| OpenAI SDK (JavaScript) | `npm install openai` |

### How can I contact xAI?

| Channel | Used for |
|---|---|
| [support@x.ai](mailto:support@x.ai) | General Support |
| [sales@x.ai](mailto:sales@x.ai) | Enterprise Sales / higher Rate Limits |
| [Discord](https://discord.gg/x-ai) | Community Developer |
| [grok.com/report](https://grok.com) | Report a Bug in the app |
| [x.ai/legal](https://x.ai/legal) | Terms & Policies |
| [status.x.ai](https://status.x.ai) | API Status |

---

## Migration Guides

### Model Retirement (May 15, 2026)

Reference: [Model Retirement May 15](https://docs.x.ai/developers/migration/may-15-retirement)

xAI is discontinuing support for some older models on May 15, 2026. Check which model you're using and Migrate to `grok-4.3` or a newer version.

### Migrate from the Chat Completions API to the Responses API

Reference: [Migrating to Responses API](https://docs.x.ai/developers/model-capabilities/text/comparison)

| Old (Chat Completions) | New (Responses API) |
|---|---|
| `client.chat.completions.create()` | `client.responses.create()` |
| `messages` parameter | `input` parameter |
| `choices[0].message.content` | `output_text` |

**Migration example:**

```python
# Old way (Chat Completions)
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "Hello"}]
)
text = response.choices[0].message.content

# New way (Responses API)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Hello"}]
)
text = response.output_text
```
