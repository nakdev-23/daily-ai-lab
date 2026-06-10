---
title: "SDK Examples — ตัวอย่างโค้ด Python & Node.js"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "ตัวอย่างโค้ดครบชุดสำหรับเชื่อมต่อ Kling AI API ด้วย Python และ Node.js รวมถึง Helper Functions, Polling Pattern, และการจัดการ File Download"
readTime: "8 นาที"
readers: "0"
locked: false
order: 10
---
# 10 · SDK Examples — ตัวอย่างโค้ด Python & Node.js

> อ้างอิง Official Docs:
> - [Quick Start](https://kling.ai/document-api/quickStart%2FuserManual)
> - [API General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)

---

## 1. ภาพรวม

Kling AI ไม่มี Official SDK (ชุดเครื่องมือสำหรับนักพัฒนา — ไลบรารีและโค้ดตัวอย่างที่ช่วยให้เขียนโปรแกรมง่ายขึ้น) ให้ดาวน์โหลด แต่เนื่องจาก API (ช่องทางเชื่อมต่อโปรแกรม — เหมือนสะพานให้แอพคุยกัน) เป็น REST API (รูปแบบ API มาตรฐานที่ใช้ HTTP) มาตรฐาน จึงใช้ได้กับทุกภาษาโปรแกรมมิ่ง บทนี้รวบรวมตัวอย่างโค้ดสำเร็จรูปครบชุดสำหรับสองภาษาที่นิยมที่สุด:

- **Python** — เหมาะสำหรับ Data Science, Automation (การทำงานอัตโนมัติ), Backend
- **Node.js / TypeScript** — เหมาะสำหรับ Web App, Serverless (รันโค้ดบน Cloud โดยไม่ต้องจัดการ server), Backend API

---

## 2. Python — ตัวอย่างโค้ดครบชุด

### 2.1 ติดตั้ง Dependencies

```bash
pip install requests PyJWT
```

### 2.2 Helper Module (`kling_client.py`)

โมดูลนี้รวม Logic ทั้งหมดไว้ที่เดียว นำไปใช้ซ้ำได้ทุกโปรเจกต์

```python
"""
kling_client.py — Kling AI API Client (Python)
ใช้: from kling_client import KlingClient
"""

import time
import requests
import jwt  # pip install PyJWT


BASE_URL = "https://api-singapore.klingai.com"


class KlingClient:
    """Client สำหรับเรียก Kling AI API"""

    def __init__(self, access_key: str, secret_key: str):
        self.access_key = access_key
        self.secret_key = secret_key

    def _get_token(self) -> str:
        """สร้าง JWT Token (JSON Web Token — รหัสยืนยันตัวตนแบบดิจิทัล ใช้ในการพิสูจน์ว่าคุณมีสิทธิ์ใช้งาน) ใหม่ (มีอายุ 30 นาที)"""
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
        รอจนกว่างานจะเสร็จหรือล้มเหลว
        - path: เส้นทาง API เช่น "/v1/videos/text2video"
        - task_id: ID ของงานที่ต้องรอ
        - poll_interval: ตรวจสถานะทุกกี่วินาที (default: 10)
        - timeout: หมดเวลากี่วินาที (default: 600 = 10 นาที)
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
        """สร้างวิดีโอจากข้อความ และรอจนเสร็จ"""
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
        """สร้างวิดีโอจากรูปภาพ และรอจนเสร็จ"""
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
        """ต่อความยาววิดีโอ และรอจนเสร็จ"""
        body = {"video_id": video_id, "prompt": prompt}
        resp = self._post("/v1/videos/extend", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/videos/extend", task_id)

    # ── Image ──────────────────────────────────────────────────────────────

    def generate_image(self, prompt: str, model: str = "kling-v3",
                       n: int = 1, aspect_ratio: str = "1:1", **kwargs) -> dict:
        """สร้างรูปภาพจากข้อความ และรอจนเสร็จ"""
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
        """Virtual Try-On (ลองเสื้อผ้าเสมือนจริง) — สวมเสื้อผ้าให้บุคคลในรูป"""
        body = {"human_image": human_image, "cloth_image": cloth_image, "mode": mode}
        resp = self._post("/v1/images/virtual-try-on", body)
        task_id = resp["data"]["task_id"]
        return self.wait_for_task("/v1/images/virtual-try-on", task_id)

    # ── Utility ────────────────────────────────────────────────────────────

    def download(self, url: str, save_path: str) -> None:
        """ดาวน์โหลดไฟล์จาก URL (วิดีโอหรือรูป) บันทึกลงดิสก์"""
        resp = requests.get(url, stream=True)
        resp.raise_for_status()
        with open(save_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved: {save_path}")
```

### 2.3 ตัวอย่างการใช้งานจริง

#### สร้างวิดีโอจาก Text

```python
from kling_client import KlingClient

client = KlingClient(
    access_key="YOUR_ACCESS_KEY",
    secret_key="YOUR_SECRET_KEY",
)

# สร้างวิดีโอ
result = client.text_to_video(
    prompt="ทุ่งดอกไม้สีม่วงในยามเช้า หมอกเบาๆ ลอยอยู่ในหุบเขา แสงแรกของวัน",
    model="kling-v3",
    mode="pro",
    duration="5",
    aspect_ratio="16:9",
    negative_prompt="ภาพเบลอ คุณภาพต่ำ เม็ดฝน",
    cfg_scale=0.7,
)

# ดาวน์โหลดวิดีโอ
video_url = result["task_result"]["videos"][0]["url"]
client.download(video_url, "output_video.mp4")
print(f"Video duration: {result['task_result']['videos'][0]['duration']}s")
```

#### สร้างรูปภาพหลายภาพพร้อมกัน

```python
result = client.generate_image(
    prompt="ร้านกาแฟสไตล์ญี่ปุ่น ต้นไม้เล็กๆ ในกระถาง หนังสือบนโต๊ะไม้",
    model="kling-v3",
    n=4,
    aspect_ratio="1:1",
    negative_prompt="คน, ตัวละคร, ภาพเบลอ",
)

# ดาวน์โหลดทุกภาพ
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

## 3. Node.js / TypeScript — ตัวอย่างโค้ดครบชุด

### 3.1 ติดตั้ง Dependencies

```bash
npm install jsonwebtoken axios
npm install --save-dev @types/jsonwebtoken
```

### 3.2 Helper Module (`klingClient.ts`)

```typescript
/**
 * klingClient.ts — Kling AI API Client (TypeScript)
 * ใช้: import { KlingClient } from './klingClient'
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

### 3.3 ตัวอย่างการใช้งาน (Node.js)

```typescript
import { KlingClient } from "./klingClient";

const client = new KlingClient(
  process.env.KLING_ACCESS_KEY!,
  process.env.KLING_SECRET_KEY!
);

async function main() {
  // สร้างวิดีโอ
  console.log("Creating video...");
  const videoResult = await client.textToVideo({
    prompt: "เมืองอนาคตยามค่ำคืน ไฟนีออนสีฟ้าและม่วง รถบินอยู่ในท้องฟ้า",
    model: "kling-v3",
    mode: "pro",
    duration: "5",
    aspect_ratio: "16:9",
  });

  const videoUrl = videoResult.task_result!.videos![0].url;
  await client.download(videoUrl, "output.mp4");

  // สร้างรูปภาพ
  console.log("Creating image...");
  const imgResult = await client.generateImage({
    prompt: "พระอาทิตย์ตกที่ภูเขาไฟฟูจิ สีส้มและม่วงสดใส",
    model: "kling-v3",
    n: 1,
    aspect_ratio: "16:9",
  });

  const imgUrl = imgResult.task_result!.images![0].url;
  await client.download(imgUrl, "output.jpg");
}

main().catch(console.error);
```

### 3.4 ใช้กับ Next.js API Route

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
    // สร้างงานโดยไม่รอผล (async) ส่ง task_id กลับทันที
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

เมื่อพบ Error 1303 (เกิน Concurrency (จำนวนงานที่รันพร้อมกันสูงสุด)) ควรใช้ Exponential Backoff (การรอแบบเพิ่มเวลาเป็นเท่าตัว — เพื่อไม่ให้ส่งคำขอถี่เกินไป):

```python
import time
import random

def with_retry(fn, max_retries=5, base_delay=1.0):
    """เรียก fn และ retry โดย Exponential Backoff ถ้าเกิน Rate Limit (ขีดจำกัดความถี่)"""
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

## 5. Environment Variables — ตั้งค่าที่แนะนำ

Environment Variables (ตัวแปรสภาพแวดล้อม — การตั้งค่าที่เปลี่ยนได้ตามสภาพแวดล้อม เช่น dev/production):

```bash
# .env
KLING_ACCESS_KEY=your_access_key_here
KLING_SECRET_KEY=your_secret_key_here
KLING_BASE_URL=https://api-singapore.klingai.com
```

```python
# Python — โหลด .env
import os
from dotenv import load_dotenv  # pip install python-dotenv

load_dotenv()

client = KlingClient(
    access_key=os.environ["KLING_ACCESS_KEY"],
    secret_key=os.environ["KLING_SECRET_KEY"],
)
```

```typescript
// Node.js — โหลด .env
import "dotenv/config"; // npm install dotenv

const client = new KlingClient(
  process.env.KLING_ACCESS_KEY!,
  process.env.KLING_SECRET_KEY!
);
```

---

## 6. สรุป

| ฟีเจอร์ | Python | Node.js/TypeScript |
|---------|--------|-------------------|
| JWT Auth (การยืนยันตัวตนด้วย JWT) | `PyJWT` | `jsonwebtoken` |
| HTTP | `requests` | `axios` |
| Polling (การถามซ้ำๆ จนงานเสร็จ) | `time.sleep()` loop | `setTimeout` loop |
| Download | `requests` stream | `https.get` pipe |
| Env vars | `python-dotenv` | `dotenv` |

> **แนะนำ**: เก็บ `access_key` และ `secret_key` ใน Environment Variables เสมอ ห้ามฝังในโค้ดโดยตรง
