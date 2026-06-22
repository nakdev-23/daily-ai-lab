---
title: "Runway API — getting started for developers"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "A getting-started guide to the Runway API for developers, from creating an account, creating an API Key, and buying Credits to making your first API call with Node.js and Python"
readTime: "10 min"
readers: "0"
locked: false
order: 14
---

# Runway API — getting started for developers

> The **Runway API** lets developers use Runway's AI video- and image-generation capabilities in their own applications via HTTP Requests.

---

## What is the Runway API?

The **Runway API** (Application Programming Interface) lets developers:
- Call Runway's AI models from their own code
- Create videos, images, and audio automatically
- Integrate AI Generation into a Web App, Mobile App, or Automation Workflow

---

## Step 1: Create a developer account

1. Go to [dev.runwayml.com](https://dev.runwayml.com)
2. Sign up or log in with your existing Runway Account
3. Create an **Organization** (the main account for the API)

> An **Organization** is a container holding the API Keys and Credits of an organization or project.

---

## Step 2: Create an API Key

An **API Key** (a secret code for authenticating with the API) is used to verify who you are when calling the API.

1. On the Developer Portal page, click **"API Keys"**
2. Click **"Create new key"**
3. Name the Key (e.g. "production", "development")
4. **Copy the Key immediately** — the Key is shown only once!

### API Key security

**Absolutely don't:**
- Don't Commit the API Key to a Git Repository
- Don't Hardcode it in Source Code
- Don't share it on Slack, Discord, or in public places

**The right way:**
- Use **Environment Variables** to store the Key
- Use a Secret Manager like AWS Secrets Manager, HashiCorp Vault
- Create a separate Key for each Environment (Dev/Staging/Production)

```bash
# Set the Environment Variable
export RUNWAYML_API_SECRET="your_api_key_here"
```

```powershell
# Windows PowerShell
$env:RUNWAYML_API_SECRET = "your_api_key_here"
```

---

## Step 3: Add Credits

Before you can call the API, you need Credits in your account:
1. Go to **Billing** in the Developer Portal
2. Add a Payment Method (Visa, Mastercard via Stripe)
3. Buy a minimum of $10 (1,000 credits) in Credits

---

## Step 4: Install the SDK

An **SDK** (Software Development Kit) makes calling the API easier.

### Node.js / TypeScript
```bash
npm install --save @runwayml/sdk
# or
yarn add @runwayml/sdk
# or
pnpm add @runwayml/sdk
```

**Requires:** Node.js 18 or higher

### Python
```bash
pip install runwayml
```

**Requires:** Python 3.8 or higher

---

## Step 5: Make your first API call

### Image-to-Video with Node.js

```javascript
import RunwayML from '@runwayml/sdk';

const client = new RunwayML();
// The SDK reads RUNWAYML_API_SECRET from the Environment Variable automatically

// Create a video from an image
const imageToVideo = await client.imageToVideo.create({
  model: 'gen4_turbo',
  promptImage: 'https://example.com/your-image.jpg',
  promptText: 'Camera slowly pans right, golden sunset',
  duration: 5,
  ratio: '1280:720',
});

// Wait for the job to finish
const task = await client.tasks.waitForTaskOutput(imageToVideo.id);
console.log('Video URL:', task.output[0]);
```

### Image-to-Video with Python

```python
import runwayml

client = runwayml.RunwayML()
# The SDK reads RUNWAYML_API_SECRET from the Environment Variable automatically

# Create a video
image_to_video = client.image_to_video.create(
    model='gen4_turbo',
    prompt_image='https://example.com/your-image.jpg',
    prompt_text='Camera slowly pans right, golden sunset',
    duration=5,
    ratio='1280:720',
)

# Wait for the result
task = client.tasks.wait_for_task_output(image_to_video.id)
print('Video URL:', task.output[0])
```

---

## Understanding Async Tasks

The Runway API works **Asynchronously** (processing in the background without blocking the program):

1. Call the API → get a **Task ID** back immediately
2. The Task runs in the background (PENDING → RUNNING)
3. When done, the Status changes to **SUCCEEDED** with Output URLs
4. If it fails, the Status is **FAILED** with an Error message

### All Task Statuses:
| Status | Meaning |
|---|---|
| **PENDING** | Awaiting processing |
| **RUNNING** | Being created |
| **SUCCEEDED** | Succeeded, has Output |
| **FAILED** | Failed |
| **CANCELED** | Canceled |

### Checking Status with Manual Polling

```javascript
// Node.js — check Status yourself
async function waitForTask(taskId) {
  while (true) {
    const task = await client.tasks.retrieve(taskId);
    
    if (task.status === 'SUCCEEDED') {
      return task.output;
    } else if (task.status === 'FAILED') {
      throw new Error(`Task failed: ${task.failureCode}`);
    }
    
    // Wait 5 seconds before the next Poll
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
```

### Use the Built-in Wait Method (recommended)

The SDK has `waitForTaskOutput()` / `wait_for_task_output()` that handles Polling automatically:
- Default Timeout: 10 minutes
- You can set a Custom Timeout

```javascript
// Wait with a Custom Timeout
const task = await client.tasks.waitForTaskOutput(taskId, {
  timeout: 300000 // 5 minutes (milliseconds)
});
```

---

## Text-to-Video

Besides Image-to-Video, you can create from pure text:

```javascript
// No promptImage → it's Text-to-Video
const task = await client.imageToVideo.create({
  model: 'gen4.5',
  promptText: 'A futuristic cityscape at night with flying cars',
  duration: 5,
  ratio: '1280:720',
});
```

---

## Text-to-Image

```javascript
const imageTask = await client.textToImage.create({
  model: 'gen4_image',
  promptText: 'A beautiful sunset over mountains, photorealistic',
  ratio: '1280:720',
});

const result = await client.tasks.waitForTaskOutput(imageTask.id);
console.log('Image URL:', result.output[0]);
```

---

## API Version Header

Every Request must specify the **API Version** via a Header:

```
X-Runway-Version: 2024-11-06
```

The SDK handles this Header automatically, but if you call directly via HTTP, you must include it yourself:

```bash
curl -X POST https://api.runwayml.com/v1/image_to_video \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Runway-Version: 2024-11-06" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gen4_turbo",
    "promptImage": "https://example.com/image.jpg",
    "duration": 5,
    "ratio": "1280:720"
  }'
```

---

## Summary

The Runway API opens the chance for developers to build new products with AI Video Generation. The main steps are: create an Organization → create an API Key → add Credits → install the SDK → call the API. The next chapter explains the SDK details and Error handling in depth.
