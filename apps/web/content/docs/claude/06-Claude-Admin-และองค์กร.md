---
title: "Admin และการจัดการองค์กร"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "Admin API ให้จัดการทรัพยากรขององค์กรแบบเขียนโปรแกรม ได้แก่ สมาชิกองค์กร, workspaces และ API keys แทนการตั้งค่าด้วยมือใน Console"
readTime: "5 นาที"
readers: "0"
locked: false
order: 6
---
# คู่มือ Claude ภาษาไทย — ส่วนที่ 6: Admin และการจัดการองค์กร

> เรียบเรียงจาก [Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api) และ [Claude Help Center](https://support.claude.com/en/) — สำหรับผู้ดูแลองค์กรที่ต้องจัดการสมาชิก สิทธิ์ ค่าใช้จ่าย ความปลอดภัย และโปรแกรมเฉพาะกลุ่ม

---

## 📖 คำศัพท์สำคัญสำหรับ Admin

| คำศัพท์ | ความหมายง่ายๆ |
|---|---|
| **Admin API** | API สำหรับผู้ดูแลองค์กรโดยเฉพาะ ใช้จัดการสมาชิกและการตั้งค่าแบบโปรแกรม |
| **Workspace** | พื้นที่ทำงานแยกต่างหาก ใช้แบ่งกลุ่ม API key และควบคุมค่าใช้จ่ายตามทีมหรือโปรเจกต์ |
| **SSO** (Single Sign-On) | ล็อกอินด้วยบัญชีองค์กรเดียว เข้าได้ทุกบริการโดยไม่ต้องสร้างรหัสผ่านใหม่ |
| **IdP** (Identity Provider) | ระบบจัดการตัวตนขององค์กร เช่น Okta, Azure AD, Google Workspace |
| **SAML / OIDC** | โปรโตคอล (ภาษากลาง) สำหรับส่งข้อมูลยืนยันตัวตนระหว่าง SSO ระบบต่าง ๆ |
| **JIT** (Just-In-Time provisioning) | สร้างบัญชีผู้ใช้อัตโนมัติเมื่อล็อกอินผ่าน SSO เป็นครั้งแรก ไม่ต้องสร้างล่วงหน้า |
| **SCIM** | มาตรฐานซิงก์ผู้ใช้อัตโนมัติจากระบบ IdP — เพิ่ม แก้ไข หรือปิดบัญชีผู้ใช้แบบอัตโนมัติ |
| **WIF** (Workload Identity Federation) | วิธีให้ระบบอัตโนมัติใช้ token อายุสั้นแทน API key ถาวร — ปลอดภัยกว่า |
| **Onboarding / Offboarding** | การเพิ่มสมาชิกใหม่เข้าระบบ / การนำสมาชิกออกจากระบบ |
| **Data residency** | ข้อกำหนดว่าข้อมูลต้องเก็บในประเทศหรือภูมิภาคใด เช่น ต้องเก็บในยุโรป |
| **Zero Data Retention (ZDR)** | ไม่เก็บข้อมูลหลังประมวลผลเสร็จ เหมาะกับข้อมูลที่ต้องการความเป็นส่วนตัวสูง |
| **Audit log** | บันทึกกิจกรรมทั้งหมดในระบบ เพื่อตรวจสอบความปลอดภัยและการปฏิบัติตามมาตรฐาน |
| **Compliance** | การปฏิบัติตามมาตรฐานหรือกฎหมาย เช่น HIPAA (สุขภาพ), SOC 2 (ความปลอดภัย IT) |

---

## 1. Admin API (จัดการองค์กรแบบโปรแกรม)
อ้างอิง: [Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api)

### หัวข้อนี้คืออะไร
Admin API ให้จัดการทรัพยากรขององค์กรแบบเขียนโปรแกรม ได้แก่ สมาชิกองค์กร, workspaces และ API keys แทนการตั้งค่าด้วยมือใน Console

### ใช้ทำอะไร
- ทำ onboarding/offboarding ผู้ใช้อัตโนมัติ
- จัดการสิทธิ์เข้าถึง workspace แบบโปรแกรม
- ติดตาม/จัดการการใช้ API key

### รายละเอียดสำคัญจากเอกสารทางการ
- **ต้องใช้ Admin API key เฉพาะ** (ขึ้นต้นด้วย `sk-ant-admin...`) ต่างจาก API key ปกติ; เฉพาะสมาชิกบทบาท admin สร้างได้
- **ไม่มีให้ใช้สำหรับบัญชีบุคคล** ต้องตั้งค่าองค์กรใน Console → Settings → Organization ก่อน
- บน Claude Platform on AWS ใช้ได้เฉพาะ workspace endpoints ส่วนอื่น (members, invites, API keys, รายงาน) ไม่รองรับ

### บทบาทในระดับองค์กร (5 บทบาท)
| บทบาท | สิทธิ์ |
|---|---|
| `user` | ใช้ Workbench |
| `claude_code_user` | ใช้ Workbench + Claude Code |
| `developer` | ใช้ Workbench + จัดการ API keys |
| `billing` | ใช้ Workbench + จัดการการเรียกเก็บเงิน |
| `admin` | ทำได้ทุกอย่างข้างต้น + จัดการผู้ใช้ |

### ตัวอย่าง (จัดการสมาชิก)
```bash
# ดูรายชื่อสมาชิกองค์กร
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# เปลี่ยนบทบาทสมาชิก
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'
```

### Endpoint หลัก
- สมาชิก: `/v1/organizations/users`
- คำเชิญ: `/v1/organizations/invites`
- Workspace + สมาชิก workspace: `/v1/organizations/workspaces/...`
- API keys: `/v1/organizations/api_keys`
- ข้อมูลองค์กร: `/v1/organizations/me`

### Best Practices
ตั้งชื่อ workspace/API key ให้สื่อความหมาย, จัดการ error, ตรวจสอบบทบาทสม่ำเสมอ, ลบ workspace/คำเชิญที่ไม่ใช้, หมุนเวียน API key เป็นระยะ

### สรุปสั้น ๆ
Admin API (คีย์ `sk-ant-admin...`) จัดการสมาชิก/workspace/API key แบบโปรแกรม; มี 5 บทบาท เฉพาะองค์กรเท่านั้น

---

## 2. Workspaces
อ้างอิง: [Workspaces](https://platform.claude.com/docs/en/manage-claude/workspaces)

### รายละเอียดสำคัญจากเอกสารทางการ
- Workspace ใช้แบ่งกลุ่ม API key, ควบคุมค่าใช้จ่ายและ rate limit ตาม use case/ทีม
- กำหนดบทบาทระดับ workspace ได้ (เช่น `workspace_developer`, `workspace_admin`)
- สร้าง/จัดการได้ทั้งใน Console และผ่าน Admin API

### สรุปสั้น ๆ
Workspace = แบ่งกลุ่ม API key + คุมค่าใช้จ่าย/สิทธิ์ตามทีมหรือ use case

---

## 3. การติดตามการใช้งานและค่าใช้จ่าย
อ้างอิง: [Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api) · [Rate Limits API](https://platform.claude.com/docs/en/manage-claude/rate-limits-api) · [Claude Code Analytics API](https://platform.claude.com/docs/en/manage-claude/claude-code-analytics-api)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Usage and Cost API** — ดึงรายงานการใช้งาน (token) และค่าใช้จ่ายขององค์กร แยกตามช่วงเวลา/workspace/โมเดล
- **Rate Limits API** — อ่าน rate limit ที่ตั้งไว้ขององค์กรและ workspace
- **Claude Code Analytics API** — ติดตามการนำ Claude Code ไปใช้และ productivity ของนักพัฒนา

### สรุปสั้น ๆ
มี API สำหรับดูการใช้งาน/ค่าใช้จ่าย, rate limit และ analytics ของ Claude Code

---

## 4. การยืนยันตัวตนองค์กรและ Identity (SSO, JIT, SCIM)
อ้างอิง: [Authentication](https://platform.claude.com/docs/en/manage-claude/authentication) · [Workload Identity Federation](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation) · [Identity management](https://support.claude.com/en/collections/17270717-identity-management-sso-jit-scim)

### หัวข้อนี้คืออะไร
สำหรับองค์กร (Team/Enterprise) มีวิธีจัดการตัวตนและสิทธิ์เข้าถึงแบบรวมศูนย์ เชื่อมกับ Identity Provider (IdP) ขององค์กร

### รายละเอียดสำคัญจากเอกสารทางการ
- **SSO (Single Sign-On)** — ล็อกอินด้วยบัญชีองค์กรเดียวผ่าน **IdP** (Identity Provider — ระบบจัดการตัวตน) เช่น Okta, Azure AD, Google Workspace โดยใช้โปรโตคอล SAML หรือ OIDC
- **JIT (Just-In-Time provisioning)** — สร้างบัญชีผู้ใช้ใหม่อัตโนมัติทันทีที่ล็อกอินผ่าน SSO ครั้งแรก ไม่ต้องสร้างล่วงหน้าทีละคน
- **SCIM** — มาตรฐานที่ซิงก์รายชื่อและสิทธิ์ผู้ใช้จาก IdP ไปยัง Claude อัตโนมัติ เมื่อเพิ่ม/ลบ/แก้ไขใน IdP ก็จะอัปเดตใน Claude ด้วย — ทำ **onboarding/offboarding** (รับ/ลบสมาชิก) ได้รวดเร็ว
- **Workload Identity Federation (WIF)** — วิธีให้ระบบอัตโนมัติใช้ access token อายุสั้นแทน API key แบบถาวร ปลอดภัยกว่าเพราะ token หมดอายุเร็ว (`POST /v1/oauth/token`)

### ข้อควรระวัง
- การตั้งค่า SSO/SCIM ต้องทำโดยผู้ดูแล IdP และผู้ดูแลองค์กรใน Claude
- ใช้ WIF แทน API key ถาวรในระบบอัตโนมัติเพื่อความปลอดภัย

### สรุปสั้น ๆ
องค์กรใช้ SSO (ล็อกอินรวม), JIT (สร้างบัญชีอัตโนมัติ), SCIM (ซิงก์ผู้ใช้), และ WIF (token อายุสั้นแทน API key)

---

## 5. ข้อมูลและการปฏิบัติตามข้อกำหนด (Data & Compliance)
อ้างอิง: [Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency) · [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) · [Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api)

### รายละเอียดสำคัญจากเอกสารทางการ
- **Data residency (ที่เก็บข้อมูล)** — เลือกภูมิภาคที่เก็บและประมวลผลข้อมูลได้ เหมาะกับองค์กรที่มีข้อกำหนดว่าข้อมูลต้องอยู่ในประเทศใด
- **API and data retention (นโยบายเก็บข้อมูล)** — กำหนดนโยบายว่า Anthropic เก็บข้อมูล API ไว้นานแค่ไหน รวมถึงตัวเลือก **Zero Data Retention (ZDR)** (ไม่เก็บข้อมูลเลย) สำหรับฟีเจอร์ที่เข้าเกณฑ์
- **Compliance API** — ดึง **audit log** (บันทึกกิจกรรม) ขององค์กร: Activity Feed, ข้อมูลแชท/ไฟล์/โปรเจกต์, ข้อมูลผู้ใช้/บทบาท/กลุ่ม เพื่อตรวจสอบและการปฏิบัติตามมาตรฐาน
- **Encryption keys (กุญแจเข้ารหัส)** — รองรับการจัดการ encryption key เองสำหรับองค์กร (เพิ่มความควบคุมการปกป้องข้อมูล)

### สรุปสั้น ๆ
องค์กรเลือก data residency, ใช้ ZDR สำหรับฟีเจอร์ที่เข้าเกณฑ์, และดึง audit log ผ่าน Compliance API

---

## 6. Claude for Education
อ้างอิง: [Claude for Education](https://support.claude.com/en/collections/12630177-claude-for-education)

### รายละเอียดสำคัญจากเอกสารทางการ
- แพ็กเกจสำหรับสถาบันการศึกษา (มหาวิทยาลัย/โรงเรียน) ให้นักศึกษาและบุคลากรใช้ Claude
- มีโหมด/ฟีเจอร์ที่เน้นการเรียนรู้ เช่น Learning mode ที่ชี้นำให้คิดเองแทนการให้คำตอบสำเร็จรูป
- รวมการจัดการระดับสถาบัน (สิทธิ์ ความเป็นส่วนตัวของผู้เรียน)

### สรุปสั้น ๆ
แพ็กเกจการศึกษาให้ทั้งสถาบันใช้ Claude พร้อมโหมดช่วยเรียนรู้และการจัดการระดับองค์กร

---

## 7. Claude for Nonprofits
อ้างอิง: [Claude for Nonprofits](https://support.claude.com/en/collections/17047088-claude-for-nonprofits)

### รายละเอียดสำคัญจากเอกสารทางการ
- โปรแกรมสำหรับองค์กรไม่แสวงกำไร เข้าถึง Claude ในเงื่อนไข/ราคาพิเศษ
- มีเกณฑ์คุณสมบัติและขั้นตอนสมัครเฉพาะ ดูรายละเอียดในศูนย์ช่วยเหลือ

### สรุปสั้น ๆ
โปรแกรมสิทธิพิเศษสำหรับองค์กรไม่แสวงกำไร มีเกณฑ์/ขั้นตอนสมัครเฉพาะ

---

## 8. Claude for Government
อ้างอิง: [Claude for Government](https://support.claude.com/en/collections/19395194-claude-for-government)

### รายละเอียดสำคัญจากเอกสารทางการ
- โซลูชันสำหรับหน่วยงานภาครัฐ เน้นความปลอดภัย การปฏิบัติตามข้อกำหนด และการควบคุมข้อมูลระดับสูง
- ดูรายละเอียดเงื่อนไข/การเข้าถึงในศูนย์ช่วยเหลือและฝ่ายขาย

### สรุปสั้น ๆ
โซลูชันภาครัฐที่เน้นความปลอดภัยและ compliance ระดับสูง

---

## หัวข้ออ้างอิงเพิ่มเติม
- API Console roles and permissions: https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions
- Team and Enterprise plans: https://support.claude.com/en/collections/9387370-team-and-enterprise-plans
- WIF reference: https://platform.claude.com/docs/en/manage-claude/wif-reference
- Trust Center (security/compliance): https://trust.anthropic.com
