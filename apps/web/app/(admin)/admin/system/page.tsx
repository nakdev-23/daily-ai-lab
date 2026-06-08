import { requireAdmin } from "@/lib/auth"
import SystemForm from "./_system-form"

export default async function AdminSystemPage() {
  await requireAdmin()
  return (
    <>
      <div className="adm-bar"><div><h1>ตั้งค่าระบบ</h1><div className="sub">การตั้งค่าทั่วไปของแพลตฟอร์ม</div></div></div>
      <SystemForm />
    </>
  )
}
