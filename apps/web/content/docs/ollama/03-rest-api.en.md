---
title: "Ollama: REST API & OpenAI-compatible"
tool: "Ollama"
icon: "tool-ollama"
level: "intermediate"
summary: "Call models running with Ollama from code via the REST API"
readTime: "5 min"
readers: "0"
locked: false
order: 3
---

# Call Ollama from code via the API 🔌

> Compiled in English from the official docs at [github.com/ollama/ollama](https://github.com/ollama/ollama/blob/main/docs/api.md)

When Ollama is running, it opens a local API server at **`http://localhost:11434`** so other programs can call its models.

## 🧱 Main endpoints

| Endpoint | What it's for |
|---|---|
| `POST /api/generate` | Generate text from a single prompt |
| `POST /api/chat` | Multi-message conversation (with roles) |
| `POST /api/embeddings` | Create an embedding of text |
| `GET /api/tags` | See the models on your machine |

## ▶️ generate example

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Explain AI in 2 sentences",
  "stream": false
}'
```

## ▶️ chat example

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role":"user","content":"Hello"}]
}'
```

## 🔄 OpenAI-compatible

Ollama also has an **OpenAI-compatible** endpoint at `/v1/...` — you can use the OpenAI SDK by pointing the base URL to `http://localhost:11434/v1`, making it easy to migrate existing code.

## 💡 Tips

- Set `"stream": true` to receive the result piece by piece (faster response)
- Running on your machine = data goes nowhere, great for privacy-sensitive work

## 🔗 References

- API docs: https://github.com/ollama/ollama/blob/main/docs/api.md
