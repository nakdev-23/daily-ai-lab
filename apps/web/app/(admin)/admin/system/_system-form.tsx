"use client"

import { useActionState } from "react"
import { Target, Gem, Bell, Check } from "lucide-react"
import Switch from "@/components/switch"
import type { SystemSettings } from "@/lib/system-settings"
import { saveSystemAction, type SystemResult } from "./actions"

export default function SystemForm({ settings }: { settings: SystemSettings }) {
  const [state, formAction, pending] = useActionState<SystemResult, FormData>(saveSystemAction, null)

  return (
    <form className="formpage" action={formAction}>
      <div className="form-sec glass">
        <h3><Target size={19} className="text-violet-500" /> เกมมิฟิเคชัน</h3>
        <p className="sec-sub">ค่าเริ่มต้นของระบบเกม</p>
        <div className="fld-row">
          <div className="fld"><label>เป้าหมายรายวัน (นาที)</label><input className="fin" name="daily_goal_minutes" type="number" min={1} defaultValue={settings.dailyGoalMinutes} /></div>
          <div className="fld"><label>หัวใจต่อรอบ</label><input className="fin" name="hearts_per_round" type="number" min={1} defaultValue={settings.heartsPerRound} /></div>
        </div>
        <div className="fld-row">
          <div className="fld"><label>XP ต่อบทเรียน</label><input className="fin" name="xp_per_lesson" type="number" min={0} defaultValue={settings.xpPerLesson} /></div>
          <div className="fld"><label>XP ควิซเพอร์เฟกต์</label><input className="fin" name="xp_perfect_quiz" type="number" min={0} defaultValue={settings.xpPerfectQuiz} /></div>
        </div>
        <div className="fld-row">
          <div className="fld">
            <label>เวลารีเซ็ตหัวใจ (ชั่วโมง เวลาไทย)</label>
            <input className="fin" name="hearts_reset_hour" type="number" min={0} max={23} defaultValue={settings.heartsResetHour} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>0 = เที่ยงคืน · หัวใจจะเต็มใหม่ทุกวันเวลานี้ (Asia/Bangkok)</span>
          </div>
          <div className="fld" />
        </div>
      </div>

      <div className="form-sec glass">
        <h3><Gem size={19} className="text-sky-500" /> แพ็กเกจ & ราคา</h3>
        <p className="sec-sub">ราคาแพ็กเกจ Pro และขีดจำกัดของแพ็กเกจ Free</p>
        <div className="fld-row">
          <div className="fld"><label>ราคา/เดือน (฿)</label><input className="fin" name="pro_price_month" type="number" min={0} defaultValue={settings.proPriceMonth} /></div>
          <div className="fld"><label>ราคา/ปี (฿)</label><input className="fin" name="pro_price_year" type="number" min={0} defaultValue={settings.proPriceYear} /></div>
        </div>
        <div className="fld-row">
          <div className="fld">
            <label>บทเรียนย่อย/วัน (แพ็กเกจ Free)</label>
            <input className="fin" name="free_lessons_per_day" type="number" min={0} max={99} defaultValue={settings.freeLessonsPerDay} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>ผู้ใช้ Free เรียนบทใหม่ได้วันละเท่านี้ · Pro ไม่จำกัด · ทบทวนบทที่จบแล้วไม่นับ</span>
          </div>
          <div className="fld" />
        </div>
      </div>

      <div className="form-sec glass">
        <h3><Bell size={19} className="text-amber-500" /> การแจ้งเตือน</h3>
        <p className="sec-sub">เปิด/ปิดการแจ้งเตือนระบบ</p>
        <div className="srow"><div className="si-info"><b>เตือนสตรีคทุกเย็น</b><span>ส่งเตือนผู้ใช้ที่ยังไม่เรียนวันนี้</span></div><Switch name="notify_streak" defaultChecked={settings.notifyStreak} /></div>
        <div className="srow"><div className="si-info"><b>อีเมลสรุปรายสัปดาห์</b><span>ส่งสรุปความคืบหน้าทุกวันจันทร์</span></div><Switch name="notify_weekly" defaultChecked={settings.notifyWeekly} /></div>
        <div className="srow"><div className="si-info"><b>โหมดปิดปรับปรุง</b><span>ปิดเว็บชั่วคราวเพื่อบำรุงรักษา</span></div><Switch name="maintenance_mode" defaultChecked={settings.maintenanceMode} /></div>
      </div>

      <div className="form-sticky">
        {state?.ok && <span className="adm-msg ok" style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 6 }}><Check size={15} /> {state.message}</span>}
        {state && !state.ok && <span className="adm-msg err" style={{ margin: 0 }}>{state.message}</span>}
        <span className="spacer" />
        <button type="submit" className="btn btn--violet md" disabled={pending}>{pending ? "กำลังบันทึก…" : "บันทึกการตั้งค่า"}</button>
      </div>
    </form>
  )
}
