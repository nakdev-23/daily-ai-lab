"use client"

import Image from "next/image"
import { useState } from "react"
import { Check, X, Crown, CreditCard, RefreshCw, BookOpen, GraduationCap, Wallet, Sparkles } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"

const FREE_FEATURES = [
  { yes: true, t: "3 บทเรียนต่อวัน" }, { yes: true, t: "XP สตรีค & ลีดเดอร์บอร์ด" }, { yes: true, t: "เอกสารระดับเริ่มต้น" },
  { yes: false, t: "เส้นทางอาชีพ" }, { yes: false, t: "หัวใจไม่จำกัด" }, { yes: false, t: "ฟรีซสตรีค" },
]
const PRO_FEATURES = ["บทเรียนไม่จำกัด", "ทุกเส้นทางอาชีพ", "คลังเอกสารครบทุกระดับ", "หัวใจไม่จำกัด", "ฟรีซสตรีค & แบดจ์ Pro", "ไม่มีโฆษณา"]

const CMP: ({ grp: string } | { feat: string; free: string | boolean; pro: string | boolean })[] = [
  { grp: "การเรียน" },
  { feat: "บทเรียนต่อวัน", free: "3 บท", pro: "ไม่จำกัด" },
  { feat: "เส้นทางอาชีพ", free: false, pro: true },
  { feat: "คลังเอกสาร", free: "เริ่มต้น", pro: "ครบทุกระดับ" },
  { feat: "โหมดฝึกฝน", free: false, pro: true },
  { grp: "เกม & หัวใจ" },
  { feat: "หัวใจ", free: "5 ดวง", pro: "ไม่จำกัด" },
  { feat: "ฟรีซสตรีค", free: false, pro: true },
  { feat: "แบดจ์ Pro พิเศษ", free: false, pro: true },
  { grp: "อื่น ๆ" },
  { feat: "ไม่มีโฆษณา", free: false, pro: true },
  { feat: "ใบรับรองเมื่อเรียนจบ", free: false, pro: true },
  { feat: "ซัพพอร์ตเร็วพิเศษ", free: false, pro: true },
]

