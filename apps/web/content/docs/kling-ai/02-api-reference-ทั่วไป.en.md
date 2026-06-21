---
title: "API Reference — general info"
tool: "Kling AI"
icon: "icon-docs"
level: "beginner"
summary: "https://api-singapore.klingai.com"
readTime: "5 min"
readers: "0"
locked: false
order: 2
---
# 02 · API Reference — general info

> Official Docs reference:
> - [General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)
> - [Rate Limits](https://kling.ai/document-api/apiReference%2FrateLimits)
> - [Callback Schema](https://kling.ai/document-api/apiReference%2FcallbackProtocol)

---

## 1. General Information

> Reference: [General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)

### 1.1 API Domain (the main Endpoint)

```
https://api-singapore.klingai.com
```

> **Note:** The old API address (`https://api.klingai.com`) has been changed to `api-singapore.klingai.com`. Always use the new endpoint.

---

### 1.2 API Authentication

Kling AI uses **JWT (JSON Web Token)** for authentication, which differs from a plain API Key in that you must create a new Token every time you call the API.

#### How to create a JWT Token (3 steps)

**Step 1:** Get your AccessKey and SecretKey from the Account page of Kling AI

**Step 2:** Create the JWT Token using HS256 encryption

Data in the JWT:
| Part | Detail |
|------|-----------|
| Header | `alg: HS256`, `typ: JWT` |
| Payload `iss` | Set to your AccessKey |
| Payload `exp` | Expiry = current time + 1800 seconds (30 minutes) |
| Payload `nbf` | Not-before time = current time − 5 seconds |

```python
import time
import jwt  # pip install PyJWT

def encode_jwt_token(ak: str, sk: str) -> str:
    headers = {
        "alg": "HS256",
        "typ": "JWT"
    }
    payload = {
        "iss": ak,                          # AccessKey
        "exp": int(time.time()) + 1800,     # expires in 30 minutes
        "nbf": int(time.time()) - 5         # valid from 5 seconds ago
    }
    token = jwt.encode(payload, sk, algorithm="HS256", headers=headers)
    return token

# Create the Token
token = encode_jwt_token("your_access_key", "your_secret_key")
print(f"API Token: {token}")
```

**Step 3:** Put the Token in the Request Header every time you call the API

```
Authorization: Bearer <TOKEN_created_in_step_2>
```

> ⚠️ There must always be a space between `Bearer` and the Token.

---

### 1.3 Error Code

| HTTP Status | Service Code | Type | Meaning | How to fix |
|-------------|-------------|--------|----------|---------|
| 200 | - | Success | Request succeeded | - |
| 401 | 1000 | Authentication Failed | Authentication failed | Check the Authorization Header |
| 401 | 1001 | Authentication Failed | No Authorization | Add the Authorization Header correctly |
| 401 | 1002 | Authentication Failed | Invalid Authorization | Check the Authorization format |
| 401 | 1003 | Authentication Failed | The Token isn't valid yet | Wait for the Token to take effect, or create a new one |
| 401 | 1004 | Authentication Failed | The Token has expired | Create a new Token |
| 429 | 1100 | Account Exception | An account problem | Check the account settings |
| 429 | 1101 | Account Exception | The account has an outstanding balance | Top up sufficiently |
| 429 | 1102 | Account Exception | The Resource Pack is exhausted or expired | Buy more packages |
| 403 | 1103 | Account Exception | No permission for that API/Model | Check the account permissions |
| 400 | 1200 | Invalid Parameters | Invalid parameters | Check all parameters |
| 400 | 1201 | Invalid Parameters | Wrong key or parameter value | See the message in the `message` field |
| 404 | 1202 | Invalid Parameters | Incorrect HTTP Method | Use the Method per the Docs |
| 404 | 1203 | Invalid Parameters | The Resource doesn't exist (e.g. Model) | See the message in the `message` field |
| 400 | 1300 | Policy Triggered | Violates Platform Policy | Check what broke the rules |
| 400 | 1301 | Policy Triggered | Content violates the Content Policy | Edit the Prompt and resend |
| 429 | 1302 | Policy Triggered | Calling the API too fast (Rate Limit) | Lower the frequency, or contact Support |
| 429 | 1303 | Policy Triggered | Exceeded the package's Concurrency | Lower the frequency, wait and retry |
| 429 | 1304 | Policy Triggered | IP not in the Whitelist | Contact Support |
| 500 | 5000 | Internal Error | Server Error | Wait and retry, or contact Support |
| 503 | 5001 | Internal Error | Server temporarily unavailable (maintenance) | Wait and retry |
| 504 | 5002 | Internal Error | Server Timeout (job queued) | Wait and retry |

---

## 2. Rate Limits — concurrency usage limits

> Reference: [Rate Limits / Concurrency Rules](https://kling.ai/document-api/apiReference%2FrateLimits)

### What is this topic?

**Kling API Concurrency** means the maximum number of Tasks an account can process at the same time, which depends on the resource package you purchased.

### Main rules of Concurrency

| Dimension | Detail |
|------|-----------|
| **Counting level** | Counted at the Account Level, calculated separately by Resource Pack type (Video/Image/Try-On) |
| **Counting time** | Counted from when a job is in `submitted` status until it `succeed`s or `fail`s |
| **Quota calculation** | Uses the highest Concurrency value among all Active packages, e.g. if you have package A (5 concurrent) and B (10 concurrent) at once, the value used = 10 |

> **Note:** The Concurrency Limit applies to **creating tasks (Create Task)** only. Querying the status doesn't count.

### Counting Concurrency per job type

- **Video / Virtual Try-On**: 1 job = always uses 1 Concurrency
- **Images**: uses Concurrency = the `n` parameter sent, e.g. requesting 9 images = uses 9 Concurrency

### When you exceed the Limit, you get this Error

```json
{
  "code": 1303,
  "message": "parallel task over resource pack limit",
  "request_id": "9984d27b-a408-4073-ae28-17ca6a13622d"
}
```

### Recommended fix

**1. Backoff Retry Strategy** — if you get Error 1303, wait before retrying, using Exponential Backoff (increasing waits), starting with a wait of ≥ 1 second

**2. Queue Management** — control the job submission rate via a Task Queue and adjust based on the Concurrency available at the time

---

## 3. Callback Schema — the format for reporting results

> Reference: [Callback Protocol](https://kling.ai/document-api/apiReference%2FcallbackProtocol)

### What is this topic?

Because the Kling API works **asynchronously (doesn't wait for the result)**, when a job is done the system can send the result to a designated URL (Callback URL) automatically, instead of having to keep asking for the status.

### Callback data structure (JSON)

```json
{
  "task_id": "string",           // the Task ID the system generates
  "task_status": "string",       // status: submitted | processing | succeed | failed
  "task_status_msg": "string",   // the status message (shows the cause if failed)
  "created_at": 1722769557708,   // job creation time (Unix timestamp, ms)
  "updated_at": 1722769557708,   // last update time (Unix timestamp, ms)
  "final_unit_deduction": "string", // the number of Units deducted
  "task_info": { ... },          // the parameters sent when creating the job
  "external_task_id": "string",  // the user-defined Task ID (if any)
  "task_result": {
    "images": [                  // image job results
      {
        "index": 0,              // image order
        "url": "string"          // the created image's URL (temporary!)
      }
    ],
    "videos": [                  // video job results
      {
        "id": "string",          // Video ID (globally unique)
        "url": "string",         // the created video's URL (temporary!)
        "duration": "string"     // the video length (seconds)
      }
    ]
  }
}
```

### Task Status

| Status | Meaning |
|--------|---------|
| `submitted` | The job was submitted and is awaiting processing |
| `processing` | Being created |
| `succeed` | Succeeded — ready to download |
| `failed` | Failed — see the cause in `task_status_msg` |

### Cautions

> ⚠️ **Image and video URLs are temporary** — they're deleted after a while. Download and save them immediately upon receiving the result.

### How to use a Callback URL

When creating a job, include the `callback_url` parameter in the request:

```json
{
  "model": "kling-v2-6",
  "prompt": "...",
  "callback_url": "https://your-server.com/kling-callback"
}
```

The system POSTs the result to that URL automatically when the job is done.
