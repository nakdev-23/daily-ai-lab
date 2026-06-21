---
title: "Content Policy — content policy and safe use"
tool: "DALL·E"
icon: "icon-docs"
level: "pro"
summary: "Understand DALL·E's content policy — which kinds of images aren't allowed, the reasoning behind it, and how to write prompts that pass the filter"
readTime: "6 min"
readers: "0"
locked: false
order: 9
---
# Content Policy — content policy and safe use

> Primary reference: [OpenAI Usage Policies](https://openai.com/policies/usage-policies) | [DALL·E Content Policy](https://labs.openai.com/policies/content-policy)

---

## What is the Content Policy

The **Content Policy** (the rules OpenAI sets for which kinds of images DALL·E does or doesn't allow) is a set of rules OpenAI created to:

- Prevent creating content harmful to society
- Protect people from having their image misused
- Protect copyright and intellectual property
- Keep AI use safe

DALL·E has a **Safety System** (a program that checks both the prompt and the created image to filter inappropriate content) that runs automatically both before creating the image (checking the prompt) and after (checking the resulting image).

---

## Content not allowed

### 1. Explicit Adult Content

DALL·E doesn't allow creating images with:
- Sexual nudity
- Explicit sexual content
- Content with minors in a sexual context (illegal in every case)

### 2. Violence

Not allowed: images that:
- Show excessively intense violence, e.g. graphic images showing severe injury
- Promote torture
- Show graphic death scenes

> **Note:** Historical war images, action films, or games may be allowed in an appropriate context.

### 3. Hate Speech / Hateful Content

Not allowed: images that:
- Show discrimination by race, religion, sex, or identity
- Use symbols related to hate groups
- Promote extremist ideologies

### 4. Real People

DALL·E has restrictions on creating images of:
- Public figures in a damaging situation
- Political leaders in images with political implications
- Anyone in a context that could be a deepfake (a fake image — one made with AI to falsely seem like a real photo of that person)

> **Tip:** Instead of asking for "an image of [a politician's name]," describe the appearance you want instead.

### 5. Copyright Infringement

Not allowed: images that:
- Directly copy a specific artist's artwork
- Create characters with a clear copyright owner (e.g. Mickey Mouse, Superman)
- Imitate a registered logo or brand

> **Note:** Referencing an artist's "style" (e.g. "in the style of Monet") differs from "copying" their work — referencing a style generally is usually allowed.

### 6. Dangerous Information

Not allowed: images that could be used dangerously:
- Images of weapon-making manuals
- Images showing phishing (deceiving someone to steal data) or scams
- Images promoting behavior dangerous to health

---

## How the Safety System works

DALL·E uses multiple layers of checks:

### Layer 1: Check the prompt

Before creating the image, the system analyzes the prompt you sent to detect policy-violating content. If found, it refuses immediately without creating the image.

### Layer 2: Check the created image

Even if the prompt passes, the created image is checked again. If the resulting image has inappropriate content, it's blocked.

### Layer 3: Revised Prompt (DALL·E 3)

DALL·E 3 auto-adjusts the prompt to avoid Content Policy issues in some cases, e.g. removing a real person's name from the prompt.

### Layer 4: Post-use reporting and monitoring

OpenAI has a monitoring system to detect unusual behavior. Accounts that repeatedly violate the policy may be suspended.

---

## What's still allowed

To prevent misunderstanding, these are still allowed:

- Moderately violent images, e.g. historical war scenes in an educational context
- Fine art nude images that aren't sexual content (depending on context and platform)
- Fictional characters with no clear copyright
- Monsters, fictional creatures, general fantasy images
- Images referencing an artist's "style" (not copying a specific work)
- Cartoons or illustrations with appropriate content

---

## How to handle being refused

When DALL·E refuses a prompt, you get a notice like:

```
"Your request was rejected as a result of our safety system. 
Your prompt may contain text that is not allowed by our safety system."
```

### Approaches to fix it

**1. Specify a clear context**

Instead of: `"A person being hurt"`
Try: `"A historical painting showing the aftermath of a medieval battle, educational illustration"`

**2. Avoid words with double meanings**

Some seemingly fine words may be flagged by the system; try different wording.

**3. Add context for creative work**

- `"for a children's book illustration"`
- `"concept art for a science fiction film"`
- `"educational diagram for a science textbook"`

**4. Make the prompt shorter**

Some long prompts that combine many elements may make the system misinterpret; try splitting into sub-prompts.

---

## Policy on using created images

### Usage rights

Per OpenAI policy, users who create images through DALL·E **have the right to use those images**, including:

- **Commercial Use** (selling, printing, using in ads) ✅
- **Personal Use** ✅
- **Modification** ✅
- **Distribution** ✅

### What's forbidden with created images

- Using them to create policy-violating content
- Claiming an AI-created image is a real photo in a potentially deceptive context
- Using an image to make a deepfake or defame someone

---

## Data security

OpenAI stores prompts and created images per the Privacy Policy. However:

- **Don't send personal data** like your full name, address, or ID number in the prompt
- **Don't send images with confidential data**, e.g. images of official documents or confidential business data
- The **API key** should be kept secret and not written directly in source code

---

## Summary

DALL·E's Content Policy is designed to prevent harmful use while remaining open to a wide range of creative work. Understanding these policies helps you write prompts that pass the filter more easily and use DALL·E effectively and responsibly.
