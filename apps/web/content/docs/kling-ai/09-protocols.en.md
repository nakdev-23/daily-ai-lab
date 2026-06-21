---
title: "Protocols — policies and terms"
tool: "Kling AI"
icon: "icon-docs"
level: "pro"
summary: "Kling AI collects data to provide the API service, which includes:"
readTime: "3 min"
readers: "0"
locked: false
order: 9
---
# 09 · Protocols — policies and terms

> Official Docs reference:
> - [Privacy Policy of API Service](https://kling.ai/document-api/protocols%2FprivacyPolicy)
> - [Terms of API Service](https://kling.ai/document-api/protocols%2FpaidServiceProtocol)
> - [API Service Level Agreement (SLA)](https://kling.ai/document-api/protocols%2FpaidLevelProtocol)

---

## 1. Privacy Policy of API Service

> Reference: [Privacy Policy](https://kling.ai/document-api/protocols%2FprivacyPolicy)

### Key points summary

Kling AI collects data to provide the API service, which includes:

- **Account info**: name, email, payment information
- **Usage data**: Requests sent, Output generated, Logs
- **Input/Output content**: Prompts, images, videos sent or created

### Data retention

- **Results (images/videos)** are stored in the system for **30 days**, then deleted automatically
- Result URLs are temporary only; you must download before they expire
- Data may be used to improve the AI model (as stated in the policy)

### User rights

- You can request deletion of your personal data
- Contact the Support team if you have questions

> ⚠️ **Read the full policy at**: [kling.ai/document-api/protocols/privacyPolicy](https://kling.ai/document-api/protocols%2FprivacyPolicy)

---

## 2. Terms of API Service

> Reference: [Terms of Service](https://kling.ai/document-api/protocols%2FpaidServiceProtocol)

### Key points to know

**What you can do:**
- Use the API in commercial applications (per the plan you chose)
- Create content for customers or the public
- Use the generated Output commercially

**What's prohibited:**
- Create content that breaks the law, is pornographic, or incites hatred
- Use it to create Deepfakes improperly
- Share your API Key or Credentials with others
- Resell access to the API directly (not through an app you built)

**About refunds:**
- Generally, a Resource Package **can't be refunded** after use
- If purchased as an individual (not an organization) and not yet used, you may request a refund within a set period

> ⚠️ **Read the full terms at**: [kling.ai/document-api/protocols/paidServiceProtocol](https://kling.ai/document-api/protocols%2FpaidServiceProtocol)

---

## 3. API Service Level Agreement (SLA)

> Reference: [SLA](https://kling.ai/document-api/protocols%2FpaidLevelProtocol)

### Service guarantee levels

| Item | Target |
|--------|---------|
| **Uptime** | 99.9% |
| **Planned Maintenance** | Notified in advance |
| **Response Time** | Standard ~30s, Pro ~60s (approximate) |

### If the system goes down

If the system has problems and Uptime falls below the SLA, users may be eligible for compensation, per the conditions stated in the agreement.

### Maintenance notifications

- Scheduled Maintenance is announced in advance through official channels
- Emergency Maintenance may occur without prior notice

> ⚠️ **Read the full SLA at**: [kling.ai/document-api/protocols/paidLevelProtocol](https://kling.ai/document-api/protocols%2FpaidLevelProtocol)

---

## 4. Content Safety Policy

Beyond the legal terms, Kling AI has an automatic **Content Security Policy** that checks Input and Output:

- Prompts or images that violate the policy are rejected (Error 1301)
- Generated content is scanned before being returned to the user
- If you get Error 1301 frequently, check the Prompt and revise the content

> Additional reference: [Content Policy Error 1301](https://kling.ai/document-api/apiReference%2FcommonInfo)
