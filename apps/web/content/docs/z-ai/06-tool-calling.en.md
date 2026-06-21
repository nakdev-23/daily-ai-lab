---
title: "Z.ai: Tool / Function Calling — let the model call tools"
tool: "Z.ai"
icon: "tool-z-ai"
level: "pro"
summary: "Let GLM call functions/tools you define to do real work"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---

# Tool / Function Calling 🛠️

> Compiled in English from the official docs at [docs.z.ai](https://docs.z.ai/)

**Tool calling** lets you tell the model what "tools" are available to call (e.g. check the weather, search a database). When needed, the model says which tool to call with which parameters, then you run it and send the result back.

## 🔄 The workflow

1. Send the question + a list of **tools** (name + description + parameter schema)
2. The model replies with which tool to call, along with arguments
3. **You run the real function** in your code
4. Send the result back; the model summarizes the final answer

## 🧱 Example tool definition

```python
tools = [{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get the weather of a city",
    "parameters": {
      "type": "object",
      "properties": {"city": {"type": "string"}},
      "required": ["city"]
    }
  }
}]

r = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role":"user","content":"What's the weather in Bangkok today?"}],
    tools=tools,
)
# Check r.choices[0].message.tool_calls, then run the real function
```

## 💡 Tips

- Write the tool's `description` clearly so the model chooses correctly
- Use it together with an agent for multi-step work
- Always check/validate the arguments before actually running

## 🔗 References

- Official docs: https://docs.z.ai/
