---
title: "API Error Handling"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "A guide to handling HTTP Errors, Task Failures, and setting up the right Retry Strategy for the Runway API so your application runs reliably"
readTime: "8 min"
readers: "0"
locked: false
order: 17
---

# API Error Handling

> Handling Errors correctly is essential for Production applications using the Runway API.

---

## Error types in the Runway API

Errors fall into 2 main types:

1. **HTTP Errors** — errors at the Request/Response level
2. **Task Failures** — the Task is created successfully but the Generation fails

---

## HTTP Errors

### 400 — Bad Request

**Occurs when:** Input validation fails — there's a problem with a sent Parameter

**Examples:**
- The image is larger than allowed
- An unsupported file format
- A required Parameter is missing
- An unsupported video Codec

**How to fix:**
- Read the Error message in the Response body
- Check the Input per the API Documentation
- Don't Retry — fix the Input first, always

```typescript
try {
  await client.imageToVideo.create({ ... });
} catch (error) {
  if (error.status === 400) {
    console.error('Input error:', error.message);
    // Check the Input and fix it; don't Retry
  }
}
```

---

### 401 — Unauthorized

**Occurs when:** the API Key is invalid or expired

**How to fix:**
- Check that `RUNWAYML_API_SECRET` is set correctly
- Check that the Key isn't Revoked
- Create a new Key if needed

---

### 404 — Not Found

**Occurs when:** the queried Task ID isn't in the system

**How to fix:**
- Check you're using the correct Task ID
- The Task may have been deleted after a long time

---

### 429 — Rate Limit Exceeded

**Occurs when:** you create too many Requests in a short time, or exceed the Daily Generation Limit

**How to fix:**
- **You must Retry** after waiting a while
- Use Exponential Backoff (backing off exponentially — waiting progressively longer each Retry)

```typescript
async function retryOn429<T>(fn: () => Promise<T>): Promise<T> {
  const maxRetries = 5;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
        const jitter = Math.random() * delay * 0.5;
        await sleep(delay + jitter);
        continue;
      }
      throw error;
    }
  }
}
```

---

### 502, 503, 504 — Server Errors

**Occurs when:** the Runway Server has a problem or is under high load

**How to fix:**
- **You must Retry** with Exponential Backoff
- The SDK handles Retry automatically for these Errors

---

## Task Failures

When the Task Status is `FAILED`, there's a `failureCode` indicating the cause:

### SAFETY.INPUT.* — Input violates the policy

**Error codes:** `SAFETY.INPUT.TEXT`, `SAFETY.INPUT.IMAGE`, `SAFETY.INPUT.VIDEO`

**Meaning:** The Input sent (text or image) violates the Content Moderation policy

**Should do:**
- **Don't Retry** — the result will be the same
- The Credits used **won't be refunded**
- Check and fix the Prompt or Image first

```typescript
if (task.failureCode?.startsWith('SAFETY.INPUT.')) {
  console.error('Content moderation violation:', task.failureCode);
  // Fix the prompt or image then try again
  // Don't Retry with the same input
}
```

---

### SAFETY.OUTPUT.* — Output violates the policy

**Error codes:** `SAFETY.OUTPUT.VIDEO`, `SAFETY.OUTPUT.IMAGE`

**Meaning:** Generation succeeded but the result was Blocked by Moderation

**Should do:**
- Adjust the Prompt differently, then try again
- Or adjust the `contentModeration` settings

---

### INPUT_PREPROCESSING.SAFETY.TEXT — the Prompt didn't pass

**Meaning:** The Prompt text was filtered before Processing

**Should do:**
- **Don't Retry** with the same Prompt
- Fix the Prompt then try again

---

### INTERNAL.BAD_OUTPUT.01 — low-quality Output

**Meaning:** Generation finished but the result was Rejected due to low quality or a problem

**Common causes:**
- The Input has a Logo, Watermark, or overlaid text
- The Prompt asks to create long text in the image

**Should do:**
- Remove the Logo/Watermark from the Input
- Adjust the Prompt, then Retry is OK

---

### INPUT_PREPROCESSING.INTERNAL — an internal problem

**Meaning:** The Preprocessing system had a temporary problem

