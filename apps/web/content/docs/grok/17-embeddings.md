---
title: "Embeddings API — เวกเตอร์ข้อความสำหรับค้นหาเชิงความหมาย"
tool: "Grok"
icon: "icon-docs"
level: "intermediate"
summary: "Embeddings แปลงข้อความเป็นเวกเตอร์ตัวเลข ทำให้ค้นหาเชิงความหมาย (Semantic Search) เปรียบเทียบความคล้าย และสร้างระบบ RAG ได้"
readTime: "6 นาที"
readers: "0"
locked: false
order: 17
---
# Embeddings API — เวกเตอร์ข้อความสำหรับค้นหาเชิงความหมาย

> อ้างอิง: [xAI API Reference](https://docs.x.ai/api-reference) | [OpenAI Embeddings Docs](https://platform.openai.com/docs/guides/embeddings)

---

## Embeddings คืออะไร?

**Embeddings** (ตัวเลขที่แทนความหมายของข้อความ — ใช้ในการค้นหาเชิงความหมาย) คือการแปลงข้อความ (หรือข้อมูลอื่นๆ) ให้เป็น **เวกเตอร์ตัวเลข** (array of floats — ชุดตัวเลขทศนิยมที่ AI ใช้แทนความหมาย)

ข้อความที่มีความหมายใกล้เคียงกันจะมีเวกเตอร์ที่ "ใกล้กัน" ในพื้นที่เวกเตอร์

### ตัวอย่าง

```
"กินข้าว"      → [0.12, -0.34, 0.89, ...]   ← ใกล้กัน
"รับประทานอาหาร" → [0.11, -0.35, 0.88, ...]   ←

"รถยนต์"       → [0.92, 0.15, -0.44, ...]   ← ห่างกัน
```

---

## ทำไมต้องใช้ Embeddings?

| Use Case | คำอธิบาย |
|---|---|
| **Semantic Search** (ค้นหาเชิงความหมาย) | ค้นหาด้วยความหมาย ไม่ใช่แค่คำที่ตรงกัน |
| **RAG — Retrieval-Augmented Generation** (การเพิ่มความรู้ให้ AI ด้วยการดึงเอกสาร) | ดึงเอกสารที่เกี่ยวข้องมาให้ AI ก่อนตอบ |
| **Recommendation** (ระบบแนะนำ) | แนะนำสินค้า/บทความที่คล้ายกัน |
| **Clustering** (การจัดกลุ่ม) | จัดกลุ่มข้อความที่มีหัวข้อเดียวกัน |
| **Duplicate Detection** (การตรวจจับข้อมูลซ้ำ) | หาข้อความที่ซ้ำหรือคล้ายกันมาก |
| **Classification** (การจัดประเภท) | แยกประเภทข้อความ |

---

## การใช้งาน Embeddings API

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# สร้าง Embedding ของข้อความ
response = client.embeddings.create(
    model="text-embedding-3-small",  # หรือ model embedding ที่ xAI รองรับ
    input="สวัสดีครับ วันนี้อากาศดีมาก",
)

embedding = response.data[0].embedding
print(f"จำนวน dimensions: {len(embedding)}")  # dimensions = จำนวนมิติของเวกเตอร์
print(f"ค่า 5 ตัวแรก: {embedding[:5]}")
```

### Batch Embeddings — หลายข้อความพร้อมกัน

**Batch** (การประมวลผลข้อมูลเป็นชุด — ส่งหลายรายการพร้อมกันแทนที่จะส่งทีละครั้ง):

```python
texts = [
    "ผมชอบกินข้าวผัด",
    "อาหารไทยอร่อยมาก",
    "Python เป็นภาษาโปรแกรมมิ่ง",
    "JavaScript ใช้ทำ frontend",
    "เธอรักการเดินทาง",
]

response = client.embeddings.create(
    model="text-embedding-3-small",
    input=texts,
)

# รับ embeddings ทุกตัวพร้อมกัน
embeddings = [item.embedding for item in response.data]
print(f"จำนวน embeddings: {len(embeddings)}")
print(f"Dimensions: {len(embeddings[0])}")
```

---

## Semantic Search — ค้นหาเชิงความหมาย

### สร้าง Simple Semantic Search

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
    """คำนวณ Cosine Similarity (ค่าความคล้ายระหว่างเวกเตอร์ 2 ตัว — 0 = ไม่คล้าย, 1 = เหมือนกัน)"""
    a = np.array(a)
    b = np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Knowledge Base (ฐานความรู้ — ชุดเอกสารที่ใช้ค้นหา)
documents = [
    "วิธีสมัคร Credit Card ของธนาคารกสิกร",
    "ขั้นตอนการโอนเงินผ่าน PromptPay",
    "วิธีเปิดบัญชีออมทรัพย์ออนไลน์",
    "การตั้งค่า Two-Factor Authentication (การยืนยันตัวตนสองขั้นตอน)",
    "วิธียกเลิกบัตรเครดิต",
    "ขั้นตอนกู้เงินส่วนบุคคล",
]

# สร้าง Embeddings ของทุก document
doc_embeddings = [get_embedding(doc) for doc in documents]

def search(query: str, top_k: int = 3) -> list[tuple[str, float]]:
    """ค้นหา document ที่เกี่ยวข้องมากที่สุด"""
    query_embedding = get_embedding(query)
    
    similarities = [
        (doc, cosine_similarity(query_embedding, doc_emb))
        for doc, doc_emb in zip(documents, doc_embeddings)
    ]
    
    # เรียงจากคล้ายที่สุด
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:top_k]

# ทดสอบ
results = search("อยากเปิดบัญชีธนาคาร")
for doc, score in results:
    print(f"[{score:.3f}] {doc}")
```

---

## RAG (Retrieval-Augmented Generation)

**RAG** (การเพิ่มความรู้ให้ AI ด้วยการดึงเอกสารก่อนตอบ — แทนที่จะพึ่งความรู้จาก Training อย่างเดียว) รวม Embeddings กับ Grok เพื่อตอบคำถามจากเอกสารของคุณ:

```python
import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# ฐานความรู้ (ตัวอย่าง)
knowledge_base = [
    {
        "content": "บริษัทเราให้ลาพักร้อน 10 วันต่อปี สำหรับพนักงานที่ทำงานครบ 1 ปี",
        "source": "HR Policy 2025"
    },
    {
        "content": "การขอลาป่วยต้องแจ้งหัวหน้าก่อน 8.00 น. และส่งใบรับรองแพทย์ภายใน 3 วัน",
        "source": "HR Policy 2025"
    },
    {
        "content": "เบี้ยเลี้ยงในการเดินทางต่างจังหวัด 700 บาทต่อวัน และที่พัก 1,500 บาทต่อคืน",
        "source": "Finance Policy 2025"
    },
]

# สร้าง Embeddings
for item in knowledge_base:
    item["embedding"] = client.embeddings.create(
        model="text-embedding-3-small",
        input=item["content"],
    ).data[0].embedding

def rag_query(question: str) -> str:
    # 1. หา documents ที่เกี่ยวข้อง
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
    top_docs = similarities[:2]  # เอา 2 อันดับแรก
    
    # 2. สร้าง Context (ข้อมูลบริบทที่ส่งให้ Grok ใช้ตอบ)
    context = "\n".join([
        f"[{item['source']}] {item['content']}"
        for item, _ in top_docs
    ])
    
    # 3. ถาม Grok พร้อม Context
    response = client.responses.create(
        model="grok-4.3",
        input=[
            {
                "role": "system",
                "content": "ตอบคำถามจากข้อมูลที่ให้มาเท่านั้น ถ้าไม่มีข้อมูล ให้บอกว่าไม่มีข้อมูล"
            },
            {
                "role": "user",
                "content": f"ข้อมูล:\n{context}\n\nคำถาม: {question}"
            }
        ],
    )
    
    return response.output_text

# ทดสอบ
print(rag_query("ลาป่วยต้องทำอะไรบ้าง?"))
print(rag_query("เบี้ยเลี้ยงเดินทางต่างจังหวัดได้เท่าไหร่?"))
```

---

## ใช้ Vector Database ร่วมกัน

**Vector Database** (ฐานข้อมูลเวกเตอร์ — ระบบจัดเก็บและค้นหาข้อมูลแบบเวกเตอร์ได้เร็วมาก เช่น Pinecone, Qdrant, Weaviate) เหมาะสำหรับข้อมูลจำนวนมาก:

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
    """เพิ่มเอกสารเข้า Vector DB"""
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
    """ค้นหาเชิงความหมาย"""
    q_emb = xai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    ).data[0].embedding
    
    results = index.query(vector=q_emb, top_k=top_k, include_metadata=True)
    return results.matches
