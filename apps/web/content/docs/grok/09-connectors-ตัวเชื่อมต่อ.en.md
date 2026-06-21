---
title: "Connectors — connect to external services"
tool: "Grok"
icon: "icon-docs"
level: "pro"
summary: "Connectors let Grok connect directly to external services during a conversation — search email, view your calendar, open files on a Cloud Drive — without leaving"
readTime: "3 min"
readers: "0"
locked: false
order: 9
---
# Connectors — connect to external services

> Reference: [Connectors Overview](https://docs.x.ai/grok/connectors) | [Google Drive](https://docs.x.ai/grok/connectors/google-drive) | [Gmail & Google Calendar](https://docs.x.ai/grok/connectors/gmail-google-calendar) | [OneDrive](https://docs.x.ai/grok/connectors/onedrive) | [Outlook](https://docs.x.ai/grok/connectors/outlook) | [SharePoint](https://docs.x.ai/grok/connectors/sharepoint) | [Microsoft Teams](https://docs.x.ai/grok/connectors/microsoft-teams) | [Salesforce](https://docs.x.ai/grok/connectors/salesforce) | [Custom MCP Tunneling](https://docs.x.ai/grok/connectors/custom-mcp-tunneling)

---

## What are Connectors?

**Connectors** let Grok connect directly to external services during a conversation — search email, view your calendar, open files on a Cloud Drive — without leaving the Grok screen.

Connectors are **available to every Grok user** via [grok.com/connectors](https://grok.com/connectors)

---

## Types of Connectors

### 1. Built-in Connectors (supported by xAI)

xAI maintains and develops these; they're easy to connect via OAuth (log in once).

| Connector | Connects to | Details |
|---|---|---|
| **Gmail & Google Calendar** | Gmail email + Google Calendar | [Guide](https://docs.x.ai/grok/connectors/gmail-google-calendar) |
| **Google Drive** | Google Drive, Docs, Sheets, Slides | [Guide](https://docs.x.ai/grok/connectors/google-drive) |
| **OneDrive** | Microsoft OneDrive | [Guide](https://docs.x.ai/grok/connectors/onedrive) |
| **Outlook Mail & Calendar** | Outlook email + calendar | [Guide](https://docs.x.ai/grok/connectors/outlook) |
| **SharePoint** | Microsoft SharePoint Sites | [Guide](https://docs.x.ai/grok/connectors/sharepoint) |

### 2. Connector Catalog (Third-party)

Beyond the Built-in ones, there are many third-party Connectors to choose from, e.g. **HubSpot, Slack, Notion** and more — also connected via OAuth.

See the full list at [grok.com/connectors](https://grok.com/connectors)

### 3. Custom MCP Connectors (your own)

If the service you want isn't in the Catalog, you can connect your own MCP Server.

---

## How to add a Connector

1. Go to [grok.com/connectors](https://grok.com/connectors)
2. Click **"New Connector"**
3. Choose the service you want (or pick **Custom** for MCP)
4. Do the OAuth Login per the steps
5. Grok uses that Connector automatically when a question is relevant

---

## Gmail & Google Calendar

Reference: [Gmail & Google Calendar](https://docs.x.ai/grok/connectors/gmail-google-calendar)

### What can it do?
- Search email: "Find the email from John last week"
- Summarize email: "Summarize today's unread emails"
- View calendar: "What meetings do I have tomorrow?"
- Find appointments: "Find the meeting with the Marketing team this month"

### Connection
Uses OAuth with your Google account — Grok requests only the permissions it needs.

---

## Google Drive

Reference: [Google Drive](https://docs.x.ai/grok/connectors/google-drive)

### What can it do?
- Search files: "Find the Q3 presentation slides I made last month"
- Read content: "Summarize the report I sent the team yesterday"
- Compare files: "Compare the budget from 2024 with 2025"

---

## OneDrive

Reference: [OneDrive](https://docs.x.ai/grok/connectors/onedrive)

### What can it do?
- Access your personal files on Microsoft OneDrive
- Search and read Word, Excel, PowerPoint documents

---

## Outlook Mail & Calendar

Reference: [Outlook Mail & Calendar](https://docs.x.ai/grok/connectors/outlook)

### What can it do?
- Search and read Outlook email
- View calendar and appointments
- "Find the email from HR about the new policy"

---

## SharePoint

Reference: [SharePoint](https://docs.x.ai/grok/connectors/sharepoint)

### What can it do?
- Access documents in your organization's SharePoint Sites
- Search data in Document Libraries
- "Search for the accounting SOP in the system"

---

## Microsoft Teams

Reference: [Microsoft Teams](https://docs.x.ai/grok/connectors/microsoft-teams)

### What can it do?
- Read messages in Teams Channels
- Search team conversations
- "What new messages are in the Engineering channel?"

---

## Salesforce

Reference: [Salesforce](https://docs.x.ai/grok/connectors/salesforce)

### What can it do?
- Pull Leads and Contacts data
- Search Opportunities
- "Show open Deals worth over 1 million baht"

---

## Custom MCP Tunneling

Reference: [Custom MCP Tunneling](https://docs.x.ai/grok/connectors/custom-mcp-tunneling)

### What is this topic?
If you want to connect Grok to an internal company system that isn't in the Catalog, you can build your own MCP Server and connect it to Grok via a Custom MCP Connector.

### What can it do?
- Connect to your organization's Internal API
- Connect to an internal Database
- Build any custom Tools you want

### How to add a Custom MCP

1. Go to [grok.com/connectors](https://grok.com/connectors)
2. Click **"New Connector"** → choose **"Custom"**
3. Enter the URL of your MCP Server
4. Do the Authentication as required
5. Grok discovers the Tools the MCP Server exposes and can use them immediately

---

## Example conversations with Connectors

**Example 1 — Gmail + Calendar:**
```
User: "What meetings do I have tomorrow, and which emails are waiting for a reply?"

Grok: [searches Calendar]
"Tomorrow you have 2 meetings:
- 09:00 — Weekly Standup with the Dev team
- 14:00 — Product Review with the PM

Emails waiting for a reply:
1. From Alice: about the Q4 budget (3 days ago)
2. From Bob: requesting a review of the Proposal (yesterday)"
```

**Example 2 — Google Drive:**
```
User: "Find this year's Budget Excel file and summarize it for me"

Grok: [searches Google Drive]
"Found 'Budget_2025_Final.xlsx', created on Jan 15.
Summary: total budget 5.2 million baht, split into Marketing 30%, R&D 40%, Ops 30%..."
```
