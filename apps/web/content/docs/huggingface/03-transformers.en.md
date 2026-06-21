---
title: "Hugging Face: Transformers — use models with code"
tool: "Hugging Face"
icon: "tool-huggingface"
level: "intermediate"
summary: "Use the transformers library to load and run models from the Hub with a simple pipeline"
readTime: "6 min"
readers: "0"
locked: false
order: 3
---

# Transformers — Hugging Face's core library 🐍

> Compiled in English from the official docs at [huggingface.co/docs/transformers](https://huggingface.co/docs/transformers)

**Transformers** is the popular Python library that loads and runs models from the Hub in just a few lines. It supports PyTorch / TensorFlow / JAX.

## ⚡ The easiest way: pipeline

`pipeline` wraps everything (loading the model + preparing the data + running) for you.

```python
from transformers import pipeline

# Analyze the sentiment of text
clf = pipeline("sentiment-analysis")
print(clf("I love studying AI so much!"))

# Generate text
gen = pipeline("text-generation", model="gpt2")
print(gen("Once upon a time"))
```

## 🧩 Commonly used tasks

| task | What it does |
|---|---|
| `text-generation` | Continue generating text |
| `sentiment-analysis` | Analyze sentiment |
| `translation` | Translate languages |
| `summarization` | Summarize |
| `image-classification` | Classify images |
| `automatic-speech-recognition` | Transcribe audio to text |

## 🔧 More control

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
tok = AutoTokenizer.from_pretrained("model-name")
model = AutoModelForCausalLM.from_pretrained("model-name")
```
Use this when you need control over the details (e.g. batching, generate settings)

## 💡 Tips

- Install: `pip install transformers torch`
- Large models may take a while to download the first time — they'll be cached
- See code examples on each model's Model Card

## 🔗 References

- Transformers docs: https://huggingface.co/docs/transformers
