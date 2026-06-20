---
title: "Special tools (Tools)"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "beginner"
summary: "Reference: ChatGPT Search"
readTime: "7 min"
readers: "0"
locked: false
order: 3
---
# ChatGPT Guide — Part 3: Special tools (Tools)
> Primary reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## Search (web search)
Reference: [ChatGPT Search](https://help.openai.com/en/articles/9237897-chatgpt-search)

### What this topic is
ChatGPT Search lets ChatGPT find information from the internet in real time (current data at that moment — not data trained in the past), so it can answer questions about current events more accurately, with sources cited.

### What it's used for
- Asking about the latest news or recent events
- Finding product prices, company info, or frequently changing data
- Finding information that needs a reference link

### How to use it

**How to turn Search on:**
- Click the 🌐 (globe) icon in the message box
- Or type `/` and pick **Search** from the menu
- Or ChatGPT will **search automatically** if it sees the question needs data from the web

**Reading the results:**
- Answers will have **inline citations** (numbers or symbols telling you which source the info came from)
- Click a citation to see the source
- The **Sources** button at the end of the answer collects all the source links
- Sometimes results will show images from the web too

**Set it as the default search engine in Chrome:**
- Download the ChatGPT Chrome Extension (a small program added to the browser to extend its abilities)
- Search right from the URL bar (the web address bar)
- If you want Google instead, type `!g [search term]`

### Privacy
- ChatGPT sends your query (the text you send to search) to Bing (Microsoft) to search
- It may share your IP location (location from your IP number) for more accurate results
- Read more in the [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy)

### Availability
- **Plus, Team, Enterprise, Edu**: full access
- **Free**: rolling out gradually to groups

### Worth knowing
A search query uses the same GPT-4o quota (the allotted amount of usage); if the quota runs out, you can't search.

---

## Deep Research
Reference: [Deep Research FAQ](https://help.openai.com/en/articles/10500283-deep-research-faq)

### What this topic is
Deep Research (a mode where the AI does multi-step research and synthesizes data from many sources) is a special mode where ChatGPT does multi-step research, reading and synthesizing information from many internet sources. The result is a report with complete citations.

### How it differs from regular Search

| Aspect | Regular Search | Deep Research |
|---|---|---|
| Depth | Basic search | Multi-layer research |
| Sources | A few | Dozens |
| Time | Fast (seconds) | Slower (minutes) |
| Result | Short answer | Long report, with citations |
| Good for | General questions | Strategy, literature review (collecting and summarizing existing research) |

### When to use it
- When you need a complete report on a complex topic
- Analyzing competitors/markets
- Preparing material for a presentation or research
- Doing a literature review

### How to use it
- Type `/` and pick **Deep Research**, or click the research icon
- State the topic you want to research clearly

### Availability
- **Plus**: available but a limited number per month
- **Pro**: more than Plus
- **Team/Enterprise**: depends on the admin settings

---

## Canvas — a collaborative workspace
Reference: [What is the Canvas feature in ChatGPT?](https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it)

### What this topic is
Canvas (an interactive workspace where you and the AI work together directly on a document or code, like an online whiteboard) is an interactive workspace (responsive in real time) that opens beside the conversation, letting you and ChatGPT **work together** directly on a document or code.

### What it's used for
- **Write and edit documents** together with ChatGPT
- **Write and debug (fix errors in) code** with the ability to run it on the same page
- View version history (a record of every change, like unlimited undo)
- Highlight the part you want changed and get inline feedback (right in the content)

### How to open Canvas
1. **Automatically**: ChatGPT opens Canvas itself when content is > 10 lines or it's a task that needs an editor (a text-editing program)
2. **Tell it**: say "use canvas..." or "open a canvas"
3. **Open in Canvas button**: at the top-right of the message box
4. **Shortcut**: type `/` and pick `canvas`

### How to edit in Canvas

**Edit via Chat:**
- Type an instruction in the regular chat, e.g. "make the 2nd paragraph more concise"

**Edit directly:**
- Click in the Canvas area and type your edits yourself

**Inline Comment:**
- Highlight the text you want → a Comment box appears → ask ChatGPT to fix that part

### Shortcuts for writing

| Shortcut | What it does |
|---|---|
| **Suggest edits** | ChatGPT adds comments suggesting edits |
| **Adjust the length** | Adjust shorter/longer (with a slider) |
| **Change reading level** | Adjust the language level, from kindergarten to PhD |
| **Add final polish** | Check grammar, clarity, consistency |
| **Add emojis** | Add emoji (symbol images that show emotion) to the content |

### Shortcuts for coding

| Shortcut | What it does |
|---|---|
| **Add logs** | Add print statements (commands that print text — used to check variable values while debugging) for debugging |
| **Add comments** | Add comments (explanatory notes) in the code |
| **Fix bugs** | Find and fix bugs (errors in the program) |
| **Port to a language** | Convert the code to another language (Python, JS, Java, etc.) |
| **Code review** | Give suggestions to improve the code |

### Running code in Canvas
- **Python**: hit the **Execute** button (run — tell the program to do its work); results show in the console (the window that shows code-run output) below
- **React/HTML**: render (display — turn the code into a visible web page) the result in a sandbox (a closed environment — separated from the real system for safety)
- If there's an error, ChatGPT suggests hitting **Fix bug** automatically

### Version History
- Use the ← → buttons at the top of Canvas to see previous versions
- The **Show changes** button shows additions/deletions as a diff (a comparison showing which parts changed)

### Downloading from Canvas
- **Documents**: export (save in another format) to PDF, Markdown (.md — a text-formatting language popular in technical work), Word (.docx)
- **Code**: export as a file by language, e.g. .py, .js, .sql

### Sharing Canvas
- Every plan (Free, Plus, Pro, Team, Enterprise) can share Canvas
- Share a link just like sharing a conversation

### Cautions
- Canvas doesn't support Mobile yet (iOS/Android) — only Web, Windows, macOS
- Canvas **does not support** the Pro-series models (e.g. o1 Pro)
- The Web Preview in Canvas may communicate with third parties (outside services); be careful with shared data

---

## Voice Mode — conversing by voice
Reference: [Voice Mode FAQ](https://help.openai.com/en/articles/8400625-voice-mode-faq)

### What this topic is
Voice Mode (lets you talk to ChatGPT with your real voice instead of typing) lets you converse with ChatGPT by speaking in real time, like talking with a personal assistant.

### How to start

**On Mobile (iOS/Android):**
1. Tap the Voice icon (headphones/sound wave) at the bottom-right of the screen
2. The first time, you must allow the app to use the microphone (a device that captures sound)
3. If it's the first time, you'll choose the voice you want

**On Web (chatgpt.com):**
1. Click the Voice icon on the right of the message box
2. Allow the browser to access the microphone
3. Start speaking

### Voice options
There are 9 voices to choose from, differing in tone and personality:

| Voice name | Tone |
|---|---|
| Arbor | Easygoing, flexible |
| Breeze | Lively, genuine |
| Cove | Calm, to the point |
| Ember | Confident, optimistic |
| Juniper | Open, bright |
| Maple | Cheerful, direct |
| Sol | Nimble, relaxed |
| Spruce | Calm, encouraging |
| Vale | Bright, curious |

Change the voice at **Settings → Voice** or from the menu in voice mode.

### During a voice conversation
- **Mute/Unmute**: tap the mic icon at the bottom-left
- **Pause/resume**: hit the Pause button
- **Stop talking**: hit the Exit button at the bottom-right
- **Subtitles/Captions** (showing the text of the spoken audio): hit the "cc" button at the top-right (iOS/Android)

### Sharing video and screen while talking (Subscribers only — paid plans)
- Share the **camera**: tap the camera icon during the conversation
- Share an **image or screen**: tap the three-dot button → choose Share Screen
- Stop sharing the screen: tap the Screenshare button again

### Usage limits

| Plan | Voice limit |
|---|---|
| **Free** | GPT-4o mini, up to 2 hours/day |
| **Plus** | GPT-4o nearly unlimited (with fallback — switching to mini when the quota runs out) |
| **Pro** | GPT-4o unlimited |
| **Enterprise (Flexible)** | Unlimited (counts credits — credit units used instead of money) |

### Background Conversations
- Set **Background Conversations** in Settings so Voice can keep working even when you leave the app
- It stops when: the conversation ends on its own, the app closes, you reach the daily limit, or it exceeds 1 hour

### GPTs can use Voice too
- GPTs have a special voice, **Shimmer**, different from the 9 main voices
- Voice Mode doesn't yet support tools like image generation, file upload, or the code interpreter in GPTs

### Voice privacy
- Audio clips are kept for 30 days along with the chat history
- Delete the chat = the audio is deleted within 30 days
- **OpenAI does not use your audio to train the model** automatically
- To help OpenAI improve, go to Settings → Data Controls → "Include your audio recordings"

### Common problems
- The voice detects the wrong language: go to Settings → Speech → Main Language and set the language you want
- Getting the answer "Sorry, I cannot help with that": this is a safety response on certain topics that Voice Mode restricts
- The voice gets interrupted often: try wearing headphones, or turn on Voice Isolation Mode (filters out background noise) on iPhone

---

## Image Generation — create images with DALL·E
Reference: [Creating Images in ChatGPT](https://help.openai.com/en/articles/8932459-creating-images-in-chatgpt) | [DALL·E in ChatGPT](https://help.openai.com/en/articles/7659237-dall-e-in-chatgpt)

### What this topic is
ChatGPT can create images from a text prompt (a text description — describing the image you want the AI to make) using the **DALL·E** model (an AI model that creates images from text descriptions).

### What it's used for
- Create an illustration or artwork from a description
- Create a mockup (a draft — an example image before the real thing), concept design, or thumbnail (a small preview image)
- Create images for an article or presentation
- Edit an existing image with natural-language instructions

### How to create an image
1. Open ChatGPT (Plus, Pro, Team, or Enterprise)
2. Type a description of the image you want, e.g.:
   - "Draw a cat sleeping on a flower pot in watercolor style"
   - "Create a minimalist logo for a coffee shop called 'Morning Brew'"
3. ChatGPT generates the image automatically

### Editing images
Reference: [Editing Your Images with DALL·E](https://help.openai.com/en/articles/9055440-editing-your-images-with-dall-e)

- Click the created image and choose **Edit image**
- Tell ChatGPT what you want to change, e.g. "add a sunset in the background"
- Or use the Brush Tool (select the specific area you want to change) to select the part to edit

### Cautions
- DALL·E is available only on the **Plus, Pro, Team, Enterprise** plans (not Free)
- OpenAI has a Content Policy (rules defining what can be created) forbidding images that: use real people's faces, infringe copyright, or contain inappropriate adult content
- Created images belong to the user per OpenAI's Terms of Service

---

## Data Analysis — analyzing data (Code Interpreter)
Reference: [Data Analysis with ChatGPT](https://help.openai.com/en/articles/8437071-advanced-data-analysis-chatgpt-enterprise-version)

### What this topic is
Data Analysis, formerly called the Code Interpreter (a system that can actually run code inside ChatGPT) or Advanced Data Analysis, lets ChatGPT run Python code (a popular programming language for data work) in a safe environment to analyze and visualize (show data as an image) data.

### What it's used for
- Upload a CSV/Excel and ask for a data summary
- Create graphs and charts from the data
- Do data cleaning (fixing erroneous or incomplete data)
- Compute basic statistics, e.g. mean, median, correlation (the relationship between variables)
- Make projections (forecasting — predicting future trends) or forecast data

### How to use it
1. Upload a data file (CSV, XLSX, etc.)
2. Type what you want to analyze, e.g.:
   - "Summarize the data in this file"
   - "Create a bar chart showing sales each month"
   - "Find the outliers (abnormal values — data unusually far from the group) in the price column"

### Example use (Extracting insights)
Reference: [Extracting Insights with ChatGPT Data Analysis](https://help.openai.com/en/articles/8690806-extracting-insights-with-chatgpt-data-analysis)

- Take a sales spreadsheet → ask for a summary of quarterly trends
- Take survey data → have it analyze satisfaction by group
- Take log data (records of system activity) → have it find the time periods with frequent problems

### Worth knowing
- It can only run Python in a sandbox (a closed environment — separated from the internet and external systems); it can't go out to the internet directly
- Available only on the **Plus, Pro, Team, Enterprise** plans

---

## Scheduled Tasks — work scheduled in advance
Reference: [Scheduled Tasks in ChatGPT](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt)

### What this topic is
Scheduled Tasks (a feature that has the AI do work automatically on a set schedule without you asking) let you have ChatGPT do certain work in the future automatically, e.g. send a summary or check data at a set time.

### What it's used for
- Set a reminder: "remind me every Monday morning about my to-dos"
- Have ChatGPT check the web and summarize the news every day
- Schedule repetitive analysis work on a regular basis

### How to create a task
1. Tell ChatGPT what to do and when, e.g. "every morning at 9, summarize the economic news"
2. ChatGPT confirms and creates the task
3. See all existing tasks from the sidebar menu

### Worth knowing
- This feature is still rolling out, on some plans only
- Tasks run only when you're online or there's a notification to the app

---

## Connected Apps — apps connected to ChatGPT
Reference: [Connected Apps on ChatGPT](https://help.openai.com/en/articles/8798736-connected-apps-on-chatgpt)

### What this topic is
ChatGPT can connect to external apps, e.g. Google Drive (Google's cloud file storage), OneDrive (Microsoft's cloud file storage), so ChatGPT can access and analyze files from the cloud (data storage on the internet) directly.

### How to connect
1. Go to Settings → Connected Apps (or from the message box → the Attachment icon → Connect)
2. Choose the app you want, e.g. Google Drive
3. Grant access permission

### Cautions
- Grant permission only to the files you need; don't grant access to everything
- ChatGPT reads the file contents to answer your questions, but doesn't edit the original file (depending on the settings)
