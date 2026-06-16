---
title: "Hugging Face: Inference — เรียกใช้โมเดลผ่าน API"
tool: "Hugging Face"
icon: "tool-huggingface"
level: "intermediate"
summary: "เรียกใช้โมเดลบน Hugging Face ผ่าน Inference API / Endpoints โดยไม่ต้องตั้งเซิร์ฟเวอร์เอง"
readTime: "5 นาที"
readers: "0"
locked: false
order: 4
---

# Inference — รันโมเดลโดยไม่ต้องมีเซิร์ฟเวอร์ ☁️

> เรียบเรียงเป็นภาษาไทยจากเอกสารทางการ [huggingface.co/docs](https://huggingface.co/docs/inference-providers)

ถ้าไม่อยากดาวน์โหลดโมเดลมารันเอง Hugging Face มีบริการให้ **เรียกโมเดลผ่าน API** บนคลาวด์

## 🗂️ สองแบบหลัก

| แบบ | เหมาะกับ |
|---|---|
| **Inference Providers / API** | ลองใช้/งานเบา เรียกโมเดลสำเร็จรูปได้ทันที |
| **Inference Endpoints** | งานจริงจัง — เซิร์ฟเวอร์เฉพาะของคุณ ปรับสเกลได้ |

## ▶️ ตัวอย่างเรียก API

```python
from huggingface_hub import InferenceClient
client = InferenceClient(token="YOUR_HF_TOKEN")
out = client.text_generation("อธิบาย AI สั้น ๆ", model="model-name")
print(out)
```

หรือผ่าน HTTP:
```bash
curl https://router.huggingface.co/... \
  -H "Authorization: Bearer YOUR_HF_TOKEN" \
  -d '{"inputs": "สวัสดี"}'
```

## 🔑 Token

ต้องมี **Access Token** (สร้างในหน้า Settings ของบัญชี) ใส่เป็น Bearer token ในการเรียก

## 💡 เลือกแบบไหนดี

- แค่ลองเล่น / ปริมาณน้อย → Inference API/Providers
- ต้องการความเร็วคงที่ + ปริมาณมาก → Inference Endpoints (เสียค่าเซิร์ฟเวอร์)

## 🔗 อ้างอิง

- เอกสาร Inference: https://huggingface.co/docs/inference-providers
