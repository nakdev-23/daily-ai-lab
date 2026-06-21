---
title: "Agent API — Output Control"
tool: "Perplexity"
icon: "icon-docs"
level: "intermediate"
summary: "How to control the output format from the Agent API — Streaming, Structured Outputs, and JSON Schema"
readTime: "7 min"
readers: "0"
locked: false
order: 7
---

# Agent API — Output Control

**Output Control** means defining the format in which you want to receive the Response from the Agent API — whether to receive it piece by piece in Real-time, or as a specific JSON structure.

---

## Method 1 — Streaming

**Streaming** (receiving data piece by piece while the AI is generating the answer) lets the user see the answer sentence by sentence instead of waiting until it's done. Good for a Chat Interface or a Real-time Dashboard.

### Enable Streaming with Python
```python
from perplexityai import Perplexity

client = Perplexity()

# Set stream=True to receive data in Real-time
stream = client.agent.create(
    preset="pro-search",
    input="Explain how a Neural Network works in detail",
    stream=True  # enable Streaming
)

# Loop to receive data piece by piece
for event in stream:
    if event.type == "response.output_text.delta":
        # delta is the new text segment just generated
        print(event.delta, end="", flush=True)
    elif event.type == "response.completed":
        # received everything
        print("\n--- Done ---")
        print(f"Cost: ${event.response.usage.total_cost}")
```

### Enable Streaming with TypeScript
```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

const stream = await client.agent.create({
  preset: "pro-search",
  input: "Explain Quantum Computing",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);  // display piece by piece
  }
}
```

---

## Event Types in Streaming

| Event Type | Meaning |
|---|---|
| `response.output_text.delta` | New text the AI just generated (piece by piece) |
| `response.output_text.done` | All the text is fully generated |
| `response.tool_call.delta` | The AI is calling a Tool (e.g. searching the web) |
| `response.completed` | The whole answer is complete |
| `response.failed` | An error occurred |

---

## Method 2 — Structured Outputs

**Structured Outputs** (forcing the AI to answer in a defined JSON format) use a JSON Schema (a JSON data blueprint) to specify the format you want.

### Example: extract product data as JSON
```python
import json
from perplexityai import Perplexity

client = Perplexity()

# Define the Schema (structure) of the data you want
product_schema = {
    "type": "object",
    "properties": {
        "product_name": {
            "type": "string",
            "description": "Product name"
        },
        "price_thb": {
            "type": "number",
            "description": "Price in baht"
        },
        "availability": {
            "type": "boolean",
            "description": "Whether the product is in stock"
        },
        "features": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of features"
        }
    },
    "required": ["product_name", "price_thb", "availability"]
}

response = client.agent.create(
    preset="pro-search",
    input="Find the latest info on the iPhone 17 Pro Max",
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "product_info",  # the name must be 1-64 alphanumeric characters
            "schema": product_schema
        }
    }
)

# Convert the JSON string to a Python dict
data = json.loads(response.output_text)
print(f"Product: {data['product_name']}")
print(f"Price: {data['price_thb']} baht")
```

---

## Commonly used Schema examples

### Schema for analyzing a news article
```python
news_schema = {
    "type": "object",
    "properties": {
        "headline": {"type": "string"},
        "summary": {"type": "string"},
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"]  # enum is the allowed values
        },
        "key_points": {
            "type": "array",
            "items": {"type": "string"},
            "maxItems": 5
        },
        "sources_count": {"type": "integer"}
    }
}
```

### Schema for comparing products
```python
comparison_schema = {
    "type": "object",
    "properties": {
        "products": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "pros": {"type": "array", "items": {"type": "string"}},
                    "cons": {"type": "array", "items": {"type": "string"}},
                    "price_range": {"type": "string"},
                    "rating": {"type": "number", "minimum": 0, "maximum": 5}
                }
            }
        },
        "recommendation": {"type": "string"}
    }
}
```

---

## Cautions with Structured Outputs

### A new Schema takes 10–30 seconds
The first time you use a new Schema, the system must prepare it first, which may take 10–30 seconds. Subsequent times are faster.

### Don't request URLs in the JSON Response
```python
# Not recommended — you may get incorrect links
schema_with_urls = {
    "properties": {
        "source_url": {"type": "string"}  # avoid requesting a URL in the Schema
    }
}

# Recommended — use citations from the API response instead
print(response.citations)  # correct and verifiable links
```

### Add a Hint in the Prompt
```python
response = client.agent.create(
    preset="pro-search",
    input="""Search for and summarize info on Tesla
    Please answer as a JSON object with fields: company_name, founded_year, ceo, main_products (array), market_cap_usd""",
    response_format={
        "type": "json_schema",
        "json_schema": {"name": "company_info", "schema": company_schema}
    }
)
```

---

## When to use Streaming vs Structured Outputs?

| Situation | Recommended |
|---|---|
| A Chat Interface showing the answer sentence by sentence | Streaming |
| A Dashboard showing Real-time status | Streaming |
| Storing data in a Database | Structured Outputs |
| Sending data to another system to process | Structured Outputs |
| A report needing a specific Format | Structured Outputs |
| General Q&A with no special Format needed | Neither |

---

## Summary

- **Streaming** — use when you want to display the answer Real-time piece by piece; set with `stream=True`
- **Structured Outputs** — use when you want JSON with a fixed structure; set with `response_format`
- Use `citations` from the Response instead of requesting a URL in the Schema
- A new Schema takes 10–30 seconds to prepare the first time
