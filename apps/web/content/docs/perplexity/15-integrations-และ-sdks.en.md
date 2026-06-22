---
title: "Integrations and SDKs — connect to various Frameworks"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "A list of over 20 Frameworks, Libraries, and tools that support the Perplexity API, with how to connect"
readTime: "7 min"
readers: "0"
locked: false
order: 15
---

# Integrations and SDKs — connect to various Frameworks

The Perplexity API supports connecting to over 20 popular Frameworks (development frameworks — ready-made toolkits for developing Software) and tools, letting developers use Perplexity's capabilities in environments they're already familiar with.

---

## Official SDKs

### Python SDK
```bash
pip install perplexityai
```

```python
from perplexityai import Perplexity, AsyncPerplexity

# Synchronous (wait for the result before continuing)
client = Perplexity()

# Asynchronous (can run several at once)
async_client = AsyncPerplexity()
```

### TypeScript / JavaScript SDK
```bash
npm install @perplexity-ai/perplexity_ai
```

```typescript
import { Perplexity } from "@perplexity-ai/perplexity_ai";
const client = new Perplexity();
```

### Dart / Flutter SDK
```yaml
# pubspec.yaml
dependencies:
  perplexity_ai: ^1.0.0
```

```dart
import 'package:perplexity_ai/perplexity_ai.dart';
final client = Perplexity();
```

---

## AI Framework Integrations

### LangChain (a framework for building AI Applications)

**LangChain** (a popular Framework for building AI Applications by connecting LLMs to various Tools):

```python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

# Use Perplexity via LangChain
llm = ChatOpenAI(
    openai_api_base="https://api.perplexity.ai/v1",
    openai_api_key="pplx-xxxxxxxx",
    model_name="openai/gpt-5.1"
)

messages = [HumanMessage(content="Summarize today's AI news")]
response = llm(messages)
print(response.content)
```

### LiteLLM (call multiple AI providers with one piece of Code)

**LiteLLM** (a Library that uses one Interface to call AI from many providers):

```python
from litellm import completion

response = completion(
    model="perplexity/sonar-pro",
    messages=[{"role": "user", "content": "Top news today"}],
    api_key="pplx-xxxxxxxx"
)
```

### Vercel AI SDK (for Web Applications)

**Vercel AI SDK** (an SDK for building AI Features in Next.js and React):

```typescript
// app/api/chat/route.ts
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const perplexity = createOpenAI({
  baseURL: "https://api.perplexity.ai/v1",
  apiKey: process.env.PERPLEXITY_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: perplexity("openai/gpt-5.1"),
    messages,
  });
  
  return result.toDataStreamResponse();
}
```

---

## AI Agent Frameworks

### AG2 (AutoGen 2 — a framework for building a Multi-Agent System)
```python
from autogen import AssistantAgent, UserProxyAgent

config = {
    "config_list": [{
        "model": "openai/gpt-5.1",
        "base_url": "https://api.perplexity.ai/v1",
        "api_key": "pplx-xxxxxxxx"
    }]
}

assistant = AssistantAgent("assistant", llm_config=config)
```

### Agno (a Framework for Autonomous AI Agents)
```python
from agno.agent import Agent
from agno.models.openai import OpenAILike

agent = Agent(
    model=OpenAILike(
        id="openai/gpt-5.1",
        base_url="https://api.perplexity.ai/v1",
        api_key="pplx-xxxxxxxx"
    )
)
```

### Mastra (a TypeScript Agent Framework)
```typescript
import { createAgent } from "@mastra/core";

const agent = createAgent({
  model: {
    provider: "openai",
    name: "openai/gpt-5.1",
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: "https://api.perplexity.ai/v1",
  },
});
```

---

## RAG and Search Frameworks

### Haystack (a framework for building Search Pipelines)

**Haystack** (a specialized Framework for building search and Question Answering systems):

```python
from haystack.components.generators import OpenAIGenerator

generator = OpenAIGenerator(
    model="openai/gpt-5.1",
    api_base_url="https://api.perplexity.ai/v1",
    api_key=Secret.from_env_var("PERPLEXITY_API_KEY")
)
```

### AnythingLLM (an LLM management Platform)

**AnythingLLM** (a No-code Platform for building a Knowledge Base and Chatbot):
- Go to Settings > LLM Preference
- Choose "Generic OpenAI"
- Enter the Base URL: `https://api.perplexity.ai/v1`
- Enter your Perplexity API Key

---

## No-Code / Low-Code Tools

### n8n (a Visual Workflow Automation tool)

**n8n** (a tool for building Automation Workflows by dragging and dropping Nodes):

n8n has a ready-made Perplexity Node:
1. Add the "Perplexity" Node to the Workflow
2. Enter the API Key
3. Choose the Operation: Search / Chat Completion
4. Connect to other Nodes, e.g. Google Sheets, Slack, Email

### Composio (connect AI to over 250 Apps)

**Composio** (a Platform connecting AI to various Applications like Gmail, GitHub, Notion):

```python
from composio_openai import ComposioToolSet, App
from openai import OpenAI

toolset = ComposioToolSet()
tools = toolset.get_tools(apps=[App.GITHUB])

# Use Perplexity as the LLM + Composio Tools
client = OpenAI(
    base_url="https://api.perplexity.ai/v1",
    api_key="pplx-xxxxxxxx"
)
```

---

## IDE and Code Editor Integrations

### Cursor (an AI Code Editor)

**Cursor** (a Code Editor with AI to help write code):
1. Open Settings > Models
2. Add a Custom Model
3. Base URL: `https://api.perplexity.ai/v1`
4. API Key: your Perplexity key

### OpenCode and Claude Code

Perplexity supports usage in Terminal-based AI coding tools like OpenCode and Claude Code via OpenAI-compatible configuration.

---

## MCP Server (Model Context Protocol)

Perplexity's **MCP** (Model Context Protocol — an open standard for AI to connect to various tools and data):

```json
// mcp_config.json
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "pplx-xxxxxxxx"
      }
    }
  }
}
```

---

## Summary of all Integrations

| Category | Framework / Tool |
|---|---|
| Official SDKs | Python, TypeScript, Dart/Flutter |
| AI Frameworks | LangChain, LiteLLM, Vercel AI SDK |
| Agent Frameworks | AG2, Agno, CAMEL-AI, Mastra |
| Search / RAG | Haystack, AnythingLLM |
| Automation | n8n, Composio, Pipedream |
| Code Editors | Cursor, OpenCode, Claude Code |
| Infrastructure | LiveKit Agents (Voice AI), SuperPlane |
| Protocol | MCP Server |

No matter what Stack you work on, Perplexity always has a way to connect, letting you bring search and AI capabilities into your project without changing the Tools you already use.
