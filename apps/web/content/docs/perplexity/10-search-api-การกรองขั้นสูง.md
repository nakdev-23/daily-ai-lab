---
title: "Search API — การกรองขั้นสูง"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "การกรองผลการค้นหาขั้นสูงด้วยวันที่ โดเมน ภาษา และภูมิภาค เพื่อผลลัพธ์ที่แม่นยำและตรงเป้าหมาย"
readTime: "6 นาที"
readers: "0"
locked: false
order: 10
---

# Search API — การกรองขั้นสูง

Search API มีตัวเลือกการกรองที่หลากหลาย ช่วยให้นักพัฒนาควบคุมผลการค้นหาได้อย่างละเอียด บทนี้อธิบายทุก Filter (ตัวกรอง) ที่มีพร้อมตัวอย่างการใช้งานจริง

---

## Date / Time Filters (กรองตามวันที่)

### Recency Filter — กรองตามความสดใหม่

**Recency Filter** (ตัวกรองความสดใหม่ — จำกัดผลลัพธ์ให้เป็นเนื้อหาที่เผยแพร่ในช่วงเวลาที่กำหนด):

```python
results = client.search.create(
    query="AI news Thailand",
    recency_filter="week"  # hour / day / week / month / year
)
```

| ค่า | ความหมาย |
|---|---|
| `hour` | ชั่วโมงที่ผ่านมา |
| `day` | วันที่ผ่านมา |
| `week` | สัปดาห์ที่ผ่านมา |
| `month` | เดือนที่ผ่านมา |
| `year` | ปีที่ผ่านมา |

### Date Range Filter — กรองตามช่วงวันที่เจาะจง

```python
results = client.search.create(
    query="Thailand GDP economic growth",
    date_range_start="01/01/2025",  # วันเริ่มต้น MM/DD/YYYY
    date_range_end="12/31/2025"     # วันสิ้นสุด MM/DD/YYYY
)
```

> **หมายเหตุ:** ใช้รูปแบบ MM/DD/YYYY (เดือน/วัน/ปี แบบอเมริกัน) เท่านั้น

---

## Domain Filters (กรองตามโดเมน)

### Allowlist Mode — อนุญาตเฉพาะโดเมนที่ระบุ

```python
# ค้นหาเฉพาะในสื่อไทยที่น่าเชื่อถือ
results = client.search.create(
    query="ข่าวเศรษฐกิจไทย",
    search_domain_filter=[
        "thairath.co.th",
        "bangkokpost.com",
        "nationthailand.com",
        "bot.or.th",              # ธนาคารแห่งประเทศไทย
        "nesdc.go.th"             # สภาพัฒน์
    ]
)
```

### Denylist Mode — บล็อกโดเมนที่ไม่ต้องการ

```python
# บล็อกเว็บที่ไม่น่าเชื่อถือ
results = client.search.create(
    query="Thailand investment opportunities",
    search_domain_filter=[
        "-reddit.com",    # บล็อก Reddit (ใส่ - นำหน้า)
        "-quora.com",     # บล็อก Quora
        "-pinterest.com"  # บล็อก Pinterest
    ]
)
```

### Mixed Mode — ผสม Allowlist และ Denylist

```python
# อนุญาตโดเมนหลักและบล็อกส่วนย่อย
results = client.search.create(
    query="python tutorial",
    search_domain_filter=[
        "docs.python.org",    # อนุญาต
        "stackoverflow.com",  # อนุญาต
        "-stackoverflow.com/questions/tagged/jquery"  # บล็อก tag เฉพาะ
    ]
)
```

**ข้อจำกัด:** สูงสุด 20 โดเมนต่อ Request

---

## Language Filters (กรองตามภาษา)

```python
# ค้นหาเฉพาะบทความภาษาไทยและอังกฤษ
results = client.search.create(
    query="วิทยาศาสตร์และเทคโนโลยี",
    search_language_filter=["th", "en"]  # รหัสภาษา ISO 639-1
)
```

**รหัสภาษาที่ใช้บ่อย:**

| รหัส | ภาษา |
|---|---|
| `th` | ไทย |
| `en` | อังกฤษ |
| `zh` | จีน |
| `ja` | ญี่ปุ่น |
| `ko` | เกาหลี |
| `fr` | ฝรั่งเศส |
| `de` | เยอรมัน |
| `es` | สเปน |

