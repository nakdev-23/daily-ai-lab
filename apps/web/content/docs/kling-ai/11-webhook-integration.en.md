---
title: "Webhook Integration — receive results automatically"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Set up a Webhook Server to receive results from Kling AI by Push instead of repeated Polling, including Signature Verification, Retry Logic, and Production Patterns"
readTime: "7 min"
readers: "0"
locked: false
order: 11
---
# 11 · Webhook Integration — receive results automatically

> Official Docs reference:
> - [Callback Protocol](https://kling.ai/document-api/apiReference%2FcallbackProtocol)
> - [General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)

---

## 1. What is a Webhook, and why use it

A Webhook (an automatic notification — the server sends data to your app when an event occurs) is a way to receive results from Kling AI by Push (the data is pushed to you) instead of having to ask repeatedly.

Kling AI works **asynchronously** (doesn't wait for the result — you submit and it works in the background) — when you create a job, the API replies with just a `task_id` immediately, then creates the job in the background. There are two ways to receive the result:

| Method | Description | Good for |
|------|----------|----------|
| **Polling** (asking repeatedly — send a request every N seconds to check status) | Ask the API repeatedly every N seconds until the job is done | 1–2 jobs at a time, simple Scripts |
| **Webhook (Callback URL)** | Kling sends the result to you when done; no asking needed | Production Apps (apps in real use), high job volume |

**Benefits of Webhooks:**
- No API Requests wasted on repeatedly asking for status
- Responds immediately when the job is done (Near Real-time)
- Handles high job volumes better (scales better)
- Simpler code than Polling

---

## 2. How to set up a Webhook URL

When creating a job, include the `callback_url` (the URL Kling will send the result to) in the request:

```json
{
  "model": "kling-v2-6",
  "prompt": "A mountain lake reflecting the sky at sunrise",
  "duration": "5",
  "callback_url": "https://your-server.com/webhooks/kling"
}
```

When the job is done, Kling **POSTs** the result to the specified `callback_url`.

---

## 3. Callback data structure

Kling sends JSON (a standard machine-readable data format) like this:

```json
{
  "task_id": "abc123def456",
  "task_status": "succeed",
  "task_status_msg": "",
  "created_at": 1722769557708,
  "updated_at": 1722769600123,
  "final_unit_deduction": "1",
  "task_info": {
    "model": "kling-v2-6",
    "prompt": "A mountain lake reflecting the sky at sunrise",
    "duration": "5",
    "aspect_ratio": "16:9"
  },
  "external_task_id": "my-job-001",
  "task_result": {
    "videos": [
      {
        "id": "vid_xyz789",
        "url": "https://cdn.klingai.com/video/vid_xyz789.mp4",
        "duration": "5"
      }
    ]
  }
}
```

### Possible statuses

| `task_status` | Meaning |
|---------------|----------|
| `submitted` | The job is in the queue (a Callback may be sent) |
| `processing` | Being created |
| `succeed` | Succeeded — see the result in `task_result` |
| `failed` | Failed — see the cause in `task_status_msg` |

---

## 4. Webhook Server — Python (Flask)

```python
"""
webhook_server.py — Kling AI Webhook Handler (Flask)
Install: pip install flask
Run: python webhook_server.py
"""

import json
import logging
from flask import Flask, request, jsonify

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kling_webhook")


@app.route("/webhooks/kling", methods=["POST"])
def kling_callback():
    """Receive the Callback (the data Kling sends back when the job is done) from Kling AI"""
    try:
        payload = request.get_json(force=True)
        if not payload:
            return jsonify({"error": "Invalid JSON"}), 400

        task_id = payload.get("task_id", "unknown")
        status = payload.get("task_status", "unknown")
        logger.info(f"Received callback | task_id={task_id} status={status}")

        if status == "succeed":
            handle_success(payload)
        elif status == "failed":
            handle_failure(payload)

        # Must always respond with 2xx, otherwise Kling will resend
        return jsonify({"received": True}), 200

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return jsonify({"error": str(e)}), 500


def handle_success(payload: dict):
    task_id = payload["task_id"]
    result = payload.get("task_result", {})

    # Videos
    for video in result.get("videos", []):
        url = video["url"]
        duration = video.get("duration", "?")
        logger.info(f"[SUCCESS] Video ready: {url} ({duration}s)")
        # TODO: save the URL to the database, notify the user, download the file, etc.
        save_result_to_db(task_id, url, "video")

    # Images
    for img in result.get("images", []):
        url = img["url"]
        idx = img.get("index", 0)
        logger.info(f"[SUCCESS] Image ready (index {idx}): {url}")
        save_result_to_db(task_id, url, "image")


def handle_failure(payload: dict):
    task_id = payload["task_id"]
    msg = payload.get("task_status_msg", "Unknown error")
    logger.error(f"[FAILED] task_id={task_id} reason={msg}")
    # TODO: record the failed status in the DB, notify the User, refund Credits, etc.


def save_result_to_db(task_id: str, url: str, file_type: str):
    """Example: save the result to the DB (replace with your real logic)"""
    logger.info(f"[DB] Saved {file_type} for task {task_id}: {url}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
```

---

## 5. Webhook Server — Node.js (Express)

```typescript
/**
 * webhookServer.ts — Kling AI Webhook Handler (Express)
 * Install: npm install express @types/express
 */

import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

interface KlingCallback {
  task_id: string;
  task_status: "submitted" | "processing" | "succeed" | "failed";
  task_status_msg?: string;
  created_at: number;
  updated_at: number;
  final_unit_deduction?: string;
  external_task_id?: string;
  task_info?: Record<string, unknown>;
  task_result?: {
    videos?: Array<{ id: string; url: string; duration: string }>;
    images?: Array<{ index: number; url: string }>;
  };
}

app.post("/webhooks/kling", async (req: Request, res: Response) => {
  const payload = req.body as KlingCallback;

  if (!payload?.task_id) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { task_id, task_status } = payload;
  console.log(`[Webhook] task_id=${task_id} status=${task_status}`);

  try {
    if (task_status === "succeed") {
      await handleSuccess(payload);
    } else if (task_status === "failed") {
      await handleFailure(payload);
    }

    // Must respond 2xx, otherwise Kling will retry (resend)
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

async function handleSuccess(payload: KlingCallback) {
  const { task_id, task_result } = payload;

  for (const video of task_result?.videos ?? []) {
    console.log(`[SUCCESS] Video: ${video.url} (${video.duration}s)`);
    await saveToDatabase(task_id, video.url, "video");
    await notifyUser(task_id, video.url);
  }

  for (const image of task_result?.images ?? []) {
    console.log(`[SUCCESS] Image[${image.index}]: ${image.url}`);
    await saveToDatabase(task_id, image.url, "image");
  }
}

async function handleFailure(payload: KlingCallback) {
  const { task_id, task_status_msg } = payload;
  console.error(`[FAILED] task=${task_id} reason=${task_status_msg}`);
  await markJobFailed(task_id, task_status_msg ?? "Unknown");
}

// Stubs — replace with your real logic
async function saveToDatabase(taskId: string, url: string, type: string) {
  console.log(`[DB] Save ${type} for ${taskId}: ${url}`);
}

async function notifyUser(taskId: string, url: string) {
  console.log(`[Notify] User for task ${taskId}: ${url}`);
}

async function markJobFailed(taskId: string, reason: string) {
  console.log(`[DB] Mark failed: ${taskId} — ${reason}`);
}

app.listen(8080, () => console.log("Webhook server listening on :8080"));
```

---

## 6. Next.js API Route (Serverless Webhook)

Serverless Webhook (a Webhook with no server to maintain — the Cloud runs it for you):

```typescript
// app/api/webhooks/kling/route.ts (Next.js App Router)

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const { task_id, task_status, task_result } = payload;
  console.log(`Kling callback: ${task_id} → ${task_status}`);

  if (task_status === "succeed") {
    const videoUrl = task_result?.videos?.[0]?.url;
    if (videoUrl) {
      // Save the URL to Supabase / Database
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${task_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done", url: videoUrl }),
      });
    }
  } else if (task_status === "failed") {
    console.error(`Job failed: ${task_id} — ${payload.task_status_msg}`);
  }

  return NextResponse.json({ received: true });
}
```

---

## 7. Testing the Webhook in Local Development

Use **ngrok** (a tool that exposes localhost to the internet) or **localtunnel** to expose localhost to the internet:

```bash
# Install ngrok then run
ngrok http 8080
# You'll get a URL like: https://abc123.ngrok.io

# Use that URL as the callback_url in the Kling API
```

```python
# Test by sending a fake Payload to your own Server
import requests

fake_payload = {
    "task_id": "test-task-001",
    "task_status": "succeed",
    "task_result": {
        "videos": [{"id": "v1", "url": "https://example.com/video.mp4", "duration": "5"}]
    }
}

resp = requests.post("http://localhost:8080/webhooks/kling", json=fake_payload)
print(resp.status_code, resp.json())
```

---

## 8. Kling AI's Retry Policy

Kling retries (resends) the Callback if the Server replies with Non-2xx or doesn't reply at all:

| Round | Wait before Retry |
|-----|---------------------|
| 1st time | Immediately |
| 2nd time | ~1 minute |
| 3rd time | ~5 minutes |
| 4th time | ~30 minutes |

**Cautions:**
- Design the Handler to be **Idempotent** (resilient to receiving duplicate data — receiving the same Payload repeatedly must not cause errors)
- Check whether this Task ID has already been processed before working

```python
PROCESSED_TASKS = set()  # In Production, use a DB or Redis (an in-memory database)

@app.route("/webhooks/kling", methods=["POST"])
def kling_callback():
    payload = request.get_json()
    task_id = payload.get("task_id")

    # Idempotency check (check whether this job was already processed)
    if task_id in PROCESSED_TASKS:
        logger.info(f"Duplicate callback ignored: {task_id}")
        return jsonify({"received": True}), 200

    PROCESSED_TASKS.add(task_id)
    # ... process normally
```

---

## 9. Polling vs Webhook comparison

```python
# Polling approach (easy but doesn't scale)
while True:
    result = client.get(f"/v1/videos/text2video/{task_id}")
    if result["status"] in ["succeed", "failed"]:
        break
    time.sleep(10)  # spends 1 request every 10 seconds

# Webhook approach (scales better — no asking at all)
# Just specify a callback_url when creating the job, then wait to receive the POST
requests.post("/v1/videos/text2video", json={
    "prompt": "...",
    "callback_url": "https://your-server.com/webhooks/kling"
})
# Done! Nothing more to do — Kling sends the result itself
```

---

## 10. Summary Checklist

- [ ] Set a `callback_url` that's Public (reachable from the internet) and HTTPS (an encrypted connection)
- [ ] The Server always responds with HTTP `200` when it receives the Callback successfully
- [ ] Design the Handler to be Idempotent (resilient to duplicates)
- [ ] Save the result URL to the DB immediately (the URL is temporary — once expired it's unusable!)
- [ ] Test with ngrok locally
- [ ] Have a Fallback Polling for Tasks that don't receive a Callback
