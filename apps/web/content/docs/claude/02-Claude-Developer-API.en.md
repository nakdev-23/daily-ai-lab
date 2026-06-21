---
title: "Developer Docs / API"
tool: "Claude"
icon: "tool-claude"
level: "beginner"
summary: "Reference: Intro to Claude"
readTime: "9 min"
readers: "0"
locked: false
order: 2
---
# Claude guide — Part 2: Developer Docs / API

> Compiled from [platform.claude.com/docs](https://platform.claude.com/docs) for developers who want to use Claude in their own apps via the API

---

## 📖 Key terms for developers

| Term | Plain meaning |
|---|---|
| **API** (Application Programming Interface) | A ready-made channel that lets your program "talk" to Claude by sending data over the internet |
| **Endpoint** | A URL (web address) for sending/receiving data with the API, e.g. `POST /v1/messages` is the URL for sending messages |
| **SDK** (Software Development Kit) | A set of tools and ready-made code that makes calling the API easier, e.g. no need to write HTTP requests yourself |
| **API Key** | A private secret code that proves you have the right to use the API, like a "pass" you send every time |
| **Token** | The unit the AI uses to measure text size, roughly 1 token ≈ 0.75 English words or ≈ 1–3 Thai characters |
| **Max tokens** | The maximum number of tokens Claude is allowed to reply with; a too-long answer gets cut off |
| **Context window** | The model's "memory size," the maximum tokens you can send in one request, including the question and conversation history |
| **Stateless** | No memory — the API doesn't remember past conversations; you must send the entire history back on each request |
| **Prompt** | The text or instruction sent to the AI to process |
| **System prompt** | An initial instruction that sets Claude's overall role or behavior, e.g. "you are company X's customer assistant" |
| **Prompt caching** | Caching the parts of a prompt sent frequently to reduce cost and increase speed |
| **Streaming** | Receiving the answer piece by piece in real time, like watching it typed character by character, instead of waiting for the full answer |
| **Agentic loop** | The cycle where the AI works in multiple rounds: ask a question → call a tool → see the result → continue → until done |
| **Tool use** | Letting Claude "call" a function or tool in your app, e.g. search the web, calculate, fetch data |
| **Batch processing** | Sending many requests at once without waiting for results immediately (asynchronous), good for high-volume work |
| **Asynchronous** | Working in the background, not waiting to finish before moving on, like ordering food then doing other work while you wait |
| **Rate limit** | A cap on the number of requests you can send per time window, to prevent overload |
| **Latency** | The delay — the time from sending a request to receiving the answer; the lower the faster |
| **Guardrails** | Rules or filters that control the AI's behavior to keep it from answering unwanted things |
| **Evals** (Evaluations) | Testing the quality of a prompt or model before using it for real |
| **Environment variable** | A variable that stores important values, e.g. an API key, in the system instead of writing them directly in code, for security |

---

## 1. Overview of developing with Claude
Reference: [Intro to Claude](https://platform.claude.com/docs/en/intro)

### What is this topic?
Anthropic offers two main ways to build with Claude:
- **Messages API** — direct access to the model; you build every "conversation round" yourself, managing the conversation state and the tool-calling loop yourself, good for work that needs fine control
- **Claude Managed Agents** — a ready-made agent structure (an AI that does multi-step work automatically) where Anthropic manages the infrastructure for you, good for long-running and background work

### Developer tools
- **Developer Console** ([platform.claude.com](https://platform.claude.com/)) — experiment with and test prompts in the Workbench, auto-generate prompts, manage API keys
- **API Reference** — full endpoint and client SDK docs
- **Cookbook / Quickstarts** — ready-to-use notebooks and example apps

### Quick summary
Choose the Messages API if you want full control, or Managed Agents if you want a ready-made managed agent.

---

## 2. Quickstart — your first API call
Reference: [Quickstart](https://platform.claude.com/docs/en/get-started)

### How to use it (Step-by-step)
1. Sign up and create an **API key** (a secret code for using the API) at [platform.claude.com/settings/keys](https://platform.claude.com/settings/keys)
2. Set an **environment variable** (a way to store a secret value in the system without writing it in code): `ANTHROPIC_API_KEY`
3. Install the **SDK** (a ready-made toolkit for calling the API more easily) on Python: `pip install anthropic`
4. Send your first message

### Example (Python)
```python
import anthropic

client = anthropic.Anthropic()  # reads the key from ANTHROPIC_API_KEY

message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hi Claude, please introduce yourself"}
    ],
)
print(message.content[0].text)
```

There are official SDKs for Python, TypeScript, Go, Java, Ruby, PHP, C#, and you can call via cURL/CLI.

### Cautions
- Keep your API key secret; don't commit it to a repo
- `max_tokens` is the cap on the number of tokens (the text-measuring unit) in the answer; you must always set it, and a too-long answer gets cut off mid-way

### Quick summary
Create a key → set the env → install the SDK → call `messages.create` with model, max_tokens, messages.

---

## 3. Messages API (the main structure)
Reference: [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)

### What is this topic?
The Messages API is the main endpoint for talking to Claude, by sending a list of messages alternating between the `user` and `assistant` roles, then receiving an answer.

### Key details from the official docs
- **Request structure:** `model`, `max_tokens`, `messages` (required) and `system`, `temperature`, `tools`, `stream`, etc. (optional)
- **Multi-round conversations:** the API has no memory (**stateless** — doesn't remember what was said before), so you must send the entire conversation history back each time; continue the conversation by appending to the messages list
- **System prompt:** put it in the `system` parameter to set the overall role/behavior
- **Content:** either text or an array of blocks (text, image, file, tool_use, tool_result)

### Example (multi-turn conversation + system)
```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a math tutor; answer in clear, simple English",
    messages=[
        {"role": "user", "content": "Explain the Pythagorean theorem"},
        {"role": "assistant", "content": "The Pythagorean theorem states..."},
        {"role": "user", "content": "Give me an example"},
    ],
)
```

### Quick summary
Send an array of messages (user/assistant) + system; the API doesn't keep state, so you must send the history yourself each time.

---

## 4. Handling stop reasons
Reference: [Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

### Key details from the official docs
The answer has a `stop_reason` field telling you why the model stopped generating. Common values:
- `end_turn` — answered normally; your program can continue
- `max_tokens` — the answer hit the set token cap; it may be cut off mid-way; increase max_tokens or tell it to continue
- `stop_sequence` — it hit a word/phrase set to stop on (e.g. stop when it sees "END")
- `tool_use` — Claude wants to call a tool; your program must run it, then send the result back for Claude to continue
- `pause_turn` / `refusal` — special cases, e.g. a temporary pause, or Claude declining to answer

### Cautions
Write code to handle every `stop_reason` value, especially `tool_use` and `max_tokens`, so the loop works correctly.

### Quick summary
Check `stop_reason` every time: `tool_use` means run the tool to continue, `max_tokens` means the answer was cut off.

---

## 5. Models and selection (Models)
Reference: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

### Key details from the official docs
The latest model family:

| Feature | Opus 4.8 | Sonnet 4.6 | Haiku 4.5 |
|---|---|---|---|
| Highlight | Most capable, complex reasoning + coding | Balanced fast/smart | Fastest |
| API ID | `claude-opus-4-8` | `claude-sonnet-4-6` | `claude-haiku-4-5-20251001` |
| Price (input/output per 1M tokens) | $5 / $25 | $3 / $15 | $1 / $5 |
| Context window | 1M tokens | 1M tokens | 200k tokens |
| Max output | 128k tokens | 64k tokens | 64k tokens |
| Extended thinking | No | Yes | Yes |
| Adaptive thinking | Yes | Yes | No |

- All versions support text+image input, text output, multiple languages, and vision
- Usable via the Claude API, AWS Bedrock, Vertex AI, and Microsoft Foundry
- On Opus 4.8, the `effort` parameter defaults to `high` on all platforms

### Model IDs and versions
Reference: [Model IDs and versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions)
- Every model ID is a pinned snapshot; from 4.6 onward it uses a date-less format but is still a pinned snapshot, not an evergreen pointer
- Query a model's capabilities and token limits via the [Models API](https://platform.claude.com/docs/en/api/models/list)

### Cautions
- Start with Opus 4.8 for the hardest work, but use Sonnet/Haiku to save cost on general work
- Check the deprecations table before pinning an old version long-term

### Quick summary
Opus = most capable, Sonnet = balanced, Haiku = fast/cheap; choose by difficulty and budget.

---

## 6. Tool use
Reference: [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

### What is this topic?
Tool use lets Claude call functions you define, or tools Anthropic provides. Claude decides on its own when to call a tool from the tool's description, then returns a structured call for your app to run.

### Key details from the official docs
Categorized by where the code runs:
- **Client tools (your side's tools)** — run in your own app; you write the function, and Claude requests a call when needed. Claude sends `stop_reason: "tool_use"` with details; you run the function, then send the result back as `tool_result`
- **Server tools (Anthropic's side's tools)** — run on Anthropic's servers, e.g. web search, fetch a web page, run Python code; you get results without writing the tool code yourself

**Agentic loop (the repeating work cycle):** send a request → Claude may request a tool call → the app runs the tool → sends the result back → Claude uses the result to continue → repeats until the answer is done (`end_turn`)

> **Like:** Claude is like an employee working for you; when it needs data, it "asks" you to fetch it (client tool), or for some things it can fetch them itself (server tool).

**Controlling tool calls:** `tool_choice` defaults to `{"type": "auto"}` (Claude decides whether to call), adjust to `any`/`tool` to force a call always, and add `strict: true` to guarantee the data sent matches the defined format (schema).

### Example (server tool: web search)
```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user", "content": "What's the latest news about the Mars rover?"}],
)
```

### Example (client tool: defined yourself)
```python
tools = [{
    "name": "get_weather",
    "description": "Get the current weather of the specified city",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string", "description": "City name"}},
        "required": ["city"],
    },
}]
# When stop_reason == "tool_use", run the real function, then send the tool_result back
```

### Cautions
- Providing tools adds tokens to the system prompt (e.g. Opus 4.8 adds ~290–410 tokens)
- Server tools may have extra costs based on usage (e.g. web search is charged per search)

### Quick summary
Client tools run in your app (you must send tool_result back), Server tools run on Anthropic's side; loop the agentic loop until you get the answer.

---

## 7. Important server tools
Reference: [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools)

### Key details from the official docs
- **Web search** — real-time web search, charged per search ([web-search-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool))
- **Web fetch** — fetch content from a specified URL ([web-fetch-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool))
- **Code execution** — run Python code in a sandbox, good for calculation/data analysis ([code-execution-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool))
- **Memory tool** — let Claude store/read memory across requests via files ([memory-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool))
- **Bash / Computer use / Text editor** — these are client tools but use the standard schema Anthropic defines, used to run shell commands, control the screen, and edit files

### Quick summary
There are ready-made tools: web search, fetch a URL, run code, memory, shell, computer use, edit files.

---

## 8. Model capabilities
Reference: [Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) · [Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming) · [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

### Key details from the official docs
- **Extended thinking** — gives the model "thinking space" before answering, like a worker who must reflect before answering, improving quality on work requiring complex reasoning (supported on the latest Sonnet/Haiku)
- **Adaptive thinking / Effort** — set "how much to think" to balance quality and cost
- **Structured outputs** — force the answer into a defined format, e.g. JSON (a data format programs read easily), to use directly in your app
- **Streaming** — receive the answer piece by piece in real time via **Server-Sent Events (SSE)** (a technique for continuously sending data from a server) instead of waiting for the full answer, so users see the answer faster
- **Batch processing** — send many requests at once **asynchronously** (working in the background, not waiting for results immediately) at a special 50% discount, good for high-volume, non-urgent work
- **Citations** — have Claude cite sources from the documents you provide ([Citations](https://platform.claude.com/docs/en/build-with-claude/citations))

### Quick summary
Adjust thinking (thinking/effort), force a format (structured outputs), stream the result, and batch process to save.

---

## 9. Context management
Reference: [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) · [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)

### Key details from the official docs
- **Context window** — the maximum tokens you can put in one request, like the "paper size" Claude can read at once (Opus 4.8/Sonnet 4.6 = 1 million tokens, Haiku 4.5 = 200,000 tokens)
- **Prompt caching** — cache parts of the prompt sent frequently, e.g. the system prompt or a long document, to reduce cost and **latency** of the next request
- **Compaction / Context editing** — when the conversation gets very long, the system summarizes or trims old history so it doesn't overflow the context window
- **Token counting** — count tokens in advance before sending, to plan cost and check whether the size exceeds the limit

### Cautions
The longer the context, the higher the cost; use prompt caching and compaction to help with long/repetitive work.

### Quick summary
Know the context window size, use prompt caching to reduce cost of repeated content, count tokens in advance to plan.

---

## 10. Working with files (Files / PDF / Vision)
Reference: [Files API](https://platform.claude.com/docs/en/build-with-claude/files) · [PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support) · [Vision](https://platform.claude.com/docs/en/build-with-claude/vision)

### Key details from the official docs
- **Files API** — upload files to store, then reference them by file ID across many requests without resending
- **PDF support** — send a PDF for Claude to read both the text and the visual elements on the page
- **Vision** — send images (base64 or URL/file) for Claude to analyze, describe, or extract data

### Quick summary
Upload via the Files API and reference by ID; supports reading PDFs and analyzing images (vision).

---

## 11. Skills (in the API context)
Reference: [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Skills in the API](https://platform.claude.com/docs/en/build-with-claude/skills-guide)

### What is this topic?
Skills are packaged sets of capabilities (a folder with a `SKILL.md` file plus instructions and scripts) that Claude loads when a task needs them, like a "plugin" that adds specialized capabilities, e.g. creating Word/PowerPoint/Excel documents.

### Key details from the official docs
- Loaded only when relevant (**progressive disclosure** — not loading everything at once, saving context)
- Usable in Claude apps, Claude Code, and via the API
- Has best practices and enterprise modes

### Quick summary
Skills = packages of specialized capabilities loaded when needed, reusable and shareable.

---

## 12. MCP (Model Context Protocol)
Reference: [Remote MCP servers](https://platform.claude.com/docs/en/agents-and-tools/remote-mcp-servers) · [MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector)

### What is this topic?
MCP is an open standard for connecting AI tools to external data sources and services. The Claude API can connect to a remote **MCP server** (a server that provides various tools) via the **MCP connector** so the model can call those servers' tools directly.

> **In plain terms:** MCP is like a "standard power outlet" that lets AI plug into various tools without writing special connection code for each one.

### Key details from the official docs
- Connect a remote MCP server (an MCP server on the internet) directly to a Messages API request
- Supports authentication (**auth**) for secure access to the server
- To build your own MCP client, see [modelcontextprotocol.io](https://modelcontextprotocol.io)

### Quick summary
The MCP connector lets the Claude API call tools from an external MCP server in one standard way.

---

## 13. Pricing
Reference: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

### Key details from the official docs
- Charged by the number of tokens, separated into input/output (see the table in the models section)
- There are discounts for the **Batch API** and special rates for **prompt caching**
- Server tools (e.g. web search) have extra costs based on usage
- Prices on cloud platforms (Bedrock/Vertex/Foundry) may differ by endpoint

### Quick summary
Pay by token (input/output); reduce cost with batch and prompt caching; server-side tools have extra costs.

---

## 14. Testing and security (Evaluate & Guardrails)
Reference: [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) · [Develop tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) · [Strengthen guardrails](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency)

### Key details from the official docs
- **Prompt engineering (writing good prompts)** — techniques for writing instructions for the AI: be clear and detailed, include examples of both right and wrong, have it think step by step, request results in XML tags (the `<tag>` marks) to separate text sections, specify the desired length and format
- **Evals (Evaluations)** — build test sets to measure how well a prompt or model performs before using it in production
- **Guardrails** — rules or filters added to control the AI's behavior, prevent it from answering unwanted things, and handle cases where the AI refuses to answer
- **Rate limits & errors** — the API has a cap on requests per minute; exceeding it returns error code 429 and you must do **retry with backoff** (retry with progressively longer waits) ([Rate limits](https://platform.claude.com/docs/en/api/rate-limits))

### Quick summary
Write good prompts → test with evals → add guardrails → handle rate limit/errors before going live.

---

## Additional reference topics
- API Reference: https://platform.claude.com/docs/en/api/overview
- Client SDKs: https://platform.claude.com/docs/en/api/client-sdks
- Release notes (API): https://platform.claude.com/docs/en/release-notes/overview
- Managed Agents: https://platform.claude.com/docs/en/managed-agents/overview
- Cookbook: https://platform.claude.com/cookbooks
