---
title: "Grounding with Google Search — real-time data from the web"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Grounding connects Gemini to Google Search to answer with current data, reducing hallucination and citing sources clearly"
readTime: "7 min"
readers: "0"
locked: false
order: 25
---

# Grounding with Google Search — real-time data from the web

**Grounding with Google Search** (anchoring to real data from Google Search — making the AI answer from real data instead of guessing) is a feature that lets Gemini search the web via Google Search in real time before answering, instead of relying only on its trained knowledge, making answers accurate, up to date, and with citations.

---

## Why use Grounding?

### Problems Grounding solves:

| Problem | Result |
|---|---|
| Stale data | Gemini's training ends on a date — it doesn't know recent events |
| Hallucination (making up information that isn't real) | The AI invents nonexistent data |
| No citations | You don't know where the data came from |
| Prices/specific data | Product prices, match results, breaking news |

### Grounding helps:
- Search for additional information from Google Search automatically
- Cite the source in the answer
- Reduce hallucination for factual questions

---

## How it works

```
1. Receive the prompt (question/instruction) from the user
        ↓
2. Gemini analyzes what to search for
        ↓
3. Send the query (search term) to Google Search
        ↓
4. Process the search results
        ↓
5. Create an answer with citations from the search results
```

---

## Use: general users (Gemini App)

Grounding in the Gemini App is enabled automatically when Gemini decides the question needs more data:

1. Ask a question needing real-time data, e.g.:
   - "What's the price of Bitcoin today?"
   - "What were last night's Thai Premier League results?"
   - "What's the price of the iPhone 16 in Thailand?"

2. Gemini shows a **"Searching Google"** box before answering

3. The answer has clickable source links

---

## Use through the API (developers)

### Turn on Grounding simply

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What's the price of Brent crude oil today?",
    config={
        "tools": [{"google_search": {}}]  # turn on grounding
    }
)

print(response.text)
```

### View the Search Queries and Citations

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Who won the Oscar for Best Picture this past year?",
    config={
        "tools": [{"google_search": {}}]
    }
)

# View the answer
print(response.text)

# View the grounding metadata (info about the search)
if response.candidates[0].grounding_metadata:
    meta = response.candidates[0].grounding_metadata
    
    # Search queries used
    print("\n--- Search Queries used ---")
    for query in meta.web_search_queries:
        print(f"- {query}")
    
    # Citations
    print("\n--- Citations ---")
    for chunk in meta.grounding_chunks:
        if hasattr(chunk, 'web'):
            print(f"- {chunk.web.title}: {chunk.web.uri}")
```

### Example grounding_metadata output

```json
{
  "web_search_queries": [
    "Oscar Best Picture 2025 winner"
  ],
  "grounding_chunks": [
    {
      "web": {
        "uri": "https://variety.com/...",
        "title": "Oscars 2025: Complete List of Winners"
      }
    }
  ],
  "grounding_supports": [
    {
      "segment": {
        "start_index": 0,
        "end_index": 45,
        "text": "The 2025 Academy Award for Best Picture went to..."
      },
      "grounding_chunk_indices": [0],
      "confidence_scores": [0.97]
    }
  ]
}
```

---

## Dynamic Retrieval — control the search

Dynamic Retrieval (adaptive search — letting the model decide whether to search) helps control when Gemini searches:

```python
config = {
    "tools": [{
        "google_search": {
            "dynamic_retrieval_config": {
                "mode": "MODE_DYNAMIC",  # let the model decide
                "dynamic_threshold": 0.3  # the threshold (decision criterion, 0-1)
                # higher = searches less (only when sure it's needed)
                # lower = searches more often
            }
        }
    }]
}
```

**Search modes:**
- `MODE_DYNAMIC` — the model decides whether to search
- `MODE_UNSPECIFIED` — always search (default)

---

## Grounding pricing

For Gemini 3+ models:
- Charged **per search query** used, not per prompt
- One prompt may have several search queries
- See the latest pricing at [ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## Suitable use cases

### Great for:
- **News and current events** — prices, news, sports results
- **Frequently changing data** — stock prices, weather, schedules
- **Research** — finding info before writing
- **Fact-checking** — verifying facts

### Not needed for:
- Math or logic questions
- Creative writing
- Code generation
- Unchanging data (history, basic science)

---

## Grounding vs Function Calling

| | Grounding with Search | Function Calling |
|---|---|---|
| Data source | Google Search (public web) | Custom API/system |
| Setup | Turn on a single flag | Must write declarations |
| Control | Limited | Full |
| Internal data | ✗ | ✓ |
| Automatic citation | ✓ | ✗ |
| Good for | Public real-time data | Internal business data |

---

## Usage tips

- **Specify the timeframe** — "What's the BTC price **today**?" is better than "BTC price"
- **Ask specifically** — specific questions work better than broad ones
- **Check the citations** — click the source links to confirm the info
- **Use it with Function Calling** — you can use both at once in a single request
