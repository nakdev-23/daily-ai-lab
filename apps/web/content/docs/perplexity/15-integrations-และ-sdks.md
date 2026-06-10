---
title: "Integrations และ SDKs — เชื่อมต่อกับ Framework ต่างๆ"
tool: "Perplexity"
icon: "icon-docs"
level: "pro"
summary: "รายชื่อ Framework, Library, และเครื่องมือกว่า 20 ตัวที่รองรับ Perplexity API พร้อมวิธีเชื่อมต่อ"
readTime: "7 นาที"
readers: "0"
locked: false
order: 15
---

# Integrations และ SDKs — เชื่อมต่อกับ Framework ต่างๆ

Perplexity API รองรับการเชื่อมต่อกับ Framework (กรอบการพัฒนา — ชุดเครื่องมือสำเร็จรูปสำหรับพัฒนา Software) และเครื่องมือยอดนิยมกว่า 20 รายการ ทำให้นักพัฒนาสามารถใช้ความสามารถของ Perplexity ในสภาพแวดล้อมที่คุ้นเคยอยู่แล้ว

---

## Official SDKs (SDK ทางการ)

### Python SDK
```bash
pip install perplexityai
```

```python
from perplexityai import Perplexity, AsyncPerplexity

# Synchronous (รอผลลัพธ์ก่อนทำงานต่อ)
client = Perplexity()

# Asynchronous (ทำงานพร้อมกันได้หลายอัน)
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

### LangChain (เฟรมเวิร์กสร้าง AI Application)

**LangChain** (แลงเชน — Framework ยอดนิยมสำหรับสร้าง AI Application โดยเชื่อมต่อ LLM กับ Tools ต่างๆ):

```python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

# ใช้ Perplexity ผ่าน LangChain
llm = ChatOpenAI(
    openai_api_base="https://api.perplexity.ai/v1",
    openai_api_key="pplx-xxxxxxxx",
    model_name="openai/gpt-5.1"
)

messages = [HumanMessage(content="สรุปข่าว AI วันนี้")]
response = llm(messages)
print(response.content)
```

### LiteLLM (เรียก AI หลายผู้ให้บริการด้วย Code เดียว)

**LiteLLM** (ไลต์แอลแอลเอ็ม — Library ที่ใช้ Interface เดียวเรียก AI จากหลายผู้ให้บริการได้):

```python
from litellm import completion

response = completion(
    model="perplexity/sonar-pro",
    messages=[{"role": "user", "content": "ข่าวเด่นวันนี้"}],
    api_key="pplx-xxxxxxxx"
)
```

### Vercel AI SDK (สำหรับ Web Application)

**Vercel AI SDK** (เวอร์เซล เอไอ เอสดีเค — SDK สำหรับสร้าง AI Feature ใน Next.js และ React):

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

### AG2 (AutoGen 2 — Framework สร้าง Multi-Agent System)
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

### Agno (Framework สำหรับ Autonomous AI Agents)
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

### Mastra (TypeScript Agent Framework)
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

## RAG และ Search Frameworks

### Haystack (Framework สร้าง Search Pipeline)

**Haystack** (เฮย์สแตก — Framework เฉพาะทางสำหรับสร้างระบบค้นหาและ Question Answering):

```python
from haystack.components.generators import OpenAIGenerator

generator = OpenAIGenerator(
    model="openai/gpt-5.1",
    api_base_url="https://api.perplexity.ai/v1",
    api_key=Secret.from_env_var("PERPLEXITY_API_KEY")
)
```

### AnythingLLM (Platform จัดการ LLM)

**AnythingLLM** (แอนนี่ธิงแอลแอลเอ็ม — Platform แบบ No-code สำหรับสร้าง Knowledge Base และ Chatbot):
- ไปที่ Settings > LLM Preference
- เลือก "Generic OpenAI"
- ใส่ Base URL: `https://api.perplexity.ai/v1`
- ใส่ API Key ของ Perplexity

---

## No-Code / Low-Code Tools

### n8n (เครื่องมือ Workflow Automation แบบ Visual)

**n8n** (เอ็น-เอท-เอ็น — เครื่องมือสร้าง Automation Workflow โดยลากและวาง Node):

n8n มี Perplexity Node สำเร็จรูป:
1. เพิ่ม Node "Perplexity" ใน Workflow
2. ใส่ API Key
3. เลือก Operation: Search / Chat Completion
4. เชื่อมต่อกับ Node อื่น เช่น Google Sheets, Slack, Email

### Composio (เชื่อม AI กับ App กว่า 250 ตัว)

**Composio** (คอมโพสิโอ — Platform เชื่อม AI กับ Application ต่างๆ เช่น Gmail, GitHub, Notion):

```python
from composio_openai import ComposioToolSet, App
from openai import OpenAI

toolset = ComposioToolSet()
tools = toolset.get_tools(apps=[App.GITHUB])

# ใช้ Perplexity เป็น LLM + Composio Tools
client = OpenAI(
    base_url="https://api.perplexity.ai/v1",
    api_key="pplx-xxxxxxxx"
)
```

---

## IDE และ Code Editor Integrations

### Cursor (AI Code Editor)

**Cursor** (เคอร์เซอร์ — Code Editor ที่มี AI ช่วยเขียนโค้ด):
1. เปิด Settings > Models
2. เพิ่ม Custom Model
3. Base URL: `https://api.perplexity.ai/v1`
4. API Key: กุญแจ Perplexity ของคุณ

### OpenCode และ Claude Code

Perplexity รองรับการใช้งานใน Terminal-based AI coding tools เช่น OpenCode และ Claude Code ผ่าน OpenAI-compatible configuration

---

## MCP Server (Model Context Protocol)

**MCP** (Model Context Protocol — มาตรฐานเปิดสำหรับให้ AI เชื่อมต่อกับเครื่องมือและข้อมูลต่างๆ) ของ Perplexity:

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

## สรุป Integrations ทั้งหมด

| หมวดหมู่ | Framework / Tool |
|---|---|
| Official SDKs | Python, TypeScript, Dart/Flutter |
| AI Frameworks | LangChain, LiteLLM, Vercel AI SDK |
| Agent Frameworks | AG2, Agno, CAMEL-AI, Mastra |
| Search / RAG | Haystack, AnythingLLM |
| Automation | n8n, Composio, Pipedream |
| Code Editors | Cursor, OpenCode, Claude Code |
| Infrastructure | LiveKit Agents (Voice AI), SuperPlane |
| Protocol | MCP Server |

ไม่ว่าจะทำงานบน Stack ใด Perplexity มีทางเชื่อมต่อให้เสมอ ทำให้นำความสามารถค้นหาและ AI มาใช้ในโปรเจกต์ของคุณได้โดยไม่ต้องเปลี่ยน Tool ที่ใช้อยู่
