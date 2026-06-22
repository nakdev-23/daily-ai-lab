---
title: "Embeddings API — convert text into Vectors"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "The Embeddings API converts text into Vector numbers for semantic search systems, RAG Pipelines, and Machine Learning"
readTime: "8 min"
readers: "0"
locked: false
order: 11
---

# Embeddings API — convert text into Vectors

The **Embeddings API** (an Embedding-creation API — a service that converts text into numbers representing meaning) is a tool for developers who want to build a semantic search system (Semantic Search) or a RAG Pipeline (a system that retrieves data from a knowledge base combined with AI).

---

## What is an Embedding?

An **Embedding** (a meaning vector) is the conversion of text into multi-dimensional numbers. For example, the texts "cute dog" and "cute pup" get very similar Embeddings, even though they use different words, because they have the same meaning.

**Benefits:**
- Search documents by "meaning," not just "matching words"
- Build RAG (Retrieval-Augmented Generation — generating text by retrieving data from our own knowledge base) so the AI answers from our documents
- Group documents by meaning (Clustering)
- Check text similarity (Similarity)

---

## Supported models

Perplexity has 4 Embedding models in 2 categories:

### Standard Embeddings
Good for text that stands alone, e.g. separate questions or documents.

| Model | Dimensions | Context Window | Price |
|---|---|---|---|
| `pplx-embed-v1-0.6b` | 1,024 dimensions | 32K tokens | $0.004/1M tokens |
| `pplx-embed-v1-4b` | 2,560 dimensions | 32K tokens | $0.03/1M tokens |

### Contextualized Embeddings
Good for text within the same document, e.g. multiple paragraphs in an article.

| Model | Dimensions | Context Window | Price |
|---|---|---|---|
| `pplx-embed-context-v1-0.6b` | 1,024 dimensions | 32K tokens | $0.008/1M tokens |
| `pplx-embed-context-v1-4b` | 2,560 dimensions | 32K tokens | $0.05/1M tokens |

**Choose 0.6b or 4b?**
- **0.6b** — faster, cheaper, good for large systems focused on speed
- **4b** — higher quality, more dimensions, good for work needing high accuracy

---

## Endpoint

```
POST https://api.perplexity.ai/v1/embeddings
```

---

## Usage examples

### Python — create a basic Embedding
```python
from perplexityai import Perplexity

client = Perplexity()

# Create an Embedding for a single text
response = client.embeddings.create(
    model="pplx-embed-v1-0.6b",
    input="What is Perplexity AI"
)

embedding_vector = response.data[0].embedding  # get the Vector back
print(f"Number of dimensions: {len(embedding_vector)}")  # 1024
```

### Python — create Embeddings for several texts at once
```python
# Batch Embeddings (process several texts at once)
texts = [
    "How to learn Python for beginners",
    "Python tutorial for beginners",
    "Thai cooking techniques",
    "Chiang Mai travel map"
]

response = client.embeddings.create(
    model="pplx-embed-v1-0.6b",
    input=texts  # send up to 512 texts at once
)

# See the Embedding of each text
for i, item in enumerate(response.data):
    print(f"Text {i+1}: {len(item.embedding)} dimensions")
```

### Contextualized Embeddings — for paragraphs in a document
```python
document_paragraphs = [
    "Chapter 1: The history of AI began in 1950...",
    "In 1956 John McCarthy coined the term Artificial Intelligence...",
    "The 1970s-1980s are called the AI Winter due to a lack of research funding...",
    "Deep Learning revived AI again in 2012..."
]

# Use the Contextualized Model for linked paragraphs
response = client.embeddings.create(
    model="pplx-embed-context-v1-0.6b",  # the Contextualized model
    input=document_paragraphs
)
```

---

## Calculating Similarity

**Very important:** Perplexity's Embeddings are **Unnormalized** (not yet Normalized — the values aren't yet adjusted to the same scale); you must use **Cosine Similarity** for comparison.

```python
import numpy as np
from perplexityai import Perplexity

client = Perplexity()

def get_embedding(text, model="pplx-embed-v1-0.6b"):
    response = client.embeddings.create(model=model, input=[text])
    return np.array(response.data[0].embedding)

def cosine_similarity(v1, v2):
    """Cosine Similarity — measures the angle between two vectors (0 = very different, 1 = identical)"""
    dot_product = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)  # the magnitude of Vector 1
    norm2 = np.linalg.norm(v2)  # the magnitude of Vector 2
    return dot_product / (norm1 * norm2)

# Test similarity
query = get_embedding("How to learn Python")
doc1 = get_embedding("Teaching basic Python")  # close meaning
doc2 = get_embedding("How to grow plants")     # different meaning

print(f"Similarity to doc1: {cosine_similarity(query, doc1):.4f}")  # high ~0.9
print(f"Similarity to doc2: {cosine_similarity(query, doc2):.4f}")  # low ~0.2
```

---

## Building a RAG System with Embeddings

**RAG** (Retrieval-Augmented Generation — retrieving data from a knowledge base before the AI answers) helps the AI answer from our documents, not purely from the AI's knowledge:

```python
import numpy as np
from perplexityai import Perplexity

client = Perplexity()

# Step 1: create Embeddings for the knowledge base
knowledge_base = [
    "Product A costs 500 baht with a 1-year warranty",
    "Product B is good for users wanting high speed, priced at 1,200 baht",
    "The return policy is within 30 days, free of charge",
    "Support is reachable every day 09:00-18:00"
]

# Create the Embeddings piece by piece (or as a Batch)
kb_embeddings = []
response = client.embeddings.create(
    model="pplx-embed-v1-0.6b",
    input=knowledge_base
)
kb_embeddings = [item.embedding for item in response.data]
kb_matrix = np.array(kb_embeddings)

def find_relevant_docs(question, top_k=2):
    """Find the documents relevant to the question"""
    q_response = client.embeddings.create(
        model="pplx-embed-v1-0.6b",
        input=[question]
    )
    q_embedding = np.array(q_response.data[0].embedding)
    
    # Compute Cosine Similarity with every document
    norms = np.linalg.norm(kb_matrix, axis=1) * np.linalg.norm(q_embedding)
    similarities = np.dot(kb_matrix, q_embedding) / norms
    
    # Pick the Top K most similar documents
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [knowledge_base[i] for i in top_indices]

# Step 2: use the Agent API to answer referencing the documents
def rag_answer(question):
    relevant_docs = find_relevant_docs(question)
    context = "\n".join(relevant_docs)
    
    response = client.agent.create(
        model="openai/gpt-5.1-mini",
        instructions=f"Answer the question using only the following information:\n{context}",
        input=question
    )
    return response.output_text

print(rag_answer("How much does the product cost?"))
```

---

## Best Practices for Embeddings

1. **Batch up to 512 texts** per Request to reduce the number of API calls
2. **Cache computed Embeddings** in a Database; don't recompute them
3. **Use the same model throughout** — don't mix pplx-embed-v1-0.6b with 4b in the same system
4. **Always use Cosine Similarity** for int8 encoding (the default)
5. **Matryoshka Reduction** — if you want to save Storage, you can reduce the dimensions from 2560 to 512 with a slight quality drop

---

## Summary

The Embeddings API is good for:
- Building Semantic Search (search by meaning)
- A RAG Pipeline for a Chatbot that answers from your documents
- Automatic document clustering
- Detecting Duplicate content
- A Recommendation System

Pricing starts at just $0.004 per 1 million Tokens, which is very cost-effective for building a RAG system.
