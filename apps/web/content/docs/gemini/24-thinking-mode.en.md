---
title: "Thinking Mode — a deep-thinking mode for complex problems"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Thinking Mode has Gemini think through a problem step by step before answering, good for math, coding, logical analysis, and work needing high accuracy"
readTime: "8 min"
readers: "0"
locked: false
order: 24
---

# Thinking Mode — a deep-thinking mode for complex problems

**Thinking Mode** (a deep-thinking mode — the AI spends time reviewing the problem before answering) is the process where Gemini "thinks before answering" by building internal reasoning before showing the final answer, like a student working hard on scratch paper before writing a clean answer on the exam sheet.

---

## What is Thinking Mode?

When Thinking Mode is on, the model will:
1. **Analyze the problem** — break it into sub-parts
2. **Think step by step** — internal chain-of-thought reasoning (thinking continuously in steps)
3. **Check itself** — go back to verify correctness
4. **Conclude the answer** — show the carefully thought-through result

API users can view a "thought summary."

---

## When should you use Thinking Mode?

### Use Thinking when:
- **Math and statistics** — complex equations, probability, calculus
- **Coding** — debugging, algorithm design, code review
- **Logical analysis** — logic problems, strategy games
- **Multi-step planning** — project planning, decision trees
- **Reading laws/contracts** — interpreting complex documents
- **Science** — experiment design, result analysis

### You don't need Thinking when:
- Asking general facts ("What's the capital of Thailand?")
- Translation work
- Summarizing short text
- Questions with a clear answer

---

## Models that support Thinking

| Model | Supports Thinking | Note |
|---|---|---|
| `gemini-2.5-pro` | ✓ Full | Best Thinking |
| `gemini-2.5-flash` | ✓ Full | Well-balanced |
| `gemini-2.5-flash-lite` | ✓ Limited | Low thinking budget |

---

## Using Thinking in Gemini (no API)

### In gemini.google.com
1. Open Gemini and type a prompt
2. Click the ⚡ icon or choose **"Deep Think"** before sending
3. Notice that Gemini shows "Thinking..." before answering
4. The answer is more accurate and detailed than usual

### In Gemini Advanced
- Choose **Gemini 2.5 Pro with Deep Think** from the model menu
- Good for the hardest problems

---

## Using Thinking through the API

### Turn on Thinking with thinkingBudget for Gemini 2.5

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Prove that √2 is irrational",
    config={
        "thinking_config": {
            "thinking_budget": 8192  # number of thinking tokens (pieces of thought, 0-24576)
        }
    }
)

print(response.text)
```

### View the Thought Summary

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Solve the equation: 3x² + 5x - 2 = 0",
    config={
        "thinking_config": {
            "thinking_budget": 4096,
            "include_thoughts": True  # enable viewing the thought summary
        }
    }
)

# Separate thoughts and the answer
for part in response.candidates[0].content.parts:
    if hasattr(part, 'thought') and part.thought:
        print("--- Thinking process ---")
        print(part.text)
    else:
        print("--- Answer ---")
        print(part.text)
```

### Turn off Thinking (for easy work)

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Translate this sentence into English: สวัสดีครับ",
    config={
        "thinking_config": {
            "thinking_budget": 0  # turn off thinking to reduce latency and cost
        }
    }
)
```

---

## thinkingBudget — set the depth of thinking

| Budget | Good for | Latency | Cost |
|---|---|---|---|
| 0 | Easy work, fast answer | Low | Low |
| 1,024-4,096 | Medium work | Medium | Medium |
| 8,192-16,384 | Hard work | High | High |
| 24,576 (max) | The hardest work | Very high | Very high |
| -1 (dynamic — adjusts automatically) | Let the model choose | As needed | As needed |

> **Recommended:** Use `-1` (dynamic) to let the model adjust the budget automatically by the problem's complexity.

---

## Example results: with and without Thinking

**Question:** "If you have 3 coin types (1, 5, 10 baht) and must pay 23 baht using the fewest coins, which coins should you use?"

**Without Thinking:**
"Use 10-baht coins x2 and 1-baht x3 = 5 coins"

**With Thinking (correct):**
```
[Thinking]:
- 23 baht
- 10 + 10 = 20, 3 baht left
- 3 baht = 1 + 1 + 1 = 3 coins
- Total: 2+3 = 5 coins
- Try: 10 + 5 + 5 + 1 + 1 + 1 = 6 coins (not better)
- Try: 10 + 10 + 1 + 1 + 1 = 5 coins
- ✓ Answer: 5 coins

[Answer]:
You should use:
- 10-baht coin x 2 = 20 baht
- 1-baht coin x 3 = 3 baht
Totaling 5 coins, which is the fewest.
```

---

## Thinking Token pricing

Thinking tokens (internal pieces of thought) are priced like normal output tokens, but:
- Users only see the **thought summary** (shorter than the actual thinking)
- Billing counts all the thinking tokens, not just the summary
- Use `response.usage_metadata.thoughts_token_count` to see the count

---

## Deep Think in the Gemini App vs API

| | Gemini App (Deep Think) | API (thinkingBudget) |
|---|---|---|
| Control the budget | No | ✓ Can set it |
| View thoughts | See some | ✓ include_thoughts |
| Adjust dynamically | No | ✓ use -1 |
| Good for | General users | Developers |
