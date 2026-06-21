---
title: "Web Search & DeepSearch — search for information in real time"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Web Search gives Grok access to the latest information from the internet, while DeepSearch is a deep-search mode that analyzes several sources at once, solving the Knowledge Cutoff problem."
readTime: "5 min"
readers: "0"
locked: false
order: 16
---
# Web Search & DeepSearch — search for information in real time

> Reference: [Web Search Tool](https://docs.x.ai/docs) | [Tools Overview](https://docs.x.ai/docs)

---

## The problem Web Search solves

Grok has a **Knowledge Cutoff** (the date its knowledge ends — Grok only knows things up to this point, as of November 2024), meaning Grok doesn't know about things that happened after that.

The **Web Search Tool** solves this by letting Grok:
- Search information from the internet instantly
- Access the latest news, stock prices, weather, current events
- Cite sources with URLs

---

## Basic Web Search usage

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "What's the price of Bitcoin today, and what crypto news is there?"
    }],
    tools=[{"type": "web_search"}],
)

print(response.output_text)
# Grok searches for real data and answers with Citations (source references)
```

### Price

**$5 per 1,000 tool calls**

---

## Advanced parameters

### Domain Filtering — restrict which domains it searches

**Domain** (a website name like bangkokpost.com — used to filter the sources you want):

```python
# Search only trusted domains (up to 5 domains)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Latest Thai economic news?"}],
    tools=[{
        "type": "web_search",
        "allowed_domains": [
            "bangkokpost.com",
            "nationthailand.com",
            "bot.or.th",
            "nesdc.go.th",
        ],
    }],
)
```

```python
# Exclude unwanted domains (up to 5 domains)
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "iPhone 16 review"}],
    tools=[{
        "type": "web_search",
        "excluded_domains": ["sponsored-reviews.com", "paid-content.net"],
    }],
)
```

> **Note:** You can use either `allowed_domains` or `excluded_domains` in a request, not both.

### Image Understanding — analyze images from the web

**Image Understanding** (analyzing the content in an image — the AI can read charts, tables, or data in pictures):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Find a chart of Thailand's inflation for the latest year"}],
    tools=[{
        "type": "web_search",
        "enable_image_understanding": True,  # analyze images found on the web
        "enable_image_search": True,          # find and embed images in the answer
    }],
)
```

> Analyzed images are charged as Image Tokens (the counting unit for image data), not a Tool Call

---

## DeepSearch — deep searching

**DeepSearch** is a search mode in which Grok will:
1. Generate several sub-questions from the main question
2. Search several times across multiple sources
3. Analyze and cross-reference (check data across sources to confirm accuracy)
4. Summarize the result with confidence and source references

### Use DeepSearch via the API

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": """
        Analyze the EV (electric vehicle) market in Thailand for 2025:
        - Each brand's market share
        - Supporting government policy
        - Trends over the next 3 years
        """
    }],
    tools=[{
        "type": "web_search",
        "enable_image_understanding": True,
    }],
    # High Reasoning (analysis) for a deep analysis
    reasoning={"effort": "high"},
)

print(response.output_text)
```

### DeepSearch on Grok.com

On Grok.com and the mobile app there's a **"DeepSearch"** button directly:
- Click **DeepSearch** before sending your question
- Grok shows you its thinking process
- It takes longer than usual (20–120 seconds) but gives a deeper answer

---

## X Search — search on X (Twitter)

Use it alongside Web Search to find the latest opinions on X:

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "What do Thai people think of the new AI policy?"}],
    tools=[
        {"type": "web_search"},    # general news
        {"type": "x_search"},      # posts on X
    ],
)
```

### X Search with Video Understanding

**Video Understanding** (analyzing the content in a video — the AI can watch and understand what happens in a clip):

```python
tools=[{
    "type": "x_search",
    "video_understanding": True,  # analyze videos in posts
}]
```

---

## Citations — source references

Web Search returns Citations (source references — telling you where the data came from) automatically. Extract them like this:

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Latest election results in Thailand?"}],
    tools=[{"type": "web_search"}],
)

# Pull Citations from the response
for item in response.output:
    if hasattr(item, "type") and item.type == "web_search_call":
        print("Sources used:", item.search_results)
    elif hasattr(item, "type") and item.type == "message":
        for block in item.content:
            if hasattr(block, "annotations"):
                for annotation in block.annotations:
                    print(f"Reference: {annotation.url}")
```

---

## Example Use Cases

### Track product prices

```python
def check_prices(product_name: str) -> str:
    response = client.responses.create(
        model="grok-4.3",
        input=[{
            "role": "user",
            "content": f"What's the price of {product_name} in Thailand right now? Search Shopee, Lazada, JD Central"
        }],
        tools=[{
            "type": "web_search",
            "allowed_domains": ["shopee.co.th", "lazada.co.th", "jd.co.th"],
        }],
    )
    return response.output_text

print(check_prices("iPhone 16 Pro Max 256GB"))
```

### Daily news summary

```python
import datetime

today = datetime.date.today().strftime("%d %B %Y")

response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "system",
        "content": "Summarize the news in English, concise and clear",
    }, {
        "role": "user",
        "content": f"Summarize Thailand's top news for {today} in 5 items",
    }],
    tools=[{"type": "web_search"}],
)

print(response.output_text)
```

---

## Cautions

- **Price** increases with every Tool Call — searching several rounds is charged several times
- **Accuracy** — always check the Citations; some sources may be inaccurate
- **Rate Limit** (a cap on the number of requests — limiting how many requests you can send per minute) — Web Search counts toward the Rate Limit like a normal API Call
- **Not supported** — Web Search doesn't work with the Batch API (sending many requests at once in the background — async background jobs are not supported)
