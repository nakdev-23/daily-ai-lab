---
title: "Search API — advanced filtering"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "Advanced filtering of search results by date, domain, language, and region for accurate, on-target results"
readTime: "6 min"
readers: "0"
locked: false
order: 10
---

# Search API — advanced filtering

The Search API has a variety of filtering options that let developers control search results in detail. This chapter explains every available Filter with real usage examples.

---

## Date / Time Filters

### Recency Filter

**Recency Filter** (limiting results to content published within a set period):

```python
results = client.search.create(
    query="AI news Thailand",
    recency_filter="week"  # hour / day / week / month / year
)
```

| Value | Meaning |
|---|---|
| `hour` | The past hour |
| `day` | The past day |
| `week` | The past week |
| `month` | The past month |
| `year` | The past year |

### Date Range Filter — filter by a specific date range

```python
results = client.search.create(
    query="Thailand GDP economic growth",
    date_range_start="01/01/2025",  # start date MM/DD/YYYY
    date_range_end="12/31/2025"     # end date MM/DD/YYYY
)
```

> **Note:** Use the MM/DD/YYYY format (month/day/year, US-style) only.

---

## Domain Filters

### Allowlist Mode — allow only the specified domains

```python
# Search only trusted Thai media
results = client.search.create(
    query="Thai economic news",
    search_domain_filter=[
        "thairath.co.th",
        "bangkokpost.com",
        "nationthailand.com",
        "bot.or.th",              # Bank of Thailand
        "nesdc.go.th"             # NESDC
    ]
)
```

### Denylist Mode — block unwanted domains

```python
# Block untrustworthy sites
results = client.search.create(
    query="Thailand investment opportunities",
    search_domain_filter=[
        "-reddit.com",    # block Reddit (prefix with -)
        "-quora.com",     # block Quora
        "-pinterest.com"  # block Pinterest
    ]
)
```

### Mixed Mode — combine Allowlist and Denylist

```python
# Allow main domains and block a sub-section
results = client.search.create(
    query="python tutorial",
    search_domain_filter=[
        "docs.python.org",    # allow
        "stackoverflow.com",  # allow
        "-stackoverflow.com/questions/tagged/jquery"  # block a specific tag
    ]
)
```

**Limit:** up to 20 domains per Request

---

## Language Filters

```python
# Search only Thai and English articles
results = client.search.create(
    query="science and technology",
    search_language_filter=["th", "en"]  # ISO 639-1 language codes
)
```

**Commonly used language codes:**

| Code | Language |
|---|---|
| `th` | Thai |
| `en` | English |
| `zh` | Chinese |
| `ja` | Japanese |
| `ko` | Korean |
| `fr` | French |
| `de` | German |
| `es` | Spanish |

**Limit:** up to 10 languages per Request

---

## Country / Region Filters

```python
# Results relevant to Thailand
results = client.search.create(
    query="business news",
    country="TH"  # ISO 3166-1 alpha-2 country code
)
```

**Commonly used country codes in Asia:**

| Code | Country |
|---|---|
| `TH` | Thailand |
| `SG` | Singapore |
| `MY` | Malaysia |
| `ID` | Indonesia |
| `VN` | Vietnam |
| `JP` | Japan |
| `KR` | South Korea |
| `CN` | China |
| `US` | United States |
| `GB` | United Kingdom |

---

## Use multiple Filters at once

```python
# A real example: search for Thai business news from credible media this week
results = client.search.create(
    query="startup funding Thailand Series A",
    country="TH",
    search_language_filter=["th", "en"],
    search_domain_filter=[
        "techsauce.co",
        "krasia.com",
        "techinasia.com",
        "bangkokpost.com"
    ],
    recency_filter="week",
    num_results=10
)

print(f"Found {len(results.results)} results")
for r in results.results:
    print(f"\n{r.title}")
    print(f"URL: {r.url}")
    print(f"Date: {r.date}")
    print(f"Summary: {r.snippet[:200]}...")
```

---

## People Search — search for information on a person

**People Search** (searching for a person's public profile, e.g. LinkedIn, articles, public history):

> People Search is available in both the Search API and as a Tool in the Agent API

```python
# In the Agent API
response = client.agent.create(
    model="openai/gpt-5.1",
    tools=[{"type": "people_search"}],  # enable the people-search Tool
    input="Find public information on [person's name], CEO of [company name]"
)
```

> **Privacy caution:** People Search pulls only public data; don't use it to collect private data a person hasn't disclosed.

---

## Analyzing results

### Check result quality

```python
results = client.search.create(
    query="AI regulation 2026",
    num_results=20
)

# Separate results by publication year
current_year = 2026
recent = [r for r in results.results if r.date and "2026" in r.date]
older = [r for r in results.results if r.date and "2026" not in r.date]

print(f"2026 results: {len(recent)} items")
print(f"Older results: {len(older)} items")
```

---

## All filters summary

| Filter | Parameter | Example value |
|---|---|---|
| Recency | `recency_filter` | `"week"`, `"month"` |
| Date range | `date_range_start/end` | `"01/01/2026"` |
| Domain | `search_domain_filter` | `["site.com", "-blocked.com"]` |
| Language | `search_language_filter` | `["th", "en"]` |
| Country | `country` | `"TH"`, `"US"` |
| Number of results | `num_results` | `1-20` |
| Content size | `search_context_size` | `"low"`, `"medium"`, `"high"` |

Combining multiple Filters makes results more accurate and on-target, reducing the time spent filtering data after receiving results.
