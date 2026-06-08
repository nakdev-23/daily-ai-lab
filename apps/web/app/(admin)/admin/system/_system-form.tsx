"use client"

import { useState } from "react"
import { Target, Gem, Bell, Check } from "lucide-react"
import Switch from "@/components/switch"

export default function SystemForm() {
  const [saved, setSaved] = useState(false)

  function save(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  return (
    <form className="formpage" onSubmit={save}>
      <div className="form-sec glass">
        <h3><Target size={19} className="text-violet-500" /> เกมมิฟิเคชัน</h3>
        <p className="sec-sub">ค่าเริ่มต้นของระบบเกม</p>
        <div className="fld-row">
          <div className="fld"><label>เป้าหมายรายวัน (นาที)</label><input className="fin" type="number" defaultValue={15} /></div>
          <div className="fld"><label>หัวใจต่อรอบ</label><input className="fin" type="number" defaultValue={5} /></div>
        </div>
        <div className="fld-row">
          <div className="fld"><label>XP ต่อบทเรียน</label><input className="fin" type="number" defaultValue={10} /></div>
          <div className="fld"><label>XP ควิซเพอร์เฟกต์</label><input className="fin" type="number" defaultValue={15} /></div>
        </div>
      </div>

      <div className="form-sec glass">
        <h3><Gem size={19} className="text-sky-500" /> แพ็กเกจ & ราคา</h3>
        <p className="sec-sub">ราคาแพ็กเกจ Pro</p>
        <div className="fld-row">
          <div className="fld"><label>ราคา/เดือน (฿)</label><input className="fin" type="number" defaultValue={199} /></div>
          <div className="fld"><label>ราคา/ปี (฿)</label><input className="fin" type="number" defaultValue={1990} /></div>
        </div>
      </div>

      <div className="form-sec glass">
        <h3><Bell size={19} className="text-amber-500" /> การแจ้งเตือน</h3>
        <p className="sec-sub">เปิด/ปิดการแจ้งเตือนระบบ</p>
        <div className="srow"><div className="si-info"><b>เตือนสตรีคทุกเย็น</b><span>ส่งเตือนผู้ใช้ที่ยังไม่เรียนวันนี้</span></div><Switch defaultChecked /></div>
        <div className="srow"><div className="si-info"><b>อีเมลสรุปรายสัปดาห์</b><span>ส่งสรุปความคืบหน้าทุกวันจันทร์</span></div><Switch defaultChecked /></div>
        <div className="srow"><div className="si-info"><b>โหมดปิดปรับปรุง</b><span>ปิดเว็บชั่วคราวเพื่อบำรุงรักษา</span></div><Switch /></div>
      </div>

      <div className="form-sticky">
        {saved && <span className="adm-msg ok" style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 6 }}><Check size={15} /> บันทึกการตั้งค่าแล้ว</span>}
        <span className="spacer" />
        <button type="submit" className="btn btn--violet md">บันทึกการตั้งค่า</button>
      </div>
    </form>
  )
}
