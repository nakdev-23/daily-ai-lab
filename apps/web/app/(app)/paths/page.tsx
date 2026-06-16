import { getLang } from "@/lib/i18n"
import { getProfile, isPro } from "@/lib/auth"
import { getCareerPaths } from "@/lib/career-paths"
import PathsGrid from "./_paths-grid"

export default async function PathsPage() {
  const lang = await getLang()
  const [paths, profile] = await Promise.all([getCareerPaths(lang), getProfile()])
  return <PathsGrid lang={lang} paths={paths} isPro={isPro(profile)} />
}
