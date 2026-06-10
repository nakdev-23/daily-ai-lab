---
title: "Embeddings API — แปลงข้อความเป็น Vector"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "Embeddings API แปลงข้อความเป็นตัวเลข Vector สำหรับระบบค้นหาความหมาย RAG Pipeline และ Machine Learning"
readTime: "8 นาที"
readers: "0"
locked: false
order: 11
---

# Embeddings API — แปลงข้อความเป็น Vector

**Embeddings API** (API สร้าง Embedding — บริการแปลงข้อความเป็นตัวเลขที่แทนความหมาย) คือเครื่องมือสำหรับนักพัฒนาที่ต้องการสร้างระบบค้นหาความหมาย (Semantic Search) หรือ RAG Pipeline (ระบบดึงข้อมูลจากฐานความรู้ประกอบกับ AI)

---

## Embedding คืออะไร?

**Embedding** (เวกเตอร์ความหมาย) คือการแปลงข้อความให้เป็นตัวเลขหลายมิติ เช่น ข้อความ "หมาน่ารัก" และ "สุนัขน่ารัก" จะได้ Embedding ที่ใกล้เคียงกันมาก แม้ใช้คำต่างกัน เพราะมีความหมายเดียวกัน

**ประโยชน์:**
- ค้นหาเอกสารด้วย "ความหมาย" ไม่ใช่แค่ "คำที่ตรงกัน"
- สร้าง RAG (Retrieval-Augmented Generation — การสร้างข้อความโดยดึงข้อมูลจากฐานความรู้ของเรา) เพื่อให้ AI ตอบจากเอกสารของเรา
- จัดกลุ่มเอกสารตามความหมาย (Clustering)
- ตรวจสอบความคล้ายคลึงของข้อความ (Similarity)

---

## โมเดลที่รองรับ

Perplexity มีโมเดล Embedding 4 แบบ แบ่งเป็น 2 ประเภท:

### Standard Embeddings (Embedding มาตรฐาน)
เหมาะสำหรับข้อความที่แยกกันอยู่ เช่น คำถามหรือเอกสารแยกชิ้น

| โมเดล | Dimensions (มิติ) | Context Window | ราคา |
|---|---|---|---|
| `pplx-embed-v1-0.6b` | 1,024 มิติ | 32K tokens | $0.004/1M tokens |
| `pplx-embed-v1-4b` | 2,560 มิติ | 32K tokens | $0.03/1M tokens |

### Contextualized Embeddings (Embedding แบบมีบริบท)
เหมาะสำหรับข้อความที่อยู่ในเอกสารเดียวกัน เช่น ย่อหน้าหลายย่อหน้าในบทความ

| โมเดล | Dimensions | Context Window | ราคา |
|---|---|---|---|
| `pplx-embed-context-v1-0.6b` | 1,024 มิติ | 32K tokens | $0.008/1M tokens |
| `pplx-embed-context-v1-4b` | 2,560 มิติ | 32K tokens | $0.05/1M tokens |

**เลือก 0.6b หรือ 4b?**
- **0.6b** — เร็วกว่า ราคาถูกกว่า เหมาะกับระบบขนาดใหญ่ที่เน้นความเร็ว
- **4b** — คุณภาพสูงกว่า มิติมากกว่า เหมาะกับงานที่ต้องการความแม่นยำสูง

---

## Endpoint

```
POST https://api.perplexity.ai/v1/embeddings
```

---

## ตัวอย่างการใช้งาน

### Python — สร้าง Embedding พื้นฐาน
```python
from perplexityai import Perplexity

client = Perplexity()

# สร้าง Embedding สำหรับข้อความเดี่ยว
response = client.embeddings.create(
    model="pplx-embed-v1-0.6b",
    input="Perplexity AI คืออะไร"
)

embedding_vector = response.data[0].embedding  # รับ Vector กลับมา
print(f"จำนวนมิติ: {len(embedding_vector)}")  # 1024
```

### Python — สร้าง Embedding หลายข้อความพร้อมกัน
```python
# Batch Embeddings (ประมวลผลหลายข้อความในครั้งเดียว)
texts = [
    "วิธีเรียน Python สำหรับผู้เริ่มต้น",
    "Python tutorial for beginners",
    "เทคนิคการทำอาหารไทย",
    "แผนที่ท่องเที่ยวเชียงใหม่"
]

response = client.embeddings.create(
    model="pplx-embed-v1-0.6b",
    input=texts  # ส่งทีเดียวได้สูงสุด 512 ข้อความ
)

# ดู Embedding ของแต่ละข้อความ
for i, item in enumerate(response.data):
    print(f"ข้อความ {i+1}: {len(item.embedding)} มิติ")
```

### Contextualized Embeddings — สำหรับย่อหน้าในเอกสาร
```python
document_paragraphs = [
    "บทที่ 1: ประวัติของ AI เริ่มต้นในปี 1950...",
    "ในปี 1956 John McCarthy บัญญัติคำว่า Artificial Intelligence...",
    "ช่วงปี 1970-1980 เรียกว่า AI Winter เพราะขาดเงินทุนวิจัย...",
    "Deep Learning ฟื้นฟู AI ขึ้นมาอีกครั้งในปี 2012..."
]

# ใช้ Contextualized Model สำหรับย่อหน้าที่เชื่อมโยงกัน
response = client.embeddings.create(
    model="pplx-embed-context-v1-0.6b",  # โมเดล Contextualized
    input=document_paragraphs
)
```