export default function UpgradeClient({ priceMonth, priceYear }: { priceMonth: number; priceYear: number }) {
  const [bill, setBill] = useState<"month" | "year">("month")
  const [toast, setToast] = useState(false)

  // Yearly is shown as an effective per-month price; savings vs paying monthly.
  const yearlyPerMonth = Math.round(priceYear / 12)
  const savePct = priceMonth > 0 ? Math.round((1 - priceYear / (priceMonth * 12)) * 100) : 0

  const price = bill === "month" ? `฿${priceMonth.toLocaleString()}` : `฿${yearlyPerMonth.toLocaleString()}`
  const sub = bill === "month"
    ? "เรียกเก็บรายเดือน · ยกเลิกได้ทุกเมื่อ"
    : `เรียกเก็บ ฿${priceYear.toLocaleString()}/ปี · ประหยัด ~${savePct}%`

  const FAQ = [
    { ic: CreditCard, q: "จ่ายเงินยังไง ยกเลิกได้ไหม?", a: "รับบัตรเครดิต/เดบิต และพร้อมเพย์ คุณยกเลิกได้ทุกเมื่อจากหน้าตั้งค่า — เมื่อยกเลิกจะใช้ Pro ได้จนจบรอบที่จ่ายไว้ ไม่มีค่าปรับ" },
    { ic: RefreshCw, q: "เปลี่ยนระหว่างรายเดือน/รายปีได้ไหม?", a: `ได้ครับ เปลี่ยนได้ทุกเมื่อ ระบบจะคิดส่วนต่างให้อัตโนมัติ การจ่ายรายปีจะประหยัดกว่าประมาณ ${savePct}%` },
    { ic: BookOpen, q: "ถ้าอัปเกรด ความคืบหน้าเดิมหายไหม?", a: "ไม่หายเลย XP สตรีค แบดจ์ และบทเรียนที่เรียนไปทั้งหมดยังอยู่ครบ — แค่ปลดล็อกเนื้อหาและฟีเจอร์เพิ่มทันที" },
    { ic: GraduationCap, q: "มีส่วนลดสำหรับนักเรียน/นักศึกษาไหม?", a: "มีครับ นักเรียน-นักศึกษารับส่วนลด 50% เพียงยืนยันสถานะด้วยอีเมลสถาบัน ติดต่อทีมงานได้จากหน้าตั้งค่า" },
    { ic: Wallet, q: "มีการรับประกันคืนเงินไหม?", a: "รับประกันคืนเงินภายใน 7 วัน หากไม่พอใจ แจ้งทีมงานได้เลย เราคืนเต็มจำนวนโดยไม่ถามเหตุผล" },
  ]

  function upgrade() {
    setToast(true)
    setTimeout(() => setToast(false), 2600)
  }

  return (
    <>
      <div className="up-hero">
        <Image className="up-mascot" src={`${M}/cockatiel-superhero.png`} alt="Riri Pro" width={120} height={120} />
        <h1>ปลดล็อกศักยภาพเต็มที่ด้วย <span className="grad-text">Pro</span></h1>
        <p>เรียนได้ไม่จำกัด ทุกเส้นทางอาชีพ หัวใจไม่จำกัด และฟีเจอร์พิเศษอีกเพียบ</p>
        <div className="bill-toggle">
          <button className={bill === "month" ? "on" : ""} onClick={() => setBill("month")}>รายเดือน</button>
          <button className={bill === "year" ? "on" : ""} onClick={() => setBill("year")}>รายปี <span className="save-tag">ประหยัด ~{savePct}%</span></button>
        </div>
      </div>

      <div className="plan-grid">
        <div className="plan2 free">
          <div className="pp-name">Free</div>
          <div className="pp-desc">สำหรับเริ่มต้นเรียน AI</div>
          <div className="pp-cost">฿0</div>
          <div className="pp-sub">ฟรีตลอดไป</div>
          <ul className="pp-list">
            {FREE_FEATURES.map((f) => (
              <li key={f.t} className={f.yes ? "" : "off"}>
                <span className={`ck ${f.yes ? "yes" : "no"}`}>{f.yes ? <Check size={13} /> : <X size={13} />}</span> {f.t}
              </li>
            ))}
          </ul>
          <button className="btn btn--ghost lg" style={{ width: "100%" }} disabled>แพ็กเกจปัจจุบัน</button>
        </div>

        <div className="plan2 pro">
          <span className="pp-pop"><Sparkles size={13} /> คุ้มที่สุด</span>
          <div className="pp-name">Pro</div>
          <div className="pp-desc">สำหรับคนที่จริงจังกับ AI</div>
          <div className="pp-cost">{price}<small> /เดือน</small></div>
          <div className="pp-sub">{sub}</div>
          <ul className="pp-list">
            {PRO_FEATURES.map((f) => (
              <li key={f}><span className="ck yes"><Check size={13} /></span> {f}</li>
            ))}
          </ul>
          <button className="btn btn--sun lg" style={{ width: "100%" }} onClick={upgrade}><Crown size={18} /> อัปเกรดเป็น Pro</button>
        </div>
      </div>

      <div className="cmp-wrap">
        <h2 className="cmp-title">เปรียบเทียบแบบละเอียด</h2>
        <table className="cmp">
          <thead><tr><th>ฟีเจอร์</th><th className="col">Free</th><th className="col pro">Pro</th></tr></thead>
          <tbody>
            {CMP.map((r, i) =>
              "grp" in r ? (
                <tr key={i} className="grp"><td colSpan={3}>{r.grp}</td></tr>
              ) : (
                <tr key={i}>
                  <td className="feat">{r.feat}</td>
                  <td className="val">{typeof r.free === "boolean" ? (r.free ? <Check className="yes" size={18} /> : <X className="no" size={16} />) : r.free}</td>
                  <td className="val">{typeof r.pro === "boolean" ? (r.pro ? <Check className="yes" size={18} /> : <X className="no" size={16} />) : r.pro}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div className="faq-wrap">
        <h2 className="cmp-title">คำถามที่พบบ่อย</h2>
        {FAQ.map((f, i) => (
          <details key={i} className="faq-q" open={i === 0}>
            <summary><span className="qic"><f.ic size={15} /></span> {f.q} <span className="qm">+</span></summary>
            <div className="faq-a">{f.a}</div>
          </details>
        ))}
      </div>

      <div className="up-cta">
        <h2>พร้อมเรียน AI แบบไม่มีขีดจำกัดแล้วหรือยัง?</h2>
        <p>เริ่มทดลอง Pro วันนี้ — ยกเลิกได้ทุกเมื่อ</p>
        <button className="btn btn--violet lg" onClick={upgrade}><Crown size={18} /> อัปเกรดเป็น Pro</button>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "var(--text-strong)", color: "#fff", padding: "13px 22px", borderRadius: 999, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14.5, boxShadow: "0 16px 34px -10px rgba(0,0,0,.4)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Crown size={16} className="text-amber-300" /> ยินดีต้อนรับสู่ Pro! (เดโม)
        </div>
      )}
    </>
  )
}
