---
title: "Runway API SDKs — Node.js and Python"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "A detailed guide to using the Runway SDK for Node.js and Python, including Task management, Error Handling, and advanced techniques"
readTime: "10 min"
readers: "0"
locked: false
order: 15
---

# Runway API SDKs — Node.js and Python

> Runway's **SDK** (Software Development Kit) makes calling the API easier, with built-in Type Safety and Error Handling.

---

## Why use the SDK instead of calling HTTP directly?

| SDK | Direct HTTP Request |
|---|---|
| Has Type Safety (TypeScript/Python) | Handle it yourself |
| Handles Retry automatically | Write it yourself |
| Has a Helper for Polling | Write the Loop yourself |
| Typed Errors | Parse JSON yourself |
| Updates with the API Version | Update the code yourself |

---

## Node.js SDK

### Installation

```bash
npm install --save @runwayml/sdk
```

```bash
yarn add @runwayml/sdk
```

```bash
pnpm add @runwayml/sdk
```

**Requirement:** Node.js 18+, TypeScript (recommended)

### Initial setup

```typescript
import RunwayML from '@runwayml/sdk';

// Method 1: read from the Environment Variable automatically (recommended)
const client = new RunwayML();

// Method 2: specify the Key directly (for testing only)
const client = new RunwayML({
  apiKey: 'your_api_key_here' // don't do this in production!
});
```

### API Endpoints → SDK Methods

| API Endpoint | Node.js Method |
|---|---|
| `POST /v1/image_to_video` | `client.imageToVideo.create()` |
| `POST /v1/text_to_image` | `client.textToImage.create()` |
| `GET /v1/tasks/{id}` | `client.tasks.retrieve(id)` |
| `POST /v1/uploads` | `client.uploads.createEphemeral()` |

---

## Python SDK

### Installation

```bash
pip install runwayml
```

```bash
# or with uv (faster)
uv add runwayml
```

**Requirement:** Python 3.8+, has MyPy type annotations

### Initial setup

```python
import runwayml

# Method 1: read from the Environment Variable automatically
client = runwayml.RunwayML()

# Method 2: specify the Key directly (for testing only)
client = runwayml.RunwayML(api_key='your_api_key_here')
```

### API Endpoints → Python Methods

| API Endpoint | Python Method |
|---|---|
| `POST /v1/image_to_video` | `client.image_to_video.create()` |
| `POST /v1/text_to_image` | `client.text_to_image.create()` |
| `GET /v1/tasks/{id}` | `client.tasks.retrieve(id)` |
| `POST /v1/uploads` | `client.uploads.create_ephemeral()` |

---

## Commonly used code examples

### Basic Video Generation

```typescript
// Node.js/TypeScript
import RunwayML from '@runwayml/sdk';

const client = new RunwayML();

async function generateVideo(imageUrl: string, prompt: string) {
  // Start creating the video
  const task = await client.imageToVideo.create({
    model: 'gen4_turbo',
    promptImage: imageUrl,
    promptText: prompt,
    duration: 5,
    ratio: '1280:720',
  });

  console.log(`Task started: ${task.id}`);
  
  // Wait until done (5-minute timeout)
  const result = await client.tasks.waitForTaskOutput(task.id, {
    timeout: 300_000
  });
  
  return result.output[0]; // the URL of the created video
}

// Usage
const videoUrl = await generateVideo(
  'https://example.com/photo.jpg',
  'Gentle waves moving, soft morning light'
);
console.log('Video ready:', videoUrl);
```

```python
# Python
import runwayml

client = runwayml.RunwayML()

def generate_video(image_url: str, prompt: str) -> str:
    # Start creating the video
    task = client.image_to_video.create(
        model='gen4_turbo',
        prompt_image=image_url,
        prompt_text=prompt,
        duration=5,
        ratio='1280:720',
    )
    
    print(f"Task started: {task.id}")
    
    # Wait until done
    result = client.tasks.wait_for_task_output(task.id, timeout=300)
    
    return result.output[0]  # the video URL

video_url = generate_video(
    'https://example.com/photo.jpg',
    'Gentle waves moving, soft morning light'
)
print(f'Video ready: {video_url}')
```

---

## Error Handling

### The Error types the SDK throws:

**TaskFailedError** (the Task failed):
```typescript
import { TaskFailedError } from '@runwayml/sdk';

try {
  const result = await client.tasks.waitForTaskOutput(taskId);
} catch (error) {
  if (error instanceof TaskFailedError) {
    console.error('Generation failed:', error.task.failureCode);
    // e.g.: SAFETY.INPUT.TEXT, INTERNAL.BAD_OUTPUT.01
  }
}
```

