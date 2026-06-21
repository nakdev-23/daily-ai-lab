---
title: "Claude on cloud platforms"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "Reference: API overview"
readTime: "5 min"
readers: "0"
locked: false
order: 7
---
# Claude guide — Part 7: Claude on cloud platforms

> Compiled from [Claude API vs cloud platforms](https://platform.claude.com/docs/en/api/overview#claude-api-vs-cloud-platforms) and each platform's guide page — using Claude via AWS, Google Cloud, and Microsoft Azure

---

## 📖 Key terms for Cloud Platforms

| Term | Plain meaning |
|---|---|
| **Cloud platform** | A cloud service, e.g. AWS (Amazon), Google Cloud, Microsoft Azure — providing servers and various services over the internet |
| **IAM** (Identity and Access Management) | A system managing who has permission to do what in the cloud |
| **Commitment** | A contract with a cloud provider to use a minimum amount of service in exchange for better pricing |
| **Compliance** | Adhering to standards or laws, e.g. an industry's security requirements |
| **Data residency** | A requirement that data be stored in a certain region |
| **Payload** | All the data sent with a request (size limited by platform) |
| **Provisioned throughput** | Reserving processing capacity in advance — guarantees consistent speed but costs extra |
| **Routing** | Directing where a request is sent for processing |
| **Pay-as-you-go** | Pay for what you actually use, no reservation needed |
| **Premium (10%)** | An extra 10% charge for region-guaranteed routing |
| **Model Garden** | The page for exploring and selecting AI models on Google Cloud Vertex AI |
| **GCP project** | A project on Google Cloud Platform used to manage resources and billing |

---

## 1. Overview: direct Claude API vs cloud platforms
Reference: [API overview](https://platform.claude.com/docs/en/api/overview)

### What is this topic?
Claude is usable both via the Claude API directly and via cloud platforms; choose by infrastructure, the features you need, compliance requirements, and billing model.

### Comparison
- **Claude API (direct)** — get the latest models/features first, pay and receive support directly from Anthropic, good for new work that needs full features
- **Cloud platforms** — combine billing with the cloud service you already use and use that cloud's **IAM** (Identity and Access Management — a permission-control system) directly; features differ by platform; good for those who already have a commitment with a cloud or have specific compliance requirements

### Platform table
| Platform | Provider | Note |
|---|---|---|
| **Claude Platform on AWS** | AWS (operated by Anthropic) | Uses the same model IDs as the direct Claude API |
| **Amazon Bedrock** | AWS (partner-operated) | Uses Bedrock-style model IDs |
| **Vertex AI** | Google Cloud (partner) | model in the URL, `anthropic_version` in the body |
| **Microsoft Foundry** | Microsoft Azure (operated by Anthropic) | Opus context window 200k on Foundry |

### Quick summary
Use the direct Claude API if you want the fullest latest features; use the cloud if you already have a commitment/compliance with AWS, GCP, or Azure.

---

## 2. Claude on Vertex AI (Google Cloud)
Reference: [Claude on Vertex AI](https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai)

### What is this topic?
Claude models are usable via Google Cloud Vertex AI, with an API almost identical to the Messages API.

### Key differences from the direct Claude API
- **`model` is not sent in the body** but specified in the Google Cloud endpoint URL
- **`anthropic_version` is sent in the body** (not the header) and must be the value `vertex-2023-10-16`

### How to use it
1. Have a GCP project with Vertex AI enabled
2. Install the SDK, e.g. `from anthropic import AnthropicVertex`
3. Authenticate: `gcloud auth application-default login`

### Example (Python)
```python
from anthropic import AnthropicVertex

client = AnthropicVertex(project_id="MY_PROJECT_ID", region="global")

message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=100,
    messages=[{"role": "user", "content": "Hey Claude!"}],
)
print(message)
```

### Model IDs (Vertex)
`claude-opus-4-8`, `claude-sonnet-4-6`, `claude-sonnet-4-5@20250929`, `claude-haiku-4-5@20251001`, etc. — availability differs by region; check the Vertex AI Model Garden.

### Endpoint types (data send/receive points)
- **Global (recommended)** — dynamic **routing** to the most available server for maximum availability, no premium, supports only **pay-as-you-go**
- **Multi-region** (`us`/`eu`) — routing within one broad geographic area, for broad **data residency** and high availability, with a 10% premium
- **Regional** (e.g. `us-east1`) — guarantees data passes through a specific region only, necessary for strict data residency/specific compliance/**provisioned throughput** (reserved processing capacity), with a 10% premium

### Features not supported on Vertex
- Input from URLs (images/documents), Files API
- Server-side tools (code execution, web fetch, advisor)
- Agent infrastructure (Agent Skills, MCP connector, programmatic tool calling)
- Endpoints: Message Batches, Models, Admin, Compliance, Usage and Cost
- Claude Managed Agents

### Context window
Opus 4.8/4.7/4.6 and Sonnet 4.6 = 1M tokens on Vertex; other versions (Sonnet 4.5, etc.) = 200k; payload limited to 30 MB.

### Cautions
- Data retention is under Google Cloud Vertex AI; Anthropic recommends enabling rolling request-response logging for at least 30 days to detect misuse.

### Quick summary
Vertex: put model in the URL, `anthropic_version: vertex-2023-10-16` in the body, use the AnthropicVertex SDK; the global endpoint is recommended; some features aren't supported.

---

## 3. Claude on Amazon Bedrock (AWS)
Reference: [Claude in Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock)

### What is this topic?
Claude models are usable via Amazon Bedrock, combining billing and IAM with AWS.

### Key details from the official docs
- Use **Bedrock-style model IDs** like `anthropic.claude-sonnet-4-6`, with a region prefix for cross-region, e.g. `us.anthropic.claude-sonnet-4-6`
- Authenticate via AWS credentials/IAM; SDKs support it (e.g. `AnthropicBedrock`)
- From Sonnet 4.5 onward, Bedrock has **global endpoints** (dynamic routing) and **regional endpoints** (guaranteeing the data path by region)
- You must request access to Claude models in Bedrock (and every region needed for cross-region)
- Request payload limited to 20 MB
- The model lifecycle/retirement dates are set by the partner and may differ from the Claude API

### How to use it (overview)
1. Enable Amazon Bedrock and request access to Claude models
2. Set up AWS credentials/IAM roles
3. Call via the SDK, specifying the Bedrock model ID

### Quick summary
Bedrock: use Bedrock model IDs (with region prefix), authenticate with AWS IAM, request model access first, payload limited to 20 MB.

---

## 4. Claude Platform on AWS (operated by Anthropic on AWS)
Reference: [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws)

### Key details from the official docs
- A platform on AWS that **Anthropic operates itself**, unlike Bedrock (partner-operated)
- **Uses the same model IDs as the direct Claude API** (e.g. `claude-opus-4-6`), not Bedrock-style
- The model lifecycle follows Anthropic's own deprecations table
- Also supports Claude Managed Agents (with some differences)
- Adds an `x-amzn-requestid` header alongside the standard `request-id`

### Quick summary
Claude Platform on AWS = Anthropic operates on AWS, uses the same model IDs as the direct API, and the lifecycle follows Anthropic.

---

## 5. Claude on Microsoft Foundry (Azure)
Reference: [Claude in Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry)

### Key details from the official docs
- Claude models are usable via Microsoft Azure (Foundry), which **Anthropic operates**
- Authentication integrates with Azure credentials/IAM
- **Note:** On Foundry, Claude Opus 4.8 has a 200k-token context window (different from 1M on the direct API)

### Quick summary
Foundry: use Claude via Azure (operated by Anthropic); Opus context window is 200k on this platform.

---

## 6. Choosing a platform and pricing
Reference: [Cloud platform pricing](https://platform.claude.com/docs/en/about-claude/pricing#cloud-platform-pricing)

### How to choose
- Have a commitment with **AWS** → Bedrock or Claude Platform on AWS
- Have a commitment with **Google Cloud** → Vertex AI
- Have a commitment with **Azure** → Microsoft Foundry
- Want the **fullest latest features** → the direct Claude API

### Pricing cautions
- Regional/multi-region endpoints usually have a 10% premium over the global endpoint
- Prices and features differ by platform; always check the official pricing page

### Quick summary
Choose the platform by the cloud you already use; the global endpoint is 10% cheaper than regional; features/prices differ by platform.

---

## Additional reference topics
- Amazon Bedrock: https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock
- Claude Platform on AWS: https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws
- Microsoft Foundry: https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry
- Features overview (features by platform): https://platform.claude.com/docs/en/build-with-claude/overview
