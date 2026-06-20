---
title: "Memory — the cross-conversation memory system"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "intermediate"
summary: "Memory lets ChatGPT remember important information about you across conversations, so it responds more personally and on-target every time you use it"
readTime: "6 min"
readers: "0"
locked: false
order: 12
---

# Memory — the cross-conversation memory system

> Primary reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## What is Memory

Normally, ChatGPT "forgets" everything when a conversation ends, so each chat starts from zero. The **Memory** feature solves this by letting ChatGPT save important information about you and use it in the next conversation.

Memory turns ChatGPT into an assistant that "knows you better" over time, instead of having to introduce yourself or re-explain the context (the surrounding information that helps make sense of the situation) every time.

---

## Types of Memory

### 1. Automatic Memory (the AI saves important info itself without being told)
ChatGPT learns and remembers information from the conversation automatically when it detects info useful for future conversations, e.g.:
- Your name, occupation, or where you live
- Likes and dislikes
- Projects you're working on
- The writing style you want

> **Example**: if you say "I'm a Python developer working with Django," ChatGPT remembers it and gives Python/Django-relevant answers next time automatically.

### 2. Manual Memory (you tell the AI to remember specific info directly)
You can tell ChatGPT directly to remember anything:
- *"Remember that I like short, concise answers, no more than 3 points"*
- *"Remember that my main client is ABC Company"*
- *"My name is [name] and I work as a [occupation]"*

ChatGPT confirms "Got it, I'll remember that" and uses that info in the next conversation.

---

## How to manage Memory

### See what ChatGPT remembers
1. Click the **Profile Icon** > **Settings**
2. Choose **Personalization**
3. Click **"Manage Memory"**
4. You'll see a list of everything ChatGPT remembers

### Delete some memory items
- On the Manage Memory page, click the **"X"** or **"Delete"** icon next to the item to delete
- Or tell it in the chat directly: *"Forget what I said about working at Company X"*

### Clear all memory
- In Manage Memory, click **"Clear all memories"**
- Confirm the deletion
- ChatGPT starts fresh with no prior info

### Turn Memory on/off
- In **Settings > Personalization** there's a toggle (a switch — press to turn a feature on or off) for Memory
- When off: ChatGPT won't remember new info, but existing memories remain
- When turned back on: existing memories are still there, not deleted

---

## Temporary Chat (a conversation that isn't saved and doesn't add to memory)

For conversations you **don't want Memory to remember**, use Temporary Chat:

### How to open Temporary Chat
1. Click **"New Chat"** > choose **"Temporary Chat"**
2. Or click the **clock** icon at the top-right edge of the chat window

### Characteristics of Temporary Chat
- Not saved to your chat history (past conversation records)
- ChatGPT won't remember info from this conversation
- Existing Memory is still usable, but new things it learns won't be saved
- Good for questions that need high privacy

---

## Examples of using Memory effectively

### For routine work
Remember context you reuse often:
- *"Remember that I work at [company name] as [position], overseeing [team/project]"*
- *"My main project right now is [project name], using the tech stack (the set of technologies used to build it): React, Node.js, PostgreSQL"*

### For learning
- *"I'm learning Machine Learning (machines learning from data instead of being programmed step by step) at an intermediate level; explain at that level"*
- *"I understand statistics but I'm shaky on linear algebra"*

### For writing
- *"My writing style: concise, to the point, not wordy, plain language not technical jargon"*
- *"The target audience for my writing is Thai people aged 20–35"*

### For personal use
- *"I have a food allergy: shrimp and seafood"*
- *"I'm on a tight budget; always recommend good value"*

---

## Memory privacy

### What OpenAI does with Memory data
- Memory is stored in your account, not separately
- OpenAI can use Memory to train the AI (except if you opt out — choose not to consent — or use the Teams/Enterprise plans)
- You can download/export all your Memory data

### How to opt out of using your data for AI training
1. **Settings > Data Controls**
2. Turn off **"Improve the model for everyone"**
3. Memory still works, but your data won't be used to train the model (the AI program)

---

## Cautions

| Watch out for | Advice |
|---|---|
| **Sensitive data** | Don't have ChatGPT remember passwords, ID numbers, or financial data |
| **Company data** | Be careful with trade secrets or confidential organizational data |
| **Changing data** | Update Memory when things change, e.g. changing jobs or projects |
| **Memory can be wrong** | Check Manage Memory occasionally; the AI may remember some things incorrectly |

---

## Availability

| Plan | Memory |
|---|---|
| Free | Supported (limited number of memories) |
| Plus | Fully supported |
| Pro | Fully supported |
| Teams | Supported (separate Memory between Personal and Workspace) |
| Enterprise | Supported (admin can control the policy) |
