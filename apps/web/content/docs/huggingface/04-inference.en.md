---
title: "Hugging Face: Inference — call models via an API"
tool: "Hugging Face"
icon: "tool-huggingface"
level: "intermediate"
summary: "Call models on Hugging Face via the Inference API / Endpoints without setting up your own server"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---

# Inference — run models without a server ☁️

> Compiled in English from the official docs at [huggingface.co/docs](https://huggingface.co/docs/inference-providers)

If you don't want to download a model and run it yourself, Hugging Face offers a service to **call models via an API** in the cloud.

## 🗂️ Two main types

| Type | Good for |
|---|---|
| **Inference Providers / API** | Trying it out / light work, calling ready-made models instantly |
| **Inference Endpoints** | Serious work — your own dedicated server, scalable |

## ▶️ Example API call

```python
from huggingface_hub import InferenceClient
client = InferenceClient(token="YOUR_HF_TOKEN")
out = client.text_generation("Explain AI briefly", model="model-name")
print(out)
```

Or via HTTP:
```bash
curl https://router.huggingface.co/... \
  -H "Authorization: Bearer YOUR_HF_TOKEN" \
  -d '{"inputs": "Hello"}'
```

## 🔑 Token

You need an **Access Token** (create one on your account's Settings page), passed as a Bearer token in the call.

## 💡 Which one to choose

- Just experimenting / low volume → Inference API/Providers
- Need consistent speed + high volume → Inference Endpoints (you pay for the server)

## 🔗 References

- Inference docs: https://huggingface.co/docs/inference-providers