**ข้อจำกัด:** สูงสุด 10 ภาษาต่อ Request

---

## Country / Region Filters (กรองตามประเทศ)

```python
# ผลลัพธ์เกี่ยวข้องกับประเทศไทย
results = client.search.create(
    query="business news",
    country="TH"  # ISO 3166-1 alpha-2 country code
)
```

**รหัสประเทศที่ใช้บ่อยในเอเชีย:**

| รหัส | ประเทศ |
|---|---|
| `TH` | ไทย |
| `SG` | สิงคโปร์ |
| `MY` | มาเลเซีย |
| `ID` | อินโดนีเซีย |
| `VN` | เวียดนาม |
| `JP` | ญี่ปุ่น |
| `KR` | เกาหลีใต้ |
| `CN` | จีน |
| `US` | สหรัฐอเมริกา |
| `GB` | สหราชอาณาจักร |

---

## ใช้ Filter หลายตัวพร้อมกัน

```python
# ตัวอย่างจริง: ค้นหาข่าวธุรกิจไทยจากสื่อน่าเชื่อถือในสัปดาห์นี้
results = client.search.create(
    query="startup funding Thailand Series A",
    country="TH",
    search_language_filter=["th", "en"],
    search_domain_filter=[
        "techsauce.co",
        "krasia.com",
        "techinasia.com",
        "bangkokpost.com"
    ],
    recency_filter="week",
    num_results=10
)

print(f"พบ {len(results.results)} ผลลัพธ์")
for r in results.results:
    print(f"\n{r.title}")
    print(f"URL: {r.url}")
    print(f"วันที่: {r.date}")
    print(f"สรุป: {r.snippet[:200]}...")
```

---

## People Search — ค้นหาข้อมูลบุคคล

**People Search** (การค้นหาบุคคล — ค้นหาโปรไฟล์สาธารณะของบุคคลเช่น LinkedIn, บทความ, ประวัติสาธารณะ):

> People Search มีทั้งใน Search API และเป็น Tool ใน Agent API

```python
# ใน Agent API
response = client.agent.create(
    model="openai/gpt-5.1",
    tools=[{"type": "people_search"}],  # เปิด Tool ค้นหาบุคคล
    input="หาข้อมูลสาธารณะของ [ชื่อบุคคล] CEO [ชื่อบริษัท]"
)
```

> **ข้อควรระวังด้านความเป็นส่วนตัว:** People Search ดึงข้อมูลสาธารณะเท่านั้น ไม่ควรใช้เพื่อเก็บข้อมูลส่วนตัวที่บุคคลไม่ได้เปิดเผย

---

## การวิเคราะห์ผลลัพธ์

### ตรวจสอบคุณภาพผลลัพธ์

```python
results = client.search.create(
    query="AI regulation 2026",
    num_results=20
)

# แยกผลลัพธ์ตามปีที่เผยแพร่
current_year = 2026
recent = [r for r in results.results if r.date and "2026" in r.date]
older = [r for r in results.results if r.date and "2026" not in r.date]

print(f"ผลลัพธ์ปี 2026: {len(recent)} รายการ")
print(f"ผลลัพธ์เก่ากว่า: {len(older)} รายการ")
```

---

## สรุปตัวกรองทั้งหมด

| Filter | Parameter | ตัวอย่างค่า |
|---|---|---|
| ความสดใหม่ | `recency_filter` | `"week"`, `"month"` |
| ช่วงวันที่ | `date_range_start/end` | `"01/01/2026"` |
| โดเมน | `search_domain_filter` | `["site.com", "-blocked.com"]` |
| ภาษา | `search_language_filter` | `["th", "en"]` |
| ประเทศ | `country` | `"TH"`, `"US"` |
| จำนวนผล | `num_results` | `1-20` |
| ขนาด Content | `search_context_size` | `"low"`, `"medium"`, `"high"` |

การรวม Filter หลายตัวจะช่วยให้ผลลัพธ์แม่นยำและตรงเป้าหมายมากขึ้น ลดเวลาในการกรองข้อมูลหลังจากได้รับผลลัพธ์
