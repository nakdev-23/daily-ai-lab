import { requireAdmin } from "@/lib/auth"
import { getAllDocs, getToolConfig, getDocSource } from "@/lib/docs"
import DocsAdmin, { type DocRow } from "./_docs-admin"
import ToolsAdmin from "./_tools-admin"

export default async function AdminDocsPage() {
  await requireAdmin()

  const [metas, visibility] = await Promise.all([getAllDocs(), getToolConfig()])

  const counts: Record<string, number> = {}
  for (const m of metas) counts[m.tool] = (counts[m.tool] ?? 0) + 1

  const rows: DocRow[] = await Promise.all(
    metas.map(async (m) => {
      const src = await getDocSource(m.slug)
      return { meta: m, body: src?.body ?? "" }
    }),
  )

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1>เอกสาร</h1>
          <div className="sub">เอกสารเครื่องมือ AI แปลไทย แบ่งตามระดับ · ทั้งหมด {rows.length} ชุด</div>
        </div>
      </div>

      <ToolsAdmin visibility={visibility} counts={counts} />
      <DocsAdmin rows={rows} />
    </>
  )
}
