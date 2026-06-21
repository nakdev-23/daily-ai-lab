---
title: "Embeddings and Long Context — semantic search and analyzing large documents"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Embeddings turn text into vectors for semantic search, while Long Context supports documents over 1 million tokens at once, good for RAG and analyzing large documents"
readTime: "9 min"
readers: "0"
locked: false
order: 28
---

# Embeddings and Long Context — semantic search and analyzing large documents

This chapter covers two key abilities for developers working with large data: **Embeddings** (turning text into numbers — so the computer understands meaning) for semantic search, and **Long Context** (a large context — the ability to take in a lot of data at once) for analyzing huge documents in one go.

---

## Part 1: Embeddings

### What is an Embedding?

An embedding (turning text into numbers — so the computer understands meaning) is converting data (text, images, video) into a **numeric vector** (a list of numbers representing the meaning), where data with similar meaning has vectors that are "close" together.

```
"cat"     → [0.12, -0.34, 0.89, ...]  (768 numbers)
"feline"  → [0.13, -0.35, 0.88, ...]  (very close! = same meaning)
"dog"     → [0.15, -0.30, 0.75, ...]  (fairly close = also an animal)
"car"     → [-0.54, 0.21, -0.12, ...] (far = different meaning)
```

### Why use Embeddings?

| Use case | Normal way | Embedding |
|---|---|---|
| Search documents | keyword match | semantic search (search by meaning) |
| Chatbot answering from documents | send everything (expensive) | find the relevant part (RAG — see below) |
| Categorize | rule-based | similarity clustering (group by similarity) |
| Recommend products | filter-based | similarity-based (recommend by similarity) |

---

### Gemini's Embedding models

| Model | Input | Max tokens | Output Dimensions (the output vector size) |
|---|---|---|---|
| `gemini-embedding-2` | Text, Image, Video, Audio, PDF | 8,192 | 128-3,072 |
| `gemini-embedding-001` | Text only | 2,048 | 768, 1,536, 3,072 |

**Recommended:** use `gemini-embedding-2` — Google's first multimodal embedding model (an embedding model taking many input types).

---

### Create a Text Embedding

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# Create an embedding from text
result = client.models.embed_content(
    model="gemini-embedding-2",
    contents="Gemini is Google's powerful AI",
    config={
        "output_dimensionality": 768  # choose: 128, 256, 512, 768, 1536, 3072
    }
)

vector = result.embeddings[0].values
print(f"Vector length: {len(vector)}")    # 768
print(f"First 5 values: {vector[:5]}")    # [-0.02, 0.13, ...]
```

### Create several embeddings at once

```python
texts = [
    "The weather today is very nice",
    "The sky is clear, no rain",
    "Stock prices surged",
    "The stock market rose"
]

results = client.models.embed_content(
    model="gemini-embedding-2",
    contents=texts
)

vectors = [e.values for e in results.embeddings]
```

---

### Semantic Search with Embeddings (RAG)

**RAG - Retrieval Augmented Generation** (retrieving data to supplement before answering — the AI finds data from a defined source first, then answers) uses embeddings to find relevant content, then sends it to Gemini to answer:

```python
import numpy as np
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

def cosine_similarity(v1, v2):
    """Measure the similarity of two vectors (0-1, with 1 = most identical)"""
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# 1. Build a knowledge base
documents = [
    "Gemini is an AI model developed by Google",
    "Python is a popular programming language for AI",
    "Bangkok is the capital of Thailand",
    "Machine learning is a branch of AI",
]

# 2. Create embeddings for the documents
doc_embeddings = client.models.embed_content(
    model="gemini-embedding-2",
    contents=documents
).embeddings

# 3. Get a question from the user
query = "Which company built Gemini?"

# 4. Create an embedding of the query (search term)
query_embedding = client.models.embed_content(
    model="gemini-embedding-2",
    contents=query
).embeddings[0].values

# 5. Find the closest document
similarities = [
    cosine_similarity(query_embedding, doc_emb.values)
    for doc_emb in doc_embeddings
]

top_indices = np.argsort(similarities)[-3:][::-1]  # Top 3
relevant_docs = [documents[i] for i in top_indices]

# 6. Send it to Gemini to answer
context = "\n".join(relevant_docs)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"Context:\n{context}\n\nQuestion: {query}"
)

print(response.text)
```

### Recommended Vector Databases (databases for storing and searching large embeddings)

For production, you should use a vector database:

| Database | Good for |
|---|---|
| **Pinecone** | Cloud, scalable, easy |
| **Weaviate** | Open-source, multimodal |
| **BigQuery Vector** | Google Cloud ecosystem |
| **Vertex AI Matching Engine** | Google Cloud, production-grade |
| **ChromaDB** | Local development |
| **pgvector** | PostgreSQL extension |

---

## Part 2: Long Context

### What is Long Context?

Long Context means Gemini supports a context window (the amount of data the AI takes in at once) of **1–2 million tokens** (pieces of text), far more than other models:

| Size | Equivalent |
|---|---|
| 1 million tokens | ~8 books or ~50,000 lines of code |
| 2 million tokens | ~16 books or 2 hours of video |

### Long Context vs RAG (Embedding)

| | Long Context | RAG (Embedding) |
|---|---|---|
| How to use | Send everything at once | Search and send only the part |
| Cost | Higher | Lower |
| Accuracy | Better for multi-hop (questions linking several points) | Better for lots of data |
| Setup | Very easy | More complex |
| Good for | A single large document | A knowledge base of hundreds of documents |

---

### Using Long Context

```python
# Read a large file
with open("legal_contract_500pages.pdf", "rb") as f:
    pdf_content = f.read()

response = client.models.generate_content(
    model="gemini-2.5-pro",  # supports 2M tokens
    contents=[
        {
            "parts": [
                {
                    "inline_data": {
                        "mime_type": "application/pdf",
                        "data": pdf_content
                    }
                },
                {
                    "text": "Summarize the contract's key points, and identify terms that may be risks"
                }
            ]
        }
    ]
)
```

### Use cases suited to Long Context

**1. Analyze a whole codebase (all the code)**
```python
# Send the whole repository (code store)
contents = []
for filename in code_files:
    contents.append(f"// File: {filename}\n{read_file(filename)}\n\n")

response = gemini.ask(
    "\n".join(contents) + "\nReview the code and find bugs that might occur"
)
```

**2. Analyze a long video**
```python
# Analyze a 2-hour video
response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents=[video_file, "Summarize the key points every 10 minutes"]
)
```

**3. Many-shot Learning (learning from many examples)**
```python
# Put hundreds of examples before the real prompt
examples = [f"Input: {x}\nOutput: {y}\n" for x, y in training_examples[:200]]
prompt = "".join(examples) + f"\nInput: {new_input}\nOutput:"
```

---

### Best Practices for Long Context

**1. Put the query at the end**
```python
# Good: context first, question after
contents = f"{long_document}\n\nQuestion: {query}"

# Worse: question before the context
contents = f"Question: {query}\n\n{long_document}"
```

**2. Use Context Caching when asking repeatedly**
```python
# If you'll ask several questions from the same document
# → cache the document first, then send different queries
cache = create_cache(long_document)
for question in questions:
    response = ask_with_cache(cache, question)
```

**3. Count tokens before sending**
```python
# Check it doesn't exceed the context window
token_count = client.models.count_tokens(
    model="gemini-2.5-flash",
    contents=your_contents
)
print(f"Total tokens: {token_count.total_tokens}")
# Gemini 2.5 Flash supports ~1M tokens
```
