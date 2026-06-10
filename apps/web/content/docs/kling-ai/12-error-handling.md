---
title: "Error Handling & Troubleshooting — แก้ปัญหาการใช้งาน"
tool: "Kling AI"
icon: "icon-docs"
level: "intermediate"
summary: "คู่มือแก้ปัญหาครบชุดสำหรับ Kling AI API ตั้งแต่ข้อผิดพลาด Authentication, Rate Limit, Content Policy จนถึงปัญหาคุณภาพผลลัพธ์"
readTime: "8 นาที"
readers: "0"
locked: false
order: 12
---
# 12 · Error Handling & Troubleshooting — แก้ปัญหาการใช้งาน

> อ้างอิง Official Docs:
> - [General Info / Error Codes](https://kling.ai/document-api/apiReference%2FcommonInfo)
> - [Rate Limits](https://kling.ai/document-api/apiReference%2FrateLimits)

---

## 1. โครงสร้าง Error Response

เมื่อเกิดข้อผิดพลาด Kling API จะตอบกลับในรูปแบบนี้:

```json
{
  "code": 1303,
  "message": "parallel task over resource pack limit",
  "request_id": "9984d27b-a408-4073-ae28-17ca6a13622d"
}
```

| Field | คำอธิบาย |
|-------|----------|
| `code` | รหัสข้อผิดพลาด (ดูตารางด้านล่าง) |
| `message` | ข้อความอธิบายข้อผิดพลาด |
| `request_id` | ID ของ Request (คำขอ) นี้ (ใช้แจ้ง Support) |

---

## 2. ตาราง Error Codes ครบชุด

### กลุ่มที่ 1: Authentication Errors (1000-1004)

Authentication (การยืนยันตัวตน — ขั้นตอนพิสูจน์ว่าเป็นใคร):

| HTTP | Code | ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
|------|------|----------|--------|---------|
| 401 | 1000 | Authentication Failed | ยืนยันตัวตนล้มเหลว | ตรวจสอบ Authorization Header |
| 401 | 1001 | Missing Authorization | ไม่มี `Authorization` Header | ใส่ `Authorization: Bearer <token>` |
| 401 | 1002 | Invalid Authorization | Format ไม่ถูกต้อง | ต้องเป็น `Bearer <JWT>` มีช่องว่าง |
| 401 | 1003 | Token Not Yet Valid | Token ยังไม่ถึงเวลาใช้งาน (`nbf` — not before, กำหนดเวลาเริ่มใช้ได้) | ตรวจสอบนาฬิกาเครื่อง / `nbf` ตั้งค่าถูกไหม |
| 401 | 1004 | Token Expired | Token หมดอายุ (`exp` — expiration, เวลาหมดอายุ) | สร้าง JWT Token ใหม่ก่อนเรียก API |

### กลุ่มที่ 2: Account Errors (1100-1103)

| HTTP | Code | ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
|------|------|----------|--------|---------|
| 429 | 1100 | Account Exception | บัญชีมีปัญหาทั่วไป | ตรวจสอบสถานะบัญชีใน Dashboard (หน้าควบคุม) |
| 429 | 1101 | Insufficient Balance | เครดิตหรือเงินในบัญชีไม่พอ | เติมเงิน / ซื้อ Resource Pack |
| 429 | 1102 | Resource Pack Expired | แพ็กเกจหมดหรือหมดอายุ | ซื้อแพ็กเกจใหม่ |
| 403 | 1103 | Insufficient Permission | ไม่มีสิทธิ์ใช้ Model/Feature นี้ | ตรวจสอบว่า Account มี Permission (สิทธิ์) หรือไม่ |

### กลุ่มที่ 3: Request Errors (1200-1203)

| HTTP | Code | ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
|------|------|----------|--------|---------|
| 400 | 1200 | Invalid Parameters | พารามิเตอร์ (ค่าที่ส่งไป) ผิดหรือขาด | ตรวจสอบทุกพารามิเตอร์ตาม Docs |
| 400 | 1201 | Invalid Parameter Value | ค่าพารามิเตอร์ไม่ถูกต้อง | ดูข้อความใน `message` field |
| 404 | 1202 | Wrong HTTP Method | ใช้ GET แทน POST ฯลฯ | ใช้ Method (วิธีส่งคำขอ) ให้ตรงตามเอกสาร |
| 404 | 1203 | Resource Not Found | Model / Task ID ไม่มีอยู่ | ตรวจสอบชื่อ Model และ Task ID |

### กลุ่มที่ 4: Policy Errors (1300-1304)

| HTTP | Code | ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
|------|------|----------|--------|---------|
| 400 | 1300 | Platform Policy Violation | ละเมิดนโยบายแพลตฟอร์ม | ตรวจสอบว่า Request ไม่ละเมิดกฎ |
| 400 | 1301 | Content Policy Violation | Prompt มีเนื้อหาต้องห้าม | แก้ไข Prompt ให้ผ่าน Content Policy |
| 429 | 1302 | Rate Limit Exceeded | เรียก API บ่อยเกินไป | ลดความถี่, ใช้ Exponential Backoff (การรอแบบเพิ่มเวลาเป็นเท่าตัว) |
| 429 | 1303 | Concurrency Limit | งานพร้อมกันเกิน Limit ของแพ็กเกจ | รอ, ใช้ Queue (คิวงาน — รอคิวก่อนส่ง), หรืออัปเกรดแพ็กเกจ |
| 429 | 1304 | IP Not Whitelisted | IP ไม่ได้รับอนุญาต | ติดต่อ Support เพิ่ม IP |

### กลุ่มที่ 5: Server Errors (5000-5002)

| HTTP | Code | ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
|------|------|----------|--------|---------|
| 500 | 5000 | Internal Server Error | ปัญหาภายใน Kling Server | รอสักครู่แล้วลองใหม่ |
| 503 | 5001 | Service Unavailable | Server ปิดชั่วคราว (บำรุงรักษา) | ดู Status Page แล้วลองใหม่ |
| 504 | 5002 | Gateway Timeout | งานค้างในคิวนานเกินไป | รอแล้วลองใหม่ หรือส่ง Task ใหม่ |

---

## 3. สาเหตุที่พบบ่อยและวิธีแก้

### 3.1 JWT Token ไม่ทำงาน

**อาการ:** Error 401 (code 1001–1004)

**สาเหตุที่พบบ่อย:**
1. ลืมใส่ `Bearer ` นำหน้า Token
2. Token หมดอายุ (อายุแค่ 30 นาที)
3. สร้าง Token จาก AccessKey/SecretKey ผิดคู่
4. นาฬิกาเครื่องคลาดเคลื่อนมากกว่า 5 วินาที

```python
import time

# ❌ ผิด — ไม่มี "Bearer "
headers = {"Authorization": token}

# ✅ ถูก
headers = {"Authorization": f"Bearer {token}"}

# ✅ ตรวจสอบนาฬิกาเครื่อง
print(f"Unix time: {int(time.time())}")
# ถ้าต่างจาก Kling Server มากกว่า 5 วินาที ให้ sync NTP (ระบบเทียบเวลาผ่านอินเทอร์เน็ต)

# ✅ สร้าง Token ใหม่ทุกครั้งที่เรียก API (ไม่ Cache นาน)
def get_fresh_token(ak, sk):
    now = int(time.time())
    return jwt.encode(
        {"iss": ak, "exp": now + 1800, "nbf": now - 5},
        sk, algorithm="HS256"
    )
```

### 3.2 Error 1303 — Concurrency Limit

**อาการ:** งานล้มเหลวทันที พร้อมข้อความ `parallel task over resource pack limit`

**สาเหตุ:** ส่งงานพร้อมกันมากเกินกว่า Concurrency (จำนวนงานที่รันพร้อมกันสูงสุด) ที่แพ็กเกจรองรับ

```python
import time
import random
import requests

def create_with_backoff(client, prompt, max_retries=5):
    """ส่งงานพร้อม Exponential Backoff สำหรับ 1303"""
    for attempt in range(max_retries):
        try:
            resp = client.post("/v1/videos/text2video", {"prompt": prompt, ...})
            return resp
        except Exception as e:
            if "1303" in str(e) and attempt < max_retries - 1:
                wait = (2 ** attempt) + random.uniform(0, 1)
                print(f"Concurrency limit hit. Waiting {wait:.1f}s...")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError("Max retries exceeded")
```

**วิธีจัดการระยะยาว:**

```python
import asyncio
from asyncio import Semaphore

# จำกัดจำนวนงานที่ส่งพร้อมกัน ให้ไม่เกิน Concurrency ของแพ็กเกจ
MAX_CONCURRENT = 5  # ตามแพ็กเกจที่ซื้อ

semaphore = Semaphore(MAX_CONCURRENT)  # Semaphore — ตัวควบคุมการเข้าถึงพร้อมกัน

async def create_video_safe(prompt):
    async with semaphore:
        return await create_video_async(prompt)

# ส่งหลายงานพร้อมกันโดยไม่เกิน Limit
tasks = [create_video_safe(p) for p in prompts]
results = await asyncio.gather(*tasks)
```

### 3.3 Content Policy (Error 1301)

**อาการ:** Error 400 พร้อมข้อความเกี่ยวกับ content policy

**เนื้อหาต้องห้ามใน Prompt:**
- ภาพบุคคลที่ระบุตัวตนได้โดยไม่ได้รับอนุญาต
- เนื้อหาทางเพศหรือความรุนแรงชัดเจน
- เนื้อหาที่ละเมิดลิขสิทธิ์
- เนื้อหาที่ขัดต่อกฎหมาย

**วิธีแก้:**
- ลบคำที่อาจ trigger (กระตุ้น filter) ออกจาก Prompt
- ใช้คำอธิบายทั่วไปแทนการระบุชื่อบุคคลจริง
- เพิ่ม `negative_prompt` เพื่อระบุสิ่งที่ไม่ต้องการชัดเจน

### 3.4 รูปภาพ/วิดีโอไม่แสดง (URL หมดอายุ)

**อาการ:** ดาวน์โหลด URL แล้วได้ 403 หรือ 404

**สาเหตุ:** URL ของผลลัพธ์เป็นแบบชั่วคราว (expiring URL — URL ที่หมดอายุหลังจากเวลาที่กำหนด) มีอายุจำกัด

```python
import requests
import shutil
from pathlib import Path

def download_and_save(url: str, path: str) -> bool:
    """ดาวน์โหลดและบันทึกทันที ไม่พึ่ง URL นาน"""
    try:
        resp = requests.get(url, stream=True, timeout=60)
        resp.raise_for_status()
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        with open(path, "wb") as f:
            shutil.copyfileobj(resp.raw, f)
        return True
    except Exception as e:
        print(f"Download failed: {e}")
        return False

# ทำทันทีเมื่อได้รับ URL
result = client.wait_for_task(...)
video_url = result["task_result"]["videos"][0]["url"]
download_and_save(video_url, "output.mp4")  # ดาวน์โหลดเดี๋ยวนี้เลย!
```

---

## 4. Comprehensive Error Handler

Error Handler (ตัวจัดการข้อผิดพลาด) แบบครบวงจร:

```python
class KlingAPIError(Exception):
    def __init__(self, code: int, message: str, request_id: str = ""):
        self.code = code
        self.message = message
        self.request_id = request_id
        super().__init__(f"[{code}] {message} (request_id: {request_id})")


class KlingAuthError(KlingAPIError): pass
class KlingAccountError(KlingAPIError): pass
class KlingRateLimitError(KlingAPIError): pass
class KlingPolicyError(KlingAPIError): pass
class KlingServerError(KlingAPIError): pass


def handle_kling_response(resp: dict) -> dict:
    """ตรวจสอบ Response (การตอบกลับ) และ raise Exception (โยนข้อผิดพลาด) ที่เหมาะสม"""
    code = resp.get("code", 0)
    msg = resp.get("message", "")
    req_id = resp.get("request_id", "")

    if code == 0 or "data" in resp:
        return resp  # สำเร็จ

    if 1000 <= code <= 1004:
        raise KlingAuthError(code, msg, req_id)
    elif 1100 <= code <= 1103:
        raise KlingAccountError(code, msg, req_id)
    elif code in (1302, 1303):
        raise KlingRateLimitError(code, msg, req_id)
    elif 1300 <= code <= 1304:
        raise KlingPolicyError(code, msg, req_id)
    elif code >= 5000:
        raise KlingServerError(code, msg, req_id)
    else:
        raise KlingAPIError(code, msg, req_id)


# ตัวอย่างการใช้งาน
try:
    result = handle_kling_response(api_response)
    video_url = result["data"]["task_result"]["videos"][0]["url"]
except KlingAuthError as e:
    print(f"Auth problem: {e}. Refreshing token...")
    # refresh token logic
except KlingRateLimitError as e:
    print(f"Rate limit: {e}. Adding to retry queue...")
    # queue for retry
except KlingPolicyError as e:
    print(f"Content policy: {e}. Please revise the prompt.")
    # notify user
except KlingServerError as e:
    print(f"Server error: {e}. Will retry in 30s...")
    # schedule retry
except KlingAPIError as e:
    print(f"Unknown error [{e.code}]: {e.message}")
```

---

## 5. ปัญหาคุณภาพผลลัพธ์

### วิดีโอไม่เป็นไปตาม Prompt

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| วิดีโอไม่ตรงกับ Prompt | `cfg_scale` (ค่าควบคุมความใกล้เคียงกับ Prompt) ต่ำเกินไป | เพิ่ม `cfg_scale` เป็น 0.7–0.9 |
| เนื้อหาไม่พึงประสงค์ปรากฏ | ไม่ได้ระบุ `negative_prompt` | เพิ่ม `negative_prompt` ระบุสิ่งที่ไม่ต้องการ |
| ภาพเบลอหรือคุณภาพต่ำ | ใช้ mode `std` (มาตรฐาน) | เปลี่ยนเป็น mode `pro` (คุณภาพสูง) |
| การเคลื่อนไหวกระตุก | Model ไม่รองรับฉากนี้ | ลองโมเดลใหม่กว่า เช่น `kling-v3` |
| ตัวละครหน้าตาเปลี่ยนระหว่างวิดีโอ | ไม่ได้ใช้ Element (องค์ประกอบ — ไฟล์ที่กำหนดหน้าตาตัวละครไว้) | สร้าง Character Element ก่อนใช้งาน |

### รูปภาพไม่ตรง Prompt

| ปัญหา | วิธีแก้ |
|-------|---------|
| สีผิด | ระบุสีในภาษาอังกฤษ เช่น `vivid red`, `sky blue` |
| องค์ประกอบขาดหาย | แยก Prompt ออกเป็นส่วนๆ ชัดเจน |
| สไตล์ไม่ตรง | ระบุ Art Style (สไตล์ศิลปะ) ชัดเจน เช่น `photorealistic`, `oil painting`, `anime style` |
| Resolution (ความละเอียด) ต่ำ | ใช้ `kling-v3` และระบุ `4K` ใน Prompt หรือใช้ Extend Image |

---

## 6. Debugging Checklist

เมื่อพบปัญหา ให้ตรวจสอบตามลำดับนี้:

```
[ ] 1. ตรวจสอบ HTTP Status Code (รหัสสถานะ HTTP)
[ ] 2. อ่าน "message" ใน Response Body
[ ] 3. ตรวจสอบ JWT Token ว่าไม่หมดอายุ
[ ] 4. ตรวจสอบว่า Access Key / Secret Key ถูกต้อง
[ ] 5. ตรวจสอบ Resource Pack ว่ายังมี Quota (โควตา — จำนวนที่กำหนดไว้) เหลือ
[ ] 6. ตรวจสอบ Concurrency ว่าไม่เกิน Limit
[ ] 7. ตรวจสอบ Prompt ว่าไม่ละเมิด Content Policy
[ ] 8. ตรวจสอบพารามิเตอร์ว่าถูกต้องตาม Docs
[ ] 9. ลองใช้ model ที่รองรับ feature ที่ต้องการ
[ ] 10. ติดต่อ Support พร้อม request_id
```

---

## 7. Log & Monitoring แนะนำ

Monitoring (การติดตามระบบ) แนะนำ:

```python
import logging
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger("kling")

def monitored_api_call(fn, *args, **kwargs):
    """Wrapper (ฟังก์ชันห่อหุ้ม) สำหรับ Log (บันทึก) ทุก API Call"""
    start = time.time()
    try:
        result = fn(*args, **kwargs)
        elapsed = time.time() - start
        logger.info(f"API call OK | fn={fn.__name__} | elapsed={elapsed:.1f}s")
        return result
    except KlingRateLimitError as e:
        logger.warning(f"Rate limit | fn={fn.__name__} | code={e.code}")
        raise
    except KlingAPIError as e:
        elapsed = time.time() - start
        logger.error(f"API error | fn={fn.__name__} | code={e.code} | msg={e.message} | elapsed={elapsed:.1f}s")
        raise
```

---

## 8. สรุป Best Practices

1. **สร้าง JWT ใหม่ทุกครั้ง** หรือ Cache (เก็บไว้ใช้ซ้ำชั่วคราว) ไม่เกิน 25 นาที
2. **ใช้ Exponential Backoff** สำหรับ Error 1302 และ 1303
3. **ดาวน์โหลดไฟล์ทันที** เมื่อได้รับ URL จากผลลัพธ์
4. **บันทึก `request_id`** ทุกครั้งเพื่อใช้แจ้ง Support
5. **ออกแบบ Idempotent Webhook** (Webhook ที่ทนทานต่อการรับข้อมูลซ้ำ) รองรับ Retry ของ Kling
6. **Monitor Quota** (ติดตามปริมาณที่ใช้ไป) ก่อน Deploy Production
7. **ทดสอบ Error Cases ทุกประเภท** ใน Staging (สภาพแวดล้อมทดสอบ — ก่อนขึ้น production) ก่อน Production
