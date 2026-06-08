import "../home.css"
import LegalPage from "@/components/legal-page"
import { getLang } from "@/lib/i18n"

export const metadata = { title: "เงื่อนไขการใช้บริการ · Daily AI Lab" }

export default async function TermsPage() {
  const lang = await getLang()
  return <LegalPage kind="terms" lang={lang} />
}
