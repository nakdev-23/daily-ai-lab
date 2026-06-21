---
title: "Context Caching — cut API cost by caching context"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Context Caching helps developers save up to 75% on API cost by caching frequently reused content, e.g. a long system prompt, documents, or large videos"
readTime: "8 min"
readers: "0"
locked: false
order: 26
---

# Context Caching — cut API cost by caching context

**Context Caching** (temporarily storing context — so you don't resend data every time, reducing cost) is a feature that lets developers "store" frequently reused content in advance, instead of sending the same tokens (pieces of text) on every request, saving cost and increasing speed.

---

## Why use Context Caching?

### A common problem

Suppose you build a chatbot that has to read a 500-page product manual before answering every question:

```
Request 1: [500-page manual = 400,000 tokens] + [50-token question]
Request 2: [500-page manual = 400,000 tokens] + [40-token question]
Request 3: [500-page manual = 400,000 tokens] + [60-token question]
```

You pay for 400,000 tokens again on every request!

### How Context Caching solves it

```
First time: Cache [500-page manual = 400,000 tokens] → kept for 1 hour

Request 1: [Cache ID] + [50-token question]  → pay only 50 tokens + the cache fee
Request 2: [Cache ID] + [40-token question]  → pay only 40 tokens + the cache fee
Request 3: [Cache ID] + [60-token question]  → pay only 60 tokens + the cache fee
```

**Saves up to 75%** for Gemini Flash

---

## Two kinds of Caching

### 1. Implicit Caching (automatic — the system handles it)
- On automatically in **Gemini 2.5** and above
- **No configuration needed** — the model handles it all
- Doesn't guarantee a cache hit, but has no extra cost
- Needs a minimum: **2,048 tokens** (Gemini 2.5 Flash)

### 2. Explicit Caching (custom)
- Define what to cache
- **Guarantees** the cache is used
- Pay a storage cost (per hour)
- Control the TTL (Time-To-Live — how long data is kept before expiring) (default 1 hour)

---

## Using Explicit Caching (Python)

### Create a cache

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# Read the file to cache
with open("product_manual.pdf", "rb") as f:
    pdf_data = f.read()

# Create the cache
cache = client.caches.create(
    model="gemini-2.5-flash",
    config={
        "system_instruction": "You are a product expert helping customers troubleshoot",
        "contents": [
            {
                "parts": [
                    {"inline_data": {"mime_type": "application/pdf", "data": pdf_data}},
                    {"text": "This is the complete product manual"}
                ],
                "role": "user"
            }
        ],
        "ttl": "3600s"  # keep for 1 hour (or set "86400s" for 1 day)
    }
)

print(f"Cache ID: {cache.name}")
# Example: cachedContents/abc123xyz
```

### Use the cache in a request

```python
# Use the created cache
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What are the steps to fix a frozen screen?",
    config={
        "cached_content": cache.name  # specify the cache ID
    }
)

print(response.text)

# View the number of cached tokens (tokens used from the cache)
print(f"Cached tokens: {response.usage_metadata.cached_content_token_count}")
```

---

## Manage caches

### View existing caches
```python
# List all caches
for cache in client.caches.list():
    print(f"Name: {cache.name}")
    print(f"Model: {cache.model}")
    print(f"Expire time: {cache.expire_time}")
    print(f"Token count: {cache.usage_metadata.total_token_count}")
    print("---")
```

### Update the TTL (extend the storage time)
```python
# Extend the cache by another 2 hours
client.caches.update(
    name=cache.name,
    config={"ttl": "7200s"}
)
```

### Delete a cache
```python
client.caches.delete(name=cache.name)
```

---

## What can be cached

- **Documents** — PDF, Word, text files
- **Images** — several images at once
- **Video** — long videos for repeated analysis
- **System instructions** — very long system instructions
- **Code** — a large codebase
- **Previous conversation** — conversation history

---

## Pricing and cost savings

### Pricing structure

| Part | Price |
|---|---|
| **Input tokens (normal)** | Full price |
| **Cached input tokens (tokens from cache)** | ~25% of the normal input price |
| **Storage cost** | Charged per 1 million tokens per hour |
| **Output tokens** | Normal price (unchanged) |

### Example saving

Suppose you send 400,000 tokens as system context 100 times per day:

**Without cache:**
- 400,000 × 100 requests = 40,000,000 tokens/day (full price)

**With cache (1-day TTL):**
- 400,000 tokens cached once
- 100 requests use cached tokens (charged at 25% of normal)
- **Saves ~75%** of input token costs

---

## Minimum Token Requirements

| Model | Minimum tokens for cache |
|---|---|
| Gemini 2.5 Flash | 2,048 tokens |
| Gemini 2.5 Pro | 2,048 tokens |
| Gemini 1.5 Flash | 32,768 tokens |
| Gemini 1.5 Pro | 32,768 tokens |

---

## Best Practices

### 1. Use it for content that's truly reused
```python
# Good: a document every request must read
cache_content = "a 200-page legal document"

# Not worth it: content used only once
# Don't cache a prompt that changes every request
```

### 2. Place cached content "before" the question
```
[Cached: system instruction + documents]
[Non-cached: user question]
```

### 3. Set the TTL appropriately
```python
# An unchanging document
ttl = "86400s"   # 24 hours

# A document that may update often
ttl = "3600s"    # 1 hour

# A long-running application
ttl = "604800s"  # 7 days (maximum)
```

### 4. Monitor cache usage
```python
# Check whether the cache was actually used
if response.usage_metadata.cached_content_token_count > 0:
    print("✓ Cache hit!")
else:
    print("✗ Cache miss")
```

---

## When not to use Explicit Caching

- Content changes every request
- There are few requests (the storage cost isn't worth the saving)
- Content is shorter than the minimum token threshold
- You're on Gemini 2.5 and Implicit Caching is enough
