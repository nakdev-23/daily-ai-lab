---
title: "Tool Use and Function Calling — let Claude call functions"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Learn how to let Claude call functions and external APIs, covering client tools, server tools, tool choice, and the full agentic loop"
readTime: "12 min"
readers: "0"
locked: false
order: 11
---

## What is Tool Use?

Tool use (or function calling — the AI's ability to instruct a program to do something instead of just answering with text) is the capability that lets Claude **call functions you define** instead of just answering with text. Claude sends back an instruction saying which function it wants to call, with the correct arguments (the parameter values passed into the function).

Example: if you ask Claude "What's the weather in Bangkok today?", Claude doesn't know real-time (current) data, but if you provide a `get_weather` tool, Claude calls that tool with the argument `{ "location": "Bangkok" }` and uses the result to answer.

---

## Types of Tool

### 1. Client Tools (User-Defined Tools)

Tools you create yourself and **run on your application's side**

Flow:
1. You send the tools definition (a description of the tools Claude can choose from) with the request
2. Claude responds with `stop_reason: "tool_use"` and a `tool_use` block
3. Your application runs the real function
4. Send the `tool_result` (the function's result) back to Claude
5. Claude answers with the obtained data

### 2. Server Tools (Anthropic-Provided Tools)

Tools that **Anthropic runs** so you don't have to handle execution yourself, including:
- `web_search` — search for information on the internet
- `code_execution` — run Python code
- `web_fetch` — fetch data from a URL
- `text_editor` — edit text files
- `bash` — run shell (command-line) commands

---

## Tool Definition

### Basic structure

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather of the specified city",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City or place name, e.g. 'Bangkok, Thailand'"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit"
                }
            },
            "required": ["location"]
        }
    }
]

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "What's the weather like in Bangkok?"}
    ]
)
```

---

## Tool Call Lifecycle (Agentic Loop)

### All the steps

```
1. User → Claude: send a message + tools definition
2. Claude → App:  send a tool_use block (Claude needs data)
3. App → Function: run the real function
4. App → Claude:  send the tool_result back
5. Claude → User: answer with the data from the tool result
```

### Full code example

```python
import anthropic
import json

client = anthropic.Anthropic()

# Assume this function connects to a real weather API
def get_weather(location: str, unit: str = "celsius") -> dict:
    return {
        "location": location,
        "temperature": 32,
        "unit": unit,
        "condition": "sunny",
        "humidity": 75
    }

tools = [
    {
        "name": "get_weather",
        "description": "Get weather data",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
]

messages = [{"role": "user", "content": "What's the weather in Bangkok?"}]

# Step 1: send the first request
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

# Step 2: check whether Claude wants a tool
if response.stop_reason == "tool_use":
    # find the tool_use block
    tool_use = next(b for b in response.content if b.type == "tool_use")
    
    # Step 3: run the function
    tool_result = get_weather(**tool_use.input)
    
    # Step 4: send the result back
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": json.dumps(tool_result)
            }
        ]
    })
    
    # Step 5: ask Claude for the final answer
    final_response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )
    print(final_response.content[0].text)
```

---

## Tool Choice — control tool use

### Supported values

| Tool Choice | Meaning |
|-------------|----------|
| `{"type": "auto"}` | Claude decides whether to use a tool or answer directly (default) |
| `{"type": "any"}` | Claude must use at least one tool |
| `{"type": "tool", "name": "..."}` | Force the use of the specified tool |
| `{"type": "none"}` | Forbid using tools |

```python
# Force the use of a specific tool
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "get_weather"},
    messages=[{"role": "user", "content": "Ask about the weather"}]
)
```

---

## Strict Tool Use

Add `strict: true` to make Claude's output match the schema (the defined data structure) 100%:

```python
tools = [
    {
        "name": "create_calendar_event",
        "description": "Create a calendar appointment",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "date": {"type": "string", "format": "date"},
                "time": {"type": "string"}
            },
            "required": ["title", "date", "time"]
        },
        "strict": True  # force the output to match the schema
    }
]
```

---

## Parallel Tool Calls

Claude can call multiple tools at once to increase speed:

```python
# Claude may send multiple tool_use blocks at once
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[weather_tool, news_tool, calendar_tool],
    messages=[{
        "role": "user",
        "content": "Tell me the weather, today's news, and tomorrow's appointments"
    }]
)

# Check all the tool calls
tool_calls = [b for b in response.content if b.type == "tool_use"]
# You may get 3 tool_use blocks at once
```

---

## Server Tools (Anthropic-Provided)

### Web Search Tool

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user", "content": "Latest news about AI in 2026"}]
)
# Claude searches and answers automatically, no execution handling needed
```

### Web Search pricing
- **$10 per 1,000 searches** (plus standard token costs)

### Code Execution Tool

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=4096,
    tools=[{"type": "code_execution_20250522", "name": "code_execution"}],
    messages=[{
        "role": "user",
        "content": "Compute the first 20 numbers of the Fibonacci sequence and plot a graph"
    }]
)
```

---

## Handling Errors in Tool Results

```python
# If the function errors, send the error in the tool_result
messages.append({
    "role": "user",
    "content": [
        {
            "type": "tool_result",
            "tool_use_id": tool_use.id,
            "content": "Error: could not connect to the weather API",
            "is_error": True  # tell Claude an error occurred
        }
    ]
})
```

---

## The cost of Tool Use

Tool use increases tokens from:

1. The **tools definition** sent in the `tools` parameter
2. The **tool_use blocks** in Claude's response
3. The **tool_result blocks** you send back
4. The **system prompt for tools** that Anthropic adds automatically

| Model | Tool choice auto/none | Tool choice any/tool |
|-------|----------------------|---------------------|
| Claude Opus 4.8 | +290 tokens | +410 tokens |
| Claude Sonnet 4.6 | +497 tokens | +589 tokens |
| Claude Haiku 4.5 | +496 tokens | +588 tokens |

---

## Best Practices

### 1. Write a clear Description

```python
# Bad
"description": "get weather"

# Good
"description": "Get the current weather, including temperature, humidity, and sky conditions, for the specified city"
```

### 2. Clearly specify Required Fields

Always put required fields in the `required` array so Claude knows what info to ask for first.

### 3. Handle Tool Errors gracefully

Always handle the case where Claude sends a tool_use but your function errors.

### 4. Limit the number of Tools

Don't provide too many tools at once, as it adds tokens and may cause confusion; use only what's necessary.

### 5. Use Parallel Tool Calls

Let Claude call multiple tools at once to increase speed by adding an instruction to the system prompt:

```
"If there are independent tool calls, call them all at once to save time"
```

---

## Summary

Tool use is the heart of building AI agents (autonomous AI agents) with Claude:

| Topic | Summary |
|--------|------|
| **Client Tools** | You run the function; Claude just says which tool to call |
| **Server Tools** | Anthropic runs them (web search, code execution) |
| **Tool Choice** | Control whether Claude must use a tool |
| **Strict Mode** | Force the output to match the schema |
| **Parallel Calls** | Claude can call multiple tools at once |

Start with simple client tools like weather or database lookup, then expand to more complex agentic systems (multi-step autonomous AI systems).
