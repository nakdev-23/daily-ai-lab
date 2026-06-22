---
title: "Sonar API — AI Q&A with web search"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "The Sonar API lets you do AI Q&A with Perplexity's AI and built-in web search, good for Chat Applications and Question Answering"
readTime: "7 min"
readers: "0"
locked: false
order: 16
---

# Sonar API — AI Q&A with web search

The **Sonar API** is Perplexity's API providing "AI Q&A with real-time web search," like using Perplexity.ai directly but callable via the API. It's good for building a Chat Application or a Question Answering system.

---

## Sonar Models

| Model | Highlight | Web search | Pro Search |
|---|---|---|---|
| `sonar` | Fast, economical, general | Yes | No |
| `sonar-pro` | High quality, deep search | Yes | Yes |
| `sonar-reasoning-pro` | Has a Reasoning step | Yes | Yes |
| `sonar-deep-research` | Automatic deep research | Yes (multiple rounds) | Yes |

---

## Endpoint

```
POST https://api.perplexity.ai/chat/completions
```

The Sonar API uses **Chat Completions** (a conversation format — Messages as an Array of role/content) like the OpenAI Chat API.

---

## Usage examples

### Python — basic Q&A
```python
from perplexityai import Perplexity

client = Perplexity()

# The Messages format (messages in conversation form)
response = client.chat.completions.create(
    model="sonar",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant. Answer in English."
        },
        {
            "role": "user",
            "content": "What's the most interesting technology news this week?"
        }
    ]
)

print(response.choices[0].message.content)
print("Citations:", response.citations)
```

### Python — Multi-turn Conversation
```python
# Multi-turn — you can keep asking
conversation_history = [
    {"role": "system", "content": "You are an AI expert"}
]

# Round 1
conversation_history.append({
    "role": "user",
    "content": "What is a Large Language Model?"
})

response1 = client.chat.completions.create(
    model="sonar-pro",
    messages=conversation_history
)
answer1 = response1.choices[0].message.content

# Add the answer to the History
conversation_history.append({
    "role": "assistant",
    "content": answer1
})

# Round 2 — follow up
conversation_history.append({
    "role": "user",
    "content": "And how does GPT-5 differ from GPT-4?"
})

response2 = client.chat.completions.create(
    model="sonar-pro",
    messages=conversation_history
)
print(response2.choices[0].message.content)
```

### cURL
```bash
curl -X POST https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar",
    "messages": [
      {
        "role": "user",
        "content": "What is the price of Bitcoin today?"
      }
    ]
  }'
```

---

## Response structure

```json
{
  "id": "chatcmpl-abc123",
  "model": "sonar",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The answer from the AI..."
      },
      "finish_reason": "stop"
    }
  ],
  "citations": [
    "https://coinmarketcap.com/currencies/bitcoin/",
    "https://www.coindesk.com/price/bitcoin/"
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 150,
    "total_tokens": 162
  }
}
```

| Field | Meaning |
|---|---|
| `choices[0].message.content` | The answer from the AI |
| `citations` | The list of URLs cited |
| `usage` | The number of Tokens used |

---

## Search Filters for Sonar

Sonar supports Search Filters via special parameters:

```python
response = client.chat.completions.create(
    model="sonar-pro",
    messages=[{"role": "user", "content": "Thai economic news"}],
    # Search Filters
    search_domain_filter=["bangkokpost.com", "thairath.co.th"],
    search_recency_filter="week",  # hour / day / week / month / year
)
```

---

## Pro Search Mode

**Pro Search** (detailed search — uses multiple search steps, searching repeatedly from multiple angles, for more accurate results) is enabled with the `sonar-pro` model:

```python
# Pro Search uses the sonar-pro model
response = client.chat.completions.create(
    model="sonar-pro",  # sonar-pro enables Pro Search automatically
    messages=[{
        "role": "user",
        "content": "Analyze AI's impact on employment in Thailand, with statistics"
    }]
)
```

---

## Sonar Deep Research

**Sonar Deep Research** (automatic deep research — a model that searches the web automatically over multiple rounds, analyzes, and synthesizes the data into a report) is good for research needing high thoroughness:

```python
response = client.chat.completions.create(
    model="sonar-deep-research",
    messages=[{
        "role": "user",
        "content": """
        Summarize the current state of AI safety,
        covering: government policy, the latest research, and the risks academics are concerned about
        """
    }]
)
# Note: Deep Research may take longer, 30-60 seconds
```

---

## Sonar Reasoning Pro

**Sonar Reasoning Pro** (a model that reasons before answering — uses Chain-of-Thought to analyze before concluding the answer):

```python
response = client.chat.completions.create(
    model="sonar-reasoning-pro",
    messages=[{
        "role": "user",
        "content": """
        If you invest 100,000 baht in a stock returning 8% per year for 10 years,
        how much will you have in total? Explain the calculation
        """
    }]
)
# You'll see <think>...</think> tags in the response showing the thinking steps
```

---

## Comparing the Sonar API with the Agent API

| | Sonar API | Agent API |
|---|---|---|
| Models used | Sonar (Perplexity only) | Many providers |
| Interface | Chat Completions (messages[]) | Input / Instructions |
| Web Search | Built-in, automatic | Via the web_search Tool |
| Flexibility | Medium | Very high |
| Good for | General Chat Apps | Complex Applications |
| Compatibility | OpenAI Chat API | OpenAI Responses API |

---

## Media Attachments

Sonar Pro supports attaching images:

```python
response = client.chat.completions.create(
    model="sonar-pro",
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {"url": "https://example.com/chart.png"}
            },
            {
                "type": "text",
                "text": "Analyze this chart and tell me the trend"
            }
        ]
    }]
)
```

---

## Summary

The Sonar API is good for:
- A **Chatbot** that needs live data from the internet
- A **Question Answering System** with Citations
- A **Research Tool** needing depth (use sonar-deep-research)
- **Applications already using the OpenAI Chat API** that want to add web-search capability
- Projects that want a Messages[]-style Interface (OpenAI-compatible)
