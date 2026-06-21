---
title: "What is Hugging Face — the world's largest AI model hub"
tool: "Hugging Face"
icon: "tool-huggingface"
level: "beginner"
summary: "An overview of Hugging Face, the home of open AI models, datasets, and tools"
readTime: "7 min"
readers: "0"
locked: false
order: 1
---

# Hugging Face — the home of open AI models 🤗

> Compiled in English from the official docs at [huggingface.co/docs](https://huggingface.co/docs)

**Hugging Face** is the world's largest platform and community for AI/Machine Learning — like the "GitHub of the AI world," where researchers and developers everywhere come to **share models, datasets, and demo apps** for free. There are hundreds of thousands of models to choose from, from language, image, and audio models to video.

## 📖 Terms worth knowing

| Term | Plain meaning |
|---|---|
| **Hub** | The central place where everyone uploads and shares models/datasets/apps |
| **Model** | A pre-trained AI model, ready to use |
| **Dataset** | A dataset for training or testing a model |
| **Space** | An AI demo app that runs in the browser instantly (often built with Gradio/Streamlit) |
| **Transformers** | The popular Python library for loading and using models |
| **Inference** | Running a model to do its work (make a prediction) |

## ⭐ Main components (per the official docs menu)

- **Hub** — browse, download, and upload models/datasets/Spaces
- **Transformers** — the main library for loading and running models (supports PyTorch/TensorFlow/JAX)
- **Datasets** — easily load and manage large datasets
- **Spaces** — create/share AI demo apps on the web for free
- **Inference (API & Endpoints)** — call models via an API without setting up your own server
- **AutoTrain** — train your own model with almost no code

## 🚀 Getting started

1. Sign up for a free account at [huggingface.co](https://huggingface.co/)
2. Try searching for a model under **Models**, then click "Use this model"
3. Use it from Python with the `transformers` library:
   ```python
   from transformers import pipeline
   pipe = pipeline("sentiment-analysis")
   print(pipe("I love studying AI so much!"))
   ```
4. Or try out an app in **Spaces** right away without installing anything

## 📚 Hugging Face docs table of contents (per the official docs)

1. ✅ Overview (this page)
2. ⏳ Hub — models, datasets, and Spaces
3. ⏳ Transformers — load and use models with code
4. ⏳ Datasets — manage datasets
5. ⏳ Inference API & Endpoints
6. ⏳ AutoTrain — train models without writing code

## 🔗 References

- Official docs: https://huggingface.co/docs
- Main site: https://huggingface.co/
