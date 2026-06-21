---
title: "Pricing & Billing"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Kling AI has two separate pricing systems:"
readTime: "3 min"
readers: "0"
locked: false
order: 8
---
# 08 · Pricing & Billing

> Official Docs reference:
> - [Billing Info](https://kling.ai/document-api/productBilling%2FbillingMethod)
> - [Prepaid Resource Packs](https://kling.ai/document-api/productBilling%2FprePaidResourcePackage)

---

## 1. Kling AI's pricing system

Kling AI has two separate pricing systems:

| System | For | Detail |
|------|--------|-----------|
| **Subscription Plans** | General users (kling.ai/app) | Monthly/yearly, uses Credits |
| **API Resource Packages** | Developers (kling.ai/dev) | Prepaid, uses Units |

> ⚠️ These two systems are **completely separate** — Subscription Credits can't be used with the API.

---

## 2. Subscription Plans (for general users)

### Pricing plans (2026)

| Plan | Price/month | Price/year (save ~34%) |
|-----|-----------|----------------------|
| **Free** | Free | - |
| **Standard** | ~$10/month | ~$6.60/month |
| **Pro** | ~$37/month | ~$24.42/month |
| **Premier** | ~$92/month | ~$60.72/month |
| **Ultra** | ~$180/month | No yearly plan |

> Prices may vary by region; check current prices at [kling.ai/pricing](https://kling.ai/pricing)

### Subscription Credits

- Monthly Credits **expire at the end of the billing cycle**; they don't roll over
- Credits from Add-on purchases last **2 years**
- The Free plan gets 66 Credits/day but they expire within 24 hours

### Credit cost per usage (Kling 3.0)

| Quality | Credits per second |
|--------|----------------|
| 720p no audio | 6 credits/second |
| 1080p + Native Audio | 12 credits/second |

---

## 3. API Billing — payment for the API

> Reference: [Billing Info](https://kling.ai/document-api/productBilling%2FbillingMethod)

### Payment method

Kling's API uses a **Prepaid** system:
- Buy a Resource Package in advance
- Each successfully created job deducts Units from the Package
- If the Package runs out, you must buy more before you can keep using it

### Payment system

- Uses **Stripe** (upgraded from Checkout)
- Supports credit/debit cards worldwide

> ⚠️ **For organization purchases (needing a tax invoice)**
> You must select **"I'm purchasing as a business"** and enter the Tax ID during payment.
> If you don't do it now, it's treated as a personal purchase and:
> - There may be extra tax
> - You can't edit the invoice details
> - It can't be refunded

---

## 4. Prepaid Resource Packages — resource packages for the API

> Reference: [Prepaid Resource Packs](https://kling.ai/document-api/productBilling%2FprePaidResourcePackage)

### Resource Package types

There are packages separated by Use Case:

| Type | Used for |
|--------|---------|
| **Video Generation Package** | Text to Video, Image to Video, Video Effects, Lip Sync, Avatar, Extend Video, etc. |
| **Image Generation Package** | Image Generation, Reference to Image, Extend Image, AI Multi-Shot, etc. |
| **Virtual Try-On Package** | Virtual Try-On specifically |

### Example Package prices (approximate)

| Package | Price | Units |
|---------|------|-------|
| Trial Package | ~$9.80 | Trial units |
| Starter | Cheapest | Few units |
| Large | ~$7,560 | 60,000 units |

> For exact prices and Units, check at [kling.ai/dev/pricing](https://kling.ai/dev/pricing)

### Package Concurrency

Each package tier gives a different Concurrency — a bigger Package = higher Concurrency = able to process more at once.

If you have several Packages, the system uses the **highest** Concurrency value among all Active Packages.

### Trial Resource Package

Available for **testing before buying**, with a limited number of Units, good for:
- Testing the API connection
- Checking result quality
- Testing the Workflow before Production

---

## 5. Query User Info — check account info

> Reference: [Query User Info](https://kling.ai/document-api/apiReference%2FaccountInfoInquiry)

### View remaining Units

```
GET https://api-singapore.klingai.com/v1/account/info
```

```python
resp = requests.get(f"{BASE}/v1/account/info",
    headers={"Authorization": f"Bearer {token}"}
)
info = resp.json()
print(info)  # shows remaining Units, Active Packages, etc.
```
