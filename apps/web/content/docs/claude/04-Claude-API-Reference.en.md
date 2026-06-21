---
title: "API Reference (Endpoint details)"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Reference: API overview"
readTime: "7 min"
readers: "0"
locked: false
order: 4
---
# Claude guide — Part 4: API Reference (Endpoint details)

> Compiled from [API overview](https://platform.claude.com/docs/en/api/overview) — endpoint details, authentication, limits, and the request/response formats of the Claude API

---

## 📖 Key terms for the API Reference

| Term | Plain meaning |
|---|---|
| **RESTful API** | A standard format for web APIs — send a request to a URL and get a response back |
| **Endpoint** | A URL specifying what to do, e.g. `POST /v1/messages` = send messages, `GET /v1/models` = list models |
| **POST / GET** | Ways to send data — POST = send data to create or process, GET = request to view data |
| **Request body** | The data sent with the request, e.g. the model used, the messages, and max_tokens |
| **Response** | The data received back from the API |
| **Authentication** | Proving you have the right to use the API by sending the API key with every request |
| **Header** | Extra info attached to the request besides the body, e.g. the API key and API version |
| **Bearer token** | A way to send an auth token in the form `Authorization: Bearer <token>` |
| **Rate limit** | A cap on the number of requests per time unit, to prevent overload |
| **RPM / TPM** | Requests Per Minute / Tokens Per Minute |
| **Token bucket** | A rate-limit algorithm — like a "bucket" filled with tokens bit by bit over time; you can draw no more than what's in the bucket |
| **Exponential backoff** | A retry method when you hit an error — wait 1 second → 2 seconds → 4 seconds → increasing |
| **Stateful** | Having state — remembers data and working state across requests |
| **Async** (Asynchronous) | Working in the background, not waiting for results immediately, e.g. send a batch then fetch results later |
| **Beta** | A feature still in testing; you must add the special `anthropic-beta` header to enable it |
| **GA** (General Availability) | A ready-to-use feature, stable and production-ready |

---

## 1. Claude API overview
Reference: [API overview](https://platform.claude.com/docs/en/api/overview)

### What is this topic?
The Claude API is a **RESTful API** (a standard format for sending data over the web) at `https://api.anthropic.com` providing programmatic access to Claude models and Claude Managed Agents.

### Prerequisites
- A [Claude Console](https://platform.claude.com) account
- An [API key](https://platform.claude.com/settings/keys) or a configured [Workload Identity Federation (WIF)](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation) rule

### Available APIs
**General Availability (GA) — ready-to-use, stable features:**
- **Messages API** — send messages to Claude (`POST /v1/messages`)
- **Message Batches API** — process many requests asynchronously (in the background), 50% cheaper (`POST /v1/messages/batches`)
- **Token Counting API** — count tokens before sending to plan cost (`POST /v1/messages/count_tokens`)
- **Models API** — list available models (`GET /v1/models`)

**Beta — testing features, must add the `anthropic-beta` header:**
- **Files API** — upload files to the server then reuse them across requests by ID (`POST /v1/files`)
- **Skills API** — create/manage agent skills (sets of specialized capabilities) (`POST /v1/skills`)
- **Agents API** — define an agent config (agent settings) to reuse (`POST /v1/agents`)
- **Sessions API** — run a **stateful** session (has state, remembers data) in a cloud sandbox (`POST /v1/sessions`)
- **Environments API** — set up a sandbox template (environment template) (`POST /v1/environments`)

### Quick summary
The Claude API = REST at api.anthropic.com with Messages, Batches, Token Counting, Models (GA), and Files, Skills, Agents, Sessions, Environments (beta).

---

## 2. Authentication
Reference: [Authentication](https://platform.claude.com/docs/en/manage-claude/authentication)

### Headers every request must have
| Header | Value | Required |
|---|---|---|
| `x-api-key` | The API key (secret) from the Console | Need one of (`x-api-key` or `Authorization`) |
| `Authorization` | `Bearer <token>` — a way to send an auth token (a short-lived access token from WIF) | Need one of them |
| `anthropic-version` | The API version, e.g. `2023-06-01` (specifies which API version you use) | Yes |
| `content-type` | `application/json` (says the data sent is JSON) | Yes |

- If you use a **Client SDK** (a Python/TypeScript, etc. toolkit), the SDK adds these headers automatically; you don't write them yourself
- Create an API key in [Account Settings](https://platform.claude.com/settings/keys) and use [workspaces](https://platform.claude.com/settings/workspaces) to separate keys/control cost by use case
- When accessing via a cloud platform, authentication integrates with that provider's IAM

### Cautions
Keep your API key secret, use an environment variable, don't commit it to a repo.

### Quick summary
Include `x-api-key` (or `Authorization: Bearer`) + `anthropic-version` + `content-type` on every request; the SDK handles it automatically.

---

## 3. Messages API (the main endpoint)
Reference: [Messages API reference](https://platform.claude.com/docs/en/api/messages/create)

### Endpoint
`POST /v1/messages`

### Main parameters in the Request body
- `model` (required) — e.g. `claude-opus-4-8`
- `max_tokens` (required) — the token cap for the result
- `messages` (required) — an array of `{role, content}` (role = `user`/`assistant`)
- `system` — a system prompt setting the role/behavior
- `temperature` — the randomness of the result (0 = same answer every time, 1 = more creative)
- `top_p`, `top_k` — other ways to control randomness (like temperature but different logic)
- `stop_sequences` — text sequences to stop on
- `stream` — `true` to stream the result
- `tools`, `tool_choice` — for tool use
- `metadata` — labeling info, e.g. `user_id`

### Example (cURL)
```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-opus-4-8",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello Claude"}]
  }'
```

### Response structure
- `id`, `type`, `role`, `model`
- `content` — an array of blocks (e.g. `{type: "text", text: ...}` or `tool_use`)
- `stop_reason` — why it stopped (`end_turn`, `max_tokens`, `tool_use`, `stop_sequence`)
- `usage` — `{input_tokens, output_tokens}`

### Quick summary
`POST /v1/messages` requires model, max_tokens, messages; returns content + stop_reason + usage.

---

## 4. Message Batches API
Reference: [Creating message batches](https://platform.claude.com/docs/en/api/creating-message-batches) · [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

### Key details from the official docs
- Send many Messages requests asynchronously in one batch (`POST /v1/messages/batches`)
- **50% cheaper** than synchronous calls
- Good for high-volume offline work that doesn't need an immediate answer (e.g. classifying tens of thousands of items)
- Results complete gradually; fetch them when the batch is fully done
- Max request size 256 MB

### Quick summary
Batches = send many requests asynchronously, save 50%, good for offline work.

---

## 5. Token Counting API
Reference: [Count tokens](https://platform.claude.com/docs/en/api/messages-count-tokens)

### Key details from the official docs
- `POST /v1/messages/count_tokens` counts the tokens of messages before actually sending
- Used to plan cost and not exceed the rate limit / context window
- Takes parameters similar to Messages (model, messages, system, tools)

### Quick summary
Count tokens in advance to control cost and request size.

---

## 6. Models API
Reference: [Models list](https://platform.claude.com/docs/en/api/models-list)

### Key details from the official docs
- `GET /v1/models` lists available models with details
- The response has `max_input_tokens`, `max_tokens`, and a `capabilities` object for each model
- Used to query a model's capabilities/token limits programmatically

### Quick summary
`GET /v1/models` views the model list and capabilities programmatically.

---

## 7. Files API (beta)
Reference: [Files API reference](https://platform.claude.com/docs/en/api/files-create) · [Files guide](https://platform.claude.com/docs/en/build-with-claude/files)

### Key details from the official docs
- `POST /v1/files` uploads a file, `GET /v1/files` lists them, delete with DELETE
- Reference a file by file ID across many requests without resending
- Max request size 500 MB
- It's beta; you must add the beta header

### Quick summary
Upload a file once, reference it by ID across many requests (beta).

---

## 8. Request sizes and Response Headers
Reference: [API overview](https://platform.claude.com/docs/en/api/overview)

### Request size limits
| Endpoint | Max size |
|---|---|
| Messages, Token Counting | 32 MB |
| Message Batches | 256 MB |
| Files | 500 MB |
| Sessions, Agents, Environments | 32 MB |

Exceeding the limit returns error 413 `request_too_large` (on Vertex the limit is 30 MB, Bedrock 20 MB)

### Response Headers
- `request-id` — a globally unique request ID (used for reporting issues/tracking)
- `anthropic-organization-id` — the organization ID of the API key used

### Quick summary
Messages limited to 32 MB, Batches 256 MB, Files 500 MB; responses always include request-id.

---

## 9. Rate limits and Spend limits
Reference: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits)

### Key details from the official docs
- The API has a **rate limit** (request cap) and a **spend limit** (cost cap) to prevent overload and manage server capacity
- It arranges **usage tiers** that increase automatically based on usage history; each tier has:
  - **Spend limit** — a monthly cost cap (if exceeded, service stops)
  - **Rate limit** — **RPM** (requests per minute) and **TPM** (tokens per minute)
- It uses the **token bucket** algorithm (like a bucket refilled bit by bit, where you can draw only what's in it) for rate limiting
- See your current limits in [Console → Limits](https://platform.claude.com/settings/limits); to request increases or a Priority Tier, contact sales

### Cautions
When you hit error 429 (rate limit exceeded), retry with **exponential backoff** — wait before retrying, and increase the wait time progressively, e.g. wait 1s → wait 2s → wait 4s → wait 8s, instead of resending immediately.

### Quick summary
There's a rate limit (RPM/TPM) + spend limit as auto-growing tiers; on 429, retry with backoff.

---

## 10. Errors and Beta headers
Reference: [Errors](https://platform.claude.com/docs/en/api/errors) · [Beta headers](https://platform.claude.com/docs/en/api/beta-headers)

### Common error codes
- `400 invalid_request_error` — malformed request
- `401 authentication_error` — invalid API key
- `403 permission_error` — no permission
- `404 not_found_error` — resource not found
- `413 request_too_large` — request too large
- `429 rate_limit_error` — rate limit exceeded
- `500 api_error` / `529 overloaded_error` — server-side/high load

### Beta headers
Beta features require the specified `anthropic-beta` header (e.g. `managed-agents-2026-04-01`)

### Quick summary
Handle errors by code (401 key, 429 rate limit, 5xx server-side); beta features require `anthropic-beta`.

---

## 11. Client SDKs and regional availability
Reference: [Client SDKs](https://platform.claude.com/docs/en/api/client-sdks) · [Supported regions](https://platform.claude.com/docs/en/api/supported-regions)

### Key details from the official docs
- Official SDKs: Python, TypeScript, Java, Go, C#, Ruby, PHP
- Benefits of the SDK: automatic header handling, **type-safe** (checking data types at coding time), retry/error handling (automatically retry on errors), streaming (receiving data piece by piece), timeout/connection management
- The API is available in many countries/regions; check the [supported regions page](https://platform.claude.com/docs/en/api/supported-regions)

### Quick summary
Use the official SDKs (7 languages) for convenience/safety; check supported regions before use.

---

## Additional reference topics
- Messages API: https://platform.claude.com/docs/en/api/messages/create
- Versioning: https://platform.claude.com/docs/en/api/versioning
- Workload Identity Federation: https://platform.claude.com/docs/en/manage-claude/workload-identity-federation
- Service tiers / Priority Tier: https://platform.claude.com/docs/en/api/service-tiers
