import { getLang } from "@/lib/i18n"
import { getCareerPaths } from "@/lib/career-paths"
import PathsGrid from "./_paths-grid"

export default async function PathsPage() {
  const [lang, paths] = await Promise.all([getLang(), getCareerPaths()])
  return <PathsGrid lang={lang} paths={paths} />
}
