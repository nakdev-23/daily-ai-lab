---
title: "Code Execution and other Tools in the Gemini API"
tool: "Gemini"
icon: "tool-gemini"
level: "pro"
summary: "Get to know the Gemini API's built-in tools — Code Execution for running Python, URL Context for reading the web, Google Maps, and Computer Use for controlling a computer"
readTime: "9 min"
readers: "0"
locked: false
order: 30
---

# Code Execution and other Tools in the Gemini API

The Gemini API has **built-in tools** (ready to use immediately without building them yourself) that let the model do things beyond answering general questions. This chapter covers Code Execution, URL Context, Google Maps, and Computer Use.

---

## Code Execution Tool

### How it works

When the Code Execution tool is on, Gemini can:
1. **Write Python code** as needed
2. **Actually run the code** in a sandbox environment (a test space separated from the main system — safe)
3. **See the result** and adjust if it's wrong
4. **Answer the user** with a result from real computation

### Enable Code Execution

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Compute the factorial (the product of all numbers from 1 to n) of 15 and find the sum of prime numbers less than 100",
    config={
        "tools": [{"code_execution": {}}]
    }
)

# View the code that ran and the result
for part in response.candidates[0].content.parts:
    if hasattr(part, 'executable_code'):
        print("--- Code that ran ---")
        print(part.executable_code.code)
    elif hasattr(part, 'code_execution_result'):
        print("--- Result ---")
        print(part.code_execution_result.output)
    else:
        print("--- Answer ---")
        print(part.text)
```

### Example output

```
--- Code that ran ---
import math

# Factorial of 15
fact_15 = math.factorial(15)
print(f"Factorial of 15: {fact_15}")

# Sum of primes < 100
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5)+1):
        if n % i == 0: return False
    return True

primes = [n for n in range(2, 100) if is_prime(n)]
print(f"Sum of primes < 100: {sum(primes)}")

--- Result ---
Factorial of 15: 1307674368000
Sum of primes < 100: 1060

--- Answer ---
The factorial of 15 = 1,307,674,368,000
and the sum of prime numbers less than 100 = 1,060
```

### Analyze data with Code Execution

```python
csv_data = """
product,sales,revenue
Product A,150,45000
Product B,230,69000
Product C,89,26700
Product D,310,93000
"""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"Analyze this data and create a summary of statistics:\n{csv_data}",
    config={"tools": [{"code_execution": {}}]}
)
```

### Key info about Code Execution

| Info | Details |
|---|---|
| Language | Python only (runs), other languages (can write but not run) |
| Timeout | 30 seconds |
| Retries | Up to 5 |
| Libraries (code toolkits) | 40+ including NumPy, Pandas, Matplotlib, TensorFlow, sklearn |
| Can't install more | Only the provided libraries |
| Cost | Normal token price (no special fee) |

### Available libraries

```
data:          pandas, numpy, scipy
visualization: matplotlib, seaborn, plotly
ML/AI:         scikit-learn, tensorflow, torch
utilities:     datetime, json, re, math, statistics
web:           requests, beautifulsoup4
text:          nltk, spacy
```

---

## URL Context Tool (reads content from a URL)

Have Gemini read content from a URL (a website address) and use it to answer:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Summarize this article: https://example.com/article/ai-news-2025",
    config={
        "tools": [{"url_context": {}}]
    }
)
```

### Use several URLs at once

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        "Compare the content from these 2 URLs:",
        "https://site1.com/article",
        "https://site2.com/article"
    ],
    config={"tools": [{"url_context": {}}]}
)
```

### URL Context vs Grounding with Search

| | URL Context | Grounding with Search |
|---|---|---|
| Used for | Reading a specified URL | Searching Google then reading |
| Control of the source | ✓ You choose the URL | ✗ Gemini chooses |
| Good for | Reading a specific article | General real-time data |

---

## Google Maps Tool (finds places)

Have Gemini find place information:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Find Thai restaurants in the Silom area of Bangkok that are open late",
    config={
        "tools": [{"google_maps": {}}]
    }
)
```

### What the Google Maps Tool can do

- Find places, restaurants, businesses
- See opening hours, ratings, reviews
- Find directions
- See address and contact information

---

## Computer Use Tool (controls the computer, Preview)

An advanced ability that lets Gemini control a computer's UI (User Interface — the screen you see and click):

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        screenshot_image,
        "Click the Submit button on this screen"
    ],
    config={
        "tools": [{"computer_use": {}}]
    }
)

# Gemini responds with the action it should take
action = response.candidates[0].content.parts[0].computer_use
print(f"Action: {action.type}")      # "click"
print(f"Coordinate: {action.coordinate}")  # [x, y]
```

### What can Computer Use do?

| Action | Details |
|---|---|
| `click` | Click an element on the screen |
| `type` | Type text |
| `scroll` | Scroll the screen |
| `key` | Press a keyboard key |
| `screenshot` | Take a screenshot |

> **Note:** Computer Use is still in Preview. Use it carefully; good for automation and testing.

---

## Use several Tools at once

You can combine tools in a single request:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Analyze the data from this URL and create a chart: https://data.example.com/sales.csv",
    config={
        "tools": [
            {"url_context": {}},      # read the URL
            {"code_execution": {}}    # create a chart with Python
        ]
    }
)
```

### The order Gemini handles the tools

```
1. Read the URL → pull the data
2. Write Python code (pandas + matplotlib)
3. Run the code → create the chart
4. Answer the user with the chart and analysis
```

---

## Summary: which Tool to choose?

| What you want to do | Tool to use |
|---|---|
| Run Python, compute, analyze data | Code Execution |
| Read an article from a URL | URL Context |
| Find real-time data from the web | Grounding with Search |
| Connect to your own API | Function Calling |
| Find places | Google Maps |
| Control a UI (screen) | Computer Use |
| Store/retrieve vectors (numbers representing meaning) | Embeddings |
| Save tokens (reduce cost) | Context Caching |
