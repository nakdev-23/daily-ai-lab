---
title: "API Keys and API Groups"
tool: "Perplexity"
icon: "icon-docs"
level: "beginner"
summary: "How to create and manage API Keys, plus using API Groups to manage your team and billing"
readTime: "5 min"
readers: "0"
locked: false
order: 3
---

# API Keys and API Groups

Before calling the Perplexity API every time, you need an **API Key** (a secret code proving you have the right to use the service) and an understanding of the **API Groups** system (organization workspaces for managing teams and billing).

---

## What is an API Key?

An API Key is a secret code in text form, e.g. `pplx-abc123xyz...`, that you attach to every Request (the sending of data to the API) to prove it's you.

### How to create an API Key
1. Go to **[console.perplexity.ai](https://console.perplexity.ai)**
2. Choose the **API Keys** menu in the left bar
3. Click **"Generate New Key"**
4. Name the Key so you remember which project it's for
5. **Copy the Key value immediately** — the system shows the full value only once when created; after that it's hidden

> **New security policy (April 2026):** The full Key value is shown **only when created**; after that only the beginning and end are shown, to prevent leaks.

---

## How to use the API Key in Code

The safest way is to use an **Environment Variable** (storing a secret separate from the Code):

### Python
```python
import os
from perplexityai import Perplexity

# The SDK pulls PERPLEXITY_API_KEY from the Environment automatically
client = Perplexity()

# Or specify the API Key directly (not recommended for Production)
client = Perplexity(api_key="pplx-xxxxxxxx")
```

### TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

// Pulls the Key from the Environment automatically
const client = new Perplexity();

// Or specify directly
const client = new Perplexity({ apiKey: "pplx-xxxxxxxx" });
```

### HTTP Header (cURL)
```bash
curl -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
     https://api.perplexity.ai/v1/agent
```

---

## Revoking an API Key

If a Key leaks or you no longer want to use it:
1. Go to the **API Keys** page in the Console
2. Click **"Revoke"** next to that Key's name
3. The Key expires immediately — Code using that Key can no longer call the API

> **Good practice:** Create a separate Key for each project, so it's easy to revoke just that project's without affecting others.

---

## What are API Groups?

An **API Group** is an organization's Workspace in the Perplexity Console. It helps you:

- **Manage billing** — set up the payment method and view invoices
- **Manage API Keys** — create, revoke, and view usage history
- **Invite team members** — assign permissions to developers on the team
- **Track costs** — view usage by Key or by API

### Permissions in the team

| Role | Permissions |
|---|---|
| Owner | Can do everything, including payment |
| Admin | Manage Keys and members, no payment rights |
| Developer | View and create only their own Keys |

---

## API Key security — dos and don'ts

### Do
- Store the Key in an Environment Variable or a Secret Manager (a secret-storage system)
- Use separate Keys for Development and Production
- Check Usage regularly to spot anomalies
- Rotate the Key (change to a new Key) every 3–6 months

### Don't
- **Don't** put the Key directly in Code you'll Push to GitHub
- **Don't** share the Key via Line, Email, or Chat
- **Don't** use the same Key across all projects
- **Don't** put the Key in Client-side Code (code running in the user's browser), because others can see it

---

## Purchasing via AWS Marketplace

Organizations wanting to combine Perplexity costs with their AWS bill can sign up via **AWS Marketplace** (Amazon's service marketplace), which lets you:

- Pay through a single AWS Billing
- Get Enterprise discounts per your AWS contract
- Manage per AWS Policy

---

## Summary

- An **API Key** is a secret code you must keep safe; create it at console.perplexity.ai
- The system shows the full Key value only once when created — copy it immediately
- Always use an **Environment Variable**; don't put the Key directly in Code
- **API Groups** help manage the team, assign permissions, and view costs
- Revoke a Key immediately if you suspect it's leaked
