---
title: "Embeddings และ Long Context — ค้นหาความหมายและวิเคราะห์เอกสารใหญ่"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Embeddings แปลงข้อความเป็น vector เพื่อค้นหาความหมาย ส่วน Long Context รองรับเอกสารกว่า 1 ล้าน token ในครั้งเดียว เหมาะสำหรับงาน RAG และการวิเคราะห์เอกสารใหญ่"
readTime: "9 นาที"
readers: "0"
locked: false
order: 28
---

# Embeddings และ Long Context — ค้นหาความหมายและวิเคราะห์เอกสารใหญ่

บทนี้ครอบคลุมสองความสามารถสำคัญสำหรับนักพัฒนาที่ทำงานกับข้อมูลขนาดใหญ่: **Embeddings** (การแปลงข้อความเป็นตัวเลข — เพื่อให้คอมพิวเตอร์เข้าใจความหมาย) สำหรับ semantic search (การค้นหาตามความหมาย) และ **Long Context** (บริบทขนาดใหญ่ — ความสามารถรับข้อมูลจำนวนมากในครั้งเดียว) สำหรับวิเคราะห์เอกสารยักษ์ในครั้งเดียว

---

## ส่วนที่ 1: Embeddings

### Embedding คืออะไร?

Embedding (การแปลงข้อความเป็นตัวเลข — เพื่อให้คอมพิวเตอร์เข้าใจความหมาย) คือการแปลงข้อมูล (ข้อความ, รูปภาพ, วิดีโอ) เป็น **vector ตัวเลข** (รายการตัวเลขที่แทนความหมาย) โดยข้อมูลที่มีความหมายคล้ายกันจะมี vector ที่ "ใกล้กัน"

```
"แมว"     → [0.12, -0.34, 0.89, ...]  (768 ตัวเลข)
"cat"     → [0.13, -0.35, 0.88, ...]  (ใกล้มาก! = ความหมายเดียวกัน)
"หมา"     → [0.15, -0.30, 0.75, ...]  (ใกล้พอสมควร = สัตว์เหมือนกัน)
"รถยนต์"  → [-0.54, 0.21, -0.12, ...] (ไกลมาก = ความหมายต่างกัน)
```

### ทำไมต้องใช้ Embedding?

| กรณีการใช้งาน | วิธีปกติ | Embedding |
|---|---|---|
| ค้นหาเอกสาร | keyword match (จับคู่คำ) | semantic search (ค้นหาตามความหมาย) |
| Chatbot ตอบจากเอกสาร | ส่งทั้งหมด (แพง) | ค้นหาส่วนที่เกี่ยวข้อง (RAG — ดูด้านล่าง) |
| จัดหมวดหมู่ | rule-based (ตามกฎที่กำหนด) | similarity clustering (จัดกลุ่มตามความคล้าย) |
| แนะนำสินค้า | filter based (กรองตามเงื่อนไข) | similarity-based (แนะนำตามความคล้ายคลึง) |

---

### โมเดล Embedding ของ Gemini

| โมเดล | Input | Token สูงสุด | Output Dimensions (ขนาดเวกเตอร์ผลลัพธ์) |
|---|---|---|---|
| `gemini-embedding-2` | Text, Image, Video, Audio, PDF | 8,192 | 128-3,072 |
| `gemini-embedding-001` | Text เท่านั้น | 2,048 | 768, 1,536, 3,072 |

**แนะนำ:** ใช้ `gemini-embedding-2` — เป็น multimodal embedding model (โมเดล embedding ที่รับข้อมูลหลายรูปแบบ) รุ่นแรกของ Google

---

### สร้าง Text Embedding

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# สร้าง embedding จากข้อความ
result = client.models.embed_content(
    model="gemini-embedding-2",
    contents="Gemini คือ AI ที่ทรงพลังของ Google",
    config={
        "output_dimensionality": 768  # เลือก: 128, 256, 512, 768, 1536, 3072
    }
)

vector = result.embeddings[0].values
print(f"Vector length: {len(vector)}")    # 768
print(f"First 5 values: {vector[:5]}")    # [-0.02, 0.13, ...]
```

### สร้าง Embedding หลายชิ้นพร้อมกัน

```python
texts = [
    "สภาพอากาศวันนี้ดีมาก",
    "อากาศแจ่มใส ไม่มีฝน",
    "ราคาหุ้นพุ่งสูง",
    "ตลาดหุ้นปรับตัวขึ้น"
]

results = client.models.embed_content(
    model="gemini-embedding-2",
    contents=texts
)

vectors = [e.values for e in results.embeddings]
```

---

### Semantic Search ด้วย Embedding (RAG)

**RAG - Retrieval Augmented Generation** (การดึงข้อมูลมาเสริมก่อนตอบ — AI ค้นหาข้อมูลจากแหล่งที่กำหนดก่อนแล้วค่อยตอบ) คือการใช้ embedding ค้นหาเนื้อหาที่เกี่ยวข้อง แล้วส่งให้ Gemini ตอบ:

```python
import numpy as np
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

def cosine_similarity(v1, v2):
    """วัดความคล้ายของ vector สองชุด (0-1 โดย 1 = เหมือนกันมากที่สุด)"""
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# 1. สร้าง knowledge base (ฐานความรู้)
documents = [
    "Gemini เป็น AI model ที่พัฒนาโดย Google",
    "Python เป็นภาษาโปรแกรมยอดนิยมสำหรับ AI",
    "กรุงเทพมหานครเป็นเมืองหลวงของประเทศไทย",
    "การเรียนรู้ของเครื่องคือสาขาหนึ่งของ AI",
]

# 2. สร้าง embedding สำหรับ documents
doc_embeddings = client.models.embed_content(
    model="gemini-embedding-2",
    contents=documents
).embeddings

