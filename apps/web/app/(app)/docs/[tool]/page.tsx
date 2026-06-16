import { notFound } from "next/navigation"
import { getDocsForTool, getToolGroups } from "@/lib/docs"
import { getLang } from "@/lib/i18n"
import { getProfile, isPro } from "@/lib/auth"
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
  const lang = await getLang()
  const [{ tool: name, sections }, profile] = await Promise.all([getDocsForTool(tool, lang), getProfile()])
  if (sections.length === 0) {
    // still render the empty-state reader if it's a known tool slug, else 404
    const groups = await getToolGroups()
    if (!groups.some((g) => g.toolSlug === tool)) notFound()
  }
  // Paywall: never ship locked HTML to non-Pro clients. Strip it server-side so
  // it can't be recovered from the page payload; the reader shows an upgrade card.
  const pro = isPro(profile)
  const safeSections = sections.map((s) =>
    s.meta.locked && !pro ? { ...s, html: "" } : s
  )
  return <DocsReader tool={name} sections={safeSections} lang={lang} isPro={pro} />
}
