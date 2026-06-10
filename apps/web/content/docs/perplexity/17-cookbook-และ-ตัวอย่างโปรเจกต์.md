---
title: "Cookbook และตัวอย่างโปรเจกต์"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "คอลเลกชันตัวอย่างโปรเจกต์จริงและ Cookbook สำหรับใช้ Perplexity API ในสถานการณ์ต่างๆ"
readTime: "8 นาที"
readers: "0"
locked: false
order: 17
---

# Cookbook และตัวอย่างโปรเจกต์

**Cookbook** (คุกบุ๊ค — คอลเลกชันสูตรและตัวอย่าง Code ที่พร้อมใช้งาน) ของ Perplexity รวบรวมตัวอย่างโปรเจกต์จริงที่ครอบคลุม Use Cases หลากหลาย ตั้งแต่งานพื้นฐานจนถึงระบบที่ซับซ้อน

---

## Cookbook Guides (คู่มือสูตรสำเร็จ)

### 1. Academic Search (การค้นหาวิชาการ)

```python
from perplexityai import Perplexity

client = Perplexity()

def academic_research(topic: str, year_from: int = 2020):
    """ค้นหางานวิจัยวิชาการในหัวข้อที่กำหนด"""
    response = client.agent.create(
        preset="deep-research",
        instructions="""
        คุณเป็นนักวิจัยวิชาการ
        - เน้นแหล่งข้อมูลจากวารสารวิชาการ (Academic Journals) และสถาบันวิจัย
        - ระบุ DOI (Digital Object Identifier — รหัสอ้างอิงบทความวิชาการ) ถ้ามี
        - แยกส่วน "งานวิจัย" ออกจาก "ความเห็น"
        - สรุปผลลัพธ์หลักเป็นข้อๆ
        """,
        input=f"งานวิจัยล่าสุดเกี่ยวกับ {topic} ตั้งแต่ปี {year_from}",
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

### 2. Async Research Manager (ผู้จัดการงานวิจัยแบบ Async)

```python
import asyncio
from perplexityai import AsyncPerplexity

async def parallel_research(topics: list[str]) -> dict:
    """วิจัยหลายหัวข้อพร้อมกัน"""
    client = AsyncPerplexity()
    
    async def research_one(topic):
        response = await client.agent.create(
            preset="pro-search",
            input=f"สรุปข้อมูลสำคัญเกี่ยวกับ: {topic}"
        )
        return {"topic": topic, "result": response.output_text}
    
    tasks = [research_one(topic) for topic in topics]
    results = await asyncio.gather(*tasks)
    
    return {r["topic"]: r["result"] for r in results}

# วิจัย 5 หัวข้อพร้อมกัน
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

### 3. RAG Pattern (ตอบจากเอกสารของคุณเอง)

**RAG** (Retrieval-Augmented Generation — สร้างคำตอบโดยดึงข้อมูลจากฐานความรู้ก่อน) เป็น Pattern ที่ใช้บ่อยที่สุดสำหรับ Enterprise Chatbot:

```python
import json
import numpy as np
from perplexityai import Perplexity

client = Perplexity()

class SimpleRAGSystem:
    """ระบบ RAG อย่างง่ายด้วย Perplexity Embeddings"""
    
    def __init__(self):
        self.documents = []
        self.embeddings = []
    
    def add_documents(self, docs: list[str]):
        """เพิ่มเอกสารเข้าฐานความรู้"""
        response = client.embeddings.create(
            model="pplx-embed-v1-0.6b",
            input=docs
        )
        self.documents.extend(docs)
        self.embeddings.extend([item.embedding for item in response.data])
        print(f"เพิ่มเอกสารแล้ว {len(docs)} ชิ้น (รวม {len(self.documents)} ชิ้น)")
    
    def find_relevant(self, query: str, top_k: int = 3) -> list[str]:
        """ค้นหาเอกสารที่เกี่ยวข้อง"""
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
        """ตอบคำถามโดยอ้างอิงจากเอกสาร"""
        context_docs = self.find_relevant(question)
        context = "\n---\n".join(context_docs)
        
        response = client.agent.create(
            model="openai/gpt-5.1-mini",
            instructions=f"""ตอบคำถามโดยใช้เฉพาะข้อมูลต่อไปนี้:
            
{context}

ถ้าข้อมูลไม่เพียงพอ บอกว่า "ไม่พบข้อมูลในฐานความรู้" """,
            input=question
        )
        return response.output_text

# การใช้งาน
rag = SimpleRAGSystem()
rag.add_documents([
    "บริษัทก่อตั้งปี 2020 มีพนักงาน 150 คน สำนักงานใหญ่อยู่กรุงเทพ",
    "สินค้าหลักคือซอฟต์แวร์ HR ราคาเริ่มต้น 2,000 บาท/เดือน",
    "ให้บริการลูกค้า 24/7 ติดต่อผ่าน support@company.co.th",
    "นโยบายคืนเงินภายใน 14 วันสำหรับแผน Basic ไม่มีการคืนเงินสำหรับแผน Enterprise"
])

print(rag.answer("บริษัทก่อตั้งเมื่อไหร่?"))
print(rag.answer("ราคาซอฟต์แวร์เท่าไหร่?"))
```

