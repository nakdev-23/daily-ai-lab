import { requireAdmin } from "@/lib/auth"
import { getAllDocs, getDocSource, type DocMeta } from "@/lib/docs"
import DocsAdmin, { type DocRow } from "./_docs-admin"

export default async function AdminDocsPage() {
  await requireAdmin()
  const metas: DocMeta[] = await getAllDocs()
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
      <DocsAdmin rows={rows} />
    </>
  )
}
