---
title: "Agent API — Prompt-writing guide"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "Techniques and guidance for writing good Prompts for the Agent API to get accurate, high-quality answers"
readTime: "6 min"
readers: "0"
locked: false
order: 8
---

# Agent API — Prompt-writing guide

A good **Prompt** (an input instruction — the text you send the AI as a question or command) is the key to getting accurate, useful results from the Agent API. This chapter collects the most important techniques from the Perplexity team.

---

## Main parameters for the Prompt

The Agent API has two main parameters for sending data to the AI:

### `instructions` (System Prompt)
Defines the role, tone, and base rules used throughout the Session (one usage):

```python
instructions = """
You are a professional business data analyst
- Always answer in English
- Use numbers and measurable data
- Cite sources every time
- If data is incomplete or you're unsure, say so directly, don't guess
"""
```

### `input` (User Message)
The user's question or command each time. Write it specifically with enough context.

---

## Principle 1 — the more specific the better

**A vague Prompt:**
```
"Tell me about AI"
```

**A specific, better Prompt:**
```
"Summarize the important Large Language Model developments in 2025-2026, focusing on the 3 main models that impacted the industry, with performance numbers"
```

---

## Principle 2 — specify the format you want

```python
response = client.agent.create(
    preset="pro-search",
    instructions="Answer in English, use the structure: short summary > main points (bullets) > conclusion",
    input="Compare PostgreSQL vs MongoDB for an E-commerce application"
)
```

Examples of formats you can specify:
- "Answer as a table"
- "Use ## and ### headings"
- "Summarize in no more than 3 points"
- "Answer as items, ordered by importance"
- "Write in a business-report format"

---

## Principle 3 — specify the number of results

The AI chooses the answer length itself if not specified, making it inconsistent. Specify it clearly:

```python
# Vague — the AI decides how many items
input = "Recommend AI tools for marketers"

# Specific — better
input = "Recommend the top 5 AI tools for marketers, with the price and highlights of each"
```

---

## Principle 4 — use Parameters for constraints, not Text

For filtering by source, date, or language, **use Parameters** (values set in code) instead of writing them in the Prompt, because Parameters are enforced every time the AI searches.

```python
# Not recommended — written in the message
input = "Search for news from thairath.co.th only, within the past 3 months"

# Recommended — use the Tool's Parameters
response = client.agent.create(
    preset="pro-search",
    input="Latest political news",
    tools=[{
        "type": "web_search",
        "search_domain_filter": ["thairath.co.th"],  # limit the web source
        "recency_filter": "month"  # news within 1 month
    }]
)
```

---

## Principle 5 — prevent Hallucination (making up false info)

**Hallucination** (when the AI makes up info that isn't real or has no citation) is a problem solved by adding clear Instructions:

```python
instructions = """
Important rules:
1. If you search and find no data matching the question, say "No relevant data found", don't guess
2. If you find data that's close but doesn't match, e.g. a different year or a similar company, note that the data may not match what was asked
3. Cite every important piece of data with [source name]
"""
```

---

## Example Instructions for various Use Cases

### Customer Support Bot
```python
instructions = """
You are Customer Support for company XYZ
- Always answer politely and in a friendly way
- If you don't know the answer, suggest the customer contact support@xyz.com
- Don't give out the company's confidential information
- Answer in English or Thai to match the language the customer uses
"""
```

### Research Assistant
```python
instructions = """
You are an expert researcher
- Search for data from trustworthy sources (academic journals, research institutions, governments)
- Specify the publication year of cited research
- Distinguish between "facts" and "opinions" or "predictions"
- Summarize the main points in easy-to-understand language
"""
```

### Financial Analyst
```python
instructions = """
You are a professional financial analyst
- Cite stock price and financial figures from credible sources
- Add the text "This is not investment advice" every time
- Show both positive and negative factors in the analysis
"""
```

---

## Using `max_steps` instead of a Prompt

For controlling the depth of the search, use `max_steps` instead of writing it in the Prompt:

```python
# Want a very deep search
response = client.agent.create(
    model="anthropic/claude-sonnet-4-6",
    tools=[{"type": "web_search"}, {"type": "fetch_url"}],
    max_steps=10,  # allow up to 10 search steps
    input="Analyze the EV market in Southeast Asia in detail"
)

# Want a fast answer
response = client.agent.create(
    model="google/gemini-3-flash",
    tools=[{"type": "web_search"}],
    max_steps=1,  # search just once
    input="Gold price today"
)
```

---

## Key principles summary

| Principle | Good example |
|---|---|
| Be specific | "Top 5 AI Tools for designers, with prices" |
| Specify the format | "Answer as a 3-column table: name / highlight / price" |
| Specify the number | "Summarize only the 3 main points" |
| Use Parameters | Filter domains and dates via tool parameters |
| Prevent Hallucination | "If there's no data, say so directly, don't guess" |
| Control the steps | Use `max_steps` instead of the Prompt |
