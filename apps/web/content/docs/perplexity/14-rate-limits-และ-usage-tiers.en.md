---
title: "Rate Limits and Usage Tiers"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "API call limits, usage tiers, and how to professionally handle Rate Limits in your application"
readTime: "6 min"
readers: "0"
locked: false
order: 14
---

# Rate Limits and Usage Tiers

**Rate Limits** (caps on the call rate — the maximum number of API calls in a given time) are a measure Perplexity uses to keep the service stable for everyone. Understanding and handling Rate Limits correctly is an important skill for developers.

---

## Usage Tiers

A **Usage Tier** (a level defining how much you can call the API) increases automatically based on usage volume and payment history.

| Tier | Condition | Example Rate Limit |
|---|---|---|
| Tier 1 (starting) | New sign-up | High limits (testing) |
| Tier 2 | Regular usage + on-time payment | Increased |
| Tier 3 | Higher usage volume | Increased further |
| Enterprise | Contact sales | No limit (Custom) |

> **Note:** See your API Key's current Rate Limits at [console.perplexity.ai](https://console.perplexity.ai) on the API Keys page, since the numbers may change by Tier and current policy.

---

## Types of Rate Limits

### RPM (Requests Per Minute)
The maximum Requests you can send in 1 minute

### RPD (Requests Per Day)
The maximum Requests you can send in 1 day (24 hours)

### TPM (Tokens Per Minute)
The maximum Tokens that can be processed in 1 minute (Input + Output combined)

---

## Error Code when rate limited

When you exceed the limit, the API returns HTTP 429:

```json
{
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded. Please wait before retrying.",
    "retry_after": 30  // seconds to wait
  }
}
```

---

## Handling Rate Limits in Code

### Method 1 — Exponential Backoff (wait progressively longer)

**Exponential Backoff** (backing off — waiting longer each time a Request fails, to prevent spamming the Server):

```python
import time
import random
from perplexityai import Perplexity, RateLimitError, APIStatusError

client = Perplexity()

def call_with_backoff(func, max_retries=5):
    """Call the API with Exponential Backoff retries"""
    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise  # out of retries, propagate the Error
            
            # Compute the wait: 1s, 2s, 4s, 8s, 16s + a little randomness (Jitter)
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limit hit. Waiting {wait_time:.1f} seconds... (attempt {attempt+1})")
            time.sleep(wait_time)
        except APIStatusError as e:
            if e.status_code == 429:  # HTTP 429 = Too Many Requests
                wait_time = int(e.response.headers.get("Retry-After", 30))
                time.sleep(wait_time)
            else:
                raise

# Usage
result = call_with_backoff(
    lambda: client.agent.create(preset="pro-search", input="A question")
)
```

### Method 2 — Semaphore for Concurrent work

**Semaphore** (a control signal — limiting how many jobs run at once):

```python
import asyncio
from perplexityai import AsyncPerplexity

async def search_many(queries, max_concurrent=5):
    """Search concurrently, but limited to no more than 5 Requests at once"""
    client = AsyncPerplexity()
    semaphore = asyncio.Semaphore(max_concurrent)  # allow 5 at once
    
    async def search_one(query):
        async with semaphore:  # wait for a free slot before sending the Request
            return await client.search.create(query=query)
    
    tasks = [search_one(q) for q in queries]
    results = await asyncio.gather(*tasks)
    return results

# Search 50 terms concurrently, but only 5 Requests at once
queries = [f"AI topic {i}" for i in range(50)]
results = asyncio.run(search_many(queries))
```

### Method 3 — A Token Bucket Rate Limiter

**Token Bucket** (a technique for measuring the Request rate so it doesn't exceed the limit):

```python
import time

class RateLimiter:
    """Limit API calls to no more than X per minute"""
    
    def __init__(self, max_requests_per_minute):
        self.max_rpm = max_requests_per_minute
        self.min_interval = 60.0 / max_requests_per_minute  # seconds per request
        self.last_request_time = 0
    
    def wait_if_needed(self):
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        if elapsed < self.min_interval:
            sleep_time = self.min_interval - elapsed
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()

# Usage
limiter = RateLimiter(max_requests_per_minute=50)

for query in large_query_list:
    limiter.wait_if_needed()  # wait if needed
    result = client.search.create(query=query)
```

---

## Checking current Usage

The API Response has Header data telling you the current Rate Limit:

```python
import httpx  # HTTP Client

response = httpx.post(
    "https://api.perplexity.ai/v1/search",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"query": "test"}
)

# See the Rate Limit from the Response Headers
print(response.headers.get("x-ratelimit-limit-requests"))    # the limit
print(response.headers.get("x-ratelimit-remaining-requests"))  # remaining
print(response.headers.get("x-ratelimit-reset-requests"))      # the reset time
```

---

## Best Practices

### 1. Don't Poll continuously
```python
# Not recommended — spams the API and you get rate limited
while True:
    result = client.search.create(query="latest news")
    time.sleep(1)  # waiting just 1 second is still too fast

# Recommended — use a Webhook or a Scheduled Job
# Run every 15 minutes with a cron job instead
```

### 2. Cache results
```python
import functools
import time

cache = {}
CACHE_TTL = 300  # 5 minutes

def cached_search(query):
    """Cache results for 5 minutes if the same term is asked again"""
    cache_key = query.lower().strip()
    
    if cache_key in cache:
        result, timestamp = cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            return result  # return the Cache
    
    result = client.search.create(query=query)  # call the real API
    cache[cache_key] = (result, time.time())
    return result
```

### 3. Use Batch for multi-item work
```python
# Not recommended — send one at a time
for doc in documents:
    embedding = client.embeddings.create(model="pplx-embed-v1-0.6b", input=[doc])

# Recommended — Batch up to 512 items per Request
BATCH_SIZE = 512
for i in range(0, len(documents), BATCH_SIZE):
    batch = documents[i:i+BATCH_SIZE]
    embeddings = client.embeddings.create(model="pplx-embed-v1-0.6b", input=batch)
```

---

## Summary

- Rate Limits are divided by Tier and increase with usage history
- Use **Exponential Backoff** when you hit HTTP 429
- Use a **Semaphore** for Concurrent work to control how many Requests run at once
- **Cache** results to reduce unnecessary API calls
- **Batch** multi-item work into one Request when possible (e.g. Embeddings)
- Check your current Rate Limit at console.perplexity.ai
