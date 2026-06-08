import { notFound } from "next/navigation"
import { getDocsForTool, getToolGroups } from "@/lib/docs"
import { getLang } from "@/lib/i18n"
import DocsReader from "./_reader"

export async function generateStaticParams() {
  const tools = await getToolGroups()
  return tools.map((g) => ({ tool: g.toolSlug }))
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  const { tool: name } = await getDocsForTool(tool)
  return { title: `${name} · Daily AI Lab` }
}

export default async function ToolDocsPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  const [{ tool: name, sections }, lang] = await Promise.all([getDocsForTool(tool), getLang()])
  if (sections.length === 0) {
    // still render the empty-state reader if it's a known tool slug, else 404
    const groups = await getToolGroups()
    if (!groups.some((g) => g.toolSlug === tool)) notFound()
  }
  return <DocsReader tool={name} sections={sections} lang={lang} />
}
