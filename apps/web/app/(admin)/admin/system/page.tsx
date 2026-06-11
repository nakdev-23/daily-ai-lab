import { requireAdmin } from "@/lib/auth"
import { getSystemSettings } from "@/lib/system-settings"
import SystemForm from "./_system-form"

export default async function AdminSystemPage() {
  await requireAdmin()
  const settings = await getSystemSettings()
  return (
    <>
      <div className="adm-bar"><div><h1>ตั้งค่าระบบ</h1><div className="sub">การตั้งค่าทั่วไปของแพลตฟอร์ม</div></div></div>
      <SystemForm settings={settings} />
    </>
  )
}
