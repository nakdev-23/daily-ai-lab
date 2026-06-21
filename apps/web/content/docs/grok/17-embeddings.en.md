---
title: "Embeddings API — text vectors for semantic search"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Embeddings turn text into numeric vectors, enabling semantic search (Semantic Search), similarity comparison, and building RAG systems."
readTime: "6 min"
readers: "0"
locked: false
order: 17
---
# Embeddings API — text vectors for semantic search

> Reference: [xAI API Reference](https://docs.x.ai/api-reference) | [OpenAI Embeddings Docs](https://platform.openai.com/docs/guides/embeddings)

---

## What are Embeddings?

**Embeddings** (numbers that represent the meaning of text — used for semantic search) are the conversion of text (or other data) into a **numeric vector** (array of floats — a set of decimal numbers the AI uses to represent meaning).

Texts with similar meaning have vectors that are "close" to each other in the vector space.

### Example

```
"eat rice"          → [0.12, -0.34, 0.89, ...]   ← close together
"have a meal"       → [0.11, -0.35, 0.88, ...]   ←

"car"               → [0.92, 0.15, -0.44, ...]   ← far apart
```

---

## Why use Embeddings?

| Use Case | Description |
|---|---|
| **Semantic Search** | Search by meaning, not just matching words |
| **RAG — Retrieval-Augmented Generation** (adding knowledge to the AI by retrieving documents) | Pull relevant documents for the AI before it answers |
| **Recommendation** | Recommend similar products/articles |
| **Clustering** | Group texts on the same topic |
| **Duplicate Detection** | Find duplicate or very similar texts |
| **Classification** | Categorize text |

---

## Using the Embeddings API

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Create an Embedding of the text
response = client.embeddings.create(
    model="text-embedding-3-small",  # or an embedding model xAI supports
    input="Hello, the weather is lovely today",
)

embedding = response.data[0].embedding
print(f"Number of dimensions: {len(embedding)}")  # dimensions = the vector's number of dimensions
print(f"First 5 values: {embedding[:5]}")
```

### Batch Embeddings — many texts at once

**Batch** (processing data in a set — sending many items at once instead of one at a time):

```python
texts = [
    "I like eating fried rice",
    "Thai food is delicious",
    "Python is a programming language",
    "JavaScript is used for frontend",
    "She loves traveling",
]

response = client.embeddings.create(
    model="text-embedding-3-small",
    input=texts,
)

# Get every embedding at once
embeddings = [item.embedding for item in response.data]
print(f"Number of embeddings: {len(embeddings)}")
print(f"Dimensions: {len(embeddings[0])}")
```

---

## Semantic Search

### Build a simple Semantic Search

```python
import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute Cosine Similarity (the similarity between 2 vectors — 0 = not similar, 1 = identical)"""
    a = np.array(a)
    b = np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Knowledge Base (a set of documents to search)
documents = [
    "How to apply for a Kasikorn Bank Credit Card",
    "Steps to transfer money via PromptPay",
    "How to open a savings account online",
    "Setting up Two-Factor Authentication",
    "How to cancel a credit card",
    "Steps for a personal loan",
]

# Create Embeddings for every document
doc_embeddings = [get_embedding(doc) for doc in documents]

def search(query: str, top_k: int = 3) -> list[tuple[str, float]]:
    """Find the most relevant documents"""
    query_embedding = get_embedding(query)
    
    similarities = [
        (doc, cosine_similarity(query_embedding, doc_emb))
        for doc, doc_emb in zip(documents, doc_embeddings)
    ]
    
    # Sort from most similar
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_k]

# Test
results = search("I want to open a bank account")
for doc, score in results:
    print(f"[{score:.3f}] {doc}")
```

---

## RAG (Retrieval-Augmented Generation)

**RAG** (adding knowledge to the AI by retrieving documents before answering — instead of relying on Training knowledge alone) combines Embeddings with Grok to answer questions from your documents:

```python
import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Knowledge base (example)
knowledge_base = [
    {
        "content": "Our company gives 10 days of paid vacation per year for employees with 1 full year of service",
        "source": "HR Policy 2025"
    },
    {
        "content": "Sick leave must be reported to your supervisor before 8:00 AM, with a medical certificate within 3 days",
        "source": "HR Policy 2025"
    },
    {
        "content": "The travel per diem for out-of-province trips is 700 baht per day, and lodging is 1,500 baht per night",
        "source": "Finance Policy 2025"
    },
]

# Create Embeddings
for item in knowledge_base:
    item["embedding"] = client.embeddings.create(
        model="text-embedding-3-small",
        input=item["content"],
    ).data[0].embedding

def rag_query(question: str) -> str:
    # 1. Find relevant documents
    q_emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=question,
    ).data[0].embedding
    
    similarities = []
    for item in knowledge_base:
        score = np.dot(q_emb, item["embedding"]) / (
            np.linalg.norm(q_emb) * np.linalg.norm(item["embedding"])
        )
        similarities.append((item, float(score)))
    
    similarities.sort(key=lambda x: x[1], reverse=True)
    top_docs = similarities[:2]  # take the top 2
    
    # 2. Build the Context (the contextual info sent to Grok to answer with)
    context = "\n".join([
        f"[{item['source']}] {item['content']}"
        for item, _ in top_docs
    ])
    
    # 3. Ask Grok with the Context
    response = client.responses.create(
        model="grok-4.3",
        input=[
            {
                "role": "system",
                "content": "Answer the question only from the data provided. If there's no data, say there's no data."
            },
            {
                "role": "user",
                "content": f"Data:\n{context}\n\nQuestion: {question}"
            }
        ],
    )
    
    return response.output_text

# Test
print(rag_query("What do I need to do for sick leave?"))
print(rag_query("How much is the out-of-province travel per diem?"))
```

---

## Using it with a Vector Database

A **Vector Database** (a vector database — a system that stores and searches vector data very fast, e.g. Pinecone, Qdrant, Weaviate) is good for large amounts of data:

```python
from pinecone import Pinecone
from openai import OpenAI

xai_client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)
pc = Pinecone(api_key="YOUR_PINECONE_KEY")
index = pc.Index("my-knowledge-base")

def upsert_document(doc_id: str, text: str, metadata: dict):
    """Add a document to the Vector DB"""
    embedding = xai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    ).data[0].embedding
    
    index.upsert(vectors=[{
        "id": doc_id,
        "values": embedding,
        "metadata": {**metadata, "text": text},
    }])

def semantic_search(query: str, top_k: int = 5) -> list[dict]:
    """Semantic search"""
    q_emb = xai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    ).data[0].embedding
    
    results = index.query(vector=q_emb, top_k=top_k, include_metadata=True)
    return results.matches
```

---

## Embeddings pricing

Approximate prices (check the latest at [console.x.ai](https://console.x.ai/)):

| Model | Price (per 1M tokens) |
|---|---|
| `text-embedding-3-small` | ~$0.02 |
| `text-embedding-3-large` | ~$0.13 |

> Embeddings are very cheap compared to Chat — 1,000 words of text uses about 1,500 tokens (chunks of text) or ~$0.00003

---

## Tips for Production

1. **Cache embeddings** (keep computed embeddings to reuse) — don't regenerate them every time; save them to a Database
2. **Normalize** (give vectors a standard size) — do L2-normalization before comparing for accuracy
3. **Chunking** (splitting long text into small pieces — to make embeddings more accurate) — split long documents into smaller parts (500–1000 tokens) before embedding
4. **Metadata** (additional descriptive data) — store source, timestamp, category alongside the embedding
5. **Update** — update embeddings when the content changes
