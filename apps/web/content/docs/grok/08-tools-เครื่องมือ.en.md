---
title: "Tools — capability-extending tools"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Tools are extra abilities Grok uses to work beyond plain text generation, in 2 types:"
readTime: "4 min"
readers: "0"
locked: false
order: 8
---
# Tools — capability-extending tools

> Reference: [Tools Overview](https://docs.x.ai/developers/tools/overview) | [Function Calling](https://docs.x.ai/developers/tools/function-calling) | [Web Search](https://docs.x.ai/developers/tools/web-search) | [X Search](https://docs.x.ai/developers/tools/x-search) | [Code Execution](https://docs.x.ai/developers/tools/code-execution) | [Collections Search](https://docs.x.ai/developers/tools/collections-search) | [Remote MCP Tools](https://docs.x.ai/developers/tools/remote-mcp)

---

## What are Tools?

**Tools** are extra abilities Grok uses to work beyond plain text generation, in 2 types:

| Type | Description | Example |
|---|---|---|
| **Built-in Tools** | Tools xAI maintains, run automatically | Web Search, X Search, Code Execution |
| **Function Calling** | Functions you write yourself for Grok to call | Pull data from a database, call an API |

---

## How Tools work

When you enable Tools, the process is:

```
1. Grok analyzes the question
2. Decides which Tool to use
3. Calls the Tool (or asks you to call it, for Function Calling)
4. Processes the result
5. Repeats until it has the full data
6. Sends the final answer with citations
```

---

## Web Search — search the internet

Reference: [Web Search](https://docs.x.ai/developers/tools/web-search)

### What is this topic?
Lets Grok search the internet, solving the knowledge-cutoff limitation so it can answer about the latest news.

### Price: **$5 per 1,000 calls**

### How to use it

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Latest news about AI in Thailand?"}],
    tools=[{"type": "web_search"}],
)

print(response.output_text)
```

### Image Understanding in Web Search

Grok can analyze images found in the search results:

```python
tools=[
    {
        "type": "web_search",
        "image_understanding": True,  # enable image analysis
    }
]
```

> Analyzed images are charged as image tokens, not a tool invocation.

### Citations
Web Search returns citations (source URLs) automatically with the answer.

---

## X Search — search X (Twitter)

Reference: [X Search](https://docs.x.ai/developers/tools/x-search)

### What is this topic?
Search posts, users, and threads on X (Twitter) directly.

### Price: **$5 per 1,000 calls**

### How to use it

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "People's opinions about the iPhone 17?"}],
    tools=[{"type": "x_search"}],
)
```

### Video Understanding in X Search

```python
tools=[
    {
        "type": "x_search",
        "video_understanding": True,  # enable video analysis
    }
]
```

---

## Code Execution — run Python code

Reference: [Code Execution](https://docs.x.ai/developers/tools/code-execution)

### What is this topic?
Lets Grok actually run Python code in a sandbox environment, so it can analyze data, compute, or create charts.

### Price: **$5 per 1,000 calls**

### What is it used for?
- Analyze data from a CSV file
- Math calculations
- Create graphs and charts
- Test code
- Process data

### How to use it

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{
        "role": "user",
        "content": "Compute the mean, median, and standard deviation of [23, 45, 12, 67, 89, 34, 56]"
    }],
    tools=[{"type": "code_interpreter"}],
)

print(response.output_text)
# Grok writes Python code, actually runs it, then shows the result
```

---

## Collections Search (RAG) — search your documents

Reference: [Collections Search](https://docs.x.ai/developers/tools/collections-search)

### What is this topic?
Lets Grok search data from Collections (document stores) you've uploaded, good for a knowledge base and FAQ.

### Price: **$2.50 per 1,000 calls**

### How to use it

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "How do I request sick leave?"}],
    tools=[
        {
            "type": "collections_search",
            "vector_store_ids": ["vs_your_collection_id"],
        }
    ],
)
```

---

## Function Calling — call your own functions

Reference: [Function Calling](https://docs.x.ai/developers/tools/function-calling)

### What is this topic?
Tell Grok what functions you have, and Grok calls them when needed. You receive the request from Grok and send the result back.

### What is it used for?
- Pull real-time stock prices
- Call an internal company database
- Send email/SMS
- Call an external API not in the Built-in Tools

### How it works

```
1. You tell Grok there's a function get_stock_price(symbol)
2. The user asks "What's the price of Apple?"
3. Grok replies "I'd like to call get_stock_price('AAPL')"
4. You call the real API, get the price $195.50
5. You send the price back to Grok
6. Grok answers "Apple (AAPL) is currently $195.50"
```

### How to use it

```python
import json
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Define the available tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the weather in a specified city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name, e.g. Bangkok"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# Send the first question
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "What's the weather in Bangkok today?"}],
    tools=tools,
)

# If Grok wants to call a function
if response.output[0].type == "function_call":
    function_call = response.output[0]
    args = json.loads(function_call.arguments)
    
    # Call the real function (example)
    weather_result = {"temperature": 35, "condition": "hot and humid"}
    
    # Send the result back to Grok
    final_response = client.responses.create(
        model="grok-4.3",
        input=[
            {"role": "user", "content": "What's the weather in Bangkok today?"},
            {"role": "assistant", "content": None, "tool_calls": [function_call]},
            {
                "role": "tool",
                "tool_call_id": function_call.call_id,
                "content": json.dumps(weather_result),
            },
        ],
        tools=tools,
    )
    
    print(final_response.output_text)
```

---

## Remote MCP Tools — connect to an MCP server

Reference: [Remote MCP Tools](https://docs.x.ai/developers/tools/remote-mcp)

### What is this topic?
**MCP (Model Context Protocol)** is an open standard that lets AI connect to external tools and data via a standard protocol.

### What is it used for?
- Connect to an internal company API
- Use third-party tools that support MCP
- Build a gateway for several tools

### Price
No tool-invocation fee — only the tokens used are charged.

### How to use it

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Pull the latest order data"}],
    tools=[
        {
            "type": "mcp",
            "server_url": "https://your-mcp-server.com/mcp",
            "headers": {"Authorization": "Bearer YOUR_MCP_TOKEN"},
        }
    ],
)
```

---

## Use several Tools at once

```python
response = client.responses.create(
    model="grok-4.3",
    input=[{"role": "user", "content": "Latest news about Tesla on X and the web?"}],
    tools=[
        {"type": "web_search"},
        {"type": "x_search"},
        {"type": "code_interpreter"},
    ],
    stream=True,
)
```

---

## Tools pricing summary

| Tool | Price |
|---|---|
| Web Search | $5 / 1,000 calls |
| X Search | $5 / 1,000 calls |
| Code Execution | $5 / 1,000 calls |
| File Attachments | $10 / 1,000 calls |
| Collections Search | $2.50 / 1,000 calls |
| Image Understanding | Charged by image tokens |
| Remote MCP | Charged by tokens only |
