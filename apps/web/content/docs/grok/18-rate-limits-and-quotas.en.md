---
title: "Rate Limits & Quotas — API usage limits and quotas"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Understand the xAI API's Rate Limits, handle Error 429 with Exponential Backoff, and design your app to respect the limits correctly."
readTime: "5 min"
readers: "0"
locked: false
order: 18
---
# Rate Limits & Quotas — API usage limits and quotas

> Reference: [xAI API Reference](https://docs.x.ai/api-reference) | [Batch API](https://docs.x.ai/docs)

---

## What are Rate Limits?

**Rate Limits** (a cap on the number of requests — limiting how many requests you can send per minute) are limits on how many Requests you can send to the API in a given time. xAI uses Rate Limits to:

- Keep the service stable for everyone
- Prevent Abuse
- Manage GPU resources (Graphics Processing Units — used to run AI) fairly

---

## Types of Rate Limits

xAI measures Rate Limits across several dimensions at once:

| Type | Unit | Description |
|---|---|---|
| **RPM** (Requests Per Minute) | Number of Requests | Max Requests per minute |
| **TPM** (Tokens Per Minute) | Number of Tokens | Max Tokens per minute |
| **RPD** (Requests Per Day) | Number of Requests | Max Requests per day |
| **TPD** (Tokens Per Day) | Number of Tokens | Max Tokens per day |

> **Note:** The actual Limit depends on your Plan and Model. Check at [console.x.ai](https://console.x.ai/)

---

## HTTP Error Codes

**HTTP Error Codes** (standard error codes — numbers that tell you what went wrong):

| Code | Name | Cause | How to fix |
|---|---|---|---|
| `400` | Bad Request | Invalid Parameters | Check the request body |
| `401` | Unauthorized | Invalid or expired API Key | Check the API Key |
| `403` | Forbidden | No permission for this feature | Check Plan / permissions |
| `404` | Not Found | The Model or Endpoint (destination address) doesn't exist | Check the Model name |
| `422` | Unprocessable Entity | Invalid Schema | Check the JSON Schema |
| `429` | Too Many Requests | Exceeded the Rate Limit | Wait and retry |
| `500` | Internal Server Error | An error on xAI's side | Retry in 1–2 minutes |
| `503` | Service Unavailable | The system is Overloaded | Wait and retry |

---

## Handling Rate Limit (Error 429)

### Method 1: Exponential Backoff (highly recommended)

**Exponential Backoff** (waiting progressively longer, multiplicatively — e.g. wait 1s, 2s, 4s, 8s instead of the same each time):

```python
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

def call_with_backoff(messages: list, max_retries: int = 5) -> str:
    """Call the API with Exponential Backoff"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="grok-4.3",
                messages=messages,
            )
            return response.choices[0].message.content
            
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise  # out of retries, throw the error
            
            # Compute the wait: 2^attempt + random jitter (a small random value — stops everyone retrying at once)
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limit! Waiting {wait_time:.1f} seconds... (attempt {attempt + 1}/{max_retries})")
            time.sleep(wait_time)

# Use it
result = call_with_backoff([
    {"role": "user", "content": "Explain Rate Limiting"}
])
print(result)
```

### Method 2: use the tenacity Library

**tenacity** (a Python library for automatically retrying on errors):

```python
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
from openai import RateLimitError

@retry(
    retry=retry_if_exception_type(RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def call_grok(prompt: str) -> str:
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
```

### Method 3: check the Headers

**Headers** (the header section of an HTTP response — carries extra info, e.g. how many requests are left):

```python
import httpx

# Use httpx directly to see the headers
response = httpx.post(
    "https://api.x.ai/v1/chat/completions",
    headers={
        "Authorization": f"Bearer YOUR_XAI_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "grok-4.3",
        "messages": [{"role": "user", "content": "Hello"}],
    },
)

# See the Rate Limit Headers
print(f"X-RateLimit-Limit: {response.headers.get('x-ratelimit-limit-requests')}")
print(f"X-RateLimit-Remaining: {response.headers.get('x-ratelimit-remaining-requests')}")
print(f"X-RateLimit-Reset: {response.headers.get('x-ratelimit-reset-requests')}")
```

---

## Avoid Rate Limits with good design

### 1. Use the Batch API for high-volume work

**Batch API** (an API for sending many jobs at once — processed in the background, not counted toward the Rate Limit):

```python
# Instead of sending 1,000 separate requests
# use the Batch API instead — not counted toward the Rate Limit!

batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
)
```

### 2. Token Estimation before sending

**Token Estimation** (estimating the token count before sending — helps you plan to not exceed quota):

```python
import tiktoken

def estimate_tokens(text: str, model: str = "grok-4.3") -> int:
    """Estimate the Token count before sending"""
    # Use cl100k_base (the token-counting system used with Grok)
    enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))

# Check before sending
prompt = "..." 
estimated = estimate_tokens(prompt)
print(f"Estimated ~{estimated} tokens")
```

### 3. Request Queue + Rate Limiter

**Request Queue** (a queue of requests — ordering jobs to keep from sending too fast):

```python
import asyncio
import time
from collections import deque

class RateLimiter:
    def __init__(self, rpm: int = 60):
        self.rpm = rpm
        self.requests = deque()
    
    async def acquire(self):
        now = time.time()
        # Remove requests older than 60 seconds
        while self.requests and now - self.requests[0] > 60:
            self.requests.popleft()
        
        if len(self.requests) >= self.rpm:
            # Wait until there's a slot
            wait = 60 - (now - self.requests[0])
            await asyncio.sleep(wait)
        
        self.requests.append(time.time())

limiter = RateLimiter(rpm=50)  # set slightly below the real limit

async def safe_call(prompt: str) -> str:
    await limiter.acquire()
    response = await async_client.chat.completions.create(
        model="grok-4.3",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
```

---

## Batch API Limits

The Batch API has its own separate Limits:

| Limit | Value |
|---|---|
| Max Batch creation | 2 batches/second/team |
| Add requests per batch | 1,000 calls/30 seconds |
| Payload size (data sent) per request | 25 MB |
| Max upload file size | 200 MB |
| Requests per file | 50,000 |

---

## Check Usage and Limits

**Usage** (a summary of how many tokens you've used):

See your current Usage in the Console:

1. Go to [console.x.ai](https://console.x.ai/)
2. Choose **Settings** → **API Keys**
3. View the Usage Dashboard

### See Usage from the Response

```python
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "Hello"}],
)

usage = response.usage
print(f"Prompt tokens: {usage.prompt_tokens}")
print(f"Completion tokens: {usage.completion_tokens}")
print(f"Total tokens: {usage.total_tokens}")
```

---

## Best Practices summary

1. **Always use Exponential Backoff** when you get Error 429
2. **Use the Batch API** for high-volume, non-urgent work
3. **Monitor Usage** through the Console so you don't exceed your Quota (the amount you're entitled to use)
4. **Set an appropriate Timeout** on every Request
5. **Log Errors** to Debug and Monitor problems
6. **Don't Retry immediately** — always wait with Jitter (a small random value) to avoid a thundering herd (when everyone retries at once and crashes the system)
