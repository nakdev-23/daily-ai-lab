---
title: "Webhook Integration — รับผลลัพธ์อัตโนมัติ"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "ตั้งค่า Webhook Server รับผลลัพธ์จาก Kling AI แบบ Push แทนการ Polling ซ้ำๆ รวมถึง Signature Verification, Retry Logic, และ Production Patterns"
readTime: "7 นาที"
readers: "0"
locked: false
order: 11
---
# 11 · Webhook Integration — รับผลลัพธ์อัตโนมัติ

> อ้างอิง Official Docs:
> - [Callback Protocol](https://kling.ai/document-api/apiReference%2FcallbackProtocol)
> - [General Info](https://kling.ai/document-api/apiReference%2FcommonInfo)

---

## 1. Webhook คืออะไร และทำไมต้องใช้

Webhook (การแจ้งเตือนอัตโนมัติ — เซิร์ฟเวอร์ส่งข้อมูลมาหาแอพของคุณเมื่อมีเหตุการณ์เกิดขึ้น) เป็นวิธีรับผลลัพธ์จาก Kling AI แบบ Push (ผลักข้อมูลมาให้) แทนที่คุณจะต้องถามซ้ำๆ

Kling AI ทำงานแบบ **Asynchronous** (ไม่รอผล — สั่งแล้วทำงานเบื้องหลัง) — เมื่อสร้างงาน API จะตอบกลับแค่ `task_id` ทันที แล้วสร้างงานในเบื้องหลัง ซึ่งมีสองวิธีรับผลลัพธ์:

| วิธี | คำอธิบาย | เหมาะกับ |
|------|----------|----------|
| **Polling** (การถามซ้ำๆ — ส่ง request ทุก N วินาทีเพื่อเช็คสถานะ) | ถาม API ซ้ำๆ ทุก N วินาทีจนงานเสร็จ | งาน 1-2 ชิ้นต่อครั้ง, Script ง่ายๆ |
| **Webhook (Callback URL)** | Kling ส่งผลมาหาเมื่อเสร็จ ไม่ต้องถาม | Production App (แอพที่ใช้งานจริง), งานจำนวนมาก |

**ข้อดีของ Webhook:**
- ไม่เสีย API Request ไปกับการถามสถานะซ้ำๆ
- ตอบสนองได้ทันทีเมื่องานเสร็จ (Near Real-time — ใกล้เคียงเวลาจริง)
- รองรับงานจำนวนมากพร้อมกันได้ดีกว่า (Scale ได้ดีกว่า)
- โค้ดเรียบง่ายกว่าการ Poll

---

## 2. วิธีตั้งค่า Webhook URL

เมื่อสร้างงาน ใส่ `callback_url` (URL ที่ Kling จะส่งผลมาให้) ในคำขอ:

```json
{
  "model": "kling-v2-6",
  "prompt": "ทะเลสาบภูเขาสะท้อนท้องฟ้ายามพระอาทิตย์ขึ้น",
  "duration": "5",
  "callback_url": "https://your-server.com/webhooks/kling"
}
```

เมื่องานเสร็จ Kling จะ **POST** (ส่งข้อมูลแบบ HTTP POST) ผลลัพธ์มาที่ `callback_url` ที่ระบุไว้

---

## 3. โครงสร้างข้อมูล Callback

Kling ส่ง JSON (รูปแบบข้อมูลมาตรฐานที่เครื่องอ่านได้) มาแบบนี้:

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
    "prompt": "ทะเลสาบภูเขาสะท้อนท้องฟ้ายามพระอาทิตย์ขึ้น",
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

### สถานะที่เป็นไปได้

| `task_status` | ความหมาย |
|---------------|----------|
| `submitted` | งานอยู่ในคิว (อาจส่ง Callback ได้) |
| `processing` | กำลังสร้าง |
| `succeed` | สำเร็จ — ดูผลใน `task_result` |
| `failed` | ล้มเหลว — ดูสาเหตุใน `task_status_msg` |

---

## 4. Webhook Server — Python (Flask)

```python
"""
webhook_server.py — Kling AI Webhook Handler (Flask)
ติดตั้ง: pip install flask
รัน: python webhook_server.py
"""

import json
import logging
from flask import Flask, request, jsonify

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kling_webhook")


@app.route("/webhooks/kling", methods=["POST"])
def kling_callback():
    """รับ Callback (ข้อมูลที่ Kling ส่งกลับมาเมื่องานเสร็จ) จาก Kling AI"""
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

        # ต้องตอบกลับด้วย 2xx เสมอ ไม่เช่นนั้น Kling จะส่งซ้ำ
        return jsonify({"received": True}), 200

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return jsonify({"error": str(e)}), 500


def handle_success(payload: dict):
    task_id = payload["task_id"]
    result = payload.get("task_result", {})

    # วิดีโอ
    for video in result.get("videos", []):
        url = video["url"]
        duration = video.get("duration", "?")
        logger.info(f"[SUCCESS] Video ready: {url} ({duration}s)")
        # TODO: บันทึก URL ลงฐานข้อมูล, แจ้งเตือนผู้ใช้, ดาวน์โหลดไฟล์ฯลฯ
        save_result_to_db(task_id, url, "video")

    # รูปภาพ
    for img in result.get("images", []):
        url = img["url"]
        idx = img.get("index", 0)
        logger.info(f"[SUCCESS] Image ready (index {idx}): {url}")
        save_result_to_db(task_id, url, "image")


def handle_failure(payload: dict):
    task_id = payload["task_id"]
    msg = payload.get("task_status_msg", "Unknown error")
    logger.error(f"[FAILED] task_id={task_id} reason={msg}")
    # TODO: บันทึกสถานะ failed ลง DB, แจ้ง User, คืน Credit ฯลฯ


def save_result_to_db(task_id: str, url: str, file_type: str):
    """ตัวอย่าง: บันทึกผลลัพธ์ลง DB (แทนด้วย Logic จริงของคุณ)"""
    logger.info(f"[DB] Saved {file_type} for task {task_id}: {url}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
```

---

## 5. Webhook Server — Node.js (Express)

```typescript
/**
 * webhookServer.ts — Kling AI Webhook Handler (Express)
 * ติดตั้ง: npm install express @types/express
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

    // ต้องตอบ 2xx ไม่เช่นนั้น Kling จะ retry (ส่งซ้ำ)
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

// Stubs (ฟังก์ชันโครงร่าง) — แทนด้วย Logic จริง
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

Serverless Webhook (Webhook แบบไม่ต้องดูแล server — Cloud รันให้อัตโนมัติ):

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
      // บันทึก URL ลง Supabase / Database
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

## 7. ทดสอบ Webhook ใน Local Development

ใช้ **ngrok** (เครื่องมือเปิด localhost ให้เข้าถึงจากอินเทอร์เน็ตได้) หรือ **localtunnel** เพื่อ expose (เปิดเผย) localhost ออกสู่อินเทอร์เน็ต:

```bash
# ติดตั้ง ngrok แล้วรัน
ngrok http 8080
# จะได้ URL เช่น: https://abc123.ngrok.io

# ใช้ URL นั้นเป็น callback_url ใน Kling API
```

```python
# ทดสอบส่ง Payload (ข้อมูลที่ส่ง) ปลอมไปที่ Server ของคุณเอง
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

## 8. Retry Policy ของ Kling AI

Kling จะ retry (ส่งซ้ำ) ส่ง Callback ถ้า Server ตอบกลับด้วย Non-2xx หรือไม่ตอบกลับเลย:

| รอบ | ระยะเวลารอก่อน Retry |
|-----|---------------------|
| ครั้งที่ 1 | ทันที |
| ครั้งที่ 2 | ~1 นาที |
| ครั้งที่ 3 | ~5 นาที |
| ครั้งที่ 4 | ~30 นาที |

**ข้อควรระวัง:**
- ออกแบบ Handler ให้ **Idempotent** (ทนทานต่อการรับข้อมูลซ้ำ — รับ Payload เดิมซ้ำๆ ต้องไม่เกิดข้อผิดพลาด)
- ตรวจสอบว่า Task ID นี้ประมวลผลไปแล้วหรือยังก่อนทำงาน

```python
PROCESSED_TASKS = set()  # ใน Production ใช้ DB หรือ Redis (ฐานข้อมูลในหน่วยความจำ)

@app.route("/webhooks/kling", methods=["POST"])
def kling_callback():
    payload = request.get_json()
    task_id = payload.get("task_id")

    # Idempotency check (ตรวจสอบว่าเคยทำงานนี้ไปแล้วหรือยัง)
    if task_id in PROCESSED_TASKS:
        logger.info(f"Duplicate callback ignored: {task_id}")
        return jsonify({"received": True}), 200

    PROCESSED_TASKS.add(task_id)
    # ... process normally
```

---

## 9. Polling vs Webhook เปรียบเทียบ

```python
# แนวทาง Polling (ง่ายแต่ไม่ Scale)
while True:
    result = client.get(f"/v1/videos/text2video/{task_id}")
    if result["status"] in ["succeed", "failed"]:
        break
    time.sleep(10)  # เสีย 1 request ทุก 10 วินาที

# แนวทาง Webhook (Scale ดีกว่า — ไม่ต้องถามเลย)
# แค่ระบุ callback_url ตอนสร้างงาน แล้วรอรับ POST
requests.post("/v1/videos/text2video", json={
    "prompt": "...",
    "callback_url": "https://your-server.com/webhooks/kling"
})
# เสร็จ! ไม่ต้องทำอะไรเพิ่ม — Kling จะส่งผลมาเอง
```

---

## 10. สรุป Checklist

- [ ] ตั้งค่า `callback_url` ที่ Public (เข้าถึงได้จากอินเทอร์เน็ต) และ HTTPS (การเชื่อมต่อแบบเข้ารหัส)
- [ ] Server ตอบกลับด้วย HTTP `200` เสมอเมื่อรับ Callback สำเร็จ
- [ ] ออกแบบ Handler ให้ Idempotent (ทนทานต่อการรับซ้ำ)
- [ ] บันทึก URL ผลลัพธ์ลง DB ทันที (URL มีอายุชั่วคราว — หมดแล้วใช้ไม่ได้!)
- [ ] ทดสอบด้วย ngrok ใน Local
- [ ] มี Fallback Polling (การ Poll สำรอง) สำหรับ Task ที่ไม่ได้รับ Callback
