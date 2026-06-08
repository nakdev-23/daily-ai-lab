import { getToolGroups } from "@/lib/docs"
import { getLang } from "@/lib/i18n"
import DocsGrid from "./_docs-grid"

export default async function DocsHubPage() {
  const [tools, lang] = await Promise.all([getToolGroups(), getLang()])
  return <DocsGrid tools={tools} lang={lang} />
}
