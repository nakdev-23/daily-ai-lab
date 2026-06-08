import { getLang } from "@/lib/i18n"
import LessonPlayer from "../../../learn/[tool]/[level]/[slug]/_player"

export default async function LessonPage() {
  const lang = await getLang()
  return <LessonPlayer lang={lang} />
}
