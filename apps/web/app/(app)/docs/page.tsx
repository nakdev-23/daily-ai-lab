import { getToolGroups } from "@/lib/docs"
import { getLang } from "@/lib/i18n"
import DocsGrid from "./_docs-grid"

export default async function DocsHubPage() {
  const lang = await getLang()
  const tools = await getToolGroups(lang)
  return <DocsGrid tools={tools} lang={lang} />
}
