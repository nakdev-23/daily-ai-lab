# SEO — คู่มือตั้งค่า Daily AI Lab

เอกสารนี้สรุปว่า SEO ของเว็บอยู่ตรงไหนในโค้ด ต้องตั้งค่าอะไรก่อน deploy ต้องทำอะไรใน Google Search Console และถ้าจะย้ายโดเมนต้องทำยังไงให้ไม่เสียอันดับ

---

## 1. ภาพรวม — SEO อยู่ตรงไหนในโค้ด

ทุกอย่างใช้ค่าโดเมนจาก env เดียว: **`NEXT_PUBLIC_APP_URL`** (ถ้าไม่ตั้ง จะ fallback เป็นโดเมน production)

| ไฟล์ | ทำอะไร |
|---|---|
| `apps/web/app/layout.tsx` | metadata หลัก — `metadataBase`, title template, description, keywords, canonical, OpenGraph + Twitter card |
| `apps/web/app/page.tsx` | JSON-LD (`EducationalOrganization` + `WebSite`) สำหรับ rich results ของ Google |
| `apps/web/app/robots.ts` | สร้าง `/robots.txt` — อนุญาตหน้า public, บล็อก `/admin`, `/api/`, หน้าหลังล็อกอิน |
| `apps/web/app/sitemap.ts` | สร้าง `/sitemap.xml` — เฉพาะหน้าที่เปิดให้คนทั่วไป |
| `apps/web/app/about\|privacy\|terms/page.tsx` | title + description + canonical ของแต่ละหน้า |
| `apps/web/app/(app)/layout.tsx`, `(lesson)/layout.tsx` | `robots: noindex, nofollow` — กันหน้าหลังล็อกอินขึ้น Google |
| `apps/web/public/og.png` | รูป preview ตอนแชร์ลิงก์ (1200×630) |
| `apps/web/public/icons/icon-512.png` | โลโก้ใน JSON-LD |

**หน้าที่ให้ Google เก็บ (index):** `/`, `/about`, `/login`, `/terms`, `/privacy`
**หน้าที่กันไว้ (noindex):** ทุกหน้าหลังล็อกอิน (`/daily-learn`, `/learn`, `/profile`, `/leaderboard`, `/admin`, ฯลฯ)

---

## 2. ตั้งค่าก่อน deploy (สำคัญที่สุด)

ตั้ง env บน **Vercel → Settings → Environment Variables → Production**:

```
NEXT_PUBLIC_APP_URL = https://ailab.learnnakdev.online
```

> ⚠️ ถ้าค่านี้เป็น `http://localhost:3000` (ค่าใน `.env.local`) แล้วหลุดไป production →
> sitemap, canonical, OG, JSON-LD จะชี้ localhost ทั้งหมด = SEO พัง
> ต้องตั้งเป็นโดเมนจริงเสมอบน Production (หรือลบทิ้งให้ใช้ fallback ในโค้ด)

ตั้งเสร็จ → redeploy → เช็กว่าเปิดได้จริง:
- `https://โดเมน/robots.txt`
- `https://โดเมน/sitemap.xml`

---

## 3. Google Search Console (GSC)

ไม่บังคับ (Google จะ crawl เจอเอง) แต่ตั้งแล้ว index เร็วขึ้นมาก + เห็นว่าคนค้นเจอด้วยคำไหน

