import "../home.css"
import LegalPage from "@/components/legal-page"
import { getLang } from "@/lib/i18n"

export const metadata = { title: "นโยบายความเป็นส่วนตัว · Daily AI Lab" }

export default async function PrivacyPage() {
  const lang = await getLang()
  return <LegalPage kind="privacy" lang={lang} />
}
