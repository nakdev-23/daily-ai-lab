---
title: "Prompt Engineering — the art of writing the most effective prompts"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Techniques for writing prompts effectively, from the basics to XML tags, few-shot examples, chain of thought, and agentic prompting"
readTime: "15 min"
readers: "0"
locked: false
order: 12
---

## What is Prompt Engineering?

Prompt Engineering (designing instructions for AI — the craft of writing text so the AI understands and answers exactly as needed) is designing and refining the input (the data sent to the AI) sent to Claude to get the desired output consistently. Writing a good prompt isn't just "asking a question" but communicating your needs clearly, including context (background information that helps the AI understand the situation), output format, and various constraints.

> **Think of Claude as a very smart new employee who doesn't know your context.** The more clearly you explain, the better the result.

---

## General Principles

### 1. Be clear and to the point

State what you want clearly; don't use vague language.

```
# Bad
"Help me look at this code"

# Good
"Review this Python function, find a bug that could cause an off-by-one error, and suggest a fix"
```

**Golden Rule:** Try showing the prompt to someone without giving context, and ask if they understand. If they're confused, Claude will be confused too.

### 2. Add Context and reasoning

Saying "why" helps Claude understand the goal and generalize (apply to many cases) better.

```
# Bad
"NEVER use ellipses"

# Good
"Don't use ellipses (...) because the response will be read by text-to-speech (a system converting text to speech), and TTS doesn't know how to pronounce them"
```

### 3. Be concrete, not abstract

Specify the format, length, style, and ordering clearly.

```
# Bad
"Summarize this article"

# Good
"Summarize this article in 3 bullet points in English, each bullet no more than 1 sentence, focusing on the key points a business decision-maker should know"
```

---

## Using Examples (Few-Shot Prompting)

Examples are the most powerful way to tell Claude what kind of output you want.

### Principles for choosing good Examples

- **Relevant** — the examples must be close to the real task
- **Diverse** — cover various edge cases (special cases that may arise)
- **Structured** — wrap in XML tags (data-structure tags) so Claude can distinguish them

```
Here are examples of classifying opinions:

<examples>
  <example>
    <input>The product arrived very fast, beautiful packaging, very impressed!</input>
    <output>positive</output>
  </example>
  <example>
    <input>Waited so long to receive it, not impressed at all</input>
    <output>negative</output>
  </example>
  <example>
    <input>Everything arrived, but the box was slightly dented</input>
    <output>mixed</output>
  </example>
</examples>

Classify the following opinion:
{USER_REVIEW}
```

> **Tip:** Use 3–5 examples for the best result.

---

## XML Tags — clear structure

XML tags (the angle-bracket symbols used to label sections, e.g. `<instructions>...</instructions>`) help Claude clearly distinguish the parts of a prompt, especially when the prompt mixes many parts.

```xml
<instructions>
  Analyze the following document and summarize the key points
</instructions>

<context>
  This document is the annual report of XYZ Company
</context>

<document>
  {{DOCUMENT_CONTENT}}
</document>

<format>
  Answer as bullet points in English, no more than 5 items
</format>
```

### Commonly used tags

| Tag | Used for |
|-----|---------|
| `<instructions>` | The main instruction |
| `<context>` | Context or background information |
| `<examples>` / `<example>` | Examples |
| `<document>` | Document content |
| `<input>` / `<output>` | In few-shot examples |
| `<thinking>` | For chain of thought |
| `<answer>` | The final answer |

---

## Role Prompting (assigning a role to the AI)

Having Claude take on a "role" helps adjust the tone and focus of its answers.

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="You are a Thai legal expert with 20 years of experience, specializing in labor law and contracts. Answer carefully and always recommend consulting a lawyer for specific cases.",
    messages=[
        {"role": "user", "content": "What provisions should an employment contract have?"}
    ]
)
```

---

## Chain of Thought (CoT) — let Claude "think before answering"

Chain of Thought (a technique of having the AI show its thinking steps one by one before concluding the answer) improves accuracy for complex problems.

### Method 1: Ask it to think first

```
Analyze the financial feasibility of this project:
- Initial cost: 5 million baht
- Projected revenue: 2 million baht per year
- Annual expenses: 500,000 baht

Please think step by step and show the calculation in detail before concluding
```

### Method 2: Use XML tags to separate Thinking and Answer

```
<thinking>
  Have you think and analyze step by step in this section