# 3. รับคำถามจากผู้ใช้
query = "บริษัทไหนสร้าง Gemini?"

# 4. สร้าง embedding ของ query (คำค้นหา)
query_embedding = client.models.embed_content(
    model="gemini-embedding-2",
    contents=query
).embeddings[0].values

# 5. ค้นหา document ที่ใกล้เคียงที่สุด
similarities = [
    cosine_similarity(query_embedding, doc_emb.values)
    for doc_emb in doc_embeddings
]

top_indices = np.argsort(similarities)[-3:][::-1]  # Top 3
relevant_docs = [documents[i] for i in top_indices]

# 6. ส่งให้ Gemini ตอบ
context = "\n".join(relevant_docs)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"Context:\n{context}\n\nคำถาม: {query}"
)

print(response.text)
```

### Vector Database (ฐานข้อมูลเวกเตอร์ — เก็บและค้นหา embedding ขนาดใหญ่) ที่แนะนำ

สำหรับ production (ระบบจริง) ควรใช้ vector database:

| Database | เหมาะกับ |
|---|---|
| **Pinecone** | Cloud (คลาวด์), scalable (ขยายได้), ง่าย |
| **Weaviate** | Open-source (โอเพนซอร์ส), multimodal (หลายรูปแบบ) |
| **BigQuery Vector** | Google Cloud ecosystem |
| **Vertex AI Matching Engine** | Google Cloud, production-grade |
| **ChromaDB** | Local development (พัฒนาในเครื่อง) |
| **pgvector** | PostgreSQL extension (ส่วนขยาย) |

---

## ส่วนที่ 2: Long Context

### Long Context คืออะไร?

Long Context (บริบทขนาดยาว) หมายถึง Gemini รองรับ context window (หน้าต่างบริบท — ปริมาณข้อมูลที่ AI รับได้ต่อครั้ง) **1-2 ล้าน token** (ชิ้นส่วนข้อความ) ซึ่งมากกว่าโมเดลอื่นอย่างมาก:

| ขนาด | เทียบเท่า |
|---|---|
| 1 ล้าน token | หนังสือ ~8 เล่ม หรือโค้ด ~50,000 บรรทัด |
| 2 ล้าน token | หนังสือ ~16 เล่ม หรือวิดีโอ 2 ชั่วโมง |

### Long Context vs RAG (Embedding)

| | Long Context | RAG (Embedding) |
|---|---|---|
| วิธีใช้ | ส่งทุกอย่างในครั้งเดียว | ค้นหาแล้วส่งเฉพาะส่วน |
| ต้นทุน | สูงกว่า | ต่ำกว่า |
| ความแม่นยำ | ดีกว่าสำหรับ multi-hop (คำถามที่ต้องเชื่อมข้อมูลหลายจุด) | ดีกว่าสำหรับข้อมูลมาก |
| ตั้งค่า | ง่ายมาก | ซับซ้อนกว่า |
| เหมาะกับ | เอกสารเดียวขนาดใหญ่ | Knowledge base หลายร้อยเอกสาร |

---

### การใช้ Long Context

```python
# อ่านไฟล์ขนาดใหญ่
with open("legal_contract_500pages.pdf", "rb") as f:
    pdf_content = f.read()

response = client.models.generate_content(
    model="gemini-2.5-pro",  # รองรับ 2M tokens
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
                    "text": "สรุปประเด็นสำคัญของสัญญา และระบุข้อกำหนดที่อาจเป็นความเสี่ยง"
                }
            ]
        }
    ]
)
```

### กรณีการใช้งานที่เหมาะกับ Long Context

**1. วิเคราะห์ Codebase (ชุดโค้ดทั้งหมด) ทั้งหมด**
```python
# ส่งโค้ดทั้ง repository (คลังโค้ด)
contents = []
for filename in code_files:
    contents.append(f"// File: {filename}\n{read_file(filename)}\n\n")

response = gemini.ask(
    "\n".join(contents) + "\nช่วย review โค้ดและหา bug ที่อาจเกิดขึ้น"
)
```

**2. วิเคราะห์วิดีโอยาว**
```python
# วิเคราะห์วิดีโอ 2 ชั่วโมง
response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents=[video_file, "สรุปประเด็นสำคัญทุก 10 นาที"]
)
```

**3. Many-shot Learning (การเรียนรู้จากตัวอย่างจำนวนมาก)**
```python
# ใส่ตัวอย่างหลายร้อยชุดก่อน prompt จริง
examples = [f"Input: {x}\nOutput: {y}\n" for x, y in training_examples[:200]]
prompt = "".join(examples) + f"\nInput: {new_input}\nOutput:"
```

---

### Best Practices สำหรับ Long Context

**1. วาง query (คำถาม) ไว้ท้าย**
```python
# ดี: context ก่อน, คำถามหลัง
contents = f"{long_document}\n\nคำถาม: {query}"

# แย่กว่า: คำถามก่อน context
contents = f"คำถาม: {query}\n\n{long_document}"
```

**2. ใช้ Context Caching (การเก็บบริบทชั่วคราว) เมื่อถามซ้ำ**
```python
# ถ้าจะถามหลายคำถามจากเอกสารเดียวกัน
# → cache เอกสารก่อน แล้วส่ง query ต่างๆ
cache = create_cache(long_document)
for question in questions:
    response = ask_with_cache(cache, question)
```

**3. Count tokens (นับจำนวน token) ก่อนส่ง**
```python
# ตรวจสอบว่าไม่เกิน context window
token_count = client.models.count_tokens(
    model="gemini-2.5-flash",
    contents=your_contents
)
print(f"Total tokens: {token_count.total_tokens}")
# Gemini 2.5 Flash รองรับ ~1M tokens
```
