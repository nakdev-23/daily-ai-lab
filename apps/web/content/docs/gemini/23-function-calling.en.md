---
title: "Function Calling — connect Gemini to APIs and Tools"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Function Calling lets Gemini call functions in your app to fetch real-time data or take actions, like an AI agent controlling a system"
readTime: "10 min"
readers: "0"
locked: false
order: 23
---

# Function Calling — connect Gemini to APIs and Tools

**Function Calling** (the AI telling you which command it should call in your app) is the ability for Gemini to specify "which function to call" and "with what parameters," instead of answering from knowledge alone — turning Gemini into an AI agent (an AI agent that can take actions) able to interact with the outside world.

> **Important:** Gemini doesn't "run" the function itself; it says "you should call this function with these arguments (values passed into a function)," and your app runs it and returns the result.

---

## Why use Function Calling?

| Use case | Example |
|---|---|
| Fetch real-time data | Exchange rates, stock prices, weather |
| Take action | Send an email, save data in a database |
| Connect to an API | Call an internal REST API |
| Calculate | Run code for math or data processing |
| Control IoT (internet-connected devices) | Turn smart-home devices on/off |

---

## How Function Calling works

The process has 4 steps:

```
1. You: define function declarations + send the user prompt
        ↓
2. Gemini: analyze which function to call and with what args (parameter values)
        ↓
3. You: actually run the function and get the result
        ↓
4. Gemini: use the result to create an answer for the user
```

---

## Defining a Function Declaration

A function declaration uses JSON Schema format (a standard JSON data structure):

```python
tools = [
    {
        "function_declarations": [
            {
                "name": "get_weather",
                "description": "Get the current weather of a specified city",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {
                            "type": "string",
                            "description": "City name, e.g. Bangkok, Chiang Mai"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "Temperature unit"
                        }
                    },
                    "required": ["city"]
                }
            }
        ]
    }
]
```

---

## Full code example (Python)

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

# Define the function your app actually runs
def get_weather(city: str, unit: str = "celsius") -> dict:
    # In reality this would call a Weather API
    return {
        "city": city,
        "temperature": 32,
        "unit": unit,
        "condition": "Partly cloudy",
        "humidity": 75
    }

# Function declarations to tell Gemini
tools = [{
    "function_declarations": [{
        "name": "get_weather",
        "description": "Get the current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }]
}]

# Send the prompt + tools
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What's the weather in Bangkok today?",
    config={"tools": tools}
)

# Check whether Gemini requested a function call
if response.candidates[0].content.parts[0].function_call:
    func_call = response.candidates[0].content.parts[0].function_call
    
    # Run the real function
    result = get_weather(**func_call.args)
    
    # Send the result back to Gemini
    final_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            {"role": "user", "parts": [{"text": "What's the weather in Bangkok today?"}]},
            {"role": "model", "parts": [{"function_call": func_call}]},
            {"role": "tool", "parts": [{"function_response": {
                "name": func_call.name,
                "response": result
            }}]}
        ],
        config={"tools": tools}
    )
    
    print(final_response.text)
```

---

## Parallel Function Calling (call several functions at once)

Gemini can call several functions at once in a single response:

```
User: "Tell me the weather in Bangkok, Chiang Mai, and Phuket"

Gemini calls:
→ get_weather("Bangkok")      (at the same time)
→ get_weather("Chiang Mai")   (at the same time)
→ get_weather("Phuket")       (at the same time)
```

Each function call has a unique `id` to map back to its response.

---

## Compositional Function Calling (call functions in sequence)

Function calls that depend on each other's results:

```
User: "Find recommended restaurants near me"

Step 1: Gemini calls get_location() → Bangkok
Step 2: Gemini calls search_restaurants(location="Bangkok") → restaurant list
Step 3: Gemini answers with recommendations
```

---

## Automatic Function Calling (Python only)

The Python SDK (developer toolkit) supports automatic function calling — no need to handle the loop yourself:

```python
from google import genai

def get_stock_price(ticker: str) -> float:
    """Get a stock price
    
    Args:
        ticker: stock name, e.g. AAPL, GOOGL
    
    Returns:
        The latest closing price
    """
    # In reality this would call a Stock API
    return 150.25

client = genai.Client(api_key="YOUR_API_KEY")

# Pass the Python function directly — the SDK handles the declaration and execution
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What's the current AAPL stock price?",
    config={"tools": [get_stock_price]}  # pass the function object directly
)

print(response.text)
```

---

## Best Practices

### 1. Write clear descriptions
```python
# Bad
"description": "get data"

# Good
"description": "Fetch daily sales data from the CRM (customer relationship management) system for a specified date range, supporting filtering by product category and sales region"
```

### 2. Limit the number of functions per request
- Recommended **10–20 functions** per request maximum
- Too many makes it hard for Gemini to choose and it may choose wrong

### 3. Use a low temperature (creativity value) for function calling
```python
config = {
    "temperature": 0.1,  # low = predictable = more accurate function choice
    "tools": tools
}
```

### 4. Validate before executing
```python
# For important actions, ask for confirmation first
if func_call.name == "delete_user":
    if confirm_with_user():  # ask the user first
        execute_delete(func_call.args)
```

### 5. Error handling
```python
try:
    result = run_function(func_call)
except Exception as e:
    result = {"error": str(e)}
    # Send the error back to Gemini to handle — it explains the problem to the user
```

---

## Function Calling vs Grounding with Search

| | Function Calling | Grounding with Search |
|---|---|---|
| Use | Call custom APIs/tools | Search Google Search |
| Setup | Must define declarations | Turn on a single flag |
| Data | From your system | From the web |
| Good for | Internal data, actions | Real-time data, news |
