---
title: "Ollama: Modelfile — customize your own model"
tool: "Ollama"
icon: "tool-ollama"
level: "intermediate"
summary: "Use a Modelfile to define the personality, parameters, and system prompt of your own customized model"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---

# Modelfile — create your own version of a model 🛠️

> Compiled in English from the official docs at [github.com/ollama/ollama](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)

A **Modelfile** is a recipe file (similar to a Dockerfile) used to create your own customized version of a model — defining its personality, parameter values, and system message, building on an existing model.

## 📄 Example Modelfile

```dockerfile
FROM llama3.2

# Set the personality/role
SYSTEM "You are an English tutor who explains hard topics simply and speaks politely"

# Adjust parameters
PARAMETER temperature 0.7
PARAMETER num_ctx 8192
```

## 🔧 Main instructions in a Modelfile

| Instruction | What it does |
|---|---|
| `FROM` | The base model to build on |
| `SYSTEM` | The system message (personality/role) |
| `PARAMETER` | Set values like temperature, num_ctx |
| `TEMPLATE` | The model's prompt format |
| `ADAPTER` | Add a LoRA adapter (advanced) |

## ▶️ Create and use it

```bash
# Create a model from the Modelfile
ollama create my-tutor -f ./Modelfile

# Run your customized model
ollama run my-tutor
```

## 💡 What it's good for

- Making a specialized assistant (e.g. a tutor, a coding assistant) with a consistent personality
- Locking in parameter values so the team uses the same ones

## 🔗 References

- Modelfile docs: https://github.com/ollama/ollama/blob/main/docs/modelfile.md
