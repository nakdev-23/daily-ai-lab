---
title: "Structured Outputs — get results as JSON with your own structure"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Structured Outputs force Grok to answer in a JSON format you define, so you can use the data directly in your code without parsing text yourself."
readTime: "6 min"
readers: "0"
locked: false
order: 15
---
# Structured Outputs — get results as JSON with your own structure

> Reference: [Structured Outputs](https://docs.x.ai/docs) | [JSON Schema Reference](https://json-schema.org/)

---

## What are Structured Outputs?

Normally Grok answers in plain text, but when you enable **Structured Outputs** (results with a clear structure), Grok **guarantees that every answer is JSON (a standard data format programs read easily — written with curly braces `{}`) that matches the Schema (a data-structure blueprint — defining which fields exist) you specified, every time**.

### Why use it?

- **Extract data from text** — pull entities (names, things, places that appear in the text), dates, prices, names from documents
- **Create structured data** — turn plain text into JSON for a Database
- **API integration** — get data ready to use with another API (an interface between programs) immediately
- **Validation** (checking correctness) — be sure the answer has every field you need

---

## 2 ways to use it

### Method 1: `response_format` (recommended)

Specify the JSON Schema directly:

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
        "content": "Employee info: Somchai, age 32, IT department, salary 50,000 baht"
    }],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "employee_info",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"},
                    "department": {"type": "string"},
                    "salary": {"type": "number"},
                },
                "required": ["name", "age", "department", "salary"],
            },
        },
    },
)

import json
data = json.loads(response.output_text)
print(data)
# {"name": "Somchai", "age": 32, "department": "IT", "salary": 50000}
```

### Method 2: Pydantic Models (Python — highly recommended)

**Pydantic** (a Python library for defining data structures and validating values automatically) makes things Type-safe (sure the data types are correct) without writing the Schema yourself:

```python
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Define the Schema with Pydantic
class Product(BaseModel):
    name: str
    price: float
    currency: str
    in_stock: bool
    description: Optional[str] = None

# parse() returns a Pydantic object directly
response = client.responses.parse(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "Product: MacBook Pro M3, price 79,900 baht, in stock"
    }],
    text_format=Product,
)

product = response.output_parsed
print(f"Product: {product.name}")
print(f"Price: {product.price:,.0f} {product.currency}")
print(f"In stock: {'Yes' if product.in_stock else 'No'}")
```

---

## Real-world examples

### Extract invoice data (Invoice Parsing)

**Invoice Parsing** (automatically extracting data from an invoice):

```python
from pydantic import BaseModel
from typing import List
from datetime import date

class LineItem(BaseModel):
    description: str
    quantity: int
    unit_price: float
    total: float

class Invoice(BaseModel):
    invoice_number: str
    vendor_name: str
    invoice_date: date
    due_date: date
    line_items: List[LineItem]
    subtotal: float
    tax: float
    total_amount: float
    currency: str

invoice_text = """
Invoice #INV-2024-001
From: ABC Co., Ltd.
Date: January 15, 2025
Due: February 15, 2025

Items:
1. Website design service, 1 item, price 30,000 baht
2. CRM software License, 5 licenses, 2,000 baht each, total 10,000 baht

Subtotal: 40,000 baht
VAT 7%: 2,800 baht
Grand total: 42,800 baht
"""

response = client.responses.parse(
    model="grok-4.3",
    input=[{"role": "user", "content": f"Convert this invoice into JSON:\n\n{invoice_text}"}],
    text_format=Invoice,
)

invoice = response.output_parsed
print(f"Invoice: {invoice.invoice_number}")
print(f"Total: {invoice.total_amount:,.0f} {invoice.currency}")
for item in invoice.line_items:
    print(f"  - {item.description}: {item.total:,.0f}")
```

### Multi-dimensional Sentiment analysis

**Sentiment** (the feeling or emotion hidden in text — positive, negative, or neutral):

```python
from pydantic import BaseModel
from enum import Enum
from typing import List

class SentimentLevel(str, Enum):
    VERY_POSITIVE = "very_positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"

class ReviewAnalysis(BaseModel):
    overall_sentiment: SentimentLevel
    score: float  # 0.0 - 10.0
    positive_aspects: List[str]
    negative_aspects: List[str]
    key_topics: List[str]
    recommendation: bool

review = "The food here is delicious, especially the tom yum goong, but the service is quite slow — I had to wait over 30 minutes. Nice atmosphere, reasonable prices. I'd recommend giving it a try."

result = client.responses.parse(
    model="grok-4.3",
    input=[{"role": "user", "content": f"Analyze this review:\n\n{review}"}],
    text_format=ReviewAnalysis,
)

analysis = result.output_parsed
print(f"Sentiment: {analysis.overall_sentiment.value}")
print(f"Score: {analysis.score}/10")
print(f"Recommend: {'Yes' if analysis.recommendation else 'No'}")
```

---

## JavaScript — Zod Schema

**Zod** (a JavaScript/TypeScript library for defining and validating data structures — similar to Python's Pydantic):

```typescript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

// Define the Schema with Zod
const PersonSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  occupation: z.string(),
  skills: z.array(z.string()),
});

type Person = z.infer<typeof PersonSchema>;

async function extractPerson(text: string): Promise<Person> {
  const response = await client.beta.chat.completions.parse({
    model: "grok-4.3",
    messages: [
      { role: "user", content: `Extract the person's info from this text: ${text}` },
    ],
    response_format: zodResponseFormat(PersonSchema, "person"),
  });

  return response.choices[0].message.parsed!;
}

const person = await extractPerson(
  "Mr. Somsak, age 28, works as a Software Engineer, likes Python, TypeScript and Go"
);
console.log(person);
```

---

## Supported JSON Schema Types

| Type | Example |
|---|---|
| `string` | General text |
| `number` | A decimal number |
| `integer` | A whole number |
| `boolean` | `true` / `false` |
| `null` | An empty value |
| `array` | A list `[...]` |
| `object` | An Object `{...}` |
| `enum` | A fixed set of values, e.g. `["low", "medium", "high"]` |
| `anyOf` | One of several types |

### String Formats it can Enforce (force conformance to a format)

| Format | Example |
|---|---|
| `date` | `"2025-01-15"` |
| `time` | `"14:30:00"` |
| `date-time` | `"2025-01-15T14:30:00Z"` |
| `email` | `"user@example.com"` |
| `uuid` | `"550e8400-e29b-41d4..."` |
| `uri` | `"https://example.com"` |

---

## Cautions

- **You must specify `required` fields** — if you don't, Grok may not include that field
- **Nested objects** work, but don't make them too complex
- **Array size limit** — guaranteed up to 256 items
- **String length** — maxLength guaranteed up to 2,048 characters
- **`not` / `if-then-else`** — supported but not 100% guaranteed
- If the Schema is invalid, the API returns HTTP `400`
