---
title: "ChatGPT Agent & Operator — AI that works for you"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "pro"
summary: "Operator and ChatGPT Agent are agentic AI systems that work autonomously over many steps, from ordering food and booking hotels to doing computer work for hours on your behalf"
readTime: "7 min"
readers: "0"
locked: false
order: 13
---

# ChatGPT Agent & Operator — AI that works for you

> Primary reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## What are AI Agents

**Agentic AI**, or AI Agents (AI that acts as an agent, planning and executing many steps on its own), are AI systems that don't just "answer questions" but can **plan and do multi-step work autonomously** to achieve the goal you set.

OpenAI has several Agent products under ChatGPT:

| Name | Launched | Main ability |
|---|---|---|
| **Operator** | January 2025 | Works on a web browser autonomously |
| **Deep Research** | February 2025 | Deep research from the web |
| **ChatGPT Agent** | July 2025 | Controls a virtual computer over multiple steps |
| **Codex** | 2025 | Writes and runs code autonomously |

---

## Operator

### What is Operator

Operator is OpenAI's first AI Agent, designed to **do work on the internet for you**, using a virtual browser (a browser running in a simulated system, not on your real screen) powered by GPT-4 Vision (the ability to see and understand images) and Reinforcement Learning (the AI learns by trial and error and rewards).

### How Operator works

1. You tell Operator "what you want" in natural language
2. Operator opens a virtual browser and finds suitable websites
3. It fills out forms, clicks buttons, and navigates pages automatically
4. When it hits an obstacle (e.g. needing a password, or a price decision), Operator hands control back to you
5. Once you've handled it, Operator continues from that point

### What Operator can do

**Travel management**
- Find hotels and compare prices
- Check flight schedules
- Start the booking process (you do the final confirmation yourself)

**Ordering and services**
- Order food from a delivery platform
- Find online shopping deals
- Fill out online forms

**Appointments and scheduling**
- Find and book various services
- Fill in appointment forms

### Current limits

- Still in **Research Preview** (a trial phase for researchers — not yet a full product for general users) — not a fully ready product
- Often slow on complex tasks, and interrupts frequently
- Can't do complex financial transactions automatically
- Available mainly on **ChatGPT Pro** ($200/month)

---

## ChatGPT Agent

### What is ChatGPT Agent

ChatGPT Agent (launched July 2025) is a newer Agent more powerful than Operator, able to **control a virtual computer (a simulated computer in the cloud that runs separately from your machine)** and do complex multi-step work.

### Special abilities

**Uses a virtual computer**
- Operates in a separate virtual-computer environment
- Works for hours without making you wait
- Uses various programs, opens/closes files, and navigates the system

**Deep Research (finding and synthesizing data from many sources comprehensively)**
- Gathers data from hundreds of online sources
- Summarizes and analyzes data into a report
- Cites sources fully

**Interruption and guidance**
- You can "check in" on progress anytime
- Interrupt and give more instructions mid-task
- ChatGPT Agent notifies you when it needs input (data or instructions from you)

### Examples of what ChatGPT Agent can do

**Research work**
> *"Research the market size (a market's value and volume) of EVs in Thailand, gather data from many sources, then make a report with charts"*

**Document work**
> *"Read the 10 files in this folder, summarize the key points, then write a summary report"*

**Tracking work**
> *"Track 5 stock prices, record every hour, then send a summary in the evening"*

---

## Deep Research

**Deep Research** is a feature where ChatGPT "thinks" and "searches" intensively before answering:

### How it works
1. ChatGPT plans the research first
2. Searches dozens to hundreds of websites
3. Reads and analyzes the content
4. Synthesizes all the data into a comprehensive answer

### What work it suits
- Questions needing data from many angles
- Comparing several options
- A well-rounded pros/cons analysis
- Finding evidence to support or refute a hypothesis

### Worth knowing
- Takes longer than a regular search (maybe 5–20 minutes)
- Results are often long and very detailed
- Supported on Plus, Pro, Teams, Enterprise

---

## Operator System Prompt

A **System Prompt** (the system's initial instructions — text defining the AI's behavior before the user starts chatting), or Operator Instructions, is the configuration set by the "Operator" (whoever deploys — installs and runs ChatGPT on their own platform) for how ChatGPT should behave in that context.

### Usage examples
- A company that embeds (puts ChatGPT inside its own app) ChatGPT in its own app might set the System Prompt to "only answer questions about our service"
- An education platform might set "don't answer questions unrelated to studying"
- General users can't see the System Prompt the Operator sets

---

## Safety of Agentic AI

OpenAI places great importance on Agent safety:

**Sandbox Environment (an isolated environment — works without affecting other systems)**
- Operator and ChatGPT Agent run in a virtual machine (a simulated computer) separate from your real computer
- They can't access your private files or other data directly

**Human-in-the-Loop (a person controls every important step — the AI doesn't decide everything itself)**
- The Agent asks for confirmation before doing something irreversible
- You can stop it anytime

**Action restrictions**
- Can't access sensitive information without permission
- Limited financial transactions

---

## Availability

| Feature | Supported plans |
|---|---|
| Deep Research | Plus, Pro, Teams, Enterprise |
| Operator | Pro (mainly), expanding gradually |
| ChatGPT Agent | Pro, Enterprise (expanding gradually) |
| Codex | Plus, Pro, Teams |

> **Note**: Agentic features are still under development and may change. Check the latest availability at [openai.com](https://openai.com)
