---
title: "Images API overview — Authentication and getting started"
tool: "DALL·E"
icon: "icon-docs"
level: "intermediate"
summary: "An introduction to the OpenAI Images API for developers, covering authentication, the API key, and the API's basic structure"
readTime: "6 min"
readers: "0"
locked: false
order: 4
---
# Images API overview — Authentication and getting started

> Primary reference: [OpenAI Images API Reference](https://platform.openai.com/docs/api-reference/images)

---

## What is the Images API

The **Images API** is OpenAI's REST API (a way for programs to communicate over the internet — sending requests and receiving results in JSON) that lets developers integrate DALL·E's abilities into their own applications.

With the Images API you can:
- **Create images from text** via the Generation Endpoint (the API endpoint for creating new images)
- **Edit existing images** via the Edit Endpoint (the API endpoint for editing images)
- **Create variations** via the Variation Endpoint (the API endpoint for creating several versions from an original image)

---

## Getting-started steps

### Step 1: Sign up for an OpenAI account

Go to [platform.openai.com](https://platform.openai.com) and sign up for an OpenAI account (if you don't have one).

### Step 2: Create an API Key

The **API Key** (a secret code for authenticating API calls — like a password your program uses to prove it's you) is the most important thing for using the API.

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Name the key something memorable, e.g. "my-dall-e-project"
4. **Copy and store the key in a safe place** — you'll only see this key once!

> **Warning:** Don't share your API key with anyone, and don't write the key directly in your source code. Use an environment variable (a way to store secret data separately from the main code) instead.

### Step 3: Install the OpenAI Library

**For Python:**
```bash
pip install openai
```

**For Node.js:**
```bash
npm install openai
```

### Step 4: Set the API Key

**The recommended way — use an environment variable:**

For macOS/Linux:
```bash
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

For Windows (PowerShell):
```powershell
$env:OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

Or create a `.env` file:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Authentication

Every request (the data sent to the API) must include the API key in the **Authorization Header** (the part of the request for authentication).

### Basic HTTP Request format

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Example API call with Python

```python
from openai import OpenAI

# Create a client (the API connector — manages sending and receiving data automatically)
client = OpenAI(
    api_key="sk-xxxxxxxx"  # should use os.environ.get("OPENAI_API_KEY") instead
)

# Call the Images API to create an image
response = client.images.generate(
    model="dall-e-3",
    prompt="A beautiful sunset over the mountains",
    size="1024x1024",
    quality="standard",
    n=1,
)

# Get the URL of the created image
image_url = response.data[0].url
print(image_url)
```

### Example API call with Node.js

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A beautiful sunset over the mountains",
  size: "1024x1024",
  quality: "standard",
  n: 1,
});

const imageUrl = response.data[0].url;
console.log(imageUrl);
```

### Example API call with cURL (a terminal command)

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A beautiful sunset over the mountains",
    "n": 1,
    "size": "1024x1024"
  }'
```

---

## Base URL and main endpoints

**Base URL** (the API's main address before specifying the request type): `https://api.openai.com/v1`

| Endpoint | HTTP Method | Purpose |
|---|---|---|
| `/images/generations` | POST | Create an image from a prompt |
| `/images/edits` | POST | Edit an existing image |
| `/images/variations` | POST | Create variations |

---

## Response structure (the data the API returns)

When the API creates an image successfully, it returns JSON in this form:

```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "revised_prompt": "A majestic mountain landscape at golden hour..."
    }
  ]
}
```

| Field | Description |
|---|---|
| `created` | A timestamp (the creation time in Unix timestamp format) |
| `data` | An array (a list — the created images) of created images |
| `data[].url` | A temporary URL of the image (expires after 1 hour) |
| `data[].b64_json` | The image data in Base64 form (if you choose response_format as b64_json) |
| `data[].revised_prompt` | The prompt DALL·E 3 auto-adjusted |

---

## Error Handling

When an error occurs, the API returns an error response:

```json
{
  "error": {
    "code": "content_policy_violation",
    "message": "Your request was rejected as a result of our safety system...",
    "type": "invalid_request_error"
  }
}
```

### Common error codes

| Error Code | Meaning | Fix |
|---|---|---|
| `invalid_api_key` | The API key is incorrect | Check the API key again |
| `content_policy_violation` | The prompt violates the content policy | Adjust the prompt to be appropriate |
| `rate_limit_exceeded` | You used the API over the limit | Wait and try again, or upgrade your plan |
| `insufficient_quota` | The account's credit ran out | Top up credit in the OpenAI Dashboard |
| `invalid_request_error` | The request has an invalid format | Check the parameters |

### Example error handling in Python

```python
from openai import OpenAI, OpenAIError

client = OpenAI()

try:
    response = client.images.generate(
        model="dall-e-3",
        prompt="A sunset landscape",
        size="1024x1024",
        n=1,
    )
    image_url = response.data[0].url
    print(f"Image created successfully: {image_url}")

except OpenAIError as e:
    print(f"An error occurred: {e.message}")
```

---

## Worth knowing for beginning developers

### 1. The image URL lasts 1 hour

The URL the API returns expires within 1 hour. If you want to keep the image:
- Download the image file and store it in your own storage
- Or use `response_format: "b64_json"` to receive the image data directly without a URL

### 2. You must top up credit before use

The Images API uses credit in your OpenAI account, which you must buy first (Pay-as-you-go). Go to [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing) to top up.

### 3. Check your usage

See your usage and cost at [platform.openai.com/usage](https://platform.openai.com/usage)

---

## Summary

OpenAI's Images API lets developers easily integrate DALL·E's abilities into their own applications. Just have an API key, install the library you need, and call the appropriate endpoint. In the next chapter we'll learn the details of each endpoint in depth.
