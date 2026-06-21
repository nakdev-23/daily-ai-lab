---
title: "Structured Output — receive JSON in a structure you define"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Structured Output forces Gemini to respond in a JSON schema you define, so you can process the data in code immediately without parsing text"
readTime: "8 min"
readers: "0"
locked: false
order: 27
---

# Structured Output — receive JSON in a structure you define

**Structured Output** (structured results — forcing the AI to answer in a predefined format) is a feature that forces Gemini to respond in a JSON (a standard data format — like a data table a program can read immediately) format you define in advance, instead of answering in plain text, making integration with other systems easier and more reliable.

---

## Why use Structured Output?

### The problem with parsing plain text

```python
# Without Structured Output — you must parse it yourself
response = gemini.ask("Extract the name and email from this text: John Doe, john@example.com")
text = response.text
# "Name: John Doe, Email: john@example.com"
# You must parse this string yourself — it can go wrong

# With Structured Output — get JSON directly
# {"name": "John Doe", "email": "john@example.com"}
```

### Benefits:
- **Type-safe** — confident you get the fields you want
- **No parsing** — use the JSON immediately
- **Consistent** — the same structure every request
- **Reliable** — Gemini must always answer per the schema

---

## How to use it

### Python — use Pydantic (recommended)

Pydantic is a Python library (a set of ready-made code tools) for defining data structures:

```python
from google import genai
from pydantic import BaseModel
from typing import List

client = genai.Client(api_key="YOUR_API_KEY")

# Define the structure with Pydantic
class Product(BaseModel):
    name: str
    price: float
    category: str
    in_stock: bool

class ProductList(BaseModel):
    products: List[Product]
    total_count: int

# Use response_schema (the defined response structure)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
    Products in the store:
    - iPhone 15 Pro 45,900 baht, phone category, in stock
    - MacBook Air M3 42,900 baht, computer category, out of stock
    - AirPods Pro 8,990 baht, accessories category, in stock
    """,
    config={
        "response_mime_type": "application/json",
        "response_schema": ProductList
    }
)

# Get JSON directly — no parsing
import json
data = json.loads(response.text)
print(data["products"][0]["name"])  # "iPhone 15 Pro"
print(data["total_count"])          # 3
```

### Python — use JSON Schema directly

```python
schema = {
    "type": "object",
    "properties": {
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"]  # enum — restrict the possible values
        },
        "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
        },
        "key_phrases": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["sentiment", "confidence", "key_phrases"]
}

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Analyze the sentiment: 'Great product, super fast shipping, very impressed!'",
    config={
        "response_mime_type": "application/json",
        "response_schema": schema
    }
)

result = json.loads(response.text)
# {"sentiment": "positive", "confidence": 0.98, "key_phrases": ["great", "fast shipping", "impressed"]}
```

### JavaScript — use Zod

Zod is a library for defining and validating data structures in JavaScript/TypeScript:

```javascript
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  cooking_time_minutes: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  steps: z.array(z.string())
});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Give a recipe for Pad Thai",
  config: {
    responseMimeType: "application/json",
    responseSchema: zodToJsonSchema(RecipeSchema)
  }
});

const recipe = JSON.parse(response.text);
console.log(recipe.name);        // "Pad Thai"
console.log(recipe.difficulty);  // "medium"
```

---

## Supported data types

| Type | Details |
|---|---|
| `string` | Text |
| `number` | A number (int or float) |
| `integer` | A whole number |
| `boolean` | true/false |
| `array` | A list |
| `object` | A nested object (several fields combined) |
| `null` | null (empty) |

**Usable constraints:**
- `enum` — restrict the possible values
- `required` — required fields
- `minimum`/`maximum` — for numbers
- `description` — field description (helps Gemini understand)
- `anyOf` — support several formats

---

## Real use cases

### 1. Information Extraction (extracting data from text)

```python
class ContactInfo(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    company: str | None = None

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
    Received a business card:
    Somchai Rakthai
    Technology Co., Ltd.
    Tel: 081-234-5678
    Email: somchai@techco.th
    """,
    config={
        "response_mime_type": "application/json",
        "response_schema": ContactInfo
    }
)
```

### 2. Classification (automatic categorization)

```python
class ContentClassification(BaseModel):
    category: str  # e.g., "technology", "sports", "politics"
    subcategory: str
    tags: List[str]
    is_breaking_news: bool
    language: str

# Used to categorize articles automatically
```

### 3. Data Transformation

```python
class InvoiceData(BaseModel):
    invoice_number: str
    date: str
    customer_name: str
    items: List[dict]
    subtotal: float
    vat: float
    total: float

# Convert a PDF invoice into structured data
```

### 4. Agentic Workflows (AI Agent processes)

```python
class NextAction(BaseModel):
    action: str  # "search_web", "call_api", "respond_to_user", "done"
    parameters: dict
    reasoning: str

# Have Gemini decide what to do next in an agentic flow (an AI process that decides for itself)
```

---

## Tips & Best Practices

### 1. Add clear descriptions
```python
class Product(BaseModel):
    name: str = Field(description="The product name in Thai")
    price: float = Field(description="The price in baht, excluding VAT")
    sku: str = Field(description="The product code, e.g. SKU-12345")
```

### 2. Use Optional for fields that may be missing
```python
from typing import Optional
class Person(BaseModel):
    name: str           # required
    age: Optional[int]  # may be missing
    email: str | None = None  # another way
```

### 3. Use enum for restricted values
```python
from enum import Enum
class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
```

### 4. Test with edge cases
- Missing data
- Conflicting data
- Ambiguous data

---

## Structured Output vs asking for JSON in the prompt

| | Structured Output | Asking for JSON in the prompt |
|---|---|---|
| Guarantees the format | ✓ Always | ✗ Sometimes wrong |
| Type validation | ✓ | ✗ |
| Needs parsing | ✗ | ✓ Can go wrong |
| Setup | Easy | Very easy |
| Recommended for production | ✓ | ✗ |
