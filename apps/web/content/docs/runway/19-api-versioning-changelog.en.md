---
title: "API Versioning and Changelog — version management"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "Understand Runway's API Versioning system, how to specify a version, the Breaking Changes policy, and how to safely Migrate to a new version"
readTime: "6 min"
readers: "0"
locked: false
order: 19
---

# API Versioning and Changelog — version management

> Runway uses a Versioning system via an HTTP Header so your application keeps working even when the API changes.

---

## Runway API's Versioning system

### How to specify the version

Runway uses the **`X-Runway-Version` HTTP Header** to specify the API version:

```http
X-Runway-Version: 2024-11-06
```

Version format: **YYYY-MM-DD** (year-month-day)

### The SDK handles it automatically

If you use the Official SDK, you don't specify the Header yourself; a new SDK version sends the correct Version automatically.

If you call HTTP directly (cURL, fetch, Axios):
```bash
curl -X POST https://api.runwayml.com/v1/image_to_video \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Runway-Version: 2024-11-06" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## Version: 2024-11-06

**The current version** at the time of writing.

This version covers:
- Image-to-Video Generation (Gen-4.5, Gen-4 Turbo, Gen-3 Turbo)
- Text-to-Image (Gen4 Image, GPT Image 2, Gemini Image Pro)
- Characters/Avatars API
- Audio Generation
- Uploads API

---

## When does Runway create a new version?

Runway creates a new version only when there are **Breaking Changes** (changes that make old code stop working):

### Breaking Changes that cause a new version:
1. **Changing a Parameter's Type** — e.g. changing from a string URL to an object
2. **Renaming a Parameter** — e.g. `promptImage` to `inputImage`
3. **Removing a Feature** — removing an Endpoint or Parameter

### No new version when:
- Adding a new Parameter (Backward compatible)
- Adding a new Model
- Improving quality

---

## Old-version support policy

> "We will support old API versions for **4 months** after a new version is released."

**Example Timeline:**
```
January 1  — release version 2025-01-01
May 1      — version 2024-11-06 ends support (4 months later)
```

**So:** you must Migrate to the new version within 4 months.

---

## A note about `/v1/` in the URL

The `/v1/` path in the Endpoint URL is **not a Version Number** — it's reserved for future use if Runway wants to release multiple Endpoint sets at once.

So the URL will remain `/v1/image_to_video` even with a new API version.

---

## API Changelog

### Viewing the Changelog

The full Changelog is at [docs.dev.runwayml.com/api-details/api_changelog/](https://docs.dev.runwayml.com/api-details/api_changelog/)

### Latest models added (as of mid-2025)
- **GWM-1** — General World Model for Avatars
- **Gen-4.5** — an upgrade from Gen-4
- **Aleph 2.0** — a new Video-to-Video version
- **Act-Two** — the 2nd-generation Character Animation
- **Veo3, Veo3.1** — models from Google with audio

---

## How to Migrate to a new version

### Step 1: Check for Breaking Changes

Read the Changelog carefully to find changed Parameters.

### Step 2: Update the SDK

```bash
# Node.js
npm update @runwayml/sdk

# Python
pip install --upgrade runwayml
```

A new SDK version sends the correct API Version automatically.

### Step 3: Use the TypeScript/Python Type Checker

The Type Checker tells you which code needs fixing:

```bash
# TypeScript
npx tsc --noEmit

# Python
mypy your_app.py
```

### Step 4: Test in a Staging Environment

A **Staging Environment** (a test system like Production but for testing) before deploying live:

1. Update the SDK in Staging first
2. Test every type of Generation you use
3. Check Error Handling
4. Monitor for 24-48 hours
5. Deploy to Production

---

## Best Practices for Version Management

### 1. Pin the SDK Version in package.json

```json
{
  "dependencies": {
    "@runwayml/sdk": "1.2.3"
  }
}
```

Don't use `^1.2.3` or `~1.2.3` in Production because they may Auto-upgrade.

### 2. Subscribe for Notifications

Follow the Runway Developer Newsletter or GitHub Releases to be notified when a new version is released.

### 3. Have separate Keys for Staging and Production

```bash
# Staging
RUNWAYML_API_SECRET=key_staging_...

# Production
RUNWAYML_API_SECRET=key_prod_...
```

This lets you test Migration without affecting Production.

---

## Go-Live Checklist

Before launching your application to real use, check:

### Usage management
- [ ] Check the Tier supports your expected volume
- [ ] Set up Autobilling
- [ ] Set an appropriate Threshold

### Integration testing
- [ ] Test Rate Limiting (429 error)
- [ ] Test Server Outage (503 error)
- [ ] Check Input Validation in every case
- [ ] Test Timeout scenarios

### Security
- [ ] The API Key isn't in the Code (use an Environment Variable or Secret Manager)
- [ ] Have separate Keys for Dev/Staging/Production
- [ ] Check `git grep "key_"` before deploying
- [ ] Disable Keys you no longer need

### Monitoring
- [ ] Track the Error Rate
- [ ] Track the Daily Generation Count
- [ ] Track the Throttled Task Count
- [ ] Set up Alerting for a high Error Rate
- [ ] Check that emails from Runway aren't marked as Spam

### Compliance
- [ ] Check the Content Policy
- [ ] Have Pre-filtering for User Input
- [ ] Show the "Powered by Runway" Attribution

---

## Summary

Runway's Versioning system is designed to be Stable and Predictable. Developers can trust that code written today will still work for at least 4 months after a new version. The key is to Subscribe for Changelog notifications and have a Migration plan before an old version Deprecates.
