import { requireAdmin } from "@/lib/auth"
import { getUsers } from "@/lib/users"
import UsersTable from "./_users-table"

export default async function AdminUsersPage() {
  const admin = await requireAdmin()
  const users = await getUsers()
  const adminCount = users.filter((u) => u.role === "admin").length

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1>ผู้ใช้</h1>
          <div className="sub">ทั้งหมด {users.length.toLocaleString()} คน · ผู้ดูแล {adminCount} คน</div>
        </div>
      </div>
      <UsersTable users={users} adminId={admin?.id ?? ""} />
    </>
  )
}
