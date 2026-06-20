---
title: "GPTs, GPT Store & Projects"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "intermediate"
summary: "Reference: How can I use GPTs?"
readTime: "5 min"
readers: "0"
locked: false
order: 4
---
# ChatGPT Guide — Part 4: GPTs, GPT Store & Projects
> Primary reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## What are GPTs
Reference: [How can I use GPTs?](https://help.openai.com/en/articles/8798889-how-can-i-use-gpts)

### What this topic is
GPTs (special versions of ChatGPT customized for a specific task or topic) are **specially customized** versions of ChatGPT for a particular task or topic. Anyone can build and share their own GPT, or choose to use a GPT someone else has built.

### How they differ from regular ChatGPT

| Aspect | Regular ChatGPT | GPT |
|---|---|---|
| Purpose | General | Specialized |
| Instructions | Set each time | Set in advance |
| Knowledge files | None | Files embedded for it |
| Tools | As usual | Choose which tools to enable |
| Action (connecting to external systems) | None | Can connect to external APIs |

### How you can use a GPT

**How to access the GPT Store (a library of GPTs from developers worldwide):**
1. Go to [chatgpt.com/gpts](https://chatgpt.com/gpts) or hit **Explore GPTs** in the sidebar
2. Search GPTs by category: Writing, Coding, Productivity, Education, Lifestyle, etc.
3. Click the GPT you're interested in → hit **Start Chat**

**GPT categories in the Store:**
- **Writing**: helps with writing, e.g. Ghost Writer, Email Writer
- **Coding**: helps write code, debug, and explain
- **Research & Analysis**: helps research and summarize
- **Education**: personal teachers for various subjects
- **Productivity**: managing tasks, helping plan
- **Lifestyle**: fitness, food, travel

### Availability
- **Free**: can use GPTs but with limits
- **Plus/Pro/Team/Enterprise**: full GPT use

### GPTs and Voice
- You can use Voice Mode with a GPT
- GPTs have a special voice called **Shimmer** (different from the 9 main voices)
- Voice Mode with a GPT **doesn't yet support**: image generation, file upload, the code interpreter, custom actions (custom connections to external systems)

### Sharing and privacy
Reference: [How do I restrict my GPT's share settings?](https://help.openai.com/en/articles/8554959-how-do-i-restrict-my-gpts-share-settings)

When you create a GPT, you choose how to share it:
- **Only me**: just for you
- **Anyone with a link**: anyone with the link can use it
- **Everyone (GPT Store)**: published publicly in the GPT Store

---

## Building your own GPT
Reference: [GPT Builder](https://help.openai.com/en/articles/8770868-gpt-builder)

### What this topic is
The GPT Builder (a system that lets you build your own GPT without coding) is a tool for building a personal GPT, no coding required, done by chatting with an AI that helps build the GPT for you.

### How to build a GPT

**Step 1: Open the GPT Builder**
1. Go to [chatgpt.com/gpts](https://chatgpt.com/gpts)
2. Hit **+ Create** or **Create a GPT**

**Step 2: Set it up via the Create tab**
- Tell the GPT Builder what you want the GPT to do
- E.g.: "build a GPT that helps students practice English"
- The Builder asks follow-ups and builds the profile automatically

**Step 3: Customize via the Configure tab**
- **Name**: name the GPT
- **Description**: describe what the GPT does
- **Instructions**: the main instructions defining the GPT's behavior, also called the System Prompt (a behind-the-scenes instruction the AI follows throughout the conversation)
- **Conversation Starters**: quick-reply buttons users can tap to start chatting
- **Knowledge**: upload files as a "knowledge base" for the GPT to reference
- **Capabilities**: choose whether to enable Web Search, DALL·E (image generation), the Code Interpreter, or Canvas
- **Actions**: connect external APIs (Application Programming Interface — a channel that lets programs communicate), e.g. reading data from your own system

**Step 4: Test and save**
- Try it in the Preview Panel (a window showing results before publishing) on the right
- Hit **Save** to save
- Choose the share setting you want

### GPT idea examples
- **Thai Grammar Teacher**: teaches Thai grammar, with examples and exercises
- **Resume Reviewer**: reviews a resume (a job-application document) and gives instant feedback
- **Code Buddy**: helps debug Python code with line-by-line explanations
- **Recipe Creator**: suggests recipes based on the ingredients you have
- **Meeting Summarizer**: summarizes meeting notes into key points

### Knowledge in a GPT
- Upload files as a "knowledge base," e.g. a PDF manual, a CSV of data
- The GPT reads and uses the file's content to answer — like having the AI read a specialized book before answering
- File limit in a GPT: up to 10 files (depending on the plan)
- Knowledge files are kept until you delete the GPT

### Actions in a GPT
- Actions (letting the GPT call external APIs to do extra work beyond chatting) let the GPT call external APIs
- Defined with an OpenAPI Specification (a standard for describing an API — like a manual telling the AI how the API works and what data it takes) in JSON/YAML format
- E.g. have the GPT pull stock prices from your API, or create a ticket (a record of a problem or task to be done) in Jira (a popular work-management system) automatically
- You need API knowledge to set up Actions

---

## GPT Store
Reference: [GPT Store](https://chatgpt.com/gpts)

### What this topic is
The GPT Store is a marketplace (an online platform collecting products or services from many creators) gathering GPTs built by OpenAI and by developers/general users, free for you to find and use.

### How to use the GPT Store
1. Go to the sidebar → **Explore GPTs**
2. Search by name or category
3. Read the GPT's details before using
4. Hit **Start Chat** to begin

### Main categories in the GPT Store
- Featured (GPTs recommended by OpenAI)
- Trending (currently popular GPTs)
- By OpenAI (built by OpenAI itself)
- Writing, Productivity, Research, Programming, Education, etc.

### Publishing your own GPT
Once you've successfully built a GPT, you can publish it in the Store by:
1. Setting the share setting to **Everyone (GPT Store)**
2. The GPT is reviewed by OpenAI first
3. Once approved, it appears in the Store

---

## Projects — organize your work with Projects
Reference: [Using Projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt)

### What this topic is
Projects (a feature that groups related conversations, files, and context into one job, like a project folder on a computer) let you group related conversations, files, and context into a single "project." Good for long-term work or work with many facets.

### What it's used for
- **Long-term work**: e.g. writing a book, developing a program, doing research
- **Organizing topics**: separate chats by project so they don't mix
- **Sharing context** (the information referenced in the conversation): files uploaded in a project are available in every chat within that project
- **Working across sessions** (periods of use): start today, come back tomorrow with the full context intact

### How to create a Project
1. Click **+ New Project** in the sidebar
2. Name the project
3. Add a new chat or move an existing chat into the project
4. Upload files related to the project

### File limits in Projects

| Plan | File limit per Project |
|---|---|
| Plus | 20 files |
| Pro / Team / Edu / Business | 40 files |

### What's different from a regular chat

| Aspect | Regular chat | Project |
|---|---|---|
| Shared files | ❌ | ✅ |
| Context across conversations | ❌ | ✅ |
| Can be grouped | ❌ | ✅ |
| Project-specific instructions | ❌ | ✅ |

### Worth knowing
- Projects work on every plan that has Memory and File Upload
- Files in a project are kept until you delete the project or run out of storage quota
- ChatGPT's Memory works together with Projects

---

## Shared Links — share a conversation
Reference: [ChatGPT Shared Links FAQ](https://help.openai.com/en/articles/7872872-chatgpt-shared-links-faq)

### What this topic is
Shared Links (links that let others view your conversation without a ChatGPT account) let you create a link sharing a ChatGPT conversation for others to view, without that person needing a ChatGPT account.

### How to create a Shared Link
1. Open the conversation you want to share
2. Click the **Share** icon (an up arrow) at the top
3. Click **Copy Link**
4. Send the link to whoever you want

### What the recipient sees
- They see the conversation content as of the time you shared
- They don't see conversation added after sharing (you must update the link)
- They can't continue the chat in that link (View Only)

### Update a link
Reference: [How do I update a shared link?](https://help.openai.com/en/articles/8090471)

- After sharing, if you keep chatting, the new content won't appear in the old link
- You must create a new link to update the content

### Delete a link
Reference: [Delete/invalidate a shared link](https://help.openai.com/en/articles/7730166)

- Go to **Settings → Data Controls → Shared Links**
- Choose the link you want to delete

### Report inappropriate content
- If you find a shared link with illegal or harmful content, use OpenAI's reporting form
- Reference: [How do I report harmful content in a shared link?](https://help.openai.com/en/articles/8018972)

### Export data
- When you export (download all your data), data from ChatGPT Shared Links is **not included in the export** by default