**Should do:**
- **Retry is OK** but wait a Delay first

---

### ASSET.INVALID — the file doesn't meet the conditions

**Meaning:** The sent file doesn't match the Spec (size, Duration, resolution)

**Should do:**
- **Don't Retry** with the same file
- Fix the file to match the Spec, then try again

---

### INTERNAL — a general internal problem

**Meaning:** An unspecified internal system error

**Should do:**
- **Retry is OK** with a Delay

---

### null failureCode — unknown cause

**Meaning:** The Task failed but there's no Error code

**Should do:**
- **Retry is OK** with a Delay

---

## Error Codes summary table

| Error Code | Can Retry? | Credits refunded? | How to fix |
|---|---|---|---|
| `SAFETY.INPUT.*` | No | No | Fix the Input |
| `SAFETY.OUTPUT.*` | Adjust Prompt then Retry | No | Adjust the Prompt |
| `INPUT_PREPROCESSING.SAFETY.TEXT` | No | — | Fix the Prompt |
| `INPUT_PREPROCESSING.INTERNAL` | Yes (+ Delay) | — | Retry with a Delay |
| `INTERNAL.BAD_OUTPUT.01` | Adjust then Retry | — | Remove the Watermark |
| `ASSET.INVALID` | No (fix the file first) | — | Fix the file |
| `INTERNAL` / null | Yes (+ Delay) | — | Retry with a Delay |

---

## Full Error Handling example

```typescript
import RunwayML, { TaskFailedError, TaskTimeoutError, APIError } from '@runwayml/sdk';

const client = new RunwayML();

async function generateVideoSafely(imageUrl: string, prompt: string) {
  // Step 1: create the Task
  let task;
  try {
    task = await client.imageToVideo.create({
      model: 'gen4_turbo',
      promptImage: imageUrl,
      promptText: prompt,
      duration: 5,
      ratio: '1280:720',
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 400) {
        throw new Error(`Invalid input: ${error.message}`);
      } else if (error.status === 429) {
        // Rate limited — should Retry with backoff
        throw new Error('Rate limited, please retry later');
      } else if (error.status >= 500) {
        // Server error — Retry
        throw new Error('Server error, please retry');
      }
    }
    throw error;
  }

  // Step 2: wait for the result
  try {
    const result = await client.tasks.waitForTaskOutput(task.id, {
      timeout: 300_000
    });
    return result.output[0];
    
  } catch (error) {
    if (error instanceof TaskFailedError) {
      const code = error.task.failureCode;
      
      if (code?.startsWith('SAFETY.INPUT.')) {
        throw new Error('Content policy violation in input');
      } else if (code === 'ASSET.INVALID') {
        throw new Error('Invalid media file - check format and size');
      } else if (code === 'INTERNAL.BAD_OUTPUT.01') {
        throw new Error('Remove watermarks from input and retry');
      } else {
        // INTERNAL or null — Retry is OK
        throw new Error(`Generation failed: ${code || 'unknown'}`);
      }
    }
    
    if (error instanceof TaskTimeoutError) {
      console.warn(`Task ${task.id} timed out, check status manually`);
      throw error;
    }
    
    throw error;
  }
}
```

---

## Monitoring Errors in a Production system

It's recommended to Track these Metrics:

1. **Error Rate** — the number of Errors per total Requests
2. **Safety Violation Rate** — if too high, it means User Input has a problem
3. **Timeout Rate** — if high, you may need to increase the Timeout or check System Load
4. **Throttled Count** — the number of times you were Rate Limited

**Caution:** If there are too many Safety Violations, Runway may **Suspend the Account**.

---

## Account Suspension

**When you get Suspended:**
- Many continuous Safety Violations
- Use outside the Terms of Service

**Prevent it:**
- Do Pre-filtering of User Input before sending to the API
- Review Content users submit
- See the Blocked Content categories in the Help Center

**If Suspended:**
- Contact Runway via the Help Center to Appeal

---

## Summary

Good Error handling is the difference between a reliable application and one that crashes often. Remember the key points: Errors from Safety Violations must not be Retried with the same Input, Server Errors should be Retried with Exponential Backoff, and you must download the Output before the URL expires.
