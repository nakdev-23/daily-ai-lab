---
title: "Cookbook and example projects"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "A collection of real example projects and a Cookbook for using the Perplexity API in various situations"
readTime: "8 min"
readers: "0"
locked: false
order: 17
---

# Cookbook and example projects

Perplexity's **Cookbook** (a collection of recipes and ready-to-use code examples) gathers real example projects covering a variety of Use Cases, from basic tasks to complex systems.

---

## Cookbook Guides

### 1. Academic Search

```python
from perplexityai import Perplexity

client = Perplexity()

def academic_research(topic: str, year_from: int = 2020):
    """Search for academic research on a given topic"""
    response = client.agent.create(
        preset="deep-research",
        instructions="""
        You are an academic researcher
        - Focus on sources from Academic Journals and research institutions
        - Specify the DOI (Digital Object Identifier — a reference code for academic articles) if available
        - Separate "research" from "opinion"
        - Summarize the main findings as bullet points
        """,
        input=f"The latest research on {topic} since {year_from}",
        tools=[{
            "type": "web_search",
            "search_domain_filter": [
                "scholar.google.com",
                "pubmed.ncbi.nlm.nih.gov",
                "arxiv.org",
                "researchgate.net"
            ],
            "recency_filter": "year"
        }]
    )
    return response

result = academic_research("Large Language Model Thai language")
print(result.output_text)
```

---

### 2. Async Research Manager

```python
import asyncio
from perplexityai import AsyncPerplexity

async def parallel_research(topics: list[str]) -> dict:
    """Research several topics at once"""
    client = AsyncPerplexity()
    
    async def research_one(topic):
        response = await client.agent.create(
            preset="pro-search",
            input=f"Summarize the key information about: {topic}"
        )
        return {"topic": topic, "result": response.output_text}
    
    tasks = [research_one(topic) for topic in topics]
    results = await asyncio.gather(*tasks)
    
    return {r["topic"]: r["result"] for r in results}

# Research 5 topics at once
topics = [
    "AI in Healthcare Thailand",
    "EV Market Southeast Asia 2026",
    "Renewable Energy Thailand",
    "Digital Baht CBDC",
    "AI Regulation ASEAN"
]

research_results = asyncio.run(parallel_research(topics))
for topic, result in research_results.items():
    print(f"\n## {topic}")
    print(result[:300] + "...")
```

---

### 3. RAG Pattern (answer from your own documents)

**RAG** (Retrieval-Augmented Generation — generating an answer by retrieving data from a knowledge base first) is the most commonly used Pattern for Enterprise Chatbots:

```python
import json
import numpy as np
from perplexityai import Perplexity

client = Perplexity()

class SimpleRAGSystem:
    """A simple RAG system using Perplexity Embeddings"""
    
    def __init__(self):
        self.documents = []
        self.embeddings = []
    
    def add_documents(self, docs: list[str]):
        """Add documents to the knowledge base"""
        response = client.embeddings.create(
            model="pplx-embed-v1-0.6b",
            input=docs
        )
        self.documents.extend(docs)
        self.embeddings.extend([item.embedding for item in response.data])
        print(f"Added {len(docs)} documents (total {len(self.documents)})")
    
    def find_relevant(self, query: str, top_k: int = 3) -> list[str]:
        """Find the relevant documents"""
        q_response = client.embeddings.create(
            model="pplx-embed-v1-0.6b",
            input=[query]
        )
        q_vec = np.array(q_response.data[0].embedding)
        kb_matrix = np.array(self.embeddings)
        
        norms = np.linalg.norm(kb_matrix, axis=1) * np.linalg.norm(q_vec)
        similarities = np.dot(kb_matrix, q_vec) / norms
        
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [self.documents[i] for i in top_indices]
    
    def answer(self, question: str) -> str:
        """Answer the question referencing the documents"""
        context_docs = self.find_relevant(question)
        context = "\n---\n".join(context_docs)
        
        response = client.agent.create(
            model="openai/gpt-5.1-mini",
            instructions=f"""Answer the question using only the following information:
            
{context}

If the information is insufficient, say "No information found in the knowledge base" """,
            input=question
        )
        return response.output_text

# Usage
rag = SimpleRAGSystem()
rag.add_documents([
    "The company was founded in 2020, has 150 employees, headquartered in Bangkok",
    "The main product is HR software, starting at 2,000 baht/month",
    "Customer service is available 24/7, contact via support@company.co.th",
    "Refund policy is within 14 days for the Basic plan; no refunds for the Enterprise plan"
])

print(rag.answer("When was the company founded?"))
print(rag.answer("How much does the software cost?"))
```

