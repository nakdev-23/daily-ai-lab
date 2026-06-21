---
title: "Projects and Claude.ai features — personal and Team workspaces"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Get to know Projects, Artifacts, Memory, and other special features on Claude.ai, from the Free plan to Pro, Max, Team, and Enterprise"
readTime: "8 min"
readers: "0"
locked: false
order: 19
---

## What is Claude.ai?

Claude.ai is the main **web interface** for talking to Claude directly without coding, good for general users and teams. It has features not in the API directly, e.g. Projects, Artifacts, Memory, and collaboration.

---

## Projects — a personal workspace

Projects are a **workspace** that holds conversations and a knowledge base together.

### Main features of Projects

**Knowledge Base**
- Upload documents, text, or code files
- Claude references these files in every conversation in the project
- Good for: company policies, manuals, reference docs

**Custom Instructions**
- Set Claude's "personality" specific to the project
- E.g.: "Always answer formally" or "Use English only"

**Chat History**
- Every conversation in the project is stored separately
- Searchable and revisitable later

### Number of Projects available

| Plan | Number of Projects |
|-----|---------------|
| Free | Up to 5 projects |
| Pro/Max | More |
| Team/Enterprise | Unlimited |

### RAG (Retrieval-Augmented Generation — generating an answer by first retrieving information from a knowledge base)

For the Pro, Max, Team, Enterprise plans, you get **RAG mode**, which expands capacity up to 10x when the context nears full, while preserving response quality.

---

## Artifacts — instantly editable results

Artifacts (things Claude creates — output you can edit, preview, and download directly in the web page) are the output Claude creates that can be edited, previewed, and downloaded.

### Types of Artifacts

| Type | Description | Example |
|-------|---------|---------|
| **Code** | Code that runs in the browser | JavaScript, HTML |
| **Documents** | Markdown documents (a text format easily converted to HTML) | Articles, reports |
| **SVG** | Vector graphics (graphics that don't pixelate when scaled) | Diagrams, logos |
| **React** | React components (UI components built with React) | UI components |

### Using Artifacts

1. Ask Claude to create what you want (a website, code, a document)
2. Claude creates the Artifact, shown in the right panel
3. Preview the result instantly
4. Click "Edit" to edit, or "Copy" to use it

---

## Memory — Claude remembers across conversations

Memory (a feature that lets Claude store important information about you and recall it in subsequent conversations) helps Claude remember important information about you across conversations.

### How it works

- Claude saves important information automatically (or as you ask)
- The next time you talk, Claude already knows that information

### Examples of what Memory stores

- "The user is a Python developer working in data science"
- "Prefers short answers in English"
- "The current project is named DataPipeline and uses FastAPI"

### Managing Memory

- View and edit memory in Settings
- Delete what you don't want
- Turn memory off if you don't want it

---

## The various Claude.ai plans

### Free
- Talk to Claude for free
- Limited daily usage
- Access to the Claude model (the AI's brain) (may limit the version)
- Up to 5 Projects

### Pro ($20/month)
- Significantly more usage
- Access to all Claude models including Opus
- Unlimited Projects + RAG
- Priority access during peak hours

### Max ($100/month)
- The most usage, for power users
- Everything in Pro + priority support

### Team ($25–30/user/month)
- Everything in Pro
- **Collaboration** — share Projects with the team
- **Permission management** — set "Can use" / "Can edit" permissions
- **Sharing options** — share individually, in bulk, or organization-wide
- Admin dashboard
- Centralized billing

### Enterprise (contract pricing)
- Everything in Team
- Custom data retention policies
- SSO (Single Sign-On — log in once, use everywhere), SCIM provisioning (automatic user account management)
- Priority support
- Custom usage limits
- SLA guarantees

---

## Sharing Projects (Team/Enterprise)

### Permission Levels

| Permission | Capability |
|-----------|----------|
| **Can use** | View and chat in the project only |
| **Can edit** | Add/edit instructions, files, and settings |

### How to share

1. Open the Project you want to share
2. Click "Share" or "Manage members"
3. Add emails or invite the whole organization
4. Choose the permission level

---

## Connectors — connect to other tools

Connectors (a feature that lets Claude pull data from other apps directly) help Claude access data from external sources:

| Connector | Accessible data |
|-----------|-----------------|
| Google Drive | Documents, spreadsheets |
| Google Calendar | Appointments, schedules |
| Slack | Messages, channels |
| Jira | Tickets, projects |
| Confluence | Documents, wikis |
| GitHub | Repositories, code |
| Zapier | Connect to 6,000+ apps |

> Connectors require a Team or Enterprise plan for some features.

---

## Claude in the Chrome Extension

**Claude for Chrome** lets you use Claude directly in the browser:

- Select text on the web and ask Claude instantly
- Summarize the web page you're viewing
- Help draft a reply for an email or comment
- No need to switch tabs

---

## Claude Mobile Apps

Claude has apps for iOS and Android:

- Talk to Claude with voice input
- Access Projects and conversation history
- Offline-ready (usable even without internet, some features)
- A Widget for iOS/Android

---

## Claude for Education

For educational institutions:

- Special EDU pricing
- Features suited to teaching and learning
- Strict privacy policies for learners

---

## Tips for using Claude.ai effectively

### Create Projects matched to the work

```
Project: "Marketing Research 2025"
Instructions: Answer in English, focus on quantitative data
Files: research_brief.pdf, competitor_data.xlsx
```

### Use Custom Instructions wisely

```
"You are a Thai legal advisor. Answer carefully
and always remind the user to consult a lawyer for specific cases."
```

### Choose the Model to suit the work

In Claude.ai you can select the model:
- **Claude Haiku** — fast, easy work, short answers
- **Claude Sonnet** — general, production-ready work
- **Claude Opus** — complex work needing high accuracy

---

## Summary

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|-----------|
| Projects | 5 | Unlimited | Unlimited | Unlimited |
| RAG Mode | - | ✓ | ✓ | ✓ |
| Collaboration | - | - | ✓ | ✓ |
| Connectors | Partial | Partial | Full | Full |
| SSO/SCIM | - | - | - | ✓ |
| Custom Limits | - | - | - | ✓ |

Claude.ai is good for those who want to use Claude without coding; with Projects you can easily create a task-specific AI assistant. The Team plan is good for organizations that want their teams to collaborate on Claude.
