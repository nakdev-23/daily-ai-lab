---
title: "Prompt Engineering — techniques for writing Prompts for Grok"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Learn techniques for writing Prompts that work well with Grok — from System Prompts, Chain-of-Thought, and Few-shot to controlling Persona and output format."
readTime: "8 min"
readers: "0"
locked: false
order: 19
---
# Prompt Engineering — techniques for writing Prompts for Grok

> Reference: [xAI Docs](https://docs.x.ai/docs) | [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

---

## Why does Prompt Engineering matter?

**Prompt Engineering** (the craft of writing instructions for an AI to get the result you want) matters because Grok is an **LLM — Large Language Model** (an AI that learned from enormous amounts of text until it can understand and produce language) that answers by **probability** — the same question written differently can produce very different answers.

**A good Prompt yields:**
- Answers that are more on-point and complete
- A format suited to how you'll use it
- Fewer Tokens (chunks of text the AI counts) used = lower cost
- More consistent results (similar results every time)

---

## Basic principles

### 1. Be clear and specific

```python
# Bad — too broad
"Tell me about Python"

# Good — clear, with a specified format
"Explain Python decorators for a developer who has used JavaScript, with 3 code examples, and compare them to Higher-order functions in JavaScript"
```

### 2. Specify the role in the System Prompt

**System Prompt** (a system-level instruction — defining the AI's persona and operating rules before the conversation begins):

```python
response = client.responses.create(
    model="grok-4.3",
    input=[
        {
            "role": "system",
            "content": """You are a personal finance expert with 20 years of experience.
            
Answering rules:
- Use simple, easy-to-understand English, no unnecessary technical jargon
- Give practical, actionable advice
- Always warn about risks when discussing investments
- Answer briefly and concisely, no more than 200 words, unless asked to explain in detail""",
        },
        {
            "role": "user",
            "content": "Should I invest in an ETF or a Mutual Fund?",
        },
    ],
)
```

### 3. Specify the output format

```python
# State what you want
prompt = """Analyze the pros and cons of microservices vs monolith

Answer in this format:
## Microservices
**Pros:**
- ...

**Cons:**
- ...

## Monolith
**Pros:**
- ...

**Cons:**
- ...

## Summary recommendation (2-3 sentences)
"""
```

---

## Chain-of-Thought (CoT) technique

**Chain-of-Thought** (thinking in a chain — telling the AI to think step by step before answering, which makes the answer more accurate):

```python
# Simple form
prompt = "Think step by step before answering: if I have 15 apples and split them equally among 3 friends, but friend #2 doesn't like apples, how many are left?"

# Complex form — for analytical problems
prompt = """Before answering, please:
1. Summarize what's being asked
2. Identify the available data
3. Think through how to solve the problem
4. Check the answer
5. Give the final answer

Question: A company has 120 employees and wants to move to a new office that holds 80 people, and will do Work-from-home 3 days a week. How should it handle this?"""
```

---

## Few-shot Prompting

**Few-shot Prompting** (giving examples before asking — helps the AI understand the desired format more accurately):

```python
prompt = """Convert text into concise Bullet Points

Example 1:
Text: "Python is an easy-to-read, easy-to-learn programming language, popular in Data Science and AI"
Result:
• Easy to read, easy to learn
• Popular in Data Science and AI

Example 2:
Text: "React is a JavaScript library for building UIs, developed by Meta, using a Component concept"
Result:
• JavaScript library for UIs
• Developed by Meta
• Uses Component architecture (a structure built from reusable pieces)

Now do this text:
Text: "TypeScript adds Static Typing to JavaScript, reducing Bugs and making code more Maintainable, with better IDE support"
Result:"""
```

---

## Persona and Tone Control

**Persona** (the personality you assign the AI) and **Tone** (the voice or speaking style):

```python
personas = {
    "expert": """You are a technology expert. Answer with technical detail, using specialized terms""",
    
    "teacher": """You are a teacher of 12-year-olds. Use simple language, with examples from daily life""",
    
    "friendly": """You are a knowledgeable, helpful friend. Use a casual, informal tone, with some emoji""",
    
    "concise": """Answer as briefly as possible, no more than 3 sentences, cutting everything unnecessary""",
}

def ask_grok(question: str, persona: str = "expert") -> str:
    return client.responses.create(
        model="grok-4.3",
        input=[
            {"role": "system", "content": personas[persona]},
            {"role": "user", "content": question},
        ],
    ).output_text
```

---

## Temperature Control

**Temperature** (the randomness of the answer — a low value gives fixed answers, a high value gives varied, creative answers):

```python
# Temperature 0 = fixed, for facts
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "What's the capital of Thailand?"}],
    temperature=0,  # the same answer every time
)

# Temperature 0.7 = balanced (default)
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "Recommend 5 restaurants in Bangkok"}],
    temperature=0.7,  # varied, but still reasonable
)

# Temperature 1.5 = very creative
response = client.chat.completions.create(
    model="grok-4.3",
    messages=[{"role": "user", "content": "Write a poem about summer rain"}],
    temperature=1.5,  # creative, non-repetitive
)
```

---

## Reasoning Mode — let Grok think deeply

**Reasoning Mode** (an analytical thinking mode — letting Grok "think" before answering, good for complex problems):

```python
# Enable Reasoning for complex problems
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Design a Database schema for an E-commerce system that supports multi-currency and multi-warehouse"}],
    reasoning={"effort": "high"},  # low / medium / high — the level of thinking effort
)

print(response.output_text)
```

---

## Useful Prompt Templates

**Prompt Templates** (ready-made prompt templates — reusable by changing just the variables):

### Summarize a document

```python
SUMMARIZE_PROMPT = """Summarize the following document:

---
{document}
---

Please summarize in this format:
**Key takeaway:** (1-2 sentences)

**Main points:**
1. ...
2. ...
3. ...

**Conclusion:** (1 sentence)"""
```

### Analyze code

```python
CODE_REVIEW_PROMPT = """Analyze this code and give feedback:

```{language}
{code}
```

Please check:
1. **Bugs** (errors in the code) — are there any obvious errors?
2. **Performance** — is there anything unnecessarily slow?
3. **Security** — are there any vulnerabilities?
4. **Readability** — is the code easy to read and understand?
5. **Improvement suggestions** — what should change?"""
```

### Translate with context

```python
TRANSLATE_PROMPT = """Translate the following {source_lang} into {target_lang}:

Original: {text}

Context: {context}

Requirements:
- Preserve the tone and style of the original
- Use {target_lang} for technical terms
- For words that shouldn't be translated, transliterate and add an explanation in parentheses"""
```

---

## Anti-patterns — things to avoid

**Anti-patterns** (patterns to avoid — ways of writing prompts that give bad results):

| Thing to avoid | Problem | Fix it by |
|---|---|---|
| Prompt too broad | You get a generic, off-point answer | Specify details and the output format |
| System Prompt too long | Wastes Tokens / confuses | Shorten it, emphasize the key rules |
| Asking many things at once | A half-baked answer | Split the questions, or state the priority |
| Not specifying a Format | An answer that's hard to use | Include an example of the desired Format |
| Asking for the impossible | Hallucination (the AI makes up false info) | Say "if you don't know, say you don't know" |

---

## Tips for English

```python
# Add a language instruction in every System Prompt
system = """You are an AI assistant
- Always answer in English
- For technical terms (e.g. API, SDK, Database), use them as-is
- Use "you" when addressing the user
- Don't use hard-to-understand bureaucratic language"""
```