```

---

## ราคา Embeddings

ราคาโดยประมาณ (ตรวจสอบราคาล่าสุดที่ [console.x.ai](https://console.x.ai/)):

| Model | ราคา (ต่อ 1M tokens) |
|---|---|
| `text-embedding-3-small` | ~$0.02 |
| `text-embedding-3-large` | ~$0.13 |

> Embeddings ราคาถูกมากเมื่อเทียบกับ Chat — ข้อความ 1,000 คำใช้ประมาณ 1,500 tokens (ชิ้นส่วนข้อความ) หรือ ~$0.00003

---

## Tips สำหรับ Production

1. **Cache embeddings** (เก็บ embeddings ที่คำนวณแล้วไว้ใช้ซ้ำ) — อย่า generate ใหม่ทุกครั้ง บันทึกลง Database
2. **Normalize** (ทำให้เวกเตอร์มีขนาดมาตรฐาน) — ทำ L2-normalization ก่อนเปรียบเทียบเพื่อความแม่นยำ
3. **Chunking** (การแบ่งข้อความยาวเป็นท่อนเล็ก — เพื่อให้ embedding แม่นยำขึ้น) — แบ่งเอกสารยาวเป็นส่วนย่อย (500-1000 tokens) ก่อน embed
4. **Metadata** (ข้อมูลอธิบายเพิ่มเติม) — เก็บ source, timestamp, category ควบคู่กับ embedding
5. **Update** — อัปเดต embeddings เมื่อเนื้อหาเปลี่ยน