</thinking>

<answer>
  Conclude the final answer in this section
</answer>
```

### Method 3: Adaptive Thinking (API)

For Claude 4.6+ models, use adaptive thinking (the model decides for itself how long to think), where the model decides how long to think:

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content": "Solve this complex math problem..."}]
)
```

---

## Long Context Prompting

When working with large documents (20k+ tokens — more than 20,000 chunks of text):

### Place Data before the Query

Place long content at the top and the question at the bottom; this can improve performance by up to 30%.

```xml
<documents>
  <document index="1">
    <source>annual_report_2025.pdf</source>
    <document_content>
      {{ANNUAL_REPORT_CONTENT}}
    </document_content>
  </document>
</documents>

Question: Summarize the main risks mentioned in this report
```

### Ask it to Quote before answering

```
Read the following document, then:
1. Find and quote (cite text) the parts relevant to the question, placing them in <quotes> tags
2. Then answer the question based on those quotes

Question: How does the company plan to expand into international markets?
```

---

## Controlling the Output Format

### 1. State what you want, not what you don't want

```
# Bad
"Don't use markdown"

# Good
"Answer in plain text, without headings or bullet points"
```

### 2. Specify the Format clearly

```
Answer in JSON format (a standard data format — using {} and [] to store data as name-value pairs) as follows:
{
  "sentiment": "positive/negative/neutral",
  "score": (0-100),
  "key_phrases": ["phrase1", "phrase2"],
  "summary": "a 1-sentence summary"
}
```

### 3. Example prompt to reduce Markdown

```
When writing a report or long content, write as plain prose in paragraphs.
Use markdown only for `inline code` and code blocks.
Don't use bold, italic, or bullet lists unless necessary.
```

---

## Agentic Prompting

For use cases where Claude must do multi-step work automatically:

### Control Autonomy (the AI's independence)

```python
system_prompt = """
Always consider the reversibility (whether something can be undone after doing it) of actions:
- Reversible actions (editing files, running tests): do them directly
- Irreversible actions (deleting data, pushing code, sending email): require confirmation first

If unsure, ask the user
"""
```

### Manage the Context Window (the temporary memory size)

```
Your context window will be compacted automatically when it nears full.
You can keep working indefinitely; don't stop work prematurely.
Before context is cleared, save your progress to a file progress.txt
```

### Reduce Overengineering (making it more complex than necessary)

```
Do only what's asked; don't add features that weren't requested.
Don't refactor (reorganize) unrelated code.
Make the solution as simple as possible.
```

---

## Good Prompts for various Use Cases

### Customer Service Bot

```
You are the AI assistant of [store name].
Answer in a friendly, professional tone, in English.
If you don't know the answer, say you'll forward it to the team and ask for a name and phone number to follow up.
Don't promise to do things beyond your capability.
```

### Code Review

```
You are a senior developer doing a code review.
Check and report:
1. Bugs or potential issues
2. Security vulnerabilities
3. Performance problems
4. Code quality and readability
Give a severity rating: critical / high / medium / low for each issue
```

### Data Extraction

```
Extract the following data from the text and answer in JSON only:
- name
- email
- phone
- address

If data isn't found, use null
Don't add any fields other than the ones specified
```

---

## Prompt Engineering Checklist

Before deploying (putting into real use) a prompt, check this list:

- [ ] Clearly state the task and goal
- [ ] Include necessary context or background information
- [ ] Specify the desired output format
- [ ] Have examples for edge cases (special cases)
- [ ] Specify what's "not wanted," e.g. don't guess, don't make up new data
- [ ] Test with various input forms
- [ ] Verify the output actually works with the downstream process (the next process that will use the result)

---

## Summary

| Technique | Good for |
|--------|-----------|
| **Clear Instructions** | Every task |
| **Role Prompting** | Conversation, expert advice |
| **Few-Shot Examples** | Classification, extraction, formatting |
| **XML Tags** | Complex multi-part prompts |
| **Chain of Thought** | Math, reasoning, analysis |
| **Long Context Tips** | Document analysis |
| **Agentic Prompting** | Multi-step automation |

Prompt engineering is a skill that requires continuous practice, experimentation, and measurement. Start with simple principles, then gradually add complexity as needed.
