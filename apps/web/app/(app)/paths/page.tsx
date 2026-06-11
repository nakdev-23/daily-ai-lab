import { getLang } from "@/lib/i18n"
import { getProfile, isPro } from "@/lib/auth"
import { getCareerPaths } from "@/lib/career-paths"
import PathsGrid from "./_paths-grid"

export default async function PathsPage() {
  const [lang, paths, profile] = await Promise.all([getLang(), getCareerPaths(), getProfile()])
  return <PathsGrid lang={lang} paths={paths} isPro={isPro(profile)} />
}
