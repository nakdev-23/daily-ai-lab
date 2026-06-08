import { getLang } from "@/lib/i18n"
import PathsGrid from "./_paths-grid"

export default async function PathsPage() {
  const lang = await getLang()
  return <PathsGrid lang={lang} />
}
