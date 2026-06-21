---
title: "Batch API — high-volume processing 50% cheaper"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Use the Message Batches API to send many requests asynchronously at 50% lower cost, good for evaluation, content generation, and large-scale data processing"
readTime: "8 min"
readers: "0"
locked: false
order: 15
---

## What is the Batch API?

The **Message Batches API** (an API for sending requests as a batch) is a way to send thousands of requests at once **asynchronously** (not waiting for results one at a time, but sending them all then receiving the results later), with a **50% discount** on both input and output tokens (chunks of text).

Instead of sending 1,000 requests one at a time (and waiting for each result), you can send them all at once, wait an hour or less, then pull all the results together.

---

## What kind of work is it good for?

### Use the Batch API when:
- **You don't need a real-time response**, e.g. overnight processing
- **High volume** — classification, extraction of thousands/tens of thousands of items
- **Cost-sensitive** — work needing maximum cost savings
- **Evaluation/Testing** — run a large test suite
- **Content generation** — generate large amounts of content in advance

### Not good for:
- Chatbots / interactive applications
- Work needing a response within 10 seconds
- Sequential tasks that depend on each other (step 1's result is needed in step 2)

---

## Batch API pricing

| Model | Standard Input | **Batch Input** | Standard Output | **Batch Output** |
|-------|---------------|----------------|-----------------|-----------------|
| Opus 4.8 | $5/MTok | **$2.50/MTok** | $25/MTok | **$12.50/MTok** |
| Sonnet 4.6 | $3/MTok | **$1.50/MTok** | $15/MTok | **$7.50/MTok** |
| Haiku 4.5 | $1/MTok | **$0.50/MTok** | $5/MTok | **$2.50/MTok** |

---

## How to use it

### Step 1: Create a Batch

Send many requests at once, each with a unique `custom_id` (an ID you define to identify each item):

```python
import anthropic

client = anthropic.Anthropic()

# Prepare batch requests
requests = [
    {
        "custom_id": "review-001",
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [
                {
                    "role": "user",
                    "content": "Classify the sentiment: 'The food is delicious, I really love it!' Answer only positive/negative/neutral"
                }
            ]
        }
    },
    {
        "custom_id": "review-002",
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [
                {
                    "role": "user",
                    "content": "Classify the sentiment: 'Waited so long, terrible service' Answer only positive/negative/neutral"
                }
            ]
        }
    },
    {
        "custom_id": "review-003",
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 100,
            "messages": [
                {
                    "role": "user",
                    "content": "Classify the sentiment: 'Price is okay, product is okay' Answer only positive/negative/neutral"
                }
            ]
        }
    }
]

# Submit the batch
batch = client.messages.batches.create(requests=requests)
print(f"Batch ID: {batch.id}")
print(f"Status: {batch.processing_status}")
```

### Step 2: Check the Status

```python
import time

# Poll (ask repeatedly) until done
while True:
    batch = client.messages.batches.retrieve(batch.id)
    
    print(f"Status: {batch.processing_status}")
    print(f"Completed: {batch.request_counts.succeeded}")
    print(f"Failed: {batch.request_counts.errored}")
    
    if batch.processing_status == "ended":
        break
    
    time.sleep(60)  # wait 1 minute before asking again
```

### Step 3: Fetch the results

```python
# Fetch all results
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        custom_id = result.custom_id
        message = result.result.message
        text = message.content[0].text
        print(f"{custom_id}: {text}")
    
    elif result.result.type == "errored":
        print(f"{result.custom_id}: ERROR - {result.result.error}")
```

### Expected results:
```
review-001: positive
review-002: negative
review-003: neutral
```

---

## A real example: processing a large CSV

```python
import anthropic
import csv
import json
import time

client = anthropic.Anthropic()

def process_reviews_batch(csv_file: str) -> dict:
    """
    Take a CSV file (a tabular data file format — each cell separated by a comma) with 'id' and 'review' columns
    Send them for batch sentiment analysis
    Return a dict of results {id: sentiment}
    """
    
    # Read the CSV
    requests = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            requests.append({
                "custom_id": row['id'],
                "params": {
                    "model": "claude-haiku-4-5",
                    "max_tokens": 50,
                    "messages": [
                        {
                            "role": "user",
                            "content": f"Sentiment (positive/negative/neutral): {row['review']}"
                        }
                    ]
                }
            })
    
    print(f"Submitting {len(requests)} requests...")
    batch = client.messages.batches.create(requests=requests)
    print(f"Batch created: {batch.id}")
    
    # Wait for results
    while True:
        batch = client.messages.batches.retrieve(batch.id)
        progress = batch.request_counts.succeeded + batch.request_counts.errored
        print(f"Progress: {progress}/{len(requests)}")
        
        if batch.processing_status == "ended":
            break
        time.sleep(30)
    
    # Collect results
    results = {}
    for result in client.messages.batches.results(batch.id):
        if result.result.type == "succeeded":
            sentiment = result.result.message.content[0].text.strip().lower()
            results[result.custom_id] = sentiment
        else:
            results[result.custom_id] = "error"
    
    return results
```

---

## Limitations and Limits

| Limit | Value |
|---------|-----|
| Max requests per batch | 100,000 requests |
| Max batch file size | 256 MB |
| Processing time | Mostly < 1 hour |
| Results kept | 29 days |

---

## Batch Status

| Status | Meaning |
|--------|---------|
| `in_progress` | Processing |
| `ended` | Done (some requests may have errored) |
| `canceling` | Canceling |
| `canceled` | Canceled |

### Request Counts

```python
batch = client.messages.batches.retrieve(batch_id)
counts = batch.request_counts
print(f"Processing: {counts.processing}")
print(f"Succeeded: {counts.succeeded}")
print(f"Errored: {counts.errored}")
print(f"Canceled: {counts.canceled}")
print(f"Expired: {counts.expired}")
```

---

## Result Types

Each result in a batch has a type as follows:

| Result Type | Meaning |
|------------|---------|
| `succeeded` | Succeeded, has a `message` object |
| `errored` | An error occurred, has an `error` object |
| `canceled` | Was canceled |
| `expired` | Timed out (over 29 days) |

---

## Extended Output for Batch

For Claude Opus and Sonnet 4.6, output up to 300k tokens per request is supported:

```python
requests = [
    {
        "custom_id": "long-doc-001",
        "params": {
            "model": "claude-opus-4-8",
            "max_tokens": 300000,  # 300k tokens!
            "messages": [{"role": "user", "content": "Write a long report..."}]
        }
    }
]

batch = client.messages.batches.create(
    requests=requests,
    # You must add the beta header (the header indicating a test feature) for extended output
    betas=["output-300k-2026-03-24"]
)
```

---

## Canceling a Batch

```python
# Cancel a batch that's still processing
batch = client.messages.batches.cancel(batch_id)
print(f"Status: {batch.processing_status}")
```

---

## Listing Batches

```python
# View all batches
batches = client.messages.batches.list()
for batch in batches.data:
    print(f"{batch.id}: {batch.processing_status} ({batch.request_counts.succeeded} succeeded)")
```

---

## Best Practices

### 1. Use meaningful Custom IDs

```python
# Bad
"custom_id": "req_1234"

# Good
"custom_id": "user-123-review-2025-06-10-001"
```

### 2. Handle Errors

Not every request will succeed; you must handle failed cases:

```python
for result in client.messages.batches.results(batch_id):
    if result.result.type == "errored":
        # Log and retry if needed
        failed_requests.append(result.custom_id)
```

### 3. Split a large Batch

If you have more than 100,000 requests, split them into several batches.

### 4. Download results within 29 days

Results are deleted after 29 days; download and store them yourself first.

### 5. Use Haiku for Simple work

For simple classification or extraction, use Haiku for the biggest savings.

---

## Comparing Standard vs Batch

| Aspect | Standard API | Batch API |
|------|-------------|----------|
| Response time | Real-time (instant) | 1 hour+ |
| Price | 100% | 50% |
| Max concurrent | Rate limited | 100k requests |
| Good for | Interactive | Bulk processing |
| Complexity | Easy | Moderate |

---

## Summary

The Batch API is good for:

1. **Sentiment analysis** of large volumes of reviews/opinions
2. **Data extraction** from thousands of documents
3. **Translation** of large amounts of content
4. **Evaluation/Testing** of prompts or models
5. **Content generation** prepared in advance

With 50% savings, the Batch API is the most cost-effective way for large-scale AI work that doesn't need a real-time response.
