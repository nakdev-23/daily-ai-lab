---
title: "Models, memory, files & custom instructions"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "beginner"
summary: "Reference: What is the ChatGPT Model Selector?"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---
# ChatGPT Guide — Part 2: Models, memory, files & custom instructions
> Primary reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## Model Selector — choose which model to use
Reference: [What is the ChatGPT Model Selector?](https://help.openai.com/en/articles/7864572-what-is-the-chatgpt-model-selector)

### What this topic is
The Model Selector (a menu for choosing which version of the AI to use in a conversation) lets you pick which AI model to use. Each model has different abilities and limits.

### How to use it
- On **Web**: click the model name shown at the top of the chat window
- On **Mobile**: tap the selector menu at the top of the screen

### Available models

| Model | Description | Good for |
|---|---|---|
| **GPT-5.5** | The main, smartest and fastest model for general users | General work, writing, analysis, answering questions |
| **GPT-5.5 mini** | A lighter version, faster, using fewer tokens (a token is a small unit of text the AI processes — like splitting words into small pieces, e.g. "hello" might be 2–3 pieces) | Simple tasks, short answers, saving quota |
| **o1** | A deep-thinking model, takes longer but more accurate | Math, complex programming, research |
| **o3** | A further development of o1, smarter | Advanced analytical work |
| **o4-mini** | A lighter version of o4, faster and using less quota (the allotted amount of usage in a given period) | Work needing reasoning (logical analytical thinking) but not too complex |
| **o1 Pro Mode** | A special version of o1 for the Pro plan only, thinks the deepest | High-level research, very hard problems |

### Worth knowing
- **Free** plan: mostly GPT-5.5 mini
- **Plus** plan: GPT-5.5 plus o1/o3/o4-mini
- **Pro** plan: all models including o1 Pro
- Each model has a different usage limit (the maximum number of uses per day or per month); when it runs out, it switches to a lower model automatically
- **Canvas does not support** the Pro-series models (o1 Pro)

---

## GPT-5.5
Reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

### What this topic is
GPT-5.5 is ChatGPT's latest main model, designed to handle multiple formats in a single model — text, images, and audio.

### Abilities
- Takes input (what you send the AI) as **text, images, and audio**
- Responds faster and smarter than previous models
- Can do Vision (image analysis — letting the AI "see" and describe the content of an image)
- Used as the main model in Voice Mode

### How to access
- **Plus/Pro**: available immediately, no special setup
- **Free**: available with a limit, after which it switches to GPT-5.5 mini automatically
- **API** (a connection channel for developers): call it via the model ID `gpt-5.5`

---

## The o-series models (Reasoning Models — models focused on analytical thinking)
Reference: [OpenAI o-series models](https://help.openai.com/en/articles/9824965)

### What this topic is
The o-series models (o1, o3, o4) are designed to **"think"** before answering, using a Chain-of-Thought technique (the AI works through the steps one at a time before the final answer) inside the model, making them more accurate than GPT-5.5 on complex work.

### How they differ from GPT-5.5

| Aspect | GPT-5.5 | o1 / o3 / o4 |
|---|---|---|
| Speed | Fast | Slower (takes time to think) |
| Accuracy on complex work | Good | Much better |
| Math and programming | Good | Excellent |
| General conversation | Excellent | Good |

### What work it suits
- **Math and statistics problems** that need correct steps
- **Complex code** or debugging (finding and fixing errors in a program) hard problems
- **Research and analysis** that needs care
- **Work that needs self-checking over several rounds** before giving an answer

---

## Memory — ChatGPT's memory
Reference: [What is Memory?](https://help.openai.com/en/articles/8983136-what-is-memory) | [Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq)

### What this topic is
Memory (a feature that lets the AI remember your information even after you close and reopen the app) lets ChatGPT **remember information about you across conversations**, making future conversations smarter and more tailored to you.

### What it's used for
Instead of telling ChatGPT every time what you like or what your background is, ChatGPT remembers and adapts its answers automatically, e.g.:
- "Remember that I'm vegetarian when suggesting recipes"
- "Remember that I'm a developer (a software developer) who mainly uses Python"
- "Remember my name too: Somchai"

### How to use it

**Turn on Memory:**
1. Go to Settings → Personalization → Memory
2. Switch Memory on

**Teach ChatGPT to remember:**
- Tell ChatGPT directly, e.g. "Remember that I prefer bullet points when explaining things"
- ChatGPT may remember information automatically from the conversation context

**See what ChatGPT remembers:**
- Ask ChatGPT directly, "What do you remember about me?"
- Or go to Settings → Personalization → Manage Memory

**Delete memories:**
- Delete specific items: Settings → Personalization → Manage Memory → delete each item
- Delete all: Settings → Personalization → Clear Memory

### Cautions
- Memory is available only on the **Plus, Pro, Team, Enterprise** plans (not Free)
- Memory **does not work** in Custom GPTs
- If you want to chat without ChatGPT remembering, use **Temporary Chat** (it won't save and won't create Memory)
- Memory is tied to your account, not your device

---

## Personalization FAQ
Reference: [Personalization FAQ](https://help.openai.com/en/articles/9607646-personalization-faq)

### What this topic is
Besides Memory, ChatGPT also has a **Personalization** feature (making the AI understand your overall style and needs) that helps the AI adapt to your conversation style overall.

### Details
- ChatGPT learns from your typing patterns and questions over time
- It adjusts the tone, answer length, and level of detail to suit you
- Different from Memory in that Personalization looks at the big picture, rather than remembering specific facts

---

## Custom Instructions
Reference: [Custom Instructions for ChatGPT](https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt)

### What this topic is
Custom Instructions (setting in advance what you want the AI to know and how to respond) means setting "baseline instructions" so ChatGPT knows you and knows what kind of responses you want, without repeating it every time.

### How it differs from Memory
- **Memory** = ChatGPT remembers information itself from the conversation
- **Custom Instructions** = you set yourself what you want ChatGPT to know and how to respond

### How to set it
1. Click your profile → **Customize ChatGPT** (or Settings → Personalization → Custom Instructions)
2. You'll find 2 boxes:

**Box 1: "What would you like ChatGPT to know about you?"**
Put in information about yourself, e.g.:
```
- I'm a full-stack developer (works on both the frontend that users see and the backend that runs behind the scenes) using React and Node.js
- I'm in Thailand, working at a startup
- I can speak Thai, but I prefer reading answers in English
```

**Box 2: "How would you like ChatGPT to respond?"**
Specify the answer style you want, e.g.:
```
- Answer short and to the point, no long preamble
- When writing code, always include comments (explanatory notes in the code)
- If unsure, say so directly, don't guess
```

### Worth knowing
- Custom Instructions work on every plan (Free, Plus, Pro, Team)
- Enterprise may have some settings restricted by the administrator
- The API has a similar system called the System Message (baseline instructions that define the AI's behavior before the conversation starts, for developers)

---

## File Uploads
Reference: [File Uploads FAQ](https://help.openai.com/en/articles/8982896-how-does-the-new-file-uploads-capability-work)

### What this topic is
File Uploads (sending documents or images from your machine up for ChatGPT to read and analyze) lets you upload documents into ChatGPT for it to analyze, summarize, or answer questions about their contents.

### What it's used for

**Synthesis (combining information from multiple sources into a whole):**
- Upload a CSV (a tabular data file — can be opened in Excel) and have it summarize and create a visualization (showing data as an image — e.g. a chart or graph)
- Compare two documents
- Analyze the sentiment or tone of a document

**Transformation (changing the format of content to suit a new use):**
- Upload a complex research paper and ask for a plain-language summary
- Turn a presentation into a report
- Rewrite a document in a desired style

**Extraction (taking out specific parts of a document):**
- Find specific words or topics in a PDF
- Pull out relevant quotes
- Pull out the file's metadata (information about the file — e.g. author, creation date, file size)

### Supported file types
Supports all common file extensions, including:
- **Documents**: .pdf, .docx, .doc, .txt, .md
- **Spreadsheets**: .csv, .xlsx, .xls
- **Presentations**: .pptx, .ppt
- **Images**: .png, .jpg, .jpeg, .gif, .webp

### Limits

| Type | Limit |
|---|---|
| Max file size | 512 MB per file |
| Tokens per file (text) (a token — a small unit of text the AI processes) | 2 million tokens |
| CSV/Excel size | ~50 MB |
| Image size | 20 MB |
| Files per GPT | Up to 10 files |
| Upload count | 80 files per 3 hours |
| Free Tier | 3 files per day |
| Storage per user | 25 GB |
| Storage per organization | 100 GB |

**File limits per Project:**
- **Plus**: up to 20 files/Project
- **Pro, Team, Edu, Business**: up to 40 files/Project

### File storage
- Uploaded files are kept in your account as long as the chat exists
- Delete the chat = the file is deleted within 30 days
- View your Storage usage at **Settings → Storage**

### Cautions
- Not every plan supports Visual Retrieval (pulling data from images in a document — e.g. reading a chart inside a PDF) in PDFs (Enterprise only)
- Other plans extract only text, not images in documents
- If you see "upload limit reached," check your quota (the amount you're allowed to use) on the Storage page

---

## Image Inputs (Vision) — analyzing images
Reference: [Image Inputs for ChatGPT - FAQ](https://help.openai.com/en/articles/8843135-image-inputs-for-chatgpt-faq)

### What this topic is
ChatGPT can "see" and analyze images. This feature is called **Vision** (the AI's ability to see and understand images).

### What it's used for
- Upload a chart or diagram (a drawing showing the structure or relationships of things) for ChatGPT to explain
- Ask about the content in an image, e.g. "What does this graph show?"
- Have ChatGPT read text in an image, known as OCR (Optical Character Recognition — turning an image with letters into editable text)
- Analyze a screenshot of an error in a terminal (the command window)
- Send a photo of a problem and have it help fix it

### How to use it
1. Click the **image/clip** icon in the message box
2. Pick an image from your device, or paste one directly
3. Type your question about the image

### Limits
- It cannot identify people in an image (for privacy reasons)
- Some images may be blocked (refused) by OpenAI's Safety system
- Submitted images are processed temporarily, not stored permanently

---

## Temporary Chat
Reference: [Temporary Chat FAQ](https://help.openai.com/en/articles/8914046-temporary-chat-faq)

### What this topic is
Temporary Chat (a mode where the conversation isn't saved and is deleted automatically) is a mode for conversing without saving history, where ChatGPT won't remember or use information from that conversation.

### When to use it
- When you need high privacy
- When you don't want the conversation's data used to train the model
- When you want to "start fresh" with no Memory from before

### How to turn it on
- Click **New Chat** → choose **"Temporary Chat"**
- Or go to the top menu and switch modes

### What's different from normal
- Not saved in Chat History
- **Does not create Memory** (even if Memory is on)
- Removed from the system within **30 days**
- May be reviewed by the OpenAI team for Safety checks only

---