---

### 4. Domain Filtering

```python
def news_aggregator(topic: str, sources: list[str] = None) -> list[dict]:
    """Aggregate news from specified sources"""
    
    default_thai_news = [
        "thairath.co.th",
        "bangkokpost.com", 
        "nationthailand.com",
        "prachatai.com"
    ]
    
    domain_filter = sources or default_thai_news
    
    results = client.search.create(
        query=topic,
        search_domain_filter=domain_filter,
        recency_filter="day",
        num_results=10
    )
    
    return [{
        "title": r.title,
        "url": r.url,
        "snippet": r.snippet,
        "date": r.date
    } for r in results.results]

# Usage
tech_news = news_aggregator("AI Technology", sources=["techsauce.co", "krasia.com"])
for news in tech_news[:3]:
    print(f"\n{news['title']}")
    print(f"URL: {news['url']}")
```

---

### 5. Citation Parser

```python
from urllib.parse import urlparse

def search_with_citations(query: str) -> dict:
    """Search and organize the citations"""
    
    response = client.agent.create(
        preset="pro-search",
        input=query
    )
    
    # Parse the Citations
    parsed_citations = []
    for citation_url in response.citations:
        parsed = urlparse(citation_url)
        parsed_citations.append({
            "url": citation_url,
            "domain": parsed.netloc,  # the website name
            "path": parsed.path       # the path on the site
        })
    
    return {
        "answer": response.output_text,
        "citations": parsed_citations,
        "source_count": len(parsed_citations),
        "unique_domains": list(set(c["domain"] for c in parsed_citations))
    }

result = search_with_citations("The state of the Thai economy in 2026")
print(f"Answer from {result['source_count']} sources")
print(f"Domains used: {', '.join(result['unique_domains'])}")
```

---

## Showcase application examples

Perplexity has more than 28 ready-made example projects:

| Project name | Description | Tech Stack |
|---|---|---|
| Agent Research Assistant | An automatic research assistant | Python + Streamlit |
| Discord Bot | A Discord bot answering questions with AI | Python + Discord.py |
| Disease Info App | A health and disease information app | React + TypeScript |
| Financial News Tracker | Track financial news | Python + FastAPI |
| Legal Research Tool | A legal research tool | Next.js |
| Academic Paper Finder | Find research papers | Python |
| Real-time News Dashboard | A live news Dashboard | React + WebSocket |

---

## Templates to start a project

### Python CLI Tool
```python
#!/usr/bin/env python3
"""
A template for a CLI program using Perplexity
"""
import argparse
from perplexityai import Perplexity

def main():
    parser = argparse.ArgumentParser(description="AI Research Tool")
    parser.add_argument("query", help="The question or topic to search for")
    parser.add_argument("--preset", default="pro-search", 
                       choices=["fast-search", "pro-search", "deep-research", "advanced-deep-research"])
    parser.add_argument("--lang", default="th", help="The answer language (th/en)")
    args = parser.parse_args()
    
    client = Perplexity()
    
    response = client.agent.create(
        preset=args.preset,
        instructions=f"Answer in {'Thai' if args.lang == 'th' else 'English'}",
        input=args.query
    )
    
    print("\n" + "="*60)
    print(response.output_text)
    print("="*60)
    print(f"\nCitations ({len(response.citations)} sources):")
    for i, citation in enumerate(response.citations, 1):
        print(f"  {i}. {citation}")

if __name__ == "__main__":
    main()
```

Usage:
```bash
python research_tool.py "AI trends in Thailand in 2026" --preset deep-research
python research_tool.py "Python vs JavaScript" --lang th
```

---

## Summary

The Perplexity Cookbook covers:
- **Academic Search** — search research from academic sources
- **Async Research** — research several topics at once
- **RAG System** — answer from your own knowledge base
- **Domain Filtering** — aggregate news from trusted sources
- **Citation Parser** — analyze the citations

Download all the example Code from Perplexity's GitHub Repository.
