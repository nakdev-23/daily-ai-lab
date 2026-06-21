---
title: "SDK Examples — Python & Node.js code examples"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "Full code examples for connecting to the Kling AI API with Python and Node.js, including Helper Functions, the Polling Pattern, and File Download handling"
readTime: "8 min"
readers: "0"
locked: false
order: 10
---
# 10 · SDK Examples — Python & Node.js code examples

> Official Docs reference:
> - [Quick Start](https://kling.ai/document-api/quickStart%2FuserManual)
> - [API General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)

---

## 1. Overview

Kling AI doesn't have an Official SDK (a developer toolkit — libraries and example code that make programming easier) to download, but since the API (an interface between programs — like a bridge for apps to talk) is a standard REST API (a standard API format using HTTP), it works with any programming language. This chapter collects full ready-made code examples for the two most popular languages:

- **Python** — good for Data Science, Automation, Backend
- **Node.js / TypeScript** — good for Web Apps, Serverless (running code on the Cloud without managing a server), Backend APIs

---

## 2. Python — full code example

### 2.1 Install Dependencies

```bash
pip install requests PyJWT
```

### 2.2 Helper Module (`kling_client.py`)

This module collects all the logic in one place, reusable in any project.

```python
"""
kling_client.py — Kling AI API Client (Python)
Use: from kling_client import KlingClient
"""

import time
import requests
import jwt  # pip install PyJWT


BASE_URL = "https://api-singapore.klingai.com"


class KlingClient:
    """A client for calling the Kling AI API"""

    def __init__(self, access_key: str, secret_key: str):
        self.access_key = access_key
        self.secret_key = secret_key

    def _get_token(self) -> str:
        """Create a new JWT Token (JSON Web Token — a digital authentication code proving you have access), valid for 30 minutes"""
        now = int(time.time())
        payload = {
            "iss": self.access_key,
            "exp": now + 1800,
            "nbf": now - 5,
        }
        return jwt.encode(
            payload,
            self.secret_key,
            algorithm="HS256",
            headers={"alg": "HS256", "typ": "JWT"},
        )

    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self._get_token()}",
            "Content-Type": "application/json",
        }

    def _post(self, path: str, body: dict) -> dict:
        resp = requests.post(f"{BASE_URL}{path}", headers=self._headers(), json=body)
        resp.raise_for_status()
        return resp.json()

    def _get(self, path: str) -> dict:
        resp = requests.get(f"{BASE_URL}{path}", headers=self._headers())
        resp.raise_for_status()
        return resp.json()

    def wait_for_task(self, path: str, task_id: str, poll_interval: int = 10, timeout: int = 600) -> dict:
        """
        Wait until the task succeeds or fails
        - path: the API path, e.g. "/v1/videos/text2video"
        - task_id: the ID of the task to wait for
        - poll_interval: check status every how many seconds (default: 10)
        - timeout: time out after how many seconds (default: 600 = 10 minutes)
        """
        start = time.time()
        while time.time() - start < timeout:
            result = self._get(f"{path}/{task_id}")
            status = result["data"]["task_status"]
            print(f"[{task_id[:8]}...] Status: {status}")
            if status == "succeed":
                return result["data"]
            elif status == "failed":
                msg = result["data"].get("task_status_msg", "Unknown error")
                raise RuntimeError(f"Task failed: {msg}")
            time.sleep(poll_interval)
        raise TimeoutError(f"Task {task_id} timed out after {timeout}s")

    # ── Video ──────────────────────────────────────────────────────────────

    def text_to_video(self, prompt: str, model: str = "kling-v2-6",
                      mode: str = "std", duration: str = "5",
                      aspect_ratio: str = "16:9", **kwargs) -> dict:
        """Create a video from text and wait until done"""
        body = {
            "model": model,
            "prompt": prompt,
            "mode": mode,
            "duration": duration,
            "aspect_ratio": aspect_ratio,
            **kwargs,
        }
        resp = self._post("/v1/videos/text2video", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/videos/text2video", task_id)

    def image_to_video(self, image_url: str, prompt: str = "",
                       model: str = "kling-v2-6", mode: str = "std",
                       duration: str = "5", **kwargs) -> dict:
        """Create a video from an image and wait until done"""
        body = {
            "model": model,
            "image": image_url,
            "prompt": prompt,
            "mode": mode,
            "duration": duration,
            **kwargs,
        }
        resp = self._post("/v1/videos/image2video", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/videos/image2video", task_id)

    def extend_video(self, video_id: str, prompt: str = "") -> dict:
        """Extend a video's length and wait until done"""
        body = {"video_id": video_id, "prompt": prompt}
        resp = self._post("/v1/videos/extend", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/videos/extend", task_id)

    # ── Image ──────────────────────────────────────────────────────────────

    def generate_image(self, prompt: str, model: str = "kling-v3",
                       n: int = 1, aspect_ratio: str = "1:1", **kwargs) -> dict:
        """Create an image from text and wait until done"""
        body = {
            "model": model,
            "prompt": prompt,
            "n": n,
            "aspect_ratio": aspect_ratio,
            **kwargs,
        }
        resp = self._post("/v1/images/generations", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/images/generations", task_id)

    def virtual_try_on(self, human_image: str, cloth_image: str, mode: str = "std") -> dict:
        """Virtual Try-On — put clothing onto a person in an image"""
        body = {"human_image": human_image, "cloth_image": cloth_image, "mode": mode}
        resp = self._post("/v1/images/virtual-try-on", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/images/virtual-try-on", task_id)

    # ── Utility ────────────────────────────────────────────────────────────

    def download(self, url: str, save_path: str) -> None:
        """Download a file from a URL (video or image), saving it to disk"""
        resp = requests.get(url, stream=True)
        resp.raise_for_status()
        with open(save_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved: {save_path}")
```

### 2.3 Real usage examples

#### Create a video from Text

```python
from kling_client import KlingClient

client = KlingClient(
    access_key="YOUR_ACCESS_KEY",
    secret_key="YOUR_SECRET_KEY",
)

# Create the video
result = client.text_to_video(
    prompt="A field of purple flowers in the morning, light mist drifting in the valley, the first light of day",
    model="kling-v3",
    mode="pro",
    duration="5",
    aspect_ratio="16:9",
    negative_prompt="blurry, low quality, raindrops",
    cfg_scale=0.7,
)

# Download the video
video_url = result["task_result"]["videos"][0]["url"]
client.download(video_url, "output_video.mp4")
print(f"Video duration: {result['task_result']['videos'][0]['duration']}s")
```

#### Create several images at once

```python
result = client.generate_image(
    prompt="A Japanese-style coffee shop, small plants in pots, books on a wooden table",
    model="kling-v3",
    n=4,
    aspect_ratio="1:1",
    negative_prompt="people, characters, blurry",
)

# Download every image
for i, img in enumerate(result["task_result"]["images"]):
    client.download(img["url"], f"image_{i}.jpg")
```

#### Virtual Try-On

```python
result = client.virtual_try_on(
    human_image="https://example.com/person.jpg",
    cloth_image="https://example.com/shirt.jpg",
    mode="pro",
)

result_url = result["task_result"]["images"][0]["url"]
client.download(result_url, "tryon_result.jpg")
```

---

## 3. Node.js / TypeScript — full code example

### 3.1 Install Dependencies

```bash
npm install jsonwebtoken axios
npm install --save-dev @types/jsonwebtoken
```

### 3.2 Helper Module (`klingClient.ts`)

```typescript
/**
 * klingClient.ts — Kling AI API Client (TypeScript)
 * Use: import { KlingClient } from './klingClient'
 */

import * as jwt from "jsonwebtoken";
import axios, { AxiosInstance } from "axios";
import * as fs from "fs";
import * as https from "https";

const BASE_URL = "https://api-singapore.klingai.com";

interface TaskResult {
  task_id: string;
  task_status: "submitted" | "processing" | "succeed" | "failed";
  task_status_msg?: string;
  task_result?: {
    images?: Array<{ index: number; url: string }>;
    videos?: Array<{ id: string; url: string; duration: string }>;
  };
}

export class KlingClient {
  private accessKey: string;
  private secretKey: string;
  private http: AxiosInstance;

  constructor(accessKey: string, secretKey: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.http = axios.create({ baseURL: BASE_URL });
  }

  private getToken(): string {
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
      { iss: this.accessKey, exp: now + 1800, nbf: now - 5 },
      this.secretKey,
      { algorithm: "HS256" }
    );
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.getToken()}`,
      "Content-Type": "application/json",
    };
  }

  private async post<T>(path: string, body: object): Promise<T> {
    const resp = await this.http.post<T>(path, body, {
      headers: this.getHeaders(),
    });
    return resp.data;
  }

  private async get<T>(path: string): Promise<T> {
    const resp = await this.http.get<T>(path, {
      headers: this.getHeaders(),
    });
    return resp.data;
  }

  async waitForTask(
    path: string,
    taskId: string,
    pollInterval = 10000,
    timeout = 600000
  ): Promise<TaskResult> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = await this.get<{ data: TaskResult }>(`${path}/${taskId}`);
      const { task_status } = result.data;
      console.log(`[${taskId.slice(0, 8)}...] Status: ${task_status}`);

      if (task_status === "succeed") return result.data;
      if (task_status === "failed") {
        throw new Error(`Task failed: ${result.data.task_status_msg}`);
      }
      await new Promise((r) => setTimeout(r, pollInterval));
    }
    throw new Error(`Task ${taskId} timed out`);
  }

  // ── Video ────────────────────────────────────────────────────────────────

  async textToVideo(params: {
    prompt: string;
    model?: string;
    mode?: "std" | "pro";
    duration?: "5" | "10";
    aspect_ratio?: string;
    negative_prompt?: string;
    cfg_scale?: number;
    callback_url?: string;
  }): Promise<TaskResult> {
    const body = { model: "kling-v2-6", mode: "std", duration: "5", aspect_ratio: "16:9", ...params };
    const resp = await this.post<{ data: { task_id: string } }>(
      "/v1/videos/text2video",
      body
    );
    return this.waitForTask("/v1/videos/text2video", resp.data.task_id);
  }

  async imageToVideo(params: {
    image: string;
    prompt?: string;
    model?: string;
    mode?: "std" | "pro";
    duration?: "5" | "10";
    image_tail?: string;
  }): Promise<TaskResult> {
    const body = { model: "kling-v2-6", mode: "std", duration: "5", ...params };
    const resp = await this.post<{ data: { task_id: string } }>(
      "/v1/videos/image2video",
      body
    );
    return this.waitForTask("/v1/videos/image2video", resp.data.task_id);
  }

  // ── Image ────────────────────────────────────────────────────────────────

  async generateImage(params: {
    prompt: string;
    model?: string;
    n?: number;
    aspect_ratio?: string;
    negative_prompt?: string;
  }): Promise<TaskResult> {
    const body = { model: "kling-v3", n: 1, aspect_ratio: "1:1", ...params };
    const resp = await this.post<{ data: { task_id: string } }>(
      "/v1/images/generations",
      body
    );
    return this.waitForTask("/v1/images/generations", resp.data.task_id);
  }

  // ── Utility ──────────────────────────────────────────────────────────────

  async download(url: string, savePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(savePath);
      https.get(url, (resp) => {
        resp.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Saved: ${savePath}`);
          resolve();
        });
      }).on("error", reject);
    });
  }
}
```

### 3.3 Usage example (Node.js)

```typescript
import { KlingClient } from "./klingClient";

const client = new KlingClient(
  process.env.KLING_ACCESS_KEY!,
  process.env.KLING_SECRET_KEY!
);

async function main() {
  // Create a video
  console.log("Creating video...");
  const videoResult = await client.textToVideo({
    prompt: "A future city at night, blue and purple neon lights, flying cars in the sky",
    model: "kling-v3",
    mode: "pro",
    duration: "5",
    aspect_ratio: "16:9",
  });

  const videoUrl = videoResult.task_result!.videos![0].url;
  await client.download(videoUrl, "output.mp4");

  // Create an image
  console.log("Creating image...");
  const imgResult = await client.generateImage({
    prompt: "A sunset over Mount Fuji, vivid orange and purple",
    model: "kling-v3",
    n: 1,
    aspect_ratio: "16:9",
  });

  const imgUrl = imgResult.task_result!.images![0].url;
  await client.download(imgUrl, "output.jpg");
}

main().catch(console.error);
```

### 3.4 Use with a Next.js API Route

```typescript
// pages/api/generate-video.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { KlingClient } from "@/lib/klingClient";

const client = new KlingClient(
  process.env.KLING_ACCESS_KEY!,
  process.env.KLING_SECRET_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt, model = "kling-v2-6", duration = "5" } = req.body;

  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    // Create the job without waiting (async), return the task_id immediately
    const token = client["getToken"]();
    const resp = await fetch(`${process.env.KLING_BASE_URL}/v1/videos/text2video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, duration }),
    });

    const data = await resp.json();
    res.status(200).json({ task_id: data.data.task_id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
```

---

## 4. Retry Logic & Exponential Backoff

When you hit Error 1303 (exceeded Concurrency — the max number of jobs running at once), use Exponential Backoff (waiting with multiplicatively increasing delays — to avoid sending requests too frequently):

```python
import time
import random

def with_retry(fn, max_retries=5, base_delay=1.0):
    """Call fn and retry with Exponential Backoff if the Rate Limit is exceeded"""
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as e:
            if "1303" in str(e) and attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                print(f"Rate limited. Retrying in {delay:.1f}s (attempt {attempt+1}/{max_retries})")
                time.sleep(delay)
            else:
                raise
```

```typescript
// TypeScript version
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.message?.includes("1303") && attempt < maxRetries - 1) {
        const delay = baseDelay * 2 ** attempt + Math.random() * 1000;
        console.log(`Rate limited. Retrying in ${(delay / 1000).toFixed(1)}s`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}
```

---

## 5. Environment Variables — recommended setup

Environment Variables (values that can change by environment, e.g. dev/production):

```bash
# .env
KLING_ACCESS_KEY=your_access_key_here
KLING_SECRET_KEY=your_secret_key_here
KLING_BASE_URL=https://api-singapore.klingai.com
```

```python
# Python — load .env
import os
from dotenv import load_dotenv  # pip install python-dotenv

load_dotenv()

client = KlingClient(
    access_key=os.environ["KLING_ACCESS_KEY"],
    secret_key=os.environ["KLING_SECRET_KEY"],
)
```

```typescript
// Node.js — load .env
import "dotenv/config"; // npm install dotenv

const client = new KlingClient(
  process.env.KLING_ACCESS_KEY!,
  process.env.KLING_SECRET_KEY!
);
```

---

## 6. Summary

| Feature | Python | Node.js/TypeScript |
|---------|--------|-------------------|
| JWT Auth | `PyJWT` | `jsonwebtoken` |
| HTTP | `requests` | `axios` |
| Polling (asking repeatedly until the job is done) | `time.sleep()` loop | `setTimeout` loop |
| Download | `requests` stream | `https.get` pipe |
| Env vars | `python-dotenv` | `dotenv` |

> **Recommended**: always keep `access_key` and `secret_key` in Environment Variables; never embed them directly in code.