---

## การคำนวณ Similarity (ความคล้ายคลึง)

**สำคัญมาก:** Embeddings ของ Perplexity เป็น **Unnormalized** (ยังไม่ถูก Normalize — ค่ายังไม่ถูกปรับให้อยู่ในระดับเดียวกัน) ต้องใช้ **Cosine Similarity** สำหรับการเปรียบเทียบ

```python
import numpy as np
from perplexityai import Perplexity

client = Perplexity()

def get_embedding(text, model="pplx-embed-v1-0.6b"):
    response = client.embeddings.create(model=model, input=[text])
    return np.array(response.data[0].embedding)

def cosine_similarity(v1, v2):
    """Cosine Similarity — วัดมุมระหว่างสองเวกเตอร์ (0 = ต่างกันมาก, 1 = เหมือนกัน)"""
    dot_product = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)  # ขนาดของ Vector 1
    norm2 = np.linalg.norm(v2)  # ขนาดของ Vector 2
    return dot_product / (norm1 * norm2)

# ทดสอบความคล้ายคลึง
query = get_embedding("วิธีเรียน Python")
doc1 = get_embedding("สอน Python เบื้องต้น")  # ความหมายใกล้เคียง
doc2 = get_embedding("วิธีปลูกต้นไม้")           # ความหมายต่างกัน

print(f"ความคล้ายกับ doc1: {cosine_similarity(query, doc1):.4f}")  # สูง ~0.9
print(f"ความคล้ายกับ doc2: {cosine_similarity(query, doc2):.4f}")  # ต่ำ ~0.2
```

---

## การสร้าง RAG System ด้วย Embeddings

**RAG** (Retrieval-Augmented Generation — การดึงข้อมูลจากฐานความรู้ก่อนให้ AI ตอบ) ช่วยให้ AI ตอบจากเอกสารของเรา ไม่ใช่จากความรู้ของ AI ล้วนๆ:

```python
import numpy as np
from perplexityai import Perplexity

client = Perplexity()

# ขั้นตอนที่ 1: สร้าง Embeddings สำหรับฐานความรู้
knowledge_base = [
    "ราคา Product A คือ 500 บาท มีประกัน 1 ปี",
    "Product B เหมาะสำหรับผู้ใช้ที่ต้องการความเร็วสูง ราคา 1,200 บาท",
    "นโยบายคืนสินค้าภายใน 30 วัน ไม่มีค่าใช้จ่าย",
    "ติดต่อ Support ได้ทุกวัน 09:00-18:00 น."
]

# สร้าง Embedding ทีละชิ้น (หรือทำเป็น Batch)
kb_embeddings = []
response = client.embeddings.create(
    model="pplx-embed-v1-0.6b",
    input=knowledge_base
)
kb_embeddings = [item.embedding for item in response.data]
kb_matrix = np.array(kb_embeddings)

def find_relevant_docs(question, top_k=2):
    """ค้นหาเอกสารที่เกี่ยวข้องกับคำถาม"""
    q_response = client.embeddings.create(
        model="pplx-embed-v1-0.6b",
        input=[question]
    )
    q_embedding = np.array(q_response.data[0].embedding)
    
    # คำนวณ Cosine Similarity กับทุกเอกสาร
    norms = np.linalg.norm(kb_matrix, axis=1) * np.linalg.norm(q_embedding)
    similarities = np.dot(kb_matrix, q_embedding) / norms
    
    # เลือก Top K เอกสารที่คล้ายที่สุด
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [knowledge_base[i] for i in top_indices]

# ขั้นตอนที่ 2: ใช้ Agent API ตอบโดยอ้างอิงเอกสาร
def rag_answer(question):
    relevant_docs = find_relevant_docs(question)
    context = "\n".join(relevant_docs)
    
    response = client.agent.create(
        model="openai/gpt-5.1-mini",
        instructions=f"ตอบคำถามโดยใช้ข้อมูลต่อไปนี้เท่านั้น:\n{context}",
        input=question
    )
    return response.output_text

print(rag_answer("สินค้าราคาเท่าไหร่?"))
```

---

## Best Practices สำหรับ Embeddings

1. **Batch สูงสุด 512 ข้อความ** ต่อ Request เพื่อลดจำนวน API calls
2. **Cache Embeddings** ที่คำนวณแล้วไว้ใน Database อย่าคำนวณซ้ำ
3. **ใช้โมเดลเดียวกันตลอด** — อย่าผสมโมเดล pplx-embed-v1-0.6b กับ 4b ในระบบเดียวกัน
4. **ใช้ Cosine Similarity เสมอ** สำหรับ int8 encoding (ค่าเริ่มต้น)
5. **Matryoshka Reduction** — ถ้าต้องการประหยัด Storage สามารถลดมิติจาก 2560 เหลือ 512 ได้โดยคุณภาพลดลงเล็กน้อย

---

## สรุป

Embeddings API เหมาะสำหรับ:
- สร้าง Semantic Search (ค้นหาด้วยความหมาย)
- RAG Pipeline สำหรับ Chatbot ที่ตอบจากเอกสารของคุณ
- จัดกลุ่มเอกสารอัตโนมัติ
- ตรวจสอบเนื้อหา Duplicate (ซ้ำกัน)
- Recommendation System (ระบบแนะนำ)

ราคาเริ่มต้นเพียง $0.004 ต่อ 1 ล้าน Token ถือว่าคุ้มค่ามากสำหรับการสร้างระบบ RAG
