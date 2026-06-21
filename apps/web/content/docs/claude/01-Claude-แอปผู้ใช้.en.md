---
title: "User apps (Claude.ai / mobile / desktop)"
tool: "Claude"
icon: "tool-claude"
level: "beginner"
summary: "Reference: Claude collection"
readTime: "5 min"
readers: "0"
locked: false
order: 1
---
# Claude guide — Part 1: User apps (Claude.ai / mobile / desktop)

> Compiled from the [Claude Help Center](https://support.claude.com/en/) for general users who want to use Claude via the web, mobile app, and desktop app

---

## 📖 Terms worth knowing in this doc

| Term | Plain meaning |
|---|---|
| **SSO** (Single Sign-On) | Logging in with a single organization account to access every service without creating a new password |
| **SCIM** | A system that lets an organization's IT add/remove members and permissions automatically |
| **MCP** (Model Context Protocol) | An open standard for connecting AI to external tools like Google Drive, Slack, GitHub |
| **Connector** | A connector between Claude and an external service (works via MCP) |
| **Knowledge base** | Files/documents uploaded into a Project so Claude can reference them at all times |
| **Custom instructions** | User-defined instructions to adjust Claude's tone or behavior, e.g. "answer concisely, no more than 3 sentences" |
| **Artifacts** | A separate output window on the right showing code, documents, or small apps Claude creates |
| **Sandbox** | A separate workspace inside the browser; code run here can't access other data on your machine |
| **Prompt injection** | An attack that hides fake instructions in a web page's content to trick the AI into doing something unintended |
| **Zero Data Retention (ZDR)** | A policy where Anthropic doesn't keep conversation data after processing it (for organizations) |
| **Extension** | An add-on installed in the Chrome browser to add capabilities |

---

## 1. Overview of using Claude
Reference: [Claude collection](https://support.claude.com/en/collections/4078531-claude)

### What is this topic?
Claude is a conversational AI assistant usable via the web [claude.ai](https://claude.ai), the mobile app (iOS/Android), and the desktop app (macOS/Windows). We type questions or instructions in natural language (including Thai) and Claude replies, helping to write, summarize, analyze, translate, code, and work with files.

### What it's used for
- Write and edit text, emails, reports, articles
- Summarize long documents, answer questions from uploaded files
- Help think and analyze, brainstorm ideas, plan
- Write/explain/fix code, create tables, graphs
- Search the web and connect external tools (Connectors)

### Key details from the official docs
The main screen consists of the message (prompt) box, the conversation history on the side, and the model selector. Each chat has separate memory; Claude remembers context within a single conversation but won't carry over to another conversation automatically, unless you use the Memory or Projects features.

The selectable models depend on your plan; generally there's a fast model (Haiku), a balanced model (Sonnet), and the most capable model (Opus) to choose by the job.

### How to use it
1. Go to [claude.ai](https://claude.ai) and sign up/log in (email, Google, or your organization's **SSO** — logging in via a company-provided account without creating a new password)
2. Type a question or instruction in the message box; press Enter to send
3. Attach files with the clip button or by dragging and dropping
4. Choose a model from the top menu/near the input box
5. Press 👍/👎 to give feedback, or copy/edit the message

### Cautions
- Claude may give incorrect information; always verify important facts
- Each conversation is separate; to remember across conversations, use Memory/Projects

### Quick summary
The Claude app is a conversational AI assistant usable on many platforms, instructable in Thai, that works with files and external tools.

---

## 2. Plans and access (Plans)
Reference: [Pro and Max plans](https://support.claude.com/en/collections/5953830-pro-and-max-plans) · [Team and Enterprise plans](https://support.claude.com/en/collections/9387370-team-and-enterprise-plans)

### What is this topic?
Claude has several plans to choose from based on usage volume and needs, from free to enterprise plans.

### Key details from the official docs
- **Free** — basic free usage with a limited message quota per time window, partial access to models and features
- **Pro** — a monthly plan for general users with a larger usage quota, access to capable models, Projects, Connectors, and advanced features
- **Max** — for heavy users, a quota many times higher than Pro (with several tiers), good for those who use it all day and use Claude Code a lot
- **Team** — for teams/small companies, managing members, combined billing, and a shared workspace
- **Enterprise** — for large organizations, adding **SSO** (login with an organization account)/**SCIM** (automatic member management), security controls, data policies, and admin management

Usage quotas are usually measured per time window (e.g. every few hours) and depend on the chosen model; a more capable model uses more quota.

### Cautions
- Prices and quotas change; always check the official pricing page at [claude.com/pricing](https://claude.com/pricing)
- Canceling/changing a plan is done in Settings → Billing

### Quick summary
There's Free, Pro, Max, Team, Enterprise — choose by usage volume and your organization/security needs.

---

## 3. Projects (topic-specific workspaces)
Reference: [Claude collection](https://support.claude.com/en/collections/4078531-claude)

### What is this topic?
Projects are spaces that bring together conversations and files related to a single piece of work, with "project-wide instructions" (custom instructions) and uploaded knowledge that Claude can reference in every conversation within that project.

### What it's used for
Good for ongoing work, e.g. a book-writing project, research, a single client's work, or a team's internal knowledge base, without uploading files or re-explaining context every time.

### Key details from the official docs
- Each project has its own **knowledge base**; upload documents/files so Claude can reference them at all times without resending each time
- Set **custom instructions** to define the role, tone, or desired output format, e.g. "answer in a formal tone" or "don't use bullet points"
- Every conversation in the project shares the knowledge and instructions
- Share projects with team members (on the Team/Enterprise plan)

### How to use it
1. Click **Projects** in the side menu, then **Create project**
2. Set a name and description
3. Add files/documents to the knowledge and write custom instructions
4. Start a conversation within the project — Claude references that knowledge automatically

### Quick summary
Projects = bring together files + instructions + conversations for one piece of work in one place, no re-explaining context.

---

## 4. Artifacts (editable outputs in a separate window)
Reference: [Claude collection](https://support.claude.com/en/collections/4078531-claude)

### What is this topic?
Artifacts is a separate window on the right showing larger outputs, e.g. code, documents, a single-page website (HTML), diagrams, or small apps (React — a framework for building interactive web pages) that Claude creates — editable, previewable, and convenient to reuse.

### What it's used for
Good for outputs you want to keep separate from the conversation, e.g. creating a calculator, a dashboard, a small game, a long document, or code to copy and use.

### Key details from the official docs
- Supports many content types: code, Markdown, HTML, SVG, diagrams (Mermaid), and React components
- Re-editable; Claude updates the existing artifact instead of creating a new one
- Preview the result instantly for HTML/React
- Download or copy to use outside the app
- Some artifact types can be published/shared

### Cautions
- App artifacts run in the browser's **sandbox** (a separate, safe space that can't access other data on your machine) and have limitations, e.g. localStorage (browser data storage) is disallowed in some environments
- Always review the code before production

### Quick summary
Artifacts = editable output windows (code/document/app) that you can preview and reuse.

---

## 5. Memory (memory across conversations)
Reference: [Claude collection](https://support.claude.com/en/collections/4078531-claude)

### What is this topic?
Memory lets Claude remember important information about the user and the work across conversations, e.g. preferences, work context, or a preferred working style.

### What it's used for
Reduces re-explaining, e.g. "I prefer concise answers" or "I work in field X"; Claude uses it in subsequent conversations.

### Key details from the official docs
- The user controls whether to turn Memory on/off and can view/delete what's remembered in Settings
- You can directly tell it to remember or forget something within a conversation
- On organization plans, an admin may set Memory policies

### Cautions
- Avoid having Claude remember sensitive data (passwords, card numbers, health data) unless necessary and you understand the risk
- Review the remembered content periodically and delete what you don't want

### Quick summary
Memory = cross-chat memory the user can turn on/off/delete, helping avoid re-explaining.

---

## 6. Files & Attachments
Reference: [Claude collection](https://support.claude.com/en/collections/4078531-claude)

### What is this topic?
You can attach files for Claude to read and analyze, e.g. PDFs, images, Word documents, spreadsheets, text/code files.

### Key details from the official docs
- Supports reading PDFs (both text and images on the page), images (vision), CSV/spreadsheets, and text files
- Drag and drop a file or click the attach button to upload
- Claude can summarize, extract data, answer questions, or transform data from files
- There are limits on the size and number of files per message (depends on your plan)

### How to use it
1. Click the attach-file icon or drag a file into the input box
2. Type an instruction for what to do with the file (e.g. "summarize this document as bullet points")
3. Send the message

### Quick summary
Attach PDFs/images/spreadsheets/documents for Claude to read, analyze, summarize, and extract data.

---

## 7. Connectors (connect external tools / MCP)
Reference: [Connectors](https://support.claude.com/en/collections/15399129-connectors)

### What is this topic?
Connectors connect Claude to external tools and services, e.g. Google Drive, Slack, GitHub, databases, etc., via the open **MCP (Model Context Protocol)** standard — a common standard that makes it easy for AI to connect to various tools — so Claude can read data and work with those services.

> **In plain terms:** A Connector is a "bridge" between Claude and the apps you use. Claude can access data in those apps only when you allow it.

### What it's used for
- Pull documents from Google Drive to summarize
- Search and answer from messages in Slack
- Manage issues/PRs in GitHub
- Connect internal company tools that support MCP

### Key details from the official docs
- There are ready-made connectors from Anthropic and partners, and you can add your own MCP server
- You must authorize the connector to access your account/data before use
- On organization plans, an admin can control which connectors are enabled

### Cautions
- Only grant permission to trusted connectors and check the scope of permissions requested
- Pulled-in data becomes the conversation's context; be careful with sensitive data

### Quick summary
Connectors (MCP) = connect Claude to external tools to read data and work across apps.

---

## 8. Claude in the browser (Claude in Chrome)
Reference: [Claude in Chrome](https://support.claude.com/en/collections/18031491-claude-in-chrome)

### What is this topic?
An **Extension** that lets Claude work in the Chrome browser — helping read, summarize, fill in forms, and work on web pages for the user.

> An **Extension** is a small add-on program installed in the browser, like a "plugin" that adds capabilities to Chrome.

(This is a **beta** feature — meaning a feature still in testing, whose capabilities may change)

### Key details from the official docs
- Install the extension and log in with your Claude account
- Claude can see and interact with the open web page (e.g. extract data, fill in data, navigate)
- There are permission requests and safety mechanisms before acting on the web, especially clicking suspicious links

### Cautions
- Beware of **Prompt Injection** — where some web pages hide embedded instructions in their content to trick Claude into doing something unintended, e.g. revealing your personal data. Review risky actions, such as filling in important data or making transactions
- It's a beta feature; capabilities and access may change

### Quick summary
Claude in Chrome = a browser assistant that can read/summarize/work on web pages; use it carefully regarding security.

---

## 9. Mobile and desktop apps
Reference: [Mobile apps](https://support.claude.com/en/collections/9387080-claude-mobile-apps) · [Claude Desktop](https://support.claude.com/en/collections/16163169-claude-desktop)

### Key details from the official docs
- **Mobile (iOS/Android):** chat, attach images/files, use voice, and sync history across devices via the same account
- **Desktop (macOS/Windows):** a dedicated app that opens fast, uses keyboard shortcuts, connects connectors, and can access features like Cowork/Claude Code (depending on availability)
- Conversation history, Projects, and Memory sync via the same account on all platforms

### Quick summary
Use Claude on both mobile and desktop; data syncs via a single account.

---

## 10. Privacy, security, and data policy
Reference: [Privacy and legal](https://support.claude.com/en/collections/4078534-privacy-and-legal) · [Safeguards](https://support.claude.com/en/collections/4078535-safeguards)

### Key details from the official docs
- Anthropic has a Privacy Policy and Usage Policy governing what users can/can't do
- Users can control data settings in Settings, e.g. using data to improve the model
- Organization plans have extra options, e.g. **Zero Data Retention (ZDR)** — a policy where Anthropic doesn't keep your conversation data after processing, data-retention controls, and standards compliance
- There are Safeguards to prevent harmful use and protect child safety

### Cautions
- Avoid entering confidential/sensitive data beyond what's necessary
- Read the latest policy at [Privacy Policy](https://www.anthropic.com/legal/privacy) and [Usage Policy](https://www.anthropic.com/legal/aup)

### Quick summary
Users can control data; organizations have extra security options; always read the official policy.

---

## Additional reference topics
- Release Notes (apps): https://support.claude.com/en/articles/12138966-release-notes
- How to get support: https://support.claude.com/en/articles/9015913-how-to-get-support
- Claude for Education: https://support.claude.com/en/collections/12630177-claude-for-education
- Claude for Nonprofits: https://support.claude.com/en/collections/17047088-claude-for-nonprofits
