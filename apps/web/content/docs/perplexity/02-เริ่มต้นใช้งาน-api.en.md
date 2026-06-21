---
title: "Getting started with the API"
tool: "Perplexity"
icon: "icon-docs"
level: "beginner"
summary: "A getting-started guide for developers, from signing up to making your first API call"
readTime: "6 min"
readers: "0"
locked: false
order: 2
---

# Getting started with the API (Quickstart Guide)

This guide walks you through setting up and making your first Perplexity API call from start to finish, in under 10 minutes.

---

## Step 1 — Create an API Key

An **API Key** (a secret code that proves your identity when calling the API) is the first thing you need.

1. Go to **[console.perplexity.ai](https://console.perplexity.ai)**
2. Sign up or log in
3. Go to the **API Keys** menu
4. Click **"Generate New Key"**
5. **Copy and save** the Key value immediately, because the system shows it only once when it's created

> **Very important:** Don't share your API Key with anyone, and don't put it in Code that you'll upload to GitHub (others can use it and you'll be charged).

---

## Step 2 — Install the SDK

An **SDK** (Software Development Kit — a developer toolkit that makes calling the API easier) is available in two main languages:

### Python
```bash
pip install perplexityai
```

### TypeScript / Node.js
```bash
npm install @perplexity-ai/perplexity_ai
```

---

## Step 3 — Set up an Environment Variable

An **Environment Variable** (a place to store a secret in the system, separate from the Code) is the safest way to store an API Key.

### macOS / Linux
```bash
export PERPLEXITY_API_KEY="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Windows (Command Prompt)
```cmd
set PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Windows (PowerShell)
```powershell
$env:PERPLEXITY_API_KEY = "pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Step 4 — Make your first API call

### Example with Python (Agent API)
```python
from perplexityai import Perplexity

client = Perplexity()  # automatically pulls the API Key from the Environment Variable

response = client.agent.create(
    preset="pro-search",  # use a ready-made Preset (a prepared set of settings)
    input="What can AI help with in 2026?"
)

print(response.output_text)
```

### Example with TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const response = await client.agent.create({
  preset: "pro-search",
  input: "What can AI help with in 2026?",
});

console.log(response.output_text);
```

### Example with cURL (Command Line)
```bash
curl -X POST https://api.perplexity.ai/v1/agent \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "preset": "pro-search",
    "input": "What can AI help with in 2026?"
  }'
```

---

## Understanding the Response (the answer you get back)

When the API call succeeds, you get back JSON (a standard data format) with this main structure:

```json
{
  "id": "resp_abc123",
  "output_text": "The answer from the AI...",
  "citations": [
    {
      "url": "https://example.com/article",
      "title": "Article title"
    }
  ],
  "usage": {
    "input_tokens": 50,
    "output_tokens": 200,
    "total_cost": 0.00025
  }
}
```

- `output_text` — the answer the AI generated
- `citations` — the list of websites used to answer
- `usage` — the number of Tokens (a unit of text — a word or part of a word the AI counts) and the cost

---

## Choose the right API for your work

Perplexity has 4 main APIs; choose by the task:

| What you want to do | Recommended API |
|---|---|
| Build an AI Agent that does multiple steps | Agent API |
| Search the web and get raw results (links/summaries) | Search API |
| AI Q&A with web search | Sonar API |
| Convert text to Vectors for RAG | Embeddings API |

**RAG** (Retrieval-Augmented Generation — generating text by retrieving data from your own knowledge base) is a popular technique that combines your database with AI.

---

## Steps summary

1. Create an API Key at console.perplexity.ai
2. Install the SDK (Python or TypeScript)
3. Set `PERPLEXITY_API_KEY` as an Environment Variable
4. Call the API with the example Code
5. Receive the Response and use it

The next step is to learn each API in detail in the following chapters.
