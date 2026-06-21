---
title: "What is Google AI Studio — a free Gemini playground"
tool: "Google AI Studio"
icon: "tool-google-ai-studio"
level: "beginner"
summary: "An overview of Google AI Studio, a tool for prototyping and experimenting with prompts on the Gemini models"
readTime: "6 min"
readers: "0"
locked: false
order: 1
---

# Google AI Studio — experiment with Gemini for free in the browser ✨

> Adapted from the official documentation at [ai.google.dev](https://ai.google.dev/) and [aistudio.google.com](https://aistudio.google.com/)

**Google AI Studio** is a free web app for **experimenting and prototyping with Google's Gemini models** — type a prompt, adjust settings, see results instantly, then grab the code to use in a real app. Great for beginners who want to play with AI before writing real code.

## 📖 Terms worth knowing

| Term | In plain words |
|---|---|
| **Gemini** | Google's main AI model (text, images, audio, video) |
| **Prompt** | The instruction/text you type for the model to work on |
| **API key** | The key for calling Gemini from your own code |
| **Temperature** | The creativity of the answer (low = precise, high = varied) |
| **System instructions** | Instructions defining the model's role/behavior |

## ⭐ Highlights

- **Free and start right away** — just log in with a Google account
- **Try prompts with live results** — adjust settings and compare easily
- **Get an API key in one click** — to connect to your code/real app
- **Multimodal support** — add images/files/audio to the prompt
- **Has starter apps** — ready-made example apps to adapt

## 🚀 Getting started

1. Go to [aistudio.google.com](https://aistudio.google.com/) and log in with Google
2. Choose a Gemini model and try typing a prompt on the Chat page
3. Adjust the **System instructions** and temperature to get the result you want
4. Hit **Get API key** to call it via code:
   ```python
   from google import genai
   client = genai.Client(api_key="YOUR_KEY")
   r = client.models.generate_content(model="gemini-2.5-flash", contents="Hello")
   print(r.text)
   ```

## 📚 Documentation contents (per the official docs)

1. ✅ Overview (this page)
2. ⏳ Prompt design
3. ⏳ Get an API key and call it via code
4. ⏳ Multimodal — images/audio/video
5. ⏳ Starter apps and examples

## 🔗 Reference

- Web app: https://aistudio.google.com/
- Developer docs (Gemini API): https://ai.google.dev/
