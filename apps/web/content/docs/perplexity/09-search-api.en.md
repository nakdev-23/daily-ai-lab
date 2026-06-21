---
title: "Search API — raw web search"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "The Search API gives raw web search results (links + short summaries), good for developers who want raw data to process further"
readTime: "7 min"
readers: "0"
locked: false
order: 9
---

# Search API — raw web search

Perplexity's **Search API** differs from the Agent API in that there's **no AI summarizing the answer** — instead it gives search results as a list of links, titles, and text snippets directly. It's good for developers who want to use Raw Data (data not yet summarized or processed) in their own systems.

---

## Endpoint

```
POST https://api.perplexity.ai/v1/search
```

---

## Why use the Search API?

| What you want | Use |
|---|---|
| A summarized AI answer + citations | Agent API or Sonar API |
| A raw list of links and Snippets | Search API |
| Build your own search system and want a raw Index | Search API |
| Process the results yourself before showing the user | Search API |

---

## Usage examples

### Python — basic search
```python
from perplexityai import Perplexity

client = Perplexity()

results = client.search.create(
    query="AI tools for Thai businesses 2026",  # the search term
    num_results=10  # number of results (1-20, default 10)
)

for result in results.results:
    print(f"Title: {result.title}")
    print(f"URL: {result.url}")
    print(f"Summary: {result.snippet}")
    print(f"Date: {result.date}")
    print("---")
```

### TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const results = await client.search.create({
  query: "AI tools for Thai businesses 2026",
  num_results: 10,
});

results.results.forEach((result) => {
  console.log(`${result.title}: ${result.url}`);
});
```

---

## Response Structure

Each result in the `results` array has this data:

```json
{
  "results": [
    {
      "title": "The article or web page title",
      "url": "https://example.com/article",
      "snippet": "A 1-3 sentence text sample from the website...",
      "date": "2026-05-15",
      "last_updated": "2026-06-01"
    }
  ],
  "query": "The search term sent",
  "total_results": 847000
}
```

| Field | Meaning |
|---|---|
| `title` | The web page or article title |
| `url` | The full link of the web page |
| `snippet` | A short text sample from the web page |
| `date` | The publication date (if available) |
| `last_updated` | The last-updated date (if available) |

---

## Filtering results

### Filter by region (Country Filter)
```python
results = client.search.create(
    query="Bangkok land prices 2026",
    country="TH",  # ISO country code — TH = Thailand
    num_results=10
)
```

### Filter by domain (Domain Filter)
```python
results = client.search.create(
    query="AI articles",
    search_domain_filter=[
        "thairath.co.th",         # allow only this domain
        "bangkokpost.com",
        "-pantip.com"             # block this domain (prefix with -)
    ],
    num_results=10
)
```

Domain filter rules:
- Include a domain normally = allow only that domain (**Allowlist**)
- Include `-domain.com` = block that domain (**Denylist**)
- Up to 20 domains per Request

### Filter by language (Language Filter)
```python
results = client.search.create(
    query="artificial intelligence news",
    search_language_filter=["th", "en"],  # ISO 639-1 language codes
    num_results=10
)
```

Commonly used language codes: `th` (Thai), `en` (English), `zh` (Chinese), `ja` (Japanese), `ko` (Korean)

---

## Multi-Query Search

Send up to 5 search terms at once:

```python
results = client.search.create(
    queries=[  # use queries (plural) instead of query
        "AI startup Thailand 2026",
        "venture capital Southeast Asia AI",
        "Thai tech unicorn companies",
        "AI regulation Thailand"
    ],
    num_results=5  # the number of results per term
)

# Results separated by each search term
for i, query_results in enumerate(results.results_per_query):
    print(f"\nResults for Query #{i+1}:")
    for result in query_results:
        print(f"  - {result.title}")
```

---

## Controlling the Content Budget

The **Content Budget** (the max number of Tokens of content pulled from each page) helps control the Tokens used and the cost:

```python
# Method 1: use a defined Preset
results = client.search.create(
    query="AI technology trends",
    search_context_size="high"  # low / medium / high
)

# Method 2: specify Tokens yourself (more granular)
results = client.search.create(
    query="AI technology trends",
    max_tokens=50000,           # total Tokens
    max_tokens_per_page=5000    # Tokens per web page
)
# Note: use search_context_size or max_tokens, but not both
```

| search_context_size | Good for |
|---|---|
| `low` | Want a short summary, save Tokens |
| `medium` | A reasonable amount of data (default) |
| `high` | Want detailed, full content |

---

## Search API pricing

- **$5.00 per 1,000 Requests**
- No extra Token charge (unlike the Agent API)
- No need to subscribe extra; pay as you use

**Calculation example:**
- 100 searches per day × 30 days = 3,000 Requests
- 3,000 × ($5/1,000) = **$15 per month**

---

## Best Practices for the Search API

### 1. Use specific search terms
```python
# Vague
query = "AI"

# Specific
query = "large language model performance benchmark 2026 comparison"
```

### 2. Implement Retry with Exponential Backoff
**Exponential Backoff** (waiting progressively longer when an Error occurs — to prevent re-Requesting too frequently):

```python
import time
import random
from perplexityai import Perplexity, RateLimitError

def search_with_retry(client, query, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.search.create(query=query)
        except RateLimitError:
            if attempt < max_retries - 1:
                # wait progressively longer: 1s, 2s, 4s + a little randomness
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
    raise Exception("Search failed after 3 attempts")
```

### 3. Use Async for multi-query work
```python
import asyncio
from perplexityai import AsyncPerplexity

async def search_multiple(queries):
    client = AsyncPerplexity()
    tasks = [client.search.create(query=q) for q in queries]
    results = await asyncio.gather(*tasks)
    return results
```

---

## Summary

The Search API is good for:
- Building a Custom Search Engine using Perplexity's index
- Pulling raw data to process with your own AI model
- Building a News Aggregator
- Research Tools that need results from many sources at once
- A fixed price that's easy for budget planning ($5/1,000 requests)
