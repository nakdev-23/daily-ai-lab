---
title: "Function Calling — connect Grok to external APIs and data"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Function Calling lets Grok call functions you define to fetch real-time data, send email, update a Database, or work with any external API."
readTime: "8 min"
readers: "0"
locked: false
order: 23
---
# Function Calling — connect Grok to external APIs and data

> Reference: [Function Calling Docs](https://docs.x.ai/docs) | [Tools Overview](https://docs.x.ai/docs)

---

## What is Function Calling?

**Function Calling** (calling a function — letting Grok ask your program to do something and send the result back) lets you tell Grok what functions are available. When Grok needs data that isn't in its Training data, it "asks" you to call that function, then sends the result back before answering.

```
User: "What's the price of AAPL right now?"
    ↓
Grok: "I'd like to call get_stock_price('AAPL')"
    ↓
You: call the real API → get the price $195.50
    ↓
You: send the price back to Grok
    ↓
Grok: "Apple (AAPL) is currently $195.50 (as of 14:32)"
```

### Why not let Grok call it itself?

- **Security** — you control what's allowed
- **Authentication** — Grok has no permission to access your private APIs
- **Side Effects** (actions that change the real world, e.g. sending email) — you validate before doing the real action

---

## How it works, Step-by-Step

```
Step 1: You define the tool schema (the tool's blueprint — name, description, parameters)
Step 2: Send the request with tools to Grok
Step 3: Grok sends back a tool_call (if needed)
Step 4: You call the real function and get a result
Step 5: Send the result back to Grok
Step 6: Grok gives the final answer
```

---

## Basic example — check a stock price

```python
import json
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# Step 1: Define the Tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get the current price of the specified stock",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock's Ticker symbol, e.g. AAPL, GOOGL, PTT.BK",
                    },
                    "currency": {
                        "type": "string",
                        "enum": ["USD", "THB"],
                        "description": "The desired currency",
                    },
                },
                "required": ["symbol"],
            },
        },
    }
]

# Your real function (example)
def get_stock_price(symbol: str, currency: str = "USD") -> dict:
    # In reality you'd call a Stock API like Yahoo Finance, Alpha Vantage
    mock_prices = {
        "AAPL": 195.50,
        "GOOGL": 140.25,
        "PTT.BK": 32.75,
    }
    price = mock_prices.get(symbol.upper(), 0)
    return {
        "symbol": symbol,
        "price": price,
        "currency": currency,
        "timestamp": "2025-06-10T14:32:00Z"
    }

# Step 2: Send the Request
messages = [{"role": "user", "content": "What are the prices of Apple and PTT stock right now?"}]

response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
)

# Step 3: Check whether Grok wants to call a Function
while response.choices[0].finish_reason == "tool_calls":
    tool_calls = response.choices[0].message.tool_calls
    
    # Add the assistant message (with tool_calls) to the history
    messages.append(response.choices[0].message)
    
    # Step 4: Call every Function Grok requested
    for tool_call in tool_calls:
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)
        
        print(f"Grok requested: {function_name}({function_args})")
        
        if function_name == "get_stock_price":
            result = get_stock_price(**function_args)
        
        # Step 5: Send the result back
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result, ensure_ascii=False),
        })
    
    # Step 6: Send again with the results
    response = client.chat.completions.create(
        model="grok-4.3",
        messages=messages,
        tools=tools,
    )

# Show the final answer
print(response.choices[0].message.content)
```

---

## Parallel Function Calling

**Parallel Function Calling** (calling several functions at once — saving time instead of calling one at a time):

```python
# Grok can call get_stock_price("AAPL") and get_stock_price("GOOGL") at the same time
# No need to wait for one at a time

# Process every tool call first, then send the combined results back
tool_results = []
for tool_call in tool_calls:
    result = execute_function(tool_call)
    tool_results.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result),
    })

# Send all results at once
messages.extend(tool_results)
```

---

## Tool Choice — control function use

**Tool Choice** (specifying whether Grok will call a function or not):

```python
# auto (default) — Grok decides on its own
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

# required — force it to call at least 1 function
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice="required",
)

# none — forbid calling any function
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice="none",
)

# Force calling a specific function
response = client.chat.completions.create(
    model="grok-4.3",
    messages=messages,
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "get_stock_price"},
    },
)
```

---

## A real example — a full AI Assistant

**Agent Loop** (the AI's working cycle — Grok calls a function, sees the result, then decides what to do next):

```python
import json
import smtplib
import requests
from datetime import datetime
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

# --- Define several Tools ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the weather of the specified city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["city"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "Send an email to the specified recipient",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {"type": "string", "description": "Recipient email"},
                    "subject": {"type": "string", "description": "Email subject"},
                    "body": {"type": "string", "description": "Email body"},
                },
                "required": ["to", "subject", "body"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "Get the current date and time",
            "parameters": {
                "type": "object",
                "properties": {
                    "timezone": {"type": "string", "description": "e.g. Asia/Bangkok"},
                },
                "required": [],
            },
        },
    },
]

# --- Implement the Functions ---
def get_weather(city: str, unit: str = "celsius") -> dict:
    return {"city": city, "temp": 35, "unit": unit, "condition": "hot and humid"}

def send_email(to: str, subject: str, body: str) -> dict:
    # In reality use smtplib or the SendGrid API
    print(f"[Simulation] Sending email to {to}: {subject}")
    return {"status": "sent", "to": to, "timestamp": datetime.now().isoformat()}

def get_current_time(timezone: str = "Asia/Bangkok") -> dict:
    return {"datetime": datetime.now().isoformat(), "timezone": timezone}

FUNCTION_MAP = {
    "get_weather": get_weather,
    "send_email": send_email,
    "get_current_time": get_current_time,
}

# --- Agent Loop ---
def run_agent(user_message: str) -> str:
    messages = [
        {"role": "system", "content": "You are an AI Assistant that helps manage tasks and provide information"},
        {"role": "user", "content": user_message},
    ]
    
    for _ in range(10):  # max 10 rounds (the maximum — prevents an infinite loop)
        response = client.chat.completions.create(
            model="grok-4.3",
            messages=messages,
            tools=tools,
        )
        
        if response.choices[0].finish_reason != "tool_calls":
            return response.choices[0].message.content
        
        # Process tool calls
        messages.append(response.choices[0].message)
        
        for tool_call in response.choices[0].message.tool_calls:
            fn = FUNCTION_MAP.get(tool_call.function.name)
            args = json.loads(tool_call.function.arguments)
            result = fn(**args) if fn else {"error": "function not found"}
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result, ensure_ascii=False),
            })
    
    return "Out of rounds"

# Test
print(run_agent("What's the weather in Bangkok today? And send a report to boss@company.com"))
```

---

## Pydantic for Type-safe Tools

**Type-safe** (safe with respect to data types — guaranteeing the received data is always the right type):

```python
from pydantic import BaseModel, Field
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_XAI_API_KEY",
    base_url="https://api.x.ai/v1",
)

class SearchParams(BaseModel):
    query: str = Field(description="The search term")
    max_results: int = Field(default=10, ge=1, le=100, description="Max number of results")
    language: str = Field(default="th", description="Language, e.g. th, en")

# Convert Pydantic → JSON Schema automatically
tool_schema = {
    "type": "function",
    "function": {
        "name": "search_database",
        "description": "Search data in the database",
        "parameters": SearchParams.model_json_schema(),
    },
}
```

---

## Cautions

- **Validate before acting** — always check the arguments (the values Grok sends); they may be abnormal
- **Handle Errors** — if calling a Function errors, send an error message back too
- **Max 200 tools** — include no more than 200 tools per request
- **Description matters** — Grok decides to call a function from the description, so write it clearly
- **Circular loops** — set max iterations to prevent an infinite loop
