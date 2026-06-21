---
title: "Rate Limits and pricing — limits and cost"
tool: "DALL·E"
icon: "icon-docs"
level: "pro"
summary: "Complete information on the DALL·E API's rate limits, how many images you can create per minute, and the price per image by size and quality"
readTime: "5 min"
readers: "0"
locked: false
order: 10
---
# Rate Limits and pricing — limits and cost

> Primary reference: [OpenAI Rate Limits](https://platform.openai.com/docs/guides/rate-limits) | [OpenAI Pricing](https://openai.com/api/pricing)

---

## What are Rate Limits

The **Rate Limits** (the maximum number of API calls you can make in a given period, to prevent overuse) of the DALL·E API define how many images you can create each minute.

### Rate Limit units

- **RPM** — Requests Per Minute (the number of requests sent to the API per minute)
- **IPM** — Images Per Minute (the total number of images created per minute)

---

## Rate Limits by model

### DALL·E 3

| Tier | RPM | IPM |
|---|---|---|
| Free / Trial | 1 RPM | 1 IPM |
| Tier 1 | 5 RPM | 5 IPM |
| Tier 2 | 7 RPM | 7 IPM |
| Tier 3 | 7 RPM | 7 IPM |
| Tier 4 | 15 RPM | 15 IPM |
| Tier 5 | 50 RPM | 50 IPM |

### DALL·E 2

| Tier | RPM | IPM |
|---|---|---|
| Free / Trial | 5 RPM | 5 IPM |
| Tier 1 | 20 RPM | 40 IPM |
| Tier 2 | 40 RPM | 40 IPM |
| Tier 3 | 60 RPM | 60 IPM |
| Tier 4 | 100 RPM | 100 IPM |
| Tier 5 | 200 RPM | 200 IPM |

> **Note:** DALL·E 2 has higher rate limits than DALL·E 3 because DALL·E 3 uses more resources to create an image.

---

## Tier System

OpenAI divides API access into tiers (levels — groups of users with different rights and limits):

| Tier | Promotion condition |
|---|---|
| Free | Sign up a new account |
| Tier 1 | First payment of $5+ |
| Tier 2 | Spent $50+ on the API and 7 days passed since Tier 1 |
| Tier 3 | Spent $100+ on the API and 7 days passed since Tier 2 |
| Tier 4 | Spent $250+ on the API and 14 days passed since Tier 3 |
| Tier 5 | Spent $1,000+ on the API and 30 days passed since Tier 4 |

---

## DALL·E 3 pricing

DALL·E 3 is priced by size and quality:

### Standard Quality

| Size | Price/image |
|---|---|
| `1024x1024` | $0.040 |
| `1024x1792` | $0.080 |
| `1792x1024` | $0.080 |

### HD Quality

| Size | Price/image |
|---|---|
| `1024x1024` | $0.080 |
| `1024x1792` | $0.120 |
| `1792x1024` | $0.120 |

---

## DALL·E 2 pricing

DALL·E 2 is much cheaper than DALL·E 3:

| Size | Price/image |
|---|---|
| `1024x1024` | $0.020 |
| `512x512` | $0.018 |
| `256x256` | $0.016 |

---

## Price comparison: DALL·E 2 vs DALL·E 3

| Model | Size | Quality | Price/image |
|---|---|---|---|
| DALL·E 2 | 256x256 | - | **$0.016** (cheapest) |
| DALL·E 2 | 512x512 | - | $0.018 |
| DALL·E 2 | 1024x1024 | - | $0.020 |
| DALL·E 3 | 1024x1024 | standard | $0.040 |
| DALL·E 3 | 1024x1792 | standard | $0.080 |
| DALL·E 3 | 1024x1024 | hd | $0.080 |
| DALL·E 3 | 1024x1792 | hd | **$0.120** (most expensive) |

---

## How to calculate cost

### Example 1: create 100 blog images

Scenario: a blog needs 100 illustrations/month, 1024x1024, DALL·E 3 Standard

```
Count: 100 images
Price: $0.040/image
Total: 100 × $0.040 = $4.00/month
```

### Example 2: an image-generation app for 1,000 users

Scenario: an app where each user creates 5 images/day, 1024x1024, DALL·E 3 Standard

```
Count: 1,000 × 5 = 5,000 images/day
Price: $0.040/image
Total/day: 5,000 × $0.040 = $200/day
Total/month: $200 × 30 = $6,000/month
```

### Example 3: testing prompts to save cost

Scenario: test a prompt 50 times using DALL·E 2 512x512 instead of DALL·E 3

```
DALL·E 2 512x512: 50 × $0.018 = $0.90
DALL·E 3 Standard: 50 × $0.040 = $2.00
Saved: $1.10 (55%)
```

---

## Cost-saving techniques

### 1. Test with DALL·E 2 first

While developing and testing prompts, use DALL·E 2, which is much cheaper, then switch to DALL·E 3 for the final work.

### 2. Use `standard` while testing

```python
# Test — cheap
test = client.images.generate(
    model="dall-e-3",
    prompt=your_prompt,
    quality="standard",  # $0.040
)

# Final — more expensive but high quality
final = client.images.generate(
    model="dall-e-3", 
    prompt=your_prompt,
    quality="hd",  # $0.080
)
```

### 3. Set a Budget Alert

In the OpenAI Dashboard, set a spending limit so you don't go over budget:

1. Go to [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing)
2. Set a **Monthly Budget**
3. Set an **Email Alert** at 80% of the budget

### 4. Cache frequently used results

```python
import hashlib
import json
import os

def generate_with_cache(prompt: str, **kwargs) -> str:
    """Create an image with caching (storing results for reuse — no repeated API call for the same prompt)"""
    
    # Build a cache key from the prompt and parameters
    cache_key = hashlib.md5(
        json.dumps({"prompt": prompt, **kwargs}, sort_keys=True).encode()
    ).hexdigest()
    
    cache_path = f"cache/{cache_key}.png"
    
    # If it's already in the cache, use it from there
    if os.path.exists(cache_path):
        print("Using image from cache (saving cost)")
        return cache_path
    
    # If not, call the API
    response = client.images.generate(prompt=prompt, **kwargs)
    # ... save and return
```

---

## Handling exceeding the Rate Limit

When you exceed the rate limit, the API responds with HTTP 429:

```json
{
  "error": {
    "message": "Rate limit reached for images per minute...",
    "type": "requests",
    "code": "rate_limit_exceeded"
  }
}
```

### How to handle it with Exponential Backoff (waiting with increasing time — wait 1 second, 2, 4, 8... before retrying)

```python
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI()

def generate_with_retry(prompt: str, max_retries: int = 5):
    """Create an image with automatic retry when over the rate limit"""
    
    for attempt in range(max_retries):
        try:
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
            )
            return response.data[0].url
            
        except RateLimitError:
            if attempt == max_retries - 1:
                raise  # tried them all, give up
            
            # Calculate the wait time with exponential backoff
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limit exceeded, waiting {wait_time:.1f} seconds before retrying...")
            time.sleep(wait_time)

# Usage
url = generate_with_retry("A beautiful sunset")
print(f"Success: {url}")
```

---

## Check your usage

See your usage and cost at:

- **Usage Dashboard:** [platform.openai.com/usage](https://platform.openai.com/usage)
- **Billing:** [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing)

---

## Summary

The DALL·E API's rate limits and pricing differ by tier and model used. DALL·E 3 is higher quality but more expensive with lower rate limits, while DALL·E 2 is cheaper with higher rate limits, good for testing or high-volume use. Good usage planning and caching results can save cost significantly.