### 3.1 เพิ่ม property
[search.google.com/search-console](https://search.google.com/search-console) → **Add property**
- **Domain** — ครอบทั้งโดเมน (รวม www/subdomain) แนะนำ ถ้าเข้าถึง DNS ได้
- **URL prefix** — ง่ายกว่าถ้าจะ verify ด้วย meta tag

### 3.2 ยืนยันความเป็นเจ้าของ (เลือก 1)
- **DNS TXT record** (สำหรับแบบ Domain) — เอา record จาก GSC ไปใส่ที่ผู้ให้บริการโดเมน → ไม่ต้องแตะโค้ด ✅ ทนสุด
- **HTML meta tag** (สำหรับแบบ URL prefix) — GSC ให้โค้ด `<meta name="google-site-verification" content="xxxx" />`
  ใส่ในโค้ดได้ที่ `apps/web/app/layout.tsx`:
  ```ts
  export const metadata: Metadata = {
    // ...
    verification: { google: "xxxx" },  // ← เอา content จาก GSC มาใส่
  }
  ```

### 3.3 ส่ง sitemap
เมนู **Sitemaps** → ใส่ `sitemap.xml` → **Submit**

### 3.4 เร่ง index หน้าสำคัญ
**URL Inspection** → วาง URL หน้าแรก/about → **Request indexing**

---

## 4. ย้ายโดเมน (ถ้าเปลี่ยนโดเมนในอนาคต)

**จังหวะที่ดีสุดคือตอนเว็บยังใหม่** (ยังไม่ติดอันดับ/ยังไม่มี backlink) — ยิ่งช้ายิ่งเจ็บ

### ฝั่งโค้ด — แก้ที่เดียว
เปลี่ยน `NEXT_PUBLIC_APP_URL` บน Vercel เป็นโดเมนใหม่ → sitemap/robots/canonical/OG/JSON-LD/Stripe redirect ตามอัตโนมัติ
(ควรแก้ค่า fallback ที่ hardcode ในไฟล์เหล่านี้ตามด้วย เผื่อ env ไม่ถูกตั้ง: `layout.tsx`, `page.tsx`, `robots.ts`, `sitemap.ts`)

### ฝั่ง SEO — เพื่อไม่ให้เสียอันดับ
1. **301 redirect** ทุก URL เก่า → URL ใหม่ที่ตรงกัน (สำคัญสุด — ส่งต่อค่าอันดับ) ตั้งที่ Vercel
2. **เก็บโดเมนเก่าต่ออย่างน้อย 6–12 เดือน** + redirect ทำงานตลอด
3. **GSC → เพิ่มโดเมนใหม่** + ใช้เครื่องมือ **"Change of Address"** บอก Google ว่าย้าย
4. **ส่ง sitemap ใหม่** ใน GSC ของโดเมนใหม่
5. อัปเดต backlink สำคัญเท่าที่ทำได้

---

## 5. Checklist deploy ใหม่ / ตั้งค่าครั้งแรก

- [ ] ตั้ง `NEXT_PUBLIC_APP_URL` = โดเมนจริง บน Vercel Production
- [ ] Redeploy
- [ ] เปิด `โดเมน/robots.txt` ได้ และชี้โดเมนถูก
- [ ] เปิด `โดเมน/sitemap.xml` ได้ และ URL ในนั้นเป็นโดเมนจริง
- [ ] แชร์ลิงก์ใน LINE/Facebook แล้วเห็นรูป OG (`og.png`) + title/description ถูก
- [ ] เพิ่ม property ใน Google Search Console + verify
- [ ] ส่ง sitemap ใน GSC
- [ ] Request indexing หน้าแรก

---

## 6. ตรวจสุขภาพ SEO เป็นระยะ

- **GSC → Pages** — ดูว่ากี่หน้าถูก index, มี error ไหม
- **GSC → Performance** — คนค้นเจอด้วยคำไหน คลิกเท่าไหร่
- เทสต์ rich result: [search.google.com/test/rich-results](https://search.google.com/test/rich-results) (วาง URL หน้าแรก เช็ก JSON-LD)
- เทสต์การแชร์: [opengraph.xyz](https://www.opengraph.xyz) (วาง URL ดู preview OG)

---

## 7. ทำเพิ่มได้ในอนาคต (ยังไม่จำเป็น)

- **Google Analytics** — ดูสถิติผู้ใช้ (คนละตัวกับ GSC)
- **sitemap แบบ dynamic** — เพิ่มหน้า docs/คอร์สที่เป็น public ลง sitemap อัตโนมัติ (ตอนนี้ลงแค่หน้าหลัก)
- **per-page OG image** — ทำรูป preview ต่อหน้า/ต่อคอร์ส
- **breadcrumb / Course JSON-LD** — schema เพิ่มสำหรับหน้าเนื้อหา