---

### 4. Domain Filtering (กรองแหล่งข้อมูล)

```python
def news_aggregator(topic: str, sources: list[str] = None) -> list[dict]:
    """รวบรวมข่าวจากแหล่งที่กำหนด"""
    
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

# ใช้งาน
tech_news = news_aggregator("AI Technology", sources=["techsauce.co", "krasia.com"])
for news in tech_news[:3]:
    print(f"\n{news['title']}")
    print(f"URL: {news['url']}")
```

---

### 5. Citation Parser (แยกวิเคราะห์แหล่งอ้างอิง)

```python
from urllib.parse import urlparse

def search_with_citations(query: str) -> dict:
    """ค้นหาและจัดระเบียบแหล่งอ้างอิง"""
    
    response = client.agent.create(
        preset="pro-search",
        input=query
    )
    
    # แยกวิเคราะห์ Citations
    parsed_citations = []
    for citation_url in response.citations:
        parsed = urlparse(citation_url)
        parsed_citations.append({
            "url": citation_url,
            "domain": parsed.netloc,  # ชื่อเว็บไซต์
            "path": parsed.path       # เส้นทางในเว็บ
        })
    
    return {
        "answer": response.output_text,
        "citations": parsed_citations,
        "source_count": len(parsed_citations),
        "unique_domains": list(set(c["domain"] for c in parsed_citations))
    }

result = search_with_citations("สถานะเศรษฐกิจไทยปี 2026")
print(f"คำตอบจาก {result['source_count']} แหล่ง")
print(f"โดเมนที่ใช้: {', '.join(result['unique_domains'])}")
```

---

## ตัวอย่างแอปพลิเคชัน Showcase

Perplexity มีตัวอย่างโปรเจกต์สำเร็จรูปมากกว่า 28 โปรเจกต์:

| ชื่อโปรเจกต์ | คำอธิบาย | Tech Stack |
|---|---|---|
| Agent Research Assistant | ผู้ช่วยวิจัยอัตโนมัติ | Python + Streamlit |
| Discord Bot | บอท Discord ตอบคำถามด้วย AI | Python + Discord.py |
| Disease Info App | แอปข้อมูลสุขภาพและโรค | React + TypeScript |
| Financial News Tracker | ติดตามข่าวการเงิน | Python + FastAPI |
| Legal Research Tool | เครื่องมือค้นคว้ากฎหมาย | Next.js |
| Academic Paper Finder | ค้นหางานวิจัย | Python |
| Real-time News Dashboard | Dashboard ข่าวสด | React + WebSocket |

---

## เทมเพลตสำหรับเริ่มต้นโปรเจกต์

### Python CLI Tool
```python
#!/usr/bin/env python3
"""
เทมเพลตโปรแกรม CLI ที่ใช้ Perplexity
"""
import argparse
from perplexityai import Perplexity

def main():
    parser = argparse.ArgumentParser(description="AI Research Tool")
    parser.add_argument("query", help="คำถามหรือหัวข้อที่ต้องการค้นหา")
    parser.add_argument("--preset", default="pro-search", 
                       choices=["fast-search", "pro-search", "deep-research", "advanced-deep-research"])
    parser.add_argument("--lang", default="th", help="ภาษาของคำตอบ (th/en)")
    args = parser.parse_args()
    
    client = Perplexity()
    
    response = client.agent.create(
        preset=args.preset,
        instructions=f"ตอบเป็นภาษา{'ไทย' if args.lang == 'th' else 'อังกฤษ'}",
        input=args.query
    )
    
    print("\n" + "="*60)
    print(response.output_text)
    print("="*60)
    print(f"\nแหล่งอ้างอิง ({len(response.citations)} แหล่ง):")
    for i, citation in enumerate(response.citations, 1):
        print(f"  {i}. {citation}")

if __name__ == "__main__":
    main()
```

การใช้งาน:
```bash
python research_tool.py "แนวโน้ม AI ในไทยปี 2026" --preset deep-research
python research_tool.py "Python vs JavaScript" --lang th
```

---

## สรุป

Perplexity Cookbook ครอบคลุม:
- **Academic Search** — ค้นหางานวิจัยจากแหล่งวิชาการ
- **Async Research** — วิจัยหลายหัวข้อพร้อมกัน
- **RAG System** — ตอบจากฐานความรู้ของตัวเอง
- **Domain Filtering** — รวบรวมข่าวจากแหล่งที่เชื่อถือ
- **Citation Parser** — วิเคราะห์แหล่งอ้างอิง

ดาวน์โหลด Code ตัวอย่างทั้งหมดได้ที่ GitHub Repository ของ Perplexity
