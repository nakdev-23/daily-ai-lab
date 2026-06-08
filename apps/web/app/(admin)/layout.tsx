import { requireAdmin } from "@/lib/auth"
import AdminShell from "./_admin-shell"
import "../(app)/app-ds.css"
import "./admin.css"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  const name = (admin as { displayName?: string }).displayName ?? "Admin"
  return <AdminShell initial={name.charAt(0).toUpperCase()}>{children}</AdminShell>
}
