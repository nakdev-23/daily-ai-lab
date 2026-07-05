import { requireAdmin } from "@/lib/auth"
import { recordAudit } from "@/lib/audit"
import { getAllTickets } from "@/lib/support"
import SupportAdmin from "./_support-admin"

export default async function AdminSupportPage() {
  await requireAdmin()
  await recordAudit("admin.view_support")
  const tickets = await getAllTickets()
  return <SupportAdmin tickets={tickets} />
}