**TaskTimeoutError** (the Task took too long):
```typescript
import { TaskTimeoutError } from '@runwayml/sdk';

try {
  const result = await client.tasks.waitForTaskOutput(taskId, {
    timeout: 120_000 // 2 minutes
  });
} catch (error) {
  if (error instanceof TaskTimeoutError) {
    console.log('Task timed out, checking manually...');
    // You can Retrieve task.id and check later
  }
}
```

**HTTP Errors:**
```typescript
import { APIError } from '@runwayml/sdk';

try {
  const task = await client.imageToVideo.create({ ... });
} catch (error) {
  if (error instanceof APIError) {
    console.error('HTTP Error:', error.status, error.message);
    
    if (error.status === 429) {
      // Rate limit — wait and retry
    } else if (error.status === 400) {
      // Bad Input — fix it before retrying
    }
  }
}
```

---

## Ephemeral Uploads — upload large files

An **Ephemeral Upload** (a temporary upload) is used when a file exceeds 32MB.

```typescript
// Node.js
import { createReadStream } from 'fs';

// Upload a file from disk
const upload = await client.uploads.createEphemeral(
  createReadStream('/path/to/video.mp4'),
  { filename: 'video.mp4' }
);

// Use the runway:// URI in the API request
const task = await client.imageToVideo.create({
  model: 'gen4_turbo',
  promptImage: upload.id, // runway:// URI
  promptText: 'Ocean waves',
  duration: 5,
  ratio: '1280:720',
});
```

```python
# Python
with open('/path/to/image.jpg', 'rb') as f:
    upload = client.uploads.create_ephemeral(f, filename='image.jpg')

task = client.image_to_video.create(
    model='gen4_turbo',
    prompt_image=upload.id,  # runway:// URI
    prompt_text='Ocean waves',
    duration=5,
    ratio='1280:720',
)
```

**Ephemeral Upload limits:**
- The URI is usable for **24 hours only**
- File size: 512 bytes - 200MB
- If it fails, you must start the Upload over (don't Retry the same one)

---

## Data URI — embed Base64 directly in code

A **Data URI** (encoding a file as Base64 then embedding it in code) is used when you want to send an image without an external URL.

```typescript
import { readFileSync } from 'fs';

// Convert an image to a Base64 Data URI
const imageBuffer = readFileSync('/path/to/image.jpg');
const base64 = imageBuffer.toString('base64');
const dataUri = `data:image/jpeg;base64,${base64}`;

const task = await client.imageToVideo.create({
  model: 'gen4_turbo',
  promptImage: dataUri,
  promptText: 'Ocean waves',
  duration: 5,
  ratio: '1280:720',
});
```

**Data URI limits:**
- Images: up to **5MB**
- Videos: up to **16MB**
- Base64 increases the file size by ~33%

---

## Retry Strategy

The SDK handles Retry automatically for some Error types, but for Rate Limit (429) and Server Error (502-504) it's recommended to use **Exponential Backoff with Jitter**:

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const baseDelay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      const jitter = Math.random() * baseDelay * 0.5; // add randomness
      await new Promise(r => setTimeout(r, baseDelay + jitter));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const result = await withRetry(() => 
  client.imageToVideo.create({ ... })
);
```

**Jitter** (randomness added to the wait time) prevents the **Thundering Herd** (the problem where many Clients Retry at the same time and flood the Server).

---

## Managing Concurrency

When creating several videos at once, watch the **Concurrency Limit**:

```typescript
// Create 5 videos at once (if the Concurrency Limit >= 5)
const promises = imageUrls.map(url => 
  client.imageToVideo.create({
    model: 'gen4_turbo',
    promptImage: url,
    promptText: 'Ocean waves',
    duration: 5,
    ratio: '1280:720',
  })
);

const tasks = await Promise.all(promises);

// Wait for all videos
const results = await Promise.all(
  tasks.map(task => client.tasks.waitForTaskOutput(task.id))
);
```

**Note:** If you send more than the Concurrency Limit, the jobs are Queued and wait; you don't get an Error immediately.

---

## Summary

The Runway SDK for Node.js and Python covers every need, from basic Generation to Error handling, uploading large files, and running multiple Tasks at once. It's recommended to always use `waitForTaskOutput()` instead of writing your own Polling, and don't forget to handle Errors properly to make your application robust.
